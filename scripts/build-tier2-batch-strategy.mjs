import fs from 'node:fs/promises';
import path from 'node:path';

const manifestPath = path.resolve('docs/confluence-full-database-catalog-deployment/T2P-01-tier2-object-coverage-manifest.jsonl');
const outputRoot = path.resolve('docs/confluence-full-database-catalog-deployment');
const strategyDocPath = path.resolve('docs/DATABASE_CATALOG_TIER2_BATCH_STRATEGY.md');
const packetJsonPath = path.join(outputRoot, 'T2P-05-tier2-batch-strategy.json');
const packetMarkdownPath = path.join(outputRoot, 'T2P-05-tier2-batch-strategy.md');
const maxObjectsPerBatch = 75;
const currentPublishGate = {
  platform: 'SQL Server',
  database: 'eLeadDW',
  schema: 'dbo',
  packet: 'T2P-04',
  status: 'publish packet ready; live publish pending explicit approval',
};

async function writeText(file, text) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, `${text.trim()}\n`, 'utf8');
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

async function readManifestRows() {
  const text = await fs.readFile(manifestPath, 'utf8');
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function schemaKey(row) {
  return [row.platform, row.database, row.schema].join('|');
}

function isCurrentPublishGate(group) {
  return (
    group.platform === currentPublishGate.platform &&
    group.database === currentPublishGate.database &&
    group.schema === currentPublishGate.schema
  );
}

function groupObjects(objectRows) {
  const groups = new Map();
  for (const object of objectRows) {
    if (!['missing', 'stale'].includes(object.status)) continue;
    const key = schemaKey(object);
    const group =
      groups.get(key) ||
      {
        platform: object.platform,
        database: object.database,
        schema: object.schema,
        total_objects: 0,
        high_use_objects: 0,
        downstream_uses: 0,
        upstream_inputs: 0,
        types: {},
        objects: [],
      };
    group.total_objects += 1;
    if ((object.tags || []).includes('high-use') || Number(object.downstream_count || 0) >= 10) group.high_use_objects += 1;
    group.downstream_uses += Number(object.downstream_count || 0);
    group.upstream_inputs += Number(object.upstream_count || 0);
    group.types[object.type] = (group.types[object.type] || 0) + 1;
    group.objects.push(object);
    groups.set(key, group);
  }
  return [...groups.values()];
}

function priorityScore(group) {
  return group.high_use_objects * 100000 + group.downstream_uses * 100 + group.upstream_inputs * 10 + group.total_objects;
}

function splitGroupIntoBatches(group) {
  const batches = [];
  const typeEntries = Object.entries(group.types).sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]));
  const objectTypes = typeEntries.length > 1 ? typeEntries.map(([type]) => type) : ['all'];
  for (const objectType of objectTypes) {
    const typedObjects =
      objectType === 'all' ? group.objects : group.objects.filter((object) => String(object.type || 'object') === objectType);
    const sortedObjects = [...typedObjects].sort(
      (left, right) =>
        Number(right.downstream_count || 0) - Number(left.downstream_count || 0) ||
        Number(right.upstream_count || 0) - Number(left.upstream_count || 0) ||
        String(left.name || '').localeCompare(String(right.name || ''))
    );
    for (let index = 0; index < sortedObjects.length; index += maxObjectsPerBatch) {
      const slice = sortedObjects.slice(index, index + maxObjectsPerBatch);
      batches.push({
        platform: group.platform,
        database: group.database,
        schema: group.schema,
        object_type_scope: objectType,
        object_count: slice.length,
        high_use_objects: slice.filter((object) => (object.tags || []).includes('high-use') || Number(object.downstream_count || 0) >= 10).length,
        downstream_uses: slice.reduce((sum, object) => sum + Number(object.downstream_count || 0), 0),
        first_object: slice[0]?.name || '',
        last_object: slice.at(-1)?.name || '',
        canonical_schema_path: pagePath(['Sonic Data Lineage', 'Database Catalog', group.platform, group.database, group.schema]),
        object_names: slice.map((object) => object.name),
      });
    }
  }
  return batches;
}

