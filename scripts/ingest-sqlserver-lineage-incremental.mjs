import 'dotenv/config';

import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

import { buildDeltaManifest, writeDeltaOutputs } from '../engines/connectors/metadata-delta/index.js';
import { getConnector } from '../src/services/connectorService.js';
import { executeConnectorExtraction } from '../src/services/connectorRuntime/extractionKernel.js';

const DEFAULT_CATALOG_REPO = '../Sonic-data-lineage';
const DEFAULT_MARKDOWN_ROOT = './data/analysis/raw/sqlserver';
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
const SQL_STREAMS = [
  'schemas',
  'tables',
  'views',
  'columns',
  'procedures',
  'functions',
  'triggers',
  'relationships',
];
const TYPE_FOLDER = {
  table: 'tables',
  view: 'views',
  procedure: 'stored_procedures',
  function: 'functions',
  trigger: 'triggers',
};

function argValue(name, fallback = '') {
  const prefix = `${name}=`;
  const args = process.argv.slice(2);
  const inline = args.find((arg) => arg.startsWith(prefix));
  if (inline) return inline.slice(prefix.length);
  const index = args.indexOf(name);
  if (index >= 0) return args[index + 1] || fallback;
  return fallback;
}

function hasFlag(name) {
  return process.argv.includes(name);
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

function normalizePath(value) {
  return String(value || '').replace(/\\/g, '/');
}

function compact(value, fallback = '') {
  return String(value ?? fallback).replace(/\s+/g, ' ').trim();
}

function safeSegment(value, fallback = 'unknown', maxLength = 80) {
  const cleaned = compact(value, fallback)
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
  const raw = compact(value, fallback) || fallback;
  const suffix = hash(raw, 8);
  const base = safeSegment(raw, fallback, Math.max(8, maxLength - suffix.length - 2));
  return `${base}--${suffix}`;
}

function csvCell(value) {
  const text = compact(value);
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

async function fileExists(file) {
  try {
    await fs.stat(file);
    return true;
  } catch {
    return false;
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

async function writeJsonl(file, rows) {
  await writeText(file, rows.map((row) => JSON.stringify(row)).join('\n'));
}

async function writeIfChanged(file, value) {
  const content = `${String(value).trim()}\n`;
  if ((await fileExists(file)) && (await fs.readFile(file, 'utf8')) === content) return false;
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, content, 'utf8');
  return true;
}

function connectorServerId(connector = {}) {
  const override = argValue('--server-id');
  if (override) return override;
  const server = connector.config?.server || connector.config?.host || 'unknown';
  const port = connector.config?.port;
  if (port && !String(server).includes(',')) return `${server},${port}`;
  return String(server);
}

function connectorDatabase(connector = {}, metadata = {}) {
  return (
    metadata.database ||
    connector.config?.database ||
    connector.config?.catalogDatabase ||
    argValue('--database', 'unknown')
  );
}

function objectName(item = {}) {
  return item.object_name || item.name || item.table_name || item.TABLE_NAME || '';
}

function objectSchema(item = {}) {
  return item.schema || item.schema_name || item.TABLE_SCHEMA || 'dbo';
}

function objectDatabase(item = {}, connector = {}, metadata = {}) {
  return item.database || item.database_name || item.TABLE_CATALOG || connectorDatabase(connector, metadata);
}

function normalizeColumn(column = {}, objectId = '') {
  const name = column.name || column.column_name || column.COLUMN_NAME || '';
  return {
    name,
    column_id: `${objectId}.${name}`,
    ordinal: Number(column.ordinal || column.ordinal_position || column.ORDINAL_POSITION || 0) || null,
    data_type: column.data_type || column.DATA_TYPE || '',
    nullable: String(column.is_nullable || column.IS_NULLABLE || column.nullable || '').toUpperCase() === 'YES' || column.nullable === true,
    max_length: column.character_maximum_length ?? column.max_length ?? null,
    precision: column.numeric_precision ?? column.precision ?? null,
    scale: column.numeric_scale ?? column.scale ?? null,
  };
}

function buildObject({ item, type, connector, metadata, generatedAt }) {
  const server = connectorServerId(connector);
  const database = objectDatabase(item, connector, metadata);
  const schema = objectSchema(item);
  const name = objectName(item);
  const id = [server, database, schema, name].filter(Boolean).join('.');
  const columns = (item.columns || [])
    .map((column) => normalizeColumn(column, id))
    .filter((column) => column.name)
    .sort((left, right) => (left.ordinal || 0) - (right.ordinal || 0));
  return {
    id,
    name,
    server,
    database,
    schema,
    type,
    owner: item.owner || item.principal_name || 'not surfaced in metadata',
    row_count: item.row_count ?? item.rows ?? null,
    created_at: item.create_date || item.created_at || null,
    modified_at: item.modify_date || item.modified_at || null,
    definition: item.definition || item.sql_definition || '',
    columns,
    column_count: columns.length,
    last_refreshed_at: generatedAt,
  };
}

function metadataObjects(metadata = {}, connector = {}, generatedAt) {
  return [
    ...(metadata.tables || []).map((item) => buildObject({ item, type: 'table', connector, metadata, generatedAt })),
    ...(metadata.views || []).map((item) => buildObject({ item, type: 'view', connector, metadata, generatedAt })),
    ...(metadata.storedProcedures || []).map((item) => buildObject({ item, type: 'procedure', connector, metadata, generatedAt })),
    ...(metadata.functions || []).map((item) => buildObject({ item, type: 'function', connector, metadata, generatedAt })),
    ...(metadata.triggers || []).map((item) => buildObject({ item, type: 'trigger', connector, metadata, generatedAt })),
  ].filter((object) => object.name && object.database);
}

function contextBase(object) {
  const db = safeHashedSegment(object.database, 'unknown_database', 60);
  const schema = safeSegment(object.schema, 'unknown_schema');
  const type = TYPE_FOLDER[object.type] || `${object.type || 'object'}s`;
  return `context-packs/databases/${db}/${schema}/${type}/${safeSegment(object.name, 'object', 60)}--${hash(object.id, 10)}`;
}

function sourcePath(object) {
  const type = TYPE_FOLDER[object.type] || `${object.type || 'object'}s`;
  return `servers/${safeSegment(object.server)}/databases/${safeSegment(object.database)}/${type}/${safeSegment(object.schema)}__${safeSegment(object.name)}.md`;
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
    owner: object.owner,
    steward: '',
    confidence: 0.82,
    confidence_label: 'medium',
    edge_confidence: 0.4,
    column_confidence: object.columns.length ? 0.85 : 0,
    upstream_count: 0,
    downstream_count: 0,
    column_count: object.column_count,
    source_system: object.server,
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

function sourceMarkdown(object, connectorId) {
  return `---\nid: ${object.id}\nname: ${object.name}\nserver: ${object.server}\ndatabase: ${object.database}\nschema: ${object.schema}\ntype: ${object.type}\nsource_connector: ${connectorId}\nlast_refreshed_at: ${object.last_refreshed_at}\n---\n\n# ${object.database}.${object.schema}.${object.name}\n\n## Metadata Summary\n\n${mdTable(
    ['Field', 'Value'],
    [
      { Field: 'Server', Value: object.server },
      { Field: 'Database', Value: object.database },
      { Field: 'Schema', Value: object.schema },
      { Field: 'Object type', Value: object.type },
      { Field: 'Column count', Value: object.column_count },
      { Field: 'Row count', Value: object.row_count ?? 'not surfaced in metadata' },
      { Field: 'Created', Value: object.created_at ?? 'not surfaced in metadata' },
      { Field: 'Modified', Value: object.modified_at ?? 'not surfaced in metadata' },
    ]
  )}\n\n## Columns\n\n${mdTable(
    ['Ordinal', 'Column', 'Type', 'Nullable'],
    object.columns.map((column) => ({
      Ordinal: column.ordinal ?? '',
      Column: column.name,
      Type: column.data_type,
      Nullable: column.nullable ? 'YES' : 'NO',
    }))
  )}\n\n## Definition\n\n${object.definition ? `\`\`\`sql\n${object.definition}\n\`\`\`` : 'Definition text was not surfaced in this metadata harvest.'}\n`;
}

function contextJson(row, object, connectorId) {
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
      classification: row.classification,
      criticality: row.criticality,
      certified: false,
    },
    confidence: {
      overall: row.confidence,
      label: row.confidence_label,
      edge: row.edge_confidence,
      column: row.column_confidence,
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
      connector_id: connectorId,
      extraction_mode: 'sqlserver_incremental_metadata',
      metadata_signature: objectSignature(object),
    },
    support_notes: [
      'SQL Server metadata object compared against the DevOps object registry as the master record.',
      'No business row samples, credentials, secrets, or connection strings were captured.',
    ],
  };
}

function contextMarkdown(row, object, connectorId) {
  return `# ${object.database}.${object.schema}.${object.name}\n\n## Summary\n\nSQL Server ${object.type} discovered through saved connector \`${connectorId}\`.\n\n## Identity\n\n${mdTable(
    ['Field', 'Value'],
    [
      { Field: 'Object ID', Value: `\`${object.id}\`` },
      { Field: 'Database', Value: object.database },
      { Field: 'Schema', Value: object.schema },
      { Field: 'Type', Value: object.type },
      { Field: 'Columns', Value: object.column_count },
    ]
  )}\n\n## Columns\n\n${mdTable(
    ['Column', 'Type', 'Nullable'],
    object.columns.slice(0, 50).map((column) => ({
      Column: column.name,
      Type: column.data_type,
      Nullable: column.nullable ? 'YES' : 'NO',
    }))
  )}\n\n## Source\n\n- Source markdown: \`${row.source_markdown_path}\`\n- Connector: \`${connectorId}\`\n`;
}

