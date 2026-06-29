import 'dotenv/config';

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import {
  AWS_SOURCE_FAMILY,
  defaultAwsLineageStreams,
  isAwsLineageConnector,
  normalizeAwsLineagePackage,
  renderAwsLineageReadback,
} from '../engines/connectors/aws/index.js';
import {
  buildDeltaManifest,
  normalizePath,
  writeDeltaOutputs,
} from '../engines/connectors/metadata-delta/index.js';
import { listConnectors, runConnector } from '../src/services/connectorService.js';

const DEFAULT_CATALOG_REPO = '../Sonic-data-lineage';
const DEFAULT_OUTPUT_ROOT = './docs/lineage-runtime-readbacks/aws-lineage';

const actor = {
  id: 'system',
  name: 'System',
  role: 'admin',
  roles: ['Admin'],
};

function args() {
  return process.argv.slice(2);
}

function argValue(name, fallback = '') {
  const prefix = `${name}=`;
  const inline = args().find((arg) => arg.startsWith(prefix));
  if (inline) return inline.slice(prefix.length);
  const index = args().indexOf(name);
  if (index >= 0) return args()[index + 1] || fallback;
  return fallback;
}

function argValues(name) {
  const prefix = `${name}=`;
  const values = [];
  const argv = args();
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg.startsWith(prefix)) values.push(arg.slice(prefix.length));
    else if (arg === name && argv[index + 1]) {
      values.push(argv[index + 1]);
      index += 1;
    }
  }
  return values.filter(Boolean);
}

function hasFlag(name) {
  return args().includes(name);
}

function normalizeMode() {
  if (hasFlag('--full-refresh')) return 'full_refresh';
  return hasFlag('--write') ? 'incremental' : 'plan_only';
}

function safeName(value) {
  return String(value || 'aws')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function selectedConnectors() {
  const connectorIds = new Set(argValues('--connector-id'));
  const accountIds = new Set(argValues('--account-id'));
  return listConnectors({ cloud: 'aws' }, actor)
    .filter(isAwsLineageConnector)
    .filter((connector) => connector.status !== 'disabled')
    .filter((connector) => !connectorIds.size || connectorIds.has(connector.id))
    .filter(
      (connector) =>
        !accountIds.size ||
        accountIds.has(connector.config?.aws_account_id) ||
        accountIds.has(connector.config?.account_id)
    );
}

function groupConnectors(connectors) {
  const groups = new Map();
  for (const connector of connectors) {
    const accountId =
      connector.config?.aws_account_id || connector.config?.account_id || 'unknown-account';
    const region = connector.config?.region || connector.config?.aws_region || 'us-east-1';
    const key = `${accountId}:${region}`;
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        account_id: accountId,
        account_name: connector.config?.account_name || accountId,
        region,
        connectors: [],
      });
    }
    groups.get(key).connectors.push(connector);
  }
  return [...groups.values()].sort((left, right) => left.key.localeCompare(right.key));
}

function streamsForConnector(connector) {
  const override = argValue('--streams');
  if (override)
    return override
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  return defaultAwsLineageStreams(connector.type);
}

async function runConnectorForLineage(connector) {
  const streams = streamsForConnector(connector);
  const fullMetadata = hasFlag('--full-metadata') || hasFlag('--all');
  const maxSampleItems = Number(
    argValue('--max-sample-items', process.env.AWS_METADATA_SAMPLE_LIMIT || '10')
  );
  const run = await runConnector(
    connector.id,
    {
      dry_run: false,
      fail_fast: false,
      streams,
      max_sample_items: maxSampleItems,
      full_metadata: fullMetadata,
    },
    actor
  );
  return {
    connector,
    run,
    events: run.extraction?.events || [],
    streams,
    full_metadata: fullMetadata,
    status: run.status,
  };
}

