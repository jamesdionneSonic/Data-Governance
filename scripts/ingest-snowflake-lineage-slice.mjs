import 'dotenv/config';

import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import yaml from 'yaml';

import { buildDeltaManifest, writeDeltaOutputs } from '../engines/connectors/metadata-delta/index.js';
import { getConnector, upsertConnector } from '../src/services/connectorService.js';

const CONNECTOR_ID = 'snowflake-bipslyv-tlb12786';
const SERVER_ID = 'snowflake-bipslyv-tlb12786';
const DEFAULT_CATALOG_REPO = '../Sonic-data-lineage';
const DEFAULT_MARKDOWN_ROOT = './data/markdown';
const OBJECT_TYPES = new Set(['table', 'view']);
const DEFAULT_SKIPPED_DATABASES = new Map([
  ['SNOWFLAKE_SAMPLE_DATA', 'snowflake_sample_database'],
]);
const REGISTRY_HEADERS = [
  'object_id',
  'display_name',
  'server',
  'database',
  'schema',
  'object_name',
  'object_type',
  'classification',
  'criticality',
  'owner',
  'steward',
  'confidence',
  'confidence_label',
  'edge_confidence',
  'column_confidence',
  'upstream_count',
  'downstream_count',
  'column_count',
  'source_system',
  'ssis_folder',
  'ssis_project',
  'ssis_package',
  'context_pack_path',
  'context_pack_json_path',
  'confluence_url',
  'source_markdown_path',
  'last_refreshed_at',
];

function argValue(name, fallback = '') {
  const prefix = `${name}=`;
  const found = process.argv.slice(2).find((arg) => arg.startsWith(prefix));
  return found ? found.slice(prefix.length) : fallback;
}

function hasFlag(name) {
  return process.argv.includes(name);
}

function databaseSkipReason(database) {
  const normalized = String(database || '').toUpperCase();
  if (!hasFlag('--include-snowflake-internal') && normalized === 'SNOWFLAKE') {
    return 'snowflake_internal_database';
  }
  if (!hasFlag('--include-snowflake-sample-data') && DEFAULT_SKIPPED_DATABASES.has(normalized)) {
    return DEFAULT_SKIPPED_DATABASES.get(normalized);
  }
  return '';
}

function hash(value, length = 12) {
  return crypto.createHash('sha256').update(String(value || '')).digest('hex').slice(0, length);
}

function stableJson(value) {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableJson(value[key])}`)
      .join(',')}}`;
  }
  return JSON.stringify(value);
}

function signature(value) {
  return hash(stableJson(value), 24);
}

function snowflakeObjectSignature(object) {
  return signature({
    id: object.id,
    type: object.type,
    owner: object.owner,
    snowflake: object.snowflake,
    columns: object.columns.map((column) => ({
      name: column.name,
      ordinal: column.ordinal,
      data_type: column.data_type,
      nullable: column.nullable,
    })),
  });
}

function normalizePath(value) {
  return String(value || '').replace(/\\/g, '/');
}