function buildIndexes(rows, generatedAt) {
  const databases = {};
  for (const row of rows) {
    const database = row.database || 'unknown';
    const type = row.object_type || 'object';
    if (!databases[database]) {
      databases[database] = {
        object_count: 0,
        types: {},
        schemas: {},
        context_readme_path: `context-packs/databases/${safeHashedSegment(database, 'unknown_database', 60)}/README.md`,
      };
    }
    databases[database].object_count += 1;
    databases[database].types[type] = (databases[database].types[type] || 0) + 1;
    if (row.schema) databases[database].schemas[row.schema] = (databases[database].schemas[row.schema] || 0) + 1;
  }
  return {
    databaseIndex: { database_count: Object.keys(databases).length, databases },
    summary: {
      schema_version: 1,
      generated_at: generatedAt,
      object_count: rows.length,
      database_count: Object.keys(databases).length,
      server_count: new Set(rows.map((row) => row.server)).size,
      type_counts: Object.fromEntries(
        [...rows.reduce((map, row) => map.set(row.object_type, (map.get(row.object_type) || 0) + 1), new Map())].sort()
      ),
    },
  };
}

async function writeDatabaseReadmes(catalogRoot, rows, databases, generatedAt) {
  await Promise.all(
    databases.map(async (database) => {
      const dbRows = rows.filter((row) => row.database === database);
      const dbDir = path.join(catalogRoot, 'context-packs', 'databases', safeHashedSegment(database, 'unknown_database', 60));
      const typeCounts = [...dbRows.reduce((map, row) => map.set(row.object_type, (map.get(row.object_type) || 0) + 1), new Map())]
        .map(([Type, Objects]) => ({ Type, Objects }))
        .sort((left, right) => left.Type.localeCompare(right.Type));
      await writeText(
        path.join(dbDir, 'README.md'),
        `# ${database}\n\nSQL Server database-level index generated by incremental metadata ingest.\n\nGenerated: ${generatedAt}\n\n## Counts By Type\n\n${mdTable(['Type', 'Objects'], typeCounts)}\n`
      );
    })
  );
}

