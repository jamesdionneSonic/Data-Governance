/**
 * Permission Service Tests
 * Tests for RBAC and permission management
 */

import {
  assignPermission,
  getPermission,
  hasPermission,
  revokePermission,
  getUserPermissions,
  getDatabasePermissions,
  getRoleDetails,
  getAllRoles,
} from '../../src/services/permissionService.js';

describe('Permission Service', () => {
  describe('Role Management', () => {
    it('should get all available roles', () => {
      const roles = getAllRoles();
      expect(Array.isArray(roles)).toBe(true);
      expect(roles.length).toBeGreaterThan(0);

      const roleNames = roles.map((r) => r.name);
      expect(roleNames).toContain('Admin');
      expect(roleNames).toContain('PowerUser');
      expect(roleNames).toContain('Analyst');
      expect(roleNames).toContain('Viewer');
    });

    it('should get role details', () => {
      const adminRole = getRoleDetails('Admin');
      expect(adminRole).toBeDefined();
      expect(adminRole.permissions).toBeDefined();
      expect(Array.isArray(adminRole.permissions)).toBe(true);
    });

    it('should return null for invalid role', () => {
      const role = getRoleDetails('InvalidRole');
      expect(role).toBeNull();
    });
  });

  describe('Permission Assignment', () => {
    it('should assign permission to user for database', () => {
      const userId = 'user-123';
      const database = 'test_db';
      const role = 'Analyst';

      assignPermission(userId, database, role);
      const perm = getPermission(userId, database);

      expect(perm).toBe(role);
    });

    it('should throw error for invalid role', () => {
      const userId = 'user-456';
      const database = 'test_db';
      const role = 'InvalidRole';

      expect(() => {
        assignPermission(userId, database, role);
      }).toThrow();
    });

    it('should update permission when reassigning', () => {
      const userId = 'user-789';
      const database = 'test_db';

      assignPermission(userId, database, 'Viewer');
      expect(getPermission(userId, database)).toBe('Viewer');

      assignPermission(userId, database, 'PowerUser');
      expect(getPermission(userId, database)).toBe('PowerUser');
    });
  });

  describe('Permission Checks', () => {
    beforeEach(() => {
      // Setup test permissions
      assignPermission('admin-user', 'test_db', 'Admin');
      assignPermission('analyst-user', 'test_db', 'Analyst');
      assignPermission('viewer-user', 'test_db', 'Viewer');
    });

    it('should grant all permissions to Admin', () => {
      const userId = 'admin-user';
      const database = 'test_db';

      expect(hasPermission(userId, database, 'read')).toBe(true);
      expect(hasPermission(userId, database, 'write')).toBe(true);
      expect(hasPermission(userId, database, 'delete')).toBe(true);
      expect(hasPermission(userId, database, 'admin')).toBe(true);
    });

    it('should grant read and analytics to Analyst', () => {
      const userId = 'analyst-user';
      const database = 'test_db';

      expect(hasPermission(userId, database, 'read')).toBe(true);
      expect(hasPermission(userId, database, 'read')).toBe(true);
      expect(hasPermission(userId, database, 'write')).toBe(false);
    });

    it('should grant only read to Viewer', () => {
      const userId = 'viewer-user';
      const database = 'test_db';

      expect(hasPermission(userId, database, 'read')).toBe(true);
      expect(hasPermission(userId, database, 'write')).toBe(false);
      expect(hasPermission(userId, database, 'admin')).toBe(false);
    });

    it('should deny access for user without permission', () => {
      const userId = 'unknown-user';
      const database = 'test_db';

      expect(hasPermission(userId, database, 'read')).toBe(false);
      expect(getPermission(userId, database)).toBeNull();
    });
  });

  describe('Permission Revocation', () => {
    it('should revoke permission', () => {
      const userId = 'user-revoke-test';
      const database = 'test_db';

      assignPermission(userId, database, 'PowerUser');
      expect(getPermission(userId, database)).toBe('PowerUser');

      revokePermission(userId, database);
      expect(getPermission(userId, database)).toBeNull();
    });

    it('should handle revoking non-existent permission', () => {
      const userId = 'non-existent-user';
      const database = 'test_db';

      expect(() => {
        revokePermission(userId, database);
      }).not.toThrow();

      expect(getPermission(userId, database)).toBeNull();
    });
  });

  describe('Permission Queries', () => {
    beforeEach(() => {
      assignPermission('user-multi', 'db1', 'Admin');
      assignPermission('user-multi', 'db2', 'PowerUser');
      assignPermission('user-multi', 'db3', 'Analyst');

      assignPermission('user-db1', 'db1', 'Viewer');
      assignPermission('user-db3', 'db3', 'Viewer');
    });

    it('should get all permissions for a user', () => {
      const perms = getUserPermissions('user-multi');
      expect(Object.keys(perms).length).toBe(3);
      expect(perms.db1).toBe('Admin');
      expect(perms.db2).toBe('PowerUser');
      expect(perms.db3).toBe('Analyst');
    });

    it('should get all permissions for a database', () => {
      const perms = getDatabasePermissions('db1');
      expect(perms['user-multi']).toBe('Admin');
      expect(perms['user-db1']).toBe('Viewer');
    });

    it('should return empty object for user with no permissions', () => {
      const perms = getUserPermissions('no-permissions-user');
      expect(Object.keys(perms).length).toBe(0);
    });
  });
});
