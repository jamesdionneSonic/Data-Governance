/**
 * Admin API Routes
 * User management, permissions, activity logs, and metadata management
 */

import { createApiRouter } from '../utils/apiRouter.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { sendErrorResponse } from '../middleware/errorHandler.js';
import {
  upsertUser,
  getUser,
  getAllUsers,
  updateUser,
  deactivateUser,
  reactivateUser,
  deleteUser,
  logAuditEvent,
  getAuditLog,
  getAuditStatistics,
} from '../services/adminService.js';
import {
  getActivityLog,
  getActivityStatistics,
  getMostViewedObjects,
} from '../services/activityService.js';
import {
  validateMetadata,
  getObjectsByTag,
  getObjectsBySensitivity,
  getMetadataStatistics,
} from '../services/metadataService.js';

const router = createApiRouter();

// Storage (will be set by app context)
let cachedObjects = new Map();

/**
 * Set cache data
 * Called by app.js after loading markdown
 */
export function setAdminCache(objects) {
  cachedObjects = objects;
}

/**
 * GET /api/v1/admin/users
 * List all users
 * Requires admin role
 */
router.get('/users', authenticate, requireAdmin, (req, res) => {
  try {
    const { role, active } = req.query;
    const users = getAllUsers({ role: role || undefined, active: active === 'true' || undefined });

    return res.json({
      status: 'success',
      message: 'Users retrieved',
      data: {
        users,
        count: users.length,
      },
    });
  } catch (err) {
    return sendErrorResponse(res, req, 500, err.message, {
      code: 'ADMIN_USERS_LIST_ERROR',
    });
  }
});

/**
 * GET /api/v1/admin/users/:userId
 * Get specific user
 * Requires admin role
 */
router.get('/users/:userId', authenticate, requireAdmin, (req, res) => {
  try {
    const user = getUser(req.params.userId);

    if (!user) {
      return sendErrorResponse(res, req, 404, 'User not found', {
        code: 'NOT_FOUND',
      });
    }

    return res.json({
      status: 'success',
      message: 'User retrieved',
      data: user,
    });
  } catch (err) {
    return sendErrorResponse(res, req, 500, err.message, {
      code: 'ADMIN_USER_GET_ERROR',
    });
  }
});

/**
 * POST /api/v1/admin/users
 * Create or update user
 * Requires admin role
 */
router.post('/users', authenticate, requireAdmin, (req, res) => {
  try {
    const {
      email, name, role, department,
    } = req.body;

    if (!email) {
      return sendErrorResponse(res, req, 400, 'Email is required', {
        code: 'BAD_REQUEST',
      });
    }

    const user = upsertUser(email, {
      name,
      role: role || 'Viewer',
      department,
    });

    logAuditEvent(req.user.userId, 'user_created', { userId: user.userId, email });

    return res.json({
      status: 'success',
      message: 'User created/updated',
      data: user,
    });
  } catch (err) {
    return sendErrorResponse(res, req, 500, err.message, {
      code: 'ADMIN_USER_CREATE_ERROR',
    });
  }
});

/**
 * PUT /api/v1/admin/users/:userId
 * Update user
 * Requires admin role
 */
router.put('/users/:userId', authenticate, requireAdmin, (req, res) => {
  try {
    const updated = updateUser(req.params.userId, req.body);

    if (!updated) {
      return sendErrorResponse(res, req, 404, 'User not found', {
        code: 'NOT_FOUND',
      });
    }

    logAuditEvent(req.user.userId, 'user_updated', { userId: req.params.userId });

    return res.json({
      status: 'success',
      message: 'User updated',
      data: updated,
    });
  } catch (err) {
    return sendErrorResponse(res, req, 500, err.message, {
      code: 'ADMIN_USER_UPDATE_ERROR',
    });
  }
});

/**
 * DELETE /api/v1/admin/users/:userId
 * Delete user
 * Requires admin role
 */
