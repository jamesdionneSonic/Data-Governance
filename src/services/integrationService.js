import { createHmac, randomUUID } from 'crypto';
import axios from 'axios';
import { getDownstreamDependents } from './lineageService.js';

const integrationSettings = {
  notifications: {
    email: {
      enabled: false,
      recipients: [],
      template: 'default',
    },
    slack: {
      enabled: false,
      webhookUrl: '',
      channel: '',
      recipients: [],
      template: 'default',
    },
    teams: {
      enabled: false,
      webhookUrl: '',
      recipients: [],
      template: 'default',
    },
  },
};

const webhookStore = new Map();
const externalLinkStore = new Map();

function signWebhookPayload(payload, secret) {
  return createHmac('sha256', secret).update(payload).digest('hex');
}

function mergeNotificationConfig(existing, updates = {}) {
  return {
    ...existing,
    ...updates,
    recipients: Array.isArray(updates.recipients) ? updates.recipients : existing.recipients,
  };
}

async function deliverWebhookWithRetries(webhook, eventType, body, signature, attempts = 1) {
  try {
    const response = await axios.post(webhook.url, body, {
      headers: {
        'Content-Type': 'application/json',
        'X-DG-Signature': signature,
        'X-DG-Event': eventType,
      },
      timeout: 10000,
      validateStatus: () => true,
    });

    if (response.status >= 200 && response.status < 300) {
      return {
        delivered: true,
        attempts,
        lastStatus: response.status,
        lastError: null,
      };
    }

    if (attempts > webhook.maxRetries) {
      return {
        delivered: false,
        attempts,
        lastStatus: response.status,
        lastError: null,
      };
    }

    return deliverWebhookWithRetries(webhook, eventType, body, signature, attempts + 1);
  } catch (err) {
    if (attempts > webhook.maxRetries) {
      return {
        delivered: false,
        attempts,
        lastStatus: null,
        lastError: err.message,
      };
    }

    return deliverWebhookWithRetries(webhook, eventType, body, signature, attempts + 1);
  }
}

export function getIntegrationSettings() {
  return {
    notifications: {
      email: { ...integrationSettings.notifications.email },
      slack: { ...integrationSettings.notifications.slack },
      teams: { ...integrationSettings.notifications.teams },
    },
  };
}

export function updateNotificationSettings(channel, updates = {}) {
  const supportedChannels = ['email', 'slack', 'teams'];
  if (!supportedChannels.includes(channel)) {
    throw new Error(`Unsupported notification channel: ${channel}`);
  }

  integrationSettings.notifications[channel] = mergeNotificationConfig(
    integrationSettings.notifications[channel],
    updates
  );

  return {
    channel,
    ...integrationSettings.notifications[channel],
  };
}

export function simulateNotificationDispatch(channel, eventType, payload = {}) {
  const channelConfig = integrationSettings.notifications[channel];
  if (!channelConfig) {
    throw new Error(`Unsupported notification channel: ${channel}`);
  }

  if (!channelConfig.enabled) {
    return {
      channel,
      eventType,
      dispatched: false,
      reason: 'channel_disabled',
      timestamp: new Date().toISOString(),
    };
  }

  return {
    channel,
    eventType,
    dispatched: true,
    recipientCount: channelConfig.recipients.length,
    template: channelConfig.template,
    payload,
    timestamp: new Date().toISOString(),
  };
}

export function registerWebhook(config = {}) {
  if (!config.url) {
    throw new Error('Webhook url is required');
  }

  const webhookId = randomUUID();
  const webhook = {
    webhookId,
    name: config.name || `webhook-${webhookId.slice(0, 8)}`,
    url: config.url,
    events:
      Array.isArray(config.events) && config.events.length > 0
        ? config.events
        : ['dependency.created', 'documentation.updated'],
    secret: config.secret || randomUUID().replace(/-/g, ''),
    maxRetries: Number.isInteger(config.maxRetries) ? config.maxRetries : 3,
    active: config.active !== false,
    createdAt: new Date().toISOString(),
    lastDeliveryAt: null,
  };

  webhookStore.set(webhookId, webhook);
  return webhook;
}

export function listWebhooks() {
  return Array.from(webhookStore.values());
}

export function deleteWebhook(webhookId) {
  return webhookStore.delete(webhookId);
}