async function writeObjectArtifacts({ catalogRoot, markdownRoot, object, row, changed, connectorId, planOnly }) {
  if (!changed || planOnly) return { source_markdown: false, context: false };
  const markdown = sourceMarkdown(object, connectorId);
  const context = contextJson(row, object, connectorId);
  const contextMd = contextMarkdown(row, object, connectorId);
  const writes = await Promise.all([
    writeIfChanged(path.join(markdownRoot, sourcePath(object)), markdown),
    writeIfChanged(path.join(catalogRoot, sourcePath(object)), markdown),
    writeIfChanged(path.join(catalogRoot, row.context_pack_json_path), JSON.stringify(context, null, 2)),
    writeIfChanged(path.join(catalogRoot, row.context_pack_path), contextMd),
    writeIfChanged(path.join(catalogRoot, 'context-packs', 'objects', 'by-id', `${hash(object.id, 16)}.json`), JSON.stringify(context, null, 2)),
  ]);
  return { source_markdown: writes[0] || writes[1], context: writes.slice(2).some(Boolean) };
}

function objectSignature(object) {
  return signature({
    id: object.id,
    type: object.type,
    owner: object.owner,
    row_count: object.row_count,
    created_at: object.created_at,
    modified_at: object.modified_at,
    definition_hash: hash(object.definition, 24),
    columns: object.columns.map((column) => ({
      name: column.name,
      ordinal: column.ordinal,
      data_type: column.data_type,
      nullable: column.nullable,
      max_length: column.max_length,
      precision: column.precision,
      scale: column.scale,
    })),
  });
}