router.delete('/users/:userId', authenticate, requireAdmin, (req, res) => {
  try {
    const success = deleteUser(req.params.userId);

    if (!success) {
      return sendErrorResponse(res, req, 404, 'User not found', {
        code: 'NOT_FOUND',
      });
    }

    logAuditEvent(req.user.userId, 'user_deleted', { userId: req.params.userId });

    return res.json({
      status: 'success',
      message: 'User deleted',
    });
  } catch (err) {
    return sendErrorResponse(res, req, 500, err.message, {
      code: 'ADMIN_USER_DELETE_ERROR',
    });
  }
});

/**
 * POST /api/v1/admin/users/:userId/deactivate
 * Deactivate user
 * Requires admin role
 */
router.post('/users/:userId/deactivate', authenticate, requireAdmin, (req, res) => {
  try {
    const success = deactivateUser(req.params.userId);

    if (!success) {
      return sendErrorResponse(res, req, 404, 'User not found', {
        code: 'NOT_FOUND',
      });
    }

    logAuditEvent(req.user.userId, 'user_deactivated', { userId: req.params.userId });

    return res.json({
      status: 'success',
      message: 'User deactivated',
    });
  } catch (err) {
    return sendErrorResponse(res, req, 500, err.message, {
      code: 'ADMIN_USER_DEACTIVATE_ERROR',
    });
  }
});

/**
 * POST /api/v1/admin/users/:userId/reactivate
 * Reactivate user
 * Requires admin role
 */
router.post('/users/:userId/reactivate', authenticate, requireAdmin, (req, res) => {
  try {
    const success = reactivateUser(req.params.userId);

    if (!success) {
      return sendErrorResponse(res, req, 404, 'User not found', {
        code: 'NOT_FOUND',
      });
    }

    logAuditEvent(req.user.userId, 'user_reactivated', { userId: req.params.userId });

    return res.json({
      status: 'success',
      message: 'User reactivated',
    });
  } catch (err) {
    return sendErrorResponse(res, req, 500, err.message, {
      code: 'ADMIN_USER_REACTIVATE_ERROR',
    });
  }
});

/**
 * GET /api/v1/admin/audit
 * Get audit log
 * Requires admin role
 */
router.get('/audit', authenticate, requireAdmin, (req, res) => {
  try {
    const {
      userId, action, limit, days,
    } = req.query;
    const startDate = days ? new Date(Date.now() - days * 24 * 60 * 60 * 1000) : undefined;

    const events = getAuditLog({
      userId,
      action,
      limit: parseInt(limit, 10) || 100,
      startDate,
    });

    return res.json({
      status: 'success',
      message: 'Audit log retrieved',
      data: {
        events,
        count: events.length,
      },
    });
  } catch (err) {
    return sendErrorResponse(res, req, 500, err.message, {
      code: 'ADMIN_AUDIT_LOG_ERROR',
    });
  }
});

/**
 * GET /api/v1/admin/audit/statistics
 * Get audit statistics
 * Requires admin role
 */
router.get('/audit/statistics', authenticate, requireAdmin, (req, res) => {
  try {
    const stats = getAuditStatistics();

    return res.json({
      status: 'success',
      message: 'Audit statistics retrieved',
      data: stats,
    });
  } catch (err) {
    return sendErrorResponse(res, req, 500, err.message, {
      code: 'ADMIN_AUDIT_STATS_ERROR',
    });
  }
});

/**
 * GET /api/v1/admin/activity
 * Get activity log
 * Requires admin role
 */
router.get('/activity', authenticate, requireAdmin, (req, res) => {
  try {
    const { userId, action, limit } = req.query;

    const events = getActivityLog({
      userId,
      action,
      limit: parseInt(limit, 10) || 100,
    });

    return res.json({
      status: 'success',
      message: 'Activity log retrieved',
      data: {
        events,
        count: events.length,
      },
    });
  } catch (err) {
    return sendErrorResponse(res, req, 500, err.message, {
      code: 'ADMIN_ACTIVITY_LOG_ERROR',
    });
  }
});

