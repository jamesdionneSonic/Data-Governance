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

const PROFILE_MODES = new Set(['metadata_only', 'sample', 'full_scan']);
const EXECUTION_MODES = new Set(['dry_run', 'simulate', 'live']);
const NUMERIC_TYPE = /\b(bigint|int|smallint|tinyint|decimal|numeric|money|smallmoney|float|real|double|number)\b/i;
const DATE_TYPE = /\b(date|datetime|datetime2|smalldatetime|time|timestamp)\b/i;
const TEXT_TYPE = /\b(char|nchar|varchar|nvarchar|text|ntext|string|xml|json|uniqueidentifier|uuid)\b/i;
const SENSITIVE_NAME = /ssn|social|tax.?id|email|phone|address|dob|birth|name|vin|license|account|routing|card|token|secret|password/i;

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

export function normalizeProfileSafety(input = {}) {
  const profileMode = PROFILE_MODES.has(input.profile_mode || input.profileMode)
    ? input.profile_mode || input.profileMode
    : DEFAULT_SAFETY.profile_mode;
  const executionMode = EXECUTION_MODES.has(input.execution_mode || input.executionMode)
    ? input.execution_mode || input.executionMode
    : DEFAULT_SAFETY.execution_mode;
  return {
    ...DEFAULT_SAFETY,
    dialect: input.dialect || input.source_dialect || DEFAULT_SAFETY.dialect,
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

function bracketIdentifier(value) {
  return `[${String(value || '').replace(/]/g, ']]')}]`;
}

function sqlServerObjectName(asset = {}) {
  const database = objectDatabase(asset);
  const schema = objectSchema(asset);
  const table = asset.table || asset.table_name || asset.name || String(asset.id || '').split('.').pop();
  return [database, schema, table].filter(Boolean).map(bracketIdentifier).join('.');
}

function sqlAlias(value) {
  return String(value || 'col')
    .replace(/[^a-z0-9_]+/gi, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 90)
    .toLowerCase();
}

function buildColumnActions(column, safety) {
  const sensitive = isSensitiveColumn(column);
  const kind = columnKind(column);
  const actions = ['null_count'];
  if (safety.include_distinct && !sensitive) actions.push('distinct_count');
  if (safety.include_min_max && !sensitive && (kind === 'numeric' || kind === 'date' || safety.include_text_min_max)) {
    actions.push('min', 'max');
  }
  if (safety.include_mean && !sensitive && kind === 'numeric') actions.push('mean');
  return {
    name: column.name,
    data_type: column.data_type,
    kind,
    sensitive,
    actions,
    skipped_statistics: sensitive
      ? ['distinct_count', 'min', 'max', 'mean'].filter((stat) => !actions.includes(stat))
      : [],
  };
}

function buildSqlServerProfileQuery(asset, columns, safety) {
  const objectSql = sqlServerObjectName(asset);
  const hints = safety.profile_mode === 'metadata_only' ? '' : ' WITH (READUNCOMMITTED)';
  const selectParts = ['COUNT_BIG(*) AS [row_count]'];

  for (const column of columns) {
    const colSql = bracketIdentifier(column.name);
    const alias = sqlAlias(column.name);
    if (column.actions.includes('null_count')) {
      selectParts.push(`SUM(CASE WHEN ${colSql} IS NULL THEN 1 ELSE 0 END) AS [${alias}__null_count]`);
    }
    if (column.actions.includes('distinct_count')) {
      selectParts.push(`COUNT(DISTINCT ${colSql}) AS [${alias}__distinct_count]`);
    }
    if (column.actions.includes('min')) selectParts.push(`MIN(${colSql}) AS [${alias}__min]`);
    if (column.actions.includes('max')) selectParts.push(`MAX(${colSql}) AS [${alias}__max]`);
    if (column.actions.includes('mean')) selectParts.push(`AVG(CAST(${colSql} AS float)) AS [${alias}__mean]`);
  }

  const fromClause =
    safety.profile_mode === 'sample'
      ? `FROM ${objectSql}${hints} TABLESAMPLE (${safety.sample_percent} PERCENT)`
      : `FROM ${objectSql}${hints}`;

  return [
    `SET LOCK_TIMEOUT ${safety.lock_timeout_ms};`,
    `SET TRANSACTION ISOLATION LEVEL ${safety.isolation_level};`,
    `SELECT ${selectParts.join(',\n       ')}\n${fromClause};`,
  ].join('\n');
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
    supported_dialects: ['sql_server'],
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
  const safety = normalizeProfileSafety(input.safety || input.options || input);
  const assets = normalizeAssets(input, objectCache).slice(0, safety.max_tables);
  const skipped = [];
  const actions = [];

  for (const asset of assets) {
    if (!isProfileableObject(asset)) {
      skipped.push(buildSkipped(asset, 'Only tables and views can be profiled by this framework.'));
      continue;
    }

    const estimatedRows = estimateRows(asset);
    if (safety.profile_mode === 'full_scan' && !safety.allow_full_scan) {
      skipped.push(buildSkipped(asset, 'Full-scan profiling is blocked unless allow_full_scan is true.', 'error'));
      continue;
    }
    if (safety.profile_mode !== 'metadata_only' && estimatedRows > safety.max_estimated_rows && !safety.allow_full_scan) {
      skipped.push(
        buildSkipped(
          asset,
          `Estimated rows ${estimatedRows} exceed max_estimated_rows ${safety.max_estimated_rows}; use metadata_only/sample or raise the limit.`,
          'error'
        )
      );
      continue;
    }

    const columns = toArray(asset.columns).map(normalizeColumn).filter((column) => column.name);
    if (!columns.length) {
      skipped.push(buildSkipped(asset, 'No columns are available in the catalog metadata.'));
      continue;
    }

    const selectedColumns = columns.slice(0, safety.max_columns_per_table).map((column) =>
      buildColumnActions(column, safety)
    );
    const warnings = [];
    if (columns.length > selectedColumns.length) {
      warnings.push(`Column list truncated from ${columns.length} to ${selectedColumns.length}.`);
    }
    if (selectedColumns.some((column) => column.sensitive)) {
      warnings.push('Sensitive columns will only receive null-count style aggregate checks; value range/cardinality is suppressed.');
    }

    const action = {
      action_id: randomUUID(),
      connector_id: input.connector_id || input.connectorId || null,
      asset_id: asset.id || objectName(asset),
      object_name: objectName(asset),
      object_type: objectType(asset),
      database: objectDatabase(asset),
      schema: objectSchema(asset),
      estimated_rows: estimatedRows,
      profile_mode: safety.profile_mode,
      execution_mode: safety.execution_mode,
      raw_values_retained: false,
      columns: selectedColumns,
      warnings,
      query:
        safety.dialect === 'sql_server'
          ? {
              dialect: 'sql_server',
              sql: buildSqlServerProfileQuery(asset, selectedColumns, safety),
              timeout_ms: safety.query_timeout_ms,
              lock_timeout_ms: safety.lock_timeout_ms,
              read_only: true,
            }
          : null,
      asset,
    };
    actions.push(action);
  }

  return {
    plan_id: randomUUID(),
    generated_at: nowIso(),
    status: skipped.some((item) => item.severity === 'error') && !actions.length ? 'blocked' : 'ready',
    safety,
    summary: {
      requested_assets: assets.length,
      planned_assets: actions.length,
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

export async function executeProfilingPlan(plan, executor = null) {
  const startedAt = nowIso();
  const run = {
    run_id: randomUUID(),
    plan_id: plan.plan_id,
    status: 'succeeded',
    started_at: startedAt,
    completed_at: null,
    safety: { ...plan.safety, raw_values_retained: false },
    summary: {
      assets_profiled: 0,
      assets_planned: plan.actions.length,
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
      run.profiles[action.asset_id] = profile;
      run.summary.assets_profiled += 1;
      run.summary.columns_profiled += Object.keys(profile.columns || {}).length;
    } catch (err) {
      run.errors.push({
        asset_id: action.asset_id,
        message: err.message,
        remediation:
          'Verify read-only credentials, object permissions, query timeout, source availability, and that the connector implements profile execution.',
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
    `- Isolation level: ${run.safety?.isolation_level || 'READ UNCOMMITTED'}`,
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
      `and skipped ${skipped} asset(s). SQL Server plans use read-only aggregate queries with lock timeout and ${run.safety?.isolation_level || 'READ UNCOMMITTED'} isolation.`,
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
};
