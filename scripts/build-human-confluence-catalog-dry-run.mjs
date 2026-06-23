import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import yaml from 'yaml';

const outputRoot = path.resolve('data/confluence/human-catalog-dry-run');
const productFilter = valueAfter('--product');
const databaseFilter = valueAfter('--database');
const schemaFilter = valueAfter('--schema');
const objectsFilter = valueAfter('--objects');
const productCatalogSlugs = [
  'fire',
  'force',
  'fuel',
  'doc',
  'trac',
  'turbo',
  'hypercards',
  'echopark-platform',
  'mci',
  'mdp',
];
const canonicalObjectPagePilotLimit = 25;
const canonicalObjectPagePilotDatabase = 'Sonic_DW';
const canonicalObjectPagePilotSchema = 'dbo';
const canonicalObjectPagePilotType = 'table';
const runtimePackageRoot = path.resolve('data/lineage-runtime-package/sonic-data-lineage-runtime');
const runtimeRegistryPath = path.join(runtimePackageRoot, 'registry', 'canonical-objects.jsonl');
const humanCatalogDoNotPublishSchemas = [
  { database: 'Sonic_DW', schemaPrefix: 'SONIC\\bheemappa', reason: 'User/account schema; not useful as a human browse page.' },
  { database: 'Sonic_DW', schemaPrefix: 'SONIC\\Murali', reason: 'User/account schema; not useful as a human browse page.' },
  { database: 'Sonic_DW', schemaPrefix: 'SONIC\\rajakumar', reason: 'User/account schema; not useful as a human browse page.' },
  { database: 'StagingDB', schemaPrefix: 'SONIC\\bheemappa', reason: 'User/account schema; not useful as a human browse page.' },
];
const humanCatalogExcludedArtifacts = [
  {
    database: 'SNOWFLAKE_SAMPLE_DATA',
    reason: 'Snowflake sample data is training/demo content and is excluded from the human Sonic Database Catalog.',
  },
  {
    database: 'ssisdb',
    objectTypes: ['dataset', 'package'],
    reason: 'SSIS package/catalog artifact; documented in SSIS support documentation, not as a Database Catalog object.',
  },
];
let runtimeRegistryRows;
let runtimeDatabaseCanonicalMap;
let runtimeSchemaCanonicalMap;
const currentLeafFiles = [];
const supersededPageCandidates = [];

function valueAfter(flag) {
  const index = process.argv.indexOf(flag);
  return index >= 0 ? process.argv[index + 1] : '';
}

function frontmatter(text) {
  const match = String(text || '').match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  try {
    return yaml.parse(match[1]) || {};
  } catch {
    return {};
  }
}

function body(text) {
  return String(text || '').split('---').slice(2).join('---').trim();
}

function hashJson(value) {
  return crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex').toUpperCase();
}

function mdTable(rows, headers) {
  const head = `| ${headers.join(' | ')} |`;
  const sep = `| ${headers.map(() => '---').join(' | ')} |`;
  const bodyRows = rows.map((row) => `| ${headers.map((header) => row[header] ?? '').join(' | ')} |`);
  return [head, sep, ...bodyRows].join('\n');
}

function section(text, title) {
  const match = String(text).match(new RegExp(`## ${title}\\n\\n([\\s\\S]*?)(?=\\n## |$)`));
  return match ? match[1].trim() : '';
}

function tableRows(markdown, heading) {
  const text = section(markdown, heading);
  return text
    .split(/\r?\n/)
    .filter((line) => /^\|/.test(line) && !/^\| ---/.test(line))
    .slice(1)
    .map((line) => line.split('|').slice(1, -1).map((cell) => cell.trim()));
}

async function writeText(file, text) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, `${text.trim()}\n`, 'utf8');
}

async function resetOutputRoot() {
  await fs.rm(outputRoot, { recursive: true, force: true });
  await fs.mkdir(outputRoot, { recursive: true });
}

async function readMarkdown(file) {
  return fs.readFile(file, 'utf8');
}

async function readMarkdownIfExists(file) {
  try {
    return await readMarkdown(file);
  } catch (error) {
    if (error?.code === 'ENOENT') return '';
    throw error;
  }
}

async function readRuntimeRegistryRows() {
  if (runtimeRegistryRows) return runtimeRegistryRows;
  const text = await fs.readFile(runtimeRegistryPath, 'utf8');
  runtimeRegistryRows = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line))
    .filter((row) => row.database && row.schema && row.object_name)
    .filter((row) => !isDatabaseCatalogExcludedArtifact(row));
  return runtimeRegistryRows;
}

function runtimeObjectRow(row) {
  const aliases = objectAliases(row);
  const summary = summarizeObjectTrustAndTags({
    id: row.object_id || '',
    name: row.object_name || row.display_name || '',
    type: row.object_type || 'object',
    database: row.database || 'unknown',
    schema: row.schema || 'unknown',
    downstream: Number(row.downstream_count || 0),
    upstream: Number(row.upstream_count || 0),
    columns: Number(row.column_count || 0),
    confidence: row.confidence_label || '',
    profileAvailable: Boolean(row.answer_cards?.profile_teaser || row.profile_available || row.profile_status),
    profileStatus: row.answer_cards?.profile_teaser ? 'available' : row.profile_status || 'not surfaced in metadata',
    sourceArtifactPaths: [row.source_markdown_path, row.context_pack_path].filter(Boolean),
  });
  return {
    file: row.source_markdown_path || row.context_pack_path || '',
    id: row.object_id || '',
    name: row.object_name || row.display_name || '',
    schema: row.schema || 'unknown',
    database: row.database || 'unknown',
    platform: platformForRow(row),
    server: row.server || row.source_system || 'unknown',
    type: row.object_type || 'object',
    downstream: Number(row.downstream_count || 0),
    upstream: Number(row.upstream_count || 0),
    columns: Number(row.column_count || 0),
    confidence: row.confidence_label || '',
    tags: summary.tags,
    tag_reasons: summary.tag_reasons,
    page_confidence: summary.page_confidence,
    not_surfaced_facts: summary.not_surfaced_facts,
    profile_status: summary.profile_status,
    aliases,
    canonical_page_path: databaseCatalogPath(
      platformForRow(row),
      row.database || 'unknown',
      row.schema || 'unknown',
      row.object_name || row.display_name || 'unknown'
    ),
  };
}

