/**
 * Glossary Service
 * Reads and serves business glossary terms from data/glossary/*.md
 */

import { readFileSync, readdirSync, writeFileSync } from 'fs';
import path, { join, extname, basename } from 'path';
import yaml from 'yaml';
import { fileURLToPath } from 'url';

const fileName = fileURLToPath(import.meta.url);
const dirName = path.dirname(fileName);

const GLOSSARY_DIR = path.resolve(dirName, '../../data/glossary');

/**
 * Parse a single glossary markdown file
 * @param {string} filePath
 * @returns {Object} Parsed glossary term
 */
function parseGlossaryFile(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);

  if (!fmMatch) {
    throw new Error(`No YAML frontmatter in ${filePath}`);
  }

  const meta = yaml.parse(fmMatch[1]);
  const body = content.substring(fmMatch[0].length).trim();

  const slug = basename(filePath, '.md');

  return {
    slug,
    term: meta.term || slug,
    domain: meta.domain || 'General',
    status: meta.status || 'draft',
    owner: meta.owner || 'unknown',
    steward: meta.steward || null,
    abbreviation: meta.abbreviation || null,
    related_terms: meta.related_terms || [],
    tags: meta.tags || [],
    created_at: meta.created_at || null,
    last_reviewed: meta.last_reviewed || null,
    body,
    filePath,
  };
}

/**
 * Load all glossary terms from GLOSSARY_DIR
 * @returns {Array} Array of glossary term objects
 */
export function loadAllTerms() {
  const terms = [];

  let entries;
  try {
    entries = readdirSync(GLOSSARY_DIR, { withFileTypes: true });
  } catch {
    return [];
  }

  for (const entry of entries) {
    if (entry.isFile() && extname(entry.name) === '.md') {
      try {
        const fullPath = join(GLOSSARY_DIR, entry.name);
        terms.push(parseGlossaryFile(fullPath));
      } catch (err) {
        console.error(`[glossaryService] Error parsing ${entry.name}:`, err.message);
      }
    }
  }

  return terms.sort((a, b) => a.term.localeCompare(b.term));
}

/**
 * Get a single glossary term by slug
 * @param {string} slug
 * @returns {Object|null}
 */
export function getTermBySlug(slug) {
  const filePath = join(GLOSSARY_DIR, `${slug}.md`);
  try {
    return parseGlossaryFile(filePath);
  } catch {
    return null;
  }
}

/**
 * Get all unique domains in the glossary
 * @returns {string[]}
 */
export function getGlossaryDomains() {
  const terms = loadAllTerms();
  const domains = [...new Set(terms.map((t) => t.domain))];
  return domains.sort();
}

/**
 * Search terms by query string (simple substring match on term + body)
 * @param {string} query
 * @returns {Array}
 */
export function searchTerms(query) {
  if (!query) return loadAllTerms();
  const q = query.toLowerCase();
  return loadAllTerms().filter(
    (t) =>
      t.term.toLowerCase().includes(q) ||
      t.body.toLowerCase().includes(q) ||
      t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
      t.domain.toLowerCase().includes(q)
  );
}

/**
 * Write a new or updated glossary term to disk
 * @param {string} slug
 * @param {Object} termData
 */
export function saveTerm(slug, termData) {
  const frontmatter = yaml.stringify({
    term: termData.term,
    domain: termData.domain || 'General',
    status: termData.status || 'draft',
    owner: termData.owner || 'unknown',
    steward: termData.steward || null,
    abbreviation: termData.abbreviation || null,
    related_terms: termData.related_terms || [],
    tags: termData.tags || [],
    created_at: termData.created_at || new Date().toISOString().split('T')[0],
    last_reviewed: new Date().toISOString().split('T')[0],
  });

  const body =
    termData.body || `# ${termData.term}\n\n## Definition\n\n${termData.definition || ''}`;
  const content = `---\n${frontmatter}---\n\n${body}\n`;

  const filePath = join(GLOSSARY_DIR, `${slug}.md`);
  writeFileSync(filePath, content, 'utf-8');

  return parseGlossaryFile(filePath);
}

export default {
  loadAllTerms,
  getTermBySlug,
  getGlossaryDomains,
  searchTerms,
  saveTerm,
};
