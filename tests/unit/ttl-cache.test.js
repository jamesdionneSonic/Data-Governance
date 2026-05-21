import { createTtlCache } from '../../src/utils/ttlCache.js';

describe('utils/ttlCache', () => {
  let now;
  let originalDateNow;

  beforeEach(() => {
    now = 1000;
    originalDateNow = Date.now;
    Date.now = () => now;
  });

  afterEach(() => {
    Date.now = originalDateNow;
  });

  test('returns cached values before TTL and null after expiration', () => {
    const cache = createTtlCache({ ttlMs: 50, maxSize: 10 });

    cache.set('alpha', 'A');
    expect(cache.get('alpha')).toBe('A');

    now = 1060;
    expect(cache.get('alpha')).toBeNull();
  });

  test('evicts oldest entries when max size is exceeded', () => {
    const cache = createTtlCache({ ttlMs: 1000, maxSize: 2 });

    cache.set('first', 1);
    cache.set('second', 2);
    cache.set('third', 3);

    expect(cache.get('first')).toBeNull();
    expect(cache.get('second')).toBe(2);
    expect(cache.get('third')).toBe(3);
  });

  test('clear removes all entries', () => {
    const cache = createTtlCache({ ttlMs: 1000, maxSize: 2 });

    cache.set('x', 'X');
    cache.clear();

    expect(cache.get('x')).toBeNull();
  });
});
