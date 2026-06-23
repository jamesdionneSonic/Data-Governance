import fs from 'node:fs/promises';
import path from 'node:path';

const rovoRoot = path.resolve('data/confluence/rovo-ai-retrieval-dry-run');
const packetRoot = path.resolve('docs/confluence-full-database-catalog-deployment');
const packetJsonPath = path.join(packetRoot, 'T2P-07-rovo-link-alignment-packet.json');
const packetMarkdownPath = path.join(packetRoot, 'T2P-07-rovo-link-alignment-packet.md');
const readbackPath = path.join(packetRoot, 'T2P-07-rovo-link-alignment-readback.md');
const rovoPublishPacketPath = path.join(packetRoot, 'FDP-06-rovo-ai-retrieval-publish-packet.json');
const tier2PilotRefreshPacketPath = path.join(packetRoot, 'T2P-06-sonic-dw-dbo-pilot-refresh-packet.json');
const rootPath = 'Sonic Data Lineage / AI Retrieval Artifacts';

function pagePath(values) {
  return (values || []).filter(Boolean).join(' / ');
}

async function readJson(file) {
  return JSON.parse(await fs.readFile(file, 'utf8'));
}

async function writeText(file, value) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, `${value.trim()}\n`, 'utf8');
}

function walk(value, visitor) {
  if (Array.isArray(value)) {
    for (const item of value) walk(item, visitor);
    return;
  }
  if (!value || typeof value !== 'object') return;
  visitor(value);
  for (const item of Object.values(value)) walk(item, visitor);
}

function isOldFlatDatabaseCatalogPath(value) {
  const text = String(value || '');
  if (!text.startsWith('Sonic Data Lineage / Database Catalog / ')) return false;
  return !['Sonic Data Lineage / Database Catalog / SQL Server', 'Sonic Data Lineage / Database Catalog / Snowflake'].some(
    (prefix) => text.startsWith(prefix)
  );
}

function markdownTable(rows, headers) {
  const head = `| ${headers.join(' | ')} |`;
  const sep = `| ${headers.map(() => '---').join(' | ')} |`;
  const body = rows.map((row) => `| ${headers.map((header) => row[header] ?? '').join(' | ')} |`);
  return [head, sep, ...body].join('\n');
}

async function collectHumanLinkRows(manifest) {
  const rows = [];
  for (const page of manifest.pages || []) {
    // eslint-disable-next-line no-await-in-loop
    const evidence = await readJson(path.join(rovoRoot, page.evidenceFile));
    walk(evidence, (node) => {
      if (node.canonical_human_page) {
        rows.push({
          rovo_page: page.page_title,
          canonical_id: node.canonical_id || node.full_name || node.lookup_key || page.page_title,
          canonical_human_page: node.canonical_human_page,
          canonical_human_page_status: node.canonical_human_page_status || 'not surfaced',
        });
      }
    });
  }
  return rows;
}

function validationFailures({ manifest, rovoPublishPacket, humanLinkRows }) {
  const failures = [];
  if (manifest.acceptance?.status !== 'passed') failures.push('Rovo dry-run manifest acceptance did not pass.');
  if (rovoPublishPacket.validation?.status !== 'passed') failures.push('Rovo publish packet validation did not pass.');
  for (const page of rovoPublishPacket.planned_pages || []) {
    const treePath = pagePath(page.treePath);
    if (!treePath.startsWith(rootPath)) failures.push(`Rovo page is outside AI Retrieval Artifacts: ${treePath}`);
    if (treePath.includes('Database Catalog')) failures.push(`Rovo page is under Database Catalog: ${treePath}`);
  }
  for (const row of humanLinkRows) {
    if (isOldFlatDatabaseCatalogPath(row.canonical_human_page)) {
      failures.push(`Old flat Database Catalog link remains for ${row.canonical_id}: ${row.canonical_human_page}`);
    }
    if (row.canonical_human_page === 'not created yet' && row.canonical_human_page_status !== 'pending') {
      failures.push(`Missing human page is not marked pending for ${row.canonical_id}.`);
    }
  }
  return failures;
}

