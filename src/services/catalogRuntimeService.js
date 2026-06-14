/**
 * Catalog Runtime Service
 * Builds and loads compact runtime indexes so the app does not keep
 * column-level evidence arrays in the global cache.
 */

import { once } from 'events';
import { createWriteStream } from 'fs';
import { mkdir, readFile, stat, writeFile } from 'fs/promises';
import path from 'path';

import { buildTypedLineageEdges, indexTypedLineageEdges } from './lineageService.js';
import { buildSemanticLineageIndex } from './semanticLineageService.js';
import {
  getMarkdownFiles,
  parseMarkdownFile,
  parseMarkdownMetadataFile,
} from './markdownService.js';

const RUNTIME_DIR_NAME = '_runtime';
const RUNTIME_INDEX_VERSION = 2;
const RUNTIME_MANIFEST_FILE = 'runtime-manifest.json';
const SUMMARY_FILE = 'catalog-summary.json';
const EDGE_INDEX_FILE = 'edge-index.json';
const SEMANTIC_EDGE_INDEX_FILE = 'semantic-edge-index.json';
const OBJECT_FILE_INDEX_FILE = 'object-file-index.json';
const COLUMN_INDEX_FILE = 'column-index.json';
const detailCache = new Map();
const DEFAULT_REFERENCE_LIMITS = {
  depends_on: 100,
  reads_from: 100,
  writes_to: 100,
  calls: 100,
  created_by: 50,
  created_via: 50,
  used_by: 50,
  contextual_reads: 0,
};

function normalizePathForManifest(filePath) {
  return String(filePath || '').replace(/\\/g, '/');
}

function runtimeDir(dataPath) {
  return path.join(dataPath, RUNTIME_DIR_NAME);
}

function runtimePaths(dataPath) {
  const root = runtimeDir(dataPath);
  return {
    root,
    manifest: path.join(root, RUNTIME_MANIFEST_FILE),
    summary: path.join(root, SUMMARY_FILE),
    edges: path.join(root, EDGE_INDEX_FILE),
    semanticEdges: path.join(root, SEMANTIC_EDGE_INDEX_FILE),
    objectFiles: path.join(root, OBJECT_FILE_INDEX_FILE),
    columns: path.join(root, COLUMN_INDEX_FILE),
  };
}

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

function countArray(value) {
  return Array.isArray(value) ? value.length : 0;
}

function relativeTo(root, filePath) {
  return normalizePathForManifest(path.relative(root, filePath));
}

function absoluteFromRelative(root, relativePath) {
  return path.resolve(root, String(relativePath || '').replace(/\//g, path.sep));
}

function compactString(value, maxLength = 500) {
  const text = String(value || '')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > maxLength ? `${text.slice(0, maxLength - 3)}...` : text;
}

function boundedNumber(value, fallback, { min = 0, max = Number.MAX_SAFE_INTEGER } = {}) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, Math.floor(parsed)));
}

function envFlag(name, fallback = false) {
  const value = process.env[name];
  if (value === undefined) return fallback;
  return ['1', 'true', 'yes', 'on'].includes(String(value).trim().toLowerCase());
}

function runtimeAutoRebuildEnabled(options) {
  if (options.autoRebuild !== undefined) return options.autoRebuild === true;
  return envFlag('CATALOG_RUNTIME_AUTO_REBUILD', false);
}

function runtimeReferenceLimit(field) {
  const envName = `CATALOG_${String(field || '').toUpperCase()}_LIMIT_PER_OBJECT`;
  return boundedNumber(process.env[envName], DEFAULT_REFERENCE_LIMITS[field] ?? 100, {
    min: 0,
    max: 10000,
  });
}

function runtimeReferenceLimits() {
  return Object.fromEntries(
    Object.keys(DEFAULT_REFERENCE_LIMITS).map((field) => [field, runtimeReferenceLimit(field)])
  );
}

function runtimeEdgeLimitsByType() {
  return {
    reads: runtimeReferenceLimit('reads_from'),
    extracts: runtimeReferenceLimit('depends_on'),
    loads: runtimeReferenceLimit('writes_to'),
    calls: runtimeReferenceLimit('calls'),
    created_by: runtimeReferenceLimit('created_by'),
    created_via: runtimeReferenceLimit('created_via'),
    used_by: runtimeReferenceLimit('used_by'),
    contextual_read: runtimeReferenceLimit('contextual_reads'),
  };
}

