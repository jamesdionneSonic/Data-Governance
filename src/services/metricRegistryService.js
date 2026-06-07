/**
 * Metric Registry Service
 * Builds a metadata-only registry of metric/measure columns from the loaded catalog.
 */

import { analyzeColumnImpact } from './columnImpactService.js';
import { classifyColumnSemantic, assetColumns } from './piiPolicyService.js';
import { getDownstreamDependents, getUpstreamDependencies } from './lineageService.js';

function toArray(value) {
  if (Array.isArray(value)) return value.filter((item) => item !== undefined && item !== null);
  if (value === undefined || value === null || value === '') return [];
  return [value];
}

function text(value) {
  return String(value ?? '').trim();
}

function lower(value) {
  return text(value).toLowerCase();
}

function objectIdFor(mapKey, object = {}) {
  return text(object.id || mapKey);
}

function objectLabel(objectId, object = {}) {
  const parts = [object.database, object.schema, object.name || object.objectName].map(text).filter(Boolean);
  return parts.length ? parts.join('.') : objectId;
}

function columnNameFor(column = {}, index = 0) {
  return text(column.name || column.column_name || column.columnName || column.id || `column_${index + 1}`);
}

function columnTypeFor(column = {}) {
  return text(column.data_type || column.dataType || column.type || column.system_type || 'unknown');
}

function columnIdFor(objectId, column = {}, index = 0) {
  return text(column.column_id || column.columnId || column.id || `${objectId}.${columnNameFor(column, index)}`);
}

function confidenceBucket(confidence) {
  if (confidence >= 0.85) return 'high';
  if (confidence >= 0.65) return 'medium';
  return 'low';
}

function metricState(column = {}, semantic = {}) {
  const existingSemantic = lower(column.semantic_type || column.semanticType);
  const tags = toArray(column.tags || column.classifications || column.classification_tags)
    .map(lower);
  if (
    column.is_metric === true ||
    existingSemantic === 'metric' ||
    tags.some((tag) => ['metric', 'measure', 'kpi'].includes(tag))
  ) {
    return 'confirmed';
  }
  if (semantic.semantic_type === 'metric') return 'inferred';
  return 'candidate';
}

function evidenceForMetric(column = {}, semantic = {}, state = 'candidate') {
  const evidence = toArray(semantic.evidence).map((item) => ({
    source: item,
    confidence: semantic.confidence ?? 0.5,
  }));
  if (column.semantic_type || column.semanticType) {
    evidence.push({
      source: 'column_semantic_type',
      value: column.semantic_type || column.semanticType,
      confidence: 0.9,
    });
  }
  if (column.is_metric === true) {
    evidence.push({ source: 'column_is_metric_flag', confidence: 0.95 });
  }
  if (state === 'candidate' && evidence.length === 0) {
    evidence.push({ source: 'numeric_column_candidate', confidence: semantic.confidence ?? 0.55 });
  }
  return evidence;
}

function sourceExpression(column = {}) {
  return text(
    column.source_expression ||
      column.expression ||
      column.calculation ||
      column.formula ||
      column.transform_expression ||
      column.sql_expression
  );
}

function compact(value, maxLength = 280) {
  const normalized = text(value).replace(/\s+/g, ' ');
  return normalized.length > maxLength ? `${normalized.slice(0, maxLength - 3)}...` : normalized;
}

function findColumnLineage(objects = new Map(), metric = {}) {
  const key = lower(metric.column_id);
  const upstream = [];
  const downstream = [];

  for (const [mapKey, object] of objects.entries()) {
    const processId = objectIdFor(mapKey, object);
    for (const edge of toArray(object.column_lineage)) {
      const record = {
        process_id: edge.process_id || processId,
        process_name: object.name || processId,
        process_type: object.type || 'process',
        source_column_id: edge.source_column_id,
        target_column_id: edge.target_column_id,
        transform_type: edge.transform_type || 'unknown',
        confidence: edge.confidence ?? null,
        validation_status: edge.validation_status || 'validated',
        evidence_type: edge.evidence_type || 'column_lineage',
        evidence_text: compact(edge.evidence_text || edge.expression),
      };
      if (lower(edge.target_column_id) === key) upstream.push(record);
      if (lower(edge.source_column_id) === key) downstream.push(record);
    }
  }

  return { upstream, downstream };
}

