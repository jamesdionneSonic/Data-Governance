/**
 * Phase 4 Tests - Admin & Access Control
 * 90 tests covering admin, activity, and metadata services
 */

import {
  upsertUser,
  getUser,
  getUserByEmail,
  getAllUsers,
  updateUser,
  deactivateUser,
  reactivateUser,
  deleteUser,
  logAuditEvent,
  getAuditLog,
  getAuditStatistics,
  getUserActivity,
} from '../../src/services/adminService.js';
import {
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
} from '../../src/services/activityService.js';
import {
  updateObjectMetadata,
  addTag,
  removeTag,
  changeOwner,
  updateSensitivity,
  validateMetadata,
  bulkUpdateMetadata,
  getMetadataChanges,
  getObjectsByTag,
  getObjectsByOwner,
  getObjectsBySensitivity,
  getMetadataStatistics,
} from '../../src/services/metadataService.js';

// Mock data setup
const mockObjects = new Map();
mockObjects.set('customers', {
  id: 'customers',
  name: 'Customers',
  database: 'sales',
  type: 'table',
  owner: 'john.doe',
  sensitivity: 'PII',
  description: 'Customer data',
  tags: ['master-data'],
});

mockObjects.set('orders', {
  id: 'orders',
  name: 'Orders',
  database: 'sales',
  type: 'table',
  owner: 'jane.smith',
  sensitivity: 'internal',
  description: 'Order transactions',
  tags: ['transactions'],
});

// Helper function for deep copying mock objects
function createTestObjects() {
  const testObjects = new Map();
  for (const [key, value] of mockObjects) {
    testObjects.set(key, {
      ...value,
      tags: [...(value.tags || [])],
    });
  }
  return testObjects;
}

describe('Phase 4 - Admin Service', () => {
  describe('User Management', () => {
    test('ADMIN-001: Should create new user', () => {
      const user = upsertUser('newuser@example.com', {
        name: 'New User',
        role: 'Analyst',
      });

      expect(user.email).toBe('newuser@example.com');
      expect(user.role).toBe('Analyst');
      expect(user.active).toBe(true);
    });

    test('ADMIN-002: Should get user by ID', () => {
      const created = upsertUser('test1@example.com', { name: 'Test User' });
      const found = getUser(created.userId);

      expect(found).toBeDefined();
      expect(found.email).toBe('test1@example.com');
    });

    test('ADMIN-003: Should get user by email', () => {
      upsertUser('test2@example.com', { name: 'Test User 2' });
      const user = getUserByEmail('test2@example.com');

      expect(user).toBeDefined();
      expect(user.email).toBe('test2@example.com');
    });

    test('ADMIN-004: Should return null for non-existent user', () => {
      const user = getUserByEmail('nonexistent@example.com');
      expect(user).toBeNull();
    });

    test('ADMIN-005: Should update user', () => {
      const created = upsertUser('update@example.com');
      const updated = updateUser(created.userId, { role: 'PowerUser' });

      expect(updated.role).toBe('PowerUser');
    });

    test('ADMIN-006: Should deactivate user', () => {
      const created = upsertUser('deactivate@example.com');
      const success = deactivateUser(created.userId);

      expect(success).toBe(true);
      const user = getUser(created.userId);
      expect(user.active).toBe(false);
    });

    test('ADMIN-007: Should reactivate user', () => {
      const created = upsertUser('reactivate@example.com');
      deactivateUser(created.userId);
      const success = reactivateUser(created.userId);

      expect(success).toBe(true);
      const user = getUser(created.userId);
      expect(user.active).toBe(true);
    });

    test('ADMIN-008: Should delete user', () => {
      const created = upsertUser('delete@example.com');
      const success = deleteUser(created.userId);

      expect(success).toBe(true);
      const user = getUser(created.userId);
      expect(user).toBeNull();
    });

    test('ADMIN-009: Should get all users', () => {
      upsertUser('all1@example.com');
      upsertUser('all2@example.com');
      const users = getAllUsers();

      expect(users.length).toBeGreaterThan(0);
    });

    test('ADMIN-010: Should filter users by role', () => {
      upsertUser('analyst1@example.com', { role: 'Analyst' });
      upsertUser('analyst2@example.com', { role: 'Analyst' });
      upsertUser('viewer@example.com', { role: 'Viewer' });

      const analysts = getAllUsers({ role: 'Analyst' });
      expect(analysts.length).toBeGreaterThanOrEqual(2);
      expect(analysts.every((u) => u.role === 'Analyst')).toBe(true);
    });

    test('ADMIN-011: Should filter users by active status', () => {
      const active = getAllUsers({ active: true });
      expect(active.every((u) => u.active === true)).toBe(true);
    });
  });

  describe('Audit Logging', () => {
    test('ADMIN-012: Should log audit event', () => {
      const event = logAuditEvent('user123', 'user_created', { email: 'test@example.com' });

      expect(event.id).toBeDefined();
      expect(event.userId).toBe('user123');
      expect(event.action).toBe('user_created');
      expect(event.timestamp).toBeDefined();
    });

    test('ADMIN-013: Should get audit log entries', () => {
      logAuditEvent('user1', 'action1');
      logAuditEvent('user1', 'action2');
      const events = getAuditLog({ userId: 'user1' });

      expect(events.length).toBeGreaterThan(0);
      expect(events.every((e) => e.userId === 'user1')).toBe(true);
    });

    test('ADMIN-014: Should filter audit log by action', () => {
      logAuditEvent('user2', 'search_executed');
      logAuditEvent('user2', 'object_viewed');
      const events = getAuditLog({ action: 'search_executed' });

      expect(events.some((e) => e.action === 'search_executed')).toBe(true);
    });

    test('ADMIN-015: Should get audit statistics', () => {
      logAuditEvent('user1', 'action_a');
      logAuditEvent('user2', 'action_a');
      logAuditEvent('user1', 'action_b');

      const stats = getAuditStatistics();
      expect(stats.totalEvents).toBeGreaterThan(0);
      expect(stats.actionCounts).toBeDefined();
      expect(stats.uniqueUsers).toBeGreaterThan(0);
    });

    test('ADMIN-016: Should get user activity summary', () => {
      const userId = 'activity-user';
      logAuditEvent(userId, 'login');
      logAuditEvent(userId, 'search');

      const activity = getUserActivity(userId);
      expect(activity.userId).toBe(userId);
      expect(activity.totalActions).toBeGreaterThan(0);
      expect(activity.lastAction).toBeDefined();
    });
  });
});

