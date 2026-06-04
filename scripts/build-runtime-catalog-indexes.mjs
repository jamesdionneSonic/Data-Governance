import 'dotenv/config';

import { buildRuntimeCatalogIndexes } from '../src/services/catalogRuntimeService.js';

function numberArg(name, fallback) {
  const index = process.argv.indexOf(name);
  if (index < 0) return fallback;
  const value = Number(process.argv[index + 1]);
  return Number.isFinite(value) ? value : fallback;
}

const result = await buildRuntimeCatalogIndexes(
  process.env.MARKDOWN_DATA_PATH || './data/markdown',
  {
    concurrency: numberArg('--concurrency', undefined),
  }
);

console.log(JSON.stringify(result, null, 2));
