/**
 * User Service
 * Manages user data and session management
 */

import { v4 as uuidv4 } from 'uuid';

/**
 * In-memory user store (replace with database in production)
 * For development only
 */
const users = new Map();
const sessions = new Map();

/**
 * Create or get user after Entra ID login
 * @param {Object} entraUser - User claims from Entra ID token
 * @returns {Object} User object
 */
export function createOrGetUser(entraUser) {
  const userId = entraUser.oid || entraUser.sub || uuidv4();
  const normalizedEmail = (entraUser.email || entraUser.preferred_username || '').toLowerCase();

  const isAdminEmail = /admin|owner|governance|platform/.test(normalizedEmail);
  const isPowerUserEmail = /poweruser|engineer|steward/.test(normalizedEmail);
  const isAnalystEmail = /analyst|bi|report/.test(normalizedEmail);

  let defaultRoles = ['Viewer'];
  if (isAdminEmail) {
    defaultRoles = ['Admin'];
  } else if (isPowerUserEmail) {
    defaultRoles = ['PowerUser'];
  } else if (isAnalystEmail) {
    defaultRoles = ['Analyst'];
  }

  const defaultDatabases = isAdminEmail
    ? ['sales', 'hr', 'finance', 'analytics', 'platform']
    : ['analytics'];

  // Check if user exists
  if (users.has(userId)) {
    return users.get(userId);
  }

  // Create new user
  const user = {
    id: userId,
    email: entraUser.email || entraUser.preferred_username || '',
    name: entraUser.name || '',
    roles: defaultRoles,
    databases: defaultDatabases,
    createdAt: new Date(),
    lastLogin: new Date(),
  };

  users.set(userId, user);
  return user;
}

/**
 * Get user by ID
 * @param {string} userId - User ID
 * @returns {Object|null} User object or null
 */
export function getUser(userId) {
  return users.get(userId) || null;
}

/**
 * Update user roles
 * @param {string} userId - User ID
 * @param {Array} roles - New roles
 * @returns {Object} Updated user
 */
export function updateUserRoles(userId, roles) {
  const user = users.get(userId);

  if (!user) {
    throw new Error(`User not found: ${userId}`);
  }

  user.roles = roles;
  users.set(userId, user);
  return user;
}

/**
 * Assign database to user
 * @param {string} userId - User ID
 * @param {string} database - Database name
 * @param {string} role - Role in database (Admin, PowerUser, Analyst, Viewer)
 * @returns {Object} Updated user
 */
export function assignDatabase(userId, database, _role = 'Viewer') {
  const user = users.get(userId);

  if (!user) {
    throw new Error(`User not found: ${userId}`);
  }

  if (!user.databases.includes(database)) {
    user.databases.push(database);
  }

  users.set(userId, user);
  return user;
}

/**
 * Revoke database access from user
 * @param {string} userId - User ID
 * @param {string} database - Database name
 * @returns {Object} Updated user
 */
export function revokeDatabase(userId, database) {
  const user = users.get(userId);

  if (!user) {
    throw new Error(`User not found: ${userId}`);
  }

  user.databases = user.databases.filter((db) => db !== database);
  users.set(userId, user);
  return user;
}

/**
 * Get all users
 * @returns {Array} Array of user objects
 */
export function getAllUsers() {
  return Array.from(users.values());
}

/**
 * Create session
 * @param {string} userId - User ID
 * @param {Object} data - Session data
 * @returns {Object} Session object
 */
export function createSession(userId, data = {}) {
  const sessionId = uuidv4();
  const session = {
    id: sessionId,
    userId,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    ...data,
  };

  sessions.set(sessionId, session);
  return session;
}

/**
 * Get session
 * @param {string} sessionId - Session ID
 * @returns {Object|null} Session object or null
 */
export function getSession(sessionId) {
  const session = sessions.get(sessionId);

  if (session && session.expiresAt < new Date()) {
    sessions.delete(sessionId);
    return null;
  }

  return session || null;
}

/**
 * Delete session
 * @param {string} sessionId - Session ID
 */
export function deleteSession(sessionId) {
  sessions.delete(sessionId);
}

export default {
  createOrGetUser,
  getUser,
  updateUserRoles,
  assignDatabase,
  revokeDatabase,
  getAllUsers,
  createSession,
  getSession,
  deleteSession,
};
