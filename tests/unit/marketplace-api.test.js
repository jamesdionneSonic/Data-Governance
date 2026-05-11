import request from 'supertest';
import createApp, { initializeCache } from '../../src/app.js';
import { generateToken } from '../../src/utils/tokenManager.js';
import { clearAccessRequests } from '../../src/services/accessRequestService.js';

function createAuthHeader({ id, email, name, roles = ['Viewer'] }) {
  const token = generateToken({
    id,
    email,
    name,
    roles,
    databases: ['sales'],
  });

  return { Authorization: `Bearer ${token}` };
}

describe('Phase 7 - Marketplace Access Workflow API', () => {
  let app;
  let requesterHeaders;
  let approverHeaders;
  let adminHeaders;

  beforeAll(() => {
    app = createApp();

    const objects = new Map();
    objects.set('sales.orders', {
      id: 'sales.orders',
      name: 'orders',
      database: 'sales',
      type: 'table',
      owner: 'data-team',
    });

    const lineageGraph = new Map();
    initializeCache(app, objects, lineageGraph);

    requesterHeaders = createAuthHeader({
      id: 'user-requester',
      email: 'requester@example.com',
      name: 'Requester',
      roles: ['Viewer'],
    });

    approverHeaders = createAuthHeader({
      id: 'user-approver',
      email: 'approver@example.com',
      name: 'Approver',
      roles: ['PowerUser'],
    });

    adminHeaders = createAuthHeader({
      id: 'user-admin',
      email: 'admin@example.com',
      name: 'Admin',
      roles: ['Admin'],
    });
  });

  beforeEach(() => {
    clearAccessRequests();
  });

  test('MKT-001: Rejects unauthenticated request creation', async () => {
    const response = await request(app)
      .post('/api/v1/marketplace/requests')
      .send({ assetId: 'sales.orders' });

    expect(response.status).toBe(401);
  });

  test('MKT-002: Creates request with submitted lifecycle state', async () => {
    const response = await request(app)
      .post('/api/v1/marketplace/requests')
      .set(requesterHeaders)
      .send({
        assetId: 'sales.orders',
        justification: 'Need access for KPI dashboard',
        requestedRole: 'Analyst',
        approverId: 'user-approver',
      });

    expect(response.status).toBe(201);
    expect(response.body.data.status).toBe('submitted');
    expect(response.body.data.requester.userId).toBe('user-requester');
    expect(response.body.data.events.length).toBe(1);
    expect(response.body.data.sla.overdue).toBe(false);
  });

  test('MKT-003: Requester can list own requests', async () => {
    await request(app)
      .post('/api/v1/marketplace/requests')
      .set(requesterHeaders)
      .send({ assetId: 'sales.orders', approverId: 'user-approver' });

    const response = await request(app)
      .get('/api/v1/marketplace/requests?scope=mine')
      .set(requesterHeaders);

    expect(response.status).toBe(200);
    expect(response.body.data.count).toBe(1);
    expect(response.body.data.requests[0].requester.userId).toBe('user-requester');
  });

  test('MKT-004: Non-admin cannot list all requests', async () => {
    await request(app)
      .post('/api/v1/marketplace/requests')
      .set(requesterHeaders)
      .send({ assetId: 'sales.orders', approverId: 'user-approver' });

    const response = await request(app)
      .get('/api/v1/marketplace/requests?scope=all')
      .set(requesterHeaders);

    expect(response.status).toBe(403);
  });

  test('MKT-005: Approver can transition request to approved', async () => {
    const createResponse = await request(app)
      .post('/api/v1/marketplace/requests')
      .set(requesterHeaders)
      .send({ assetId: 'sales.orders', approverId: 'user-approver' });

    const { requestId } = createResponse.body.data;

    const inReviewResponse = await request(app)
      .post(`/api/v1/marketplace/requests/${requestId}/review`)
      .set(approverHeaders)
      .send({ action: 'start_review', comment: 'Looking now' });

    expect(inReviewResponse.status).toBe(200);
    expect(inReviewResponse.body.data.status).toBe('in-review');

    const approveResponse = await request(app)
      .post(`/api/v1/marketplace/requests/${requestId}/review`)
      .set(approverHeaders)
      .send({ action: 'approve', comment: 'Approved for analytics team' });

    expect(approveResponse.status).toBe(200);
    expect(approveResponse.body.data.status).toBe('approved');
    expect(approveResponse.body.data.decision.action).toBe('approve');
  });

  test('MKT-006: Admin can fulfill approved request', async () => {
    const createResponse = await request(app)
      .post('/api/v1/marketplace/requests')
      .set(requesterHeaders)
      .send({ assetId: 'sales.orders', approverId: 'user-approver' });

    const { requestId } = createResponse.body.data;

    await request(app)
      .post(`/api/v1/marketplace/requests/${requestId}/review`)
      .set(adminHeaders)
      .send({ action: 'approve', comment: 'Approved by admin' });

    const fulfillResponse = await request(app)
      .post(`/api/v1/marketplace/requests/${requestId}/fulfill`)
      .set(adminHeaders)
      .send({
        assignmentReference: 'perm-assignment-123',
        notes: 'RBAC update queued',
      });

    expect(fulfillResponse.status).toBe(200);
    expect(fulfillResponse.body.data.status).toBe('fulfilled');
    expect(fulfillResponse.body.data.fulfillment.assignmentReference).toBe('perm-assignment-123');
  });

  test('MKT-007: Admin can export request history', async () => {
    await request(app)
      .post('/api/v1/marketplace/requests')
      .set(requesterHeaders)
      .send({ assetId: 'sales.orders', approverId: 'user-approver' });

    const response = await request(app)
      .get('/api/v1/marketplace/requests/export/history')
      .set(adminHeaders);

    expect(response.status).toBe(200);
    expect(response.body.data.count).toBe(1);
    expect(Array.isArray(response.body.data.requests)).toBe(true);
  });
});
