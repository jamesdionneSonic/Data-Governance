import { test, expect } from '@playwright/test';

test.describe('Playwright Smoke Suite', () => {
  test('SMOKE-001: Home page loads', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.ok()).toBeTruthy();
    await expect(page).toHaveURL(/\/$/);
  });

  test('SMOKE-002: Health endpoint returns ok payload', async ({ request }) => {
    const response = await request.get('/health');
    expect(response.ok()).toBeTruthy();

    const payload = await response.json();
    expect(payload.status).toBe('ok');
  });

  test('SMOKE-003: Auth endpoint enforces authentication', async ({ request }) => {
    const response = await request.get('/api/v1/auth/me');
    expect(response.status()).toBe(401);
  });

  test('SMOKE-004: Search endpoint is reachable and protected', async ({ request }) => {
    const response = await request.get('/api/v1/search?q=orders');
    expect(response.status()).toBe(401);
  });

  test('SMOKE-005: Object detail endpoint is reachable and protected', async ({ request }) => {
    const response = await request.get('/api/v1/objects/sales.orders');
    expect(response.status()).toBe(401);
  });

  test('SMOKE-006: Lineage endpoint is reachable and protected', async ({ request }) => {
    const response = await request.get('/api/v1/lineage/sales.orders/upstream');
    expect(response.status()).toBe(401);
  });

  test('SMOKE-007: Ingestion endpoint is reachable and protected', async ({ request }) => {
    const response = await request.post('/api/v1/ingestion/parse', {
      data: { filePath: './data/markdown/databases/sales/orders.md' },
    });
    expect(response.status()).toBe(401);
  });

  test('SMOKE-008: Reporting export endpoint is reachable and protected', async ({ request }) => {
    const response = await request.get('/api/v1/reporting/export/catalog.csv');
    expect(response.status()).toBe(401);
  });
});
