import request from 'supertest';
import createApp, { initializeCache } from '../../src/app.js';
import { generateToken } from '../../src/utils/tokenManager.js';

function createAuthHeader(roles = ['Viewer']) {
  const token = generateToken({
    id: `qa-${roles.join('-').toLowerCase()}`,
    email: 'qa@example.com',
    name: 'QA User',
    roles,
    databases: ['sales'],
  });

  return { Authorization: `Bearer ${token}` };
}

describe('Phase 9 - Integrations API QA', () => {
  let app;

  beforeAll(() => {
    app = createApp();

    const objects = new Map();
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
      owner: 'analytics-team',
      sensitivity: 'confidential',
      tags: ['transactions'],
      description: 'Order records',
    });

    const lineageGraph = new Map();
    lineageGraph.set('sales.customers', new Set());
    lineageGraph.set('sales.orders', new Set(['sales.customers']));

    initializeCache(app, objects, lineageGraph);
  });

  test('INTAPI-001: Rejects unauthenticated settings access', async () => {
    const response = await request(app).get('/api/v1/integrations/settings');

    expect(response.status).toBe(401);
  });

  test('INTAPI-002: Rejects non-admin settings access', async () => {
    const response = await request(app)
      .get('/api/v1/integrations/settings')
      .set(createAuthHeader(['Viewer']));

    expect(response.status).toBe(403);
  });

  test('INTAPI-003: Returns settings for admin', async () => {
    const response = await request(app)
      .get('/api/v1/integrations/settings')
      .set(createAuthHeader(['Admin']));

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.data.notifications.email).toBeDefined();
  });

  test('INTAPI-004: Updates notifications and simulates dispatch', async () => {
    const adminHeaders = createAuthHeader(['Admin']);

    const updateResponse = await request(app)
      .put('/api/v1/integrations/notifications/email')
      .set(adminHeaders)
      .send({
        enabled: true,
        recipients: ['owner@example.com'],
        template: 'qa-template',
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.data.enabled).toBe(true);

    const dispatchResponse = await request(app)
      .post('/api/v1/integrations/notifications/send')
      .set(adminHeaders)
      .send({
        channel: 'email',
        eventType: 'qa.test.event',
        payload: { objectId: 'sales.orders' },
      });

    expect(dispatchResponse.status).toBe(200);
    expect(dispatchResponse.body.data.dispatched).toBe(true);
  });

  test('INTAPI-005: Manages webhook lifecycle endpoints', async () => {
    const adminHeaders = createAuthHeader(['Admin']);

    const createResponse = await request(app)
      .post('/api/v1/integrations/webhooks')
      .set(adminHeaders)
      .send({
        name: 'qa-hook',
        url: 'https://example.org/webhook',
        events: ['qa.event'],
      });

    expect(createResponse.status).toBe(201);
    const { webhookId } = createResponse.body.data;
    expect(webhookId).toBeDefined();

    const listResponse = await request(app)
      .get('/api/v1/integrations/webhooks')
      .set(adminHeaders);

    expect(listResponse.status).toBe(200);
    expect(
      listResponse.body.data.webhooks.some((entry) => entry.webhookId === webhookId),
    ).toBe(true);

    const deleteResponse = await request(app)
      .delete(`/api/v1/integrations/webhooks/${webhookId}`)
      .set(adminHeaders);

    expect(deleteResponse.status).toBe(200);
  });

  test('INTAPI-006: Manages object links endpoints', async () => {
    const adminHeaders = createAuthHeader(['Admin']);

    const addResponse = await request(app)
      .post('/api/v1/integrations/links/sales.orders')
      .set(adminHeaders)
      .send({
        type: 'jira',
        label: 'JIRA-456',
        url: 'https://jira.example.org/browse/JIRA-456',
      });

    expect(addResponse.status).toBe(201);
    const { linkId } = addResponse.body.data;

    const listResponse = await request(app)
      .get('/api/v1/integrations/links/sales.orders')
      .set(adminHeaders);

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.data.links.some((entry) => entry.linkId === linkId)).toBe(true);

    const deleteResponse = await request(app)
      .delete(`/api/v1/integrations/links/sales.orders/${linkId}`)
      .set(adminHeaders);

    expect(deleteResponse.status).toBe(200);
  });

  test('INTAPI-007: Runs CI/CD QA endpoints', async () => {
    const adminHeaders = createAuthHeader(['Admin']);

    const impactResponse = await request(app)
      .post('/api/v1/integrations/cicd/impact-analysis')
      .set(adminHeaders)
      .send({ objectIds: ['sales.customers'] });

    expect(impactResponse.status).toBe(200);
    expect(impactResponse.body.data.changedCount).toBe(1);

    const complianceResponse = await request(app)
      .post('/api/v1/integrations/cicd/compliance-check')
      .set(adminHeaders)
      .send({ objectIds: ['sales.orders'] });

    expect(complianceResponse.status).toBe(200);
    expect(complianceResponse.body.data.scanned).toBe(1);

    const docsResponse = await request(app)
      .post('/api/v1/integrations/cicd/post-deploy-docs')
      .set(adminHeaders)
      .send({ objectIds: ['sales.orders'] });

    expect(docsResponse.status).toBe(200);
    expect(docsResponse.body.data.updatedObjects).toBe(1);
  });
});
