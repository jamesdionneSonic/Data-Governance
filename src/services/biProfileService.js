import { createHash } from 'crypto';
import { CANONICAL_EVENT_TYPES } from './connectorRuntime/canonicalMetadata.js';
import { ConnectorConfigError } from './connectorRuntime/connectorErrors.js';

const SENSITIVE_FIELD_PATTERN =
  /password|secret|token|key|credential|clientsecret|privatekey|authorization|cookie|session|bearer/i;

const BI_CATEGORIES = Object.freeze({
  REPORT: 'reports',
  DASHBOARD: 'dashboards',
  SEMANTIC_MODEL: 'semantic_models',
  DATASET: 'datasets',
  DATA_SOURCE: 'data_sources',
  METRIC: 'metrics',
  FIELD: 'fields',
  USAGE: 'usage',
  LINEAGE: 'lineage_edges',
  SCHEDULE: 'schedules',
  SUBSCRIPTION: 'subscriptions',
  ALERT: 'alerts',
  WARNING: 'warnings',
  SUPPORTING_OBJECT: 'supporting_objects',
});

const BI_EVENT_TYPES = new Set([
  CANONICAL_EVENT_TYPES.OBJECT,
  CANONICAL_EVENT_TYPES.COLUMN,
  CANONICAL_EVENT_TYPES.METRIC,
  CANONICAL_EVENT_TYPES.DASHBOARD,
  CANONICAL_EVENT_TYPES.REPORT,
  CANONICAL_EVENT_TYPES.DATASET,
  CANONICAL_EVENT_TYPES.SEMANTIC_MODEL,
  CANONICAL_EVENT_TYPES.DATA_SOURCE,
  CANONICAL_EVENT_TYPES.LINEAGE_EDGE,
  CANONICAL_EVENT_TYPES.USAGE_EVENT,
  CANONICAL_EVENT_TYPES.WARNING,
]);

const PROFILE_CHECKS = Object.freeze([
  {
    id: 'reports_or_dashboards',
    label: 'Reports or dashboards',
    passes: (profile) => profile.reports.length + profile.dashboards.length > 0,
  },
  {
    id: 'semantic_or_dataset_inventory',
    label: 'Semantic model or dataset inventory',
    passes: (profile) => profile.semantic_models.length + profile.datasets.length > 0,
  },
  {
    id: 'data_sources',
    label: 'Datasource inventory',
    passes: (profile) => profile.data_sources.length > 0,
  },
  {
    id: 'metrics',
    label: 'Metrics / measures',
    passes: (profile) => profile.metrics.length > 0,
  },
  {
    id: 'fields',
    label: 'Fields / columns',
    passes: (profile) => profile.fields.length > 0,
  },
  {
    id: 'lineage',
    label: 'Lineage relationships',
    passes: (profile) => profile.lineage_edges.length > 0,
  },
  {
    id: 'usage_or_refresh',
    label: 'Usage / refresh / subscriptions',
    passes: (profile) =>
      profile.usage.length + profile.schedules.length + profile.subscriptions.length + profile.alerts.length > 0,
  },
  {
    id: 'ownership',
    label: 'Ownership / stewardship',
    passes: (profile) => profile.inventory.some((item) => item.owners.length > 0),
  },
]);

export function supportsBiProfile(definition = {}) {
  return definition.category === 'business_intelligence' || definition.type === 'salesforce';
}

