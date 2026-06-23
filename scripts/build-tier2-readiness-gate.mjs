import fs from 'node:fs/promises';
import path from 'node:path';

const deploymentRoot = path.resolve('docs/confluence-full-database-catalog-deployment');
const manifestPath = path.join(deploymentRoot, 'T2P-01-tier2-object-coverage-manifest.jsonl');
const batchStrategyPath = path.join(deploymentRoot, 'T2P-05-tier2-batch-strategy.json');
const t2p04PacketPath = path.join(deploymentRoot, 'T2P-04-eleaddw-dbo-tier2-publish-packet.json');
const t2p06PacketPath = path.join(deploymentRoot, 'T2P-06-sonic-dw-dbo-pilot-refresh-packet.json');
const t2p07PacketPath = path.join(deploymentRoot, 'T2P-07-rovo-link-alignment-packet.json');
const outputJsonPath = path.join(deploymentRoot, 'T2P-08-tier2-readiness-gate.json');
const outputMarkdownPath = path.join(deploymentRoot, 'T2P-08-tier2-readiness-gate.md');
const readbackPath = path.join(deploymentRoot, 'T2P-08-tier2-readiness-gate-readback.md');
const inventoryMarkdownPath = path.join(deploymentRoot, 'FDP-01-full-inventory-and-manifest.md');

async function readJson(file) {
  return JSON.parse(await fs.readFile(file, 'utf8'));
}

async function readText(file) {
  return fs.readFile(file, 'utf8');
}

async function writeText(file, text) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, `${text.trim()}\n`, 'utf8');
}

function pagePath(values) {
  return (values || []).filter(Boolean).join(' / ');
}

function mdTable(rows, headers) {
  const safeRows = rows.length > 0 ? rows : [Object.fromEntries(headers.map((header) => [header, 'none']))];
  const head = `| ${headers.join(' | ')} |`;
  const sep = `| ${headers.map(() => '---').join(' | ')} |`;
  const body = safeRows.map((row) => `| ${headers.map((header) => String(row[header] ?? '')).join(' | ')} |`);
  return [head, sep, ...body].join('\n');
}

function objectKey(platform, database, schema, name) {
  return [platform || 'unknown', database || 'unknown', schema || 'unknown', name || 'unknown'].join('|');
}

function objectKeyFromTreePath(treePath) {
  if (!Array.isArray(treePath) || treePath.length < 6) return null;
  return objectKey(treePath[2], treePath[3], treePath[4], treePath.slice(5).join(' / '));
}

async function readManifestRows() {
  const text = await readText(manifestPath);
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function countBy(rows, field) {
  const counts = {};
  for (const row of rows) counts[row[field] || 'unknown'] = (counts[row[field] || 'unknown'] || 0) + 1;
  return counts;
}

function parseInventoryBlockedObjects(text) {
  const match = text.match(/\|\s*Blocked objects\s*\|\s*([0-9,]+)\s*\|/i);
  return match ? Number(match[1].replace(/,/g, '')) : 0;
}

function collectPendingObjects(packet, packetId, status) {
  const rows = [];
  for (const page of packet.planned_pages || []) {
    if (page.kind !== 'leaf' || page.page_type !== 'object') continue;
    const key = objectKeyFromTreePath(page.treePath);
    if (!key) continue;
    rows.push({
      key,
      packet_id: packetId,
      status,
      title: page.title,
      canonical_page_path: pagePath(page.treePath),
      evidence_hash: page.evidence_hash,
    });
  }
  return rows;
}

function topObjects(rows, limit = 25) {
  return [...rows]
    .sort(
      (left, right) =>
        Number(right.downstream_count || 0) - Number(left.downstream_count || 0) ||
        Number(right.upstream_count || 0) - Number(left.upstream_count || 0) ||
        String(left.qualified_name || '').localeCompare(String(right.qualified_name || ''))
    )
    .slice(0, limit);
}

function groupSchemaRows(rows) {
  const groups = new Map();
  for (const row of rows) {
    const key = objectKey(row.platform, row.database, row.schema, '*schema*');
    const group =
      groups.get(key) ||
      {
        platform: row.platform,
        database: row.database,
        schema: row.schema,
        remaining: 0,
        high_use_remaining: 0,
        downstream_uses: 0,
      };
    group.remaining += 1;
    if ((row.tags || []).includes('high-use') || Number(row.downstream_count || 0) >= 10) group.high_use_remaining += 1;
    group.downstream_uses += Number(row.downstream_count || 0);
    groups.set(key, group);
  }
  return [...groups.values()].sort(
    (left, right) =>
      right.high_use_remaining - left.high_use_remaining ||
      right.downstream_uses - left.downstream_uses ||
      right.remaining - left.remaining ||
      left.database.localeCompare(right.database)
  );
}

function markdown(packet) {
  return `# T2P-08 Tier 2 Readiness Gate

## Purpose

This gate prevents Tier 2 from being called complete until every publishable
object is live under the platform-grouped path or is explicitly blocked.

It is read-only. It does not publish to Confluence, regenerate the full catalog,
archive, delete, move, or clean up pages.

## Decision

${packet.decision}

## Coverage Summary

| Signal | Value |
| --- | ---: |
| Publishable Tier 2 objects | ${packet.summary.publishable_objects} |
| Current live platform-path object pages | ${packet.summary.current_live_platform_path_objects} |
| Current stale live object pages | ${packet.summary.current_stale_live_objects} |
| Reviewed pending object pages | ${packet.summary.pending_object_pages} |
| Remaining after pending packets publish | ${packet.summary.remaining_after_pending_packets} |
| Blocked human-catalog objects | ${packet.summary.blocked_human_catalog_objects} |
| Queued batches after current gate | ${packet.summary.queued_batches_after_current_gate} |

## Status Counts

${mdTable(
  Object.entries(packet.status_counts).map(([Status, Count]) => ({ Status: `\`${Status}\``, Count })),
  ['Status', 'Count']
)}

