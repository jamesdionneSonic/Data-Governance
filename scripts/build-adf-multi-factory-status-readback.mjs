import fs from 'node:fs/promises';
import path from 'node:path';

const outputDir = path.resolve('docs/lineage-runtime-readbacks/adf-multi-factory');
const supportManifestPath = path.resolve('tmp/adf-multi-factory-support-documentation-manifest.json');
const inventoryOnlyConnectors = new Set(['azure-data-factory-adf-dw-postgres-prod']);
const publication = {
  confluence_root_page_id: '2322792450',
  confluence_page_count: 403,
  runtime_package_name: 'sonic-data-lineage-runtime',
  runtime_package_version: '2026.6.29-1',
  runtime_content_hash: '1a06a3fd1e33fa0c40811eb875a5c3ddc77c8c7a64ad3b38f2db6d980dcfda78',
  app_repo_commit: '25eeab402',
  lineage_repo_commit: 'e4cfaeb1e2',
};
const inputArgIndex = process.argv.indexOf('--inputs');
const inputPaths =
  inputArgIndex >= 0
    ? String(process.argv[inputArgIndex + 1] || '')
        .split(',')
        .map((item) => path.resolve(item.trim()))
        .filter(Boolean)
    : await latestSuccessfulRunReadbacks();

async function latestSuccessfulRunReadbacks() {
  const entries = await fs.readdir(outputDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && /^adf-mf-02-run-.*\.json$/i.test(entry.name))
    .map((entry) => path.join(outputDir, entry.name))
    .sort();
}

function sum(results, field) {
  return results.reduce((total, item) => total + Number(item[field] || 0), 0);
}

function connectorRows(connectors) {
  return connectors
    .map(
      (item) =>
        `| \`${item.connector_id}\` | ${item.status} | ${item.pipeline_count} | ${item.task_count} | ${item.dataset_count} | ${item.connection_count} | ${item.schedule_count} | ${item.lineage_edge_count} | ${item.review_status} |`
    )
    .join('\n');
}

function reviewStatus(result) {
  if (result.status !== 'succeeded') return 'blocked';
  if (
    inventoryOnlyConnectors.has(result.connector_id) &&
    result.pipeline_count > 0 &&
    result.lineage_edge_count === 0
  ) {
    return 'inventory-only';
  }
  if (result.pipeline_count > 0 && result.lineage_edge_count === 0) return 'review-needed';
  return 'accepted';
}

function markdown(readback) {
  const supportStatus = readback.support_documentation?.generated
    ? `complete | ${readback.support_documentation.page_count} local support pages generated under \`${readback.support_documentation.docs_root}\``
    : 'next | Requires support markdown generation from the new ADF profile artifacts';
  return `# ADF Multi-Factory Work Package Status

Generated: ${readback.generated_at}

## Summary

| Signal | Value |
| --- | ---: |
| Source batch readbacks | ${readback.source_readbacks.length} |
| Connectors profiled | ${readback.summary.connector_count} |
| Accepted connectors | ${readback.summary.accepted_count} |
| Review-needed connectors | ${readback.summary.review_needed_count} |
| Inventory-only connectors | ${readback.summary.inventory_only_count} |
| Blocked connectors | ${readback.summary.blocked_count} |
| Pipelines | ${readback.summary.pipeline_count} |
| Tasks/activities | ${readback.summary.task_count} |
| Datasets | ${readback.summary.dataset_count} |
| Connections | ${readback.summary.connection_count} |
| Schedules/triggers | ${readback.summary.schedule_count} |
| Lineage edges | ${readback.summary.lineage_edge_count} |
| Raw data captured | ${readback.summary.raw_data_captured ? 'yes' : 'no'} |
| Secret exposed | ${readback.summary.secret_exposed ? 'yes' : 'no'} |

## Work Package Status

| Package | Status | Evidence |
| --- | --- | --- |
| ADF-MF-01 Freeze Scope And Connector Readiness | complete | 16 ADF connectors registered; 15 newly registered connectors selected for ingestion; baseline marketing connector left out of new-factory backlog |
| ADF-MF-02 Low-Risk Metadata Ingestion Pilot | complete | Low-risk, legacy, and no-active-trigger connectors profiled through shared runtime |
| ADF-MF-03 Lineage Extraction And Edge Review | complete | Edge review generated for every completed batch |
| ADF-MF-04 Active-Trigger Factory Ingestion | complete | Active-trigger factories profiled one connector or small batch at a time |
| ADF-MF-05 Local Support Documentation Generation | ${supportStatus} |
| ADF-MF-06 DevOps Runtime Package And Catalog Export | complete | ${readback.publication.runtime_package_name} ${readback.publication.runtime_package_version} published; DevOps commit ${readback.publication.lineage_repo_commit} |
| ADF-MF-07 Confluence Dry Run | complete | Confluence scope reviewed for the ADF support root; ${readback.publication.confluence_page_count} pages in published scope |
| ADF-MF-08 Live Publish | complete | Confluence root page ${readback.publication.confluence_root_page_id} published; final missing-only pass had creates 0 |

## Publication

| Signal | Value |
| --- | --- |
| Confluence root page | ${readback.publication.confluence_root_page_id} |
| Confluence pages | ${readback.publication.confluence_page_count} |
| Runtime package | ${readback.publication.runtime_package_name} ${readback.publication.runtime_package_version} |
| Runtime content hash | \`${readback.publication.runtime_content_hash}\` |
| App repo commit | ${readback.publication.app_repo_commit} |
| Machine-readable repo commit | ${readback.publication.lineage_repo_commit} |

## Connector Results

| Connector | Status | Pipelines | Tasks | Datasets | Connections | Schedules | Edges | Review |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
${connectorRows(readback.connectors)}

## Safety

- No ADF pipelines were started.
- No trigger, schedule, retry, linked-service, credential, or permission settings were changed.
- Metadata was read through the saved connector runtime.
- \`azure-data-factory-adf-dw-postgres-prod\` is closed as inventory-only because it has one surfaced pipeline and zero usable deterministic lineage edges.
- Raw source payload values, secrets, tokens, and connection strings are not included in this readback.
`;
}

