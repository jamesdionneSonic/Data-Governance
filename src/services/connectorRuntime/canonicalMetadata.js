import { randomUUID } from 'crypto';

export const CANONICAL_EVENT_TYPES = Object.freeze({
  OBJECT: 'metadata.object',
  COLUMN: 'metadata.column',
  METRIC: 'metadata.metric',
  DASHBOARD: 'metadata.dashboard',
  REPORT: 'metadata.report',
  DATASET: 'metadata.dataset',
  SEMANTIC_MODEL: 'metadata.semantic_model',
  DATA_SOURCE: 'metadata.data_source',
  LINEAGE_EDGE: 'lineage.edge',
  USAGE_EVENT: 'usage.event',
  QUALITY_SIGNAL: 'quality.signal',
  WARNING: 'extraction.warning',
});

export function normalizeExternalId(value) {
  return String(value || '')
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[\\]+/g, '/');
}

export function canonicalEvent({
  type,
  connector,
  stream,
  external_id,
  name,
  object_type,
  parent_id,
  source_url,
  attributes = {},
  owners = [],
  tags = [],
  lineage = [],
  confidence = 0.8,
  evidence = {},
}) {
  const connectorId = connector?.id || connector?.connector_id || 'unknown_connector';
  const connectorType = connector?.type || connector?.connector_type || 'unknown';
  const normalizedExternalId = normalizeExternalId(external_id || name || randomUUID());
  return {
    id: `${connectorType}:${normalizedExternalId}`.toLowerCase(),
    type,
    connector_id: connectorId,
    connector_type: connectorType,
    stream,
    external_id: normalizedExternalId,
    name: name || normalizedExternalId,
    object_type: object_type || type,
    parent_id: parent_id || null,
    source_url: source_url || null,
    owners,
    tags,
    attributes,
    lineage,
    confidence,
    evidence: {
      connector_id: connectorId,
      connector_type: connectorType,
      stream,
      extracted_at: new Date().toISOString(),
      ...evidence,
    },
  };
}

export function warningEvent({ connector, stream, message, severity = 'warning', details = {} }) {
  return canonicalEvent({
    type: CANONICAL_EVENT_TYPES.WARNING,
    connector,
    stream,
    external_id: `${stream || 'stream'}:${message}`,
    name: message,
    object_type: 'warning',
    confidence: 1,
    attributes: {
      severity,
      message,
      details,
    },
  });
}

export function summarizeCanonicalEvents(events = []) {
  const byType = {};
  const byStream = {};
  for (const event of events) {
    byType[event.type] = (byType[event.type] || 0) + 1;
    byStream[event.stream] = (byStream[event.stream] || 0) + 1;
  }
  return {
    event_count: events.length,
    by_type: byType,
    by_stream: byStream,
    object_count: events.filter((event) =>
      [
        CANONICAL_EVENT_TYPES.OBJECT,
        CANONICAL_EVENT_TYPES.DASHBOARD,
        CANONICAL_EVENT_TYPES.REPORT,
        CANONICAL_EVENT_TYPES.DATASET,
        CANONICAL_EVENT_TYPES.SEMANTIC_MODEL,
        CANONICAL_EVENT_TYPES.DATA_SOURCE,
      ].includes(event.type)
    ).length,
    column_count: events.filter((event) => event.type === CANONICAL_EVENT_TYPES.COLUMN).length,
    metric_count: events.filter((event) => event.type === CANONICAL_EVENT_TYPES.METRIC).length,
    lineage_edge_count: events.filter((event) => event.type === CANONICAL_EVENT_TYPES.LINEAGE_EDGE).length,
    warning_count: events.filter((event) => event.type === CANONICAL_EVENT_TYPES.WARNING).length,
  };
}
