import { createHash } from 'crypto';
import { CANONICAL_EVENT_TYPES } from './connectorRuntime/canonicalMetadata.js';
import { ConnectorConfigError } from './connectorRuntime/connectorErrors.js';

const SENSITIVE_FIELD_PATTERN =
  /password|secret|token|key|credential|clientsecret|privatekey|authorization|cookie|session|bearer/i;

const SUPPORTED_METADATA_PROFILE_TYPES = new Set([
  'azure_purview',
  'azure_storage',
  'azure_data_factory',
  'ssis',
  'aws_glue',
  'aws_s3',
  'gcp_dataplex',
  'gcs',
  'airflow',
  'dbt',
  'git_repository',
  'openapi',
  'kafka',
  'salesforce',
  'sap',
]);

const PROFILE_BUCKETS = Object.freeze({
  ASSETS: 'assets',
  STORAGE_LOCATIONS: 'storage_locations',
  OBJECTS: 'objects',
  SCHEMAS: 'schemas',
  COLUMNS: 'columns',
  CLASSIFICATIONS: 'classifications',
  GLOSSARY_TERMS: 'glossary_terms',
  PIPELINES: 'pipelines',
  TASKS: 'tasks',
  JOBS: 'jobs',
  DATASETS: 'datasets',
  CONNECTIONS: 'connections',
  SCHEDULES: 'schedules',
  REPOSITORIES: 'repositories',
  CODE_ASSETS: 'code_assets',
  TESTS: 'tests',
  REPORTS: 'reports',
  DASHBOARDS: 'dashboards',
  API_ENDPOINTS: 'api_endpoints',
  STREAMING_ASSETS: 'streaming_assets',
  SAP_EXTRACTORS: 'sap_extractors',
  LINEAGE: 'lineage_edges',
  USAGE: 'usage',
  WARNINGS: 'warnings',
});

const PROFILE_CHECKS = Object.freeze([
  {
    id: 'inventory',
    label: 'Inventory',
    passes: (profile) => profile.inventory.length > 0,
  },
  {
    id: 'schema_or_object_detail',
    label: 'Schema / object detail',
    passes: (profile) => profile.schemas.length + profile.columns.length + profile.objects.length > 0,
  },
  {
    id: 'connections_or_locations',
    label: 'Connections / storage locations',
    passes: (profile) => profile.connections.length + profile.storage_locations.length > 0,
  },
  {
    id: 'lineage',
    label: 'Lineage relationships',
    passes: (profile) => profile.lineage_edges.length > 0,
  },
  {
    id: 'classification_or_terms',
    label: 'Classification / glossary',
    passes: (profile) => profile.classifications.length + profile.glossary_terms.length > 0,
  },
  {
    id: 'operational_signals',
    label: 'Operational signals',
    passes: (profile) => profile.pipelines.length + profile.jobs.length + profile.schedules.length + profile.usage.length > 0,
  },
]);

export function supportsConnectorMetadataProfile(definition = {}) {
  return SUPPORTED_METADATA_PROFILE_TYPES.has(definition.type);
}

export function buildConnectorMetadataProfilePlan({ connector, definition, adapter, options = {} }) {
  assertMetadataProfileSupport(connector, definition);
  const streams = adapter.selectedStreams(options);
  return {
    profile_type: 'connector_metadata_profile',
    profile_version: '1.0',
    connector_id: connector.id,
    connector_type: connector.type,
    provider: definition.provider,
    category: definition.category,
    adapter: adapter.constructor.name,
    captures_raw_data: false,
    captures_payload_values: false,
    secret_exposed: false,
    requires_live_call: options.dry_run === false,
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
      credentials_returned: false,
      metadata_only: true,
      unsupported_next_pass: [],
    },
  };
}

export function buildConnectorMetadataProfileFromExtraction({ connector, definition, adapter, extraction, options = {} }) {
  assertMetadataProfileSupport(connector, definition);
  const profile = emptyProfile({ connector, definition, adapter, extraction, options });
  for (const event of extraction.events || []) addProfileEvent(profile, event);
  profile.inventory = buildInventory(profile);
  profile.relationships = summarizeRelationships(profile.lineage_edges);
  profile.coverage_checks = buildCoverageChecks(profile, extraction);
  profile.coverage_score = calculateCoverageScore(profile.coverage_checks);
  profile.summary = buildSummary(profile, extraction);
  profile.top_impact_candidates = buildTopImpactCandidates(profile);
  profile.gaps = buildGaps(profile);
  return profile;
}

