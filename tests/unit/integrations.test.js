import {
  getIntegrationSettings,
  updateNotificationSettings,
  simulateNotificationDispatch,
  registerWebhook,
  listWebhooks,
  deleteWebhook,
  addExternalLink,
  getExternalLinks,
  removeExternalLink,
  runImpactAnalysisForPipeline,
  runComplianceValidation,
  getPostDeployDocumentationUpdateSummary,
} from '../../src/services/integrationService.js';

describe('Phase 8 - Integrations Service', () => {
  const objects = new Map();
  const lineageGraph = new Map();

  beforeAll(() => {
    objects.set('sales.customers', {
      id: 'sales.customers',
      name: 'customers',
      database: 'sales',
      type: 'table',
      owner: 'data-team',
      sensitivity: 'internal',
      tags: ['core'],
      description: 'Customer records',
    });

    objects.set('sales.orders', {
      id: 'sales.orders',
      name: 'orders',
      database: 'sales',
      type: 'table',
      owner: 'analytics',
      sensitivity: 'confidential',
      tags: ['transactions'],
      description: 'Order records',
    });

    objects.set('sales.order_summary', {
      id: 'sales.order_summary',
      name: 'order_summary',
      database: 'sales',
      type: 'view',
      owner: '',
      sensitivity: 'internal',
      tags: [],
      description: '',
    });

    lineageGraph.set('sales.customers', new Set());
    lineageGraph.set('sales.orders', new Set(['sales.customers']));
    lineageGraph.set('sales.order_summary', new Set(['sales.orders']));
  });

  test('INT-001: Reads integration settings', () => {
    const settings = getIntegrationSettings();

    expect(settings.notifications).toBeDefined();
    expect(settings.notifications.email).toBeDefined();
    expect(settings.notifications.slack).toBeDefined();
    expect(settings.notifications.teams).toBeDefined();
  });

  test('INT-002: Updates notification channel settings', () => {
    const updated = updateNotificationSettings('email', {
      enabled: true,
      recipients: ['owner@example.com'],
      template: 'governance-alert',
    });

    expect(updated.enabled).toBe(true);
    expect(updated.recipients).toContain('owner@example.com');
    expect(updated.template).toBe('governance-alert');
  });

  test('INT-003: Simulates notification dispatch', () => {
    const result = simulateNotificationDispatch('email', 'dependency.created', {
      objectId: 'sales.orders',
    });

    expect(result.channel).toBe('email');
    expect(result.eventType).toBe('dependency.created');
    expect(result.dispatched).toBe(true);
  });

  test('INT-004: Registers, lists, and deletes webhooks', () => {
    const created = registerWebhook({
      name: 'ci-webhook',
      url: 'https://example.org/webhook',
      events: ['dependency.created'],
      maxRetries: 2,
    });

    const hooks = listWebhooks();
    expect(hooks.some((entry) => entry.webhookId === created.webhookId)).toBe(true);

    const deleted = deleteWebhook(created.webhookId);
    expect(deleted).toBe(true);
  });

  test('INT-005: Adds and removes external system links', () => {
    const link = addExternalLink('sales.orders', {
      type: 'jira',
      label: 'JIRA-123',
      url: 'https://jira.example.org/browse/JIRA-123',
    });

    const links = getExternalLinks('sales.orders');
    expect(links.some((entry) => entry.linkId === link.linkId)).toBe(true);

    const removed = removeExternalLink('sales.orders', link.linkId);
    expect(removed).toBe(true);
  });

  test('INT-006: Runs pipeline impact analysis', () => {
    const result = runImpactAnalysisForPipeline(['sales.customers'], objects, lineageGraph);

    expect(result.changedCount).toBe(1);
    expect(result.analyses).toHaveLength(1);
    expect(result.analyses[0].objectId).toBe('sales.customers');
    expect(result.analyses[0].downstreamCount).toBeGreaterThanOrEqual(1);
  });

  test('INT-007: Runs compliance checks', () => {
    const result = runComplianceValidation(['sales.order_summary'], objects);

    expect(result.scanned).toBe(1);
    expect(result.passed).toBe(false);
    expect(result.failureCount).toBe(1);
    expect(result.failures[0].checks.length).toBeGreaterThan(0);
  });

  test('INT-008: Generates post-deploy doc update summary', () => {
    const result = getPostDeployDocumentationUpdateSummary(['sales.orders'], objects);

    expect(result.updatedObjects).toBe(1);
    expect(result.status).toBe('completed');
    expect(result.objects).toContain('sales.orders');
  });
});
