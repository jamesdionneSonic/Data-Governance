import 'dotenv/config';

import {
  summarizeConfluenceError,
  syncConfluenceExport,
} from '../src/services/confluenceSyncService.js';

const dryRun = !process.argv.includes('--publish');
const replaceGenerated = process.argv.includes('--replace-generated');
const skipAttachments = process.argv.includes('--skip-attachments');

function valuesAfterFlag(flag) {
  const values = [];
  for (let index = 0; index < process.argv.length; index += 1) {
    if (process.argv[index] === flag && process.argv[index + 1]) {
      values.push(process.argv[index + 1]);
      index += 1;
    }
  }
  return values;
}

const onlyTitles = valuesAfterFlag('--only-title');
const deleteTitles = valuesAfterFlag('--delete-title');
const [deleteParentTitle] = valuesAfterFlag('--delete-parent-title');

try {
  const result = await syncConfluenceExport({
    dryRun,
    replaceGenerated,
    onlyTitles,
    skipAttachments,
    deleteTitles,
    deleteParentTitle,
  });

  console.log(JSON.stringify(result, null, 2));

  if (result.status === 'blocked') {
    process.exitCode = 1;
  }
} catch (err) {
  console.error(JSON.stringify(summarizeConfluenceError(err), null, 2));
  process.exitCode = 1;
}
