/**
 * Marketplace Access Workflow Routes
 * Phase 7 starter implementation for request/approval/fulfillment lifecycle
 */

import { createApiRouter } from '../utils/apiRouter.js';
import { authenticate } from '../middleware/auth.js';
import {
  ACCESS_REQUEST_STATUS,
  createAccessRequest,
  getAccessRequest,
  listAccessRequests,
  reviewAccessRequest,
  fulfillAccessRequest,
  exportAccessRequests,
} from '../services/accessRequestService.js';

const router = createApiRouter();

let cachedObjects = new Map();

export function setMarketplaceCache(objects) {
  cachedObjects = objects;
}

function isAdmin(user = {}) {
  return Array.isArray(user.roles) && user.roles.includes('Admin');
}

function actorFromUser(user = {}) {
  return {
    userId: user.sub,
    email: user.email,
    name: user.name,
  };
}

function canReview(user, request) {
  if (isAdmin(user)) {
    return true;
  }

  if (!request || !request.approver || !request.approver.userId) {
    return false;
  }

  return request.approver.userId === user.sub;
}

function canView(user, request) {
  if (isAdmin(user)) {
    return true;
  }

  if (!request) {
    return false;
  }

  return request.requester.userId === user.sub || request.approver.userId === user.sub;
}

router.post('/requests', authenticate, (req, res) => {
  const {
    assetId,
    assetName,
    assetType,
    justification,
    requestedRole,
    approverId,
    approverEmail,
    metadata,
    slaHours,
  } = req.body;

  if (!assetId) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'assetId is required',
    });
  }

  const cachedAsset = cachedObjects.get(assetId);

  try {
    const created = createAccessRequest(
      {
        assetId,
        assetName: assetName || cachedAsset?.name,
        assetType: assetType || cachedAsset?.type,
        justification,
        requestedRole,
        approverId,
        approverEmail,
        metadata: {
          ...(metadata || {}),
          database: cachedAsset?.database || metadata?.database || null,
          source: 'marketplace',
        },
      },
      actorFromUser(req.user),
      { slaHours }
    );

    return res.status(201).json({
      status: 'success',
      message: 'Access request submitted',
      data: created,
    });
  } catch (err) {
    return res.status(400).json({
      error: 'Bad Request',
      message: err.message,
    });
  }
});

router.get('/requests', authenticate, (req, res) => {
  const { status, scope = 'mine', overdueOnly = 'false' } = req.query;

  if (scope === 'all' && !isAdmin(req.user)) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Admin role required for all-scope request listing',
    });
  }

  const filters = {
    status,
    overdueOnly: overdueOnly === 'true',
  };

  if (scope === 'mine') {
    filters.requesterId = req.user.sub;
  } else if (scope === 'approvals') {
    filters.approverId = req.user.sub;
  }

  const requests = listAccessRequests(filters);

  return res.json({
    status: 'success',
    data: {
      requests,
      count: requests.length,
      filters,
    },
  });
});

router.get('/requests/:requestId', authenticate, (req, res) => {
  const request = getAccessRequest(req.params.requestId);

  if (!request) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Access request not found',
    });
  }

  if (!canView(req.user, request)) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'You do not have access to this request',
    });
  }

  return res.json({
    status: 'success',
    data: request,
  });
});

router.post('/requests/:requestId/review', authenticate, (req, res) => {
  const { action, comment } = req.body;

  if (!action) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'action is required',
    });
  }

  const current = getAccessRequest(req.params.requestId);

  if (!current) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Access request not found',
    });
  }

  if (!canReview(req.user, current)) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Approver or admin role required',
    });
  }

  try {
    const updated = reviewAccessRequest(req.params.requestId, action, actorFromUser(req.user), {
      comment,
    });

    return res.json({
      status: 'success',
      message: `Request ${updated.status}`,
      data: updated,
    });
  } catch (err) {
    return res.status(400).json({
      error: 'Bad Request',
      message: err.message,
    });
  }
});

router.post('/requests/:requestId/fulfill', authenticate, (req, res) => {
  if (!isAdmin(req.user)) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Admin role required to fulfill requests',
    });
  }

  const { assignmentReference, notes } = req.body;

  try {
    const updated = fulfillAccessRequest(req.params.requestId, actorFromUser(req.user), {
      assignmentReference,
      notes,
    });

    return res.json({
      status: 'success',
      message: 'Request fulfilled',
      data: updated,
    });
  } catch (err) {
    const statusCode = err.message === 'Request not found' ? 404 : 400;
    return res.status(statusCode).json({
      error: statusCode === 404 ? 'Not Found' : 'Bad Request',
      message: err.message,
    });
  }
});

router.get('/requests/export/history', authenticate, (req, res) => {
  if (!isAdmin(req.user)) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Admin role required to export request history',
    });
  }

  const { status } = req.query;
  const exportData = exportAccessRequests({ status });

  return res.json({
    status: 'success',
    data: exportData,
  });
});

router.get('/schema', authenticate, (_req, res) => {
  res.json({
    description: 'Marketplace Access Workflow Schema',
    enums: {
      status: Object.values(ACCESS_REQUEST_STATUS),
      reviewActions: ['start_review', 'request_more_info', 'approve', 'reject'],
    },
    endpoints: {
      createRequest: 'POST /api/v1/marketplace/requests',
      listRequests: 'GET /api/v1/marketplace/requests?scope=mine|approvals|all',
      getRequest: 'GET /api/v1/marketplace/requests/:requestId',
      reviewRequest: 'POST /api/v1/marketplace/requests/:requestId/review',
      fulfillRequest: 'POST /api/v1/marketplace/requests/:requestId/fulfill',
      exportHistory: 'GET /api/v1/marketplace/requests/export/history',
    },
  });
});

export default router;