function normalizeConfidenceLabel(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

function confidenceLevel(value) {
  const label = normalizeConfidenceLabel(value);
  if (['very_high', 'high', 'strong'].includes(label)) return 'high';
  if (['medium', 'moderate'].includes(label)) return 'medium';
  if (['low', 'weak'].includes(label)) return 'low';
  return 'not surfaced';
}

function unique(values) {
  return [...new Set((values || []).filter(Boolean))];
}

function platformForRow(row = {}) {
  if (String(row.database || '').toLowerCase() === 'ssisdb' || ['package', 'dataset'].includes(String(row.object_type || '').toLowerCase())) {
    return 'SSIS';
  }
  const signal = [
    row.platform,
    row.database_product,
    row.source_type,
    row.connector_type,
    row.server,
    row.source_system,
    row.source_markdown_path,
    row.context_pack_path,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  if (signal.includes('snowflake')) return 'Snowflake';
  return 'SQL Server';
}

function platformForRows(rows = []) {
  const counts = new Map();
  for (const row of rows) {
    const platform = platformForRow(row);
    counts.set(platform, (counts.get(platform) || 0) + 1);
  }
  return (
    [...counts.entries()].sort(
      ([leftPlatform, leftCount], [rightPlatform, rightCount]) =>
        rightCount - leftCount || leftPlatform.localeCompare(rightPlatform)
    )[0]?.[0] || 'SQL Server'
  );
}

function databaseCatalogPath(platform, database, ...children) {
  return ['Sonic Data Lineage', 'Database Catalog', platform || 'SQL Server', database || 'unknown', ...children.filter(Boolean)];
}

function splitFilterValues(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function summarizeObjectTrustAndTags(object) {
  const downstream = Number(object.downstream || 0);
  const upstream = Number(object.upstream || 0);
  const columns = Number(object.columns || object.columnCount || 0);
  const confidence = confidenceLevel(object.confidence);
  const profileAvailable = Boolean(object.profileAvailable);
  const profileStatus = profileAvailable ? 'available' : object.profileStatus || 'not surfaced in metadata';
  const notSurfacedFacts = [
    'business owner',
    'data steward',
    'SLA',
    'live freshness',
    'lifecycle/status',
    'business definition',
  ];
  if (!profileAvailable) notSurfacedFacts.push('profile data');
  if (!object.downstreamReports || object.downstreamReports.length === 0) {
    notSurfacedFacts.push('downstream business report names');
  }
  const tags = [];
  const tagReasons = [];
  if (downstream >= 10) {
    tags.push('high-use');
    tagReasons.push(`high-use: ${downstream} downstream consumer signals meet the threshold of 10.`);
  }
  if (profileAvailable) {
    tags.push('profiled');
    tagReasons.push(`profiled: profile evidence is available through ${object.profileEvidence || 'runtime profile context'}.`);
  }
  if (upstream + downstream >= 20 || upstream >= 10 || downstream >= 15) {
    tags.push('lineage-hotspot');
    tagReasons.push(`lineage-hotspot: ${upstream} upstream and ${downstream} downstream signals indicate high lineage complexity.`);
  }
  if (confidence === 'low' || confidence === 'not surfaced' || columns === 0 || notSurfacedFacts.includes('business definition')) {
    tags.push('review-needed');
    tagReasons.push('review-needed: generated metadata is missing one or more business/governance facts that require human review.');
  }
  return {
    tags: unique(tags),
    tag_reasons: tagReasons,
    profile_status: profileStatus,
    page_confidence: {
      lineage_confidence: confidence,
      description_confidence: 'low',
      profile_confidence: profileAvailable ? 'medium' : 'not surfaced',
      documentation_confidence: confidence === 'high' && columns > 0 ? 'medium' : 'review-needed',
    },
    not_surfaced_facts: unique(notSurfacedFacts),
  };
}

function registryMarkdownPath(row) {
  const sourcePath = row.source_markdown_path || '';
  if (!sourcePath) return '';
  return sourcePath.startsWith('data/') ? sourcePath : path.join('data/markdown', sourcePath);
}

function isDoNotPublishHumanCatalogSchema(database, schema) {
  const schemaName = String(schema || '').toLowerCase();
  return humanCatalogDoNotPublishSchemas.some(
    (blocked) =>
      blocked.database.toLowerCase() === String(database || '').toLowerCase() &&
      schemaName.startsWith(blocked.schemaPrefix.toLowerCase())
  );
}

function isDatabaseCatalogExcludedArtifact(row) {
  const database = String(row.database || '').trim().toLowerCase();
  const type = String(row.object_type || '').trim().toLowerCase();
  return humanCatalogExcludedArtifacts.some(
    (rule) =>
      database === rule.database.toLowerCase() &&
      (!Array.isArray(rule.objectTypes) || rule.objectTypes.map((value) => value.toLowerCase()).includes(type))
  );
}

function objectPageSlug(row) {
  return `${row.database}-${row.schema}-${row.object_name || row.name}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function qualifiedName(row) {
  return `${row.database}.${row.schema}.${row.object_name || row.name}`;
}

function normalizedLookup(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function objectAliases(row) {
  const objectName = row.object_name || row.name || row.display_name || '';
  const fullName = qualifiedName(row);
  const values = [
    fullName,
    `${row.schema}.${objectName}`,
    objectName,
    objectName.replace(/_/g, ''),
    normalizedLookup(objectName),
    ...(row.lookup_keys || []),
    ...(row.alias_keys || []),
  ];
  return unique(values.map((value) => String(value || '').trim()).filter(Boolean)).slice(0, 20);
}

function listItems(values, limit = 8) {
  const items = (values || []).slice(0, limit);
  if (items.length === 0) return '- Not surfaced in metadata.';
  return items.map((value) => `- \`${value}\``).join('\n');
}

function pagePath(values) {
  return values.filter(Boolean).join(' / ');
}

function addSupersededPageCandidate(candidate) {
  supersededPageCandidates.push({
    ...candidate,
    cleanup_allowed: false,
    requires_explicit_cleanup_approval: true,
    dry_run_only: true,
    live_inventory_note:
      'This dry run did not query live Confluence page IDs. Confirm live page existence, page ID, child count, and links before archive or replace actions.',
  });
}

function objectTypePlainEnglish(type, name) {
  const objectName = String(name || '');
  if (type === 'table' && /^dim[_A-Z]/i.test(objectName)) return 'shared dimension/reference table';
  if (type === 'table' && /^fact/i.test(objectName)) return 'fact table used for reporting and analytics';
  if (type === 'table') return 'database table used by downstream warehouse processes';
  if (type === 'view') return 'view that packages source objects for downstream consumers';
  if (type === 'procedure') return 'stored procedure that reads, transforms, or loads database objects';
  if (type === 'function') return 'database function used by SQL logic';
  return `${type || 'database object'} used by downstream lineage consumers`;
}

async function objectSummaryFromRuntimeRow(row) {
  const file = registryMarkdownPath(row);
  const metadata = file ? frontmatter(await readMarkdownIfExists(file)) : {};
  const profileAvailable = Boolean(
    row.answer_cards?.profile_teaser ||
      metadata.profile_available === true ||
      (metadata.live_row_count !== null && metadata.live_row_count !== undefined)
  );
  const base = {
    path: file.replaceAll('\\', '/'),
    id: row.object_id || metadata.id || '',
    name: row.object_name || metadata.name || row.display_name || '',
    type: row.object_type || metadata.type || 'object',
    platform: platformForRow({ ...row, ...metadata }),
    server: row.server || metadata.server || row.source_system || '',
    database: row.database || metadata.database || '',
    schema: row.schema || metadata.schema || '',
    reads: metadata.reads_from || metadata.depends_on || [],
    writes: metadata.writes_to || [],
    createdBy: metadata.created_by || [],
    usedBy: metadata.used_by || [],
    columns: (metadata.columns || []).map((column) => column.name).slice(0, 20),
    columnCount: Number(row.column_count || (metadata.columns || []).length || metadata.column_count || 0),
    columnUsage: (metadata.column_usage || []).slice(0, 12),
    downstream: Number(row.downstream_count || 0),
    upstream: Number(row.upstream_count || 0),
    confidence: row.confidence_label || metadata.catalog_confidence?.confidence_label || metadata.lineage_quality?.confidence_label || '',
    sensitivity: metadata.sensitivity || 'not surfaced in metadata',
    owner: metadata.owner || 'not surfaced in metadata',
    validatedEdges: metadata.lineage_quality?.validated_edges || 0,
    unresolvedFacts: metadata.lineage_quality?.unresolved_facts || 0,
    profileAvailable,
    profileEvidence: row.answer_cards?.profile_teaser || '',
    profileStatus: profileAvailable ? 'available' : 'not surfaced in metadata',
    aliases: objectAliases(row),
  };
  return {
    ...base,
    ...summarizeObjectTrustAndTags(base),
  };
}

function richPromotionForObject(object) {
  const tags = new Set(object.tags || []);
  const reasons = [];
  const blockedReasons = [];
  if (object.requested === true) reasons.push('requested by a human reviewer');
  if (object.human_reviewed_high_value === true || tags.has('high-value')) reasons.push('human-reviewed high-value object');
  if (tags.has('profiled')) reasons.push('profile context is surfaced');
  if (tags.has('high-use') && object.page_confidence?.lineage_confidence === 'high') {
    reasons.push('high-use object with high lineage confidence');
  }
  if (tags.has('product-critical')) reasons.push('product-critical tag is present');
  if (tags.has('support-critical')) reasons.push('support-critical tag is present');

  if ((object.not_surfaced_facts || []).includes('business definition')) {
    blockedReasons.push('business definition is not surfaced in metadata');
  }
  if (object.page_confidence?.description_confidence === 'low') {
    blockedReasons.push('plain-English description confidence is low');
  }
  if (!object.usedBy || object.usedBy.length === 0) {
    blockedReasons.push('named downstream consumers are not surfaced in metadata');
  }

  const eligible = reasons.length > 0 && blockedReasons.length === 0;
  return {
    rule_version: 'dcat-009.2026-06-19',
    current_level: 'thin',
    recommended_next_level: eligible ? 'rich' : 'thin',
    eligible_for_rich_page: eligible,
    reasons,
    blocked_reasons: blockedReasons,
  };
}

async function listHighValueObjectRows() {
  const rows = await readRuntimeRegistryRows();
  const candidates = rows
    .filter((row) => String(row.database || '').toLowerCase() === canonicalObjectPagePilotDatabase.toLowerCase())
    .filter((row) => String(row.schema || '').toLowerCase() === canonicalObjectPagePilotSchema.toLowerCase())
    .filter((row) => String(row.object_type || '').toLowerCase() === canonicalObjectPagePilotType)
    .filter((row) => row.source_markdown_path)
    .filter((row) => !isDoNotPublishHumanCatalogSchema(row.database, row.schema));
  const scoreSort = (left, right) =>
    Number(right.downstream_count || 0) - Number(left.downstream_count || 0) ||
    Number(right.upstream_count || 0) - Number(left.upstream_count || 0) ||
    String(left.object_id || '').localeCompare(String(right.object_id || ''));
  return candidates.sort(scoreSort).slice(0, canonicalObjectPagePilotLimit);
}

async function listRuntimeDatabaseNames() {
  const canonical = await getRuntimeDatabaseCanonicalMap();
  return [...canonical.values()].sort((left, right) => left.localeCompare(right));
}

async function listRuntimeSchemaNames() {
  const rows = await readRuntimeRegistryRows();
  const canonical = await getRuntimeDatabaseCanonicalMap();
  const canonicalSchemas = await getRuntimeSchemaCanonicalMap();
  return [
    ...new Set(
      rows
        .map((row) => {
          const databaseKey = String(row.database || '').toLowerCase();
          const database = canonical.get(databaseKey) || row.database;
          const schemaKey = `${databaseKey}.${String(row.schema || '').toLowerCase()}`;
          const schema = canonicalSchemas.get(schemaKey) || row.schema;
          return `${database}.${schema}`;
        })
        .filter((name) => !name.endsWith('.'))
        .filter((name) => {
          const separator = name.indexOf('.');
          if (separator < 0) return true;
          return !isDoNotPublishHumanCatalogSchema(name.slice(0, separator), name.slice(separator + 1));
        })
    ),
  ].sort((left, right) => left.localeCompare(right));
}

async function getRuntimeDatabaseCanonicalMap() {
  if (runtimeDatabaseCanonicalMap) return runtimeDatabaseCanonicalMap;
  const rows = await readRuntimeRegistryRows();
  const counts = new Map();
  for (const row of rows) {
    const database = String(row.database || '').trim();
    if (!database) continue;
    const key = database.toLowerCase();
    const variants = counts.get(key) || new Map();
    variants.set(database, (variants.get(database) || 0) + 1);
    counts.set(key, variants);
  }
  runtimeDatabaseCanonicalMap = new Map();
  for (const [key, variants] of counts.entries()) {
    const [name] = [...variants.entries()].sort(
      ([leftName, leftCount], [rightName, rightCount]) =>
        rightCount - leftCount || leftName.localeCompare(rightName)
    )[0];
    runtimeDatabaseCanonicalMap.set(key, name);
  }
  return runtimeDatabaseCanonicalMap;
}

async function getRuntimeSchemaCanonicalMap() {
  if (runtimeSchemaCanonicalMap) return runtimeSchemaCanonicalMap;
  const rows = await readRuntimeRegistryRows();
  const counts = new Map();
  for (const row of rows) {
    const database = String(row.database || '').trim();
    const schema = String(row.schema || '').trim();
    if (!database || !schema) continue;
    const key = `${database.toLowerCase()}.${schema.toLowerCase()}`;
    const variants = counts.get(key) || new Map();
    variants.set(schema, (variants.get(schema) || 0) + 1);
    counts.set(key, variants);
  }
  runtimeSchemaCanonicalMap = new Map();
  for (const [key, variants] of counts.entries()) {
    const [name] = [...variants.entries()].sort(
      ([leftName, leftCount], [rightName, rightCount]) =>
        rightCount - leftCount || leftName.localeCompare(rightName)
    )[0];
    runtimeSchemaCanonicalMap.set(key, name);
  }
  return runtimeSchemaCanonicalMap;
}

async function listRuntimeDatabaseRows(database) {
  const rows = await readRuntimeRegistryRows();
  return rows
    .filter((row) => String(row.database || '').toLowerCase() === database.toLowerCase())
    .filter((row) => !isDoNotPublishHumanCatalogSchema(row.database, row.schema))
    .map(runtimeObjectRow);
}

async function listRuntimeSchemaRows(database, schema) {
  if (isDoNotPublishHumanCatalogSchema(database, schema)) return [];
  const rows = await readRuntimeRegistryRows();
  return rows
    .filter(
      (row) =>
        String(row.database || '').toLowerCase() === database.toLowerCase() &&
        String(row.schema || '').toLowerCase() === schema.toLowerCase()
    )
    .map(runtimeObjectRow);
}

async function renderProduct(productName) {
  const slug = productName.toLowerCase().replaceAll('_', '-');
  const sourcePath = path.join('data/products', `${slug}.md`);
  const text = await readMarkdown(sourcePath);
  const metadata = frontmatter(text);
  const content = body(text);
  const importantAssets = tableRows(content, 'Important Assets To Start With').slice(0, 8);
  const orchestration = tableRows(content, 'SSIS / Orchestration Evidence').slice(0, 8);
  const objectTypes = tableRows(content, 'Object Types');
  const mainDatabases = tableRows(content, 'Main Databases');
  const evidenceHash = hashJson({ sourcePath, importantAssets, orchestration, objectTypes, mainDatabases });

  const packet = {
    page_type: 'product',
    page_title: `Data Product - ${metadata.name || productName}`,
    page_tree_path: ['Sonic Data Lineage', 'Data Product Catalog', `Data Product - ${metadata.name || productName}`],
    canonical_id: metadata.product_id || `product-${slug}`,
    source_artifact_paths: [sourcePath],
    generated_at: new Date().toISOString().slice(0, 10),
    evidence_hash: `sha256:${evidenceHash}`,
    confidence: {
      label: metadata.trust_level || 'catalog evidence',
      caveats: [
        'Generated dry-run page; no live Confluence publish occurred.',
        'Downstream report page links are shown only when surfaced in product metadata.',
      ],
    },
    product: {
      name: metadata.name || productName,
      business_purpose: section(content, 'Plain-English Summary').split(/\n\n/)[0] || '',
      target_areas: mainDatabases.map((row) => row[0]),
      key_final_objects: importantAssets.map((row) => row[0]),
      key_jobs: orchestration.map((row) => row[0]),
    },
  };

  const page = `# Data Product - ${metadata.name || productName}

## Plain-English Summary

${packet.product.business_purpose}

If this product is stale or unavailable, support should start with the key orchestration jobs and then validate row freshness in the named final targets.

## Business Value

${section(content, 'What This Product Appears To Do') || packet.product.business_purpose}

## Key Data And Final Targets

${mdTable(
  importantAssets.map((row) => ({
    Asset: row[0],
    Type: row[1],
    Upstream: row[2],
    Downstream: row[3],
    Confidence: row[5],
  })),
  ['Asset', 'Type', 'Upstream', 'Downstream', 'Confidence']
)}

## Lineage Summary

### Object Types

${mdTable(
  objectTypes.map((row) => ({ Type: row[0], Count: row[1] })),
  ['Type', 'Count']
)}

### Main Databases

${mdTable(
  mainDatabases.map((row) => ({ Database: row[0], 'Matched Objects': row[1] })),
  ['Database', 'Matched Objects']
)}

### Key Orchestration And Load Jobs

${mdTable(
  orchestration.map((row) => ({
    Package: row[0],
    Upstream: row[1],
    Downstream: row[2],
    Evidence: row[3],
  })),
  ['Package', 'Upstream', 'Downstream', 'Evidence']
)}

## Support Checks

1. Check the top-most orchestration jobs listed above.
2. Check row freshness in the highest-impact final tables/views.
3. Match report or feed complaints to the named target object before opening AI retrieval artifacts.
4. Use object pages or quick context only after the human page identifies the likely object family.

## Known Gaps And Confidence

| Item | Status |
| --- | --- |
| Evidence hash | \`sha256:${evidenceHash}\` |
| Confidence | ${metadata.trust_level || 'catalog evidence'} |
| Live publish | No |
| Missing facts | Downstream report page links are not shown unless surfaced in product metadata. |

## Technical Evidence

<details>
<summary>Evidence Packet</summary>

- Evidence packet: \`data/confluence/human-catalog-dry-run/product-${slug}.evidence.json\`
- Source product metadata: \`${sourcePath}\`
- Evidence hash: \`sha256:${evidenceHash}\`

</details>`;

  await writeText(path.join(outputRoot, `product-${slug}.evidence.json`), JSON.stringify(packet, null, 2));
  await writeText(path.join(outputRoot, `product-${slug}.md`), page);
  currentLeafFiles.push({ evidenceFile: `product-${slug}.evidence.json`, markdownFile: `product-${slug}.md`, treePath: packet.page_tree_path });
  return packet.page_tree_path;
}

async function renderDatabase(database) {
  const root = path.relative(process.cwd(), runtimeRegistryPath).replaceAll('\\', '/');
  const rows = await listRuntimeDatabaseRows(database);
  const platform = platformForRows(rows);
  const schemas = {};
  const types = {};
  for (const row of rows) {
    schemas[row.schema] = schemas[row.schema] || { schema: row.schema, total: 0, tables: 0, views: 0, procedures: 0, downstream: 0 };
    schemas[row.schema].total += 1;
    schemas[row.schema].downstream += row.downstream;
    if (row.type === 'table') schemas[row.schema].tables += 1;
    if (row.type === 'view') schemas[row.schema].views += 1;
    if (row.type === 'procedure') schemas[row.schema].procedures += 1;
    types[row.type] = (types[row.type] || 0) + 1;
  }
  const schemaRows = Object.values(schemas).sort((left, right) => right.downstream - left.downstream || right.total - left.total);
  const high = rows
    .sort((left, right) => right.downstream - left.downstream || right.upstream - left.upstream)
    .slice(0, 10);
  const evidenceHash = hashJson({ platform, database, schemaRows, types, high });
  const slug = database.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const packet = {
    page_type: 'database',
    page_title: database,
    page_tree_path: databaseCatalogPath(platform, database),
    canonical_id: `database-${slug}`,
    source_artifact_paths: [root],
    generated_at: new Date().toISOString().slice(0, 10),
    evidence_hash: `sha256:${evidenceHash}`,
    database_slice: {
      platform,
      database,
      object_counts: { total: rows.length, ...types },
      schemas: schemaRows,
      high_usage_objects: high,
    },
  };

  const page = `# ${database}

## Plain-English Summary

\`${database}\` is a cataloged ${platform} database in the Sonic lineage runtime package. This page summarizes ${rows.length} objects across ${schemaRows.length} schemas so support can browse by schema before opening object-level technical artifacts.

Use this page when you know the database but not the exact schema or table. Start with the highest-use schemas and objects, then drill into the schema page for table/view/procedure detail.

## At A Glance

| Signal | Value |
| --- | --- |
| Platform/Product | \`${platform}\` |
| Database | \`${database}\` |
| Total cataloged objects | ${rows.length} |
| Tables | ${types.table || 0} |
| Views | ${types.view || 0} |
| Procedures | ${types.procedure || 0} |
| Functions | ${types.function || 0} |
| Evidence hash | \`sha256:${evidenceHash}\` |

## Schema Summary

${mdTable(
  schemaRows.map((row) => ({
    Schema: `\`${row.schema}\``,
    Objects: row.total,
    Tables: row.tables,
    Views: row.views,
    Procedures: row.procedures,
    'Downstream Uses': row.downstream,
  })),
  ['Schema', 'Objects', 'Tables', 'Views', 'Procedures', 'Downstream Uses']
)}

