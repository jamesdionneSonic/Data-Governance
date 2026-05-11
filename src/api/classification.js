/**
 * Classification API Routes
 * Serves taxonomy definitions and per-asset classification results
 */

import { createApiRouter } from '../utils/apiRouter.js';
import { authenticate } from '../middleware/auth.js';
import { sendErrorResponse } from '../middleware/errorHandler.js';
import { loadTaxonomy, classifyAsset } from '../services/classificationService.js';

const router = createApiRouter();

// In-memory asset cache — populated via setClassificationCache()
let assetCache = null;

/**
 * Called by app.js / index.js after assets are loaded from markdown
 * @param {Map} assets
 */
export function setClassificationCache(assets) {
  assetCache = assets;
}

/**
 * GET /api/v1/classification/taxonomy
 * Returns the full classification taxonomy YAML as JSON
 */
router.get('/taxonomy', authenticate, (_req, res) => {
  const taxonomy = loadTaxonomy();
  return res.json({ status: 'success', taxonomy });
});

/**
 * GET /api/v1/classification/asset/:assetId
 * Returns auto-classification labels for a single asset
 * assetId format: database.objectname (e.g. sales.orders)
 */
router.get('/asset/:assetId', authenticate, (req, res) => {
  const { assetId } = req.params;

  if (!assetCache) {
    return sendErrorResponse(res, req, 503, 'Asset index not yet loaded', {
      code: 'SERVICE_UNAVAILABLE',
    });
  }

  const asset = assetCache.get(assetId);
  if (!asset) {
    return sendErrorResponse(res, req, 404, `Asset '${assetId}' not found`, {
      code: 'NOT_FOUND',
    });
  }

  const classifications = classifyAsset(asset);

  return res.json({
    status: 'success',
    asset_id: assetId,
    classifications,
  });
});

/**
 * GET /api/v1/classification/summary
 * Returns classification counts across all assets
 */
router.get('/summary', authenticate, (_req, res) => {
  if (!assetCache) {
    return sendErrorResponse(res, _req, 503, 'Asset index not yet loaded', {
      code: 'SERVICE_UNAVAILABLE',
    });
  }

  const counts = {};
  for (const asset of assetCache.values()) {
    const labels = classifyAsset(asset);
    for (const label of labels) {
      counts[label] = (counts[label] || 0) + 1;
    }
  }

  return res.json({
    status: 'success',
    total_assets: assetCache.size,
    classification_counts: counts,
  });
});

export default router;
