import { promises as fs } from 'fs';
import path from 'path';
import yaml from 'yaml';
import { applyDictionaryEnrichmentContract } from '../src/services/markdownEnrichmentContract.js';

const ROOT = process.cwd();
const DEFAULT_MARKDOWN_ROOT = path.join(ROOT, 'data', 'markdown');
const SKIP_DIRS = new Set(['_rebuild_backups', '_quarantine', '_runtime', '_drafts', 'node_modules']);
const SKIP_FILES = new Set(['rebuild-report.md']);

function optionValue(name, fallback = '') {
  const equals = process.argv.find((arg) => arg.startsWith(`${name}=`));
  if (equals) return equals.slice(name.length + 1);
  const index = process.argv.indexOf(name);
  if (index >= 0) return process.argv[index + 1] || fallback;
  return fallback;
}

function shouldSkipPath(filePath) {
  const parts = filePath.split(/[\\/]/);
  return parts.some((part) => SKIP_DIRS.has(part)) || SKIP_FILES.has(path.basename(filePath));
}

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function listMarkdownFiles(root) {
  const manifestPath = path.join(root, 'catalog-manifest.json');
  if (await pathExists(manifestPath)) {
    const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
    const files = Array.isArray(manifest.files) ? manifest.files : [];
    const resolved = [];
    for (const relativeFile of files) {
      const filePath = path.join(root, relativeFile);
      if (filePath.toLowerCase().endsWith('.md') && !shouldSkipPath(filePath) && (await pathExists(filePath))) {
        resolved.push(filePath);
      }
    }
    return resolved;
  }

  const files = [];
  async function walk(current) {
    const entries = await fs.readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const filePath = path.join(current, entry.name);
      if (shouldSkipPath(filePath)) continue;
      if (entry.isDirectory()) {
        await walk(filePath);
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
        files.push(filePath);
      }
    }
  }

  await walk(root);
  return files;
}

function parseMarkdown(content, filePath) {
  const match = String(content).match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) {
    throw new Error(`No YAML frontmatter found in ${filePath}`);
  }
  return {
    metadata: yaml.parse(match[1]) || {},
    body: content.slice(match[0].length),
  };
}

function countColumns(metadata = {}) {
  return Array.isArray(metadata.columns) ? metadata.columns.length : 0;
}

function countMetrics(metadata = {}) {
  return Array.isArray(metadata.columns)
    ? metadata.columns.filter((column) => column?.is_metric || column?.semantic_type === 'metric').length
    : 0;
}

function countSensitive(metadata = {}) {
  return Array.isArray(metadata.columns)
    ? metadata.columns.filter((column) =>
        ['restricted', 'confidential'].includes(String(column?.sensitivity || '').toLowerCase())
      ).length
    : 0;
}

function countBusinessDomain(metadata = {}) {
  return String(metadata.business_domain || '').trim() ? 1 : 0;
}

function hasDictionaryContract(metadata = {}) {
  return Boolean(metadata.id && metadata.type);
}

async function enrichFile(filePath, enrichedAt) {
  const content = await fs.readFile(filePath, 'utf8');
  const { metadata, body } = parseMarkdown(content, filePath);
  if (!hasDictionaryContract(metadata)) {
    return { scanned: 1, changed: 0, skipped: 1, columns: 0, metrics: 0, sensitive: 0, domains: 0 };
  }

  const beforeColumns = countColumns(metadata);
  const beforeMetrics = countMetrics(metadata);
  const beforeSensitive = countSensitive(metadata);
  const beforeDomains = countBusinessDomain(metadata);
  const enriched = applyDictionaryEnrichmentContract(metadata, { enrichedAt });
  const afterMetrics = countMetrics(enriched);
  const afterSensitive = countSensitive(enriched);
  const afterDomains = countBusinessDomain(enriched);
  const newContent = `---\n${yaml.stringify(enriched, { lineWidth: 0 })}---\n${body}`;

  if (newContent !== content) {
    await fs.writeFile(filePath, newContent, 'utf8');
  }

  return {
    scanned: 1,
    changed: newContent !== content ? 1 : 0,
    skipped: 0,
    columns: beforeColumns,
    metrics: Math.max(0, afterMetrics - beforeMetrics),
    sensitive: Math.max(0, afterSensitive - beforeSensitive),
    domains: Math.max(0, afterDomains - beforeDomains),
  };
}

async function main() {
  const markdownRoot = path.resolve(optionValue('--data-path', DEFAULT_MARKDOWN_ROOT));
  const dryRun = process.argv.includes('--dry-run');
  const enrichedAt = new Date().toISOString();
  const files = await listMarkdownFiles(markdownRoot);
  const totals = {
    markdownRoot,
    dryRun,
    filesDiscovered: files.length,
    filesScanned: 0,
    filesChanged: 0,
    filesSkipped: 0,
    columnsReviewed: 0,
    newMetricInferences: 0,
    newSensitiveInferences: 0,
    newBusinessDomainInferences: 0,
    errors: [],
  };

  for (const filePath of files) {
    try {
      if (dryRun) {
        const content = await fs.readFile(filePath, 'utf8');
        const { metadata } = parseMarkdown(content, filePath);
        if (!hasDictionaryContract(metadata)) {
          totals.filesScanned += 1;
          totals.filesSkipped += 1;
          continue;
        }
        const enriched = applyDictionaryEnrichmentContract(metadata, { enrichedAt });
        const newContent = `---\n${yaml.stringify(enriched, { lineWidth: 0 })}---\n${content.slice(content.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/)[0].length)}`;
        totals.filesScanned += 1;
        totals.filesChanged += newContent !== content ? 1 : 0;
        totals.columnsReviewed += countColumns(metadata);
        totals.newMetricInferences += Math.max(0, countMetrics(enriched) - countMetrics(metadata));
        totals.newSensitiveInferences += Math.max(0, countSensitive(enriched) - countSensitive(metadata));
        totals.newBusinessDomainInferences += Math.max(0, countBusinessDomain(enriched) - countBusinessDomain(metadata));
      } else {
        const result = await enrichFile(filePath, enrichedAt);
        totals.filesScanned += result.scanned;
        totals.filesChanged += result.changed;
        totals.filesSkipped += result.skipped;
        totals.columnsReviewed += result.columns;
        totals.newMetricInferences += result.metrics;
        totals.newSensitiveInferences += result.sensitive;
        totals.newBusinessDomainInferences += result.domains;
      }
    } catch (err) {
      totals.errors.push({ file: path.relative(markdownRoot, filePath).replace(/\\/g, '/'), error: err.message });
    }
  }

  console.log(JSON.stringify(totals, null, 2));
  if (totals.errors.length > 0) process.exitCode = 1;
}

await main();