## High-Use Objects

${mdTable(
  high.map((row) => ({
    Object: `\`${row.schema}.${row.name}\``,
    Type: row.type,
    'Downstream Uses': row.downstream,
    'Upstream Inputs': row.upstream,
    Confidence: row.confidence || 'not surfaced',
  })),
  ['Object', 'Type', 'Downstream Uses', 'Upstream Inputs', 'Confidence']
)}

## Technical Evidence

<details>
<summary>Evidence Packet</summary>

- Evidence packet: \`data/confluence/human-catalog-dry-run/database-${slug}.evidence.json\`
- Source runtime registry: \`${root}\`
- Evidence hash: \`sha256:${evidenceHash}\`

</details>`;

  await writeText(path.join(outputRoot, `database-${slug}.evidence.json`), JSON.stringify(packet, null, 2));
  await writeText(path.join(outputRoot, `database-${slug}.md`), page);
  currentLeafFiles.push({ evidenceFile: `database-${slug}.evidence.json`, markdownFile: `database-${slug}.md`, treePath: packet.page_tree_path });
  return packet.page_tree_path;
}

function objectPurpose(row) {
  return objectTypePlainEnglish(row.type, row.name);
}

function schemaObjectEvidence(row) {
  return {
    name: row.name,
    type: row.type,
    full_name: `${row.database}.${row.schema}.${row.name}`,
    object_id: row.id,
    column_count: row.columns,
    upstream_count: row.upstream,
    downstream_count: row.downstream,
    profile_status: row.profile_status,
    tags: row.tags,
    tag_reasons: row.tag_reasons,
    aliases: row.aliases,
    confidence: row.confidence || 'not surfaced',
    page_confidence: row.page_confidence,
    not_surfaced_facts: row.not_surfaced_facts,
    purpose: objectPurpose(row),
    canonical_page_path: row.canonical_page_path.join(' / '),
    devops_artifact_path: row.file,
  };
}