export function buildBiProfilePlan({ connector, definition, adapter, options = {} }) {
  if (!supportsBiProfile(definition)) {
    throw new ConnectorConfigError(`Connector '${connector.id}' is not a BI/reporting connector.`, {
      connector_id: connector.id,
      connector_type: connector.type,
      remediation: 'Run BI profile only for reporting/semantic connectors. Use database profiling for tables.',
    });
  }
  const capabilities = adapter.getCapabilities();
  const streams = adapter.selectedStreams(options);
  return {
    profile_type: 'bi_report_profile',
    profile_version: '1.0',
    connector_id: connector.id,
    connector_type: connector.type,
    provider: definition.provider,
    adapter: adapter.constructor.name,
    captures_raw_report_data: false,
    captures_raw_data: false,
    secret_exposed: false,
    requires_live_call: options.dry_run === false,
    capability_summary: {
      supports_metrics: Boolean(capabilities.supports_metrics),
      supports_usage: Boolean(capabilities.supports_usage),
      supports_semantic_models: Boolean(capabilities.supports_semantic_models),
    },
    streams: streams.map((stream) => ({
      stream: stream.name,
      canonical_type: stream.canonical_type,
      endpoint: stream.endpoint,
      method: stream.method || 'GET',
      expected_metadata: stream.metadata || [],
    })),
    expected_sections: PROFILE_CHECKS.map((check) => ({ id: check.id, label: check.label })),
    safety: {
      raw_values_retained: false,
      report_result_rows_queried: false,
      credentials_returned: false,
      pii_guardrail: 'metadata_only',
    },
  };
}

export function buildBiProfileFromExtraction({ connector, definition, adapter, extraction, options = {} }) {
  if (!supportsBiProfile(definition)) {
    throw new ConnectorConfigError(`Connector '${connector.id}' is not a BI/reporting connector.`, {
      connector_id: connector.id,
      connector_type: connector.type,
    });
  }

  const profile = emptyProfile({ connector, definition, adapter, extraction, options });
  for (const event of extraction.events || []) {
    if (!BI_EVENT_TYPES.has(event.type)) continue;
    addProfileEvent(profile, event);
  }
  profile.inventory = buildInventory(profile);
  profile.relationships = summarizeRelationships(profile.lineage_edges);
  profile.coverage_checks = buildCoverageChecks(profile, extraction);
  profile.coverage_score = calculateCoverageScore(profile.coverage_checks);
  profile.summary = buildSummary(profile, extraction);
  profile.top_impact_candidates = buildTopImpactCandidates(profile);
  profile.gaps = buildGaps(profile);
  return profile;
}

export function buildBiProfilePackage(profile) {
  return {
    package_type: 'bi_report_profile',
    package_version: '1.0',
    profile_id: profile.profile_id,
    generated_at: profile.generated_at,
    connector_id: profile.connector_id,
    connector_type: profile.connector_type,
    raw_values_retained: false,
    report_result_rows_queried: false,
    secret_exposed: false,
    manifest: {
      artifact_count: profile.inventory.length,
      lineage_edge_count: profile.lineage_edges.length,
      coverage_score: profile.coverage_score,
      source_stream_count: profile.source_streams.length,
      status: profile.status,
    },
    profile,
  };
}

export function buildBiConfluenceSummary(profile) {
  const { summary } = profile;
  const gaps = profile.gaps.length
    ? profile.gaps.map((gap) => `- ${gap.label}: ${gap.message}`).join('\n')
    : '- No major BI metadata gaps were detected in this profile run.';
  return [
    `# BI Profile - ${profile.label}`,
    '',
    `Generated: ${profile.generated_at}`,
    `Connector: ${profile.connector_id} (${profile.connector_type})`,
    `Status: ${profile.status}`,
    '',
    '## What was captured',
    '',
    `- Reports: ${summary.report_count}`,
    `- Dashboards: ${summary.dashboard_count}`,
    `- Semantic models: ${summary.semantic_model_count}`,
    `- Datasets: ${summary.dataset_count}`,
    `- Data sources: ${summary.data_source_count}`,
    `- Metrics/measures: ${summary.metric_count}`,
    `- Fields/columns: ${summary.field_count}`,
    `- Lineage edges: ${summary.lineage_edge_count}`,
    `- Usage/refresh signals: ${summary.usage_signal_count}`,
    '',
    '## Controls',
    '',
    '- Raw report result rows retained: no',
    '- Secrets returned: no',
    '- Profile mode: metadata only',
    '',
    '## Gaps',
    '',
    gaps,
  ].join('\n');
}

