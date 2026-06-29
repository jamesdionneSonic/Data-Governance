import crypto from 'node:crypto';
import { readFileSync } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';

export const DELTA_SCHEMA_VERSION = '1.0';
export const DEFAULT_BASELINE = 'devops-lineage-repo';
export const DEFAULT_CHANGED_TARGETS = [
  'devops',
  'runtime',
  'rovo',
  'confluence',
  'support_docs',
  'ai_summary',
];
export const DEFAULT_REMOVED_TARGETS = ['devops', 'runtime', 'rovo', 'confluence', 'support_docs'];
export const VOLATILE_KEYS = new Set([
  'activity_run_id',
  'duration',
  'elapsed_ms',
  'extracted_at',
  'extraction_timestamp',
  'generated_at',
  'last_refreshed_at',
  'local_path_timestamp',
  'page_number',
  'pipeline_run_id',
  'profile_run_id',
  'run_id',
  'timestamp',
  'updated_at',
]);

export function stableJson(value) {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableJson(value[key])}`)
      .join(',')}}`;
  }
  return JSON.stringify(value);
}

export function hashValue(value, length = 24) {
  return crypto
    .createHash('sha256')
    .update(String(value ?? ''))
    .digest('hex')
    .slice(0, length);
}

export function metadataSignature(value) {
  return hashValue(stableJson(stripVolatileMetadata(value)), 24);
}

export function normalizePath(value) {
  return String(value || '').replace(/\\/g, '/');
}

export async function readJson(file, fallback = null) {
  try {
    return JSON.parse(await fs.readFile(file, 'utf8'));
  } catch {
    return fallback;
  }
}

export async function readJsonl(file) {
  try {
    const text = await fs.readFile(file, 'utf8');
    return text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => JSON.parse(line));
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

export async function writeJson(file, value) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

export async function writeText(file, value) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, value, 'utf8');
}

export function stripVolatileMetadata(value) {
  if (Array.isArray(value)) return value.map(stripVolatileMetadata);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(
    Object.keys(value)
      .filter((key) => !VOLATILE_KEYS.has(String(key).toLowerCase()))
      .sort()
      .map((key) => [key, stripVolatileMetadata(value[key])])
  );
}

export function canonicalObjectId(object) {
  return String(
    object?.canonical_id || object?.object_id || object?.canonicalId || object?.id || ''
  ).trim();
}

export function normalizeCurrentObject(object, fallback = {}) {
  const canonicalId = canonicalObjectId(object);
  if (!canonicalId) {
    throw new Error('Current metadata object is missing canonical_id/object_id/id.');
  }
  const metadata = object.metadata || object.source_metadata || object.signature_inputs || object;
  const signature =
    object.metadata_signature ||
    object.source_metadata_signature ||
    object.signature ||
    metadataSignature({
      canonical_id: canonicalId,
      object_type: object.object_type || object.type || fallback.object_type || '',
      database: object.database || fallback.database || '',
      schema: object.schema || fallback.schema || '',
      object_name: object.object_name || object.name || fallback.object_name || '',
      source_family: object.source_family || fallback.source_family || '',
      source_system: object.source_system || object.connector_id || fallback.source_system || '',
      metadata,
    });
  return {
    canonical_id: canonicalId,
    display_name: object.display_name || object.full_name || object.name || canonicalId,
    object_type: object.object_type || object.type || fallback.object_type || '',
    database: object.database || fallback.database || '',
    schema: object.schema || fallback.schema || '',
    object_name: object.object_name || object.name || fallback.object_name || '',
    source_family: object.source_family || fallback.source_family || '',
    source_system: object.source_system || object.connector_id || fallback.source_system || '',
    metadata_signature: signature,
    metadata: stripVolatileMetadata(metadata),
    raw: object,
  };
}

export function rowObjectId(row) {
  return String(row?.object_id || row?.canonical_id || row?.id || '').trim();
}