function schemaObjectMarkdownRows(rows) {
  if (rows.length === 0) return 'No cataloged objects surfaced in this section.';
  return mdTable(
    rows.map((row) => ({
      Object: `\`${row.name}\``,
      Type: row.type,
      Tags: row.tags.join(', ') || 'none',
      Purpose: objectPurpose(row),
      Columns: row.columns || 'not surfaced',
      Upstream: row.upstream,
      Downstream: row.downstream,
      Profile: row.profile_status || 'not surfaced in metadata',
      Confidence: row.confidence || 'not surfaced',
    })),
    ['Object', 'Type', 'Tags', 'Purpose', 'Columns', 'Upstream', 'Downstream', 'Profile', 'Confidence']
  );
}

async function renderSchema(schemaName) {
  const [database, schema] = schemaName.split('.');
  if (!database || !schema) throw new Error('--schema must be in Database.Schema format.');
  const root = path.relative(process.cwd(), runtimeRegistryPath).replaceAll('\\', '/');
  const rows = await listRuntimeSchemaRows(database, schema);
  const platform = platformForRows(rows);
  const counts = {};
  for (const row of rows) counts[row.type] = (counts[row.type] || 0) + 1;
  const sortedRows = [...rows].sort(
    (left, right) =>
      right.downstream - left.downstream ||
      right.upstream - left.upstream ||
      String(left.name || '').localeCompare(String(right.name || ''))
  );
  const high = sortedRows
    .sort((left, right) => right.downstream - left.downstream || right.upstream - left.upstream)
    .slice(0, 10);
  const allObjectEvidence = sortedRows.map(schemaObjectEvidence);
  const evidenceHash = hashJson({ platform, schemaName, counts, high, allObjectEvidence });
  const slug = `${database}-${schema}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const tables = sortedRows.filter((row) => row.type === 'table');
  const views = sortedRows.filter((row) => row.type === 'view');
  const procedures = sortedRows.filter((row) => row.type === 'procedure');
  const otherObjects = sortedRows.filter((row) => !['table', 'view', 'procedure'].includes(row.type));
  const profiledObjects = sortedRows.filter((row) => row.tags.includes('profiled'));
  const reviewObjects = sortedRows.filter((row) => row.tags.includes('review-needed'));
  const packet = {
    page_type: 'schema',
    page_title: schema,
    page_tree_path: databaseCatalogPath(platform, database, schema),
    canonical_id: `schema-${slug}`,
    source_artifact_paths: [root],
    generated_at: new Date().toISOString().slice(0, 10),
    evidence_hash: `sha256:${evidenceHash}`,
    confidence: {
      label: 'strong catalog evidence',
      caveats: ['Profile coverage is not surfaced by this dry-run renderer yet.'],
    },
    catalog_slice: {
      platform,
      database,
      schema,
      object_counts: { total: rows.length, ...counts },
      objects: allObjectEvidence,
      high_usage_objects: high,
      object_tags: allObjectEvidence.map((row) => ({
        object_id: row.object_id,
        full_name: row.full_name,
        tags: row.tags,
        tag_reasons: row.tag_reasons,
        page_confidence: row.page_confidence,
        not_surfaced_facts: row.not_surfaced_facts,
      })),
      profile_coverage: { status: 'not surfaced in this dry-run packet' },
    },
  };
  addSupersededPageCandidate({
    candidate_type: 'schema-title',
    noncanonical_title: `Schema - ${database}.${schema}`,
    noncanonical_path: pagePath(['Sonic Data Lineage', 'Database Catalog', database, `Schema - ${database}.${schema}`]),
    canonical_title: schema,
    canonical_path: pagePath(packet.page_tree_path),
    recommended_action: 'archive candidate after the canonical schema page is reviewed and linked correctly',
    reason: 'Schema pages now use Database Catalog / Platform / Database / Schema so users can browse schemas and objects like a library.',
  });
  addSupersededPageCandidate({
    candidate_type: 'schema-parent',
    noncanonical_title: schema,
    noncanonical_path: pagePath(['Sonic Data Lineage', 'Database Catalog', database, schema]),
    canonical_title: schema,
    canonical_path: pagePath(packet.page_tree_path),
    recommended_action: 'archive candidate after the canonical platform-grouped schema page is reviewed and linked correctly',
    reason: 'Schema pages must roll up under their platform/product and database, not directly under Database Catalog.',
  });

  const page = `# ${schema}

## Plain-English Summary

\`${database}.${schema}\` is a cataloged warehouse schema. It contains tables, views, procedures, and related database objects used by reports, packages, procedures, and product domains.

The highest-use objects in this slice include ${(high.length > 0 ? high : rows)
    .slice(0, 5)
    .map((row) => `\`${row.name}\``)
    .join(', ')}. Start troubleshooting with the object named in the report or issue, then follow its upstream loaders and downstream consumers.

