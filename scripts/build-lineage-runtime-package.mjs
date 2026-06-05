import 'dotenv/config';

import { createHash } from 'crypto';
import {
  copyFile,
  mkdir,
  readdir,
  readFile,
  rm,
  stat,
  writeFile,
} from 'fs/promises';
import path from 'path';

const DEFAULT_SOURCE_REPO = '../Sonic-data-lineage';
const DEFAULT_PACKAGE_ROOT = './data/lineage-runtime-package/sonic-data-lineage-runtime';
const DEFAULT_PACKAGE_NAME = 'sonic-data-lineage-runtime';
const PACKAGE_SCHEMA_VERSION = 1;
const COPY_ENTRIES = [
  '.gitattributes',
  'AI_README.md',
  'catalog-manifest.json',
  'schemas',
  'registry',
  'context-packs',
  'ssis',
  'reports',
  'docs',
];
const HASH_FILES = [
  'catalog-manifest.json',
  'registry/object-registry.jsonl',
  'registry/database-index.json',
  'registry/object-registry-summary.json',
  'AI_README.md',
];

function argValue(name) {
  const prefix = `${name}=`;
  const found = process.argv.slice(2).find((arg) => arg.startsWith(prefix));
  return found ? found.slice(prefix.length) : '';
}

function normalizePath(value) {
  return String(value || '').replace(/\\/g, '/');
}

function defaultVersion() {
  const now = new Date();
  return `${now.getUTCFullYear()}.${now.getUTCMonth() + 1}.${now.getUTCDate()}-1`;
}

function isWithin(parent, child) {
  const relative = path.relative(parent, child);
  return Boolean(relative) && !relative.startsWith('..') && !path.isAbsolute(relative);
}

