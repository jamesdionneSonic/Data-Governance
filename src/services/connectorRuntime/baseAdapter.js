import {
  ConnectorConfigError,
  ConnectorCredentialError,
  ConnectorRuntimeError,
  ConnectorStreamError,
} from './connectorErrors.js';
import { CANONICAL_EVENT_TYPES, canonicalEvent, warningEvent } from './canonicalMetadata.js';
import { fetchSourceMetadata } from './sourceClients.js';
import { applyMinimumCoverageProfiles, buildProfilingPlan, executeProfilingPlan } from '../profilingExecutionService.js';
import { createProfileExecutor, supportsConnectorLiveProfiling } from './profileExecutors.js';

function toArray(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (value === undefined || value === null || value === '') return [];
  return String(value)
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function objectName(object = {}) {
  return object.name || object.objectName || object.object_name || object.table_name || object.tableName || object.id || 'unknown';
}

function normalizeProfileAsset(asset = {}, connector = {}) {
  const name = objectName(asset);
  return {
    ...asset,
    id: asset.id || asset.object_id || asset.qualified_name || asset.qualifiedName || name,
    name,
    object_name: asset.object_name || name,
    object_type: asset.object_type || asset.objectType || asset.type || 'table',
    database: asset.database || asset.database_name || connector.config?.database || '',
    schema: asset.schema || asset.schema_name || asset.owner_schema || 'dbo',
    columns: Array.isArray(asset.columns) ? asset.columns : [],
  };
}

function metadataProfileAssets(metadata = {}, connector = {}) {
  return [...(metadata.tables || []), ...(metadata.views || [])]
    .map((asset) => normalizeProfileAsset(asset, connector))
    .filter((asset) => asset.columns.length);
}

function lookupKey(value) {
  return String(value || '')
    .replace(/[\[\]`"']/g, '')
    .replace(/\s*\.\s*/g, '.')
    .trim()
    .toLowerCase();
}

function matchesRequestedAsset(asset = {}, requested = '') {
  const target = lookupKey(requested);
  if (!target) return false;
  const candidates = [
    asset.id,
    asset.object_id,
    asset.qualified_name,
    asset.qualifiedName,
    asset.full_name,
    asset.name,
    asset.object_name,
    [asset.database, asset.schema, asset.name || asset.object_name].filter(Boolean).join('.'),
    [asset.schema, asset.name || asset.object_name].filter(Boolean).join('.'),
  ].map(lookupKey);
  return candidates.includes(target) || candidates.some((candidate) => candidate.endsWith(`.${target}`));
}

function filterRequestedAssets(assets = [], options = {}) {
  const requested = toArray(options.asset_id || options.assetId || options.object_id || options.objectId || options.ids);
  if (!requested.length) return assets;
  return assets.filter((asset) => requested.some((id) => matchesRequestedAsset(asset, id)));
}

function coverageMode(options = {}) {
  const value = String(
    options.coverage_mode ||
    options.coverageMode ||
    options.profile_scope ||
    options.profileScope ||
    ''
  ).toLowerCase();
  return ['all_tables', 'table_coverage', 'database_coverage', 'minimum_all_tables'].includes(value)
    ? value
    : '';
}

function coverageIncludesViews(options = {}) {
  return options.include_views === true || options.includeViews === true;
}

function coverageLiveTableLimit(options = {}, fallback = 25) {
  const raw = Number(
    options.max_live_tables ??
    options.maxLiveTables ??
    options.live_table_limit ??
    options.liveTableLimit ??
    fallback
  );
  return Number.isFinite(raw) && raw > 0 ? Math.round(raw) : fallback;
}

function coveragePriority(options = {}) {
  const value = String(options.live_priority || options.livePriority || 'smallest_first').toLowerCase();
  return ['smallest_first', 'largest_first', 'alphabetical'].includes(value) ? value : 'smallest_first';
}

function assetRowEstimate(asset = {}) {
  return Number(
    asset.row_count ??
    asset.rowCount ??
    asset.estimated_rows ??
    asset.estimatedRows ??
    0
  ) || 0;
}

function sortCoverageAssets(assets = [], priority = 'smallest_first') {
  const sorted = [...assets];
  sorted.sort((left, right) => {
    if (priority === 'alphabetical') {
      return `${left.schema || 'dbo'}.${left.name || left.object_name || left.id || ''}`
        .localeCompare(`${right.schema || 'dbo'}.${right.name || right.object_name || right.id || ''}`);
    }
    const rowDelta = assetRowEstimate(left) - assetRowEstimate(right);
    const columnDelta = (left.columns?.length || 0) - (right.columns?.length || 0);
    const lexical = `${left.schema || 'dbo'}.${left.name || left.object_name || left.id || ''}`
      .localeCompare(`${right.schema || 'dbo'}.${right.name || right.object_name || right.id || ''}`);
    if (priority === 'largest_first') return rowDelta !== 0 ? -rowDelta : (columnDelta !== 0 ? -columnDelta : lexical);
    return rowDelta !== 0 ? rowDelta : (columnDelta !== 0 ? columnDelta : lexical);
  });
  return sorted;
}

export class BaseConnectorAdapter {
  constructor({ connector, definition }) {
    this.connector = connector;
    this.definition = definition;
    this.bridge = null;
    this.lastMetadata = null;
    this.streams = [];
    this.requiredConfig = [];
    this.requiredCredentialModes = [];
    this.capability = {
      supports_incremental: true,
      supports_live_read: false,
      supports_schema: true,
      supports_lineage: true,
      supports_profiling: false,
      captures_raw_data: false,
    };
  }

  get id() {
    return this.connector?.id;
  }

  get type() {
    return this.connector?.type;
  }

  get config() {
    return this.connector?.config || {};
  }

  get credential() {
    return this.connector?.credential || {};
  }

  getCapabilities() {
    return {
      ...this.capability,
      connector_type: this.type,
      category: this.definition?.category,
      bridge: this.bridge
        ? {
            kind: this.bridge.kind || 'documented_metadata_bridge',
            docs: this.bridge.docs || [],
            live_metadata_inputs: [
              'source API client',
              'stream_endpoints',
              'metadata_endpoint',
              'metadata_payload',
              'seed_metadata',
              'mockMetadata',
            ],
          }
        : null,
      streams: this.streams,
      required_config: this.requiredConfig,
      required_credential_modes: this.requiredCredentialModes,
    };
  }

  configureBridge(bridge = {}) {
    this.bridge = {
      allowMetadataEndpointFallback: true,
      ...bridge,
    };
    if (Array.isArray(bridge.requiredConfig)) this.requiredConfig = bridge.requiredConfig;
    if (Array.isArray(bridge.requiredCredentialModes)) {
      this.requiredCredentialModes = bridge.requiredCredentialModes;
    }
    if (Array.isArray(bridge.streams) && bridge.streams.length) this.streams = bridge.streams;
    this.capability = {
      ...this.capability,
      supports_live_read: true,
      documented_bridge: true,
      captures_raw_data: false,
    };
    return this;
  }

  validateConfig() {
    const missing = this.requiredConfig.filter((key) => {
      const value = this.config[key];
      return value === undefined || value === null || value === '';
    });
    if (missing.length) {
      throw new ConnectorConfigError(
        `${this.definition?.label || this.type} connector is missing required config: ${missing.join(', ')}.`,
        {
          connector_id: this.id,
          connector_type: this.type,
          details: { missing },
        }
      );
    }
    return true;
  }

  validateCredential() {
    if (this.requiredCredentialModes.includes('none')) return true;
    const mode = this.credential.mode || this.credential.kind || 'secret_reference';
    const hasSecretReference =
      this.credential.secret_ref || this.credential.secretRef || this.credential.vault || mode === 'managed_identity' || mode === 'iam_role' || mode === 'workload_identity' || mode === 'windows_integrated';
    if (!hasSecretReference) {
      throw new ConnectorCredentialError(
        `${this.definition?.label || this.type} connector requires a credential reference or managed identity mode.`,
        {
          connector_id: this.id,
          connector_type: this.type,
          details: { mode, accepted_modes: this.requiredCredentialModes },
        }
      );
    }
    if (this.requiredCredentialModes.length && !this.requiredCredentialModes.includes(mode)) {
      return warningEvent({
        connector: this.connector,
        stream: 'credential',
        message: `Credential mode '${mode}' is not the preferred mode for ${this.type}.`,
        details: { accepted_modes: this.requiredCredentialModes },
      });
    }
    return true;
  }

  discoverStreams() {
    return this.streams.map((stream) => ({ ...stream }));
  }

  streamByName(name) {
    const stream = this.streams.find((item) => item.name === name);
    if (!stream) {
      throw new ConnectorStreamError(`Connector '${this.type}' does not support stream '${name}'.`, {
        connector_id: this.id,
        connector_type: this.type,
        stream: name,
        details: { supported_streams: this.streams.map((item) => item.name) },
      });
    }
    return stream;
  }

  selectedStreams(options = {}) {
    const requested = toArray(options.streams || this.config.streams);
    if (!requested.length) return this.discoverStreams();
    return requested.map((name) => this.streamByName(name));
  }

  async testConnection() {
    const credentialWarning = this.validateCredential();
    this.validateConfig();
    return {
      status: 'ready',
      live_supported: this.capability.supports_live_read,
      warnings: credentialWarning === true ? [] : [credentialWarning],
    };
  }

  streamPlan(stream) {
    return {
      stream: stream.name,
      endpoint: stream.endpoint || null,
      method: stream.method || 'GET',
      canonical_type: stream.canonical_type,
      incremental_cursor: stream.cursor || null,
      pagination: stream.pagination || 'source_default',
    };
  }

  async readStream(streamName, options = {}) {
    const stream = this.streamByName(streamName);
    if (this.bridge) return this.readBridgeStream(stream, options);
    const sample = this.sampleEventForStream(stream, options);
    return {
      stream: stream.name,
      events: [sample],
      state: {
        cursor: options.cursor || null,
        high_watermark: new Date().toISOString(),
      },
      plan: this.streamPlan(stream),
    };
  }

  async planProfiling(options = {}) {
    let assets = options.assets || options.objects || [];
    let coverageAssets = [];
    const requestedCoverageMode = coverageMode(options);
    const needsResolvedAssets =
      !assets.length || toArray(options.asset_id || options.assetId || options.object_id || options.objectId || options.ids).length > 0;
    if (needsResolvedAssets && !this.lastMetadata && options.dry_run === false && typeof this.loadMetadata === 'function') {
      await this.loadMetadata({ ...options, dry_run: false });
    }
    if (needsResolvedAssets && this.lastMetadata) {
      const resolvedAssets = filterRequestedAssets(metadataProfileAssets(this.lastMetadata, this.connector), options);
      if (requestedCoverageMode) {
        coverageAssets = resolvedAssets.filter((asset) =>
          coverageIncludesViews(options) ? ['table', 'view'].includes(String(asset.object_type || '').toLowerCase()) : String(asset.object_type || '').toLowerCase() === 'table'
        );
        const priority = coveragePriority(options);
        const sortedCoverageAssets = sortCoverageAssets(coverageAssets, priority);
        assets = sortedCoverageAssets.slice(0, coverageLiveTableLimit(options, 25));
      } else {
        assets = resolvedAssets;
      }
    }
    const plan = buildProfilingPlan(
      {
        ...options,
        connector_id: this.id,
        connector_type: this.type,
        dialect: options.dialect || this.config.dialect || this.type,
        max_tables: requestedCoverageMode ? Math.max(1, assets.length || coverageLiveTableLimit(options, 25)) : options.max_tables,
        assets,
      },
      options.objectCache || new Map()
    );
    if (requestedCoverageMode) {
      plan.coverage = {
        enabled: true,
        mode: requestedCoverageMode,
        include_views: coverageIncludesViews(options),
        live_priority: coveragePriority(options),
        live_asset_limit: coverageLiveTableLimit(options, 25),
        assets: coverageAssets,
        live_assets: assets.map((asset) => asset.id || asset.object_id || asset.name),
        total_assets: coverageAssets.length,
        metadata_only_assets: Math.max(0, coverageAssets.length - assets.length),
      };
      plan.summary.requested_assets = coverageAssets.length;
      plan.summary.coverage_assets_total = coverageAssets.length;
      plan.summary.coverage_live_assets = assets.length;
      plan.summary.coverage_metadata_only_assets = Math.max(0, coverageAssets.length - assets.length);
    }
    return plan;
  }

  async runProfiling(options = {}) {
    const plan = options.plan || (await this.planProfiling(options));
    const executor = createProfileExecutor({ connector: this.connector, options });
    const run = await executeProfilingPlan(plan, executor);
    return applyMinimumCoverageProfiles(run, plan);
  }

  supportsLiveProfiling() {
    return supportsConnectorLiveProfiling(this.connector);
  }

  sampleEventForStream(stream) {
    return canonicalEvent({
      type: stream.canonical_type || CANONICAL_EVENT_TYPES.OBJECT,
      connector: this.connector,
      stream: stream.name,
      external_id: `${this.id}/${stream.name}/sample`,
      name: `${this.definition?.label || this.type} ${stream.label || stream.name}`,
      object_type: stream.object_type || stream.name,
      source_url: this.config.base_url || this.config.workspace_url || this.config.server_url || null,
      attributes: {
        extraction_mode: 'planned_stream',
        documented_endpoint: stream.endpoint || null,
        source_metadata: stream.metadata || [],
        documentation: this.bridge?.docs || [],
      },
      evidence: {
        bridge_kind: this.bridge?.kind || 'planned_stream',
        docs: this.bridge?.docs || [],
      },
      confidence: 0.75,
    });
  }

  async readBridgeStream(stream, options = {}) {
    const metadata = await this.resolveBridgeMetadata(options, stream);
    const events = this.eventsFromBridgeMetadata(stream, metadata);
    return {
      stream: stream.name,
      events,
      state: {
        cursor: options.cursor || null,
        high_watermark: metadata?.extracted_at || metadata?.extractedAt || new Date().toISOString(),
      },
      plan: this.streamPlan(stream),
    };
  }

  async resolveBridgeMetadata(options = {}, stream = null) {
    const inline =
      options.mockMetadata ||
      options.metadata_payload ||
      this.config.metadata_payload ||
      this.config.seed_metadata ||
      this.config.sample_metadata;
    if (inline) {
      this.lastMetadata = inline;
      return inline;
    }

    if (options.dry_run !== false) {
      const sample = this.buildSampleBridgePayload(stream);
      this.lastMetadata = sample;
      return sample;
    }

    try {
      const sourceMetadata = await fetchSourceMetadata({
        connector: this.connector,
        stream,
        bridge: this.bridge,
        headers: this.bridgeHeaders(),
        options,
      });
      this.lastMetadata = sourceMetadata;
      return sourceMetadata;
    } catch (sourceErr) {
      if (!isMissingSourceClientError(sourceErr)) throw sourceErr;
      if (!this.bridge?.allowMetadataEndpointFallback) throw sourceErr;
    }

    const endpoint =
      options.metadata_endpoint ||
      options.metadataEndpoint ||
      this.config.metadata_endpoint ||
      this.config.metadataEndpoint ||
      this.config.catalog_endpoint ||
      this.config.catalogEndpoint;

    if (!endpoint) {
      throw new ConnectorRuntimeError(
        `${this.definition?.label || this.type} bridge is configured, but no live metadata source was provided.`,
        {
          connector_id: this.id,
          connector_type: this.type,
          stream: stream?.name,
          remediation:
            'Add a metadata_endpoint/catalog_endpoint that returns JSON metadata, provide metadata_payload/seed_metadata, or attach a source-specific SDK extractor behind this adapter.',
          details: {
            accepted_metadata_inputs: [
              'source API client',
              'stream_endpoints',
              'metadata_endpoint',
              'catalog_endpoint',
              'metadata_payload',
              'seed_metadata',
            ],
            documented_endpoint: stream?.endpoint || null,
            docs: this.bridge?.docs || [],
          },
        }
      );
    }

    const metadata = await this.fetchBridgeMetadata(endpoint, stream);
    this.lastMetadata = metadata;
    return metadata;
  }

  async fetchBridgeMetadata(endpoint, stream) {
    let url;
    try {
      url = new URL(String(endpoint));
    } catch {
      throw new ConnectorRuntimeError(`${this.definition?.label || this.type} metadata endpoint is not a valid URL.`, {
        connector_id: this.id,
        connector_type: this.type,
        stream: stream?.name,
        remediation: 'Use a fully qualified http or https metadata_endpoint URL.',
        details: { endpoint },
      });
    }
    if (!['https:', 'http:'].includes(url.protocol)) {
      throw new ConnectorRuntimeError(`${this.definition?.label || this.type} metadata endpoint must use HTTP or HTTPS.`, {
        connector_id: this.id,
        connector_type: this.type,
        stream: stream?.name,
        remediation: 'Use an HTTPS metadata_endpoint whenever possible.',
        details: { endpoint },
      });
    }

    let response;
    try {
      response = await fetch(url, { headers: this.bridgeHeaders() });
    } catch (err) {
      throw new ConnectorRuntimeError(`${this.definition?.label || this.type} metadata endpoint request failed: ${err.message}`, {
        connector_id: this.id,
        connector_type: this.type,
        stream: stream?.name,
        details: { endpoint: url.origin + url.pathname },
      });
    }
    if (!response.ok) {
      throw new ConnectorRuntimeError(`${this.definition?.label || this.type} metadata endpoint returned HTTP ${response.status}.`, {
        connector_id: this.id,
        connector_type: this.type,
        stream: stream?.name,
        remediation: 'Check source URL, service-account permissions, API scopes, tenant settings, and firewall rules.',
        details: { status: response.status, endpoint: url.origin + url.pathname },
      });
    }
    try {
      return response.json();
    } catch (err) {
      throw new ConnectorRuntimeError(`${this.definition?.label || this.type} metadata endpoint did not return JSON metadata.`, {
        connector_id: this.id,
        connector_type: this.type,
        stream: stream?.name,
        remediation: 'Return JSON metadata or add a source-specific response parser to this bridge adapter.',
        details: { endpoint: url.origin + url.pathname, parse_error: err.message },
      });
    }
  }

  bridgeHeaders() {
    const headers = { Accept: 'application/json' };
    const token =
      this.credential.access_token ||
      this.credential.token ||
      this.credential.bearer_token ||
      this.config.access_token ||
      this.config.token;
    const apiKey = this.credential.api_key || this.config.api_key;
    if (token) headers.Authorization = `Bearer ${token}`;
    if (apiKey) headers['x-api-key'] = apiKey;
    if (this.credential.username && this.credential.password) {
      headers.Authorization = `Basic ${Buffer.from(`${this.credential.username}:${this.credential.password}`).toString('base64')}`;
    }
    return headers;
  }

  buildSampleBridgePayload(stream = null) {
    const streams = stream ? [stream] : this.streams;
    return {
      extracted_at: new Date().toISOString(),
      connector_type: this.type,
      source: 'documented_bridge_sample',
      ...Object.fromEntries(
        streams.map((item) => [
          item.name,
          [
            {
              id: `${this.id}/${item.name}/sample`,
              name: `${this.definition?.label || this.type} ${item.label || item.name}`,
              object_type: item.object_type || item.name,
              documented_endpoint: item.endpoint || null,
              metadata: item.metadata || [],
            },
          ],
        ])
      ),
    };
  }

  eventsFromBridgeMetadata(stream, metadata = {}) {
    const aliases = [
      stream.name,
      stream.object_type,
      stream.name.replace(/_/g, ''),
      ...(stream.aliases || []),
    ].filter(Boolean);
    const items = extractMetadataItems(metadata, aliases);
    const sourceUrl = this.config.base_url || this.config.workspace_url || this.config.server_url || null;

    return items.map((item, index) => {
      const id =
        item.id ||
        item.uid ||
        item.key ||
        item.path ||
        item.fullName ||
        item.qualifiedName ||
        item.name ||
        `${this.id}/${stream.name}/${index + 1}`;
      const name = item.name || item.title || item.displayName || item.label || item.path || id;
      const from = item.from || item.source || item.source_id || item.upstream || item.parent;
      const to = item.to || item.target || item.target_id || item.downstream || item.child;
      const objectType = item.object_type || item.type || stream.object_type || stream.name;
      return canonicalEvent({
        type: stream.canonical_type || CANONICAL_EVENT_TYPES.OBJECT,
        connector: this.connector,
        stream: stream.name,
        external_id: id,
        name,
        object_type: stream.canonical_type === CANONICAL_EVENT_TYPES.LINEAGE_EDGE ? 'lineage_edge' : objectType,
        parent_id: item.parent_id || item.parentId || item.datasetId || item.workspaceId || item.projectId || null,
        source_url: item.source_url || item.webUrl || item.url || sourceUrl,
        attributes: {
          ...item,
          documented_endpoint: stream.endpoint || null,
          documented_metadata: stream.metadata || [],
        },
        lineage:
          stream.canonical_type === CANONICAL_EVENT_TYPES.LINEAGE_EDGE && (from || to)
            ? [{ from, to, type: item.edge_type || item.edgeType || item.relationship || item.type || 'depends_on' }]
            : [],
        confidence: item.confidence || 0.78,
        evidence: {
          bridge_kind: this.bridge?.kind || 'documented_metadata_bridge',
          docs: this.bridge?.docs || [],
        },
      });
    });
  }
}

function extractMetadataItems(metadata, aliases = []) {
  if (Array.isArray(metadata)) return metadata;
  if (!metadata || typeof metadata !== 'object') return [];

  for (const alias of aliases) {
    if (Array.isArray(metadata[alias])) return metadata[alias];
  }

  for (const container of ['value', 'items', 'data', 'results', 'objects', 'assets', 'entries']) {
    if (Array.isArray(metadata[container])) {
      const filtered = metadata[container].filter((item) => {
        const type = String(item.type || item.object_type || item.kind || '').toLowerCase();
        return aliases.some((alias) => type === String(alias).toLowerCase());
      });
      return filtered.length ? filtered : metadata[container];
    }
  }

  for (const alias of aliases) {
    const nested = findArrayByKey(metadata, alias);
    if (nested.length) return nested;
  }
  return [];
}

function findArrayByKey(value, targetKey, depth = 0) {
  if (!value || typeof value !== 'object' || depth > 4) return [];
  for (const [key, child] of Object.entries(value)) {
    if (key.toLowerCase() === String(targetKey).toLowerCase() && Array.isArray(child)) return child;
    const nested = findArrayByKey(child, targetKey, depth + 1);
    if (nested.length) return nested;
  }
  return [];
}

function isMissingSourceClientError(err) {
  return (
    err instanceof ConnectorRuntimeError &&
    err.message.includes('no direct source API endpoint configured')
  );
}
