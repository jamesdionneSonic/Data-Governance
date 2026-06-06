import { createApiRouter } from '../utils/apiRouter.js';
import { authenticate } from '../middleware/auth.js';
import { sendErrorResponse } from '../middleware/errorHandler.js';
import { getObjectsCache } from '../services/objectCacheStore.js';
import { ensureCatalogCacheHydrated } from '../utils/catalogCacheHydrator.js';
import { getLineageGraph } from '../services/catalogRuntimeStore.js';
import {
  buildDictionaryMarkdownExport,
  buildObjectDictionary,
  buildSchemaDictionary,
} from '../services/schemaDictionaryService.js';

const router = createApiRouter();

function runtimeLineageGraph() {
  try {
    return getLineageGraph() || new Map();
  } catch {
    return new Map();
  }
}

router.get('/', authenticate, async (req, res) => {
  try {
    await ensureCatalogCacheHydrated();
    const dictionary = buildSchemaDictionary(getObjectsCache(), runtimeLineageGraph(), req.query);

    return res.json({
      status: 'success',
      message: 'Schema dictionary retrieved',
      data: dictionary,
    });
  } catch (err) {
    return sendErrorResponse(res, req, 500, err.message, {
      code: 'DICTIONARY_ERROR',
    });
  }
});

router.get('/:assetId', authenticate, async (req, res) => {
  try {
    await ensureCatalogCacheHydrated();
    const dictionary = buildObjectDictionary(getObjectsCache(), runtimeLineageGraph(), req.params.assetId);

    if (!dictionary) {
      return sendErrorResponse(res, req, 404, `Object '${req.params.assetId}' not found`, {
        code: 'NOT_FOUND',
      });
    }

    return res.json({
      status: 'success',
      message: 'Object dictionary retrieved',
      data: dictionary,
    });
  } catch (err) {
    return sendErrorResponse(res, req, 500, err.message, {
      code: 'OBJECT_DICTIONARY_ERROR',
    });
  }
});

router.get('/:assetId/export.md', authenticate, async (req, res) => {
  try {
    await ensureCatalogCacheHydrated();
    const dictionary = buildObjectDictionary(getObjectsCache(), runtimeLineageGraph(), req.params.assetId);

    if (!dictionary) {
      return sendErrorResponse(res, req, 404, `Object '${req.params.assetId}' not found`, {
        code: 'NOT_FOUND',
      });
    }

    res.setHeader('content-type', 'text/markdown; charset=utf-8');
    res.setHeader('content-disposition', `attachment; filename="${req.params.assetId.replace(/[^a-z0-9_.-]/gi, '_')}-dictionary.md"`);
    return res.send(buildDictionaryMarkdownExport(dictionary));
  } catch (err) {
    return sendErrorResponse(res, req, 500, err.message, {
      code: 'DICTIONARY_EXPORT_ERROR',
    });
  }
});

export default router;
