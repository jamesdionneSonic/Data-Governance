/**
 * Column Impact Service
 * Answers column-change impact questions from markdown catalog evidence only.
 */

const SUPPORTED_CHANGE_TYPES = new Set([
  'add_column',
  'drop_column',
  'rename_column',
  'change_data_type',
  'change_length_precision_scale',
  'change_nullability',
  'change_default',
  'change_key_or_index',
]);

const BREAKING_CHANGES = new Set(['drop_column', 'rename_column']);
const SHAPE_CHANGES = new Set(['change_data_type', 'change_length_precision_scale']);

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeKey(value) {
  return String(value || '').trim().toLowerCase();
}

function columnIdFor(objectId, columnName) {
  return `${objectId}.${columnName}`;
}

function compactEvidence(value, maxLength = 300) {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  return text.length > maxLength ? `${text.slice(0, maxLength - 3)}...` : text;
}

function getObjectId(mapKey, metadata = {}) {
  return String(metadata.id || mapKey || '').trim();
}

function findColumn(objects, objectId, columnNameOrId) {
  const object = objects.get(objectId);
  if (!object) return null;
  const key = normalizeKey(columnNameOrId);
  const column = ensureArray(object.columns).find(
    (candidate) =>
      normalizeKey(candidate.column_id) === key || normalizeKey(candidate.name) === key
  );
  if (!column) return null;
  return {
    object,
    object_id: objectId,
    column,
    column_id: column.column_id || columnIdFor(objectId, column.name),
    column_name: column.name,
  };
}

function buildColumnIndex(objects = new Map()) {
  const byId = new Map();
  const byObjectAndName = new Map();

  for (const [mapKey, metadata] of objects.entries()) {
    const objectId = getObjectId(mapKey, metadata);
    for (const column of ensureArray(metadata.columns)) {
      if (!column?.name) continue;
      const columnId = column.column_id || columnIdFor(objectId, column.name);
      const record = {
        object: metadata,
        object_id: objectId,
        column,
        column_id: columnId,
        column_name: column.name,
      };
      byId.set(normalizeKey(columnId), record);
      byObjectAndName.set(`${normalizeKey(objectId)}|${normalizeKey(column.name)}`, record);
    }
  }

  return { byId, byObjectAndName };
}

function resolveRequestedColumn(objects, request, columnIndex) {
  if (request.column_id || request.columnId) {
    return columnIndex.byId.get(normalizeKey(request.column_id || request.columnId)) || null;
  }

  const objectId = request.object_id || request.objectId;
  const columnName = request.column_name || request.columnName;
  if (!objectId || !columnName) return null;

  return (
    columnIndex.byObjectAndName.get(`${normalizeKey(objectId)}|${normalizeKey(columnName)}`) ||
    findColumn(objects, objectId, columnName)
  );
}

function buildColumnLineageIndex(objects = new Map()) {
  const downstream = new Map();
  const upstream = new Map();

  for (const [mapKey, metadata] of objects.entries()) {
    const processObjectId = getObjectId(mapKey, metadata);
    for (const edge of ensureArray(metadata.column_lineage)) {
      if (!edge.source_column_id || !edge.target_column_id) continue;
      const record = {
        ...edge,
        process_id: edge.process_id || processObjectId,
      };
      const sourceKey = normalizeKey(edge.source_column_id);
      const targetKey = normalizeKey(edge.target_column_id);
      if (!downstream.has(sourceKey)) downstream.set(sourceKey, []);
      downstream.get(sourceKey).push(record);
      if (!upstream.has(targetKey)) upstream.set(targetKey, []);
      upstream.get(targetKey).push(record);
    }
  }

  return { downstream, upstream };
}

