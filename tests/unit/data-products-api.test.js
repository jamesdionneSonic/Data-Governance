import request from 'supertest';
import createApp from '../../src/app.js';
import { generateToken } from '../../src/utils/tokenManager.js';
import { clearDataProducts } from '../../src/services/dataProductContractService.js';

function createAuthHeader({
  id, email, name, roles = ['Viewer'],
}) {
  const token = generateToken({
    id,
    email,
    name,
    roles,
    databases: ['sales'],
  });

  return { Authorization: `Bearer ${token}` };
}

describe('Phase 7 - Data Product Contracts API', () => {
  let app;
  let ownerHeaders;
  let stewardHeaders;
  let adminHeaders;
  let viewerHeaders;

  beforeAll(() => {
    app = createApp();

    ownerHeaders = createAuthHeader({
      id: 'user-owner',
      email: 'owner@example.com',
      name: 'Owner',
      roles: ['PowerUser'],
    });

    stewardHeaders = createAuthHeader({
      id: 'user-steward',
      email: 'steward@example.com',
      name: 'Steward',
      roles: ['Analyst'],
    });

    adminHeaders = createAuthHeader({
      id: 'user-admin',
      email: 'admin@example.com',
      name: 'Admin',
      roles: ['Admin'],
    });

    viewerHeaders = createAuthHeader({
      id: 'user-viewer',
      email: 'viewer@example.com',
      name: 'Viewer',
      roles: ['Viewer'],
    });
  });

  beforeEach(() => {
    clearDataProducts();
  });

  test('DPC-001: Creates a data product in draft state', async () => {
    const response = await request(app)
      .post('/api/v1/data-products/products')
      .set(ownerHeaders)
      .send({
        name: 'Sales Performance Product',
        domain: 'sales',
        description: 'Curated sales KPIs',
        ownerUserId: 'user-owner',
        stewardUserId: 'user-steward',
      });

    expect(response.status).toBe(201);
    expect(response.body.data.state).toBe('draft');
    expect(response.body.data.readiness.score).toBeGreaterThanOrEqual(0);
  });

  test('DPC-002: Owner adds contract version with SLA fields', async () => {
    const createResponse = await request(app)
      .post('/api/v1/data-products/products')
      .set(ownerHeaders)
      .send({
        name: 'Sales Performance Product',
        domain: 'sales',
        ownerUserId: 'user-owner',
        stewardUserId: 'user-steward',
      });

    const { productId } = createResponse.body.data;

    const contractResponse = await request(app)
      .post(`/api/v1/data-products/products/${productId}/contracts`)
      .set(ownerHeaders)
      .send({
        schemaGuarantees: 'Schema backwards compatibility for minor updates',
        freshnessSlaMinutes: 60,
        qualityThreshold: 98,
        accessTerms: 'Viewer and Analyst roles only',
      });

    expect(contractResponse.status).toBe(201);
    expect(contractResponse.body.data.currentContract.versionNumber).toBe(1);
    expect(contractResponse.body.data.currentContract.freshnessSlaMinutes).toBe(60);
  });

  test('DPC-003: Non-owner/steward cannot add contract version', async () => {
    const createResponse = await request(app)
      .post('/api/v1/data-products/products')
      .set(ownerHeaders)
      .send({
        name: 'Sales Performance Product',
        domain: 'sales',
        ownerUserId: 'user-owner',
        stewardUserId: 'user-steward',
      });

    const { productId } = createResponse.body.data;

    const response = await request(app)
      .post(`/api/v1/data-products/products/${productId}/contracts`)
      .set(viewerHeaders)
      .send({
        schemaGuarantees: 'None',
        freshnessSlaMinutes: 30,
        qualityThreshold: 90,
        accessTerms: 'Internal only',
      });

    expect(response.status).toBe(403);
  });

  test('DPC-004: Steward transitions draft -> review -> published', async () => {
    const createResponse = await request(app)
      .post('/api/v1/data-products/products')
      .set(ownerHeaders)
      .send({
        name: 'Sales Performance Product',
        domain: 'sales',
        ownerUserId: 'user-owner',
        stewardUserId: 'user-steward',
      });

    const { productId } = createResponse.body.data;

    const reviewResponse = await request(app)
      .post(`/api/v1/data-products/products/${productId}/state`)
      .set(stewardHeaders)
      .send({ state: 'review' });

    expect(reviewResponse.status).toBe(200);
    expect(reviewResponse.body.data.state).toBe('review');

    const publishResponse = await request(app)
      .post(`/api/v1/data-products/products/${productId}/state`)
      .set(stewardHeaders)
      .send({ state: 'published' });

    expect(publishResponse.status).toBe(200);
    expect(publishResponse.body.data.state).toBe('published');
  });

  test('DPC-005: Records violation and reflects open violation count', async () => {
    const createResponse = await request(app)
      .post('/api/v1/data-products/products')
      .set(ownerHeaders)
      .send({
        name: 'Sales Performance Product',
        domain: 'sales',
        ownerUserId: 'user-owner',
        stewardUserId: 'user-steward',
      });

    const { productId } = createResponse.body.data;

    const violationResponse = await request(app)
      .post(`/api/v1/data-products/products/${productId}/violations`)
      .set(ownerHeaders)
      .send({
        violationType: 'freshness_sla_breach',
        severity: 'high',
        message: 'Data delayed by 3 hours',
        impactedConsumers: ['finance-analytics'],
      });

    expect(violationResponse.status).toBe(201);
    expect(violationResponse.body.data.readiness.openViolations).toBe(1);
  });

  test('DPC-006: Admin can export contract compliance', async () => {
    await request(app).post('/api/v1/data-products/products').set(ownerHeaders).send({
      name: 'Sales Performance Product',
      domain: 'sales',
      ownerUserId: 'user-owner',
      stewardUserId: 'user-steward',
    });

    const response = await request(app)
      .get('/api/v1/data-products/contracts/export/compliance')
      .set(adminHeaders);

    expect(response.status).toBe(200);
    expect(response.body.data.count).toBe(1);
    expect(Array.isArray(response.body.data.products)).toBe(true);
  });

  test('DPC-007: Non-admin export is forbidden', async () => {
    const response = await request(app)
      .get('/api/v1/data-products/contracts/export/compliance')
      .set(viewerHeaders);

    expect(response.status).toBe(403);
  });
});