function runtimeConfig() {
  return {
    runtime_index_version: RUNTIME_INDEX_VERSION,
    reference_limits: runtimeReferenceLimits(),
    edge_limits_by_type: runtimeEdgeLimitsByType(),
  };
}

function sameJson(left, right) {
  return JSON.stringify(left || {}) === JSON.stringify(right || {});
}

function compactReferenceList(value, limit) {
  return ensureArray(value)
    .map((item) => String(item || '').trim())
    .filter(Boolean)
    .slice(0, limit);
}

function detailCacheLimit() {
  const value = Number(process.env.CATALOG_DETAIL_CACHE_SIZE || 200);
  return Number.isFinite(value) && value > 0 ? value : 200;
}

function getCachedDetail(cacheKey) {
  if (!detailCache.has(cacheKey)) return null;
  const value = detailCache.get(cacheKey);
  detailCache.delete(cacheKey);
  detailCache.set(cacheKey, value);
  return value;
}

function setCachedDetail(cacheKey, value) {
  detailCache.set(cacheKey, value);
  while (detailCache.size > detailCacheLimit()) {
    const oldestKey = detailCache.keys().next().value;
    detailCache.delete(oldestKey);
  }
}

function summarizeColumns(columns) {
  return ensureArray(columns)
    .slice(0, 25)
    .map((column) => ({
      name: column.name,
      column_id: column.column_id,
      data_type: column.data_type || '',
      nullable: column.nullable ?? null,
    }));
}

function appendColumnRecords(output, metadata) {
  for (const column of ensureArray(metadata.columns)) {
    output.push({
      object_id: metadata.id,
      column_id: column.column_id || `${metadata.id}.${column.name}`,
      name: column.name,
      data_type: column.data_type || '',
      nullable: column.nullable ?? null,
      ordinal: column.ordinal ?? column.column_ordinal ?? null,
      database: metadata.database,
      schema: metadata.schema || null,
      object_name: metadata.name,
      object_type: metadata.type,
    });
  }
}

function buildRuntimeSummary(metadata, dataPath, filePath) {
  const relativePath = relativeTo(dataPath, filePath);
  const columns = ensureArray(metadata.columns);
  const confidence = metadata.catalog_confidence || null;
  const truncatedReferences = {};
  const limitedReferences = (field) => {
    const input = ensureArray(metadata[field]);
    const limit = runtimeReferenceLimit(field);
    const output = compactReferenceList(input, limit);
    if (input.length > output.length) {
      truncatedReferences[field] = input.length - output.length;
    }
    return output;
  };

  return {
    id: metadata.id,
    name: metadata.name,
    server: metadata.server || null,
    schema: metadata.schema || null,
    packageName: metadata.packageName || metadata.package_name || null,
    packagePath: metadata.packagePath || metadata.package_path || null,
    database: metadata.database,
    type: metadata.type,
    owner: metadata.owner || 'unknown',
    steward: metadata.steward || null,
    domain_manager: metadata.domain_manager || null,
    custodian: metadata.custodian || null,
    sensitivity: metadata.sensitivity || 'public',
    tags: ensureArray(metadata.tags),
    description: compactString(metadata.description),
    certified: metadata.certified === true,
    trust_level: metadata.trust_level || null,
    certified_by: metadata.certified_by || null,
    certification_date: metadata.certification_date || null,
    last_updated: metadata.last_updated || null,
    columns: summarizeColumns(columns),
    column_count: columns.length,
    column_usage_count: countArray(metadata.column_usage),
    unresolved_column_usage_count: countArray(metadata.unresolved_column_usage),
    column_risk_flag_count: countArray(metadata.column_risk_flags),
    column_lineage_count: countArray(metadata.column_lineage),
    unresolved_column_lineage_count: countArray(metadata.unresolved_column_lineage),
    ssis_column_mapping_count: countArray(metadata.ssis_column_mappings),
    unresolved_ssis_column_mapping_count: countArray(metadata.unresolved_ssis_column_mappings),
    ssis_column_mapping_summary: metadata.ssis_column_mapping_summary || null,
    lineage_quality: metadata.lineage_quality || null,
    catalog_confidence: confidence,
    confidence_label: confidence?.confidence_label || 'missing',
    confidence_score:
      typeof confidence?.overall_score === 'number' ? confidence.overall_score : null,
    depends_on: limitedReferences('depends_on'),
    reads_from: limitedReferences('reads_from'),
    writes_to: limitedReferences('writes_to'),
    calls: limitedReferences('calls'),
    created_by: limitedReferences('created_by'),
    created_via: limitedReferences('created_via'),
    used_by: limitedReferences('used_by'),
    contextual_reads: limitedReferences('contextual_reads'),
    runtime_truncated_references:
      Object.keys(truncatedReferences).length > 0 ? truncatedReferences : undefined,
    external_source: metadata.external_source === true,
    filePath: absoluteFromRelative(dataPath, relativePath),
    source_path: relativePath,
    runtime_summary: true,
    heavy_fields_loaded: false,
    createdAt: new Date(),
  };
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, 'utf8'));
}

