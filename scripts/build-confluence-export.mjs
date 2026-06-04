import 'dotenv/config';

import { buildConfluenceExport } from '../src/services/confluenceExportService.js';

function numberArg(name, fallback) {
  const index = process.argv.indexOf(name);
  if (index < 0) return fallback;
  const value = Number(process.argv[index + 1]);
  return Number.isFinite(value) ? value : fallback;
}

const result = await buildConfluenceExport({
  shardObjectLimit: numberArg('--shard-object-limit', undefined),
  cleanOutput: !process.argv.includes('--no-clean'),
});

console.log(
  JSON.stringify(
    {
      outputRoot: result.outputRoot,
      manifestPath: result.manifestPath,
      pages: result.manifest.pages.length,
      objectLocatorPages: result.manifest.object_locator_pages.length,
      quickContextPages: result.manifest.quick_context_pages.length,
      shardPages: result.manifest.shard_pages.length,
      governedAssetPages: result.manifest.object_pages.length,
      attachments: result.manifest.attachments.length,
      objects: result.manifest.stats.objects,
    },
    null,
    2
  )
);
