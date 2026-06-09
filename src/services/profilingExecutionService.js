/**
 * Connector-agnostic profiling execution framework.
 * Produces aggregate statistics only; raw values are never retained.
 */

import { randomUUID } from 'crypto';
import { exportProfile } from './qualityRulesService.js';

const DEFAULT_SAFETY = Object.freeze({
  dialect: 'sql_server',
  profile_mode: 'metadata_only',
  execution_mode: 'dry_run',
  max_tables: 25,
  max_columns_per_table: 80,
  max_estimated_rows: 5_000_000,
  sample_percent: 1,
  query_timeout_ms: 30_000,
  lock_timeout_ms: 5_000,
  allow_full_scan: false,
  include_distinct: true,
  include_min_max: true,
  include_mean: true,
  include_text_min_max: false,
  raw_values_retained: false,
  isolation_level: 'READ UNCOMMITTED',
});

const DIALECT_ALIASES = Object.freeze({
  sqlserver: 'sql_server',
  mssql: 'sql_server',
  sql_server: 'sql_server',
  azure_sql: 'sql_server',
  synapse: 'sql_server',
  postgresql: 'postgresql',
  postgres: 'postgresql',
  snowflake: 'snowflake',
  bigquery: 'bigquery',
  databricks: 'databricks',
  spark: 'databricks',
  spark_sql: 'databricks',
  aws_redshift: 'redshift',
  redshift: 'redshift',
});

const CONNECTOR_DIALECTS = Object.freeze({
  sql_server: 'sql_server',
  postgresql: 'postgresql',
  snowflake: 'snowflake',
  bigquery: 'bigquery',
  databricks: 'databricks',
  aws_redshift: 'redshift',
});

const PROFILE_MODES = new Set(['metadata_only', 'sample', 'full_scan']);
const EXECUTION_MODES = new Set(['dry_run', 'simulate', 'live']);
const NUMERIC_TYPE = /\b(bigint|int|smallint|tinyint|decimal|numeric|money|smallmoney|float|real|double|number)\b/i;
const DATE_TYPE = /\b(date|datetime|datetime2|smalldatetime|time|timestamp)\b/i;
const TEXT_TYPE = /\b(char|nchar|varchar|nvarchar|text|ntext|string|xml|json|uniqueidentifier|uuid)\b/i;
const LEGACY_SQL_SERVER_TEXT_TYPE = /\b(text|ntext)\b/i;
const SENSITIVE_NAME = /ssn|social|tax.?id|email|phone|address|dob|birth|name|vin|license|account|routing|card|token|secret|password/i;
const ADAPTIVE_PROFILE_RULES = Object.freeze({
  large_rows: 5_000_000,
  huge_rows: 20_000_000,
  wide_columns: 50,
  very_wide_columns: 90,
  chunk_columns_default: 40,
  chunk_columns_large: 24,
  chunk_columns_huge: 16,
  sample_percent_large: 1,
  sample_percent_huge: 0.25,
  query_timeout_large_ms: 60_000,
  query_timeout_huge_ms: 90_000,
});

function nowIso() {
  return new Date().toISOString();
}

function toArray(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (value === undefined || value === null || value === '') return [];
  return [value];
}

function asNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function clampNumber(value, min, max, fallback) {
  const number = asNumber(value, fallback);
  return Math.min(max, Math.max(min, number));
}

function normalizeBoolean(value, fallback = false) {
  if (value === undefined || value === null || value === '') return fallback;
  if (typeof value === 'boolean') return value;
  return ['true', '1', 'yes', 'y'].includes(String(value).toLowerCase());
}

function normalizeDialect(input = {}) {
  const requested =
    input.dialect ||
    input.source_dialect ||
    input.sourceDialect ||
    CONNECTOR_DIALECTS[input.connector_type || input.connectorType] ||
    DEFAULT_SAFETY.dialect;
  return DIALECT_ALIASES[String(requested || '').trim().toLowerCase()] || DEFAULT_SAFETY.dialect;
}

export function normalizeProfileSafety(input = {}) {
  const profileMode = PROFILE_MODES.has(input.profile_mode || input.profileMode)
    ? input.profile_mode || input.profileMode
    : DEFAULT_SAFETY.profile_mode;
  const executionMode = EXECUTION_MODES.has(input.execution_mode || input.executionMode)
    ? input.execution_mode || input.executionMode
    : DEFAULT_SAFETY.execution_mode;
  return {
    ...DEFAULT_SAFETY,
    dialect: normalizeDialect(input),
    profile_mode: profileMode,
    execution_mode: executionMode,
    max_tables: clampNumber(input.max_tables ?? input.maxTables, 1, 500, DEFAULT_SAFETY.max_tables),
    max_columns_per_table: clampNumber(
      input.max_columns_per_table ?? input.maxColumnsPerTable,
      1,
      500,
      DEFAULT_SAFETY.max_columns_per_table
    ),
    max_estimated_rows: clampNumber(
      input.max_estimated_rows ?? input.maxEstimatedRows,
      1_000,
      1_000_000_000,
      DEFAULT_SAFETY.max_estimated_rows
    ),
    sample_percent: clampNumber(input.sample_percent ?? input.samplePercent, 0.1, 25, DEFAULT_SAFETY.sample_percent),
    query_timeout_ms: clampNumber(
      input.query_timeout_ms ?? input.queryTimeoutMs,
      1_000,
      600_000,
      DEFAULT_SAFETY.query_timeout_ms
    ),
    lock_timeout_ms: clampNumber(
      input.lock_timeout_ms ?? input.lockTimeoutMs,
      100,
      60_000,
      DEFAULT_SAFETY.lock_timeout_ms
    ),
    allow_full_scan: normalizeBoolean(input.allow_full_scan ?? input.allowFullScan, false),
    include_distinct: normalizeBoolean(input.include_distinct ?? input.includeDistinct, true),
    include_min_max: normalizeBoolean(input.include_min_max ?? input.includeMinMax, true),
    include_mean: normalizeBoolean(input.include_mean ?? input.includeMean, true),
    include_text_min_max: normalizeBoolean(input.include_text_min_max ?? input.includeTextMinMax, false),
    raw_values_retained: false,
    isolation_level: DEFAULT_SAFETY.isolation_level,
  };
}

