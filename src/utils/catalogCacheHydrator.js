import path from 'path';
import { getObjectsCache } from '../services/objectCacheStore.js';

let hydrationPromise = null;

function resolveMarkdownDataPath() {
  return path.resolve(process.cwd(), process.env.MARKDOWN_DATA_PATH || 'data/markdown');
}

export async function ensureCatalogCacheHydrated({ force = false } = {}) {
  const currentObjects = getObjectsCache();
  if (!force && currentObjects.size > 0) {
    return {
      hydrated: false,
      count: currentObjects.size,
      dataPath: resolveMarkdownDataPath(),
    };
  }

  if (hydrationPromise) {
    return hydrationPromise;
  }

  hydrationPromise = (async () => {
    const dataPath = resolveMarkdownDataPath();
    const { loadRuntimeCatalog } = await import('../services/catalogRuntimeService.js');
    const { initializeCache } = await import('./cacheInitializer.js');
    const runtimeCatalog = await loadRuntimeCatalog(dataPath, {
      autoRebuild: process.env.NODE_ENV === 'test',
    });
    const { objects } = runtimeCatalog;

    if (objects.size > 0) {
      initializeCache(objects, runtimeCatalog.lineageGraph, runtimeCatalog);
    }

    return {
      hydrated: objects.size > 0,
      count: objects.size,
      dataPath,
    };
  })().finally(() => {
    hydrationPromise = null;
  });

  return hydrationPromise;
}

export default {
  ensureCatalogCacheHydrated,
};