async function main() {
  const sourceReadbacks = [];
  const connectors = [];
  for (const inputPath of inputPaths) {
    // eslint-disable-next-line no-await-in-loop
    const parsed = JSON.parse(await fs.readFile(inputPath, 'utf8'));
    if (parsed.mode !== 'run') continue;
    sourceReadbacks.push(inputPath);
    for (const result of parsed.results || []) {
      connectors.push({
        connector_id: result.connector_id,
        run_id: result.run_id,
        status: result.status,
        pipeline_count: result.pipeline_count || 0,
        task_count: result.task_count || 0,
        dataset_count: result.dataset_count || 0,
        connection_count: result.connection_count || 0,
        schedule_count: result.schedule_count || 0,
        lineage_edge_count: result.lineage_edge_count || 0,
        raw_data_captured: result.raw_data_captured === true,
        secret_exposed: result.secret_exposed === true,
        review_status: reviewStatus(result),
      });
    }
  }
  const byConnector = new Map();
  for (const connector of connectors) byConnector.set(connector.connector_id, connector);
  const uniqueConnectors = [...byConnector.values()].sort((left, right) =>
    left.connector_id.localeCompare(right.connector_id)
  );
  const readback = {
    status: uniqueConnectors.some((item) => item.review_status === 'blocked')
      ? 'blocked'
      : 'complete',
    generated_at: new Date().toISOString(),
    source_readbacks: sourceReadbacks,
    summary: {
      connector_count: uniqueConnectors.length,
      accepted_count: uniqueConnectors.filter((item) => item.review_status === 'accepted').length,
      review_needed_count: uniqueConnectors.filter((item) => item.review_status === 'review-needed')
        .length,
      inventory_only_count: uniqueConnectors.filter((item) => item.review_status === 'inventory-only')
        .length,
      blocked_count: uniqueConnectors.filter((item) => item.review_status === 'blocked').length,
      pipeline_count: sum(uniqueConnectors, 'pipeline_count'),
      task_count: sum(uniqueConnectors, 'task_count'),
      dataset_count: sum(uniqueConnectors, 'dataset_count'),
      connection_count: sum(uniqueConnectors, 'connection_count'),
      schedule_count: sum(uniqueConnectors, 'schedule_count'),
      lineage_edge_count: sum(uniqueConnectors, 'lineage_edge_count'),
      raw_data_captured: uniqueConnectors.some((item) => item.raw_data_captured),
      secret_exposed: uniqueConnectors.some((item) => item.secret_exposed),
    },
    publication,
    connectors: uniqueConnectors,
  };
  try {
    const supportManifest = JSON.parse(await fs.readFile(supportManifestPath, 'utf8'));
    readback.support_documentation = {
      generated: true,
      connector_count: supportManifest.connector_count || 0,
      page_count: supportManifest.page_count || 0,
      docs_root: 'docs/adf-support-documentation-multi-factory',
      manifest: path.relative(process.cwd(), supportManifestPath).replaceAll('\\', '/'),
    };
  } catch {
    readback.support_documentation = {
      generated: false,
    };
  }
  const slug = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
  const jsonPath = path.join(outputDir, `adf-mf-status-${slug}.json`);
  const markdownPath = path.join(outputDir, `adf-mf-status-${slug}.md`);
  await fs.writeFile(jsonPath, `${JSON.stringify(readback, null, 2)}\n`, 'utf8');
  await fs.writeFile(markdownPath, markdown(readback), 'utf8');
  console.log(
    JSON.stringify(
      {
        status: readback.status,
        summary: readback.summary,
        readback: markdownPath,
      },
      null,
      2
    )
  );
  if (readback.status === 'blocked') process.exitCode = 1;
}

await main();
