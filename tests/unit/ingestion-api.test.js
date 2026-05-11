import request from 'supertest';

import createApp from '../../src/app.js';
import { generateToken } from '../../src/utils/tokenManager.js';

function createAuthHeader(roles = ['Viewer']) {
  const token = generateToken({
    id: `ingestion-${roles.join('-').toLowerCase()}`,
    email: 'ingestion.tester@example.com',
    name: 'Ingestion Tester',
    roles,
    databases: ['sales'],
  });

  return { Authorization: `Bearer ${token}` };
}

describe('Ingestion API', () => {
  const app = createApp();
  const viewerHeaders = createAuthHeader(['Viewer']);
  const adminHeaders = createAuthHeader(['Admin']);

  test('ING-001: parse endpoint validates required filePath', async () => {
    const res = await request(app).post('/api/v1/ingestion/parse').set(viewerHeaders).send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Bad Request');
  });

  test('ING-002: parse-content rejects invalid payload', async () => {
    const res = await request(app)
      .post('/api/v1/ingestion/parse-content')
      .set(viewerHeaders)
      .send({ content: 123 });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Bad Request');
  });

  test('ING-003: parse-content accepts valid markdown payload', async () => {
    const markdown =
      '---\nname: test_asset\ndatabase: sales\ntype: table\nowner: owner@example.com\nsensitivity: internal\ntags:\n  - core\n---\n\n# Test Asset\n\nSample description for ingestion test.';

    const res = await request(app).post('/api/v1/ingestion/parse-content').set(viewerHeaders).send({
      content: markdown,
      fileName: 'test-asset.md',
    });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data).toBeDefined();
  });

  test('ING-004: validate endpoint returns summary for admin', async () => {
    const res = await request(app)
      .post('/api/v1/ingestion/validate')
      .set(adminHeaders)
      .send({ dataPath: './data/markdown' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data).toHaveProperty('valid');
    expect(res.body.data).toHaveProperty('invalid');
  });

  test('ING-005: load endpoint returns no data for invalid path', async () => {
    const res = await request(app)
      .post('/api/v1/ingestion/load')
      .set(adminHeaders)
      .send({ dataPath: './does-not-exist' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('No Data');
  });

  test('ING-006: status endpoint returns ingestion state', async () => {
    const res = await request(app).get('/api/v1/ingestion/status').set(viewerHeaders);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data).toHaveProperty('meilisearchHealthy');
    expect(res.body.data).toHaveProperty('lastUpdated');
  });

  test('ING-007: export-zip returns 404 for missing directory', async () => {
    const res = await request(app)
      .get('/api/v1/ingestion/export-zip?dataPath=./missing-dir-for-test')
      .set(adminHeaders);

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Not Found');
  });

  test('ING-008: connect-sql-server validates required connection fields', async () => {
    const res = await request(app)
      .post('/api/v1/ingestion/connect-sql-server')
      .set(adminHeaders)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Bad Request');
  });

  test('ING-009: connect-sql-server/discover validates required fields', async () => {
    const res = await request(app)
      .post('/api/v1/ingestion/connect-sql-server/discover')
      .set(adminHeaders)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Bad Request');
  });
});