export function buildConnectorMetadataProfilePackage(profile) {
  return {
    package_type: 'connector_metadata_profile',
    package_version: '1.0',
    profile_id: profile.profile_id,
    generated_at: profile.generated_at,
    connector_id: profile.connector_id,
    connector_type: profile.connector_type,
    raw_values_retained: false,
    secret_exposed: false,
    manifest: {
      inventory_count: profile.inventory.length,
      lineage_edge_count: profile.lineage_edges.length,
      coverage_score: profile.coverage_score,
      source_stream_count: profile.source_streams.length,
      status: profile.status,
    },
    profile,
  };
}

export function buildConnectorMetadataConfluenceSummary(profile) {
  const { summary } = profile;
  const gaps = profile.gaps.length
    ? profile.gaps.map((gap) => `- ${gap.label}: ${gap.message}`).join('\n')
    : '- No major metadata profile gaps were detected in this run.';
  return [
    `# Connector Metadata Profile - ${profile.label}`,
    '',
    `Generated: ${profile.generated_at}`,
    `Connector: ${profile.connector_id} (${profile.connector_type})`,
    `Status: ${profile.status}`,
    '',
    '## What was captured',
    '',
    `- Inventory objects: ${summary.inventory_count}`,
    `- Storage locations: ${summary.storage_location_count}`,
    `- Schemas/datasets: ${summary.schema_count + summary.dataset_count}`,
    `- Columns: ${summary.column_count}`,
    `- Pipelines/tasks/jobs: ${summary.pipeline_count + summary.task_count + summary.job_count}`,
    `- Code assets: ${summary.code_asset_count}`,
    `- API endpoints: ${summary.api_endpoint_count}`,
    `- Streaming assets: ${summary.streaming_asset_count}`,
    `- SAP extractors: ${summary.sap_extractor_count}`,
    `- Reports/dashboards: ${summary.report_count + summary.dashboard_count}`,
    `- Classifications/glossary terms: ${summary.classification_count + summary.glossary_term_count}`,
    `- Lineage edges: ${summary.lineage_edge_count}`,
    '',
    '## Controls',
    '',
    '- Raw source payload values retained: no',
    '- Secrets returned: no',
    '- Profile mode: metadata only',
    '',
    '## Gaps',
    '',
    gaps,
  ].join('\n');
}

export function connectorMetadataProfileAnswer(profile) {
  const { summary } = profile;
  return {
    answer:
      `${profile.label} metadata profiling ${profileStatusText(profile.status)}. I captured ` +
      `${summary.inventory_count} inventory item(s), ${summary.storage_location_count} storage location(s), ` +
      `${summary.pipeline_count + summary.task_count + summary.job_count} pipeline/task/job item(s), ` +
      `${summary.code_asset_count} code asset(s), ${summary.api_endpoint_count} API endpoint(s), ` +
      `${summary.streaming_asset_count} streaming asset(s), ${summary.sap_extractor_count} SAP extractor item(s), ` +
      `${summary.report_count + summary.dashboard_count} report/dashboard item(s), ` +
      `and ${summary.lineage_edge_count} lineage edge(s). The profile is metadata-only and retained no secrets or raw source payload values. Coverage score is ${profile.coverage_score}%.`,
    raw_values_retained: false,
    metadata_only: true,
    coverage_score: profile.coverage_score,
    impacted_objects: profile.top_impact_candidates,
    gaps: profile.gaps,
  };
}

function assertMetadataProfileSupport(connector, definition) {
  if (supportsConnectorMetadataProfile(definition)) return;
  throw new ConnectorConfigError(`Connector '${connector.id}' does not support metadata profiling yet.`, {
    connector_id: connector.id,
    connector_type: connector.type,
    remediation:
      'Use metadata profiling for Salesforce, cloud storage, catalog platforms, pipeline/orchestration tools, code repositories, APIs, Kafka, and SAP.',
    details: {
      supported_connector_types: Array.from(SUPPORTED_METADATA_PROFILE_TYPES),
      next_pass: [],
    },
  });
}

function emptyProfile({ connector, definition, adapter, extraction, options }) {
  const capabilities = adapter.getCapabilities();
  return {
    profile_id: stableProfileId(connector, extraction.extracted_at),
    profile_type: 'connector_metadata_profile',
    profile_version: '1.0',
    connector_id: connector.id,
    connector_type: connector.type,
    provider: definition.provider,
    category: definition.category,
    label: connector.label || definition.label || connector.id,
    adapter: adapter.constructor.name,
    status: extraction.status,
    generated_at: new Date().toISOString(),
    source_streams: extraction.stream_results || [],
    selected_streams: adapter.selectedStreams(options).map((stream) => stream.name),
    source_docs: capabilities.bridge?.docs || adapter.bridge?.docs || [],
    assets: [],
    storage_locations: [],
    objects: [],
    schemas: [],
    columns: [],
    classifications: [],
    glossary_terms: [],
    pipelines: [],
    tasks: [],
    jobs: [],
    datasets: [],
    connections: [],
    schedules: [],
    repositories: [],
    code_assets: [],
    tests: [],
    reports: [],
    dashboards: [],
    api_endpoints: [],
    streaming_assets: [],
    sap_extractors: [],
    lineage_edges: [],
    usage: [],
    warnings: [],
    errors: extraction.errors || [],
    raw_values_retained: false,
    captures_payload_values: false,
    secret_exposed: false,
  };
}