export async function dispatchWebhook(webhookId, eventType, payload = {}) {
  const webhook = webhookStore.get(webhookId);
  if (!webhook || !webhook.active) {
    return null;
  }

  const body = JSON.stringify({
    eventType,
    payload,
    sentAt: new Date().toISOString(),
  });

  const signature = signWebhookPayload(body, webhook.secret);

  const deliveryResult = await deliverWebhookWithRetries(webhook, eventType, body, signature);

  webhook.lastDeliveryAt = new Date().toISOString();
  webhookStore.set(webhookId, webhook);

  return {
    webhookId,
    eventType,
    delivered: deliveryResult.delivered,
    attempts: deliveryResult.attempts,
    lastStatus: deliveryResult.lastStatus,
    lastError: deliveryResult.lastError,
    deliveredAt: webhook.lastDeliveryAt,
  };
}

export function addExternalLink(objectId, link) {
  if (!objectId) {
    throw new Error('objectId is required');
  }

  if (!link?.type || !link?.url) {
    throw new Error('External link type and url are required');
  }

  if (!externalLinkStore.has(objectId)) {
    externalLinkStore.set(objectId, []);
  }

  const links = externalLinkStore.get(objectId);
  const created = {
    linkId: randomUUID(),
    type: link.type,
    label: link.label || link.type,
    url: link.url,
    createdAt: new Date().toISOString(),
  };

  links.push(created);
  externalLinkStore.set(objectId, links);

  return created;
}

export function getExternalLinks(objectId) {
  return externalLinkStore.get(objectId) || [];
}

export function removeExternalLink(objectId, linkId) {
  const links = externalLinkStore.get(objectId) || [];
  const next = links.filter((entry) => entry.linkId !== linkId);

  if (next.length === links.length) {
    return false;
  }

  externalLinkStore.set(objectId, next);
  return true;
}

export function runImpactAnalysisForPipeline(objectIds, objects, lineageGraph) {
  const changed = Array.isArray(objectIds) ? objectIds : [];

  const analyses = changed.map((objectId) => {
    const downstream = getDownstreamDependents(objectId, lineageGraph, 5);
    let severity = 'low';
    if (downstream.length >= 25) {
      severity = 'critical';
    } else if (downstream.length >= 10) {
      severity = 'high';
    } else if (downstream.length >= 3) {
      severity = 'medium';
    }

    return {
      objectId,
      exists: objects.has(objectId),
      downstreamCount: downstream.length,
      downstream: downstream.slice(0, 50),
      severity,
    };
  });

  let maxSeverity = 'low';
  if (analyses.some((item) => item.severity === 'critical')) {
    maxSeverity = 'critical';
  } else if (analyses.some((item) => item.severity === 'high')) {
    maxSeverity = 'high';
  } else if (analyses.some((item) => item.severity === 'medium')) {
    maxSeverity = 'medium';
  }

  return {
    changedCount: changed.length,
    analyses,
    maxSeverity,
    generatedAt: new Date().toISOString(),
  };
}

export function runComplianceValidation(objectIds, objects) {
  const targets =
    Array.isArray(objectIds) && objectIds.length > 0 ? objectIds : Array.from(objects.keys());

  const failures = [];

  targets.forEach((objectId) => {
    const current = objects.get(objectId);
    if (!current) {
      failures.push({
        objectId,
        checks: ['object_missing'],
      });
      return;
    }

    const checks = [];
    if (!current.owner) {
      checks.push('owner_missing');
    }
    if (!current.description) {
      checks.push('description_missing');
    }
    if (!Array.isArray(current.tags) || current.tags.length === 0) {
      checks.push('tags_missing');
    }
    if (!current.sensitivity) {
      checks.push('sensitivity_missing');
    }

    if (checks.length > 0) {
      failures.push({ objectId, checks });
    }
  });

  return {
    scanned: targets.length,
    passed: failures.length === 0,
    failureCount: failures.length,
    failures,
    checkedAt: new Date().toISOString(),
  };
}

export function getPostDeployDocumentationUpdateSummary(objectIds, objects) {
  const targets =
    Array.isArray(objectIds) && objectIds.length > 0
      ? objectIds
      : Array.from(objects.keys()).slice(0, 100);

  return {
    updatedObjects: targets.length,
    objects: targets,
    status: 'completed',
    updatedAt: new Date().toISOString(),
  };
}

export default {
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
};
