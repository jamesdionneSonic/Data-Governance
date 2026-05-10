/**
 * Dashboard Service
 * Aggregates admin, activity, and metadata data for dashboard views
 */

import {
  getAllUsers,
  getAuditLog,
  getAuditStatistics,
  getUser,
} from './adminService.js';
import {
  getActivityLog,
  getActivityStatistics,
  getMostViewedObjects,
  getPopularSearches,
} from './activityService.js';
import { getMetadataStatistics } from './metadataService.js';

const dashboardSettings = {
  theme: 'light',
  defaultTimeRange: '30d',
  alertingEnabled: true,
  maxAuditRows: 200,
  refreshIntervalSeconds: 60,
};

/**
 * Get user management dashboard summary
 * @param {Map} objects - Objects map
 * @returns {Object} User management summary
 */
export function getUserManagementData(_objects) {
  const users = getAllUsers();
  const auditStats = getAuditStatistics();

  return {
    totalUsers: users.length,
    activeUsers: users.filter((u) => u.active).length,
    inactiveUsers: users.filter((u) => !u.active).length,
    usersByRole: {
      Admin: users.filter((u) => u.role === 'Admin').length,
      PowerUser: users.filter((u) => u.role === 'PowerUser').length,
      Analyst: users.filter((u) => u.role === 'Analyst').length,
      Viewer: users.filter((u) => u.role === 'Viewer').length,
    },
    totalAuditEvents: auditStats.totalEvents,
    recentAuditEvents: auditStats.recentEvents,
    users: users.map((u) => ({
      userId: u.userId,
      email: u.email,
      name: u.name,
      role: u.role,
      active: u.active,
      createdAt: u.createdAt,
      lastLogin: u.lastLogin,
    })),
  };
}

/**
 * Get permission matrix data
 * @returns {Object} Permission matrix for UI rendering
 */
export function getPermissionMatrixData() {
  const users = getAllUsers();

  // Simplified permission matrix - can be extended with database-specific permissions
  const permissionMatrix = users.map((user) => ({
    userId: user.userId,
    email: user.email,
    name: user.name,
    role: user.role,
    permissions: {
      view: ['public', 'internal'].includes(user.role === 'Viewer' ? 'Viewer' : 'higher'),
      search: user.role !== 'Viewer',
      export: ['Admin', 'PowerUser'].includes(user.role),
      manageUsers: user.role === 'Admin',
      managePermissions: user.role === 'Admin',
      modifyMetadata: ['Admin', 'PowerUser'].includes(user.role),
      viewAudit: ['Admin', 'PowerUser'].includes(user.role),
    },
  }));

  return {
    users,
    permissionMatrix,
    roles: ['Admin', 'PowerUser', 'Analyst', 'Viewer'],
  };
}

/**
 * Get audit log data for viewer
 * @param {Object} filters - Filter options (user, action, dateRange)
 * @param {number} page - Page number
 * @param {number} pageSize - Results per page
 * @returns {Object} Audit log with pagination
 */
export function getAuditLogData(filters = {}, page = 1, pageSize = 50) {
  const auditLog = getAuditLog(filters);

  const startIdx = (page - 1) * pageSize;
  const endIdx = startIdx + pageSize;
  const paginatedLog = auditLog.slice(startIdx, endIdx);

  return {
    events: paginatedLog.map((event) => ({
      eventId: event.eventId,
      userId: event.userId,
      userName: event.userName,
      action: event.action,
      details: event.details,
      timestamp: event.timestamp,
      outcome: event.outcome || 'success',
    })),
    pagination: {
      page,
      pageSize,
      total: auditLog.length,
      totalPages: Math.ceil(auditLog.length / pageSize),
    },
    summary: getAuditStatistics(),
  };
}

/**
 * Get activity dashboard data
 * @returns {Object} Activity analytics for dashboard
 */
export function getActivityDashboardData() {
  const activityStats = getActivityStatistics();
  const mostViewed = getMostViewedObjects(10);
  const popularSearches = getPopularSearches(10);

  return {
    summary: activityStats,
    mostViewedObjects: mostViewed,
    popularSearches,
    activityTrend: activityStats.hourlyActivity || [],
  };
}

/**
 * Get metadata governance dashboard
 * @param {Map} objects - Objects map
 * @returns {Object} Metadata governance overview
 */
export function getMetadataGovernanceData(objects) {
  const metaStats = getMetadataStatistics(objects);

  return {
    totalObjects: metaStats.totalObjects,
    statistics: {
      untagged: metaStats.untagged,
      missingDescriptions: metaStats.missingDescriptions,
      byOwner: metaStats.owners,
      bySensitivity: metaStats.sensitivities,
      byTag: metaStats.tags,
    },
    dataClassification: {
      public: metaStats.sensitivities.public || 0,
      internal: metaStats.sensitivities.internal || 0,
      confidential: metaStats.sensitivities.confidential || 0,
      pii: metaStats.sensitivities.PII || 0,
      restricted: metaStats.sensitivities.restricted || 0,
    },
    commonTags: Object.entries(metaStats.tags)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([tag, count]) => ({ tag, count })),
  };
}