function addProfileEvent(profile, event) {
  const bucket = classifyEvent(event);
  if (!bucket) return;
  if (bucket === PROFILE_BUCKETS.LINEAGE) {
    profile.lineage_edges.push(sanitizeLineageEdge(event));
    return;
  }
  profile[bucket].push(sanitizeProfileObject(event));
}

function classifyEvent(event) {
  if (event.type === CANONICAL_EVENT_TYPES.WARNING) return PROFILE_BUCKETS.WARNINGS;
  if (event.type === CANONICAL_EVENT_TYPES.LINEAGE_EDGE) return PROFILE_BUCKETS.LINEAGE;
  if (event.type === CANONICAL_EVENT_TYPES.COLUMN) return PROFILE_BUCKETS.COLUMNS;
  if (event.type === CANONICAL_EVENT_TYPES.DATASET) return classifyDatasetEvent(event);
  if (event.type === CANONICAL_EVENT_TYPES.DATA_SOURCE) return PROFILE_BUCKETS.CONNECTIONS;
  if (event.type === CANONICAL_EVENT_TYPES.REPORT) return PROFILE_BUCKETS.REPORTS;
  if (event.type === CANONICAL_EVENT_TYPES.DASHBOARD) return PROFILE_BUCKETS.DASHBOARDS;
  if (event.type === CANONICAL_EVENT_TYPES.USAGE_EVENT) return PROFILE_BUCKETS.USAGE;
  if (event.type === CANONICAL_EVENT_TYPES.METRIC) return PROFILE_BUCKETS.OBJECTS;
  if (event.type === CANONICAL_EVENT_TYPES.SEMANTIC_MODEL) return classifySemanticEvent(event);
  return classifyObjectEvent(event);
}

function classifyDatasetEvent(event) {
  const text = streamText(event);
  if (/schema|catalog|manifest/.test(text)) return PROFILE_BUCKETS.SCHEMAS;
  return PROFILE_BUCKETS.DATASETS;
}

function classifySemanticEvent(event) {
  const text = streamText(event);
  if (/dbt|model|manifest/.test(text)) return PROFILE_BUCKETS.CODE_ASSETS;
  return PROFILE_BUCKETS.OBJECTS;
}

function classifyObjectEvent(event) {
  const text = streamText(event);
  if (/asset|entry|sobject|sobjects|salesforce/.test(text)) return PROFILE_BUCKETS.ASSETS;
  if (/bucket|container/.test(text)) return PROFILE_BUCKETS.STORAGE_LOCATIONS;
  if (/object|blob|path|file|prefix/.test(text)) return PROFILE_BUCKETS.OBJECTS;
  if (/classification|tag|policy|label/.test(text)) return PROFILE_BUCKETS.CLASSIFICATIONS;
  if (/glossary|term/.test(text)) return PROFILE_BUCKETS.GLOSSARY_TERMS;
  if (/pipeline|dag|package|ssis/.test(text)) return PROFILE_BUCKETS.PIPELINES;
  if (/task|activity|component/.test(text)) return PROFILE_BUCKETS.TASKS;
  if (/job|crawler/.test(text)) return PROFILE_BUCKETS.JOBS;
  if (/schedule|trigger/.test(text)) return PROFILE_BUCKETS.SCHEDULES;
  if (/repository|repo/.test(text)) return PROFILE_BUCKETS.REPOSITORIES;
  if (/python|sql_file|sql files|notebook|dbt_artifact|script|code/.test(text)) return PROFILE_BUCKETS.CODE_ASSETS;
  if (/openapi|endpoint|operation|path|swagger/.test(text)) return PROFILE_BUCKETS.API_ENDPOINTS;
  if (/kafka|topic|schema|consumer|cluster|stream/.test(text)) return PROFILE_BUCKETS.STREAMING_ASSETS;
  if (/sap|extractor|odata|servicecollection|business object/.test(text)) return PROFILE_BUCKETS.SAP_EXTRACTORS;
  if (/test/.test(text)) return PROFILE_BUCKETS.TESTS;
  return PROFILE_BUCKETS.OBJECTS;
}

function streamText(event) {
  return `${event.connector_type || ''} ${event.stream || ''} ${event.object_type || ''} ${event.name || ''}`.toLowerCase();
}

