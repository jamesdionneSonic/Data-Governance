import request from 'supertest';
import createApp, { initializeCache } from '../../src/app.js';
import { generateToken } from '../../src/utils/tokenManager.js';
import { resetQualityRulesStore } from '../../src/services/qualityRulesService.js';

function authHeaders() {
  const token = generateToken({
    id: 'quality-user',
    email: 'quality-user@example.com',
    name: 'Quality User',
    roles: ['Admin'],
    databases: ['hr'],
  });
  return { Authorization: `Bearer ${token}` };
}

function seedApp() {
  const app = createApp();
  initializeCache(
    app,
    new Map([
      [
        'hr.employee',
        {
          id: 'hr.employee',
          name: 'employee',
          database: 'hr',
          type: 'table',
          columns: [{ name: 'employee_email' }, { name: 'employee_key' }],
        },
      ],
    ]),
    new Map()
  );
  return app;
}

describe('Quality API', () => {
  beforeEach(() => {
    resetQualityRulesStore();
  });

  test('creates, lists, runs quality rules, and exposes incidents', async () => {
    const app = seedApp();
    const createRes = await request(app)
      .post('/api/v1/quality/rules')
      .set(authHeaders())
      .send({
        id: 'email-null-check',
        name: 'Email null rate',
        asset_id: 'hr.employee',
        column_name: 'employee_email',
        type: 'null_percent',
        severity: 'fail',
        threshold: { max: 2 },
        alert_routes: ['email:data-quality@example.com'],
      });

    expect(createRes.status).toBe(201);
    expect(createRes.body.rule).toMatchObject({ id: 'email-null-check', version: 1 });

    const listRes = await request(app).get('/api/v1/quality/rules').set(authHeaders());
    expect(listRes.body.rules).toHaveLength(1);

    const runRes = await request(app)
      .post('/api/v1/quality/run')
      .set(authHeaders())
      .send({
        profiles: {
          'hr.employee': {
            columns: {
              employee_email: { row_count: 100, null_count: 3 },
            },
          },
        },
      });

    expect(runRes.status).toBe(200);
    expect(runRes.body.execution).toMatchObject({
      status: 'failed',
      evaluated_results: 1,
      failed: 1,
    });

    const incidentRes = await request(app).get('/api/v1/quality/incidents').set(authHeaders());
    expect(incidentRes.body.incidents).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          rule_id: 'email-null-check',
          severity: 'fail',
          status: 'open',
        }),
      ])
    );
  });

  test('returns profile summaries, anomalies, and scorecards', async () => {
    const app = seedApp();
    const current = {
      asset_id: 'hr.employee',
      row_count: 200,
      columns: {
        employee_email: { row_count: 200, distinct_count: 190, null_percent: 30 },
      },
    };
    const baseline = {
      asset_id: 'hr.employee',
      row_count: 100,
      columns: {
        employee_email: { row_count: 100, distinct_count: 100, null_percent: 2 },
      },
    };

    const summaryRes = await request(app)
      .post('/api/v1/quality/profiles/summary')
      .set(authHeaders())
      .send({ profile: current });
    expect(summaryRes.status).toBe(200);
    expect(summaryRes.body.profile).toMatchObject({
      asset_id: 'hr.employee',
      high_null_columns: ['employee_email'],
    });

    const anomalyRes = await request(app)
      .post('/api/v1/quality/profiles/anomalies')
      .set(authHeaders())
      .send({ current, baseline, sensitivity: 1 });
    expect(anomalyRes.body.anomaly_report.status).toBe('critical');

    const scorecardRes = await request(app)
      .post('/api/v1/quality/scorecard')
      .set(authHeaders())
      .send({ profile: current });
    expect(scorecardRes.body.scorecard.overall_score).toBeLessThan(100);
  });

  test('supports deployments, schedules, exports, trend, and SLA endpoints', async () => {
    const app = seedApp();
    await request(app)
      .post('/api/v1/quality/rules')
      .set(authHeaders())
      .send({
        id: 'employee-key-unique',
        name: 'Employee key uniqueness',
        asset_id: 'hr.employee',
        column_name: 'employee_key',
        type: 'uniqueness',
        threshold: { min_percent: 99 },
      });

    const deployRes = await request(app)
      .post('/api/v1/quality/rules/employee-key-unique/deploy')
      .set(authHeaders());
    expect(deployRes.body.deployment).toMatchObject({ rule_id: 'employee-key-unique' });

    const scheduleRes = await request(app)
      .post('/api/v1/quality/schedules')
      .set(authHeaders())
      .send({ id: 'daily-employee-quality', asset_id: 'hr.employee', cadence: 'daily' });
    expect(scheduleRes.status).toBe(201);

    const exportRes = await request(app)
      .post('/api/v1/quality/profiles/export')
      .set(authHeaders())
      .send({
        format: 'csv',
        profile: {
          asset_id: 'hr.employee',
          row_count: 100,
          columns: { employee_key: { row_count: 100, distinct_count: 100, null_percent: 0 } },
        },
      });
    expect(exportRes.body.export.content_type).toBe('text/csv');

    await request(app)
      .post('/api/v1/quality/scorecard')
      .set(authHeaders())
      .send({
        profile: {
          asset_id: 'hr.employee',
          row_count: 100,
          columns: { employee_key: { row_count: 100, distinct_count: 100, null_percent: 0 } },
        },
      });
    const trendRes = await request(app)
      .get('/api/v1/quality/profiles/hr.employee/trend')
      .set(authHeaders());
    expect(trendRes.body.trend.score_points.length).toBeGreaterThan(0);

    const exportScorecardRes = await request(app)
      .post('/api/v1/quality/scorecard/export')
      .set(authHeaders())
      .send({
        format: 'csv',
        scorecard: {
          asset_id: 'hr.employee',
          overall_score: 96,
          dimensions: { completeness: 100, consistency: 95 },
          fitness: { analytics: 'fit' },
        },
      });
    expect(exportScorecardRes.body.export.content_type).toBe('text/csv');
    expect(exportScorecardRes.body.export.content).toContain('analytics');

    const slaRes = await request(app)
      .post('/api/v1/quality/sla/evaluate')
      .set(authHeaders())
      .send({
        scorecard: { asset_id: 'hr.employee', overall_score: 60, fitness: { analytics: 'review' } },
        sla: { min_score: 90, alert_routes: ['email:dq@example.com'] },
      });
    expect(slaRes.body.sla.status).toBe('breached');
  });
});
