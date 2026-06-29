import fs from 'node:fs/promises';
import path from 'node:path';

const dryRunRoot = path.resolve('data/confluence/human-catalog-dry-run');
const packetRoot = path.resolve('docs/confluence-full-database-catalog-deployment');
const packetSlug = 'FDP-04-tier2-thin-object-batch-01-publish-packet';
const canonicalRoot = ['Sonic Data Lineage', 'Database Catalog'];
const batch = {
  id: 'FDP-04-BATCH-01',
  database: 'Sonic_DW',
  schema: 'dbo',
  type: 'table',
  maxObjects: 25,
  selection: 'highest downstream count, then highest upstream count, from validated dry-run object pages',
};
const requiredLabels = ['human-lineage-catalog', 'database-catalog', 'database-catalog-tier2', 'thin-object-page'];

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

function isBatchObject(packet) {
  return (
    packet.page_type === 'object' &&
    packet.page_generation_level === 'thin' &&
    packet.object?.database === batch.database &&
    packet.object?.schema === batch.schema &&
    packet.object?.type === batch.type &&
    Array.isArray(packet.page_tree_path) &&
    packet.page_tree_path.slice(0, 4).join(' / ') === pagePath([...canonicalRoot, batch.database, batch.schema])
  );
}

function referencePages() {
  return [
    canonicalRoot,
    [...canonicalRoot, batch.database],
    [...canonicalRoot, batch.database, batch.schema],
  ].map((treePath) => ({
    kind: 'reference',
    title:
      treePath.length === canonicalRoot.length + 2
        ? `${treePath.at(-2)}.${treePath.at(-1)}`
        : treePath.at(-1),
    treePath,
    page_type: 'reference',
    evidence_hash: null,
    evidence_file: null,
    markdown_file: null,
    labels: [],
  }));
}

function plannedPages(objectPackets) {
  return [
    ...referencePages(),
    ...objectPackets.map((packet) => ({
      kind: 'leaf',
      title: `${packet.object.database}.${packet.object.schema}.${packet.object.name}`,
      treePath: packet.page_tree_path,
      page_type: packet.page_type,
      evidence_hash: packet.evidence_hash,
      evidence_file: packet.evidence_file,
      markdown_file: packet.markdown_file,
      labels: requiredLabels,
    })),
  ];
}

function validateObjectPacket(packet) {
  const failures = [];
  const fullPath = pagePath(packet.page_tree_path || []);
  if (!fullPath.startsWith(pagePath([...canonicalRoot, batch.database, batch.schema]))) {
    failures.push(`Object page is outside the approved batch path: ${fullPath}`);
  }
  if (fullPath.toLowerCase().includes('ssisdb') || fullPath.toLowerCase().includes('high-value assets')) {
    failures.push(`Object page path contains a forbidden branch or source: ${fullPath}`);
  }
  if (packet.page_generation_level !== 'thin') failures.push(`${fullPath} is not marked as a thin object page.`);
  if (!packet.object?.name || !packet.object?.type || !packet.object?.database || !packet.object?.schema) {
    failures.push(`${fullPath} is missing object identity fields.`);
  }
  if (!Array.isArray(packet.tags)) failures.push(`${fullPath} is missing deterministic tags.`);
  if (!Array.isArray(packet.tag_reasons) || packet.tag_reasons.length === 0) {
    failures.push(`${fullPath} is missing tag reasons.`);
  }
  if (!Array.isArray(packet.aliases) || packet.aliases.length === 0) failures.push(`${fullPath} is missing aliases.`);
  if (!Array.isArray(packet.backlinks) || packet.backlinks.length < 2) failures.push(`${fullPath} is missing database/schema backlinks.`);
  if (!packet.confidence?.lineage_confidence || !packet.confidence?.description_confidence) {
    failures.push(`${fullPath} is missing page-level confidence fields.`);
  }
  if (!Array.isArray(packet.not_surfaced_facts) || packet.not_surfaced_facts.length === 0) {
    failures.push(`${fullPath} is missing not_surfaced_facts.`);
  }
  if (!packet.rich_promotion || packet.rich_promotion.current_level !== 'thin') {
    failures.push(`${fullPath} is missing thin rich-promotion metadata.`);
  }
  if (!packet.lineage || !packet.technical_signals || !packet.profile_signals) {
    failures.push(`${fullPath} is missing lineage, technical, or profile signal blocks.`);
  }
  return failures;
}

function validationFailures(objectPackets) {
  const failures = [];
  if (objectPackets.length === 0) failures.push('No thin object pages were selected for the Tier 2 batch.');
  if (objectPackets.length > batch.maxObjects) failures.push(`Batch exceeds max object count: ${objectPackets.length} of ${batch.maxObjects}.`);
  for (const packet of objectPackets) failures.push(...validateObjectPacket(packet));
  const names = objectPackets.map((packet) => packet.object?.name).filter(Boolean);
  if (new Set(names).size !== names.length) failures.push('Duplicate object names found in the batch.');
  return failures;
}

