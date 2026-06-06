import {
  buildProfileSummary,
  buildQualityScorecard,
  detectQualityAnomalies,
  deployQualityRule,
  evaluateQualitySla,
  exportProfile,
  exportScorecard,
  getQualityTrend,
  listQualityIncidents,
  listQualityRuleDeployments,
  listQualitySchedules,
  resetQualityRulesStore,
  runQualityRules,
  upsertQualitySchedule,
  upsertQualityRule,
} from '../../src/services/qualityRulesService.js';

describe('qualityRulesService', () => {
  beforeEach(() => {
    resetQualityRulesStore();
  });

  test('creates versioned quality rules and evaluates profile stats', () => {
    const rule = upsertQualityRule({
      id: 'email-null-check',
      name: 'Email null rate',
      asset_id: 'hr.employee',
      column_name: 'employee_email',
      type: 'null_percent',
      severity: 'critical',
      threshold: { max: 5 },
    });

    expect(rule.version).toBe(1);

    const execution = runQualityRules(
      new Map([['hr.employee', { id: 'hr.employee', columns: [{ name: 'employee_email' }] }]]),
      {
        profiles: {
          'hr.employee': {
            columns: {
              employee_email: { row_count: 100, null_count: 8 },
            },
          },
        },
      }
    );

    expect(execution.status).toBe('failed');
    expect(execution.results[0]).toMatchObject({
      rule_id: 'email-null-check',
      passing: false,
      actual: 8,
      expected: '<= 5%',
    });
    expect(listQualityIncidents()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          rule_id: 'email-null-check',
          severity: 'critical',
          status: 'open',
        }),
      ])
    );
  });

  test('supports uniqueness validation without raw values', () => {
    upsertQualityRule({
      id: 'employee-key-unique',
      name: 'Employee key uniqueness',
      asset_id: 'hr.employee',
      column_name: 'employee_key',
      type: 'uniqueness',
      threshold: { min_percent: 99 },
    });

    const execution = runQualityRules(
      new Map([['hr.employee', { id: 'hr.employee', columns: [{ name: 'employee_key' }] }]]),
      {
        profiles: {
          'hr.employee': {
            columns: {
              employee_key: { row_count: 100, distinct_count: 100 },
            },
          },
        },
      }
    );

    expect(execution.status).toBe('passed');
    expect(execution.results[0]).toMatchObject({ passing: true, actual: 100 });
  });

  test('builds profile summaries and detects drift anomalies', () => {
    const current = {
      asset_id: 'sales.orders',
      row_count: 2000,
      columns: {
        order_id: { row_count: 2000, distinct_count: 2000, null_percent: 0 },
        dealer_code: { row_count: 2000, distinct_count: 10, null_percent: 0 },
        closed_date: { row_count: 2000, distinct_count: 100, null_percent: 35 },
      },
    };
    const baseline = {
      asset_id: 'sales.orders',
      row_count: 1000,
      columns: {
        order_id: { row_count: 1000, distinct_count: 1000, null_percent: 0 },
        dealer_code: { row_count: 1000, distinct_count: 10, null_percent: 0 },
        closed_date: { row_count: 1000, distinct_count: 100, null_percent: 5 },
      },
    };

    expect(buildProfileSummary(current)).toMatchObject({
      row_count: 2000,
      profiled_columns: 3,
      high_null_columns: ['closed_date'],
    });

    const report = detectQualityAnomalies(current, baseline, { sensitivity: 1 });
    expect(report.status).toBe('critical');
    expect(report.findings.map((finding) => finding.type)).toEqual(
      expect.arrayContaining(['row_count_drift', 'null_rate_drift', 'new_high_null_column'])
    );
  });

  test('builds quality scorecards from profile and validation results', () => {
    const scorecard = buildQualityScorecard(
      {
        asset_id: 'sales.orders',
        row_count: 2000,
        columns: {
          order_id: { row_count: 2000, distinct_count: 2000, null_percent: 0 },
          closed_date: { row_count: 2000, distinct_count: 100, null_percent: 20 },
        },
      },
      { failed: 1 }
    );

    expect(scorecard.overall_score).toBeLessThan(100);
    expect(scorecard.fitness.analytics).toBeDefined();
  });

  test('supports deployment evidence, schedules, exports, trends, and SLA breaches', () => {
    upsertQualityRule({
      id: 'orders-null-check',
      name: 'Orders null check',
      asset_id: 'sales.orders',
      column_name: 'order_id',
      type: 'null_percent',
      threshold: { max: 0 },
    });

    const deployment = deployQualityRule('orders-null-check', { email: 'qa@example.com' });
    expect(deployment).toMatchObject({ rule_id: 'orders-null-check', rule_version: 1 });
    expect(listQualityRuleDeployments()).toHaveLength(1);

    upsertQualitySchedule({
      id: 'daily-orders',
      asset_id: 'sales.orders',
      cadence: 'daily',
      rule_ids: ['orders-null-check'],
    });
    expect(listQualitySchedules()[0]).toMatchObject({ id: 'daily-orders', cadence: 'daily' });

    const profile = {
      asset_id: 'sales.orders',
      row_count: 500,
      columns: { order_id: { row_count: 500, distinct_count: 500, null_percent: 0 } },
    };
    const exported = exportProfile(profile, 'csv');
    expect(exported.content_type).toBe('text/csv');
    expect(exported.content).toContain('order_id');

    const scorecard = buildQualityScorecard(profile, null);
    expect(getQualityTrend('sales.orders').score_points.length).toBeGreaterThan(0);
    const scorecardExport = exportScorecard(scorecard, 'csv');
    expect(scorecardExport.content_type).toBe('text/csv');
    expect(scorecardExport.content).toContain('overall_score');

    const sla = evaluateQualitySla({ ...scorecard, overall_score: 70 }, { min_score: 90 });
    expect(sla.status).toBe('breached');
    expect(listQualityIncidents({ status: 'open' })).toEqual(
      expect.arrayContaining([expect.objectContaining({ rule_id: 'quality-sla' })])
    );
  });
});
