import fs from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';

const packageRoot = path.resolve(
  process.env.LINEAGE_RUNTIME_PACKAGE_ROOT ||
    'data/lineage-runtime-package/sonic-data-lineage-runtime'
);
const targetObjectId = process.env.LINEAGE_RUNTIME_READBACK_OBJECT_ID || 'L1-5FSQL-01.Sonic_DW.dbo.factFIRE';

const requiredEntrypoints = [
  'manifest.json',
  'latest.json',
  'indexes/entrypoints.json',
  'indexes/path-contract.json',
  'indexes/artifact-manifest.json',
  'registry/canonical-objects.jsonl',
  'answers/catalog/databases.json',
  'profile-index/manifest.json',
  'profile-index/latest-summary.json',
  'ssis/README.md',
];

async function exists(relativePath) {
  try {
    await fs.access(path.join(packageRoot, relativePath));
    return true;
  } catch {
    return false;
  }
}

async function readJson(relativePath) {
  return JSON.parse(await fs.readFile(path.join(packageRoot, relativePath), 'utf8'));
}

async function readText(relativePath) {
  return fs.readFile(path.join(packageRoot, relativePath), 'utf8');
}

async function findCanonicalObject(objectId) {
  const file = path.join(packageRoot, 'registry/canonical-objects.jsonl');
  const rl = readline.createInterface({
    input: createReadStream(file, { encoding: 'utf8' }),
    crlfDelay: Infinity,
  });
  for await (const line of rl) {
    if (!line.trim()) continue;
    const row = JSON.parse(line);
    if (row.object_id === objectId) return row;
  }
  return null;
}

function addFailure(failures, check, message) {
  failures.push({ check, message });
}

async function validateRequiredEntrypoints(failures) {
  const missing = [];
  for (const entry of requiredEntrypoints) {
    // eslint-disable-next-line no-await-in-loop
    if (!(await exists(entry))) missing.push(entry);
  }
  if (missing.length > 0) addFailure(failures, 'required-entrypoints', `Missing package entrypoints: ${missing.join(', ')}`);
  return missing.length === 0;
}

async function validateCatalogReadback(failures) {
  const catalog = await readJson('answers/catalog/databases.json');
  if (!catalog.counts || Number(catalog.counts.database_entries || 0) <= 0) {
    addFailure(failures, 'catalog-databases', 'Catalog database answer card has no database count.');
  }
  if (!Array.isArray(catalog.databases) || !catalog.databases.some((row) => row.database === 'Sonic_DW')) {
    addFailure(failures, 'catalog-databases', 'Catalog database answer card does not include Sonic_DW.');
  }
  return {
    databaseEntries: catalog.counts?.database_entries || 0,
    sonicDwPresent: catalog.databases?.some((row) => row.database === 'Sonic_DW') || false,
  };
}

async function validateObjectReadback(failures) {
  const row = await findCanonicalObject(targetObjectId);
  if (!row) {
    addFailure(failures, 'object-resolution', `Could not resolve ${targetObjectId} from registry/canonical-objects.jsonl.`);
    return null;
  }

  const advertisedPaths = [
    row.context_pack_path,
    row.context_pack_json_path,
    row.compact_context_pack_path,
    row.answer_cards?.summary,
    row.answer_cards?.usage_count,
    row.answer_cards?.upstream,
    row.answer_cards?.downstream,
    row.answer_cards?.profile_teaser,
  ].filter(Boolean);

  for (const relativePath of advertisedPaths) {
    // eslint-disable-next-line no-await-in-loop
    if (!(await exists(relativePath))) {
      addFailure(failures, 'object-advertised-paths', `Advertised path does not exist: ${relativePath}`);
    }
  }

  const summary = await readJson(row.answer_cards.summary);
  const upstream = await readJson(row.answer_cards.upstream);
  const downstream = await readJson(row.answer_cards.downstream);
  const profileTeaser = await readJson(row.answer_cards.profile_teaser);
  const compact = await readJson(row.compact_context_pack_path);

  if (summary.object?.object_id !== row.object_id || !String(summary.answer?.summary || '').includes('factFIRE')) {
    addFailure(failures, 'summary-answer-card', 'Summary answer card does not identify factFIRE.');
  }
  if (Number(upstream.counts?.upstream_count ?? row.upstream_count ?? 0) < 1) {
    addFailure(failures, 'upstream-answer-card', 'Upstream answer card does not surface upstream lineage.');
  }
  if (Number(downstream.counts?.downstream_count ?? row.downstream_count ?? 0) < 1) {
    addFailure(failures, 'downstream-answer-card', 'Downstream answer card does not surface downstream impact.');
  }
  if (compact.object_id !== row.object_id) {
    addFailure(failures, 'compact-context-pack', 'Compact context pack object_id does not match registry row.');
  }

  return {
    objectId: row.object_id,
    answerCards: row.answer_cards,
    compactContextPackPath: row.compact_context_pack_path,
    upstreamCount: row.upstream_count,
    downstreamCount: row.downstream_count,
    profileTeaserStatus: profileTeaser.profile_available === true ? 'available' : 'not available in package',
  };
}