function objectRows(objectPackets) {
  return objectPackets.map((packet) => ({
    Object: `\`${packet.object.name}\``,
    Type: packet.object.type,
    Tags: (packet.tags || []).join(', ') || 'none',
    Downstream: packet.lineage?.downstream_consumers?.length ?? 0,
    Columns: packet.technical_signals?.columns?.length ?? 0,
    Confidence: packet.confidence?.lineage_confidence || 'not surfaced',
    Path: `\`${pagePath(packet.page_tree_path)}\``,
  }));
}

function tagSummary(objectPackets) {
  const counts = new Map();
  for (const packet of objectPackets) {
    for (const tag of packet.tags || []) counts.set(tag, (counts.get(tag) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .map(([tag, count]) => ({ Tag: `\`${tag}\``, Count: count }));
}

function markdownPacket(packet) {
  return `# FDP-04 Tier 2 Thin Object Batch 01 Publish Review Packet

## Purpose

This packet prepares the first safe Tier 2 thin object-page batch for the
canonical Database Catalog.

It does not publish to Confluence and it does not clean up, archive, delete, or
move pages.

## Recommendation

${packet.recommendation}

## Batch Strategy

| Signal | Value |
| --- | --- |
| Batch id | \`${packet.batch.id}\` |
| Database | \`${packet.batch.database}\` |
| Schema | \`${packet.batch.schema}\` |
| Object type | \`${packet.batch.type}\` |
| Max objects | ${packet.batch.maxObjects} |
| Selection rule | ${packet.batch.selection} |
| Publish mode | \`${packet.scope.publish_mode}\` |
| Cleanup mode | \`${packet.scope.cleanup_mode}\` |
| Required labels | ${packet.required_labels.map((label) => `\`${label}\``).join(', ')} |
| Validation status | \`${packet.validation.status}\` |

## Planned Pages

| Signal | Value |
| --- | --- |
| Reference parent pages | ${packet.summary.reference_pages} |
| Thin object pages | ${packet.summary.object_pages} |
| Total planned entries | ${packet.summary.total_planned_pages} |

Reference parent pages are required to already exist from Tier 1. They are used
only for parent lookup and must not be overwritten by this Tier 2 packet.

## Tag Summary

${mdTable(packet.tag_summary, ['Tag', 'Count'])}

## Object Pages In Scope

${mdTable(packet.object_summary, ['Object', 'Type', 'Tags', 'Downstream', 'Columns', 'Confidence', 'Path'])}

## Approval To Publish

Live publish requires explicit user approval for:

\`${pagePath([...canonicalRoot, batch.database, batch.schema])}\`

The publish command is:

\`\`\`powershell
npm run confluence:full:tier2:batch01:publish
\`\`\`

Do not run cleanup commands from this approval.

## Validation

${packet.validation.failures.length === 0 ? '- No packet validation failures.' : packet.validation.failures.map((failure) => `- ${failure}`).join('\n')}

## Source Artifacts

- Dry-run manifest: \`${packet.source_artifacts.dry_run_manifest}\`
- Dry-run output root: \`${packet.source_artifacts.dry_run_output}\`
`;
}

async function main() {
  const manifest = await readJson(path.join(dryRunRoot, 'manifest.json'));
  const objectPackets = [];
  for (const entry of manifest.pages || []) {
    // eslint-disable-next-line no-await-in-loop
    const packet = await readJson(path.join(dryRunRoot, entry.evidenceFile));
    if (!isBatchObject(packet)) continue;
    objectPackets.push({ ...packet, evidence_file: entry.evidenceFile, markdown_file: entry.markdownFile });
  }

  objectPackets.sort(
    (left, right) =>
      Number(right.lineage?.downstream_consumers?.length || 0) - Number(left.lineage?.downstream_consumers?.length || 0) ||
      String(left.object?.name || '').localeCompare(String(right.object?.name || ''))
  );
  const selected = objectPackets.slice(0, batch.maxObjects);
  const failures = validationFailures(selected);
  const planned = plannedPages(selected);
  const generatedAt = new Date().toISOString();
  const packet = {
    packet_id: 'FDP-04',
    generated_at: generatedAt,
    batch,
    scope: {
      canonical_root: pagePath(canonicalRoot),
      deployment_tier: 'Tier 2 thin canonical object pages',
      publish_mode: 'reviewed publish packet; no live publish performed',
      cleanup_mode: 'none; cleanup remains separate',
    },
    required_labels: requiredLabels,
    recommendation:
      failures.length === 0
        ? 'Ready for user review. Live Tier 2 object-page publish requires explicit approval and assumes Tier 1 parent pages exist.'
        : 'Not ready for live publish approval until packet validation failures are resolved.',
    summary: {
      reference_pages: planned.filter((page) => page.kind === 'reference').length,
      object_pages: selected.length,
      total_planned_pages: planned.length,
    },
    planned_pages: planned,
    object_summary: objectRows(selected),
    tag_summary: tagSummary(selected),
    leaf_pages: selected,
    source_artifacts: {
      dry_run_manifest: 'data/confluence/human-catalog-dry-run/manifest.json',
      dry_run_output: 'data/confluence/human-catalog-dry-run',
    },
    output_artifacts: {
      packet_json: `docs/confluence-full-database-catalog-deployment/${packetSlug}.json`,
      packet_markdown: `docs/confluence-full-database-catalog-deployment/${packetSlug}.md`,
    },
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