function usageSeverity(changeType, usageType) {
  if (changeType === 'add_column') return 'low';
  if (BREAKING_CHANGES.has(changeType)) {
    if (['insert_target', 'update_target'].includes(usageType)) return 'critical';
    return 'high';
  }
  if (SHAPE_CHANGES.has(changeType)) {
    if (['insert_target', 'update_target'].includes(usageType)) return 'high';
    if (['join_key', 'merge_key', 'filter', 'calculation'].includes(usageType)) return 'medium';
    return 'medium';
  }
  if (changeType === 'change_nullability') return 'medium';
  if (changeType === 'change_key_or_index') return 'medium';
  return 'low';
}

function impactType(changeType, usageType, objectType) {
  if (changeType === 'add_column') return 'metadata_only';
  if (BREAKING_CHANGES.has(changeType)) {
    if (objectType === 'package') return 'runtime_load_failure';
    if (['insert_target', 'update_target'].includes(usageType)) return 'runtime_load_failure';
    return 'compile_time_break';
  }
  if (SHAPE_CHANGES.has(changeType)) {
    if (['insert_target', 'update_target'].includes(usageType)) return 'runtime_load_failure';
    return 'data_quality_risk';
  }
  if (changeType === 'change_key_or_index') return 'semantic_reporting_risk';
  if (changeType === 'change_nullability') return 'data_quality_risk';
  return 'metadata_only';
}

function lineageSeverity(changeType, transformType) {
  if (changeType === 'add_column') return 'low';
  if (BREAKING_CHANGES.has(changeType)) return 'critical';
  if (SHAPE_CHANGES.has(changeType)) {
    return ['cast', 'calculation', 'aggregate', 'case_expression'].includes(transformType)
      ? 'high'
      : 'medium';
  }
  return 'medium';
}

function makeUsageImpact(objectId, metadata, usage, changeType, distance) {
  return {
    object_id: objectId,
    object_name: metadata.name || objectId,
    object_type: metadata.type || 'object',
    column_id: usage.column_id,
    column_name: usage.column_name,
    process_id: usage.process_id || objectId,
    usage_type: usage.usage_type,
    usage_context: usage.usage_context,
    change_type: changeType,
    impact_type: impactType(changeType, usage.usage_type, metadata.type),
    severity: usageSeverity(changeType, usage.usage_type),
    validation_status: usage.validation_status || 'validated',
    distance,
    evidence_type: usage.evidence_type || 'column_usage',
    evidence_text: compactEvidence(usage.evidence_text || usage.expression),
    source_artifact: usage.source_artifact || objectId,
  };
}

function makeLineageImpact(edge, targetColumn, process, changeType, distance) {
  return {
    object_id: targetColumn?.object_id || edge.target_column_id?.split('.').slice(0, -1).join('.'),
    object_name: targetColumn?.object?.name || edge.target_column_id,
    object_type: targetColumn?.object?.type || 'column',
    column_id: edge.target_column_id,
    column_name: targetColumn?.column_name || edge.target_column_id?.split('.').pop(),
    process_id: edge.process_id,
    process_name: process?.name || edge.process_id,
    process_type: process?.type || 'process',
    source_column_id: edge.source_column_id,
    transform_type: edge.transform_type,
    change_type: changeType,
    impact_type: process?.type === 'package' ? 'runtime_load_failure' : 'data_quality_risk',
    severity: lineageSeverity(changeType, edge.transform_type),
    validation_status: edge.validation_status || 'validated',
    confidence: edge.confidence ?? 1,
    distance,
    evidence_type: edge.evidence_type || 'column_lineage',
    evidence_text: compactEvidence(edge.evidence_text || edge.expression),
  };
}

function riskSeverity(flagType, changeType) {
  if (['dynamic_sql', 'dynamic_table_name', 'dynamic_column_name'].includes(flagType)) return 'high';
  if (['insert_without_column_list', 'merge_without_explicit_column_mapping'].includes(flagType)) {
    return BREAKING_CHANGES.has(changeType) || changeType === 'add_column' ? 'high' : 'medium';
  }
  if (flagType === 'select_star') return changeType === 'add_column' ? 'medium' : 'high';
  return 'medium';
}