export function rowBelongsToScope(row, scope = {}) {
  if (!row) return false;
  if (typeof scope.filter === 'function') return scope.filter(row);
  const connectorId = scope.connector_id || scope.connectorId;
  const sourceFamily = scope.source_family || scope.sourceFamily;
  const sourceSystem = scope.source_system || scope.sourceSystem;
  const { server } = scope;
  const { database } = scope;
  const databases = new Set([...(scope.databases || []), database].filter(Boolean));
  if (connectorId && row.source_system === connectorId) return true;
  if (sourceSystem && row.source_system === sourceSystem) return true;
  if (server && row.server === server) return true;
  if (sourceFamily && row.source_family === sourceFamily) return true;
  if (databases.size && databases.has(row.database)) return true;
  return !connectorId && !sourceSystem && !server && !sourceFamily && !databases.size;
}

export async function priorMetadataSignature({ catalogRoot, row }) {
  if (!row) return null;
  if (row.metadata_signature) return row.metadata_signature;
  if (row.source_metadata_signature) return row.source_metadata_signature;
  const contextPath = row.context_pack_json_path
    ? path.join(catalogRoot, row.context_pack_json_path)
    : '';
  const context = contextPath ? await readJson(contextPath, null) : null;
  if (context?.source?.metadata_signature) return context.source.metadata_signature;
  if (context?.metadata_signature) return context.metadata_signature;
  return metadataSignature({
    object_id: row.object_id,
    display_name: row.display_name,
    server: row.server,
    database: row.database,
    schema: row.schema,
    object_name: row.object_name,
    object_type: row.object_type,
    source_system: row.source_system,
    column_count: row.column_count,
    upstream_count: row.upstream_count,
    downstream_count: row.downstream_count,
    columns: context?.columns?.preview || context?.columns || [],
    lineage: context?.lineage || {},
  });
}

export async function loadBaseline({ catalogRoot, scope = {} }) {
  const registryPath = path.join(catalogRoot, 'registry', 'object-registry.jsonl');
  const rows = await readJsonl(registryPath);
  const scopedRows = rows.filter((row) => rowBelongsToScope(row, scope));
  const signatures = new Map();
  await Promise.all(
    scopedRows.map(async (row) => {
      const id = rowObjectId(row);
      if (id) signatures.set(id, await priorMetadataSignature({ catalogRoot, row }));
    })
  );
  return {
    registry_path: normalizePath(registryPath),
    rows,
    scoped_rows: scopedRows,
    signatures,
  };
}

function emptyCounts() {
  return {
    new: 0,
    changed: 0,
    unchanged: 0,
    retained_stale: 0,
    removed_stale: 0,
  };
}

export async function buildDeltaManifest({
  catalogRoot,
  connectorId,
  sourceFamily,
  sourceScope,
  currentObjects = [],
  mode = 'plan_only',
  fullRefreshReason = '',
  generatedAt = new Date().toISOString(),
  scope = {},
  baseline,
} = {}) {
  if (!catalogRoot) throw new Error('catalogRoot is required.');
  if (!connectorId) throw new Error('connectorId is required.');
  if (!sourceFamily) throw new Error('sourceFamily is required.');
  if (!sourceScope) throw new Error('sourceScope is required.');
  if (mode === 'full_refresh' && !String(fullRefreshReason || '').trim()) {
    throw new Error('fullRefreshReason is required when mode is full_refresh.');
  }

  const normalizedObjects = currentObjects.map((object) =>
    normalizeCurrentObject(object, {
      source_family: sourceFamily,
      source_system: connectorId,
    })
  );
  const effectiveScope = {
    ...scope,
    connector_id: scope.connector_id || connectorId,
    source_family: scope.source_family || sourceFamily,
  };
  const baselineState = baseline || (await loadBaseline({ catalogRoot, scope: effectiveScope }));
  const priorById = new Map(baselineState.scoped_rows.map((row) => [rowObjectId(row), row]));
  const currentById = new Map(normalizedObjects.map((object) => [object.canonical_id, object]));
  const counts = emptyCounts();
  const objects = [];

  for (const object of normalizedObjects) {
    const priorRow = priorById.get(object.canonical_id);
    const priorSignature = baselineState.signatures.get(object.canonical_id) || null;
    const nextSignature = object.metadata_signature;
    let status = 'unchanged';
    if (!priorRow) status = 'new';
    else if (mode === 'full_refresh' || priorSignature !== nextSignature) status = 'changed';
    counts[status] += 1;
    objects.push({
      canonical_id: object.canonical_id,
      display_name: object.display_name,
      object_type: object.object_type,
      database: object.database,
      schema: object.schema,
      object_name: object.object_name,
      status,
      prior_signature: priorSignature,
      next_signature: nextSignature,
      affected_targets: status === 'new' || status === 'changed' ? DEFAULT_CHANGED_TARGETS : [],
    });
  }

  for (const priorRow of baselineState.scoped_rows) {
    const id = rowObjectId(priorRow);
    if (!id || currentById.has(id)) continue;
    const status = mode === 'full_refresh' ? 'removed_stale' : 'retained_stale';
    counts[status] += 1;
    objects.push({
      canonical_id: id,
      display_name: priorRow.display_name || id,
      object_type: priorRow.object_type || '',
      database: priorRow.database || '',
      schema: priorRow.schema || '',
      object_name: priorRow.object_name || '',
      status,
      prior_signature: baselineState.signatures.get(id) || null,
      next_signature: null,
      affected_targets: status === 'removed_stale' ? DEFAULT_REMOVED_TARGETS : [],
    });
  }

  objects.sort((left, right) => left.canonical_id.localeCompare(right.canonical_id));

  return {
    schema_version: DELTA_SCHEMA_VERSION,
    connector_id: connectorId,
    source_family: sourceFamily,
    source_scope: sourceScope,
    baseline: DEFAULT_BASELINE,
    baseline_registry_path: baselineState.registry_path,
    generated_at: generatedAt,
    mode,
    full_refresh_reason: mode === 'full_refresh' ? fullRefreshReason : '',
    counts,
    changed_object_ids: objects
      .filter((object) => object.status === 'new' || object.status === 'changed')
      .map((object) => object.canonical_id),
    objects,
  };
}