async function priorMetadataSignature(catalogRoot, row) {
  if (!row) return null;
  const context = await readJson(path.join(catalogRoot, row.context_pack_json_path || ''), null);
  if (context?.source?.metadata_signature) return context.source.metadata_signature;
  return signature({
    id: row.object_id,
    type: row.object_type,
    owner: row.owner,
    column_count: Number(row.column_count || 0),
    columns: (context?.columns?.preview || []).map((column) => ({
      name: column.name,
      ordinal: column.ordinal,
      data_type: column.data_type,
      nullable: column.nullable,
    })),
  });
}

function rowBelongsToConnector(row, connectorId, serverId, databaseSet) {
  return (
    row.source_system === connectorId ||
    row.server === serverId ||
    (databaseSet.has(row.database) && row.source_system === serverId)
  );
}

async function loadMetadata(connector) {
  const mockMetadataPath = argValue('--mock-metadata');
  if (mockMetadataPath) {
    return {
      metadata: await readJson(path.resolve(mockMetadataPath), {}),
      extraction: { status: 'mocked', errors: [], stream_results: [] },
    };
  }
  const extraction = await executeConnectorExtraction({
    connector,
    definition: { type: 'sql_server', label: 'SQL Server' },
    options: {
      dry_run: false,
      include_metadata: true,
      fail_fast: false,
      streams: SQL_STREAMS,
    },
  });
  return { metadata: extraction.metadata || {}, extraction };
}

async function resolveConnector() {
  const connectorId = argValue('--connector-id');
  const mockMetadataPath = argValue('--mock-metadata');
  const actor = { id: 'system', name: 'System', role: 'admin', roles: ['Admin'] };
  if (connectorId) {
    const connector = getConnector(connectorId, actor, 'run');
    if (!connector) throw new Error(`Saved connector not found: ${connectorId}`);
    return connector;
  }
  if (mockMetadataPath) {
    return {
      id: argValue('--mock-connector-id', 'mock-sqlserver-incremental'),
      type: 'sql_server',
      config: {
        server: argValue('--server-id', 'mock-sqlserver'),
        database: argValue('--database', 'MockDB'),
      },
      credential: { mode: 'windows_integrated' },
    };
  }
  throw new Error('Pass --connector-id <saved-sql-server-connector-id>.');
}