async function writeJson(filePath, value) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

async function writeStreamChunk(stream, chunk) {
  if (!stream.write(chunk)) {
    await once(stream, 'drain');
  }
}

async function finishWriteStream(stream) {
  await new Promise((resolve, reject) => {
    stream.once('finish', resolve);
    stream.once('error', reject);
    stream.end();
  });
}

async function writeJsonArrayIndex(
  filePath,
  metadata,
  arrayFieldName,
  items,
  mapItem = (item) => item
) {
  await mkdir(path.dirname(filePath), { recursive: true });
  const stream = createWriteStream(filePath, { encoding: 'utf8' });

  try {
    await writeStreamChunk(stream, '{\n');

    for (const [key, value] of Object.entries(metadata)) {
      const json = JSON.stringify(value, null, 2).replace(/\n/g, '\n  ');
      await writeStreamChunk(stream, `  ${JSON.stringify(key)}: ${json},\n`);
    }

    await writeStreamChunk(stream, `  ${JSON.stringify(arrayFieldName)}: [\n`);
    for (let index = 0; index < items.length; index += 1) {
      const json = JSON.stringify(mapItem(items[index]), null, 2).replace(/\n/g, '\n    ');
      const comma = index === items.length - 1 ? '' : ',';
      await writeStreamChunk(stream, `    ${json}${comma}\n`);
    }
    await writeStreamChunk(stream, '  ]\n}\n');
    await finishWriteStream(stream);
  } catch (err) {
    stream.destroy();
    throw err;
  }
}

async function fileMtimeMs(filePath) {
  try {
    return (await stat(filePath)).mtimeMs;
  } catch {
    return 0;
  }
}

async function runtimeIndexesCurrent(dataPath) {
  const paths = runtimePaths(dataPath);
  const runtimeManifestMtime = await fileMtimeMs(paths.manifest);
  const summaryMtime = await fileMtimeMs(paths.summary);
  const edgesMtime = await fileMtimeMs(paths.edges);
  const filesMtime = await fileMtimeMs(paths.objectFiles);
  const columnsMtime = await fileMtimeMs(paths.columns);
  if (!runtimeManifestMtime || !summaryMtime || !edgesMtime || !filesMtime || !columnsMtime) {
    return false;
  }

  let manifest;
  try {
    manifest = await readJson(paths.manifest);
  } catch {
    return false;
  }

  const config = runtimeConfig();
  if (manifest.runtime_index_version !== RUNTIME_INDEX_VERSION) return false;
  if (!sameJson(manifest.reference_limits, config.reference_limits)) return false;
  if (!sameJson(manifest.edge_limits_by_type, config.edge_limits_by_type)) return false;

  const catalogManifestMtime = await fileMtimeMs(path.join(dataPath, 'catalog-manifest.json'));
  return (
    Math.min(runtimeManifestMtime, summaryMtime, edgesMtime, filesMtime, columnsMtime) >=
    catalogManifestMtime
  );
}

function buildGraphFromTypedEdges(objects, edges) {
  const graph = new Map();
  for (const id of objects.keys()) {
    graph.set(id, new Set());
  }

  for (const edge of edges) {
    if (!edge?.source || !edge?.target || edge.source === edge.target) continue;
    if (!graph.has(edge.target)) graph.set(edge.target, new Set());
    graph.get(edge.target).add(edge.source);
    if (!graph.has(edge.source)) graph.set(edge.source, new Set());
  }

  return graph;
}

