import fs from 'node:fs/promises';
import path from 'node:path';

const dryRunRoot = path.resolve('data/confluence/human-catalog-dry-run');
const fullDeploymentRoot = path.resolve('data/confluence/full-database-catalog-deployment');
const packetRoot = path.resolve('docs/confluence-full-database-catalog-deployment');
const packetSlug = 'FDP-03-tier1-publish-packet';
const canonicalRoot = ['Sonic Data Lineage', 'Database Catalog'];
const requiredLabels = ['human-lineage-catalog', 'database-catalog', 'database-catalog-tier1'];

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

function isTier1Leaf(packet) {
  return (
    (packet.page_type === 'database' || packet.page_type === 'schema') &&
    Array.isArray(packet.page_tree_path) &&
    packet.page_tree_path[0] === canonicalRoot[0] &&
    packet.page_tree_path[1] === canonicalRoot[1]
  );
}

function plannedPages(leafPackets) {
  const byPath = new Map();
  const addPage = (treePath, kind, packet = null) => {
    const key = pagePath(treePath);
    const existing = byPath.get(key);
    const title =
      packet?.page_type === 'schema'
        ? `${packet.catalog_slice?.database || treePath.at(-2)}.${packet.catalog_slice?.schema || treePath.at(-1)}`
        : treePath.at(-1);
    const record = {
      kind,
      title,
      treePath,
      page_type: packet?.page_type || existing?.page_type || 'navigation',
      evidence_hash: packet?.evidence_hash || existing?.evidence_hash || null,
      evidence_file: packet?.evidence_file || existing?.evidence_file || null,
      markdown_file: packet?.markdown_file || existing?.markdown_file || null,
      labels: requiredLabels,
    };
    if (!existing || existing.kind === 'navigation' || kind === 'leaf') byPath.set(key, record);
  };

  for (const packet of leafPackets) {
    for (let index = 1; index < packet.page_tree_path.length; index += 1) {
      const treePath = packet.page_tree_path.slice(0, index + 1);
      if (index < packet.page_tree_path.length - 1) addPage(treePath, 'navigation');
    }
    addPage(packet.page_tree_path, 'leaf', packet);
  }

  return [...byPath.values()].sort(
    (left, right) => left.treePath.length - right.treePath.length || pagePath(left.treePath).localeCompare(pagePath(right.treePath))
  );
}

function validationFailures({ leafPackets, planned, inventory, supersededReport }) {
  const failures = [];
  const databasePages = leafPackets.filter((packet) => packet.page_type === 'database');
  const schemaPages = leafPackets.filter((packet) => packet.page_type === 'schema');
  const approvedPrefix = pagePath(canonicalRoot);

  if (databasePages.length !== Number(inventory.summary?.included_database_count || 0)) {
    failures.push(`Database page count mismatch: ${databasePages.length} pages for ${inventory.summary?.included_database_count} included databases.`);
  }
  if (schemaPages.length !== Number(inventory.summary?.included_schema_count || 0)) {
    failures.push(`Schema page count mismatch: ${schemaPages.length} pages for ${inventory.summary?.included_schema_count} included schemas.`);
  }

  for (const page of planned) {
    const fullPath = pagePath(page.treePath);
    if (!fullPath.startsWith(approvedPrefix)) failures.push(`Page outside approved Database Catalog branch: ${fullPath}`);
    if (fullPath.includes('AI Retrieval Artifacts') || fullPath.includes('High-Value Assets') || fullPath.includes('Data Product Catalog')) {
      failures.push(`Page path mixes a non-Tier-1 branch into the publish packet: ${fullPath}`);
    }
    if (fullPath.toLowerCase().includes('/ ssisdb') || fullPath.toLowerCase().includes('no_schema')) {
      failures.push(`SSIS package/catalog or no_schema artifact is in the publish packet: ${fullPath}`);
    }
    if (page.page_type === 'object' || page.page_type === 'product' || page.page_type === 'object-pilot') {
      failures.push(`Non-Tier-1 leaf page included in publish packet: ${fullPath}`);
    }
  }

  for (const packet of schemaPages) {
    const objects = packet.catalog_slice?.objects || [];
    const total = Number(packet.catalog_slice?.object_counts?.total || 0);
    if (!Array.isArray(objects) || objects.length !== total) {
      failures.push(`Schema object count mismatch for ${pagePath(packet.page_tree_path)}: ${objects.length} objects for total ${total}.`);
    }
    if (String(packet.catalog_slice?.database || '').toLowerCase() === 'ssisdb') {
      failures.push(`SSIS catalog schema is not allowed in Tier 1 Database Catalog publish packet: ${pagePath(packet.page_tree_path)}.`);
    }
  }

  if (!Array.isArray(supersededReport.candidates) || supersededReport.cleanup_allowed !== false) {
    failures.push('Superseded cleanup report is missing or cleanup is not explicitly disabled.');
  }

  return failures;
}

