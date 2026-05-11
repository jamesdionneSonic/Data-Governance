import request from 'supertest';

import createApp from '../../src/app.js';
import { generateToken } from '../../src/utils/tokenManager.js';

function createAuthHeader(roles = ['Viewer']) {
  const token = generateToken({
    id: `ssis-${roles.join('-').toLowerCase()}`,
    email: 'ssis.tester@example.com',
    name: 'SSIS Tester',
    roles,
    databases: ['master'],
  });

  return { Authorization: `Bearer ${token}` };
}

describe('SSIS API', () => {
  const app = createApp();
  const viewerHeaders = createAuthHeader(['Viewer']);
  const adminHeaders = createAuthHeader(['Admin']);

  test('SSIS-001: schema endpoint returns extraction contract', async () => {
    const res = await request(app).get('/api/v1/ssis/schema');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('requestBody');
    expect(res.body.endpoints).toHaveProperty('POST /api/v1/ssis/extract');
  });

  test('SSIS-002: extract endpoint requires admin role', async () => {
    const res = await request(app).post('/api/v1/ssis/extract').set(viewerHeaders).send({});

    expect(res.status).toBe(403);
  });

  test('SSIS-003: extract validates missing server for admin', async () => {
    const res = await request(app).post('/api/v1/ssis/extract').set(adminHeaders).send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Bad Request');
  });

  test('SSIS-004: lineage validates missing server', async () => {
    const res = await request(app).post('/api/v1/ssis/lineage').set(viewerHeaders).send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Bad Request');
  });

  test('SSIS-005: catalog validates missing server', async () => {
    const res = await request(app).post('/api/v1/ssis/catalog').set(viewerHeaders).send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Bad Request');
  });

  test('SSIS-006: agent-jobs validates missing server', async () => {
    const res = await request(app).post('/api/v1/ssis/agent-jobs').set(viewerHeaders).send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Bad Request');
  });

  test('SSIS-007: unsupported authentication type is rejected', async () => {
    const res = await request(app).post('/api/v1/ssis/catalog').set(viewerHeaders).send({
      server: 'localhost',
      authentication: 'unsupported-auth-mode',
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('Unsupported authentication type');
  });
});