function objectName(asset = {}) {
  return asset.full_name || asset.qualified_name || asset.qualifiedName || asset.name || asset.id || 'unknown';
}

function objectType(asset = {}) {
  return String(asset.object_type || asset.objectType || asset.type || '').toLowerCase();
}

function objectDatabase(asset = {}) {
  return asset.database || asset.database_name || asset.catalog || asset.catalog_name || '';
}

function objectSchema(asset = {}) {
  return asset.schema || asset.schema_name || asset.owner_schema || 'dbo';
}

function estimateRows(asset = {}) {
  return asNumber(
    asset.row_count ??
      asset.rowCount ??
      asset.rows ??
      asset.estimated_rows ??
      asset.estimatedRows ??
      asset.profile?.row_count,
    0
  );
}

function normalizeColumn(column = {}) {
  const name = column.name || column.column_name || column.columnName;
  return {
    ...column,
    name,
    column_name: name,
    data_type: column.data_type || column.dataType || column.type || 'unknown',
  };
}

function normalizeAssets(input = {}, objectCache = new Map()) {
  const directAssets = toArray(input.assets || input.objects || input.tables).filter(
    (item) => item && typeof item === 'object'
  );
  if (directAssets.length) return directAssets;

  const ids = toArray(input.asset_id || input.assetId || input.object_id || input.objectId || input.ids);
  return ids
    .map((id) => objectCache.get(id) || Array.from(objectCache.values()).find((asset) => asset.id === id || objectName(asset) === id))
    .filter(Boolean);
}

function isProfileableObject(asset = {}) {
  return ['table', 'view'].includes(objectType(asset));
}

function isSensitiveColumn(column = {}) {
  const values = [
    column.name,
    column.column_name,
    column.semantic_type,
    column.sensitivity,
    column.classification,
    ...(Array.isArray(column.classifications) ? column.classifications : []),
    ...(Array.isArray(column.tags) ? column.tags : []),
  ]
    .filter(Boolean)
    .join(' ');
  return SENSITIVE_NAME.test(values) || /\bpii\b|\bphi\b|restricted|confidential/i.test(values);
}

function columnKind(column = {}) {
  const type = String(column.data_type || column.type || '');
  if (NUMERIC_TYPE.test(type)) return 'numeric';
  if (DATE_TYPE.test(type)) return 'date';
  if (TEXT_TYPE.test(type)) return 'text';
  return 'other';
}

function sqlAlias(value) {
  return String(value || 'col')
    .replace(/[^a-z0-9_]+/gi, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 90)
    .toLowerCase();
}

function tableName(asset = {}) {
  return asset.table || asset.table_name || asset.name || String(asset.id || '').split('.').pop();
}

function quoteDouble(value) {
  return `"${String(value || '').replace(/"/g, '""')}"`;
}

function quoteBacktick(value) {
  return `\`${String(value || '').replace(/`/g, '\\`')}\``;
}

function quoteBracket(value) {
  return `[${String(value || '').replace(/]/g, ']]')}]`;
}

function qualifiedName(asset, quoteIdentifier, options = {}) {
  const database = objectDatabase(asset);
  const schema = objectSchema(asset);
  const table = tableName(asset);
  const parts = options.includeDatabase === false ? [schema, table] : [database, schema, table];
  return parts.filter(Boolean).map(quoteIdentifier).join('.');
}

function bigQueryObjectName(asset = {}) {
  return quoteBacktick([objectDatabase(asset), objectSchema(asset), tableName(asset)].filter(Boolean).join('.'));
}

function selectExpressions(columns, dialect) {
  const parts = [dialect.rowCountExpression()];
  for (const column of columns) {
    const colSql = dialect.quoteIdentifier(column.name);
    const alias = sqlAlias(column.name);
    if (column.actions.includes('null_count')) {
      parts.push(`SUM(CASE WHEN ${colSql} IS NULL THEN 1 ELSE 0 END) AS ${dialect.quoteIdentifier(`${alias}__null_count`)}`);
    }
    if (column.actions.includes('distinct_count')) {
      parts.push(`${dialect.distinctExpression(colSql)} AS ${dialect.quoteIdentifier(`${alias}__distinct_count`)}`);
    }
    if (column.actions.includes('min')) parts.push(`MIN(${colSql}) AS ${dialect.quoteIdentifier(`${alias}__min`)}`);
    if (column.actions.includes('max')) parts.push(`MAX(${colSql}) AS ${dialect.quoteIdentifier(`${alias}__max`)}`);
    if (column.actions.includes('mean')) parts.push(`${dialect.meanExpression(colSql)} AS ${dialect.quoteIdentifier(`${alias}__mean`)}`);
  }
  return parts;
}

