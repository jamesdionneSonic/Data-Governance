import 'dotenv/config';

import { createReadStream } from 'fs';
import { createInterface } from 'readline';
import { readdir, readFile, stat } from 'fs/promises';
import path from 'path';

const DEFAULT_PACKAGE_ROOT = './data/lineage-runtime-package/sonic-data-lineage-runtime';
const REQUIRED_FILES = [
  'README.md',
  'AI_README.md',
  'manifest.json',
  'latest.json',
  'catalog-manifest.json',
  'registry/object-registry.csv',
  'registry/object-registry.jsonl',
  'registry/canonical-objects.jsonl',
  'registry/duplicate-objects.jsonl',
  'registry/unresolved-server-objects.jsonl',
  'registry/database-index.json',
  'registry/database-artifact-index.json',
  'registry/object-path-index.json',
  'registry/object-registry-summary.json',
  'indexes/artifact-manifest.json',
  'indexes/index-manifest.json',
  'profile-index/manifest.json',
  'profile-index/latest-summary.json',
  'docs/ai-usage-guide.md',
  'docs/runtime-package-guide.md',
];
const FORBIDDEN_PATTERNS = ['unknown.Sonic_DW'];
const PROFILE_INDEX_FORBIDDEN_KEYS = new Set([
  'sample_values',
  'sample_value',
  'raw_rows',
  'raw_row',
  'preview_data',
  'example_value',
  'example_values',
  'raw_payload',
  'source_payload',
  'report_result_rows',
  'dashboard_cell_values',
  'connection_string',
  'authorization',
  'password',
  'token',
  'access_token',
  'refresh_token',
  'credential',
  'credentials',
  'vault_reference',
  'vault_ref',
]);
const PACKAGE_FILE_WARNING_LIMIT = 50000;

function argValue(name) {
  const prefix = `${name}=`;
  const found = process.argv.slice(2).find((arg) => arg.startsWith(prefix));
  return found ? found.slice(prefix.length) : '';
}

function normalizePath(value) {
  return String(value || '').replace(/\\/g, '/');
}

function normalizeKey(value) {
  return String(value || '').trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
}

async function fileExists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, 'utf8'));
}

async function countJsonl(filePath, failures, label) {
  let count = 0;
  const rows = createInterface({
    input: createReadStream(filePath, { encoding: 'utf8' }),
    crlfDelay: Infinity,
  });
  for await (const line of rows) {
    if (!line.trim()) continue;
    count += 1;
    try {
      JSON.parse(line);
    } catch (error) {
      failures.push(`Invalid ${label} JSONL row ${count}: ${error.message}`);
    }
  }
  return count;
}

async function listFilesRecursive(root, current = '') {
  const directory = path.join(root, current);
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const relativePath = normalizePath(path.join(current, entry.name));
    if (entry.isDirectory()) {
      // eslint-disable-next-line no-await-in-loop
      const childFiles = await listFilesRecursive(root, relativePath);
      for (const childFile of childFiles) {
        files.push(childFile);
      }
    } else if (entry.isFile()) {
      files.push(relativePath);
    }
  }

  return files;
}

async function scanFileForForbiddenPatterns(filePath) {
  const matches = [];
  const stream = createReadStream(filePath, { encoding: 'utf8' });
  const lines = createInterface({ input: stream, crlfDelay: Infinity });
  let lineNumber = 0;

  for await (const line of lines) {
    lineNumber += 1;
    for (const pattern of FORBIDDEN_PATTERNS) {
      if (line.includes(pattern)) {
        matches.push({ pattern, lineNumber });
      }
    }
  }

  return matches;
}

function validateProfileIndexValue(value, failures, location = 'profile-index') {
  if (Array.isArray(value)) {
    value.forEach((item, index) => validateProfileIndexValue(item, failures, `${location}[${index}]`));
    return;
  }
  if (!value || typeof value !== 'object') return;
  for (const [key, nested] of Object.entries(value)) {
    if (PROFILE_INDEX_FORBIDDEN_KEYS.has(normalizeKey(key))) {
      failures.push(`Forbidden profile-index field '${key}' at ${location}.${key}`);
    }
    validateProfileIndexValue(nested, failures, `${location}.${key}`);
  }
}

