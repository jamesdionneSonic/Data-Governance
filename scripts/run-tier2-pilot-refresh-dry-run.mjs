import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const dryRunRoot = path.resolve('data/confluence/human-catalog-dry-run');
const packetRoot = path.resolve('docs/confluence-full-database-catalog-deployment');
const oldPacketPath = path.join(packetRoot, 'FDP-04-tier2-thin-object-batch-01-publish-packet.json');
const oldReadbackPath = path.join(packetRoot, 'FDP-04-tier2-batch01-live-publish-readback.md');
const packetJsonPath = path.join(packetRoot, 'T2P-06-sonic-dw-dbo-pilot-refresh-packet.json');
const packetMarkdownPath = path.join(packetRoot, 'T2P-06-sonic-dw-dbo-pilot-refresh-packet.md');
const readbackPath = path.join(packetRoot, 'T2P-06-sonic-dw-dbo-pilot-refresh-readback.md');
const scope = {
  platform: 'SQL Server',
  database: 'Sonic_DW',
  schema: 'dbo',
};
const databaseSchemaLabels = ['human-lineage-catalog', 'database-catalog', 'database-catalog-tier1', 'database-catalog-link-refresh'];
const objectLabels = ['human-lineage-catalog', 'database-catalog', 'database-catalog-tier2', 'thin-object-page', 'pilot-refresh'];

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    encoding: 'utf8',
    stdio: 'inherit',
    shell: false,
  });
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} failed with exit code ${result.status}`);
  }
}

async function readJson(file) {
  return JSON.parse(await fs.readFile(file, 'utf8'));
}

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

function oldLeafPages(oldPacket) {
  return (oldPacket.planned_pages || []).filter((page) => page.kind === 'leaf' && page.page_type === 'object');
}

function oldObjectNames(oldPacket) {
  return oldLeafPages(oldPacket).map((page) => page.treePath.at(-1));
}

function pageTitle(packet) {
  if (packet.page_type === 'schema') return `${scope.database}.${scope.schema}`;
  if (packet.page_type === 'object') return `${packet.object.database}.${packet.object.schema}.${packet.object.name}`;
  return packet.page_title || packet.page_tree_path.at(-1);
}

function parsePublishedPageIds(readbackText) {
  const pageIds = new Map();
  const rowPattern = /\|\s*`([^`]+)`\s*\|\s*`?(\d+)`?\s*\|/g;
  let match;
  while ((match = rowPattern.exec(readbackText)) !== null) {
    pageIds.set(match[1], match[2]);
  }
  return pageIds;
}

function referencePages() {
  return [
    ['Sonic Data Lineage', 'Database Catalog'],
    ['Sonic Data Lineage', 'Database Catalog', scope.platform],
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

function plannedPages({ databasePacket, schemaPacket, objectPackets }) {
  return [
    ...referencePages(),
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

function buildComplianceRows({ oldPages, objectPackets, pageIds }) {
  const byName = new Map(objectPackets.map((packet) => [packet.object.name, packet]));
  return oldPages.map((oldPage) => {
    const objectName = oldPage.treePath.at(-1);
    const oldPath = pagePath(oldPage.treePath);
    const packet = byName.get(objectName);
    const newPath = pagePath(packet?.page_tree_path || []);
    return {
      object: `${scope.database}.${scope.schema}.${objectName}`,
      confluence_page_id: pageIds.get(`${scope.database}.${scope.schema}.${objectName}`) || '',
      old_path: oldPath,
      new_path: newPath,
      old_path_status: oldPath.includes(`Database Catalog / ${scope.platform} /`) ? 'current' : 'stale-flat-path',
      new_path_status: newPath.includes(`Database Catalog / ${scope.platform} /`) ? 'platform-grouped' : 'missing-platform',
      refresh_action: 'publish refreshed canonical page; leave old page for separate cleanup approval',
    };
  });
}

function validate({ oldPages, databasePacket, schemaPacket, objectPackets, complianceRows }) {
  const failures = [];
  if (!databasePacket) failures.push('Current dry run is missing the Sonic_DW database page.');
  if (!schemaPacket) failures.push('Current dry run is missing the Sonic_DW.dbo schema page.');
  if (oldPages.length !== 25) failures.push(`Expected 25 old pilot pages, found ${oldPages.length}.`);
  if (objectPackets.length !== oldPages.length) failures.push(`Expected ${oldPages.length} refreshed object pages, found ${objectPackets.length}.`);
  for (const row of complianceRows) {
    if (row.old_path_status !== 'stale-flat-path') failures.push(`${row.object} old path is not marked stale.`);
    if (row.new_path_status !== 'platform-grouped') failures.push(`${row.object} refreshed path is not platform grouped.`);
  }
  const schemaObjects = schemaPacket?.catalog_slice?.objects || [];
  const planned = schemaObjects.filter((row) => row.planned_in_packet);
  if (planned.length !== objectPackets.length) {
    failures.push(`Schema planned link count ${planned.length} does not match refreshed object count ${objectPackets.length}.`);
  }
  return failures;
}

function markdownPacket(packet) {
  return `# T2P-06 Sonic_DW.dbo Pilot Refresh Review Packet

## Purpose

This packet prepares a dry-run refresh for the 25 live Tier 2 pilot pages that
were published before the platform-grouped Database Catalog standard.

It does not publish to Confluence and it does not clean up, archive, delete, or
move the old pages.

## Recommendation

${packet.recommendation}

## Scope

| Signal | Value |
| --- | --- |
| Platform/Product | \`${scope.platform}\` |
| Database | \`${scope.database}\` |
| Schema | \`${scope.schema}\` |
| Old pilot pages | ${packet.summary.old_pilot_pages} |
| Refreshed object pages | ${packet.summary.refreshed_object_pages} |
| Link refresh pages | ${packet.summary.link_refresh_pages} |
| Publish mode | \`${packet.scope.publish_mode}\` |
| Cleanup mode | \`${packet.scope.cleanup_mode}\` |
| Validation status | \`${packet.validation.status}\` |

## Compliance Summary

${mdTable(
  packet.compliance_rows.map((row) => ({
    Object: `\`${row.object}\``,
    'Old page ID': row.confluence_page_id ? `\`${row.confluence_page_id}\`` : 'not surfaced',
    'Old status': row.old_path_status,
    'New status': row.new_path_status,
    Action: row.refresh_action,
  })),
  ['Object', 'Old page ID', 'Old status', 'New status', 'Action']
)}

## Approval To Publish

Live publish requires explicit user approval for:

\`${pagePath(['Sonic Data Lineage', 'Database Catalog', scope.platform, scope.database, scope.schema])}\`

The live publish command after approval is:

\`\`\`powershell
npm run confluence:full:tier2:pilot-refresh:publish
\`\`\`

Do not run cleanup commands from this approval.

## Validation

${packet.validation.failures.length === 0 ? '- No packet validation failures.' : packet.validation.failures.map((failure) => `- ${failure}`).join('\n')}
`;
}

