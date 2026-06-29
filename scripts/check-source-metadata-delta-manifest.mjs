import { readJson } from '../engines/connectors/metadata-delta/index.js';

function argValue(name, fallback = '') {
  const prefix = `${name}=`;
  const args = process.argv.slice(2);
  const inline = args.find((arg) => arg.startsWith(prefix));
  if (inline) return inline.slice(prefix.length);
  const index = args.indexOf(name);
  if (index >= 0) return args[index + 1] || fallback;
  return fallback;
}

function fail(message) {
  throw new Error(message);
}

function countObjects(objects, status) {
  return objects.filter((object) => object.status === status).length;
}

async function main() {
  const manifestPath = argValue('--manifest');
  if (!manifestPath) fail('Pass --manifest <source-metadata-delta-manifest.json>.');
  const manifest = await readJson(manifestPath, null);
  if (!manifest) fail(`Could not read delta manifest: ${manifestPath}`);
  if (manifest.schema_version !== '1.0') fail(`Unsupported schema_version: ${manifest.schema_version}`);
  if (!manifest.connector_id) fail('Manifest is missing connector_id.');
  if (!manifest.source_family) fail('Manifest is missing source_family.');
  if (!manifest.source_scope) fail('Manifest is missing source_scope.');
  if (!manifest.baseline_registry_path) fail('Manifest is missing baseline_registry_path.');
  if (!['plan_only', 'incremental', 'full_refresh'].includes(manifest.mode)) {
    fail(`Unsupported mode: ${manifest.mode}`);
  }
  if (manifest.mode === 'full_refresh' && !String(manifest.full_refresh_reason || '').trim()) {
    fail('Full refresh manifest is missing full_refresh_reason.');
  }
  if (!Array.isArray(manifest.objects)) fail('Manifest objects must be an array.');
  const counts = manifest.counts || {};
  for (const status of ['new', 'changed', 'unchanged', 'retained_stale', 'removed_stale']) {
    const actual = countObjects(manifest.objects, status);
    if (Number(counts[status] || 0) !== actual) {
      fail(`Count mismatch for ${status}: expected ${counts[status] || 0}, found ${actual}.`);
    }
  }
  const changedObjectIds = new Set(manifest.changed_object_ids || []);
  const expectedChanged = manifest.objects
    .filter((object) => object.status === 'new' || object.status === 'changed')
    .map((object) => object.canonical_id);
  if (changedObjectIds.size !== expectedChanged.length) {
    fail('changed_object_ids count does not match new/changed objects.');
  }
  for (const id of expectedChanged) {
    if (!changedObjectIds.has(id)) fail(`changed_object_ids is missing ${id}.`);
  }
  for (const object of manifest.objects) {
    if (!object.canonical_id) fail('Manifest object missing canonical_id.');
    if (object.status === 'unchanged' && object.affected_targets?.length) {
      fail(`Unchanged object has affected targets: ${object.canonical_id}`);
    }
    if ((object.status === 'new' || object.status === 'changed') && !object.next_signature) {
      fail(`New/changed object missing next_signature: ${object.canonical_id}`);
    }
    if ((object.status === 'retained_stale' || object.status === 'removed_stale') && !object.prior_signature) {
      fail(`Stale object missing prior_signature: ${object.canonical_id}`);
    }
  }
  console.log(
    JSON.stringify(
      {
        status: 'passed',
        connector_id: manifest.connector_id,
        source_family: manifest.source_family,
        source_scope: manifest.source_scope,
        mode: manifest.mode,
        counts,
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
