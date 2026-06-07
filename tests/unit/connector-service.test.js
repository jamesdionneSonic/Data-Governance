import {
  canUseConnector,
  deleteConnectorProfileSchedule,
  getConnectorProfileSchedule,
  getConnectorSnapshot,
  getConnectorAdapterCoverage,
  grantConnectorPermission,
  listConnectorDefinitions,
  listConnectorProfileSchedules,
  listConnectors,
  planConnector,
  planConnectorBiProfiling,
  planConnectorMetadataProfiling,
  planConnectorProfiling,
  resetConnectorStore,
  runConnectorExtractionForConfig,
  runConnector,
  runConnectorBiProfiling,
  runConnectorMetadataProfiling,
  runConnectorProfiling,
  runConnectorProfileSchedule,
  runDueConnectorProfileSchedules,
  upsertConnectorProfileSchedule,
  upsertConnector,
} from '../../src/services/connectorService.js';
import { jest } from '@jest/globals';

const admin = { id: 'admin-1', email: 'admin@example.com', roles: ['Admin'] };
const analyst = { id: 'analyst-1', email: 'analyst@example.com', roles: ['Analyst'] };
const viewer = { id: 'viewer-1', email: 'viewer@example.com', roles: ['Viewer'] };

describe('connectorService', () => {
  beforeEach(() => {
    resetConnectorStore();
  });

  test('lists industry connector definitions across Azure, AWS, GCP, BI, APIs, and repos', () => {
    const definitions = listConnectorDefinitions();
    const types = definitions.map((definition) => definition.type);

    expect(types).toEqual(
      expect.arrayContaining([
        'azure_storage',
        'azure_data_factory',
        'aws_glue',
        'aws_s3',
        'gcp_dataplex',
        'bigquery',
        'git_repository',
        'openapi',
        'power_bi',
        'ssis',
        'microstrategy_cloud',
        'ssas_on_prem',
        'qlik_cloud',
        'domo',
        'sigma',
        'quicksight',
      ])
    );
  });

  test('lists mainstream reporting and semantic-layer connector definitions', () => {
    const dashboardTypes = listConnectorDefinitions({ category: 'business_intelligence' }).map(
      (definition) => definition.type
    );

    expect(dashboardTypes).toEqual(
      expect.arrayContaining([
        'microstrategy_cloud',
        'ssas_on_prem',
        'power_bi',
        'power_bi_report_server',
        'ssrs',
        'tableau',
        'looker',
        'qlik_cloud',
        'qlik_sense',
        'domo',
        'sigma',
        'mode',
        'metabase',
        'superset',
        'redash',
        'quicksight',
        'grafana',
        'cognos',
        'sap_businessobjects',
        'oracle_analytics',
        'thoughtspot',
        'sisense',
      ])
    );
  });

  test('masks credentials and lets granted users run managed connectors through the extraction kernel', async () => {
    const connector = upsertConnector(
      {
        id: 'sonic-dw-sql',
        type: 'sql_server',
        label: 'Sonic DW',
        config: { server: 'L1-5FSQL-01', database: 'Sonic_DW' },
        credential: {
          mode: 'service_account',
          username: 'svc_lineage',
          password: 'super-secret',
          secret_ref: 'kv://metadata/sonic-dw-sql',
        },
      },
      admin
    );

    expect(connector.credential.fields).toContain('password');
    expect(JSON.stringify(connector)).not.toContain('super-secret');

    grantConnectorPermission(
      'sonic-dw-sql',
      { scope: 'roles', subject: 'Analyst', actions: ['view', 'run'] },
      admin
    );

    const visible = listConnectors({}, analyst);
    expect(visible).toHaveLength(1);
    expect(canUseConnector(visible[0], analyst, 'run')).toBe(true);

    const plan = await planConnector('sonic-dw-sql', { streams: ['tables', 'columns'] }, analyst);
    expect(plan.streams.map((item) => item.stream)).toEqual(['tables', 'columns']);

    const run = await runConnector('sonic-dw-sql', { dry_run: true, streams: ['tables'] }, analyst);
    expect(run.summary).toMatchObject({
      secret_exposed: false,
      raw_data_captured: false,
    });
    expect(run.extraction.events).toEqual(
      expect.arrayContaining([expect.objectContaining({ type: 'metadata.object', stream: 'tables' })])
    );
  });

  test('denies ungranted users and discovers python scripts in repo connector snapshots', async () => {
    upsertConnector(
      {
        id: 'etl-repo',
        type: 'git_repository',
        label: 'ETL Repo',
        config: {
          repo_url: 'https://dev.azure.com/sonic/etl',
          files: ['pipelines/load_dim_vehicle.py', 'models/schema.sql', 'notebooks/audit.ipynb'],
        },
        credential: { mode: 'pat_reference', secret_ref: 'kv://metadata/etl-repo-pat' },
      },
      admin
    );

    await expect(runConnector('etl-repo', {}, viewer)).rejects.toThrow(/not allowed/i);

    grantConnectorPermission(
      'etl-repo',
      { scope: 'users', subject: 'analyst-1', actions: ['view', 'run'] },
      admin
    );

    await runConnector('etl-repo', { dry_run: true }, analyst);
    const snapshot = getConnectorSnapshot('etl-repo', analyst);

    expect(snapshot.python_scripts).toEqual([
      expect.objectContaining({
        path: 'pipelines/load_dim_vehicle.py',
        object_type: 'python_script',
      }),
    ]);
  });

  test('reports adapter coverage and returns actionable configuration errors', async () => {
    const coverage = getConnectorAdapterCoverage();
    expect(coverage.definitions.every((item) => item.plumbed)).toBe(true);
    expect(coverage.definitions.every((item) => item.bridge_plumbed)).toBe(true);
    expect(coverage.definitions.filter((item) => item.direct_source_client)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: 'power_bi' }),
        expect.objectContaining({ type: 'tableau' }),
        expect.objectContaining({ type: 'metabase' }),
        expect.objectContaining({ type: 'git_repository' }),
        expect.objectContaining({ type: 'openapi' }),
        expect.objectContaining({ type: 'azure_data_factory' }),
      ])
    );

    upsertConnector(
      {
        id: 'bad-powerbi',
        type: 'power_bi',
        label: 'Bad Power BI',
        config: {},
        credential: { mode: 'service_principal', secret_ref: 'kv://powerbi' },
      },
      admin
    );

    await expect(runConnector('bad-powerbi', { dry_run: true }, admin)).resolves.toMatchObject({
      status: 'failed',
      errors: [
        expect.objectContaining({
          code: 'CONNECTOR_CONFIG_ERROR',
          phase: 'configuration',
          remediation: expect.stringContaining('Review connector configuration'),
        }),
      ],
    });
  });

  test('every connector bridge can produce at least one canonical dry-run event', async () => {
    const definitions = listConnectorDefinitions();

    for (const definition of definitions) {
      const plan = await runConnectorExtractionForConfig({
        id: `dry-run-${definition.type}`,
        type: definition.type,
        config: minimalConnectorConfig(definition.type),
        credential: minimalCredential(definition.credentialKinds),
        options: { dry_run: true, streams: [firstStreamForType(definition.type)] },
      });

      expect(plan.status).toBe('succeeded');
      expect(plan.summary.event_count).toBeGreaterThan(0);
      expect(plan.events[0]).toEqual(
        expect.objectContaining({
          connector_type: definition.type,
          evidence: expect.objectContaining({
            bridge_kind: expect.any(String),
          }),
        })
      );
    }
  });

  test('documented bridge returns actionable live-harvest remediation when source connectivity fails', async () => {
    const extraction = await runConnectorExtractionForConfig({
      id: 'postgres-live-missing-driver',
      type: 'postgresql',
      config: { host: 'postgres.example.com', database: 'dw' },
      credential: { mode: 'service_account', secret_ref: 'kv://postgres' },
      options: { dry_run: false, streams: ['tables'], fail_fast: false },
    });

    expect(extraction.status).toBe('partial_failure');
    expect(extraction.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'ENOTFOUND',
          message: expect.stringContaining('postgres.example.com'),
          remediation: expect.stringContaining('Review connector logs'),
        }),
      ])
    );
  });

  test('plans and runs connector-backed profiling without exposing raw data', async () => {
    upsertConnector(
      {
        id: 'profile-sql',
        type: 'sql_server',
        label: 'Profile SQL',
        config: { server: 'sql.example.com', database: 'finance' },
        credential: { mode: 'service_account', username: 'svc', password: 'profile-password', secret_ref: 'kv://sql' },
      },
      admin
    );
    grantConnectorPermission(
      'profile-sql',
      { scope: 'roles', subject: 'Analyst', actions: ['view', 'run'] },
      admin
    );
    const assets = [
      {
        id: 'finance.dbo.Invoice',
        database: 'finance',
        schema: 'dbo',
        name: 'Invoice',
        type: 'table',
        columns: [
          { name: 'invoice_id', data_type: 'int' },
          { name: 'total_amount', data_type: 'decimal' },
        ],
      },
    ];

    const plan = await planConnectorProfiling('profile-sql', { assets, profile_mode: 'sample' }, analyst);
    expect(plan.plan.actions[0].query.sql).toContain('COUNT_BIG(*)');

    const run = await runConnectorProfiling(
      'profile-sql',
      {
        assets,
        execution_mode: 'live',
        profile_mode: 'sample',
        mockProfileRows: {
          row_count: 100,
          invoice_id__null_count: 0,
          invoice_id__distinct_count: 100,
          total_amount__null_count: 2,
          total_amount__distinct_count: 90,
          total_amount__min: 1,
          total_amount__max: 500,
          total_amount__mean: 42.5,
        },
      },
      admin
    );

    expect(run.status).toBe('succeeded');
    expect(run.summary).toMatchObject({
      profile_run: true,
      raw_data_captured: false,
      secret_exposed: false,
    });
    expect(run.profile.run.profiles['finance.dbo.Invoice'].columns.total_amount).toEqual(
      expect.objectContaining({
        null_count: 2,
        null_percent: 2,
        distinct_count: 90,
        min: 1,
        max: 500,
        mean: 42.5,
        raw_values_retained: false,
      })
    );
    const runJson = JSON.stringify(run);
    expect(runJson).not.toContain('profile-password');
    expect(runJson).not.toContain('kv://sql');
  });

  test('connector-backed live profiling requires admin and reports Redshift Data API configuration remediation', async () => {
    upsertConnector(
      {
        id: 'profile-redshift',
        type: 'aws_redshift',
        label: 'Profile Redshift',
        config: { region: 'us-east-1' },
        credential: { mode: 'service_account', secret_ref: 'kv://redshift' },
      },
      admin
    );
    grantConnectorPermission(
      'profile-redshift',
      { scope: 'roles', subject: 'Analyst', actions: ['view', 'run'] },
      admin
    );
    const assets = [
      {
        id: 'finance.public.Invoice',
        database: 'finance',
        schema: 'public',
        name: 'Invoice',
        type: 'table',
        columns: [{ name: 'total_amount', data_type: 'numeric' }],
      },
    ];

    await expect(
      runConnectorProfiling('profile-redshift', { assets, execution_mode: 'live' }, analyst)
    ).rejects.toThrow(/admin/i);

    const run = await runConnectorProfiling('profile-redshift', { assets, execution_mode: 'live' }, admin);
    expect(run.status).toBe('failed');
    expect(run.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'CONNECTOR_RUNTIME_ERROR',
          remediation: expect.stringContaining('cluster_identifier/workgroup_name'),
        }),
      ])
    );
  });

  test('plans and runs metadata-only BI profile for Power BI reporting artifacts', async () => {
    upsertConnector(
      {
        id: 'powerbi-profile',
        type: 'power_bi',
        label: 'Power BI Tenant',
        config: { tenant_id: 'tenant-1' },
        credential: {
          mode: 'service_principal',
          secret_ref: 'kv://powerbi/sp',
          client_secret: 'do-not-return',
        },
      },
      admin
    );
    grantConnectorPermission(
      'powerbi-profile',
      { scope: 'roles', subject: 'Analyst', actions: ['view', 'run'] },
      admin
    );

    const plan = await planConnectorBiProfiling('powerbi-profile', { streams: ['reports', 'datasets'] }, analyst);
    expect(plan).toMatchObject({
      profile_type: 'bi_report_profile',
      captures_raw_report_data: false,
      secret_exposed: false,
    });
    expect(plan.streams.map((stream) => stream.stream)).toEqual(['reports', 'datasets']);

    const run = await runConnectorBiProfiling(
      'powerbi-profile',
      {
        dry_run: false,
        include_events: false,
        streams: ['reports', 'dashboards', 'datasets', 'scanner_metadata', 'datasources', 'activity_events', 'lineage'],
        metadata_payload: {
          reports: [{ id: 'report-1', name: 'Sales Executive Report', datasetId: 'dataset-1', owner: 'finance' }],
          dashboards: [{ id: 'dash-1', name: 'Sales Executive Dashboard' }],
          datasets: [{ id: 'dataset-1', name: 'Sales Model', workspaceId: 'workspace-1' }],
          scanner_metadata: [{ id: 'model-1', name: 'Sales Semantic Model', object_type: 'semantic_model' }],
          datasources: [{ id: 'source-1', name: 'Sonic_DW', type: 'sql_server' }],
          activity_events: [{ id: 'usage-1', name: 'ViewReport', reportId: 'report-1' }],
          lineage: [{ id: 'edge-1', from: 'dataset-1', to: 'report-1', type: 'feeds' }],
        },
      },
      analyst
    );

    expect(run.status).toBe('succeeded');
    expect(run.summary).toMatchObject({
      bi_profile_run: true,
      raw_data_captured: false,
      raw_report_data_captured: false,
      report_count: 1,
      dashboard_count: 1,
      semantic_model_count: 1,
      dataset_count: 1,
      data_source_count: 1,
      lineage_edge_count: 1,
    });
    expect(run.profile.answer.answer).toContain('metadata-only');
    expect(run.profile.profile.coverage_score).toBeGreaterThanOrEqual(50);
    const runJson = JSON.stringify(run);
    expect(runJson).not.toContain('do-not-return');
    expect(runJson).not.toContain('kv://powerbi/sp');
  });

  test('every reporting connector can produce a metadata-only BI profile through the shared framework', async () => {
    const reportingDefinitions = listConnectorDefinitions({ category: 'business_intelligence' });

    for (const definition of reportingDefinitions) {
      upsertConnector(
        {
          id: `bi-profile-${definition.type}`,
          type: definition.type,
          label: `${definition.label} BI Profile`,
          config: minimalConnectorConfig(definition.type),
          credential: minimalCredential(definition.credentialKinds),
        },
        admin
      );
    }
    const runs = await Promise.all(
      reportingDefinitions.map((definition) =>
        runConnectorBiProfiling(`bi-profile-${definition.type}`, { dry_run: true }, admin)
      )
    );

    for (const run of runs) {
      expect(run.status).toBe('succeeded');
      expect(run.summary).toEqual(
        expect.objectContaining({
          bi_profile_run: true,
          raw_data_captured: false,
          raw_report_data_captured: false,
        })
      );
      expect(run.profile.profile.inventory.length).toBeGreaterThan(0);
    }
  });

  test('BI profile reports structured connector errors and coverage gaps', async () => {
    upsertConnector(
      {
        id: 'bad-tableau-profile',
        type: 'tableau',
        label: 'Bad Tableau',
        config: { base_url: 'https://tableau.example.com' },
        credential: { mode: 'pat', secret_ref: 'kv://tableau' },
      },
      admin
    );

    const run = await runConnectorBiProfiling('bad-tableau-profile', { dry_run: true }, admin);
    expect(run.status).toBe('failed');
    expect(run.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'CONNECTOR_CONFIG_ERROR',
          remediation: expect.any(String),
        }),
      ])
    );
    expect(run.profile.answer).toMatchObject({
      raw_values_retained: false,
      report_result_rows_queried: false,
    });
  });

  test('runs Salesforce metadata profile for CRM objects plus reports and dashboards', async () => {
    upsertConnector(
      {
        id: 'salesforce-profile',
        type: 'salesforce',
        label: 'Salesforce Org',
        config: { base_url: 'https://sonic.my.salesforce.com' },
        credential: {
          mode: 'connected_app',
          secret_ref: 'kv://salesforce/app',
          client_secret: 'do-not-return',
        },
      },
      admin
    );
    grantConnectorPermission(
      'salesforce-profile',
      { scope: 'roles', subject: 'Analyst', actions: ['view', 'run'] },
      admin
    );

    const plan = await planConnectorMetadataProfiling('salesforce-profile', { streams: ['objects', 'reports'] }, analyst);
    expect(plan).toMatchObject({
      profile_type: 'connector_metadata_profile',
      connector_type: 'salesforce',
      captures_raw_data: false,
    });

    const run = await runConnectorMetadataProfiling(
      'salesforce-profile',
      {
        dry_run: false,
        include_events: false,
        streams: ['objects', 'reports', 'dashboards', 'lineage'],
        metadata_payload: {
          objects: [{ id: 'Account', name: 'Account', object_type: 'sobject' }],
          reports: [{ id: 'report-1', name: 'Pipeline Report' }],
          dashboards: [{ id: 'dash-1', name: 'Sales Dashboard' }],
          lineage: [{ id: 'edge-1', from: 'Account', to: 'report-1', type: 'feeds' }],
        },
      },
      analyst
    );

    expect(run.status).toBe('succeeded');
    expect(run.summary).toEqual(
      expect.objectContaining({
        metadata_profile_run: true,
        asset_count: 1,
        report_count: 1,
        dashboard_count: 1,
        lineage_edge_count: 1,
        raw_data_captured: false,
        raw_payload_values_captured: false,
      })
    );
    const runJson = JSON.stringify(run);
    expect(runJson).not.toContain('do-not-return');
    expect(runJson).not.toContain('kv://salesforce/app');
  });

  test('metadata profile covers cloud storage, catalog platforms, pipelines, orchestration, dbt, and code repositories', async () => {
    const profileTypes = [
      'azure_storage',
      'aws_s3',
      'gcs',
      'azure_purview',
      'aws_glue',
      'gcp_dataplex',
      'azure_data_factory',
      'ssis',
      'airflow',
      'dbt',
      'git_repository',
    ];

    for (const type of profileTypes) {
      const definition = listConnectorDefinitions().find((item) => item.type === type);
      upsertConnector(
        {
          id: `metadata-profile-${type}`,
          type,
          label: `${definition.label} Metadata Profile`,
          config: minimalConnectorConfig(type),
          credential: minimalCredential(definition.credentialKinds),
        },
        admin
      );
    }

    const runs = await Promise.all(
      profileTypes.map((type) =>
        runConnectorMetadataProfiling(`metadata-profile-${type}`, { dry_run: true }, admin)
      )
    );

    for (const run of runs) {
      expect(run.status).toBe('succeeded');
      expect(run.summary).toEqual(
        expect.objectContaining({
          metadata_profile_run: true,
          raw_data_captured: false,
          raw_payload_values_captured: false,
        })
      );
      expect(run.profile.profile.inventory.length).toBeGreaterThan(0);
      expect(run.profile.answer.answer).toContain('metadata-only');
    }
  });

  test('metadata profile covers API, Kafka, and SAP connectors', async () => {
    for (const type of ['openapi', 'kafka', 'sap']) {
      const definition = listConnectorDefinitions().find((item) => item.type === type);
      upsertConnector(
        {
          id: `metadata-profile-${type}`,
          type,
          label: definition.label,
          config: minimalConnectorConfig(type),
          credential: minimalCredential(definition.credentialKinds),
        },
        admin
      );
    }

    const runs = await Promise.all(
      ['openapi', 'kafka', 'sap'].map((type) =>
        runConnectorMetadataProfiling(`metadata-profile-${type}`, { dry_run: true }, admin)
      )
    );

    for (const run of runs) {
      expect(run.status).toBe('succeeded');
      expect(run.summary).toEqual(
        expect.objectContaining({
          metadata_profile_run: true,
          raw_data_captured: false,
          raw_payload_values_captured: false,
        })
      );
      expect(run.profile.profile.inventory.length).toBeGreaterThan(0);
    }
  });

  test('connector profile scheduler creates, runs, ticks due schedules, and pauses repeated failures', async () => {
    upsertConnector(
      {
        id: 'scheduled-powerbi',
        type: 'power_bi',
        label: 'Scheduled Power BI',
        config: { tenant_id: 'tenant-1' },
        credential: { mode: 'service_principal', secret_ref: 'kv://powerbi/schedule' },
      },
      admin
    );

    const schedule = upsertConnectorProfileSchedule(
      {
        connector_id: 'scheduled-powerbi',
        profile_type: 'bi',
        name: 'Power BI daily profile',
        cadence: 'hourly',
        interval_minutes: 60,
        start_at: '2026-06-07T00:00:00.000Z',
        options: {
          dry_run: true,
          streams: ['reports', 'dashboards'],
          metadata_payload: { should_not_store: true },
        },
      },
      admin
    );

    expect(schedule).toEqual(
      expect.objectContaining({
        connector_id: 'scheduled-powerbi',
        profile_type: 'bi',
        status: 'ACTIVE',
      })
    );
    expect(JSON.stringify(schedule)).not.toContain('should_not_store');
    expect(listConnectorProfileSchedules({}, admin)).toHaveLength(1);
    expect(getConnectorProfileSchedule(schedule.id, admin)).toEqual(expect.objectContaining({ id: schedule.id }));

    const immediate = await runConnectorProfileSchedule(schedule.id, admin);
    expect(immediate.run.status).toBe('succeeded');
    expect(immediate.schedule).toEqual(
      expect.objectContaining({
        run_count: 1,
        last_status: 'succeeded',
      })
    );

    const due = await runDueConnectorProfileSchedules({ now: immediate.schedule.next_run_at }, admin);
    expect(due.due_count).toBe(1);
    expect(due.results[0]).toEqual(expect.objectContaining({ status: 'succeeded' }));

    upsertConnector(
      {
        id: 'scheduled-bad-openapi',
        type: 'openapi',
        label: 'Bad OpenAPI',
        config: {},
        credential: { mode: 'none' },
      },
      admin
    );
    const failing = upsertConnectorProfileSchedule(
      {
        connector_id: 'scheduled-bad-openapi',
        profile_type: 'metadata',
        interval_minutes: 5,
        max_failures: 1,
        start_at: '2026-06-07T00:00:00.000Z',
        options: { dry_run: true },
      },
      admin
    );

    const failedTick = await runDueConnectorProfileSchedules({ now: failing.next_run_at }, admin);
    const failedSchedule = getConnectorProfileSchedule(failing.id, admin);
    expect(failedTick.results).toEqual(
      expect.arrayContaining([expect.objectContaining({ schedule_id: failing.id, status: 'failed' })])
    );
    expect(failedSchedule).toEqual(
      expect.objectContaining({
        status: 'PAUSED',
        failure_count: 1,
      })
    );
    expect(deleteConnectorProfileSchedule(schedule.id, admin)).toBe(true);
  });

  test('AWS signed source client requires resolved signing credentials', async () => {
    const extraction = await runConnectorExtractionForConfig({
      id: 'aws-glue-missing-keys',
      type: 'aws_glue',
      config: { region: 'us-east-1' },
      credential: { mode: 'access_key_reference', secret_ref: 'kv://aws/glue' },
      options: { dry_run: false, streams: ['databases'], fail_fast: false },
    });

    expect(extraction.status).toBe('partial_failure');
    expect(extraction.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'CONNECTOR_RUNTIME_ERROR',
          remediation: expect.stringContaining('access_key_id'),
          details: expect.objectContaining({
            accepted_credentials: expect.arrayContaining(['access_key_id', 'secret_access_key']),
          }),
        }),
      ])
    );
  });

  test('REST source client calls documented vendor API and normalizes response', async () => {
    const originalFetch = global.fetch;
    global.fetch = jest.fn(async (url, request) => ({
      ok: true,
      json: async () => ({
        data: [{ id: 42, name: 'Executive Metrics', description: 'Metabase dashboard' }],
        observedUrl: url,
        observedAuth: request.headers.Authorization,
      }),
    }));

    try {
      const extraction = await runConnectorExtractionForConfig({
        id: 'metabase-live',
        type: 'metabase',
        config: { base_url: 'https://metabase.example.com' },
        credential: { mode: 'api_token_reference', token: 'test-token', secret_ref: 'kv://metabase' },
        options: { dry_run: false, streams: ['dashboards'] },
      });

      expect(global.fetch).toHaveBeenCalledWith(
        'https://metabase.example.com/api/dashboard',
        expect.objectContaining({
          headers: expect.objectContaining({ Authorization: 'Bearer test-token' }),
        })
      );
      expect(extraction.status).toBe('succeeded');
      expect(extraction.events).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'metadata.dashboard',
            stream: 'dashboards',
            external_id: '42',
            name: 'Executive Metrics',
          }),
        ])
      );
    } finally {
      global.fetch = originalFetch;
    }
  });

  test('Git repository connector extracts configured Python, SQL, and notebook files without sample events', async () => {
    const extraction = await runConnectorExtractionForConfig({
      id: 'repo-live-files',
      type: 'git_repository',
      config: {
        repo_url: 'https://github.com/sonic/data-platform',
        files: ['pipelines/load_claims.py', 'sql/dim_vehicle.sql', 'notebooks/profiling.ipynb'],
      },
      credential: { mode: 'pat_reference', secret_ref: 'kv://repo/pat' },
      options: { dry_run: false, streams: ['python_scripts', 'sql_files', 'notebooks'] },
    });

    expect(extraction.status).toBe('succeeded');
    expect(extraction.events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ stream: 'python_scripts', external_id: 'pipelines/load_claims.py' }),
        expect.objectContaining({ stream: 'sql_files', external_id: 'sql/dim_vehicle.sql' }),
        expect.objectContaining({ stream: 'notebooks', external_id: 'notebooks/profiling.ipynb' }),
      ])
    );
  });

  test('documented bridge maps live-shaped metadata payload aliases to canonical events', async () => {
    const extraction = await runConnectorExtractionForConfig({
      id: 'airflow-payload',
      type: 'airflow',
      config: { base_url: 'https://airflow.example.com' },
      credential: { mode: 'basic_auth', secret_ref: 'kv://airflow/basic' },
      options: {
        dry_run: false,
        streams: ['pipelines'],
        metadata_payload: {
          dags: [{ id: 'load_dim_vehicle', name: 'load_dim_vehicle', owner: 'data-eng' }],
        },
      },
    });

    expect(extraction.status).toBe('succeeded');
    expect(extraction.events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'metadata.object',
          stream: 'pipelines',
          external_id: 'load_dim_vehicle',
        }),
      ])
    );
  });

  test('conforms existing SQL Server extractor metadata to canonical connector events', async () => {
    const extraction = await runConnectorExtractionForConfig({
      id: 'sql-bridge',
      type: 'sql_server',
      config: { database: 'Sonic_DW' },
      credential: { mode: 'service_account', secret_ref: 'kv://sql' },
      options: {
        dry_run: false,
        include_metadata: true,
        streams: ['tables', 'columns', 'relationships'],
        mockMetadata: {
          database: 'Sonic_DW',
          extractedAt: '2026-06-06T00:00:00.000Z',
          allObjects: [],
          tables: [
            {
              id: 'L1.Sonic_DW.dbo.DimVehicle',
              name: 'DimVehicle',
              schema: 'dbo',
              columns: [{ name: 'VehicleKey', dataType: 'int' }],
            },
          ],
          views: [],
          relationships: [
            {
              id: 'proc-to-dimvehicle',
              fromTable: 'L1.Sonic_DW.dbo.usp_DimVehicle',
              toTable: 'L1.Sonic_DW.dbo.DimVehicle',
              type: 'procedure_load',
              confidence: 0.95,
            },
          ],
        },
      },
    });

    expect(extraction.summary).toMatchObject({
      object_count: 1,
      column_count: 1,
      lineage_edge_count: 1,
    });
    expect(extraction.events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: 'metadata.object', stream: 'tables' }),
        expect.objectContaining({ type: 'metadata.column', stream: 'columns' }),
        expect.objectContaining({ type: 'lineage.edge', stream: 'relationships' }),
      ])
    );
  });

  test('conforms existing SSIS extractor metadata to canonical connector events', async () => {
    const extraction = await runConnectorExtractionForConfig({
      id: 'ssis-bridge',
      type: 'ssis',
      config: { server: 'V1-SSIS25-01' },
      credential: { mode: 'windows_integrated', secret_ref: 'legacy-request-body' },
      options: {
        dry_run: false,
        include_metadata: true,
        streams: ['packages', 'connections', 'lineage'],
        mockMetadata: {
          extractedAt: '2026-06-06T00:00:00.000Z',
          catalog: [],
          parameters: [],
          environments: { variables: [] },
          agentJobs: { jobs: [], ssisSteps: [] },
          xmlMetadata: [
            {
              packageId: 'SSISDB.Project.Package.dtsx',
              packageName: 'Package.dtsx',
              connectionManagers: [{ id: 'SourceDb', name: 'SourceDb' }],
              sqlTasks: [],
              packageTasks: [],
              dataFlowComponents: [],
            },
          ],
          lineageEdges: [
            {
              id: 'ssis-edge',
              from: 'SSISDB.Project.Package.dtsx',
              to: 'L1.Sonic_DW.dbo.DimVehicle',
              edgeType: 'LOADS',
              confidence: 0.9,
            },
          ],
        },
      },
    });

    expect(extraction.summary).toMatchObject({
      object_count: 2,
      lineage_edge_count: 1,
    });
    expect(extraction.events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: 'metadata.object', stream: 'packages' }),
        expect.objectContaining({ type: 'metadata.data_source', stream: 'connections' }),
        expect.objectContaining({ type: 'lineage.edge', stream: 'lineage' }),
      ])
    );
  });
});