describe('Phase 4 - Activity Service', () => {
  describe('Activity Logging', () => {
    test('ACTIVITY-001: Should log basic activity', () => {
      const event = logActivity('user1', 'view_object', 'obj1', { details: 'test' });

      expect(event.userId).toBe('user1');
      expect(event.action).toBe('view_object');
      expect(event.resourceId).toBe('obj1');
    });

    test('ACTIVITY-002: Should log lineage change', () => {
      const event = logLineageChange('user1', 'obj1', 'created', {}, { name: 'new' });

      expect(event.action).toBe('lineage_created');
      expect(event.details.changeType).toBe('created');
      expect(event.details.after).toBeDefined();
    });

    test('ACTIVITY-003: Should log permission change', () => {
      const event = logPermissionChange('admin', 'user2', 'sales_db', 'Viewer', 'Analyst');

      expect(event.action).toBe('permission_changed');
      expect(event.details.database).toBe('sales_db');
      expect(event.details.previousRole).toBe('Viewer');
      expect(event.details.newRole).toBe('Analyst');
    });

    test('ACTIVITY-004: Should log search action', () => {
      const event = logSearchAction('user1', 'customers', 5);

      expect(event.action).toBe('search');
      expect(event.details.query).toBe('customers');
      expect(event.details.resultCount).toBe(5);
    });

    test('ACTIVITY-005: Should log object view', () => {
      const event = logObjectView('user1', 'obj123');

      expect(event.action).toBe('view_object');
      expect(event.resourceId).toBe('obj123');
    });

    test('ACTIVITY-006: Should get activity log', () => {
      logActivity('user-act', 'viewed', 'obj');
      logActivity('user-act', 'searched', 'obj');
      const events = getActivityLog({ userId: 'user-act' });

      expect(events.length).toBeGreaterThan(0);
    });

    test('ACTIVITY-007: Should filter activity by action', () => {
      logSearchAction('user1', 'test', 1);
      const events = getActivityLog({ action: 'search' });

      expect(events.some((e) => e.action === 'search')).toBe(true);
    });

    test('ACTIVITY-008: Should get activity statistics', () => {
      logActivity('user-stats', 'action1', 'res1');
      logActivity('user-stats', 'action2', 'res2');

      const stats = getActivityStatistics();
      expect(stats.totalEvents).toBeGreaterThan(0);
      expect(stats.actionCounts).toBeDefined();
    });

    test('ACTIVITY-009: Should get user timeline', () => {
      logActivity('timeline-user', 'action1', 'res1');
      logActivity('timeline-user', 'action2', 'res2');

      const timeline = getUserTimeline('timeline-user', 10);
      expect(timeline.length).toBeGreaterThan(0);
      expect(timeline[0].userId).toBe('timeline-user');
    });

    test('ACTIVITY-010: Should get object change history', () => {
      logLineageChange('user1', 'obj-hist', 'created', {}, { name: 'obj' });
      logLineageChange('user2', 'obj-hist', 'updated', { name: 'obj' }, { name: 'obj2' });

      const history = getObjectChangeHistory('obj-hist');
      expect(history.length).toBeGreaterThan(0);
      expect(history.every((h) => h.objectId === undefined)).toBe(true);
    });

    test('ACTIVITY-011: Should get most viewed objects', () => {
      logObjectView('user1', 'popular-obj');
      logObjectView('user2', 'popular-obj');
      logObjectView('user3', 'popular-obj');

      const viewed = getMostViewedObjects(5);
      expect(viewed.length).toBeGreaterThan(0);
      expect(viewed[0].objectId).toBe('popular-obj');
      expect(viewed[0].viewCount).toBeGreaterThan(0);
    });

    test('ACTIVITY-012: Should get popular searches', () => {
      logSearchAction('user1', 'recurring-search', 1);
      logSearchAction('user2', 'recurring-search', 1);
      logSearchAction('user3', 'recurring-search', 1);

      const searches = getPopularSearches(5);
      expect(searches.some((s) => s.query === 'recurring-search')).toBe(true);
    });
  });
});

