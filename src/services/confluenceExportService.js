/**
 * Confluence Export Service
 * Builds a Confluence-ready lineage repository from the markdown catalog.
 */

import { createHash } from 'crypto';
import { once } from 'events';
import { createReadStream, createWriteStream } from 'fs';
import { mkdir, readFile, rm, writeFile } from 'fs/promises';
import path from 'path';
import { Readable } from 'stream';
import { setTimeout as delay } from 'timers/promises';
import yaml from 'yaml';
import { ZipArchive } from 'archiver';

import { loadRuntimeCatalog } from './catalogRuntimeService.js';
import { getMarkdownFiles } from './markdownService.js';
import {
  getDownstreamDependents,
  getUpstreamDependencies,
} from './lineageService.js';

const DEFAULT_MARKDOWN_ROOT = './data/markdown';
const DEFAULT_EXPORT_ROOT = './data/confluence/export';
const DEFAULT_CONFLUENCE_BASE_URL = 'https://sonicautomotive.atlassian.net/wiki';
const DEFAULT_CONFLUENCE_SPACE_KEY = 'TDE';
const DEFAULT_CONFLUENCE_PARENT_PAGE_ID = '2221670415';
const DEFAULT_CATALOG_REPO_REMOTE =
  'https://sonicapplicationdevelopment@dev.azure.com/sonicapplicationdevelopment/Data%20Warehouse/_git/Sonic-data-lineage';
const DEFAULT_SHARD_OBJECT_LIMIT = 150;
const DEFAULT_SHARD_MAX_BYTES = 250_000;
const MANIFEST_FILE_NAME = 'confluence-export-manifest.json';
const OBJECT_INDEX_PREVIEW_LIMIT = 500;
const SHARD_NEIGHBOR_LIMIT = 25;
const SHARD_RISK_PREVIEW_LIMIT = 25;
const DEFAULT_QUICK_CONTEXT_OBJECT_LIMIT = 250;
const DEFAULT_QUICK_CONTEXT_MAX_BYTES = 180_000;
const QUICK_CONTEXT_NEIGHBOR_LIMIT = 15;
const DEFAULT_OBJECT_LOCATOR_OBJECT_LIMIT = 500;
const DEFAULT_OBJECT_LOCATOR_MAX_BYTES = 120_000;
const DEFAULT_GOVERNED_OBJECT_PAGE_LIMIT = 100;
const GOVERNED_ASSET_COLUMN_PREVIEW_LIMIT = 25;
const CONTEXT_PAGE_ENTRY_OVERHEAD_BYTES = 300;
const SHARD_PAGE_ENTRY_OVERHEAD_BYTES = 250;
const OBJECT_REGISTRY_HEADERS = [
  'object_id',
  'system',
  'database',
  'schema',
  'name',
  'type',
  'owner',
  'steward',
  'domain',
  'criticality',
  'classification',
  'upstream_count',
  'downstream_count',
  'confidence',
  'confidence_label',
  'refresh_timestamp',
  'quick_context_page',
  'shard_page',
];

function nowIso() {
  return new Date().toISOString();
}

function sha256(content) {
  return createHash('sha256').update(content).digest('hex');
}

async function hashFile(filePath) {
  const hash = createHash('sha256');
  let bytes = 0;

  await new Promise((resolve, reject) => {
    const stream = createReadStream(filePath);
    stream.on('data', (chunk) => {
      hash.update(chunk);
      bytes += chunk.length;
    });
    stream.on('error', reject);
    stream.on('end', resolve);
  });

  return {
    hash: hash.digest('hex'),
    bytes,
  };
}

function normalizePathForManifest(filePath) {
  return filePath.replace(/\\/g, '/');
}

