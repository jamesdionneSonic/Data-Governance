import fs from 'node:fs/promises';
import path from 'node:path';

const outputDir = path.resolve('docs/lineage-runtime-readbacks/adf-multi-factory');
const inputArgIndex = process.argv.indexOf('--input');
const inputPath =
  inputArgIndex >= 0
    ? path.resolve(process.argv[inputArgIndex + 1] || '')
    : await latestRunReadback();

async function latestRunReadback() {
  const entries = await fs.readdir(outputDir, { withFileTypes: true });
  const candidates = entries
    .filter((entry) => entry.isFile() && /^adf-mf-02-run-.*\.json$/i.test(entry.name))
    .map((entry) => path.join(outputDir, entry.name))
    .sort();
  if (!candidates.length) throw new Error(`No ADF-MF-02 run readback found in ${outputDir}.`);
  return candidates.at(-1);
}

function objectEntries(object = {}) {
  return Object.entries(object)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ');
}

function reviewStatus(result) {
  if (result.status !== 'succeeded') return 'blocked';
  if (result.pipeline_count > 0 && result.lineage_edge_count === 0) return 'review-needed';
  return 'accepted';
}

function reviewReason(result) {
  if (result.status !== 'succeeded') return 'Connector profile did not complete successfully.';
  if (result.pipeline_count > 0 && result.lineage_edge_count === 0) {
    return 'Pipeline inventory exists but no deterministic ADF lineage edges were surfaced.';
  }
  if (result.pipeline_count === 0 && result.lineage_edge_count === 0) {
    return 'No pipelines were surfaced, so zero lineage edges are expected.';
  }
  return 'Deterministic lineage edges were surfaced by the connector profile.';
}

function markdown(review) {
  const rows = review.connectors
    .map(
      (item) =>
        `| \`${item.connector_id}\` | ${item.status} | ${item.pipeline_count} | ${item.task_count} | ${item.dataset_count} | ${item.connection_count} | ${item.schedule_count} | ${item.lineage_edge_count} | ${item.review_status} | ${item.review_reason} |`
    )
    .join('\n');
  const roleRows = review.connectors
    .map(
      (item) =>
        `| \`${item.connector_id}\` | ${objectEntries(item.inventory_by_role) || 'none'} | ${objectEntries(item.lineage_by_type) || 'none'} |`
    )
    .join('\n');
  const sampleRows = review.connectors
    .flatMap((item) =>
      (item.lineage_edges_sample || []).slice(0, 10).map(
        (edge) =>
          `| \`${item.connector_id}\` | \`${edge.from || 'not surfaced'}\` | \`${edge.to || 'not surfaced'}\` | ${edge.relationship_type || 'lineage_edge'} | ${edge.confidence ?? 'not surfaced'} |`
      )
    )
    .join('\n');

  return `# ADF-MF-03 Lineage Edge Review

Generated: ${review.generated_at}

Source readback: \`${review.source_readback}\`

## Summary

| Signal | Value |
| --- | ---: |
| Connectors reviewed | ${review.summary.connector_count} |
| Accepted connectors | ${review.summary.accepted_count} |
| Review-needed connectors | ${review.summary.review_needed_count} |
| Blocked connectors | ${review.summary.blocked_count} |
| Pipelines | ${review.summary.pipeline_count} |
| Tasks/activities | ${review.summary.task_count} |
| Datasets | ${review.summary.dataset_count} |
| Connections | ${review.summary.connection_count} |
| Schedules/triggers | ${review.summary.schedule_count} |
| Lineage edges | ${review.summary.lineage_edge_count} |

## Connector Review

| Connector | Profile status | Pipelines | Tasks | Datasets | Connections | Schedules | Edges | Review | Reason |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
${rows || '| none |  |  |  |  |  |  |  |  |  |'}

## Object And Edge Types

| Connector | Inventory by role | Lineage by type |
| --- | --- | --- |
${roleRows || '| none |  |  |'}

## Sample Edges

| Connector | From | To | Type | Confidence |
| --- | --- | --- | --- | ---: |
${sampleRows || '| none |  |  |  |  |'}

## Gate Decision

${review.summary.blocked_count === 0 ? '- No connector is blocked by failed metadata profile.' : '- One or more connectors are blocked by failed metadata profile.'}
${review.summary.review_needed_count > 0 ? '- Review-needed connectors may proceed only after accepting the missing-edge caveat or re-running with deeper source evidence.' : '- No missing-edge caveats were detected for connectors with pipeline inventory.'}
- No ADF pipelines were started.
- No trigger, schedule, retry, linked-service, credential, or permission settings were changed.
- Raw source payload values, secrets, tokens, and connection strings are not included in this readback.
`;
}

async function main() {
  const profileReadback = JSON.parse(await fs.readFile(inputPath, 'utf8'));
  const connectors = (profileReadback.results || []).map((result) => ({
    connector_id: result.connector_id,
    run_id: result.run_id,
    status: result.status,
    pipeline_count: result.pipeline_count || 0,
    task_count: result.task_count || 0,
    dataset_count: result.dataset_count || 0,
    connection_count: result.connection_count || 0,
    schedule_count: result.schedule_count || 0,
    lineage_edge_count: result.lineage_edge_count || 0,
    inventory_by_role: result.inventory_by_role || {},
    lineage_by_type: result.lineage_by_type || {},
    lineage_edges_sample: result.lineage_edges_sample || [],
    review_status: reviewStatus(result),
    review_reason: reviewReason(result),
  }));
  const summary = {
    connector_count: connectors.length,
    accepted_count: connectors.filter((item) => item.review_status === 'accepted').length,
    review_needed_count: connectors.filter((item) => item.review_status === 'review-needed').length,
    blocked_count: connectors.filter((item) => item.review_status === 'blocked').length,
    pipeline_count: connectors.reduce((sum, item) => sum + item.pipeline_count, 0),
    task_count: connectors.reduce((sum, item) => sum + item.task_count, 0),
    dataset_count: connectors.reduce((sum, item) => sum + item.dataset_count, 0),
    connection_count: connectors.reduce((sum, item) => sum + item.connection_count, 0),
    schedule_count: connectors.reduce((sum, item) => sum + item.schedule_count, 0),
    lineage_edge_count: connectors.reduce((sum, item) => sum + item.lineage_edge_count, 0),
  };
  const review = {
    status: summary.blocked_count > 0 ? 'blocked' : 'complete',
    generated_at: new Date().toISOString(),
    source_readback: inputPath,
    summary,
    connectors,
  };
  const slug = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
  const jsonPath = path.join(outputDir, `adf-mf-03-lineage-edge-review-${slug}.json`);
  const markdownPath = path.join(outputDir, `adf-mf-03-lineage-edge-review-${slug}.md`);
  await fs.writeFile(jsonPath, `${JSON.stringify(review, null, 2)}\n`, 'utf8');
  await fs.writeFile(markdownPath, markdown(review), 'utf8');
  console.log(
    JSON.stringify(
      {
        status: review.status,
        summary,
        readback: markdownPath,
      },
      null,
      2
    )
  );
  if (review.status === 'blocked') process.exitCode = 1;
}

await main();
