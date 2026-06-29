import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const dryRunRoot = path.resolve('data/confluence/human-catalog-dry-run');
const packetRoot = path.resolve('docs/confluence-full-database-catalog-deployment');
const packetSlug = 'FDP-05-tier3-rich-object-batch-01-publish-packet';
const sourceTier2PacketPath = path.resolve(
  'docs/confluence-full-database-catalog-deployment/FDP-04-tier2-thin-object-batch-01-publish-packet.json'
);
const canonicalRoot = ['Sonic Data Lineage', 'Database Catalog'];
const batch = {
  id: 'FDP-05-BATCH-01',
  database: 'Sonic_DW',
  schema: 'dbo',
  maxObjects: 5,
  requestedObjects: ['Dim_Vehicle', 'FactOpportunity', 'factFIRE', 'Fact_Service', 'Dim_Date'],
  selection:
    'requested seed objects from the Tier 2 Sonic_DW.dbo thin batch; all remain evidence-bound and review-needed when business definition is not surfaced',
};
const requiredLabels = ['human-lineage-catalog', 'database-catalog', 'database-catalog-tier3', 'rich-object-page'];

async function readJson(file) {
  return JSON.parse(await fs.readFile(file, 'utf8'));
}

async function writeText(file, text) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, `${text.trim()}\n`, 'utf8');
}