function safeSegment(value, fallback = 'unknown') {
  const cleaned = String(value || fallback)
    .trim()
    .split('')
    .map((char) => (char.charCodeAt(0) < 32 || /[<>:"/\\|?*]/.test(char) ? '_' : char))
    .join('')
    .replace(/\s+/g, '_')
    .slice(0, 180);
  return cleaned || fallback;
}

function relativeTo(root, filePath) {
  return normalizePathForManifest(path.relative(root, filePath));
}

function objectIdFor(mapKey, object = {}) {
  return String(object.id || mapKey || '').trim();
}

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

function countField(object, arrayField, countFieldName) {
  const countValue = object?.[countFieldName];
  if (typeof countValue === 'number' && Number.isFinite(countValue)) {
    return countValue;
  }
  return ensureArray(object?.[arrayField]).length;
}

function confidenceLabel(object = {}) {
  return object.catalog_confidence?.confidence_label || 'missing';
}

function confidenceScore(object = {}) {
  const score = object.catalog_confidence?.overall_score;
  return typeof score === 'number' ? score : null;
}

function compactDisplayValue(value, fallback = '') {
  return String(value ?? fallback).replace(/\s+/g, ' ').trim();
}

function csvCell(value) {
  const text = compactDisplayValue(value);
  if (/[",\r\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function csvTable(headers, rows) {
  return [
    headers.map(csvCell).join(','),
    ...rows.map((row) => headers.map((header) => csvCell(row[header])).join(',')),
  ].join('\n');
}

function catalogRepoUrl() {
  return process.env.CATALOG_REPO_REMOTE || DEFAULT_CATALOG_REPO_REMOTE;
}

function aiRerouteBlock() {
  return [
    '## AI / Automation Routing',
    '',
    'This Confluence page is for human navigation, search, and governance review.',
    '',
    'AI assistants and automation should use the DevOps lineage catalog first:',
    '',
    `- Repository: ${catalogRepoUrl()}`,
    '- Registry: `registry/object-registry.jsonl` or `registry/object-registry.csv`',
    '- Targeted context packs: use the `context_pack_path` from the registry row',
    '- Confluence should be used for human explanation, not full-corpus machine retrieval',
    '',
  ].join('\n');
}

function confidenceDistribution(objects) {
  const distribution = {
    very_high: 0,
    high: 0,
    medium: 0,
    low: 0,
    needs_review: 0,
    missing: 0,
  };

  for (const object of objects.values()) {
    const label = confidenceLabel(object);
    if (Object.prototype.hasOwnProperty.call(distribution, label)) {
      distribution[label] += 1;
    } else {
      distribution.missing += 1;
    }
  }

  return distribution;
}

function groupCounts(objects, fieldName) {
  const counts = new Map();
  for (const object of objects.values()) {
    const value = String(object[fieldName] || 'unknown').trim() || 'unknown';
    counts.set(value, (counts.get(value) || 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((left, right) => right.count - left.count || left.name.localeCompare(right.name));
}

function summarizeObject(object, id, shard = null) {
  return {
    id,
    name: object.name || id,
    server: object.server || '',
    database: object.database || '',
    schema: object.schema || '',
    type: object.type || 'object',
    confidence_label: confidenceLabel(object),
    confidence_score: confidenceScore(object),
    upstream_edges: [
      ...ensureArray(object.depends_on),
      ...ensureArray(object.reads_from),
      ...ensureArray(object.created_by),
      ...ensureArray(object.created_via),
      ...ensureArray(object.contextual_reads),
    ].length,
    downstream_edges: [
      ...ensureArray(object.writes_to),
      ...ensureArray(object.used_by),
      ...ensureArray(object.calls),
    ].length,
    shard_title: shard?.title || '',
    shard_file: shard?.file || '',
  };
}

function objectDomain(object = {}) {
  return (
    compactDisplayValue(object.domain || object.data_domain || object.business_domain) ||
    compactDisplayValue(object.domain_manager) ||
    compactDisplayValue(object.database) ||
    'unknown'
  );
}

function objectClassification(object = {}) {
  return compactDisplayValue(object.classification || object.sensitivity, 'public') || 'public';
}

function objectCriticality(object = {}) {
  const name = compactDisplayValue(object.name).toLowerCase();
  const tags = ensureArray(object.tags).join('|').toLowerCase();
  if (object.certified === true) return 'certified';
  if (/(executive|regulatory|kpi|metric|scorecard|dashboard)/i.test(`${name}|${tags}`)) {
    return 'critical_reporting';
  }
  if (/^(dim|fact)[a-z0-9_]/i.test(name) || /(dimension|fact)/i.test(tags)) {
    return 'dimensional_model';
  }
  if (objectClassification(object) !== 'public') return 'classified';
  if (compactDisplayValue(object.steward || object.domain_manager || object.custodian)) {
    return 'governed';
  }
  return 'standard';
}

function buildObjectRegistryRow({ entry, graph, generatedAt, quickContext, shard }) {
  const object = entry.object;
  const id = entry.id;
  return {
    object_id: id,
    system: compactDisplayValue(object.server, 'unknown'),
    database: compactDisplayValue(object.database, 'unknown'),
    schema: compactDisplayValue(object.schema),
    name: compactDisplayValue(object.name, id),
    type: compactDisplayValue(object.type, 'object'),
    owner: compactDisplayValue(object.owner, 'unknown'),
    steward: compactDisplayValue(object.steward || object.domain_manager || object.custodian),
    domain: objectDomain(object),
    criticality: objectCriticality(object),
    classification: objectClassification(object),
    upstream_count: getUpstreamDependencies(id, graph, 1).length,
    downstream_count: getDownstreamDependents(id, graph, 1).length,
    confidence: confidenceScore(object),
    confidence_label: confidenceLabel(object),
    refresh_timestamp: generatedAt,
    quick_context_page: quickContext?.title || '',
    shard_page: shard?.title || '',
  };
}

function markdownTable(headers, rows) {
  const header = `| ${headers.join(' | ')} |`;
  const separator = `| ${headers.map(() => '---').join(' | ')} |`;
  const body = rows.map((row) => `| ${row.map((cell) => String(cell ?? '')).join(' | ')} |`);
  return [header, separator, ...body].join('\n');
}

function renderReadmePage({ generatedAt, rootPageUrl, summary }) {
  return [
    '# Sonic Data Lineage Repository',
    '',
    '> This page set is generated by the Data Governance Platform. Edit source markdown or extractor logic, not generated Confluence pages.',
    '',
    '## Purpose',
    '',
    'This repository gives humans and Codex-style assistants a stable, evidence-backed lineage corpus for SQL Server and SSIS assets.',
    '',
    '## How To Use This Repository',
    '',
    '- Start with the object index when you know a table, view, procedure, or package name.',
    '- Use the rebuild report to check confidence, unresolved facts, and edge deltas.',
    '- Use catalog shard pages for Rovo/Codex-readable lineage context.',
    '- Use the attached catalog bundle as a backup/export artifact, not as the primary Rovo corpus.',
    '',
    aiRerouteBlock(),
    '',
    '## Generated Assets',
    '',
    markdownTable(
      ['Asset', 'Count'],
      [
        ['Summary page candidates', summary.summaryPageCount],
        ['Object locator page candidates', summary.objectLocatorPageCount],
        ['Lineage quick context page candidates', summary.quickContextPageCount],
        ['Catalog shard page candidates', summary.shardPageCount],
        ['Attachment candidates', summary.attachmentCount],
        ['Objects indexed in shards', summary.objectCount],
      ]
    ),
    '',
    '## Repository Root',
    '',
    rootPageUrl ? `- ${rootPageUrl}` : '- Set CONFLUENCE_PARENT_PAGE_ID and CONFLUENCE_BASE_URL before live sync.',
    '',
    `Generated at: ${generatedAt}`,
    '',
  ].join('\n');
}

function renderConfidenceGuide() {
  return [
    '# Catalog Confidence Guide',
    '',
    'Confidence scores are generated from the markdown catalog and expose how trustworthy each extracted lineage object appears to be.',
    '',
    '## Labels',
    '',
    markdownTable(
      ['Label', 'Meaning'],
      [
        ['very_high', 'Strong canonical object identity, validated edges, and low unresolved risk.'],
        ['high', 'Good confidence with small or explainable unresolved areas.'],
        ['medium', 'Usable for exploration, but review diagnostics before change decisions.'],
        ['low', 'Object-level lineage exists but important facts are unresolved or weak.'],
        ['needs_review', 'Do not rely on this object without human review.'],
        ['missing', 'No catalog confidence record was generated.'],
      ]
    ),
    '',
    '## AI Guidance',
    '',
    '- Prefer validated edges and validated column lineage.',
    '- Surface unresolved facts and risk flags in answers instead of hiding them.',
    '- Treat low and needs_review objects as review candidates, not failures.',
    '- For column changes, cite the process ID, object ID, evidence type, and evidence text.',
    '',
  ].join('\n');
}

function renderSourceInventoryPage({ objects, generatedAt }) {
  const servers = groupCounts(objects, 'server');
  const databases = groupCounts(objects, 'database');
  const types = groupCounts(objects, 'type');
  const distribution = confidenceDistribution(objects);

  return [
    '# Source System Inventory',
    '',
    `Generated at: ${generatedAt}`,
    '',
    '## Object Counts By Server',
    '',
    markdownTable(['Server', 'Objects'], servers.map((item) => [item.name, item.count])),
    '',
    '## Object Counts By Database',
    '',
    markdownTable(['Database', 'Objects'], databases.map((item) => [item.name, item.count])),
    '',
    '## Object Counts By Type',
    '',
    markdownTable(['Type', 'Objects'], types.map((item) => [item.name, item.count])),
    '',
    '## Confidence Distribution',
    '',
    markdownTable(
      ['Label', 'Objects'],
      Object.entries(distribution).map(([label, count]) => [label, count])
    ),
    '',
  ].join('\n');
}

function renderGovernancePortalPage({
  objectRows,
  registryRows,
  governedAssetDefinitions,
  generatedAt,
}) {
  const certifiedRows = registryRows
    .filter((row) => row.criticality === 'certified')
    .slice(0, 25);
  const criticalRows = registryRows
    .filter((row) => ['critical_reporting', 'dimensional_model', 'classified'].includes(row.criticality))
    .slice(0, 25);
  const stewardRows = registryRows
    .filter((row) => row.steward)
    .slice(0, 25);

  return [
    '# Governance Portal',
    '',
    `Generated at: ${generatedAt}`,
    '',
    aiRerouteBlock(),
    '',
    '## Layered Repository Design',
    '',
    markdownTable(
      ['Layer', 'Purpose', 'Primary Artifact'],
      [
        [
          'Authoritative object registry',
          'One machine-readable row per object for search, automation, and AI lookup.',
          'catalog-object-registry.json / catalog-object-registry.csv',
        ],
        [
          'Human governance portal',
          'Curated navigation for domains, systems, confidence, stewardship, known risks, and rebuild health.',
          'README, Governance Portal, Source System Inventory, Confidence Guide, Latest Rebuild Report',
        ],
        [
          'Search-optimized index pages',
          'Compact Confluence pages that answer what an object is and where to go next.',
          'Object Locator and Lineage Quick Context pages',
        ],
        [
          'Governed asset detail pages',
          'Dedicated detail pages only for certified, critical, classified, reporting, dimensional, or stewarded assets.',
          `${governedAssetDefinitions.length} governed asset pages`,
        ],
        [
          'Machine-readable attachments',
          'JSON/CSV manifests for tools and AI agents; Confluence pages remain explanatory evidence.',
          'Registry, export summary, object index, catalog bundle',
        ],
      ]
    ),
    '',
    '## Certified Assets',
    '',
    certifiedRows.length
      ? markdownTable(
          ['Object ID', 'Type', 'Domain', 'Confidence', 'Quick Context'],
          certifiedRows.map((row) => [
            `\`${row.object_id}\``,
            row.type,
            row.domain,
            `${row.confidence_label}${row.confidence === null ? '' : ` (${row.confidence})`}`,
            row.quick_context_page,
          ])
        )
      : '- No certified assets were found in the current registry.',
    '',
    '## Critical Or Classified Assets',
    '',
    criticalRows.length
      ? markdownTable(
          ['Object ID', 'Type', 'Criticality', 'Classification', 'Steward'],
          criticalRows.map((row) => [
            `\`${row.object_id}\``,
            row.type,
            row.criticality,
            row.classification,
            row.steward || row.owner,
          ])
        )
      : '- No critical/classified assets were found in the current registry.',
    '',
    '## Stewardship Coverage',
    '',
    stewardRows.length
      ? markdownTable(
          ['Object ID', 'Domain', 'Owner', 'Steward', 'Confidence'],
          stewardRows.map((row) => [
            `\`${row.object_id}\``,
            row.domain,
            row.owner,
            row.steward,
            row.confidence_label,
          ])
        )
      : '- No stewarded assets were found in the current registry.',
    '',
    '## Repository Scale',
    '',
    markdownTable(
      ['Metric', 'Count'],
      [
        ['Objects in authoritative registry', objectRows.length],
        ['Governed detail pages', governedAssetDefinitions.length],
        ['Certified registry rows', certifiedRows.length],
        ['Critical/classified preview rows', criticalRows.length],
        ['Stewarded preview rows', stewardRows.length],
      ]
    ),
    '',
  ].join('\n');
}

function renderObjectIndexPage({ objectRows, generatedAt }) {
  const previewRows = objectRows.slice(0, OBJECT_INDEX_PREVIEW_LIMIT);
  return [
    '# Object Index',
    '',
    `Generated at: ${generatedAt}`,
    '',
    aiRerouteBlock(),
    '',
    `Total objects: ${objectRows.length}`,
    '',
    `The table below previews the first ${previewRows.length} objects. Use [AUTO] Object Locator pages first to resolve an object name to its exact quick-context page, then use [AUTO] Lineage Quick Context pages for table/package lineage from Confluence page bodies. The complete machine-readable index is also published as an attachment and every object maps to a catalog shard page.`,
    '',
    markdownTable(
      ['Object ID', 'Type', 'Database', 'Confidence', 'Shard', 'Upstream', 'Downstream'],
      previewRows.map((row) => [
        `\`${row.id}\``,
        row.type,
        row.database,
        `${row.confidence_label}${row.confidence_score === null ? '' : ` (${row.confidence_score})`}`,
        row.shard_title,
        row.upstream_edges,
        row.downstream_edges,
      ])
    ),
    '',
  ].join('\n');
}

function groupRegistryRowsByDatabase(registryRows) {
  const groups = new Map();
  for (const row of registryRows) {
    const database = compactDisplayValue(row.database, 'unknown') || 'unknown';
    if (!groups.has(database)) groups.set(database, []);
    groups.get(database).push(row);
  }

  return Array.from(groups.entries()).sort(([left], [right]) => left.localeCompare(right));
}

function buildDatabasePageEntries(databaseGroups) {
  const titleCounts = new Map();
  for (const [database] of databaseGroups) {
    const titleKey = `[auto] database - ${database}`.toLowerCase();
    titleCounts.set(titleKey, (titleCounts.get(titleKey) || 0) + 1);
  }

  return databaseGroups.map(([database, rows]) => {
    const titleKey = `[auto] database - ${database}`.toLowerCase();
    const hasCaseInsensitiveTitleConflict = titleCounts.get(titleKey) > 1;
    const hash = sha256(database).slice(0, 8);

    return {
      database,
      rows,
      title: hasCaseInsensitiveTitleConflict
        ? `[AUTO] Database - ${database} [db ${hash}]`.slice(0, 240)
        : `[AUTO] Database - ${database}`.slice(0, 240),
      fileSegment: hasCaseInsensitiveTitleConflict
        ? `${safeSegment(database)}--${hash}`
        : safeSegment(database),
      hasCaseInsensitiveTitleConflict,
    };
  });
}

function countRowsByField(rows, fieldName) {
  const counts = new Map();
  for (const row of rows) {
    const value = compactDisplayValue(row[fieldName], 'unknown') || 'unknown';
    counts.set(value, (counts.get(value) || 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((left, right) => right.count - left.count || left.name.localeCompare(right.name));
}

function renderDatabasesIndexPage({ databasePageEntries, generatedAt }) {
  return [
    '# Databases',
    '',
    `Generated at: ${generatedAt}`,
    '',
    aiRerouteBlock(),
    '',
    'Start here when you know the source database or warehouse area. Each database page gives human navigation, counts, and high-impact objects; the DevOps registry remains the complete machine-readable index.',
    '',
    markdownTable(
      ['Database', 'Objects', 'Primary Types', 'Page'],
      databasePageEntries.map(({ database, rows, title }) => [
        database,
        rows.length,
        countRowsByField(rows, 'type')
          .slice(0, 5)
          .map((item) => `${item.name}: ${item.count}`)
          .join(', '),
        title,
      ])
    ),
    '',
  ].join('\n');
}

function renderDatabasePage({ database, rows, generatedAt }) {
  const topRows = rows
    .slice()
    .sort(
      (left, right) =>
        Number(right.downstream_count || 0) - Number(left.downstream_count || 0) ||
        String(left.object_id).localeCompare(String(right.object_id))
    )
    .slice(0, 250);

  return [
    `# Database: ${database}`,
    '',
    `Generated at: ${generatedAt}`,
    '',
    aiRerouteBlock(),
    '',
    '## Counts By Type',
    '',
    markdownTable(
      ['Type', 'Objects'],
      countRowsByField(rows, 'type').map((item) => [item.name, item.count])
    ),
    '',
    '## Counts By Schema',
    '',
    markdownTable(
      ['Schema', 'Objects'],
      countRowsByField(rows, 'schema')
        .slice(0, 100)
        .map((item) => [item.name, item.count])
    ),
    '',
    '## Highest Impact Objects',
    '',
    markdownTable(
      ['Object ID', 'Type', 'Schema', 'Downstream', 'Confidence', 'Quick Context'],
      topRows.map((row) => [
        `\`${row.object_id}\``,
        row.type,
        row.schema,
        row.downstream_count,
        row.confidence_label,
        row.quick_context_page,
      ])
    ),
    rows.length > topRows.length
      ? `\nOnly the top ${topRows.length} high-impact objects are listed here. Use the DevOps registry for the complete database inventory.`
      : '',
    '',
  ].join('\n');
}

function quickContextAliases(object, id) {
  const aliases = new Set(
    [
      object.name,
      object.schema && object.name ? `${object.schema}.${object.name}` : '',
      object.database && object.schema && object.name
        ? `${object.database}.${object.schema}.${object.name}`
        : '',
      id,
    ]
      .map((value) => String(value || '').trim())
      .filter(Boolean)
  );
  return Array.from(aliases);
}

function buildQuickContextRecord({ object, id, graph, markdownRoot, shard }) {
  const allUpstream = getUpstreamDependencies(id, graph, 1);
  const allDownstream = getDownstreamDependents(id, graph, 1);
  const columns = ensureArray(object.columns);

  return {
    object_id: id,
    aliases: quickContextAliases(object, id),
    name: object.name || id,
    server: object.server || '',
    database: object.database || '',
    schema: object.schema || '',
    type: object.type || 'object',
    confidence_label: confidenceLabel(object),
    confidence_score: confidenceScore(object),
    direct_upstream_count: allUpstream.length,
    direct_upstream: allUpstream.slice(0, QUICK_CONTEXT_NEIGHBOR_LIMIT),
    direct_upstream_truncated: allUpstream.length > QUICK_CONTEXT_NEIGHBOR_LIMIT,
    direct_downstream_count: allDownstream.length,
    direct_downstream: allDownstream.slice(0, QUICK_CONTEXT_NEIGHBOR_LIMIT),
    direct_downstream_truncated: allDownstream.length > QUICK_CONTEXT_NEIGHBOR_LIMIT,
    column_count: countField(object, 'columns', 'column_count'),
    column_usage_count: countField(object, 'column_usage', 'column_usage_count'),
    column_lineage_count: countField(object, 'column_lineage', 'column_lineage_count'),
    unresolved_column_usage_count: countField(
      object,
      'unresolved_column_usage',
      'unresolved_column_usage_count'
    ),
    unresolved_column_lineage_count: countField(
      object,
      'unresolved_column_lineage',
      'unresolved_column_lineage_count'
    ),
    unresolved_ssis_column_mapping_count: countField(
      object,
      'unresolved_ssis_column_mappings',
      'unresolved_ssis_column_mapping_count'
    ),
    risk_flag_count: countField(object, 'column_risk_flags', 'column_risk_flag_count'),
    shard_title: shard?.title || '',
    shard_file: shard?.file || '',
    source_markdown_path: relativeSourcePath(markdownRoot, object.filePath),
  };
}

function quickContextRange(entries) {
  const first = entries[0]?.object?.name || entries[0]?.id || '';
  const last = entries[entries.length - 1]?.object?.name || entries[entries.length - 1]?.id || '';
  if (!first && !last) return 'unknown';
  if (first === last) return titleSegment(first);
  return `${titleSegment(first, 'unknown')} to ${titleSegment(last, 'unknown')}`;
}

function buildQuickContextTitle(number, entries) {
  return `[AUTO] Lineage Quick Context ${String(number).padStart(3, '0')} - ${quickContextRange(
    entries
  )}`.slice(0, 240);
}

function renderQuickContextPage({ page, graph, markdownRoot, shardLookup, generatedAt }) {
  const lines = [
    `# ${page.title.replace(/^\[AUTO\]\s*/, '')}`,
    '',
    '> Fast Confluence lookup page for AI lineage questions. Use this before reading catalog shards.',
    '',
    `- Generated At: ${generatedAt}`,
    `- Page Number: ${page.number}`,
    `- Object Count: ${page.entries.length}`,
    `- Range: ${quickContextRange(page.entries)}`,
    '',
    '## How To Use This Page',
    '',
    aiRerouteBlock(),
    '',
    '- Search by object name, schema-qualified name, or fully-qualified object ID.',
    '- Use direct_upstream and direct_downstream for table/package lineage answers.',
    '- Use shard_title only when column detail or deeper evidence is required.',
    '',
    '## Objects',
    '',
  ];

  for (const entry of page.entries) {
    const context = buildQuickContextRecord({
      object: entry.object,
      id: entry.id,
      graph,
      markdownRoot,
      shard: shardLookup.get(entry.id),
    });
    lines.push(
      `### ${context.name} (${entry.id})`,
      '',
      '```yaml',
      yaml.stringify(context).trim(),
      '```',
      ''
    );
  }

  return lines.join('\n');
}

function buildObjectLocatorRecord({ object, id, quickContext, shard }) {
  return {
    object_id: id,
    aliases: quickContextAliases(object, id),
    name: object.name || id,
    server: object.server || '',
    database: object.database || '',
    schema: object.schema || '',
    type: object.type || 'object',
    confidence_label: confidenceLabel(object),
    confidence_score: confidenceScore(object),
    quick_context_title: quickContext?.title || '',
    quick_context_file: quickContext?.file || '',
    shard_title: shard?.title || '',
    shard_file: shard?.file || '',
  };
}

function objectLocatorRange(entries) {
  return quickContextRange(entries);
}

function buildObjectLocatorTitle(number, entries) {
  return `[AUTO] Object Locator ${String(number).padStart(3, '0')} - ${objectLocatorRange(
    entries
  )}`.slice(0, 240);
}

function renderObjectLocatorPage({ page, quickContextLookup, shardLookup, generatedAt }) {
  const lines = [
    `# ${page.title.replace(/^\[AUTO\]\s*/, '')}`,
    '',
    '> Fast object-name locator for AI lineage questions. Read this before quick context or shard pages.',
    '',
    `- Generated At: ${generatedAt}`,
    `- Page Number: ${page.number}`,
    `- Object Count: ${page.entries.length}`,
    `- Range: ${objectLocatorRange(page.entries)}`,
    '',
    '## How To Use This Page',
    '',
    aiRerouteBlock(),
    '',
    '- Search by object name, schema-qualified name, or fully-qualified object ID.',
    '- Pick the best canonical object ID when duplicate names exist.',
    '- Then read quick_context_title for table/package lineage.',
    '- Read shard_title only when column detail or deeper evidence is required.',
    '',
    '## Objects',
    '',
  ];

  for (const entry of page.entries) {
    const record = buildObjectLocatorRecord({
      object: entry.object,
      id: entry.id,
      quickContext: quickContextLookup.get(entry.id),
      shard: shardLookup.get(entry.id),
    });
    lines.push(
      `### ${record.name} (${entry.id})`,
      '',
      '```yaml',
      yaml.stringify(record).trim(),
      '```',
      ''
    );
  }

  return lines.join('\n');
}

function renderCatalogManifestPage({ manifestJson, generatedAt }) {
  const files = Array.isArray(manifestJson.files) ? manifestJson.files : [];
  return [
    '# Catalog Manifest',
    '',
    `Generated at: ${generatedAt}`,
    '',
    `Catalog generated at: ${manifestJson.generated_at || 'unknown'}`,
    '',
    `Catalog generator: ${manifestJson.generator || 'unknown'}`,
    '',
    `Markdown files: ${files.length}`,
    '',
    '## Preview',
    '',
    ...files.slice(0, 100).map((file) => `- \`${file}\``),
    files.length > 100 ? `- ... ${files.length - 100} additional files in the attachment bundle.` : '',
    '',
  ]
    .filter((line) => line !== '')
    .join('\n');
}

function renderRebuildReportPage({ rebuildReportMarkdown, generatedAt }) {
  if (rebuildReportMarkdown) {
    return [
      '# Latest Catalog Rebuild Report',
      '',
      `Published to Confluence export at: ${generatedAt}`,
      '',
      rebuildReportMarkdown.trim(),
      '',
    ].join('\n');
  }

  return [
    '# Latest Catalog Rebuild Report',
    '',
    `Published to Confluence export at: ${generatedAt}`,
    '',
    'No rebuild report was found in the markdown catalog.',
    '',
  ].join('\n');
}

function relativeSourcePath(markdownRoot, filePath) {
  const source = String(filePath || '').trim();
  if (!source) return '';
  if (!path.isAbsolute(source)) return normalizePathForManifest(source);

  const relativePath = path.relative(markdownRoot, source);
  if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
    return normalizePathForManifest(source);
  }

  return relativeTo(markdownRoot, source);
}

function compactRiskFlags(object) {
  return ensureArray(object.column_risk_flags).slice(0, SHARD_RISK_PREVIEW_LIMIT).map((risk) => ({
    process_id: risk.process_id || risk.object_id || '',
    flag_type: risk.flag_type || risk.reason || 'risk',
    severity: risk.severity || '',
    validation_status: risk.validation_status || '',
    evidence_type: risk.evidence_type || '',
    evidence_text: risk.evidence_text || '',
  }));
}

function buildShardObjectContext({ object, id, graph, markdownRoot }) {
  const allUpstream = getUpstreamDependencies(id, graph, 1);
  const allDownstream = getDownstreamDependents(id, graph, 1);
  const upstream = allUpstream.slice(0, SHARD_NEIGHBOR_LIMIT);
  const downstream = allDownstream.slice(0, SHARD_NEIGHBOR_LIMIT);
  const columns = ensureArray(object.columns);

  return {
    object_id: id,
    name: object.name || id,
    server: object.server || '',
    database: object.database || '',
    schema: object.schema || '',
    type: object.type || 'object',
    confidence: object.catalog_confidence || null,
    upstream,
    upstream_truncated: allUpstream.length > upstream.length,
    downstream,
    downstream_truncated: allDownstream.length > downstream.length,
    source_markdown_path: relativeSourcePath(markdownRoot, object.filePath),
    column_count: countField(object, 'columns', 'column_count'),
    columns: columns.map((column) => ({
      name: column.name,
      column_id: column.column_id,
      data_type: column.data_type || '',
      nullable: column.nullable ?? null,
    })),
    column_usage_count: countField(object, 'column_usage', 'column_usage_count'),
    column_lineage_count: countField(object, 'column_lineage', 'column_lineage_count'),
    unresolved_column_usage_count: countField(
      object,
      'unresolved_column_usage',
      'unresolved_column_usage_count'
    ),
    unresolved_column_lineage_count: countField(
      object,
      'unresolved_column_lineage',
      'unresolved_column_lineage_count'
    ),
    unresolved_ssis_column_mapping_count: countField(
      object,
      'unresolved_ssis_column_mappings',
      'unresolved_ssis_column_mapping_count'
    ),
    risk_flags: compactRiskFlags(object),
    risk_flags_truncated:
      countField(object, 'column_risk_flags', 'column_risk_flag_count') >
      SHARD_RISK_PREVIEW_LIMIT,
  };
}

function renderShardPage({ shard, graph, markdownRoot, generatedAt }) {
  const lines = [
    `# ${shard.title.replace(/^\[AUTO\]\s*/, '')}`,
    '',
    '> Generated catalog shard for Rovo/Codex-readable lineage context.',
    '',
    `- Generated At: ${generatedAt}`,
    `- Shard Number: ${shard.number}`,
    `- Object Count: ${shard.entries.length}`,
    `- Group: ${shard.group.server} / ${shard.group.database} / ${shard.group.type}`,
    '',
    '## How To Read This Shard',
    '',
    aiRerouteBlock(),
    '',
    '- Search this page for a fully-qualified object ID or column name.',
    '- Use `upstream` and `downstream` for graph traversal.',
    '- Use confidence and risk fields to separate validated lineage from review items.',
    '- Use `source_markdown_path` to trace back to the source catalog file.',
    '',
    '## Objects',
    '',
  ];

  for (const entry of shard.entries) {
    const context =
      entry.context ||
      buildShardObjectContext({
        object: entry.object,
        id: entry.id,
        graph,
        markdownRoot,
      });
    lines.push(`### ${entry.id}`, '', '```yaml', yaml.stringify(context).trim(), '```', '');
  }

  return lines.join('\n');
}

async function readJsonIfExists(filePath, fallback = {}) {
  try {
    return JSON.parse(await readFile(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

async function readTextIfExists(filePath, fallback = '') {
  try {
    return await readFile(filePath, 'utf8');
  } catch {
    return fallback;
  }
}

async function writeExportFile(outputRoot, relativePath, content) {
  const fullPath = path.join(outputRoot, relativePath);
  await mkdir(path.dirname(fullPath), { recursive: true });
  await writeFile(fullPath, content, 'utf8');
  return {
    file: normalizePathForManifest(relativePath),
    hash: sha256(content),
    bytes: Buffer.byteLength(content),
  };
}

function* jsonArrayChunks(items = []) {
  yield '[\n';
  for (let index = 0; index < items.length; index += 1) {
    const comma = index === items.length - 1 ? '' : ',';
    yield `  ${JSON.stringify(items[index])}${comma}\n`;
  }
  yield ']\n';
}

async function writeExportJsonArrayFile(outputRoot, relativePath, items = []) {
  const fullPath = path.join(outputRoot, relativePath);
  await mkdir(path.dirname(fullPath), { recursive: true });

  const stream = createWriteStream(fullPath, { encoding: 'utf8' });
  const hash = createHash('sha256');
  let bytes = 0;

  const writeChunk = async (chunk) => {
    hash.update(chunk);
    bytes += Buffer.byteLength(chunk);
    if (!stream.write(chunk)) {
      await once(stream, 'drain');
    }
  };

  try {
    for (const chunk of jsonArrayChunks(items)) {
      await writeChunk(chunk);
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

  return {
    file: normalizePathForManifest(relativePath),
    hash: hash.digest('hex'),
    bytes,
  };
}

async function writeExportCsvFile(outputRoot, relativePath, headers, rows = []) {
  return writeExportFile(outputRoot, relativePath, `${csvTable(headers, rows)}\n`);
}

async function resetExportRoot(outputRoot) {
  await mkdir(outputRoot, { recursive: true });
  await Promise.all(
    ['pages', 'shards', 'attachments', 'object-context', 'runs', MANIFEST_FILE_NAME].map((entry) =>
      removeGeneratedPathWithRetry(path.join(outputRoot, entry))
    )
  );
}

async function removeGeneratedPathWithRetry(targetPath) {
  const retryable = new Set(['EPERM', 'EBUSY', 'ENOTEMPTY']);
  let lastError;

  for (let attempt = 0; attempt < 6; attempt += 1) {
    try {
      // eslint-disable-next-line no-await-in-loop
      await rm(targetPath, { recursive: true, force: true });
      return;
    } catch (err) {
      lastError = err;
      if (!retryable.has(err.code) || attempt === 5) {
        throw err;
      }
      // eslint-disable-next-line no-await-in-loop
      await delay(250 * (attempt + 1));
    }
  }

  throw lastError;
}

function buildRootPageUrl(config) {
  const baseUrl = String(config.confluenceBaseUrl || '').replace(/\/$/, '');
  const parentPageId = String(config.parentPageId || '').trim();
  if (!baseUrl || !parentPageId) return '';
  return `${baseUrl}/spaces/${config.spaceKey || 'TDE'}/pages/${parentPageId}`;
}

function pageRecord(title, fileInfo, extra = {}) {
  return {
    title,
    content_type: 'page',
    labels: ['data-lineage', 'generated', 'lineage-catalog', ...(extra.labels || [])],
    publish: extra.publish !== false,
    ...(extra.parentTitle ? { parent_title: extra.parentTitle } : {}),
    ...fileInfo,
  };
}

function attachmentRecord(fileName, fileInfo, extra = {}) {
  return {
    file_name: fileName,
    content_type: extra.contentType || 'application/octet-stream',
    labels: ['data-lineage', 'generated', 'lineage-catalog', ...(extra.labels || [])],
    publish: extra.publish !== false,
    ...fileInfo,
  };
}

function titleSegment(value, fallback = 'unknown') {
  return String(value || fallback)
    .trim()
    .replace(/\s+/g, ' ')
    .slice(0, 60);
}

function sortedObjectEntries(objects) {
  return Array.from(objects.entries())
    .map(([mapKey, object]) => ({
      mapKey,
      object,
      id: objectIdFor(mapKey, object),
      group: {
        server: object.server || 'unknown_server',
        database: object.database || 'unknown_database',
        type: object.type || 'object',
      },
    }))
    .sort((left, right) => {
      const leftKey = [
        left.group.server,
        left.group.database,
        left.group.type,
        left.object.schema || '',
        left.object.name || left.id,
        left.id,
      ].join('|');
      const rightKey = [
        right.group.server,
        right.group.database,
        right.group.type,
        right.object.schema || '',
        right.object.name || right.id,
        right.id,
      ].join('|');
      return leftKey.localeCompare(rightKey);
    });
}

function groupObjectEntries(entries) {
  const groups = new Map();
  for (const entry of entries) {
    const key = [entry.group.server, entry.group.database, entry.group.type].join('|');
    if (!groups.has(key)) {
      groups.set(key, {
        ...entry.group,
        entries: [],
      });
    }
    groups.get(key).entries.push(entry);
  }
  return Array.from(groups.values());
}

function buildShardTitle(number, group, partNumber, partCount) {
  const parts = [
    '[AUTO] Catalog Shard',
    String(number).padStart(3, '0'),
    '-',
    titleSegment(group.server),
    titleSegment(group.database),
    titleSegment(group.type),
  ];
  if (partCount > 1) {
    parts.push(`part ${String(partNumber).padStart(2, '0')}`);
  }
  return parts.join(' ').slice(0, 240);
}

function buildShardDefinitions(entries, options) {
  const { artifactRoot, graph, markdownRoot, shardObjectLimit, shardMaxBytes } = options;
  const limit = Math.max(25, Number(shardObjectLimit) || DEFAULT_SHARD_OBJECT_LIMIT);
  const maxBytes = Math.max(50_000, Number(shardMaxBytes) || DEFAULT_SHARD_MAX_BYTES);
  const shards = [];
  let shardNumber = 1;

  for (const group of groupObjectEntries(entries)) {
    const contextualEntries = group.entries.map((entry) => {
      const context = buildShardObjectContext({
        object: entry.object,
        id: entry.id,
        graph,
        markdownRoot,
      });
      return {
        ...entry,
        estimatedBytes:
          Buffer.byteLength(yaml.stringify(context), 'utf8') + SHARD_PAGE_ENTRY_OVERHEAD_BYTES,
      };
    });
    const chunks = [];
    let currentChunk = [];
    let currentBytes = 0;

    for (const entry of contextualEntries) {
      const wouldExceedCount = currentChunk.length >= limit;
      const wouldExceedBytes =
        currentChunk.length > 0 && currentBytes + entry.estimatedBytes > maxBytes;
      if (wouldExceedCount || wouldExceedBytes) {
        chunks.push(currentChunk);
        currentChunk = [];
        currentBytes = 0;
      }
      currentChunk.push(entry);
      currentBytes += entry.estimatedBytes;
    }
    if (currentChunk.length > 0) {
      chunks.push(currentChunk);
    }

    const chunkCount = chunks.length;
    for (let index = 0; index < chunks.length; index += 1) {
      const partNumber = index + 1;
      const shardEntries = chunks[index];
      const title = buildShardTitle(shardNumber, group, partNumber, chunkCount);
      const file = normalizePathForManifest(
        path.join(
          artifactRoot,
          'shards',
          `${String(shardNumber).padStart(3, '0')}__${safeSegment(group.server)}__${safeSegment(
            group.database
          )}__${safeSegment(group.type)}__part_${String(partNumber).padStart(2, '0')}.md`
        )
      );
      shards.push({
        number: shardNumber,
        title,
        file,
        group: {
          server: group.server,
          database: group.database,
          type: group.type,
        },
        entries: shardEntries,
      });
      shardNumber += 1;
    }
  }

  return shards;
}

function buildShardLookup(shards) {
  const lookup = new Map();
  for (const shard of shards) {
    for (const entry of shard.entries) {
      lookup.set(entry.id, {
        title: shard.title,
        file: shard.file,
      });
    }
  }
  return lookup;
}

function quickContextSortKey(entry) {
  return [
    entry.object.name || entry.id,
    entry.group.server,
    entry.group.database,
    entry.group.type,
    entry.object.schema || '',
    entry.id,
  ]
    .join('|')
    .toLowerCase();
}

function buildQuickContextDefinitions(entries, options) {
  const {
    artifactRoot,
    graph,
    markdownRoot,
    quickContextObjectLimit,
    quickContextMaxBytes,
    shardLookup,
  } = options;
  const limit = Math.max(25, Number(quickContextObjectLimit) || DEFAULT_QUICK_CONTEXT_OBJECT_LIMIT);
  const maxBytes = Math.max(50_000, Number(quickContextMaxBytes) || DEFAULT_QUICK_CONTEXT_MAX_BYTES);
  const contextualEntries = entries
    .map((entry) => {
      const context = buildQuickContextRecord({
        object: entry.object,
        id: entry.id,
        graph,
        markdownRoot,
        shard: shardLookup.get(entry.id),
      });
      return {
        ...entry,
        estimatedBytes:
          Buffer.byteLength(yaml.stringify(context), 'utf8') + CONTEXT_PAGE_ENTRY_OVERHEAD_BYTES,
      };
    })
    .sort((left, right) => quickContextSortKey(left).localeCompare(quickContextSortKey(right)));

  const pages = [];
  let currentEntries = [];
  let currentBytes = 0;

  function pushPage() {
    if (currentEntries.length === 0) return;
    const number = pages.length + 1;
    pages.push({
      number,
      title: buildQuickContextTitle(number, currentEntries),
      file: normalizePathForManifest(
        path.join(
          artifactRoot,
          'quick-context',
          `${String(number).padStart(3, '0')}__${safeSegment(quickContextRange(currentEntries))}.md`
        )
      ),
      entries: currentEntries,
    });
    currentEntries = [];
    currentBytes = 0;
  }

  for (const entry of contextualEntries) {
    const wouldExceedCount = currentEntries.length >= limit;
    const wouldExceedBytes =
      currentEntries.length > 0 && currentBytes + entry.estimatedBytes > maxBytes;
    if (wouldExceedCount || wouldExceedBytes) pushPage();
    currentEntries.push(entry);
    currentBytes += entry.estimatedBytes;
  }
  pushPage();

  return pages;
}

function buildPageLookup(pages) {
  const lookup = new Map();
  for (const page of pages) {
    for (const entry of page.entries || []) {
      lookup.set(entry.id, {
        title: page.title,
        file: page.file,
      });
    }
  }
  return lookup;
}

function buildObjectLocatorDefinitions(entries, options) {
  const {
    artifactRoot,
    objectLocatorObjectLimit,
    objectLocatorMaxBytes,
    quickContextLookup,
    shardLookup,
  } = options;
  const limit = Math.max(25, Number(objectLocatorObjectLimit) || DEFAULT_OBJECT_LOCATOR_OBJECT_LIMIT);
  const maxBytes = Math.max(50_000, Number(objectLocatorMaxBytes) || DEFAULT_OBJECT_LOCATOR_MAX_BYTES);
  const locatorEntries = entries
    .map((entry) => {
      const record = buildObjectLocatorRecord({
        object: entry.object,
        id: entry.id,
        quickContext: quickContextLookup.get(entry.id),
        shard: shardLookup.get(entry.id),
      });
      return {
        ...entry,
        estimatedBytes:
          Buffer.byteLength(yaml.stringify(record), 'utf8') + CONTEXT_PAGE_ENTRY_OVERHEAD_BYTES,
      };
    })
    .sort((left, right) => quickContextSortKey(left).localeCompare(quickContextSortKey(right)));

  const pages = [];
  let currentEntries = [];
  let currentBytes = 0;

  function pushPage() {
    if (currentEntries.length === 0) return;
    const number = pages.length + 1;
    pages.push({
      number,
      title: buildObjectLocatorTitle(number, currentEntries),
      file: normalizePathForManifest(
        path.join(
          artifactRoot,
          'object-locator',
          `${String(number).padStart(3, '0')}__${safeSegment(objectLocatorRange(currentEntries))}.md`
        )
      ),
      entries: currentEntries,
    });
    currentEntries = [];
    currentBytes = 0;
  }

  for (const entry of locatorEntries) {
    const wouldExceedCount = currentEntries.length >= limit;
    const wouldExceedBytes =
      currentEntries.length > 0 && currentBytes + entry.estimatedBytes > maxBytes;
    if (wouldExceedCount || wouldExceedBytes) pushPage();
    currentEntries.push(entry);
    currentBytes += entry.estimatedBytes;
  }
  pushPage();

  return pages;
}

function governedAssetReasons(object = {}) {
  const idName = `${object.id || ''}|${object.name || ''}`.toLowerCase();
  const tags = ensureArray(object.tags).join('|').toLowerCase();
  const reasons = [];

  if (/(temp|tmp|backup|bak|chunk|sidecar)/i.test(idName) || tags.includes('mapping-sidecar')) {
    return reasons;
  }

  if (object.certified === true) reasons.push('certified');
  if (compactDisplayValue(object.steward || object.domain_manager || object.custodian)) {
    reasons.push('named_steward');
  }
  if (objectClassification(object) !== 'public') reasons.push('classified');
  if (/^(dim|fact)[a-z0-9_]/i.test(compactDisplayValue(object.name))) {
    reasons.push('dimension_or_fact');
  }
  if (/(executive|regulatory|kpi|metric|scorecard|dashboard)/i.test(`${idName}|${tags}`)) {
    reasons.push('reporting_or_regulatory');
  }
  if (countField(object, 'column_risk_flags', 'column_risk_flag_count') > 0) {
    reasons.push('known_risk');
  }

  return reasons;
}

function governedAssetScore(entry) {
  const reasons = governedAssetReasons(entry.object);
  const confidence = confidenceScore(entry.object) ?? 0;
  return reasons.length * 100 + confidence;
}

function buildGovernedAssetTitle(number, entry) {
  const object = entry.object;
  return `[AUTO] Governed Asset ${String(number).padStart(3, '0')} - ${titleSegment(
    object.name || entry.id
  )}`.slice(0, 240);
}

function buildGovernedAssetDefinitions(entries, options) {
  const { artifactRoot, limit, quickContextLookup, shardLookup } = options;
  const effectiveLimit = Math.max(0, Number(limit) || DEFAULT_GOVERNED_OBJECT_PAGE_LIMIT);
  if (effectiveLimit === 0) return [];

  return entries
    .filter((entry) => governedAssetReasons(entry.object).length > 0)
    .sort((left, right) => {
      const scoreDelta = governedAssetScore(right) - governedAssetScore(left);
      if (scoreDelta !== 0) return scoreDelta;
      return quickContextSortKey(left).localeCompare(quickContextSortKey(right));
    })
    .slice(0, effectiveLimit)
    .map((entry, index) => {
      const number = index + 1;
      return {
        number,
        title: buildGovernedAssetTitle(number, entry),
        file: normalizePathForManifest(
          path.join(
            artifactRoot,
            'governed-assets',
            `${String(number).padStart(3, '0')}__${safeSegment(entry.object.name || entry.id)}.md`
          )
        ),
        entry,
        quickContext: quickContextLookup.get(entry.id),
        shard: shardLookup.get(entry.id),
        reasons: governedAssetReasons(entry.object),
      };
    });
}

function renderGovernedAssetPage({ definition, graph, markdownRoot, generatedAt }) {
  const { entry, quickContext, shard, reasons } = definition;
  const object = entry.object;
  const id = entry.id;
  const columns = ensureArray(object.columns).slice(0, GOVERNED_ASSET_COLUMN_PREVIEW_LIMIT);
  const allUpstream = getUpstreamDependencies(id, graph, 1);
  const allDownstream = getDownstreamDependents(id, graph, 1);
  const registryRow = buildObjectRegistryRow({
    entry,
    graph,
    generatedAt,
    quickContext,
    shard,
  });

  return [
    `# ${definition.title.replace(/^\[AUTO\]\s*/, '')}`,
    '',
    `Generated at: ${generatedAt}`,
    '',
    aiRerouteBlock(),
    '',
    '## Registry Row',
    '',
    '```yaml',
    yaml.stringify(registryRow).trim(),
    '```',
    '',
    '## Governance Scope',
    '',
    markdownTable(
      ['Field', 'Value'],
      [
        ['Detail page reason', reasons.join(', ')],
        ['Owner', registryRow.owner],
        ['Steward', registryRow.steward || ''],
        ['Domain', registryRow.domain],
        ['Classification', registryRow.classification],
        ['Criticality', registryRow.criticality],
        ['Confidence', `${registryRow.confidence_label}${registryRow.confidence === null ? '' : ` (${registryRow.confidence})`}`],
        ['Source markdown', relativeSourcePath(markdownRoot, object.filePath)],
        ['Quick context page', quickContext?.title || ''],
        ['Catalog shard page', shard?.title || ''],
      ]
    ),
    '',
    '## Lineage Summary',
    '',
    markdownTable(
      ['Direction', 'Count', 'Preview'],
      [
        ['Upstream', allUpstream.length, allUpstream.slice(0, 10).join(', ')],
        ['Downstream', allDownstream.length, allDownstream.slice(0, 10).join(', ')],
      ]
    ),
    '',
    '## Column Preview',
    '',
    columns.length
      ? markdownTable(
          ['Column', 'Type', 'Nullable'],
          columns.map((column) => [
            column.name || '',
            column.data_type || '',
            column.nullable ?? '',
          ])
        )
      : '- No column preview is available in the runtime summary.',
    '',
    countField(object, 'columns', 'column_count') > columns.length
      ? `Additional columns are available in the catalog shard or source markdown. Preview shown: ${columns.length}.`
      : '',
    '',
  ]
    .filter((line) => line !== '')
    .join('\n');
}

async function createCatalogZip({
  markdownRoot,
  outputRoot,
  artifactRoot,
  generatedAt,
  objectIndex,
  objectRegistry,
}) {
  const markdownFiles = await getMarkdownFiles(markdownRoot);
  const relativePath = normalizePathForManifest(
    path.join(artifactRoot, 'attachments', 'lineage-catalog.zip')
  );
  const fullPath = path.join(outputRoot, relativePath);
  await mkdir(path.dirname(fullPath), { recursive: true });
  const catalogManifest = await readTextIfExists(path.join(markdownRoot, 'catalog-manifest.json'));
  const rebuildReport = await readTextIfExists(path.join(markdownRoot, 'rebuild-report.json'));

  await new Promise((resolve, reject) => {
    const output = createWriteStream(fullPath);
    const archive = new ZipArchive({ zlib: { level: 9 } });

    output.on('close', resolve);
    output.on('error', reject);
    archive.on('error', reject);
    archive.on('warning', (err) => {
      if (err.code === 'ENOENT') {
        reject(err);
        return;
      }
      console.warn(`Confluence export zip warning: ${err.message}`);
    });

    archive.pipe(output);

    for (const filePath of markdownFiles) {
      archive.file(filePath, {
        name: normalizePathForManifest(path.join('markdown', relativeTo(markdownRoot, filePath))),
      });
    }

    archive.append(Readable.from(jsonArrayChunks(objectIndex)), {
      name: 'catalog-object-index.json',
    });
    archive.append(Readable.from(jsonArrayChunks(objectRegistry)), {
      name: 'catalog-object-registry.json',
    });
    archive.append(
      `${csvTable(OBJECT_REGISTRY_HEADERS, objectRegistry)}\n`,
      { name: 'catalog-object-registry.csv' }
    );
    archive.append(`${generatedAt}\n`, { name: 'export-generated-at.txt' });
    if (catalogManifest) archive.append(catalogManifest, { name: 'catalog-manifest.json' });
    if (rebuildReport) archive.append(rebuildReport, { name: 'rebuild-report.json' });

    const finalizeResult = archive.finalize();
    if (finalizeResult && typeof finalizeResult.catch === 'function') {
      finalizeResult.catch(reject);
    }
  });

  const zipHash = await hashFile(fullPath);
  return {
    file: normalizePathForManifest(relativePath),
    hash: zipHash.hash,
    bytes: zipHash.bytes,
  };
}

async function mapWithConcurrency(items, limit, mapper) {
  const results = [];
  let nextIndex = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      // Concurrency is intentionally bounded to avoid Windows EMFILE errors.
      // eslint-disable-next-line no-await-in-loop
      results[currentIndex] = await mapper(items[currentIndex], currentIndex);
    }
  });

  await Promise.all(workers);
  return results;
}

export async function buildConfluenceExport(options = {}) {
  const markdownRoot = path.resolve(
    process.cwd(),
    options.markdownRoot || process.env.MARKDOWN_DATA_PATH || DEFAULT_MARKDOWN_ROOT
  );
  const outputRoot = path.resolve(
    process.cwd(),
    options.outputRoot || process.env.CONFLUENCE_EXPORT_PATH || DEFAULT_EXPORT_ROOT
  );
  const shardObjectLimit =
    options.shardObjectLimit ??
    Number(process.env.CONFLUENCE_SHARD_OBJECT_LIMIT || DEFAULT_SHARD_OBJECT_LIMIT);
  const shardMaxBytes =
    options.shardMaxBytes ??
    Number(process.env.CONFLUENCE_SHARD_MAX_BYTES || DEFAULT_SHARD_MAX_BYTES);
  const quickContextObjectLimit =
    options.quickContextObjectLimit ??
    Number(process.env.CONFLUENCE_QUICK_CONTEXT_OBJECT_LIMIT || DEFAULT_QUICK_CONTEXT_OBJECT_LIMIT);
  const quickContextMaxBytes =
    options.quickContextMaxBytes ??
    Number(process.env.CONFLUENCE_QUICK_CONTEXT_MAX_BYTES || DEFAULT_QUICK_CONTEXT_MAX_BYTES);
  const objectLocatorObjectLimit =
    options.objectLocatorObjectLimit ??
    Number(
      process.env.CONFLUENCE_OBJECT_LOCATOR_OBJECT_LIMIT || DEFAULT_OBJECT_LOCATOR_OBJECT_LIMIT
    );
  const objectLocatorMaxBytes =
    options.objectLocatorMaxBytes ??
    Number(process.env.CONFLUENCE_OBJECT_LOCATOR_MAX_BYTES || DEFAULT_OBJECT_LOCATOR_MAX_BYTES);
  const governedObjectPageLimit =
    options.governedObjectPageLimit ??
    Number(process.env.CONFLUENCE_GOVERNED_OBJECT_PAGE_LIMIT || DEFAULT_GOVERNED_OBJECT_PAGE_LIMIT);
  const generatedAt = nowIso();
  const runId =
    options.runId ||
    process.env.CONFLUENCE_EXPORT_RUN_ID ||
    generatedAt.replace(/[:.]/g, '-');
  const artifactRoot = options.useRunFolder === false ? '' : path.join('runs', safeSegment(runId));
  const config = {
    confluenceBaseUrl:
      options.confluenceBaseUrl ||
      process.env.CONFLUENCE_BASE_URL ||
      DEFAULT_CONFLUENCE_BASE_URL,
    spaceKey: options.spaceKey || process.env.CONFLUENCE_SPACE_KEY || DEFAULT_CONFLUENCE_SPACE_KEY,
    parentPageId:
      options.parentPageId ||
      process.env.CONFLUENCE_PARENT_PAGE_ID ||
      DEFAULT_CONFLUENCE_PARENT_PAGE_ID,
  };

  if (options.cleanOutput !== false) {
    await resetExportRoot(outputRoot);
  } else {
    await mkdir(outputRoot, { recursive: true });
  }

  const runtimeCatalog = await loadRuntimeCatalog(markdownRoot, { autoRebuild: true });
  const objects = runtimeCatalog.objects;
  const graph = runtimeCatalog.lineageGraph;
  const objectEntries = sortedObjectEntries(objects);
  const shardDefinitions = buildShardDefinitions(objectEntries, {
    artifactRoot,
    graph,
    markdownRoot,
    shardObjectLimit,
    shardMaxBytes,
  });
  const shardLookup = buildShardLookup(shardDefinitions);
  const quickContextDefinitions = buildQuickContextDefinitions(objectEntries, {
    artifactRoot,
    graph,
    markdownRoot,
    quickContextObjectLimit,
    quickContextMaxBytes,
    shardLookup,
  });
  const quickContextLookup = buildPageLookup(quickContextDefinitions);
  const objectLocatorDefinitions = buildObjectLocatorDefinitions(objectEntries, {
    artifactRoot,
    objectLocatorObjectLimit,
    objectLocatorMaxBytes,
    quickContextLookup,
    shardLookup,
  });
  const objectRows = objectEntries.map((entry) =>
    summarizeObject(entry.object, entry.id, shardLookup.get(entry.id))
  );
  const registryRows = objectEntries.map((entry) =>
    buildObjectRegistryRow({
      entry,
      graph,
      generatedAt,
      quickContext: quickContextLookup.get(entry.id),
      shard: shardLookup.get(entry.id),
    })
  );
  const governedAssetDefinitions = buildGovernedAssetDefinitions(objectEntries, {
    artifactRoot,
    limit: governedObjectPageLimit,
    quickContextLookup,
    shardLookup,
  });
  const databaseGroups = groupRegistryRowsByDatabase(registryRows);
  const databasePageEntries = buildDatabasePageEntries(databaseGroups);
  const manifestJson = await readJsonIfExists(path.join(markdownRoot, 'catalog-manifest.json'), {
    files: [],
  });
  const rebuildReportMarkdown = await readTextIfExists(
    path.join(markdownRoot, 'rebuild-report.md'),
    ''
  );
  const exportSummary = {
    summaryPageCount: 8 + databasePageEntries.length,
    objectLocatorPageCount: objectLocatorDefinitions.length,
    quickContextPageCount: quickContextDefinitions.length,
    shardPageCount: shardDefinitions.length,
    governedAssetPageCount: governedAssetDefinitions.length,
    attachmentCount: 5,
    objectCount: objects.size,
  };

  const manifest = {
    generated_at: generatedAt,
    generator: 'src/services/confluenceExportService.js',
    source_markdown_root: normalizePathForManifest(markdownRoot),
    artifact_root: normalizePathForManifest(artifactRoot),
    confluence: {
      base_url: config.confluenceBaseUrl,
      space_key: config.spaceKey,
      parent_page_id: config.parentPageId,
      root_page_url: buildRootPageUrl(config),
    },
    pages: [],
    object_locator_pages: [],
    quick_context_pages: [],
    shard_pages: [],
    object_pages: [],
    attachments: [],
    stats: {
      objects: objects.size,
      shard_object_limit: Math.max(25, Number(shardObjectLimit) || DEFAULT_SHARD_OBJECT_LIMIT),
      shard_max_bytes: Math.max(50_000, Number(shardMaxBytes) || DEFAULT_SHARD_MAX_BYTES),
      quick_context_object_limit: Math.max(
        25,
        Number(quickContextObjectLimit) || DEFAULT_QUICK_CONTEXT_OBJECT_LIMIT
      ),
      quick_context_max_bytes: Math.max(
        50_000,
        Number(quickContextMaxBytes) || DEFAULT_QUICK_CONTEXT_MAX_BYTES
      ),
      object_locator_object_limit: Math.max(
        25,
        Number(objectLocatorObjectLimit) || DEFAULT_OBJECT_LOCATOR_OBJECT_LIMIT
      ),
      object_locator_max_bytes: Math.max(
        50_000,
        Number(objectLocatorMaxBytes) || DEFAULT_OBJECT_LOCATOR_MAX_BYTES
      ),
      object_locator_pages: objectLocatorDefinitions.length,
      quick_context_pages: quickContextDefinitions.length,
      shard_pages: shardDefinitions.length,
      database_pages: databasePageEntries.length + 1,
      governed_asset_pages: governedAssetDefinitions.length,
      confidence_distribution: confidenceDistribution(objects),
      by_type: groupCounts(objects, 'type'),
      by_database: groupCounts(objects, 'database'),
      by_server: groupCounts(objects, 'server'),
    },
  };

  const pageDefinitions = [
    {
      title: '[AUTO] Sonic Data Lineage README',
      relativePath: path.join(artifactRoot, 'pages', 'readme.md'),
      content: () =>
        renderReadmePage({
          generatedAt,
          rootPageUrl: manifest.confluence.root_page_url,
          summary: exportSummary,
        }),
      labels: ['readme'],
    },
    {
      title: '[AUTO] Latest Rebuild Report',
      relativePath: path.join(artifactRoot, 'pages', 'latest-rebuild-report.md'),
      content: () => renderRebuildReportPage({ rebuildReportMarkdown, generatedAt }),
      labels: ['rebuild-report'],
    },
    {
      title: '[AUTO] Governance Portal',
      relativePath: path.join(artifactRoot, 'pages', 'governance-portal.md'),
      content: () =>
        renderGovernancePortalPage({
          objectRows,
          registryRows,
          governedAssetDefinitions,
          generatedAt,
        }),
      labels: ['governance-portal'],
    },
    {
      title: '[AUTO] Catalog Manifest',
      relativePath: path.join(artifactRoot, 'pages', 'catalog-manifest.md'),
      content: () => renderCatalogManifestPage({ manifestJson, generatedAt }),
      labels: ['catalog-manifest'],
    },
    {
      title: '[AUTO] Source System Inventory',
      relativePath: path.join(artifactRoot, 'pages', 'source-system-inventory.md'),
      content: () => renderSourceInventoryPage({ objects, generatedAt }),
      labels: ['source-inventory'],
    },
    {
      title: '[AUTO] Confidence Guide',
      relativePath: path.join(artifactRoot, 'pages', 'confidence-guide.md'),
      content: renderConfidenceGuide,
      labels: ['confidence-guide'],
    },
    {
      title: '[AUTO] Object Index',
      relativePath: path.join(artifactRoot, 'pages', 'object-index.md'),
      content: () => renderObjectIndexPage({ objectRows, generatedAt }),
      labels: ['object-index'],
    },
    {
      title: '[AUTO] Databases',
      relativePath: path.join(artifactRoot, 'pages', 'databases.md'),
      content: () => renderDatabasesIndexPage({ databasePageEntries, generatedAt }),
      labels: ['database-index'],
    },
    ...databasePageEntries.map(({ database, rows, title, fileSegment }) => ({
      title,
      relativePath: path.join(artifactRoot, 'pages', 'databases', `${fileSegment}.md`),
      content: () => renderDatabasePage({ database, rows, generatedAt }),
      labels: ['database', safeSegment(database).toLowerCase()],
      parentTitle: '[AUTO] Databases',
    })),
  ];

  const pageRecords = await mapWithConcurrency(pageDefinitions, 8, async (definition) => {
    const fileInfo = await writeExportFile(outputRoot, definition.relativePath, definition.content());
    return pageRecord(definition.title, fileInfo, {
      labels: definition.labels,
      parentTitle: definition.parentTitle,
    });
  });
  manifest.pages.push(...pageRecords);

  const objectLocatorRecords = await mapWithConcurrency(
    objectLocatorDefinitions,
    16,
    async (page) => {
      const fileInfo = await writeExportFile(
        outputRoot,
        page.file,
        renderObjectLocatorPage({ page, quickContextLookup, shardLookup, generatedAt })
      );
      return pageRecord(page.title, fileInfo, {
        labels: ['object-locator'],
      });
    }
  );
  manifest.object_locator_pages.push(...objectLocatorRecords);

  const quickContextRecords = await mapWithConcurrency(quickContextDefinitions, 16, async (page) => {
    const fileInfo = await writeExportFile(
      outputRoot,
      page.file,
      renderQuickContextPage({ page, graph, markdownRoot, shardLookup, generatedAt })
    );
    return pageRecord(page.title, fileInfo, {
      labels: ['lineage-quick-context'],
    });
  });
  manifest.quick_context_pages.push(...quickContextRecords);

  const shardRecords = await mapWithConcurrency(shardDefinitions, 16, async (shard) => {
    const fileInfo = await writeExportFile(
      outputRoot,
      shard.file,
      renderShardPage({ shard, graph, markdownRoot, generatedAt })
    );
    return pageRecord(shard.title, fileInfo, {
      labels: ['catalog-shard', shard.group.type],
    });
  });
  manifest.shard_pages.push(...shardRecords);

  const governedAssetRecords = await mapWithConcurrency(
    governedAssetDefinitions,
    8,
    async (definition) => {
      const fileInfo = await writeExportFile(
        outputRoot,
        definition.file,
        renderGovernedAssetPage({ definition, graph, markdownRoot, generatedAt })
      );
      return pageRecord(definition.title, fileInfo, {
        labels: ['governed-asset', ...definition.reasons],
      });
    }
  );
  manifest.object_pages.push(...governedAssetRecords);

  const objectIndexFile = await writeExportJsonArrayFile(
    outputRoot,
    path.join(artifactRoot, 'attachments', 'catalog-object-index.json'),
    objectRows
  );
  manifest.attachments.push(
    attachmentRecord('catalog-object-index.json', objectIndexFile, {
      contentType: 'application/json',
      labels: ['object-index'],
    })
  );

  const objectRegistryJsonFile = await writeExportJsonArrayFile(
    outputRoot,
    path.join(artifactRoot, 'attachments', 'catalog-object-registry.json'),
    registryRows
  );
  manifest.attachments.push(
    attachmentRecord('catalog-object-registry.json', objectRegistryJsonFile, {
      contentType: 'application/json',
      labels: ['object-registry', 'machine-readable'],
    })
  );

  const objectRegistryCsvFile = await writeExportCsvFile(
    outputRoot,
    path.join(artifactRoot, 'attachments', 'catalog-object-registry.csv'),
    OBJECT_REGISTRY_HEADERS,
    registryRows
  );
  manifest.attachments.push(
    attachmentRecord('catalog-object-registry.csv', objectRegistryCsvFile, {
      contentType: 'text/csv',
      labels: ['object-registry', 'machine-readable'],
    })
  );

  const exportManifestPreview = {
    generated_at: generatedAt,
    objects: objects.size,
    pages: manifest.pages.length,
    object_locator_pages: manifest.object_locator_pages.length,
    quick_context_pages: manifest.quick_context_pages.length,
    shard_pages: manifest.shard_pages.length,
    governed_asset_pages: manifest.object_pages.length,
    registry_rows: registryRows.length,
    source_markdown_root: manifest.source_markdown_root,
  };
  const exportSummaryFile = await writeExportFile(
    outputRoot,
    path.join(artifactRoot, 'attachments', 'confluence-export-summary.json'),
    `${JSON.stringify(exportManifestPreview, null, 2)}\n`
  );
  manifest.attachments.push(
    attachmentRecord('confluence-export-summary.json', exportSummaryFile, {
      contentType: 'application/json',
      labels: ['export-summary'],
    })
  );

  const zipInfo = await createCatalogZip({
    markdownRoot,
    outputRoot,
    artifactRoot,
    generatedAt,
    objectIndex: objectRows,
    objectRegistry: registryRows,
  });
  manifest.attachments.push(
    attachmentRecord('lineage-catalog.zip', zipInfo, {
      contentType: 'application/zip',
      labels: ['catalog-bundle'],
    })
  );

  const manifestPath = path.join(outputRoot, MANIFEST_FILE_NAME);
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

  return {
    outputRoot,
    manifestPath,
    manifest,
  };
}

export default {
  buildConfluenceExport,
};