function buildStrategy(rows) {
  const summary = rows.find((row) => row.record_type === 'summary') || {};
  const objectRows = rows.filter((row) => row.record_type === 'object');
  const schemaGroups = groupObjects(objectRows).sort((left, right) => priorityScore(right) - priorityScore(left));
  const currentGateGroup = schemaGroups.find(isCurrentPublishGate);
  const candidateGroups = schemaGroups.filter((group) => !isCurrentPublishGate(group));
  const batches = [];
  let batchNumber = 1;
  for (const group of candidateGroups) {
    for (const batch of splitGroupIntoBatches(group)) {
      batches.push({
        batch_id: `T2B-${String(batchNumber).padStart(3, '0')}`,
        priority_rank: batchNumber,
        ...batch,
        publish_mode: 'dry-run, reviewed packet, explicit live approval, readback',
        cleanup_mode: 'none; report-only candidates stay separate',
      });
      batchNumber += 1;
    }
  }
  return {
    packet_id: 'T2P-05',
    generated_at: new Date().toISOString(),
    source_manifest: path.relative(process.cwd(), manifestPath).replaceAll('\\', '/'),
    max_objects_per_batch: maxObjectsPerBatch,
    current_publish_gate: currentGateGroup
      ? {
          ...currentPublishGate,
          object_count: currentGateGroup.total_objects,
          high_use_objects: currentGateGroup.high_use_objects,
          downstream_uses: currentGateGroup.downstream_uses,
          canonical_schema_path: pagePath([
            'Sonic Data Lineage',
            'Database Catalog',
            currentGateGroup.platform,
            currentGateGroup.database,
            currentGateGroup.schema,
          ]),
        }
      : currentPublishGate,
    summary: {
      manifest_publishable_objects: summary.publishable_objects || objectRows.length,
      manifest_missing_objects: summary.missing_objects || objectRows.filter((object) => object.status === 'missing').length,
      manifest_stale_live_objects: summary.stale_live_published_objects || 0,
      schemas_with_missing_or_stale_objects: schemaGroups.length,
      queued_batches_after_current_gate: batches.length,
      first_20_batch_objects: batches.slice(0, 20).reduce((sum, batch) => sum + batch.object_count, 0),
    },
    batch_rules: {
      max_objects_per_batch: maxObjectsPerBatch,
      preferred_unit: 'one platform/database/schema when object count is within the ceiling',
      split_rule: 'schemas above the ceiling split by object type, then into deterministic chunks by downstream use, upstream use, and object name',
      priority_rule: 'high-use object count, then downstream use count, then upstream input count, then object count',
      publish_gate: 'every batch needs dry-run, reviewed publish packet, explicit live approval, and post-publish readback',
      cleanup_gate: 'cleanup/archive/delete/move stays out of Tier 2 publish batches',
    },
    first_20_batches: batches.slice(0, 20),
    all_batches: batches,
  };
}

function strategyMarkdown(strategy) {
  return `# Database Catalog Tier 2 Batch Strategy

This strategy turns the current Tier 2 object backlog into repeatable,
medium-safe batches. It is generated from the T2P-01 coverage manifest and does
not publish to Confluence.

## Current Gate

T2P-04 is the current publish gate:

| Signal | Value |
| --- | --- |
| Platform/Product | \`${strategy.current_publish_gate.platform}\` |
| Database | \`${strategy.current_publish_gate.database}\` |
| Schema | \`${strategy.current_publish_gate.schema}\` |
| Status | ${strategy.current_publish_gate.status} |
| Object pages | ${strategy.current_publish_gate.object_count || 'not surfaced'} |
| Canonical path | \`${strategy.current_publish_gate.canonical_schema_path || 'not surfaced'}\` |

Do not start a live publish from this strategy. T2P-04 still requires explicit
approval before \`npm run confluence:full:tier2:eleaddw-dbo:publish\` can run.

## Batch Rules

| Rule | Value |
| --- | --- |
| Max object pages per batch | ${strategy.batch_rules.max_objects_per_batch} |
| Preferred unit | ${strategy.batch_rules.preferred_unit} |
| Split rule | ${strategy.batch_rules.split_rule} |
| Priority rule | ${strategy.batch_rules.priority_rule} |
| Publish gate | ${strategy.batch_rules.publish_gate} |
| Cleanup gate | ${strategy.batch_rules.cleanup_gate} |

## Summary

| Signal | Value |
| --- | ---: |
| Publishable objects in manifest | ${strategy.summary.manifest_publishable_objects} |
| Missing objects in manifest | ${strategy.summary.manifest_missing_objects} |
| Stale live pilot objects in manifest | ${strategy.summary.manifest_stale_live_objects} |
| Schemas with missing/stale objects | ${strategy.summary.schemas_with_missing_or_stale_objects} |
| Queued batches after current gate | ${strategy.summary.queued_batches_after_current_gate} |
| Objects covered by first 20 queued batches | ${strategy.summary.first_20_batch_objects} |

## First 20 Queued Batches

${mdTable(
  strategy.first_20_batches.map((batch) => ({
    Batch: `\`${batch.batch_id}\``,
    Platform: `\`${batch.platform}\``,
    Database: `\`${batch.database}\``,
    Schema: `\`${batch.schema}\``,
    Type: `\`${batch.object_type_scope}\``,
    Objects: batch.object_count,
    'High-use': batch.high_use_objects,
    Downstream: batch.downstream_uses,
    Path: `\`${batch.canonical_schema_path}\``,
  })),
  ['Batch', 'Platform', 'Database', 'Schema', 'Type', 'Objects', 'High-use', 'Downstream', 'Path']
)}

