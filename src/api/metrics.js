/**
 * Metric Intelligence API
 * Metadata-only metric registry, logic explanation, and formula-change impact endpoints.
 */

import { createApiRouter } from '../utils/apiRouter.js';
import { authenticate } from '../middleware/auth.js';
import { sendErrorResponse } from '../middleware/errorHandler.js';
import { getObjectsCache } from '../services/objectCacheStore.js';
import { getLineageGraph } from '../services/catalogRuntimeStore.js';
import {
  assessMetricFormulaImpact,
  buildMetricProfileAnswer,
  buildMetricRegistry,
  buildMetricRuntimePack,
  buildTableMetricAnswer,
  explainMetricLogic,
} from '../services/metricRegistryService.js';

const router = createApiRouter();

let cachedObjects = null;
let cachedLineageGraph = null;

export function setMetricCache(objects, lineageGraph) {
  cachedObjects = objects;
  cachedLineageGraph = lineageGraph;
}

function runtimeObjects() {
  return cachedObjects || getObjectsCache() || new Map();
}

function runtimeLineageGraph() {
  return cachedLineageGraph || getLineageGraph() || new Map();
}

router.get('/registry', authenticate, async (req, res) => {
  try {
    const registry = buildMetricRegistry(runtimeObjects(), runtimeLineageGraph(), req.query);
    return res.json({
      status: 'success',
      message: 'Metric registry retrieved',
      data: registry,
    });
  } catch (err) {
    return sendErrorResponse(res, req, 500, err.message, { code: 'METRIC_REGISTRY_ERROR' });
  }
});

router.get('/runtime-pack', authenticate, async (req, res) => {
  try {
    const pack = buildMetricRuntimePack(runtimeObjects(), runtimeLineageGraph(), {
      limit: req.query.limit,
    });
    return res.json({
      status: 'success',
      message: 'Metric runtime pack retrieved',
      data: pack,
    });
  } catch (err) {
    return sendErrorResponse(res, req, 500, err.message, { code: 'METRIC_RUNTIME_PACK_ERROR' });
  }
});

router.get('/tables/:assetId', authenticate, async (req, res) => {
  try {
    const answer = buildTableMetricAnswer(runtimeObjects(), runtimeLineageGraph(), req.params.assetId);
    if (!answer) {
      return sendErrorResponse(res, req, 404, `Object '${req.params.assetId}' not found`, {
        code: 'NOT_FOUND',
      });
    }
    return res.json({
      status: 'success',
      message: 'Table metric answer retrieved',
      data: answer,
    });
  } catch (err) {
    return sendErrorResponse(res, req, 500, err.message, { code: 'TABLE_METRICS_ERROR' });
  }
});

router.post('/resolve', authenticate, async (req, res) => {
  try {
    const registry = buildMetricRegistry(runtimeObjects(), runtimeLineageGraph(), {
      q: req.body?.q || req.body?.query || req.body?.metric,
      database: req.body?.database,
      limit: req.body?.limit || 25,
    });
    return res.json({
      status: 'success',
      message: 'Metric candidates resolved',
      data: registry,
    });
  } catch (err) {
    return sendErrorResponse(res, req, 500, err.message, { code: 'METRIC_RESOLVE_ERROR' });
  }
});

router.post('/logic', authenticate, async (req, res) => {
  try {
    const answer = explainMetricLogic(runtimeObjects(), runtimeLineageGraph(), req.body || {});
    if (!answer) {
      return sendErrorResponse(res, req, 404, 'Metric object was not found', { code: 'NOT_FOUND' });
    }
    return res.json({
      status: 'success',
      message: 'Metric logic retrieved',
      data: answer,
    });
  } catch (err) {
    return sendErrorResponse(res, req, 500, err.message, { code: 'METRIC_LOGIC_ERROR' });
  }
});

router.post('/formula-impact', authenticate, async (req, res) => {
  try {
    const impact = assessMetricFormulaImpact(runtimeObjects(), runtimeLineageGraph(), req.body || {});
    if (!impact) {
      return sendErrorResponse(res, req, 404, 'Metric object was not found', { code: 'NOT_FOUND' });
    }
    return res.json({
      status: 'success',
      message: 'Metric formula impact assessed',
      data: impact,
    });
  } catch (err) {
    return sendErrorResponse(res, req, 500, err.message, { code: 'METRIC_IMPACT_ERROR' });
  }
});

router.post('/profile', authenticate, async (req, res) => {
  try {
    const profile = buildMetricProfileAnswer(runtimeObjects(), runtimeLineageGraph(), req.body || {});
    if (!profile) {
      return sendErrorResponse(res, req, 404, 'Metric object was not found', { code: 'NOT_FOUND' });
    }
    return res.json({
      status: 'success',
      message: 'Metric profile answer retrieved',
      data: profile,
    });
  } catch (err) {
    return sendErrorResponse(res, req, 500, err.message, { code: 'METRIC_PROFILE_ERROR' });
  }
});

export default router;
