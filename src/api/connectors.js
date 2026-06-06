/**
 * Managed connector API.
 * Admins create connectors and grant use; users run only approved connectors without seeing secrets.
 */

import { createApiRouter } from '../utils/apiRouter.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { sendErrorResponse } from '../middleware/errorHandler.js';
import { logActivity } from '../services/activityService.js';
import {
  deleteConnector,
  getConnector,
  getConnectorAdapterCoverage,
  getConnectorSnapshot,
  grantConnectorPermission,
  listConnectorDefinitions,
  listConnectorRuns,
  listConnectors,
  planConnector,
  runConnector,
  upsertConnector,
} from '../services/connectorService.js';

const router = createApiRouter();

function actorId(user = {}) {
  return user.id || user.sub || user.email || 'system';
}

function connectorError(res, req, err) {
  if (err.code === 'CONNECTOR_FORBIDDEN') {
    return sendErrorResponse(res, req, 403, err.message, { code: 'FORBIDDEN' });
  }
  if (err.code && String(err.code).startsWith('CONNECTOR_')) {
    return sendErrorResponse(res, req, err.status || 400, err.message, {
      code: err.code,
      phase: err.phase,
      stream: err.stream,
      remediation: err.remediation,
      details: err.details,
    });
  }
  if (/not found/i.test(err.message)) {
    return sendErrorResponse(res, req, 404, err.message, { code: 'NOT_FOUND' });
  }
  return sendErrorResponse(res, req, 400, err.message, { code: 'CONNECTOR_ERROR' });
}

router.get('/definitions', authenticate, (req, res) =>
  res.json({
    status: 'success',
    definitions: listConnectorDefinitions({
      cloud: req.query.cloud,
      category: req.query.category,
    }),
  }));

router.get('/coverage', authenticate, (_req, res) =>
  res.json({
    status: 'success',
    coverage: getConnectorAdapterCoverage(),
  }));

router.get('/', authenticate, (req, res) =>
  res.json({
    status: 'success',
    connectors: listConnectors(
      {
        type: req.query.type,
        category: req.query.category,
        cloud: req.query.cloud,
        action: req.query.action,
      },
      req.user
    ),
  }));

router.post('/', authenticate, requireAdmin, (req, res) => {
  try {
    const connector = upsertConnector(req.body || {}, req.user);
    logActivity(actorId(req.user), 'connector_saved', connector.id, {
      type: connector.type,
      category: connector.category,
      cloud: connector.cloud,
      credential_status: connector.credential?.status,
    });
    return res.status(201).json({ status: 'success', connector });
  } catch (err) {
    return connectorError(res, req, err);
  }
});

router.get('/:id', authenticate, (req, res) => {
  try {
    return res.json({ status: 'success', connector: getConnector(req.params.id, req.user) });
  } catch (err) {
    return connectorError(res, req, err);
  }
});

router.delete('/:id', authenticate, requireAdmin, (req, res) => {
  try {
    return res.json({ status: 'success', deleted: deleteConnector(req.params.id, req.user) });
  } catch (err) {
    return connectorError(res, req, err);
  }
});

router.post('/:id/permissions', authenticate, requireAdmin, (req, res) => {
  try {
    const connector = grantConnectorPermission(req.params.id, req.body || {}, req.user);
    logActivity(actorId(req.user), 'connector_permission_granted', req.params.id, {
      scope: req.body?.scope || 'users',
      subject: req.body?.subject || req.body?.user || req.body?.role || req.body?.group,
      actions: req.body?.actions || req.body?.action,
    });
    return res.json({ status: 'success', connector });
  } catch (err) {
    return connectorError(res, req, err);
  }
});

router.post('/:id/plan', authenticate, async (req, res) => {
  try {
    const plan = await planConnector(req.params.id, req.body || {}, req.user);
    return res.json({ status: 'success', plan });
  } catch (err) {
    return connectorError(res, req, err);
  }
});

router.post('/:id/run', authenticate, async (req, res) => {
  try {
    const run = await runConnector(req.params.id, req.body || {}, req.user);
    logActivity(actorId(req.user), 'connector_run', req.params.id, {
      run_id: run.id,
      status: run.status,
      mode: run.mode,
      summary: run.summary,
    });
    return res.json({ status: 'success', run });
  } catch (err) {
    return connectorError(res, req, err);
  }
});

router.get('/:id/runs', authenticate, (req, res) =>
  res.json({
    status: 'success',
    runs: listConnectorRuns(
      { connector_id: req.params.id, limit: req.query.limit },
      req.user
    ),
  }));

router.get('/:id/snapshot', authenticate, (req, res) => {
  try {
    return res.json({ status: 'success', snapshot: getConnectorSnapshot(req.params.id, req.user) });
  } catch (err) {
    return connectorError(res, req, err);
  }
});

export default router;