## Work Process For Each Batch

1. Build a scoped Tier 2 dry run for the selected batch.
2. Validate page count, canonical paths, object identity, missing facts, and
   schema/database link state.
3. Build a reviewed publish packet.
4. Stop for explicit live publish approval.
5. After approval, publish only that packet.
6. Run post-publish readback and record page IDs, labels, snippets, and link
   checks.
7. Only then update coverage/readiness counts.

## Medium-Safe Handoff Prompt

\`\`\`text
Start the next Tier 2 batch from docs/DATABASE_CATALOG_TIER2_BATCH_STRATEGY.md.
Use the next unblocked batch after the current T2P-04 publish gate. Stay dry-run
only unless I explicitly approve live publish. Generate thin object pages under
Database Catalog / <Platform/Product> / <Database> / <Schema> / <Object>,
refresh schema/database links for objects in the batch, build a reviewed publish
packet, and stop before live publish.
\`\`\`
`;
}

function packetMarkdown(strategy) {
  return `# T2P-05 Tier 2 Repeatable Batch Strategy Readback

Date: 2026-06-23

This packet defined the repeatable batch strategy for the remaining Tier 2
Database Catalog object pages. It did not publish to Confluence.

## Outputs

| Signal | Value |
| --- | --- |
| Strategy doc | \`docs/DATABASE_CATALOG_TIER2_BATCH_STRATEGY.md\` |
| Machine-readable strategy | \`docs/confluence-full-database-catalog-deployment/T2P-05-tier2-batch-strategy.json\` |
| Source manifest | \`${strategy.source_manifest}\` |

## Current Gate

T2P-04 remains the live publish gate for
\`${strategy.current_publish_gate.canonical_schema_path}\`.

Status: ${strategy.current_publish_gate.status}.

## Summary

| Signal | Value |
| --- | ---: |
| Publishable objects in manifest | ${strategy.summary.manifest_publishable_objects} |
| Missing objects in manifest | ${strategy.summary.manifest_missing_objects} |
| Schemas with missing/stale objects | ${strategy.summary.schemas_with_missing_or_stale_objects} |
| Queued batches after current gate | ${strategy.summary.queued_batches_after_current_gate} |
| Max object pages per batch | ${strategy.max_objects_per_batch} |

## First 10 Batches After Current Gate

${mdTable(
  strategy.first_20_batches.slice(0, 10).map((batch) => ({
    Batch: `\`${batch.batch_id}\``,
    Platform: `\`${batch.platform}\``,
    Database: `\`${batch.database}\``,
    Schema: `\`${batch.schema}\``,
    Type: `\`${batch.object_type_scope}\``,
    Objects: batch.object_count,
    'High-use': batch.high_use_objects,
  })),
  ['Batch', 'Platform', 'Database', 'Schema', 'Type', 'Objects', 'High-use']
)}

## Validation

- Batch IDs are generated from the manifest, not hard-coded database names.
- Batches are capped at ${strategy.max_objects_per_batch} object pages.
- Large schemas are split by object type and deterministic object ordering.
- Live publish and cleanup remain separate approval gates.
`;
}

async function main() {
  const rows = await readManifestRows();
  const strategy = buildStrategy(rows);
  await writeText(strategyDocPath, strategyMarkdown(strategy));
  await writeText(packetJsonPath, JSON.stringify(strategy, null, 2));
  await writeText(packetMarkdownPath, packetMarkdown(strategy));
  console.log(
    JSON.stringify(
      {
        status: 'built',
        strategyDoc: path.relative(process.cwd(), strategyDocPath).replaceAll('\\', '/'),
        strategyJson: path.relative(process.cwd(), packetJsonPath).replaceAll('\\', '/'),
        strategyReadback: path.relative(process.cwd(), packetMarkdownPath).replaceAll('\\', '/'),
        summary: strategy.summary,
        currentGate: strategy.current_publish_gate,
        firstBatch: strategy.first_20_batches[0] || null,
      },
      null,
      2
    )
  );
}

await main();