function defaultFromClause(asset, dialect, safety) {
  const objectSql = dialect.objectName(asset);
  if (safety.profile_mode === 'sample' && dialect.sampleClause) {
    return `FROM ${objectSql}${dialect.sampleClause(safety)}`;
  }
  return `FROM ${objectSql}${dialect.tableHint?.(safety) || ''}`;
}

function buildGenericProfileQuery(asset, columns, safety, dialect) {
  const preamble = dialect.preamble?.(safety).filter(Boolean) || [];
  const selectParts = selectExpressions(columns, dialect);
  const sql = `SELECT ${selectParts.join(',\n       ')}\n${dialect.fromClause(asset, dialect, safety)};`;
  return [...preamble, sql].join('\n');
}

const DIALECT_BUILDERS = Object.freeze({
  sql_server: {
    label: 'SQL Server',
    quoteIdentifier: quoteBracket,
    objectName: (asset) => qualifiedName(asset, quoteBracket),
    rowCountExpression: () => 'COUNT_BIG(*) AS [row_count]',
    distinctExpression: (columnSql) => `COUNT(DISTINCT ${columnSql})`,
    meanExpression: (columnSql) => `AVG(CAST(${columnSql} AS float))`,
    tableHint: (safety) => (['metadata_only', 'sample'].includes(safety.profile_mode) ? '' : ' WITH (READUNCOMMITTED)'),
    sampleClause: (safety) => ` TABLESAMPLE (${safety.sample_percent} PERCENT)`,
    fromClause: defaultFromClause,
    preamble: (safety) => [
      `SET LOCK_TIMEOUT ${safety.lock_timeout_ms};`,
      `SET TRANSACTION ISOLATION LEVEL ${safety.isolation_level};`,
    ],
    safety_notes: ['Uses LOCK_TIMEOUT and READ UNCOMMITTED hints for lower blocking risk.'],
  },
  postgresql: {
    label: 'PostgreSQL',
    quoteIdentifier: quoteDouble,
    objectName: (asset) => qualifiedName(asset, quoteDouble, { includeDatabase: false }),
    rowCountExpression: () => 'COUNT(*) AS "row_count"',
    distinctExpression: (columnSql) => `COUNT(DISTINCT ${columnSql})`,
    meanExpression: (columnSql) => `AVG(CAST(${columnSql} AS double precision))`,
    sampleClause: (safety) => ` TABLESAMPLE SYSTEM (${safety.sample_percent})`,
    fromClause: defaultFromClause,
    preamble: (safety) => [
      `SET statement_timeout = ${safety.query_timeout_ms};`,
      `SET lock_timeout = ${safety.lock_timeout_ms};`,
      'SET TRANSACTION READ ONLY;',
    ],
    safety_notes: ['Uses statement_timeout, lock_timeout, and read-only transaction intent.'],
  },
  snowflake: {
    label: 'Snowflake',
    quoteIdentifier: quoteDouble,
    objectName: (asset) => qualifiedName(asset, quoteDouble),
    rowCountExpression: () => 'COUNT(*) AS "row_count"',
    distinctExpression: (columnSql) => `APPROX_COUNT_DISTINCT(${columnSql})`,
    meanExpression: (columnSql) => `AVG(TRY_TO_DOUBLE(${columnSql}))`,
    sampleClause: (safety) => ` SAMPLE (${safety.sample_percent})`,
    fromClause: defaultFromClause,
    preamble: (safety) => [`ALTER SESSION SET STATEMENT_TIMEOUT_IN_SECONDS = ${Math.ceil(safety.query_timeout_ms / 1000)};`],
    safety_notes: ['Uses statement timeout and approximate distinct counts to reduce warehouse work.'],
  },
  bigquery: {
    label: 'BigQuery',
    quoteIdentifier: quoteBacktick,
    objectName: bigQueryObjectName,
    rowCountExpression: () => 'COUNT(*) AS `row_count`',
    distinctExpression: (columnSql) => `APPROX_COUNT_DISTINCT(${columnSql})`,
    meanExpression: (columnSql) => `AVG(SAFE_CAST(${columnSql} AS FLOAT64))`,
    sampleClause: (safety) => ` TABLESAMPLE SYSTEM (${safety.sample_percent} PERCENT)`,
    fromClause: defaultFromClause,
    preamble: () => [],
    safety_notes: ['Uses approximate distinct counts; enforce timeout and bytes limits in the BigQuery job config.'],
  },
  databricks: {
    label: 'Databricks / Spark SQL',
    quoteIdentifier: quoteBacktick,
    objectName: (asset) => qualifiedName(asset, quoteBacktick),
    rowCountExpression: () => 'COUNT(*) AS `row_count`',
    distinctExpression: (columnSql) => `approx_count_distinct(${columnSql})`,
    meanExpression: (columnSql) => `AVG(CAST(${columnSql} AS DOUBLE))`,
    sampleClause: (safety) => ` TABLESAMPLE (${safety.sample_percent} PERCENT)`,
    fromClause: defaultFromClause,
    preamble: () => [],
    safety_notes: ['Uses approximate distinct counts; enforce timeout and cluster policy in the Databricks SQL warehouse.'],
  },
  redshift: {
    label: 'Amazon Redshift',
    quoteIdentifier: quoteDouble,
    objectName: (asset) => qualifiedName(asset, quoteDouble, { includeDatabase: false }),
    rowCountExpression: () => 'COUNT(*) AS "row_count"',
    distinctExpression: (columnSql) => `APPROXIMATE COUNT(DISTINCT ${columnSql})`,
    meanExpression: (columnSql) => `AVG(CAST(${columnSql} AS DOUBLE PRECISION))`,
    sampleClause: null,
    fromClause: defaultFromClause,
    preamble: (safety) => [`SET statement_timeout TO ${safety.query_timeout_ms};`],
    safety_notes: ['Uses statement timeout and approximate distinct counts when supported; sampling should be enforced by workload management or connector SQL wrapper.'],
  },
});

