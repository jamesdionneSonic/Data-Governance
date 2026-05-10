/**
 * Admin Service
 * User management, permissions, roles, and audit logging
 */

import { randomUUID } from 'crypto';

// In-memory stores (replace with database in production)
const userStore = new Map();
const auditLog = [];

/**
 * Create or update user
 * @param {string} email - User email
 * @param {Object} profile - User profile data
 * @returns {Object} User object
 */
export function upsertUser(email, profile = {}) {
  const userId = profile.userId || randomUUID();
  const user = {
    userId,
    email,
    name: profile.name || email.split('@')[0],
    role: profile.role || 'Viewer', // Default to Viewer
    department: profile.department || '',
    createdAt: new Date(),
    lastLogin: new Date(),
    active: true,
    metadata: profile.metadata || {},
  };

  userStore.set(userId, user);
  return user;
}

/**
 * Get user by ID
 * @param {string} userId - User ID
 * @returns {Object|null} User object or null
 */
export function getUser(userId) {
  return userStore.get(userId) || null;
}

/**
 * Get user by email
 * @param {string} email - User email
 * @returns {Object|null} User object or null
 */
export function getUserByEmail(email) {
  for (const user of userStore.values()) {
    if (user.email === email) {
      return user;
    }
  }
  return null;
}

/**
 * Get all users
 * @param {Object} options - Filter options
 * @returns {Array} Array of user objects
 */
export function getAllUsers(options = {}) {
  const users = Array.from(userStore.values());

  // Filter by role
  if (options.role) {
    return users.filter((u) => u.role === options.role);
  }

  // Filter by active status
  if (options.active !== undefined) {
    return users.filter((u) => u.active === options.active);
  }

  return users;
}

/**
 * Update user
 * @param {string} userId - User ID
 * @param {Object} updates - Update fields
 * @returns {Object|null} Updated user or null
 */
export function updateUser(userId, updates) {
  const user = userStore.get(userId);
  if (!user) {
    return null;
  }

  const updatedUser = {
    ...user,
    ...updates,
    userId: user.userId, // Prevent ID change
    createdAt: user.createdAt, // Prevent creation date change
  };

  userStore.set(userId, updatedUser);
  return updatedUser;
}

/**
 * Deactivate user
 * @param {string} userId - User ID to deactivate
 * @returns {boolean} Success status
 */
export function deactivateUser(userId) {
  const user = userStore.get(userId);
  if (!user) {
    return false;
  }

  user.active = false;
  userStore.set(userId, user);
  return true;
}

/**
 * Reactivate user
 * @param {string} userId - User ID to reactivate
 * @returns {boolean} Success status
 */
export function reactivateUser(userId) {
  const user = userStore.get(userId);
  if (!user) {
    return false;
  }

  user.active = true;
  userStore.set(userId, user);
  return true;
}

/**
 * Delete user
 * @param {string} userId - User ID to delete
 * @returns {boolean} Success status
 */
export function deleteUser(userId) {
  return userStore.delete(userId);
}

/**
 * Get total number of users
 * @returns {number} User count
 */
export function getUserCount() {
  return userStore.size;
}

/**
 * Record audit log entry
 * @param {string} userId - User ID performing action
 * @param {string} action - Action performed
 * @param {Object} details - Action details
 */
export function logAuditEvent(userId, action, details = {}) {
  const event = {
    id: randomUUID(),
    userId,
    action,
    details,
    timestamp: new Date(),
  };

  auditLog.push(event);

  // Keep only last 10k events in memory
  if (auditLog.length > 10000) {
    auditLog.shift();
  }

  return event;
}

/**
 * Get audit log entries
 * @param {Object} options - Filter options
 * @returns {Array} Audit events
 */
export function getAuditLog(options = {}) {
  let events = [...auditLog];

  // Filter by user
  if (options.userId) {
    events = events.filter((e) => e.userId === options.userId);
  }

  // Filter by action
  if (options.action) {
    events = events.filter((e) => e.action === options.action);
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
 * Get audit log statistics
 * @returns {Object} Statistics about audit log
 */
export function getAuditStatistics() {
  const actionCounts = {};
  const userCounts = {};

  for (const event of auditLog) {
    actionCounts[event.action] = (actionCounts[event.action] || 0) + 1;
    userCounts[event.userId] = (userCounts[event.userId] || 0) + 1;
  }

  return {
    totalEvents: auditLog.length,
    uniqueUsers: Object.keys(userCounts).length,
    actionCounts,
    topUsers: Object.entries(userCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([userId, count]) => ({ userId, count })),
  };
}

/**
 * Clear audit log (admin only)
 * @returns {number} Number of events cleared
 */
export function clearAuditLog() {
  const count = auditLog.length;
  auditLog.length = 0;
  return count;
}

/**
 * Export users data
 * @returns {Object} Users export with stats
 */
export function exportUsers() {
  const users = getAllUsers();
  const stats = {
    totalUsers: users.length,
    byRole: {},
    activeCount: users.filter((u) => u.active).length,
    inactiveCount: users.filter((u) => !u.active).length,
  };

  for (const user of users) {
    stats.byRole[user.role] = (stats.byRole[user.role] || 0) + 1;
  }

  return {
    users,
    statistics: stats,
    exportedAt: new Date(),
  };
}

/**
 * Get user activity summary
 * @param {string} userId - User ID
 * @returns {Object} Activity summary
 */
export function getUserActivity(userId) {
  const events = auditLog.filter((e) => e.userId === userId);

  return {
    userId,
    totalActions: events.length,
    lastAction: events.length > 0 ? events[events.length - 1].timestamp : null,
    actionCounts: events.reduce((acc, e) => {
      acc[e.action] = (acc[e.action] || 0) + 1;
      return acc;
    }, {}),
    recentEvents: events.slice(-10),
  };
}

export default {
  upsertUser,
  getUser,
  getUserByEmail,
  getAllUsers,
  updateUser,
  deactivateUser,
  reactivateUser,
  deleteUser,
  getUserCount,
  logAuditEvent,
  getAuditLog,
  getAuditStatistics,
  clearAuditLog,
  exportUsers,
  getUserActivity,
};
