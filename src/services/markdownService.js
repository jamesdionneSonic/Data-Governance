/**
 * Markdown Service
 * Parses markdown files and extracts object metadata
 */

import { readFileSync, readdirSync, writeFileSync } from 'fs';
import { join, extname } from 'path';
import yaml from 'yaml';

/**
 * Parse markdown file and extract metadata
 */
export function parseMarkdownFile(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  return parseMarkdownContent(content, filePath);
}

/**
 * Parse markdown content string and extract metadata
 * @param {string} content - Markdown content including YAML frontmatter
 * @param {string} source - Source label (file name or path)
 * @returns {Object} Parsed metadata
 */
export function parseMarkdownContent(content, source = 'inline-content') {
  const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);

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
  const markdownContent = content.substring(frontmatterMatch[0].length).trim();
  const description = extractPlainText(markdownContent);

  const required = ['name', 'database', 'type'];
  for (const field of required) {
    if (!metadata[field]) {
      throw new Error(`Missing required field: ${field} in ${source}`);
    }
  }

  return {
    id: `${metadata.database}.${metadata.name}`,
    name: metadata.name,
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
    depends_on: metadata.depends_on || [],
    reads_from: metadata.reads_from || metadata.lineage?.reads_from || [],
    writes_to: metadata.writes_to || metadata.lineage?.writes_to || [],
    calls: metadata.calls || metadata.lineage?.calls || [],
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

function parseFrontmatterLenient(frontmatterContent) {
  const metadata = {};
  let currentKey = null;

  const lines = String(frontmatterContent || '').split(/\r?\n/);
  for (let rawLine of lines) {
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

/**
 * Read all markdown files from directory
 * @param {string} dirPath - Directory path
 * @returns {Array} Array of file paths
 */
export function getMarkdownFiles(dirPath) {
  const files = [];

  function walkDir(currentPath) {
    try {
      const entries = readdirSync(currentPath, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = join(currentPath, entry.name);
        if (entry.isDirectory()) {
          walkDir(fullPath);
        } else if (entry.isFile() && extname(entry.name) === '.md') {
          files.push(fullPath);
        }
      }
    } catch (err) {
      console.error(`Error reading directory ${currentPath}:`, err.message);
    }
  }

  walkDir(dirPath);
  return files;
}

/**
 * Load all markdown files from data directory
 * @param {string} dataPath - Base data directory path
 * @returns {Map} Map of object ID -> metadata
 */
export function loadAllMarkdown(dataPath) {
  const objects = new Map();

  try {
    const mdFiles = getMarkdownFiles(dataPath);
    for (const filePath of mdFiles) {
      try {
        const metadata = parseMarkdownFile(filePath);
        objects.set(metadata.id, metadata);
      } catch (err) {
        console.error(`Error parsing ${filePath}:`, err.message);
      }
    }
  } catch (err) {
    console.error(`Error loading markdown files from ${dataPath}:`, err.message);
  }

  return objects;
}

/**
 * Update YAML frontmatter fields in an existing markdown asset file.
 * Preserves the markdown body content.
 * @param {string} filePath - Absolute path to markdown file
 * @param {Object} updates - Frontmatter fields to merge
 * @returns {Object} Parsed updated metadata
 */
export function updateMarkdownMetadata(filePath, updates) {
  const content = readFileSync(filePath, 'utf-8');
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

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

  writeFileSync(filePath, newContent, 'utf-8');

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

  return errors;
}

export default {
  parseMarkdownFile,
  parseMarkdownContent,
  extractPlainText,
  getMarkdownFiles,
  loadAllMarkdown,
  updateMarkdownMetadata,
  validateMetadata,
};