function safeSegment(value, fallback = 'unknown', maxLength = 80) {
  const cleaned = String(value || fallback)
    .trim()
    .split('')
    .map((char) => (char.charCodeAt(0) < 32 || /[<>:"/\\|?*]/.test(char) ? '_' : char))
    .join('')
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, maxLength);
  return cleaned || fallback;
}

function safeHashedSegment(value, fallback = 'unknown', maxLength = 80) {
  const raw = String(value || fallback).trim() || fallback;
  const suffix = hash(raw, 8);
  const base = safeSegment(raw, fallback, Math.max(8, maxLength - suffix.length - 2));
  return `${base}--${suffix}`;
}

function quoteIdent(value) {
  return `"${String(value).replace(/"/g, '""')}"`;
}

function csvCell(value) {
  const text = String(value ?? '').replace(/\s+/g, ' ').trim();
  if (/[",\r\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function mdTable(headers, rows) {
  return [
    `| ${headers.join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
    ...rows.map((row) => `| ${headers.map((header) => row[header] ?? '').join(' | ')} |`),
  ].join('\n');
}

async function readJson(file, fallback = null) {
  try {
    return JSON.parse(await fs.readFile(file, 'utf8'));
  } catch {
    return fallback;
  }
}

async function writeJson(file, value) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

async function writeText(file, value) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, `${String(value).trim()}\n`, 'utf8');
}

async function fileExists(file) {
  try {
    await fs.stat(file);
    return true;
  } catch {
    return false;
  }
}

async function writeIfChanged(file, value) {
  const content = `${String(value).trim()}\n`;
  if ((await fileExists(file)) && (await fs.readFile(file, 'utf8')) === content) {
    return false;
  }
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, content, 'utf8');
  return true;
}

async function listFilesRecursive(root) {
  const out = [];
  async function walk(current) {
    let entries = [];
    try {
      entries = await fs.readdir(current, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) await walk(full);
      else if (entry.isFile()) out.push(full);
    }
  }
  await walk(root);
  return out;
}

async function importSnowflakeSdk() {
  const mod = await import('snowflake-sdk');
  return mod.default || mod;
}

async function executeRows(connection, sqlText) {
  return new Promise((resolve, reject) => {
    connection.execute({
      sqlText,
      complete: (err, _statement, rows) => (err ? reject(err) : resolve(rows || [])),
    });
  });
}

async function connectSnowflake(config) {
  const snowflake = await importSnowflakeSdk();
  const connection = snowflake.createConnection(config);
  await new Promise((resolve, reject) => connection.connect((err) => (err ? reject(err) : resolve())));
  return connection;
}

function tableType(value) {
  const normalized = String(value || '').toUpperCase();
  if (normalized.includes('VIEW')) return 'view';
  return 'table';
}

function buildObject({ database, table, columns, generatedAt }) {
  const schema = table.TABLE_SCHEMA || table.table_schema;
  const name = table.TABLE_NAME || table.table_name || table.ID || table.NAME;
  const type = tableType(table.TABLE_TYPE || table.table_type);
  const objectId = `${SERVER_ID}.${database}.${schema}.${name}`;
  const columnRows = (columns || []).map((column) => ({
    name: column.COLUMN_NAME || column.column_name || column.ID || column.NAME,
    column_id: `${objectId}.${column.COLUMN_NAME || column.column_name || column.ID || column.NAME}`,
    ordinal: Number(column.ORDINAL_POSITION || column.ordinal_position || 0) || null,
    data_type: column.DATA_TYPE || column.data_type || '',
    nullable: String(column.IS_NULLABLE || column.is_nullable || '').toUpperCase() === 'YES',
    sensitivity: 'internal',
    description: 'Business definition not surfaced in Snowflake metadata.',
    business_name: column.COLUMN_NAME || column.column_name || column.ID || column.NAME,
    dictionary_confidence: 'metadata_only',
  }));
  return {
    id: objectId,
    name,
    server: SERVER_ID,
    database,
    schema,
    type,
    owner: table.TABLE_OWNER || table.table_owner || 'not surfaced in metadata',
    sensitivity: 'internal',
    tags: ['snowflake', 'metadata-harvest', 'review-needed'],
    external_source: true,
    depends_on: [],
    created_via: [],
    used_by: [],
    columns: columnRows.sort((left, right) => (left.ordinal || 0) - (right.ordinal || 0)),
    column_count: columnRows.length,
    snowflake: {
      table_type: table.TABLE_TYPE || table.table_type || '',
      row_count: table.ROW_COUNT ?? table.row_count ?? null,
      bytes: table.BYTES ?? table.bytes ?? null,
      created: table.CREATED || table.created || null,
      last_altered: table.LAST_ALTERED || table.last_altered || null,
    },
    catalog_confidence: {
      overall_score: 0.78,
      edge_correctness_score: 0,
      coverage_score: 0.85,
      column_lineage_score: 0,
      unresolved_risk_score: 0.15,
      confidence_label: 'medium',
      evidence_counts: {
        direct_edge_count: 0,
        column_lineage: 0,
        column_usage: 0,
        snowflake_column_count: columnRows.length,
      },
      warnings: ['Snowflake metadata harvest does not include dependency/access-history lineage yet.'],
      scoring_version: 'snowflake-metadata-v1',
    },
    lineage_quality: {
      confidence_label: 'metadata_only',
      caveat: 'No upstream/downstream lineage edges surfaced in this Snowflake metadata harvest.',
    },
    last_refreshed_at: generatedAt,
  };
}

function sourceMarkdown(object) {
  const frontmatter = {
    id: object.id,
    name: object.name,
    server: object.server,
    database: object.database,
    schema: object.schema,
    type: object.type,
    owner: object.owner,
    sensitivity: object.sensitivity,
    tags: object.tags,
    external_source: true,
    depends_on: [],
    created_via: [],
    used_by: [],
    columns: object.columns,
    column_count: object.column_count,
    snowflake: object.snowflake,
    catalog_confidence: object.catalog_confidence,
    lineage_quality: object.lineage_quality,
    last_refreshed_at: object.last_refreshed_at,
  };
  return `---\n${yaml.stringify(frontmatter).trim()}\n---\n\n# ${object.database}.${object.schema}.${object.name}\n\n## Plain-English Summary\n\n${object.database}.${object.schema}.${object.name} is a Snowflake ${object.type} discovered through the saved connector ${CONNECTOR_ID}. Business purpose, owner/steward, SLA, lifecycle/status, and certification are not surfaced in metadata.\n\n## Metadata Summary\n\n| Field | Value |\n| --- | --- |\n| Source system | ${object.server} |\n| Database | ${object.database} |\n| Schema | ${object.schema} |\n| Object type | ${object.type} |\n| Column count | ${object.column_count} |\n| Snowflake table type | ${object.snowflake.table_type || 'not surfaced in metadata'} |\n| Row count | ${object.snowflake.row_count ?? 'not surfaced in metadata'} |\n| Bytes | ${object.snowflake.bytes ?? 'not surfaced in metadata'} |\n| Last altered | ${object.snowflake.last_altered ?? 'not surfaced in metadata'} |\n\n## Columns\n\n${mdTable(
    ['Ordinal', 'Column', 'Type', 'Nullable'],
    object.columns.map((column) => ({
      Ordinal: column.ordinal ?? '',
      Column: column.name,
      Type: column.data_type,
      Nullable: column.nullable ? 'YES' : 'NO',
    }))
  )}\n\n## Lineage\n\nNo upstream or downstream lineage edges were surfaced in this metadata-only Snowflake harvest. Dependency/access-history extraction should be added separately before promoting lineage confidence above metadata-only.\n`;
}

function contextBase(object) {
  const db = safeHashedSegment(object.database, 'unknown_database', 60);
  const schema = safeSegment(object.schema, 'unknown_schema');
  const type = object.type === 'view' ? 'views' : 'tables';
  return `context-packs/databases/${db}/${schema}/${type}/${safeSegment(object.name, 'object', 60)}--${hash(object.id, 10)}`;
}

function sourcePath(object) {
  const type = object.type === 'view' ? 'views' : 'tables';
  return `servers/${safeSegment(SERVER_ID)}/databases/${safeSegment(object.database)}/${type}/${safeSegment(object.schema)}__${safeSegment(object.name)}.md`;
}

function registryRow(object) {
  const base = contextBase(object);
  return {
    object_id: object.id,
    display_name: object.name,
    server: object.server,
    database: object.database,
    schema: object.schema,
    object_name: object.name,
    object_type: object.type,
    classification: 'internal',
    criticality: 'standard',
    owner: object.owner || 'not surfaced in metadata',
    steward: '',
    confidence: 0.78,
    confidence_label: 'medium',
    edge_confidence: 0,
    column_confidence: 0.85,
    upstream_count: 0,
    downstream_count: 0,
    column_count: object.column_count,
    source_system: SERVER_ID,
    ssis_folder: '',
    ssis_project: '',
    ssis_package: '',
    context_pack_path: `${base}.md`,
    context_pack_json_path: `${base}.json`,
    confluence_url: '',
    source_markdown_path: sourcePath(object),
    last_refreshed_at: object.last_refreshed_at,
  };
}

function contextJson(row, object) {
  return {
    schema_version: 1,
    object_id: object.id,
    generated_at: object.last_refreshed_at,
    identity: {
      display_name: object.name,
      server: object.server,
      database: object.database,
      schema: object.schema,
      object_name: object.name,
      object_type: object.type,
      aliases: [object.id, `${object.database}.${object.schema}.${object.name}`, `${object.schema}.${object.name}`, object.name],
    },
    governance: {
      owner: row.owner,
      steward: '',
      classification: 'internal',
      criticality: 'standard',
      certified: false,
      trust_level: null,
    },
    confidence: {
      overall: 0.78,
      label: 'medium',
      edge: 0,
      column: 0.85,
      raw: object.catalog_confidence,
    },
    lineage: {
      upstream_count: 0,
      downstream_count: 0,
      upstream: [],
      downstream: [],
      direct_edges: [],
    },
    columns: {
      count: object.column_count,
      preview: object.columns.slice(0, 50),
      truncated: object.columns.length > 50,
    },
    source: {
      source_markdown_path: row.source_markdown_path,
      connector_id: CONNECTOR_ID,
      extraction_mode: 'snowflake_metadata_harvest',
      metadata_signature: snowflakeObjectSignature(object),
    },
    support_notes: [
      'Metadata-only Snowflake object. Business definition is not surfaced in metadata.',
      'No raw rows, sample values, credentials, or secrets were captured.',
    ],
  };
}

function contextMarkdown(row, object) {
  return `# ${object.database}.${object.schema}.${object.name}\n\n## Summary\n\nSnowflake ${object.type} discovered through ${CONNECTOR_ID}. Business meaning is not surfaced in metadata.\n\n## Identity\n\n| Field | Value |\n| --- | --- |\n| Object ID | \`${object.id}\` |\n| Database | ${object.database} |\n| Schema | ${object.schema} |\n| Type | ${object.type} |\n| Columns | ${object.column_count} |\n\n## Lineage\n\nNo dependency or access-history lineage edges were surfaced in this metadata-only harvest.\n\n## Columns\n\n${mdTable(
    ['Column', 'Type', 'Nullable'],
    object.columns.slice(0, 50).map((column) => ({
      Column: column.name,
      Type: column.data_type,
      Nullable: column.nullable ? 'YES' : 'NO',
    }))
  )}\n\n## Source\n\n- Source markdown: \`${row.source_markdown_path}\`\n- Connector: \`${CONNECTOR_ID}\`\n`;
}

async function readJsonl(file) {
  try {
    return (await fs.readFile(file, 'utf8'))
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => JSON.parse(line));
  } catch {
    return [];
  }
}

async function writeJsonl(file, rows) {
  await writeText(file, rows.map((row) => JSON.stringify(row)).join('\n'));
}

async function loadState(catalogRoot) {
  return readJson(path.join(catalogRoot, 'reports', `${CONNECTOR_ID}-ingestion-state.json`), {
    schema_version: 1,
    connector_id: CONNECTOR_ID,
    objects: {},
  });
}

function buildIndexes(rows, generatedAt) {
  const databaseIndex = { database_count: 0, databases: {} };
  for (const row of rows) {
    if (!databaseIndex.databases[row.database]) {
      databaseIndex.databases[row.database] = {
        object_count: 0,
        types: {},
        schemas: {},
        context_readme_path: `context-packs/databases/${safeHashedSegment(row.database, 'unknown_database', 60)}/README.md`,
      };
    }
    const db = databaseIndex.databases[row.database];
    db.object_count += 1;
    db.types[row.object_type] = (db.types[row.object_type] || 0) + 1;
    db.schemas[row.schema] = (db.schemas[row.schema] || 0) + 1;
  }
  databaseIndex.database_count = Object.keys(databaseIndex.databases).length;

  const objectPathIndex = {
    schema_version: 1,
    generated_at: generatedAt,
    objects: Object.fromEntries(
      rows.map((row) => [
        row.object_id,
        {
          database: row.database,
          schema: row.schema,
          object_name: row.object_name,
          object_type: row.object_type,
          context_pack_path: row.context_pack_path,
          context_pack_json_path: row.context_pack_json_path,
          source_markdown_path: row.source_markdown_path,
        },
      ])
    ),
  };

  const databaseArtifactIndex = {
    schema_version: 1,
    generated_at: generatedAt,
    databases: databaseIndex.databases,
  };

  const summary = {
    schema_version: 1,
    generated_at: generatedAt,
    object_count: rows.length,
    database_count: databaseIndex.database_count,
    server_count: new Set(rows.map((row) => row.server)).size,
    type_counts: Object.fromEntries(
      [...rows.reduce((map, row) => map.set(row.object_type, (map.get(row.object_type) || 0) + 1), new Map())].sort()
    ),
  };

  return { databaseIndex, objectPathIndex, databaseArtifactIndex, summary };
}

async function writeDatabaseReadmes(catalogRoot, rows, generatedAt, targetDatabases = []) {
  const targets = new Set(targetDatabases);
  const byDb = Map.groupBy(
    rows.filter((row) => !targets.size || targets.has(row.database)),
    (row) => row.database
  );
  for (const [database, dbRows] of byDb.entries()) {
    const dbDir = path.join(catalogRoot, 'context-packs', 'databases', safeHashedSegment(database, 'unknown_database', 60));
    const typeCounts = [...dbRows.reduce((map, row) => map.set(row.object_type, (map.get(row.object_type) || 0) + 1), new Map())]
      .map(([Type, Objects]) => ({ Type, Objects }))
      .sort((left, right) => left.Type.localeCompare(right.Type));
    const schemaCounts = [...dbRows.reduce((map, row) => map.set(row.schema, (map.get(row.schema) || 0) + 1), new Map())]
      .map(([Schema, Objects]) => ({ Schema, Objects }))
      .sort((left, right) => left.Schema.localeCompare(right.Schema));
    await writeText(
      path.join(dbDir, 'README.md'),
      `# ${database}\n\nSnowflake database-level index generated from ${CONNECTOR_ID}.\n\nGenerated: ${generatedAt}\n\n## Counts By Type\n\n${mdTable(
        ['Type', 'Objects'],
        typeCounts
      )}\n\n## Schemas\n\n${mdTable(['Schema', 'Objects'], schemaCounts)}\n`
    );
  }
}

async function writeObjectArtifacts({ catalogRoot, markdownRoot, object, row, changed }) {
  if (!changed) return { markdown: false, context: false };
  const markdown = sourceMarkdown(object);
  const sourceRelative = sourcePath(object);
  const context = contextJson(row, object);
  const contextMd = contextMarkdown(row, object);
  const appMarkdownPath = path.join(markdownRoot, sourceRelative);
  const repoMarkdownPath = path.join(catalogRoot, sourceRelative);
  const contextJsonPath = path.join(catalogRoot, row.context_pack_json_path);
  const contextMdPath = path.join(catalogRoot, row.context_pack_path);
  const compactPath = path.join(catalogRoot, 'context-packs', 'objects', 'by-id', `${hash(object.id, 16)}.json`);
  const writes = await Promise.all([
    writeIfChanged(appMarkdownPath, markdown),
    writeIfChanged(repoMarkdownPath, markdown),
    writeIfChanged(contextJsonPath, JSON.stringify(context, null, 2)),
    writeIfChanged(contextMdPath, contextMd),
    writeIfChanged(compactPath, JSON.stringify(context, null, 2)),
  ]);
  return { markdown: writes[0] || writes[1], context: writes.slice(2).some(Boolean) };
}

async function harvestSnowflake() {
  if (!hasFlag('--respect-proxy')) {
    for (const key of ['HTTP_PROXY', 'HTTPS_PROXY', 'ALL_PROXY', 'GIT_HTTP_PROXY', 'GIT_HTTPS_PROXY']) {
      delete process.env[key];
      delete process.env[key.toLowerCase()];
    }
  }

  upsertConnector(
    {
      id: CONNECTOR_ID,
      type: 'snowflake',
      config: {
        account: 'bipslyv-tlb12786',
        organization: 'bipslyv',
        account_name: 'tlb12786',
        snowsight_url: 'https://app.snowflake.com/bipslyv/tlb12786/',
        runtime_env: {
          warehouse: 'SNOWFLAKE_BIPSLYV_TLB12786_WAREHOUSE',
          database: 'SNOWFLAKE_BIPSLYV_TLB12786_DATABASE',
          schema: 'SNOWFLAKE_BIPSLYV_TLB12786_SCHEMA',
          role: 'SNOWFLAKE_BIPSLYV_TLB12786_ROLE',
        },
      },
      credential: {
        mode: 'service_account',
        secret_ref: 'env:snowflake-bipslyv-tlb12786',
        runtime_env: {
          username: 'SNOWFLAKE_BIPSLYV_TLB12786_USERNAME',
          password: 'SNOWFLAKE_BIPSLYV_TLB12786_PASSWORD',
        },
      },
    },
    { id: 'system', role: 'admin', roles: ['Admin'] }
  );
  getConnector(CONNECTOR_ID, { id: 'system', role: 'admin', roles: ['Admin'] });

  const connection = await connectSnowflake({
    account: 'bipslyv-tlb12786',
    username: process.env.SNOWFLAKE_BIPSLYV_TLB12786_USERNAME,
    password: process.env.SNOWFLAKE_BIPSLYV_TLB12786_PASSWORD,
    warehouse: process.env.SNOWFLAKE_BIPSLYV_TLB12786_WAREHOUSE,
    database: process.env.SNOWFLAKE_BIPSLYV_TLB12786_DATABASE,
    schema: process.env.SNOWFLAKE_BIPSLYV_TLB12786_SCHEMA,
    role: process.env.SNOWFLAKE_BIPSLYV_TLB12786_ROLE,
  });

  try {
    const databases = await executeRows(connection, 'show databases');
    const harvested = [];
    const errors = [];
    for (const dbRow of databases) {
      const database = dbRow.name || dbRow.NAME;
      if (!database) continue;
      const skipReason = databaseSkipReason(database);
      if (skipReason) {
        harvested.push({ database, skipped: true, reason: skipReason });
        continue;
      }
      try {
        const tableRows = await executeRows(
          connection,
          `select table_catalog, table_schema, table_name, table_type, row_count, bytes, created, last_altered from ${quoteIdent(database)}.information_schema.tables where table_schema <> 'INFORMATION_SCHEMA' order by table_schema, table_name`
        );
        const columnRows = await executeRows(
          connection,
          `select table_catalog, table_schema, table_name, column_name, ordinal_position, data_type, is_nullable from ${quoteIdent(database)}.information_schema.columns where table_schema <> 'INFORMATION_SCHEMA' order by table_schema, table_name, ordinal_position`
        );
        const columnsByObject = Map.groupBy(
          columnRows,
          (column) => `${column.TABLE_CATALOG || column.table_catalog}.${column.TABLE_SCHEMA || column.table_schema}.${column.TABLE_NAME || column.table_name}`.toUpperCase()
        );
        const objects = tableRows
          .map((table) =>
            buildObject({
              database,
              table,
              columns:
                columnsByObject.get(
                  `${database}.${table.TABLE_SCHEMA || table.table_schema}.${table.TABLE_NAME || table.table_name}`.toUpperCase()
                ) || [],
              generatedAt: new Date().toISOString(),
            })
          )
          .filter((object) => OBJECT_TYPES.has(object.type));
        harvested.push({ database, skipped: false, objects });
      } catch (error) {
        errors.push({ database, message: error.message, code: error.code || null });
      }
    }
    return { databases, harvested, errors };
  } finally {
    connection.destroy(() => {});
  }
}

async function main() {
  const generatedAt = new Date().toISOString();
  const fullRefresh = hasFlag('--full-refresh');
  const planOnly = hasFlag('--plan-only') || hasFlag('--dry-run');
  const ingestMode = fullRefresh ? 'full_refresh' : planOnly ? 'plan_only' : 'incremental';
  const catalogRoot = path.resolve(argValue('--catalog-repo', process.env.CATALOG_REPO_PATH || DEFAULT_CATALOG_REPO));
  const markdownRoot = path.resolve(argValue('--markdown-root', process.env.MARKDOWN_DATA_PATH || DEFAULT_MARKDOWN_ROOT));
  const state = await loadState(catalogRoot);
  const previousSignatures = state.objects || {};
  const harvest = await harvestSnowflake();
  const objects = harvest.harvested.flatMap((entry) => entry.objects || []);
  const existingRows = await readJsonl(path.join(catalogRoot, 'registry', 'object-registry.jsonl'));
  const nonSnowflakeRows = existingRows.filter((row) => row.server !== SERVER_ID && row.source_system !== SERVER_ID);
  const previousSnowflakeRows = existingRows.filter((row) => row.server === SERVER_ID || row.source_system === SERVER_ID);
  const registryPath = path.join(catalogRoot, 'registry', 'object-registry.jsonl');
  const deltaManifest = await buildDeltaManifest({
    catalogRoot,
    connectorId: CONNECTOR_ID,
    sourceFamily: 'snowflake',
    sourceScope: SERVER_ID,
    currentObjects: objects.map((object) => ({
      canonical_id: object.id,
      display_name: object.name,
      object_type: object.type,
      database: object.database,
      schema: object.schema,
      object_name: object.name,
      source_family: 'snowflake',
      source_system: SERVER_ID,
      metadata_signature: snowflakeObjectSignature(object),
    })),
    mode: ingestMode,
    fullRefreshReason: fullRefresh ? argValue('--full-refresh-reason', 'Snowflake full refresh requested by operator.') : '',
    generatedAt,
    scope: {
      server: SERVER_ID,
      source_system: SERVER_ID,
    },
    baseline: {
      registry_path: normalizePath(registryPath),
      rows: existingRows,
      scoped_rows: previousSnowflakeRows,
      signatures: new Map(previousSnowflakeRows.map((row) => [row.object_id, previousSignatures[row.object_id] || null])),
    },
  });
  const deltaById = new Map(deltaManifest.objects.map((object) => [object.canonical_id, object]));

  const newState = {
    schema_version: 1,
    connector_id: CONNECTOR_ID,
    generated_at: generatedAt,
    mode: ingestMode,
    objects: {},
  };
  const objectResults = [];
  const snowflakeRows = [];

  for (const object of objects) {
    const row = registryRow(object);
    const objectSignature = snowflakeObjectSignature(object);
    const delta = deltaById.get(object.id);
    const changed = delta?.status === 'new' || delta?.status === 'changed';
    newState.objects[object.id] = objectSignature;
    const writes = planOnly ? { source_markdown: false, context: false } : await writeObjectArtifacts({ catalogRoot, markdownRoot, object, row, changed });
    snowflakeRows.push(row);
    objectResults.push({ object_id: object.id, status: delta?.status || 'new', changed, ...writes });
  }

  const retainedRows = fullRefresh ? [] : previousSnowflakeRows.filter((row) => !newState.objects[row.object_id]);
  const mergedRows = [...nonSnowflakeRows, ...retainedRows, ...snowflakeRows].sort((left, right) =>
    left.object_id.localeCompare(right.object_id)
  );
  const indexes = buildIndexes(mergedRows, generatedAt);

  if (!planOnly) {
    await writeJsonl(path.join(catalogRoot, 'registry', 'object-registry.jsonl'), mergedRows);
    await writeText(
      path.join(catalogRoot, 'registry', 'object-registry.csv'),
      [REGISTRY_HEADERS.join(','), ...mergedRows.map((row) => REGISTRY_HEADERS.map((header) => csvCell(row[header])).join(','))].join('\n')
    );
    await writeJson(path.join(catalogRoot, 'registry', 'database-index.json'), indexes.databaseIndex);
    await writeJson(path.join(catalogRoot, 'registry', 'database-artifact-index.json'), indexes.databaseArtifactIndex);
    await writeJson(path.join(catalogRoot, 'registry', 'object-path-index.json'), indexes.objectPathIndex);
    await writeJson(path.join(catalogRoot, 'registry', 'object-registry-summary.json'), indexes.summary);
    await writeJsonl(path.join(catalogRoot, 'registry', 'canonical-objects.jsonl'), mergedRows);
    await writeJsonl(path.join(catalogRoot, 'registry', 'duplicate-objects.jsonl'), []);
    await writeJsonl(path.join(catalogRoot, 'registry', 'unresolved-server-objects.jsonl'), []);
    await writeDatabaseReadmes(
      catalogRoot,
      mergedRows,
      generatedAt,
      [...new Set(objects.map((object) => object.database))]
    );

    const manifest = (await readJson(path.join(catalogRoot, 'catalog-manifest.json'), {})) || {};
    await writeJson(path.join(catalogRoot, 'catalog-manifest.json'), {
      ...manifest,
      schema_version: manifest.schema_version || 1,
      generated_at: generatedAt,
      object_count: mergedRows.length,
      database_count: indexes.databaseIndex.database_count,
      context_pack_count: mergedRows.length,
      raw_source_markdown_count: (await listFilesRecursive(path.join(catalogRoot, 'servers'))).filter((file) => file.endsWith('.md')).length,
      snowflake: {
        connector_id: CONNECTOR_ID,
        server: SERVER_ID,
        last_incremental_ingest_at: generatedAt,
        database_count: new Set(objects.map((object) => object.database)).size,
        object_count: objects.length,
        retained_object_count: retainedRows.length,
      },
    });

    await writeJson(path.join(catalogRoot, 'reports', `${CONNECTOR_ID}-ingestion-state.json`), newState);
  }
  const deltaCatalogOutputs = planOnly
    ? {}
    : await writeDeltaOutputs({
        manifest: deltaManifest,
        outputDir: path.join(catalogRoot, 'reports', 'source-metadata-delta'),
        basename: `${CONNECTOR_ID}-snowflake-metadata-delta`,
      });
  const deltaReadbackOutputs = hasFlag('--no-readback')
    ? {}
    : await writeDeltaOutputs({
        manifest: deltaManifest,
        outputDir: path.join('docs', 'lineage-runtime-readbacks', 'source-metadata-delta'),
        basename: `${new Date().toISOString().slice(0, 10)}-${CONNECTOR_ID}-snowflake-metadata-delta`,
      });
  const report = {
    schema_version: 1,
    generated_at: generatedAt,
    connector_id: CONNECTOR_ID,
    mode: ingestMode,
    plan_only: planOnly,
    catalog_repo: normalizePath(catalogRoot),
    markdown_root: normalizePath(markdownRoot),
    visible_database_count: harvest.databases.length,
    harvested_database_count: harvest.harvested.filter((entry) => !entry.skipped).length,
    skipped_databases: harvest.harvested.filter((entry) => entry.skipped).map(({ database, reason }) => ({ database, reason })),
    object_count: objects.length,
    changed_object_count: objectResults.filter((item) => item.changed).length,
    unchanged_object_count: objectResults.filter((item) => !item.changed).length,
    retained_stale_object_count: retainedRows.length,
    removed_stale_object_count: fullRefresh ? previousSnowflakeRows.filter((row) => !newState.objects[row.object_id]).length : 0,
    delta_manifest: {
      counts: deltaManifest.counts,
      changed_object_ids: deltaManifest.changed_object_ids.slice(0, 200),
      catalog_manifest_path: deltaCatalogOutputs.manifest_path || '',
      readback_manifest_path: deltaReadbackOutputs.manifest_path || '',
      readback_path: deltaReadbackOutputs.readback_path || '',
    },
    errors: harvest.errors,
    note:
      'Default incremental mode upserts new/changed Snowflake metadata only and does not remove stale Snowflake rows. Use --full-refresh to rewrite/remove the full Snowflake slice.',
  };
  if (!planOnly) {
    await writeJson(path.join(catalogRoot, 'reports', `${CONNECTOR_ID}-ingestion-report.json`), report);
  }
  await writeJson(path.join('docs', 'lineage-runtime-readbacks', `${new Date().toISOString().slice(0, 10)}-${CONNECTOR_ID}-ingestion-report.json`), report);
  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
