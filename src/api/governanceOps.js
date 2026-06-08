import { createApiRouter } from '../utils/apiRouter.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { sendErrorResponse } from '../middleware/errorHandler.js';
import { loadAllTerms } from '../services/glossaryService.js';
import {
  addAssetComment,
  addIncidentCommunication,
  assessChangeRisk,
  buildAdoptionScorecards,
  buildGovernanceOpsOverview,
  buildGlossaryHealth,
  buildKpis,
  buildPublicationStatus,
  buildUsageAnalytics,
  calculateRoi,
  certifyAsset,
  createGlossaryReview,
  createGovernanceTask,
  createIncident,
  decideGlossaryReview,
  detectSchemaChange,
  endorseAsset,
  evaluateAnomaly,
  evaluateServiceLevel,
  generateStewardshipTasks,
  getOwnershipRoleModel,
  getTrustActions,
  getGovernanceOpsStoreStatus,
  importGovernanceOpsState,
  exportGovernanceOpsState,
  listGovernanceOpsEventDeliveries,
  listAssetComments,
  listDecisions,
  listGovernanceTasks,
  listIncidents,
  buildOwnershipSummary,
  buildStewardPortfolio,
  recommendRetirementCandidates,
  planBulkOwnershipAssignment,
  recordDecision,
  recordPublicationCheck,
  recordUsageEvent,
  resolveGovernanceQuestion,
  transitionGovernanceTask,
  transitionIncident,
} from '../services/governanceOpsService.js';

const router = createApiRouter();

let assetCache = new Map();
let lineageGraphCache = new Map();

export function setGovernanceOpsCache(assets, lineageGraph) {
  assetCache = assets || new Map();
  lineageGraphCache = lineageGraph || new Map();
}

function hasStewardRole(user = {}) {
  const roles = user.roles || [];
  return roles.includes('Admin') || roles.includes('PowerUser') || roles.includes('Steward');
}

function requireSteward(req, res, next) {
  if (!hasStewardRole(req.user)) {
    return sendErrorResponse(res, req, 403, 'Steward, PowerUser, or Admin role required', {
      code: 'FORBIDDEN',
    });
  }
  return next();
}

function ok(res, data, extra = {}) {
  return res.json({ status: 'success', data, ...extra });
}

router.get('/overview', authenticate, async (_req, res) => {
  const terms = await loadAllTerms().catch(() => []);
  return ok(res, buildGovernanceOpsOverview(assetCache, lineageGraphCache, terms));
});

router.get('/store/status', authenticate, (_req, res) => ok(res, getGovernanceOpsStoreStatus()));

router.get('/export', authenticate, requireAdmin, (_req, res) => ok(res, exportGovernanceOpsState()));

router.post('/import', authenticate, requireAdmin, (req, res) => ok(res, importGovernanceOpsState(req.body)));

router.get('/events/deliveries', authenticate, requireSteward, (req, res) => ok(res, {
    count: listGovernanceOpsEventDeliveries(req.query).length,
    deliveries: listGovernanceOpsEventDeliveries(req.query),
  }));

router.get('/kpis', authenticate, (_req, res) => ok(res, buildKpis(assetCache, lineageGraphCache)));

router.get('/ownership/model', authenticate, (_req, res) => ok(res, {
  roles: getOwnershipRoleModel(),
}));

router.get('/ownership/summary', authenticate, (_req, res) => ok(res, buildOwnershipSummary(assetCache)));

router.get('/ownership/portfolio', authenticate, (req, res) => {
  const subject = req.query.subject || req.query.owner || req.user?.email || req.user?.id || 'all';
  return ok(res, buildStewardPortfolio(assetCache, lineageGraphCache, subject, req.query));
});

router.post('/ownership/bulk-assignment-plan', authenticate, requireSteward, (req, res) =>
  ok(res, planBulkOwnershipAssignment(req.body || {}, assetCache, req.user)));

router.post('/tasks', authenticate, requireSteward, (req, res) => res.status(201).json({ status: 'success', data: createGovernanceTask(req.body, req.user) }));

router.get('/tasks', authenticate, (req, res) => ok(res, {
    count: listGovernanceTasks(req.query).length,
    tasks: listGovernanceTasks(req.query),
  }));

router.post('/tasks/generate', authenticate, requireSteward, (req, res) => ok(res, generateStewardshipTasks(assetCache, req.user, req.body)));

router.post('/tasks/:taskId/transition', authenticate, requireSteward, (req, res) => {
  try {
    const task = transitionGovernanceTask(req.params.taskId, req.body, req.user);
    if (!task) {
      return sendErrorResponse(res, req, 404, `Task '${req.params.taskId}' not found`, {
        code: 'NOT_FOUND',
      });
    }
    return ok(res, task);
  } catch (error) {
    return sendErrorResponse(res, req, 400, error.message, { code: 'BAD_REQUEST' });
  }
});

router.post('/assets/:assetId/comments', authenticate, (req, res) => res
    .status(201)
    .json({ status: 'success', data: addAssetComment(req.params.assetId, req.body, req.user) }));

