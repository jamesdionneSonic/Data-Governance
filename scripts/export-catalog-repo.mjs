import 'dotenv/config';

import { exportCatalogRepo } from '../src/services/catalogRepoExportService.js';

const result = await exportCatalogRepo();

console.log(JSON.stringify(result, null, 2));
