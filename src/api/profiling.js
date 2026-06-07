/**
 * Profiling execution API.
 * Plans and executes metadata-safe aggregate profile runs.
 */

import { createApiRouter } from '../utils/apiRouter.js';
import { authenticate } from '../middleware/auth.js';
import { sendErrorResponse } from '../middleware/errorHandler.js';
import { getObjectsCache } from '../services/objectCacheStore.js';
import {
  applyProfileToAsset,
  buildConfluenceProfileSummary,
  buildProfilingContract,
  buildProfilingPlan,
  executeProfilingPlan,
  profilingAnswer,
  runProfiling,
} from '../services/profilingExecutionService.js';

const router = createApiRouter();

let cachedObjects = null;

export function setProfilingCache(objects) {
  cachedObjects = objects;
}

function runtimeObjects() {
  return cachedObjects || getObjectsCache() || new Map();
}

function isAdmin(user = {}) {
  return Array.isArray(user.roles) && user.roles.includes('Admin');
}

router.get('/contract', authenticate, (_req, res) =>
  res.json({
    status: 'success',
    contract: buildProfilingContract(),
  }));

router.post('/plan', authenticate, (req, res) => {
  try {
    const plan = buildProfilingPlan(req.body || {}, runtimeObjects());
    return res.json({
      status: 'success',
      message: 'Profiling plan generated',
      plan,
    });
  } catch (err) {
    return sendErrorResponse(res, req, 400, err.message, { code: 'PROFILING_PLAN_ERROR' });
  }
});

router.post('/run', authenticate, async (req, res) => {
  try {
    const requestedMode = req.body?.execution_mode || req.body?.executionMode || req.body?.safety?.execution_mode;
    if (requestedMode === 'live' && !isAdmin(req.user)) {
      return sendErrorResponse(res, req, 403, 'Live profiling requires an Admin role.', {
        code: 'PROFILING_LIVE_FORBIDDEN',
      });
    }
    const result = await runProfiling(req.body || {}, runtimeObjects());
    return res.json({
      status: 'success',
      message: 'Profiling run completed',
      data: {
        ...result,
        answer: profilingAnswer(result.run),
      },
    });
  } catch (err) {
    return sendErrorResponse(res, req, 400, err.message, { code: 'PROFILING_RUN_ERROR' });
  }
});

router.post('/execute-plan', authenticate, async (req, res) => {
  try {
    const plan = req.body?.plan || buildProfilingPlan(req.body || {}, runtimeObjects());
    if (plan.safety?.execution_mode === 'live' && !isAdmin(req.user)) {
      return sendErrorResponse(res, req, 403, 'Live profiling requires an Admin role.', {
        code: 'PROFILING_LIVE_FORBIDDEN',
      });
    }
    const run = await executeProfilingPlan(plan);
    return res.json({
      status: 'success',
      run,
      answer: profilingAnswer(run),
    });
  } catch (err) {
    return sendErrorResponse(res, req, 400, err.message, { code: 'PROFILING_EXECUTION_ERROR' });
  }
});

router.post('/apply', authenticate, (req, res) => {
  try {
    const assetId = req.body?.asset_id || req.body?.assetId || req.body?.profile?.asset_id;
    const asset = req.body?.asset || runtimeObjects().get(assetId);
    if (!asset) {
      return sendErrorResponse(res, req, 404, `Asset '${assetId || ''}' not found`, { code: 'NOT_FOUND' });
    }
    const updatedAsset = applyProfileToAsset(asset, req.body?.profile || {});
    return res.json({
      status: 'success',
      message: 'Profile merged into asset metadata',
      asset: updatedAsset,
    });
  } catch (err) {
    return sendErrorResponse(res, req, 400, err.message, { code: 'PROFILING_APPLY_ERROR' });
  }
});

router.post('/confluence-summary', authenticate, (req, res) => {
  try {
    const summary = buildConfluenceProfileSummary(req.body?.run || req.body || {});
    return res.json({
      status: 'success',
      summary,
    });
  } catch (err) {
    return sendErrorResponse(res, req, 400, err.message, { code: 'PROFILING_SUMMARY_ERROR' });
  }
});

export default router;