function hashJson(value) {
  return crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex').toUpperCase();
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

function listItems(values, limit = 8) {
  const items = (values || []).filter(Boolean).slice(0, limit);
  if (items.length === 0) return '- Not surfaced in metadata.';
  return items.map((value) => `- \`${value}\``).join('\n');
}

function richSlug(object) {
  return `rich-object-${object.database}-${object.schema}-${object.name}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function objectSubject(object) {
  const name = String(object.name || '');
  if (/^dim[_A-Z]/i.test(name)) return 'dimension/reference object used to standardize reporting joins and descriptive attributes';
  if (/^fact/i.test(name)) return 'fact object used by reporting and analytics consumers';
  if (/^vw/i.test(name)) return 'view that packages database logic for downstream consumers';
  return `${object.type || 'database object'} used by downstream lineage consumers`;
}

function businessMeaning(object) {
  const name = String(object.name || '');
  if (/vehicle/i.test(name)) {
    return 'vehicle-centered reporting context such as vehicle keys, attributes, and downstream joins';
  }
  if (/opportunity/i.test(name)) {
    return 'sales or lead opportunity reporting context surfaced by the object name and downstream lineage';
  }
  if (/fire/i.test(name)) {
    return 'FIRE reporting context surfaced by the object name and downstream lineage';
  }
  if (/service/i.test(name)) {
    return 'service reporting context surfaced by the object name and downstream lineage';
  }
  if (/date|time/i.test(name)) {
    return 'date/time reference context used to align reporting periods';
  }
  return 'business meaning is not surfaced in metadata beyond object name, columns, and lineage evidence';
}

function confidenceCaveat(object) {
  const missing = object.not_surfaced_facts || [];
  if (missing.includes('business definition')) {
    return 'Business definition is not surfaced in metadata, so this rich page explains support impact from object name, columns, and lineage evidence only.';
  }
  return 'This page uses bounded metadata evidence and should still be reviewed before treating the prose as a formal business definition.';
}

function promotePacket(thinPacket) {
  const object = thinPacket.object || {};
  const richPromotion = {
    rule_version: 'dcat-009.2026-06-19',
    current_level: 'rich',
    previous_level: thinPacket.page_generation_level || 'thin',
    recommended_next_level: 'rich',
    eligible_for_rich_page: true,
    reasons: [
      'requested seed object for FDP-05 rich-page validation',
      ...(thinPacket.rich_promotion?.reasons || []),
    ],
    blocked_reasons: thinPacket.rich_promotion?.blocked_reasons || [],
    caveat:
      'Promotion adds richer support explanation while preserving review-needed and not-surfaced facts; it does not certify business ownership or definition.',
  };
  return {
    ...thinPacket,
    page_generation_level: 'rich',
    rich_promotion: richPromotion,
    tags: [...new Set([...(thinPacket.tags || []), 'rich-page-candidate', 'review-needed'])],
    tag_reasons: [
      ...(thinPacket.tag_reasons || []),
      `rich-page-candidate: ${object.name} is included in the approved FDP-05 seed batch.`,
    ],
    rich_page: {
      promotion_batch: batch.id,
      subject: objectSubject(object),
      business_meaning: businessMeaning(object),
      confidence_caveat: confidenceCaveat(thinPacket),
      first_upstream_check:
        thinPacket.lineage?.upstream_loaders?.[0] || thinPacket.lineage?.upstream_sources?.[0] || 'not surfaced in metadata',
      first_downstream_check: thinPacket.lineage?.downstream_consumers?.[0] || 'not surfaced in metadata',
    },
  };
}

function richMarkdown(packet) {
  const object = packet.object || {};
  const qname = object.qualified_name || [object.database, object.schema, object.name].filter(Boolean).join('.');
  const subject = packet.rich_page.subject;
  const businessMeaningText = packet.rich_page.business_meaning;
  const firstUpstream = packet.rich_page.first_upstream_check;
  const firstDownstream = packet.rich_page.first_downstream_check;
  const columns = packet.technical_signals?.columns || [];
  const upstreamLoaders = packet.lineage?.upstream_loaders || [];
  const upstreamSources = packet.lineage?.upstream_sources || [];
  const downstreamConsumers = packet.lineage?.downstream_consumers || [];
  const writesTo = packet.lineage?.writes_to || [];

  return `# ${object.name}

## Plain-English Summary

\`${qname}\` is a ${subject}. Based on the surfaced metadata, it supports ${downstreamConsumers.length} downstream consumer signal(s), has ${upstreamLoaders.length} upstream loader signal(s), and carries ${packet.profile_signals?.column_count || columns.length || 0} cataloged column signal(s).

In plain English, this object appears to support ${businessMeaningText}. If it is stale, missing, or structurally wrong, downstream consumers such as \`${firstDownstream}\` may return incorrect results or fail. Start troubleshooting with \`${firstUpstream}\`, then confirm downstream consumers that reference \`${object.name}\`.

## Business Meaning And Impact

| Question | Answer |
| --- | --- |
| What is this? | \`${qname}\` is a ${subject}. |
| What business context is surfaced? | ${businessMeaningText}. |
| Why support cares | ${downstreamConsumers.length} downstream consumer signal(s) depend on this object in lineage metadata. |
| First upstream check | \`${firstUpstream}\` |
| First downstream check | \`${firstDownstream}\` |
| Business owner | Not surfaced in metadata. |
| Data steward | Not surfaced in metadata. |
| SLA or live freshness | Not surfaced in metadata. |

## At A Glance

| Signal | Value |
| --- | --- |
| Server | \`${object.server || 'not surfaced in metadata'}\` |
| Database | \`${object.database}\` |
| Schema | \`${object.schema}\` |
| Object | \`${object.name}\` |
| Type | ${object.type} |
| Tags | ${(packet.tags || []).join(', ') || 'none'} |
| Upstream loaders | ${upstreamLoaders.length} |
| Upstream sources | ${upstreamSources.length} |
| Writes to | ${writesTo.length} |
| Downstream consumers | ${downstreamConsumers.length} |
| Columns surfaced | ${columns.length || packet.profile_signals?.column_count || 0} |
| Lineage confidence | ${packet.confidence?.lineage_confidence || 'not surfaced in metadata'} |
| Documentation confidence | ${packet.confidence?.documentation_confidence || 'not surfaced in metadata'} |

## Column Summary

The first surfaced columns are:

${listItems(columns, 20)}

Column-level business definitions were not surfaced in metadata.

## Lineage Summary

| Direction | Summary |
| --- | --- |
| Upstream loaders | ${upstreamLoaders.length} surfaced |
| Upstream sources | ${upstreamSources.length} surfaced |
| Writes to | ${writesTo.length} surfaced |
| Downstream consumers | ${downstreamConsumers.length} surfaced |

### First Upstream Loaders

${listItems(upstreamLoaders, 12)}

### First Downstream Consumers

${listItems(downstreamConsumers, 12)}

## Support Checks

1. Check \`${firstUpstream}\` before changing \`${qname}\`.
2. Confirm the expected columns are present, especially ${columns.slice(0, 5).map((column) => `\`${column}\``).join(', ') || '`not surfaced in metadata`'}.
3. If a downstream report, procedure, or job is failing, compare the incident to the downstream consumers listed on this page.
4. Treat owner, SLA, lifecycle/status, and live freshness as not surfaced in metadata until a governed source provides them.

