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
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

  if (!frontmatterMatch) {
    throw new Error(`No YAML frontmatter found in ${source}`);
  }

  const frontmatterContent = frontmatterMatch[1];
  const metadata = yaml.parse(frontmatterContent);
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
    database: metadata.database,
    type: metadata.type,
    owner: metadata.owner || 'unknown',
    steward: metadata.steward || null,
    domain_manager: metadata.domain_manager || null,
    custodian: metadata.custodian || null,
    sensitivity: metadata.sensitivity || 'public',
    tags: metadata.tags || [],
    depends_on: metadata.depends_on || [],
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

  const existing = yaml.parse(frontmatterMatch[1]) || {};
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

  const validTypes = ['table', 'procedure', 'function', 'view', 'package', 'dataset'];
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
