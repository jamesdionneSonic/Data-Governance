import fs from 'node:fs/promises';
import path from 'node:path';

const rovoRoot = path.resolve('data/confluence/rovo-ai-retrieval-dry-run');
const packetRoot = path.resolve('docs/confluence-full-database-catalog-deployment');
const packetSlug = 'FDP-06-rovo-ai-retrieval-publish-packet';
const rootPath = ['Sonic Data Lineage', 'AI Retrieval Artifacts'];
const requiredLabels = ['human-lineage-catalog', 'rovo-ai-retrieval', 'ai-retrieval-artifact'];

function pagePath(values) {
  return values.filter(Boolean).join(' / ');
}

async function readJson(file) {
  return JSON.parse(await fs.readFile(file, 'utf8'));
}

async function writeText(file, value) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, value, 'utf8');
}

function snippetsForPage(page) {
  const common = ['Technical Evidence'];
  if (page.page_type === 'rovo-start-here') return ['Lookup Order', 'Safety Rules'];
  if (page.page_type === 'rovo-object-locator') return ['canonical_id', 'quick_context_page', ...common];
  if (page.page_type === 'rovo-database-context') return ['VendorData', 'Known Gaps', ...common];
  if (page.page_type === 'rovo-object-summary-context') return ['DimVehicle', 'FactOpportunity', ...common];
  if (page.page_type === 'rovo-upstream-context') return ['Upstream Sources', 'FactOpportunity', ...common];
  if (page.page_type === 'rovo-downstream-context') return ['Downstream Consumers', 'FactOpportunity', ...common];
  if (page.page_type === 'rovo-ambiguity-context') return ['dimvehicle', 'factopportunity', ...common];
  if (page.page_type === 'rovo-evaluation-prompts') return ['Forbidden Invented Facts', 'VendorData', ...common];
  return common;
}

function markdownPacket(packet) {
  return `# FDP-06 Rovo AI Retrieval Publish Packet

## Purpose

This packet prepares the reviewed Rovo AI retrieval artifacts for live
Confluence publication under the separated AI Retrieval Artifacts branch.

It does not publish human Database Catalog pages and it does not clean up,
archive, delete, or move pages.

## Recommendation

${packet.validation.status === 'passed' ? 'Ready for live publish.' : 'Not ready for live publish.'}

## Scope

| Signal | Value |
| --- | --- |
| Root path | \`${packet.scope.root_path}\` |
| Publish mode | \`${packet.scope.publish_mode}\` |
| Cleanup mode | \`${packet.scope.cleanup_mode}\` |
| Required labels | ${packet.required_labels.map((label) => `\`${label}\``).join(', ')} |
| Validation status | \`${packet.validation.status}\` |

## Planned Pages

| Signal | Value |
| --- | --- |
| Navigation pages | ${packet.summary.navigation_pages} |
| Rovo artifact pages | ${packet.summary.artifact_pages} |
| Total planned entries | ${packet.summary.total_planned_pages} |

## Artifact Pages

| Page | Type | Path |
| --- | --- | --- |
${packet.planned_pages
  .filter((page) => page.kind === 'leaf')
  .map((page) => `| \`${page.title}\` | ${page.page_type} | \`${pagePath(page.treePath)}\` |`)
  .join('\n')}

## Validation

${packet.validation.failures.length === 0 ? '- No packet validation failures.' : packet.validation.failures.map((failure) => `- ${failure}`).join('\n')}

## Source Artifacts

- Rovo dry-run manifest: \`data/confluence/rovo-ai-retrieval-dry-run/manifest.json\`
- Rovo dry-run output root: \`data/confluence/rovo-ai-retrieval-dry-run\`
`;
}

async function main() {
  const manifest = await readJson(path.join(rovoRoot, 'manifest.json'));
  const failures = [];
  if (manifest.acceptance?.status !== 'passed') failures.push('Rovo dry-run manifest acceptance did not pass.');
  if (!Array.isArray(manifest.pages) || manifest.pages.length === 0) failures.push('Rovo dry-run manifest has no pages.');

  const planned = [
    {
      kind: 'navigation',
      title: 'AI Retrieval Artifacts',
      treePath: rootPath,
      page_type: 'navigation',
      evidence_hash: null,
      evidence_file: null,
      markdown_file: null,
      labels: requiredLabels,
      snippets: ['Reviewed Catalog Children', 'Rovo Start Here'],
    },
  ];

  for (const page of manifest.pages || []) {
    // eslint-disable-next-line no-await-in-loop
    const evidence = await readJson(path.join(rovoRoot, page.evidenceFile));
    const treePath = evidence.page_tree_path || page.page_tree_path;
    if (pagePath(treePath).includes('Database Catalog')) {
      failures.push(`Rovo artifact is under forbidden Database Catalog branch: ${pagePath(treePath)}`);
    }
    if (!pagePath(treePath).startsWith(pagePath(rootPath))) {
      failures.push(`Rovo artifact is outside AI Retrieval Artifacts root: ${pagePath(treePath)}`);
    }
    planned.push({
      kind: 'leaf',
      title: page.page_title,
      treePath,
      page_type: page.page_type,
      evidence_hash: page.evidence_hash,
      evidence_file: page.evidenceFile,
      markdown_file: page.markdownFile,
      labels: requiredLabels,
      snippets: snippetsForPage(page),
    });
  }

  const packet = {
    generated_at: new Date().toISOString(),
    scope: {
      root_path: pagePath(rootPath),
      deployment_tier: 'FDP-06 Rovo AI retrieval artifacts',
      publish_mode: 'reviewed publish packet; no live publish performed by builder',
      cleanup_mode: 'none; cleanup remains separate',
    },
    required_labels: requiredLabels,
    validation: {
      status: failures.length === 0 ? 'passed' : 'failed',
      failures,
    },
    summary: {
      navigation_pages: planned.filter((page) => page.kind === 'navigation').length,
      artifact_pages: planned.filter((page) => page.kind === 'leaf').length,
      total_planned_pages: planned.length,
    },
    planned_pages: planned,
    source_artifacts: {
      rovo_dry_run_manifest: 'data/confluence/rovo-ai-retrieval-dry-run/manifest.json',
      rovo_dry_run_output: 'data/confluence/rovo-ai-retrieval-dry-run',
    },
    output_artifacts: {
      packet_json: `docs/confluence-full-database-catalog-deployment/${packetSlug}.json`,
      packet_markdown: `docs/confluence-full-database-catalog-deployment/${packetSlug}.md`,
    },
  };

  await writeText(path.join(packetRoot, `${packetSlug}.json`), `${JSON.stringify(packet, null, 2)}\n`);
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