## Profile And Quality Signals

| Signal | Value |
| --- | --- |
| Profile available | ${packet.profile_signals?.profile_available ? 'Yes' : 'No, not surfaced in this packet'} |
| Profile status | ${packet.profile_signals?.profile_status || 'not surfaced in metadata'} |
| Column count | ${packet.profile_signals?.column_count || columns.length || 0} |
| Description confidence | ${packet.confidence?.description_confidence || 'not surfaced in metadata'} |
| Review caveat | ${packet.rich_page.confidence_caveat} |

## Known Gaps And Confidence

${listItems(packet.not_surfaced_facts || [], 20)}

## Related Pages

- Database page: \`${object.database}\`
- Schema page: \`${object.database}.${object.schema}\`
- Canonical path: \`Sonic Data Lineage / Database Catalog / ${object.database} / ${object.schema} / ${object.name}\`

## Technical Evidence

<details>
<summary>Evidence Packet</summary>

- Evidence packet: \`data/confluence/human-catalog-dry-run/${richSlug(object)}.evidence.json\`
- Source evidence hash: \`${packet.evidence_hash}\`
- Promotion batch: \`${batch.id}\`

</details>

<details>
<summary>Aliases</summary>

${listItems(packet.aliases || [], 20)}

</details>

<details>
<summary>Source Artifact Paths</summary>

${listItems(packet.source_artifact_paths || [], 10)}

</details>`;
}