router.get('/assets/:assetId/comments', authenticate, (req, res) => ok(res, {
    count: listAssetComments(req.params.assetId).length,
    comments: listAssetComments(req.params.assetId),
  }));

router.post('/assets/:assetId/decisions', authenticate, requireSteward, (req, res) => res
    .status(201)
    .json({ status: 'success', data: recordDecision(req.params.assetId, req.body, req.user) }));

router.get('/assets/:assetId/decisions', authenticate, (req, res) => ok(res, {
    count: listDecisions(req.params.assetId).length,
    decisions: listDecisions(req.params.assetId),
  }));

router.post('/usage/events', authenticate, (req, res) => res.status(201).json({ status: 'success', data: recordUsageEvent(req.body, req.user) }));

router.get('/usage/analytics', authenticate, (req, res) => ok(res, buildUsageAnalytics(req.query)));

router.get('/adoption/scorecards', authenticate, (req, res) => ok(res, {
    count: buildAdoptionScorecards(assetCache, lineageGraphCache).length,
    scorecards: buildAdoptionScorecards(assetCache, lineageGraphCache),
  }));

router.get('/retirement/candidates', authenticate, requireSteward, (req, res) => ok(res, {
    candidates: recommendRetirementCandidates(assetCache, lineageGraphCache),
  }));

router.post('/observability/sla/evaluate', authenticate, requireSteward, (req, res) => ok(res, evaluateServiceLevel(req.body, req.user)));

router.post('/observability/anomaly/evaluate', authenticate, requireSteward, (req, res) => ok(res, evaluateAnomaly(req.body, req.user)));

router.post('/observability/schema-change', authenticate, requireSteward, (req, res) => ok(res, detectSchemaChange(req.body, req.user)));

router.post('/incidents', authenticate, requireSteward, (req, res) => res.status(201).json({ status: 'success', data: createIncident(req.body, req.user) }));

router.get('/incidents', authenticate, (req, res) => ok(res, { count: listIncidents(req.query).length, incidents: listIncidents(req.query) }));

router.post('/incidents/:incidentId/transition', authenticate, requireSteward, (req, res) => {
  try {
    const incident = transitionIncident(req.params.incidentId, req.body, req.user);
    if (!incident) {
      return sendErrorResponse(res, req, 404, `Incident '${req.params.incidentId}' not found`, {
        code: 'NOT_FOUND',
      });
    }
    return ok(res, incident);
  } catch (error) {
    return sendErrorResponse(res, req, 400, error.message, { code: 'BAD_REQUEST' });
  }
});

router.post('/incidents/:incidentId/communications', authenticate, requireSteward, (req, res) => {
  const communication = addIncidentCommunication(req.params.incidentId, req.body, req.user);
  if (!communication) {
    return sendErrorResponse(res, req, 404, `Incident '${req.params.incidentId}' not found`, {
      code: 'NOT_FOUND',
    });
  }
  return res.status(201).json({ status: 'success', data: communication });
});

router.post('/impact/risk-assessment', authenticate, requireSteward, (req, res) => ok(res, assessChangeRisk(req.body, assetCache, lineageGraphCache)));

router.post('/context/query', authenticate, (req, res) => ok(res, resolveGovernanceQuestion(req.body.query || '', assetCache)));

router.post('/glossary/reviews', authenticate, requireSteward, (req, res) => res
    .status(201)
    .json({ status: 'success', data: createGlossaryReview(req.body, req.user) }));

router.post('/glossary/reviews/:reviewId/decision', authenticate, requireSteward, (req, res) => {
  const review = decideGlossaryReview(req.params.reviewId, req.body, req.user);
  if (!review) {
    return sendErrorResponse(res, req, 404, `Glossary review '${req.params.reviewId}' not found`, {
      code: 'NOT_FOUND',
    });
  }
  return ok(res, review);
});

router.get('/glossary/health', authenticate, async (_req, res) => {
  const terms = await loadAllTerms().catch(() => []);
  return ok(res, buildGlossaryHealth(terms));
});

router.post('/trust/:assetId/certify', authenticate, requireSteward, (req, res) => res
    .status(201)
    .json({ status: 'success', data: certifyAsset(req.params.assetId, req.body, req.user) }));

router.post('/trust/:assetId/endorse', authenticate, (req, res) => res
    .status(201)
    .json({ status: 'success', data: endorseAsset(req.params.assetId, req.body, req.user) }));

router.get('/trust/:assetId/history', authenticate, (req, res) => ok(res, {
    assetId: req.params.assetId,
    actions: getTrustActions(req.params.assetId),
  }));

router.post('/roi/calculate', authenticate, (req, res) => ok(res, calculateRoi(req.body)));

router.post('/publication/checks/:name', authenticate, requireAdmin, (req, res) => ok(res, recordPublicationCheck(req.params.name, req.body)));

router.get('/publication/status', authenticate, (_req, res) => ok(res, buildPublicationStatus(assetCache, lineageGraphCache)));

export default router;