/**
 * Get admin dashboard overall summary
 * @param {Map} objects - Objects map
 * @returns {Object} Comprehensive admin dashboard
 */
export function getAdminDashboardSummary(objects) {
  const userData = getUserManagementData(objects);
  const activityData = getActivityDashboardData();
  const metadataData = getMetadataGovernanceData(objects);
  const auditStats = getAuditStatistics();

  return {
    timestamp: new Date().toISOString(),
    users: userData,
    activity: activityData,
    metadata: metadataData,
    governance: {
      totalAuditEvents: auditStats.totalEvents,
      auditEventTypes: auditStats.eventTypes || {},
      uniqueUsers: auditStats.uniqueUsers || 0,
      alertsGenerated: 0, // Can be extended
    },
    dataQuality: {
      completeness: calculateCompleteness(objects, metadataData),
      governance: calculateGovernance(userData),
    },
  };
}

/**
 * Calculate data completeness score
 * @param {Map} objects - Objects map
 * @param {Object} metadataData - Metadata statistics
 * @returns {Object} Completeness metrics
 */
function calculateCompleteness(objects, metadataData) {
  const total = objects.size;
  const withDescription = total - metadataData.statistics.missingDescriptions;
  const withTags = total - metadataData.statistics.untagged;

  return {
    percentage: Math.round(((withDescription + withTags) / (total * 2)) * 100) || 0,
    withDescription: Math.round((withDescription / total) * 100),
    withTags: Math.round((withTags / total) * 100),
    classified: Math.round(
      ((total - metadataData.statistics.untagged) / total) * 100,
    ),
  };
}

/**
 * Calculate governance score
 * @param {Object} userData - User management data
 * @returns {Object} Governance metrics
 */
function calculateGovernance(userData) {
  const totalUsers = userData.totalUsers || 1;
  const adminCount = userData.usersByRole?.Admin || 0;
  const auditUsersRatio = (totalUsers / Math.max(totalUsers, 100)) * 100;

  return {
    adminCoverage: Math.min((adminCount / Math.max(totalUsers / 20, 1)) * 100, 100),
    userMonitoring: Math.round(auditUsersRatio),
    complianceLevel: adminCount > 0 ? 'high' : 'low',
  };
}

/**
 * Get user activities timeline
 * @param {string} userId - User ID
 * @param {number} limit - Number of recent activities
 * @returns {Object} User activity timeline
 */
export function getUserActivityTimeline(userId, limit = 50) {
  const user = getUser(userId);
  if (!user) {
    return null;
  }

  const activities = getActivityLog({ userId }, limit);

  return {
    userId,
    userName: user.name,
    email: user.email,
    role: user.role,
    activities: activities.map((act) => ({
      action: act.action,
      resourceId: act.resourceId,
      timestamp: act.timestamp,
      details: act.details,
    })),
    summary: {
      totalActivities: activities.length,
      lastActive: activities[0]?.timestamp || null,
      actionCounts: groupActionCounts(activities),
    },
  };
}

/**
 * Group activities by action type
 * @param {Array} activities - Activity list
 * @returns {Object} Action counts
 */
function groupActionCounts(activities) {
  return activities.reduce((acc, act) => {
    acc[act.action] = (acc[act.action] || 0) + 1;
    return acc;
  }, {});
}

/**
 * Get system health metrics
 * @param {Map} objects - Objects map
 * @returns {Object} System health indicators
 */
export function getSystemHealthMetrics(objects) {
  const users = getAllUsers();
  const auditStats = getAuditStatistics();
  const activityStats = getActivityStatistics();
  const metaStats = getMetadataStatistics(objects);

  return {
    systemStatus: 'healthy',
    metrics: {
      totalUsers: users.length,
      activeUsers: users.filter((u) => u.active).length,
      totalAuditEvents: auditStats.totalEvents,
      totalActivity: activityStats.totalEvents || 0,
      totalObjects: metaStats.totalObjects,
      objectsWithMetadata: metaStats.totalObjects - metaStats.untagged,
    },
    memoryUsage: {
      users: users.length,
      auditEvents: auditStats.totalEvents,
      activityEvents: activityStats.totalEvents || 0,
    },
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Get dashboard configuration settings
 * @returns {Object} Dashboard settings
 */
export function getDashboardSettings() {
  return {
    ...dashboardSettings,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Update dashboard configuration settings
 * @param {Object} updates - Settings updates
 * @returns {Object} Updated settings
 */
export function updateDashboardSettings(updates = {}) {
  const allowedKeys = [
    'theme',
    'defaultTimeRange',
    'alertingEnabled',
    'maxAuditRows',
    'refreshIntervalSeconds',
  ];

  allowedKeys.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(updates, key)) {
      dashboardSettings[key] = updates[key];
    }
  });

  return getDashboardSettings();
}

export default {
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
};
