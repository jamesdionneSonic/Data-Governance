import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

import { requireDeltaScopeForAi } from '../engines/connectors/metadata-delta/index.js';

const outputRoot = path.resolve('data/confluence/snowflake-rovo-ai-retrieval-dry-run');
const runtimeRegistryPath = path.resolve(
  'data/lineage-runtime-package/sonic-data-lineage-runtime/registry/canonical-objects.jsonl'
);
const humanDryRunManifestPath = path.resolve('data/confluence/human-catalog-dry-run/manifest.json');
const snowflakeServer = 'snowflake-bipslyv-tlb12786';
const rovoRootPath = ['Sonic Data Lineage', 'AI Retrieval Artifacts', 'Snowflake'];
const generatedAt = new Date().toISOString();
const pages = [];
const deltaManifestPath = argValue('--delta-manifest');

function argValue(name, fallback = '') {
  const prefix = `${name}=`;
  const args = process.argv.slice(2);
  const inline = args.find((arg) => arg.startsWith(prefix));
  if (inline) return inline.slice(prefix.length);
  const index = args.indexOf(name);
  if (index >= 0) return args[index + 1] || fallback;
  return fallback;
}

function databaseFilter() {
  return new Set(
    argValue('--database')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean)
  );
}

function hashJson(value) {
  return crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex').toUpperCase();
}

function normalizeLookup(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');
}

function unique(values) {
  return [...new Set((values || []).map((value) => String(value || '').trim()).filter(Boolean))];
}

function pagePath(values) {
  return values.filter(Boolean).join(' / ');
}

function mdTable(rows, headers) {
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

async function readRuntimeRows(deltaScope) {
  const targetDatabases = databaseFilter();
  const text = await fs.readFile(runtimeRegistryPath, 'utf8');
  const rows = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line))
    .filter((row) => row.server === snowflakeServer || row.source_system === snowflakeServer)
    .filter((row) => targetDatabases.size === 0 || targetDatabases.has(row.database));
  return deltaScope.filterRows(rows, (row) => row.object_id);
}

async function humanPagePathIndex() {
  const manifest = await readJson(humanDryRunManifestPath, { pages: [] });
  const paths = new Set();
  for (const page of manifest.pages || []) {
    const packet = await readJson(path.resolve('data/confluence/human-catalog-dry-run', page.evidenceFile));
    if (packet?.page_tree_path) paths.add(pagePath(packet.page_tree_path));
  }
  return paths;
}