/**
 * GET /api/v1/admin/activity/statistics
 * Get activity statistics
 * Requires admin role
 */
router.get('/activity/statistics', authenticate, requireAdmin, (req, res) => {
  try {
    const stats = getActivityStatistics();

    return res.json({
      status: 'success',
      message: 'Activity statistics retrieved',
      data: stats,
    });
  } catch (err) {
    return sendErrorResponse(res, req, 500, err.message, {
      code: 'ADMIN_ACTIVITY_STATS_ERROR',
    });
  }
});

/**
 * GET /api/v1/admin/activity/views
 * Get most viewed objects
 * Requires admin role
 */
router.get('/activity/views', authenticate, requireAdmin, (req, res) => {
  try {
    const { limit } = req.query;
    const views = getMostViewedObjects(parseInt(limit, 10) || 10);

    return res.json({
      status: 'success',
      message: 'Most viewed objects retrieved',
      data: views,
    });
  } catch (err) {
    return sendErrorResponse(res, req, 500, err.message, {
      code: 'ADMIN_ACTIVITY_VIEWS_ERROR',
    });
  }
});

/**
 * GET /api/v1/admin/metadata/statistics
 * Get metadata statistics
 * Requires admin role
 */
router.get('/metadata/statistics', authenticate, requireAdmin, (req, res) => {
  try {
    const stats = getMetadataStatistics(cachedObjects);

    return res.json({
      status: 'success',
      message: 'Metadata statistics retrieved',
      data: stats,
    });
  } catch (err) {
    return sendErrorResponse(res, req, 500, err.message, {
      code: 'ADMIN_METADATA_STATS_ERROR',
    });
  }
});

/**
 * GET /api/v1/admin/metadata/validate/:objectId
 * Validate object metadata
 * Requires admin role
 */
router.get('/metadata/validate/:objectId', authenticate, requireAdmin, (req, res) => {
  try {
    const obj = cachedObjects.get(req.params.objectId);

    if (!obj) {
      return sendErrorResponse(res, req, 404, 'Object not found', {
        code: 'NOT_FOUND',
      });
    }

    const validation = validateMetadata(obj);

    return res.json({
      status: 'success',
      message: 'Metadata validation complete',
      data: validation,
    });
  } catch (err) {
    return sendErrorResponse(res, req, 500, err.message, {
      code: 'ADMIN_METADATA_VALIDATE_ERROR',
    });
  }
});

/**
 * GET /api/v1/admin/objects/by-tag/:tag
 * Get objects with tag
 * Requires admin role
 */
router.get('/objects/by-tag/:tag', authenticate, requireAdmin, (req, res) => {
  try {
    const objects = getObjectsByTag(req.params.tag, cachedObjects);

    return res.json({
      status: 'success',
      message: 'Objects retrieved',
      data: {
        objects,
        count: objects.length,
      },
    });
  } catch (err) {
    return sendErrorResponse(res, req, 500, err.message, {
      code: 'ADMIN_OBJECTS_BY_TAG_ERROR',
    });
  }
});

/**
 * GET /api/v1/admin/objects/by-sensitivity/:sensitivity
 * Get objects with sensitivity level
 * Requires admin role
 */
router.get('/objects/by-sensitivity/:sensitivity', authenticate, requireAdmin, (req, res) => {
  try {
    const objects = getObjectsBySensitivity(req.params.sensitivity, cachedObjects);

    return res.json({
      status: 'success',
      message: 'Objects retrieved',
      data: {
        objects,
        count: objects.length,
      },
    });
  } catch (err) {
    return sendErrorResponse(res, req, 500, err.message, {
      code: 'ADMIN_OBJECTS_BY_SENSITIVITY_ERROR',
    });
  }
});

export default router;