export function renderDeltaReadback(manifest) {
  const changedRows = manifest.objects.filter((object) => object.status !== 'unchanged');
  const rows = changedRows.length
    ? changedRows.map(
        (object) =>
          `| ${object.status} | ${object.canonical_id} | ${object.object_type || ''} | ${object.database || ''} | ${
            object.schema || ''
          } | ${object.object_name || ''} |`
      )
    : [
        '| none | not applicable | not applicable | not applicable | not applicable | not applicable |',
      ];
  return [
    `# Source Metadata Delta Readback`,
    '',
    `Generated: ${manifest.generated_at}`,
    '',
    `Connector: \`${manifest.connector_id}\``,
    '',
    `Source family: \`${manifest.source_family}\``,
    '',
    `Source scope: \`${manifest.source_scope}\``,
    '',
    `Mode: \`${manifest.mode}\``,
    '',
    manifest.full_refresh_reason ? `Full refresh reason: ${manifest.full_refresh_reason}` : '',
    '',
    `Baseline: \`${manifest.baseline_registry_path}\``,
    '',
    '## Counts',
    '',
    `| Status | Count |`,
    `| --- | ---: |`,
    `| new | ${manifest.counts.new} |`,
    `| changed | ${manifest.counts.changed} |`,
    `| unchanged | ${manifest.counts.unchanged} |`,
    `| retained_stale | ${manifest.counts.retained_stale} |`,
    `| removed_stale | ${manifest.counts.removed_stale} |`,
    '',
    '## Non-Unchanged Objects',
    '',
    '| Status | Canonical ID | Type | Database | Schema | Object |',
    '| --- | --- | --- | --- | --- | --- |',
    ...rows,
    '',
    '## Downstream Rule',
    '',
    'AI summarization, DevOps writes, runtime package object updates, Rovo artifacts, support docs, and Confluence dry-runs/live publishes must process only `new` and `changed` objects plus directly impacted index/shard pages unless a scoped full refresh is approved.',
    '',
  ]
    .filter((line, index, list) => line || list[index - 1] !== '')
    .join('\n');
}

export async function writeDeltaOutputs({
  manifest,
  outputDir,
  basename = 'source-metadata-delta',
}) {
  if (!outputDir) throw new Error('outputDir is required.');
  const jsonPath = path.join(outputDir, `${basename}.json`);
  const markdownPath = path.join(outputDir, `${basename}.md`);
  await writeJson(jsonPath, manifest);
  await writeText(markdownPath, renderDeltaReadback(manifest));
  return {
    manifest_path: normalizePath(jsonPath),
    readback_path: normalizePath(markdownPath),
  };
}