export function biProfileAnswer(profile) {
  const { summary } = profile;
  const statusText = profileStatusText(profile.status);
  const artifactText = [
    `${summary.report_count} reports`,
    `${summary.dashboard_count} dashboards`,
    `${summary.semantic_model_count} semantic models`,
    `${summary.dataset_count} datasets`,
    `${summary.metric_count} metrics/measures`,
    `${summary.lineage_edge_count} lineage edges`,
  ].join(', ');
  return {
    answer: `${profile.label} BI profiling ${statusText}. I captured ${artifactText}. The profile is metadata-only: it does not retain report result rows, credentials, or raw PII-bearing values. Coverage score is ${profile.coverage_score}%.`,
    raw_values_retained: false,
    report_result_rows_queried: false,
    coverage_score: profile.coverage_score,
    impacted_objects: profile.top_impact_candidates,
    gaps: profile.gaps,
  };
}

function profileStatusText(status) {
  if (status === 'succeeded') return 'completed successfully';
  if (status === 'partial_failure') return 'completed with recoverable connector errors';
  return 'failed before a complete profile could be built';
}

function emptyProfile({ connector, definition, adapter, extraction, options }) {
  const capabilities = adapter.getCapabilities();
  return {
    profile_id: stableProfileId(connector, extraction.extracted_at),
    profile_type: 'bi_report_profile',
    profile_version: '1.0',
    connector_id: connector.id,
    connector_type: connector.type,
    provider: definition.provider,
    label: connector.label || definition.label || connector.id,
    adapter: adapter.constructor.name,
    status: extraction.status,
    generated_at: new Date().toISOString(),
    source_streams: extraction.stream_results || [],
    selected_streams: adapter.selectedStreams(options).map((stream) => stream.name),
    source_docs: capabilities.bridge?.docs || adapter.bridge?.docs || [],
    reports: [],
    dashboards: [],
    semantic_models: [],
    datasets: [],
    data_sources: [],
    metrics: [],
    fields: [],
    usage: [],
    lineage_edges: [],
    schedules: [],
    subscriptions: [],
    alerts: [],
    warnings: [],
    supporting_objects: [],
    errors: extraction.errors || [],
    raw_values_retained: false,
    captures_raw_report_data: false,
    report_result_rows_queried: false,
    secret_exposed: false,
  };
}

function addProfileEvent(profile, event) {
  const category = classifyEvent(event);
  if (!category) return;
  if (category === BI_CATEGORIES.LINEAGE) {
    profile.lineage_edges.push(sanitizeLineageEdge(event));
    return;
  }
  if (category === BI_CATEGORIES.WARNING) {
    profile.warnings.push(sanitizeProfileObject(event));
    return;
  }
  profile[category].push(sanitizeProfileObject(event));
}

function classifyEvent(event) {
  if (event.type === CANONICAL_EVENT_TYPES.REPORT) return BI_CATEGORIES.REPORT;
  if (event.type === CANONICAL_EVENT_TYPES.DASHBOARD) return BI_CATEGORIES.DASHBOARD;
  if (event.type === CANONICAL_EVENT_TYPES.SEMANTIC_MODEL) return BI_CATEGORIES.SEMANTIC_MODEL;
  if (event.type === CANONICAL_EVENT_TYPES.DATASET) return BI_CATEGORIES.DATASET;
  if (event.type === CANONICAL_EVENT_TYPES.DATA_SOURCE) return BI_CATEGORIES.DATA_SOURCE;
  if (event.type === CANONICAL_EVENT_TYPES.METRIC) return BI_CATEGORIES.METRIC;
  if (event.type === CANONICAL_EVENT_TYPES.COLUMN) return BI_CATEGORIES.FIELD;
  if (event.type === CANONICAL_EVENT_TYPES.LINEAGE_EDGE) return BI_CATEGORIES.LINEAGE;
  if (event.type === CANONICAL_EVENT_TYPES.USAGE_EVENT) return classifyUsage(event);
  if (event.type === CANONICAL_EVENT_TYPES.WARNING) return BI_CATEGORIES.WARNING;
  return classifySupportingObject(event);
}

