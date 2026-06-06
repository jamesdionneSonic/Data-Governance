import request from 'supertest';
import { mkdtemp, rm } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import createApp, { initializeCache } from '../../src/app.js';
import { generateToken } from '../../src/utils/tokenManager.js';
import { resetTaxonomyCache } from '../../src/services/classificationService.js';
import { clearAuditLog, getAuditLog } from '../../src/services/adminService.js';
import { clearActivityLog, getActivityLog } from '../../src/services/activityService.js';

function authHeaders() {
  const token = generateToken({
    id: 'classification-user',
    email: 'classification-user@example.com',
    name: 'Classification User',
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
          sensitivity: 'internal',
          columns: [
            { name: 'employee_email', data_type: 'varchar' },
            { name: 'salary_amount', data_type: 'decimal' },
            { name: 'employee_key', data_type: 'int' },
          ],
        },
      ],
    ]),
    new Map()
  );
  return app;
}

describe('Classification API', () => {
  let tempDir;

  beforeEach(() => {
    resetTaxonomyCache();
    clearAuditLog();
    clearActivityLog();
  });

  afterEach(async () => {
    delete process.env.CLASSIFICATION_TAXONOMY_PATH;
    resetTaxonomyCache();
    if (tempDir) {
      await rm(tempDir, { recursive: true, force: true });
      tempDir = null;
    }
  });

  test('returns taxonomy with categories and rules', async () => {
    const app = seedApp();
    const res = await request(app).get('/api/v1/classification/taxonomy').set(authHeaders());

    expect(res.status).toBe(200);
    expect(res.body.taxonomy.categories.map((category) => category.label)).toContain('PII');
    expect(res.body.taxonomy.rules.length).toBeGreaterThan(0);
  });

  test('classifies an asset with evidence-rich results', async () => {
    const app = seedApp();
    const res = await request(app)
      .get('/api/v1/classification/asset/hr.employee')
      .set(authHeaders());

    expect(res.status).toBe(200);
    expect(res.body.classifications).toEqual(expect.arrayContaining(['PII', 'Financial']));
    expect(res.body.result.matches.length).toBeGreaterThan(0);
  });

  test('bulk endpoint supports manual classifications', async () => {
    const app = seedApp();
    const res = await request(app)
      .post('/api/v1/classification/bulk')
      .set(authHeaders())
      .send({
        assets: [
          {
            asset_id: 'hr.employee',
            manual_classification: 'Restricted',
            reason: 'Payroll review',
          },
        ],
      });

    expect(res.status).toBe(200);
    expect(res.body.results[0].classifications).toContain('Restricted');
  });

  test('returns a PII masking policy plan for an asset', async () => {
    const app = seedApp();
    const res = await request(app).get('/api/v1/classification/pii/hr.employee').set(authHeaders());

    expect(res.status).toBe(200);
    expect(res.body.pii_policy.retention.store_raw_values).toBe(false);
    expect(res.body.pii_policy.masking_actions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ column_name: 'employee_email', strategy: 'email' }),
      ])
    );
  });

  test('returns classification policy templates and effective policy decisions', async () => {
    const app = seedApp();
    const templatesRes = await request(app).get('/api/v1/classification/policies').set(authHeaders());

    expect(templatesRes.status).toBe(200);
    expect(templatesRes.body.policies.map((policy) => policy.id)).toEqual(
      expect.arrayContaining(['pii-mask-default', 'financial-audit'])
    );

    const effectiveRes = await request(app)
      .get('/api/v1/classification/policies/hr.employee/effective')
      .set(authHeaders());

    expect(effectiveRes.status).toBe(200);
    expect(effectiveRes.body.effective_policy.controls).toMatchObject({
      mask: true,
      restrict_access: true,
      log_access: true,
    });
    expect(effectiveRes.body.effective_policy.masking_actions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ column_name: 'employee_email', strategy: 'email' }),
      ])
    );

    const decisionRes = await request(app)
      .post('/api/v1/classification/policies/hr.employee/decision')
      .set(authHeaders())
      .send({ action: 'read', role: 'Viewer' });

    expect(decisionRes.status).toBe(200);
    expect(decisionRes.body.decision).toMatchObject({
      asset_id: 'hr.employee',
      decision: 'approval_required',
    });
    expect(decisionRes.body.decision.obligations).toEqual(
      expect.arrayContaining(['mask_pii_columns', 'log_access_decision'])
    );
    expect(getAuditLog({ action: 'pii_policy_evaluated' })).toHaveLength(1);
  });

  test('returns policy effectiveness report from loaded catalog and audit decisions', async () => {
    const app = seedApp();

    await request(app)
      .post('/api/v1/classification/policies/hr.employee/decision')
      .set(authHeaders())
      .send({ action: 'read', role: 'Viewer' });

    const res = await request(app)
      .get('/api/v1/classification/policies/effectiveness')
      .set(authHeaders());

    expect(res.status).toBe(200);
    expect(res.body.report).toMatchObject({
      total_assets: 1,
      controls: expect.objectContaining({
        mask: 1,
        restrict_access: 1,
        log_access: 1,
      }),
      audit_decisions: {
        total: 1,
        by_decision: {
          approval_required: 1,
        },
      },
    });
    expect(res.body.report.policy_coverage.percent).toBe(100);
  });

  test('returns database control plan for classified assets', async () => {
    const app = seedApp();
    const res = await request(app)
      .get('/api/v1/classification/policies/hr.employee/database-controls')
      .set(authHeaders());

    expect(res.status).toBe(200);
    expect(res.body.database_control_plan).toMatchObject({
      platform: 'sql_server',
      enforcement_mode: 'advisory_sql_review_required',
      masking: {
        enabled: true,
        statements: expect.arrayContaining([
          expect.objectContaining({ column_name: 'employee_email' }),
        ]),
      },
    });
  });

  test('returns only masked values for sample mask preview', async () => {
    const app = seedApp();
    const res = await request(app)
      .post('/api/v1/classification/pii/hr.employee/mask-preview')
      .set(authHeaders())
      .send({
        record: {
          employee_email: 'alex@example.com',
          salary_amount: 100,
        },
      });

    expect(res.status).toBe(200);
    expect(res.body.retention.store_raw_values).toBe(false);
    expect(res.body.masked_record).toEqual({
      employee_email: 'a***@example.com',
      salary_amount: 100,
    });
  });

  test('logs PII mask preview without raw sample values', async () => {
    const app = seedApp();
    await request(app)
      .post('/api/v1/classification/pii/hr.employee/mask-preview')
      .set(authHeaders())
      .send({
        record: {
          employee_email: 'private@example.com',
          salary_amount: 100,
        },
      });

    const auditEvents = getAuditLog({ action: 'pii_mask_preview_generated' });
    const activityEvents = getActivityLog({ action: 'pii_mask_preview_generated' });

    expect(auditEvents).toHaveLength(1);
    expect(activityEvents).toHaveLength(1);
    expect(JSON.stringify(auditEvents[0].details)).not.toContain('private@example.com');
    expect(auditEvents[0].details).toMatchObject({
      asset_id: 'hr.employee',
      pii_columns: 1,
      requires_masking: true,
      columns: ['employee_email'],
      strategies: ['email'],
    });
  });

  test('answers which columns in a table are metrics', async () => {
    const app = seedApp();
    const res = await request(app)
      .get('/api/v1/classification/columns/hr.employee/semantics')
      .set(authHeaders());

    expect(res.status).toBe(200);
    expect(res.body.answer.metric_columns).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ column_name: 'salary_amount', is_metric: true }),
      ])
    );
    expect(res.body.semantics.columns.find((column) => column.column_name === 'employee_key')).toMatchObject({
      semantic_type: 'identifier',
      is_metric: false,
    });
    expect(getAuditLog({ action: 'column_semantics_evaluated' })[0].details).toMatchObject({
      asset_id: 'hr.employee',
      metric_columns: 1,
      columns: ['salary_amount'],
    });
  });

  test('creates and deletes custom taxonomy categories in configured taxonomy file', async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'dg-classification-api-'));
    process.env.CLASSIFICATION_TAXONOMY_PATH = join(tempDir, 'taxonomy.yml');
    resetTaxonomyCache();
    const app = seedApp();

    const createRes = await request(app)
      .post('/api/v1/classification/taxonomy/categories')
      .set(authHeaders())
      .send({
        id: 'dealer-confidential',
        label: 'Dealer Confidential',
        parent: 'confidential',
        level: 2,
        description: 'Dealer scoped confidential data',
        tag_triggers: ['dealer-confidential'],
      });

    expect(createRes.status).toBe(201);
    expect(createRes.body.taxonomy.categories).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'dealer-confidential', label: 'Dealer Confidential' }),
      ])
    );
    expect(createRes.body.taxonomy.history[0]).toMatchObject({ action: 'category_created' });

    const deleteRes = await request(app)
      .delete('/api/v1/classification/taxonomy/categories/dealer-confidential')
      .set(authHeaders());

    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.taxonomy.categories.map((category) => category.id)).not.toContain(
      'dealer-confidential'
    );
  });

  test('creates and deletes custom regex rules in configured taxonomy file', async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'dg-classification-api-'));
    process.env.CLASSIFICATION_TAXONOMY_PATH = join(tempDir, 'taxonomy.yml');
    resetTaxonomyCache();
    const app = seedApp();

    const createRes = await request(app)
      .post('/api/v1/classification/rules')
      .set(authHeaders())
      .send({
        id: 'rule-vin-pii',
        label: 'VIN is dealer-sensitive',
        target: 'column',
        classification: 'Restricted',
        pattern: '(^|_|\\b)vin(_|\\b|$)',
        confidence: 0.88,
      });

    expect(createRes.status).toBe(201);
    expect(createRes.body.taxonomy.rules).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'rule-vin-pii', classification: 'Restricted' }),
      ])
    );

    const deleteRes = await request(app)
      .delete('/api/v1/classification/rules/rule-vin-pii')
      .set(authHeaders());

    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.taxonomy.rules.map((rule) => rule.id)).not.toContain('rule-vin-pii');
  });
});