async function main() {
  const generatedAt = new Date().toISOString();
  const fullRefresh = hasFlag('--full-refresh');
  const planOnly = hasFlag('--plan-only') || hasFlag('--dry-run');
  const ingestMode = fullRefresh ? 'full_refresh' : planOnly ? 'plan_only' : 'incremental';
  const catalogRoot = path.resolve(argValue('--catalog-repo', process.env.CATALOG_REPO_PATH || DEFAULT_CATALOG_REPO));
  const markdownRoot = path.resolve(argValue('--markdown-root', process.env.SQLSERVER_MARKDOWN_ROOT || DEFAULT_MARKDOWN_ROOT));
  const connector = await resolveConnector();
  const connectorId = connector.id;
  const serverId = connectorServerId(connector);
  const { metadata, extraction } = await loadMetadata(connector);
  const objects = metadataObjects(metadata, connector, generatedAt);
  const objectDatabaseSet = new Set(objects.map((object) => object.database));
  const existingRows = await readJsonl(path.join(catalogRoot, 'registry', 'object-registry.jsonl'));
  const nonTargetRows = existingRows.filter((row) => !rowBelongsToConnector(row, connectorId, serverId, objectDatabaseSet));
  const priorTargetRows = existingRows.filter((row) => rowBelongsToConnector(row, connectorId, serverId, objectDatabaseSet));
  const deltaManifest = await buildDeltaManifest({
    catalogRoot,
    connectorId,
    sourceFamily: 'sql_server',
    sourceScope: `${serverId}:${[...objectDatabaseSet].sort().join(',') || 'no-objects'}`,
    currentObjects: objects.map((object) => ({
      canonical_id: object.id,
      display_name: object.name,
      object_type: object.type,
      database: object.database,
      schema: object.schema,
      object_name: object.name,
      source_family: 'sql_server',
      source_system: serverId,
      metadata_signature: objectSignature(object),
    })),
    mode: ingestMode,
    fullRefreshReason: fullRefresh ? argValue('--full-refresh-reason', 'SQL Server full refresh requested by operator.') : '',
    generatedAt,
    scope: {
      server: serverId,
      databases: [...objectDatabaseSet],
    },
  });
  const deltaById = new Map(deltaManifest.objects.map((object) => [object.canonical_id, object]));

  const rows = [];
  const results = [];
  await Promise.all(
    objects.map(async (object) => {
      const row = registryRow(object);
      const delta = deltaById.get(object.id);
      const changed = delta?.status === 'new' || delta?.status === 'changed';
      const writes = await writeObjectArtifacts({ catalogRoot, markdownRoot, object, row, changed, connectorId, planOnly });
      rows.push(row);
      results.push({ object_id: object.id, status: delta?.status || 'new', changed, ...writes });
    })
  );

  const retainedRows = fullRefresh ? [] : priorTargetRows.filter((row) => !rows.some((next) => next.object_id === row.object_id));
  const staleRows = priorTargetRows.filter((row) => !rows.some((next) => next.object_id === row.object_id));
  const mergedRows = [...nonTargetRows, ...retainedRows, ...rows].sort((left, right) => left.object_id.localeCompare(right.object_id));
  const indexes = buildIndexes(mergedRows, generatedAt);

  if (!planOnly) {
    await writeJsonl(path.join(catalogRoot, 'registry', 'object-registry.jsonl'), mergedRows);
    await writeText(
      path.join(catalogRoot, 'registry', 'object-registry.csv'),
      [REGISTRY_HEADERS.join(','), ...mergedRows.map((row) => REGISTRY_HEADERS.map((header) => csvCell(row[header])).join(','))].join('\n')
    );
    await writeJson(path.join(catalogRoot, 'registry', 'database-index.json'), indexes.databaseIndex);
    await writeJson(path.join(catalogRoot, 'registry', 'object-registry-summary.json'), indexes.summary);
    await writeJsonl(path.join(catalogRoot, 'registry', 'canonical-objects.jsonl'), mergedRows);
    await writeDatabaseReadmes(catalogRoot, mergedRows, [...objectDatabaseSet], generatedAt);
  }
  const deltaCatalogOutputs = planOnly
    ? {}
    : await writeDeltaOutputs({
        manifest: deltaManifest,
        outputDir: path.join(catalogRoot, 'reports', 'source-metadata-delta'),
        basename: `${connectorId}-sqlserver-metadata-delta`,
      });
  const deltaReadbackOutputs = hasFlag('--no-readback')
    ? {}
    : await writeDeltaOutputs({
        manifest: deltaManifest,
        outputDir: path.join('docs', 'lineage-runtime-readbacks', 'source-metadata-delta'),
        basename: `${new Date().toISOString().slice(0, 10)}-${connectorId}-sqlserver-metadata-delta`,
      });

  const report = {
    schema_version: 1,
    generated_at: generatedAt,
    connector_id: connectorId,
    mode: ingestMode,
    plan_only: planOnly,
    catalog_repo: normalizePath(catalogRoot),
    markdown_root: normalizePath(markdownRoot),
    server_id: serverId,
    database_count: objectDatabaseSet.size,
    object_count: objects.length,
    new_object_count: results.filter((item) => item.status === 'new').length,
    changed_object_count: results.filter((item) => item.status === 'changed').length,
    unchanged_object_count: results.filter((item) => item.status === 'unchanged').length,
    retained_stale_object_count: fullRefresh ? 0 : staleRows.length,
    removed_stale_object_count: fullRefresh ? staleRows.length : 0,
    delta_manifest: {
      counts: deltaManifest.counts,
      changed_object_ids: deltaManifest.changed_object_ids.slice(0, 200),
      catalog_manifest_path: deltaCatalogOutputs.manifest_path || '',
      readback_manifest_path: deltaReadbackOutputs.manifest_path || '',
      readback_path: deltaReadbackOutputs.readback_path || '',
    },
    extraction_status: extraction.status,
    extraction_errors: extraction.errors || [],
    stream_results: extraction.stream_results || [],
    changed_objects: results.filter((item) => item.changed).map((item) => item.object_id).slice(0, 200),
    note:
      'Default incremental mode compares live SQL Server metadata against the DevOps object registry and writes only new/changed object artifacts. Use --full-refresh to remove stale SQL Server rows for the connector scope.',
  };
  if (!planOnly) {
    await writeJson(path.join(catalogRoot, 'reports', `${connectorId}-sqlserver-incremental-ingest-report.json`), report);
  }
  if (!hasFlag('--no-readback')) {
    await writeJson(
      path.join(
        'docs',
        'lineage-runtime-readbacks',
        `${new Date().toISOString().slice(0, 10)}-${connectorId}-sqlserver-incremental-ingest-report.json`
      ),
      report
    );
  }
  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