function classifyUsage(event) {
  const text = `${event.stream || ''} ${event.object_type || ''} ${event.name || ''}`.toLowerCase();
  if (/schedule|refresh|reload/.test(text)) return BI_CATEGORIES.SCHEDULE;
  if (/subscription|subscriber/.test(text)) return BI_CATEGORIES.SUBSCRIPTION;
  if (/alert/.test(text)) return BI_CATEGORIES.ALERT;
  return BI_CATEGORIES.USAGE;
}

function classifySupportingObject(event) {
  const text = `${event.stream || ''} ${event.object_type || ''}`.toLowerCase();
  if (/subscription/.test(text)) return BI_CATEGORIES.SUBSCRIPTION;
  if (/alert/.test(text)) return BI_CATEGORIES.ALERT;
  if (/schedule|refresh|reload/.test(text)) return BI_CATEGORIES.SCHEDULE;
  if (/metric|measure|calculation|formula/.test(text)) return BI_CATEGORIES.METRIC;
  if (/field|column/.test(text)) return BI_CATEGORIES.FIELD;
  if (/source|connection|datasource/.test(text)) return BI_CATEGORIES.DATA_SOURCE;
  return BI_CATEGORIES.SUPPORTING_OBJECT;
}

function sanitizeProfileObject(event) {
  const attributes = sanitizeAttributes(event.attributes || {});
  return {
    id: event.id,
    external_id: event.external_id,
    name: event.name,
    object_type: event.object_type,
    stream: event.stream,
    parent_id: event.parent_id || null,
    source_url: event.source_url || null,
    owners: Array.isArray(event.owners) ? event.owners.filter(Boolean) : [],
    tags: Array.isArray(event.tags) ? event.tags.filter(Boolean) : [],
    confidence: normalizeConfidence(event.confidence),
    attributes,
    evidence: sanitizeAttributes(event.evidence || {}),
  };
}

function sanitizeLineageEdge(event) {
  const object = sanitizeProfileObject(event);
  return {
    ...object,
    from: event.attributes?.from || event.attributes?.source || event.external_id?.split('->')?.[0] || null,
    to: event.attributes?.to || event.attributes?.target || event.external_id?.split('->')?.[1] || null,
    relationship_type: event.attributes?.relationship_type || event.attributes?.type || event.object_type || 'depends_on',
  };
}

function sanitizeAttributes(attributes) {
  if (!attributes || typeof attributes !== 'object') return {};
  const sanitized = {};
  for (const [key, value] of Object.entries(attributes)) {
    if (SENSITIVE_FIELD_PATTERN.test(key)) continue;
    sanitized[key] = sanitizeAttributeValue(value);
  }
  return sanitized;
}

function sanitizeAttributeValue(value) {
  if (value === null || value === undefined) return value;
  if (Array.isArray(value)) return value.slice(0, 50).map(sanitizeAttributeValue);
  if (typeof value === 'object') {
    return sanitizeAttributes(value);
  }
  if (typeof value === 'string' && value.length > 500) return `${value.slice(0, 500)}...`;
  return value;
}

function normalizeConfidence(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0.8;
  return Math.max(0, Math.min(1, numeric));
}

function buildInventory(profile) {
  return [
    ...profile.reports.map((item) => ({ ...item, role: 'report' })),
    ...profile.dashboards.map((item) => ({ ...item, role: 'dashboard' })),
    ...profile.semantic_models.map((item) => ({ ...item, role: 'semantic_model' })),
    ...profile.datasets.map((item) => ({ ...item, role: 'dataset' })),
    ...profile.data_sources.map((item) => ({ ...item, role: 'data_source' })),
    ...profile.metrics.map((item) => ({ ...item, role: 'metric' })),
    ...profile.fields.map((item) => ({ ...item, role: 'field' })),
    ...profile.supporting_objects.map((item) => ({ ...item, role: 'supporting_object' })),
  ];
}

