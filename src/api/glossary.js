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
} from '../services/glossaryService.js';

const router = createApiRouter();

/**
 * GET /api/v1/glossary
 * List all glossary terms, optionally filtered by domain or search query
 * Query params: domain, q, status
 */
router.get('/', authenticate, (req, res) => {
  const { domain, q, status } = req.query;

  let terms = q ? searchTerms(q) : loadAllTerms();

  if (domain) {
    terms = terms.filter((t) => t.domain.toLowerCase() === domain.toLowerCase());
  }

  if (status) {
    terms = terms.filter((t) => t.status === status);
  }

  return res.json({
    status: 'success',
    count: terms.length,
    terms: terms.map((t) => ({
      slug: t.slug,
      term: t.term,
      domain: t.domain,
      status: t.status,
      owner: t.owner,
      steward: t.steward,
      abbreviation: t.abbreviation,
      related_terms: t.related_terms,
      tags: t.tags,
      last_reviewed: t.last_reviewed,
    })),
  });
});

/**
 * GET /api/v1/glossary/domains
 * List all unique domains represented in the glossary
 */
router.get('/domains', authenticate, (_req, res) => {
  const domains = getGlossaryDomains();
  return res.json({ status: 'success', domains });
});

/**
 * GET /api/v1/glossary/:slug
 * Get a single glossary term by slug (filename without .md)
 */
router.get('/:slug', authenticate, (req, res) => {
  const term = getTermBySlug(req.params.slug);

  if (!term) {
    return sendErrorResponse(res, req, 404, `Glossary term '${req.params.slug}' not found`, {
      code: 'NOT_FOUND',
    });
  }

  return res.json({ status: 'success', term });
});

/**
 * POST /api/v1/glossary
 * Create a new glossary term
 * Body: { term, domain, status, owner, steward, abbreviation, related_terms, tags, definition }
 */
router.post('/', authenticate, (req, res) => {
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

  const slug = term
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  // Check for duplicate
  const existing = getTermBySlug(slug);
  if (existing) {
    return sendErrorResponse(res, req, 409, `Term '${term}' already exists (slug: ${slug})`, {
      code: 'CONFLICT',
    });
  }

  try {
    const saved = saveTerm(slug, {
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
router.put('/:slug', authenticate, (req, res) => {
  const { slug } = req.params;
  const existing = getTermBySlug(slug);

  if (!existing) {
    return sendErrorResponse(res, req, 404, `Glossary term '${slug}' not found`, {
      code: 'NOT_FOUND',
    });
  }

  try {
    const updated = saveTerm(slug, {
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

export default router;
