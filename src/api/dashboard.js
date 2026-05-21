/**
 * Dashboard API Routes
 * Endpoints for admin dashboard UI components
 */

import { createApiRouter } from '../utils/apiRouter.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { sendErrorResponse } from '../middleware/errorHandler.js';
import {
  getUserManagementData,
  getPermissionMatrixData,
  getAuditLogData,
  getActivityDashboardData,
  getMetadataGovernanceData,
  getAdminDashboardSummary,
  getUserActivityTimeline,
  getSystemHealthMetrics,
  getDashboardSettings,
  updateDashboardSettings,
} from '../services/dashboardService.js';

const router = createApiRouter();
let cachedObjects;

/**
 * Set cache reference for dashboard service
 * @param {Map} objects - Objects map
 */
export function setDashboardCache(objects) {
  cachedObjects = objects;
}

// All routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);

/**
 * GET /api/v1/dashboard/admin
 * Main admin dashboard summary
 */
router.get('/admin', (req, res) => {
  try {
    const summary = getAdminDashboardSummary(cachedObjects);
    return res.json(summary);
  } catch (err) {
    return sendErrorResponse(res, req, 500, 'Failed to fetch dashboard summary', {
      code: 'DASHBOARD_SUMMARY_ERROR',
    });
  }
});

/**
 * GET /api/v1/dashboard/users
 * User management dashboard data
 */
router.get('/users', (req, res) => {
  try {
    const data = getUserManagementData(cachedObjects);
    return res.json(data);
  } catch (err) {
    return sendErrorResponse(res, req, 500, 'Failed to fetch user management data', {
      code: 'DASHBOARD_USERS_ERROR',
    });
  }
});

/**
 * GET /api/v1/dashboard/permissions
 * Permission matrix data for UI
 */
router.get('/permissions', (req, res) => {
  try {
    const data = getPermissionMatrixData();
    return res.json(data);
  } catch (err) {
    return sendErrorResponse(res, req, 500, 'Failed to fetch permission matrix data', {
      code: 'DASHBOARD_PERMISSIONS_ERROR',
    });
  }
});

/**
 * GET /api/v1/dashboard/audit
 * Audit log data with filtering and pagination
 */
router.get('/audit', (req, res) => {
  try {
    const filters = {
      user: req.query.user,
      action: req.query.action,
      dateRange: req.query.dateRange,
    };
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const pageSize = Math.min(100, parseInt(req.query.pageSize, 10) || 50);

    const data = getAuditLogData(filters, page, pageSize);
    return res.json(data);
  } catch (err) {
    return sendErrorResponse(res, req, 500, 'Failed to fetch audit log data', {
      code: 'DASHBOARD_AUDIT_ERROR',
    });
  }
});

/**
 * GET /api/v1/dashboard/activity
 * Activity analytics dashboard
 */
router.get('/activity', (req, res) => {
  try {
    const data = getActivityDashboardData();
    return res.json(data);
  } catch (err) {
    return sendErrorResponse(res, req, 500, 'Failed to fetch activity data', {
      code: 'DASHBOARD_ACTIVITY_ERROR',
    });
  }
});

/**
 * GET /api/v1/dashboard/metadata
 * Metadata governance overview
 */
router.get('/metadata', (req, res) => {
  try {
    const data = getMetadataGovernanceData(cachedObjects);
    return res.json(data);
  } catch (err) {
    return sendErrorResponse(res, req, 500, 'Failed to fetch metadata governance data', {
      code: 'DASHBOARD_METADATA_ERROR',
    });
  }
});

/**
 * GET /api/v1/dashboard/users/:userId/activity
 * User activity timeline
 */
router.get('/users/:userId/activity', (req, res) => {
  try {
    const limit = Math.min(100, parseInt(req.query.limit, 10) || 50);
    const timeline = getUserActivityTimeline(req.params.userId, limit);

    if (!timeline) {
      return sendErrorResponse(res, req, 404, 'User not found', {
        code: 'NOT_FOUND',
      });
    }
    return res.json(timeline);
  } catch (err) {
    return sendErrorResponse(res, req, 500, 'Failed to fetch user activity timeline', {
      code: 'DASHBOARD_USER_TIMELINE_ERROR',
    });
  }
});

/**
 * GET /api/v1/dashboard/health
 * System health and metrics
 */
router.get('/health', (req, res) => {
  try {
    const metrics = getSystemHealthMetrics(cachedObjects);
    return res.json(metrics);
  } catch (err) {
    return sendErrorResponse(res, req, 500, 'Failed to fetch system health metrics', {
      code: 'DASHBOARD_HEALTH_ERROR',
    });
  }
});

/**
 * GET /api/v1/dashboard/settings
 * Dashboard settings
 */
router.get('/settings', (req, res) => {
  try {
    const settings = getDashboardSettings();
    return res.json({
      status: 'success',
      data: settings,
    });
  } catch (err) {
    return sendErrorResponse(res, req, 500, 'Failed to fetch dashboard settings', {
      code: 'DASHBOARD_SETTINGS_READ_ERROR',
    });
  }
});

/**
 * PUT /api/v1/dashboard/settings
 * Update dashboard settings
 */
router.put('/settings', (req, res) => {
  try {
    const settings = updateDashboardSettings(req.body || {});
    return res.json({
      status: 'success',
      message: 'Dashboard settings updated',
      data: settings,
    });
  } catch (err) {
    return sendErrorResponse(res, req, 500, 'Failed to update dashboard settings', {
      code: 'DASHBOARD_SETTINGS_UPDATE_ERROR',
    });
  }
});

export default router;