## At A Glance

| Signal | Value |
| --- | --- |
| Platform/Product | \`${platform}\` |
| Database | \`${database}\` |
| Schema | \`${schema}\` |
| Total cataloged objects | ${rows.length} |
| Tables | ${counts.table || 0} |
| Views | ${counts.view || 0} |
| Procedures | ${counts.procedure || 0} |
| Functions | ${counts.function || 0} |
| Synonyms | ${counts.synonym || 0} |
| Evidence hash | \`sha256:${evidenceHash}\` |
| Profile coverage | Not surfaced in this dry-run packet |

## Most Used Objects

${mdTable(
  high.map((row) => ({
    Object: `\`${row.name}\``,
    Type: row.type,
    Tags: row.tags.join(', ') || 'none',
    'Downstream Uses': row.downstream,
    Columns: row.columns,
    Confidence: row.confidence || 'not surfaced',
  })),
  ['Object', 'Type', 'Tags', 'Downstream Uses', 'Columns', 'Confidence']
)}

## Tables

${schemaObjectMarkdownRows(tables)}

## Views

${schemaObjectMarkdownRows(views)}

## Procedures

${schemaObjectMarkdownRows(procedures)}

## Other Objects

${schemaObjectMarkdownRows(otherObjects)}

## Objects With Profile Data

