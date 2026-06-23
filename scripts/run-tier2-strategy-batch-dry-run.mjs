import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const dryRunRoot = path.resolve('data/confluence/human-catalog-dry-run');
const packetRoot = path.resolve('docs/confluence-full-database-catalog-deployment');
const strategyPath = path.join(packetRoot, 'T2P-05-tier2-batch-strategy.json');
const coverageManifestPath = path.join(packetRoot, 'T2P-01-tier2-object-coverage-manifest.jsonl');
const batchId = process.argv.find((arg) => arg.startsWith('--batch-id='))?.split('=')[1] || 'T2B-001';
const tableOnly = process.argv.includes('--table-only');
const publishLive = process.argv.includes('--publish');
const canonicalRoot = ['Sonic Data Lineage', 'Database Catalog'];
const databaseSchemaLabels = ['human-lineage-catalog', 'database-catalog', 'database-catalog-tier1', 'database-catalog-link-refresh'];
const objectLabels = ['human-lineage-catalog', 'database-catalog', 'database-catalog-tier2', 'thin-object-page'];

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    encoding: 'utf8',
    stdio: 'inherit',
    shell: false,
  });
  if (result.status !== 0) throw new Error(`${command} ${args.join(' ')} failed with exit code ${result.status}`);
}

async function readJson(file) {
  return JSON.parse(await fs.readFile(file, 'utf8'));
}

async function readCoverageObjects() {
  const text = await fs.readFile(coverageManifestPath, 'utf8');
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line))
    .filter((row) => row.record_type === 'object');
}

async function writeText(file, text) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, `${text.trim()}\n`, 'utf8');
}

