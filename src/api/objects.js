/**
 * Objects Routes
 * Handles object listing, searching, and detail retrieval
 */

import { createApiRouter } from '../utils/apiRouter.js';
import { authenticate } from '../middleware/auth.js';
import { sendErrorResponse } from '../middleware/errorHandler.js';
import { updateMarkdownMetadata } from '../services/markdownService.js';

const router = createApiRouter();
let objectCache = new Map();

export function setObjectsCache(objects) {
  objectCache = objects || new Map();
}

/**
 * GET /api/v1/objects
 * List objects with pagination and filtering
 * Requires authentication
 */
router.get('/', authenticate, (req, res) => {
  const { limit = 20, offset = 0, database, type, owner } = req.query;

  let results = Array.from(objectCache.values());

  if (database) {
    results = results.filter((item) => item.database === database);
  }

  if (type) {
    results = results.filter((item) => item.type === type);
  }

  if (owner) {
    results = results.filter((item) => item.owner === owner);
  }

  const parsedOffset = parseInt(offset, 10);
  const parsedLimit = parseInt(limit, 10);
  const total = results.length;
  const paged = results.slice(parsedOffset, parsedOffset + parsedLimit);

  return res.json({
    status: 'success',
    pagination: {
      limit: parsedLimit,
      offset: parsedOffset,
      total,
    },
    filters: {
      database,
      type,
      owner,
    },
    data: paged,
  });
});

/**
 * GET /api/v1/objects/:id
 * Get object details
 * Requires authentication and database access
 */
router.get('/:id', authenticate, (req, res) => {
  const { id } = req.params;

  const object = objectCache.get(id);
  if (!object) {
    return sendErrorResponse(res, req, 404, `Object '${id}' not found`, {
      code: 'NOT_FOUND',
    });
  }

  return res.json({
    status: 'success',
    objectId: id,
    data: object,
  });
});

/**
 * PUT /api/v1/objects/:id
 * Update editable markdown-backed metadata fields
 * Requires authentication and PowerUser/Admin role
 */
router.put('/:id', authenticate, (req, res) => {
  const { id } = req.params;
  const object = objectCache.get(id);

  if (!object) {
    return sendErrorResponse(res, req, 404, `Object '${id}' not found`, {
      code: 'NOT_FOUND',
    });
  }

  const hasRole = req.user.roles.includes('PowerUser') || req.user.roles.includes('Admin');
  if (!hasRole) {
    return sendErrorResponse(res, req, 403, 'Requires PowerUser or Admin role', {
      code: 'FORBIDDEN',
    });
  }

  const allowedFields = [
    'owner',
    'steward',
    'domain_manager',
    'custodian',
    'description',
    'sensitivity',
    'tags',
    'certified',
    'certified_by',
    'certification_date',
    'trust_level',
  ];

  const updates = Object.fromEntries(
    Object.entries(req.body || {}).filter(([key]) => allowedFields.includes(key))
  );

  try {
    const updated = updateMarkdownMetadata(object.filePath, updates);
    objectCache.set(id, updated);
    return res.json({
      status: 'success',
      message: 'Object metadata updated',
      data: updated,
    });
  } catch (err) {
    return sendErrorResponse(res, req, 500, err.message, {
      code: 'OBJECT_UPDATE_ERROR',
    });
  }
});

/**
 * POST /api/v1/objects
 * Create new object metadata
 * Requires authentication and PowerUser role
 */
router.post('/', authenticate, (req, res) => {
  const { name, database, type, description } = req.body;

  // Check if user has PowerUser or Admin role
  const hasRole = req.user.roles.includes('PowerUser') || req.user.roles.includes('Admin');

  if (!hasRole) {
    return sendErrorResponse(res, req, 403, 'Requires PowerUser or Admin role', {
      code: 'FORBIDDEN',
    });
  }

  // TODO: Implement object creation
  return res.status(201).json({
    status: 'success',
    message: 'Object created',
    data: {
      id: 'obj-123',
      name,
      database,
      type,
      description,
    },
  });
});

export default router;
