/**
 * Classification API Routes
 * Serves taxonomy definitions and per-asset classification results
 */

import { createApiRouter } from '../utils/apiRouter.js';
import { authenticate } from '../middleware/auth.js';
import { sendErrorResponse } from '../middleware/errorHandler.js';
import {
  bulkClassifyAssets,
  classifyAssetDetailed,
  deleteCategory,
  deleteRule,
  loadTaxonomy,
  propagateClassifications,
  upsertCategory,
  upsertRule,
} from '../services/classificationService.js';
import {
  analyzeColumnSemantics,
  buildExternalPiiAnalysis,
  buildPiiMaskPlan,
  maskRecord,
} from '../services/piiPolicyService.js';
import {
  columnSemanticsAuditDetails,
  logClassificationDecision,
  piiPlanAuditDetails,
} from '../services/classificationObservabilityService.js';
import {
  buildDatabaseControlPlan,
  buildEffectivePolicy,
  buildPolicyEffectivenessReport,
  evaluatePolicyDecision,
  getPolicyTemplates,
} from '../services/classificationPolicyService.js';
import { getAuditLog } from '../services/adminService.js';

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

router.get('/policies', authenticate, (_req, res) =>
  res.json({
    status: 'success',
    policies: getPolicyTemplates(),
  }));

router.get('/policies/effectiveness', authenticate, (req, res) => {
  if (!assetCache) {
    return sendErrorResponse(res, req, 503, 'Asset index not yet loaded', {
      code: 'SERVICE_UNAVAILABLE',
    });
  }
  return res.json({
    status: 'success',
    report: buildPolicyEffectivenessReport(assetCache, getAuditLog({ action: 'pii_policy_evaluated' })),
  });
});

router.get('/policies/:assetId/effective', authenticate, (req, res) => {
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
  return res.json({
    status: 'success',
    asset_id: assetId,
    effective_policy: buildEffectivePolicy(asset),
  });
});

router.get('/policies/:assetId/database-controls', authenticate, (req, res) => {
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
  return res.json({
    status: 'success',
    asset_id: assetId,
    database_control_plan: buildDatabaseControlPlan(asset),
  });
});

router.post('/policies/:assetId/decision', authenticate, (req, res) => {
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
  const decision = evaluatePolicyDecision(asset, {
    action: req.body?.action,
    role: req.body?.role || req.user?.role || req.user?.roles?.[0],
  });
  logClassificationDecision(req, 'pii_policy_evaluated', {
    asset_id: assetId,
    source: 'policy_decision',
    decision: decision.decision,
    obligations: decision.obligations,
    pii_columns: decision.policy?.decision_basis?.pii_columns || 0,
    strategies: decision.policy?.masking_actions?.map((action) => action.strategy) || [],
    requires_masking: decision.policy?.controls?.mask,
  });
  return res.json({
    status: 'success',
    asset_id: assetId,
    decision,
  });
});

/**
 * POST /api/v1/classification/taxonomy/categories
 * Create or update a classification category in the YAML taxonomy.
 */
router.post('/taxonomy/categories', authenticate, (req, res) => {
  try {
    const taxonomy = upsertCategory(req.body || {}, {
      changed_by: req.user?.email || req.user?.id || 'api',
    });
    return res.status(201).json({ status: 'success', taxonomy });
  } catch (err) {
    return sendErrorResponse(res, req, 400, err.message, { code: 'CLASSIFICATION_SAVE_FAILED' });
  }
});

/**
 * DELETE /api/v1/classification/taxonomy/categories/:id
 */
router.delete('/taxonomy/categories/:id', authenticate, (req, res) => {
  try {
    const taxonomy = deleteCategory(req.params.id, {
      changed_by: req.user?.email || req.user?.id || 'api',
    });
    return res.json({ status: 'success', taxonomy });
  } catch (err) {
    return sendErrorResponse(res, req, 400, err.message, { code: 'CLASSIFICATION_DELETE_FAILED' });
  }
});

/**
 * POST /api/v1/classification/rules
 * Create or update a regex/naming rule.
 */
router.post('/rules', authenticate, (req, res) => {
  try {
    const taxonomy = upsertRule(req.body || {}, {
      changed_by: req.user?.email || req.user?.id || 'api',
    });
    return res.status(201).json({ status: 'success', taxonomy });
  } catch (err) {
    return sendErrorResponse(res, req, 400, err.message, { code: 'CLASSIFICATION_RULE_FAILED' });
  }
});

/**
 * DELETE /api/v1/classification/rules/:id
 */
router.delete('/rules/:id', authenticate, (req, res) => {
  try {
    const taxonomy = deleteRule(req.params.id, {
      changed_by: req.user?.email || req.user?.id || 'api',
    });
    return res.json({ status: 'success', taxonomy });
  } catch (err) {
    return sendErrorResponse(res, req, 400, err.message, { code: 'CLASSIFICATION_RULE_FAILED' });
  }
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

  const result = classifyAssetDetailed(asset);
  const piiPolicy = buildPiiMaskPlan(asset);
  logClassificationDecision(req, 'classification_asset_evaluated', {
    asset_id: assetId,
    classification_count: result.classifications.length,
    pii_columns: piiPolicy.summary?.pii_columns || 0,
    requires_masking: piiPolicy.summary?.requires_masking,
  });

  return res.json({
    status: 'success',
    asset_id: assetId,
    classifications: result.classifications,
    result,
    pii_policy: piiPolicy,
  });
});

