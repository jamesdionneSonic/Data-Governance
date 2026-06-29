import fs from 'node:fs/promises';
import path from 'node:path';

const outputRoot = path.resolve('data/confluence/human-catalog-dry-run');
const packetRoot = path.resolve('docs/confluence-human-catalog-pilots');
const packetSlug = 'WP-04-Sonic-DW-dbo-publish-packet';
const pilotDatabase = 'Sonic_DW';
const pilotSchema = 'dbo';
const canonicalRoot = ['Sonic Data Lineage', 'Database Catalog'];
const pilotRoot = [...canonicalRoot, pilotDatabase, pilotSchema];

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

function isDatabasePage(packet) {
  return packet.page_type === 'database' && packet.database_slice?.database === pilotDatabase;
}

function isPilotSchemaPage(packet) {
  return (
    packet.page_type === 'schema' &&
    packet.catalog_slice?.database === pilotDatabase &&
    packet.catalog_slice?.schema === pilotSchema
  );
}

function isPilotObjectPage(packet) {
  return (
    packet.page_type === 'object' &&
    packet.object?.database === pilotDatabase &&
    packet.object?.schema === pilotSchema
  );
}

function isPilotLeaf(packet) {
  return isDatabasePage(packet) || isPilotSchemaPage(packet) || isPilotObjectPage(packet);
}

function plannedPages(leafPackets) {
  const byPath = new Map();
  const addPage = (treePath, kind, packet = null) => {
    const key = pagePath(treePath);
    if (!byPath.has(key)) {
      byPath.set(key, {
        kind,
        title: treePath.at(-1),
        treePath,
        page_type: packet?.page_type || 'navigation',
        evidence_hash: packet?.evidence_hash || null,
        evidence_file: packet?.evidence_file || null,
        markdown_file: packet?.markdown_file || null,
      });
    }
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

function validationFailures({ leafPackets, planned, schemaPacket, supersededCandidates }) {
  const failures = [];
  const approvedPrefix = pagePath(canonicalRoot);
  for (const page of planned) {
    const fullPath = pagePath(page.treePath);
    if (!fullPath.startsWith(approvedPrefix)) {
      failures.push(`Page outside approved Database Catalog branch: ${fullPath}`);
    }
    if (fullPath.includes('AI Retrieval Artifacts') || fullPath.includes('High-Value Assets')) {
      failures.push(`Page path mixes forbidden branch into human catalog publish packet: ${fullPath}`);
    }
  }
  if (!leafPackets.some(isDatabasePage)) failures.push(`${pilotDatabase} database page is missing from the packet.`);
  if (!schemaPacket) failures.push(`${pilotDatabase}.${pilotSchema} schema page is missing from the packet.`);
  if (schemaPacket) {
    const objects = schemaPacket.catalog_slice?.objects || [];
    const total = Number(schemaPacket.catalog_slice?.object_counts?.total || 0);
    if (!Array.isArray(objects) || objects.length !== total) {
      failures.push(`Schema object count mismatch: ${objects.length} objects for total ${total}.`);
    }
  }
  const objectPages = leafPackets.filter(isPilotObjectPage);
  if (objectPages.length === 0) failures.push('No canonical object pages were selected for the pilot packet.');
  if (!supersededCandidates.some((candidate) => candidate.candidate_type === 'schema-title')) {
    failures.push('No superseded schema-title candidate was included for explicit cleanup review.');
  }
  return failures;
}

function summarizeTags(objectPackets) {
  const counts = new Map();
  for (const packet of objectPackets) {
    for (const tag of packet.tags || []) counts.set(tag, (counts.get(tag) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .map(([tag, count]) => ({ Tag: `\`${tag}\``, Count: count }));
}

function markdownPacket(packet) {
  const objectPackets = packet.leaf_pages.filter((page) => page.page_type === 'object');
  const schema = packet.schema_summary;
  return `# WP-04 Sonic_DW.dbo Human Catalog Publish Review Packet

## Purpose

This packet proves the human Database Catalog pattern end to end for \`${pilotDatabase}.${pilotSchema}\` and prepares a reviewable live-publish decision.

It does not publish, move, archive, or delete Confluence pages.

## Recommendation

${packet.recommendation}

## Dry-Run Output

| Item | Value |
| --- | --- |
| Dry-run folder | \`${packet.dry_run_output}\` |
| Generated at | ${packet.generated_at} |
| Validation status | ${packet.validation.status} |
| Leaf pages in packet | ${packet.summary.leaf_pages} |
| Planned navigation pages | ${packet.summary.navigation_pages} |
| Planned total pages | ${packet.summary.total_planned_pages} |
| Superseded cleanup candidates | ${packet.summary.superseded_candidates} |

## Sonic_DW.dbo Object Counts

| Object Type | Count |
| --- | ---: |
| Total | ${schema.object_counts.total} |
| Tables | ${schema.object_counts.table || 0} |
| Views | ${schema.object_counts.view || 0} |
| Procedures | ${schema.object_counts.procedure || 0} |
| Functions | ${schema.object_counts.function || 0} |
| Synonyms | ${schema.object_counts.synonym || 0} |
| Other | ${schema.object_counts.other || 0} |

## Object Tag Summary

${mdTable(summarizeTags(objectPackets), ['Tag', 'Count'])}

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

## Canonical Object Pages In Scope

${mdTable(
  objectPackets.map((page) => ({
    Object: `\`${page.object.name}\``,
    Type: page.object.type,
    Tags: (page.tags || []).join(', ') || 'none',
    'Page Level': page.page_generation_level || 'not surfaced',
    'Rich Candidate': page.rich_promotion?.eligible_for_rich_page ? 'yes' : 'no',
    Path: `\`${pagePath(page.page_tree_path)}\``,
  })),
  ['Object', 'Type', 'Tags', 'Page Level', 'Rich Candidate', 'Path']
)}

## Superseded Pages Requiring Separate Cleanup Approval

These are review candidates only. They are not part of canonical page creation/update.

${mdTable(
  packet.superseded_cleanup_candidates.map((candidate) => ({
    Type: candidate.candidate_type,
    'Old Title': `\`${candidate.noncanonical_title}\``,
    'Old Path': `\`${candidate.noncanonical_path}\``,
    'Canonical Path': `\`${candidate.canonical_path}\``,
    Action: candidate.recommended_action,
  })),
  ['Type', 'Old Title', 'Old Path', 'Canonical Path', 'Action']
)}

## Known Gaps

- Business owner, data steward, SLA, lifecycle/status, live freshness, and certification are not inferred.
- Rich object prose is not promoted while business definition or description confidence remains weak.
- Cleanup candidates require live Confluence page-id review before archive or move.
- This packet does not include Rovo AI Retrieval Artifact pages; those belong to WP-05.

## Rollback And No-Change Plan

Before live publish:

1. Run \`npm run confluence:human:dry-run\`.
2. Run \`npm run confluence:human:check\`.
3. Rebuild this packet and confirm the planned pages remain limited to \`${pagePath(canonicalRoot)} / ${pilotDatabase}\`.
4. Do not run a live publish if any page path enters \`High-Value Assets\`, \`AI Retrieval Artifacts\`, or an unexpected Confluence branch.

If a later approved live publish updates existing pages, use Confluence page history to restore prior versions.

If a later approved live publish creates new pages, identify them by the publish labels and remove only after a separate rollback approval.

Cleanup of superseded pages is a separate operation and is not authorized by this packet.

## Validation Details

${packet.validation.failures.length === 0 ? '- No packet validation failures.' : packet.validation.failures.map((failure) => `- ${failure}`).join('\n')}
`;
}