function readbackMarkdown(packet) {
  return `# T2P-06 Sonic_DW.dbo Pilot Refresh Readback

Date: 2026-06-23

This packet prepared a dry-run refresh for the 25 existing live Tier 2 pilot
pages under \`Sonic_DW.dbo\`.

No live Confluence publish, cleanup, archive, delete, or move action was run.

## Results

| Signal | Value |
| --- | ---: |
| Old pilot pages checked | ${packet.summary.old_pilot_pages} |
| Stale flat-path pages | ${packet.summary.stale_flat_path_pages} |
| Refreshed object pages generated | ${packet.summary.refreshed_object_pages} |
| Link refresh pages generated | ${packet.summary.link_refresh_pages} |
| Total planned entries | ${packet.summary.total_planned_entries} |

## Outputs

| Signal | Value |
| --- | --- |
| Publish packet JSON | \`docs/confluence-full-database-catalog-deployment/T2P-06-sonic-dw-dbo-pilot-refresh-packet.json\` |
| Publish packet markdown | \`docs/confluence-full-database-catalog-deployment/T2P-06-sonic-dw-dbo-pilot-refresh-packet.md\` |
| Source live readback | \`docs/confluence-full-database-catalog-deployment/FDP-04-tier2-batch01-live-publish-readback.md\` |

## Commands

\`\`\`powershell
npm run confluence:full:tier2:pilot-refresh:dry-run
\`\`\`

The command rebuilt a scoped dry-run for only the 25 stale pilot objects, ran the
human catalog dry-run checker, built this reviewed refresh packet, and exercised
the publisher with \`publish: false\`.

## Live Gate

Live publish still requires explicit approval.

After approval:

\`\`\`powershell
npm run confluence:full:tier2:pilot-refresh:publish
\`\`\`

Post-publish verification:

\`\`\`powershell
npm run confluence:full:tier2:pilot-refresh:published:check
\`\`\`

Cleanup remains separate even after refreshed pages publish.
`;
}