async function validateProfileIndex(packageRoot, manifest, failures) {
  const profileIndexManifest = await readJson(path.join(packageRoot, 'profile-index/manifest.json'));
  const latestSummary = await readJson(path.join(packageRoot, 'profile-index/latest-summary.json'));
  validateProfileIndexValue(profileIndexManifest, failures, 'profile-index/manifest.json');
  validateProfileIndexValue(latestSummary, failures, 'profile-index/latest-summary.json');

  if (profileIndexManifest.safety?.profile_index_safe !== true) {
    failures.push('Profile index manifest missing safety.profile_index_safe=true.');
  }
  if (profileIndexManifest.safety?.raw_data_captured !== false) {
    failures.push('Profile index manifest must declare safety.raw_data_captured=false.');
  }
  if (profileIndexManifest.safety?.raw_values_retained !== false) {
    failures.push('Profile index manifest must declare safety.raw_values_retained=false.');
  }
  if (profileIndexManifest.safety?.secret_exposed !== false) {
    failures.push('Profile index manifest must declare safety.secret_exposed=false.');
  }

  const requiredDirectories = [
    manifest.profile_index?.by_database,
    manifest.profile_index?.by_object_id,
    manifest.profile_index?.by_object_name,
    manifest.profile_index?.by_column_name,
    manifest.profile_index?.runs_by_id,
    manifest.profile_index?.runs_by_connector,
    manifest.profile_index?.flags,
  ].filter(Boolean);

  for (const directory of requiredDirectories) {
    // eslint-disable-next-line no-await-in-loop
    if (!(await fileExists(path.join(packageRoot, directory)))) {
      failures.push(`Missing profile index directory from manifest: ${directory}`);
    }
  }

  const files = await listFilesRecursive(path.join(packageRoot, 'profile-index'));
  for (const file of files.filter((item) => item.endsWith('.json'))) {
    // eslint-disable-next-line no-await-in-loop
    const payload = await readJson(path.join(packageRoot, 'profile-index', file));
    validateProfileIndexValue(payload, failures, `profile-index/${file}`);
    if (payload.profile_index_safe !== true && !file.endsWith('manifest.json')) {
      failures.push(`Profile index file missing profile_index_safe=true: profile-index/${file}`);
    }
    if (payload.raw_data_captured !== false && !file.endsWith('manifest.json')) {
      failures.push(`Profile index file must declare raw_data_captured=false: profile-index/${file}`);
    }
    if (payload.raw_values_retained !== false && !file.endsWith('manifest.json')) {
      failures.push(`Profile index file must declare raw_values_retained=false: profile-index/${file}`);
    }
    if (payload.secret_exposed !== false && !file.endsWith('manifest.json')) {
      failures.push(`Profile index file must declare secret_exposed=false: profile-index/${file}`);
    }
  }
}

async function validateRegistry(packageRoot, failures, manifest = {}) {
  const registryPath = path.join(packageRoot, 'registry/object-registry.jsonl');
  const rows = createInterface({
    input: createReadStream(registryPath, { encoding: 'utf8' }),
    crlfDelay: Infinity,
  });
  const objectIds = new Set();
  const contextPaths = new Map();
  let rowCount = 0;

  for await (const line of rows) {
    if (!line.trim()) continue;
    rowCount += 1;
    let row;
    try {
      row = JSON.parse(line);
    } catch (error) {
      failures.push(`Invalid JSONL row ${rowCount}: ${error.message}`);
      continue;
    }

    for (const pattern of FORBIDDEN_PATTERNS) {
      if (line.includes(pattern)) {
        failures.push(`Forbidden pattern ${pattern} found in registry row ${rowCount}.`);
      }
    }

    if (!row.object_id) {
      failures.push(`Registry row ${rowCount} is missing object_id.`);
      continue;
    }
    if (objectIds.has(row.object_id)) {
      failures.push(`Duplicate object_id: ${row.object_id}`);
    }
    objectIds.add(row.object_id);

    const requiredContextKeys =
      manifest.build?.payload_mode === 'compact'
        ? ['context_pack_json_path']
        : ['context_pack_path', 'context_pack_json_path'];
    for (const key of requiredContextKeys) {
      const value = normalizePath(row[key]);
      if (!value) {
        failures.push(`Registry row ${row.object_id} missing ${key}.`);
        continue;
      }

      const lowerPath = value.toLowerCase();
      const existingObjectId = contextPaths.get(lowerPath);
      if (existingObjectId && existingObjectId !== row.object_id) {
        failures.push(`Case-insensitive duplicate context path ${value}: ${existingObjectId} and ${row.object_id}`);
      }
      contextPaths.set(lowerPath, row.object_id);

      // eslint-disable-next-line no-await-in-loop
      if (!(await fileExists(path.join(packageRoot, value)))) {
        failures.push(`Missing ${key} for ${row.object_id}: ${value}`);
      }
    }
  }

  return rowCount;
}

