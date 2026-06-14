/**
 * Codex Context Service
 * Builds compact markdown-only context packets for AI-assisted lineage questions.
 */

import { analyzeColumnImpact } from './columnImpactService.js';
import { getUpstreamDependencies, getDownstreamDependents } from './lineageService.js';

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeKey(value) {
  return String(value || '')
    .trim()
    .toLowerCase();
}

function compact(value, maxLength = 220) {
  const text = String(value || '')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > maxLength ? `${text.slice(0, maxLength - 3)}...` : text;
}

function objectIdFor(mapKey, metadata = {}) {
  return String(metadata.id || mapKey || '').trim();
}

function findColumn(object, columnNameOrId) {
  const key = normalizeKey(columnNameOrId);
  return ensureArray(object?.columns).find(
    (column) => normalizeKey(column.column_id) === key || normalizeKey(column.name) === key
  );
}

function resolveColumn(objects, request = {}) {
  if (request.column_id || request.columnId) {
    const columnId = request.column_id || request.columnId;
    for (const [mapKey, object] of objects.entries()) {
      const column = findColumn(object, columnId);
      if (column) {
        const objectId = objectIdFor(mapKey, object);
        return {
          object_id: objectId,
          object,
          column,
          column_id: column.column_id || `${objectId}.${column.name}`,
          column_name: column.name,
        };
      }
    }
  }

  const objectId = request.object_id || request.objectId;
  const object = objects.get(objectId);
  const columnName = request.column_name || request.columnName || request.column;
  const column = findColumn(object, columnName);
  if (!object || !column) return null;

  return {
    object_id: objectId,
    object,
    column,
    column_id: column.column_id || `${objectId}.${column.name}`,
    column_name: column.name,
  };
}

function summarizeObjects(ids = [], objects = new Map(), limit = 12) {
  return ids.slice(0, limit).map((id) => {
    const object = objects.get(id) || {};
    return {
      id,
      name: object.name || id,
      type: object.type || 'object',
      database: object.database || '',
      schema: object.schema || '',
    };
  });
}

function directColumnUsage(objects, columnId) {
  const key = normalizeKey(columnId);
  const usage = [];

  for (const [mapKey, object] of objects.entries()) {
    const objectId = objectIdFor(mapKey, object);
    for (const record of ensureArray(object.column_usage)) {
      if (normalizeKey(record.column_id) !== key) continue;
      usage.push({
        object_id: objectId,
        object_name: object.name || objectId,
        object_type: object.type || 'object',
        usage_type: record.usage_type,
        usage_context: record.usage_context,
        process_id: record.process_id || objectId,
        validation_status: record.validation_status || 'validated',
        evidence_type: record.evidence_type || 'column_usage',
        evidence_text: compact(record.evidence_text || record.expression),
      });
    }
  }

  return usage;
}

function directColumnLineage(objects, columnId) {
  const key = normalizeKey(columnId);
  const upstream = [];
  const downstream = [];

  for (const [mapKey, object] of objects.entries()) {
    const processId = objectIdFor(mapKey, object);
    for (const edge of ensureArray(object.column_lineage)) {
      const summary = {
        process_id: edge.process_id || processId,
        transform_type: edge.transform_type,
        validation_status: edge.validation_status || 'validated',
        confidence: edge.confidence ?? null,
        evidence_type: edge.evidence_type || 'column_lineage',
        evidence_text: compact(edge.evidence_text || edge.expression),
        source_column_id: edge.source_column_id,
        target_column_id: edge.target_column_id,
      };
      if (normalizeKey(edge.source_column_id) === key) downstream.push(summary);
      if (normalizeKey(edge.target_column_id) === key) upstream.push(summary);
    }
  }

  return { upstream, downstream };
}

function sortImpacts(impacts = []) {
  const severityRank = { critical: 4, high: 3, medium: 2, low: 1 };
  return [...impacts].sort(
    (left, right) =>
      (severityRank[right.severity] || 0) - (severityRank[left.severity] || 0) ||
      String(left.object_id || '').localeCompare(String(right.object_id || ''))
  );
}

function renderObjectList(title, objects = []) {
  const lines = [`## ${title}`];
  if (objects.length === 0) {
    lines.push('- None found in the current markdown catalog.');
    return lines.join('\n');
  }
  for (const object of objects) {
    lines.push(`- ${object.id} (${object.type}${object.database ? `, ${object.database}` : ''})`);
  }
  return lines.join('\n');
}

function renderUsage(usage = []) {
  const lines = ['## Direct Column Usage'];
  if (usage.length === 0) {
    lines.push('- No direct column usage records found.');
    return lines.join('\n');
  }
  for (const record of usage.slice(0, 30)) {
    lines.push(
      `- ${record.process_id}: ${record.usage_type}/${record.usage_context} ` +
        `[${record.validation_status}, ${record.evidence_type}] ${record.evidence_text}`
    );
  }
  return lines.join('\n');
}

function renderLineage(lineage) {
  const lines = ['## Column Lineage'];
  if (lineage.upstream.length === 0 && lineage.downstream.length === 0) {
    lines.push('- No validated column lineage edges found for this column.');
    return lines.join('\n');
  }
  for (const edge of lineage.upstream.slice(0, 20)) {
    lines.push(
      `- Upstream: ${edge.source_column_id} -> ${edge.target_column_id} via ${edge.process_id} ` +
        `[${edge.validation_status}, confidence=${edge.confidence ?? 'n/a'}]`
    );
  }
  for (const edge of lineage.downstream.slice(0, 20)) {
    lines.push(
      `- Downstream: ${edge.source_column_id} -> ${edge.target_column_id} via ${edge.process_id} ` +
        `[${edge.validation_status}, confidence=${edge.confidence ?? 'n/a'}]`
    );
  }
  return lines.join('\n');
}

