import request from 'supertest';
import createApp, { initializeCache } from '../../src/app.js';
import { generateToken } from '../../src/utils/tokenManager.js';

function authHeaders(roles = ['Admin']) {
  const token = generateToken({
    id: 'profile-user',
    email: 'profile-user@example.com',
    name: 'Profile User',
    roles,
  });
  return { Authorization: `Bearer ${token}` };
}

function seedApp() {
  const app = createApp();
  initializeCache(
    app,
    new Map([
      [
        'finance.dbo.Invoice',
        {
          id: 'finance.dbo.Invoice',
          database: 'finance',
          schema: 'dbo',
          name: 'Invoice',
          type: 'table',
          row_count: 1000,
          columns: [
            { name: 'invoice_id', data_type: 'int' },
            { name: 'customer_email', data_type: 'nvarchar', classification: 'PII' },
            { name: 'total_amount', data_type: 'decimal' },
          ],
        },
      ],
    ]),
    new Map()
  );
  return app;
}

describe('Profiling API', () => {
  test('returns framework contract', async () => {
    const res = await request(seedApp()).get('/api/v1/profiling/contract').set(authHeaders());

    expect(res.status).toBe(200);
    expect(res.body.contract.raw_values_retained).toBe(false);
    expect(res.body.contract.supported_execution_modes).toEqual(
      expect.arrayContaining(['dry_run', 'simulate', 'live'])
    );
  });

  test('plans safe profiling SQL from catalog objects', async () => {
    const res = await request(seedApp())
      .post('/api/v1/profiling/plan')
      .set(authHeaders())
      .send({
        asset_id: 'finance.dbo.Invoice',
        profile_mode: 'sample',
      });

    expect(res.status).toBe(200);
    expect(res.body.plan.summary.planned_assets).toBe(1);
    expect(res.body.plan.actions[0].query.sql).toContain('READ UNCOMMITTED');
  });

  test('runs simulated profile and returns answer package', async () => {
    const res = await request(seedApp())
      .post('/api/v1/profiling/run')
      .set(authHeaders())
      .send({
        asset_id: 'finance.dbo.Invoice',
        profile_mode: 'sample',
        execution_mode: 'simulate',
      });

    expect(res.status).toBe(200);
    expect(res.body.data.answer.answer).toContain('retained no raw data');
    expect(res.body.data.run.summary.assets_profiled).toBe(1);
    expect(res.body.data.package.manifest.profile_count).toBe(1);
    expect(res.body.data.confluence.content).toContain('Profiled Assets');
  });

  test('requires admin role for requested live profiling', async () => {
    const res = await request(seedApp())
      .post('/api/v1/profiling/run')
      .set(authHeaders(['User']))
      .send({
        asset_id: 'finance.dbo.Invoice',
        profile_mode: 'sample',
        execution_mode: 'live',
      });

    expect(res.status).toBe(403);
    expect(res.body.errorInfo.code).toBe('PROFILING_LIVE_FORBIDDEN');
  });

  test('applies profile stats to a catalog object response', async () => {
    const res = await request(seedApp())
      .post('/api/v1/profiling/apply')
      .set(authHeaders())
      .send({
        asset_id: 'finance.dbo.Invoice',
        profile: {
          asset_id: 'finance.dbo.Invoice',
          row_count: 111,
          columns: {
            total_amount: {
              null_count: 1,
              null_percent: 0.9,
              distinct_count: 50,
            },
          },
        },
      });

    expect(res.status).toBe(200);
    expect(res.body.asset.row_count).toBe(111);
    expect(res.body.asset.columns.find((column) => column.name === 'total_amount').null_count).toBe(1);
  });
});
