/**
 * Classification Observability Service
 * Writes metadata-only audit/activity events for classification and PII policy decisions.
 */

import { logAuditEvent } from './adminService.js';
import { logActivity } from './activityService.js';

const CLASSIFICATION_ACTIONS = new Set([
  'classification_asset_evaluated',
  'classification_bulk_evaluated',
  'classification_rules_run',
  'pii_policy_evaluated',
  'pii_mask_preview_generated',
  'column_semantics_evaluated',
]);

function userIdFromRequest(req) {
  return req?.user?.id || req?.user?.userId || req?.user?.email || 'system';
}

function compactAction(action) {
  return CLASSIFICATION_ACTIONS.has(action) ? action : 'classification_event';
}

function sanitizeColumnName(value) {
  return String(value || '').slice(0, 256);
}

function sanitizeDetails(details = {}) {
  const sanitized = {
    asset_id: details.asset_id || details.assetId || null,
    evaluated_assets: Number(details.evaluated_assets || details.count || 0),
    total_assets: Number(details.total_assets || 0),
    classification_count: Number(details.classification_count || 0),
    pii_columns: Number(details.pii_columns || 0),
    metric_columns: Number(details.metric_columns || 0),
    requires_masking: Boolean(details.requires_masking),
    policy: details.policy || null,
    decision: details.decision || null,
    obligations: Array.isArray(details.obligations)
      ? [...new Set(details.obligations.map((item) => String(item).slice(0, 80)))].slice(0, 20)
      : [],
    strategies: Array.isArray(details.strategies)
      ? [...new Set(details.strategies.map((item) => String(item).slice(0, 80)))].slice(0, 20)
      : [],
    columns: Array.isArray(details.columns)
      ? [...new Set(details.columns.map(sanitizeColumnName))].slice(0, 100)
      : [],
    source: details.source || 'classification_api',
  };

  return Object.fromEntries(
    Object.entries(sanitized).filter(([, value]) => {
      if (Array.isArray(value)) return value.length > 0;
      return value !== null && value !== undefined && value !== '' && value !== 0;
    })
  );
}

export function logClassificationDecision(req, action, details = {}) {
  const userId = userIdFromRequest(req);
  const normalizedAction = compactAction(action);
  const resourceId = details.asset_id || details.assetId || 'classification';
  const safeDetails = sanitizeDetails(details);

  const audit = logAuditEvent(userId, normalizedAction, safeDetails);
  const activity = logActivity(userId, normalizedAction, resourceId, safeDetails);

  return { audit, activity };
}

export function piiPlanAuditDetails(maskPlan = {}) {
  const actions = Array.isArray(maskPlan.masking_actions) ? maskPlan.masking_actions : [];
  return {
    asset_id: maskPlan.asset_id,
    policy: maskPlan.policy,
    pii_columns: maskPlan.summary?.pii_columns || 0,
    total_assets: 0,
    requires_masking: maskPlan.summary?.requires_masking,
    columns: actions.map((action) => action.column_name),
    strategies: actions.map((action) => action.strategy),
  };
}

export function columnSemanticsAuditDetails(semantics = {}) {
  const metrics = Array.isArray(semantics.metric_columns) ? semantics.metric_columns : [];
  return {
    asset_id: semantics.asset_id,
    metric_columns: metrics.length,
    columns: metrics.map((column) => column.column_name),
  };
}

export default {
  logClassificationDecision,
  piiPlanAuditDetails,
  columnSemanticsAuditDetails,
};