/**
 * GET /api/v1/classification/pii/:assetId
 * Returns a metadata-only PII detection and masking plan for an asset.
 */
router.get('/pii/:assetId', authenticate, (req, res) => {
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

  const piiPolicy = buildPiiMaskPlan(asset);
  logClassificationDecision(req, 'pii_policy_evaluated', piiPlanAuditDetails(piiPolicy));

  return res.json({
    status: 'success',
    asset_id: assetId,
    pii_policy: piiPolicy,
  });
});

/**
 * GET /api/v1/classification/pii/:assetId/external
 * Optional external PII analysis using Presidio Analyzer REST when configured.
 */
router.get('/pii/:assetId/external', authenticate, async (req, res) => {
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

  try {
    const analysis = await buildExternalPiiAnalysis(asset, {
      endpoint: req.query.endpoint,
      scoreThreshold: req.query.score_threshold,
    });
    logClassificationDecision(req, 'pii_policy_evaluated', {
      asset_id: assetId,
      pii_columns: analysis.entities?.length || 0,
      source: 'presidio_external',
      strategies: (analysis.entities || []).map((entity) => entity.mask_strategy),
    });

    return res.json({
      status: 'success',
      asset_id: assetId,
      external_pii_analysis: analysis,
    });
  } catch (err) {
    return sendErrorResponse(res, req, 502, err.message, { code: 'EXTERNAL_PII_ERROR' });
  }
});

/**
 * POST /api/v1/classification/pii/:assetId/mask-preview
 * Masks a caller-provided sample record and returns only masked values.
 */
router.post('/pii/:assetId/mask-preview', authenticate, (req, res) => {
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

  const maskPlan = buildPiiMaskPlan(asset);
  const sample = req.body?.record && typeof req.body.record === 'object' ? req.body.record : {};
  logClassificationDecision(req, 'pii_mask_preview_generated', {
    ...piiPlanAuditDetails(maskPlan),
    columns: Object.keys(sample).filter((column) =>
      maskPlan.masking_actions.some(
        (action) => String(action.column_name).toLowerCase() === String(column).toLowerCase()
      )
    ),
  });

  return res.json({
    status: 'success',
    asset_id: assetId,
    masked_record: maskRecord(sample, maskPlan),
    retention: maskPlan.retention,
  });
});

/**
 * GET /api/v1/classification/columns/:assetId/semantics
 * Answers column semantic questions such as "which columns are metrics?"
 */
router.get('/columns/:assetId/semantics', authenticate, (req, res) => {
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

  const semantics = analyzeColumnSemantics(asset);
  logClassificationDecision(
    req,
    'column_semantics_evaluated',
    columnSemanticsAuditDetails(semantics)
  );
  return res.json({
    status: 'success',
    asset_id: assetId,
    semantics,
    answer: semantics.can_answer_metric_question
      ? {
          question: 'which column in this table is a metric?',
          metric_columns: semantics.metric_columns,
        }
      : {
          question: 'which column in this table is a metric?',
          caveat: 'No column metadata is available for this asset. Re-run extraction with column inventory enabled.',
          metric_columns: [],
        },
  });
});

/**
 * POST /api/v1/classification/bulk
 * Classify selected assets or the full cache. Supports manual override rows.
 */
router.post('/bulk', authenticate, (req, res) => {
  if (!assetCache) {
    return sendErrorResponse(res, req, 503, 'Asset index not yet loaded', {
      code: 'SERVICE_UNAVAILABLE',
    });
  }

  const requests = Array.isArray(req.body?.assets) ? req.body.assets : [];
  const results = bulkClassifyAssets(assetCache, requests, {
    changed_by: req.user?.email || req.user?.id || 'api',
  });
  logClassificationDecision(req, 'classification_bulk_evaluated', {
    evaluated_assets: results.length,
    total_assets: assetCache.size,
    classification_count: results.reduce(
      (sum, result) => sum + (result.classifications?.length || 0),
      0
    ),
  });

  return res.json({
    status: 'success',
    count: results.length,
    results,
  });
});

/**
 * POST /api/v1/classification/run
 * Re-run rules across the loaded catalog and return evidence/audit details.
 */
router.post('/run', authenticate, (req, res) => {
  if (!assetCache) {
    return sendErrorResponse(res, req, 503, 'Asset index not yet loaded', {
      code: 'SERVICE_UNAVAILABLE',
    });
  }

  const limit = Number.isFinite(Number(req.body?.limit)) ? Number(req.body.limit) : assetCache.size;
  const results = bulkClassifyAssets(assetCache, []).slice(0, limit);
  logClassificationDecision(req, 'classification_rules_run', {
    evaluated_assets: results.length,
    total_assets: assetCache.size,
    classification_count: results.reduce(
      (sum, result) => sum + (result.classifications?.length || 0),
      0
    ),
  });

  return res.json({
    status: 'success',
    evaluated_assets: results.length,
    total_assets: assetCache.size,
    results,
  });
});

/**
 * GET /api/v1/classification/propagate/:assetId
 * Preview downstream classification propagation for a seed asset.
 */
router.get('/propagate/:assetId', authenticate, (req, res) => {
  if (!assetCache) {
    return sendErrorResponse(res, req, 503, 'Asset index not yet loaded', {
      code: 'SERVICE_UNAVAILABLE',
    });
  }

  const result = propagateClassifications(req.params.assetId, assetCache, null, {
    maxDepth: req.query.depth,
  });
  return res.json({ status: 'success', result });
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
    const labels = classifyAssetDetailed(asset).classifications;
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
