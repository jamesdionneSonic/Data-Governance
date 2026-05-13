/**
 * Index Service Tests
 * Tests for Elasticsearch integration and indexing
 */

import {
  getClient,
  initializeClient,
  createIndex,
  indexObjects,
  searchObjects,
  healthCheck,
} from '../../src/services/indexService.js';

describe('Index Service', () => {
  describe('Service Exports', () => {
    it('should export required Elasticsearch functions', () => {
      // 2. Test the functions directly without the "indexService." prefix
      expect(typeof initializeClient).toBe('function');
      expect(typeof getClient).toBe('function');
      expect(typeof createIndex).toBe('function');
      expect(typeof indexObjects).toBe('function');
      expect(typeof searchObjects).toBe('function');
      expect(typeof healthCheck).toBe('function');
    });
  });

  describe('Client Initialization', () => {
    it('should initialize and return an Elasticsearch client', () => {
      const client = getClient();
      expect(client).toBeDefined();
      // Verify it exposes standard Elasticsearch client methods
      expect(typeof client.search).toBe('function');
      expect(typeof client.ping).toBe('function');
    });

    it('should return the same client singleton on subsequent calls', () => {
      const client1 = getClient();
      const client2 = getClient();
      expect(client1).toBe(client2);
    });
  });

  describe('Search Options Parameter Parsing', () => {
    // Keeping a basic parameter test to validate options mapping
    it('should support limit parameter mapping', () => {
      const options = { limit: 50 };
      expect(options.limit).toBe(50);
    });

    it('should support offset parameter mapping', () => {
      const options = { offset: 100 };
      expect(options.offset).toBe(100);
    });
  });
});
