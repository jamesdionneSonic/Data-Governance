import 'dotenv/config';

import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

import { buildDeltaManifest, writeDeltaOutputs } from '../engines/connectors/metadata-delta/index.js';
import { getConnector } from '../src/services/connectorService.js';
import { executeConnectorExtraction } from '../src/services/connectorRuntime/extractionKernel.js';

const DEFAULT_CATALOG_REPO = '../Sonic-data-lineage';
const DEFAULT_MARKDOWN_ROOT = './data/analysis/raw/ssis';
const SSIS_STREAMS = [
  'catalog',
  'packages',
  'tasks',
  'connections',
  'parameters',
  'environments',
  'agent_jobs',
  'lineage',
];
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

function compact(value, fallback = '') {
  return String(value ?? fallback).replace(/\s+/g, ' ').trim();
}

function normalizePath(value) {
  return String(value || '').replace(/\\/g, '/');
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

function hashId(prefix, value, fallback = 'unknown') {
  return `${prefix}-${hash(compact(value, fallback) || fallback, 10)}`;
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

async function writeText(file, value) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, `${String(value).trim()}\n`, 'utf8');
}

async function writeJson(file, value) {
  await writeText(file, JSON.stringify(value, null, 2));
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

function packageName(pkg = {}) {
  return compact(pkg.packageName || pkg.package_name || pkg.name || pkg.package || 'package.dtsx');
}

function packageFolder(pkg = {}, connector = {}) {
  return compact(pkg.folderName || pkg.folder_name || pkg.folder || connector.config?.folder || 'SSIS');
}

function packageProject(pkg = {}, connector = {}) {
  return compact(pkg.projectName || pkg.project_name || pkg.project || connector.config?.project || 'default');
}

function packageId(pkg = {}, connector = {}) {
  const server = connectorServerId(connector);
  const folder = packageFolder(pkg, connector);
  const project = packageProject(pkg, connector);
  const name = packageName(pkg);
  return compact(pkg.id || pkg.packageId || pkg.package_id || [server, 'SSISDB', folder, project, name].join('.'));
}

function packagePath(pkg = {}, connector = {}) {
  return [packageFolder(pkg, connector), packageProject(pkg, connector), packageName(pkg)].filter(Boolean).join('/');
}

function objectKey(value = '') {
  return compact(value).toLowerCase();
}

function relatedToPackage(item = {}, pkg = {}, connector = {}) {
  const keys = [
    packageId(pkg, connector),
    packageName(pkg),
    packagePath(pkg, connector),
    pkg.packageId,
    pkg.package_id,
  ]
    .filter(Boolean)
    .map(objectKey);
  const candidates = [
    item.package_id,
    item.packageId,
    item.package_name,
    item.packageName,
    item.package,
    item.package_path,
    item.packagePath,
    item.id,
  ]
    .filter(Boolean)
    .map(objectKey);
  return candidates.some((candidate) => keys.some((key) => candidate.includes(key) || key.includes(candidate)));
}

function packageEvidence(pkg, metadata = {}, connector = {}) {
  const sqlTasks = pkg.sqlTasks || pkg.sql_tasks || [];
  const packageTasks = pkg.packageTasks || pkg.package_tasks || [];
  const dataFlowComponents = pkg.dataFlowComponents || pkg.data_flow_components || [];
  const connectionManagers = pkg.connectionManagers || pkg.connection_managers || [];
  const parameters = (metadata.parameters || []).filter((item) => relatedToPackage(item, pkg, connector));
  const lineageEdges = (metadata.lineageEdges || metadata.lineage_edges || []).filter((edge) =>
    [edge.from, edge.to, edge.package_id, edge.packageId, edge.packageName, edge.package_name]
      .filter(Boolean)
      .some((value) => relatedToPackage({ package_id: value }, pkg, connector))
  );
  const agentJobs = [
    ...(metadata.agentJobs?.jobs || []),
    ...(metadata.agentJobs?.ssisSteps || []),
  ].filter((item) => relatedToPackage(item, pkg, connector));
  return {
    sql_tasks: sqlTasks,
    package_tasks: packageTasks,
    data_flow_components: dataFlowComponents,
    connection_managers: connectionManagers,
    parameters,
    lineage_edges: lineageEdges,
    agent_jobs: agentJobs,
  };
}

function buildPackageObject({ pkg, metadata, connector, generatedAt }) {
  const evidence = packageEvidence(pkg, metadata, connector);
  const id = packageId(pkg, connector);
  return {
    id,
    name: packageName(pkg),
    server: connectorServerId(connector),
    database: 'SSISDB',
    schema: packageFolder(pkg, connector),
    type: 'package',
    folder: packageFolder(pkg, connector),
    project: packageProject(pkg, connector),
    package_path: packagePath(pkg, connector),
    description: compact(pkg.description || pkg.Description),
    version: pkg.version || pkg.packageVersion || pkg.package_version || null,
    created_at: pkg.created || pkg.created_at || pkg.create_date || null,
    modified_at: pkg.modified || pkg.modified_at || pkg.modify_date || null,
    evidence,
    raw: pkg,
    last_refreshed_at: generatedAt,
  };
}

function packageObjects(metadata = {}, connector = {}, generatedAt) {
  const packages = metadata.xmlMetadata || metadata.packages || [];
  const catalogPackages = (metadata.catalog || []).filter((item) =>
    /package/i.test(compact(item.object_type || item.type || item.item_type || item.kind))
  );
  const candidates = packages.length ? packages : catalogPackages;
  return candidates
    .map((pkg) => buildPackageObject({ pkg, metadata, connector, generatedAt }))
    .filter((object) => object.name);
}

function contextBase(object) {
  const folder = hashId('f', object.folder, 'SSIS');
  const project = hashId('p', `${object.folder}/${object.project}`, 'default');
  const packageSegment = hashId('pkg', `${object.id}/${object.name}`, object.name);
  return `ssis/f/${folder}/p/${project}/pkg/${packageSegment}`;
}

function sourcePath(object) {
  return `servers/${safeSegment(object.server)}/SSISDB/${safeSegment(object.folder)}/${safeSegment(object.project)}/${safeSegment(object.name)}.md`;
}

function packageSignature(object) {
  return signature({
    id: object.id,
    name: object.name,
    folder: object.folder,
    project: object.project,
    version: object.version,
    created_at: object.created_at,
    modified_at: object.modified_at,
    evidence: object.evidence,
    raw: object.raw,
  });
}

async function priorMetadataSignature(catalogRoot, row) {
  if (!row) return null;
  const context = await readJson(path.join(catalogRoot, row.context_pack_json_path || ''), null);
  if (context?.source?.metadata_signature) return context.source.metadata_signature;
  return null;
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
    object_type: 'package',
    classification: 'internal',
    criticality: 'standard',
    owner: 'not surfaced in metadata',
    steward: '',
    confidence: 0.82,
    confidence_label: 'medium',
    edge_confidence: object.evidence.lineage_edges.length ? 0.75 : 0,
    column_confidence: 0,
    upstream_count: object.evidence.lineage_edges.filter((edge) => edge.to === object.id).length,
    downstream_count: object.evidence.lineage_edges.filter((edge) => edge.from === object.id).length,
    column_count: 0,
    source_system: object.server,
    ssis_folder: object.folder,
    ssis_project: object.project,
    ssis_package: object.name,
    context_pack_path: `${base}.md`,
    context_pack_json_path: `${base}.json`,
    confluence_url: '',
    source_markdown_path: sourcePath(object),
    last_refreshed_at: object.last_refreshed_at,
  };
}

