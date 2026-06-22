import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import yaml from 'yaml';

const outputRoot = path.resolve('data/confluence/rovo-ai-retrieval-dry-run');
const runtimePackageRoot = path.resolve('data/lineage-runtime-package/sonic-data-lineage-runtime');
const runtimeRegistryPath = path.join(runtimePackageRoot, 'registry', 'canonical-objects.jsonl');
const humanDryRunManifestPath = path.resolve('data/confluence/human-catalog-dry-run/manifest.json');
const evaluationPromptPath = path.resolve('docs/rovo-ai-retrieval-pilots/rovo-evaluation-prompts.json');
const generatedAt = new Date().toISOString();
const rovoRootPath = ['Sonic Data Lineage', 'AI Retrieval Artifacts'];
const pages = [];

function hashJson(value) {
  return crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex').toUpperCase();
}

function normalizeLookup(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function unique(values) {
  return [...new Set((values || []).map((value) => String(value || '').trim()).filter(Boolean))];
}

function pagePath(values) {
  return values.filter(Boolean).join(' / ');
}

function mdTable(rows, headers) {
  const head = `| ${headers.join(' | ')} |`;
  const sep = `| ${headers.map(() => '---').join(' | ')} |`;
  const body = rows.map((row) => `| ${headers.map((header) => row[header] ?? '').join(' | ')} |`);
  return [head, sep, ...body].join('\n');
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

async function readJson(file, fallback = null) {
  try {
    return JSON.parse(await fs.readFile(file, 'utf8'));
  } catch {
    return fallback;
  }
}

async function readMarkdownMetadata(sourceMarkdownPath) {
  if (!sourceMarkdownPath) return {};
  const file = path.join('data/markdown', sourceMarkdownPath);
  try {
    return frontmatter(await fs.readFile(file, 'utf8'));
  } catch {
    return {};
  }
}

async function readRuntimeRows() {
  const text = await fs.readFile(runtimeRegistryPath, 'utf8');
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

async function humanPagePathIndex() {
  const manifest = await readJson(humanDryRunManifestPath, { pages: [] });
  const paths = new Set();
  for (const page of manifest.pages || []) {
    // eslint-disable-next-line no-await-in-loop
    const packet = await readJson(path.resolve('data/confluence/human-catalog-dry-run', page.evidenceFile));
    if (packet?.page_tree_path) paths.add(pagePath(packet.page_tree_path));
  }
  return paths;
}

function objectCanonicalId(row) {
  return `object:${row.object_id}`;
}

function databaseCanonicalId(database) {
  return `database:${database}`;
}

function schemaCanonicalId(database, schema) {
  return `schema:${database}.${schema}`;
}

function objectHumanPage(row, humanPaths) {
  const canonical = pagePath(['Sonic Data Lineage', 'Database Catalog', row.database, row.schema, row.object_name]);
  return humanPaths.has(canonical) ? canonical : 'not created yet';
}

function databaseHumanPage(database, humanPaths) {
  const canonical = pagePath(['Sonic Data Lineage', 'Database Catalog', database]);
  return humanPaths.has(canonical) ? canonical : canonical;
}

function schemaHumanPage(database, schema, humanPaths) {
  const canonical = pagePath(['Sonic Data Lineage', 'Database Catalog', database, schema]);
  return humanPaths.has(canonical) ? canonical : canonical;
}

function objectAliases(row) {
  const objectName = row.object_name || row.display_name || '';
  return unique([
    `${row.database}.${row.schema}.${objectName}`,
    `${row.schema}.${objectName}`,
    objectName,
    objectName.replace(/_/g, ''),
    normalizeLookup(objectName),
    ...(row.lookup_keys || []),
    ...(row.alias_keys || []),
  ]).slice(0, 24);
}

function databaseAliases(database) {
  return unique([database, normalizeLookup(database), database.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase()]);
}

function schemaAliases(database, schema) {
  return unique([`${database}.${schema}`, `${schema}`, normalizeLookup(`${database}.${schema}`)]);
}

function objectSummary(row, metadata, humanPaths) {
  const aliases = objectAliases(row);
  const tags = [];
  if (Number(row.downstream_count || 0) >= 10) tags.push('high-use');
  if (row.answer_cards?.profile_teaser) tags.push('profiled');
  if (Number(row.upstream_count || 0) + Number(row.downstream_count || 0) >= 20) tags.push('lineage-hotspot');
  tags.push('review-needed');
  const lineageConfidence = ['very_high', 'high'].includes(String(row.confidence_label || '').toLowerCase())
    ? 'high'
    : String(row.confidence_label || 'not surfaced');
  return {
    canonical_id: objectCanonicalId(row),
    full_name: `${row.database}.${row.schema}.${row.object_name}`,
    type: row.object_type || 'object',
    database: row.database,
    schema: row.schema,
    object: row.object_name,
    aliases,
    tags: unique(tags),
    plain_english_summary: `${row.database}.${row.schema}.${row.object_name} is a ${row.object_type || 'database object'} in the lineage registry. Business definition is not surfaced in metadata.`,
    column_count: Number(row.column_count || metadata.column_count || (metadata.columns || []).length || 0),
    key_columns: (metadata.columns || []).map((column) => column.name).filter(Boolean).slice(0, 12),
    upstream_summary: `${Number(row.upstream_count || 0)} upstream dependency signal(s) surfaced.`,
    downstream_summary: `${Number(row.downstream_count || 0)} downstream consumer signal(s) surfaced.`,
    profile_status: row.answer_cards?.profile_teaser ? 'profile context surfaced' : 'not surfaced in metadata',
    confidence: {
      lineage_confidence: lineageConfidence,
      description_confidence: 'low',
      profile_confidence: row.answer_cards?.profile_teaser ? 'medium' : 'not surfaced',
      documentation_confidence: 'review-needed',
    },
    missing_facts: [
      'business owner not surfaced in metadata',
      'data steward not surfaced in metadata',
      'SLA not surfaced in metadata',
      'lifecycle/status not surfaced in metadata',
      'live freshness not surfaced in metadata',
      'certification not surfaced in metadata',
      'business definition not surfaced in metadata',
    ],
    canonical_human_page: objectHumanPage(row, humanPaths),
    generated_at: generatedAt,
    evidence_hash: `sha256:${hashJson({ row, metadata })}`,
    source_artifact_paths: [row.source_markdown_path, row.context_pack_path, row.compact_context_pack_path].filter(Boolean),
    metadata,
  };
}

function locatorRowsForEntity(entity) {
  const rows = [];
  for (const alias of entity.aliases) {
    rows.push({
      lookup_key: alias,
      canonical_id: entity.canonical_id,
      type: entity.type,
      database: entity.database || 'not applicable',
      schema: entity.schema || 'not applicable',
      object: entity.object || 'not applicable',
      aliases: entity.aliases,
      quick_context_page: entity.quick_context_page,
      canonical_human_page: entity.canonical_human_page,
      confidence: entity.confidence || 'high',
      evidence_hash: entity.evidence_hash,
    });
  }
  return rows;
}

function objectScore(row) {
  return Number(row.downstream_count || 0) * 10 + Number(row.upstream_count || 0) * 3 + Number(row.column_count || 0);
}

function selectTargetRows(rows) {
  const vendorRows = rows.filter((row) => String(row.database || '').toLowerCase() === 'vendordata');
  const topVendorRows = [...vendorRows]
    .sort((left, right) => objectScore(right) - objectScore(left) || String(left.object_id).localeCompare(String(right.object_id)))
    .slice(0, 60);
  const requestedRows = rows.filter((row) => {
    const lookup = new Set([...(row.lookup_keys || []), ...(row.alias_keys || []), row.object_name, normalizeLookup(row.object_name)]);
    return (
      (String(row.database).toLowerCase() === 'sonic_dw' &&
        String(row.schema).toLowerCase() === 'dbo' &&
        ['dim_vehicle', 'dimvehicle', 'factopportunity', 'fact_opportunity'].includes(String(row.object_name).toLowerCase())) ||
      lookup.has('dimvehicle') ||
      lookup.has('factopportunity')
    );
  });
  const byId = new Map();
  for (const row of [...requestedRows, ...topVendorRows]) byId.set(row.object_id, row);
  return { vendorRows, selectedRows: [...byId.values()] };
}

function databaseContext(vendorRows, humanPaths) {
  const schemas = [...new Set(vendorRows.map((row) => row.schema).filter(Boolean))].sort();
  const objectCounts = {};
  for (const row of vendorRows) objectCounts[row.object_type || 'object'] = (objectCounts[row.object_type || 'object'] || 0) + 1;
  const taggedObjects = [...vendorRows]
    .sort((left, right) => objectScore(right) - objectScore(left))
    .slice(0, 20)
    .map((row) => ({
      full_name: `${row.database}.${row.schema}.${row.object_name}`,
      type: row.object_type,
      downstream_count: Number(row.downstream_count || 0),
      upstream_count: Number(row.upstream_count || 0),
      confidence: row.confidence_label || 'not surfaced',
    }));
  const context = {
    canonical_id: databaseCanonicalId('VendorData'),
    database: 'VendorData',
    aliases: databaseAliases('VendorData'),
    plain_english_summary:
      'VendorData is a cataloged database containing vendor and third-party feed objects. The exact business owner, SLA, lifecycle/status, live freshness, and certification are not surfaced in metadata.',
    schemas,
    object_counts: objectCounts,
    tagged_objects: taggedObjects,
    profile_coverage: {
      status: vendorRows.some((row) => row.answer_cards?.profile_teaser)
        ? 'some profile context surfaced'
        : 'not surfaced in metadata',
    },
    related_products: ['not surfaced in metadata'],
    known_gaps: [
      'business owner not surfaced in metadata',
      'SLA not surfaced in metadata',
      'lifecycle/status not surfaced in metadata',
      'live freshness not surfaced in metadata',
      'certification not surfaced in metadata',
    ],
    confidence: {
      inventory_confidence: 'high',
      description_confidence: 'low',
      caveat: 'Database purpose is inferred from cataloged object and schema names only.',
    },
    canonical_human_page: databaseHumanPage('VendorData', humanPaths),
    generated_at: generatedAt,
  };
  return { ...context, evidence_hash: `sha256:${hashJson(context)}` };
}

function classifyLineageItems(items) {
  const values = unique(items);
  return {
    orchestrators: values.filter((item) => /\.dtsx|ssisdb|adf|pipeline/i.test(item)),
    reports: values.filter((item) => /report|rdl|reportserver|ssrs/i.test(item)),
    sql_objects: values.filter((item) => !/\.dtsx|ssisdb|adf|pipeline|report|rdl|reportserver|ssrs/i.test(item)),
  };
}

function lineageContext(objectRecord) {
  const metadata = objectRecord.metadata || {};
  const upstreamLoaders = metadata.created_by || [];
  const upstreamSources = metadata.reads_from || metadata.depends_on || [];
  const downstreamConsumers = metadata.used_by || [];
  const writesTo = metadata.writes_to || [];
  const upstreamClasses = classifyLineageItems([...upstreamLoaders, ...upstreamSources]);
  const downstreamClasses = classifyLineageItems([...downstreamConsumers, ...writesTo]);
  const base = {
    canonical_id: objectRecord.canonical_id,
    full_name: objectRecord.full_name,
    upstream_sources: upstreamSources,
    upstream_loaders: upstreamLoaders.filter((item) => !upstreamClasses.orchestrators.includes(item)),
    orchestrators: upstreamClasses.orchestrators,
    downstream_consumers: downstreamClasses.sql_objects,
    downstream_reports: downstreamClasses.reports,
    maintenance_reads: [],
    relationship_confidence: objectRecord.confidence,
    caveats: [
      'Relationships are from deterministic lineage/runtime metadata.',
      'Business owner, SLA, lifecycle/status, live freshness, and certification are not surfaced in metadata.',
    ],
    canonical_human_page: objectRecord.canonical_human_page,
    source_artifact_paths: objectRecord.source_artifact_paths,
  };
  return { ...base, evidence_hash: `sha256:${hashJson(base)}` };
}

function ambiguityGroups(locatorRows) {
  const groups = new Map();
  for (const row of locatorRows) {
    const key = normalizeLookup(row.lookup_key);
    if (!key) continue;
    if (!groups.has(key)) groups.set(key, new Map());
    groups.get(key).set(row.canonical_id, row);
  }
  return [...groups.entries()]
    .filter(([, matches]) => matches.size > 1)
    .map(([lookup_key, matches]) => ({
      lookup_key,
      options: [...matches.values()].map((row) => ({
        canonical_id: row.canonical_id,
        type: row.type,
        database: row.database,
        schema: row.schema,
        object: row.object,
        canonical_human_page: row.canonical_human_page,
        quick_context_page: row.quick_context_page,
      })),
      recommended_disambiguation:
        'Ask the user to choose the database/schema/object when the prompt does not clearly identify one option.',
    }))
    .sort((left, right) => left.lookup_key.localeCompare(right.lookup_key));
}

async function writePage(slug, packet, markdown) {
  const evidenceFile = `${slug}.evidence.json`;
  const markdownFile = `${slug}.md`;
  await fs.mkdir(outputRoot, { recursive: true });
  await fs.writeFile(path.join(outputRoot, evidenceFile), `${JSON.stringify(packet, null, 2)}\n`, 'utf8');
  await fs.writeFile(path.join(outputRoot, markdownFile), `${markdown.trim()}\n`, 'utf8');
  pages.push({
    evidenceFile,
    markdownFile,
    page_type: packet.page_type,
    page_title: packet.page_title,
    page_tree_path: packet.page_tree_path,
    evidence_hash: packet.evidence_hash,
  });
}

function startHereMarkdown(packet) {
  return `# Rovo Start Here

Use these Sonic Data Lineage AI Retrieval Artifacts first for database, object, and lineage questions.

## Lookup Order

1. Search \`Rovo Object Locator 001\` for the user's database, schema, table, view, procedure, report, package, or pipeline name.
2. If the locator has multiple matches, read \`Rovo Ambiguity Context 001\` and ask the user to choose unless the prompt clearly names the exact database/schema/object.
3. For database questions, read \`Rovo Database Context 001\`.
4. For object summary questions, read \`Rovo Object Summary Context 001\`.
5. For lineage questions, read \`Rovo Upstream Context 001\` and \`Rovo Downstream Context 001\`.
6. Link to the canonical human catalog page when available.

## Safety Rules

Do not invent owner, data steward, SLA, lifecycle/status, live freshness, or certification. When the metadata does not surface a fact, say \`not surfaced in metadata\`.

## Artifact Pages

${mdTable(
  packet.artifact_pages.map((page) => ({ Page: `\`${page}\``, Path: `\`${pagePath([...rovoRootPath, page])}\`` })),
  ['Page', 'Path']
)}

