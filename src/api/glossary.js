/**
 * Glossary API Routes
 * CRUD endpoints for business glossary terms stored in data/glossary/*.md
 */

import { createApiRouter } from '../utils/apiRouter.js';
import { authenticate } from '../middleware/auth.js';
import { sendErrorResponse } from '../middleware/errorHandler.js';
import {
  loadAllTerms,
  getTermBySlug,
  getGlossaryDomains,
  searchTerms,
  saveTerm,
  getTermVersions,
  importTerms,
  linkTermToAsset,
  resolveBusinessQuery,
  serializeTermsCsv,
  slugifyTerm,
  unlinkTermFromAsset,
  deleteTerm,
} from '../services/glossaryService.js';

const router = createApiRouter();
let objectCache = new Map();

export function setGlossaryCache(objects) {
  objectCache = objects instanceof Map ? objects : new Map();
}

function summarizeTerm(t) {
  return {
    slug: t.slug,
    term: t.term,
    domain: t.domain,
    status: t.status,
    owner: t.owner,
    business_owner: t.business_owner,
    steward: t.steward,
    abbreviation: t.abbreviation,
    parent: t.parent,
    children: t.children,
    related_terms: t.related_terms,
    synonyms: t.synonyms,
    tags: t.tags,
    asset_count: t.asset_count,
    version: t.version,
    effective_from: t.effective_from,
    last_reviewed: t.last_reviewed,
  };
}

/**
 * GET /api/v1/glossary
 * List all glossary terms, optionally filtered by domain or search query
 * Query params: domain, q, status
 */
router.get('/', authenticate, async (req, res) => {
  const { domain, q, status } = req.query;

  let terms = q ? await searchTerms(q) : await loadAllTerms();

  if (domain) {
    terms = terms.filter((t) => t.domain.toLowerCase() === domain.toLowerCase());
  }

  if (status) {
    terms = terms.filter((t) => t.status === status);
  }

  return res.json({
    status: 'success',
    count: terms.length,
    terms: terms.map(summarizeTerm),
  });
});

/**
 * GET /api/v1/glossary/domains
 * List all unique domains represented in the glossary
 */
router.get('/domains', authenticate, async (_req, res) => {
  const domains = await getGlossaryDomains();
  return res.json({ status: 'success', domains });
});

/**
 * GET /api/v1/glossary/resolve?q=business-term
 * Resolve business language to glossary terms and physical assets.
 */
router.get('/resolve', authenticate, async (req, res) => {
  const { q = '', limit = 25 } = req.query;
  const resolution = await resolveBusinessQuery(q, objectCache, { limit });
  return res.json({ status: 'success', resolution });
});

/**
 * GET /api/v1/glossary/export?format=json|csv
 * Export governed glossary terms.
 */
router.get('/export', authenticate, async (req, res) => {
  const { format = 'json' } = req.query;
  const terms = await loadAllTerms();

  if (format === 'csv') {
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="business-glossary.csv"');
    return res.send(serializeTermsCsv(terms));
  }

  return res.json({ status: 'success', count: terms.length, terms });
});

/**
 * POST /api/v1/glossary/import
 * Import glossary terms from JSON array or CSV content.
 */
router.post('/import', authenticate, async (req, res) => {
  try {
    const result = await importTerms(req.body || {});
    return res.json({ status: 'success', ...result });
  } catch (err) {
    return sendErrorResponse(res, req, 500, err.message, {
      code: 'GLOSSARY_IMPORT_ERROR',
    });
  }
});

/**
 * GET /api/v1/glossary/:slug
 * Get a single glossary term by slug (filename without .md)
 */
router.get('/:slug', authenticate, async (req, res) => {
  const term = await getTermBySlug(req.params.slug);

  if (!term) {
    return sendErrorResponse(res, req, 404, `Glossary term '${req.params.slug}' not found`, {
      code: 'NOT_FOUND',
    });
  }

  return res.json({ status: 'success', term });
});

/**
 * GET /api/v1/glossary/:slug/versions
 * Return current and historical term definition versions.
 */
