/**
 * Permission Store & RBAC Service
 * Manages database-level permissions by role
 */

/**
 * Role definitions and permissions
 * Each role defines what actions are allowed
 */
const rolePermissions = {
  Admin: {
    description: 'Full access to all databases and administrative functions',
    permissions: [
      'read:*',
      'write:*',
      'delete:*',
      'admin:users',
      'admin:permissions',
      'admin:audit',
    ],
  },
  PowerUser: {
    description: 'Can read all data, upload and edit markdown, manage database permissions',
    permissions: ['read:*', 'write:markdown', 'write:objects', 'admin:permissions'],
  },
  Analyst: {
    description: 'Can read all data and generate reports, but no write access',
    permissions: ['read:*', 'read:analytics', 'export:reports'],
  },
  Viewer: {
    description: 'Read-only access to assigned databases',
    permissions: ['read:objects', 'read:lineage'],
  },
};

/**
 * In-memory permission store
 * Maps User ID -> Database -> Role
 * Example: permissions['user-123']['production_hr'] = 'Analyst'
 */
const permissions = new Map();

/**
 * Assign permission (user + database + role)
 * @param {string} userId - User ID
 * @param {string} database - Database name
 * @param {string} role - Role name (Admin, PowerUser, Analyst, Viewer)
 */
export function assignPermission(userId, database, role = 'Viewer') {
  if (!rolePermissions[role]) {
    throw new Error(`Invalid role: ${role}`);
  }

  if (!permissions.has(userId)) {
    permissions.set(userId, new Map());
  }

  permissions.get(userId).set(database, role);
}

/**
 * Get user's role in a database
 * @param {string} userId - User ID
 * @param {string} database - Database name
 * @returns {string|null} Role name or null if no permission
 */
export function getPermission(userId, database) {
  const userPerms = permissions.get(userId);

  if (!userPerms) {
    return null;
  }

  return userPerms.get(database) || null;
}

/**
 * Check if user has permission for action on resource
 * @param {string} userId - User ID
 * @param {string} database - Database name
 * @param {string} action - Action (read, write, delete, admin)
 * @returns {boolean} True if permitted
 */
export function hasPermission(userId, database, action) {
  const role = getPermission(userId, database);

  if (!role) {
    return false;
  }

  const perms = rolePermissions[role]?.permissions || [];

  // Check if user has wildcard permission for this action
  const wildcardPerm = `${action}:*`;
  if (perms.includes(wildcardPerm)) {
    return true;
  }

  // Check if user has specific permission for this action (any resource)
  // This matches patterns like 'read:*', 'read:objects', 'read:lineage', etc.
  return perms.some((perm) => perm.startsWith(`${action}:`));
}

/**
 * Revoke permission
 * @param {string} userId - User ID
 * @param {string} database - Database name
 */
export function revokePermission(userId, database) {
  const userPerms = permissions.get(userId);

  if (userPerms) {
    userPerms.delete(database);

    if (userPerms.size === 0) {
      permissions.delete(userId);
    }
  }
}

/**
 * Get all permissions for a user
 * @param {string} userId - User ID
 * @returns {Object} Map of database -> role
 */
export function getUserPermissions(userId) {
  const userPerms = permissions.get(userId);

  if (!userPerms) {
    return {};
  }

  return Object.fromEntries(userPerms);
}

/**
 * Get all permissions for a database
 * @param {string} database - Database name
 * @returns {Object} Map of user -> role
 */
export function getDatabasePermissions(database) {
  const result = {};

  permissions.forEach((userPerms, userId) => {
    if (userPerms.has(database)) {
      result[userId] = userPerms.get(database);
    }
  });

  return result;
}

/**
 * Get role details
 * @param {string} role - Role name
 * @returns {Object} Role definition
 */
export function getRoleDetails(role) {
  return rolePermissions[role] || null;
}

/**
 * Get all available roles
 * @returns {Array} Array of role definitions
 */
export function getAllRoles() {
  return Object.entries(rolePermissions).map(([name, details]) => ({
    name,
    ...details,
  }));
}

export default {
  assignPermission,
  getPermission,
  hasPermission,
  revokePermission,
  getUserPermissions,
  getDatabasePermissions,
  getRoleDetails,
  getAllRoles,
  rolePermissions,
};