## Technical Evidence

- Evidence hash: \`${packet.evidence_hash}\`
- Generated at: ${packet.generated_at}`;
}

function locatorMarkdown(packet) {
  return `# Rovo Object Locator 001

Use this table to resolve database and object names before answering.

${mdTable(
  packet.locator_rows.map((row) => ({
    lookup_key: `\`${row.lookup_key}\``,
    canonical_id: `\`${row.canonical_id}\``,
    type: row.type,
    database: row.database,
    schema: row.schema,
    object: row.object,
    quick_context_page: row.quick_context_page,
    canonical_human_page: row.canonical_human_page,
    confidence: row.confidence,
  })),
  ['lookup_key', 'canonical_id', 'type', 'database', 'schema', 'object', 'quick_context_page', 'canonical_human_page', 'confidence']
)}

## Technical Evidence

- Locator rows: ${packet.locator_rows.length}
- Evidence hash: \`${packet.evidence_hash}\``;
}

function databaseContextMarkdown(packet) {
  const context = packet.contexts[0];
  return `# Rovo Database Context 001

## VendorData

${context.plain_english_summary}

| Field | Value |
| --- | --- |
| Canonical id | \`${context.canonical_id}\` |
| Database | \`${context.database}\` |
| Aliases | ${context.aliases.map((alias) => `\`${alias}\``).join(', ')} |
| Canonical human page | \`${context.canonical_human_page}\` |
| Inventory confidence | ${context.confidence.inventory_confidence} |
| Description confidence | ${context.confidence.description_confidence} |

## Schemas

${context.schemas.map((schema) => `- \`${schema}\``).join('\n')}