router.get('/:slug/versions', authenticate, async (req, res) => {
  const versions = await getTermVersions(req.params.slug);

  if (!versions) {
    return sendErrorResponse(res, req, 404, `Glossary term '${req.params.slug}' not found`, {
      code: 'NOT_FOUND',
    });
  }

  return res.json({ status: 'success', versions });
});

/**
 * POST /api/v1/glossary/:slug/assets
 * Link a glossary term to a physical data asset.
 */
router.post('/:slug/assets', authenticate, async (req, res) => {
  try {
    const updated = await linkTermToAsset(req.params.slug, req.body || {});

    if (!updated) {
      return sendErrorResponse(res, req, 404, `Glossary term '${req.params.slug}' not found`, {
        code: 'NOT_FOUND',
      });
    }

    return res.json({ status: 'success', term: updated });
  } catch (err) {
    return sendErrorResponse(res, req, 400, err.message, {
      code: 'GLOSSARY_ASSET_LINK_ERROR',
    });
  }
});

/**
 * POST /api/v1/glossary/:slug/assets/unlink
 * Remove a glossary-to-asset mapping.
 */
router.post('/:slug/assets/unlink', authenticate, async (req, res) => {
  const { asset_id: assetId } = req.body || {};
  if (!assetId) {
    return sendErrorResponse(res, req, 400, 'asset_id is required', {
      code: 'BAD_REQUEST',
    });
  }

  const updated = await unlinkTermFromAsset(req.params.slug, assetId);
  if (!updated) {
    return sendErrorResponse(res, req, 404, `Glossary term '${req.params.slug}' not found`, {
      code: 'NOT_FOUND',
    });
  }

  return res.json({ status: 'success', term: updated });
});

/**
 * POST /api/v1/glossary
 * Create a new glossary term
 * Body: { term, domain, status, owner, steward, abbreviation, related_terms, tags, definition }
 */
router.post('/', authenticate, async (req, res) => {
  const { term, domain, definition } = req.body;

  if (!term) {
    return sendErrorResponse(res, req, 400, 'term is required', {
      code: 'BAD_REQUEST',
    });
  }

  if (!definition) {
    return sendErrorResponse(res, req, 400, 'definition is required', {
      code: 'BAD_REQUEST',
    });
  }

  const slug = slugifyTerm(term);

  // Check for duplicate
  const existing = await getTermBySlug(slug);
  if (existing) {
    return sendErrorResponse(res, req, 409, `Term '${term}' already exists (slug: ${slug})`, {
      code: 'CONFLICT',
    });
  }

  try {
    const saved = await saveTerm(slug, {
      ...req.body,
      domain: domain || 'General',
    });

    return res.status(201).json({ status: 'success', term: saved });
  } catch (err) {
    return sendErrorResponse(res, req, 500, err.message, {
      code: 'GLOSSARY_CREATE_ERROR',
    });
  }
});

/**
 * PUT /api/v1/glossary/:slug
 * Update an existing glossary term
 */
router.put('/:slug', authenticate, async (req, res) => {
  const { slug } = req.params;
  const existing = await getTermBySlug(slug);

  if (!existing) {
    return sendErrorResponse(res, req, 404, `Glossary term '${slug}' not found`, {
      code: 'NOT_FOUND',
    });
  }

  try {
    const updated = await saveTerm(slug, {
      ...existing,
      ...req.body,
    });

    return res.json({ status: 'success', term: updated });
  } catch (err) {
    return sendErrorResponse(res, req, 500, err.message, {
      code: 'GLOSSARY_UPDATE_ERROR',
    });
  }
});

/**
 * DELETE /api/v1/glossary/:slug
 * Delete an existing glossary term.
 */
router.delete('/:slug', authenticate, async (req, res) => {
  try {
    const deleted = await deleteTerm(req.params.slug);

    if (!deleted) {
      return sendErrorResponse(res, req, 404, `Glossary term '${req.params.slug}' not found`, {
        code: 'NOT_FOUND',
      });
    }

    return res.json({ status: 'success', term: summarizeTerm(deleted) });
  } catch (err) {
    return sendErrorResponse(res, req, 500, err.message, {
      code: 'GLOSSARY_DELETE_ERROR',
    });
  }
});

export default router;
