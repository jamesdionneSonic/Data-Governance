import {
  ConnectorConfigError,
  ConnectorCredentialError,
  ConnectorRuntimeError,
  ConnectorStreamError,
} from './connectorErrors.js';
import { existsSync, readFileSync, statSync } from 'fs';
import path from 'path';
import { CANONICAL_EVENT_TYPES, canonicalEvent, warningEvent } from './canonicalMetadata.js';
import { fetchSourceMetadata } from './sourceClients.js';
import { applyMinimumCoverageProfiles, buildProfilingPlan, executeProfilingPlan } from '../profilingExecutionService.js';
import { createProfileExecutor, supportsConnectorLiveProfiling } from './profileExecutors.js';

let lineageUsageCache = null;
let publishedLiveProfileCache = null;

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

function objectType(object = {}) {
  return String(object.object_type || object.objectType || object.type || '').toLowerCase();
}

function normalizeProfileAsset(asset = {}, connector = {}) {
  const name = objectName(asset);
  return {
    ...asset,
    id: asset.id || asset.object_id || asset.qualified_name || asset.qualifiedName || name,
    name,
    object_name: asset.object_name || name,
    object_type: objectType(asset) || 'table',
    database: asset.database || asset.database_name || connector.config?.database || '',
    schema: asset.schema || asset.schema_name || asset.owner_schema || 'dbo',
    columns: Array.isArray(asset.columns) ? asset.columns : [],
    parameters: Array.isArray(asset.parameters) ? asset.parameters : [],
  };
}

function metadataProfileAssets(metadata = {}, connector = {}) {
  const groups = [
    { items: metadata.tables || [], object_type: 'table' },
    { items: metadata.views || [], object_type: 'view' },
    { items: metadata.storedProcedures || metadata.stored_procedures || metadata.procedures || [], object_type: 'stored_procedure' },
    { items: metadata.functions || [], object_type: 'function' },
    { items: metadata.triggers || [], object_type: 'trigger' },
    { items: metadata.synonyms || [], object_type: 'synonym' },
  ];
  return groups
    .flatMap(({ items, object_type }) => items.map((asset) => normalizeProfileAsset({ ...asset, object_type }, connector)))
    .filter((asset, index, all) => all.findIndex((candidate) => candidate.id === asset.id) === index);
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
  return ['all_tables', 'table_coverage', 'database_coverage', 'minimum_all_tables', 'all_objects', 'minimum_all_objects'].includes(value)
    ? value
    : '';
}

function coverageIncludesViews(options = {}) {
  return options.include_views === true || options.includeViews === true;
}

function coverageIncludesAllObjects(options = {}) {
  const mode = coverageMode(options);
  return mode === 'all_objects' || mode === 'minimum_all_objects';
}

