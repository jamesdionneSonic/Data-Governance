import 'dotenv/config';

import { readdir, readFile, stat } from 'fs/promises';
import path from 'path';

const DEFAULT_EXPORT_ROOT = './data/confluence/export';
const MANIFEST_FILE_NAME = 'confluence-export-manifest.json';
const REQUIRED_ATTACHMENTS = new Set([
  'catalog-object-index.json',
  'catalog-object-registry.json',
  'catalog-object-registry.csv',
  'confluence-export-summary.json',
  'lineage-catalog.zip',
]);
const FORBIDDEN_CONTENT_PATTERNS = [/unknown\.Sonic_DW/i];

async function listFilesRecursive(root, current = '') {
  const directory = path.join(root, current);
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const relativePath = path.join(current, entry.name).replace(/\\/g, '/');
    if (entry.isDirectory()) {
      // eslint-disable-next-line no-await-in-loop
      files.push(...(await listFilesRecursive(root, relativePath)));
    } else if (entry.isFile()) {
      files.push(relativePath);
    }
  }

  return files;
}

function pageGroups(manifest) {
  return [
    {
      name: 'pages',
      records: manifest.pages || [],
      maxBytes: 250_000,
    },
    {
      name: 'object_locator_pages',
      records: manifest.object_locator_pages || [],
      maxBytes: manifest.stats?.object_locator_max_bytes || 120_000,
    },
    {
      name: 'quick_context_pages',
      records: manifest.quick_context_pages || [],
      maxBytes: manifest.stats?.quick_context_max_bytes || 180_000,
    },
    {
      name: 'shard_pages',
      records: manifest.shard_pages || [],
      maxBytes: manifest.stats?.shard_max_bytes || 250_000,
    },
    {
      name: 'object_pages',
      records: manifest.object_pages || [],
      maxBytes: 80_000,
    },
  ];
}

async function fileSize(root, relativePath) {
  return (await stat(path.join(root, relativePath))).size;
}

function manifestFiles(manifest) {
  const files = new Set([MANIFEST_FILE_NAME]);
  for (const group of pageGroups(manifest)) {
    for (const record of group.records) {
      if (record.file) files.add(String(record.file).replace(/\\/g, '/'));
    }
  }
  for (const attachment of manifest.attachments || []) {
    if (attachment.file) files.add(String(attachment.file).replace(/\\/g, '/'));
  }
  return files;
}

function isTextFile(file) {
  return /\.(csv|json|md|txt)$/i.test(file);
}

const exportRoot = path.resolve(
  process.cwd(),
  process.argv[2] || process.env.CONFLUENCE_EXPORT_PATH || DEFAULT_EXPORT_ROOT
);
const manifestPath = path.join(exportRoot, MANIFEST_FILE_NAME);
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const failures = [];
const warnings = [];
const summary = {
  exportRoot,
  generatedAt: manifest.generated_at,
  pages: {},
  attachments: (manifest.attachments || []).length,
};

for (const group of pageGroups(manifest)) {
  let maxObservedBytes = 0;
  for (const record of group.records) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const bytes = await fileSize(exportRoot, record.file);
      maxObservedBytes = Math.max(maxObservedBytes, bytes);
      if (bytes > group.maxBytes) {
        failures.push(`${group.name} page exceeds ${group.maxBytes} bytes: ${record.title}`);
      }
    } catch (err) {
      failures.push(`${group.name} page missing: ${record.file} (${err.message})`);
    }
  }
  summary.pages[group.name] = {
    count: group.records.length,
    maxBytes: group.maxBytes,
    maxObservedBytes,
  };
}

const attachmentNames = new Set();
for (const attachment of manifest.attachments || []) {
  attachmentNames.add(attachment.file_name);
  try {
    // eslint-disable-next-line no-await-in-loop
    await fileSize(exportRoot, attachment.file);
  } catch (err) {
    failures.push(`attachment missing: ${attachment.file_name} (${err.message})`);
  }
}

for (const required of REQUIRED_ATTACHMENTS) {
  if (!attachmentNames.has(required)) failures.push(`required attachment missing: ${required}`);
}

const expectedFiles = manifestFiles(manifest);
const generatedFiles = await listFilesRecursive(exportRoot);
const unexpectedFiles = generatedFiles.filter((file) => !expectedFiles.has(file));
if (unexpectedFiles.length > 0) {
  failures.push(
    `unexpected generated files remain in export root: ${unexpectedFiles.slice(0, 10).join(', ')}${
      unexpectedFiles.length > 10 ? ` and ${unexpectedFiles.length - 10} more` : ''
    }`
  );
}

for (const file of generatedFiles.filter(isTextFile)) {
  const content = await readFile(path.join(exportRoot, file), 'utf8');
  for (const pattern of FORBIDDEN_CONTENT_PATTERNS) {
    if (pattern.test(content)) {
      failures.push(`forbidden content ${pattern} found in ${file}`);
      break;
    }
  }
}

if ((manifest.object_pages || []).length > 250) {
  warnings.push('Governed asset page count is above 250; consider lowering the page limit.');
}

const result = {
  status: failures.length === 0 ? 'ok' : 'failed',
  summary,
  warnings,
  failures,
};

console.log(JSON.stringify(result, null, 2));
if (failures.length > 0) process.exitCode = 1;