function slug(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function pagePath(values) {
  return (values || []).filter(Boolean).join(' / ');
}

function comparableObjectName(value) {
  return String(value || '').replace(/\s+/g, '');
}

function mdTable(rows, headers) {
  const safeRows = rows.length > 0 ? rows : [Object.fromEntries(headers.map((header) => [header, 'none']))];
  const head = `| ${headers.join(' | ')} |`;
  const sep = `| ${headers.map(() => '---').join(' | ')} |`;
  const body = safeRows.map((row) => `| ${headers.map((header) => row[header] ?? '').join(' | ')} |`);
  return [head, sep, ...body].join('\n');
}

function pageTitle(packet) {
  if (packet.page_type === 'schema') return `${packet.catalog_slice?.database || packet.page_tree_path?.[3]}.${packet.catalog_slice?.schema || packet.page_tree_path?.[4]}`;
  if (packet.page_type === 'object') return `${packet.object.database}.${packet.object.schema}.${packet.object.name}`;
  return packet.page_title || packet.page_tree_path?.at(-1);
}

function referencePages(batch) {
  return [
    canonicalRoot,
    [...canonicalRoot, batch.platform],
  ].map((treePath) => ({
    kind: 'reference',
    title: treePath.at(-1),
    treePath,
    page_type: 'reference',
    evidence_hash: null,
    evidence_file: null,
    markdown_file: null,
    labels: [],
  }));
}

function plannedPages({ batch, databasePacket, schemaPacket, objectPackets }) {
  return [
    ...referencePages(batch),
    {
      kind: 'leaf',
      title: pageTitle(databasePacket),
      treePath: databasePacket.page_tree_path,
      page_type: databasePacket.page_type,
      evidence_hash: databasePacket.evidence_hash,
      evidence_file: databasePacket.evidence_file,
      markdown_file: databasePacket.markdown_file,
      labels: databaseSchemaLabels,
      snippets: ['Plain-English Summary', 'High-Use Objects', 'Technical Evidence'],
    },
    {
      kind: 'leaf',
      title: pageTitle(schemaPacket),
      treePath: schemaPacket.page_tree_path,
      page_type: schemaPacket.page_type,
      evidence_hash: schemaPacket.evidence_hash,
      evidence_file: schemaPacket.evidence_file,
      markdown_file: schemaPacket.markdown_file,
      labels: databaseSchemaLabels,
      snippets: ['Plain-English Summary', 'Most Used Objects', 'Tables', 'Technical Evidence'],
    },
    ...objectPackets.map((packet) => ({
      kind: 'leaf',
      title: pageTitle(packet),
      treePath: packet.page_tree_path,
      page_type: packet.page_type,
      evidence_hash: packet.evidence_hash,
      evidence_file: packet.evidence_file,
      markdown_file: packet.markdown_file,
      labels: objectLabels,
      snippets: ['Plain-English Summary', 'Business Meaning And Impact', 'Known Gaps', 'Technical Evidence'],
    })),
  ];
}

async function loadCurrentPackets(batch) {
  const manifest = await readJson(path.join(dryRunRoot, 'manifest.json'));
  const packets = [];
  for (const entry of manifest.pages || []) {
    // eslint-disable-next-line no-await-in-loop
    const packet = await readJson(path.join(dryRunRoot, entry.evidenceFile));
    packets.push({ ...packet, evidence_file: entry.evidenceFile, markdown_file: entry.markdownFile });
  }
  return {
    databasePacket: packets.find(
      (packet) => packet.page_type === 'database' && packet.page_tree_path?.[2] === batch.platform && packet.page_tree_path?.[3] === batch.database
    ),
    schemaPacket: packets.find(
      (packet) =>
        packet.page_type === 'schema' &&
        packet.page_tree_path?.[2] === batch.platform &&
        packet.page_tree_path?.[3] === batch.database &&
        packet.page_tree_path?.[4] === batch.schema
    ),
    objectPackets: packets
      .filter(
        (packet) =>
          packet.page_type === 'object' &&
          packet.object?.platform === batch.platform &&
          packet.object?.database === batch.database &&
          packet.object?.schema === batch.schema
      )
      .sort((left, right) => String(left.object?.name || '').localeCompare(String(right.object?.name || ''))),
  };
}

function validateObjectPacket(batch, packet) {
  const failures = [];
  const fullPath = pagePath(packet.page_tree_path || []);
  const approvedPrefix = pagePath([...canonicalRoot, batch.platform, batch.database, batch.schema]);
  if (!fullPath.startsWith(approvedPrefix)) failures.push(`Object page is outside the approved schema path: ${fullPath}`);
  if (fullPath.includes('High-Value Assets') || fullPath.includes('AI Retrieval Artifacts')) {
    failures.push(`Object page uses a forbidden branch: ${fullPath}`);
  }
  if (packet.page_generation_level !== 'thin') failures.push(`${fullPath} is not marked as a thin object page.`);
  if (packet.object?.platform !== batch.platform || packet.object?.database !== batch.database || packet.object?.schema !== batch.schema) {
    failures.push(`${fullPath} object identity does not match ${batch.platform} / ${batch.database} / ${batch.schema}.`);
  }
  if (!packet.object?.name || !packet.object?.type) failures.push(`${fullPath} is missing object name or type.`);
  if (!Array.isArray(packet.aliases) || packet.aliases.length === 0) failures.push(`${fullPath} is missing aliases.`);
  if (!Array.isArray(packet.tags)) failures.push(`${fullPath} is missing deterministic tags.`);
  if (!Array.isArray(packet.not_surfaced_facts) || packet.not_surfaced_facts.length === 0) {
    failures.push(`${fullPath} is missing not_surfaced_facts.`);
  }
  if (!packet.confidence?.lineage_confidence || !packet.confidence?.documentation_confidence) {
    failures.push(`${fullPath} is missing page-level confidence.`);
  }
  return failures;
}

function validationFailures({ batch, databasePacket, schemaPacket, objectPackets, planned }) {
  const failures = [];
  if (!databasePacket) failures.push(`Scoped dry-run output is missing the ${batch.database} database page.`);
  if (!schemaPacket) failures.push(`Scoped dry-run output is missing the ${batch.database}.${batch.schema} schema page.`);
  if (objectPackets.length !== batch.object_count) failures.push(`Expected ${batch.object_count} object pages, found ${objectPackets.length}.`);
  const expectedNames = new Set(batch.object_names);
  const actualNames = new Set(objectPackets.map((packet) => packet.object?.name).filter(Boolean));
  const actualComparableNames = new Set([...actualNames].map(comparableObjectName));
  for (const name of expectedNames) {
    if (!actualNames.has(name) && !actualComparableNames.has(comparableObjectName(name))) {
      failures.push(`Expected object was not generated: ${name}`);
    }
  }
  const expectedComparableNames = new Set([...expectedNames].map(comparableObjectName));
  for (const name of actualNames) {
    if (!expectedNames.has(name) && !expectedComparableNames.has(comparableObjectName(name))) {
      failures.push(`Unexpected object was generated: ${name}`);
    }
  }
  if (schemaPacket?.catalog_slice?.link_status_summary?.planned_in_packet !== objectPackets.length) {
    failures.push(`Schema link-status summary does not mark ${objectPackets.length} objects as planned in packet.`);
  }
  for (const packet of objectPackets) failures.push(...validateObjectPacket(batch, packet));
  for (const page of planned) {
    const fullPath = pagePath(page.treePath || []);
    if (!fullPath.startsWith(pagePath(canonicalRoot))) failures.push(`Planned page outside Database Catalog: ${fullPath}`);
  }
  return failures;
}

function objectRows(objectPackets) {
  return objectPackets.map((packet) => ({
    Object: `\`${packet.object.name}\``,
    Type: packet.object.type,
    Tags: (packet.tags || []).join(', ') || 'none',
    Downstream: packet.lineage?.downstream_consumers?.length ?? 0,
    Columns: packet.profile_signals?.column_count ?? packet.technical_signals?.columns?.length ?? 0,
    Confidence: packet.confidence?.lineage_confidence || 'not surfaced',
    Path: `\`${pagePath(packet.page_tree_path)}\``,
  }));
}

function markdownPacket(packet) {
  return `# ${packet.batch.batch_id} Tier 2 Batch Publish Packet

## Purpose

This packet prepares a dry-run publish package for the next queued Tier 2 batch
from \`docs/DATABASE_CATALOG_TIER2_BATCH_STRATEGY.md\`.

It does not publish to Confluence and it does not clean up, archive, delete, or
move pages.

## Recommendation

${packet.validation.status === 'passed' ? 'Ready for review. Live publish requires explicit approval.' : 'Not ready for live publish approval until validation failures are resolved.'}

## Scope

| Signal | Value |
| --- | --- |
| Batch | \`${packet.batch.batch_id}\` |
| Platform/Product | \`${packet.batch.platform}\` |
| Database | \`${packet.batch.database}\` |
| Schema | \`${packet.batch.schema}\` |
| Object type scope | \`${packet.batch.object_type_scope}\` |
| Object pages | ${packet.summary.object_pages} |
| Link refresh pages | ${packet.summary.link_refresh_pages} |
| Total planned entries | ${packet.summary.total_planned_pages} |
| Validation status | \`${packet.validation.status}\` |

## Object Pages

${mdTable(objectRows(packet.object_packets), ['Object', 'Type', 'Tags', 'Downstream', 'Columns', 'Confidence', 'Path'])}

## Validation

${packet.validation.failures.length === 0 ? '- No packet validation failures.' : packet.validation.failures.map((failure) => `- ${failure}`).join('\n')}

## Live Gate

Live publish requires explicit user approval:

\`\`\`powershell
npm run confluence:full:tier2:${packet.batch.batch_id.toLowerCase()}:publish
\`\`\`
`;
}

function readbackMarkdown(packet) {
  const published = packet.scope.publish_mode === 'live publish';
  return `# ${packet.batch.batch_id} Tier 2 Batch ${published ? 'Publish' : 'Dry-Run'} Readback

Date: 2026-06-23

${published ? 'Live Confluence publish was run for the packet pages.' : 'No live Confluence publish, cleanup, archive, delete, or move action was run.'}

No cleanup, archive, delete, or move action was run.

## Result

| Signal | Value |
| --- | ---: |
| Object pages generated | ${packet.summary.object_pages} |
| Database/schema link refresh pages | ${packet.summary.link_refresh_pages} |
| Total planned entries | ${packet.summary.total_planned_pages} |
| Validation status | ${packet.validation.status} |

## Command

\`\`\`powershell
node scripts/run-tier2-strategy-batch-dry-run.mjs --batch-id=${packet.batch.batch_id}${tableOnly ? ' --table-only' : ''}${published ? ' --publish' : ''}
\`\`\`
`;
}

async function main() {
  const strategy = await readJson(strategyPath);
  const sourceBatch = (strategy.all_batches || strategy.first_20_batches || []).find((item) => item.batch_id === batchId);
  if (!sourceBatch) throw new Error(`Batch not found in strategy: ${batchId}`);
  let batch = { ...sourceBatch, object_names: [...(sourceBatch.object_names || [])] };
  if (tableOnly) {
    const coverageObjects = await readCoverageObjects();
    const tableNames = new Set(
      coverageObjects
        .filter(
          (row) =>
            row.platform === sourceBatch.platform &&
            row.database === sourceBatch.database &&
            row.schema === sourceBatch.schema &&
            row.type === 'table'
        )
        .map((row) => row.name)
    );
    const objectNames = batch.object_names.filter((name) => tableNames.has(name));
    batch = {
      ...batch,
      object_type_scope: 'table',
      original_object_type_scope: sourceBatch.object_type_scope,
      original_object_count: sourceBatch.object_count,
      object_count: objectNames.length,
      object_names: objectNames,
      table_only: true,
    };
  }
  if (batch.object_names.length === 0) {
    console.log(JSON.stringify({ status: 'skipped', batch_id: batch.batch_id, reason: 'No table objects in batch.' }, null, 2));
    return;
  }
  run('node', [
    'scripts/build-human-confluence-catalog-dry-run.mjs',
    '--tier2-object-names',
    `${batch.database}.${batch.schema}:${batch.object_names.join(',')}`,
  ]);
  run('node', ['scripts/check-human-confluence-catalog-dry-run.mjs']);
  const { databasePacket, schemaPacket, objectPackets } = await loadCurrentPackets(batch);
  const planned = plannedPages({ batch, databasePacket, schemaPacket, objectPackets });
  const failures = validationFailures({ batch, databasePacket, schemaPacket, objectPackets, planned });
  const packetSlug = `${batch.batch_id}-${slug(batch.database)}-${slug(batch.schema)}${tableOnly ? '-table' : ''}-tier2-publish-packet`;
  const packetJsonPath = path.join(packetRoot, `${packetSlug}.json`);
  const packetMarkdownPath = path.join(packetRoot, `${packetSlug}.md`);
  const readbackPath = path.join(packetRoot, `${batch.batch_id}-${slug(batch.database)}-${slug(batch.schema)}${tableOnly ? '-table' : ''}-${publishLive ? 'publish' : 'dry-run'}-readback.md`);
  const packet = {
    packet_id: batch.batch_id,
    generated_at: new Date().toISOString(),
    batch,
    scope: {
      canonical_root: pagePath(canonicalRoot),
      deployment_tier: 'Tier 2 thin canonical object pages and schema link refresh',
      publish_mode: publishLive ? 'live publish' : 'reviewed publish packet; no live publish performed',
      cleanup_mode: 'none; cleanup remains separate',
      source_strategy: path.relative(process.cwd(), strategyPath).replaceAll('\\', '/'),
      object_filter: tableOnly ? 'table-only' : 'strategy batch',
    },
    summary: {
      reference_pages: 2,
      link_refresh_pages: 2,
      object_pages: objectPackets.length,
      total_planned_pages: planned.length,
    },
    planned_pages: planned,
    object_packets: objectPackets,
    source_artifacts: {
      dry_run_output: 'data/confluence/human-catalog-dry-run',
      batch_strategy: path.relative(process.cwd(), strategyPath).replaceAll('\\', '/'),
    },
    output_artifacts: {
      packet_json: path.relative(process.cwd(), packetJsonPath).replaceAll('\\', '/'),
      packet_markdown: path.relative(process.cwd(), packetMarkdownPath).replaceAll('\\', '/'),
      readback_markdown: path.relative(process.cwd(), readbackPath).replaceAll('\\', '/'),
    },
    validation: {
      status: failures.length === 0 ? 'passed' : 'failed',
      failures,
    },
  };
  await writeText(packetJsonPath, JSON.stringify(packet, null, 2));
  await writeText(packetMarkdownPath, markdownPacket(packet));
  await writeText(readbackPath, readbackMarkdown(packet));
  const publishArgs = ['scripts/publish-human-confluence-catalog-pilot.mjs', '--packet', path.relative(process.cwd(), packetJsonPath)];
  if (publishLive) publishArgs.push('--publish');
  run('node', publishArgs);
  console.log(JSON.stringify({ status: packet.validation.status, summary: packet.summary, artifacts: packet.output_artifacts }, null, 2));
  if (failures.length > 0) process.exitCode = 1;
}

await main();