function sanitizeProfileObject(event) {
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
    attributes: sanitizeAttributes(event.attributes || {}),
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
  if (typeof value === 'object') return sanitizeAttributes(value);
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
    ...profile.assets.map((item) => ({ ...item, role: 'asset' })),
    ...profile.storage_locations.map((item) => ({ ...item, role: 'storage_location' })),
    ...profile.objects.map((item) => ({ ...item, role: 'object' })),
    ...profile.schemas.map((item) => ({ ...item, role: 'schema' })),
    ...profile.datasets.map((item) => ({ ...item, role: 'dataset' })),
    ...profile.connections.map((item) => ({ ...item, role: 'connection' })),
    ...profile.pipelines.map((item) => ({ ...item, role: 'pipeline' })),
    ...profile.tasks.map((item) => ({ ...item, role: 'task' })),
    ...profile.jobs.map((item) => ({ ...item, role: 'job' })),
    ...profile.schedules.map((item) => ({ ...item, role: 'schedule' })),
    ...profile.repositories.map((item) => ({ ...item, role: 'repository' })),
    ...profile.code_assets.map((item) => ({ ...item, role: 'code_asset' })),
    ...profile.tests.map((item) => ({ ...item, role: 'test' })),
    ...profile.reports.map((item) => ({ ...item, role: 'report' })),
    ...profile.dashboards.map((item) => ({ ...item, role: 'dashboard' })),
    ...profile.api_endpoints.map((item) => ({ ...item, role: 'api_endpoint' })),
    ...profile.streaming_assets.map((item) => ({ ...item, role: 'streaming_asset' })),
    ...profile.sap_extractors.map((item) => ({ ...item, role: 'sap_extractor' })),
  ];
}

function summarizeRelationships(edges) {
  const byType = {};
  for (const edge of edges) byType[edge.relationship_type] = (byType[edge.relationship_type] || 0) + 1;
  return { count: edges.length, by_type: byType };
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
  return Math.round((scoreable.filter((check) => check.status === 'pass').length / scoreable.length) * 100);
}

function buildSummary(profile, extraction) {
  return {
    inventory_count: profile.inventory.length,
    asset_count: profile.assets.length,
    storage_location_count: profile.storage_locations.length,
    object_count: profile.objects.length,
    schema_count: profile.schemas.length,
    column_count: profile.columns.length,
    classification_count: profile.classifications.length,
    glossary_term_count: profile.glossary_terms.length,
    pipeline_count: profile.pipelines.length,
    task_count: profile.tasks.length,
    job_count: profile.jobs.length,
    dataset_count: profile.datasets.length,
    connection_count: profile.connections.length,
    schedule_count: profile.schedules.length,
    repository_count: profile.repositories.length,
    code_asset_count: profile.code_assets.length,
    test_count: profile.tests.length,
    report_count: profile.reports.length,
    dashboard_count: profile.dashboards.length,
    api_endpoint_count: profile.api_endpoints.length,
    streaming_asset_count: profile.streaming_assets.length,
    sap_extractor_count: profile.sap_extractors.length,
    lineage_edge_count: profile.lineage_edges.length,
    warning_count: profile.warnings.length,
    error_count: profile.errors.length,
    event_count: extraction.summary?.event_count || 0,
    coverage_score: profile.coverage_score,
    raw_data_captured: false,
    raw_values_retained: false,
    secret_exposed: false,
    profile_run: true,
    metadata_profile_run: true,
  };
}

function buildTopImpactCandidates(profile) {
  const relationshipCounts = new Map();
  for (const edge of profile.lineage_edges) {
    if (edge.from) relationshipCounts.set(edge.from, (relationshipCounts.get(edge.from) || 0) + 1);
    if (edge.to) relationshipCounts.set(edge.to, (relationshipCounts.get(edge.to) || 0) + 1);
  }
  return profile.inventory
    .map((item) => ({
      id: item.id,
      name: item.name,
      role: item.role,
      object_type: item.object_type,
      source_url: item.source_url,
      confidence: item.confidence,
      relationship_count: relationshipCounts.get(item.external_id) || relationshipCounts.get(item.id) || 0,
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
        'Confirm service-account metadata permissions, source API enablement, and that the matching stream is enabled.',
    }));
}

function profileStatusText(status) {
  if (status === 'succeeded') return 'completed successfully';
  if (status === 'partial_failure') return 'completed with recoverable connector errors';
  return 'failed before a complete profile could be built';
}

function stableProfileId(connector, timestamp) {
  const hash = createHash('sha256')
    .update(`${connector.id}:${connector.type}:${timestamp || new Date().toISOString()}`)
    .digest('hex')
    .slice(0, 12);
  return `metadata-profile-${connector.id}-${hash}`;
}