async function loadCurrentPackets() {
  const manifest = await readJson(path.join(dryRunRoot, 'manifest.json'));
  const packets = [];
  for (const entry of manifest.pages || []) {
    // eslint-disable-next-line no-await-in-loop
    const packet = await readJson(path.join(dryRunRoot, entry.evidenceFile));
    packets.push({ ...packet, evidence_file: entry.evidenceFile, markdown_file: entry.markdownFile });
  }
  return {
    databasePacket: packets.find((packet) => packet.page_type === 'database' && packet.page_tree_path?.[3] === scope.database),
    schemaPacket: packets.find((packet) => packet.page_type === 'schema' && packet.page_tree_path?.[3] === scope.database && packet.page_tree_path?.[4] === scope.schema),
    objectPackets: packets
      .filter((packet) => packet.page_type === 'object')
      .sort((left, right) => String(left.object?.name || '').localeCompare(String(right.object?.name || ''))),
  };
}

async function buildPacket() {
  const oldPacket = await readJson(oldPacketPath);
  const oldPages = oldLeafPages(oldPacket);
  const readbackText = await fs.readFile(oldReadbackPath, 'utf8');
  const pageIds = parsePublishedPageIds(readbackText);
  const { databasePacket, schemaPacket, objectPackets } = await loadCurrentPackets();
  const planned = plannedPages({ databasePacket, schemaPacket, objectPackets });
  const complianceRows = buildComplianceRows({ oldPages, objectPackets, pageIds });
  const failures = validate({ oldPages, databasePacket, schemaPacket, objectPackets, complianceRows });
  const packet = {
    packet_id: 'T2P-06',
    generated_at: new Date().toISOString(),
    scope: {
      canonical_root: 'Sonic Data Lineage / Database Catalog',
      platform_product: scope.platform,
      database: scope.database,
      schema: scope.schema,
      publish_mode: 'reviewed refresh packet; no live publish performed',
      cleanup_mode: 'none; old flat-path pages remain cleanup candidates only',
    },
    recommendation:
      failures.length === 0
        ? 'Ready for review. Live refresh publish requires explicit approval; cleanup remains separate.'
        : 'Not ready for live publish approval until validation failures are resolved.',
    required_labels: ['human-lineage-catalog', 'database-catalog'],
    summary: {
      old_pilot_pages: oldPages.length,
      stale_flat_path_pages: complianceRows.filter((row) => row.old_path_status === 'stale-flat-path').length,
      refreshed_object_pages: objectPackets.length,
      link_refresh_pages: 2,
      reference_pages: 2,
      total_planned_entries: planned.length,
    },
    planned_pages: planned,
    compliance_rows: complianceRows,
    source_artifacts: {
      old_publish_packet: path.relative(process.cwd(), oldPacketPath).replaceAll('\\', '/'),
      old_live_readback: path.relative(process.cwd(), oldReadbackPath).replaceAll('\\', '/'),
      dry_run_output: 'data/confluence/human-catalog-dry-run',
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
  if (failures.length > 0) throw new Error(`Pilot refresh packet validation failed: ${failures.join('; ')}`);
  return packet;
}

async function main() {
  const oldPacket = await readJson(oldPacketPath);
  const names = oldObjectNames(oldPacket);
  run('node', [
    'scripts/build-human-confluence-catalog-dry-run.mjs',
    '--tier2-object-names',
    `${scope.database}.${scope.schema}:${names.join(',')}`,
  ]);
  run('node', ['scripts/check-human-confluence-catalog-dry-run.mjs']);
  const packet = await buildPacket();
  run('node', ['scripts/publish-human-confluence-catalog-pilot.mjs', '--packet', path.relative(process.cwd(), packetJsonPath)]);
  console.log(
    JSON.stringify(
      {
        status: packet.validation.status,
        summary: packet.summary,
        packet: packet.output_artifacts,
      },
      null,
      2
    )
  );
}

await main();
