/**
 * Catalog Repo Export Service
 * Writes a compact, AI-readable lineage data product into a separate Git repo.
 */

import { createHash } from 'crypto';
import { once } from 'events';
import { createWriteStream } from 'fs';
import { mkdir, readFile, readdir, rm, stat, writeFile } from 'fs/promises';
import path from 'path';

import { loadRuntimeCatalog } from './catalogRuntimeService.js';
import {
  getDownstreamDependents,
  getUpstreamDependencies,
} from './lineageService.js';

const DEFAULT_MARKDOWN_ROOT = './data/markdown';
const DEFAULT_CATALOG_REPO_PATH = '../Sonic-data-lineage';
const CATALOG_REPO_VERSION = 1;
const CONTEXT_NEIGHBOR_LIMIT = 25;
const CONTEXT_COLUMN_LIMIT = 50;
const CATALOG_REPO_PATH_WARNING_LENGTH = 220;
const CATALOG_REPO_PATH_FAILURE_LENGTH = 240;
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
  'context_pack_path',
  'context_pack_json_path',
  'confluence_url',
  'source_markdown_path',
  'last_refreshed_at',
];
const GENERATED_DIRECTORIES = ['schemas', 'registry', 'context-packs', 'ssis', 'reports', 'docs'];
const GENERATED_ROOT_FILES = [
  '.gitattributes',
  'README.md',
  'AI_README.md',
  'catalog-manifest.json',
];

function nowIso() {
  return new Date().toISOString();
}

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

function compactText(value, fallback = '') {
  return String(value ?? fallback).replace(/\s+/g, ' ').trim();
}

function normalizePathForManifest(value) {
  return String(value || '').replace(/\\/g, '/');
}

function shortHash(value) {
  return createHash('sha256').update(String(value || '')).digest('hex').slice(0, 10);
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
  const raw = compactText(value, fallback) || fallback;
  const suffix = shortHash(raw).slice(0, 8);
  const baseMaxLength = Math.max(8, maxLength - suffix.length - 2);
  return `${safeSegment(raw, fallback, baseMaxLength)}--${suffix}`;
}

function pluralType(type) {
  const normalized = String(type || 'object').toLowerCase();
  if (normalized === 'ssis_package') return 'packages';
  if (normalized.endsWith('y')) return `${normalized.slice(0, -1)}ies`;
  if (normalized.endsWith('s')) return normalized;
  return `${normalized}s`;
}

function objectIdFor(mapKey, object = {}) {
  return compactText(object.id || mapKey);
}

function confidenceLabel(object = {}) {
  return object.confidence_label || object.catalog_confidence?.confidence_label || 'missing';
}

function confidenceScore(object = {}) {
  const score = object.confidence_score ?? object.catalog_confidence?.overall_score;
  return typeof score === 'number' && Number.isFinite(score) ? score : null;
}

function nestedConfidenceScore(object = {}, key) {
  const score = object.catalog_confidence?.[key];
  return typeof score === 'number' && Number.isFinite(score) ? score : null;
}

function objectClassification(object = {}) {
  return compactText(object.classification || object.sensitivity, 'public') || 'public';
}

function objectCriticality(object = {}) {
  const name = compactText(object.name).toLowerCase();
  const tags = ensureArray(object.tags).join('|').toLowerCase();
  if (object.certified === true) return 'certified';
  if (/(executive|regulatory|kpi|metric|scorecard|dashboard)/i.test(`${name}|${tags}`)) {
    return 'critical_reporting';
  }
  if (/^(dim|fact)[a-z0-9_]/i.test(name) || /(dimension|fact)/i.test(tags)) {
    return 'dimensional_model';
  }
  if (objectClassification(object) !== 'public') return 'classified';
  if (compactText(object.steward || object.domain_manager || object.custodian)) return 'governed';
  return 'standard';
}

function isSsisPackage(object = {}) {
  const type = String(object.type || '').toLowerCase();
  return (
    type === 'package' ||
    type === 'ssis_package' ||
    Boolean(object.packageName || object.package_name || object.packagePath || object.package_path)
  );
}

function ssisPathParts(object = {}) {
  const packagePath = compactText(object.packagePath || object.package_path);
  const packageName = compactText(object.packageName || object.package_name || object.name, 'package.dtsx');

  if (packagePath.includes('/') || packagePath.includes('\\')) {
    const parts = packagePath.split(/[\\/]/).map((part) => part.trim()).filter(Boolean);
    return {
      folder: parts[0] || 'SSIS',
      project: parts[1] || parts[0] || 'default',
      packageName: parts[parts.length - 1] || packageName,
    };
  }

  const dotParts = packagePath.split('.').map((part) => part.trim()).filter(Boolean);
  if (dotParts.length >= 4 && dotParts[dotParts.length - 1].toLowerCase() === 'dtsx') {
    return {
      folder: dotParts[0],
      project: dotParts[1],
      packageName: dotParts.slice(2).join('.'),
    };
  }

  if (dotParts.length >= 3) {
    return {
      folder: dotParts[0],
      project: dotParts[1],
      packageName: dotParts.slice(2).join('.'),
    };
  }

  return {
    folder: compactText(object.database, 'SSIS') || 'SSIS',
    project: 'default',
    packageName,
  };
}