export async function loadDeltaManifest(filePath) {
  if (!filePath) return null;
  const manifest = await readJson(filePath, null);
  if (!manifest) throw new Error(`Could not read source metadata delta manifest: ${filePath}`);
  if (manifest.schema_version !== DELTA_SCHEMA_VERSION) {
    throw new Error(
      `Unsupported source metadata delta schema_version '${manifest.schema_version}'.`
    );
  }
  return manifest;
}

export async function requireDeltaScopeForAi(filePath, workflowName = 'AI workflow', options = {}) {
  const { allowEmpty = true } = options;
  if (!filePath) {
    throw new Error(
      `${workflowName} requires --delta-manifest. Refusing to process a broad corpus for AI.`
    );
  }
  const scope = createDeltaScope(await loadDeltaManifest(filePath));
  if (!scope.active) {
    throw new Error(`${workflowName} requires an active source metadata delta manifest.`);
  }
  if (!allowEmpty && scope.changed_object_ids.size === 0) {
    throw new Error(
      `${workflowName} has no new or changed objects in the delta manifest; AI processing is blocked.`
    );
  }
  return scope;
}

export function loadDeltaManifestSync(filePath) {
  if (!filePath) return null;
  const manifest = JSON.parse(readFileSync(filePath, 'utf8'));
  if (manifest.schema_version !== DELTA_SCHEMA_VERSION) {
    throw new Error(
      `Unsupported source metadata delta schema_version '${manifest.schema_version}'.`
    );
  }
  return manifest;
}

export function requireDeltaScopeForAiSync(filePath, workflowName = 'AI workflow', options = {}) {
  const { allowEmpty = true } = options;
  if (!filePath) {
    throw new Error(
      `${workflowName} requires --delta-manifest. Refusing to process a broad corpus for AI.`
    );
  }
  const scope = createDeltaScope(loadDeltaManifestSync(filePath));
  if (!scope.active) {
    throw new Error(`${workflowName} requires an active source metadata delta manifest.`);
  }
  if (!allowEmpty && scope.changed_object_ids.size === 0) {
    throw new Error(
      `${workflowName} has no new or changed objects in the delta manifest; AI processing is blocked.`
    );
  }
  return scope;
}

export function changedDeltaObjectIds(manifest, statuses = ['new', 'changed']) {
  if (!manifest) return new Set();
  const allowed = new Set(statuses);
  return new Set(
    (manifest.objects || [])
      .filter((object) => allowed.has(object.status))
      .map((object) => object.canonical_id)
      .filter(Boolean)
  );
}

export function createDeltaScope(manifest) {
  const changedIds = changedDeltaObjectIds(manifest);
  const active = Boolean(manifest);
  const objectStatusById = new Map(
    (manifest?.objects || [])
      .filter((object) => object?.canonical_id)
      .map((object) => [String(object.canonical_id), object.status])
  );
  return {
    active,
    manifest,
    changed_object_ids: changedIds,
    object_status_by_id: objectStatusById,
    includesObjectId(objectId) {
      if (!active) return true;
      return changedIds.has(String(objectId || ''));
    },
    includesAny(candidateIds = []) {
      if (!active) return true;
      return candidateIds.some((candidateId) => changedIds.has(String(candidateId || '')));
    },
    filterRows(rows = [], idSelector = (row) => row.object_id || row.canonical_id || row.id) {
      if (!active) return rows;
      return rows.filter((row) => changedIds.has(String(idSelector(row) || '')));
    },
    recordTargetArtifact(objectId, target, artifactPath) {
      if (!manifest || !objectId || !target || !artifactPath) return;
      if (!manifest.target_artifacts) manifest.target_artifacts = [];
      manifest.target_artifacts.push({
        canonical_id: String(objectId),
        target: String(target),
        artifact_path: String(artifactPath).replaceAll('\\', '/'),
      });
    },
    summary() {
      return {
        active,
        connector_id: manifest?.connector_id || '',
        source_family: manifest?.source_family || '',
        source_scope: manifest?.source_scope || '',
        mode: manifest?.mode || '',
        counts: manifest?.counts || null,
        changed_object_count: changedIds.size,
        target_artifact_count: manifest?.target_artifacts?.length || 0,
      };
    },
  };
}
