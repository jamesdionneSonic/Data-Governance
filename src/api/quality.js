/**
 * Quality Rules API
 * Programmatic rule definition and profile/stat validation.
 */

import { createApiRouter } from '../utils/apiRouter.js';
import { authenticate } from '../middleware/auth.js';
import { sendErrorResponse } from '../middleware/errorHandler.js';
import {
  buildProfileSummary,
  buildQualityScorecard,
  detectQualityAnomalies,
  deployQualityRule,
  deleteQualityRule,
  evaluateQualitySla,
  exportScorecard,
  exportProfile,
  getQualityTrend,
  listQualityExecutions,
  listQualityIncidents,
  listQualityRuleDeployments,
  listQualityRules,
  listQualitySchedules,
  runQualityRules,
  upsertQualitySchedule,
  upsertQualityRule,
} from '../services/qualityRulesService.js';
import { logActivity } from '../services/activityService.js';

const router = createApiRouter();

let cachedObjects = new Map();

export function setQualityCache(objects) {
  cachedObjects = objects;
}

function actorFromUser(user = {}) {
  return {
    userId: user.id || user.sub || user.email || 'system',
    email: user.email,
  };
}

router.get('/rules', authenticate, (req, res) =>
  res.json({
    status: 'success',
    rules: listQualityRules({
      asset_id: req.query.asset_id,
      enabled: req.query.enabled === undefined ? undefined : req.query.enabled !== 'false',
    }),
  })
);

router.post('/rules', authenticate, (req, res) => {
  try {
    const rule = upsertQualityRule(req.body || {}, actorFromUser(req.user));
    logActivity(actorFromUser(req.user).userId, 'quality_rule_saved', rule.id, {
      asset_id: rule.asset_id,
      type: rule.type,
      severity: rule.severity,
      version: rule.version,
    });
    return res.status(201).json({ status: 'success', rule });
  } catch (err) {
    return sendErrorResponse(res, req, 400, err.message, { code: 'QUALITY_RULE_INVALID' });
  }
});

router.delete('/rules/:id', authenticate, (req, res) => {
  const deleted = deleteQualityRule(req.params.id);
  if (!deleted) {
    return sendErrorResponse(res, req, 404, `Quality rule '${req.params.id}' not found`, {
      code: 'NOT_FOUND',
    });
  }
  return res.json({ status: 'success', deleted: true });
});

router.post('/rules/:id/deploy', authenticate, (req, res) => {
  try {
    const deployment = deployQualityRule(req.params.id, actorFromUser(req.user));
    return res.json({ status: 'success', deployment });
  } catch (err) {
    return sendErrorResponse(res, req, 404, err.message, { code: 'NOT_FOUND' });
  }
});

router.get('/deployments', authenticate, (req, res) =>
  res.json({
    status: 'success',
    deployments: listQualityRuleDeployments({ rule_id: req.query.rule_id }),
  })
);

router.get('/schedules', authenticate, (_req, res) =>
  res.json({ status: 'success', schedules: listQualitySchedules() })
);

router.post('/schedules', authenticate, (req, res) => {
  const schedule = upsertQualitySchedule(req.body || {}, actorFromUser(req.user));
  return res.status(201).json({ status: 'success', schedule });
});

router.post('/run', authenticate, (req, res) => {
  if (!cachedObjects || cachedObjects.size === 0) {
    return sendErrorResponse(res, req, 503, 'Asset index not yet loaded', {
      code: 'SERVICE_UNAVAILABLE',
    });
  }
  const execution = runQualityRules(cachedObjects, req.body || {});
  logActivity(actorFromUser(req.user).userId, 'quality_rules_run', 'quality', {
    status: execution.status,
    evaluated_results: execution.evaluated_results,
    failed: execution.failed,
  });
  return res.json({ status: 'success', execution });
});

router.get('/executions', authenticate, (_req, res) =>
  res.json({ status: 'success', executions: listQualityExecutions() })
);

router.get('/incidents', authenticate, (req, res) =>
  res.json({
    status: 'success',
    incidents: listQualityIncidents({ status: req.query.status }),
  })
);

router.post('/profiles/summary', authenticate, (req, res) =>
  res.json({
    status: 'success',
    profile: buildProfileSummary(req.body?.profile || req.body || {}),
  })
);

router.post('/profiles/export', authenticate, (req, res) => {
  const exported = exportProfile(req.body?.profile || {}, req.body?.format || 'json');
  return res.json({
    status: 'success',
    export: exported,
  });
});

router.post('/profiles/anomalies', authenticate, (req, res) =>
  res.json({
    status: 'success',
    anomaly_report: detectQualityAnomalies(req.body?.current || {}, req.body?.baseline || {}, {
      sensitivity: req.body?.sensitivity,
    }),
  })
);

router.get('/profiles/:assetId/trend', authenticate, (req, res) =>
  res.json({
    status: 'success',
    trend: getQualityTrend(req.params.assetId),
  })
);

router.post('/scorecard', authenticate, (req, res) => {
  const latestExecution = listQualityExecutions()[0] || null;
  return res.json({
    status: 'success',
    scorecard: buildQualityScorecard(req.body?.profile || req.body || {}, latestExecution),
  });
});

router.post('/scorecard/export', authenticate, (req, res) => {
  const scorecard = req.body?.scorecard || buildQualityScorecard(req.body?.profile || {}, null);
  return res.json({
    status: 'success',
    export: exportScorecard(scorecard, req.body?.format || 'json'),
  });
});

router.post('/sla/evaluate', authenticate, (req, res) => {
  const scorecard = req.body?.scorecard || buildQualityScorecard(req.body?.profile || {}, null);
  return res.json({
    status: 'success',
    sla: evaluateQualitySla(scorecard, req.body?.sla || {}),
  });
});

export default router;