function relativeSourcePath(markdownRoot, filePath) {
  const source = compactText(filePath);
  if (!source) return '';
  const absoluteRoot = path.resolve(process.cwd(), markdownRoot);
  if (!path.isAbsolute(source)) return normalizePathForManifest(source);
  const relative = path.relative(absoluteRoot, source);
  if (relative.startsWith('..') || path.isAbsolute(relative)) return normalizePathForManifest(source);
  return normalizePathForManifest(relative);
}

function pathBaseForObject(object, id) {
  const hash = shortHash(id);
  const name = safeSegment(object.name || object.packageName || object.package_name || id, 'object', 60);

  if (isSsisPackage(object)) {
    const parts = ssisPathParts(object);
    const folder = safeHashedSegment(parts.folder, 'SSIS', 50);
    const project = safeHashedSegment(parts.project, 'default', 50);
    return `ssis/folders/${folder}/projects/${project}/packages/${name}--${hash}`;
  }

  const database = safeHashedSegment(object.database, 'unknown_database', 60);
  const schema = safeSegment(object.schema, 'no_schema');
  const type = safeSegment(pluralType(object.type), 'objects');
  return `context-packs/databases/${database}/${schema}/${type}/${name}--${hash}`;
}

function csvCell(value) {
  const text = compactText(value);
  if (/[",\r\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function markdownTable(headers, rows) {
  const header = `| ${headers.join(' | ')} |`;
  const separator = `| ${headers.map(() => '---').join(' | ')} |`;
  const body = rows.map((row) => `| ${row.map((cell) => String(cell ?? '')).join(' | ')} |`);
  return [header, separator, ...body].join('\n');
}

function groupCount(rows, fieldName) {
  const counts = new Map();
  for (const row of rows) {
    const value = compactText(row[fieldName], 'unknown') || 'unknown';
    counts.set(value, (counts.get(value) || 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((left, right) => right.count - left.count || left.name.localeCompare(right.name));
}

function sortedObjectEntries(objects) {
  return Array.from(objects.entries())
    .map(([key, object]) => ({ id: objectIdFor(key, object), object }))
    .filter((entry) => entry.id)
    .sort((left, right) => {
      const databaseCompare = compactText(left.object.database).localeCompare(
        compactText(right.object.database)
      );
      if (databaseCompare) return databaseCompare;
      const schemaCompare = compactText(left.object.schema).localeCompare(
        compactText(right.object.schema)
      );
      if (schemaCompare) return schemaCompare;
      const typeCompare = compactText(left.object.type).localeCompare(compactText(right.object.type));
      if (typeCompare) return typeCompare;
      return compactText(left.object.name, left.id).localeCompare(compactText(right.object.name, right.id));
    });
}

function buildRegistryRow({ entry, graph, generatedAt, markdownRoot, confluenceBaseUrl }) {
  const { object, id } = entry;
  const basePath = pathBaseForObject(object, id);
  const upstream = getUpstreamDependencies(id, graph, 1);
  const downstream = getDownstreamDependents(id, graph, 1);

  return {
    object_id: id,
    display_name: compactText(object.name || object.packageName || object.package_name, id),
    server: compactText(object.server, 'unknown'),
    database: compactText(object.database, 'unknown'),
    schema: compactText(object.schema),
    object_name: compactText(object.name || object.packageName || object.package_name, id),
    object_type: compactText(object.type, 'object'),
    classification: objectClassification(object),
    criticality: objectCriticality(object),
    owner: compactText(object.owner, 'unknown'),
    steward: compactText(object.steward || object.domain_manager || object.custodian),
    confidence: confidenceScore(object),
    confidence_label: confidenceLabel(object),
    edge_confidence: nestedConfidenceScore(object, 'edge_correctness_score'),
    column_confidence: nestedConfidenceScore(object, 'column_lineage_score'),
    upstream_count: upstream.length,
    downstream_count: downstream.length,
    column_count: Number(object.column_count || ensureArray(object.columns).length || 0),
    source_system: compactText(object.server || object.database, 'unknown'),
    context_pack_path: `${basePath}.md`,
    context_pack_json_path: `${basePath}.json`,
    confluence_url: confluenceBaseUrl || '',
    source_markdown_path: relativeSourcePath(markdownRoot, object.filePath || object.source_path),
    last_refreshed_at: generatedAt,
  };
}

function buildContextPack({ row, object, id, graph, typedEdges }) {
  const upstream = getUpstreamDependencies(id, graph, 1).sort();
  const downstream = getDownstreamDependents(id, graph, 1).sort();
  const directEdges = ensureArray(typedEdges)
    .filter((edge) => edge.source === id || edge.target === id)
    .slice(0, CONTEXT_NEIGHBOR_LIMIT * 2)
    .map((edge) => ({
      type: edge.type || '',
      source: edge.source,
      target: edge.target,
      confidence: edge.confidence ?? null,
      evidence: edge.evidence || '',
    }));

  return {
    schema_version: CATALOG_REPO_VERSION,
    object_id: id,
    generated_at: row.last_refreshed_at,
    identity: {
      display_name: row.display_name,
      server: row.server,
      database: row.database,
      schema: row.schema,
      object_name: row.object_name,
      object_type: row.object_type,
      package_name: object.packageName || object.package_name || null,
      package_path: object.packagePath || object.package_path || null,
      aliases: [
        row.object_id,
        row.schema && row.object_name ? `${row.schema}.${row.object_name}` : '',
        row.database && row.schema && row.object_name
          ? `${row.database}.${row.schema}.${row.object_name}`
          : '',
      ].filter(Boolean),
    },
    governance: {
      owner: row.owner,
      steward: row.steward,
      classification: row.classification,
      criticality: row.criticality,
      certified: object.certified === true,
      trust_level: object.trust_level || null,
    },
    confidence: {
      overall: row.confidence,
      label: row.confidence_label,
      edge: row.edge_confidence,
      column: row.column_confidence,
      raw: object.catalog_confidence || null,
    },
    lineage: {
      upstream_count: upstream.length,
      downstream_count: downstream.length,
      upstream: upstream.slice(0, CONTEXT_NEIGHBOR_LIMIT),
      upstream_truncated: upstream.length > CONTEXT_NEIGHBOR_LIMIT,
      downstream: downstream.slice(0, CONTEXT_NEIGHBOR_LIMIT),
      downstream_truncated: downstream.length > CONTEXT_NEIGHBOR_LIMIT,
      direct_edges: directEdges,
    },
    columns: {
      count: row.column_count,
      preview: ensureArray(object.columns).slice(0, CONTEXT_COLUMN_LIMIT).map((column) => ({
        name: column.name,
        column_id: column.column_id || '',
        data_type: column.data_type || '',
        nullable: column.nullable ?? null,
      })),
      preview_truncated: row.column_count > CONTEXT_COLUMN_LIMIT,
      usage_count: object.column_usage_count || 0,
      lineage_count: object.column_lineage_count || 0,
      risk_flag_count: object.column_risk_flag_count || 0,
    },
    evidence: {
      source_markdown_path: row.source_markdown_path,
      context_pack_path: row.context_pack_path,
      confluence_url: row.confluence_url,
    },
    ai_guidance: [
      'Use object-registry.jsonl for lookup first.',
      'Use this context pack for focused evidence.',
      'Use Confluence only for human navigation and explanatory pages.',
      'Report confidence and truncation flags when answering lineage questions.',
    ],
  };
}

function renderContextPackMarkdown(pack) {
  const upstreamRows = pack.lineage.upstream.map((item) => [`\`${item}\``]);
  const downstreamRows = pack.lineage.downstream.map((item) => [`\`${item}\``]);
  const columnRows = pack.columns.preview.map((column) => [
    column.name,
    column.data_type,
    column.nullable === null ? '' : column.nullable,
  ]);

  return [
    `# ${pack.identity.display_name}`,
    '',
    '> AI-readable targeted context pack. Use the object registry first, then this pack for focused lineage evidence.',
    '',
    '## Identity',
    '',
    markdownTable(
      ['Field', 'Value'],
      [
        ['Object ID', `\`${pack.object_id}\``],
        ['Type', pack.identity.object_type],
        ['Server', pack.identity.server],
        ['Database', pack.identity.database],
        ['Schema', pack.identity.schema],
        ['Name', pack.identity.object_name],
        ['Package Path', pack.identity.package_path || ''],
      ]
    ),
    '',
    '## Governance And Confidence',
    '',
    markdownTable(
      ['Field', 'Value'],
      [
        ['Owner', pack.governance.owner],
        ['Steward', pack.governance.steward],
        ['Classification', pack.governance.classification],
        ['Criticality', pack.governance.criticality],
        ['Confidence', `${pack.confidence.label}${pack.confidence.overall === null ? '' : ` (${pack.confidence.overall})`}`],
        ['Edge Confidence', pack.confidence.edge ?? ''],
        ['Column Confidence', pack.confidence.column ?? ''],
      ]
    ),
    '',
    '## Direct Upstream',
    '',
    upstreamRows.length ? markdownTable(['Object ID'], upstreamRows) : '- No direct upstream objects recorded.',
    pack.lineage.upstream_truncated ? '- Upstream list is truncated in this context pack.' : '',
    '',
    '## Direct Downstream',
    '',
    downstreamRows.length
      ? markdownTable(['Object ID'], downstreamRows)
      : '- No direct downstream objects recorded.',
    pack.lineage.downstream_truncated ? '- Downstream list is truncated in this context pack.' : '',
    '',
    '## Columns',
    '',
    columnRows.length ? markdownTable(['Name', 'Type', 'Nullable'], columnRows) : '- No columns recorded.',
    pack.columns.preview_truncated ? '- Column preview is truncated in this context pack.' : '',
    '',
    '## Evidence',
    '',
    `- Source markdown: \`${pack.evidence.source_markdown_path}\``,
    `- Generated at: ${pack.generated_at}`,
    '',
  ]
    .filter((line) => line !== '')
    .join('\n');
}

async function writeText(root, relativePath, content) {
  const fullPath = path.join(root, relativePath);
  await mkdir(path.dirname(fullPath), { recursive: true });
  await writeFile(fullPath, content.endsWith('\n') ? content : `${content}\n`, 'utf8');
  return normalizePathForManifest(relativePath);
}

async function writeJson(root, relativePath, value) {
  return writeText(root, relativePath, JSON.stringify(value, null, 2));
}

async function writeJsonl(root, relativePath, rows) {
  const fullPath = path.join(root, relativePath);
  await mkdir(path.dirname(fullPath), { recursive: true });
  const stream = createWriteStream(fullPath, { encoding: 'utf8' });

  try {
    for (const row of rows) {
      if (!stream.write(`${JSON.stringify(row)}\n`)) {
        // eslint-disable-next-line no-await-in-loop
        await once(stream, 'drain');
      }
    }
    await new Promise((resolve, reject) => {
      stream.once('finish', resolve);
      stream.once('error', reject);
      stream.end();
    });
  } catch (err) {
    stream.destroy();
    throw err;
  }

  return normalizePathForManifest(relativePath);
}

async function writeCsv(root, relativePath, headers, rows) {
  const lines = [
    headers.map(csvCell).join(','),
    ...rows.map((row) => headers.map((header) => csvCell(row[header])).join(',')),
  ];
  return writeText(root, relativePath, lines.join('\n'));
}

async function resetGeneratedRepoContent(targetRoot) {
  await mkdir(targetRoot, { recursive: true });
  for (const dir of GENERATED_DIRECTORIES) {
    // eslint-disable-next-line no-await-in-loop
    await rm(path.join(targetRoot, dir), { recursive: true, force: true });
  }
  for (const file of GENERATED_ROOT_FILES) {
    // eslint-disable-next-line no-await-in-loop
    await rm(path.join(targetRoot, file), { force: true });
  }
}

function buildDatabaseIndex(registryRows) {
  const databases = {};
  for (const row of registryRows) {
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
    if (row.schema) {
      databases[database].schemas[row.schema] = (databases[database].schemas[row.schema] || 0) + 1;
    }
  }
  return {
    database_count: Object.keys(databases).length,
    databases,
  };
}

function renderRootReadme({ generatedAt, registryRows, databaseIndex }) {
  return [
    '# Sonic Data Lineage',
    '',
    'This repository is the machine-readable Sonic data lineage catalog for AI assistants, analysts, engineers, and governance reviewers.',
    '',
    'Confluence is the human navigation layer. This Git repo is the authoritative compact data source for lookup, automation, and Codex/Rovo context retrieval.',
    '',
    '## Start Here',
    '',
    '- AI assistants: read [AI_README.md](AI_README.md) first.',
    '- Analysts: start with [registry/object-registry.csv](registry/object-registry.csv).',
    '- Automation: stream [registry/object-registry.jsonl](registry/object-registry.jsonl).',
    '- Database navigation: open [registry/database-index.json](registry/database-index.json) and follow each exact database `context_readme_path`.',
    '- SSIS navigation: open [ssis/README.md](ssis/README.md).',
    '',
    '## Current Scale',
    '',
    markdownTable(
      ['Metric', 'Count'],
      [
        ['Objects', registryRows.length],
        ['Databases', databaseIndex.database_count],
        ['Context packs', registryRows.length],
      ]
    ),
    '',
    '## Top Databases',
    '',
    markdownTable(
      ['Database', 'Objects'],
      groupCount(registryRows, 'database')
        .slice(0, 25)
        .map((item) => [item.name, item.count])
    ),
    '',
    `Generated at: ${generatedAt}`,
    '',
  ].join('\n');
}

function renderAiReadme({ remoteUrl }) {
  return [
    '# AI Usage Guide',
    '',
    'Use this repository as the primary machine-readable source for Sonic lineage questions.',
    '',
    '## Retrieval Order',
    '',
    '1. Search `registry/object-registry.jsonl` for exact object ID, database/schema/name, aliases, or SSIS package name.',
    '2. Open the row-specific `context_pack_path` or `context_pack_json_path`.',
    '3. Use Confluence only when you need the human governance page, methodology, or curated explanation.',
    '',
    '## Answering Rules',
    '',
    '- Preserve exact object IDs and casing from the registry.',
    '- Treat `downstream_count` as where-used or impact count.',
    '- Treat `upstream_count` as source/feed count.',
    '- Report confidence labels and truncation flags when present.',
    '- Do not infer relationships from names when the context pack lacks evidence.',
    '- For SSIS, use `ssis/folders/<folder>/projects/<project>/README.md` to move from project to packages.',
    '',
    '## Canonical Repo',
    '',
    remoteUrl ? `- ${remoteUrl}` : '- Set CATALOG_REPO_REMOTE in the generating application.',
    '',
  ].join('\n');
}

function renderFieldDictionary() {
  return [
    '# Field Dictionary',
    '',
    markdownTable(
      ['Field', 'Meaning'],
      REGISTRY_HEADERS.map((header) => [
        header,
        {
          object_id: 'Canonical object identifier.',
          display_name: 'Human-friendly object name.',
          server: 'Source server or system.',
          database: 'Database or source grouping.',
          schema: 'SQL schema when available.',
          object_name: 'Table, view, procedure, or package name.',
          object_type: 'Object type such as table, view, procedure, package, or column_mapping.',
          classification: 'Sensitivity or governance classification.',
          criticality: 'Generated criticality bucket.',
          owner: 'Technical or business owner when available.',
          steward: 'Named steward/domain manager/custodian when available.',
          confidence: 'Overall catalog confidence score.',
          confidence_label: 'Overall confidence label.',
          edge_confidence: 'Edge correctness confidence score when available.',
          column_confidence: 'Column lineage confidence score when available.',
          upstream_count: 'Direct upstream object count.',
          downstream_count: 'Direct downstream object count.',
          column_count: 'Column count from the catalog summary.',
          source_system: 'Primary source system for filtering.',
          context_pack_path: 'Markdown context pack path in this repo.',
          context_pack_json_path: 'JSON context pack path in this repo.',
          confluence_url: 'Human Confluence entry point when available.',
          source_markdown_path: 'Original generated markdown evidence path.',
          last_refreshed_at: 'Timestamp of this export.',
        }[header] || ''
      ])
    ),
    '',
  ].join('\n');
}

function renderConfidenceSummary(registryRows) {
  return [
    '# Confidence Summary',
    '',
    markdownTable(
      ['Confidence Label', 'Objects'],
      groupCount(registryRows, 'confidence_label').map((item) => [item.name, item.count])
    ),
    '',
    'Use low, missing, or needs_review records as investigation queues before making production change decisions.',
    '',
  ].join('\n');
}

function renderEdgeQualitySummary(registryRows) {
  const highImpact = registryRows
    .filter((row) => Number(row.downstream_count) > 0)
    .sort((left, right) => Number(right.downstream_count) - Number(left.downstream_count))
    .slice(0, 50);

  return [
    '# Edge Quality Summary',
    '',
    'High downstream counts identify objects with larger impact radius. Confirm confidence before using them for change approval.',
    '',
    markdownTable(
      ['Object ID', 'Type', 'Downstream', 'Confidence'],
      highImpact.map((row) => [
        `\`${row.object_id}\``,
        row.object_type,
        row.downstream_count,
        row.confidence_label,
      ])
    ),
    '',
  ].join('\n');
}

function renderDatabaseReadme(database, rows) {
  const databaseReadmeDirectory = `context-packs/databases/${safeHashedSegment(database, 'unknown_database', 60)}`;
  return [
    `# ${database}`,
    '',
    'Database-level index for generated targeted context packs.',
    '',
    '## Counts By Type',
    '',
    markdownTable(
      ['Type', 'Objects'],
      groupCount(rows, 'object_type').map((item) => [item.name, item.count])
    ),
    '',
    '## Highest Impact Objects',
    '',
    markdownTable(
      ['Object ID', 'Type', 'Downstream', 'Context Pack'],
      rows
        .slice()
        .sort((left, right) => Number(right.downstream_count) - Number(left.downstream_count))
        .slice(0, 100)
        .map((row) => [
          `\`${row.object_id}\``,
          row.object_type,
          row.downstream_count,
          `[context](${normalizePathForManifest(path.relative(databaseReadmeDirectory, row.context_pack_path))})`,
        ])
    ),
    '',
  ].join('\n');
}

function ssisFolderFromRow(row) {
  return row.context_pack_path.split('/')[2] || 'SSIS';
}

function ssisProjectFromRow(row) {
  return row.context_pack_path.split('/')[4] || 'default';
}

function renderSsisReadme(ssisRows) {
  const folderNames = Array.from(new Set(ssisRows.map((row) => ssisFolderFromRow(row)))).sort();
  return [
    '# SSIS Lineage',
    '',
    'SSIS packages are grouped by inferred folder and project. Open a folder README, then a project README, to navigate packages.',
    '',
    markdownTable(
      ['Folder', 'Packages', 'Supporting Context Records'],
      folderNames.map((folder) => {
        const rows = ssisRows.filter((row) => ssisFolderFromRow(row) === folder);
        const packageCount = rows.filter((row) => row.object_type === 'package').length;
        return [
          `[${folder}](folders/${folder}/README.md)`,
          packageCount,
          rows.length - packageCount,
        ];
      })
    ),
    '',
  ].join('\n');
}

function renderSsisFolderReadme(folder, rows) {
  const projectNames = Array.from(new Set(rows.map((row) => ssisProjectFromRow(row)))).sort();

  return [
    `# ${folder}`,
    '',
    'SSIS folder project index.',
    '',
    markdownTable(
      ['Project', 'Packages', 'Supporting Context Records'],
      projectNames.map((project) => {
        const projectRows = rows.filter((row) => ssisProjectFromRow(row) === project);
        const packageCount = projectRows.filter((row) => row.object_type === 'package').length;
        return [
          `[${project}](projects/${project}/README.md)`,
          packageCount,
          projectRows.length - packageCount,
        ];
      })
    ),
    '',
  ].join('\n');
}

function renderSsisProjectReadme(project, rows) {
  const packageRows = rows.filter((row) => row.object_type === 'package');
  const supportingRows = rows.filter((row) => row.object_type !== 'package');
  return [
    `# ${project}`,
    '',
    'SSIS project package index.',
    '',
    '## Packages',
    '',
    markdownTable(
      ['Package', 'Downstream', 'Confidence', 'Context Pack'],
      packageRows
        .slice()
        .sort((left, right) => left.display_name.localeCompare(right.display_name))
        .map((row) => [
          row.display_name,
          row.downstream_count,
          row.confidence_label,
          `[context](packages/${path.basename(row.context_pack_path)})`,
        ])
    ),
    '',
    '## Supporting Context Records',
    '',
    supportingRows.length
      ? markdownTable(
          ['Record', 'Type', 'Confidence', 'Context Pack'],
          supportingRows
            .slice()
            .sort((left, right) => left.display_name.localeCompare(right.display_name))
            .map((row) => [
              row.display_name,
              row.object_type,
              row.confidence_label,
              `[context](packages/${path.basename(row.context_pack_path)})`,
            ])
        )
      : '- No supporting context records were generated for this project.',
    '',
  ].join('\n');
}

function objectRegistrySchema() {
  return {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    title: 'Sonic Data Lineage Object Registry Row',
    type: 'object',
    required: ['object_id', 'display_name', 'database', 'object_type', 'context_pack_path'],
    properties: Object.fromEntries(REGISTRY_HEADERS.map((header) => [header, { type: ['string', 'number', 'null'] }])),
    additionalProperties: false,
  };
}

function contextPackSchema() {
  return {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    title: 'Sonic Data Lineage Context Pack',
    type: 'object',
    required: ['schema_version', 'object_id', 'identity', 'lineage', 'evidence'],
    properties: {
      schema_version: { type: 'number' },
      object_id: { type: 'string' },
      generated_at: { type: 'string' },
      identity: { type: 'object' },
      governance: { type: 'object' },
      confidence: { type: 'object' },
      lineage: { type: 'object' },
      columns: { type: 'object' },
      evidence: { type: 'object' },
      ai_guidance: { type: 'array', items: { type: 'string' } },
    },
    additionalProperties: true,
  };
}

function confluencePageSchema() {
  return {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    title: 'Sonic Data Lineage Confluence Navigation Page',
    type: 'object',
    required: ['title', 'purpose', 'ai_reroute'],
    properties: {
      title: { type: 'string' },
      purpose: { type: 'string' },
      ai_reroute: { type: 'string' },
      devops_repo_path: { type: 'string' },
    },
    additionalProperties: true,
  };
}

async function maybeCopyJson(sourcePath, targetRoot, relativePath, fallback) {
  try {
    const content = JSON.parse(await readFile(sourcePath, 'utf8'));
    await writeJson(targetRoot, relativePath, content);
    return content;
  } catch {
    await writeJson(targetRoot, relativePath, fallback);
    return fallback;
  }
}

async function fileExists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function listFilesRecursive(root, current = '') {
  const directory = path.join(root, current);
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const relativePath = normalizePathForManifest(path.join(current, entry.name));
    if (entry.isDirectory()) {
      // eslint-disable-next-line no-await-in-loop
      files.push(...(await listFilesRecursive(root, relativePath)));
    } else if (entry.isFile()) {
      files.push(relativePath);
    }
  }

  return files;
}

export async function exportCatalogRepo(options = {}) {
  const markdownRoot = path.resolve(
    process.cwd(),
    options.markdownRoot || process.env.MARKDOWN_DATA_PATH || DEFAULT_MARKDOWN_ROOT
  );
  const targetRoot = path.resolve(
    process.cwd(),
    options.targetRoot || process.env.CATALOG_REPO_PATH || DEFAULT_CATALOG_REPO_PATH
  );
  const remoteUrl =
    options.remoteUrl ||
    process.env.CATALOG_REPO_REMOTE ||
    'https://sonicapplicationdevelopment@dev.azure.com/sonicapplicationdevelopment/Data%20Warehouse/_git/Sonic-data-lineage';
  const confluenceBaseUrl = options.confluenceUrl || process.env.CONFLUENCE_LINEAGE_ROOT_URL || '';
  const generatedAt = nowIso();
  const runtime = await loadRuntimeCatalog(markdownRoot, { autoRebuild: false });
  const entries = sortedObjectEntries(runtime.objects);
  const registryRows = entries.map((entry) =>
    buildRegistryRow({
      entry,
      graph: runtime.lineageGraph,
      generatedAt,
      markdownRoot,
      confluenceBaseUrl,
    })
  );
  const rowById = new Map(registryRows.map((row) => [row.object_id, row]));
  const databaseIndex = buildDatabaseIndex(registryRows);

  await resetGeneratedRepoContent(targetRoot);
  await writeText(targetRoot, '.gitattributes', '* text=auto eol=lf\n*.json text eol=lf\n*.jsonl text eol=lf\n*.csv text eol=lf\n*.md text eol=lf\n');
  await writeText(targetRoot, 'README.md', renderRootReadme({ generatedAt, registryRows, databaseIndex }));
  await writeText(targetRoot, 'AI_README.md', renderAiReadme({ remoteUrl }));
  await writeJson(targetRoot, 'schemas/object-registry.schema.json', objectRegistrySchema());
  await writeJson(targetRoot, 'schemas/context-pack.schema.json', contextPackSchema());
  await writeJson(targetRoot, 'schemas/confluence-page.schema.json', confluencePageSchema());
  await writeText(targetRoot, 'docs/field-dictionary.md', renderFieldDictionary());
  await writeText(targetRoot, 'docs/confidence-guide.md', renderConfidenceSummary(registryRows));
  await writeText(
    targetRoot,
    'docs/lineage-methodology.md',
    '# Lineage Methodology\n\nLineage is generated from SQL Server metadata, SQL definitions, SSIS catalog/XML evidence, and runtime typed-edge indexes. Use confidence fields to separate validated relationships from review candidates.\n'
  );
  await writeText(targetRoot, 'docs/ai-usage-guide.md', renderAiReadme({ remoteUrl }));
  await writeCsv(targetRoot, 'registry/object-registry.csv', REGISTRY_HEADERS, registryRows);
  await writeJsonl(targetRoot, 'registry/object-registry.jsonl', registryRows);
  await writeJson(targetRoot, 'registry/database-index.json', databaseIndex);
  await writeJson(targetRoot, 'registry/object-registry-summary.json', {
    generated_at: generatedAt,
    object_count: registryRows.length,
    database_count: databaseIndex.database_count,
    type_counts: Object.fromEntries(groupCount(registryRows, 'object_type').map((item) => [item.name, item.count])),
    confidence_counts: Object.fromEntries(
      groupCount(registryRows, 'confidence_label').map((item) => [item.name, item.count])
    ),
  });

  for (const entry of entries) {
    const row = rowById.get(entry.id);
    if (!row) continue;
    const pack = buildContextPack({
      row,
      object: entry.object,
      id: entry.id,
      graph: runtime.lineageGraph,
      typedEdges: runtime.typedEdges,
    });
    // eslint-disable-next-line no-await-in-loop
    await writeJson(targetRoot, row.context_pack_json_path, pack);
    // eslint-disable-next-line no-await-in-loop
    await writeText(targetRoot, row.context_pack_path, renderContextPackMarkdown(pack));
  }

  for (const [database, value] of Object.entries(databaseIndex.databases)) {
    const rows = registryRows.filter((row) => row.database === database);
    // eslint-disable-next-line no-await-in-loop
    await writeText(targetRoot, value.context_readme_path, renderDatabaseReadme(database, rows));
  }

  const ssisRows = registryRows.filter((row) => row.context_pack_path.startsWith('ssis/'));
  await writeText(targetRoot, 'ssis/README.md', renderSsisReadme(ssisRows));
  const folderGroups = new Map();
  for (const row of ssisRows) {
    const folder = ssisFolderFromRow(row);
    if (!folderGroups.has(folder)) folderGroups.set(folder, []);
    folderGroups.get(folder).push(row);
  }
  for (const [folder, rows] of folderGroups.entries()) {
    // eslint-disable-next-line no-await-in-loop
    await writeText(targetRoot, `ssis/folders/${folder}/README.md`, renderSsisFolderReadme(folder, rows));
  }
  const projectGroups = new Map();
  for (const row of ssisRows) {
    const folder = ssisFolderFromRow(row);
    const project = ssisProjectFromRow(row);
    const key = `${folder}/${project}`;
    if (!projectGroups.has(key)) projectGroups.set(key, { folder, project, rows: [] });
    projectGroups.get(key).rows.push(row);
  }
  for (const group of projectGroups.values()) {
    // eslint-disable-next-line no-await-in-loop
    await writeText(
      targetRoot,
      `ssis/folders/${group.folder}/projects/${group.project}/README.md`,
      renderSsisProjectReadme(group.project, group.rows)
    );
  }

  const rebuildReportPath = path.join(markdownRoot, 'rebuild-report.json');
  const rebuildReport = await maybeCopyJson(rebuildReportPath, targetRoot, 'reports/latest-rebuild-report.json', {
    generated_at: generatedAt,
    status: 'missing',
  });
  await writeText(targetRoot, 'reports/confidence-summary.md', renderConfidenceSummary(registryRows));
  await writeText(targetRoot, 'reports/edge-quality-summary.md', renderEdgeQualitySummary(registryRows));

  const manifest = {
    schema_version: CATALOG_REPO_VERSION,
    generated_at: generatedAt,
    source_markdown_root: normalizePathForManifest(markdownRoot),
    remote_url: remoteUrl,
    object_count: registryRows.length,
    database_count: databaseIndex.database_count,
    context_pack_count: registryRows.length,
    ssis_package_context_count: ssisRows.length,
    rebuild_report_status: rebuildReport.status || rebuildReport.gate_status || 'present',
    files: {
      registry_csv: 'registry/object-registry.csv',
      registry_jsonl: 'registry/object-registry.jsonl',
      database_index: 'registry/database-index.json',
      registry_summary: 'registry/object-registry-summary.json',
      ai_readme: 'AI_README.md',
    },
  };
  await writeJson(targetRoot, 'reports/publish-summary.json', manifest);
  await writeJson(targetRoot, 'catalog-manifest.json', manifest);

  return {
    status: 'exported',
    targetRoot,
    generatedAt,
    objectCount: registryRows.length,
    databaseCount: databaseIndex.database_count,
    contextPackCount: registryRows.length,
    ssisPackageContextCount: ssisRows.length,
  };
}

async function countJsonl(filePath) {
  const content = await readFile(filePath, 'utf8');
  return content.split(/\r?\n/).filter(Boolean).length;
}

export async function validateCatalogRepo(options = {}) {
  const targetRoot = path.resolve(
    process.cwd(),
    options.targetRoot || process.env.CATALOG_REPO_PATH || DEFAULT_CATALOG_REPO_PATH
  );
  const failures = [];
  const warnings = [];
  const requiredFiles = [
    'README.md',
    'AI_README.md',
    'catalog-manifest.json',
    'schemas/object-registry.schema.json',
    'schemas/context-pack.schema.json',
    'registry/object-registry.csv',
    'registry/object-registry.jsonl',
    'registry/database-index.json',
    'registry/object-registry-summary.json',
    'reports/publish-summary.json',
  ];

  for (const file of requiredFiles) {
    // eslint-disable-next-line no-await-in-loop
    if (!(await fileExists(path.join(targetRoot, file)))) failures.push(`Missing required file: ${file}`);
  }

  let manifest = {};
  let rows = [];
  if (failures.length === 0) {
    manifest = JSON.parse(await readFile(path.join(targetRoot, 'catalog-manifest.json'), 'utf8'));
    const jsonl = await readFile(path.join(targetRoot, 'registry/object-registry.jsonl'), 'utf8');
    rows = jsonl
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => JSON.parse(line));
    const csvLineCount =
      (await readFile(path.join(targetRoot, 'registry/object-registry.csv'), 'utf8'))
        .split(/\r?\n/)
        .filter(Boolean).length - 1;
    const jsonlCount = await countJsonl(path.join(targetRoot, 'registry/object-registry.jsonl'));
    if (jsonlCount !== manifest.object_count) {
      failures.push(`Registry JSONL count ${jsonlCount} does not match manifest ${manifest.object_count}.`);
    }
    if (csvLineCount !== manifest.object_count) {
      failures.push(`Registry CSV count ${csvLineCount} does not match manifest ${manifest.object_count}.`);
    }
  }

  const seenIds = new Set();
  const seenContextPaths = new Map();
  for (const row of rows) {
    if (seenIds.has(row.object_id)) failures.push(`Duplicate object_id: ${row.object_id}`);
    seenIds.add(row.object_id);
    if (!row.context_pack_path || !row.context_pack_json_path) {
      failures.push(`Missing context pack path for ${row.object_id}`);
      continue;
    }
    for (const contextPath of [row.context_pack_path, row.context_pack_json_path]) {
      const normalizedContextPath = normalizePathForManifest(contextPath).toLowerCase();
      const existingObjectId = seenContextPaths.get(normalizedContextPath);
      if (existingObjectId && existingObjectId !== row.object_id) {
        failures.push(
          `Case-insensitive duplicate context path: ${contextPath} for ${row.object_id} and ${existingObjectId}`
        );
      }
      seenContextPaths.set(normalizedContextPath, row.object_id);
    }
    // eslint-disable-next-line no-await-in-loop
    if (!(await fileExists(path.join(targetRoot, row.context_pack_path)))) {
      failures.push(`Missing context pack markdown for ${row.object_id}: ${row.context_pack_path}`);
    }
    // eslint-disable-next-line no-await-in-loop
    if (!(await fileExists(path.join(targetRoot, row.context_pack_json_path)))) {
      failures.push(`Missing context pack json for ${row.object_id}: ${row.context_pack_json_path}`);
    }
  }

  if (rows.length > 0 && rows.length !== seenIds.size) {
    warnings.push('Duplicate object IDs were found; see failures for details.');
  }

  const generatedFiles = [];
  for (const file of GENERATED_ROOT_FILES) {
    // eslint-disable-next-line no-await-in-loop
    if (await fileExists(path.join(targetRoot, file))) generatedFiles.push(file);
  }
  for (const directory of GENERATED_DIRECTORIES) {
    if (await fileExists(path.join(targetRoot, directory))) {
      // eslint-disable-next-line no-await-in-loop
      generatedFiles.push(...(await listFilesRecursive(targetRoot, directory)));
    }
  }

  const seenGeneratedPaths = new Map();
  let longestGeneratedPath = '';
  for (const file of generatedFiles) {
    if (file.length > longestGeneratedPath.length) longestGeneratedPath = file;
    const normalizedFile = file.toLowerCase();
    const existingFile = seenGeneratedPaths.get(normalizedFile);
    if (existingFile && existingFile !== file) {
      failures.push(`Case-insensitive duplicate generated path: ${existingFile} and ${file}`);
    }
    seenGeneratedPaths.set(normalizedFile, file);
    if (file.length > CATALOG_REPO_PATH_FAILURE_LENGTH) {
      failures.push(
        `Generated path exceeds ${CATALOG_REPO_PATH_FAILURE_LENGTH} characters: ${file.length} ${file}`
      );
    } else if (file.length > CATALOG_REPO_PATH_WARNING_LENGTH) {
      warnings.push(
        `Generated path exceeds ${CATALOG_REPO_PATH_WARNING_LENGTH} characters: ${file.length} ${file}`
      );
    }
  }

  return {
    status: failures.length === 0 ? 'ok' : 'failed',
    targetRoot,
    objectCount: rows.length,
    manifestObjectCount: manifest.object_count || 0,
    generatedFileCount: generatedFiles.length,
    longestGeneratedPath: longestGeneratedPath
      ? {
          length: longestGeneratedPath.length,
          path: longestGeneratedPath,
        }
      : null,
    failures,
    warnings,
  };
}

export default {
  exportCatalogRepo,
  validateCatalogRepo,
};
