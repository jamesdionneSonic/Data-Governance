import request from 'supertest';
import createApp from '../../src/app.js';
import { initializeCache } from '../../src/utils/cacheInitializer.js';
import { generateToken } from '../../src/utils/tokenManager.js';

function authHeaders(user = { id: 'viewer-1', email: 'viewer@example.com', roles: ['Viewer'] }) {
  return {
    Authorization: `Bearer ${generateToken({
      id: user.id,
      email: user.email,
      name: user.email,
      roles: user.roles,
      databases: ['sales'],
    })}`,
  };
}

describe('Dictionary API', () => {
  beforeEach(() => {
    initializeCache(
      new Map([
        [
          'sales.orders',
          {
            id: 'sales.orders',
            name: 'orders',
            database: 'sales',
            schema: 'dbo',
            type: 'table',
            owner: 'sales-owner',
            description: 'Order transaction table',
            columns: [{ name: 'order_id', data_type: 'int' }],
          },
        ],
      ]),
      new Map([['sales.orders', new Set()]])
    );
  });

  test('requires authentication', async () => {
    const app = createApp();
    const res = await request(app).get('/api/v1/dictionary');

    expect(res.status).toBe(401);
  });

  test('returns schema dictionary and object columns', async () => {
    const app = createApp();
    const summary = await request(app).get('/api/v1/dictionary?database=sales').set(authHeaders());

    expect(summary.status).toBe(200);
    expect(summary.body.data.summary).toMatchObject({ total_objects: 1, total_columns: 1 });
    expect(summary.body.data.hierarchy[0]).toMatchObject({ database: 'sales', schema: 'dbo' });

    const detail = await request(app).get('/api/v1/dictionary/sales.orders').set(authHeaders());
    expect(detail.status).toBe(200);
    expect(detail.body.data.columns[0]).toMatchObject({ name: 'order_id', data_type: 'int' });
  });

  test('exports object dictionary markdown', async () => {
    const app = createApp();
    const res = await request(app)
      .get('/api/v1/dictionary/sales.orders/export.md')
      .set(authHeaders());

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/markdown');
    expect(res.text).toContain('# Schema Dictionary - sales.dbo.orders');
  });
});
