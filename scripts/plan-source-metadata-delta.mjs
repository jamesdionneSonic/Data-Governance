import 'dotenv/config';

import path from 'node:path';

import {
  buildDeltaManifest,
  normalizePath,
  readJson,
  writeDeltaOutputs,
} from '../engines/connectors/metadata-delta/index.js';

const DEFAULT_CATALOG_REPO = '../Sonic-data-lineage';
const DEFAULT_OUTPUT_ROOT = './docs/lineage-runtime-readbacks/source-metadata-delta';

function argValue(name, fallback = '') {
  const prefix = `${name}=`;
  const args = process.argv.slice(2);
  const inline = args.find((arg) => arg.startsWith(prefix));
  if (inline) return inline.slice(prefix.length);
  const index = args.indexOf(name);
  if (index >= 0) return args[index + 1] || fallback;
  return fallback;
}

function hasFlag(name) {
  return process.argv.includes(name);
}

function normalizeMode(value) {
  if (hasFlag('--full-refresh')) return 'full_refresh';
  if (value === 'full_refresh' || value === 'incremental' || value === 'plan_only') return value;
  return hasFlag('--write') ? 'incremental' : 'plan_only';
}

function currentObjectsFromPayload(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.objects)) return payload.objects;
  if (Array.isArray(payload?.metadata_objects)) return payload.metadata_objects;
  if (Array.isArray(payload?.inventory)) return payload.inventory;
  throw new Error('Current metadata JSON must be an array or contain objects, metadata_objects, or inventory.');
}

async function main() {
  const currentMetadataPath = argValue('--current-metadata');
  if (!currentMetadataPath) {
    throw new Error('Pass --current-metadata <json-file> containing current normalized metadata objects.');
  }

  const generatedAt = new Date().toISOString();
  const catalogRoot = path.resolve(argValue('--catalog-repo', process.env.CATALOG_REPO_PATH || DEFAULT_CATALOG_REPO));
  const outputDir = path.resolve(argValue('--output-dir', DEFAULT_OUTPUT_ROOT));
  const mode = normalizeMode(argValue('--mode', 'plan_only'));
  const connectorId = argValue('--connector-id');
  const sourceFamily = argValue('--source-family');
  const sourceScope = argValue('--source-scope', connectorId || sourceFamily || 'unknown');
  if (!connectorId) throw new Error('Pass --connector-id <connector-id>.');
  if (!sourceFamily) throw new Error('Pass --source-family <source-family>.');

  const payload = await readJson(path.resolve(currentMetadataPath), null);
  if (!payload) throw new Error(`Could not read current metadata JSON: ${currentMetadataPath}`);
  const currentObjects = currentObjectsFromPayload(payload);
  const manifest = await buildDeltaManifest({
    catalogRoot,
    connectorId,
    sourceFamily,
    sourceScope,
    currentObjects,
    mode,
    fullRefreshReason: argValue('--full-refresh-reason'),
    generatedAt,
    scope: {
      connector_id: connectorId,
      source_family: sourceFamily,
      source_system: argValue('--source-system', connectorId),
      server: argValue('--server'),
      database: argValue('--database'),
      databases: argValue('--databases')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    },
  });
  const basename = `${generatedAt.replace(/[:.]/g, '').replace(/-/g, '').slice(0, 15)}-${connectorId}-metadata-delta`;
  const outputs = await writeDeltaOutputs({ manifest, outputDir, basename });
  console.log(
    JSON.stringify(
      {
        ...outputs,
        mode: manifest.mode,
        connector_id: manifest.connector_id,
        source_family: manifest.source_family,
        source_scope: manifest.source_scope,
        counts: manifest.counts,
        changed_object_ids: manifest.changed_object_ids,
        catalog_repo: normalizePath(catalogRoot),
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