## Pending Packets

${mdTable(
  packet.pending_packets.map((row) => ({
    Packet: `\`${row.packet_id}\``,
    Status: row.status,
    Objects: row.object_count,
    Scope: row.scope,
  })),
  ['Packet', 'Status', 'Objects', 'Scope']
)}

## Top Remaining Schemas After Pending Packets

${mdTable(
  packet.top_remaining_schemas.map((row) => ({
    Platform: `\`${row.platform}\``,
    Database: `\`${row.database}\``,
    Schema: `\`${row.schema}\``,
    Remaining: row.remaining,
    'High-use': row.high_use_remaining,
    Downstream: row.downstream_uses,
  })),
  ['Platform', 'Database', 'Schema', 'Remaining', 'High-use', 'Downstream']
)}

## Top Remaining Objects After Pending Packets

${mdTable(
  packet.top_remaining_objects.map((row) => ({
    Object: `\`${row.qualified_name}\``,
    Status: row.status,
    Downstream: row.downstream_count,
    Columns: row.column_count,
    Path: `\`${row.canonical_page_path}\``,
  })),
  ['Object', 'Status', 'Downstream', 'Columns', 'Path']
)}

## Validation

${packet.validation.failures.length === 0 ? '- No validation failures.' : packet.validation.failures.map((failure) => `- ${failure}`).join('\n')}

## Next Work

1. Live publish is still pending for T2P-04 and T2P-06 if approved.
2. After those publish and pass readback, rerun this gate to lower remaining counts.
3. Continue with the next queued Tier 2 batches from T2P-05.
`;
}

function readback(packet) {
  return `# T2P-08 Tier 2 Readiness Gate Readback

Date: 2026-06-23

No live Confluence publish, cleanup, archive, delete, move, or broad catalog
regeneration was run.

## Result

Tier 2 is not complete.

| Signal | Value |
| --- | ---: |
| Publishable objects | ${packet.summary.publishable_objects} |
| Current live platform-path object pages | ${packet.summary.current_live_platform_path_objects} |
| Reviewed pending object pages | ${packet.summary.pending_object_pages} |
| Remaining after pending packets publish | ${packet.summary.remaining_after_pending_packets} |
| Queued batches after current gate | ${packet.summary.queued_batches_after_current_gate} |
| Validation status | ${packet.validation.status} |

## Commands

\`\`\`powershell
npm run confluence:full:tier2:readiness-gate
\`\`\`
`;
}