function findColumnUsage(objects = new Map(), metric = {}) {
  const key = lower(metric.column_id);
  const usage = [];
  for (const [mapKey, object] of objects.entries()) {
    const objectId = objectIdFor(mapKey, object);
    for (const record of toArray(object.column_usage)) {
      if (lower(record.column_id) !== key) continue;
      usage.push({
        object_id: objectId,
        object_name: object.name || objectId,
        object_type: object.type || 'object',
        process_id: record.process_id || objectId,
        usage_type: record.usage_type || 'referenced',
        usage_context: record.usage_context || '',
        validation_status: record.validation_status || 'validated',
        evidence_type: record.evidence_type || 'column_usage',
        evidence_text: compact(record.evidence_text || record.expression),
      });
    }
  }
  return usage;
}

function buildMetricRecord(mapKey, object, column, index, semantic, lineageGraph) {
  const objectId = objectIdFor(mapKey, object);
  const columnName = columnNameFor(column, index);
  const state = metricState(column, semantic);
  const confidence = Number(semantic.confidence ?? (state === 'confirmed' ? 0.9 : 0.62));
  const downstreamIds = getDownstreamDependenciesSafe(objectId, lineageGraph, 3);
  const upstreamIds = getUpstreamDependenciesSafe(objectId, lineageGraph, 2);

  return {
    metric_id: `${objectId}.${columnName}`.replace(/\s+/g, '_'),
    object_id: objectId,
    object_label: objectLabel(objectId, object),
    object_name: text(object.name || object.objectName || objectId),
    object_type: text(object.type || 'object'),
    server: text(object.server || object.serverName || object.server_name || ''),
    database: text(object.database || ''),
    schema: text(object.schema || object.schemaName || object.object_schema || ''),
    column_id: columnIdFor(objectId, column, index),
    column_name: columnName,
    data_type: columnTypeFor(column),
    nullable: column.nullable ?? column.is_nullable ?? column.isNullable ?? null,
    semantic_type: semantic.semantic_type || column.semantic_type || 'metric_candidate',
    metric_state: state,
    confidence,
    confidence_label: confidenceBucket(confidence),
    business_name: text(column.business_name || column.businessName || ''),
    definition: text(column.description || column.business_definition || column.definition || ''),
    source_expression: sourceExpression(column),
    owner: text(object.owner || 'unknown'),
    steward: text(object.steward || ''),
    business_domain: text(object.business_domain || object.domain || ''),
    tags: toArray(column.tags || column.classifications || column.classification_tags),
    evidence: evidenceForMetric(column, semantic, state),
    profile: {
      row_count: column.row_count ?? object.row_count ?? null,
      null_count: column.null_count ?? null,
      distinct_count: column.distinct_count ?? null,
      min: column.min ?? null,
      max: column.max ?? null,
      profiled: Boolean(column.row_count || column.null_count || column.distinct_count || column.min || column.max),
    },
    lineage: {
      upstream_object_count: upstreamIds.length,
      downstream_object_count: downstreamIds.length,
    },
  };
}

function getDownstreamDependenciesSafe(objectId, lineageGraph, depth) {
  try {
    return getDownstreamDependents(objectId, lineageGraph, depth);
  } catch {
    return [];
  }
}

function getUpstreamDependenciesSafe(objectId, lineageGraph, depth) {
  try {
    return getUpstreamDependencies(objectId, lineageGraph, depth);
  } catch {
    return [];
  }
}

function summarizeRegistry(metrics = []) {
  const confirmed = metrics.filter((metric) => metric.metric_state === 'confirmed').length;
  const inferred = metrics.filter((metric) => metric.metric_state === 'inferred').length;
  const candidates = metrics.filter((metric) => metric.metric_state === 'candidate').length;
  const highConfidence = metrics.filter((metric) => metric.confidence_label === 'high').length;

  return {
    total_metrics: metrics.length,
    confirmed_metrics: confirmed,
    inferred_metrics: inferred,
    metric_candidates: candidates,
    high_confidence_metrics: highConfidence,
    tables_with_metrics: new Set(metrics.map((metric) => metric.object_id)).size,
    databases: new Set(metrics.map((metric) => metric.database).filter(Boolean)).size,
  };
}

function sortMetrics(metrics = []) {
  return [...metrics].sort(
    (left, right) =>
      String(left.database || '').localeCompare(String(right.database || '')) ||
      String(left.schema || '').localeCompare(String(right.schema || '')) ||
      String(left.object_name || '').localeCompare(String(right.object_name || '')) ||
      String(left.column_name || '').localeCompare(String(right.column_name || ''))
  );
}

function matchesQuery(metric, query) {
  if (!query) return true;
  const haystack = [
    metric.metric_id,
    metric.object_id,
    metric.object_label,
    metric.column_name,
    metric.business_name,
    metric.definition,
    metric.database,
    metric.schema,
    metric.business_domain,
    ...metric.tags,
  ]
    .join(' ')
    .toLowerCase();
  return haystack.includes(lower(query));
}

