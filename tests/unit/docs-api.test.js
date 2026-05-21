import request from 'supertest';

import createApp from '../../src/app.js';
import { generateToken } from '../../src/utils/tokenManager.js';

function createAuthHeader(roles = ['Viewer']) {
  const token = generateToken({
    id: `docs-${roles.join('-').toLowerCase()}`,
    email: 'docs.qa@example.com',
    name: 'Docs QA',
    roles,
    databases: ['sales'],
  });

  return { Authorization: `Bearer ${token}` };
}

describe('Docs API', () => {
  let app;

  beforeAll(() => {
    app = createApp();
  });

  test('DOCS-001: rejects unauthenticated library access', async () => {
    const response = await request(app).get('/api/v1/docs/library');
    expect(response.status).toBe(401);
  });

  test('DOCS-002: lists user docs for authenticated users', async () => {
    const response = await request(app)
      .get('/api/v1/docs/library')
      .set(createAuthHeader(['Viewer']));

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(Array.isArray(response.body.data.documents)).toBe(true);
    expect(response.body.data.documents.length).toBeGreaterThan(0);
  });

  test('DOCS-003: fetches markdown content by key', async () => {
    const response = await request(app)
      .get('/api/v1/docs/library/help-center')
      .set(createAuthHeader(['Viewer']));

    expect(response.status).toBe(200);
    expect(response.body.data.key).toBe('help-center');
    expect(response.body.data.content).toContain('# Help Center');
  });

  test('DOCS-004: returns 404 for unknown key', async () => {
    const response = await request(app)
      .get('/api/v1/docs/library/not-real')
      .set(createAuthHeader(['Viewer']));

    expect(response.status).toBe(404);
  });
});