## Object Counts

${mdTable(Object.entries(context.object_counts).map(([Type, Count]) => ({ Type, Count })), ['Type', 'Count'])}

## Tagged Or Important Objects

${mdTable(
  context.tagged_objects.map((row) => ({
    Object: `\`${row.full_name}\``,
    Type: row.type,
    Upstream: row.upstream_count,
    Downstream: row.downstream_count,
    Confidence: row.confidence,
  })),
  ['Object', 'Type', 'Upstream', 'Downstream', 'Confidence']
)}

## Known Gaps

${context.known_gaps.map((gap) => `- ${gap}`).join('\n')}

## Technical Evidence

- Evidence hash: \`${packet.evidence_hash}\``;
}

function objectSummaryMarkdown(packet) {
  return `# Rovo Object Summary Context 001

Use this page for object-summary questions such as \`tell me about DimVehicle\`.

${mdTable(
  packet.objects.map((object) => ({
    canonical_id: `\`${object.canonical_id}\``,
    full_name: `\`${object.full_name}\``,
    type: object.type,
    aliases: object.aliases.slice(0, 6).map((alias) => `\`${alias}\``).join(', '),
    tags: object.tags.join(', '),
    columns: object.column_count,
    upstream: object.upstream_summary,
    downstream: object.downstream_summary,
    profile: object.profile_status,
    human_page: object.canonical_human_page,
  })),
  ['canonical_id', 'full_name', 'type', 'aliases', 'tags', 'columns', 'upstream', 'downstream', 'profile', 'human_page']
)}

