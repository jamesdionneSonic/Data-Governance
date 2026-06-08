import request from 'supertest';
import createApp, { initializeCache } from '../../src/app.js';
import { generateToken } from '../../src/utils/tokenManager.js';
import { clearGovernanceOps } from '../../src/services/governanceOpsService.js';

function auth(roles = ['Viewer']) {
  return {
    Authorization: `Bearer ${generateToken({
      id: roles.includes('Admin') ? 'admin-user' : 'test-user',
      email: roles.includes('Admin') ? 'admin@example.com' : 'user@example.com',
      name: 'Test User',
      roles,
      databases: ['sales'],
    })}`,
  };
}

describe('Phase 7 - Governance Operations API', () => {
  let app;

  beforeAll(() => {
    app = createApp();
    const objects = new Map([
      [
        'sales',
        {
          id: 'sales',
          name: 'Sales domain',
          type: 'domain',
          owner: 'sales-owner@example.com',
          steward: 'sales-steward@example.com',
          domain_manager: 'sales-manager@example.com',
          custodian: 'platform@example.com',
          description: 'Sales governed domain.',
          tags: ['domain'],
        },
      ],
      [
        'sales.orders',
        {
          id: 'sales.orders',
          name: 'orders',
          type: 'table',
          owner: 'owner@example.com',
          steward: 'steward@example.com',
          description: 'Sales orders table with governed revenue metrics.',
          sensitivity: 'confidential',
          tags: ['finance'],
          certified: true,
          database: 'sales',
        },
      ],
      ['sales.raw_orders', { id: 'sales.raw_orders', name: 'raw_orders', owner: 'unknown', tags: [], database: 'sales' }],
    ]);
    const lineageGraph = new Map([['sales.raw_orders', new Set(['sales.orders'])]]);
    initializeCache(app, objects, lineageGraph);
  });

  beforeEach(() => clearGovernanceOps());

  test('requires authentication for Phase 7 overview', async () => {
    const response = await request(app).get('/api/v1/governance-ops/overview');
    expect(response.status).toBe(401);
  });

  test('returns overview and KPI data from the catalog cache', async () => {
    const response = await request(app).get('/api/v1/governance-ops/overview').set(auth());

    expect(response.status).toBe(200);
    expect(response.body.data.kpis.totalAssets).toBe(3);
    expect(response.body.data.publication.ready).toBe(false);
    expect(response.body.data.ownership.coverage.owner.count).toBeGreaterThan(0);
  });

  test('returns ownership role model, steward portfolio, and bulk assignment plans', async () => {
    const modelResponse = await request(app).get('/api/v1/governance-ops/ownership/model').set(auth());
    expect(modelResponse.status).toBe(200);
    expect(modelResponse.body.data.roles.map((role) => role.role)).toEqual(
      expect.arrayContaining(['owner', 'steward', 'domain_manager', 'custodian'])
    );

    const portfolioResponse = await request(app)
      .get('/api/v1/governance-ops/ownership/portfolio?subject=sales-steward@example.com')
      .set(auth(['Steward']));
    expect(portfolioResponse.status).toBe(200);
    expect(portfolioResponse.body.data.assets.map((asset) => asset.assetId)).toEqual(
      expect.arrayContaining(['sales.raw_orders'])
    );

    const planResponse = await request(app)
      .post('/api/v1/governance-ops/ownership/bulk-assignment-plan')
      .set(auth(['Steward']))
      .send({
        assetIds: ['sales.raw_orders'],
        owner: 'owner2@example.com',
        steward: 'steward2@example.com',
      });
    expect(planResponse.status).toBe(200);
    expect(planResponse.body.data.count).toBe(1);
    expect(planResponse.body.data.task.type).toBe('bulk_ownership_assignment');
  });

  test('lets stewards create, transition, and list tasks', async () => {
    const createResponse = await request(app)
      .post('/api/v1/governance-ops/tasks')
      .set(auth(['Steward']))
      .send({ assetId: 'sales.orders', title: 'Review owner' });

    expect(createResponse.status).toBe(201);

    const { taskId } = createResponse.body.data;
    const transitionResponse = await request(app)
      .post(`/api/v1/governance-ops/tasks/${taskId}/transition`)
      .set(auth(['Steward']))
      .send({ status: 'done', note: 'Complete' });

    expect(transitionResponse.status).toBe(200);
    expect(transitionResponse.body.data.status).toBe('done');

    const listResponse = await request(app).get('/api/v1/governance-ops/tasks').set(auth());
    expect(listResponse.body.data.count).toBe(1);
  });

  test('supports incident communication and impact risk assessment', async () => {
    const incidentResponse = await request(app)
      .post('/api/v1/governance-ops/incidents')
      .set(auth(['Admin']))
      .send({ assetId: 'sales.orders', title: 'Data freshness issue', severity: 'high' });

    expect(incidentResponse.status).toBe(201);

    const communicationResponse = await request(app)
      .post(`/api/v1/governance-ops/incidents/${incidentResponse.body.data.incidentId}/communications`)
      .set(auth(['Admin']))
      .send({ channel: 'email', message: 'Investigating freshness delay.' });

    expect(communicationResponse.status).toBe(201);

    const riskResponse = await request(app)
      .post('/api/v1/governance-ops/impact/risk-assessment')
      .set(auth(['Admin']))
      .send({ assetId: 'sales.orders', changeTypes: ['drop_column'] });

    expect(riskResponse.status).toBe(200);
    expect(riskResponse.body.data.approvalRequired).toBe(true);
  });

  test('records comments, trust endorsements, ROI, and publication checks', async () => {
    const commentResponse = await request(app)
      .post('/api/v1/governance-ops/assets/sales.orders/comments')
      .set(auth())
      .send({ body: 'Please review this with @steward.' });

    expect(commentResponse.status).toBe(201);
    expect(commentResponse.body.data.mentions).toContain('@steward');

    const endorseResponse = await request(app)
      .post('/api/v1/governance-ops/trust/sales.orders/endorse')
      .set(auth())
      .send({ endorsement: 'trusted-for-reporting' });

    expect(endorseResponse.status).toBe(201);

    const roiResponse = await request(app)
      .post('/api/v1/governance-ops/roi/calculate')
      .set(auth())
      .send({ avoidedIncidents: 1, hoursSaved: 10, platformCost: 5000 });

    expect(roiResponse.body.data.netValue).toBeGreaterThan(0);

    const checkResponse = await request(app)
      .post('/api/v1/governance-ops/publication/checks/catalog-refresh')
      .set(auth(['Admin']))
      .send({ status: 'pass', detail: 'Catalog refresh completed.' });

    expect(checkResponse.status).toBe(200);
  });

  test('exports store state and reports durable store status for admins', async () => {
    await request(app)
      .post('/api/v1/governance-ops/tasks')
      .set(auth(['Admin']))
      .send({ assetId: 'sales.orders', title: 'Export task' });

    const statusResponse = await request(app)
      .get('/api/v1/governance-ops/store/status')
      .set(auth(['Admin']));

    expect(statusResponse.status).toBe(200);
    expect(statusResponse.body.data.counts.tasks).toBe(1);

    const exportResponse = await request(app).get('/api/v1/governance-ops/export').set(auth(['Admin']));

    expect(exportResponse.status).toBe(200);
    expect(exportResponse.body.data.tasks).toHaveLength(1);
  });
});
