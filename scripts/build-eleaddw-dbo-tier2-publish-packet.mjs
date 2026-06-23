import fs from 'node:fs/promises';
import path from 'node:path';

const dryRunRoot = path.resolve('data/confluence/human-catalog-dry-run');
const packetRoot = path.resolve('docs/confluence-full-database-catalog-deployment');
const packetSlug = 'T2P-04-eleaddw-dbo-tier2-publish-packet';
const canonicalRoot = ['Sonic Data Lineage', 'Database Catalog'];
const scope = {
  id: 'T2P-04-ELEADDW-DBO',
  platform: 'SQL Server',
  database: 'eLeadDW',
  schema: 'dbo',
  objectScope: 'all publishable objects in schema',
};
const databaseSchemaLabels = ['human-lineage-catalog', 'database-catalog', 'database-catalog-tier1', 'database-catalog-link-refresh'];
const objectLabels = ['human-lineage-catalog', 'database-catalog', 'database-catalog-tier2', 'thin-object-page'];

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

function isScopePacket(packet) {
  return (
    Array.isArray(packet.page_tree_path) &&
    packet.page_tree_path[0] === canonicalRoot[0] &&
    packet.page_tree_path[1] === canonicalRoot[1] &&
    packet.page_tree_path[2] === scope.platform &&
    packet.page_tree_path[3] === scope.database &&
    (packet.page_type === 'database' ||
      (packet.page_tree_path[4] === scope.schema && ['schema', 'object'].includes(packet.page_type)))
  );
}

function pageTitle(packet) {
  if (packet.page_type === 'schema') return `${scope.database}.${scope.schema}`;
  if (packet.page_type === 'object') return `${packet.object.database}.${packet.object.schema}.${packet.object.name}`;
  return packet.page_title || packet.page_tree_path.at(-1);
}

