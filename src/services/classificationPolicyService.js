/**
 * Classification Policy Service
 * Converts classifications and PII mask plans into effective governance controls.
 */

import { buildPiiMaskPlan } from './piiPolicyService.js';
import { classifyAssetDetailed } from './classificationService.js';

export const POLICY_TEMPLATES = [
  {
    id: 'pii-mask-default',
    label: 'Default PII masking',
    classifications: ['PII', 'PHI', 'PCI'],
    actions: ['mask', 'restrict_access', 'log_access'],
    description: 'Mask all detected PII columns and require approved access.',
  },
  {
    id: 'gdpr-protected-data',
    label: 'GDPR protected data',
    classifications: ['GDPR'],
    actions: ['mask', 'encrypt', 'restrict_access', 'log_access'],
    description: 'Apply GDPR safeguards to personal and special-category data.',
  },
  {
    id: 'financial-audit',
    label: 'Financial audit trail',
    classifications: ['Financial'],
    actions: ['log_access', 'approval_required'],
    description: 'Require auditability for finance-sensitive assets.',
  },
  {
    id: 'restricted-default',
    label: 'Restricted data default',
    classifications: ['Restricted', 'Confidential'],
    actions: ['restrict_access', 'row_level_security', 'log_access'],
    description: 'Restrict access and log decisions for sensitive business assets.',
  },
];

