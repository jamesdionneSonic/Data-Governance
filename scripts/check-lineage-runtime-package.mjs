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
  'registry/object-registry-summary.json',
  'indexes/index-manifest.json',
  'docs/ai-usage-guide.md',
  'docs/runtime-package-guide.md',
];
const FORBIDDEN_PATTERNS = ['unknown.Sonic_DW'];
const PACKAGE_FILE_WARNING_LIMIT = 50000;

function argValue(name) {
  const prefix = `${name}=`;
  const found = process.argv.slice(2).find((arg) => arg.startsWith(prefix));
  return found ? found.slice(prefix.length) : '';
}

function normalizePath(value) {
  return String(value || '').replace(/\\/g, '/');
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

async function validateRegistry(packageRoot, failures) {
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

    for (const key of ['context_pack_path', 'context_pack_json_path']) {
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

  const registryCount = failures.length === 0 ? await validateRegistry(packageRoot, failures) : 0;
  if (failures.length === 0) {
    await validateRuntimeEnhancements(packageRoot, manifest, registryCount, failures);
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