function firstStreamForType(type) {
  const overrides = {
    sql_server: 'tables',
    ssis: 'packages',
    openapi: 'endpoints',
    dbt: 'models',
    git_repository: 'python_scripts',
  };
  return overrides[type] || null;
}

function minimalCredential(kinds = []) {
  const mode = kinds[0] || 'secret_reference';
  if (mode === 'none') return { mode: 'none' };
  return { mode, secret_ref: `kv://metadata/${mode}` };
}

function minimalConnectorConfig(type) {
  const base = {
    account: 'demo-account',
    aws_account_id: '123456789012',
    base_url: 'https://example.com',
    catalog_endpoint: '',
    cluster: 'demo-cluster',
    database: 'demo_db',
    factory_name: 'demo-factory',
    host: 'example.com',
    project_id: 'demo-project',
    region: 'us-east-1',
    repo_url: 'https://example.com/org/repo',
    resource_group: 'demo-rg',
    server: 'demo-server',
    site_id: 'demo-site',
    spec_url: 'https://example.com/openapi.json',
    subscription_id: '00000000-0000-0000-0000-000000000000',
    tenant_id: '00000000-0000-0000-0000-000000000000',
    tenant_url: 'https://tenant.example.com',
    workspace_url: 'https://workspace.example.com',
  };
  if (type === 'git_repository') {
    base.files = ['pipelines/load_dim_vehicle.py'];
  }
  return base;
}