function collectRiskFlags(objects, impactedProcessIds, sourceObjectId, changeType) {
  const risks = [];
  const impacted = new Set(Array.from(impactedProcessIds).map(normalizeKey));

  for (const [mapKey, metadata] of objects.entries()) {
    const objectId = getObjectId(mapKey, metadata);
    const isImpacted = impacted.has(normalizeKey(objectId));
    const touchesSource =
      ensureArray(metadata.reads_from).some((ref) => normalizeKey(ref) === normalizeKey(sourceObjectId)) ||
      ensureArray(metadata.depends_on).some((ref) => normalizeKey(ref) === normalizeKey(sourceObjectId));
    if (!isImpacted && !touchesSource) continue;

    for (const flag of ensureArray(metadata.column_risk_flags)) {
      risks.push({
        object_id: objectId,
        object_name: metadata.name || objectId,
        object_type: metadata.type || 'object',
        process_id: flag.process_id || objectId,
        flag_type: flag.flag_type,
        severity: riskSeverity(flag.flag_type, changeType),
        validation_status: flag.validation_status || 'risk_flag',
        reason: flag.reason,
        suggested_action: flag.suggested_action,
        evidence_type: flag.evidence_type || 'column_risk_flag',
        evidence_text: compactEvidence(flag.evidence_text),
      });
    }
  }

  return risks;
}

function collectUnresolvedRisks(objects, column, impactedProcessIds, changeType) {
  const risks = [];
  const impacted = new Set(Array.from(impactedProcessIds).map(normalizeKey));
  const columnNameKey = normalizeKey(column.column_name);
  const columnIdKey = normalizeKey(column.column_id);

  for (const [mapKey, metadata] of objects.entries()) {
    const objectId = getObjectId(mapKey, metadata);
    const isImpacted = impacted.has(normalizeKey(objectId));

    for (const record of ensureArray(metadata.unresolved_column_usage)) {
      const matchesColumn =
        normalizeKey(record.column_id) === columnIdKey ||
        normalizeKey(record.column_name) === columnNameKey;
      if (!isImpacted && !matchesColumn) continue;
      risks.push({
        object_id: objectId,
        object_name: metadata.name || objectId,
        object_type: metadata.type || 'object',
        process_id: record.process_id || objectId,
        column_name: record.column_name,
        severity: BREAKING_CHANGES.has(changeType) ? 'high' : 'medium',
        validation_status: record.validation_status || 'unresolved',
        reason: record.reason || 'unresolved_column_usage',
        suggested_action:
          record.suggested_action || 'Resolve this SQL parser ambiguity before approving the change.',
        evidence_type: record.evidence_type || 'unresolved_column_usage',
        evidence_text: compactEvidence(record.evidence_text || record.expression),
      });
    }

    for (const record of ensureArray(metadata.unresolved_column_lineage)) {
      const matchesColumn =
        normalizeKey(record.source_column_id) === columnIdKey ||
        normalizeKey(record.target_column_id) === columnIdKey ||
        normalizeKey(record.source_column_name) === columnNameKey ||
        normalizeKey(record.target_column_name) === columnNameKey;
      if (!isImpacted && !matchesColumn) continue;
      risks.push({
        object_id: objectId,
        object_name: metadata.name || objectId,
        object_type: metadata.type || 'object',
        process_id: record.process_id || objectId,
        severity: record.validation_status === 'rejected' ? 'medium' : 'high',
        validation_status: record.validation_status || 'unresolved',
        reason: record.reason || 'unresolved_column_lineage',
        suggested_action:
          record.suggested_action ||
          'Resolve this column lineage ambiguity before approving the change.',
        evidence_type: record.evidence_type || 'unresolved_column_lineage',
        evidence_text: compactEvidence(record.evidence_text || record.expression),
      });
    }
  }

  return risks;
}

function dedupeByJson(records) {
  return Array.from(new Map(records.map((record) => [JSON.stringify(record), record])).values());
}

function severityRank(value) {
  return { critical: 4, high: 3, medium: 2, low: 1 }[value] || 0;
}