function sourceMarkdown(object, connectorId) {
  return `---\nid: ${object.id}\nname: ${object.name}\nserver: ${object.server}\ndatabase: SSISDB\nfolder: ${object.folder}\nproject: ${object.project}\ntype: package\nsource_connector: ${connectorId}\nlast_refreshed_at: ${object.last_refreshed_at}\n---\n\n# ${object.folder}/${object.project}/${object.name}\n\n## Metadata Summary\n\n${mdTable(
    ['Field', 'Value'],
    [
      { Field: 'Server', Value: object.server },
      { Field: 'Folder', Value: object.folder },
      { Field: 'Project', Value: object.project },
      { Field: 'Package', Value: object.name },
      { Field: 'SQL tasks', Value: object.evidence.sql_tasks.length },
      { Field: 'Package calls', Value: object.evidence.package_tasks.length },
      { Field: 'Data flow components', Value: object.evidence.data_flow_components.length },
      { Field: 'Connection managers', Value: object.evidence.connection_managers.length },
      { Field: 'Lineage edges', Value: object.evidence.lineage_edges.length },
    ]
  )}\n\n## Connections\n\n${mdTable(
    ['Name', 'Type'],
    object.evidence.connection_managers.slice(0, 100).map((item) => ({
      Name: item.name || item.connectionName || item.connection_name || '',
      Type: item.type || item.connectionType || item.connection_type || '',
    }))
  )}\n\n## Tasks\n\n${mdTable(
    ['Name', 'Type'],
    [
      ...object.evidence.sql_tasks.map((item) => ({ Name: item.taskName || item.name || '', Type: 'sql_task' })),
      ...object.evidence.package_tasks.map((item) => ({ Name: item.taskName || item.name || '', Type: 'package_task' })),
      ...object.evidence.data_flow_components.map((item) => ({ Name: item.componentName || item.name || '', Type: 'data_flow_component' })),
    ].slice(0, 150)
  )}\n`;
}