async function main() {
  const manifest = await readJson(path.join(outputRoot, 'manifest.json'));
  const supersededReport = await readJson(path.join(outputRoot, 'superseded-pages-report.json'));
  const leafPackets = [];
  for (const entry of manifest.pages || []) {
    // eslint-disable-next-line no-await-in-loop
    const packet = await readJson(path.join(outputRoot, entry.evidenceFile));
    if (!isPilotLeaf(packet)) continue;
    leafPackets.push({ ...packet, evidence_file: entry.evidenceFile, markdown_file: entry.markdownFile });
  }

  const planned = plannedPages(leafPackets);
  const schemaPacket = leafPackets.find(isPilotSchemaPage);
  const pilotPath = pagePath(pilotRoot);
  const supersededCandidates = (supersededReport.candidates || []).filter((candidate) => {
    const canonicalPath = String(candidate.canonical_path || '');
    return canonicalPath === pilotPath || canonicalPath.startsWith(`${pilotPath} / `);
  });
  const failures = validationFailures({ leafPackets, planned, schemaPacket, supersededCandidates });
  if (manifest.delta_scope?.active !== true) {
    failures.push('Human catalog dry-run manifest is not delta-scoped. Run the dry run with --delta-manifest before preparing a publish packet.');
  }
  const packet = {
    packet_id: 'WP-04',
    generated_at: new Date().toISOString(),
    dry_run_output: outputRoot.replaceAll('\\', '/'),
    scope: {
      database: pilotDatabase,
      schema: pilotSchema,
      canonical_root: pagePath(canonicalRoot),
    },
    recommendation:
      failures.length === 0
        ? 'Ready for human review as a dry-run publish packet. Live canonical page creation/update still requires explicit user approval. Superseded-page cleanup is not included.'
        : 'Not ready for approval until packet validation failures are resolved.',
    summary: {
      leaf_pages: leafPackets.length,
      navigation_pages: planned.filter((page) => page.kind === 'navigation').length,
      total_planned_pages: planned.length,
      object_pages: leafPackets.filter(isPilotObjectPage).length,
      superseded_candidates: supersededCandidates.length,
    },
    schema_summary: {
      page_path: schemaPacket ? pagePath(schemaPacket.page_tree_path) : '',
      object_counts: schemaPacket?.catalog_slice?.object_counts || {},
      object_inventory_count: schemaPacket?.catalog_slice?.objects?.length || 0,
    },
    planned_pages: planned,
    leaf_pages: leafPackets.sort((left, right) => pagePath(left.page_tree_path).localeCompare(pagePath(right.page_tree_path))),
    superseded_cleanup_candidates: supersededCandidates,
    validation: {
      status: failures.length === 0 ? 'passed' : 'failed',
      failures,
    },
    delta_scope: manifest.delta_scope || null,
  };

  await writeText(path.join(packetRoot, `${packetSlug}.json`), JSON.stringify(packet, null, 2));
  await writeText(path.join(packetRoot, `${packetSlug}.md`), markdownPacket(packet));
  console.log(
    JSON.stringify(
      {
        status: packet.validation.status,
        markdown: path.join(packetRoot, `${packetSlug}.md`).replaceAll('\\', '/'),
        json: path.join(packetRoot, `${packetSlug}.json`).replaceAll('\\', '/'),
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
