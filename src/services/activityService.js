/**
 * Activity Service
 * Track user actions and data lineage changes
 */

import { randomUUID } from 'crypto';

// In-memory store (replace with database in production)
const activityLog = [];

/**
 * Log user action
 * @param {string} userId - User ID
 * @param {string} action - Action type
 * @param {string} resourceId - Resource ID affected
 * @param {Object} details - Action details
 * @returns {Object} Activity event
 */
export function logActivity(userId, action, resourceId, details = {}) {
  const event = {
    id: randomUUID(),
    userId,
    action,
    resourceId,
    details,
    timestamp: new Date(),
  };

  activityLog.push(event);

  // Keep only last 50k events
  if (activityLog.length > 50000) {
    activityLog.shift();
  }

  return event;
}

/**
 * Log lineage change
 * @param {string} userId - User ID making change
 * @param {string} objectId - Object that changed
 * @param {string} changeType - 'created', 'updated', 'deleted'
 * @param {Object} before - Previous value
 * @param {Object} after - New value
 * @returns {Object} Activity event
 */
export function logLineageChange(userId, objectId, changeType, before, after) {
  return logActivity(userId, `lineage_${changeType}`, objectId, {
    changeType,
    before,
    after,
  });
}

/**
 * Log permission change
 * @param {string} userId - User who made change
 * @param {string} targetUserId - User whose permissions changed
 * @param {string} database - Database affected
 * @param {string} previousRole - Previous role
 * @param {string} newRole - New role
 * @returns {Object} Activity event
 */
export function logPermissionChange(userId, targetUserId, database, previousRole, newRole) {
  return logActivity(userId, 'permission_changed', `user:${targetUserId}`, {
    database,
    previousRole,
    newRole,
  });
}

/**
 * Log search action
 * @param {string} userId - User who searched
 * @param {string} query - Search query
 * @param {number} resultCount - Number of results
 * @returns {Object} Activity event
 */
export function logSearchAction(userId, query, resultCount) {
  return logActivity(userId, 'search', 'global', {
    query,
    resultCount,
  });
}

/**
 * Log object view
 * @param {string} userId - User viewing object
 * @param {string} objectId - Object being viewed
 * @returns {Object} Activity event
 */
export function logObjectView(userId, objectId) {
  return logActivity(userId, 'view_object', objectId);
}

/**
 * Get activity log
 * @param {Object} options - Filter options
 * @returns {Array} Activity events
 */
export function getActivityLog(options = {}) {
  let events = [...activityLog];

  // Filter by user
  if (options.userId) {
    events = events.filter((e) => e.userId === options.userId);
  }

  // Filter by action
  if (options.action) {
    events = events.filter((e) => e.action === options.action);
  }

  // Filter by resource
  if (options.resourceId) {
    events = events.filter((e) => e.resourceId === options.resourceId);
  }

  // Filter by date range
  if (options.startDate) {
    events = events.filter((e) => e.timestamp >= options.startDate);
  }

  if (options.endDate) {
    events = events.filter((e) => e.timestamp <= options.endDate);
  }

  // Limit results
  const limit = options.limit || 100;
  return events.slice(-limit);
}

/**
 * Get activity statistics
 * @returns {Object} Activity statistics
 */
export function getActivityStatistics() {
  const stats = {
    totalEvents: activityLog.length,
    actionCounts: {},
    userCounts: {},
    resourceCounts: {},
    most_recent: activityLog.length > 0 ? activityLog[activityLog.length - 1] : null,
  };

  for (const event of activityLog) {
    stats.actionCounts[event.action] = (stats.actionCounts[event.action] || 0) + 1;
    stats.userCounts[event.userId] = (stats.userCounts[event.userId] || 0) + 1;
    stats.resourceCounts[event.resourceId] = (stats.resourceCounts[event.resourceId] || 0) + 1;
  }

  return stats;
}

/**
 * Get user activity timeline
 * @param {string} userId - User ID
 * @param {number} limit - Number of events to return
 * @returns {Array} Activity events for user
 */
export function getUserTimeline(userId, limit = 50) {
  return activityLog
    .filter((e) => e.userId === userId)
    .slice(-limit)
    .reverse();
}

/**
 * Get lineage change history for object
 * @param {string} objectId - Object ID
 * @returns {Array} Change events for object
 */
export function getObjectChangeHistory(objectId) {
  return activityLog
    .filter(
      (e) =>
        e.resourceId === objectId &&
        (e.action === 'lineage_created' ||
          e.action === 'lineage_updated' ||
          e.action === 'lineage_deleted')
    )
    .map((e) => ({
      id: e.id,
      userId: e.userId,
      action: e.details.changeType,
      timestamp: e.timestamp,
      before: e.details.before,
      after: e.details.after,
    }));
}

/**
 * Get most viewed objects
 * @param {number} limit - Number of objects
 * @returns {Array} Most viewed objects
 */
export function getMostViewedObjects(limit = 10) {
  const viewCounts = {};

  for (const event of activityLog) {
    if (event.action === 'view_object') {
      viewCounts[event.resourceId] = (viewCounts[event.resourceId] || 0) + 1;
    }
  }

  return Object.entries(viewCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([objectId, count]) => ({ objectId, viewCount: count }));
}

/**
 * Get popular searches
 * @param {number} limit - Number of searches
 * @returns {Array} Popular search queries
 */
export function getPopularSearches(limit = 10) {
  const searchCounts = {};

  for (const event of activityLog) {
    if (event.action === 'search') {
      const { query } = event.details;
      searchCounts[query] = (searchCounts[query] || 0) + 1;
    }
  }

  return Object.entries(searchCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([query, count]) => ({ query, searchCount: count }));
}

/**
 * Clear activity log (admin only)
 * @returns {number} Number of events cleared
 */
export function clearActivityLog() {
  const count = activityLog.length;
  activityLog.length = 0;
  return count;
}

/**
 * Export activity log
 * @param {Object} options - Export options
 * @returns {Object} Exported data
 */
export function exportActivityLog(options = {}) {
  const events = getActivityLog(options);
  return {
    events,
    statistics: getActivityStatistics(),
    exportedAt: new Date(),
  };
}

export default {
  logActivity,
  logLineageChange,
  logPermissionChange,
  logSearchAction,
  logObjectView,
  getActivityLog,
  getActivityStatistics,
  getUserTimeline,
  getObjectChangeHistory,
  getMostViewedObjects,
  getPopularSearches,
  clearActivityLog,
  exportActivityLog,
};