async function validateRuntimeEnhancements(packageRoot, manifest, registryCount, failures) {
  const canonicalCount = await countJsonl(
    path.join(packageRoot, 'registry/canonical-objects.jsonl'),
    failures,
    'canonical-objects'
  );
  const duplicateCount = await countJsonl(
    path.join(packageRoot, 'registry/duplicate-objects.jsonl'),
    failures,
    'duplicate-objects'
  );
  const unresolvedCount = await countJsonl(
    path.join(packageRoot, 'registry/unresolved-server-objects.jsonl'),
    failures,
    'unresolved-server-objects'
  );

  if (canonicalCount + duplicateCount + unresolvedCount !== registryCount) {
    failures.push(
      `Registry split counts do not match full registry: canonical ${canonicalCount} + duplicate ${duplicateCount} + unresolved ${unresolvedCount} != ${registryCount}.`
    );
  }

  const indexManifest = await readJson(path.join(packageRoot, 'indexes/index-manifest.json'));
  const artifactManifest = await readJson(path.join(packageRoot, 'indexes/artifact-manifest.json'));
  const objectPathIndex = await readJson(path.join(packageRoot, 'registry/object-path-index.json'));
  const databaseArtifactIndex = await readJson(path.join(packageRoot, 'registry/database-artifact-index.json'));
  const requiredDirectories = [
    manifest.indexes?.object_name,
    manifest.indexes?.database,
    manifest.indexes?.schema,
    manifest.indexes?.aliases,
    manifest.indexes?.top_used,
    manifest.indexes?.rankings,
    manifest.answer_cards?.usage_count,
    manifest.answer_cards?.upstream,
    manifest.answer_cards?.downstream,
    manifest.compact_context_packs?.by_object_id,
  ].filter(Boolean);

  for (const directory of requiredDirectories) {
    // eslint-disable-next-line no-await-in-loop
    if (!(await fileExists(path.join(packageRoot, directory)))) {
      failures.push(`Missing runtime directory from manifest: ${directory}`);
    }
  }

  const expectedAnswerCards = registryCount * 3;
  if ((indexManifest.counts?.answer_card_files || 0) !== expectedAnswerCards) {
    failures.push(
      `Answer card count ${indexManifest.counts?.answer_card_files || 0} does not equal registry * 3 (${expectedAnswerCards}).`
    );
  }
  if ((indexManifest.counts?.compact_context_pack_files || 0) !== registryCount) {
    failures.push(
      `Compact context pack count ${indexManifest.counts?.compact_context_pack_files || 0} does not equal registry ${registryCount}.`
    );
  }
  if ((objectPathIndex.object_count || 0) !== registryCount) {
    failures.push(`Object path index count ${objectPathIndex.object_count || 0} does not equal registry ${registryCount}.`);
  }
  if ((databaseArtifactIndex.database_count || 0) !== (manifest.counts?.database_count || 0)) {
    failures.push(
      `Database artifact index count ${databaseArtifactIndex.database_count || 0} does not equal manifest database count ${manifest.counts?.database_count || 0}.`
    );
  }
  if (artifactManifest.missing_policy !== 'If a path is null or availability is false, consumers must not probe path variants.') {
    failures.push('Artifact manifest missing no-path-fishing missing_policy.');
  }
  for (const [name, entry] of Object.entries(artifactManifest.entrypoints || {})) {
    if (!entry?.available || !entry?.path) {
      failures.push(`Artifact manifest entrypoint is unavailable: ${name}`);
      continue;
    }
    // eslint-disable-next-line no-await-in-loop
    if (!(await fileExists(path.join(packageRoot, normalizePath(entry.path))))) {
      failures.push(`Artifact manifest entrypoint points to missing file: ${name} -> ${entry.path}`);
    }
  }
  for (const [label, count] of Object.entries({
    by_name_files: indexManifest.counts?.by_name_files || 0,
    alias_files: indexManifest.counts?.alias_files || 0,
    by_database_files: indexManifest.counts?.by_database_files || 0,
    by_schema_files: indexManifest.counts?.by_schema_files || 0,
    ranking_files: indexManifest.counts?.ranking_files || 0,
  })) {
    if (count <= 0) {
      failures.push(`Runtime index ${label} is empty.`);
    }
  }

  const canonicalRows = createInterface({
    input: createReadStream(path.join(packageRoot, 'registry/canonical-objects.jsonl'), { encoding: 'utf8' }),
    crlfDelay: Infinity,
  });
  for await (const line of canonicalRows) {
    if (!line.trim()) continue;
    const row = JSON.parse(line);
    for (const relativePath of [
      row.compact_context_pack_path,
      row.answer_cards?.usage_count,
      row.answer_cards?.upstream,
      row.answer_cards?.downstream,
    ].filter(Boolean)) {
      // eslint-disable-next-line no-await-in-loop
      if (!(await fileExists(path.join(packageRoot, normalizePath(relativePath))))) {
        failures.push(`Canonical row ${row.object_id} points to missing runtime file: ${relativePath}`);
      }
    }
    break;
  }

  const firstObjectPath = Object.values(objectPathIndex.objects || {})[0];
  for (const relativePath of [
    firstObjectPath?.paths?.compact_context_pack,
    firstObjectPath?.paths?.usage_answer,
    firstObjectPath?.paths?.upstream_answer,
    firstObjectPath?.paths?.downstream_answer,
  ].filter(Boolean)) {
    // eslint-disable-next-line no-await-in-loop
    if (!(await fileExists(path.join(packageRoot, normalizePath(relativePath))))) {
      failures.push(`Object path index points to missing runtime file: ${relativePath}`);
    }
  }
}