## Missing Facts

Owner, data steward, SLA, lifecycle/status, live freshness, certification, and business definition are not surfaced in metadata unless a row says otherwise.

## Technical Evidence

- Evidence hash: \`${packet.evidence_hash}\``;
}

function lineageMarkdown(packet, direction) {
  return `# ${packet.page_title}

Use this page for ${direction} lineage questions about \`${packet.record.full_name}\`.

## Target Object

| Field | Value |
| --- | --- |
| Canonical id | \`${packet.record.canonical_id}\` |
| Full name | \`${packet.record.full_name}\` |
| Canonical human page | \`${packet.record.canonical_human_page}\` |

## ${direction === 'upstream' ? 'Upstream Sources' : 'Downstream Consumers'}

${mdTable(
  (direction === 'upstream'
    ? [...packet.record.upstream_sources, ...packet.record.upstream_loaders, ...packet.record.orchestrators]
    : [...packet.record.downstream_consumers, ...packet.record.downstream_reports]
  )
    .slice(0, 80)
    .map((item) => ({ Name: `\`${item}\`` })),
  ['Name']
)}

## Relationship Caveats

${packet.record.caveats.map((caveat) => `- ${caveat}`).join('\n')}

## Technical Evidence

- Evidence hash: \`${packet.evidence_hash}\``;
}