async function validateProfileIndexReadback(failures) {
  const manifest = await readJson('profile-index/manifest.json');
  const summary = await readJson('profile-index/latest-summary.json');
  const safety = manifest.safety || manifest;
  if (safety.profile_index_safe !== true) {
    addFailure(failures, 'profile-index-safety', 'profile-index/manifest.json does not declare profile_index_safe=true.');
  }
  if (safety.raw_data_captured !== false || safety.raw_values_retained !== false || safety.secret_exposed !== false) {
    addFailure(failures, 'profile-index-safety', 'Profile index safety flags are not all false for raw data/raw values/secrets.');
  }
  if (summary.profile_index_safe !== true) {
    addFailure(failures, 'profile-index-summary', 'profile-index/latest-summary.json does not declare profile_index_safe=true.');
  }
  return {
    runCount: manifest.counts?.run_count || 0,
    objectCount: manifest.counts?.object_profile_count || 0,
    databaseCount: manifest.counts?.database_index_count || 0,
    safe: safety.profile_index_safe === true,
  };
}

async function validateSsisReadback(failures) {
  const readme = await readText('ssis/README.md');
  const hasPackageRoute = /ssis\/f\//i.test(readme) || /package/i.test(readme);
  if (!hasPackageRoute) addFailure(failures, 'ssis-route', 'ssis/README.md does not appear to describe package routes.');
  return {
    readmePath: 'ssis/README.md',
    packageRouteDescribed: hasPackageRoute,
  };
}

async function main() {
  const failures = [];
  const entrypointsOk = await validateRequiredEntrypoints(failures);
  const manifest = entrypointsOk ? await readJson('manifest.json') : {};
  const latest = entrypointsOk ? await readJson('latest.json') : {};
  const catalog = entrypointsOk ? await validateCatalogReadback(failures) : null;
  const object = entrypointsOk ? await validateObjectReadback(failures) : null;
  const profileIndex = entrypointsOk ? await validateProfileIndexReadback(failures) : null;
  const ssis = entrypointsOk ? await validateSsisReadback(failures) : null;

  const result = {
    status: failures.length > 0 ? 'failed' : 'passed',
    packageRoot,
    packageName: manifest.package_name || latest.package_name || null,
    packageVersion: manifest.version || latest.version || null,
    runtimeContentHash: latest.runtime_content_hash || null,
    generatedAt: manifest.generated_at || latest.generated_at || null,
    checks: {
      requiredEntrypoints: requiredEntrypoints.length,
      catalog,
      object,
      profileIndex,
      ssis,
    },
    policy: {
      confluenceUsed: false,
      localSourceMarkdownUsed: false,
      pathGuessingUsed: false,
    },
    failures,
    decision: failures.length > 0 ? 'rejected' : 'approved-for-local-readback',
  };

  console.log(JSON.stringify(result, null, 2));
  if (failures.length > 0) process.exitCode = 1;
}

await main();
