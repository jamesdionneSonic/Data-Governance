import { mkdtemp, rm } from 'fs/promises';
import { tmpdir } from 'os';
import path from 'path';
import { initializeCache } from '../../src/utils/cacheInitializer.js';
import { getObjectsCache } from '../../src/services/objectCacheStore.js';
import { getCatalogDataPath } from '../../src/services/catalogRuntimeStore.js';

describe('utils/cacheInitializer', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    initializeCache(new Map(), new Map(), {});
  });

  afterAll(() => {
    process.env = originalEnv;
    initializeCache(new Map(), new Map(), {});
  });

  test('normalizes array objects, object lineage, and app-prefixed arguments', () => {
    const app = { use() {} };
    const alpha = { id: 'db.alpha', database: 'db', name: 'alpha' };
    const beta = { database: 'db', name: 'beta' };
    const fallback = {};

    initializeCache(
      app,
      [alpha, beta, fallback, null, 7],
      {
        'db.alpha': ['db.beta'],
        'db.beta': new Set(['unknown.unknown']),
        'unknown.unknown': 'not-an-array',
      },
      { dataPath: 'runtime-path' }
    );

    const cache = getObjectsCache();
    expect(cache.size).toBe(3);
    expect(cache.get('db.alpha')).toMatchObject({ upstreamCount: 1, downstreamCount: 0 });
    expect(cache.get('db.beta')).toMatchObject({ upstreamCount: 1, downstreamCount: 1 });
    expect(cache.get('unknown.unknown')).toMatchObject({ upstreamCount: 0, downstreamCount: 1 });
    expect(getCatalogDataPath()).toBe('runtime-path');
  });

  test('normalizes plain object catalogs and empty lineage inputs', () => {
    const gamma = { id: 'db.gamma', database: 'db', name: 'gamma' };

    initializeCache({ 'db.gamma': gamma }, null, null);

    expect(getObjectsCache().get('db.gamma')).toMatchObject({
      upstreamCount: 0,
      downstreamCount: 0,
    });
    expect(getCatalogDataPath()).toBe('');

    initializeCache(null, 42, {});
    expect(getObjectsCache().size).toBe(0);
  });
});

describe('utils/catalogCacheHydrator', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv, NODE_ENV: 'test' };
    initializeCache(new Map(), new Map(), {});
  });

  afterAll(() => {
    process.env = originalEnv;
    initializeCache(new Map(), new Map(), {});
  });

  test('returns current cache details without rebuilding when objects are already loaded', async () => {
    process.env.MARKDOWN_DATA_PATH = 'cached-markdown';
    initializeCache(new Map([['cached.object', { id: 'cached.object' }]]), new Map(), {});
    const { ensureCatalogCacheHydrated } = await import(
      `../../src/utils/catalogCacheHydrator.js?cached=${Date.now()}`
    );

    const result = await ensureCatalogCacheHydrated();

    expect(result).toEqual({
      hydrated: false,
      count: 1,
      dataPath: path.resolve(process.cwd(), 'cached-markdown'),
    });
  });

  test('coalesces concurrent forced hydration and reports an empty runtime safely', async () => {
    const tempDir = await mkdtemp(path.join(tmpdir(), 'dg-empty-catalog-'));
    process.env.MARKDOWN_DATA_PATH = tempDir;
    const { ensureCatalogCacheHydrated } = await import(
      `../../src/utils/catalogCacheHydrator.js?empty=${Date.now()}`
    );

    try {
      const first = ensureCatalogCacheHydrated({ force: true });
      const second = ensureCatalogCacheHydrated({ force: true });
      const [firstResult, secondResult] = await Promise.all([first, second]);

      expect(firstResult).toEqual({
        hydrated: false,
        count: 0,
        dataPath: tempDir,
      });
      expect(secondResult).toEqual(firstResult);
      expect(getObjectsCache().size).toBe(0);
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });
});