function ambiguityMarkdown(packet) {
  return `# Rovo Ambiguity Context 001

Use this page when a lookup key maps to more than one catalog object.

${packet.ambiguity_groups
  .map(
    (group) => `## ${group.lookup_key}

${mdTable(
  group.options.map((option) => ({
    canonical_id: `\`${option.canonical_id}\``,
    type: option.type,
    database: option.database,
    schema: option.schema,
    object: option.object,
    quick_context_page: option.quick_context_page,
    human_page: option.canonical_human_page,
  })),
  ['canonical_id', 'type', 'database', 'schema', 'object', 'quick_context_page', 'human_page']
)}

${group.recommended_disambiguation}`
  )
  .join('\n\n')}

## Technical Evidence

- Ambiguity groups: ${packet.ambiguity_groups.length}
- Evidence hash: \`${packet.evidence_hash}\``;
}

function evaluationPromptsMarkdown(packet) {
  return `# Rovo Evaluation Prompts

Use these prompts to evaluate whether Rovo retrieves the correct Sonic Data Lineage pages and avoids inventing unsupported facts.

${mdTable(
  packet.evaluation.prompts.map((prompt) => ({
    id: `\`${prompt.id}\``,
    category: prompt.category,
    prompt: prompt.prompt,
    expected_canonical_id: `\`${prompt.expected_canonical_id}\``,
    expected_retrieval_page: prompt.expected_retrieval_page,
    expected_behavior: prompt.expected_behavior,
  })),
  ['id', 'category', 'prompt', 'expected_canonical_id', 'expected_retrieval_page', 'expected_behavior']
)}