function dialectBuilder(name) {
  return DIALECT_BUILDERS[normalizeDialect({ dialect: name })] || DIALECT_BUILDERS.sql_server;
}

function buildColumnActions(column, safety) {
  const sensitive = isSensitiveColumn(column);
  const kind = columnKind(column);
  const sqlServerLegacyText =
    safety.dialect === 'sql_server' && LEGACY_SQL_SERVER_TEXT_TYPE.test(String(column.data_type || column.type || ''));
  const actions = ['null_count'];
  if (safety.include_distinct && !sensitive && !sqlServerLegacyText) actions.push('distinct_count');
  if (safety.include_min_max && !sensitive && (kind === 'numeric' || kind === 'date' || safety.include_text_min_max)) {
    actions.push('min', 'max');
  }
  if (safety.include_mean && !sensitive && kind === 'numeric') actions.push('mean');
  const skippedStatistics = [];
  if (sensitive) {
    skippedStatistics.push(...['distinct_count', 'min', 'max', 'mean'].filter((stat) => !actions.includes(stat)));
  }
  if (sqlServerLegacyText) skippedStatistics.push('distinct_count');
  return {
    name: column.name,
    data_type: column.data_type,
    kind,
    sensitive,
    sql_server_legacy_text: sqlServerLegacyText,
    actions,
    skipped_statistics: [...new Set(skippedStatistics)],
  };
}

function chunkArray(values = [], chunkSize = values.length || 1) {
  const size = Math.max(1, Number(chunkSize) || values.length || 1);
  const chunks = [];
  for (let index = 0; index < values.length; index += size) {
    chunks.push(values.slice(index, index + size));
  }
  return chunks;
}

function assetStrategy(asset = {}, columns = [], safety = {}, dialect = null) {
  const estimatedRows = estimateRows(asset);
  const columnCount = columns.length;
  const nextSafety = { ...safety };
  const warnings = [];
  let strategy = 'standard';
  let chunkColumns = Math.min(nextSafety.max_columns_per_table, ADAPTIVE_PROFILE_RULES.chunk_columns_default);

  if (estimatedRows >= ADAPTIVE_PROFILE_RULES.large_rows || columnCount >= ADAPTIVE_PROFILE_RULES.wide_columns) {
    strategy = 'large_table_sampling';
    nextSafety.profile_mode = dialect?.sampleClause ? 'sample' : 'metadata_only';
    nextSafety.query_timeout_ms = Math.max(nextSafety.query_timeout_ms, ADAPTIVE_PROFILE_RULES.query_timeout_large_ms);
    nextSafety.lock_timeout_ms = Math.max(nextSafety.lock_timeout_ms, 10_000);
    nextSafety.include_mean = false;
    nextSafety.include_text_min_max = false;
    chunkColumns = Math.min(chunkColumns, ADAPTIVE_PROFILE_RULES.chunk_columns_large);
    warnings.push(
      `Adaptive profiling downgraded ${objectName(asset)} to ${nextSafety.profile_mode} mode because it is large (${estimatedRows || 0} rows, ${columnCount} columns).`
    );
  }

  if (estimatedRows >= ADAPTIVE_PROFILE_RULES.huge_rows || columnCount >= ADAPTIVE_PROFILE_RULES.very_wide_columns) {
    strategy = 'huge_table_sampling';
    nextSafety.profile_mode = dialect?.sampleClause ? 'sample' : 'metadata_only';
    nextSafety.query_timeout_ms = Math.max(nextSafety.query_timeout_ms, ADAPTIVE_PROFILE_RULES.query_timeout_huge_ms);
    nextSafety.sample_percent = Math.min(nextSafety.sample_percent, ADAPTIVE_PROFILE_RULES.sample_percent_huge);
    nextSafety.include_distinct = false;
    nextSafety.include_min_max = false;
    nextSafety.include_mean = false;
    chunkColumns = Math.min(chunkColumns, ADAPTIVE_PROFILE_RULES.chunk_columns_huge);
    warnings.push(
      `Adaptive profiling reduced statistics for ${objectName(asset)} because it is very large (${estimatedRows || 0} rows, ${columnCount} columns).`
    );
  } else if (strategy === 'large_table_sampling') {
    nextSafety.sample_percent = Math.min(nextSafety.sample_percent, ADAPTIVE_PROFILE_RULES.sample_percent_large);
    if (estimatedRows >= ADAPTIVE_PROFILE_RULES.large_rows) {
      nextSafety.include_distinct = false;
      warnings.push(`Distinct counts were disabled for ${objectName(asset)} to reduce timeout risk on a large object.`);
    }
  }

  if (nextSafety.profile_mode === 'sample' && !dialect?.sampleClause) {
    nextSafety.profile_mode = 'metadata_only';
    warnings.push(`${dialect?.label || 'This dialect'} does not support portable TABLESAMPLE here, so profiling fell back to metadata-only mode.`);
  }

  return {
    strategy,
    estimatedRows,
    warnings,
    chunk_columns: Math.max(1, chunkColumns),
    safety: nextSafety,
  };
}

