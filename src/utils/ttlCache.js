export function createTtlCache({ ttlMs = 15000, maxSize = 200 } = {}) {
  const store = new Map();

  function evictExpired(now = Date.now()) {
    for (const [key, entry] of store.entries()) {
      if (entry.expiresAt <= now) {
        store.delete(key);
      }
    }
  }

  function evictOverflow() {
    if (store.size <= maxSize) {
      return;
    }

    const keys = store.keys();
    while (store.size > maxSize) {
      const nextKey = keys.next().value;
      if (typeof nextKey === 'undefined') {
        break;
      }
      store.delete(nextKey);
    }
  }

  return {
    get(key) {
      const now = Date.now();
      evictExpired(now);

      const entry = store.get(key);
      return entry ? entry.value : null;
    },
    set(key, value) {
      evictExpired();
      store.set(key, {
        value,
        expiresAt: Date.now() + ttlMs,
      });
      evictOverflow();
      return value;
    },
    clear() {
      store.clear();
    },
  };
}

export default {
  createTtlCache,
};
