import 'dotenv/config';

import fs from 'node:fs/promises';
import path from 'node:path';

import {
  planConnectorMetadataProfiling,
  runConnectorMetadataProfiling,
  testConnector,
} from '../src/services/connectorService.js';

const DEFAULT_CONNECTORS = [
  'azure-data-factory-adf-admin-d1',
  'azure-data-factory-adf-dw-caroffer-prod',
  'azure-data-factory-adf-dw-lightspeed-prod',
  'azure-data-factory-adf-dw-postgres-prod',
  'azure-data-factory-adf-googlesearch-d1',
  'azure-data-factory-adf-xtime-d1',
];

const args = new Map(
  process.argv
    .slice(2)
    .filter((arg) => arg.startsWith('--'))
    .map((arg) => {
      const [key, ...rest] = arg.slice(2).split('=');
      return [key, rest.length ? rest.join('=') : true];
    })
);

const outputDir = path.resolve(
  args.get('output-dir') || 'docs/lineage-runtime-readbacks/adf-multi-factory'
);
const mode = String(args.get('mode') || 'plan').toLowerCase();
const connectorIds = String(args.get('connectors') || DEFAULT_CONNECTORS.join(','))
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);
const lookbackDays = Number(args.get('lookback-days') || 7);
const actor = {
  id: 'system',
  name: 'System',
  role: 'admin',
  roles: ['Admin'],
};

function timestampSlug() {
  return new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
}

function sanitizeError(error = {}) {
  return {
    code: error.code || error.status || 'ERROR',
    message: error.message || String(error),
    phase: error.phase || error.details?.phase || null,
    remediation: error.remediation || null,
  };
}

function summarizeRun(run) {
  const summary = run.summary || run.profile?.profile?.summary || {};
  const profile = run.profile?.profile || {};
  const inventoryByRole = {};
  for (const item of profile.inventory || []) {
    const role = item.role || item.object_type || 'unknown';
    inventoryByRole[role] = (inventoryByRole[role] || 0) + 1;
  }
  const lineageByType = {};
  for (const edge of profile.lineage_edges || []) {
    const type = edge.relationship_type || 'depends_on';
    lineageByType[type] = (lineageByType[type] || 0) + 1;
  }
  return {
    connector_id: run.connector_id,
    run_id: run.id,
    status: run.status,
    mode: run.mode,
    started_at: run.started_at,
    completed_at: run.completed_at,
    artifact_path: run.artifact?.path || run.artifact?.file || null,
    inventory_count: summary.inventory_count || 0,
    pipeline_count: summary.pipeline_count || 0,
    task_count: summary.task_count || 0,
    dataset_count: summary.dataset_count || 0,
    connection_count: summary.connection_count || 0,
    schedule_count: summary.schedule_count || 0,
    lineage_edge_count: summary.lineage_edge_count || 0,
    warning_count: summary.warning_count || 0,
    error_count: summary.error_count || 0,
    raw_data_captured: summary.raw_data_captured === true,
    secret_exposed: summary.secret_exposed === true,
    inventory_by_role: inventoryByRole,
    lineage_by_type: lineageByType,
    lineage_edges_sample: (profile.lineage_edges || []).slice(0, 25).map((edge) => ({
      from: edge.from || null,
      to: edge.to || null,
      relationship_type: edge.relationship_type || 'depends_on',
      confidence: edge.confidence,
    })),
    errors: (run.errors || []).map(sanitizeError),
    warnings: (run.warnings || []).slice(0, 20),
  };
}

function resultSucceeded(item) {
  return ['succeeded', 'planned'].includes(String(item.status || '').toLowerCase());
}

function summarizePlan(connectorId, plan) {
  return {
    connector_id: connectorId,
    status: 'planned',
    requires_live_call: plan.requires_live_call === true,
    stream_count: plan.streams?.length || 0,
    streams: (plan.streams || []).map((stream) => ({
      stream: stream.stream,
      canonical_type: stream.canonical_type,
      method: stream.method,
      expected_metadata: stream.expected_metadata || [],
    })),
    safety: plan.safety || {},
  };
}

function summarizeTest(test) {
  return {
    connector_id: test.connector_id,
    run_id: test.id,
    status: test.status,
    mode: test.mode,
    started_at: test.started_at,
    completed_at: test.completed_at,
    credential_mode: test.summary?.credential_mode || null,
    live_connection_valid: test.summary?.live_connection_valid === true,
    metadata_discovery_valid: test.summary?.metadata_discovery_valid !== false,
    phase: test.summary?.phase || null,
    raw_data_captured: test.summary?.raw_data_captured === true,
    secret_exposed: test.summary?.secret_exposed === true,
    errors: (test.errors || []).map(sanitizeError),
    warnings: (test.warnings || []).slice(0, 20),
  };
}