${schemaObjectMarkdownRows(profiledObjects)}

## Objects Needing Review

${schemaObjectMarkdownRows(reviewObjects)}

## Profile Coverage

Profile coverage was not surfaced in this dry-run packet.

## Known Gaps And Confidence

| Item | Status |
| --- | --- |
| Business owner | Not surfaced at schema level. |
| SLA | Not surfaced at schema level. |
| Object pages | Thin canonical object pages are generated for a bounded pilot set. |
| Confidence | Strong catalog evidence for inventory and high-usage ranking. |

## Technical Evidence

<details>
<summary>Evidence Packet</summary>

- Evidence packet: \`data/confluence/human-catalog-dry-run/schema-${slug}.evidence.json\`
- Source runtime registry: \`${root}\`
- Evidence hash: \`sha256:${evidenceHash}\`

</details>`;

  await writeText(path.join(outputRoot, `schema-${slug}.evidence.json`), JSON.stringify(packet, null, 2));
  await writeText(path.join(outputRoot, `schema-${slug}.md`), page);
  currentLeafFiles.push({ evidenceFile: `schema-${slug}.evidence.json`, markdownFile: `schema-${slug}.md`, treePath: packet.page_tree_path });
  return packet.page_tree_path;
}

async function objectSummary(file) {
  const text = await readMarkdown(file);
  const metadata = frontmatter(text);
  return {
    path: file.replaceAll('\\', '/'),
    id: metadata.id,
    name: metadata.name,
    type: metadata.type,
    reads: metadata.reads_from || [],
    writes: metadata.writes_to || [],
    createdBy: metadata.created_by || [],
    usedBy: metadata.used_by || [],
    columns: (metadata.columns || []).map((column) => column.name).slice(0, 12),
    columnCount: (metadata.columns || []).length || metadata.column_count || 0,
    columnUsage: (metadata.column_usage || []).slice(0, 8),
    validatedEdges: metadata.lineage_quality?.validated_edges || 0,
    unresolvedFacts: metadata.lineage_quality?.unresolved_facts || 0,
  };
}

async function renderObjectPilot(name) {
  if (name !== 'fire-pilot') throw new Error('Only --objects fire-pilot is supported in this dry-run slice.');
  const files = [
    'data/markdown/servers/L1-5FSQL-01/databases/Sonic_DW/tables/dbo__factFIRE.md',
    'data/markdown/servers/L1-5FSQL-01/databases/Sonic_DW/views/dbo__vwFactFIRESummaryReport.md',
    'data/markdown/servers/L1-5FSQL-01/databases/Sonic_DW/stored_procedures/dbo__usp_DOC_Booked.md',
  ];
  const objects = [];
  for (const file of files) objects.push(await objectSummary(file));
  const evidenceHash = hashJson(objects);
  const packet = {
    page_type: 'object-pilot',
    page_title: 'Object Pilot - FIRE',
    page_tree_path: ['Sonic Data Lineage', 'Operating Guides', 'Object Pilot - FIRE'],
    canonical_id: 'phase7s-008-fire-object-pilot',
    source_artifact_paths: files,
    generated_at: new Date().toISOString().slice(0, 10),
    evidence_hash: `sha256:${evidenceHash}`,
    objects,
  };
  const page = `# Object Pilot - FIRE

## Plain-English Summary

This dry run generates one table, one view, and one procedure object page candidate for the FIRE support path. The selected objects are \`factFIRE\`, \`vwFactFIRESummaryReport\`, and \`usp_DOC_Booked\`.

## Object Candidates

${mdTable(
  objects.map((object) => ({
    Object: `\`${object.id}\``,
    Type: object.type,
    Reads: object.reads.length,
    Writes: object.writes.length,
    'Created By': object.createdBy.length,
    'Used By': object.usedBy.length,
    Columns: object.columnCount,
    'Column Usage': object.columnUsage.length,
  })),
  ['Object', 'Type', 'Reads', 'Writes', 'Created By', 'Used By', 'Columns', 'Column Usage']
)}

## Support Checks

1. For \`factFIRE\`, check FIRE load packages before downstream summary views.
2. For \`vwFactFIRESummaryReport\`, check \`FactFireSummary\` and shared dimensions.
3. For \`usp_DOC_Booked\`, check source availability and writes to \`Doc_Booked\` and \`Doc_Booked_Historical\`.

## Known Gaps And Confidence

Profile row counts and runtime baselines are not surfaced in this dry-run packet.

## Technical Evidence

<details>
<summary>Evidence Packet</summary>

- Evidence packet: \`data/confluence/human-catalog-dry-run/high-value-objects-fire.evidence.json\`
- Evidence hash: \`sha256:${evidenceHash}\`

</details>`;

  await writeText(path.join(outputRoot, 'high-value-objects-fire.evidence.json'), JSON.stringify(packet, null, 2));
  await writeText(path.join(outputRoot, 'high-value-objects-fire.md'), page);
  currentLeafFiles.push({
    evidenceFile: 'high-value-objects-fire.evidence.json',
    markdownFile: 'high-value-objects-fire.md',
    treePath: packet.page_tree_path,
  });
  return packet.page_tree_path;
}