function contextJson(row, object, connectorId) {
  return {
    schema_version: 1,
    object_id: object.id,
    generated_at: object.last_refreshed_at,
    identity: {
      display_name: object.name,
      server: object.server,
      database: 'SSISDB',
      schema: object.folder,
      object_name: object.name,
      object_type: 'package',
      package_name: object.name,
      package_path: object.package_path,
      aliases: [object.id, object.package_path, `${object.folder}.${object.project}.${object.name}`, object.name],
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
      upstream_count: row.upstream_count,
      downstream_count: row.downstream_count,
      upstream: object.evidence.lineage_edges.filter((edge) => edge.to === object.id).slice(0, 50),
      downstream: object.evidence.lineage_edges.filter((edge) => edge.from === object.id).slice(0, 50),
      direct_edges: object.evidence.lineage_edges.slice(0, 100),
    },
    ssis: object.evidence,
    source: {
      source_markdown_path: row.source_markdown_path,
      connector_id: connectorId,
      extraction_mode: 'ssis_incremental_metadata',
      metadata_signature: packageSignature(object),
    },
    support_notes: [
      'SSIS package metadata compared against the DevOps object registry as the master record.',
      'No credentials, package parameter values marked sensitive, or business data rows were captured.',
    ],
  };
}

function contextMarkdown(row, object, connectorId) {
  return `# ${object.folder}/${object.project}/${object.name}\n\n## Summary\n\nSSIS package discovered through saved connector \`${connectorId}\`.\n\n${mdTable(
    ['Signal', 'Count'],
    [
      { Signal: 'SQL tasks', Count: object.evidence.sql_tasks.length },
      { Signal: 'Package calls', Count: object.evidence.package_tasks.length },
      { Signal: 'Data flow components', Count: object.evidence.data_flow_components.length },
      { Signal: 'Connection managers', Count: object.evidence.connection_managers.length },
      { Signal: 'Lineage edges', Count: object.evidence.lineage_edges.length },
      { Signal: 'Agent job references', Count: object.evidence.agent_jobs.length },
    ]
  )}\n\n## Source\n\n- Source markdown: \`${row.source_markdown_path}\`\n- Connector: \`${connectorId}\`\n`;
}

