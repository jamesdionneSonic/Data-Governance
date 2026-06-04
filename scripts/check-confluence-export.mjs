import 'dotenv/config';

import { readFile, stat } from 'fs/promises';
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
