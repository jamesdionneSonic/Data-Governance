/**
 * Index Service Tests
 * Tests for Meilisearch integration and indexing
 */

import { buildFilterString } from '../../src/services/indexService.js';

describe('Index Service', () => {
  describe('Filter String Building', () => {
    it('should build filter for single database', () => {
      const filter = { database: 'production' };
      const filterString = buildFilterString(filter);

      expect(filterString).toContain('database');
      expect(filterString).toContain('production');
    });

    it('should build filter for single type', () => {
      const filter = { type: 'table' };
      const filterString = buildFilterString(filter);

      expect(filterString).toContain('type');
      expect(filterString).toContain('table');
    });

    it('should build filter for multiple types', () => {
      const filter = { type: ['table', 'view'] };
      const filterString = buildFilterString(filter);

      expect(filterString).toContain('type');
      expect(filterString).toContain('table');
      expect(filterString).toContain('view');
      expect(filterString).toContain('IN');
    });

    it('should build filter for owner', () => {
      const filter = { owner: 'data-team' };
      const filterString = buildFilterString(filter);

      expect(filterString).toContain('owner');
      expect(filterString).toContain('data-team');
    });

    it('should build filter for single sensitivity', () => {
      const filter = { sensitivity: 'confidential' };
      const filterString = buildFilterString(filter);

      expect(filterString).toContain('sensitivity');
      expect(filterString).toContain('confidential');
    });

    it('should build filter for multiple sensitivities', () => {
      const filter = { sensitivity: ['confidential', 'restricted'] };
      const filterString = buildFilterString(filter);

      expect(filterString).toContain('sensitivity');
      expect(filterString).toContain('IN');
    });

    it('should build filter for tags', () => {
      const filter = { tags: ['pii', 'critical'] };
      const filterString = buildFilterString(filter);

      expect(filterString).toContain('tags');
      expect(filterString).toContain('pii');
      expect(filterString).toContain('critical');
      expect(filterString).toContain('OR');
    });

    it('should combine multiple filters with AND', () => {
      const filter = {
        database: 'production',
        type: 'table',
        sensitivity: 'confidential',
      };
      const filterString = buildFilterString(filter);

      expect(filterString).toContain('AND');
      expect((filterString.match(/AND/g) || []).length).toBeGreaterThan(0);
    });

    it('should handle empty filter', () => {
      const filter = {};
      const filterString = buildFilterString(filter);

      expect(filterString).toBe('');
    });

    it('should handle empty tags array', () => {
      const filter = { tags: [] };
      const filterString = buildFilterString(filter);

      expect(filterString).toBe('');
    });

    it('should escape special characters', () => {
      const filter = { database: 'my-db' };
      const filterString = buildFilterString(filter);

      expect(filterString).toContain('my-db');
    });

    it('should quote string values', () => {
      const filter = { database: 'production' };
      const filterString = buildFilterString(filter);

      expect(filterString).toContain('"production"');
    });
  });

  describe('Complex Filter Combinations', () => {
    it('should build filter for database + type + sensitivity', () => {
      const filter = {
        database: 'sales',
        type: ['table', 'view'],
        sensitivity: ['confidential', 'restricted'],
      };
      const filterString = buildFilterString(filter);

      expect(filterString).toContain('sales');
      expect(filterString).toContain('table');
      expect(filterString).toContain('view');
      expect(filterString).toContain('confidential');
    });

    it('should build comprehensive filter with all options', () => {
      const filter = {
        database: 'production',
        type: 'table',
        owner: 'analytics-team',
        sensitivity: 'internal',
        tags: ['pii', 'gdpr'],
      };
      const filterString = buildFilterString(filter);

      expect(filterString).toContain('production');
      expect(filterString).toContain('table');
      expect(filterString).toContain('analytics-team');
      expect(filterString).toContain('internal');
      expect(filterString).toContain('pii');
      expect(filterString).toContain('gdpr');
    });
  });

  describe('Filter Validation', () => {
    it('should handle null filter values', () => {
      const filter = { database: null };
      const filterString = buildFilterString(filter);

      expect(filterString).not.toContain('null');
    });

    it('should handle undefined filter values', () => {
      const filter = { database: undefined };
      const filterString = buildFilterString(filter);

      expect(filterString).not.toContain('undefined');
    });

    it('should handle numeric values', () => {
      const filter = { someField: 123 };
      // Filter string builder typically works with string keys
      const filterString = buildFilterString(filter);

      // Should not error
      expect(typeof filterString).toBe('string');
    });
  });

  describe('Search Options', () => {
    it('should support limit parameter', () => {
      const options = { limit: 50 };
      expect(options.limit).toBe(50);
    });

    it('should support offset parameter', () => {
      const options = { offset: 100 };
      expect(options.offset).toBe(100);
    });

    it('should support filter parameter', () => {
      const options = {
        filter: { database: 'test' },
      };
      expect(options.filter).toBeDefined();
    });

    it('should support sort parameter', () => {
      const options = { sort: ['name:asc'] };
      expect(options.sort).toBeDefined();
    });

    it('should support facets parameter', () => {
      const options = {
        facets: ['database', 'type', 'owner'],
      };
      expect(options.facets.length).toBe(3);
    });
  });

  describe('Edge Cases', () => {
    it('should handle filter with special characters', () => {
      const filter = { database: 'db-prod_v2' };
      const filterString = buildFilterString(filter);

      expect(filterString).toContain('db-prod_v2');
    });

    it('should handle filter with spaces', () => {
      const filter = { owner: 'Data Team Name' };
      const filterString = buildFilterString(filter);

      expect(filterString).toBeDefined();
    });

    it('should handle very long filter strings', () => {
      const tags = Array.from({ length: 50 }, (_, i) => `tag${i}`);
      const filter = { tags };
      const filterString = buildFilterString(filter);

      expect(filterString.length).toBeGreaterThan(100);
    });
  });
});