function databaseAliases(database) {
  return unique([database, normalizeLookup(database), database.replace(/_/g, ' ')]);
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

function humanDatabasePage(database, humanPaths) {
  const canonical = pagePath(['Sonic Data Lineage', 'Database Catalog', database]);
  return humanPaths.has(canonical) ? canonical : 'not created yet';
}

function humanObjectPage(row, humanPaths) {
  const canonical = pagePath(['Sonic Data Lineage', 'Database Catalog', row.database, row.schema, row.object_name]);
  return humanPaths.has(canonical) ? canonical : 'not created yet';
}

function databaseContexts(rows, humanPaths) {
  const byDatabase = Map.groupBy(rows, (row) => row.database);
  return [...byDatabase.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([database, dbRows]) => {
      const schemas = [...new Set(dbRows.map((row) => row.schema).filter(Boolean))].sort();
      const objectCounts = {};
      for (const row of dbRows) objectCounts[row.object_type || 'object'] = (objectCounts[row.object_type || 'object'] || 0) + 1;
      const topObjects = [...dbRows]
        .sort((left, right) => Number(right.column_count || 0) - Number(left.column_count || 0))
        .slice(0, 20)
        .map((row) => ({
          full_name: `${row.database}.${row.schema}.${row.object_name}`,
          type: row.object_type,
          columns: Number(row.column_count || 0),
          confidence: row.confidence_label || 'medium',
        }));
      const context = {
        canonical_id: `database:${database}`,
        database,
        aliases: databaseAliases(database),
        plain_english_summary: `${database} is a Snowflake database discovered through ${snowflakeServer}. Business owner, steward, SLA, lifecycle/status, live freshness, certification, and business definition are not surfaced in metadata.`,
        schemas,
        object_counts: objectCounts,
        tagged_objects: topObjects,
        profile_coverage: { status: 'metadata inventory only' },
        known_gaps: [
          'business owner not surfaced in metadata',
          'SLA not surfaced in metadata',
          'lifecycle/status not surfaced in metadata',
          'live freshness not surfaced in metadata',
          'certification not surfaced in metadata',
          'dependency/access-history lineage not surfaced in metadata',
        ],
        canonical_human_page: humanDatabasePage(database, humanPaths),
        source_artifact_paths: unique(dbRows.flatMap((row) => [row.source_markdown_path, row.context_pack_path])),
        generated_at: generatedAt,
      };
      return { ...context, evidence_hash: `sha256:${hashJson(context)}` };
    });
}

function objectSummaries(rows, humanPaths) {
  return [...rows]
    .sort((left, right) => Number(right.column_count || 0) - Number(left.column_count || 0))
    .slice(0, 250)
    .map((row) => {
      const record = {
        canonical_id: `object:${row.object_id}`,
        full_name: `${row.database}.${row.schema}.${row.object_name}`,
        type: row.object_type || 'object',
        database: row.database,
        schema: row.schema,
        object: row.object_name,
        aliases: objectAliases(row),
        tags: unique(['snowflake', 'metadata-inventory', 'review-needed']),
        plain_english_summary: `${row.database}.${row.schema}.${row.object_name} is a Snowflake ${row.object_type || 'object'} discovered through metadata inventory. Business definition is not surfaced in metadata.`,
        column_count: Number(row.column_count || 0),
        upstream_summary: '0 upstream dependency signals surfaced.',
        downstream_summary: '0 downstream consumer signals surfaced.',
        profile_status: 'metadata inventory only',
        confidence: {
          lineage_confidence: 'metadata-only',
          description_confidence: 'low',
          profile_confidence: 'metadata-only',
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
          'dependency/access-history lineage not surfaced in metadata',
        ],
        canonical_human_page: humanObjectPage(row, humanPaths),
        source_artifact_paths: [row.source_markdown_path, row.context_pack_path, row.compact_context_pack_path].filter(Boolean),
        generated_at: generatedAt,
      };
      return { ...record, evidence_hash: `sha256:${hashJson(record)}` };
    });
}

function locatorRows(databaseRecords, objectRecords) {
  const databaseRows = databaseRecords.flatMap((record) =>
    record.aliases.map((alias) => ({
      lookup_key: alias,
      canonical_id: record.canonical_id,
      type: 'database',
      database: record.database,
      schema: 'not applicable',
      object: 'not applicable',
      aliases: record.aliases,
      quick_context_page: 'Snowflake Rovo Database Context',
      canonical_human_page: record.canonical_human_page,
      confidence: 'metadata-only',
      evidence_hash: record.evidence_hash,
    }))
  );
  const objectRows = objectRecords.flatMap((record) =>
    record.aliases.map((alias) => ({
      lookup_key: alias,
      canonical_id: record.canonical_id,
      type: record.type,
      database: record.database,
      schema: record.schema,
      object: record.object,
      aliases: record.aliases,
      quick_context_page: 'Snowflake Rovo Object Summary Context',
      canonical_human_page: record.canonical_human_page,
      confidence: record.confidence.lineage_confidence,
      evidence_hash: record.evidence_hash,
    }))
  );
  return [...databaseRows, ...objectRows].slice(0, 500);
}

async function writePage(slug, packet, markdown) {
  const evidenceFile = `${slug}.evidence.json`;
  const markdownFile = `${slug}.md`;
  await fs.mkdir(outputRoot, { recursive: true });
  await fs.writeFile(path.join(outputRoot, evidenceFile), `${JSON.stringify(packet, null, 2)}\n`, 'utf8');
  await fs.writeFile(path.join(outputRoot, markdownFile), `${markdown.trim()}\n`, 'utf8');
  pages.push({ title: packet.page_title, evidenceFile, markdownFile, treePath: packet.page_tree_path });
}

function startMarkdown(packet) {
  return `# Snowflake Rovo Start Here\n\nUse these Snowflake AI retrieval artifacts before scanning broad human catalog pages.\n\n${mdTable(
    packet.artifact_pages.map((page) => ({ Page: page })),
    ['Page']
  )}\n\n## Scope\n\n- Connector: \`${snowflakeServer}\`\n- Databases: ${packet.databases.map((db) => `\`${db}\``).join(', ')}\n- Object count: ${packet.object_count}\n- Evidence hash: \`${packet.evidence_hash}\`\n`;
}

