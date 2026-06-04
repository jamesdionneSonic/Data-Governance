/**
 * Markdown Service
 * Parses markdown files and extracts object metadata
 */

import { access, open, readdir, readFile, writeFile } from 'fs/promises';
import { join, extname, isAbsolute } from 'path';
import yaml from 'yaml';

const CATALOG_MANIFEST_FILE = 'catalog-manifest.json';
const FRONTMATTER_READ_CHUNK_BYTES = 64 * 1024;
const MAX_FRONTMATTER_READ_BYTES = 8 * 1024 * 1024;
const DEFAULT_MARKDOWN_LOAD_CONCURRENCY = 16;

/**
 * Parse markdown file and extract metadata
 */
export async function parseMarkdownFile(filePath, options = {}) {
  const content = await readFile(filePath, 'utf-8');
  return parseMarkdownContent(content, filePath, options);
}

/**
 * Parse only frontmatter metadata from a markdown file.
 * This keeps validation fast for large generated lineage markdown files.
 */
export async function parseMarkdownMetadataFile(filePath) {
  const content = await readMarkdownFrontmatter(filePath);
  return parseMarkdownContent(content, filePath, { includeDescription: false });
}

/**
 * Parse markdown content string and extract metadata
 * @param {string} content - Markdown content including YAML frontmatter
 * @param {string} source - Source label (file name or path)
 * @param {Object} options - Parser options
 * @returns {Object} Parsed metadata
 */
export function parseMarkdownContent(content, source = 'inline-content', options = {}) {
  const normalizedContent = String(content || '').replace(/^\uFEFF/, '');
  const frontmatterMatch = normalizedContent.match(/^---\r?\n([\s\S]*?)\r?\n---/);

  if (!frontmatterMatch) {
    throw new Error(`No YAML frontmatter found in ${source}`);
  }

  const frontmatterContent = frontmatterMatch[1];
  let metadata;
  try {
    metadata = yaml.parse(frontmatterContent);
  } catch (err) {
    metadata = parseFrontmatterLenient(frontmatterContent);
  }
  const markdownContent = normalizedContent.substring(frontmatterMatch[0].length).trim();
  const description =
    options.includeDescription === false ? '' : extractPlainText(markdownContent);

  const required = ['name', 'database', 'type'];
  for (const field of required) {
    if (!metadata[field]) {
      throw new Error(`Missing required field: ${field} in ${source}`);
    }
  }

  return {
    id: buildCanonicalObjectId(metadata),
    name: metadata.name,
    server: metadata.server || metadata.serverName || metadata.server_name || null,
    schema: metadata.schema || null,
    packageName: metadata.package_name || metadata.packageName || null,
    packagePath: metadata.package_path || metadata.packagePath || null,
    database: metadata.database,
    type: metadata.type,
    owner: metadata.owner || 'unknown',
    steward: metadata.steward || null,
    domain_manager: metadata.domain_manager || null,
    custodian: metadata.custodian || null,
    sensitivity: metadata.sensitivity || 'public',
    tags: metadata.tags || [],
    columns: Array.isArray(metadata.columns) ? metadata.columns : [],
    depends_on: metadata.depends_on || [],
    reads_from: metadata.reads_from || metadata.lineage?.reads_from || [],
    writes_to: metadata.writes_to || metadata.lineage?.writes_to || [],
    calls: metadata.calls || metadata.lineage?.calls || [],
    created_by: metadata.created_by || metadata.lineage?.created_by || [],
    created_via: metadata.created_via || metadata.lineage?.created_via || [],
    used_by: metadata.used_by || metadata.lineage?.used_by || [],
    contextual_reads: metadata.contextual_reads || metadata.lineage?.contextual_reads || [],
    column_usage: Array.isArray(metadata.column_usage) ? metadata.column_usage : [],
    unresolved_column_usage: Array.isArray(metadata.unresolved_column_usage)
      ? metadata.unresolved_column_usage
      : [],
    column_risk_flags: Array.isArray(metadata.column_risk_flags)
      ? metadata.column_risk_flags
      : [],
    column_lineage: Array.isArray(metadata.column_lineage) ? metadata.column_lineage : [],
    unresolved_column_lineage: Array.isArray(metadata.unresolved_column_lineage)
      ? metadata.unresolved_column_lineage
      : [],
    ssis_column_mappings: Array.isArray(metadata.ssis_column_mappings)
      ? metadata.ssis_column_mappings
      : [],
    ssis_column_mapping_summary:
      metadata.ssis_column_mapping_summary &&
      typeof metadata.ssis_column_mapping_summary === 'object' &&
      !Array.isArray(metadata.ssis_column_mapping_summary)
        ? metadata.ssis_column_mapping_summary
        : null,
    ssis_column_mapping_sidecars: Array.isArray(metadata.ssis_column_mapping_sidecars)
      ? metadata.ssis_column_mapping_sidecars
      : [],
    unresolved_ssis_column_mappings: Array.isArray(metadata.unresolved_ssis_column_mappings)
      ? metadata.unresolved_ssis_column_mappings
      : [],
    lineage_quality:
      metadata.lineage_quality &&
      typeof metadata.lineage_quality === 'object' &&
      !Array.isArray(metadata.lineage_quality)
        ? metadata.lineage_quality
        : null,
    catalog_confidence:
      metadata.catalog_confidence &&
      typeof metadata.catalog_confidence === 'object' &&
      !Array.isArray(metadata.catalog_confidence)
        ? metadata.catalog_confidence
        : null,
    lineage_status: metadata.lineage_status || metadata.lineage?.lineage_status || '',
    external_source: metadata.external_source ?? metadata.lineage?.external_source ?? false,
    called_by: metadata.called_by || metadata.lineage?.called_by || [],
    description: metadata.description || description,
    certified: metadata.certified === true,
    trust_level: metadata.trust_level || null,
    certified_by: metadata.certified_by || null,
    certification_date: metadata.certification_date || null,
    last_updated: metadata.last_updated || null,
    filePath: source,
    createdAt: new Date(),
  };
}