function databaseSummaryRows(inventory) {
  return (inventory.databases || []).map((database) => ({
    Database: `\`${database.database}\``,
    Schemas: database.schema_count,
    Objects: database.object_counts?.total || 0,
    Types: database.object_type_summary || 'not surfaced',
  }));
}

function markdownPacket(packet) {
  return `# FDP-03 Tier 1 Publish Review Packet

## Purpose

This packet prepares the reviewed Tier 1 Database Catalog publish for every
included cataloged database.

It does not publish to Confluence and it does not clean up, archive, delete, or
move superseded pages.

## Recommendation

${packet.recommendation}

## Publish Scope

| Signal | Value |
| --- | --- |
| Packet | \`${packet.packet_id}\` |
| Generated at | ${packet.generated_at} |
| Canonical root | \`${packet.scope.canonical_root}\` |
| Publish mode | \`${packet.scope.publish_mode}\` |
| Cleanup mode | \`${packet.scope.cleanup_mode}\` |
| Required labels | ${packet.required_labels.map((label) => `\`${label}\``).join(', ')} |
| Validation status | \`${packet.validation.status}\` |

## Page Counts

| Signal | Value |
| --- | --- |
| Planned navigation pages | ${packet.summary.navigation_pages} |
| Planned database pages | ${packet.summary.database_pages} |
| Planned schema pages | ${packet.summary.schema_pages} |
| Planned leaf pages | ${packet.summary.leaf_pages} |
| Planned total pages | ${packet.summary.total_planned_pages} |
| Included objects represented on schema indexes | ${packet.summary.included_objects} |
| Excluded SSIS package/catalog artifacts | ${packet.summary.excluded_artifacts} |
| Superseded cleanup candidates | ${packet.summary.superseded_candidates} |

## Database Coverage

${mdTable(packet.database_summary, ['Database', 'Schemas', 'Objects', 'Types'])}

## Pages To Create Or Update

${mdTable(
  packet.planned_pages.map((page) => ({
    Kind: page.kind,
    Type: page.page_type,
    Title: `\`${page.title}\``,
    Path: `\`${pagePath(page.treePath)}\``,
    Evidence: page.evidence_hash ? `\`${page.evidence_hash}\`` : 'navigation page',
  })),
  ['Kind', 'Type', 'Title', 'Path', 'Evidence']
)}

## SSIS Boundary

The packet excludes \`ssisdb\` package and dataset artifacts from Database
Catalog publication. They remain in SSIS support documentation.

The packet intentionally retains the separate cataloged database named \`SSIS\`
with its \`Meta\` schema because it is a real database table entry, not an
\`ssisdb\` package/catalog artifact.

## Cleanup Candidates

Cleanup is not authorized by this packet.

| Signal | Value |
| --- | --- |
| Cleanup candidates | ${packet.summary.superseded_candidates} |
| Cleanup allowed | No |
| Separate cleanup approval required | Yes |
| Cleanup report | \`${packet.source_artifacts.superseded_report}\` |

## Approval To Publish

To publish this packet, the user must explicitly approve live publish for:

\`${packet.scope.canonical_root}\`

The publish command should use the JSON packet path:

\`\`\`powershell
node scripts\\publish-human-confluence-catalog-pilot.mjs --packet ${packet.output_artifacts.packet_json} --publish
\`\`\`

Do not run cleanup commands from this approval.

## Rollback Notes

- Updated Confluence pages can be restored from Confluence page history.
- Created pages are labeled with the required labels in this packet for targeted
  review if rollback is approved.
- Cleanup candidates remain untouched, so old navigation remains available
  until a separate cleanup packet is approved.
- If validation fails after publish, stop and do not run cleanup.

## Validation

${packet.validation.failures.length === 0 ? '- No packet validation failures.' : packet.validation.failures.map((failure) => `- ${failure}`).join('\n')}

## Source Artifacts

- Dry-run manifest: \`${packet.source_artifacts.dry_run_manifest}\`
- Inventory: \`${packet.source_artifacts.inventory}\`
- Superseded report: \`${packet.source_artifacts.superseded_report}\`
`;
}

