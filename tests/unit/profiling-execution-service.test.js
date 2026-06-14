import {
  applyProfileToAsset,
  buildComputerFriendlyProfilePackage,
  buildConfluenceProfileSummary,
  buildProfilingContract,
  buildProfilingPlan,
  executeProfilingPlan,
  profileFromAggregateRow,
  runProfiling,
} from '../../src/services/profilingExecutionService.js';
import {
  firstExecutableSqlStatement,
  redshiftResultRow,
} from '../../src/services/connectorRuntime/profileExecutors.js';

const invoiceAsset = {
  id: 'finance.dbo.Invoice',
  database: 'finance',
  schema: 'dbo',
  name: 'Invoice',
  type: 'table',
  row_count: 1000,
  columns: [
    { name: 'invoice_id', data_type: 'int' },
    { name: 'customer_email', data_type: 'nvarchar', classification: 'PII' },
    { name: 'total_amount', data_type: 'decimal' },
  ],
};

describe('profiling execution service', () => {
  test('builds safe SQL Server aggregate plans without raw value retention', () => {
    const plan = buildProfilingPlan({
      assets: [invoiceAsset],
      profile_mode: 'sample',
      execution_mode: 'dry_run',
      sample_percent: 2,
      query_timeout_ms: 30000,
    });

    expect(plan.status).toBe('ready');
    expect(plan.summary.raw_values_retained).toBe(false);
    expect(plan.actions).toHaveLength(1);
    expect(plan.actions[0].query.sql).toContain('SET LOCK_TIMEOUT 5000');
    expect(plan.actions[0].query.sql).toContain('SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED');
    expect(plan.actions[0].query.sql).toContain('COUNT_BIG(*) AS [row_count]');
    expect(plan.actions[0].query.sql).toContain('[finance].[dbo].[Invoice]');
    expect(plan.actions[0].query.sql).toContain('TABLESAMPLE (2 PERCENT)');
    expect(plan.actions[0].query.sql).not.toContain('[customer_email__distinct_count]');
    expect(plan.actions[0].warnings.join(' ')).toContain('Sensitive columns');
  });

  test('blocks full scans unless explicitly allowed', () => {
    const plan = buildProfilingPlan({
      assets: [invoiceAsset],
      profile_mode: 'full_scan',
      execution_mode: 'dry_run',
    });

    expect(plan.status).toBe('blocked');
    expect(plan.actions).toHaveLength(0);
    expect(plan.skipped[0].reason).toContain('Full-scan profiling is blocked');
  });

  test('uses unique aggregate aliases when column names normalize to the same SQL alias', () => {
    const plan = buildProfilingPlan({
      assets: [
        {
          id: 'VendorData.sonicdw.alias_collision',
          database: 'VendorData',
          schema: 'sonicdw',
          name: 'alias_collision',
          type: 'table',
          columns: [
            { name: 'Dealer ID', data_type: 'int' },
            { name: 'Dealer-ID', data_type: 'int' },
          ],
        },
      ],
      profile_mode: 'sample',
      execution_mode: 'dry_run',
    });

    const action = plan.actions[0];
    expect(action.columns.map((column) => column.profile_alias)).toEqual(['dealer_id', 'dealer_id_2']);
    expect(action.query.sql).toContain('[dealer_id__null_count]');
    expect(action.query.sql).toContain('[dealer_id_2__null_count]');

    const profile = profileFromAggregateRow(action, {
      row_count: 10,
      dealer_id__null_count: 1,
      dealer_id_2__null_count: 2,
    });
    expect(profile.columns['Dealer ID'].null_count).toBe(1);
    expect(profile.columns['Dealer-ID'].null_count).toBe(2);
  });

  test.each([
    ['postgresql', '"dbo"."Invoice"', 'SET lock_timeout = 5000;', 'TABLESAMPLE SYSTEM (2)'],
    ['snowflake', '"finance"."dbo"."Invoice"', 'STATEMENT_TIMEOUT_IN_SECONDS', 'SAMPLE (2)'],
    ['bigquery', '`finance.dbo.Invoice`', 'APPROX_COUNT_DISTINCT', 'TABLESAMPLE SYSTEM (2 PERCENT)'],
    ['databricks', '`finance`.`dbo`.`Invoice`', 'approx_count_distinct', 'TABLESAMPLE (2 PERCENT)'],
    ['redshift', '"dbo"."Invoice"', 'SET statement_timeout TO 30000;', 'APPROXIMATE COUNT(DISTINCT'],
  ])('builds aggregate profile SQL for %s', (dialect, objectSql, expectedSafety, expectedSql) => {
    const plan = buildProfilingPlan({
      assets: [invoiceAsset],
      dialect,
      profile_mode: 'sample',
      execution_mode: 'dry_run',
      sample_percent: 2,
      query_timeout_ms: 30000,
    });

    expect(plan.status).toBe('ready');
    expect(plan.safety.dialect).toBe(dialect);
    expect(plan.actions[0].query.dialect).toBe(dialect);
    expect(plan.actions[0].query.sql).toContain(objectSql);
    expect(plan.actions[0].query.sql).toContain(expectedSafety);
    expect(plan.actions[0].query.sql).toContain(expectedSql);
    expect(plan.actions[0].query.read_only).toBe(true);
  });

  test('maps connector types to database dialects', () => {
    const plan = buildProfilingPlan({
      assets: [invoiceAsset],
      connector_type: 'aws_redshift',
      profile_mode: 'metadata_only',
    });

    expect(plan.safety.dialect).toBe('redshift');
    expect(plan.actions[0].query.dialect).toBe('redshift');
  });

  test('maps Redshift Data API JSON result rows to aggregate aliases', () => {
    const row = redshiftResultRow({
      ColumnMetadata: [
        { name: 'row_count' },
        { name: 'total_amount__null_count' },
        { name: 'total_amount__distinct_count' },
        { name: 'total_amount__mean' },
      ],
      Records: [
        [
          { longValue: 200 },
          { longValue: 4 },
          { longValue: 120 },
          { doubleValue: 25.5 },
        ],
      ],
    });

    expect(row).toEqual({
      row_count: 200,
      total_amount__null_count: 4,
      total_amount__distinct_count: 120,
      total_amount__mean: 25.5,
    });
    expect(firstExecutableSqlStatement('SET statement_timeout TO 30000; SELECT COUNT(*) AS row_count FROM t;')).toBe(
      'SELECT COUNT(*) AS row_count FROM t'
    );
  });

  test('dry run plans but does not execute profiles', async () => {
    const plan = buildProfilingPlan({ assets: [invoiceAsset], execution_mode: 'dry_run' });
    const run = await executeProfilingPlan(plan);

    expect(run.status).toBe('planned');
    expect(run.summary.assets_profiled).toBe(0);
    expect(run.summary.raw_values_retained).toBe(false);
  });

  test('simulate mode creates aggregate profiles and export packages only', async () => {
    const result = await runProfiling({
      assets: [invoiceAsset],
      profile_mode: 'sample',
      execution_mode: 'simulate',
    });

    expect(result.run.status).toBe('succeeded');
    expect(result.run.profiles['finance.dbo.Invoice'].raw_values_retained).toBe(false);
    expect(result.run.profiles['finance.dbo.Invoice'].columns.total_amount).toEqual(
      expect.objectContaining({
        null_count: expect.any(Number),
        distinct_count: expect.any(Number),
        raw_values_retained: false,
      })
    );
    expect(result.package.raw_values_retained).toBe(false);
    expect(result.confluence.content).toContain('Raw values retained: no');
  });

  test('live execution reports clear errors when no executor is attached', async () => {
    const result = await runProfiling({
      assets: [invoiceAsset],
      profile_mode: 'sample',
      execution_mode: 'live',
    });

    expect(result.run.status).toBe('failed');
    expect(result.run.errors[0].message).toContain('Live profiling requires an executor');
  });

  test('merges aggregate profile stats into asset metadata', () => {
    const updated = applyProfileToAsset(invoiceAsset, {
      asset_id: invoiceAsset.id,
      row_count: 1100,
      generated_at: '2026-06-06T00:00:00.000Z',
      profile_mode: 'sample',
      columns: {
        total_amount: {
          row_count: 1100,
          null_count: 5,
          null_percent: 0.45,
          distinct_count: 900,
          min: 0,
          max: 10000,
          mean: 120.5,
        },
      },
    });

    expect(updated.row_count).toBe(1100);
    expect(updated.profile_summary.raw_values_retained).toBe(false);
    expect(updated.columns.find((column) => column.name === 'total_amount')).toEqual(
      expect.objectContaining({
        null_count: 5,
        null_percent: 0.45,
        distinct_count: 900,
        raw_values_retained: false,
      })
    );
  });

  test('contract and summaries document machine and human outputs', () => {
    const contract = buildProfilingContract();
    expect(contract.output_targets).toEqual(expect.arrayContaining(['runtime_json', 'confluence_summary']));

    const emptyRun = {
      run_id: 'run-1',
      status: 'planned',
      safety: contract.safety_defaults,
      summary: { assets_profiled: 0, columns_profiled: 0 },
      profiles: {},
    };
    expect(buildComputerFriendlyProfilePackage(emptyRun).manifest.output_files_recommended).toContain(
      'profiles/<asset-id>.profile.json'
    );
    expect(buildConfluenceProfileSummary(emptyRun).content).toContain('Safety Controls');
  });
});
