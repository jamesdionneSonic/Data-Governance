import 'dotenv/config';

import { copyFile, mkdir, readdir, readFile, rm, stat, writeFile } from 'fs/promises';
import path from 'path';

const DEFAULT_PACKAGE_ROOT = './data/lineage-runtime-package/sonic-data-lineage-runtime';
const DEFAULT_CATALOG_REPO_PATH = '../Sonic-data-lineage';
const SYNC_ENTRIES = [
  { source: 'answers', target: 'answers' },
  { source: 'indexes', target: 'indexes' },
  { source: 'profile-index', target: 'profile-index' },
  { source: 'registry', target: 'registry' },
  { source: 'context-packs/objects', target: 'context-packs/objects' },
  { source: 'docs/runtime-package-guide.md', target: 'docs/runtime-package-guide.md' },
  { source: 'manifest.json', target: 'manifest.json' },
  { source: 'latest.json', target: 'latest.json' },
];

function argValue(name) {
  const prefix = `${name}=`;
  const found = process.argv.slice(2).find((arg) => arg.startsWith(prefix));
  return found ? found.slice(prefix.length) : '';
}

function normalizePath(value) {
  return String(value || '').replace(/\\/g, '/');
}

function isWithin(parent, child) {
  const relative = path.relative(parent, child);
  return Boolean(relative) && !relative.startsWith('..') && !path.isAbsolute(relative);
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

async function copyTree(sourcePath, targetPath) {
  const sourceStat = await stat(sourcePath);
  if (sourceStat.isDirectory()) {
    await mkdir(targetPath, { recursive: true });
    const entries = await readdir(sourcePath, { withFileTypes: true });
    let fileCount = 0;
    let byteCount = 0;
    for (const entry of entries) {
      const copied = await copyTree(path.join(sourcePath, entry.name), path.join(targetPath, entry.name));
      fileCount += copied.fileCount;
      byteCount += copied.byteCount;
    }
    return { fileCount, byteCount };
  }

  await mkdir(path.dirname(targetPath), { recursive: true });
  await copyFile(sourcePath, targetPath);
  return { fileCount: 1, byteCount: sourceStat.size };
}

function assertSafeTarget(targetRoot) {
  const resolved = path.resolve(targetRoot);
  const projectsRoot = path.resolve(process.cwd(), '..');
  if (!isWithin(projectsRoot, resolved)) {
    throw new Error(`Catalog repo target must stay inside ${projectsRoot}: ${resolved}`);
  }
  if (path.basename(resolved).toLowerCase() !== 'sonic-data-lineage') {
    throw new Error(`Refusing to sync runtime files into unexpected target: ${resolved}`);
  }
}

async function main() {
  const packageRoot = path.resolve(
    process.cwd(),
    argValue('--package-root') || process.env.LINEAGE_RUNTIME_PACKAGE_ROOT || DEFAULT_PACKAGE_ROOT
  );
  const targetRoot = path.resolve(
    process.cwd(),
    argValue('--target-root') || process.env.CATALOG_REPO_PATH || DEFAULT_CATALOG_REPO_PATH
  );
  assertSafeTarget(targetRoot);

  const manifest = await readJson(path.join(packageRoot, 'manifest.json'));
  const artifactManifest = await readJson(path.join(packageRoot, 'indexes/artifact-manifest.json'));
  if (artifactManifest.missing_policy !== 'If a path is null or availability is false, consumers must not probe path variants.') {
    throw new Error('Runtime artifact manifest is missing the no-path-fishing contract.');
  }

  const copiedEntries = [];
  for (const entry of SYNC_ENTRIES) {
    const sourcePath = path.join(packageRoot, entry.source);
    const targetPath = path.join(targetRoot, entry.target);
    if (!(await fileExists(sourcePath))) {
      throw new Error(`Runtime package is missing required sync source: ${entry.source}`);
    }
    if (!isWithin(targetRoot, targetPath)) {
      throw new Error(`Refusing to write outside target repo: ${targetPath}`);
    }
    if (await fileExists(targetPath)) {
      await rm(targetPath, { recursive: true, force: true, maxRetries: 8, retryDelay: 300 });
    }
    const copied = await copyTree(sourcePath, targetPath);
    copiedEntries.push({ ...entry, ...copied });
  }

  const syncedFiles = [];
  for (const entry of SYNC_ENTRIES) {
    const targetPath = path.join(targetRoot, entry.target);
    const targetStat = await stat(targetPath);
    if (targetStat.isDirectory()) {
      const files = await listFilesRecursive(targetPath);
      syncedFiles.push(...files.map((file) => normalizePath(path.join(entry.target, file))));
    } else {
      syncedFiles.push(normalizePath(entry.target));
    }
  }

  const summary = {
    schema_version: 1,
    generated_at: new Date().toISOString(),
    package_name: manifest.package_name,
    package_version: manifest.version,
    runtime_content_hash: manifest.runtime_content_hash,
    source_package_root: normalizePath(packageRoot),
    target_repo_root: normalizePath(targetRoot),
    copied_entries: copiedEntries,
    synced_file_count: syncedFiles.length,
    synced_files: syncedFiles.sort(),
  };
  await mkdir(path.join(targetRoot, 'reports'), { recursive: true });
  await writeFile(path.join(targetRoot, 'reports/runtime-sync-summary.json'), `${JSON.stringify(summary, null, 2)}\n`, 'utf8');

  console.log(JSON.stringify({
    status: 'synced',
    targetRoot,
    packageName: manifest.package_name,
    version: manifest.version,
    runtimeContentHash: manifest.runtime_content_hash,
    syncedFileCount: syncedFiles.length,
  }, null, 2));
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