async function main() {
  const packageRoot = path.resolve(
    process.cwd(),
    argValue('--package-root') || process.env.LINEAGE_RUNTIME_PACKAGE_ROOT || DEFAULT_PACKAGE_ROOT
  );
  const failures = [];
  const warnings = [];

  for (const file of REQUIRED_FILES) {
    // eslint-disable-next-line no-await-in-loop
    if (!(await fileExists(path.join(packageRoot, file)))) {
      failures.push(`Missing required file: ${file}`);
    }
  }

  let manifest = {};
  let sourceManifest = {};
  let latest = {};
  if (failures.length === 0) {
    manifest = await readJson(path.join(packageRoot, 'manifest.json'));
    sourceManifest = await readJson(path.join(packageRoot, 'catalog-manifest.json'));
    latest = await readJson(path.join(packageRoot, 'latest.json'));
  }

  const registryCount = failures.length === 0 ? await validateRegistry(packageRoot, failures, manifest) : 0;
  if (failures.length === 0) {
    await validateRuntimeEnhancements(packageRoot, manifest, registryCount, failures);
    await validateProfileIndex(packageRoot, manifest, failures);
  }

  if (manifest.package_name !== latest.package_name) {
    failures.push('latest.json package_name does not match manifest.json.');
  }
  if (manifest.version !== latest.version) {
    failures.push('latest.json version does not match manifest.json.');
  }
  if ((manifest.counts?.object_count || 0) !== registryCount) {
    failures.push(`Manifest object count ${manifest.counts?.object_count || 0} does not match registry ${registryCount}.`);
  }
  if ((sourceManifest.object_count || 0) !== registryCount) {
    failures.push(`Source catalog object count ${sourceManifest.object_count || 0} does not match registry ${registryCount}.`);
  }

  const files = failures.length === 0 ? await listFilesRecursive(packageRoot) : [];
  if (files.length > PACKAGE_FILE_WARNING_LIMIT) {
    warnings.push(`Package has ${files.length} files; consider adding a compact index if this keeps growing.`);
  }

  let longestPath = '';
  let byteCount = 0;
  for (const file of files) {
    if (file.length > longestPath.length) longestPath = file;
    const filePath = path.join(packageRoot, file);
    // eslint-disable-next-line no-await-in-loop
    byteCount += (await stat(filePath)).size;
    if (/\.(md|json|jsonl|csv|txt)$/i.test(file)) {
      // eslint-disable-next-line no-await-in-loop
      const matches = await scanFileForForbiddenPatterns(filePath);
      for (const match of matches) {
        failures.push(`Forbidden pattern ${match.pattern} found in ${file}:${match.lineNumber}.`);
      }
    }
  }

  const result = {
    status: failures.length === 0 ? 'ok' : 'failed',
    packageRoot,
    packageName: manifest.package_name || '',
    version: manifest.version || '',
    objectCount: registryCount,
    fileCount: files.length,
    byteCount,
    longestPath: longestPath ? { length: longestPath.length, path: longestPath } : null,
    failures,
    warnings,
  };

  console.log(JSON.stringify(result, null, 2));

  if (failures.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
