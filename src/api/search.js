/**
 * Search Routes
 * Full-text search with faceted filtering
 */

import { createApiRouter } from '../utils/apiRouter.js';
import { authenticate } from '../middleware/auth.js';

const router = createApiRouter();

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
  const {
    q,
    limit = 20,
    offset = 0,
    database,
    type,
    owner,
    sensitivity,
    tags,
  } = req.query;

  if (!q) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Search query (q) is required',
    });
  }

  // TODO: Implement Meilisearch query
  return res.json({
    status: 'success',
    message: 'Search results',
    query: q,
    pagination: {
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      total: 0,
    },
    facets: {
      database: database || null,
      type: type || null,
      owner: owner || null,
      sensitivity: sensitivity || null,
      tags: tags ? tags.split(',') : [],
    },
    results: [],
  });
});

/**
 * GET /api/v1/search/facets
 * Get available facet values for filtering
 * Requires authentication
 */
router.get('/facets', authenticate, (req, res) =>
// TODO: Return distinct values for each facet from search index
  res.json({
    status: 'success',
    message: 'Available facets',
    facets: {
      databases: [],
      types: ['table', 'procedure', 'function', 'view', 'package'],
      owners: [],
      sensitivity: ['public', 'internal', 'confidential', 'restricted'],
      tags: [],
    },
  }));

export default router;
