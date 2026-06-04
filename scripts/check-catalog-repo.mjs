import 'dotenv/config';

import { validateCatalogRepo } from '../src/services/catalogRepoExportService.js';

const result = await validateCatalogRepo();

console.log(JSON.stringify(result, null, 2));

if (result.status !== 'ok') {
  process.exitCode = 1;
}
