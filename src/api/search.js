/**
 * Search Routes
 * Full-text search with faceted filtering
 */

import { createApiRouter } from '../utils/apiRouter.js';
import { authenticate } from '../middleware/auth.js';
import { sendErrorResponse } from '../middleware/errorHandler.js';
import { computeTrustScore } from '../services/trustService.js';
import { classifyAsset } from '../services/classificationService.js';
import { searchObjects } from '../services/indexService.js';
import { createTtlCache } from '../utils/ttlCache.js';

const router = createApiRouter();
let objectCache = new Map();
const searchCache = createTtlCache({ ttlMs: 15000, maxSize: 200 });
const enrichmentCache = createTtlCache({ ttlMs: 300000, maxSize: 2000 });

export function setSearchCache(objects) {
  objectCache = objects || new Map();
  searchCache.clear();
  enrichmentCache.clear();
}

function enrichSearchItem(item) {
  const cacheKey = item.id || `${item.database || ''}.${item.name || ''}`;
  const cached = enrichmentCache.get(cacheKey);
  const liveObj = objectCache.get(item.id) || {};
  if (cached) {
    return { ...item, ...cached, downstreamCount: liveObj.downstreamCount || 0 };
  }

  const trust = computeTrustScore(item);
  const enriched = {
    trust_score: trust.score,
    trust_level: trust.trust_level,
    certified: trust.certified,
    classifications: classifyAsset(item),
  };

  enrichmentCache.set(cacheKey, enriched);
  return { ...item, ...enriched, downstreamCount: liveObj.downstreamCount || 0 };
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
router.get('/', authenticate, async (req, res) => {
  try {
    const { q = '', limit = 20, offset = 0, database, type, owner, sensitivity, tags, trust_level } = req.query;

    const query = q.toLowerCase().trim();
    const parsedLimit = parseInt(limit, 10);
    const parsedOffset = parseInt(offset, 10);

    let results = [];
    let totalHits = 0;

    if (query) {
      const cacheKey = JSON.stringify({
        q: query,
        limit: parsedLimit,
        offset: parsedOffset,
        database: database || null,
        type: type || null,
        owner: owner || null,
        sensitivity: sensitivity || null,
        tags: tags || null,
        trust_level: trust_level || null,
      });

      const cached = searchCache.get(cacheKey);
      if (cached) {
        results = cached.results;
        totalHits = cached.totalHits;
      } else {
        // 1. USE ELASTICSEARCH for actual text searches
        // We pass the index name 'objects' and the query
        const esResponse = await searchObjects('objects', query, {
          limit: parsedLimit,
          offset: parsedOffset,
          database,
          type,
          owner,
          sensitivity,
          tags,
          trust_level,
        });
        results = esResponse.hits;
        totalHits = esResponse.estimatedTotalHits;

        searchCache.set(cacheKey, { results, totalHits });
      }
    } else {
      // 2. USE RAM CACHE when browsing the catalog with an empty search bar
      results = Array.from(objectCache.values());

      // Apply facet filters to the RAM results
      if (database) {
        const allowedDbs = database.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
        results = results.filter((item) =>
          allowedDbs.includes(String(item.database || '').toLowerCase())
        );
      }
      if (type) {
        const allowedTypes = type.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
        results = results.filter((item) =>
          allowedTypes.includes(String(item.type || '').toLowerCase())
        );
      }
      if (owner) {
        const allowedOwners = owner.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
        results = results.filter((item) =>
          allowedOwners.includes(String(item.owner || '').toLowerCase())
        );
      }
      if (sensitivity) {
        const allowedSensitivity = sensitivity
          .split(',')
          .map((s) => s.trim().toLowerCase())
          .filter(Boolean);
        results = results.filter((item) =>
          allowedSensitivity.includes(String(item.sensitivity || '').toLowerCase())
        );
      }
      if (tags) {
        const requestedTags = tags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean);
        results = results.filter((item) => {
          const itemTags = (item.tags || []).map((t) => String(t).toLowerCase());
          return requestedTags.every((tag) => itemTags.includes(tag));
        });
      }
      if (trust_level) {
        const requestedLevels = String(trust_level)
          .split(',')
          .map((s) => s.trim().toLowerCase())
          .filter(Boolean);
        results = results.filter((item) =>
          requestedLevels.includes(String(item.trust_level || '').toLowerCase())
        );
      }

      totalHits = results.length;
      results = results.slice(parsedOffset, parsedOffset + parsedLimit);
    }

    // Enrich the results with your platform's trust scores
    const enriched = results.map(enrichSearchItem);

    return res.json({
      status: 'success',
      message: 'Search results',
      query: q,
      pagination: {
        limit: parsedLimit,
        offset: parsedOffset,
        total: totalHits,
      },
      facets: {
        database: database || null,
        type: type || null,
        owner: owner || null,
        sensitivity: sensitivity || null,
        tags: tags ? tags.split(',') : [],
      },
      results: enriched,
    });
  } catch (err) {
    return sendErrorResponse(res, req, 500, err.message, {
      code: 'SEARCH_ERROR',
    });
  }
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