function markdown(result) {
  const rows = result.results
    .map((item) => {
      const counts = [
        item.inventory_count !== undefined && `inventory ${item.inventory_count}`,
        item.pipeline_count !== undefined && `pipelines ${item.pipeline_count}`,
        item.task_count !== undefined && `tasks ${item.task_count}`,
        item.dataset_count !== undefined && `datasets ${item.dataset_count}`,
        item.lineage_edge_count !== undefined && `edges ${item.lineage_edge_count}`,
        item.stream_count !== undefined && `streams ${item.stream_count}`,
      ]
        .filter(Boolean)
        .join(', ');
      return `| \`${item.connector_id}\` | ${item.status} | ${item.mode || 'metadata-profile-plan'} | ${counts || 'n/a'} | ${item.errors?.map((error) => error.message).join('; ') || 'none'} |`;
    })
    .join('\n');

  return `# ADF Metadata Profile Batch Readback

Generated: ${result.generated_at}

Mode: \`${result.mode}\`

## Summary

| Signal | Value |
| --- | ---: |
| Connectors requested | ${result.connector_count} |
| Succeeded/planned | ${result.success_count} |
| Failed | ${result.failure_count} |
| Raw data captured | ${result.raw_data_captured ? 'yes' : 'no'} |
| Secret exposed | ${result.secret_exposed ? 'yes' : 'no'} |

## Connector Results

| Connector | Status | Mode | Counts | Errors |
| --- | --- | --- | --- | --- |
${rows || '| none |  |  |  |  |'}

## Safety

- Metadata-only ADF connector runtime path.
- No ADF pipelines were started.
- No trigger, schedule, retry, linked-service, credential, or permission settings were changed.
- Raw source payload values, secrets, tokens, and connection strings are not included in this readback.
`;
}

async function runOne(connectorId) {
  const options = {
    dry_run: mode !== 'run',
    lookback_days: lookbackDays,
  };
  if (mode === 'plan') {
    const plan = await planConnectorMetadataProfiling(connectorId, options, actor);
    return summarizePlan(connectorId, plan);
  }
  if (mode === 'test') {
    const test = await testConnector(connectorId, options, actor);
    return summarizeTest(test);
  }
  if (mode === 'run') {
    const run = await runConnectorMetadataProfiling(
      connectorId,
      {
        ...options,
        dry_run: false,
        execution_mode: 'live',
      },
      actor
    );
    return summarizeRun(run);
  }
  throw new Error(`Unsupported mode '${mode}'. Use plan, test, or run.`);
}

async function main() {
  const startedAt = new Date().toISOString();
  const results = [];
  for (const connectorId of connectorIds) {
    try {
      // eslint-disable-next-line no-await-in-loop
      results.push(await runOne(connectorId));
    } catch (err) {
      results.push({
        connector_id: connectorId,
        status: 'failed',
        mode,
        errors: [sanitizeError(err)],
        warnings: [],
        raw_data_captured: false,
        secret_exposed: false,
      });
    }
  }

  const result = {
    status: results.some((item) => item.status === 'failed') ? 'partial_failure' : 'succeeded',
    generated_at: new Date().toISOString(),
    started_at: startedAt,
    mode,
    connector_count: connectorIds.length,
    success_count: results.filter(resultSucceeded).length,
    failure_count: results.filter((item) => !resultSucceeded(item)).length,
    raw_data_captured: results.some((item) => item.raw_data_captured === true),
    secret_exposed: results.some((item) => item.secret_exposed === true),
    lookback_days: lookbackDays,
    connectors: connectorIds,
    results,
  };

  await fs.mkdir(outputDir, { recursive: true });
  const base = `adf-mf-02-${mode}-${timestampSlug()}`;
  const jsonPath = path.join(outputDir, `${base}.json`);
  const markdownPath = path.join(outputDir, `${base}.md`);
  await fs.writeFile(jsonPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
  await fs.writeFile(markdownPath, markdown(result), 'utf8');
  console.log(
    JSON.stringify(
      {
        status: result.status,
        mode,
        connector_count: result.connector_count,
        success_count: result.success_count,
        failure_count: result.failure_count,
        readback: markdownPath,
      },
      null,
      2
    )
  );
  if (result.failure_count > 0) process.exitCode = 1;
}

await main();
