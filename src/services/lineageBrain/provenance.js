import { createHash } from 'crypto';

function ensureArray(value) {
  return Array.isArray(value) ? value.filter(Boolean).map(String) : [];
}

function unique(values) {
  const seen = new Set();
  const output = [];
  for (const value of values) {
    const text = String(value || '').trim();
    const key = text.toLowerCase();
    if (!text || seen.has(key)) continue;
    seen.add(key);
    output.push(text);
  }
  return output;
}

function numberOrNull(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export function sha256Text(value) {
  return createHash('sha256')
    .update(String(value || ''))
    .digest('hex');
}

export function splitLineageEdges(metadata = {}) {
  const direct = {
    depends_on: unique(ensureArray(metadata.depends_on)),
    reads_from: unique(ensureArray(metadata.reads_from)),
    writes_to: unique(ensureArray(metadata.writes_to)),
    calls: unique(ensureArray(metadata.calls)),
  };
  const reverse = {
    created_by: unique(ensureArray(metadata.created_by)),
    used_by: unique(ensureArray(metadata.used_by)),
    called_by: unique(ensureArray(metadata.called_by)),
  };
  const inferred = {
    created_via: unique(ensureArray(metadata.created_via)),
    inferred_edges: unique(ensureArray(metadata.inferred_edges)),
    probable_edges: unique(ensureArray(metadata.probable_edges)),
  };
  const context = {
    contextual_reads: unique(ensureArray(metadata.contextual_reads)),
    contextual_edges: unique(ensureArray(metadata.contextual_edges)),
    edges: unique(ensureArray(metadata.edges)),
  };

  return {
    direct,
    reverse,
    inferred,
    context,
    directCount: Object.values(direct).reduce((sum, values) => sum + values.length, 0),
    reverseCount: Object.values(reverse).reduce((sum, values) => sum + values.length, 0),
    inferredCount: Object.values(inferred).reduce((sum, values) => sum + values.length, 0),
    contextCount: Object.values(context).reduce((sum, values) => sum + values.length, 0),
  };
}

export function totalEdgeCount(edgeGroups) {
  return (
    Number(edgeGroups?.directCount || 0) +
    Number(edgeGroups?.reverseCount || 0) +
    Number(edgeGroups?.inferredCount || 0) +
    Number(edgeGroups?.contextCount || 0)
  );
}

export function edgeQualityScore(record = {}) {
  const metadata = record.metadata || {};
  const catalogScore = numberOrNull(metadata.catalog_confidence?.edge_correctness_score);
  if (catalogScore !== null) return Number(catalogScore.toFixed(3));

  const validated = numberOrNull(metadata.lineage_quality?.validated_edges) || 0;
  const probable = numberOrNull(metadata.lineage_quality?.probable_edges) || 0;
  const unresolved = numberOrNull(metadata.lineage_quality?.unresolved_facts) || 0;
  const edgeCount = Number(record.edgeCount || 0);
  const denominator = Math.max(edgeCount, validated + probable + unresolved, 1);
  const score = Math.max(0, Math.min(1, (validated + probable * 0.65) / denominator));
  return Number(score.toFixed(3));
}

export function lineageConfidence(record = {}) {
  const metadata = record.metadata || {};
  const label = metadata.catalog_confidence?.confidence_label || metadata.confidence_label;
  if (label) return String(label);

  const score = edgeQualityScore(record);
  if (score >= 0.95) return 'very_high';
  if (score >= 0.85) return 'high';
  if (score >= 0.65) return 'medium';
  if (score > 0) return 'low';
  return 'unknown';
}

export function extractionWarnings(record = {}, edgeGroups = null) {
  const metadata = record.metadata || {};
  const groups = edgeGroups || record.edgeGroups || splitLineageEdges(metadata);
  const warnings = [
    ...ensureArray(metadata.extraction_warnings),
    ...ensureArray(metadata.catalog_confidence?.warnings),
  ];

  if (!record.rawPath) warnings.push('missing_raw_source');
  if (groups.context.edges.length > 0) warnings.push('ambiguous_edges_field_kept_context_only');
  if (groups.contextCount > groups.directCount && groups.contextCount > 0) {
    warnings.push('context_edges_separated_from_direct_edges');
  }
  if (groups.inferredCount > 0) warnings.push('inferred_edges_separated_from_direct_edges');

  return unique(warnings);
}

export function evidenceHash(record = {}, edgeGroups = null) {
  const groups = edgeGroups || record.edgeGroups || splitLineageEdges(record.metadata || {});
  return sha256Text(
    JSON.stringify({
      rawPath: record.rawPath || '',
      rawSnippet: record.rawSnippet || '',
      direct: groups.direct,
      inferred: groups.inferred,
      context: groups.context,
    })
  );
}

export function templateValuesFromRecord(record = {}, lane = 'table', overrides = {}) {
  const metadata = record.metadata || {};
  const edgeGroups = record.edgeGroups || splitLineageEdges(metadata);
  const isSsis = lane === 'ssis' || record.kind === 'ssis';

  return {
    name: record.displayName || record.objectName || metadata.name || '',
    database: overrides.database || metadata.database || (isSsis ? 'ssisdb' : 'unknown'),
    type: overrides.type || metadata.type || record.objectType || (isSsis ? 'package' : 'unknown'),
    schema: overrides.schema || metadata.schema || 'dbo',
    owner: overrides.owner || metadata.owner || (isSsis ? 'ssis-platform' : 'Data Team'),
    steward: overrides.steward || metadata.steward || 'To be assigned',
    domain_manager: overrides.domain_manager || metadata.domain_manager || 'To be assigned',
    custodian: overrides.custodian || metadata.custodian || 'To be assigned',
    sensitivity: overrides.sensitivity || metadata.sensitivity || 'internal',
    tags: overrides.tags || metadata.tags || [],
    depends_on: overrides.depends_on || edgeGroups.direct.depends_on,
    reads_from: overrides.reads_from || edgeGroups.direct.reads_from,
    writes_to: overrides.writes_to || edgeGroups.direct.writes_to,
    calls: overrides.calls || edgeGroups.direct.calls,
    called_by: overrides.called_by || edgeGroups.reverse.called_by,
    row_count: overrides.row_count ?? metadata.row_count ?? 0,
    size_kb: overrides.size_kb ?? metadata.size_kb ?? 0,
    column_count: overrides.column_count ?? metadata.column_count ?? 0,
    index_count: overrides.index_count ?? metadata.index_count ?? 0,
    check_constraint_count:
      overrides.check_constraint_count ?? metadata.check_constraint_count ?? 0,
    edge_count: overrides.edge_count ?? totalEdgeCount(edgeGroups),
    edge_quality_score: overrides.edge_quality_score ?? edgeQualityScore({ ...record, edgeGroups }),
    lineage_confidence:
      overrides.lineage_confidence || lineageConfidence({ ...record, edgeGroups }),
    lineage_strategy:
      overrides.lineage_strategy || (isSsis ? 'ssis-package-lineage' : 'sql-reference-count'),
    lineage_pattern_class:
      overrides.lineage_pattern_class || (isSsis ? 'ssis-package' : 'sql-server-object'),
    lineage_source: overrides.lineage_source || (isSsis ? 'ssis_raw_xml' : 'sqlserver_raw_sql'),
    lineage_source_path: overrides.lineage_source_path || record.rawPath || '',
    lineage_evidence_hash:
      overrides.lineage_evidence_hash || evidenceHash({ ...record, edgeGroups }),
    extraction_warnings:
      overrides.extraction_warnings || extractionWarnings({ ...record, edgeGroups }),
    extracted_at: overrides.extracted_at || metadata.extracted_at || '',
    last_updated: overrides.last_updated || metadata.last_updated || '',
  };
}

export default {
  edgeQualityScore,
  evidenceHash,
  extractionWarnings,
  lineageConfidence,
  sha256Text,
  splitLineageEdges,
  templateValuesFromRecord,
  totalEdgeCount,
};