## Forbidden Invented Facts

Rovo should fail evaluation if it invents owners, SLAs, lifecycle/status, live freshness, certification, raw rows, sample values, or unsupported business definitions.

## Technical Evidence

- Prompt count: ${packet.evaluation.prompts.length}
- Source prompt file: \`${packet.source_prompt_file}\`
- Evidence hash: \`${packet.evidence_hash}\``;
}

function ensureAcceptance({ locatorRows, ambiguity, databaseRecord, summaryObjects, factLineage }) {
  const failures = [];
  const vendorLocator = locatorRows.find((row) => row.canonical_id === databaseCanonicalId('VendorData'));
  if (!vendorLocator) failures.push('VendorData database locator row is missing.');
  if (!summaryObjects.some((object) => normalizeLookup(object.object) === 'dimvehicle')) {
    failures.push('DimVehicle object summary context is missing.');
  }
  if (!ambiguity.some((group) => group.lookup_key === 'dimvehicle')) {
    failures.push('DimVehicle ambiguity group is missing.');
  }
  if (!factLineage.upstream_sources && !factLineage.upstream_loaders) failures.push('FactOpportunity upstream lineage context is missing.');
  if (!databaseRecord.known_gaps.some((gap) => /owner.*not surfaced/i.test(gap))) {
    failures.push('Unsupported governance facts are not marked as not surfaced.');
  }
  for (const row of locatorRows) {
    for (const field of ['lookup_key', 'canonical_id', 'type', 'database', 'schema', 'object', 'aliases', 'quick_context_page', 'canonical_human_page', 'confidence']) {
      if (row[field] === undefined) failures.push(`Locator row missing ${field}: ${row.lookup_key || row.canonical_id}`);
    }
  }
  return failures;
}