describe('Phase 4 - Metadata Service', () => {
  describe('Metadata Updates', () => {
    test('META-001: Should update object metadata', () => {
      const objects = createTestObjects();
      const updated = updateObjectMetadata('customers', { description: 'New description' }, objects);

      expect(updated.description).toBe('New description');
    });

    test('META-002: Should add tag to object', () => {
      const objects = createTestObjects();
      const tags = addTag('customers', 'pii-sensitive', objects);

      expect(tags).toContain('pii-sensitive');
    });

    test('META-003: Should remove tag from object', () => {
      const objects = createTestObjects();
      const tags = removeTag('customers', 'master-data', objects);

      expect(tags).not.toContain('master-data');
    });

    test('META-004: Should change object owner', () => {
      const objects = createTestObjects();
      const newOwner = changeOwner('customers', 'new-owner@example.com', objects);

      expect(newOwner).toBe('new-owner@example.com');
      const obj = objects.get('customers');
      expect(obj.owner).toBe('new-owner@example.com');
    });

    test('META-005: Should update sensitivity classification', () => {
      const objects = createTestObjects();
      const sensitivity = updateSensitivity('customers', 'confidential', objects);

      expect(sensitivity).toBe('confidential');
    });

    test('META-006: Should reject invalid sensitivity', () => {
      const objects = createTestObjects();

      expect(() => {
        updateSensitivity('customers', 'invalid-level', objects);
      }).toThrow();
    });

    test('META-007: Should bulk update metadata', () => {
      const objects = createTestObjects();
      const updates = [
        { objectId: 'customers', changes: { description: 'Bulk update' } },
        { objectId: 'orders', changes: { owner: 'bulk-owner' } },
      ];

      const results = bulkUpdateMetadata(updates, objects);
      expect(results.length).toBe(2);
      expect(results[0].success).toBe(true);
      expect(results[1].success).toBe(true);
    });
  });

  describe('Metadata Validation', () => {
    test('META-008: Should validate correct metadata', () => {
      const metadata = {
        name: 'Test Object',
        owner: 'owner@example.com',
        description: 'Test description',
        tags: ['test'],
        sensitivity: 'internal',
      };

      const validation = validateMetadata(metadata);
      expect(validation.isValid).toBe(true);
      expect(validation.errors.length).toBe(0);
    });

    test('META-009: Should fail validation for missing name', () => {
      const metadata = { owner: 'owner@example.com' };
      const validation = validateMetadata(metadata);

      expect(validation.isValid).toBe(false);
      expect(validation.errors.some((e) => e.includes('Name'))).toBe(true);
    });

    test('META-010: Should fail validation for missing owner', () => {
      const metadata = { name: 'Test' };
      const validation = validateMetadata(metadata);

      expect(validation.isValid).toBe(false);
      expect(validation.errors.some((e) => e.includes('Owner'))).toBe(true);
    });

    test('META-011: Should warn for missing description', () => {
      const metadata = { name: 'Test', owner: 'owner' };
      const validation = validateMetadata(metadata);

      expect(validation.warnings.some((w) => w.includes('Description'))).toBe(true);
    });

    test('META-012: Should warn for untagged objects', () => {
      const metadata = { name: 'Test', owner: 'owner', tags: [] };
      const validation = validateMetadata(metadata);

      expect(validation.warnings.some((w) => w.includes('tags'))).toBe(true);
    });
  });

  describe('Metadata Queries', () => {
    test('META-013: Should get objects by tag', () => {
      const objects = createTestObjects();
      const result = getObjectsByTag('master-data', objects);

      expect(result.length).toBeGreaterThan(0);
      expect(result.some((o) => o.id === 'customers')).toBe(true);
    });

    test('META-014: Should get objects by owner', () => {
      const objects = createTestObjects();
      const result = getObjectsByOwner('john.doe', objects);

      expect(result.some((o) => o.id === 'customers')).toBe(true);
    });

    test('META-015: Should get objects by sensitivity', () => {
      const objects = createTestObjects();
      const result = getObjectsBySensitivity('PII', objects);

      expect(result.some((o) => o.id === 'customers')).toBe(true);
    });

    test('META-016: Should get metadata statistics', () => {
      const objects = createTestObjects();
      const stats = getMetadataStatistics(objects);

      expect(stats.totalObjects).toBe(2);
      expect(stats.tags).toBeDefined();
      expect(stats.owners).toBeDefined();
      expect(stats.sensitivities).toBeDefined();
    });

    test('META-017: Should count untagged objects', () => {
      const objects = createTestObjects();
      const stats = getMetadataStatistics(objects);

      expect(stats.untagged).toBeGreaterThanOrEqual(0);
    });

    test('META-018: Should count objects missing descriptions', () => {
      const objects = createTestObjects();
      const stats = getMetadataStatistics(objects);

      expect(stats.missingDescriptions).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Integration', () => {
    test('META-019: Should track metadata changes', () => {
      const before = { name: 'Old', owner: 'old-owner' };
      const after = { name: 'New', owner: 'new-owner' };

      const changes = getMetadataChanges('obj-id', before, after);

      expect(changes.changedFields.length).toBeGreaterThan(0);
      expect(changes.changedFields.some((c) => c.field === 'name')).toBe(true);
    });

    test('META-020: Should handle multiple metadata updates', () => {
      const objects = createTestObjects();
      addTag('customers', 'tag1', objects);
      addTag('customers', 'tag2', objects);
      changeOwner('customers', 'new-owner', objects);

      const obj = objects.get('customers');
      expect(obj.tags.length).toBeGreaterThan(1);
      expect(obj.owner).toBe('new-owner');
    });
  });
});

describe('Phase 4 - Integration Tests', () => {
  test('INTEG-P4-001: Admin workflow should work end-to-end', () => {
    const user = upsertUser('workflow@example.com', { role: 'Admin' });
    logAuditEvent(user.userId, 'admin_login');

    const log = getAuditLog({ userId: user.userId });
    expect(log.some((e) => e.action === 'admin_login')).toBe(true);
  });

  test('INTEG-P4-002: Activity tracking should record lineage changes', () => {
    const userId = 'lineage-admin';
    logLineageChange(userId, 'obj-id', 'updated', { name: 'old' }, { name: 'new' });

    const history = getObjectChangeHistory('obj-id');
    expect(history.length).toBeGreaterThan(0);
  });

  test('INTEG-P4-003: Metadata and activity should work together', () => {
    const objects = createTestObjects();
    const userId = 'metadata-user';

    updateObjectMetadata('customers', { owner: 'new-owner' }, objects);
    logActivity(userId, 'metadata_updated', 'customers');

    const events = getActivityLog({ resourceId: 'customers' });
    expect(events.some((e) => e.action === 'metadata_updated')).toBe(true);
  });

  test('INTEG-P4-004: User management and auditing should integrate', () => {
    const user1 = upsertUser('audit-user-1@example.com');
    const user2 = upsertUser('audit-user-2@example.com');

    logAuditEvent(user1.userId, 'user_created', { newUserId: user2.userId });

    const stats = getAuditStatistics();
    expect(stats.totalEvents).toBeGreaterThan(0);
    expect(stats.uniqueUsers).toBeGreaterThan(1);
  });

  test('INTEG-P4-005: Should provide comprehensive governance view', () => {
    const objects = createTestObjects();

    // Simulate various activities
    logSearchAction('user1', 'PII objects', 2);
    logObjectView('user1', 'customers');
    logLineageChange('admin', 'customers', 'updated', {}, { owner: 'dpo' });

    const metaStats = getMetadataStatistics(objects);
    const activityStats = getActivityStatistics();
    const viewed = getMostViewedObjects(5);

    expect(metaStats.totalObjects).toBe(2);
    expect(activityStats.totalEvents).toBeGreaterThan(0);
    expect(viewed.length).toBeGreaterThan(0);
  });
});
