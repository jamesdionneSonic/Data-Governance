import {
  recordRequestMetric,
  getPerformanceSummary,
  resetPerformanceMetrics,
} from '../../src/services/performanceService.js';
import { createTtlCache } from '../../src/utils/ttlCache.js';

describe('Performance Service', () => {
  beforeEach(() => {
    resetPerformanceMetrics();
  });

  test('PERF-001: Tracks request count and percentile metrics', () => {
    [10, 25, 40, 100, 200].forEach((duration) => {
      recordRequestMetric({
        method: 'GET',
        route: '/api/v1/search',
        statusCode: 200,
        durationMs: duration,
      });
    });

    const summary = getPerformanceSummary();

    expect(summary.totalRequests).toBe(5);
    expect(summary.p50Ms).toBe(40);
    expect(summary.p95Ms).toBe(200);
    expect(summary.routes.length).toBeGreaterThan(0);
    expect(summary.routes[0].route).toBe('GET /api/v1/search');
  });

  test('PERF-002: Resets performance metrics', () => {
    recordRequestMetric({
      method: 'POST',
      route: '/api/v1/reporting/export/catalog.csv',
      statusCode: 200,
      durationMs: 35,
    });

    resetPerformanceMetrics();
    const summary = getPerformanceSummary();

    expect(summary.totalRequests).toBe(0);
    expect(summary.routes).toHaveLength(0);
    expect(summary.p95Ms).toBe(0);
  });
});

describe('TTL Cache Utility', () => {
  test('PERF-003: Stores and retrieves values before expiration', () => {
    const cache = createTtlCache({ ttlMs: 1000, maxSize: 10 });

    cache.set('key', { value: 123 });
    const cached = cache.get('key');

    expect(cached).toEqual({ value: 123 });
  });

  test('PERF-004: Evicts oldest entry when max size is exceeded', () => {
    const cache = createTtlCache({ ttlMs: 10000, maxSize: 2 });

    cache.set('a', 1);
    cache.set('b', 2);
    cache.set('c', 3);

    expect(cache.get('a')).toBeNull();
    expect(cache.get('b')).toBe(2);
    expect(cache.get('c')).toBe(3);
  });
});