async function main() {
  const rows = await readRuntimeRows();
  const humanPaths = await humanPagePathIndex();
  const { vendorRows, selectedRows } = selectTargetRows(rows);
  const objectRecords = [];
  for (const row of selectedRows) {
    // eslint-disable-next-line no-await-in-loop
    const metadata = await readMarkdownMetadata(row.source_markdown_path);
    objectRecords.push(objectSummary(row, metadata, humanPaths));
  }

  const databaseRecord = databaseContext(vendorRows, humanPaths);
  const schemaEntities = databaseRecord.schemas.map((schema) => ({
    canonical_id: schemaCanonicalId('VendorData', schema),
    type: 'schema',
    database: 'VendorData',
    schema,
    object: 'not applicable',
    aliases: schemaAliases('VendorData', schema),
    quick_context_page: 'Rovo Database Context 001',
    canonical_human_page: schemaHumanPage('VendorData', schema, humanPaths),
    confidence: 'high',
    evidence_hash: databaseRecord.evidence_hash,
  }));
  const databaseEntity = {
    canonical_id: databaseRecord.canonical_id,
    type: 'database',
    database: databaseRecord.database,
    schema: 'not applicable',
    object: 'not applicable',
    aliases: databaseRecord.aliases,
    quick_context_page: 'Rovo Database Context 001',
    canonical_human_page: databaseRecord.canonical_human_page,
    confidence: 'high',
    evidence_hash: databaseRecord.evidence_hash,
  };
  const objectEntities = objectRecords.map((record) => ({
    canonical_id: record.canonical_id,
    type: record.type,
    database: record.database,
    schema: record.schema,
    object: record.object,
    aliases: record.aliases,
    quick_context_page: 'Rovo Object Summary Context 001',
    canonical_human_page: record.canonical_human_page,
    confidence: record.confidence.lineage_confidence,
    evidence_hash: record.evidence_hash,
  }));
  const locatorRows = [...locatorRowsForEntity(databaseEntity), ...schemaEntities.flatMap(locatorRowsForEntity), ...objectEntities.flatMap(locatorRowsForEntity)]
    .slice(0, 500);
  const ambiguity = ambiguityGroups(locatorRows);
  const evaluation = await readJson(evaluationPromptPath, { prompts: [] });
  const factRecord =
    objectRecords.find((record) => record.full_name === 'Sonic_DW.dbo.FactOpportunity') ||
    objectRecords.find((record) => record.object === 'FactOpportunity');
  const factLineage = lineageContext(factRecord);
  const summaryObjects = objectRecords
    .filter((record) =>
      ['dimvehicle', 'dimvehicle', 'factopportunity', 'factopportunity'].includes(normalizeLookup(record.object))
    )
    .map(({ metadata, ...record }) => record)
    .sort((left, right) => left.full_name.localeCompare(right.full_name));
  const acceptanceFailures = ensureAcceptance({ locatorRows, ambiguity, databaseRecord, summaryObjects, factLineage });

  const artifactPages = [
    'Rovo Start Here',
    'Rovo Object Locator 001',
    'Rovo Database Context 001',
    'Rovo Object Summary Context 001',
    'Rovo Upstream Context 001',
    'Rovo Downstream Context 001',
    'Rovo Ambiguity Context 001',
    'Rovo Evaluation Prompts',
  ];

  const startPacket = {
    page_type: 'rovo-start-here',
    page_title: 'Rovo Start Here',
    page_tree_path: [...rovoRootPath, 'Rovo Start Here'],
    generated_at: generatedAt,
    artifact_pages: artifactPages,
  };
  startPacket.evidence_hash = `sha256:${hashJson(startPacket)}`;
  await writePage('rovo-start-here', startPacket, startHereMarkdown(startPacket));

  const locatorPacket = {
    page_type: 'rovo-object-locator',
    page_title: 'Rovo Object Locator 001',
    page_tree_path: [...rovoRootPath, 'Rovo Object Locator 001'],
    generated_at: generatedAt,
    locator_rows: locatorRows,
  };
  locatorPacket.evidence_hash = `sha256:${hashJson(locatorPacket)}`;
  await writePage('rovo-object-locator-001', locatorPacket, locatorMarkdown(locatorPacket));

  const databasePacket = {
    page_type: 'rovo-database-context',
    page_title: 'Rovo Database Context 001',
    page_tree_path: [...rovoRootPath, 'Rovo Database Context 001'],
    generated_at: generatedAt,
    contexts: [databaseRecord],
  };
  databasePacket.evidence_hash = `sha256:${hashJson(databasePacket)}`;
  await writePage('rovo-database-context-001', databasePacket, databaseContextMarkdown(databasePacket));

  const objectSummaryPacket = {
    page_type: 'rovo-object-summary-context',
    page_title: 'Rovo Object Summary Context 001',
    page_tree_path: [...rovoRootPath, 'Rovo Object Summary Context 001'],
    generated_at: generatedAt,
    objects: summaryObjects,
  };
  objectSummaryPacket.evidence_hash = `sha256:${hashJson(objectSummaryPacket)}`;
  await writePage('rovo-object-summary-context-001', objectSummaryPacket, objectSummaryMarkdown(objectSummaryPacket));

  const upstreamPacket = {
    page_type: 'rovo-upstream-context',
    page_title: 'Rovo Upstream Context 001',
    page_tree_path: [...rovoRootPath, 'Rovo Upstream Context 001'],
    generated_at: generatedAt,
    record: factLineage,
  };
  upstreamPacket.evidence_hash = `sha256:${hashJson(upstreamPacket)}`;
  await writePage('rovo-upstream-context-001', upstreamPacket, lineageMarkdown(upstreamPacket, 'upstream'));

  const downstreamPacket = {
    page_type: 'rovo-downstream-context',
    page_title: 'Rovo Downstream Context 001',
    page_tree_path: [...rovoRootPath, 'Rovo Downstream Context 001'],
    generated_at: generatedAt,
    record: factLineage,
  };
  downstreamPacket.evidence_hash = `sha256:${hashJson(downstreamPacket)}`;
  await writePage('rovo-downstream-context-001', downstreamPacket, lineageMarkdown(downstreamPacket, 'downstream'));

  const ambiguityPacket = {
    page_type: 'rovo-ambiguity-context',
    page_title: 'Rovo Ambiguity Context 001',
    page_tree_path: [...rovoRootPath, 'Rovo Ambiguity Context 001'],
    generated_at: generatedAt,
    ambiguity_groups: ambiguity,
  };
  ambiguityPacket.evidence_hash = `sha256:${hashJson(ambiguityPacket)}`;
  await writePage('rovo-ambiguity-context-001', ambiguityPacket, ambiguityMarkdown(ambiguityPacket));

  const evaluationPacket = {
    page_type: 'rovo-evaluation-prompts',
    page_title: 'Rovo Evaluation Prompts',
    page_tree_path: [...rovoRootPath, 'Rovo Evaluation Prompts'],
    generated_at: generatedAt,
    source_prompt_file: path.relative(process.cwd(), evaluationPromptPath).replaceAll('\\', '/'),
    evaluation,
  };
  evaluationPacket.evidence_hash = `sha256:${hashJson(evaluationPacket)}`;
  await writePage('rovo-evaluation-prompts', evaluationPacket, evaluationPromptsMarkdown(evaluationPacket));

  await fs.writeFile(
    path.join(outputRoot, 'manifest.json'),
    `${JSON.stringify(
      {
        generated_at: generatedAt,
        root: pagePath(rovoRootPath),
        pages,
        acceptance: {
          status: acceptanceFailures.length === 0 ? 'passed' : 'failed',
          failures: acceptanceFailures,
        },
      },
      null,
      2
    )}\n`,
    'utf8'
  );
  console.log(
    JSON.stringify(
      {
        status: acceptanceFailures.length === 0 ? 'rovo-dry-run-built' : 'failed',
        outputRoot: outputRoot.replaceAll('\\', '/'),
        pages: pages.length,
        locatorRows: locatorRows.length,
        ambiguityGroups: ambiguity.length,
        acceptanceFailures,
      },
      null,
      2
    )
  );
  if (acceptanceFailures.length > 0) process.exitCode = 1;
}

await main();