async function main() {
  const manifestRows = await readManifestRows();
  const objectRows = manifestRows.filter((row) => row.record_type === 'object');
  const summaryRow = manifestRows.find((row) => row.record_type === 'summary') || {};
  const batchStrategy = await readJson(batchStrategyPath);
  const t2p04 = await readJson(t2p04PacketPath);
  const t2p06 = await readJson(t2p06PacketPath);
  const t2p07 = await readJson(t2p07PacketPath);
  const inventoryMarkdown = await readText(inventoryMarkdownPath);

  const pendingRows = [
    ...collectPendingObjects(t2p04, 'T2P-04', 'live publish pending approval'),
    ...collectPendingObjects(t2p06, 'T2P-06', 'live refresh publish pending approval'),
  ];
  const pendingByKey = new Map();
  for (const row of pendingRows) {
    if (!pendingByKey.has(row.key)) pendingByKey.set(row.key, []);
    pendingByKey.get(row.key).push(row);
  }

  const currentLivePlatform = objectRows.filter((row) => row.status === 'published').length;
  const currentStaleLive = objectRows.filter((row) => row.status === 'stale').length;
  const pendingUniqueKeys = new Set(pendingRows.map((row) => row.key));
  const pendingInManifest = objectRows.filter((row) => pendingUniqueKeys.has(row.key));
  const remainingRows = objectRows.filter((row) => row.status !== 'published' && !pendingUniqueKeys.has(row.key));
  const remainingHighUseRows = remainingRows.filter((row) => (row.tags || []).includes('high-use') || Number(row.downstream_count || 0) >= 10);

  const failures = [];
  if (objectRows.length === 0) failures.push('Coverage manifest has no object rows.');
  if (currentLivePlatform + pendingUniqueKeys.size + remainingRows.length !== objectRows.length) {
    failures.push('Current live plus pending plus remaining counts do not reconcile to publishable objects.');
  }
  if (t2p07.validation?.status !== 'passed') failures.push('T2P-07 Rovo link alignment packet is not passing.');

  const packet = {
    packet_id: 'T2P-08',
    generated_at: new Date().toISOString(),
    decision:
      remainingRows.length === 0 && currentStaleLive === 0
        ? 'Tier 2 may be considered complete after live readback confirms all platform-path pages.'
        : 'Tier 2 is not complete. Continue publishing reviewed packets and queued batches before declaring completion.',
    summary: {
      publishable_objects: summaryRow.publishable_objects || objectRows.length,
      current_live_platform_path_objects: currentLivePlatform,
      current_stale_live_objects: currentStaleLive,
      pending_object_pages: pendingUniqueKeys.size,
      pending_objects_found_in_manifest: pendingInManifest.length,
      remaining_after_pending_packets: remainingRows.length,
      remaining_high_use_after_pending_packets: remainingHighUseRows.length,
      blocked_human_catalog_objects: parseInventoryBlockedObjects(inventoryMarkdown),
      queued_batches_after_current_gate: batchStrategy.summary?.queued_batches_after_current_gate || 0,
    },
    status_counts: countBy(objectRows, 'status'),
    pending_packets: [
      {
        packet_id: 'T2P-04',
        status: 'publish pending explicit approval',
        object_count: collectPendingObjects(t2p04, 'T2P-04', '').length,
        scope: 'SQL Server / eLeadDW / dbo',
      },
      {
        packet_id: 'T2P-06',
        status: 'refresh publish pending explicit approval',
        object_count: collectPendingObjects(t2p06, 'T2P-06', '').length,
        scope: 'SQL Server / Sonic_DW / dbo pilot refresh',
      },
      {
        packet_id: 'T2P-07',
        status: 'Rovo publish pending explicit approval',
        object_count: 0,
        scope: 'AI Retrieval Artifacts link alignment',
      },
    ],
    source_artifacts: {
      coverage_manifest: path.relative(process.cwd(), manifestPath).replaceAll('\\', '/'),
      batch_strategy: path.relative(process.cwd(), batchStrategyPath).replaceAll('\\', '/'),
      t2p04_packet: path.relative(process.cwd(), t2p04PacketPath).replaceAll('\\', '/'),
      t2p06_packet: path.relative(process.cwd(), t2p06PacketPath).replaceAll('\\', '/'),
      t2p07_packet: path.relative(process.cwd(), t2p07PacketPath).replaceAll('\\', '/'),
      inventory_manifest: path.relative(process.cwd(), inventoryMarkdownPath).replaceAll('\\', '/'),
    },
    output_artifacts: {
      packet_json: path.relative(process.cwd(), outputJsonPath).replaceAll('\\', '/'),
      packet_markdown: path.relative(process.cwd(), outputMarkdownPath).replaceAll('\\', '/'),
      readback_markdown: path.relative(process.cwd(), readbackPath).replaceAll('\\', '/'),
    },
    top_remaining_schemas: groupSchemaRows(remainingRows).slice(0, 25),
    top_remaining_objects: topObjects(remainingHighUseRows, 50),
    pending_objects: pendingInManifest.map((row) => ({
      key: row.key,
      qualified_name: row.qualified_name,
      status_before_pending: row.status,
      pending_packets: pendingByKey.get(row.key)?.map((pending) => pending.packet_id) || [],
      canonical_page_path: row.canonical_page_path,
    })),
    validation: {
      status: failures.length === 0 ? 'passed_with_expected_gaps' : 'failed',
      failures,
      warnings: [
        'This gate uses existing durable manifests and reviewed packets; it does not rerun a full catalog dry run.',
        'T2P-04, T2P-06, and T2P-07 remain pending live approval.',
        'Tier 2 cannot be called complete while remaining_after_pending_packets is greater than zero.',
      ],
    },
  };

  await writeText(outputJsonPath, JSON.stringify(packet, null, 2));
  await writeText(outputMarkdownPath, markdown(packet));
  await writeText(readbackPath, readback(packet));
  console.log(JSON.stringify({ status: packet.validation.status, summary: packet.summary, artifacts: packet.output_artifacts }, null, 2));
  if (failures.length > 0) process.exitCode = 1;
}

await main();
