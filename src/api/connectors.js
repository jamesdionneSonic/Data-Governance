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
  deleteConnectorProfileSchedule,
  getConnector,
  getConnectorAdapterCoverage,
  getProfileSchedulerStatus,
  getConnectorProfileSchedule,
  getConnectorSnapshot,
  grantConnectorPermission,
  listConnectorDefinitions,
  listConnectorProfileSchedules,
  listConnectorProfileScheduleRuns,
  listConnectorRuns,
  listConnectors,
  planConnector,
  planConnectorBiProfiling,
  planConnectorMetadataProfiling,
  planConnectorProfiling,
  publishConnectorProfileRuns,
  runConnector,
  runConnectorBiProfiling,
  runConnectorMetadataProfiling,
  runConnectorProfiling,
  runConnectorProfileSchedule,
  runDueConnectorProfileSchedules,
  startProfileSchedulerWorker,
  stopProfileSchedulerWorker,
  upsertConnectorProfileSchedule,
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

router.get('/profile-schedules', authenticate, (req, res) => {
  try {
    return res.json({
      status: 'success',
      schedules: listConnectorProfileSchedules(
        {
          connector_id: req.query.connector_id || req.query.connectorId,
          status: req.query.status,
        },
        req.user
      ),
    });
  } catch (err) {
    return connectorError(res, req, err);
  }
});

router.post('/profile-schedules', authenticate, requireAdmin, (req, res) => {
  try {
    const schedule = upsertConnectorProfileSchedule(req.body || {}, req.user);
    logActivity(actorId(req.user), 'connector_profile_schedule_saved', schedule.id, {
      connector_id: schedule.connector_id,
      profile_type: schedule.profile_type,
      status: schedule.status,
    });
    return res.status(201).json({ status: 'success', schedule });
  } catch (err) {
    return connectorError(res, req, err);
  }
});

router.get('/profile-schedules/status', authenticate, requireAdmin, (_req, res) =>
  res.json({
    status: 'success',
    scheduler: getProfileSchedulerStatus(),
  }));

router.post('/profile-schedules/worker/start', authenticate, requireAdmin, (req, res) =>
  res.json({
    status: 'success',
    scheduler: startProfileSchedulerWorker({ ...(req.body || {}), enabled: true }),
  }));

router.post('/profile-schedules/worker/stop', authenticate, requireAdmin, (_req, res) =>
  res.json({
    status: 'success',
    scheduler: stopProfileSchedulerWorker(),
  }));

router.post('/profile-schedules/tick', authenticate, requireAdmin, async (req, res) => {
  try {
    const result = await runDueConnectorProfileSchedules(req.body || {}, req.user);
    return res.json({ status: 'success', result });
  } catch (err) {
    return connectorError(res, req, err);
  }
});

router.get('/profile-schedules/:scheduleId/runs', authenticate, (req, res) => {
  try {
    return res.json({
      status: 'success',
      runs: listConnectorProfileScheduleRuns(req.params.scheduleId, req.user, {
        limit: req.query.limit,
      }),
    });
  } catch (err) {
    return connectorError(res, req, err);
  }
});

router.get('/profile-schedules/:scheduleId', authenticate, (req, res) => {
  try {
    const schedule = getConnectorProfileSchedule(req.params.scheduleId, req.user);
    if (!schedule) return connectorError(res, req, new Error(`Profile schedule '${req.params.scheduleId}' not found.`));
    return res.json({ status: 'success', schedule });
  } catch (err) {
    return connectorError(res, req, err);
  }
});

router.put('/profile-schedules/:scheduleId', authenticate, requireAdmin, (req, res) => {
  try {
    const schedule = upsertConnectorProfileSchedule({ ...(req.body || {}), id: req.params.scheduleId }, req.user);
    return res.json({ status: 'success', schedule });
  } catch (err) {
    return connectorError(res, req, err);
  }
});

router.delete('/profile-schedules/:scheduleId', authenticate, requireAdmin, (req, res) => {
  try {
    return res.json({
      status: 'success',
      deleted: deleteConnectorProfileSchedule(req.params.scheduleId, req.user),
    });
  } catch (err) {
    return connectorError(res, req, err);
  }
});

router.post('/profile-schedules/:scheduleId/run', authenticate, requireAdmin, async (req, res) => {
  try {
    const result = await runConnectorProfileSchedule(req.params.scheduleId, req.user);
    logActivity(actorId(req.user), 'connector_profile_schedule_run', req.params.scheduleId, {
      connector_id: result.schedule.connector_id,
      profile_type: result.schedule.profile_type,
      run_id: result.run?.id,
      status: result.run?.status,
    });
    return res.json({ status: 'success', result });
  } catch (err) {
    return connectorError(res, req, err);
  }
});

router.post('/profile-publications/publish', authenticate, requireAdmin, async (req, res) => {
  try {
    const result = await publishConnectorProfileRuns(req.body || {}, req.user);
    logActivity(actorId(req.user), 'connector_profile_publish', 'pending', {
      status: result.status,
      targets: result.targets,
      run_count: result.run_count,
      successful_asset_count: result.successful_asset_count,
      dry_run: result.dry_run,
    });
    return res.json({ status: 'success', publication: result });
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

router.post('/:id/profile/plan', authenticate, async (req, res) => {
  try {
    const plan = await planConnectorProfiling(req.params.id, req.body || {}, req.user);
    return res.json({ status: 'success', plan });
  } catch (err) {
    return connectorError(res, req, err);
  }
});

router.post('/:id/bi-profile/plan', authenticate, async (req, res) => {
  try {
    const plan = await planConnectorBiProfiling(req.params.id, req.body || {}, req.user);
    return res.json({ status: 'success', plan });
  } catch (err) {
    return connectorError(res, req, err);
  }
});

router.post('/:id/metadata-profile/plan', authenticate, async (req, res) => {
  try {
    const plan = await planConnectorMetadataProfiling(req.params.id, req.body || {}, req.user);
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

router.post('/:id/profile/run', authenticate, async (req, res) => {
  try {
    const run = await runConnectorProfiling(req.params.id, req.body || {}, req.user);
    logActivity(actorId(req.user), 'connector_profile_run', req.params.id, {
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

router.post('/:id/bi-profile/run', authenticate, async (req, res) => {
  try {
    const run = await runConnectorBiProfiling(req.params.id, req.body || {}, req.user);
    logActivity(actorId(req.user), 'connector_bi_profile_run', req.params.id, {
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

router.post('/:id/metadata-profile/run', authenticate, async (req, res) => {
  try {
    const run = await runConnectorMetadataProfiling(req.params.id, req.body || {}, req.user);
    logActivity(actorId(req.user), 'connector_metadata_profile_run', req.params.id, {
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

router.post('/:id/runs/:runId/publish', authenticate, requireAdmin, async (req, res) => {
  try {
    const result = await publishConnectorProfileRuns(
      {
        ...(req.body || {}),
        connector_id: req.params.id,
        run_id: req.params.runId,
      },
      req.user
    );
    logActivity(actorId(req.user), 'connector_profile_publish', req.params.id, {
      run_id: req.params.runId,
      status: result.status,
      targets: result.targets,
      successful_asset_count: result.successful_asset_count,
      dry_run: result.dry_run,
    });
    return res.json({ status: 'success', publication: result });
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