function buildMetadataOnlyProfile(asset, columns, safety) {
  const rowCount = estimateRows(asset);
  const profileColumns = {};
  for (const column of columns) {
    const assetNullPercent = column.null_percent ?? column.null_pct;
    const nullPercent = assetNullPercent === undefined ? null : asNumber(assetNullPercent, 0);
    profileColumns[column.name] = {
      column_name: column.name,
      data_type: column.data_type,
      row_count: rowCount,
      null_count:
        column.null_count !== undefined
          ? asNumber(column.null_count)
          : nullPercent === null
            ? null
            : Math.round((rowCount * nullPercent) / 100),
      null_percent: nullPercent,
      distinct_count: column.distinct_count ?? column.cardinality ?? null,
      min: column.min ?? column.minimum ?? null,
      max: column.max ?? column.maximum ?? null,
      mean: column.mean ?? null,
      raw_values_retained: false,
      source: 'catalog_metadata',
      limitations: ['metadata-only profile; not queried from source during this run'],
    };
  }
  return {
    asset_id: asset.id || objectName(asset),
    object_name: objectName(asset),
    row_count: rowCount,
    profile_mode: safety.profile_mode,
    generated_at: nowIso(),
    raw_values_retained: false,
    columns: profileColumns,
  };
}

function simulateProfile(asset, columns, safety) {
  const baseRows = estimateRows(asset) || 10_000;
  const sampleRows =
    safety.profile_mode === 'sample' ? Math.max(1, Math.round((baseRows * safety.sample_percent) / 100)) : baseRows;
  const profileColumns = {};
  columns.forEach((column, index) => {
    const nullPercent = Number(((index % 7) * 1.75).toFixed(2));
    const distinctCount = Math.max(1, Math.min(sampleRows, Math.round(sampleRows / (index + 2))));
    const kind = columnKind(column);
    profileColumns[column.name] = {
      column_name: column.name,
      data_type: column.data_type,
      row_count: sampleRows,
      null_count: Math.round((sampleRows * nullPercent) / 100),
      null_percent: nullPercent,
      distinct_count: column.sensitive ? null : distinctCount,
      min: column.sensitive || kind === 'text' ? null : 0,
      max: column.sensitive || kind === 'text' ? null : distinctCount,
      mean: column.sensitive || kind !== 'numeric' ? null : Number((distinctCount / 2).toFixed(2)),
      raw_values_retained: false,
      source: 'simulated_profile',
      limitations: ['simulated run used for workflow validation; not source-measured'],
    };
  });
  return {
    asset_id: asset.id || objectName(asset),
    object_name: objectName(asset),
    row_count: sampleRows,
    profile_mode: safety.profile_mode,
    generated_at: nowIso(),
    raw_values_retained: false,
    columns: profileColumns,
  };
}

function buildSkipped(asset, reason, severity = 'warning') {
  return {
    asset_id: asset?.id || objectName(asset),
    object_name: objectName(asset),
    reason,
    severity,
  };
}

export function buildProfilingContract() {
  return {
    version: '1.0',
    raw_values_retained: false,
    supported_dialects: Object.keys(DIALECT_BUILDERS),
    connector_dialects: { ...CONNECTOR_DIALECTS },
    dialect_capabilities: Object.fromEntries(
      Object.entries(DIALECT_BUILDERS).map(([key, dialect]) => [
        key,
        {
          label: dialect.label,
          supports_sampling: Boolean(dialect.sampleClause),
          safety_notes: dialect.safety_notes,
        },
      ])
    ),
    supported_execution_modes: Array.from(EXECUTION_MODES),
    supported_profile_modes: Array.from(PROFILE_MODES),
    safety_defaults: { ...DEFAULT_SAFETY },
    statistics: ['row_count', 'null_count', 'null_percent', 'distinct_count', 'min', 'max', 'mean'],
    output_targets: ['runtime_json', 'markdown_frontmatter_update', 'quality_api_export', 'confluence_summary'],
    live_execution_requirements: [
      'source connector with approved credentials',
      'read-only database permission',
      'query timeout and lock timeout configured',
      'full scans explicitly allowed when requested',
    ],
  };
}

