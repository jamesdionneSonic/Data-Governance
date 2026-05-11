/**
 * Search Routes
 * Full-text search with faceted filtering
 */

import { createApiRouter } from '../utils/apiRouter.js';
import { authenticate } from '../middleware/auth.js';
import { sendErrorResponse } from '../middleware/errorHandler.js';
import { computeTrustScore } from '../services/trustService.js';
import { classifyAsset } from '../services/classificationService.js';

const router = createApiRouter();
let objectCache = new Map();

export function setSearchCache(objects) {
  objectCache = objects || new Map();
}

/**
 * GET /api/v1/search
 * Full-text search across all accessible objects
 * Requires authentication
 *
 * Query parameters:
 * - q: Search query (required)
 * - limit: Results per page (default: 20)
 * - offset: Pagination offset (default: 0)
 * - database: Filter by database name
 * - type: Filter by object type (table, procedure, package, etc.)
 * - owner: Filter by owner
 * - sensitivity: Filter by sensitivity level
 * - tags: Filter by tags (comma-separated)
 */
router.get('/', authenticate, (req, res) => {
  const { q, limit = 20, offset = 0, database, type, owner, sensitivity, tags } = req.query;

  if (!q) {
    return sendErrorResponse(res, req, 400, 'Search query (q) is required', {
      code: 'BAD_REQUEST',
    });
  }

  const query = q.toLowerCase();
  let results = Array.from(objectCache.values()).filter((item) => {
    const haystack = [
      item.id,
      item.name,
      item.database,
      item.type,
      item.owner,
      item.description,
      ...(item.tags || []),
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(query);
  });

  if (database) {
    results = results.filter((item) => item.database === database);
  }
  if (type) {
    results = results.filter((item) => item.type === type);
  }
  if (owner) {
    results = results.filter((item) => item.owner === owner);
  }
  if (sensitivity) {
    results = results.filter((item) => item.sensitivity === sensitivity);
  }
  if (tags) {
    const requestedTags = tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
    results = results.filter((item) =>
      requestedTags.every((tag) => (item.tags || []).includes(tag))
    );
  }

  const enriched = results.map((item) => {
    const trust = computeTrustScore(item);
    return {
      ...item,
      trust_score: trust.score,
      trust_level: trust.trust_level,
      certified: trust.certified,
      classifications: classifyAsset(item),
    };
  });

  const parsedLimit = parseInt(limit, 10);
  const parsedOffset = parseInt(offset, 10);

  return res.json({
    status: 'success',
    message: 'Search results',
    query: q,
    pagination: {
      limit: parsedLimit,
      offset: parsedOffset,
      total: enriched.length,
    },
    facets: {
      database: database || null,
      type: type || null,
      owner: owner || null,
      sensitivity: sensitivity || null,
      tags: tags ? tags.split(',') : [],
    },
    results: enriched.slice(parsedOffset, parsedOffset + parsedLimit),
  });
});

/**
 * GET /api/v1/search/facets
 * Get available facet values for filtering
 * Requires authentication
 */
router.get('/facets', authenticate, (req, res) =>
  res.json({
    status: 'success',
    message: 'Available facets',
    facets: {
      databases: [...new Set(Array.from(objectCache.values()).map((o) => o.database))]
        .filter(Boolean)
        .sort(),
      types: [...new Set(Array.from(objectCache.values()).map((o) => o.type))]
        .filter(Boolean)
        .sort(),
      owners: [...new Set(Array.from(objectCache.values()).map((o) => o.owner))]
        .filter(Boolean)
        .sort(),
      sensitivity: ['public', 'internal', 'confidential', 'restricted'],
      tags: [...new Set(Array.from(objectCache.values()).flatMap((o) => o.tags || []))].sort(),
      quality: ['gold', 'silver', 'bronze', 'unrated'],
      classifications: [
        ...new Set(Array.from(objectCache.values()).flatMap((o) => classifyAsset(o))),
      ].sort(),
    },
  })
);

export default router;
