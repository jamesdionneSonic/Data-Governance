import 'dotenv/config';

import { syncConfluenceExport } from '../src/services/confluenceSyncService.js';

const dryRun = !process.argv.includes('--publish');
const result = await syncConfluenceExport({ dryRun });

console.log(JSON.stringify(result, null, 2));

if (result.status === 'blocked') {
  process.exitCode = 1;
}