export async function buildRuntimeCatalogIndexes(dataPath, options = {}) {
  const resolvedDataPath = path.resolve(process.cwd(), dataPath);
  const mdFiles = await getMarkdownFiles(resolvedDataPath);
  const concurrency = Math.max(
    1,
    Number(options.concurrency || process.env.CATALOG_INDEX_BUILD_CONCURRENCY || 2)
  );
  const generatedAt = new Date().toISOString();
  const objects = [];
  const columns = [];
  const fileIndex = {};
  let nextIndex = 0;
  detailCache.clear();

  const workers = Array.from({ length: Math.min(concurrency, mdFiles.length) }, async () => {
    while (nextIndex < mdFiles.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      const filePath = mdFiles[currentIndex];

      try {
        // eslint-disable-next-line no-await-in-loop
        const metadata = await parseMarkdownMetadataFile(filePath);
        const summary = buildRuntimeSummary(metadata, resolvedDataPath, filePath);
        objects[currentIndex] = summary;
        fileIndex[summary.id] = summary.source_path;
        appendColumnRecords(columns, metadata);
      } catch (err) {
        console.warn(`Runtime catalog index skipped ${filePath}: ${err.message}`);
      }
    }
  });

  await Promise.all(workers);

  let compactObjectCount = 0;
  for (const object of objects) {
    if (!object) continue;
    objects[compactObjectCount] = object;
    compactObjectCount += 1;
  }
  objects.length = compactObjectCount;

  const objectMap = new Map();
  for (const object of objects) {
    objectMap.set(object.id, object);
  }
  const runtimeConfigSnapshot = runtimeConfig();
  const typedEdges = buildTypedLineageEdges(objectMap, {
    dedupe: true,
    maxEdgesPerObjectByType: runtimeConfigSnapshot.edge_limits_by_type,
  });
  const semanticLineage = buildSemanticLineageIndex(objectMap);
  const semanticEdges = semanticLineage.edges;
  for (const object of objects) {
    const semanticPack = semanticLineage.packs.get(object.id);
    if (!semanticPack) continue;
    object.semantic_lineage = {
      plain_english: semanticPack.summary.plain_english,
      counts: semanticPack.summary.counts,
      semantic_edge_types: semanticPack.summary.semantic_edge_types,
    };
  }
  const objectCount = objects.length;
  const columnCount = columns.length;
  const edgeCount = typedEdges.length;
  const semanticEdgeCount = semanticEdges.length;
  const paths = runtimePaths(resolvedDataPath);
  objectMap.clear();

  await writeJsonArrayIndex(
    paths.summary,
    {
      runtime_index_version: RUNTIME_INDEX_VERSION,
      generated_at: generatedAt,
      source_markdown_root: normalizePathForManifest(resolvedDataPath),
      object_count: objectCount,
      mode: 'summary',
    },
    'objects',
    objects,
    (object) => ({
      ...object,
      filePath: undefined,
    })
  );
  objects.length = 0;

  await writeJsonArrayIndex(
    paths.edges,
    {
      runtime_index_version: RUNTIME_INDEX_VERSION,
      generated_at: generatedAt,
      source_markdown_root: normalizePathForManifest(resolvedDataPath),
      edge_count: edgeCount,
    },
    'edges',
    typedEdges
  );
  typedEdges.length = 0;

  await writeJsonArrayIndex(
    paths.semanticEdges,
    {
      runtime_index_version: RUNTIME_INDEX_VERSION,
      generated_at: generatedAt,
      source_markdown_root: normalizePathForManifest(resolvedDataPath),
      edge_count: semanticEdgeCount,
    },
    'edges',
    semanticEdges
  );
  semanticEdges.length = 0;

  await writeJson(paths.objectFiles, {
    generated_at: generatedAt,
    source_markdown_root: normalizePathForManifest(resolvedDataPath),
    files: fileIndex,
  });
  await writeJsonArrayIndex(
    paths.columns,
    {
      generated_at: generatedAt,
      source_markdown_root: normalizePathForManifest(resolvedDataPath),
      column_count: columnCount,
    },
    'columns',
    columns
  );
  columns.length = 0;

  await writeJson(paths.manifest, {
    ...runtimeConfigSnapshot,
    generated_at: generatedAt,
    source_markdown_root: normalizePathForManifest(resolvedDataPath),
    object_count: objectCount,
    column_count: columnCount,
    edge_count: edgeCount,
    semantic_edge_count: semanticEdgeCount,
    files: {
      summary: SUMMARY_FILE,
      edges: EDGE_INDEX_FILE,
      semanticEdges: SEMANTIC_EDGE_INDEX_FILE,
      objectFiles: OBJECT_FILE_INDEX_FILE,
      columns: COLUMN_INDEX_FILE,
    },
  });

  return {
    dataPath: resolvedDataPath,
    objectCount,
    columnCount,
    edgeCount,
    paths,
  };
}