function coverageLiveTableLimit(options = {}, fallback = 15) {
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
  return ['smallest_first', 'largest_first', 'alphabetical', 'most_used_first'].includes(value) ? value : 'smallest_first';
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

function normalizeDependencyId(value = '') {
  return String(value || '').trim().toLowerCase();
}

function stripServerPort(value = '') {
  return String(value || '').replace(/^([^.,]+),\d+\./, '$1.').trim();
}

function normalizeObjectId(value = '') {
  return normalizeDependencyId(String(value || '').replace(/[\[\]`"]/g, '').trim());
}

function runtimeStorePath() {
  return path.join(process.cwd(), 'data', '_runtime', 'profiles', 'profile-scheduler-store.json');
}

function normalizePublishedStatus(value = '') {
  const status = String(value || '').toLowerCase();
  return ['published', 'partial_published'].includes(status);
}

function uniqueAssetIds(actions = []) {
  return [...new Set((actions || []).map((action) => action?.asset_id).filter(Boolean))];
}

function normalizeQueueState(queueState = {}) {
  return {
    timeout_penalties: typeof queueState.timeout_penalties === 'object' && queueState.timeout_penalties
      ? { ...queueState.timeout_penalties }
      : {},
    live_successes: typeof queueState.live_successes === 'object' && queueState.live_successes
      ? { ...queueState.live_successes }
      : {},
  };
}

function readPublishedLiveProfileState(connectorId = '') {
  const cacheKey = String(connectorId || '').trim().toLowerCase();
  if (!cacheKey) return new Map();
  const storePath = runtimeStorePath();
  const storeStamp = existsSync(storePath) ? statSync(storePath).mtimeMs : 0;
  if (publishedLiveProfileCache?.connectorId === cacheKey && publishedLiveProfileCache?.storeStamp === storeStamp) {
    return publishedLiveProfileCache.map;
  }

  const map = new Map();
  if (existsSync(storePath)) {
    try {
      const store = JSON.parse(readFileSync(storePath, 'utf8'));
      const runs = Array.isArray(store.connector_runs) ? store.connector_runs : [];
      for (const run of runs) {
        if (String(run?.connector_id || '').trim().toLowerCase() !== cacheKey) continue;
        if (String(run?.mode || '').toLowerCase() !== 'live') continue;
        if (!normalizePublishedStatus(run?.artifact?.profile_publish?.status)) continue;
        const actionIds = uniqueAssetIds(run?.profile?.plan?.actions || []);
        const failedAssetIds = new Set((run?.errors || []).map((error) => normalizeObjectId(error?.asset_id)).filter(Boolean));
        const completedAt = run?.artifact?.profile_publish?.last_published_at || run?.completed_at || run?.started_at || null;
        for (const assetId of actionIds) {
          const normalized = normalizeObjectId(assetId);
          if (!normalized || failedAssetIds.has(normalized)) continue;
          const nextValue = {
            asset_id: assetId,
            profiled_at: completedAt,
            source: 'published_live_run',
          };
          const existing = map.get(normalized);
          if (!existing || String(nextValue.profiled_at || '') > String(existing.profiled_at || '')) {
            map.set(normalized, nextValue);
            map.set(normalizeObjectId(stripServerPort(assetId)), nextValue);
          }
        }
      }
    } catch {
      // Best-effort cache only.
    }
  }

  publishedLiveProfileCache = { connectorId: cacheKey, storeStamp, map };
  return map;
}

function liveProfileStaleDays(options = {}) {
  const raw = Number(options.live_profile_stale_days ?? options.liveProfileStaleDays ?? 30);
  return Number.isFinite(raw) && raw > 0 ? Math.round(raw) : 30;
}

function queueSuccessAt(asset = {}, queueState = {}) {
  const successes = queueState.live_successes || {};
  const keys = [
    asset.id,
    asset.object_id,
    asset.qualified_name,
    asset.qualifiedName,
    stripServerPort(asset.id || asset.object_id || ''),
  ].map(normalizeObjectId);
  for (const key of keys) {
    if (key && successes[key]) return successes[key];
  }
  return null;
}

function timeoutScoreForAsset(asset = {}, queueState = {}) {
  const penalties = queueState.timeout_penalties || {};
  const keys = [
    asset.id,
    asset.object_id,
    asset.qualified_name,
    asset.qualifiedName,
    stripServerPort(asset.id || asset.object_id || ''),
  ].map(normalizeObjectId);
  for (const key of keys) {
    if (key && penalties[key]) return Number(penalties[key].count || 0) || 0;
  }
  return 0;
}

function assetNeedsLiveRefresh(asset = {}, publishedState = new Map(), queueState = {}, staleDays = 30) {
  const cutoff = Date.now() - (staleDays * 24 * 60 * 60 * 1000);
  const recentSuccess = queueSuccessAt(asset, queueState);
  if (recentSuccess) {
    const successTime = Date.parse(recentSuccess);
    if (Number.isFinite(successTime) && successTime >= cutoff) return false;
  }
  const keys = [
    asset.id,
    asset.object_id,
    asset.qualified_name,
    asset.qualifiedName,
    stripServerPort(asset.id || asset.object_id || ''),
  ].map(normalizeObjectId);
  for (const key of keys) {
    if (!key) continue;
    const published = publishedState.get(key);
    if (!published?.profiled_at) continue;
    const profiledAt = Date.parse(published.profiled_at);
    if (Number.isFinite(profiledAt) && profiledAt >= cutoff) return false;
  }
  return true;
}

function dependencyReferenceId(dependency = {}) {
  return normalizeDependencyId(
    dependency.referencedObject ||
    dependency.referenced_object ||
    dependency.toTable ||
    dependency.to_table ||
    dependency.object_id ||
    dependency.id
  );
}

function buildDependencyUsageCounts(metadata = {}) {
  const counts = new Map();
  const bump = (id) => {
    const key = normalizeDependencyId(id);
    if (!key) return;
    counts.set(key, (counts.get(key) || 0) + 1);
  };

  for (const object of metadata.allObjects || []) {
    for (const dependency of Array.isArray(object.dependencies) ? object.dependencies : []) {
      bump(dependencyReferenceId(dependency));
    }
  }

  for (const relationship of metadata.relationships || []) {
    bump(relationship.toTable || relationship.to_table);
  }

  return counts;
}

function readLineageUsageCounts() {
  if (lineageUsageCache instanceof Map) return lineageUsageCache;
  const registryPath = path.join(
    process.cwd(),
    'data',
    'lineage-runtime-package',
    'sonic-data-lineage-runtime',
    'registry',
    'object-registry.jsonl'
  );
  const counts = new Map();
  if (!existsSync(registryPath)) {
    lineageUsageCache = counts;
    return counts;
  }
  const lines = readFileSync(registryPath, 'utf8').split(/\r?\n/).filter(Boolean);
  for (const line of lines) {
    try {
      const row = JSON.parse(line);
      const score = Number(row.downstream_count || 0) || 0;
      const objectId = normalizeDependencyId(row.object_id || row.id);
      if (!objectId) continue;
      counts.set(objectId, score);
      counts.set(normalizeDependencyId(stripServerPort(objectId)), score);
    } catch {
      // ignore malformed lines; local ranking is best-effort
    }
  }
  lineageUsageCache = counts;
  return counts;
}

function assetUsageCount(asset = {}, usageCounts = new Map()) {
  const candidates = [
    asset.id,
    asset.object_id,
    asset.qualified_name,
    asset.qualifiedName,
    [asset.serverName || asset.server || '', asset.database || '', asset.schema || '', asset.name || asset.object_name || '']
      .filter(Boolean)
      .join('.'),
    stripServerPort(asset.id || asset.object_id || ''),
  ];
  for (const candidate of candidates) {
    const score = usageCounts.get(normalizeDependencyId(candidate));
    if (score !== undefined) return score;
  }
  return Number(asset.downstream_count || asset.downstreamCount || 0) || 0;
}

function isLiveProfileEligible(asset = {}) {
  return ['table', 'view'].includes(objectType(asset));
}

function assetColumnsMissing(asset = {}) {
  return isLiveProfileEligible(asset) && (!Array.isArray(asset.columns) || asset.columns.length === 0);
}

function selectedAssetNames(assets = []) {
  return assets.map((asset) => asset.id || asset.object_id || objectName(asset)).filter(Boolean);
}

function mergeEnrichedAssets(assets = [], enrichedAssets = []) {
  if (!Array.isArray(enrichedAssets) || !enrichedAssets.length) return assets;
  return assets.map((asset) => {
    const match = enrichedAssets.find((candidate) => matchesRequestedAsset(candidate, asset.id || asset.object_id || objectName(asset)));
    if (!match) return asset;
    return normalizeProfileAsset({ ...asset, ...match, columns: match.columns || asset.columns }, {});
  });
}

function missingColumnSkippedItems(plan = {}) {
  return (plan.skipped || []).filter((item) => /No columns are available in the catalog metadata/i.test(item.reason || item.message || ''));
}

function liveProfilingBlockedByMissingColumns(plan = {}, run = {}) {
  const selectedForRun = Number(plan.coverage?.queue_status?.selected_for_this_run || plan.coverage?.live_assets?.length || 0);
  return (
    selectedForRun > 0 &&
    Number(run.summary?.actions_planned || plan.actions?.length || 0) === 0 &&
    missingColumnSkippedItems(plan).length > 0
  );
}

function applyMissingColumnBlock(run = {}, plan = {}) {
  if (!liveProfilingBlockedByMissingColumns(plan, run)) return run;
  const affectedObjects = missingColumnSkippedItems(plan).map((item) => item.object_name || item.asset_id).filter(Boolean);
  const message = 'Live profiling blocked by missing column metadata.';
  return {
    ...run,
    status: plan.metadata_enrichment?.status === 'partial' ? 'partial_failure' : 'failed',
    summary: {
      ...(run.summary || {}),
      live_profile_blocked: true,
      blocked_reason: 'live profiling blocked by missing column metadata',
      affected_object_count: affectedObjects.length,
      affected_objects: affectedObjects,
      metadata_enrichment: plan.metadata_enrichment || null,
    },
    errors: [
      ...(run.errors || []),
      {
        code: plan.metadata_enrichment?.error?.code || 'PROFILE_MISSING_COLUMN_METADATA',
        message,
        phase: 'metadata_enrichment',
        status: 422,
        remediation:
          plan.metadata_enrichment?.error?.remediation ||
          'Refresh source column metadata for the selected live-profile assets, then rerun the profile schedule.',
        details: {
          affected_objects: affectedObjects,
          metadata_enrichment: plan.metadata_enrichment || null,
        },
      },
    ],
    warnings: [
      ...(run.warnings || []),
      {
        asset_id: null,
        message: `${message} Affected objects: ${affectedObjects.join(', ') || 'unknown'}.`,
      },
    ],
  };
}

function groupCoverageCounts(assets = []) {
  return assets.reduce((summary, asset) => {
    const key = objectType(asset) || 'unknown';
    summary[key] = (summary[key] || 0) + 1;
    return summary;
  }, {});
}

function buildLiveUpgradeQueue(eligibleAssets = [], selectedAssets = [], options = {}) {
  const selectedIds = new Set(selectedAssets.map((asset) => asset.id || asset.object_id || asset.name));
  const targetTier = String(options.target_live_tier || options.targetLiveTier || 'standard_live').toLowerCase();
  const usageCounts = options.usage_counts instanceof Map ? options.usage_counts : new Map();
  return eligibleAssets
    .filter((asset) => !selectedIds.has(asset.id || asset.object_id || asset.name))
    .map((asset, index) => ({
      asset_id: asset.id || asset.object_id || asset.name,
      object_name: asset.name || asset.object_name || asset.id,
      object_type: objectType(asset) || 'unknown',
      schema: asset.schema || 'dbo',
      estimated_rows: assetRowEstimate(asset),
      column_count: Array.isArray(asset.columns) ? asset.columns.length : 0,
      downstream_count: assetUsageCount(asset, usageCounts),
      current_tier: 'metadata_only',
      target_tier: targetTier,
      queue_rank: index + 1,
    }));
}

function sortCoverageAssets(assets = [], priority = 'smallest_first', usageCounts = new Map(), queueState = {}) {
  const sorted = [...assets];
  sorted.sort((left, right) => {
    const timeoutDelta = timeoutScoreForAsset(left, queueState) - timeoutScoreForAsset(right, queueState);
    if (timeoutDelta !== 0) return timeoutDelta;
    const usageDelta = assetUsageCount(right, usageCounts) - assetUsageCount(left, usageCounts);
    if (priority === 'most_used_first' && usageDelta !== 0) return usageDelta;
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
    let enrichment = null;
    const requestedCoverageMode = coverageMode(options);
    const needsResolvedAssets =
      !assets.length || toArray(options.asset_id || options.assetId || options.object_id || options.objectId || options.ids).length > 0;
    if (needsResolvedAssets && !this.lastMetadata && options.dry_run === false && typeof this.loadMetadata === 'function') {
      await this.loadMetadata({ ...options, dry_run: false });
    }
    if (needsResolvedAssets && this.lastMetadata) {
      const resolvedAssets = filterRequestedAssets(metadataProfileAssets(this.lastMetadata, this.connector), options);
      if (requestedCoverageMode) {
        const usageCounts = coveragePriority(options) === 'most_used_first'
          ? readLineageUsageCounts()
          : buildDependencyUsageCounts(this.lastMetadata);
        const queueState = normalizeQueueState(options.queue_state || options.queueState || {});
        const publishedState = readPublishedLiveProfileState(this.id);
        const staleDays = liveProfileStaleDays(options);
        coverageAssets = resolvedAssets.filter((asset) => {
          if (coverageIncludesAllObjects(options)) return true;
          if (coverageIncludesViews(options)) return ['table', 'view'].includes(objectType(asset));
          return objectType(asset) === 'table';
        });
        const priority = coveragePriority(options);
        const liveEligibleAssets = coverageAssets.filter((asset) =>
          coverageIncludesViews(options) || coverageIncludesAllObjects(options)
            ? isLiveProfileEligible(asset)
            : objectType(asset) === 'table'
        )
          .filter((asset) => assetNeedsLiveRefresh(asset, publishedState, queueState, staleDays));
        const sortedCoverageAssets = sortCoverageAssets(liveEligibleAssets, priority, usageCounts, queueState);
        assets = sortedCoverageAssets.slice(0, coverageLiveTableLimit(options, 15));
        options = { ...options, usage_counts: usageCounts, queue_state: queueState };
      } else {
        assets = resolvedAssets;
      }
    }
    const liveExecutionRequested = options.dry_run === false || options.execution_mode === 'live' || options.executionMode === 'live';
    const missingColumnAssets = assets.filter(assetColumnsMissing);
    if (liveExecutionRequested && missingColumnAssets.length && typeof this.enrichProfileAssetColumns === 'function') {
      try {
        enrichment = await this.enrichProfileAssetColumns(missingColumnAssets, options);
        const enrichedAssets = enrichment?.assets || [];
        assets = mergeEnrichedAssets(assets, enrichedAssets);
        coverageAssets = mergeEnrichedAssets(coverageAssets, enrichedAssets);
      } catch (err) {
        enrichment = {
          status: 'failed',
          phase: 'metadata_enrichment',
          affected_assets: selectedAssetNames(missingColumnAssets),
          error: {
            code: err.code || 'PROFILE_METADATA_ENRICHMENT_FAILED',
            message: err.message,
            remediation:
              err.remediation ||
              'Verify connector permissions to read source column metadata for the selected table or view.',
            details: err.details || null,
          },
        };
      }
    } else if (liveExecutionRequested && missingColumnAssets.length) {
      enrichment = {
        status: 'unsupported',
        phase: 'metadata_enrichment',
        affected_assets: selectedAssetNames(missingColumnAssets),
        error: {
          code: 'PROFILE_METADATA_ENRICHMENT_UNSUPPORTED',
          message: 'Live profiling blocked by missing column metadata and this connector cannot enrich selected object columns.',
          remediation: 'Run metadata ingestion for the connector or add a connector-specific selected-object column enrichment implementation.',
        },
      };
    }
    const plan = buildProfilingPlan(
      {
        ...options,
        connector_id: this.id,
        connector_type: this.type,
        dialect: options.dialect || this.config.dialect || this.type,
        max_tables: requestedCoverageMode ? Math.max(1, assets.length || coverageLiveTableLimit(options, 15)) : options.max_tables,
        assets,
      },
      options.objectCache || new Map()
    );
    if (enrichment) {
      plan.metadata_enrichment = {
        ...enrichment,
        status:
          enrichment.status === 'failed' || enrichment.status === 'unsupported'
            ? enrichment.status
            : assets.some(assetColumnsMissing)
              ? 'partial'
              : 'succeeded',
        affected_assets: enrichment.affected_assets || selectedAssetNames(missingColumnAssets),
        enriched_assets: enrichment.enriched_assets || selectedAssetNames((enrichment.assets || []).filter((asset) => !assetColumnsMissing(asset))),
      };
    }
    if (requestedCoverageMode) {
      const usageCounts =
        options.usage_counts instanceof Map
          ? options.usage_counts
          : coveragePriority(options) === 'most_used_first'
            ? readLineageUsageCounts()
            : buildDependencyUsageCounts(this.lastMetadata || {});
      const queueState = normalizeQueueState(options.queue_state || options.queueState || {});
      const publishedState = readPublishedLiveProfileState(this.id);
      const staleDays = liveProfileStaleDays(options);
      const liveEligibleAssets = coverageAssets.filter((asset) =>
        coverageIncludesViews(options) || coverageIncludesAllObjects(options)
          ? isLiveProfileEligible(asset)
          : objectType(asset) === 'table'
      )
        .filter((asset) => assetNeedsLiveRefresh(asset, publishedState, queueState, staleDays));
      const sortedLiveEligibleAssets = sortCoverageAssets(liveEligibleAssets, coveragePriority(options), usageCounts, queueState);
      const liveQueue = buildLiveUpgradeQueue(sortedLiveEligibleAssets, assets, { ...options, usage_counts: usageCounts });
      plan.coverage = {
        enabled: true,
        mode: requestedCoverageMode,
        include_views: coverageIncludesViews(options),
        include_all_objects: coverageIncludesAllObjects(options),
        live_priority: coveragePriority(options),
        live_asset_limit: coverageLiveTableLimit(options, 15),
        assets: coverageAssets,
        live_assets: assets.map((asset) => asset.id || asset.object_id || asset.name),
        live_eligible_assets: liveEligibleAssets.map((asset) => asset.id || asset.object_id || asset.name),
        total_assets: coverageAssets.length,
        metadata_only_assets: Math.max(0, coverageAssets.length - assets.length),
        asset_counts_by_type: groupCoverageCounts(coverageAssets),
        live_eligible_counts_by_type: groupCoverageCounts(liveEligibleAssets),
        live_upgrade_queue: liveQueue,
        queue_status: {
          total_assets: coverageAssets.length,
          live_eligible_assets: liveEligibleAssets.length,
          selected_for_this_run: assets.length,
          pending_live_queue: liveQueue.length,
          completed_live_assets: 0,
          failed_live_assets: 0,
          metadata_only_assets: Math.max(0, coverageAssets.length - assets.length),
        },
      };
      plan.summary.requested_assets = coverageAssets.length;
      plan.summary.coverage_assets_total = coverageAssets.length;
      plan.summary.coverage_live_assets = assets.length;
      plan.summary.coverage_metadata_only_assets = Math.max(0, coverageAssets.length - assets.length);
      plan.summary.coverage_asset_types = groupCoverageCounts(coverageAssets);
      plan.summary.coverage_live_queue = liveQueue.length;
    }
    return plan;
  }

  async runProfiling(options = {}) {
    const plan = options.plan || (await this.planProfiling(options));
    const executor = createProfileExecutor({ connector: this.connector, options });
    const run = applyMissingColumnBlock(await executeProfilingPlan(plan, executor), plan);
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