export function buildProfilingPlan(input = {}, objectCache = new Map()) {
  const safety = normalizeProfileSafety({
    ...input,
    ...(input.options || {}),
    ...(input.safety || {}),
  });
  const dialect = dialectBuilder(safety.dialect);
  const assets = normalizeAssets(input, objectCache).slice(0, safety.max_tables);
  const skipped = [];
  const actions = [];

  for (const asset of assets) {
    if (!isProfileableObject(asset)) {
      skipped.push(buildSkipped(asset, 'Only tables and views can be profiled by this framework.'));
      continue;
    }

    const estimatedRows = estimateRows(asset);
    const columns = toArray(asset.columns).map(normalizeColumn).filter((column) => column.name);
    if (!columns.length) {
      skipped.push(buildSkipped(asset, 'No columns are available in the catalog metadata.'));
      continue;
    }

    const adaptive = assetStrategy(asset, columns, safety, dialect);
    const actionSafety = adaptive.safety;
    if (actionSafety.profile_mode === 'full_scan' && !actionSafety.allow_full_scan) {
      skipped.push(buildSkipped(asset, 'Full-scan profiling is blocked unless allow_full_scan is true.', 'error'));
      continue;
    }
    if (
      !['metadata_only', 'sample'].includes(actionSafety.profile_mode) &&
      estimatedRows > actionSafety.max_estimated_rows &&
      !actionSafety.allow_full_scan
    ) {
      skipped.push(
        buildSkipped(
          asset,
          `Estimated rows ${estimatedRows} exceed max_estimated_rows ${actionSafety.max_estimated_rows}; use metadata_only/sample or raise the limit.`,
          'error'
        )
      );
      continue;
    }
    const selectedColumns = columns
      .slice(0, actionSafety.max_columns_per_table)
      .map((column) => buildColumnActions(column, actionSafety));
    const warnings = [...adaptive.warnings];
    if (columns.length > selectedColumns.length) {
      warnings.push(`Column list truncated from ${columns.length} to ${selectedColumns.length}.`);
    }
    if (selectedColumns.some((column) => column.sensitive)) {
      warnings.push('Sensitive columns will only receive null-count style aggregate checks; value range/cardinality is suppressed.');
    }
    if (actionSafety.profile_mode === 'sample' && !dialect.sampleClause) {
      warnings.push(`${dialect.label} does not have a portable TABLESAMPLE clause in this framework; enforce sampling in the connector or workload manager.`);
    }
    const columnChunks = chunkArray(selectedColumns, adaptive.chunk_columns);
    if (columnChunks.length > 1) {
      warnings.push(`Profile columns were split into ${columnChunks.length} batches to reduce timeout risk.`);
    }

    columnChunks.forEach((columnChunk, chunkIndex) => {
      const action = {
        action_id: randomUUID(),
        connector_id: input.connector_id || input.connectorId || null,
        asset_id: asset.id || objectName(asset),
        object_name: objectName(asset),
        object_type: objectType(asset),
        database: objectDatabase(asset),
        schema: objectSchema(asset),
        estimated_rows: estimatedRows,
        profile_mode: actionSafety.profile_mode,
        execution_mode: actionSafety.execution_mode,
        raw_values_retained: false,
        columns: columnChunk,
        warnings: chunkIndex === 0 ? warnings : [],
        strategy: adaptive.strategy,
        chunk: {
          index: chunkIndex + 1,
          count: columnChunks.length,
          column_count: columnChunk.length,
        },
        query: {
          dialect: actionSafety.dialect,
          dialect_label: dialect.label,
          sql: buildGenericProfileQuery(asset, columnChunk, actionSafety, dialect),
          timeout_ms: actionSafety.query_timeout_ms,
          lock_timeout_ms: actionSafety.lock_timeout_ms,
          read_only: true,
          safety_notes: dialect.safety_notes,
        },
        asset,
      };
      actions.push(action);
    });
  }

  const plannedAssetIds = new Set(actions.map((action) => action.asset_id));
  return {
    plan_id: randomUUID(),
    generated_at: nowIso(),
    status: skipped.some((item) => item.severity === 'error') && !actions.length ? 'blocked' : 'ready',
    safety,
    summary: {
      requested_assets: assets.length,
      planned_assets: plannedAssetIds.size,
      planned_actions: actions.length,
      skipped_assets: skipped.length,
      planned_columns: actions.reduce((sum, action) => sum + action.columns.length, 0),
      raw_values_retained: false,
    },
    actions,
    skipped,
  };
}

function normalizeExecutedProfile(action, result) {
  if (!result) return null;
  if (result.columns || result.profile) {
    const profile = result.profile || result;
    return {
      asset_id: profile.asset_id || action.asset_id,
      object_name: profile.object_name || action.object_name,
      row_count: asNumber(profile.row_count ?? profile.rowCount, 0),
      profile_mode: action.profile_mode,
      generated_at: profile.generated_at || profile.profiled_at || nowIso(),
      raw_values_retained: false,
      columns: profile.columns || {},
    };
  }
  return null;
}

function mergeProfileColumns(existing = {}, incoming = {}) {
  return {
    ...existing,
    ...incoming,
  };
}