function summarizeRelationships(edges) {
  const byType = {};
  for (const edge of edges) {
    byType[edge.relationship_type] = (byType[edge.relationship_type] || 0) + 1;
  }
  return {
    count: edges.length,
    by_type: byType,
  };
}

function buildCoverageChecks(profile, extraction) {
  return PROFILE_CHECKS.map((check) => {
    const passed = check.passes(profile);
    return {
      id: check.id,
      label: check.label,
      status: passed ? 'pass' : 'gap',
      message: passed
        ? `${check.label} metadata is present.`
        : `${check.label} metadata was not captured in this run.`,
    };
  }).concat(
    (extraction.stream_results || [])
      .filter((stream) => stream.status === 'failed')
      .map((stream) => ({
        id: `stream_${stream.stream}`,
        label: `Stream ${stream.stream}`,
        status: 'error',
        message: stream.error?.message || 'Stream failed.',
        remediation: stream.error?.remediation || null,
      }))
  );
}

function calculateCoverageScore(checks) {
  const scoreable = checks.filter((check) => check.status !== 'error');
  if (!scoreable.length) return 0;
  const passing = scoreable.filter((check) => check.status === 'pass').length;
  return Math.round((passing / scoreable.length) * 100);
}

function buildSummary(profile, extraction) {
  return {
    report_count: profile.reports.length,
    dashboard_count: profile.dashboards.length,
    semantic_model_count: profile.semantic_models.length,
    dataset_count: profile.datasets.length,
    data_source_count: profile.data_sources.length,
    metric_count: profile.metrics.length,
    field_count: profile.fields.length,
    usage_signal_count:
      profile.usage.length + profile.schedules.length + profile.subscriptions.length + profile.alerts.length,
    lineage_edge_count: profile.lineage_edges.length,
    warning_count: profile.warnings.length,
    error_count: profile.errors.length,
    event_count: extraction.summary?.event_count || 0,
    source_stream_count: profile.source_streams.length,
    coverage_score: profile.coverage_score,
    raw_data_captured: false,
    raw_values_retained: false,
    secret_exposed: false,
    profile_run: true,
    bi_profile_run: true,
  };
}

function buildTopImpactCandidates(profile) {
  const downstreamCounts = new Map();
  for (const edge of profile.lineage_edges) {
    if (edge.from) downstreamCounts.set(edge.from, (downstreamCounts.get(edge.from) || 0) + 1);
    if (edge.to) downstreamCounts.set(edge.to, (downstreamCounts.get(edge.to) || 0) + 1);
  }
  return profile.inventory
    .map((item) => ({
      id: item.id,
      name: item.name,
      role: item.role,
      object_type: item.object_type,
      source_url: item.source_url,
      confidence: item.confidence,
      relationship_count: downstreamCounts.get(item.external_id) || downstreamCounts.get(item.id) || 0,
      owners: item.owners,
    }))
    .sort((a, b) => b.relationship_count - a.relationship_count || b.confidence - a.confidence)
    .slice(0, 25);
}

function buildGaps(profile) {
  return profile.coverage_checks
    .filter((check) => check.status !== 'pass')
    .map((check) => ({
      id: check.id,
      label: check.label,
      severity: check.status === 'error' ? 'error' : 'warning',
      message: check.message,
      remediation:
        check.remediation ||
        'Confirm the service account has metadata permissions for this artifact type and enable the matching stream.',
    }));
}

function stableProfileId(connector, timestamp) {
  const hash = createHash('sha256')
    .update(`${connector.id}:${connector.type}:${timestamp || new Date().toISOString()}`)
    .digest('hex')
    .slice(0, 12);
  return `bi-profile-${connector.id}-${hash}`;
}