async function main() {
  const [manifest, inventory, supersededReport] = await Promise.all([
    readJson(path.join(dryRunRoot, 'manifest.json')),
    readJson(path.join(fullDeploymentRoot, 'inventory.json')),
    readJson(path.join(dryRunRoot, 'superseded-pages-report.json')),
  ]);
  const leafPackets = [];
  for (const entry of manifest.pages || []) {
    // eslint-disable-next-line no-await-in-loop
    const packet = await readJson(path.join(dryRunRoot, entry.evidenceFile));
    if (!isTier1Leaf(packet)) continue;
    leafPackets.push({ ...packet, evidence_file: entry.evidenceFile, markdown_file: entry.markdownFile });
  }

  const planned = plannedPages(leafPackets);
  const failures = validationFailures({ leafPackets, planned, inventory, supersededReport });
  const databasePages = leafPackets.filter((packet) => packet.page_type === 'database');
  const schemaPages = leafPackets.filter((packet) => packet.page_type === 'schema');
  const generatedAt = new Date().toISOString();
  const packet = {
    packet_id: 'FDP-03',
    generated_at: generatedAt,
    scope: {
      canonical_root: pagePath(canonicalRoot),
      deployment_tier: 'Tier 1 database and schema indexes',
      publish_mode: 'reviewed publish packet; no live publish performed',
      cleanup_mode: 'report-only; no cleanup authorized',
    },
    required_labels: requiredLabels,
    recommendation:
      failures.length === 0
        ? 'Ready for user review. Live Tier 1 publish requires explicit approval. Cleanup is not included.'
        : 'Not ready for live publish approval until packet validation failures are resolved.',
    summary: {
      navigation_pages: planned.filter((page) => page.kind === 'navigation').length,
      database_pages: databasePages.length,
      schema_pages: schemaPages.length,
      leaf_pages: leafPackets.length,
      total_planned_pages: planned.length,
      included_objects: inventory.summary.included_object_count,
      excluded_artifacts: inventory.summary.excluded_artifact_count,
      superseded_candidates: supersededReport.summary?.total_candidates || 0,
    },
    database_summary: databaseSummaryRows(inventory),
    planned_pages: planned,
    leaf_pages: leafPackets.sort((left, right) => pagePath(left.page_tree_path).localeCompare(pagePath(right.page_tree_path))),
    source_artifacts: {
      dry_run_manifest: 'data/confluence/human-catalog-dry-run/manifest.json',
      inventory: 'data/confluence/full-database-catalog-deployment/inventory.json',
      superseded_report: 'data/confluence/human-catalog-dry-run/superseded-pages-report.json',
    },
    output_artifacts: {
      packet_json: `docs/confluence-full-database-catalog-deployment/${packetSlug}.json`,
      packet_markdown: `docs/confluence-full-database-catalog-deployment/${packetSlug}.md`,
    },
    validation: {
      status: failures.length === 0 ? 'passed' : 'failed',
      failures,
    },
  };

  await writeText(path.join(packetRoot, `${packetSlug}.json`), JSON.stringify(packet, null, 2));
  await writeText(path.join(packetRoot, `${packetSlug}.md`), markdownPacket(packet));

  console.log(
    JSON.stringify(
      {
        status: packet.validation.status,
        markdown: packet.output_artifacts.packet_markdown,
        json: packet.output_artifacts.packet_json,
        summary: packet.summary,
        failures,
      },
      null,
      2
    )
  );
  if (failures.length > 0) process.exitCode = 1;
}

await main();
