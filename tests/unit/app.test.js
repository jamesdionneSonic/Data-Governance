import request from 'supertest';
import createApp from '../../src/app.js';

describe('Health Endpoint', () => {
  let app;

  beforeAll(() => {
    app = createApp();
  });

  test('GET /health should return 200 with status ok', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.timestamp).toBeDefined();
    expect(res.body.environment).toBeDefined();
  });

  test('GET /api/v1 should return API overview', async () => {
    const res = await request(app).get('/api/v1');

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Data Governance API v1');
    expect(res.body.routes).toBeDefined();
  });

  test('GET /health/performance should return request metrics', async () => {
    await request(app).get('/health');
    const res = await request(app).get('/health/performance');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.metrics).toBeDefined();
    expect(res.body.metrics.totalRequests).toBeGreaterThanOrEqual(1);
    expect(res.body.metrics.p95Ms).toBeDefined();
  });

  test('GET /invalid-route should return 404', async () => {
    const res = await request(app).get('/invalid-route');

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Not Found');
  });
});
