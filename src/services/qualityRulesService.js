/**
 * Quality Rules Service
 * Defines and runs metadata/profile-driven data quality rules without retaining raw data.
 */

import { randomUUID } from 'crypto';

export const QUALITY_RULE_TYPES = [
  'null_percent',
  'cardinality_bounds',
  'range',
  'pattern',
  'uniqueness',
];

export const QUALITY_SEVERITIES = ['warning', 'critical', 'fail'];

const ruleStore = new Map();
const executionStore = [];
const incidentStore = [];
const deploymentStore = [];
const scheduleStore = new Map();
const profileHistoryStore = new Map();
const scorecardHistoryStore = new Map();

function nowIso() {
  return new Date().toISOString();
}

function toArray(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function normalizeNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function columnStats(asset = {}, columnName = '', profile = {}) {
  const profileColumn =
    profile?.columns?.[columnName] ||
    toArray(profile?.columns).find((column) => column.name === columnName || column.column_name === columnName) ||
    {};
  const assetColumn = toArray(asset.columns).find(
    (column) => column.name === columnName || column.column_name === columnName
  ) || {};
  return { ...assetColumn, ...profileColumn };
}

export function resetQualityRulesStore() {
  ruleStore.clear();
  executionStore.length = 0;
  incidentStore.length = 0;
  deploymentStore.length = 0;
  scheduleStore.clear();
  profileHistoryStore.clear();
  scorecardHistoryStore.clear();
}

export function upsertQualityRule(input = {}, actor = {}) {
  const id = input.id || randomUUID();
  if (!input.name && !input.label) {
    throw new Error('Quality rule name is required.');
  }
  if (!QUALITY_RULE_TYPES.includes(input.type)) {
    throw new Error(`Quality rule type must be one of: ${QUALITY_RULE_TYPES.join(', ')}`);
  }
  const existing = ruleStore.get(id);
  const rule = {
    id,
    name: input.name || input.label,
    asset_id: input.asset_id || input.assetId || '*',
    column_name: input.column_name || input.columnName || '',
    type: input.type,
    severity: QUALITY_SEVERITIES.includes(input.severity) ? input.severity : 'warning',
    enabled: input.enabled !== false,
    threshold: input.threshold || {},
    schedule: input.schedule || null,
    alert_routes: toArray(input.alert_routes || input.alertRoutes),
    version: existing ? existing.version + 1 : 1,
    created_at: existing?.created_at || nowIso(),
    updated_at: nowIso(),
    changed_by: actor.email || actor.userId || 'system',
  };
  ruleStore.set(id, rule);
  return { ...rule };
}

export function deleteQualityRule(id) {
  return ruleStore.delete(id);
}

export function deployQualityRule(id, actor = {}) {
  const rule = ruleStore.get(id);
  if (!rule) {
    throw new Error(`Quality rule '${id}' not found.`);
  }
  const deployment = {
    id: randomUUID(),
    rule_id: id,
    rule_version: rule.version,
    status: 'deployed',
    deployed_by: actor.email || actor.userId || 'system',
    deployed_at: nowIso(),
    evidence: {
      rule_name: rule.name,
      asset_id: rule.asset_id,
      type: rule.type,
      severity: rule.severity,
      threshold: rule.threshold,
    },
  };
  deploymentStore.unshift(deployment);
  rule.deployed_version = rule.version;
  rule.deployed_at = deployment.deployed_at;
  ruleStore.set(id, rule);
  return { ...deployment };
}

export function listQualityRuleDeployments(filter = {}) {
  return deploymentStore
    .filter((deployment) => !filter.rule_id || deployment.rule_id === filter.rule_id)
    .map((deployment) => ({ ...deployment, evidence: { ...deployment.evidence } }));
}

export function upsertQualitySchedule(input = {}, actor = {}) {
  const id = input.id || randomUUID();
  const schedule = {
    id,
    name: input.name || 'Quality validation schedule',
    asset_id: input.asset_id || input.assetId || '*',
    cadence: input.cadence || 'daily',
    enabled: input.enabled !== false,
    rule_ids: toArray(input.rule_ids || input.ruleIds),
    notification_routes: toArray(input.notification_routes || input.notificationRoutes),
    created_at: scheduleStore.get(id)?.created_at || nowIso(),
    updated_at: nowIso(),
    changed_by: actor.email || actor.userId || 'system',
  };
  scheduleStore.set(id, schedule);
  return { ...schedule };
}

export function listQualitySchedules() {
  return Array.from(scheduleStore.values()).map((schedule) => ({ ...schedule }));
}

export function listQualityRules(filter = {}) {
  return Array.from(ruleStore.values()).filter((rule) => {
    if (filter.asset_id && rule.asset_id !== '*' && rule.asset_id !== filter.asset_id) return false;
    if (filter.enabled !== undefined && rule.enabled !== filter.enabled) return false;
    return true;
  }).map((rule) => ({ ...rule }));
}

function evaluateThreshold(rule, stats) {
  const threshold = rule.threshold || {};
  switch (rule.type) {
    case 'null_percent': {
      const rowCount = normalizeNumber(stats.row_count || stats.rowCount, 0);
      const nullCount = normalizeNumber(stats.null_count || stats.nullCount, 0);
      const actual = stats.null_percent ?? stats.null_pct ?? (rowCount ? (nullCount / rowCount) * 100 : 0);
      const max = normalizeNumber(threshold.max ?? threshold.max_percent, 0);
      return { actual: normalizeNumber(actual), expected: `<= ${max}%`, passing: normalizeNumber(actual) <= max };
    }
    case 'cardinality_bounds': {
      const actual = normalizeNumber(stats.distinct_count ?? stats.cardinality);
      const min = normalizeNumber(threshold.min, 0);
      const max = normalizeNumber(threshold.max, Number.MAX_SAFE_INTEGER);
      return { actual, expected: `${min} to ${max}`, passing: actual >= min && actual <= max };
    }
    case 'range': {
      const minActual = normalizeNumber(stats.min ?? stats.minimum);
      const maxActual = normalizeNumber(stats.max ?? stats.maximum);
      const min = normalizeNumber(threshold.min, -Number.MAX_SAFE_INTEGER);
      const max = normalizeNumber(threshold.max, Number.MAX_SAFE_INTEGER);
      return {
        actual: { min: minActual, max: maxActual },
        expected: `${min} to ${max}`,
        passing: minActual >= min && maxActual <= max,
      };
    }
    case 'pattern': {
      const actual = normalizeNumber(stats.pattern_match_percent ?? stats.match_percent);
      const min = normalizeNumber(threshold.min_match_percent ?? threshold.min_percent, 100);
      return { actual, expected: `>= ${min}% match`, passing: actual >= min };
    }
    case 'uniqueness': {
      const rowCount = normalizeNumber(stats.row_count || stats.rowCount, 0);
      const distinctCount = normalizeNumber(stats.distinct_count ?? stats.cardinality, 0);
      const actual = stats.unique_percent ?? (rowCount ? (distinctCount / rowCount) * 100 : 0);
      const min = normalizeNumber(threshold.min_percent, 100);
      return { actual: normalizeNumber(actual), expected: `>= ${min}% unique`, passing: normalizeNumber(actual) >= min };
    }
    default:
      return { actual: null, expected: 'known quality rule type', passing: false };
  }
}

export function evaluateQualityRule(rule = {}, asset = {}, profile = {}) {
  const stats = columnStats(asset, rule.column_name, profile);
  const result = evaluateThreshold(rule, stats);
  return {
    rule_id: rule.id,
    rule_name: rule.name,
    asset_id: rule.asset_id === '*' ? asset.id : rule.asset_id,
    column_name: rule.column_name,
    type: rule.type,
    severity: rule.severity,
    status: result.passing ? 'passed' : rule.severity === 'warning' ? 'warning' : 'failed',
    passing: result.passing,
    actual: result.actual,
    expected: result.expected,
    evaluated_at: nowIso(),
  };
}

export function runQualityRules(assets = new Map(), options = {}) {
  const assetMap = assets instanceof Map ? assets : new Map();
  const profiles = options.profiles || {};
  const targetAssetId = options.asset_id || options.assetId || '';
  const selectedRuleIds = new Set(toArray(options.rule_ids || options.ruleIds));
  const rules = listQualityRules({ enabled: true }).filter((rule) => {
    if (selectedRuleIds.size && !selectedRuleIds.has(rule.id)) return false;
    if (targetAssetId && rule.asset_id !== '*' && rule.asset_id !== targetAssetId) return false;
    return true;
  });
  const results = [];

  for (const rule of rules) {
    const assetIds = rule.asset_id === '*' ? Array.from(assetMap.keys()) : [rule.asset_id];
    for (const assetId of assetIds) {
      const asset = assetMap.get(assetId);
      if (!asset) continue;
      const result = evaluateQualityRule(rule, asset, profiles[assetId] || profiles[asset.name] || {});
      results.push(result);
      if (!result.passing) {
        incidentStore.push({
          id: randomUUID(),
          rule_id: rule.id,
          asset_id: result.asset_id,
          column_name: result.column_name,
          severity: result.severity,
          status: 'open',
          message: `${result.rule_name} ${result.status}: expected ${result.expected}, actual ${JSON.stringify(result.actual)}`,
          alert_routes: rule.alert_routes,
          created_at: nowIso(),
        });
      }
    }
  }

  const execution = {
    id: randomUUID(),
    status: results.some((result) => result.status === 'failed') ? 'failed' : results.some((result) => result.status === 'warning') ? 'warning' : 'passed',
    evaluated_rules: rules.length,
    evaluated_results: results.length,
    passed: results.filter((result) => result.passing).length,
    failed: results.filter((result) => !result.passing).length,
    results,
    executed_at: nowIso(),
  };
  executionStore.unshift(execution);
  return execution;
}

export function listQualityIncidents(filter = {}) {
  return incidentStore
    .filter((incident) => !filter.status || incident.status === filter.status)
    .map((incident) => ({ ...incident }));
}

export function listQualityExecutions() {
  return executionStore.map((execution) => ({ ...execution, results: [...execution.results] }));
}

export function buildProfileSummary(profile = {}) {
  const columns = Array.isArray(profile.columns)
    ? profile.columns
    : Object.entries(profile.columns || {}).map(([name, stats]) => ({ name, ...stats }));
  const profiledColumns = columns.length;
  const totalNullPercent = columns.reduce(
    (sum, column) => sum + normalizeNumber(column.null_percent ?? column.null_pct, 0),
    0
  );
  const numericColumns = columns.filter(
    (column) => column.min !== undefined || column.max !== undefined || column.mean !== undefined
  ).length;
  const highNullColumns = columns
    .filter((column) => normalizeNumber(column.null_percent ?? column.null_pct, 0) >= 25)
    .map((column) => column.name || column.column_name);
  const lowCardinalityColumns = columns
    .filter((column) => normalizeNumber(column.distinct_count ?? column.cardinality, 0) > 0)
    .filter((column) => {
      const rowCount = normalizeNumber(column.row_count || profile.row_count, 0);
      const distinct = normalizeNumber(column.distinct_count ?? column.cardinality, 0);
      return rowCount > 0 && distinct / rowCount <= 0.02;
    })
    .map((column) => column.name || column.column_name);

  const summary = {
    asset_id: profile.asset_id || profile.assetId || '',
    row_count: normalizeNumber(profile.row_count || profile.rowCount, 0),
    profiled_columns: profiledColumns,
    numeric_columns: numericColumns,
    average_null_percent: profiledColumns ? Math.round((totalNullPercent / profiledColumns) * 10) / 10 : 0,
    high_null_columns: highNullColumns,
    low_cardinality_columns: lowCardinalityColumns,
    generated_at: nowIso(),
  };
  if (summary.asset_id) {
    const history = profileHistoryStore.get(summary.asset_id) || [];
    history.unshift(summary);
    profileHistoryStore.set(summary.asset_id, history.slice(0, 52));
  }
  return summary;
}

export function detectQualityAnomalies(currentProfile = {}, baselineProfile = {}, options = {}) {
  const sensitivity = normalizeNumber(options.sensitivity, 1);
  const current = buildProfileSummary(currentProfile);
  const baseline = buildProfileSummary(baselineProfile);
  const findings = [];
  const rowDeltaPercent = baseline.row_count
    ? Math.round(((current.row_count - baseline.row_count) / baseline.row_count) * 1000) / 10
    : 0;
  const nullDelta = Math.round((current.average_null_percent - baseline.average_null_percent) * 10) / 10;
  const rowThreshold = 25 / sensitivity;
  const nullThreshold = 10 / sensitivity;

  if (Math.abs(rowDeltaPercent) >= rowThreshold) {
    findings.push({
      type: 'row_count_drift',
      severity: Math.abs(rowDeltaPercent) >= rowThreshold * 2 ? 'critical' : 'warning',
      message: `Row count changed ${rowDeltaPercent}% from baseline.`,
      actual: current.row_count,
      baseline: baseline.row_count,
    });
  }

  if (Math.abs(nullDelta) >= nullThreshold) {
    findings.push({
      type: 'null_rate_drift',
      severity: Math.abs(nullDelta) >= nullThreshold * 2 ? 'critical' : 'warning',
      message: `Average null rate changed ${nullDelta} percentage points.`,
      actual: current.average_null_percent,
      baseline: baseline.average_null_percent,
    });
  }

  for (const column of current.high_null_columns) {
    if (!baseline.high_null_columns.includes(column)) {
      findings.push({
        type: 'new_high_null_column',
        severity: 'warning',
        column,
        message: `${column} now has elevated nulls.`,
      });
    }
  }

  return {
    asset_id: current.asset_id || baseline.asset_id,
    sensitivity,
    status: findings.some((finding) => finding.severity === 'critical')
      ? 'critical'
      : findings.length
        ? 'warning'
        : 'normal',
    findings,
    current,
    baseline,
  };
}

export function buildQualityScorecard(profile = {}, validationExecution = null) {
  const summary = buildProfileSummary(profile);
  const validationPenalty = validationExecution
    ? Math.min(35, normalizeNumber(validationExecution.failed, 0) * 8)
    : 0;
  const completeness = Math.max(0, 100 - summary.average_null_percent);
  const consistency = Math.max(0, 100 - summary.high_null_columns.length * 8);
  const uniqueness = Math.max(0, 100 - summary.low_cardinality_columns.length * 4);
  const overall = Math.max(
    0,
    Math.round((completeness * 0.4 + consistency * 0.25 + uniqueness * 0.2 + 100 * 0.15 - validationPenalty) * 10) / 10
  );
  const scorecard = {
    asset_id: summary.asset_id,
    overall_score: overall,
    dimensions: {
      completeness: Math.round(completeness * 10) / 10,
      consistency: Math.round(consistency * 10) / 10,
      uniqueness: Math.round(uniqueness * 10) / 10,
      timeliness: 100,
    },
    fitness: {
      finance_reporting: overall >= 90 ? 'fit' : overall >= 75 ? 'review' : 'not_fit',
      analytics: overall >= 80 ? 'fit' : overall >= 65 ? 'review' : 'not_fit',
      ml_training: overall >= 85 && summary.row_count >= 1000 ? 'fit' : 'review',
    },
    summary,
  };
  if (scorecard.asset_id) {
    const history = scorecardHistoryStore.get(scorecard.asset_id) || [];
    history.unshift({ ...scorecard, generated_at: nowIso() });
    scorecardHistoryStore.set(scorecard.asset_id, history.slice(0, 52));
  }
  return scorecard;
}

export function getQualityTrend(assetId) {
  const profiles = profileHistoryStore.get(assetId) || [];
  const scorecards = scorecardHistoryStore.get(assetId) || [];
  return {
    asset_id: assetId,
    profile_points: profiles.map((profile) => ({
      generated_at: profile.generated_at,
      row_count: profile.row_count,
      average_null_percent: profile.average_null_percent,
      profiled_columns: profile.profiled_columns,
    })),
    score_points: scorecards.map((scorecard) => ({
      generated_at: scorecard.generated_at,
      overall_score: scorecard.overall_score,
      dimensions: scorecard.dimensions,
    })),
  };
}

export function exportProfile(profile = {}, format = 'json') {
  const summary = buildProfileSummary(profile);
  const payload = {
    exported_at: nowIso(),
    format,
    profile,
    summary,
  };
  if (format === 'csv') {
    const columns = Array.isArray(profile.columns)
      ? profile.columns
      : Object.entries(profile.columns || {}).map(([name, stats]) => ({ name, ...stats }));
    const header = ['asset_id', 'column_name', 'row_count', 'null_percent', 'distinct_count', 'min', 'max', 'mean'];
    const rows = columns.map((column) =>
      [
        summary.asset_id,
        column.name || column.column_name || '',
        column.row_count || profile.row_count || '',
        column.null_percent ?? column.null_pct ?? '',
        column.distinct_count ?? column.cardinality ?? '',
        column.min ?? '',
        column.max ?? '',
        column.mean ?? '',
      ].join(',')
    );
    return { ...payload, content_type: 'text/csv', content: [header.join(','), ...rows].join('\n') };
  }
  return { ...payload, content_type: 'application/json', content: JSON.stringify(payload, null, 2) };
}

export function exportScorecard(scorecard = {}, format = 'json') {
  const payload = {
    exported_at: nowIso(),
    report_type: 'data_quality_scorecard',
    format,
    scorecard,
    compliance_summary: {
      asset_id: scorecard.asset_id,
      overall_score: scorecard.overall_score,
      fitness: scorecard.fitness || {},
      dimensions: scorecard.dimensions || {},
      high_null_columns: scorecard.summary?.high_null_columns || [],
      low_cardinality_columns: scorecard.summary?.low_cardinality_columns || [],
    },
  };

  if (format === 'csv') {
    const dimensions = scorecard.dimensions || {};
    const fitness = scorecard.fitness || {};
    const rows = [
      ['section', 'key', 'value'],
      ['scorecard', 'asset_id', scorecard.asset_id || ''],
      ['scorecard', 'overall_score', scorecard.overall_score ?? ''],
      ...Object.entries(dimensions).map(([key, value]) => ['dimension', key, value ?? '']),
      ...Object.entries(fitness).map(([key, value]) => ['fitness', key, value || '']),
      ['summary', 'high_null_columns', (scorecard.summary?.high_null_columns || []).join('|')],
      ['summary', 'low_cardinality_columns', (scorecard.summary?.low_cardinality_columns || []).join('|')],
    ];
    return {
      ...payload,
      content_type: 'text/csv',
      content: rows.map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n'),
    };
  }

  return { ...payload, content_type: 'application/json', content: JSON.stringify(payload, null, 2) };
}

export function evaluateQualitySla(scorecard = {}, sla = {}) {
  const minScore = normalizeNumber(sla.min_score ?? sla.minScore, 80);
  const requiredFitness = sla.required_fitness || sla.requiredFitness || null;
  const useCase = sla.use_case || sla.useCase || 'analytics';
  const breaches = [];
  if (normalizeNumber(scorecard.overall_score, 0) < minScore) {
    breaches.push({
      type: 'quality_score_breach',
      severity: 'critical',
      message: `Quality score ${scorecard.overall_score} is below SLA minimum ${minScore}.`,
    });
  }
  if (requiredFitness && scorecard.fitness?.[useCase] !== requiredFitness) {
    breaches.push({
      type: 'fitness_breach',
      severity: 'warning',
      message: `${useCase} fitness is ${scorecard.fitness?.[useCase] || 'unknown'}, expected ${requiredFitness}.`,
    });
  }
  for (const breach of breaches) {
    incidentStore.push({
      id: randomUUID(),
      rule_id: 'quality-sla',
      asset_id: scorecard.asset_id,
      column_name: '',
      severity: breach.severity,
      status: 'open',
      message: breach.message,
      alert_routes: toArray(sla.alert_routes || sla.alertRoutes),
      created_at: nowIso(),
    });
  }
  return {
    asset_id: scorecard.asset_id,
    status: breaches.length ? 'breached' : 'met',
    breaches,
    evaluated_at: nowIso(),
  };
}

export default {
  QUALITY_RULE_TYPES,
  QUALITY_SEVERITIES,
  resetQualityRulesStore,
  upsertQualityRule,
  deleteQualityRule,
  deployQualityRule,
  listQualityRuleDeployments,
  upsertQualitySchedule,
  listQualitySchedules,
  listQualityRules,
  evaluateQualityRule,
  runQualityRules,
  listQualityIncidents,
  listQualityExecutions,
  buildProfileSummary,
  detectQualityAnomalies,
  buildQualityScorecard,
  getQualityTrend,
  exportProfile,
  exportScorecard,
  evaluateQualitySla,
};
