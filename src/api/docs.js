import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

import { createApiRouter } from '../utils/apiRouter.js';
import { authenticate } from '../middleware/auth.js';

const router = createApiRouter();

const fileName = fileURLToPath(import.meta.url);
const dirName = path.dirname(fileName);
const docsDir = path.resolve(dirName, '../../docs');

const userDocs = [
  { key: 'help-center', title: 'Help Center', fileName: 'HELP_CENTER.md' },
  { key: 'user-guide', title: 'User Guide', fileName: 'USER_GUIDE.md' },
  {
    key: 'troubleshooting-faq',
    title: 'Troubleshooting FAQ',
    fileName: 'TROUBLESHOOTING_FAQ.md',
  },
  {
    key: 'sql-server-quick-reference',
    title: 'SQL Server Quick Reference',
    fileName: 'SQL_SERVER_QUICK_REFERENCE.md',
  },
  {
    key: 'lineage-quick-reference',
    title: 'Lineage Quick Reference',
    fileName: 'LINEAGE_QUICK_REFERENCE.md',
  },
  { key: 'admin-guide', title: 'Admin Guide', fileName: 'ADMIN_GUIDE.md' },
  { key: 'documentation-portal', title: 'Documentation Portal', fileName: 'README.md' },
];

const docsByKey = new Map(userDocs.map((item) => [item.key, item]));

router.use(authenticate);

router.get('/library', (_req, res) => {
  const documents = userDocs.map((item) => ({
    key: item.key,
    title: item.title,
    fileName: item.fileName,
    path: `/api/v1/docs/library/${item.key}/raw`,
  }));

  return res.json({
    status: 'success',
    data: {
      documents,
    },
  });
});

router.get('/library/:key', async (req, res) => {
  const doc = docsByKey.get(req.params.key);
  if (!doc) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Document not found',
    });
  }

  try {
    const fullPath = path.join(docsDir, doc.fileName);
    const content = await readFile(fullPath, 'utf8');

    return res.json({
      status: 'success',
      data: {
        ...doc,
        path: `/api/v1/docs/library/${doc.key}/raw`,
        content,
      },
    });
  } catch (err) {
    return res.status(500).json({
      error: 'Internal Server Error',
      message: `Unable to read document: ${err.message}`,
    });
  }
});

router.get('/library/:key/raw', async (req, res) => {
  const doc = docsByKey.get(req.params.key);
  if (!doc) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Document not found',
    });
  }

  try {
    const fullPath = path.join(docsDir, doc.fileName);
    const content = await readFile(fullPath, 'utf8');
    res.type('text/markdown');
    return res.send(content);
  } catch (err) {
    return res.status(500).json({
      error: 'Internal Server Error',
      message: `Unable to read document: ${err.message}`,
    });
  }
});

export default router;