function renderBlastRadius(impact) {
  const lines = ['## Downstream Blast Radius'];
  lines.push(
    `- Impacted records: ${impact.summary.impacted_count}; unresolved risks: ${impact.summary.unresolved_risk_count}; highest severity: ${impact.summary.highest_severity}`
  );
  for (const record of sortImpacts(impact.impacts).slice(0, 30)) {
    lines.push(
      `- ${record.object_id || record.process_id}: ${record.impact_type} / ${record.severity} ` +
        `[${record.validation_status}, ${record.evidence_type}] ${record.evidence_text}`
    );
  }
  return lines.join('\n');
}

function renderRisks(risks = []) {
  const lines = ['## Unresolved Risks'];
  if (risks.length === 0) {
    lines.push('- No unresolved risks found for this context.');
    return lines.join('\n');
  }
  for (const risk of risks.slice(0, 30)) {
    lines.push(
      `- ${risk.process_id || risk.object_id}: ${risk.reason || risk.flag_type || 'risk'} ` +
        `[${risk.validation_status}, ${risk.severity}, ${risk.evidence_type}] ${risk.evidence_text || ''}`
    );
  }
  return lines.join('\n');
}

function renderConfidence(confidence = null) {
  const lines = ['## Catalog Confidence'];
  if (!confidence) {
    lines.push('- No catalog confidence score is available for this object.');
    return lines.join('\n');
  }
  lines.push(`- Overall Score: ${confidence.overall_score ?? 'n/a'}`);
  lines.push(`- Edge Correctness Score: ${confidence.edge_correctness_score ?? 'n/a'}`);
  lines.push(`- Coverage Score: ${confidence.coverage_score ?? 'n/a'}`);
  lines.push(`- Column Lineage Score: ${confidence.column_lineage_score ?? 'n/a'}`);
  lines.push(`- Unresolved Risk Score: ${confidence.unresolved_risk_score ?? 'n/a'}`);
  lines.push(`- Label: ${confidence.confidence_label || 'unknown'}`);
  const warnings = ensureArray(confidence.warnings);
  if (warnings.length > 0) {
    lines.push(`- Warnings: ${warnings.join(', ')}`);
  }
  return lines.join('\n');
}

export function renderCodexColumnContextMarkdown(context) {
  return [
    `# Codex Column Impact Context`,
    '',
    `## Focus`,
    `- Object: ${context.focus.object_id}`,
    `- Column: ${context.focus.column_id}`,
    `- Change Type: ${context.request.change_type}`,
    `- Object Type: ${context.focus.object_type}`,
    renderConfidence(context.catalog_confidence),
    renderObjectList('Table-Level Upstream', context.table_lineage.upstream),
    renderObjectList('Table-Level Downstream', context.table_lineage.downstream),
    renderUsage(context.column_usage.direct),
    renderLineage(context.column_lineage),
    renderBlastRadius(context.impact),
    renderRisks(context.unresolved_risks),
  ].join('\n\n');
}

export function buildCodexColumnContext(
  objects = new Map(),
  lineageGraph = new Map(),
  request = {}
) {
  const resolved = resolveColumn(objects, request);
  if (!resolved) {
    throw new Error('Requested column was not found in the markdown catalog');
  }

  const changeType = request.change_type || request.changeType || 'drop_column';
  const upstreamIds = getUpstreamDependencies(resolved.object_id, lineageGraph, request.depth || 3);
  const downstreamIds = getDownstreamDependents(
    resolved.object_id,
    lineageGraph,
    request.depth || 3
  );
  const impact = analyzeColumnImpact(objects, {
    object_id: resolved.object_id,
    column_id: resolved.column_id,
    change_type: changeType,
  });
  const lineage = directColumnLineage(objects, resolved.column_id);

  const context = {
    generated_at: new Date().toISOString(),
    request: {
      object_id: resolved.object_id,
      column_id: resolved.column_id,
      column_name: resolved.column_name,
      change_type: changeType,
    },
    focus: {
      object_id: resolved.object_id,
      object_name: resolved.object.name || resolved.object_id,
      object_type: resolved.object.type || 'object',
      database: resolved.object.database || '',
      schema: resolved.object.schema || '',
      column_id: resolved.column_id,
      column_name: resolved.column_name,
      data_type: resolved.column.data_type || '',
      nullable: resolved.column.nullable ?? null,
    },
    table_lineage: {
      upstream: summarizeObjects(upstreamIds, objects),
      downstream: summarizeObjects(downstreamIds, objects),
      upstream_count: upstreamIds.length,
      downstream_count: downstreamIds.length,
    },
    column_usage: {
      direct: directColumnUsage(objects, resolved.column_id),
    },
    column_lineage: lineage,
    catalog_confidence: resolved.object.catalog_confidence || null,
    impact,
    unresolved_risks: impact.unresolved_risks,
  };

  return {
    ...context,
    markdown: renderCodexColumnContextMarkdown(context),
  };
}

export default {
  buildCodexColumnContext,
  renderCodexColumnContextMarkdown,
};