export async function loadRuntimeCatalog(dataPath, options = {}) {
  const resolvedDataPath = path.resolve(process.cwd(), dataPath);
  const indexesCurrent = await runtimeIndexesCurrent(resolvedDataPath);
  if (options.rebuild || !indexesCurrent) {
    if (!options.rebuild && !runtimeAutoRebuildEnabled(options)) {
      const err = new Error(
        `Runtime catalog indexes are missing or stale for ${resolvedDataPath}. Run npm run catalog:index after markdown-only changes, or npm run catalog:refresh after raw-source rebuilds. Set CATALOG_RUNTIME_AUTO_REBUILD=true only for controlled environments that may build indexes during app startup.`
      );
      err.code = 'CATALOG_RUNTIME_INDEX_STALE';
      err.dataPath = resolvedDataPath;
      throw err;
    }

    await buildRuntimeCatalogIndexes(resolvedDataPath, options);
  }

  const paths = runtimePaths(resolvedDataPath);
  const manifest = await readJson(paths.manifest).catch(() => ({}));
  const objectFileIndexJson = await readJson(paths.objectFiles);

  const objectFileIndex = new Map(
    Object.entries(objectFileIndexJson.files || {}).map(([id, relativePath]) => [
      id,
      absoluteFromRelative(resolvedDataPath, relativePath),
    ])
  );
  objectFileIndexJson.files = {};

  const summaryIndex = await readJson(paths.summary);
  const generatedAt = summaryIndex.generated_at;
  const mode = summaryIndex.mode || 'summary';
  const objects = new Map(
    ensureArray(summaryIndex.objects).map((object) => [
      object.id,
      {
        ...object,
        filePath:
          objectFileIndex.get(object.id) ||
          absoluteFromRelative(resolvedDataPath, object.source_path),
        createdAt: new Date(),
      },
    ])
  );
  summaryIndex.objects = [];

  const edgeIndex = await readJson(paths.edges);
  const typedEdges = ensureArray(edgeIndex.edges);
  const typedEdgeIndex = indexTypedLineageEdges(typedEdges);
  const semanticEdgeIndex = await readJson(paths.semanticEdges).catch(() => ({ edges: [] }));
  const semanticEdges = ensureArray(semanticEdgeIndex.edges);
  const lineageGraph = buildGraphFromTypedEdges(objects, typedEdges);

  return {
    dataPath: resolvedDataPath,
    objects,
    lineageGraph,
    typedEdges,
    typedEdgeIndex,
    semanticEdges,
    objectFileIndex,
    generatedAt,
    mode,
    manifest,
    paths,
  };
}

export async function loadObjectDetail(dataPath, objectId, objectFileIndex = null) {
  const resolvedDataPath = path.resolve(process.cwd(), dataPath);
  let filePath = objectFileIndex?.get?.(objectId);

  if (!filePath) {
    const paths = runtimePaths(resolvedDataPath);
    const objectFileIndexJson = await readJson(paths.objectFiles);
    const relativePath = objectFileIndexJson.files?.[objectId];
    if (relativePath) filePath = absoluteFromRelative(resolvedDataPath, relativePath);
  }

  if (!filePath) {
    return null;
  }

  const cacheKey = `${objectId}:${filePath}`;
  const cached = getCachedDetail(cacheKey);
  if (cached) return cached;

  const detail = await parseMarkdownFile(filePath);
  setCachedDetail(cacheKey, detail);
  return detail;
}

export default {
  buildRuntimeCatalogIndexes,
  loadObjectDetail,
  loadRuntimeCatalog,
};