function locatorMarkdown(packet) {
  return `# Snowflake Rovo Object Locator\n\n${mdTable(
    packet.locator_rows.map((row) => ({
      lookup_key: `\`${row.lookup_key}\``,
      canonical_id: `\`${row.canonical_id}\``,
      type: row.type,
      database: row.database,
      schema: row.schema,
      object: row.object,
      quick_context_page: row.quick_context_page,
    })),
    ['lookup_key', 'canonical_id', 'type', 'database', 'schema', 'object', 'quick_context_page']
  )}`;
}

function databaseMarkdown(packet) {
  return `# Snowflake Rovo Database Context\n\n${packet.contexts
    .map(
      (context) => `## ${context.database}\n\n${context.plain_english_summary}\n\n${mdTable(
        Object.entries(context.object_counts).map(([Type, Objects]) => ({ Type, Objects })),
        ['Type', 'Objects']
      )}\n\nKnown gaps: ${context.known_gaps.join('; ')}`
    )
    .join('\n\n')}`;
}

function objectMarkdown(packet) {
  return `# Snowflake Rovo Object Summary Context\n\n${mdTable(
    packet.objects.map((object) => ({
      full_name: `\`${object.full_name}\``,
      type: object.type,
      columns: object.column_count,
      profile_status: object.profile_status,
      human_page: object.canonical_human_page,
    })),
    ['full_name', 'type', 'columns', 'profile_status', 'human_page']
  )}`;
}

async function main() {
  const deltaScope = await requireDeltaScopeForAi(deltaManifestPath, 'Snowflake Rovo AI retrieval dry run');
  await fs.rm(outputRoot, { recursive: true, force: true });
  await fs.mkdir(outputRoot, { recursive: true });
  const rows = await readRuntimeRows(deltaScope);
  const humanPaths = await humanPagePathIndex();
  const databases = [...new Set(rows.map((row) => row.database))].sort();
  const databaseRecords = databaseContexts(rows, humanPaths);
  const objectRecords = objectSummaries(rows, humanPaths);
  const locator = locatorRows(databaseRecords, objectRecords);

  const artifactPages = [
    'Snowflake Rovo Start Here',
    'Snowflake Rovo Object Locator',
    'Snowflake Rovo Database Context',
    'Snowflake Rovo Object Summary Context',
  ];
  const startPacket = {
    page_type: 'snowflake-rovo-start-here',
    page_title: 'Snowflake Rovo Start Here',
    page_tree_path: [...rovoRootPath, 'Snowflake Rovo Start Here'],
    generated_at: generatedAt,
    connector_id: snowflakeServer,
    databases,
    object_count: rows.length,
    artifact_pages: artifactPages,
  };
  startPacket.evidence_hash = `sha256:${hashJson(startPacket)}`;
  await writePage('snowflake-rovo-start-here', startPacket, startMarkdown(startPacket));

  const locatorPacket = {
    page_type: 'snowflake-rovo-object-locator',
    page_title: 'Snowflake Rovo Object Locator',
    page_tree_path: [...rovoRootPath, 'Snowflake Rovo Object Locator'],
    generated_at: generatedAt,
    locator_rows: locator,
  };
  locatorPacket.evidence_hash = `sha256:${hashJson(locatorPacket)}`;
  await writePage('snowflake-rovo-object-locator', locatorPacket, locatorMarkdown(locatorPacket));

  const databasePacket = {
    page_type: 'snowflake-rovo-database-context',
    page_title: 'Snowflake Rovo Database Context',
    page_tree_path: [...rovoRootPath, 'Snowflake Rovo Database Context'],
    generated_at: generatedAt,
    contexts: databaseRecords,
  };
  databasePacket.evidence_hash = `sha256:${hashJson(databasePacket)}`;
  await writePage('snowflake-rovo-database-context', databasePacket, databaseMarkdown(databasePacket));

  const objectPacket = {
    page_type: 'snowflake-rovo-object-summary-context',
    page_title: 'Snowflake Rovo Object Summary Context',
    page_tree_path: [...rovoRootPath, 'Snowflake Rovo Object Summary Context'],
    generated_at: generatedAt,
    objects: objectRecords,
  };
  objectPacket.evidence_hash = `sha256:${hashJson(objectPacket)}`;
  await writePage('snowflake-rovo-object-summary-context', objectPacket, objectMarkdown(objectPacket));

  for (const record of objectRecords) {
    const sourceObjectId = String(record.canonical_id || '').replace(/^object:/, '');
    for (const artifactPath of [
      'data/confluence/snowflake-rovo-ai-retrieval-dry-run/snowflake-rovo-object-locator.md',
      'data/confluence/snowflake-rovo-ai-retrieval-dry-run/snowflake-rovo-object-summary-context.md',
      'data/confluence/snowflake-rovo-ai-retrieval-dry-run/snowflake-rovo-database-context.md',
    ]) {
      deltaScope.recordTargetArtifact(sourceObjectId, 'rovo', artifactPath);
    }
  }

  await fs.writeFile(
    path.join(outputRoot, 'manifest.json'),
    `${JSON.stringify(
      {
        generated_at: generatedAt,
        root: pagePath(rovoRootPath),
        delta_scope: deltaScope.summary(),
        delta_target_artifacts: deltaScope.manifest?.target_artifacts || [],
        pages,
      },
      null,
      2
    )}\n`,
    'utf8'
  );
  console.log(
    JSON.stringify(
      {
        status: 'snowflake-rovo-dry-run-built',
        outputRoot: outputRoot.replaceAll('\\', '/'),
        pages: pages.length,
        databases: databases.length,
        databaseFilter: [...databaseFilter()],
        objects: rows.length,
        locatorRows: locator.length,
        deltaScope: deltaScope.summary(),
      },
      null,
      2
    )
  );
}

await main();