function plannedPages(richPackets) {
  const references = [
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
  const leaves = richPackets.map((packet) => {
    const slug = richSlug(packet.object);
    return {
      kind: 'leaf',
      title: `${packet.object.database}.${packet.object.schema}.${packet.object.name}`,
      treePath: packet.page_tree_path,
      page_type: 'object',
      evidence_hash: packet.evidence_hash,
      evidence_file: `${slug}.evidence.json`,
      markdown_file: `${slug}.md`,
      labels: requiredLabels,
    };
  });
  return [...references, ...leaves];
}

function validateRichPacket(packet) {
  const failures = [];
  const fullPath = pagePath(packet.page_tree_path || []);
  if (packet.page_generation_level !== 'rich') failures.push(`${fullPath} is not marked rich.`);
  if (packet.rich_promotion?.current_level !== 'rich') failures.push(`${fullPath} promotion current_level is not rich.`);
  if (!packet.rich_page?.business_meaning || !packet.rich_page?.confidence_caveat) {
    failures.push(`${fullPath} is missing rich-page support explanation fields.`);
  }
  if (!Array.isArray(packet.not_surfaced_facts) || packet.not_surfaced_facts.length === 0) {
    failures.push(`${fullPath} must preserve not_surfaced_facts.`);
  }
  if (fullPath.toLowerCase().includes('ssisdb') || fullPath.toLowerCase().includes('high-value assets')) {
    failures.push(`${fullPath} contains a forbidden publish path.`);
  }
  return failures;
}

function validationFailures(richPackets) {
  const failures = [];
  if (richPackets.length === 0) failures.push('No rich object pages were generated.');
  if (richPackets.length > batch.maxObjects) failures.push(`Batch exceeds max object count: ${richPackets.length} of ${batch.maxObjects}.`);
  for (const packet of richPackets) failures.push(...validateRichPacket(packet));
  return failures;
}

function objectSummary(richPackets) {
  return richPackets.map((packet) => ({
    Object: `\`${packet.object.name}\``,
    Type: packet.object.type,
    Tags: (packet.tags || []).join(', ') || 'none',
    'Upstream Loaders': packet.lineage?.upstream_loaders?.length || 0,
    'Downstream Consumers': packet.lineage?.downstream_consumers?.length || 0,
    Caveat: packet.rich_page.confidence_caveat,
  }));
}

function markdownPacket(packet) {
  return `# FDP-05 Tier 3 Rich Object Batch 01 Publish Review Packet

## Purpose

This packet prepares the first Tier 3 rich priority object-page batch.

It does not publish to Confluence and it does not clean up, archive, delete, or
move pages.

## Recommendation

${packet.recommendation}

## Promotion Strategy

| Signal | Value |
| --- | --- |
| Batch id | \`${packet.batch.id}\` |
| Database | \`${packet.batch.database}\` |
| Schema | \`${packet.batch.schema}\` |
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
| Rich object pages | ${packet.summary.rich_object_pages} |
| Total packet entries | ${packet.summary.total_planned_pages} |

## Rich Object Pages

${mdTable(packet.object_summary, ['Object', 'Type', 'Tags', 'Upstream Loaders', 'Downstream Consumers', 'Caveat'])}

## Evidence Boundary

These pages add richer support prose from bounded object evidence only. They do
not infer owner, data steward, SLA, lifecycle/status, live freshness, or formal
business definition. Missing facts remain explicitly marked as not surfaced in
metadata.

## Approval To Publish

Live publish requires explicit user approval for:

\`${pagePath([...canonicalRoot, batch.database, batch.schema])}\`

The publish command is:

\`\`\`powershell
npm run confluence:full:tier3:batch01:publish
\`\`\`

Do not run cleanup commands from this approval.

## Validation

${packet.validation.failures.length === 0 ? '- No packet validation failures.' : packet.validation.failures.map((failure) => `- ${failure}`).join('\n')}

## Source Artifacts

- Tier 2 source packet: \`${packet.source_artifacts.tier2_packet}\`
- Dry-run output root: \`${packet.source_artifacts.dry_run_output}\`
`;
}

async function main() {
  const tier2Packet = await readJson(sourceTier2PacketPath);
  const selectedThinPackets = (tier2Packet.leaf_pages || [])
    .filter((packet) => batch.requestedObjects.includes(packet.object?.name))
    .sort((left, right) => batch.requestedObjects.indexOf(left.object?.name) - batch.requestedObjects.indexOf(right.object?.name));
  const richPackets = selectedThinPackets.map(promotePacket);

  for (const packet of richPackets) {
    const slug = richSlug(packet.object);
    const evidenceHash = `sha256:${hashJson({ packet, batch })}`;
    const richPacket = {
      ...packet,
      evidence_hash: evidenceHash,
      source_evidence_hash: packet.evidence_hash,
    };
    // eslint-disable-next-line no-await-in-loop
    await writeText(path.join(dryRunRoot, `${slug}.evidence.json`), JSON.stringify(richPacket, null, 2));
    // eslint-disable-next-line no-await-in-loop
    await writeText(path.join(dryRunRoot, `${slug}.md`), richMarkdown(richPacket));
    Object.assign(packet, richPacket);
  }

  const failures = validationFailures(richPackets);
  const planned = plannedPages(richPackets);
  const generatedAt = new Date().toISOString();
  const packet = {
    packet_id: 'FDP-05',
    generated_at: generatedAt,
    batch,
    scope: {
      canonical_root: pagePath(canonicalRoot),
      deployment_tier: 'Tier 3 rich priority object pages',
      publish_mode: 'reviewed publish packet; no live publish performed',
      cleanup_mode: 'none; cleanup remains separate',
    },
    required_labels: requiredLabels,
    recommendation:
      failures.length === 0
        ? 'Ready for user review. Live Tier 3 rich-page publish requires explicit approval and assumes Tier 1 parent pages exist.'
        : 'Not ready for live publish approval until packet validation failures are resolved.',
    summary: {
      reference_pages: planned.filter((page) => page.kind === 'reference').length,
      rich_object_pages: richPackets.length,
      total_planned_pages: planned.length,
    },
    planned_pages: planned,
    object_summary: objectSummary(richPackets),
    leaf_pages: richPackets,
    source_artifacts: {
      tier2_packet: 'docs/confluence-full-database-catalog-deployment/FDP-04-tier2-thin-object-batch-01-publish-packet.json',
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
    delta_scope: tier2Packet.delta_scope || null,
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
