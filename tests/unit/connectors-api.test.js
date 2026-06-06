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
});