function markdown(packet) {
  const statusRows = Object.entries(packet.summary.human_page_status_counts).map(([Status, Count]) => ({ Status: `\`${Status}\``, Count }));
  const uniqueSampleRows = [
    ...new Map(
      packet.reconciliation_rows.map((row) => [
        [row.rovo_page, row.canonical_id, row.canonical_human_page, row.canonical_human_page_status].join('|'),
        row,
      ])
    ).values(),
  ];
  const sampleRows = uniqueSampleRows
    .sort((left, right) => {
      const statusRank = (value) => (value === 'pending_publish_packet' ? 0 : 1);
      return (
        statusRank(left.canonical_human_page_status) - statusRank(right.canonical_human_page_status) ||
        String(left.canonical_id).localeCompare(String(right.canonical_id))
      );
    })
    .slice(0, 20)
    .map((row) => ({
      'Rovo page': row.rovo_page,
      'Canonical id': `\`${row.canonical_id}\``,
      'Human page': `\`${row.canonical_human_page}\``,
      Status: row.canonical_human_page_status,
    }));
  return `# T2P-07 Rovo Link Alignment Packet

## Purpose

This packet verifies that Rovo AI retrieval artifacts remain under
\`AI Retrieval Artifacts\` and that their canonical human-page links align to
the platform-grouped Database Catalog path when a human page exists or is in a
reviewed publish packet.

It does not publish to Confluence and it does not clean up, archive, delete, or
move pages.

## Recommendation

${packet.validation.status === 'passed' ? 'Ready for review. Live Rovo publish still requires explicit approval.' : 'Not ready for live publish approval until validation failures are resolved.'}

## Summary

| Signal | Value |
| --- | ---: |
| Rovo artifact pages | ${packet.summary.rovo_artifact_pages} |
| Locator rows | ${packet.summary.locator_rows} |
| Ambiguity groups | ${packet.summary.ambiguity_groups} |
| Human link rows checked | ${packet.summary.human_link_rows} |
| Old flat Database Catalog links | ${packet.summary.old_flat_database_catalog_links} |

## Human Link Status Counts

${markdownTable(statusRows, ['Status', 'Count'])}

## Sample Reconciliation Rows

${markdownTable(sampleRows, ['Rovo page', 'Canonical id', 'Human page', 'Status'])}

## Validation

${packet.validation.failures.length === 0 ? '- No packet validation failures.' : packet.validation.failures.map((failure) => `- ${failure}`).join('\n')}

## Live Gate

Live publish requires explicit user approval:

\`\`\`powershell
npm run confluence:full:tier2:rovo-link-align:publish
\`\`\`
`;
}

function readback(packet) {
  return `# T2P-07 Rovo Link Alignment Readback

Date: 2026-06-23

No live Confluence publish, cleanup, archive, delete, or move action was run.

## Results

| Signal | Value |
| --- | ---: |
| Rovo artifact pages | ${packet.summary.rovo_artifact_pages} |
| Human link rows checked | ${packet.summary.human_link_rows} |
| Pending publish-packet links | ${packet.summary.human_page_status_counts.pending_publish_packet || 0} |
| Pending missing human pages | ${packet.summary.human_page_status_counts.pending || 0} |
| Old flat Database Catalog links | ${packet.summary.old_flat_database_catalog_links} |
| Validation status | ${packet.validation.status} |

## Commands

\`\`\`powershell
npm run confluence:rovo:validate
node scripts/build-rovo-ai-retrieval-publish-packet.mjs
node scripts/build-tier2-rovo-link-alignment-packet.mjs
\`\`\`

The run confirmed Rovo pages stay under \`AI Retrieval Artifacts\`, and
platform-grouped human links are used for the Tier 2 pilot objects queued in
T2P-06.
`;
}

async function main() {
  const manifest = await readJson(path.join(rovoRoot, 'manifest.json'));
  const locator = await readJson(path.join(rovoRoot, 'rovo-object-locator-001.evidence.json'));
  const ambiguity = await readJson(path.join(rovoRoot, 'rovo-ambiguity-context-001.evidence.json'));
  const rovoPublishPacket = await readJson(rovoPublishPacketPath);
  const humanLinkRows = await collectHumanLinkRows(manifest);
  const statusCounts = {};
  for (const row of humanLinkRows) {
    statusCounts[row.canonical_human_page_status] = (statusCounts[row.canonical_human_page_status] || 0) + 1;
  }
  const failures = validationFailures({ manifest, rovoPublishPacket, humanLinkRows });
  const packet = {
    packet_id: 'T2P-07',
    generated_at: new Date().toISOString(),
    scope: {
      root_path: rootPath,
      publish_mode: 'reviewed dry-run packet; no live publish performed',
      cleanup_mode: 'none',
    },
    summary: {
      rovo_artifact_pages: (manifest.pages || []).length,
      locator_rows: (locator.locator_rows || []).length,
      ambiguity_groups: (ambiguity.ambiguity_groups || []).length,
      human_link_rows: humanLinkRows.length,
      human_page_status_counts: statusCounts,
      old_flat_database_catalog_links: humanLinkRows.filter((row) => isOldFlatDatabaseCatalogPath(row.canonical_human_page)).length,
    },
    source_artifacts: {
      rovo_dry_run_manifest: 'data/confluence/rovo-ai-retrieval-dry-run/manifest.json',
      rovo_publish_packet: path.relative(process.cwd(), rovoPublishPacketPath).replaceAll('\\', '/'),
      tier2_pilot_refresh_packet: path.relative(process.cwd(), tier2PilotRefreshPacketPath).replaceAll('\\', '/'),
    },
    output_artifacts: {
      packet_json: path.relative(process.cwd(), packetJsonPath).replaceAll('\\', '/'),
      packet_markdown: path.relative(process.cwd(), packetMarkdownPath).replaceAll('\\', '/'),
      readback_markdown: path.relative(process.cwd(), readbackPath).replaceAll('\\', '/'),
    },
    reconciliation_rows: humanLinkRows,
    validation: {
      status: failures.length === 0 ? 'passed' : 'failed',
      failures,
    },
  };
  await writeText(packetJsonPath, JSON.stringify(packet, null, 2));
  await writeText(packetMarkdownPath, markdown(packet));
  await writeText(readbackPath, readback(packet));
  console.log(JSON.stringify({ status: packet.validation.status, summary: packet.summary, artifacts: packet.output_artifacts }, null, 2));
  if (failures.length > 0) process.exitCode = 1;
}

await main();