export function buildMetricRegistry(objects = new Map(), lineageGraph = new Map(), filters = {}) {
  const metrics = [];
  for (const [mapKey, object] of objects.entries()) {
    for (const [index, column] of assetColumns(object).entries()) {
      const semantic = classifyColumnSemantic(column);
      const semanticType = lower(column.semantic_type || column.semanticType || semantic.semantic_type);
      const isMetric =
        semantic.is_metric ||
        column.is_metric === true ||
        ['metric', 'metric_candidate', 'measure_candidate'].includes(semanticType);
      if (!isMetric) continue;
      metrics.push(buildMetricRecord(mapKey, object, column, index, semantic, lineageGraph));
    }
  }

  const database = lower(filters.database);
  const objectId = lower(filters.object_id || filters.objectId || filters.table || filters.asset_id);
  const state = lower(filters.state);
  const query = lower(filters.q || filters.query);
  const limit = Math.max(1, Math.min(Number(filters.limit) || 100, 500));
  const offset = Math.max(0, Number(filters.offset) || 0);
  const filtered = sortMetrics(metrics)
    .filter((metric) => !database || lower(metric.database) === database)
    .filter((metric) => !objectId || lower(metric.object_id) === objectId || lower(metric.object_label) === objectId)
    .filter((metric) => !state || lower(metric.metric_state) === state)
    .filter((metric) => matchesQuery(metric, query));

  return {
    generated_at: new Date().toISOString(),
    filters: {
      database: filters.database || null,
      object_id: filters.object_id || filters.objectId || filters.table || filters.asset_id || null,
      state: filters.state || null,
      q: filters.q || filters.query || null,
    },
    summary: summarizeRegistry(filtered),
    pagination: {
      total: filtered.length,
      limit,
      offset,
    },
    metrics: filtered.slice(offset, offset + limit),
  };
}

export function buildTableMetricAnswer(objects = new Map(), lineageGraph = new Map(), objectId = '') {
  const object = objects.get(objectId);
  if (!object) return null;
  const registry = buildMetricRegistry(objects, lineageGraph, { object_id: objectId, limit: 250 });
  const { metrics } = registry;
  const confirmed = metrics.filter((metric) => metric.metric_state === 'confirmed');
  const candidates = metrics.filter((metric) => metric.metric_state !== 'confirmed');
  const label = objectLabel(objectId, object);

  return {
    generated_at: new Date().toISOString(),
    object_id: objectId,
    object_label: label,
    summary: {
      total_metric_columns: metrics.length,
      confirmed_metrics: confirmed.length,
      inferred_or_candidate_metrics: candidates.length,
      can_answer: assetColumns(object).length > 0,
    },
    answer:
      metrics.length > 0
        ? `${label} has ${metrics.length} metric-like column${metrics.length === 1 ? '' : 's'} in the catalog. ${confirmed.length} are explicit metrics and ${candidates.length} are inferred numeric measures that should be steward-reviewed.`
        : `${label} has no metric columns detected from the current column metadata.`,
    caveats:
      assetColumns(object).length > 0
        ? []
        : ['No column inventory is available for this object. Re-run extraction with column metadata enabled.'],
    rows: metrics.map((metric) => ({
      column: metric.column_name,
      data_type: metric.data_type,
      state: metric.metric_state,
      confidence: metric.confidence,
      why: metric.evidence.map((item) => item.source).join(', '),
      definition: metric.definition,
    })),
  };
}