function referencePages() {
  return [
    canonicalRoot,
    [...canonicalRoot, scope.platform],
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

function validateObjectPacket(packet) {
  const failures = [];
  const fullPath = pagePath(packet.page_tree_path || []);
  const approvedPrefix = pagePath([...canonicalRoot, scope.platform, scope.database, scope.schema]);
  if (!fullPath.startsWith(approvedPrefix)) failures.push(`Object page is outside the approved schema path: ${fullPath}`);
  if (fullPath.toLowerCase().includes('high-value assets') || fullPath.toLowerCase().includes('ai retrieval artifacts')) {
    failures.push(`Object page path contains a forbidden human-catalog branch: ${fullPath}`);
  }
  if (packet.page_generation_level !== 'thin') failures.push(`${fullPath} is not marked as a thin object page.`);
  if (packet.object?.platform !== scope.platform || packet.object?.database !== scope.database || packet.object?.schema !== scope.schema) {
    failures.push(`${fullPath} object identity does not match ${scope.platform} / ${scope.database} / ${scope.schema}.`);
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
  if (!Array.isArray(packet.backlinks) || packet.backlinks.length < 2) failures.push(`${fullPath} is missing backlinks.`);
  return failures;
}

function validationFailures({ databasePacket, schemaPacket, objectPackets, planned }) {
  const failures = [];
  if (!databasePacket) failures.push('Scoped dry-run output is missing the eLeadDW database page.');
  if (!schemaPacket) failures.push('Scoped dry-run output is missing the eLeadDW.dbo schema page.');
  if (objectPackets.length !== 55) failures.push(`Expected 55 eLeadDW.dbo object pages, found ${objectPackets.length}.`);
  const schemaObjects = schemaPacket?.catalog_slice?.objects || [];
  if (schemaObjects.length !== objectPackets.length) {
    failures.push(`Schema object count ${schemaObjects.length} does not match object page count ${objectPackets.length}.`);
  }
  if (schemaPacket?.catalog_slice?.link_status_summary?.planned_in_packet !== objectPackets.length) {
    failures.push('Schema link-status summary does not mark every object as planned in packet.');
  }
  for (const packet of objectPackets) failures.push(...validateObjectPacket(packet));
  const names = objectPackets.map((packet) => packet.object?.name).filter(Boolean);
  if (new Set(names).size !== names.length) failures.push('Duplicate object names found in the eLeadDW.dbo object packet.');
  for (const page of planned) {
    const fullPath = pagePath(page.treePath || []);
    if (!fullPath.startsWith(pagePath(canonicalRoot))) failures.push(`Planned page outside Database Catalog: ${fullPath}`);
    if (fullPath.includes('High-Value Assets') || fullPath.includes('AI Retrieval Artifacts')) {
      failures.push(`Planned page uses a forbidden branch: ${fullPath}`);
    }
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
  return `# T2P-04 eLeadDW.dbo Tier 2 Publish Review Packet

## Purpose

This packet prepares a reviewed Confluence publish for the first complete
one-schema Tier 2 object slice:

\`${pagePath([...canonicalRoot, scope.platform, scope.database, scope.schema])}\`

It does not publish to Confluence and it does not clean up, archive, delete, or
move pages.

## Recommendation

${packet.recommendation}

## Scope

| Signal | Value |
| --- | --- |
| Packet id | \`${packet.packet_id}\` |
| Batch id | \`${packet.batch.id}\` |
| Platform/Product | \`${packet.batch.platform}\` |
| Database | \`${packet.batch.database}\` |
| Schema | \`${packet.batch.schema}\` |
| Object scope | ${packet.batch.objectScope} |
| Publish mode | \`${packet.scope.publish_mode}\` |
| Cleanup mode | \`${packet.scope.cleanup_mode}\` |
| Validation status | \`${packet.validation.status}\` |

## Planned Pages

| Signal | Value |
| --- | ---: |
| Reference parent pages | ${packet.summary.reference_pages} |
| Link refresh pages | ${packet.summary.link_refresh_pages} |
| Thin object pages | ${packet.summary.object_pages} |
| Total planned entries | ${packet.summary.total_planned_pages} |

Reference parent pages are required to already exist from Tier 1. They are used
only for parent lookup and must not be overwritten by this Tier 2 packet.

## Link Refresh

| Signal | Value |
| --- | ---: |
| Schema object rows | ${packet.link_summary.schema_object_rows} |
| Objects planned in packet | ${packet.link_summary.planned_in_packet} |
| Pending rows before publish | ${packet.link_summary.pending_rows} |
| Schema-page object links rendered | ${packet.link_summary.rendered_schema_links} |
| Most-used links rendered | ${packet.link_summary.rendered_most_used_links} |

Pending rows are expected before live publish. The post-publish readback must
confirm the pages exist before \`canonical_page_exists\` can be treated as true.

## Tag Summary

${mdTable(packet.tag_summary, ['Tag', 'Count'])}

## Object Pages In Scope

${mdTable(packet.object_summary, ['Object', 'Type', 'Tags', 'Downstream', 'Columns', 'Confidence', 'Path'])}

## Approval To Publish

Live publish requires explicit user approval for:

\`${pagePath([...canonicalRoot, scope.platform, scope.database, scope.schema])}\`

The publish command is:

\`\`\`powershell
npm run confluence:full:tier2:eleaddw-dbo:publish
\`\`\`

Do not run cleanup commands from this approval.

## Validation

${packet.validation.failures.length === 0 ? '- No packet validation failures.' : packet.validation.failures.map((failure) => `- ${failure}`).join('\n')}

## Source Artifacts

- Dry-run manifest: \`${packet.source_artifacts.dry_run_manifest}\`
- Dry-run output root: \`${packet.source_artifacts.dry_run_output}\`
- T2P-03 readback: \`docs/confluence-full-database-catalog-deployment/T2P-03-eleaddw-dbo-thin-object-dry-run-readback.md\`
`;
}

async function main() {
  const manifest = await readJson(path.join(dryRunRoot, 'manifest.json'));
  const packets = [];
  for (const entry of manifest.pages || []) {
    // eslint-disable-next-line no-await-in-loop
    const packet = await readJson(path.join(dryRunRoot, entry.evidenceFile));
    if (!isScopePacket(packet)) continue;
    packets.push({ ...packet, evidence_file: entry.evidenceFile, markdown_file: entry.markdownFile });
  }

  const databasePacket = packets.find((packet) => packet.page_type === 'database');
  const schemaPacket = packets.find((packet) => packet.page_type === 'schema');
  const objectPackets = packets
    .filter((packet) => packet.page_type === 'object')
    .sort((left, right) => String(left.object?.name || '').localeCompare(String(right.object?.name || '')));
  const planned = plannedPages({ databasePacket, schemaPacket, objectPackets });

  const schemaMarkdown = await fs.readFile(path.join(dryRunRoot, schemaPacket.markdown_file), 'utf8');
  const objectLinkTarget = `](${pagePath([...canonicalRoot, scope.platform, scope.database, scope.schema])} /`;
  const mostUsedSection = schemaMarkdown.split('## Most Used Objects')[1]?.split('## Tables')[0] || '';
  const failures = validationFailures({ databasePacket, schemaPacket, objectPackets, planned });
  const packet = {
    packet_id: 'T2P-04',
    generated_at: new Date().toISOString(),
    batch: scope,
    scope: {
      canonical_root: pagePath(canonicalRoot),
      deployment_tier: 'Tier 2 thin canonical object pages and schema link refresh',
      publish_mode: 'reviewed publish packet; no live publish performed',
      cleanup_mode: 'none; cleanup remains separate',
      link_mode: 'same-packet links pending live readback',
    },
    required_labels: ['human-lineage-catalog', 'database-catalog'],
    recommendation:
      failures.length === 0
        ? 'Ready for user review. Live publish requires explicit approval and assumes Tier 1 parent pages exist.'
        : 'Not ready for live publish approval until packet validation failures are resolved.',
    summary: {
      reference_pages: planned.filter((page) => page.kind === 'reference').length,
      link_refresh_pages: planned.filter((page) => ['database', 'schema'].includes(page.page_type)).length,
      object_pages: objectPackets.length,
      total_planned_pages: planned.length,
    },
    link_summary: {
      schema_object_rows: schemaPacket.catalog_slice?.objects?.length || 0,
      planned_in_packet: schemaPacket.catalog_slice?.link_status_summary?.planned_in_packet || 0,
      pending_rows: schemaPacket.catalog_slice?.link_status_summary?.pending || 0,
      rendered_schema_links: schemaMarkdown.split(objectLinkTarget).length - 1,
      rendered_most_used_links: mostUsedSection.split(objectLinkTarget).length - 1,
    },
    planned_pages: planned,
    object_summary: objectRows(objectPackets),
    tag_summary: tagSummary(objectPackets),
    leaf_pages: [databasePacket, schemaPacket, ...objectPackets],
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
        linkSummary: packet.link_summary,
        failures,
      },
      null,
      2
    )
  );
  if (failures.length > 0) process.exitCode = 1;
}

await main();