function buildIndexes(rows, generatedAt) {
  const databases = {};
  for (const row of rows) {
    const database = row.database || 'unknown';
    if (!databases[database]) {
      databases[database] = {
        object_count: 0,
        types: {},
        schemas: {},
        context_readme_path: `context-packs/databases/${safeSegment(database, 'unknown_database')}/README.md`,
      };
    }
    databases[database].object_count += 1;
    databases[database].types[row.object_type] = (databases[database].types[row.object_type] || 0) + 1;
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

async function writeSsisReadmes(catalogRoot, rows) {
  const ssisRows = rows.filter((row) => row.object_type === 'package' && row.context_pack_path.startsWith('ssis/'));
  const folders = [...new Set(ssisRows.map((row) => row.sssis_folder || row.ssis_folder).filter(Boolean))].sort();
  await writeText(
    path.join(catalogRoot, 'ssis', 'README.md'),
    `# SSIS Lineage\n\n${mdTable(
      ['Folder', 'Packages'],
      folders.map((folder) => ({
        Folder: folder,
        Packages: ssisRows.filter((row) => row.ssis_folder === folder).length,
      }))
    )}\n`
  );
}

async function writeObjectArtifacts({ catalogRoot, markdownRoot, object, row, changed, connectorId, planOnly }) {
  if (!changed || planOnly) return { source_markdown: false, context: false };
  const writes = await Promise.all([
    writeIfChanged(path.join(markdownRoot, sourcePath(object)), sourceMarkdown(object, connectorId)),
    writeIfChanged(path.join(catalogRoot, sourcePath(object)), sourceMarkdown(object, connectorId)),
    writeIfChanged(path.join(catalogRoot, row.context_pack_json_path), JSON.stringify(contextJson(row, object, connectorId), null, 2)),
    writeIfChanged(path.join(catalogRoot, row.context_pack_path), contextMarkdown(row, object, connectorId)),
    writeIfChanged(
      path.join(catalogRoot, 'context-packs', 'objects', 'by-id', `${hash(object.id, 16)}.json`),
      JSON.stringify(contextJson(row, object, connectorId), null, 2)
    ),
  ]);
  return { source_markdown: writes[0] || writes[1], context: writes.slice(2).some(Boolean) };
}

function rowBelongsToConnector(row, connectorId, serverId) {
  return (
    row.source_system === connectorId ||
    (row.object_type === 'package' && row.server === serverId && row.database === 'SSISDB')
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
    definition: { type: 'ssis', label: 'SSIS' },
    options: {
      dry_run: false,
      include_metadata: true,
      fail_fast: false,
      streams: SSIS_STREAMS,
      extractXml: !hasFlag('--catalog-only'),
      folder: argValue('--folder') || undefined,
      project: argValue('--project') || undefined,
      package: argValue('--package') || undefined,
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
      id: argValue('--mock-connector-id', 'mock-ssis-incremental'),
      type: 'ssis',
      config: {
        server: argValue('--server-id', 'mock-ssis-server'),
        folder: argValue('--folder', 'FinanceETL'),
        project: argValue('--project', 'DailyLoads'),
      },
      credential: { mode: 'windows_integrated' },
    };
  }
  throw new Error('Pass --connector-id <saved-ssis-connector-id>.');
}

async function main() {
  const generatedAt = new Date().toISOString();
  const fullRefresh = hasFlag('--full-refresh');
  const planOnly = hasFlag('--plan-only') || hasFlag('--dry-run');
  const ingestMode = fullRefresh ? 'full_refresh' : planOnly ? 'plan_only' : 'incremental';
  const catalogRoot = path.resolve(argValue('--catalog-repo', process.env.CATALOG_REPO_PATH || DEFAULT_CATALOG_REPO));
  const markdownRoot = path.resolve(argValue('--markdown-root', process.env.SSIS_MARKDOWN_ROOT || DEFAULT_MARKDOWN_ROOT));
  const connector = await resolveConnector();
  const connectorId = connector.id;
  const serverId = connectorServerId(connector);
  const { metadata, extraction } = await loadMetadata(connector);
  const objects = packageObjects(metadata, connector, generatedAt);
  const existingRows = await readJsonl(path.join(catalogRoot, 'registry', 'object-registry.jsonl'));
  const nonTargetRows = existingRows.filter((row) => !rowBelongsToConnector(row, connectorId, serverId));
  const priorTargetRows = existingRows.filter((row) => rowBelongsToConnector(row, connectorId, serverId));
  const deltaManifest = await buildDeltaManifest({
    catalogRoot,
    connectorId,
    sourceFamily: 'ssis',
    sourceScope: `${serverId}:SSISDB`,
    currentObjects: objects.map((object) => ({
      canonical_id: object.id,
      display_name: object.name,
      object_type: 'package',
      database: object.database,
      schema: object.schema,
      object_name: object.name,
      source_family: 'ssis',
      source_system: serverId,
      metadata_signature: packageSignature(object),
    })),
    mode: ingestMode,
    fullRefreshReason: fullRefresh ? argValue('--full-refresh-reason', 'SSIS full refresh requested by operator.') : '',
    generatedAt,
    scope: {
      server: serverId,
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

  const staleRows = priorTargetRows.filter((row) => !rows.some((next) => next.object_id === row.object_id));
  const retainedRows = fullRefresh ? [] : staleRows;
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
    await writeSsisReadmes(catalogRoot, mergedRows);
  }
  const deltaCatalogOutputs = planOnly
    ? {}
    : await writeDeltaOutputs({
        manifest: deltaManifest,
        outputDir: path.join(catalogRoot, 'reports', 'source-metadata-delta'),
        basename: `${connectorId}-ssis-metadata-delta`,
      });
  const deltaReadbackOutputs = hasFlag('--no-readback')
    ? {}
    : await writeDeltaOutputs({
        manifest: deltaManifest,
        outputDir: path.join('docs', 'lineage-runtime-readbacks', 'source-metadata-delta'),
        basename: `${new Date().toISOString().slice(0, 10)}-${connectorId}-ssis-metadata-delta`,
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
    package_count: objects.length,
    new_package_count: results.filter((item) => item.status === 'new').length,
    changed_package_count: results.filter((item) => item.status === 'changed').length,
    unchanged_package_count: results.filter((item) => item.status === 'unchanged').length,
    retained_stale_package_count: fullRefresh ? 0 : staleRows.length,
    removed_stale_package_count: fullRefresh ? staleRows.length : 0,
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
    changed_packages: results.filter((item) => item.changed).map((item) => item.object_id).slice(0, 200),
    note:
      'Default incremental mode compares live SSIS package metadata against the DevOps object registry and writes only new/changed package artifacts. Use --full-refresh to remove stale SSIS rows for the connector scope.',
  };
  if (!planOnly) {
    await writeJson(path.join(catalogRoot, 'reports', `${connectorId}-ssis-incremental-ingest-report.json`), report);
  }
  if (!hasFlag('--no-readback')) {
    await writeJson(
      path.join(
        'docs',
        'lineage-runtime-readbacks',
        `${new Date().toISOString().slice(0, 10)}-${connectorId}-ssis-incremental-ingest-report.json`
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
