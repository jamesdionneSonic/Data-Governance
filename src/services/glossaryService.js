/**
 * Glossary Service
 * Reads and serves governed business glossary terms from data/glossary/*.md.
 */

import { mkdir, readdir, readFile, unlink, writeFile } from 'fs/promises';
import path, { join, extname, basename } from 'path';
import yaml from 'yaml';
import { fileURLToPath } from 'url';

const fileName = fileURLToPath(import.meta.url);
const dirName = path.dirname(fileName);

const GLOSSARY_DIR = path.resolve(dirName, '../../data/glossary');
const VERSION_HISTORY_LIMIT = 25;

function today() {
  return new Date().toISOString().split('T')[0];
}

function nowIso() {
  return new Date().toISOString();
}

export function slugifyTerm(value = '') {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function ensureArray(value) {
  if (Array.isArray(value)) return value.filter((item) => item !== null && item !== undefined);
  if (value === null || value === undefined || value === '') return [];
  if (typeof value === 'string') {
    return value
      .split(/[|;,]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [value];
}

function normalizeString(value) {
  return String(value || '').trim();
}

function stripMarkdown(value = '') {
  return String(value)
    .replace(/^#+\s+/gm, '')
    .replace(/[*_`[\]]/g, '')
    .replace(/\((.*?)\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractDefinition(body = '', meta = {}) {
  if (meta.definition) return normalizeString(meta.definition);
  const definitionMatch = String(body).match(/##\s+Definition\s*([\s\S]*?)(?:\n##\s+|$)/i);
  if (definitionMatch) return stripMarkdown(definitionMatch[1]);
  return stripMarkdown(body).slice(0, 1000);
}

function normalizeAssetLink(link) {
  if (!link) return null;
  if (typeof link === 'string') {
    return {
      asset_id: link.trim(),
      type: 'asset',
      relationship: 'related',
      confidence: 0.8,
    };
  }

  const assetId = normalizeString(
    link.asset_id || link.assetId || link.id || link.name || link.object_id || link.object
  );

  if (!assetId) return null;

  return {
    asset_id: assetId,
    type: normalizeString(link.type || link.asset_type || 'asset'),
    relationship: normalizeString(link.relationship || link.mapping_type || 'related'),
    confidence:
      Number.isFinite(Number(link.confidence)) && Number(link.confidence) >= 0
        ? Number(link.confidence)
        : 0.8,
    mapped_by: link.mapped_by || link.mappedBy || null,
    mapped_at: link.mapped_at || link.mappedAt || null,
    notes: link.notes || null,
  };
}

function normalizeAssetLinks(value) {
  return ensureArray(value).map(normalizeAssetLink).filter(Boolean);
}

export function normalizeGlossaryTerm(raw = {}) {
  const slug = raw.slug || slugifyTerm(raw.term || raw.name || '');
  const body = raw.body || '';
  const definition = normalizeString(raw.definition) || extractDefinition(body, raw);
  const relatedTerms = ensureArray(raw.related_terms || raw.relatedTerms);
  const synonyms = ensureArray(raw.synonyms || raw.aliases);
  const assets = normalizeAssetLinks(raw.assets || raw.linked_assets || raw.semantic_mappings);

  return {
    slug,
    term: raw.term || raw.name || slug,
    domain: raw.domain || 'General',
    status: raw.status || 'draft',
    owner: raw.owner || 'unknown',
    business_owner: raw.business_owner || raw.businessOwner || raw.owner || 'unknown',
    steward: raw.steward || null,
    reviewers: ensureArray(raw.reviewers),
    abbreviation: raw.abbreviation || null,
    parent: raw.parent || raw.parent_slug || null,
    children: ensureArray(raw.children),
    related_terms: relatedTerms,
    synonyms,
    tags: ensureArray(raw.tags),
    assets,
    asset_count: assets.length,
    version: Number(raw.version || 1),
    version_history: ensureArray(raw.version_history).slice(-VERSION_HISTORY_LIMIT),
    effective_from: raw.effective_from || raw.effectiveFrom || raw.created_at || null,
    effective_to: raw.effective_to || raw.effectiveTo || null,
    created_at: raw.created_at || null,
    updated_at: raw.updated_at || null,
    last_reviewed: raw.last_reviewed || null,
    definition,
    body,
    filePath: raw.filePath || null,
  };
}

/**
 * Parse a single glossary markdown file.
 * @param {string} filePath
 * @returns {Object} Parsed glossary term
 */
async function parseGlossaryFile(filePath) {
  const content = await readFile(filePath, 'utf-8');
  const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);

  if (!fmMatch) {
    throw new Error(`No YAML frontmatter in ${filePath}`);
  }

  const meta = yaml.parse(fmMatch[1]) || {};
  const body = content.substring(fmMatch[0].length).trim();
  const slug = basename(filePath, '.md');

  return normalizeGlossaryTerm({
    ...meta,
    slug,
    body,
    filePath,
  });
}

/**
 * Load all glossary terms from GLOSSARY_DIR.
 * @returns {Array} Array of glossary term objects
 */
export async function loadAllTerms() {
  const terms = [];

  try {
    const entries = await readdir(GLOSSARY_DIR, { withFileTypes: true });
    await Promise.all(
      entries.map(async (entry) => {
        if (entry.isFile() && extname(entry.name) === '.md') {
          try {
            const fullPath = join(GLOSSARY_DIR, entry.name);
            terms.push(await parseGlossaryFile(fullPath));
          } catch (err) {
            console.error(`[glossaryService] Error parsing ${entry.name}:`, err.message);
          }
        }
      })
    );
  } catch {
    return [];
  }

  const bySlug = new Map(terms.map((term) => [term.slug, term]));
  for (const term of terms) {
    if (term.parent && bySlug.has(term.parent)) {
      const parent = bySlug.get(term.parent);
      if (!parent.children.includes(term.slug)) parent.children.push(term.slug);
    }
  }

  return terms.sort((a, b) => a.term.localeCompare(b.term));
}

/**
 * Get a single glossary term by slug.
 * @param {string} slug
 * @returns {Object|null}
 */
export async function getTermBySlug(slug) {
  const filePath = join(GLOSSARY_DIR, `${slug}.md`);
  try {
    return await parseGlossaryFile(filePath);
  } catch {
    return null;
  }
}

/**
 * Get all unique domains in the glossary.
 * @returns {string[]}
 */
export async function getGlossaryDomains() {
  const terms = await loadAllTerms();
  const domains = [...new Set(terms.map((t) => t.domain))];
  return domains.sort();
}

function termSearchText(term) {
  return [
    term.term,
    term.slug,
    term.domain,
    term.status,
    term.owner,
    term.business_owner,
    term.steward,
    term.abbreviation,
    term.definition,
    term.body,
    ...(term.synonyms || []),
    ...(term.related_terms || []),
    ...(term.tags || []),
    ...(term.assets || []).flatMap((asset) => [asset.asset_id, asset.type, asset.relationship]),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

/**
 * Search terms by query string.
 * @param {string} query
 * @returns {Array}
 */
export async function searchTerms(query) {
  if (!query) return loadAllTerms();
  const q = query.toLowerCase();
  const terms = await loadAllTerms();
  return terms.filter((term) => termSearchText(term).includes(q));
}

function termChanged(existing, next) {
  if (!existing) return false;
  const keys = [
    'term',
    'domain',
    'status',
    'owner',
    'business_owner',
    'steward',
    'definition',
    'body',
    'parent',
  ];
  if (
    keys.some((key) => JSON.stringify(existing[key] || null) !== JSON.stringify(next[key] || null))
  ) {
    return true;
  }

  const arrayKeys = ['related_terms', 'synonyms', 'tags', 'assets'];
  return arrayKeys.some(
    (key) => JSON.stringify(existing[key] || []) !== JSON.stringify(next[key] || [])
  );
}

function versionSnapshot(existing, changedBy) {
  return {
    version: existing.version || 1,
    changed_at: nowIso(),
    changed_by: changedBy || 'system',
    effective_from: existing.effective_from || existing.created_at || null,
    effective_to: today(),
    definition: existing.definition || '',
    term: existing.term,
    status: existing.status,
  };
}

function toFrontmatter(term) {
  return {
    term: term.term,
    domain: term.domain || 'General',
    status: term.status || 'draft',
    owner: term.owner || 'unknown',
    business_owner: term.business_owner || term.owner || 'unknown',
    steward: term.steward || null,
    reviewers: term.reviewers || [],
    abbreviation: term.abbreviation || null,
    parent: term.parent || null,
    children: term.children || [],
    related_terms: term.related_terms || [],
    synonyms: term.synonyms || [],
    tags: term.tags || [],
    assets: term.assets || [],
    version: term.version || 1,
    version_history: term.version_history || [],
    effective_from: term.effective_from || term.created_at || today(),
    effective_to: term.effective_to || null,
    created_at: term.created_at || today(),
    updated_at: term.updated_at || nowIso(),
    last_reviewed: term.last_reviewed || today(),
  };
}

/**
 * Write a new or updated glossary term to disk.
 * @param {string} slug
 * @param {Object} termData
 */
export async function saveTerm(slug, termData) {
  await mkdir(GLOSSARY_DIR, { recursive: true });

  const existing = await getTermBySlug(slug);
  const next = normalizeGlossaryTerm({
    ...existing,
    ...termData,
    slug,
    created_at: termData.created_at || existing?.created_at || today(),
    effective_from: termData.effective_from || existing?.effective_from || today(),
  });

  const changed = termChanged(existing, next);
  const versionHistory = ensureArray(termData.version_history || existing?.version_history);
  if (changed) {
    versionHistory.push(versionSnapshot(existing, termData.changed_by || termData.updated_by));
  }

  const savedTerm = normalizeGlossaryTerm({
    ...next,
    version: existing && changed ? Number(existing.version || 1) + 1 : next.version || 1,
    version_history: versionHistory.slice(-VERSION_HISTORY_LIMIT),
    updated_at: nowIso(),
    last_reviewed: termData.last_reviewed || existing?.last_reviewed || today(),
  });

  const frontmatter = yaml.stringify(toFrontmatter(savedTerm));
  const definitionChanged =
    termData.definition && (!existing || termData.definition !== existing.definition);
  const body =
    termData.body ||
    (definitionChanged
      ? `# ${savedTerm.term}\n\n## Definition\n\n${termData.definition}`
      : savedTerm.body) ||
    `# ${savedTerm.term}\n\n## Definition\n\n${savedTerm.definition || termData.definition || ''}`;
  const content = `---\n${frontmatter}---\n\n${body}\n`;

  const filePath = join(GLOSSARY_DIR, `${slug}.md`);
  await writeFile(filePath, content, 'utf-8');

  return parseGlossaryFile(filePath);
}

export async function getTermVersions(slug) {
  const term = await getTermBySlug(slug);
  if (!term) return null;
  return {
    current: {
      version: term.version,
      effective_from: term.effective_from,
      effective_to: term.effective_to,
      definition: term.definition,
      status: term.status,
    },
    history: term.version_history || [],
  };
}

export async function linkTermToAsset(slug, mapping) {
  const term = await getTermBySlug(slug);
  if (!term) return null;

  const normalized = normalizeAssetLink({
    ...mapping,
    mapped_at: mapping.mapped_at || nowIso(),
  });
  if (!normalized) {
    throw new Error('asset_id is required');
  }

  const assets = (term.assets || []).filter(
    (asset) => asset.asset_id.toLowerCase() !== normalized.asset_id.toLowerCase()
  );
  assets.push(normalized);

  return saveTerm(slug, {
    ...term,
    assets,
  });
}

export async function unlinkTermFromAsset(slug, assetId) {
  const term = await getTermBySlug(slug);
  if (!term) return null;

  return saveTerm(slug, {
    ...term,
    assets: (term.assets || []).filter(
      (asset) => asset.asset_id.toLowerCase() !== String(assetId).toLowerCase()
    ),
  });
}

export async function deleteTerm(slug) {
  const term = await getTermBySlug(slug);
  if (!term) return null;

  await unlink(join(GLOSSARY_DIR, `${slug}.md`));
  return term;
}

function csvEscape(value) {
  const text = Array.isArray(value) ? value.join('|') : String(value ?? '');
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function serializeTermsCsv(terms) {
  const columns = [
    'slug',
    'term',
    'domain',
    'status',
    'business_owner',
    'owner',
    'steward',
    'synonyms',
    'related_terms',
    'assets',
    'definition',
  ];

  const rows = terms.map((term) =>
    columns
      .map((column) => {
        if (column === 'assets') {
          return csvEscape((term.assets || []).map((asset) => asset.asset_id));
        }
        return csvEscape(term[column]);
      })
      .join(',')
  );

  return [columns.join(','), ...rows].join('\n');
}

export function parseTermsCsv(content) {
  const rows = [];
  let current = '';
  let row = [];
  let quoted = false;

  for (let i = 0; i < content.length; i += 1) {
    const char = content[i];
    const next = content[i + 1];
    if (char === '"' && quoted && next === '"') {
      current += '"';
      i += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === ',' && !quoted) {
      row.push(current);
      current = '';
    } else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && next === '\n') i += 1;
      row.push(current);
      if (row.some((cell) => cell.trim())) rows.push(row);
      row = [];
      current = '';
    } else {
      current += char;
    }
  }

  row.push(current);
  if (row.some((cell) => cell.trim())) rows.push(row);
  if (rows.length < 2) return [];

  const headers = rows[0].map((header) => header.trim());
  return rows.slice(1).map((values) => {
    const record = {};
    headers.forEach((header, index) => {
      record[header] = values[index] || '';
    });
    record.synonyms = ensureArray(record.synonyms);
    record.related_terms = ensureArray(record.related_terms);
    record.assets = normalizeAssetLinks(record.assets);
    return record;
  });
}

export async function importTerms({ terms, content, format = 'json' }) {
  const records =
    format === 'csv' ? parseTermsCsv(content || '') : Array.isArray(terms) ? terms : [];
  const saved = [];
  const errors = [];

  for (const record of records) {
    const slug = record.slug || slugifyTerm(record.term || record.name);
    if (!slug || !record.term) {
      errors.push({ term: record.term || slug || '(missing)', error: 'term is required' });
      continue;
    }

    try {
      saved.push(await saveTerm(slug, record));
    } catch (err) {
      errors.push({ term: record.term || slug, error: err.message });
    }
  }

  return {
    imported: saved.length,
    failed: errors.length,
    terms: saved,
    errors,
  };
}

function objectSearchText(asset = {}, assetId = '') {
  return [
    assetId,
    asset.id,
    asset.name,
    asset.object,
    asset.database,
    asset.schema,
    asset.type,
    asset.object_type,
    asset.description,
    asset.owner,
    ...(asset.tags || []),
    ...(asset.columns || []).flatMap((column) => [column.name, column.description]),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function getObjectEntry(objects, assetId) {
  if (!objects) return null;
  if (objects instanceof Map) return objects.get(assetId) ? [assetId, objects.get(assetId)] : null;
  if (typeof objects === 'object' && objects[assetId]) return [assetId, objects[assetId]];
  return null;
}

function objectEntries(objects) {
  if (!objects) return [];
  if (objects instanceof Map) return Array.from(objects.entries());
  if (Array.isArray(objects)) {
    return objects.map((asset) => [
      asset.id || `${asset.database || 'unknown'}.${asset.name}`,
      asset,
    ]);
  }
  return Object.entries(objects);
}

export function resolveAssetGlossaryLinks(assetId, asset = {}, terms = []) {
  const normalizedId = String(assetId || '').toLowerCase();
  const metadataTerms = ensureArray(
    asset.glossary_terms || asset.semantic_terms || asset.business_terms || asset.tags
  ).map((value) => String(value).toLowerCase());

  return terms
    .filter((term) => {
      const explicit = (term.assets || []).some(
        (link) => link.asset_id.toLowerCase() === normalizedId
      );
      const semantic = [term.slug, term.term, ...(term.synonyms || [])].some((label) =>
        metadataTerms.includes(String(label).toLowerCase())
      );
      return explicit || semantic;
    })
    .map((term) => ({
      slug: term.slug,
      term: term.term,
      domain: term.domain,
      relationship:
        (term.assets || []).find((link) => link.asset_id.toLowerCase() === normalizedId)
          ?.relationship || 'semantic_match',
    }))
    .slice(0, 10);
}

export async function resolveBusinessQuery(query, objects, options = {}) {
  const q = normalizeString(query).toLowerCase();
  const limit = Number(options.limit || 25);
  const terms = options.terms || (await loadAllTerms());
  if (!q) return { query, terms: [], assets: [] };

  const matchedTerms = terms
    .map((term) => {
      const labels = [term.term, term.slug, term.abbreviation, ...(term.synonyms || [])]
        .filter(Boolean)
        .map((label) => String(label).toLowerCase());
      const exact = labels.some((label) => label === q);
      const labelMatch = labels.some((label) => label.includes(q) || q.includes(label));
      const textMatch = termSearchText(term).includes(q);
      const score = exact ? 1 : labelMatch ? 0.86 : textMatch ? 0.62 : 0;
      return score > 0 ? { ...term, match_score: score } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.match_score - a.match_score);

  const assetScores = new Map();
  for (const term of matchedTerms) {
    for (const link of term.assets || []) {
      const entry = getObjectEntry(objects, link.asset_id);
      const asset = entry?.[1] || { id: link.asset_id, name: link.asset_id, type: link.type };
      const id = entry?.[0] || link.asset_id;
      assetScores.set(id, {
        asset_id: id,
        asset,
        score: Math.max(assetScores.get(id)?.score || 0, term.match_score + link.confidence),
        reason: `Linked to glossary term '${term.term}' (${link.relationship})`,
        terms: [term.slug],
      });
    }
  }

  const termLabels = matchedTerms.flatMap((term) => [
    term.term,
    term.slug,
    ...(term.synonyms || []),
  ]);
  for (const [assetId, asset] of objectEntries(objects)) {
    const text = objectSearchText(asset, assetId);
    const match = termLabels.find((label) => label && text.includes(String(label).toLowerCase()));
    if (match && !assetScores.has(assetId)) {
      assetScores.set(assetId, {
        asset_id: assetId,
        asset,
        score: 0.55,
        reason: `Catalog metadata mentions '${match}'`,
        terms: matchedTerms.map((term) => term.slug).slice(0, 3),
      });
    }
  }

  return {
    query,
    terms: matchedTerms.map((term) => ({
      slug: term.slug,
      term: term.term,
      domain: term.domain,
      definition: term.definition,
      synonyms: term.synonyms,
      asset_count: term.asset_count,
      match_score: term.match_score,
    })),
    assets: Array.from(assetScores.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((match) => ({
        asset_id: match.asset_id,
        name: match.asset.name || match.asset_id,
        database: match.asset.database || null,
        schema: match.asset.schema || null,
        type: match.asset.type || match.asset.object_type || 'asset',
        score: Number(match.score.toFixed(3)),
        reason: match.reason,
        terms: match.terms,
      })),
  };
}

export default {
  loadAllTerms,
  getTermBySlug,
  getGlossaryDomains,
  searchTerms,
  saveTerm,
  getTermVersions,
  linkTermToAsset,
  unlinkTermFromAsset,
  deleteTerm,
  importTerms,
  resolveBusinessQuery,
  resolveAssetGlossaryLinks,
  serializeTermsCsv,
  parseTermsCsv,
  slugifyTerm,
};
