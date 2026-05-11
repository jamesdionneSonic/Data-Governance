import { createApiRouter } from '../utils/apiRouter.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { sendErrorResponse } from '../middleware/errorHandler.js';
import {
  getIntegrationSettings,
  updateNotificationSettings,
  simulateNotificationDispatch,
  registerWebhook,
  listWebhooks,
  deleteWebhook,
  dispatchWebhook,
  addExternalLink,
  getExternalLinks,
  removeExternalLink,
  runImpactAnalysisForPipeline,
  runComplianceValidation,
  getPostDeployDocumentationUpdateSummary,
} from '../services/integrationService.js';

const router = createApiRouter();

let cachedObjects = new Map();
let cachedLineageGraph = new Map();

export function setIntegrationCache(objects, lineageGraph) {
  cachedObjects = objects;
  cachedLineageGraph = lineageGraph;
}

router.use(authenticate);

router.get('/settings', requireAdmin, (req, res) =>
  res.json({
    status: 'success',
    data: getIntegrationSettings(),
  }));

router.put('/notifications/:channel', requireAdmin, (req, res) => {
  try {
    const updated = updateNotificationSettings(req.params.channel, req.body || {});
    return res.json({
      status: 'success',
      message: 'Notification settings updated',
      data: updated,
    });
  } catch (err) {
    return sendErrorResponse(res, req, 400, err.message, {
      code: 'BAD_REQUEST',
    });
  }
});

router.post('/notifications/send', requireAdmin, (req, res) => {
  try {
    const { channel, eventType, payload } = req.body;
    if (!channel || !eventType) {
      return sendErrorResponse(res, req, 400, 'channel and eventType are required', {
        code: 'BAD_REQUEST',
      });
    }

    const result = simulateNotificationDispatch(channel, eventType, payload || {});
    return res.json({
      status: 'success',
      data: result,
    });
  } catch (err) {
    return sendErrorResponse(res, req, 400, err.message, {
      code: 'BAD_REQUEST',
    });
  }
});

router.post('/webhooks', requireAdmin, (req, res) => {
  try {
    const webhook = registerWebhook(req.body || {});
    return res.status(201).json({
      status: 'success',
      message: 'Webhook registered',
      data: webhook,
    });
  } catch (err) {
    return sendErrorResponse(res, req, 400, err.message, {
      code: 'BAD_REQUEST',
    });
  }
});

router.get('/webhooks', requireAdmin, (req, res) =>
  res.json({
    status: 'success',
    data: {
      webhooks: listWebhooks(),
    },
  }));

router.delete('/webhooks/:webhookId', requireAdmin, (req, res) => {
  const deleted = deleteWebhook(req.params.webhookId);
  if (!deleted) {
    return sendErrorResponse(res, req, 404, 'Webhook not found', {
      code: 'NOT_FOUND',
    });
  }

  return res.json({
    status: 'success',
    message: 'Webhook deleted',
  });
});

router.post('/webhooks/:webhookId/test', requireAdmin, async (req, res) => {
  const eventType = req.body?.eventType || 'integration.test';
  const payload = req.body?.payload || { source: 'manual-test' };

  const result = await dispatchWebhook(req.params.webhookId, eventType, payload);
  if (!result) {
    return sendErrorResponse(res, req, 404, 'Webhook not found or inactive', {
      code: 'NOT_FOUND',
    });
  }

  return res.json({
    status: 'success',
    data: result,
  });
});

router.post('/links/:objectId', requireAdmin, (req, res) => {
  try {
    const link = addExternalLink(req.params.objectId, req.body || {});
    return res.status(201).json({
      status: 'success',
      data: link,
    });
  } catch (err) {
    return sendErrorResponse(res, req, 400, err.message, {
      code: 'BAD_REQUEST',
    });
  }
});

router.get('/links/:objectId', (req, res) =>
  res.json({
    status: 'success',
    data: {
      objectId: req.params.objectId,
      links: getExternalLinks(req.params.objectId),
    },
  }));

router.delete('/links/:objectId/:linkId', requireAdmin, (req, res) => {
  const removed = removeExternalLink(req.params.objectId, req.params.linkId);
  if (!removed) {
    return sendErrorResponse(res, req, 404, 'Link not found', {
      code: 'NOT_FOUND',
    });
  }

  return res.json({
    status: 'success',
    message: 'External link removed',
  });
});

router.post('/cicd/impact-analysis', requireAdmin, (req, res) => {
  const { objectIds = [] } = req.body || {};

  const result = runImpactAnalysisForPipeline(objectIds, cachedObjects, cachedLineageGraph);

  return res.json({
    status: 'success',
    data: result,
  });
});

router.post('/cicd/compliance-check', requireAdmin, (req, res) => {
  const { objectIds = [] } = req.body || {};

  const result = runComplianceValidation(objectIds, cachedObjects);
  return res.json({
    status: 'success',
    data: result,
  });
});

router.post('/cicd/post-deploy-docs', requireAdmin, (req, res) => {
  const { objectIds = [] } = req.body || {};

  const result = getPostDeployDocumentationUpdateSummary(objectIds, cachedObjects);
  return res.json({
    status: 'success',
    data: result,
  });
});

export default router;