function assertSafeOutputRoot(outputRoot) {
  const cwd = path.resolve(process.cwd());
  if (!isWithin(cwd, outputRoot)) {
    throw new Error(`Package output must stay inside this workspace: ${outputRoot}`);
  }
  if (path.basename(outputRoot).toLowerCase() === '.git' || outputRoot.toLowerCase().includes(`${path.sep}.git${path.sep}`)) {
    throw new Error(`Package output cannot be inside a .git directory: ${outputRoot}`);
  }
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

async function writeJson(root, relativePath, value) {
  const filePath = path.join(root, relativePath);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

async function writeText(root, relativePath, value) {
  const filePath = path.join(root, relativePath);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, value, 'utf8');
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

async function copyTree(sourceRoot, targetRoot, relativePath) {
  const sourcePath = path.join(sourceRoot, relativePath);
  const targetPath = path.join(targetRoot, relativePath);
  const sourceStat = await stat(sourcePath);

  if (sourceStat.isDirectory()) {
    await mkdir(targetPath, { recursive: true });
    const entries = await readdir(sourcePath, { withFileTypes: true });
    let copied = { fileCount: 0, byteCount: 0 };
    for (const entry of entries) {
      const childRelativePath = normalizePath(path.join(relativePath, entry.name));
      // eslint-disable-next-line no-await-in-loop
      const childCopied = await copyTree(sourceRoot, targetRoot, childRelativePath);
      copied = {
        fileCount: copied.fileCount + childCopied.fileCount,
        byteCount: copied.byteCount + childCopied.byteCount,
      };
    }
    return copied;
  }

  await mkdir(path.dirname(targetPath), { recursive: true });
  await copyFile(sourcePath, targetPath);
  return { fileCount: 1, byteCount: sourceStat.size };
}

async function countJsonl(filePath) {
  const content = await readFile(filePath, 'utf8');
  return content.split(/\r?\n/).filter(Boolean).length;
}

async function sha256File(filePath) {
  const hash = createHash('sha256');
  hash.update(await readFile(filePath));
  return hash.digest('hex');
}

async function fileSize(filePath) {
  return (await stat(filePath)).size;
}

async function buildHashes(packageRoot) {
  const hashes = {};
  for (const relativePath of HASH_FILES) {
    const filePath = path.join(packageRoot, relativePath);
    // eslint-disable-next-line no-await-in-loop
    if (await fileExists(filePath)) {
      // eslint-disable-next-line no-await-in-loop
      hashes[relativePath] = await sha256File(filePath);
    }
  }
  return hashes;
}

async function renderPackageReadme({ packageName, version, sourceManifest }) {
  return `# Sonic Data Lineage Runtime Package

Package: \`${packageName}\`
Version: \`${version}\`

This bundle is optimized for AI and automation runtime lookup. It is built from the validated Sonic data lineage DevOps catalog repository, not from Confluence page crawls.

## Retrieval Order

1. Read \`manifest.json\`.
2. Search \`registry/object-registry.jsonl\`.
3. Open only the matching row's \`context_pack_path\` or \`context_pack_json_path\`.
4. Use \`registry/database-index.json\` for database-first browsing.
5. Use Confluence only for governance explanation, policy, stewardship, or curated narrative.

## Current Counts

- Objects: \`${sourceManifest.object_count ?? 0}\`
- Databases: \`${sourceManifest.database_count ?? 0}\`
- Context packs: \`${sourceManifest.context_pack_count ?? 0}\`
- SSIS package contexts: \`${sourceManifest.ssis_package_context_count ?? 0}\`

## Guardrails

- Preserve exact registry object IDs and casing.
- Do not infer relationships that are not present in a context pack.
- Report confidence labels when answering lineage questions.
- Treat raw SQL rows with server \`unknown\` and database \`Sonic_DW\` as forbidden stale lineage data.
`;
}

function renderRuntimeGuide({ packageName, version }) {
  return `# Runtime Package Guide

Use this package when an assistant or script needs fast Sonic lineage lookup without crawling Confluence.

## Package

- Name: \`${packageName}\`
- Version: \`${version}\`

## Required Files

- \`manifest.json\`
- \`latest.json\`
- \`registry/object-registry.jsonl\`
- \`registry/database-index.json\`
- \`context-packs/**\`
- \`ssis/**\`

## AI Routing

AI assistants should search the object registry first. The registry row contains the exact context pack paths to read. Confluence is secondary and should be used only for human-friendly governance context.

## Local Validation

Run:

\`\`\`powershell
npm run lineage:runtime:check
\`\`\`
`;
}

async function main() {
  const sourceRoot = path.resolve(
    process.cwd(),
    argValue('--source') || process.env.LINEAGE_RUNTIME_SOURCE_REPO || process.env.CATALOG_REPO_PATH || DEFAULT_SOURCE_REPO
  );
  const packageRoot = path.resolve(
    process.cwd(),
    argValue('--out') || process.env.LINEAGE_RUNTIME_PACKAGE_ROOT || DEFAULT_PACKAGE_ROOT
  );
  const packageName = argValue('--name') || process.env.LINEAGE_RUNTIME_PACKAGE_NAME || DEFAULT_PACKAGE_NAME;
  const version = argValue('--version') || process.env.LINEAGE_RUNTIME_PACKAGE_VERSION || defaultVersion();

  assertSafeOutputRoot(packageRoot);

  const sourceManifestPath = path.join(sourceRoot, 'catalog-manifest.json');
  if (!(await fileExists(sourceManifestPath))) {
    throw new Error(`Missing source catalog manifest. Run npm run catalog:repo:export first: ${sourceManifestPath}`);
  }

  const sourceManifest = await readJson(sourceManifestPath);

  await rm(packageRoot, { recursive: true, force: true });
  await mkdir(packageRoot, { recursive: true });

  let copied = { fileCount: 0, byteCount: 0 };
  for (const entry of COPY_ENTRIES) {
    const sourcePath = path.join(sourceRoot, entry);
    // eslint-disable-next-line no-await-in-loop
    if (!(await fileExists(sourcePath))) {
      throw new Error(`Source catalog repo is missing required runtime entry: ${entry}`);
    }
    // eslint-disable-next-line no-await-in-loop
    const copiedEntry = await copyTree(sourceRoot, packageRoot, entry);
    copied = {
      fileCount: copied.fileCount + copiedEntry.fileCount,
      byteCount: copied.byteCount + copiedEntry.byteCount,
    };
  }

  const registryCount = await countJsonl(path.join(packageRoot, 'registry/object-registry.jsonl'));
  const contentHashes = await buildHashes(packageRoot);

  const manifest = {
    schema_version: PACKAGE_SCHEMA_VERSION,
    package_name: packageName,
    version,
    generated_at: new Date().toISOString(),
    source: {
      catalog_repo_path: normalizePath(sourceRoot),
      catalog_generated_at: sourceManifest.generated_at || '',
      catalog_remote_url: sourceManifest.remote_url || '',
      source_markdown_root: sourceManifest.source_markdown_root || '',
      catalog_schema_version: sourceManifest.schema_version || 0,
    },
    counts: {
      object_count: sourceManifest.object_count || registryCount,
      database_count: sourceManifest.database_count || 0,
      context_pack_count: sourceManifest.context_pack_count || 0,
      ssis_package_context_count: sourceManifest.ssis_package_context_count || 0,
      registry_jsonl_count: registryCount,
      copied_file_count: copied.fileCount,
      copied_byte_count: copied.byteCount,
    },
    entrypoints: {
      registry_jsonl: 'registry/object-registry.jsonl',
      registry_csv: 'registry/object-registry.csv',
      database_index: 'registry/database-index.json',
      registry_summary: 'registry/object-registry-summary.json',
      catalog_manifest: 'catalog-manifest.json',
      ai_readme: 'AI_README.md',
      runtime_guide: 'docs/runtime-package-guide.md',
    },
    retrieval_order: [
      'registry/object-registry.jsonl',
      'row.context_pack_path or row.context_pack_json_path',
      'registry/database-index.json for database browsing',
      'Confluence only for human governance explanation',
    ],
    quality_gates: {
      blocked_raw_server_database_pairs: [{ server: 'unknown', database: 'Sonic_DW' }],
      unknown_sonic_dw_blocked: true,
      require_context_pack_paths: true,
      require_case_insensitive_unique_paths: true,
    },
    content_hashes: contentHashes,
  };

  await writeText(packageRoot, 'README.md', await renderPackageReadme({ packageName, version, sourceManifest }));
  await writeText(packageRoot, 'docs/runtime-package-guide.md', renderRuntimeGuide({ packageName, version }));
  await writeJson(packageRoot, 'manifest.json', manifest);
  await writeJson(packageRoot, 'latest.json', {
    package_name: packageName,
    version,
    generated_at: manifest.generated_at,
    manifest_path: 'manifest.json',
    registry_path: manifest.entrypoints.registry_jsonl,
    database_index_path: manifest.entrypoints.database_index,
  });

  const finalFiles = await listFilesRecursive(packageRoot);
  let finalBytes = 0;
  for (const file of finalFiles) {
    // eslint-disable-next-line no-await-in-loop
    finalBytes += await fileSize(path.join(packageRoot, file));
  }

  const result = {
    status: 'packaged',
    packageRoot,
    packageName,
    version,
    objectCount: manifest.counts.object_count,
    registryJsonlCount: registryCount,
    fileCount: finalFiles.length,
    byteCount: finalBytes,
  };

  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