async function renderHighValueObjectPage(row) {
  const object = await objectSummaryFromRuntimeRow(row);
  const qname = `${object.database}.${object.schema}.${object.name}`;
  const slug = objectPageSlug(row);
  const richPromotion = richPromotionForObject(object);
  const evidenceHash = hashJson({ object, richPromotion });
  const objectPath = databaseCatalogPath(object.platform, object.database, object.schema, object.name);
  const packet = {
    page_type: 'object',
    page_title: object.name,
    page_tree_path: objectPath,
    canonical_id: `object-${slug}`,
    page_generation_level: 'thin',
    rich_promotion: richPromotion,
    source_artifact_paths: [object.path, path.relative(process.cwd(), runtimeRegistryPath).replaceAll('\\', '/')].filter(Boolean),
    generated_at: new Date().toISOString().slice(0, 10),
    evidence_hash: `sha256:${evidenceHash}`,
    object: {
      name: object.name,
      type: object.type,
      platform: object.platform,
      server: object.server,
      database: object.database,
      schema: object.schema,
      qualified_name: qname,
      tags: object.tags,
    },
    tags: object.tags,
    tag_reasons: object.tag_reasons,
    confidence: object.page_confidence,
    not_surfaced_facts: object.not_surfaced_facts,
    aliases: object.aliases,
    lineage: {
      upstream_loaders: object.createdBy,
      upstream_sources: object.reads,
      downstream_consumers: object.usedBy,
      writes_to: object.writes,
    },
    technical_signals: {
      columns: object.columns,
      column_usage: object.columnUsage,
    },
    profile_signals: {
      profile_available: object.profileAvailable,
      row_count: null,
      column_count: object.columnCount,
      profile_status: object.profile_status,
      profile_caveats: object.profileAvailable
        ? ['Profile context is surfaced in runtime evidence, but live operational freshness is not published as a Confluence status.']
        : ['Profile row counts are not surfaced in this dry-run packet.'],
    },
    backlinks: [
      databaseCatalogPath(object.platform, object.database).join(' / '),
      databaseCatalogPath(object.platform, object.database, object.schema).join(' / '),
    ],
  };
  addSupersededPageCandidate({
    candidate_type: 'high-value-object',
    noncanonical_title: `High-Value Object - ${qname}`,
    noncanonical_path: pagePath(['Sonic Data Lineage', 'High-Value Assets', `High-Value Object - ${qname}`]),
    canonical_title: object.name,
    canonical_path: pagePath(packet.page_tree_path),
    recommended_action: 'archive candidate after the canonical object page is reviewed and linked correctly',
    reason: 'High-value is now a deterministic tag on canonical object pages instead of a separate navigation section.',
  });
  addSupersededPageCandidate({
    candidate_type: 'object-parent',
    noncanonical_title: object.name,
    noncanonical_path: pagePath(['Sonic Data Lineage', 'Database Catalog', object.database, object.schema, object.name]),
    canonical_title: object.name,
    canonical_path: pagePath(packet.page_tree_path),
    recommended_action: 'archive candidate after the canonical platform-grouped object page is reviewed and linked correctly',
    reason: 'Object pages must roll up under Platform / Database / Schema so SQL Server and Snowflake catalogs do not share a flat database namespace.',
  });

  const subject = objectTypePlainEnglish(object.type, object.name);
  const firstUpstream = object.createdBy[0] || object.reads[0] || 'not surfaced in metadata';
  const firstDownstream = object.usedBy[0] || 'not surfaced in metadata';
  const supportFirstCheck =
    firstUpstream === 'not surfaced in metadata'
      ? `Start by checking consumers of \`${qname}\`, because upstream loader evidence is not surfaced in metadata.`
      : `Start by checking \`${firstUpstream}\`, then confirm \`${qname}\` has current and expected data before troubleshooting downstream consumers.`;

  const page = `# ${object.name}

## Plain-English Summary

\`${qname}\` is a ${subject}. This thin canonical object page exists because the runtime lineage registry shows ${object.downstream} downstream use(s), ${object.upstream} upstream dependency signal(s), and ${object.columnCount} cataloged column(s).

If this object is stale, missing, or structurally wrong, downstream consumers such as \`${firstDownstream}\` may return incorrect results or fail. ${supportFirstCheck}

## Business Meaning And Impact

| Question | Answer |
| --- | --- |
| What is this? | \`${qname}\` is a ${subject}. |
| Why does support care? | It has ${object.downstream} downstream use(s) in the lineage registry. |
| First upstream check | \`${firstUpstream}\` |
| First downstream check | \`${firstDownstream}\` |
| Owner | ${object.owner} |
| Sensitivity | ${object.sensitivity} |

## At A Glance

| Signal | Value |
| --- | --- |
| Platform/Product | \`${object.platform}\` |
| Server | \`${object.server || 'not surfaced in metadata'}\` |
| Database | \`${object.database}\` |
| Schema | \`${object.schema}\` |
| Object | \`${object.name}\` |
| Type | ${object.type} |
| Tags | ${object.tags.join(', ') || 'none'} |
| Downstream consumers | ${object.downstream} |
| Upstream signals | ${object.upstream} |
| Columns | ${object.columnCount} |
| Confidence | ${object.confidence || 'not surfaced in metadata'} |
| Evidence hash | \`sha256:${evidenceHash}\` |

## Search Aliases

${listItems(object.aliases, 20)}

## Trust Signals

| Signal | Value |
| --- | --- |
| Lineage confidence | ${object.page_confidence.lineage_confidence} |
| Description confidence | ${object.page_confidence.description_confidence} |
| Profile confidence | ${object.page_confidence.profile_confidence} |
| Documentation confidence | ${object.page_confidence.documentation_confidence} |

### Tag Reasons

${listItems(object.tag_reasons)}

### Not Surfaced In Metadata

${listItems(object.not_surfaced_facts)}

## Rich Page Promotion

| Signal | Value |
| --- | --- |
| Current level | ${richPromotion.current_level} |
| Recommended next level | ${richPromotion.recommended_next_level} |
| Eligible for rich page | ${richPromotion.eligible_for_rich_page ? 'Yes' : 'No'} |
| Rule version | ${richPromotion.rule_version} |

### Promotion Reasons

${listItems(richPromotion.reasons)}

### Promotion Blockers

${listItems(richPromotion.blocked_reasons)}

## Lineage Summary

| Direction | Summary |
| --- | --- |
| Upstream loaders | ${(object.createdBy || []).length} surfaced |
| Upstream sources | ${(object.reads || []).length} surfaced |
| Writes to | ${(object.writes || []).length} surfaced |
| Downstream consumers | ${(object.usedBy || []).length} surfaced |

## Support Checks

1. ${supportFirstCheck}
2. Confirm row freshness or expected row counts for \`${qname}\`; runtime row-count baselines are not surfaced in this packet.
3. If a report or downstream job is failing, compare the complaint to the listed downstream consumers before changing SQL logic.
4. Review the source artifact path in Technical Evidence before changing lineage rules or business logic.

## Profile And Quality Signals

| Signal | Value |
| --- | --- |
| Profile available | ${object.profileAvailable ? 'Yes, runtime profile context is surfaced' : 'No, not surfaced in this dry-run packet'} |
| Row count | Not surfaced in metadata |
| Column count | ${object.columnCount} |
| Column usage records | ${object.columnUsage.length} |
| Unresolved lineage facts | ${object.unresolvedFacts} |
| Validated lineage edges | ${object.validatedEdges} |

## Related Pages

- Database page: \`${object.database}\`
- Schema page: \`${object.database}.${object.schema}\`
- Canonical path: \`${objectPath.join(' / ')}\`

## Technical Evidence

<details>
<summary>Upstream Loaders</summary>

${listItems(object.createdBy)}

</details>

<details>
<summary>Upstream Sources</summary>

${listItems(object.reads)}

</details>

<details>
<summary>Downstream Consumers</summary>

${listItems(object.usedBy)}

</details>

<details>
<summary>Columns</summary>

${listItems(object.columns, 20)}

</details>

<details>
<summary>Source Artifact Paths</summary>

${listItems(packet.source_artifact_paths)}
- Evidence packet: \`data/confluence/human-catalog-dry-run/object-${slug}.evidence.json\`
- Evidence hash: \`sha256:${evidenceHash}\`

</details>`;

  await writeText(path.join(outputRoot, `object-${slug}.evidence.json`), JSON.stringify(packet, null, 2));
  await writeText(path.join(outputRoot, `object-${slug}.md`), page);
  currentLeafFiles.push({
    evidenceFile: `object-${slug}.evidence.json`,
    markdownFile: `object-${slug}.md`,
    treePath: packet.page_tree_path,
  });
  return packet.page_tree_path;
}

