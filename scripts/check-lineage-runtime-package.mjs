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
  'registry/database-index.json',
  'registry/object-registry-summary.json',
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

async function listFilesRecursive(root, current = '') {
  const directory = path.join(root, current);
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const relativePath = normalizePath(path.join(current, entry.name));
    if (entry.isDirectory()) {
      // eslint-disable-next-line no-await-in-loop
      files.push(...(await listFilesRecursive(root, relativePath)));
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