export function explainMetricLogic(objects = new Map(), lineageGraph = new Map(), request = {}) {
  const objectId = request.object_id || request.objectId || request.asset_id || request.table;
  const columnName = request.column_name || request.columnName || request.column;
  const tableAnswer = buildTableMetricAnswer(objects, lineageGraph, objectId);
  if (!tableAnswer) return null;

  const registry = tableAnswer.rows.length
    ? buildMetricRegistry(objects, lineageGraph, { object_id: objectId, limit: 250 })
    : { metrics: [] };
  const { metrics } = registry;
  const metric = metrics.find(
    (candidate) => !columnName || lower(candidate.column_name) === lower(columnName)
  );
  if (!metric) {
    return {
      generated_at: new Date().toISOString(),
      object_id: objectId,
      column_name: columnName || null,
      answer: columnName
        ? `I could not find ${columnName} as a metric column on ${tableAnswer.object_label}.`
        : `I could not find a metric column on ${tableAnswer.object_label}.`,
      caveats: tableAnswer.caveats,
      logic: null,
    };
  }

  const columnLineage = findColumnLineage(objects, metric);
  const usage = findColumnUsage(objects, metric);
  const expression = metric.source_expression;
  const upstreamSources = columnLineage.upstream.slice(0, 25);
  const downstreamConsumers = [...columnLineage.downstream, ...usage].slice(0, 25);
  let logicKind = 'metadata_inference';
  if (upstreamSources.length > 0) {
    logicKind = 'column_lineage';
  }
  if (expression) {
    logicKind = 'explicit_expression';
  }

  return {
    generated_at: new Date().toISOString(),
    metric,
    logic: {
      logic_kind: logicKind,
      expression: expression || null,
      upstream_sources: upstreamSources,
      downstream_consumers: downstreamConsumers,
      confidence: metric.confidence,
      confidence_label: metric.confidence_label,
    },
    answer: expression
      ? `${metric.object_label}.${metric.column_name} is treated as a metric because the catalog has an expression/source calculation for it and the column semantics classify it as ${metric.semantic_type}.`
      : `${metric.object_label}.${metric.column_name} is treated as a ${metric.metric_state} metric from metadata evidence: ${metric.evidence.map((item) => item.source).join(', ')}.`,
    caveats:
      expression || upstreamSources.length > 0
        ? []
        : ['No formula text or validated column-level upstream lineage is currently captured for this metric.'],
  };
}

export function assessMetricFormulaImpact(objects = new Map(), lineageGraph = new Map(), request = {}) {
  const objectId = request.object_id || request.objectId || request.asset_id || request.table;
  const columnName = request.column_name || request.columnName || request.column;
  const changeType = request.change_type || request.changeType || 'change_data_type';
  const logic = explainMetricLogic(objects, lineageGraph, { object_id: objectId, column_name: columnName });
  if (!logic?.metric) return logic;

  let columnImpact = null;
  try {
    columnImpact = analyzeColumnImpact(objects, {
      object_id: objectId,
      column_name: logic.metric.column_name,
      change_type: changeType,
    });
  } catch (err) {
    columnImpact = {
      error: err.message,
      summary: {
        impacted_count: logic.metric.lineage.downstream_object_count,
        highest_severity: logic.metric.lineage.downstream_object_count > 10 ? 'high' : 'medium',
      },
      impacts: [],
      unresolved_risks: [],
    };
  }

  const downstreamCount = columnImpact.summary?.impacted_count || logic.metric.lineage.downstream_object_count || 0;
  let severity = columnImpact.summary?.highest_severity;
  if (!severity && downstreamCount > 20) {
    severity = 'high';
  }
  if (!severity && downstreamCount > 0) {
    severity = 'medium';
  }
  if (!severity) {
    severity = 'low';
  }

  return {
    generated_at: new Date().toISOString(),
    request: {
      object_id: objectId,
      column_name: logic.metric.column_name,
      change_type: changeType,
    },
    answer: `Changing the logic for ${logic.metric.object_label}.${logic.metric.column_name} is a ${severity} risk based on ${downstreamCount} impacted column/table evidence record${downstreamCount === 1 ? '' : 's'}.`,
    risk: {
      severity,
      impacted_count: downstreamCount,
      unresolved_risk_count: columnImpact.unresolved_risks?.length || 0,
      recommended_actions: [
        'Review downstream reports and procedures that consume this metric.',
        'Add a steward-approved business definition before changing metric logic.',
        'Run reconciliation before and after the formula change.',
      ],
    },
    metric: logic.metric,
    logic: logic.logic,
    impact: columnImpact,
  };
}

export function buildMetricRuntimePack(objects = new Map(), lineageGraph = new Map(), options = {}) {
  const registry = buildMetricRegistry(objects, lineageGraph, { limit: options.limit || 500 });
  return {
    generated_at: registry.generated_at,
    summary: registry.summary,
    answer_cards: registry.metrics.map((metric) => ({
      metric_id: metric.metric_id,
      object_id: metric.object_id,
      column_name: metric.column_name,
      state: metric.metric_state,
      confidence: metric.confidence,
      answer: `${metric.object_label}.${metric.column_name} is a ${metric.metric_state} metric (${metric.confidence_label} confidence).`,
      evidence: metric.evidence.map((item) => item.source),
    })),
  };
}

export default {
  buildMetricRegistry,
  buildTableMetricAnswer,
  explainMetricLogic,
  assessMetricFormulaImpact,
  buildMetricRuntimePack,
};