function buildCanonicalObjectId(metadata) {
  if (metadata.id) {
    return String(metadata.id).trim();
  }

  const server = String(metadata.server || metadata.serverName || metadata.server_name || '').trim();
  const database = String(metadata.database || '').trim();
  const schema = String(metadata.schema || '').trim();
  const name = String(metadata.name || '').trim();

  if (metadata.type === 'package') {
    const packageName = String(metadata.package_name || metadata.packageName || name || '').trim();
    const packagePath = String(metadata.package_path || metadata.packagePath || '').trim();
    const pathParts = packagePath ? packagePath.replace(/\\/g, '/').split('/').filter(Boolean) : [];
    const folderName = String(metadata.folder_name || metadata.folderName || pathParts[0] || '').trim();
    const projectName = String(metadata.project_name || metadata.projectName || pathParts[1] || '').trim();
    const packageSegment = String(
      metadata.package_base_name ||
        metadata.packageBaseName ||
        packageName.replace(/\.dtsx$/i, '') ||
        name.replace(/\.dtsx$/i, '')
    ).trim();
    return [server, 'SSISDB', folderName, projectName, packageSegment].filter(Boolean).join('.');
  }

  if (server && database && schema && name) {
    return `${server}.${database}.${schema}.${name}`;
  }

  if (database && schema && name) {
    return `${database}.${schema}.${name}`;
  }

  return name;
}

function parseFrontmatterLenient(frontmatterContent) {
  const metadata = {};
  let currentKey = null;

  const lines = String(frontmatterContent || '').split(/\r?\n/);
  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    if (!line || line.startsWith('#')) continue;

    const keyMatch = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (keyMatch) {
      const [, key, value] = keyMatch;
      currentKey = key;
      if (value === '') {
        metadata[key] = [];
      } else if (value === '[]') {
        metadata[key] = [];
      } else if (value.startsWith('[') && value.endsWith(']')) {
        try {
          metadata[key] = yaml.parse(`${key}: ${value}`)[key];
        } catch {
          metadata[key] = [value];
        }
      } else {
        metadata[key] = coerceScalar(value);
      }
      continue;
    }

    const arrayItemMatch = line.match(/^\s*-\s+(.*)$/);
    if (arrayItemMatch && currentKey) {
      if (!Array.isArray(metadata[currentKey])) {
        metadata[currentKey] = [];
      }
      metadata[currentKey].push(coerceScalar(arrayItemMatch[1]));
      continue;
    }
  }

  return metadata;
}

function coerceScalar(value) {
  const trimmed = String(value || '').trim();
  if (!trimmed) return '';
  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;
  if (!Number.isNaN(Number(trimmed)) && trimmed !== '') return Number(trimmed);
  return trimmed;
}