function mergeProfiles(existing = null, incoming = null, action = {}) {
  if (!incoming) return existing;
  if (!existing) return incoming;
  return {
    ...existing,
    ...incoming,
    asset_id: existing.asset_id || incoming.asset_id || action.asset_id,
    object_name: existing.object_name || incoming.object_name || action.object_name,
    row_count: existing.row_count ?? incoming.row_count ?? 0,
    profile_mode: existing.profile_mode || incoming.profile_mode || action.profile_mode,
    generated_at: incoming.generated_at || existing.generated_at || nowIso(),
    connector_id: incoming.connector_id || existing.connector_id || action.connector_id || null,
    source_dialect: incoming.source_dialect || existing.source_dialect || action.query?.dialect || null,
    raw_values_retained: false,
    columns: mergeProfileColumns(existing.columns || {}, incoming.columns || {}),
  };
}

function normalizeAggregateRow(row = {}) {
  return Object.fromEntries(
    Object.entries(row || {}).map(([key, value]) => [String(key).replace(/^\[|\]$/g, '').toLowerCase(), value])
  );
}

export function profileFromAggregateRow(action = {}, row = {}) {
  const normalizedRow = normalizeAggregateRow(row);
  const rowCount = asNumber(normalizedRow.row_count ?? normalizedRow.count, 0);
  const columns = {};
  for (const column of action.columns || []) {
    const alias = sqlAlias(column.name);
    const nullCount = normalizedRow[`${alias}__null_count`];
    columns[column.name] = {
      column_name: column.name,
      data_type: column.data_type,
      row_count: rowCount,
      null_count: nullCount === undefined ? null : asNumber(nullCount, 0),
      null_percent:
        nullCount === undefined || rowCount === 0
          ? null
          : Math.round((asNumber(nullCount, 0) / rowCount) * 1000) / 10,
      distinct_count:
        normalizedRow[`${alias}__distinct_count`] === undefined
          ? null
          : asNumber(normalizedRow[`${alias}__distinct_count`], 0),
      min: normalizedRow[`${alias}__min`] ?? null,
      max: normalizedRow[`${alias}__max`] ?? null,
      mean:
        normalizedRow[`${alias}__mean`] === undefined
          ? null
          : asNumber(normalizedRow[`${alias}__mean`], 0),
      raw_values_retained: false,
      source: 'live_aggregate_query',
      limitations: column.skipped_statistics?.length
        ? [`Skipped sensitive/statistics: ${column.skipped_statistics.join(', ')}`]
        : [],
    };
  }
  return {
    asset_id: action.asset_id,
    object_name: action.object_name,
    row_count: rowCount,
    profile_mode: action.profile_mode,
    generated_at: nowIso(),
    raw_values_retained: false,
    connector_id: action.connector_id || null,
    source_dialect: action.query?.dialect || null,
    columns,
  };
}

export async function executeProfilingPlan(plan, executor = null) {
  const startedAt = nowIso();
  const profiledAssetIds = new Set();
  const plannedAssetIds = new Set((plan.actions || []).map((action) => action.asset_id));
  const run = {
    run_id: randomUUID(),
    plan_id: plan.plan_id,
    status: 'succeeded',
    started_at: startedAt,
    completed_at: null,
    safety: { ...plan.safety, raw_values_retained: false },
    summary: {
      assets_profiled: 0,
      assets_planned: plannedAssetIds.size,
      actions_planned: (plan.actions || []).length,
      assets_skipped: plan.skipped.length,
      columns_profiled: 0,
      warning_count: plan.actions.reduce((sum, action) => sum + action.warnings.length, 0),
      raw_values_retained: false,
    },
    profiles: {},
    skipped: [...plan.skipped],
    warnings: plan.actions.flatMap((action) => action.warnings.map((message) => ({ asset_id: action.asset_id, message }))),
    errors: [],
  };

  if (plan.safety.execution_mode === 'dry_run') {
    run.status = 'planned';
    run.completed_at = nowIso();
    return run;
  }

  for (const action of plan.actions) {
    try {
      const profile =
        plan.safety.execution_mode === 'simulate'
          ? simulateProfile(action.asset, action.columns, plan.safety)
          : normalizeExecutedProfile(action, await executor?.runProfileAction?.(action));
      if (!profile) {
        throw new Error('Live profiling requires an executor with runProfileAction(action) that returns aggregate profile results.');
      }
      profile.raw_values_retained = false;
      const mergedProfile = mergeProfiles(run.profiles[action.asset_id] || null, profile, action);
      run.profiles[action.asset_id] = mergedProfile;
      profiledAssetIds.add(action.asset_id);
      run.summary.assets_profiled = profiledAssetIds.size;
      run.summary.columns_profiled = Object.values(run.profiles).reduce(
        (sum, item) => sum + Object.keys(item.columns || {}).length,
        0
      );
    } catch (err) {
      run.errors.push({
        asset_id: action.asset_id,
        code: err.code || 'PROFILE_EXECUTION_ERROR',
        message: err.message,
        phase: err.phase || 'profile_execution',
        status: err.status || 500,
        remediation:
          err.remediation ||
          'Verify read-only credentials, object permissions, query timeout, source availability, and that the connector implements profile execution.',
        details: err.details || null,
      });
    }
  }

  if (run.errors.length && run.summary.assets_profiled) run.status = 'partial_failure';
  if (run.errors.length && !run.summary.assets_profiled) run.status = 'failed';
  run.completed_at = nowIso();
  return run;
}