function toArray(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function unique(values) {
  return [...new Set(toArray(values))];
}

export function getPolicyTemplates() {
  return POLICY_TEMPLATES.map((template) => ({ ...template }));
}

export function buildEffectivePolicy(asset = {}) {
  const classificationResult = classifyAssetDetailed(asset);
  const piiPlan = buildPiiMaskPlan(asset);
  const classifications = unique([
    ...classificationResult.classifications,
    ...(piiPlan.masking_actions || []).map((action) => action.classification).filter(Boolean),
  ]);
  const matchingTemplates = POLICY_TEMPLATES.filter((template) =>
    template.classifications.some((classification) => classifications.includes(classification))
  );
  const actions = unique(matchingTemplates.flatMap((template) => template.actions));

  return {
    asset_id: asset.id || asset.name || '',
    classifications,
    policy_templates: matchingTemplates.map((template) => ({
      id: template.id,
      label: template.label,
      actions: template.actions,
    })),
    controls: {
      mask: actions.includes('mask') || piiPlan.summary.requires_masking,
      encrypt: actions.includes('encrypt'),
      restrict_access: actions.includes('restrict_access'),
      row_level_security: actions.includes('row_level_security'),
      log_access: actions.includes('log_access') || actions.includes('approval_required'),
      approval_required: actions.includes('approval_required'),
    },
    masking_actions: piiPlan.masking_actions || [],
    enforcement_mode: 'advisory',
    decision_basis: {
      local_classification_confidence: classificationResult.confidence,
      pii_columns: piiPlan.summary.pii_columns,
      templates_matched: matchingTemplates.length,
    },
  };
}

export function evaluatePolicyDecision(asset = {}, request = {}) {
  const policy = buildEffectivePolicy(asset);
  const requestedAction = request.action || 'read';
  const role = String(request.role || '').toLowerCase();
  const approvedRoles = ['admin', 'steward', 'owner', 'data steward', 'data owner'];
  const canBypassRestriction = approvedRoles.includes(role);

  let decision = 'allow';
  const obligations = [];

  if (policy.controls.mask) obligations.push('mask_pii_columns');
  if (policy.controls.log_access) obligations.push('log_access_decision');
  if (policy.controls.encrypt) obligations.push('encrypt_at_rest_and_in_transit');
  if (policy.controls.row_level_security) obligations.push('apply_row_level_filter');

  if (policy.controls.restrict_access && !canBypassRestriction) {
    decision = requestedAction === 'preview_masked' ? 'allow_with_masking' : 'approval_required';
    obligations.push('request_access_approval');
  } else if (policy.controls.mask) {
    decision = 'allow_with_masking';
  }

  return {
    asset_id: policy.asset_id,
    requested_action: requestedAction,
    role: request.role || 'unknown',
    decision,
    obligations: unique(obligations),
    policy,
  };
}

function splitSqlObjectName(asset = {}) {
  const raw = String(asset.id || asset.name || '');
  const parts = raw.split('.').filter(Boolean);
  return {
    server: parts.length >= 4 ? parts[0] : asset.server || '',
    database: asset.database || (parts.length >= 4 ? parts[1] : parts[0] || ''),
    schema: asset.schema || (parts.length >= 3 ? parts[parts.length - 2] : 'dbo'),
    object: asset.name || parts[parts.length - 1] || raw,
  };
}

function bracketName(value) {
  return `[${String(value || '').replace(/]/g, ']]')}]`;
}

function maskFunctionForStrategy(strategy) {
  switch (strategy) {
    case 'email':
      return 'email()';
    case 'last4':
      return "partial(0, '****', 4)";
    case 'null':
      return 'default()';
    default:
      return 'default()';
  }
}

export function buildDatabaseControlPlan(asset = {}) {
  const policy = buildEffectivePolicy(asset);
  const name = splitSqlObjectName(asset);
  const tableName = `${bracketName(name.schema)}.${bracketName(name.object)}`;
  const maskingStatements = (policy.masking_actions || []).map((action) => ({
    column_name: action.column_name,
    strategy: action.strategy,
    statement: `ALTER TABLE ${tableName} ALTER COLUMN ${bracketName(action.column_name)} ADD MASKED WITH (FUNCTION = '${maskFunctionForStrategy(action.strategy)}');`,
  }));
  const accessRole = `${name.database || 'database'}_sensitive_data_reader`
    .replace(/[^a-zA-Z0-9_]/g, '_')
    .replace(/^_+|_+$/g, '');
  const rowLevelSecurity = policy.controls.row_level_security
    ? {
        enabled: true,
        predicate_function: `${bracketName(name.schema)}.[fn_${name.object}_classification_access]`,
        security_policy: `${bracketName(name.schema)}.[sp_${name.object}_classification_rls]`,
        predicate_logic:
          'Allow rows when the caller is a member of the approved sensitive-data role or owns/stewards the governed asset.',
        statements: [
          `CREATE FUNCTION ${bracketName(name.schema)}.[fn_${name.object}_classification_access](@owner sysname) RETURNS TABLE WITH SCHEMABINDING AS RETURN SELECT 1 AS fn_access_result WHERE IS_MEMBER('${accessRole}') = 1 OR @owner = USER_NAME();`,
          `CREATE SECURITY POLICY ${bracketName(name.schema)}.[sp_${name.object}_classification_rls] ADD FILTER PREDICATE ${bracketName(name.schema)}.[fn_${name.object}_classification_access]([owner]) ON ${tableName} WITH (STATE = ON);`,
        ],
      }
    : {
        enabled: false,
        reason:
          'No row-level restriction control is required by the current classification policy.',
        statements: [],
      };

  return {
    asset_id: policy.asset_id,
    database: name.database,
    schema: name.schema,
    object: name.object,
    platform: 'sql_server',
    enforcement_mode: 'advisory_sql_review_required',
    status:
      maskingStatements.length || rowLevelSecurity.enabled
        ? 'controls_recommended'
        : 'no_controls_required',
    access_role: accessRole,
    controls: policy.controls,
    masking: {
      enabled: maskingStatements.length > 0,
      statements: maskingStatements,
    },
    row_level_security: rowLevelSecurity,
    integration_steps: [
      'Review generated SQL with the data owner and DBA.',
      'Apply scripts through approved database deployment tooling.',
      'Record deployment evidence back to the governance catalog.',
      'Re-run policy effectiveness reporting after deployment.',
    ],
  };
}

export function buildPolicyEffectivenessReport(assets = new Map(), auditEvents = []) {
  const assetList = assets instanceof Map ? Array.from(assets.values()) : toArray(assets);
  const policies = assetList.map((asset) => buildEffectivePolicy(asset));
  const totalAssets = policies.length;
  const classifiedAssets = policies.filter((policy) => policy.classifications.length > 0).length;
  const governedAssets = policies.filter((policy) => policy.policy_templates.length > 0).length;
  const maskedAssets = policies.filter((policy) => policy.controls.mask).length;
  const restrictedAssets = policies.filter((policy) => policy.controls.restrict_access).length;
  const loggedAssets = policies.filter((policy) => policy.controls.log_access).length;
  const encryptedAssets = policies.filter((policy) => policy.controls.encrypt).length;
  const approvalAssets = policies.filter((policy) => policy.controls.approval_required).length;
  const templateCoverage = new Map();
  const classificationCoverage = new Map();

  for (const policy of policies) {
    for (const template of policy.policy_templates) {
      templateCoverage.set(template.id, (templateCoverage.get(template.id) || 0) + 1);
    }
    for (const classification of policy.classifications) {
      classificationCoverage.set(
        classification,
        (classificationCoverage.get(classification) || 0) + 1
      );
    }
  }

  const relevantAuditEvents = toArray(auditEvents).filter(
    (event) => event.action === 'pii_policy_evaluated'
  );
  const decisionCounts = {};
  for (const event of relevantAuditEvents) {
    const decision = event.details?.decision || 'evaluated';
    decisionCounts[decision] = (decisionCounts[decision] || 0) + 1;
  }

  const gaps = policies
    .filter((policy) => policy.classifications.length === 0 || policy.policy_templates.length === 0)
    .slice(0, 25)
    .map((policy) => ({
      asset_id: policy.asset_id,
      issue:
        policy.classifications.length === 0
          ? 'No classification detected'
          : 'No policy template matched detected classifications',
      recommended_action:
        policy.classifications.length === 0
          ? 'Review taxonomy rules or add manual classification'
          : 'Create or update a policy template for this classification',
    }));

  const percent = (value) => (totalAssets ? Math.round((value / totalAssets) * 1000) / 10 : 0);
  const coverageScore =
    Math.round(
      (percent(classifiedAssets) * 0.4 +
        percent(governedAssets) * 0.4 +
        percent(loggedAssets) * 0.2) *
        10
    ) / 10;

  return {
    total_assets: totalAssets,
    coverage_score: coverageScore,
    classification_coverage: {
      assets: classifiedAssets,
      percent: percent(classifiedAssets),
    },
    policy_coverage: {
      assets: governedAssets,
      percent: percent(governedAssets),
    },
    controls: {
      mask: maskedAssets,
      encrypt: encryptedAssets,
      restrict_access: restrictedAssets,
      log_access: loggedAssets,
      approval_required: approvalAssets,
    },
    template_coverage: Array.from(templateCoverage.entries()).map(([template_id, assets]) => ({
      template_id,
      assets,
    })),
    classification_counts: Array.from(classificationCoverage.entries()).map(
      ([classification, assets]) => ({
        classification,
        assets,
      })
    ),
    audit_decisions: {
      total: relevantAuditEvents.length,
      by_decision: decisionCounts,
    },
    gaps,
  };
}

export default {
  getPolicyTemplates,
  buildEffectivePolicy,
  evaluatePolicyDecision,
  buildDatabaseControlPlan,
  buildPolicyEffectivenessReport,
};
