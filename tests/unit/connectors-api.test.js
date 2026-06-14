import request from 'supertest';
import createApp from '../../src/app.js';
import { generateToken } from '../../src/utils/tokenManager.js';
import { resetConnectorStore } from '../../src/services/connectorService.js';

function authHeaders(user) {
  return {
    Authorization: `Bearer ${generateToken({
      id: user.id,
      email: user.email,
      name: user.name || user.email,
      roles: user.roles,
      databases: ['Sonic_DW'],
    })}`,
  };
}

const admin = { id: 'admin-1', email: 'admin@example.com', roles: ['Admin'] };
const analyst = { id: 'analyst-1', email: 'analyst@example.com', roles: ['Analyst'] };
const viewer = { id: 'viewer-1', email: 'viewer@example.com', roles: ['Viewer'] };

describe('Connectors API', () => {
  beforeEach(() => {
    resetConnectorStore();
  });

  test('returns connector definitions for enterprise source categories', async () => {
    const app = createApp();
    const res = await request(app).get('/api/v1/connectors/definitions').set(authHeaders(viewer));

    expect(res.status).toBe(200);
    expect(res.body.definitions.map((definition) => definition.type)).toEqual(
      expect.arrayContaining(['sql_server', 'aws_s3', 'gcp_dataplex', 'git_repository'])
    );

    const reportingRes = await request(app)
      .get('/api/v1/connectors/definitions?category=business_intelligence')
      .set(authHeaders(viewer));
    expect(reportingRes.body.definitions.map((definition) => definition.type)).toEqual(
      expect.arrayContaining(['microstrategy_cloud', 'ssas_on_prem', 'power_bi', 'tableau', 'qlik_cloud'])
    );

    const sqlServer = res.body.definitions.find((definition) => definition.type === 'sql_server');
    expect(sqlServer.wizard).toMatchObject({
      supports_test: true,
      supports_discovery: true,
    });
    expect(sqlServer.wizard.basic_fields).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: 'server_host' }),
        expect.objectContaining({ key: 'database' }),
      ])
    );
    expect(sqlServer.wizard.auth_modes).toEqual(
      expect.arrayContaining([expect.objectContaining({ value: 'windows_integrated' })])
    );

    const coverageRes = await request(app)
      .get('/api/v1/connectors/coverage')
      .set(authHeaders(viewer));
    expect(coverageRes.body.coverage.definitions.every((item) => item.plumbed)).toBe(true);
  });

  test('creates managed connectors, grants run permission, and hides secrets', async () => {
    const app = createApp();

    const createRes = await request(app)
      .post('/api/v1/connectors')
      .set(authHeaders(admin))
      .send({
        id: 'repo-python',
        type: 'git_repository',
        label: 'Python ETL Repo',
        config: {
          repo_url: 'https://github.com/sonic/etl',
          files: ['jobs/load_vehicle.py', 'sql/stage_vehicle.sql'],
        },
        credential: {
          mode: 'pat_reference',
          secret_ref: 'kv://metadata/repo-python',
          token: 'raw-token-value',
        },
      });

    expect(createRes.status).toBe(201);
    expect(JSON.stringify(createRes.body.connector)).not.toContain('raw-token-value');

    const deniedRun = await request(app)
      .post('/api/v1/connectors/repo-python/run')
      .set(authHeaders(analyst))
      .send({ dry_run: true });
    expect(deniedRun.status).toBe(403);

    const grantRes = await request(app)
      .post('/api/v1/connectors/repo-python/permissions')
      .set(authHeaders(admin))
      .send({ scope: 'roles', subject: 'Analyst', actions: ['view', 'run'] });
    expect(grantRes.status).toBe(200);

    const planRes = await request(app)
      .post('/api/v1/connectors/repo-python/plan')
      .set(authHeaders(analyst))
      .send({ streams: ['python_scripts'] });
    expect(planRes.body.plan.streams).toEqual([
      expect.objectContaining({ stream: 'python_scripts' }),
    ]);

    const runRes = await request(app)
      .post('/api/v1/connectors/repo-python/run')
      .set(authHeaders(analyst))
      .send({ dry_run: true });
    expect(runRes.status).toBe(200);
    expect(runRes.body.run.summary).toMatchObject({
      raw_data_captured: false,
      secret_exposed: false,
    });

    const snapshotRes = await request(app)
      .get('/api/v1/connectors/repo-python/snapshot')
      .set(authHeaders(analyst));
    expect(snapshotRes.body.snapshot.python_scripts).toEqual([
      expect.objectContaining({ path: 'jobs/load_vehicle.py' }),
    ]);
  });

  test('returns structured extraction errors with remediation', async () => {
    const app = createApp();
    await request(app)
      .post('/api/v1/connectors')
      .set(authHeaders(admin))
      .send({
        id: 'bad-powerbi',
        type: 'power_bi',
        label: 'Bad Power BI',
        config: {},
        credential: { mode: 'service_principal', secret_ref: 'kv://powerbi' },
      });

    const runRes = await request(app)
      .post('/api/v1/connectors/bad-powerbi/run')
      .set(authHeaders(admin))
      .send({ dry_run: true });

    expect(runRes.status).toBe(200);
    expect(runRes.body.run.status).toBe('failed');
    expect(runRes.body.run.errors[0]).toMatchObject({
      code: 'CONNECTOR_CONFIG_ERROR',
      phase: 'configuration',
      remediation: expect.stringContaining('Review connector configuration'),
    });
  });

  test('runs connector-backed profiling through managed permissions', async () => {
    const app = createApp();
    await request(app)
      .post('/api/v1/connectors')
      .set(authHeaders(admin))
      .send({
        id: 'profile-sql-api',
        type: 'sql_server',
        label: 'Profile SQL API',
        config: {
          server: 'sql.example.com',
          database: 'finance',
          mockConnectionCheck: {
            status: 'ready',
            live_connection_valid: true,
            metadata_discovery_valid: true,
            details: { server_name: 'sql.example.com', database_name: 'finance', credential_mode: 'service_account' },
          },
        },
        credential: { mode: 'service_account', username: 'svc', password: 'profile-password', secret_ref: 'kv://sql' },
      });

    const planRes = await request(app)
      .post('/api/v1/connectors/profile-sql-api/profile/plan')
      .set(authHeaders(admin))
      .send({
        assets: [
          {
            id: 'finance.dbo.Invoice',
            database: 'finance',
            schema: 'dbo',
            name: 'Invoice',
            type: 'table',
            columns: [{ name: 'total_amount', data_type: 'decimal' }],
          },
        ],
      });

    expect(planRes.status).toBe(200);
    expect(planRes.body.plan.plan.actions[0].query.sql).toContain('COUNT_BIG(*)');

    const runRes = await request(app)
      .post('/api/v1/connectors/profile-sql-api/profile/run')
      .set(authHeaders(admin))
      .send({
        execution_mode: 'live',
        assets: [
          {
            id: 'finance.dbo.Invoice',
            database: 'finance',
            schema: 'dbo',
            name: 'Invoice',
            type: 'table',
            columns: [{ name: 'total_amount', data_type: 'decimal' }],
          },
        ],
        mockProfileRows: {
          row_count: 200,
          total_amount__null_count: 4,
          total_amount__distinct_count: 120,
          total_amount__min: 1,
          total_amount__max: 999,
          total_amount__mean: 25,
        },
      });

    expect(runRes.status).toBe(200);
    expect(runRes.body.run.status).toBe('succeeded');
    expect(runRes.body.run.profile.run.profiles['finance.dbo.Invoice'].columns.total_amount).toEqual(
      expect.objectContaining({
        null_count: 4,
        null_percent: 2,
        distinct_count: 120,
        raw_values_retained: false,
      })
    );
    const responseJson = JSON.stringify(runRes.body);
    expect(responseJson).not.toContain('profile-password');
    expect(responseJson).not.toContain('kv://sql');

    const historyRes = await request(app)
      .get('/api/v1/connectors/profile-sql-api/runs')
      .set(authHeaders(admin));
    expect(historyRes.body.runs[0].artifact.profile_publish).toMatchObject({
      status: 'pending',
      successful_asset_count: 1,
      failed_asset_count: 0,
    });

    const publishRes = await request(app)
      .post(`/api/v1/connectors/profile-sql-api/runs/${runRes.body.run.id}/publish`)
      .set(authHeaders(admin))
      .send({ targets: ['devops', 'confluence'], dry_run: true });
    expect(publishRes.status).toBe(200);
    expect(publishRes.body.publication).toMatchObject({
      status: 'planned',
      dry_run: true,
      run_count: 1,
      successful_asset_count: 1,
    });
    expect(publishRes.body.publication.steps.map((step) => step.script)).toEqual(
      expect.arrayContaining([
        'lineage:runtime:package',
        'lineage:runtime:check',
        'lineage:runtime:sync',
        'lineage:runtime:publish',
        'confluence:publish',
      ])
    );
  });

  test('runs BI report profiling through managed connector API', async () => {
    const app = createApp();
    await request(app)
      .post('/api/v1/connectors')
      .set(authHeaders(admin))
      .send({
        id: 'powerbi-api',
        type: 'power_bi',
        label: 'Power BI API',
        config: { tenant_id: 'tenant-1' },
        credential: {
          mode: 'service_principal',
          secret_ref: 'kv://powerbi/api',
          client_secret: 'hidden-client-secret',
        },
      });
    await request(app)
      .post('/api/v1/connectors/powerbi-api/permissions')
      .set(authHeaders(admin))
      .send({ scope: 'roles', subject: 'Analyst', actions: ['view', 'run'] });

    const planRes = await request(app)
      .post('/api/v1/connectors/powerbi-api/bi-profile/plan')
      .set(authHeaders(analyst))
      .send({ streams: ['reports', 'dashboards'] });

    expect(planRes.status).toBe(200);
    expect(planRes.body.plan).toMatchObject({
      profile_type: 'bi_report_profile',
      captures_raw_report_data: false,
    });

    const runRes = await request(app)
      .post('/api/v1/connectors/powerbi-api/bi-profile/run')
      .set(authHeaders(analyst))
      .send({
        dry_run: false,
        include_events: false,
        streams: ['reports', 'dashboards', 'datasets', 'lineage'],
        metadata_payload: {
          reports: [{ id: 'report-1', name: 'Executive Report', datasetId: 'dataset-1' }],
          dashboards: [{ id: 'dashboard-1', name: 'Executive Dashboard' }],
          datasets: [{ id: 'dataset-1', name: 'Executive Dataset' }],
          lineage: [{ id: 'edge-1', from: 'dataset-1', to: 'report-1', type: 'feeds' }],
        },
      });

    expect(runRes.status).toBe(200);
    expect(runRes.body.run.summary).toMatchObject({
      bi_profile_run: true,
      raw_report_data_captured: false,
      report_count: 1,
      dashboard_count: 1,
      dataset_count: 1,
    });
    expect(runRes.body.run.profile.answer.answer).toContain('metadata-only');
    const responseJson = JSON.stringify(runRes.body);
    expect(responseJson).not.toContain('hidden-client-secret');
    expect(responseJson).not.toContain('kv://powerbi/api');
  });

  test('managed connector test returns explicit connection diagnostics without running extraction', async () => {
    const app = createApp();
    await request(app)
      .post('/api/v1/connectors')
      .set(authHeaders(admin))
      .send({
        id: 'sql-validate-api',
        type: 'sql_server',
        label: 'SQL Validate API',
        config: {
          server: 'L1-5FSQL-01',
          database: 'Sonic_DW',
          mockConnectionCheck: {
            status: 'ready',
            live_connection_valid: true,
            metadata_discovery_valid: true,
            details: { server_name: 'L1-5FSQL-01', database_name: 'Sonic_DW', credential_mode: 'windows_integrated' },
          },
        },
        credential: { mode: 'windows_integrated' },
      });

    const runRes = await request(app)
      .post('/api/v1/connectors/sql-validate-api/test')
      .set(authHeaders(admin))
      .send({});

    expect(runRes.status).toBe(200);
    expect(runRes.body.test.summary).toMatchObject({
      test_only: true,
      connection_status: 'ready',
      live_connection_valid: true,
      metadata_discovery_valid: true,
      connection_details: expect.objectContaining({
        server_name: 'L1-5FSQL-01',
        database_name: 'Sonic_DW',
      }),
    });
  });

  test('runs connector metadata profiling through managed connector API', async () => {
    const app = createApp();
    await request(app)
      .post('/api/v1/connectors')
      .set(authHeaders(admin))
      .send({
        id: 'adf-profile-api',
        type: 'azure_data_factory',
        label: 'ADF Profile API',
        config: {
          subscription_id: 'sub-1',
          resource_group: 'rg-data',
          factory_name: 'sonic-adf',
        },
        credential: {
          mode: 'service_principal',
          secret_ref: 'kv://adf/profile',
          client_secret: 'hidden-client-secret',
        },
      });
    await request(app)
      .post('/api/v1/connectors/adf-profile-api/permissions')
      .set(authHeaders(admin))
      .send({ scope: 'roles', subject: 'Analyst', actions: ['view', 'run'] });

    const planRes = await request(app)
      .post('/api/v1/connectors/adf-profile-api/metadata-profile/plan')
      .set(authHeaders(analyst))
      .send({ streams: ['pipelines', 'datasets'] });

    expect(planRes.status).toBe(200);
    expect(planRes.body.plan).toMatchObject({
      profile_type: 'connector_metadata_profile',
      captures_raw_data: false,
    });

    const runRes = await request(app)
      .post('/api/v1/connectors/adf-profile-api/metadata-profile/run')
      .set(authHeaders(analyst))
      .send({
        dry_run: false,
        include_events: false,
        streams: ['pipelines', 'tasks', 'datasets', 'connections', 'lineage'],
        metadata_payload: {
          pipelines: [{ id: 'pipe-1', name: 'Load Claims' }],
          tasks: [{ id: 'task-1', name: 'Copy Claims', pipelineId: 'pipe-1' }],
          datasets: [{ id: 'dataset-1', name: 'Claims Stage' }],
          connections: [{ id: 'conn-1', name: 'Sonic_DW' }],
          lineage: [{ id: 'edge-1', from: 'conn-1', to: 'dataset-1', type: 'feeds' }],
        },
      });

    expect(runRes.status).toBe(200);
    expect(runRes.body.run.summary).toMatchObject({
      metadata_profile_run: true,
      pipeline_count: 1,
      task_count: 1,
      dataset_count: 1,
      connection_count: 1,
      lineage_edge_count: 1,
      raw_payload_values_captured: false,
    });
    expect(runRes.body.run.profile.answer.answer).toContain('metadata-only');
    const responseJson = JSON.stringify(runRes.body);
    expect(responseJson).not.toContain('hidden-client-secret');
    expect(responseJson).not.toContain('kv://adf/profile');
  });

  test('creates and runs connector profile schedules through managed connector API', async () => {
    const app = createApp();
    await request(app)
      .post('/api/v1/connectors')
      .set(authHeaders(admin))
      .send({
        id: 'openapi-schedule-api',
        type: 'openapi',
        label: 'OpenAPI Schedule API',
        config: {
          spec_url: 'https://api.example.com/openapi.json',
          seed_metadata: {
            endpoints: [{ id: 'GET /vehicles', name: 'GET /vehicles' }],
            schemas: [{ id: 'Vehicle', name: 'Vehicle' }],
          },
        },
        credential: {
          mode: 'api_key',
          secret_ref: 'kv://openapi/schedule',
          api_key: 'hidden-api-key',
        },
      });

    const scheduleRes = await request(app)
      .post('/api/v1/connectors/profile-schedules')
      .set(authHeaders(admin))
      .send({
        connector_id: 'openapi-schedule-api',
        profile_type: 'auto',
        cadence: 'hourly',
        interval_minutes: 60,
        start_at: '2026-06-07T00:00:00.000Z',
        options: {
          dry_run: false,
          streams: ['endpoints', 'schemas', 'lineage'],
          api_key: 'do-not-return',
        },
      });

    expect(scheduleRes.status).toBe(201);
    expect(scheduleRes.body.schedule.options.dry_run).toBe(false);
    expect(scheduleRes.body.schedule).toEqual(
      expect.objectContaining({
        connector_id: 'openapi-schedule-api',
        profile_type: 'metadata',
        status: 'ACTIVE',
      })
    );
    expect(JSON.stringify(scheduleRes.body)).not.toContain('do-not-return');

    const listRes = await request(app).get('/api/v1/connectors/profile-schedules').set(authHeaders(admin));
    expect(listRes.status).toBe(200);
    expect(listRes.body.schedules).toHaveLength(1);

    const statusRes = await request(app)
      .get('/api/v1/connectors/profile-schedules/status')
      .set(authHeaders(admin));
    expect(statusRes.status).toBe(200);
    expect(statusRes.body.scheduler).toEqual(
      expect.objectContaining({
        schedule_count: 1,
        persistence_enabled: false,
      })
    );

    const runRes = await request(app)
      .post(`/api/v1/connectors/profile-schedules/${scheduleRes.body.schedule.id}/run`)
      .set(authHeaders(admin));
    expect(runRes.status).toBe(200);
    expect(runRes.body.result.run.status).toBe('succeeded');
    expect(runRes.body.result.run.summary).toEqual(
      expect.objectContaining({
        metadata_profile_run: true,
        api_endpoint_count: expect.any(Number),
      })
    );

    const runsRes = await request(app)
      .get(`/api/v1/connectors/profile-schedules/${scheduleRes.body.schedule.id}/runs`)
      .set(authHeaders(admin));
    expect(runsRes.status).toBe(200);
    expect(runsRes.body.runs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          schedule_id: scheduleRes.body.schedule.id,
          status: 'succeeded',
        }),
      ])
    );

    const tickRes = await request(app)
      .post('/api/v1/connectors/profile-schedules/tick')
      .set(authHeaders(admin))
      .send({ now: runRes.body.result.schedule.next_run_at });
    expect(tickRes.status).toBe(200);
    expect(tickRes.body.result.due_count).toBe(1);
    expect(tickRes.body.result.results[0]).toEqual(expect.objectContaining({ status: 'succeeded' }));

    const deleteRes = await request(app)
      .delete(`/api/v1/connectors/profile-schedules/${scheduleRes.body.schedule.id}`)
      .set(authHeaders(admin));
    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.deleted).toBe(true);
    const responseJson = JSON.stringify({ scheduleRes: scheduleRes.body, runRes: runRes.body, tickRes: tickRes.body });
    expect(responseJson).not.toContain('hidden-api-key');
    expect(responseJson).not.toContain('kv://openapi/schedule');
  });

  test('rejects recurring profile schedules saved as dry runs', async () => {
    const app = createApp();
    await request(app)
      .post('/api/v1/connectors')
      .set(authHeaders(admin))
      .send({
        id: 'dry-run-schedule-api',
        type: 'power_bi',
        label: 'Dry Run Schedule API',
        config: { tenant_id: 'tenant-1' },
        credential: { mode: 'service_principal', secret_ref: 'kv://powerbi/schedule' },
      });

    const scheduleRes = await request(app)
      .post('/api/v1/connectors/profile-schedules')
      .set(authHeaders(admin))
      .send({
        connector_id: 'dry-run-schedule-api',
        profile_type: 'bi',
        interval_minutes: 60,
        options: { dry_run: true },
      });

    expect(scheduleRes.status).toBe(400);
    expect(scheduleRes.body.message).toMatch(/cannot be saved as dry runs/i);
  });
});