function summarize(impacts, unresolvedRisks) {
  const bySeverity = { critical: 0, high: 0, medium: 0, low: 0 };
  const byImpactType = {};
  for (const impact of impacts) {
    bySeverity[impact.severity] = (bySeverity[impact.severity] || 0) + 1;
    byImpactType[impact.impact_type] = (byImpactType[impact.impact_type] || 0) + 1;
  }
  return {
    impacted_count: impacts.length,
    unresolved_risk_count: unresolvedRisks.length,
    highest_severity:
      impacts
        .map((impact) => impact.severity)
        .sort((a, b) => severityRank(b) - severityRank(a))[0] || 'low',
    by_severity: bySeverity,
    by_impact_type: byImpactType,
  };
}

export function analyzeColumnImpact(objects = new Map(), request = {}) {
  const changeType = request.change_type || request.changeType || 'drop_column';
  if (!SUPPORTED_CHANGE_TYPES.has(changeType)) {
    throw new Error(`Unsupported column change type: ${changeType}`);
  }

  const columnIndex = buildColumnIndex(objects);
  const requestedColumn = resolveRequestedColumn(objects, request, columnIndex);
  if (!requestedColumn) {
    throw new Error('Requested column was not found in the markdown catalog');
  }

  const lineageIndex = buildColumnLineageIndex(objects);
  const impacts = [];
  const impactedProcessIds = new Set();
  const impactedColumnIds = new Set([normalizeKey(requestedColumn.column_id)]);
  const queue = [{ column: requestedColumn, distance: 0 }];

  while (queue.length > 0) {
    const current = queue.shift();
    const currentColumnKey = normalizeKey(current.column.column_id);

    for (const [mapKey, metadata] of objects.entries()) {
      const objectId = getObjectId(mapKey, metadata);
      for (const usage of ensureArray(metadata.column_usage)) {
        if (normalizeKey(usage.column_id) !== currentColumnKey) continue;
        impacts.push(makeUsageImpact(objectId, metadata, usage, changeType, current.distance));
        impactedProcessIds.add(usage.process_id || objectId);
      }
    }

    for (const edge of lineageIndex.downstream.get(currentColumnKey) || []) {
      const targetColumn = columnIndex.byId.get(normalizeKey(edge.target_column_id));
      const process = objects.get(edge.process_id);
      impacts.push(makeLineageImpact(edge, targetColumn, process, changeType, current.distance + 1));
      impactedProcessIds.add(edge.process_id);

      const targetKey = normalizeKey(edge.target_column_id);
      if (!impactedColumnIds.has(targetKey) && targetColumn) {
        impactedColumnIds.add(targetKey);
        queue.push({ column: targetColumn, distance: current.distance + 1 });
      }
    }
  }

  if (changeType === 'add_column') {
    impacts.push({
      object_id: requestedColumn.object_id,
      object_name: requestedColumn.object.name || requestedColumn.object_id,
      object_type: requestedColumn.object.type || 'table',
      column_id: requestedColumn.column_id,
      column_name: requestedColumn.column_name,
      change_type: changeType,
      impact_type: 'metadata_only',
      severity: 'low',
      validation_status: 'validated',
      distance: 0,
      evidence_type: 'column_inventory',
      evidence_text: 'Adding a nullable/ignored column is metadata-only unless downstream SELECT * or positional inserts are present.',
    });
  }

  const unresolvedRisks = dedupeByJson([
    ...collectRiskFlags(objects, impactedProcessIds, requestedColumn.object_id, changeType),
    ...collectUnresolvedRisks(objects, requestedColumn, impactedProcessIds, changeType),
  ]);
  const dedupedImpacts = dedupeByJson(impacts);

  return {
    request: {
      object_id: requestedColumn.object_id,
      column_id: requestedColumn.column_id,
      column_name: requestedColumn.column_name,
      change_type: changeType,
    },
    summary: summarize(dedupedImpacts, unresolvedRisks),
    impacts: dedupedImpacts,
    unresolved_risks: unresolvedRisks,
  };
}

export default {
  analyzeColumnImpact,
};