export async function runProfiling(input = {}, objectCache = new Map(), executor = null) {
  const plan = buildProfilingPlan(input, objectCache);
  const run = await executeProfilingPlan(plan, executor);
  return {
    contract: buildProfilingContract(),
    plan,
    run,
    package: buildComputerFriendlyProfilePackage(run),
    confluence: buildConfluenceProfileSummary(run),
  };
}

export function applyProfileToAsset(asset = {}, profile = {}) {
  const updated = {
    ...asset,
    row_count: profile.row_count ?? asset.row_count,
    profiled_at: profile.generated_at || profile.profiled_at || asset.profiled_at,
    profile_summary: {
      raw_values_retained: false,
      profile_mode: profile.profile_mode || 'unknown',
      generated_at: profile.generated_at || profile.profiled_at || nowIso(),
      column_count: Object.keys(profile.columns || {}).length,
    },
  };
  const columnProfiles = profile.columns || {};
  updated.columns = toArray(asset.columns).map((column) => {
    const name = column.name || column.column_name;
    const stats = columnProfiles[name] || {};
    return {
      ...column,
      row_count: stats.row_count ?? profile.row_count ?? column.row_count,
      null_count: stats.null_count ?? column.null_count,
      null_percent: stats.null_percent ?? stats.null_pct ?? column.null_percent,
      distinct_count: stats.distinct_count ?? column.distinct_count,
      min: stats.min ?? column.min,
      max: stats.max ?? column.max,
      mean: stats.mean ?? column.mean,
      profiled_at: stats.generated_at || profile.generated_at || column.profiled_at,
      raw_values_retained: false,
    };
  });
  return updated;
}

export function buildComputerFriendlyProfilePackage(run = {}) {
  const profiles = run.profiles || {};
  const exportedProfiles = Object.fromEntries(
    Object.entries(profiles).map(([assetId, profile]) => [assetId, exportProfile(profile, 'json')])
  );
  return {
    package_type: 'aggregate_profile_run',
    version: '1.0',
    run_id: run.run_id,
    generated_at: nowIso(),
    raw_values_retained: false,
    manifest: {
      profile_count: Object.keys(profiles).length,
      status: run.status,
      output_files_recommended: [
        'profiles/<asset-id>.profile.json',
        'profiles/<asset-id>.profile.csv',
        'confluence/profile-summary.md',
      ],
    },
    profiles,
    exports: exportedProfiles,
  };
}

export function buildConfluenceProfileSummary(run = {}) {
  const profiles = Object.values(run.profiles || {});
  const lines = [
    '# Data Profile Execution Summary',
    '',
    `Run ID: ${run.run_id || 'not-run'}`,
    `Status: ${run.status || 'unknown'}`,
    `Raw values retained: no`,
    `Assets profiled: ${run.summary?.assets_profiled || 0}`,
    `Columns profiled: ${run.summary?.columns_profiled || 0}`,
    '',
    '## Safety Controls',
    '',
    `- Profile mode: ${run.safety?.profile_mode || 'unknown'}`,
    `- Dialect: ${run.safety?.dialect || DEFAULT_SAFETY.dialect}`,
    `- Isolation level: ${run.safety?.isolation_level || 'dialect default'}`,
    `- Lock timeout: ${run.safety?.lock_timeout_ms || DEFAULT_SAFETY.lock_timeout_ms} ms`,
    `- Query timeout: ${run.safety?.query_timeout_ms || DEFAULT_SAFETY.query_timeout_ms} ms`,
    `- Full scans allowed: ${run.safety?.allow_full_scan ? 'yes' : 'no'}`,
    '',
    '## Profiled Assets',
    '',
  ];

  if (!profiles.length) {
    lines.push('No source profile was executed. Use dry-run output to review the safe SQL plan, or run simulate/live mode.');
  } else {
    for (const profile of profiles) {
      lines.push(
        `- ${profile.asset_id}: ${profile.row_count || 0} rows, ${Object.keys(profile.columns || {}).length} profiled columns.`
      );
    }
  }

  if (run.errors?.length) {
    lines.push('', '## Errors', '');
    for (const error of run.errors) lines.push(`- ${error.asset_id}: ${error.message}`);
  }
  return {
    content_type: 'text/markdown',
    generated_at: nowIso(),
    raw_values_retained: false,
    content: lines.join('\n'),
  };
}

export function profilingAnswer(run = {}) {
  const status = run.status === 'planned' ? 'planned but not executed' : run.status || 'unknown';
  const assetCount = run.summary?.assets_profiled || 0;
  const columnCount = run.summary?.columns_profiled || 0;
  const skipped = run.summary?.assets_skipped || 0;
  return {
    answer:
      `The profiling framework ${status}. It retained no raw data, profiled ${assetCount} asset(s) and ${columnCount} column(s), ` +
      `and skipped ${skipped} asset(s). ${run.safety?.dialect || 'Database'} plans use read-only aggregate queries with source-specific timeout and sampling guardrails.`,
    raw_values_retained: false,
    summary: run.summary,
    safety: run.safety,
  };
}

export default {
  normalizeProfileSafety,
  buildProfilingContract,
  buildProfilingPlan,
  executeProfilingPlan,
  runProfiling,
  applyProfileToAsset,
  buildComputerFriendlyProfilePackage,
  buildConfluenceProfileSummary,
  profilingAnswer,
  profileFromAggregateRow,
};
