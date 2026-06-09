import request from 'supertest';
import { mkdtemp, mkdir, rm, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import createApp, { initializeCache } from '../../src/app.js';
import { generateToken } from '../../src/utils/tokenManager.js';

function authHeaders() {
  const token = generateToken({
    id: 'search-user',
    email: 'search-user@example.com',
    name: 'Search User',
    roles: ['Admin'],
    databases: ['sales', 'analytics', 'SSISDB'],
  });
  return { Authorization: `Bearer ${token}` };
}

function seedSearchCatalog(app) {
  const objects = new Map([
    [
      'sales.orders',
      {
        id: 'sales.orders',
        name: 'Orders',
        database: 'sales',
        type: 'table',
        owner: 'data-team',
        sensitivity: 'internal',
        description: 'Customer order fact table',
        tags: ['sales', 'critical'],
        columns: [{ name: 'customer_email_address' }],
      },
    ],
    [
      'analytics.customer_metrics',
      {
        id: 'analytics.customer_metrics',
        name: 'Customer Metrics',
        database: 'analytics',
        type: 'view',
        owner: 'analytics-team',
        sensitivity: 'internal',
        description: 'Customer KPIs and trend reporting',
        quality_score: 95,
        tags: ['analytics'],
      },
    ],
    [
      'analytics.customer_metrics_shadow',
      {
        id: 'analytics.customer_metrics_shadow',
        name: 'Customer Metrics Shadow',
        database: 'analytics',
        type: 'view',
        owner: 'analytics-team',
        sensitivity: 'internal',
        description: 'Customer KPIs and trend reporting',
        quality_score: 10,
        tags: ['analytics'],
      },
    ],
    [
      'ssis.load_orders',
      {
        id: 'ssis.load_orders',
        name: 'Load Orders Package',
        packageName: 'LoadOrders',
        packagePath: 'Finance/LoadOrders.dtsx',
        database: 'SSISDB',
        type: 'package',
        owner: 'etl-team',
        sensitivity: 'internal',
        description: 'SSIS package that loads order data',
        tags: ['ssis', 'orders'],
      },
    ],
    [
      '192.224.101.80.dbSonicDW.dbo.dwFullTextConversation',
      {
        id: '192.224.101.80.dbSonicDW.dbo.dwFullTextConversation',
        name: 'dwFullTextConversation',
        database: 'dbSonicDW',
        schema: 'dbo',
        type: 'table',
        owner: 'etl-team',
        sensitivity: 'internal',
        description: 'SSIS-observed text conversation endpoint',
        tags: ['ssis-observed'],
      },
    ],
  ]);

  initializeCache(app, objects, new Map());
}

describe('Search API', () => {
  let app;

  beforeEach(() => {
    app = createApp();
    seedSearchCatalog(app);
  });

  test('returns in-memory catalog matches when Elasticsearch has no test hits', async () => {
    const res = await request(app).get('/api/v1/search?q=orders&limit=10').set(authHeaders());

    expect(res.status).toBe(200);
    expect(res.body.searchEngine).toBe('memory_canonical');
    expect(res.body.pagination.total).toBeGreaterThan(0);
    expect(res.body.results.map((item) => item.id)).toContain('sales.orders');
    expect(res.body.results.map((item) => item.id)).toContain('ssis.load_orders');
  });

  test('applies filters to fallback search results', async () => {
    const res = await request(app)
      .get('/api/v1/search?q=orders&database=SSISDB&type=package')
      .set(authHeaders());

    expect(res.status).toBe(200);
    expect(res.body.pagination.total).toBe(1);
    expect(res.body.results[0]).toEqual(
      expect.objectContaining({
        id: 'ssis.load_orders',
        database: 'SSISDB',
        type: 'package',
      })
    );
  });

  test('does not return the full catalog for a submitted no-match query', async () => {
    const res = await request(app).get('/api/v1/search?q=no-such-object').set(authHeaders());

    expect(res.status).toBe(200);
    expect(res.body.pagination.total).toBe(0);
    expect(res.body.results).toEqual([]);
  });

  test('browses the in-memory catalog when query is empty', async () => {
    const res = await request(app).get('/api/v1/search?limit=2').set(authHeaders());

    expect(res.status).toBe(200);
    expect(res.body.searchEngine).toBe('memory');
    expect(res.body.pagination.total).toBe(5);
    expect(res.body.results).toHaveLength(2);
  });

  test('returns full catalog facet counts for database browse lists', async () => {
    const res = await request(app).get('/api/v1/search/facets').set(authHeaders());

    expect(res.status).toBe(200);
    expect(res.body.facets.databases).toEqual(['SSISDB', 'Sonic_DW', 'analytics', 'sales']);
    expect(res.body.facets.counts.databases).toEqual({
      Sonic_DW: 1,
      SSISDB: 1,
      analytics: 2,
      sales: 1,
    });
    expect(res.body.facets.counts.total).toBe(5);
  });

  test('canonicalizes dbSonicDW as Sonic_DW for catalog browse filters', async () => {
    const searchRes = await request(app)
      .get('/api/v1/search?database=SONIC_DW&limit=10')
      .set(authHeaders());

    expect(searchRes.status).toBe(200);
    expect(searchRes.body.pagination.total).toBe(1);
    expect(searchRes.body.results[0]).toEqual(
      expect.objectContaining({
        id: '192.224.101.80.dbSonicDW.dbo.dwFullTextConversation',
        raw_database: 'dbSonicDW',
        database: 'Sonic_DW',
      })
    );

    const objectsRes = await request(app)
      .get('/api/v1/objects?database=SONIC_DW&limit=10')
      .set(authHeaders());

    expect(objectsRes.status).toBe(200);
    expect(objectsRes.body.pagination.total).toBe(1);
    expect(objectsRes.body.data[0]).toEqual(
      expect.objectContaining({
        raw_database: 'dbSonicDW',
        database: 'Sonic_DW',
      })
    );
  });

  test('boosts otherwise similar search matches by quality score', async () => {
    const res = await request(app)
      .get('/api/v1/search?q=customer metrics&limit=10')
      .set(authHeaders());

    expect(res.status).toBe(200);
    const ids = res.body.results.map((item) => item.id);
    expect(ids.indexOf('analytics.customer_metrics')).toBeLessThan(
      ids.indexOf('analytics.customer_metrics_shadow')
    );
    expect(res.body.results.find((item) => item.id === 'analytics.customer_metrics')).toMatchObject({
      quality_score: 95,
    });
  });

  test('filters search results by inferred classification facet', async () => {
    const res = await request(app)
      .get('/api/v1/search?classification=PII&limit=10')
      .set(authHeaders());

    expect(res.status).toBe(200);
    expect(res.body.results.map((item) => item.id)).toContain('sales.orders');
    expect(res.body.results.every((item) => item.classifications.includes('PII'))).toBe(true);
  });

  test('refreshes markdown catalog on memory miss for newly extracted JMA claims assets', async () => {
    const previousMarkdownPath = process.env.MARKDOWN_DATA_PATH;
    const previousRefreshOnMiss = process.env.SEARCH_REFRESH_ON_MISS;
    const tempDir = await mkdtemp(join(tmpdir(), 'dg-search-'));
    const tableDir = join(
      tempDir,
      'servers',
      'L1-DWASQL-02,12010',
      'databases',
      'VendorData',
      'tables'
    );

    await mkdir(tableDir, { recursive: true });
    await writeFile(
      join(tableDir, 'JMA__JMA_CLAIMS_FINANCIAL_TRANSACTIONS_TBL.md'),
      `---
id: L1-DWASQL-02,12010.VendorData.JMA.JMA_CLAIMS_FINANCIAL_TRANSACTIONS_TBL
name: JMA_CLAIMS_FINANCIAL_TRANSACTIONS_TBL
server: L1-DWASQL-02,12010
database: VendorData
type: table
schema: JMA
owner: data-team
sensitivity: internal
tags: [jma, claims]
---

JMA claims financial transactions.
`,
      'utf-8'
    );

    process.env.MARKDOWN_DATA_PATH = tempDir;
    process.env.SEARCH_REFRESH_ON_MISS = 'true';

    try {
      const res = await request(app).get('/api/v1/search?q=jma_claim&limit=10').set(authHeaders());

      expect(res.status).toBe(200);
      expect(res.body.searchEngine).toBe('memory_canonical');
      expect(res.body.pagination.total).toBe(1);
      expect(res.body.results[0]).toEqual(
        expect.objectContaining({
          id: 'L1-DWASQL-02,12010.VendorData.JMA.JMA_CLAIMS_FINANCIAL_TRANSACTIONS_TBL',
          name: 'JMA_CLAIMS_FINANCIAL_TRANSACTIONS_TBL',
        })
      );
    } finally {
      if (previousMarkdownPath === undefined) {
        delete process.env.MARKDOWN_DATA_PATH;
      } else {
        process.env.MARKDOWN_DATA_PATH = previousMarkdownPath;
      }
      if (previousRefreshOnMiss === undefined) {
        delete process.env.SEARCH_REFRESH_ON_MISS;
      } else {
        process.env.SEARCH_REFRESH_ON_MISS = previousRefreshOnMiss;
      }
      await rm(tempDir, { recursive: true, force: true });
    }
  });
});
