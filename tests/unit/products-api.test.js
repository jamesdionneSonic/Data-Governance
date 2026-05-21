import fs from 'fs';
import path from 'path';
import request from 'supertest';

import createApp from '../../src/app.js';
import { generateToken } from '../../src/utils/tokenManager.js';

function createAuthHeader() {
  const token = generateToken({
    id: 'products-tester',
    email: 'products.tester@example.com',
    name: 'Products Tester',
    roles: ['Admin'],
    databases: ['sales'],
  });

  return { Authorization: `Bearer ${token}` };
}

describe('Products API', () => {
  const app = createApp();
  const authHeader = createAuthHeader();
  const createdFiles = new Set();

  afterAll(() => {
    for (const filePath of createdFiles) {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  });

  test('PROD-001: rejects unauthenticated access', async () => {
    const res = await request(app).get('/api/v1/products');
    expect(res.status).toBe(401);
  });

  test('PROD-002: lists products for authenticated user', async () => {
    const res = await request(app).get('/api/v1/products').set(authHeader);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(Array.isArray(res.body.products)).toBe(true);
  });

  test('PROD-003: creates, retrieves, updates, and filters a product', async () => {
    const uniqueName = `Phase1 Product ${Date.now()}`;
    const slug = uniqueName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const productPath = path.resolve(process.cwd(), 'data/products', `${slug}.md`);

    const createRes = await request(app)
      .post('/api/v1/products')
      .set(authHeader)
      .send({
        name: uniqueName,
        domain: 'Finance',
        owner: 'owner@example.com',
        tags: ['phase1', 'finance'],
        certified: true,
        trust_level: 'gold',
        description: '# Product\n\nPhase 1 coverage test product',
      });

    expect(createRes.status).toBe(201);
    expect(createRes.body.status).toBe('success');
    expect(createRes.body.product.slug).toBe(slug);
    createdFiles.add(productPath);

    const duplicateRes = await request(app)
      .post('/api/v1/products')
      .set(authHeader)
      .send({ name: uniqueName, domain: 'Finance' });

    expect(duplicateRes.status).toBe(409);

    const getByIdRes = await request(app).get(`/api/v1/products/${slug}`).set(authHeader);

    expect(getByIdRes.status).toBe(200);
    expect(getByIdRes.body.product.slug).toBe(slug);

    const updateRes = await request(app)
      .put(`/api/v1/products/${slug}`)
      .set(authHeader)
      .send({ status: 'published', tags: ['phase1', 'updated'] });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.product.status).toBe('published');
    expect(updateRes.body.product.tags).toEqual(expect.arrayContaining(['updated']));

    const domainRes = await request(app).get('/api/v1/products?domain=Finance').set(authHeader);

    expect(domainRes.status).toBe(200);
    expect(domainRes.body.products.some((p) => p.slug === slug)).toBe(true);

    const statusRes = await request(app).get('/api/v1/products?status=published').set(authHeader);

    expect(statusRes.status).toBe(200);
    expect(statusRes.body.products.some((p) => p.slug === slug)).toBe(true);

    const certifiedRes = await request(app).get('/api/v1/products/certified').set(authHeader);

    expect(certifiedRes.status).toBe(200);
    expect(Array.isArray(certifiedRes.body.products)).toBe(true);
  });

  test('PROD-004: returns expected errors for invalid operations', async () => {
    const missingNameRes = await request(app)
      .post('/api/v1/products')
      .set(authHeader)
      .send({ domain: 'Finance' });

    expect(missingNameRes.status).toBe(400);

    const missingRes = await request(app)
      .get('/api/v1/products/non-existent-product')
      .set(authHeader);

    expect(missingRes.status).toBe(404);

    const updateMissingRes = await request(app)
      .put('/api/v1/products/non-existent-product')
      .set(authHeader)
      .send({ status: 'published' });

    expect(updateMissingRes.status).toBe(404);
  });
});
