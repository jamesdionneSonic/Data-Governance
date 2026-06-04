import 'dotenv/config';

import { loadRuntimeCatalog } from '../src/services/catalogRuntimeService.js';

function memoryUsageMb() {
  const usage = process.memoryUsage();
  return {
    rss: Math.round(usage.rss / 1024 / 1024),
    heapTotal: Math.round(usage.heapTotal / 1024 / 1024),
    heapUsed: Math.round(usage.heapUsed / 1024 / 1024),
  };
}

const dataPath = process.argv[2] || process.env.MARKDOWN_DATA_PATH || './data/markdown';
const startedAt = Date.now();

try {
  const runtimeCatalog = await loadRuntimeCatalog(dataPath, { autoRebuild: false });
  console.log(
    JSON.stringify(
      {
        status: 'ok',
        dataPath: runtimeCatalog.dataPath,
        generatedAt: runtimeCatalog.generatedAt,
        runtimeManifestGeneratedAt: runtimeCatalog.manifest?.generated_at || null,
        mode: runtimeCatalog.mode,
        objects: runtimeCatalog.objects.size,
        typedEdges: runtimeCatalog.typedEdges.length,
        objectFileIndex: runtimeCatalog.objectFileIndex.size,
        elapsedMs: Date.now() - startedAt,
        memoryUsageMb: memoryUsageMb(),
      },
      null,
      2
    )
  );
} catch (err) {
  console.error(
    JSON.stringify(
      {
        status: 'failed',
        code: err.code || 'RUNTIME_CATALOG_CHECK_FAILED',
        message: err.message,
        dataPath,
        elapsedMs: Date.now() - startedAt,
        memoryUsageMb: memoryUsageMb(),
      },
      null,
      2
    )
  );
  process.exitCode = 1;
}
