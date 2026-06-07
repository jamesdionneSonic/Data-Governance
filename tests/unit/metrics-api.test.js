import request from 'supertest';
import createApp, { initializeCache } from '../../src/app.js';
import { generateToken } from '../../src/utils/tokenManager.js';

function authHeaders() {
  const token = generateToken({
    id: 'metric-user',
    email: 'metric-user@example.com',
    name: 'Metric User',
    roles: ['Admin'],
  });
  return { Authorization: `Bearer ${token}` };
}

function seedApp() {
  const app = createApp();
  initializeCache(
    app,
    new Map([
      [
        'finance.invoice',
        {
          id: 'finance.invoice',
          name: 'invoice',
          database: 'finance',
          schema: 'dbo',
          type: 'table',
          columns: [
            { name: 'invoice_id', data_type: 'int', primary_key: true },
            { name: 'total_amount', data_type: 'decimal', semantic_type: 'metric' },
            {
              name: 'tax_rate',
              data_type: 'decimal',
              row_count: 500,
              null_percent: 0,
              distinct_count: 8,
              min: 0,
              max: 12,
              profiled_at: '2026-01-01T00:00:00.000Z',
            },
          ],
        },
      ],
      [
        'report.invoice_summary',
        {
          id: 'report.invoice_summary',
          name: 'invoice_summary',
          type: 'view',
          column_usage: [
            {
              column_id: 'finance.invoice.total_amount',
              column_name: 'total_amount',
              usage_type: 'calculation',
              evidence_text: 'SUM(total_amount)',
            },
          ],
        },
      ],
    ]),
    new Map([['report.invoice_summary', new Set(['finance.invoice'])]])
  );
  return app;
}

describe('Metric Intelligence API', () => {
  test('returns metric registry and table answers', async () => {
    const app = seedApp();
    const registryRes = await request(app).get('/api/v1/metrics/registry').set(authHeaders());

    expect(registryRes.status).toBe(200);
    expect(registryRes.body.data.summary.total_metrics).toBe(2);
    expect(registryRes.body.data.metrics.map((metric) => metric.column_name)).toEqual(
      expect.arrayContaining(['total_amount', 'tax_rate'])
    );

    const tableRes = await request(app)
      .get('/api/v1/metrics/tables/finance.invoice')
      .set(authHeaders());

    expect(tableRes.status).toBe(200);
    expect(tableRes.body.data.answer).toContain('metric-like columns');
    expect(tableRes.body.data.rows[0]).toEqual(
      expect.objectContaining({
        column: expect.any(String),
        confidence: expect.any(Number),
      })
    );
  });

  test('returns metric logic, formula impact, and compact runtime pack', async () => {
    const app = seedApp();
    const logicRes = await request(app)
      .post('/api/v1/metrics/logic')
      .set(authHeaders())
      .send({ object_id: 'finance.invoice', column_name: 'total_amount' });

    expect(logicRes.status).toBe(200);
    expect(logicRes.body.data.metric.column_name).toBe('total_amount');
    expect(logicRes.body.data.logic.downstream_consumers).toEqual(
      expect.arrayContaining([expect.objectContaining({ object_id: 'report.invoice_summary' })])
    );

    const impactRes = await request(app)
      .post('/api/v1/metrics/formula-impact')
      .set(authHeaders())
      .send({ object_id: 'finance.invoice', column_name: 'total_amount' });

    expect(impactRes.status).toBe(200);
    expect(impactRes.body.data.risk.recommended_actions).toContain(
      'Review downstream reports and procedures that consume this metric.'
    );

    const runtimeRes = await request(app)
      .get('/api/v1/metrics/runtime-pack')
      .set(authHeaders());

    expect(runtimeRes.status).toBe(200);
    expect(runtimeRes.body.data.answer_cards[0]).toEqual(
      expect.objectContaining({
        metric_id: expect.any(String),
        answer: expect.stringContaining('metric'),
        profile: expect.any(Object),
        formula_impact: expect.any(Object),
      })
    );
  });

  test('returns metadata-only metric profile answers', async () => {
    const app = seedApp();
    const res = await request(app)
      .post('/api/v1/metrics/profile')
      .set(authHeaders())
      .send({
        object_id: 'finance.invoice',
        column_name: 'tax_rate',
        freshness_days: 1,
      });

    expect(res.status).toBe(200);
    expect(res.body.data.profile.raw_values_retained).toBe(false);
    expect(res.body.data.profile.latest).toMatchObject({
      row_count: 500,
      null_percent: 0,
      distinct_count: 8,
      min: 0,
      max: 12,
    });
    expect(res.body.data.caveats.join(' ')).toContain('freshness window');
  });
});