async function writePackageOutputs({ outputDir, basename, lineagePackage, manifest }) {
  await mkdir(outputDir, { recursive: true });
  const packagePath = path.join(outputDir, `${basename}-package.json`);
  const readbackPath = path.join(outputDir, `${basename}-readback.md`);
  await writeFile(packagePath, `${JSON.stringify(lineagePackage, null, 2)}\n`, 'utf8');
  await writeFile(readbackPath, renderAwsLineageReadback(lineagePackage, manifest), 'utf8');
  return {
    package_path: normalizePath(packagePath),
    readback_path: normalizePath(readbackPath),
  };
}

async function processGroup(group, { generatedAt, catalogRoot, outputDir, mode }) {
  const connectorRuns = [];
  const failures = [];
  for (const connector of group.connectors) {
    try {
      connectorRuns.push(await runConnectorForLineage(connector));
    } catch (error) {
      failures.push({
        connector_id: connector.id,
        connector_type: connector.type,
        message: error.message,
        code: error.code || null,
        details: error.details || null,
      });
    }
  }

  const lineageConnectorId = `aws-account-${safeName(group.account_id)}-${safeName(group.region)}`;
  const sourceScope = `aws-account:${group.account_id}:${group.region}`;
  const lineagePackage = normalizeAwsLineagePackage({
    connectorRuns,
    generatedAt,
    lineageConnectorId,
    sourceScope,
  });
  lineagePackage.failures = failures;

  const manifest = await buildDeltaManifest({
    catalogRoot,
    connectorId: lineageConnectorId,
    sourceFamily: AWS_SOURCE_FAMILY,
    sourceScope,
    currentObjects: lineagePackage.metadata_objects,
    mode,
    fullRefreshReason: argValue('--full-refresh-reason'),
    generatedAt,
    scope: {
      connector_id: lineageConnectorId,
      source_system: lineageConnectorId,
      source_family: AWS_SOURCE_FAMILY,
    },
  });

  const stamp = generatedAt.replace(/[:.]/g, '').replace(/-/g, '').slice(0, 15);
  const basename = `${stamp}-${lineageConnectorId}-aws-lineage`;
  const packageOutputs = await writePackageOutputs({
    outputDir,
    basename,
    lineagePackage,
    manifest,
  });
  const deltaOutputs = await writeDeltaOutputs({
    manifest,
    outputDir,
    basename: `${basename}-delta`,
  });

  return {
    lineage_connector_id: lineageConnectorId,
    source_scope: sourceScope,
    account_id: group.account_id,
    account_name: group.account_name,
    region: group.region,
    connector_count: group.connectors.length,
    succeeded_connector_count: connectorRuns.length,
    failed_connector_count: failures.length,
    failures,
    package_outputs: packageOutputs,
    delta_outputs: deltaOutputs,
    summary: lineagePackage.summary,
    delta_counts: manifest.counts,
  };
}

async function main() {
  const generatedAt = new Date().toISOString();
  const catalogRoot = path.resolve(
    argValue('--catalog-repo', process.env.CATALOG_REPO_PATH || DEFAULT_CATALOG_REPO)
  );
  const outputDir = path.resolve(argValue('--output-dir', DEFAULT_OUTPUT_ROOT));
  const mode = normalizeMode();
  const fullMetadata = hasFlag('--full-metadata') || hasFlag('--all');
  const connectors = selectedConnectors();
  if (!connectors.length) {
    throw new Error('No active AWS lineage connectors matched the requested filter.');
  }

  const groups = groupConnectors(connectors);
  const results = [];
  for (const group of groups) {
    results.push(await processGroup(group, { generatedAt, catalogRoot, outputDir, mode }));
  }

  console.log(
    JSON.stringify(
      {
        status: results.some((item) => item.failed_connector_count)
          ? 'partial_success'
          : 'succeeded',
        mode,
        generated_at: generatedAt,
        catalog_repo: normalizePath(catalogRoot),
        output_dir: normalizePath(outputDir),
        full_metadata: fullMetadata,
        group_count: results.length,
        connector_count: connectors.length,
        results,
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
