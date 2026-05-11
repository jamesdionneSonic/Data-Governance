/**
 * Access Request Service
 * In-memory workflow for marketplace access requests (Phase 7 starter)
 */

import { randomUUID } from 'crypto';

const requestStore = new Map();

export const ACCESS_REQUEST_STATUS = {
  SUBMITTED: 'submitted',
  IN_REVIEW: 'in-review',
  REQUEST_MORE_INFO: 'request-more-info',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  FULFILLED: 'fulfilled',
};

const REVIEWABLE_STATUSES = new Set([
  ACCESS_REQUEST_STATUS.SUBMITTED,
  ACCESS_REQUEST_STATUS.IN_REVIEW,
  ACCESS_REQUEST_STATUS.REQUEST_MORE_INFO,
]);

const SLA_HOURS_DEFAULT = 48;

function toActor(actor = {}) {
  return {
    userId: actor.userId || actor.sub || 'unknown-user',
    email: actor.email || null,
    name: actor.name || null,
  };
}

function computeDueAt(createdAt, slaHours = SLA_HOURS_DEFAULT) {
  return new Date(new Date(createdAt).getTime() + slaHours * 60 * 60 * 1000);
}

function isOverdue(status, dueAt) {
  if (
    [
      ACCESS_REQUEST_STATUS.APPROVED,
      ACCESS_REQUEST_STATUS.REJECTED,
      ACCESS_REQUEST_STATUS.FULFILLED,
    ].includes(status)
  ) {
    return false;
  }

  return Date.now() > new Date(dueAt).getTime();
}

function normalizeRequest(request) {
  return {
    ...request,
    sla: {
      hours: request.slaHours,
      dueAt: request.dueAt,
      overdue: isOverdue(request.status, request.dueAt),
    },
  };
}

function appendEvent(request, eventType, actor, details = {}) {
  request.events.push({
    id: randomUUID(),
    type: eventType,
    actor: toActor(actor),
    details,
    timestamp: new Date().toISOString(),
  });
}

export function createAccessRequest(payload = {}, actor = {}, options = {}) {
  const {
    assetId,
    assetName,
    assetType,
    justification,
    requestedRole = 'Viewer',
    approverId,
    approverEmail,
    metadata = {},
  } = payload;

  if (!assetId) {
    throw new Error('assetId is required');
  }

  const actorInfo = toActor(actor);
  const slaHours = Number(options.slaHours || payload.slaHours || SLA_HOURS_DEFAULT);
  const createdAt = new Date().toISOString();

  const request = {
    requestId: randomUUID(),
    assetId,
    assetName: assetName || assetId,
    assetType: assetType || 'asset',
    justification: justification || '',
    requestedRole,
    requester: actorInfo,
    approver: {
      userId: approverId || null,
      email: approverEmail || null,
    },
    status: ACCESS_REQUEST_STATUS.SUBMITTED,
    decision: null,
    fulfillment: null,
    metadata,
    slaHours,
    createdAt,
    updatedAt: createdAt,
    dueAt: computeDueAt(createdAt, slaHours).toISOString(),
    events: [],
  };

  appendEvent(request, 'request_submitted', actorInfo, {
    status: request.status,
    requestedRole,
    justification: request.justification,
  });

  requestStore.set(request.requestId, request);

  return normalizeRequest(request);
}

export function getAccessRequest(requestId) {
  const request = requestStore.get(requestId);
  return request ? normalizeRequest(request) : null;
}

export function listAccessRequests(filters = {}) {
  const { requesterId, approverId, status, overdueOnly = false } = filters;

  return Array.from(requestStore.values())
    .filter((entry) => {
      if (requesterId && entry.requester.userId !== requesterId) {
        return false;
      }

      if (approverId && entry.approver.userId !== approverId) {
        return false;
      }

      if (status && entry.status !== status) {
        return false;
      }

      if (overdueOnly && !isOverdue(entry.status, entry.dueAt)) {
        return false;
      }

      return true;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map(normalizeRequest);
}

export function reviewAccessRequest(requestId, action, actor = {}, options = {}) {
  const request = requestStore.get(requestId);

  if (!request) {
    throw new Error('Request not found');
  }

  if (!REVIEWABLE_STATUSES.has(request.status)) {
    throw new Error(`Request is not reviewable from status: ${request.status}`);
  }

  const actorInfo = toActor(actor);
  const decisionComment = options.comment || '';

  const actionToStatus = {
    start_review: ACCESS_REQUEST_STATUS.IN_REVIEW,
    request_more_info: ACCESS_REQUEST_STATUS.REQUEST_MORE_INFO,
    approve: ACCESS_REQUEST_STATUS.APPROVED,
    reject: ACCESS_REQUEST_STATUS.REJECTED,
  };

  const nextStatus = actionToStatus[action];

  if (!nextStatus) {
    throw new Error(`Unsupported review action: ${action}`);
  }

  request.status = nextStatus;
  request.updatedAt = new Date().toISOString();

  if (action === 'approve' || action === 'reject') {
    request.decision = {
      action,
      comment: decisionComment,
      actor: actorInfo,
      timestamp: request.updatedAt,
    };
  }

  appendEvent(request, `request_${action}`, actorInfo, {
    comment: decisionComment,
    status: request.status,
  });

  requestStore.set(requestId, request);
  return normalizeRequest(request);
}

export function fulfillAccessRequest(requestId, actor = {}, options = {}) {
  const request = requestStore.get(requestId);

  if (!request) {
    throw new Error('Request not found');
  }

  if (request.status !== ACCESS_REQUEST_STATUS.APPROVED) {
    throw new Error('Only approved requests can be fulfilled');
  }

  const actorInfo = toActor(actor);
  const fulfilledAt = new Date().toISOString();

  request.status = ACCESS_REQUEST_STATUS.FULFILLED;
  request.updatedAt = fulfilledAt;
  request.fulfillment = {
    fulfilledAt,
    actor: actorInfo,
    assignmentReference: options.assignmentReference || null,
    notes: options.notes || '',
  };

  appendEvent(request, 'request_fulfilled', actorInfo, {
    assignmentReference: request.fulfillment.assignmentReference,
    notes: request.fulfillment.notes,
    status: request.status,
  });

  requestStore.set(requestId, request);
  return normalizeRequest(request);
}

export function exportAccessRequests(filters = {}) {
  const requests = listAccessRequests(filters);

  return {
    exportedAt: new Date().toISOString(),
    count: requests.length,
    requests,
  };
}

export function clearAccessRequests() {
  requestStore.clear();
}

export default {
  ACCESS_REQUEST_STATUS,
  createAccessRequest,
  getAccessRequest,
  listAccessRequests,
  reviewAccessRequest,
  fulfillAccessRequest,
  exportAccessRequests,
  clearAccessRequests,
};