async function renderHighValueObjectPages() {
  const pageTrees = [];
  for (const row of await listHighValueObjectRows()) {
    // eslint-disable-next-line no-await-in-loop
    pageTrees.push(await renderHighValueObjectPage(row));
  }
  return pageTrees;
}

async function writeSupersededPagesReport() {
  const candidates = supersededPageCandidates.sort((left, right) =>
    `${left.candidate_type}:${left.noncanonical_path}`.localeCompare(`${right.candidate_type}:${right.noncanonical_path}`)
  );
  const report = {
    generated_at: new Date().toISOString(),
    report_type: 'human-catalog-superseded-pages-dry-run',
    cleanup_allowed: false,
    requires_explicit_cleanup_approval: true,
    summary: {
      total_candidates: candidates.length,
      schema_title_candidates: candidates.filter((candidate) => candidate.candidate_type === 'schema-title').length,
      schema_parent_candidates: candidates.filter((candidate) => candidate.candidate_type === 'schema-parent').length,
      high_value_object_candidates: candidates.filter((candidate) => candidate.candidate_type === 'high-value-object').length,
      object_parent_candidates: candidates.filter((candidate) => candidate.candidate_type === 'object-parent').length,
    },
    candidates,
  };
  const markdown = `# Superseded Human Catalog Pages Dry Run

This report is advisory only. It does not publish, move, archive, or delete Confluence pages.

## Summary

| Signal | Value |
| --- | --- |
| Total candidates | ${report.summary.total_candidates} |
| Schema title candidates | ${report.summary.schema_title_candidates} |
| Schema parent candidates | ${report.summary.schema_parent_candidates} |
| High-value object candidates | ${report.summary.high_value_object_candidates} |
| Object parent candidates | ${report.summary.object_parent_candidates} |
| Cleanup allowed | No |
| Explicit cleanup approval required | Yes |

## Candidate Pages

${mdTable(
  candidates.map((candidate) => ({
    Type: candidate.candidate_type,
    'Old Title': `\`${candidate.noncanonical_title}\``,
    'Old Path': `\`${candidate.noncanonical_path}\``,
    'Canonical Path': `\`${candidate.canonical_path}\``,
    Action: candidate.recommended_action,
  })),
  ['Type', 'Old Title', 'Old Path', 'Canonical Path', 'Action']
)}

## Review Notes

1. Confirm live Confluence page IDs before cleanup.
2. Confirm no valuable comments, attachments, or child pages would be lost.
3. Archive only after the canonical Database Catalog page is published and reviewed.
4. Do not use this dry-run report as permission to delete content.`;

  await writeText(path.join(outputRoot, 'superseded-pages-report.json'), JSON.stringify(report, null, 2));
  await writeText(path.join(outputRoot, 'superseded-pages-report.md'), markdown);
  return report;
}

async function main() {
  await resetOutputRoot();
  const pageTrees = [];
  if (!productFilter && !databaseFilter && !schemaFilter && !objectsFilter) {
    for (const slug of productCatalogSlugs) {
      // eslint-disable-next-line no-await-in-loop
      pageTrees.push(await renderProduct(slug));
    }
    for (const database of await listRuntimeDatabaseNames()) {
      // eslint-disable-next-line no-await-in-loop
      pageTrees.push(await renderDatabase(database));
    }
    for (const schema of await listRuntimeSchemaNames()) {
      // eslint-disable-next-line no-await-in-loop
      pageTrees.push(await renderSchema(schema));
    }
    pageTrees.push(await renderObjectPilot('fire-pilot'));
    pageTrees.push(...(await renderHighValueObjectPages()));
  } else {
    if (productFilter) pageTrees.push(await renderProduct(productFilter));
    for (const database of splitFilterValues(databaseFilter)) {
      // eslint-disable-next-line no-await-in-loop
      pageTrees.push(await renderDatabase(database));
    }
    if (schemaFilter) pageTrees.push(await renderSchema(schemaFilter));
    if (objectsFilter) pageTrees.push(await renderObjectPilot(objectsFilter));
  }

  const tree = `# Human Catalog Dry-Run Page Tree

This dry run does not publish to Confluence.

\`\`\`text
${pageTrees.map((treePath) => treePath.join(' / ')).join('\n')}
\`\`\`
  `;
  await writeText(path.join(outputRoot, 'page-tree.md'), tree);
  const supersededPagesReport = await writeSupersededPagesReport();
  await writeText(
    path.join(outputRoot, 'manifest.json'),
    JSON.stringify(
      {
        generated_at: new Date().toISOString(),
        superseded_pages_report: {
          json: 'superseded-pages-report.json',
          markdown: 'superseded-pages-report.md',
          total_candidates: supersededPagesReport.summary.total_candidates,
          cleanup_allowed: false,
        },
        pages: currentLeafFiles.sort((left, right) => left.treePath.join('/').localeCompare(right.treePath.join('/'))),
      },
      null,
      2
    )
  );
  console.log(
    JSON.stringify(
      {
        status: 'dry-run-built',
        outputRoot: outputRoot.replaceAll('\\', '/'),
        pages: pageTrees.length,
        supersededPageCandidates: supersededPagesReport.summary.total_candidates,
        pageTrees,
      },
      null,
      2
    )
  );
}

await main();
