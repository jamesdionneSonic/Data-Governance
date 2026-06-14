import {
  buildDatabaseControlPlan,
  buildEffectivePolicy,
  buildPolicyEffectivenessReport,
  evaluatePolicyDecision,
  getPolicyTemplates,
} from '../../src/services/classificationPolicyService.js';

describe('classificationPolicyService', () => {
  test('returns built-in policy templates', () => {
    expect(getPolicyTemplates().map((template) => template.id)).toEqual(
      expect.arrayContaining(['pii-mask-default', 'gdpr-protected-data', 'financial-audit'])
    );
  });

  test('builds effective masking and access controls for PII assets', () => {
    const policy = buildEffectivePolicy({
      id: 'hr.employee',
      columns: [{ name: 'employee_email', data_type: 'varchar' }],
    });

    expect(policy.controls).toMatchObject({
      mask: true,
      restrict_access: true,
      log_access: true,
    });
    expect(policy.masking_actions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ column_name: 'employee_email', strategy: 'email' }),
      ])
    );
  });

  test('requires approval or masking for restricted non-steward access', () => {
    const decision = evaluatePolicyDecision(
      {
        id: 'hr.employee',
        columns: [{ name: 'employee_email', data_type: 'varchar' }],
      },
      { action: 'read', role: 'Viewer' }
    );

    expect(decision.decision).toBe('approval_required');
    expect(decision.obligations).toEqual(
      expect.arrayContaining(['mask_pii_columns', 'request_access_approval', 'log_access_decision'])
    );
  });

  test('summarizes policy effectiveness coverage and gaps', () => {
    const report = buildPolicyEffectivenessReport(
      new Map([
        [
          'hr.employee',
          {
            id: 'hr.employee',
            columns: [{ name: 'employee_email', data_type: 'varchar' }],
          },
        ],
        [
          'ops.notes',
          { id: 'ops.notes', columns: [{ name: 'comment_text', data_type: 'varchar' }] },
        ],
      ]),
      [{ action: 'pii_policy_evaluated', details: { decision: 'approval_required' } }]
    );

    expect(report.total_assets).toBe(2);
    expect(report.controls.mask).toBe(1);
    expect(report.policy_coverage.assets).toBe(1);
    expect(report.audit_decisions.by_decision.approval_required).toBe(1);
    expect(report.gaps).toEqual(
      expect.arrayContaining([expect.objectContaining({ asset_id: 'ops.notes' })])
    );
  });

  test('builds SQL Server database control plans for masking and row-level security', () => {
    const plan = buildDatabaseControlPlan({
      id: 'L1.HR.dbo.Employee',
      database: 'HR',
      schema: 'dbo',
      name: 'Employee',
      classification_overrides: [{ classification: 'Restricted', reason: 'sensitive HR data' }],
      columns: [{ name: 'employee_email', data_type: 'varchar' }],
    });

    expect(plan.enforcement_mode).toBe('advisory_sql_review_required');
    expect(plan.masking.statements[0]).toEqual(
      expect.objectContaining({
        column_name: 'employee_email',
        strategy: 'email',
      })
    );
    expect(plan.masking.statements[0].statement).toContain('ADD MASKED');
    expect(plan.row_level_security.enabled).toBe(true);
    expect(plan.row_level_security.statements.join('\n')).toContain('CREATE SECURITY POLICY');
  });
});