/**
 * Extract plain text from markdown
 * @param {string} markdown - Markdown content
 * @returns {string} Plain text content
 */
export function extractPlainText(markdown) {
  // Remove markdown syntax
  const text = markdown
    .replace(/^#+\s+/gm, '') // Headers (remove all # and spaces at line start)
    .replace(/\*\*/g, '') // Bold
    .replace(/\*/g, '') // Italic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
    .replace(/`/g, '') // Code
    .replace(/>/g, '') // Blockquotes
    .replace(/^[-*+]\s+/gm, ''); // Lists

  // Limit to first 500 characters
  return text.substring(0, 500).trim();
}

async function readMarkdownFrontmatter(filePath) {
  const chunks = [];
  const buffer = Buffer.alloc(FRONTMATTER_READ_CHUNK_BYTES);
  let bytesReadTotal = 0;
  let fileHandle;

  try {
    fileHandle = await open(filePath, 'r');

    while (bytesReadTotal < MAX_FRONTMATTER_READ_BYTES) {
      const { bytesRead } = await fileHandle.read(
        buffer,
        0,
        buffer.length,
        bytesReadTotal
      );

      if (bytesRead === 0) break;

      chunks.push(Buffer.from(buffer.subarray(0, bytesRead)));
      bytesReadTotal += bytesRead;

      const content = Buffer.concat(chunks).toString('utf-8').replace(/^\uFEFF/, '');
      if (!content.startsWith('---')) {
        return content;
      }

      const frontmatterMatch = content.match(/^---\r?\n[\s\S]*?\r?\n---/);
      if (frontmatterMatch) {
        return frontmatterMatch[0];
      }
    }
  } finally {
    if (fileHandle) {
      await fileHandle.close();
    }
  }

  return readFile(filePath, 'utf-8');
}

/**
 * Read all markdown files from directory
 * @param {string} dirPath - Directory path
 * @returns {Array} Array of file paths
 */
export async function getMarkdownFiles(dirPath) {
  const manifestFiles = await getManifestMarkdownFiles(dirPath);
  if (manifestFiles) {
    return manifestFiles;
  }

  const files = [];

  async function walkDir(currentPath) {
    try {
      const entries = await readdir(currentPath, { withFileTypes: true });
      await Promise.all(
        entries.map(async (entry) => {
          const fullPath = join(currentPath, entry.name);
          if (entry.isDirectory()) {
            await walkDir(fullPath);
          } else if (entry.isFile() && extname(entry.name) === '.md') {
            files.push(fullPath);
          }
        })
      );
    } catch (err) {
      console.error(`Error reading directory ${currentPath}:`, err.message);
    }
  }

  await walkDir(dirPath);
  return files;
}

async function getManifestMarkdownFiles(dirPath) {
  const manifestPath = join(dirPath, CATALOG_MANIFEST_FILE);

  try {
    const manifest = JSON.parse(await readFile(manifestPath, 'utf-8'));
    if (!Array.isArray(manifest.files)) {
      return null;
    }

    return manifest.files
      .map((file) => String(file || '').replace(/\\/g, '/').trim())
      .filter((file) => file && extname(file) === '.md' && !isAbsolute(file))
      .filter((file) => !file.split('/').includes('..'))
      .map((file) => join(dirPath, file));
  } catch {
    return null;
  }
}

export async function validateMarkdownManifest(dataPath) {
  const manifestPath = join(dataPath, CATALOG_MANIFEST_FILE);
  let manifest;

  try {
    manifest = JSON.parse(await readFile(manifestPath, 'utf-8'));
  } catch {
    return null;
  }

  if (!Array.isArray(manifest.files)) {
    return null;
  }

  const manifestFiles = manifest.files
    .map((file) => String(file || '').replace(/\\/g, '/').trim())
    .filter((file) => file && extname(file) === '.md' && !isAbsolute(file))
    .filter((file) => !file.split('/').includes('..'));

  const results = {
    valid: 0,
    invalid: 0,
    errors: [],
    mode: 'manifest',
    manifestBacked: true,
    deepValidation: false,
  };
  const concurrency = Math.max(1, Number(process.env.MARKDOWN_LOAD_CONCURRENCY) || 64);
  let nextIndex = 0;

  const workers = Array.from(
    { length: Math.min(concurrency, manifestFiles.length) },
    async () => {
      while (nextIndex < manifestFiles.length) {
        const manifestFile = manifestFiles[nextIndex];
        nextIndex += 1;

        const filePath = join(dataPath, manifestFile);
        try {
          await access(filePath);
          results.valid += 1;
        } catch (err) {
          results.invalid += 1;
          results.errors.push({
            id: manifestFile,
            errors: [err.message],
          });
        }
      }
    }
  );

  await Promise.all(workers);
  return results;
}

/**
 * Load all markdown files from data directory
 * @param {string} dataPath - Base data directory path
 * @returns {Map} Map of object ID -> metadata
 */
export async function loadAllMarkdown(dataPath) {
  const objects = new Map();

  try {
    const mdFiles = await getMarkdownFiles(dataPath);
    const concurrency = Math.max(
      1,
      Number(process.env.MARKDOWN_LOAD_CONCURRENCY) || DEFAULT_MARKDOWN_LOAD_CONCURRENCY
    );
    let nextIndex = 0;

    const workers = Array.from({ length: Math.min(concurrency, mdFiles.length) }, async () => {
      while (nextIndex < mdFiles.length) {
        const filePath = mdFiles[nextIndex];
        nextIndex += 1;

        try {
          const metadata = await parseMarkdownFile(filePath);
          objects.set(metadata.id, metadata);
        } catch (err) {
          console.error(`Error parsing ${filePath}:`, err.message);
        }
      }
    });

    await Promise.all(workers);
  } catch (err) {
    console.error(`Error loading markdown files from ${dataPath}:`, err.message);
  }

  return objects;
}

export async function validateMarkdownCatalog(dataPath) {
  const results = {
    valid: 0,
    invalid: 0,
    errors: [],
  };

  const mdFiles = await getMarkdownFiles(dataPath);
  const concurrency = Math.max(
    1,
    Number(process.env.MARKDOWN_LOAD_CONCURRENCY) || DEFAULT_MARKDOWN_LOAD_CONCURRENCY
  );
  let nextIndex = 0;

  const workers = Array.from({ length: Math.min(concurrency, mdFiles.length) }, async () => {
    while (nextIndex < mdFiles.length) {
      const filePath = mdFiles[nextIndex];
      nextIndex += 1;

      try {
        const metadata = await parseMarkdownMetadataFile(filePath);
        const errors = validateMetadata(metadata);

        if (errors.length === 0) {
          results.valid += 1;
        } else {
          results.invalid += 1;
          results.errors.push({
            id: metadata.id || filePath,
            errors,
          });
        }
      } catch (err) {
        results.invalid += 1;
        results.errors.push({
          id: filePath,
          errors: [err.message],
        });
      }
    }
  });

  await Promise.all(workers);
  return results;
}

/**
 * Update YAML frontmatter fields in an existing markdown asset file.
 * Preserves the markdown body content.
 * @param {string} filePath - Absolute path to markdown file
 * @param {Object} updates - Frontmatter fields to merge
 * @returns {Object} Parsed updated metadata
 */
export async function updateMarkdownMetadata(filePath, updates) {
  const content = await readFile(filePath, 'utf-8');
  const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);

  if (!frontmatterMatch) {
    throw new Error(`No YAML frontmatter found in ${filePath}`);
  }

  let existing;
  try {
    existing = yaml.parse(frontmatterMatch[1]) || {};
  } catch {
    existing = parseFrontmatterLenient(frontmatterMatch[1]);
  }
  const merged = {
    ...existing,
    ...updates,
    last_updated: new Date().toISOString().split('T')[0],
  };

  const body = content.substring(frontmatterMatch[0].length).trimStart();
  const newContent = `---\n${yaml.stringify(merged)}---\n${body}`;

  await writeFile(filePath, newContent, 'utf-8');

  return parseMarkdownFile(filePath);
}

/**
 * Validate markdown metadata structure
 * @param {Object} metadata - Object metadata
 * @returns {Array} Array of validation errors (empty if valid)
 */
export function validateMetadata(metadata) {
  const errors = [];

  const required = ['name', 'database', 'type', 'owner'];
  for (const field of required) {
    if (!metadata[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  const validTypes = ['table', 'procedure', 'function', 'view', 'package', 'dataset', 'synonym'];
  if (metadata.type && !validTypes.includes(metadata.type)) {
    errors.push(`Invalid type: ${metadata.type}. Must be one of: ${validTypes.join(', ')}`);
  }

  const validSensitivity = ['public', 'internal', 'confidential', 'restricted'];
  if (metadata.sensitivity && !validSensitivity.includes(metadata.sensitivity)) {
    errors.push(
      `Invalid sensitivity: ${metadata.sensitivity}. Must be one of: ${validSensitivity.join(', ')}`
    );
  }

  if (metadata.tags && !Array.isArray(metadata.tags)) {
    errors.push('tags must be an array');
  }

  if (metadata.depends_on && !Array.isArray(metadata.depends_on)) {
    errors.push('depends_on must be an array');
  }
  if (metadata.columns && !Array.isArray(metadata.columns)) {
    errors.push('columns must be an array');
  }
  if (Array.isArray(metadata.columns)) {
    metadata.columns.forEach((column, index) => {
      if (!column || typeof column !== 'object') {
        errors.push(`columns[${index}] must be an object`);
        return;
      }
      if (!column.name) {
        errors.push(`columns[${index}] missing name`);
      }
      if (!column.column_id) {
        errors.push(`columns[${index}] missing column_id`);
      }
    });
  }
  if (metadata.column_usage && !Array.isArray(metadata.column_usage)) {
    errors.push('column_usage must be an array');
  }
  if (metadata.unresolved_column_usage && !Array.isArray(metadata.unresolved_column_usage)) {
    errors.push('unresolved_column_usage must be an array');
  }
  if (metadata.column_risk_flags && !Array.isArray(metadata.column_risk_flags)) {
    errors.push('column_risk_flags must be an array');
  }
  if (metadata.column_lineage && !Array.isArray(metadata.column_lineage)) {
    errors.push('column_lineage must be an array');
  }
  if (metadata.unresolved_column_lineage && !Array.isArray(metadata.unresolved_column_lineage)) {
    errors.push('unresolved_column_lineage must be an array');
  }
  if (metadata.ssis_column_mappings && !Array.isArray(metadata.ssis_column_mappings)) {
    errors.push('ssis_column_mappings must be an array');
  }
  if (
    metadata.ssis_column_mapping_summary &&
    (typeof metadata.ssis_column_mapping_summary !== 'object' ||
      Array.isArray(metadata.ssis_column_mapping_summary))
  ) {
    errors.push('ssis_column_mapping_summary must be an object');
  }
  if (
    metadata.ssis_column_mapping_sidecars &&
    !Array.isArray(metadata.ssis_column_mapping_sidecars)
  ) {
    errors.push('ssis_column_mapping_sidecars must be an array');
  }
  if (
    metadata.unresolved_ssis_column_mappings &&
    !Array.isArray(metadata.unresolved_ssis_column_mappings)
  ) {
    errors.push('unresolved_ssis_column_mappings must be an array');
  }
  if (
    metadata.lineage_quality &&
    (typeof metadata.lineage_quality !== 'object' || Array.isArray(metadata.lineage_quality))
  ) {
    errors.push('lineage_quality must be an object');
  }
  if (
    metadata.catalog_confidence &&
    (typeof metadata.catalog_confidence !== 'object' || Array.isArray(metadata.catalog_confidence))
  ) {
    errors.push('catalog_confidence must be an object');
  }
  if (metadata.created_by && !Array.isArray(metadata.created_by)) {
    errors.push('created_by must be an array');
  }
  if (metadata.created_via && !Array.isArray(metadata.created_via)) {
    errors.push('created_via must be an array');
  }
  if (metadata.used_by && !Array.isArray(metadata.used_by)) {
    errors.push('used_by must be an array');
  }
  if (metadata.contextual_reads && !Array.isArray(metadata.contextual_reads)) {
    errors.push('contextual_reads must be an array');
  }
  if (metadata.external_source !== undefined && typeof metadata.external_source !== 'boolean') {
    errors.push('external_source must be a boolean');
  }

  return errors;
}

export default {
  parseMarkdownFile,
  parseMarkdownMetadataFile,
  parseMarkdownContent,
  extractPlainText,
  getMarkdownFiles,
  loadAllMarkdown,
  validateMarkdownCatalog,
  validateMarkdownManifest,
  updateMarkdownMetadata,
  validateMetadata,
};
