import 'dotenv/config';

import { createHash } from 'crypto';
import {
  copyFile,
  mkdir,
  readdir,
  readFile,
  rm,
  stat,
  writeFile,
} from 'fs/promises';
import path from 'path';
import { deriveSemanticLineageGroups } from '../src/services/semanticLineageRuntimeGrouping.js';
import { buildDatabaseCatalogAnswer } from '../src/services/lineageCatalogAnswerService.js';

const DEFAULT_SOURCE_REPO = '../Sonic-data-lineage';
const DEFAULT_PACKAGE_ROOT = './data/lineage-runtime-package/sonic-data-lineage-runtime';
const DEFAULT_PACKAGE_NAME = 'sonic-data-lineage-runtime';
const PACKAGE_SCHEMA_VERSION = 1;
const RUNTIME_BUILDER_VERSION = 3;
const COPY_ENTRIES = [
  '.gitattributes',
  'AI_README.md',
  'catalog-manifest.json',
  'schemas',
  'registry',
  'context-packs',
  'servers',
  'ssis',
  'reports',
  'docs',
];
const HASH_FILES = [
  'catalog-manifest.json',
  'registry/object-registry.jsonl',
  'registry/canonical-objects.jsonl',
  'registry/duplicate-objects.jsonl',
  'registry/unresolved-server-objects.jsonl',
  'registry/database-index.json',
  'answers/catalog/databases.json',
  'registry/object-registry-summary.json',
  'indexes/index-manifest.json',
  'AI_README.md',
];
const RANKING_LIMIT = 500;
const TOP_USED_LIMIT = 100;
const DIRECT_EDGE_LIMIT = 120;

function argValue(name) {
  const prefix = `${name}=`;
  const found = process.argv.slice(2).find((arg) => arg.startsWith(prefix));
  return found ? found.slice(prefix.length) : '';
}

function hasFlag(name) {
  return process.argv.slice(2).includes(name);
}

function normalizePath(value) {
  return String(value || '').replace(/\\/g, '/');
}

function defaultVersion() {
  const now = new Date();
  return `${now.getUTCFullYear()}.${now.getUTCMonth() + 1}.${now.getUTCDate()}-1`;
}

function isWithin(parent, child) {
  const relative = path.relative(parent, child);
  return Boolean(relative) && !relative.startsWith('..') && !path.isAbsolute(relative);
}

function assertSafeOutputRoot(outputRoot) {
  const cwd = path.resolve(process.cwd());
  if (!isWithin(cwd, outputRoot)) {
    throw new Error(`Package output must stay inside this workspace: ${outputRoot}`);
  }
  if (path.basename(outputRoot).toLowerCase() === '.git' || outputRoot.toLowerCase().includes(`${path.sep}.git${path.sep}`)) {
    throw new Error(`Package output cannot be inside a .git directory: ${outputRoot}`);
  }
}

async function fileExists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, 'utf8'));
}

async function readJsonIfExists(filePath, fallback = null) {
  if (!(await fileExists(filePath))) return fallback;
  return readJson(filePath);
}

async function writeJson(root, relativePath, value) {
  const filePath = path.join(root, relativePath);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

async function writeJsonIfChanged(root, relativePath, value) {
  const filePath = path.join(root, relativePath);
  const content = `${JSON.stringify(value, null, 2)}\n`;
  if (await fileExists(filePath)) {
    const existing = await readFile(filePath, 'utf8');
    if (existing === content) return { written: false, byteCount: Buffer.byteLength(content) };
  }
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, content, 'utf8');
  return { written: true, byteCount: Buffer.byteLength(content) };
}

async function writeJsonl(root, relativePath, rows) {
  await writeText(root, relativePath, rows.map((row) => JSON.stringify(row)).join('\n') + '\n');
}

async function writeJsonlIfChanged(root, relativePath, rows) {
  return writeTextIfChanged(root, relativePath, rows.map((row) => JSON.stringify(row)).join('\n') + '\n');
}

async function writeText(root, relativePath, value) {
  const filePath = path.join(root, relativePath);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, value, 'utf8');
}

async function writeTextIfChanged(root, relativePath, value) {
  const filePath = path.join(root, relativePath);
  if (await fileExists(filePath)) {
    const existing = await readFile(filePath, 'utf8');
    if (existing === value) return { written: false, byteCount: Buffer.byteLength(value) };
  }
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, value, 'utf8');
  return { written: true, byteCount: Buffer.byteLength(value) };
}

async function removeIfExists(root, relativePath) {
  const filePath = path.join(root, relativePath);
  if (!(await fileExists(filePath))) return false;
  await rm(filePath, { force: true });
  return true;
}

async function listFilesRecursive(root, current = '') {
  const directory = path.join(root, current);
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const relativePath = normalizePath(path.join(current, entry.name));
    if (entry.isDirectory()) {
      // eslint-disable-next-line no-await-in-loop
      const childFiles = await listFilesRecursive(root, relativePath);
      for (const childFile of childFiles) {
        files.push(childFile);
      }
    } else if (entry.isFile()) {
      files.push(relativePath);
    }
  }

  return files;
}

async function copyTree(sourceRoot, targetRoot, relativePath, previousCopyState = {}, nextCopyState = {}) {
  const sourcePath = path.join(sourceRoot, relativePath);
  const targetPath = path.join(targetRoot, relativePath);
  const sourceStat = await stat(sourcePath);

  if (sourceStat.isDirectory()) {
    await mkdir(targetPath, { recursive: true });
    const entries = await readdir(sourcePath, { withFileTypes: true });
    let copied = { fileCount: 0, byteCount: 0, copiedFileCount: 0, skippedFileCount: 0 };
    for (const entry of entries) {
      const childRelativePath = normalizePath(path.join(relativePath, entry.name));
      // eslint-disable-next-line no-await-in-loop
      const childCopied = await copyTree(sourceRoot, targetRoot, childRelativePath, previousCopyState, nextCopyState);
      copied = {
        fileCount: copied.fileCount + childCopied.fileCount,
        byteCount: copied.byteCount + childCopied.byteCount,
        copiedFileCount: copied.copiedFileCount + childCopied.copiedFileCount,
        skippedFileCount: copied.skippedFileCount + childCopied.skippedFileCount,
      };
    }
    return copied;
  }

  const sourceHash = await sha256File(sourcePath);
  const previous = previousCopyState[relativePath];
  nextCopyState[relativePath] = {
    source_hash: sourceHash,
    byte_count: sourceStat.size,
  };

  if (
    previous?.source_hash === sourceHash &&
    previous?.byte_count === sourceStat.size &&
    (await fileExists(targetPath))
  ) {
    return { fileCount: 1, byteCount: sourceStat.size, copiedFileCount: 0, skippedFileCount: 1 };
  }

  await mkdir(path.dirname(targetPath), { recursive: true });
  await copyFile(sourcePath, targetPath);
  return { fileCount: 1, byteCount: sourceStat.size, copiedFileCount: 1, skippedFileCount: 0 };
}

async function countJsonl(filePath) {
  const content = await readFile(filePath, 'utf8');
  return content.split(/\r?\n/).filter(Boolean).length;
}

async function sha256File(filePath) {
  const hash = createHash('sha256');
  hash.update(await readFile(filePath));
  return hash.digest('hex');
}

async function fileSize(filePath) {
  return (await stat(filePath)).size;
}

async function runLimited(items, limit, worker) {
  let nextIndex = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      // eslint-disable-next-line no-await-in-loop
      await worker(items[currentIndex], currentIndex);
    }
  });
  await Promise.all(workers);
}

function hashValue(value, length = 12) {
  return createHash('sha256').update(String(value || '')).digest('hex').slice(0, length);
}

function sha256Text(value) {
  return createHash('sha256').update(String(value || ''), 'utf8').digest('hex');
}

function defaultBuildStatePath(packageRoot) {
  return path.join(path.dirname(packageRoot), '.build-state.json');
}

function sortedObjectFingerprintRows(objects) {
  return Object.entries(objects || {})
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([objectId, state]) => ({
      object_id: objectId,
      fingerprint: state.fingerprint,
      context_hash: state.context_hash,
      row_hash: state.row_hash,
    }));
}

function runtimeContentHash({ sourceManifest, objects }) {
  return sha256Text(
    JSON.stringify({
      builder_version: RUNTIME_BUILDER_VERSION,
      catalog_generated_at: sourceManifest.generated_at || '',
      catalog_schema_version: sourceManifest.schema_version || 0,
      object_fingerprints: sortedObjectFingerprintRows(objects),
    })
  );
}

function safeSegment(value, fallback = 'value') {
  const raw = String(value || fallback).trim() || fallback;
  const safe = raw
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, '_')
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');
  return `${safe.slice(0, 90) || fallback}--${hashValue(raw, 10)}`;
}

function normalizeLookupKey(value) {
  return String(value || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\[\]`"'{}()]/g, '')
    .replace(/\s*\.\s*/g, '.')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

function compactLookupKey(value) {
  return normalizeLookupKey(value).replace(/[^a-z0-9]/g, '');
}

function camelWords(value) {
  return String(value || '')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_\-.]+/g, ' ')
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function pushLookupVariant(set, value) {
  const normalized = normalizeLookupKey(value);
  if (normalized) set.add(normalized);
  const compact = compactLookupKey(value);
  if (compact && compact !== normalized) set.add(compact);

  const words = camelWords(value);
  if (words.length > 1) {
    set.add(words.join('_').toLowerCase());
    set.add(words.join(' ').toLowerCase());
    set.add(words.join('').toLowerCase());
  }
}

function pushLookupBasic(set, value) {
  const normalized = normalizeLookupKey(value);
  if (normalized) set.add(normalized);
  const compact = compactLookupKey(value);
  if (compact && compact !== normalized) set.add(compact);
}

function pushCommonAlias(set, value) {
  pushLookupBasic(set, value);
  const words = camelWords(value);
  if (words.length > 1) {
    set.add(words.join('_').toLowerCase());
    set.add(words.join(' ').toLowerCase());
    set.add(words.join('').toLowerCase());
  }
}

function registryIdentityKey(row) {
  return [
    row.database,
    row.schema,
    row.object_name || row.display_name,
    row.object_type,
  ]
    .map((part) => normalizeLookupKey(part))
    .join('|');
}

function isUnresolvedServerObject(row) {
  return ['server', 'source_system']
    .map((key) => normalizeLookupKey(row[key]))
    .some((value) => value === 'unknown' || value === 'unresolved');
}

function objectTypeDirectory(type) {
  const normalized = normalizeLookupKey(type || 'objects');
  if (normalized === 'table') return 'tables';
  if (normalized === 'view') return 'views';
  if (normalized === 'procedure' || normalized === 'stored_procedure') return 'procedures';
  if (normalized === 'function' || normalized === 'table_function') return 'functions';
  if (normalized === 'package') return 'packages';
  if (normalized === 'synonym') return 'synonyms';
  return `${normalized || 'object'}s`;
}

function briefObject(row, extra = {}) {
  return {
    object_id: row.object_id,
    display_name: row.display_name || row.object_name || row.object_id,
    server: row.server || '',
    database: row.database || '',
    schema: row.schema || '',
    object_name: row.object_name || row.display_name || '',
    object_type: row.object_type || '',
    confidence: row.confidence ?? null,
    confidence_label: row.confidence_label || '',
    upstream_count: Number(row.upstream_count || 0),
    downstream_count: Number(row.downstream_count || 0),
    column_count: Number(row.column_count || 0),
    canonical: row.runtime_canonical === true,
    duplicate: row.runtime_duplicate === true,
    unresolved_server: row.runtime_unresolved_server === true,
    context_pack_json_path: normalizePath(row.context_pack_json_path || ''),
    compact_context_pack_path: normalizePath(extra.compactContextPath || row.compact_context_pack_path || ''),
    source_markdown_path: normalizePath(row.source_markdown_path || ''),
    answer_cards: extra.answerCards || row.answer_cards || undefined,
  };
}

function indexObject(row) {
  return {
    object_id: row.object_id,
    display_name: row.display_name || row.object_name || row.object_id,
    database: row.database || '',
    schema: row.schema || '',
    object_name: row.object_name || row.display_name || '',
    object_type: row.object_type || '',
    confidence: row.confidence ?? null,
    upstream_count: Number(row.upstream_count || 0),
    downstream_count: Number(row.downstream_count || 0),
    canonical: row.runtime_canonical === true,
    duplicate: row.runtime_duplicate === true,
    unresolved_server: row.runtime_unresolved_server === true,
    compact_context_pack_path: normalizePath(row.compact_context_pack_path || ''),
  };
}

function sortObjectsForLookup(a, b) {
  const canonicalDelta = Number(b.runtime_canonical === true) - Number(a.runtime_canonical === true);
  if (canonicalDelta) return canonicalDelta;
  const unresolvedDelta = Number(a.runtime_unresolved_server === true) - Number(b.runtime_unresolved_server === true);
  if (unresolvedDelta) return unresolvedDelta;
  const confidenceDelta = Number(b.confidence || 0) - Number(a.confidence || 0);
  if (confidenceDelta) return confidenceDelta;
  return (
    Number(b.downstream_count || 0) +
    Number(b.upstream_count || 0) -
    (Number(a.downstream_count || 0) + Number(a.upstream_count || 0))
  );
}

function sortByUsage(direction) {
  return (a, b) => {
    const primary = direction === 'upstream' ? 'upstream_count' : 'downstream_count';
    const secondary = direction === 'upstream' ? 'downstream_count' : 'upstream_count';
    return (
      Number(b[primary] || 0) - Number(a[primary] || 0) ||
      Number(b[secondary] || 0) - Number(a[secondary] || 0) ||
      String(a.display_name || a.object_id).localeCompare(String(b.display_name || b.object_id))
    );
  };
}

async function readRegistryRows(packageRoot) {
  const registryPath = path.join(packageRoot, 'registry/object-registry.jsonl');
  const content = await readFile(registryPath, 'utf8');
  return content
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line, index) => {
      try {
        return JSON.parse(line);
      } catch (error) {
        throw new Error(`Invalid registry row ${index + 1}: ${error.message}`);
      }
    });
}

async function readContextPack(packageRoot, row) {
  const relativePath = normalizePath(row.context_pack_json_path);
  if (!relativePath) return null;
  try {
    return await readJson(path.join(packageRoot, relativePath));
  } catch {
    return null;
  }
}

function buildOrchestratorsByTarget(rows, contextPackByObjectId) {
  const orchestratorsByTarget = new Map();
  for (const row of rows) {
    const objectType = normalizeLookupKey(row.object_type || '');
    if (objectType !== 'package' && objectType !== 'ssis_package') continue;
    const downstream = ensureArray(contextPackByObjectId.get(row.object_id)?.lineage?.downstream);
    for (const targetId of downstream) {
      if (!orchestratorsByTarget.has(targetId)) orchestratorsByTarget.set(targetId, new Set());
      orchestratorsByTarget.get(targetId).add(row.object_id);
    }
  }
  return orchestratorsByTarget;
}

function lookupKeysForRow(row, contextPack) {
  const keys = new Set();
  const parts = {
    server: row.server || contextPack?.identity?.server || '',
    database: row.database || contextPack?.identity?.database || '',
    schema: row.schema || contextPack?.identity?.schema || '',
    name: row.object_name || row.display_name || contextPack?.identity?.object_name || '',
    display: row.display_name || '',
  };

  for (const value of [
    parts.name,
    parts.display,
    `${parts.schema}.${parts.name}`,
    `${parts.database}.${parts.schema}.${parts.name}`,
    `${parts.server}.${parts.database}.${parts.schema}.${parts.name}`,
  ]) {
    pushLookupBasic(keys, value);
  }

  return [...keys].filter((key) => key.length <= 220).sort();
}

function aliasKeysForRow(row, contextPack) {
  const keys = new Set();
  const aliases = contextPack?.identity?.aliases || [];
  for (const value of [
    row.object_id,
    row.object_name,
    row.display_name,
    `${row.schema}.${row.object_name}`,
    `${row.database}.${row.schema}.${row.object_name}`,
    ...aliases,
  ]) {
    pushCommonAlias(keys, value);
  }
  return [...keys].filter((key) => key.length <= 220).sort();
}

function compactContextPack(row, contextPack, answerCards, relationIndex = {}) {
  const lineage = contextPack?.lineage || {};
  const columns = contextPack?.columns || {};
  const directEdges = Array.isArray(lineage.direct_edges) ? lineage.direct_edges : [];
  const semanticLineage = deriveSemanticLineageGroups(row.object_id, contextPack, relationIndex);
  return {
    schema_version: 1,
    object_id: row.object_id,
    identity: {
      display_name: row.display_name || contextPack?.identity?.display_name || row.object_name,
      server: row.server || contextPack?.identity?.server || '',
      database: row.database || contextPack?.identity?.database || '',
      schema: row.schema || contextPack?.identity?.schema || '',
      object_name: row.object_name || contextPack?.identity?.object_name || '',
      object_type: row.object_type || contextPack?.identity?.object_type || '',
      aliases: contextPack?.identity?.aliases || [],
      lookup_keys: row.lookup_keys || [],
    },
    counts: {
      upstream: Number(row.upstream_count || lineage.upstream_count || 0),
      downstream: Number(row.downstream_count || lineage.downstream_count || 0),
      columns: Number(row.column_count || columns.count || 0),
    },
    confidence: {
      overall: row.confidence ?? contextPack?.confidence?.overall ?? null,
      label: row.confidence_label || contextPack?.confidence?.label || '',
      edge: row.edge_confidence ?? contextPack?.confidence?.edge ?? null,
      column: row.column_confidence ?? contextPack?.confidence?.column ?? null,
    },
    lineage: {
      upstream: lineage.upstream || [],
      downstream: lineage.downstream || [],
      upstream_truncated: Boolean(lineage.upstream_truncated),
      downstream_truncated: Boolean(lineage.downstream_truncated),
      direct_edges: directEdges.slice(0, DIRECT_EDGE_LIMIT),
      direct_edges_count: directEdges.length,
      direct_edges_truncated: directEdges.length > DIRECT_EDGE_LIMIT,
    },
    semantic_lineage: semanticLineage,
    columns: {
      count: Number(row.column_count || columns.count || 0),
      names: columns.names || columns.column_names || columns.list || [],
      truncated: Boolean(columns.truncated),
    },
    source: {
      markdown_path: normalizePath(row.source_markdown_path || ''),
      markdown_available: Boolean(contextPack?.evidence?.source_markdown_available),
      original_context_pack_json_path: normalizePath(row.context_pack_json_path || ''),
      original_context_pack_path: normalizePath(row.context_pack_path || ''),
    },
    logic_summary: contextPack?.logic_summary || null,
    evidence_snippets: Array.isArray(contextPack?.evidence_snippets) ? contextPack.evidence_snippets : [],
    answer_cards: answerCards,
  };
}

function usageAnswerCard(row) {
  return {
    schema_version: 1,
    question_type: 'usage-count',
    object: briefObject(row),
    answer: {
      upstream_count: Number(row.upstream_count || 0),
      downstream_count: Number(row.downstream_count || 0),
      total_direct_usage_count: Number(row.upstream_count || 0) + Number(row.downstream_count || 0),
    },
    context_pack_json_path: normalizePath(row.compact_context_pack_path || row.context_pack_json_path || ''),
  };
}

function directionAnswerCard(row, direction, contextPack, relationIndex = {}) {
  const lineage = contextPack?.lineage || {};
  const values = Array.isArray(lineage[direction]) ? lineage[direction] : [];
  const semanticLineage = deriveSemanticLineageGroups(row.object_id, contextPack, relationIndex);
  return {
    schema_version: 1,
    question_type: direction,
    object: briefObject(row),
    answer: {
      count: Number(row[`${direction}_count`] || values.length || 0),
      object_ids: values,
      truncated: Boolean(lineage[`${direction}_truncated`]),
      grouped_object_ids:
        direction === 'downstream'
          ? semanticLineage.downstream_groups
          : undefined,
      grouped_counts:
        direction === 'downstream'
          ? {
              business_consumers: semanticLineage.counts.business_consumers,
              maintenance_reads: semanticLineage.counts.maintenance_reads,
              orchestrators: semanticLineage.counts.orchestrators,
            }
          : undefined,
    },
    context_pack_json_path: normalizePath(row.compact_context_pack_path || row.context_pack_json_path || ''),
  };
}

async function writeGroupedIndex(packageRoot, rootRelativePath, groups, buildPayload, stats) {
  const entries = [...groups.entries()];
  await runLimited(entries, 32, async ([key, rows]) => {
    const relativePath = `${rootRelativePath}/${safeSegment(key)}.json`;
    const result = await writeJsonIfChanged(packageRoot, relativePath, buildPayload(key, rows, relativePath));
    if (result.written) stats.indexFilesWritten += 1;
    else stats.indexFilesSkipped += 1;
  });
  return entries.length;
}

function shardForLookupKey(key) {
  const compact = compactLookupKey(key);
  if (!compact) return '_';
  return compact.slice(0, 2).padEnd(2, '_');
}

async function writeShardedLookupIndex(packageRoot, rootRelativePath, groups, indexType, keyName, stats) {
  const shards = new Map();
  for (const [key, rows] of groups.entries()) {
    const shard = shardForLookupKey(key);
    if (!shards.has(shard)) shards.set(shard, []);
    shards.get(shard).push([key, rows]);
  }

  const entries = [...shards.entries()];
  await runLimited(entries, 32, async ([shard, shardRows]) => {
    const relativePath = `${rootRelativePath}/${shard}.json`;
    const keys = {};
    for (const [key, rows] of shardRows.sort(([a], [b]) => a.localeCompare(b))) {
      keys[key] = {
        [keyName]: key,
        match_count: rows.length,
        matches: rows.map((row) => indexObject(row)),
      };
    }
    const result = await writeJsonIfChanged(packageRoot, relativePath, {
      schema_version: 1,
      index_type: indexType,
      shard,
      path: relativePath,
      key_count: Object.keys(keys).length,
      keys,
    });
    if (result.written) stats.indexFilesWritten += 1;
    else stats.indexFilesSkipped += 1;
  });
  return entries.length;
}

function addToMapList(map, key, row) {
  if (!key) return;
  if (!map.has(key)) map.set(key, []);
  map.get(key).push(row);
}

async function buildRuntimeIndexes(packageRoot, previousState = {}) {
  const rows = await readRegistryRows(packageRoot);
  const previousObjects = previousState.objects || {};
  const nextObjects = {};
  const stats = {
    objectsChanged: 0,
    objectsReused: 0,
    objectsRemoved: 0,
    objectFilesWritten: 0,
    objectFilesSkipped: 0,
    objectFilesRemoved: 0,
    indexFilesWritten: 0,
    indexFilesSkipped: 0,
    registrySplitFilesWritten: 0,
    registrySplitFilesSkipped: 0,
  };
  const groupsByIdentity = new Map();
  for (const row of rows) {
    addToMapList(groupsByIdentity, registryIdentityKey(row), row);
  }

  const unresolvedRows = [];
  const canonicalRows = [];
  const duplicateRows = [];
  for (const groupRows of groupsByIdentity.values()) {
    const sorted = [...groupRows].sort(sortObjectsForLookup);
    const resolved = sorted.filter((row) => !isUnresolvedServerObject(row));
    const unresolved = sorted.filter((row) => isUnresolvedServerObject(row));
    unresolvedRows.push(...unresolved.map((row) => ({ ...row, runtime_unresolved_server: true })));
    if (resolved.length > 0) {
      canonicalRows.push({ ...resolved[0], runtime_canonical: true });
      duplicateRows.push(...resolved.slice(1).map((row) => ({ ...row, runtime_duplicate: true })));
    }
  }

  const runtimeRowsById = new Map();
  for (const row of canonicalRows) runtimeRowsById.set(row.object_id, row);
  for (const row of duplicateRows) runtimeRowsById.set(row.object_id, row);
  for (const row of unresolvedRows) runtimeRowsById.set(row.object_id, row);
  const contextPackByObjectId = new Map();
  for (const row of runtimeRowsById.values()) {
    // eslint-disable-next-line no-await-in-loop
    contextPackByObjectId.set(row.object_id, await readContextPack(packageRoot, row));
  }
  const relationIndex = {
    orchestratorsByTarget: buildOrchestratorsByTarget([...runtimeRowsById.values()], contextPackByObjectId),
  };

  const byName = new Map();
  const byAlias = new Map();
  const byDatabase = new Map();
  const bySchema = new Map();
  let answerCardFileCount = 0;
  let compactContextFileCount = 0;

  for (const row of runtimeRowsById.values()) {
    // eslint-disable-next-line no-await-in-loop
    const contextPath = path.join(packageRoot, normalizePath(row.context_pack_json_path));
    // eslint-disable-next-line no-await-in-loop
    const contextHash = row.context_pack_json_path && (await fileExists(contextPath)) ? await sha256File(contextPath) : '';
    const rowHash = sha256Text(JSON.stringify(row));
    const objectFingerprint = sha256Text(`${RUNTIME_BUILDER_VERSION}|${rowHash}|${contextHash}`);
    const objectHash = hashValue(row.object_id, 16);
    const answerCards = {
      usage_count: `answers/usage-count/by-object-id/${objectHash}.json`,
      upstream: `answers/upstream/by-object-id/${objectHash}.json`,
      downstream: `answers/downstream/by-object-id/${objectHash}.json`,
    };
    row.answer_cards = answerCards;
    row.compact_context_pack_path = `context-packs/objects/by-id/${objectHash}.json`;

    const previousObject = previousObjects[row.object_id];
    const reusable =
      previousObject?.fingerprint === objectFingerprint &&
      Array.isArray(previousObject.lookup_keys) &&
      Array.isArray(previousObject.alias_keys) &&
      previousObject.compact_context_pack_path === row.compact_context_pack_path &&
      previousObject.answer_cards?.usage_count === answerCards.usage_count &&
      // eslint-disable-next-line no-await-in-loop
      (await fileExists(path.join(packageRoot, row.compact_context_pack_path))) &&
      // eslint-disable-next-line no-await-in-loop
      (await fileExists(path.join(packageRoot, answerCards.usage_count))) &&
      // eslint-disable-next-line no-await-in-loop
      (await fileExists(path.join(packageRoot, answerCards.upstream))) &&
      // eslint-disable-next-line no-await-in-loop
      (await fileExists(path.join(packageRoot, answerCards.downstream)));

    if (reusable) {
      row.lookup_keys = previousObject.lookup_keys;
      row.alias_keys = previousObject.alias_keys;
      stats.objectsReused += 1;
      stats.objectFilesSkipped += 4;
    } else {
      // eslint-disable-next-line no-await-in-loop
      const contextPack = contextPackByObjectId.get(row.object_id) || null;
      row.lookup_keys = lookupKeysForRow(row, contextPack);
      row.alias_keys = aliasKeysForRow(row, contextPack);

      // eslint-disable-next-line no-await-in-loop
      const usageResult = await writeJsonIfChanged(packageRoot, answerCards.usage_count, usageAnswerCard(row));
      // eslint-disable-next-line no-await-in-loop
      const upstreamResult = await writeJsonIfChanged(packageRoot, answerCards.upstream, directionAnswerCard(row, 'upstream', contextPack, relationIndex));
      // eslint-disable-next-line no-await-in-loop
      const downstreamResult = await writeJsonIfChanged(packageRoot, answerCards.downstream, directionAnswerCard(row, 'downstream', contextPack, relationIndex));
      // eslint-disable-next-line no-await-in-loop
      const compactResult = await writeJsonIfChanged(packageRoot, row.compact_context_pack_path, compactContextPack(row, contextPack, answerCards, relationIndex));
      for (const result of [usageResult, upstreamResult, downstreamResult, compactResult]) {
        if (result.written) stats.objectFilesWritten += 1;
        else stats.objectFilesSkipped += 1;
      }
      stats.objectsChanged += 1;
    }

    nextObjects[row.object_id] = {
      fingerprint: objectFingerprint,
      row_hash: rowHash,
      context_hash: contextHash,
      lookup_keys: row.lookup_keys,
      alias_keys: row.alias_keys,
      compact_context_pack_path: row.compact_context_pack_path,
      answer_cards: answerCards,
    };

    answerCardFileCount += 3;
    compactContextFileCount += 1;

    for (const key of row.lookup_keys) addToMapList(byName, key, row);
    for (const key of row.alias_keys) addToMapList(byAlias, key, row);
    addToMapList(byDatabase, row.database || 'unknown', row);
    addToMapList(bySchema, `${row.database || 'unknown'}.${row.schema || 'unknown'}`, row);
  }

  for (const [objectId, previousObject] of Object.entries(previousObjects)) {
    if (nextObjects[objectId]) continue;
    stats.objectsRemoved += 1;
    const stalePaths = [
      previousObject.compact_context_pack_path,
      previousObject.answer_cards?.usage_count,
      previousObject.answer_cards?.upstream,
      previousObject.answer_cards?.downstream,
    ].filter(Boolean);
    for (const relativePath of stalePaths) {
      // eslint-disable-next-line no-await-in-loop
      if (await removeIfExists(packageRoot, relativePath)) stats.objectFilesRemoved += 1;
    }
  }

  for (const rowsForKey of [...byName.values(), ...byAlias.values(), ...byDatabase.values(), ...bySchema.values()]) {
    rowsForKey.sort(sortObjectsForLookup);
  }

  const databaseIndex = await readJson(path.join(packageRoot, 'registry/database-index.json'));
  const databaseCatalogAnswer = buildDatabaseCatalogAnswer(databaseIndex, byDatabase);
  const databaseCatalogResult = await writeJsonIfChanged(packageRoot, 'answers/catalog/databases.json', databaseCatalogAnswer);
  if (databaseCatalogResult.written) stats.indexFilesWritten += 1;
  else stats.indexFilesSkipped += 1;

  for (const result of [
    await writeJsonlIfChanged(packageRoot, 'registry/canonical-objects.jsonl', canonicalRows),
    await writeJsonlIfChanged(packageRoot, 'registry/duplicate-objects.jsonl', duplicateRows),
    await writeJsonlIfChanged(packageRoot, 'registry/unresolved-server-objects.jsonl', unresolvedRows),
  ]) {
    if (result.written) stats.registrySplitFilesWritten += 1;
    else stats.registrySplitFilesSkipped += 1;
  }

  const byNameFileCount = await writeShardedLookupIndex(packageRoot, 'indexes/by-name', byName, 'by-name', 'lookup_key', stats);
  const aliasFileCount = await writeShardedLookupIndex(packageRoot, 'indexes/aliases', byAlias, 'aliases', 'alias', stats);
  const byDatabaseFileCount = await writeGroupedIndex(packageRoot, 'indexes/by-database', byDatabase, (key, matches, relativePath) => ({
    schema_version: 1,
    index_type: 'by-database',
    database: key,
    path: relativePath,
    object_count: matches.length,
    objects: matches.map((row) => indexObject(row)),
  }), stats);
  const bySchemaFileCount = await writeGroupedIndex(packageRoot, 'indexes/by-schema', bySchema, (key, matches, relativePath) => {
    const [database, ...schemaParts] = key.split('.');
    return {
      schema_version: 1,
      index_type: 'by-schema',
      database,
      schema: schemaParts.join('.'),
      path: relativePath,
      object_count: matches.length,
      objects: matches.map((row) => indexObject(row)),
    };
  }, stats);

  let topUsedFileCount = 0;
  let rankingFileCount = 0;
  for (const [database, matches] of byDatabase.entries()) {
    const topUsed = [...matches].sort(sortByUsage('downstream')).slice(0, TOP_USED_LIMIT);
    // eslint-disable-next-line no-await-in-loop
    const topUsedResult = await writeJsonIfChanged(packageRoot, `indexes/top-used/${safeSegment(database)}.json`, {
      schema_version: 1,
      index_type: 'top-used',
      database,
      scope: 'database',
      ranking: 'downstream_count',
      limit: TOP_USED_LIMIT,
      objects: topUsed.map((row) => indexObject(row)),
    });
    if (topUsedResult.written) stats.indexFilesWritten += 1;
    else stats.indexFilesSkipped += 1;
    topUsedFileCount += 1;

    const tableRows = matches.filter((row) => normalizeLookupKey(row.object_type) === 'table');
    const dbDir = `indexes/rankings/${safeSegment(database)}`;
    // eslint-disable-next-line no-await-in-loop
    const downstreamResult = await writeJsonIfChanged(packageRoot, `${dbDir}/tables-by-downstream-count.json`, {
      schema_version: 1,
      index_type: 'ranking',
      database,
      object_type: 'table',
      ranking: 'downstream_count',
      objects: [...tableRows].sort(sortByUsage('downstream')).slice(0, RANKING_LIMIT).map((row) => indexObject(row)),
    });
    // eslint-disable-next-line no-await-in-loop
    const upstreamResult = await writeJsonIfChanged(packageRoot, `${dbDir}/tables-by-upstream-count.json`, {
      schema_version: 1,
      index_type: 'ranking',
      database,
      object_type: 'table',
      ranking: 'upstream_count',
      objects: [...tableRows].sort(sortByUsage('upstream')).slice(0, RANKING_LIMIT).map((row) => indexObject(row)),
    });
    for (const result of [downstreamResult, upstreamResult]) {
      if (result.written) stats.indexFilesWritten += 1;
      else stats.indexFilesSkipped += 1;
    }
    rankingFileCount += 2;
  }

  for (const [schemaKey, matches] of bySchema.entries()) {
    const [database, ...schemaParts] = schemaKey.split('.');
    const schema = schemaParts.join('.');
    const topUsed = [...matches].sort(sortByUsage('downstream')).slice(0, TOP_USED_LIMIT);
    // eslint-disable-next-line no-await-in-loop
    const topUsedResult = await writeJsonIfChanged(packageRoot, `indexes/top-used/${safeSegment(schemaKey)}.json`, {
      schema_version: 1,
      index_type: 'top-used',
      database,
      schema,
      scope: 'schema',
      ranking: 'downstream_count',
      limit: TOP_USED_LIMIT,
      objects: topUsed.map((row) => indexObject(row)),
    });
    if (topUsedResult.written) stats.indexFilesWritten += 1;
    else stats.indexFilesSkipped += 1;
    topUsedFileCount += 1;

    const tableRows = matches.filter((row) => normalizeLookupKey(row.object_type) === 'table');
    const schemaDir = `indexes/rankings/${safeSegment(database)}/${safeSegment(schema)}`;
    // eslint-disable-next-line no-await-in-loop
    const downstreamResult = await writeJsonIfChanged(packageRoot, `${schemaDir}/tables-by-downstream-count.json`, {
      schema_version: 1,
      index_type: 'ranking',
      database,
      schema,
      object_type: 'table',
      ranking: 'downstream_count',
      objects: [...tableRows].sort(sortByUsage('downstream')).slice(0, RANKING_LIMIT).map((row) => indexObject(row)),
    });
    // eslint-disable-next-line no-await-in-loop
    const upstreamResult = await writeJsonIfChanged(packageRoot, `${schemaDir}/tables-by-upstream-count.json`, {
      schema_version: 1,
      index_type: 'ranking',
      database,
      schema,
      object_type: 'table',
      ranking: 'upstream_count',
      objects: [...tableRows].sort(sortByUsage('upstream')).slice(0, RANKING_LIMIT).map((row) => indexObject(row)),
    });
    for (const result of [downstreamResult, upstreamResult]) {
      if (result.written) stats.indexFilesWritten += 1;
      else stats.indexFilesSkipped += 1;
    }
    rankingFileCount += 2;
  }

  const indexDataChanged =
    stats.objectsChanged > 0 ||
    stats.objectsRemoved > 0 ||
    stats.objectFilesWritten > 0 ||
    stats.objectFilesRemoved > 0 ||
    stats.registrySplitFilesWritten > 0 ||
    stats.indexFilesWritten > 0;
  const indexGeneratedAt =
    indexDataChanged || !previousState.index_manifest_generated_at
      ? new Date().toISOString()
      : previousState.index_manifest_generated_at;

  const indexManifest = {
    schema_version: 1,
    generated_at: indexGeneratedAt,
    registry: {
      object_registry: 'registry/object-registry.jsonl',
      canonical_objects: 'registry/canonical-objects.jsonl',
      duplicate_objects: 'registry/duplicate-objects.jsonl',
      unresolved_server_objects: 'registry/unresolved-server-objects.jsonl',
    },
    indexes: {
      by_name: 'indexes/by-name/',
      by_name_shard_strategy: 'first two normalized alphanumeric characters of lookup key',
      by_database: 'indexes/by-database/',
      by_schema: 'indexes/by-schema/',
      aliases: 'indexes/aliases/',
      aliases_shard_strategy: 'first two normalized alphanumeric characters of alias',
      top_used: 'indexes/top-used/',
      rankings: 'indexes/rankings/',
    },
    answer_cards: {
      usage_count_by_object_id: 'answers/usage-count/by-object-id/',
      upstream_by_object_id: 'answers/upstream/by-object-id/',
      downstream_by_object_id: 'answers/downstream/by-object-id/',
      catalog_databases: 'answers/catalog/databases.json',
    },
    context_packs: {
      compact_by_object_id: 'context-packs/objects/by-id/',
      original_by_database: 'context-packs/databases/',
    },
    counts: {
      registry_rows: rows.length,
      canonical_objects: canonicalRows.length,
      duplicate_objects: duplicateRows.length,
      unresolved_server_objects: unresolvedRows.length,
      by_name_files: byNameFileCount,
      alias_files: aliasFileCount,
      by_database_files: byDatabaseFileCount,
      by_schema_files: bySchemaFileCount,
      top_used_files: topUsedFileCount,
      ranking_files: rankingFileCount,
      answer_card_files: answerCardFileCount,
      catalog_answer_files: 1,
      compact_context_pack_files: compactContextFileCount,
    },
    build: {
      builder_version: RUNTIME_BUILDER_VERSION,
      incremental_enabled: true,
    },
  };

  const indexManifestResult = await writeJsonIfChanged(packageRoot, 'indexes/index-manifest.json', indexManifest);
  if (indexManifestResult.written) stats.indexFilesWritten += 1;
  else stats.indexFilesSkipped += 1;

  return { indexManifest, objects: nextObjects, stats };
}

async function buildHashes(packageRoot) {
  const hashes = {};
  for (const relativePath of HASH_FILES) {
    const filePath = path.join(packageRoot, relativePath);
    // eslint-disable-next-line no-await-in-loop
    if (await fileExists(filePath)) {
      // eslint-disable-next-line no-await-in-loop
      hashes[relativePath] = await sha256File(filePath);
    }
  }
  return hashes;
}

async function renderPackageReadme({ packageName, version, sourceManifest }) {
  return `# Sonic Data Lineage Runtime Package

Package: \`${packageName}\`
Version: \`${version}\`

This bundle is optimized for AI and automation runtime lookup. It is built from the validated Sonic data lineage DevOps catalog repository, not from Confluence page crawls.

## Retrieval Order

1. Read \`manifest.json\`.
2. Use \`indexes/by-name/\`, \`indexes/aliases/\`, \`indexes/by-database/\`, or \`indexes/rankings/\` for common lookup questions.
3. Search \`registry/canonical-objects.jsonl\` before the full compatibility registry.
4. Open the matching row's compact object context pack under \`context-packs/objects/by-id/\`, then open the original context pack only when detail is needed.
5. Use \`answers/**/by-object-id/\` for upstream, downstream, and usage-count questions when an answer card path is available.
6. Use Confluence only for governance explanation, policy, stewardship, or curated narrative.

## Current Counts

- Objects: \`${sourceManifest.object_count ?? 0}\`
- Databases: \`${sourceManifest.database_count ?? 0}\`
- Context packs: \`${sourceManifest.context_pack_count ?? 0}\`
- SSIS package contexts: \`${sourceManifest.ssis_package_context_count ?? 0}\`

## Guardrails

- Preserve exact registry object IDs and casing.
- Prefer canonical rows and show duplicate/unresolved rows only when relevant.
- Do not infer relationships that are not present in a context pack or answer card.
- Report confidence labels when answering lineage questions.
- Treat raw SQL rows with server \`unknown\` and database \`Sonic_DW\` as forbidden stale lineage data.
`;
}

function renderRuntimeGuide({ packageName, version }) {
  return `# Runtime Package Guide

Use this package when an assistant or script needs fast Sonic lineage lookup without crawling Confluence.

## Package

- Name: \`${packageName}\`
- Version: \`${version}\`

## Required Files

- \`manifest.json\`
- \`latest.json\`
- \`registry/object-registry.jsonl\`
- \`registry/canonical-objects.jsonl\`
- \`registry/database-index.json\`
- \`indexes/index-manifest.json\`
- \`indexes/by-name/**\`
- \`indexes/rankings/**\`
- \`answers/**\`
- \`context-packs/**\`
- \`ssis/**\`

## AI Routing

AI assistants should read \`manifest.json\`, then use the smallest relevant index. The registry row contains exact context pack and answer-card paths to read. Confluence is secondary and should be used only for human-friendly governance context.

## Local Validation

Run:

\`\`\`powershell
npm run lineage:runtime:check
\`\`\`
`;
}

async function main() {
  const forceRebuild = hasFlag('--force') || hasFlag('--full-rebuild');
  const sourceRoot = path.resolve(
    process.cwd(),
    argValue('--source') || process.env.LINEAGE_RUNTIME_SOURCE_REPO || process.env.CATALOG_REPO_PATH || DEFAULT_SOURCE_REPO
  );
  const packageRoot = path.resolve(
    process.cwd(),
    argValue('--out') || process.env.LINEAGE_RUNTIME_PACKAGE_ROOT || DEFAULT_PACKAGE_ROOT
  );
  const packageName = argValue('--name') || process.env.LINEAGE_RUNTIME_PACKAGE_NAME || DEFAULT_PACKAGE_NAME;
  const version = argValue('--version') || process.env.LINEAGE_RUNTIME_PACKAGE_VERSION || defaultVersion();
  const buildStatePath = path.resolve(
    process.cwd(),
    argValue('--state') || process.env.LINEAGE_RUNTIME_BUILD_STATE || defaultBuildStatePath(packageRoot)
  );

  assertSafeOutputRoot(packageRoot);
  if (!isWithin(path.resolve(process.cwd()), buildStatePath)) {
    throw new Error(`Build state must stay inside this workspace: ${buildStatePath}`);
  }

  const sourceManifestPath = path.join(sourceRoot, 'catalog-manifest.json');
  if (!(await fileExists(sourceManifestPath))) {
    throw new Error(`Missing source catalog manifest. Run npm run catalog:repo:export first: ${sourceManifestPath}`);
  }

  const sourceManifest = await readJson(sourceManifestPath);
  const previousState = await readJsonIfExists(buildStatePath, {});
  const canReusePackageRoot =
    !forceRebuild &&
    previousState?.builder_version === RUNTIME_BUILDER_VERSION &&
    previousState?.package_root === normalizePath(packageRoot) &&
    (await fileExists(packageRoot));

  if (!canReusePackageRoot) {
    await rm(packageRoot, { recursive: true, force: true, maxRetries: 8, retryDelay: 300 });
  }
  await mkdir(packageRoot, { recursive: true });

  const previousCopyState = canReusePackageRoot ? previousState.copied_files || {} : {};
  const nextCopyState = {};
  let copied = { fileCount: 0, byteCount: 0, copiedFileCount: 0, skippedFileCount: 0, removedFileCount: 0 };
  for (const entry of COPY_ENTRIES) {
    const sourcePath = path.join(sourceRoot, entry);
    // eslint-disable-next-line no-await-in-loop
    if (!(await fileExists(sourcePath))) {
      throw new Error(`Source catalog repo is missing required runtime entry: ${entry}`);
    }
    // eslint-disable-next-line no-await-in-loop
    const copiedEntry = await copyTree(sourceRoot, packageRoot, entry, previousCopyState, nextCopyState);
    copied = {
      fileCount: copied.fileCount + copiedEntry.fileCount,
      byteCount: copied.byteCount + copiedEntry.byteCount,
      copiedFileCount: copied.copiedFileCount + copiedEntry.copiedFileCount,
      skippedFileCount: copied.skippedFileCount + copiedEntry.skippedFileCount,
      removedFileCount: copied.removedFileCount,
    };
  }

  if (canReusePackageRoot) {
    for (const relativePath of Object.keys(previousCopyState)) {
      if (nextCopyState[relativePath]) continue;
      // eslint-disable-next-line no-await-in-loop
      if (await removeIfExists(packageRoot, relativePath)) copied.removedFileCount += 1;
    }
  }

  const runtimeBuild = await buildRuntimeIndexes(packageRoot, canReusePackageRoot ? previousState : {});
  const { indexManifest } = runtimeBuild;
  const registryCount = await countJsonl(path.join(packageRoot, 'registry/object-registry.jsonl'));
  const contentHashes = await buildHashes(packageRoot);
  const runtimeHash = runtimeContentHash({ sourceManifest, objects: runtimeBuild.objects });

  const manifest = {
    schema_version: PACKAGE_SCHEMA_VERSION,
    package_name: packageName,
    version,
    generated_at: new Date().toISOString(),
    source: {
      catalog_repo_path: normalizePath(sourceRoot),
      catalog_generated_at: sourceManifest.generated_at || '',
      catalog_remote_url: sourceManifest.remote_url || '',
      source_markdown_root: sourceManifest.source_markdown_root || '',
      catalog_schema_version: sourceManifest.schema_version || 0,
    },
    counts: {
      object_count: sourceManifest.object_count || registryCount,
      database_count: sourceManifest.database_count || 0,
      context_pack_count: sourceManifest.context_pack_count || 0,
      ssis_package_context_count: sourceManifest.ssis_package_context_count || 0,
      registry_jsonl_count: registryCount,
      copied_file_count: copied.fileCount,
      copied_byte_count: copied.byteCount,
      copied_changed_file_count: copied.copiedFileCount,
      copied_skipped_file_count: copied.skippedFileCount,
      copied_removed_file_count: copied.removedFileCount,
      canonical_object_count: indexManifest.counts.canonical_objects,
      duplicate_object_count: indexManifest.counts.duplicate_objects,
      unresolved_server_object_count: indexManifest.counts.unresolved_server_objects,
      generated_index_file_count:
        indexManifest.counts.by_name_files +
        indexManifest.counts.alias_files +
        indexManifest.counts.by_database_files +
        indexManifest.counts.by_schema_files +
        indexManifest.counts.top_used_files +
        indexManifest.counts.ranking_files,
      answer_card_file_count: indexManifest.counts.answer_card_files,
      compact_context_pack_count: indexManifest.counts.compact_context_pack_files,
    },
    build: {
      builder_version: RUNTIME_BUILDER_VERSION,
      incremental_enabled: true,
      reused_previous_package_root: canReusePackageRoot,
      force_rebuild: forceRebuild,
      build_state_path: normalizePath(buildStatePath),
      changed_source_file_count: copied.copiedFileCount,
      skipped_source_file_count: copied.skippedFileCount,
      removed_source_file_count: copied.removedFileCount,
      changed_object_count: runtimeBuild.stats.objectsChanged,
      reused_object_count: runtimeBuild.stats.objectsReused,
      removed_object_count: runtimeBuild.stats.objectsRemoved,
      changed_generated_object_file_count: runtimeBuild.stats.objectFilesWritten,
      skipped_generated_object_file_count: runtimeBuild.stats.objectFilesSkipped,
      removed_generated_object_file_count: runtimeBuild.stats.objectFilesRemoved,
      changed_index_file_count: runtimeBuild.stats.indexFilesWritten,
      skipped_index_file_count: runtimeBuild.stats.indexFilesSkipped,
    },
    registry_path: 'registry/object-registry.jsonl',
    indexes: {
      object_name: 'indexes/by-name/',
      object_name_shard_strategy: 'first two normalized alphanumeric characters of lookup key',
      database: 'indexes/by-database/',
      schema: 'indexes/by-schema/',
      aliases: 'indexes/aliases/',
      aliases_shard_strategy: 'first two normalized alphanumeric characters of alias',
      top_used: 'indexes/top-used/',
      rankings: 'indexes/rankings/',
      manifest: 'indexes/index-manifest.json',
    },
    answer_cards: {
      usage_count: 'answers/usage-count/by-object-id/',
      upstream: 'answers/upstream/by-object-id/',
      downstream: 'answers/downstream/by-object-id/',
      catalog_databases: 'answers/catalog/databases.json',
    },
    compact_context_packs: {
      by_object_id: 'context-packs/objects/by-id/',
    },
    entrypoints: {
      registry_jsonl: 'registry/object-registry.jsonl',
      canonical_registry_jsonl: 'registry/canonical-objects.jsonl',
      duplicate_registry_jsonl: 'registry/duplicate-objects.jsonl',
      unresolved_server_registry_jsonl: 'registry/unresolved-server-objects.jsonl',
      registry_csv: 'registry/object-registry.csv',
      database_index: 'registry/database-index.json',
      database_catalog_answer: 'answers/catalog/databases.json',
      registry_summary: 'registry/object-registry-summary.json',
      index_manifest: 'indexes/index-manifest.json',
      catalog_manifest: 'catalog-manifest.json',
      ai_readme: 'AI_README.md',
      runtime_guide: 'docs/runtime-package-guide.md',
    },
    retrieval_order: [
      'manifest.json',
      'indexes/by-name, indexes/aliases, indexes/by-database, indexes/by-schema, or indexes/rankings',
      'registry/canonical-objects.jsonl before registry/object-registry.jsonl',
      'row.compact_context_pack_path, row.answer_cards, or row.context_pack_json_path',
      'Confluence only for human governance explanation',
    ],
    quality_gates: {
      blocked_raw_server_database_pairs: [{ server: 'unknown', database: 'Sonic_DW' }],
      unknown_sonic_dw_blocked: true,
      require_context_pack_paths: true,
      require_case_insensitive_unique_paths: true,
    },
    runtime_content_hash: runtimeHash,
    content_hashes: contentHashes,
  };

  await writeText(packageRoot, 'README.md', await renderPackageReadme({ packageName, version, sourceManifest }));
  await writeText(packageRoot, 'docs/runtime-package-guide.md', renderRuntimeGuide({ packageName, version }));
  await writeJson(packageRoot, 'manifest.json', manifest);
  await writeJson(packageRoot, 'latest.json', {
    package_name: packageName,
    version,
    generated_at: manifest.generated_at,
    runtime_content_hash: runtimeHash,
    manifest_path: 'manifest.json',
    registry_path: manifest.entrypoints.registry_jsonl,
    canonical_registry_path: manifest.entrypoints.canonical_registry_jsonl,
    database_index_path: manifest.entrypoints.database_index,
    index_manifest_path: manifest.entrypoints.index_manifest,
    indexes: manifest.indexes,
  });

  const nextState = {
    schema_version: 1,
    builder_version: RUNTIME_BUILDER_VERSION,
    package_name: packageName,
    package_root: normalizePath(packageRoot),
    source_root: normalizePath(sourceRoot),
    version,
    generated_at: manifest.generated_at,
    runtime_content_hash: runtimeHash,
    previous_runtime_content_hash: previousState.runtime_content_hash || '',
    last_published_runtime_content_hash: previousState.last_published_runtime_content_hash || '',
    last_published_version: previousState.last_published_version || '',
    last_published_at: previousState.last_published_at || '',
    index_manifest_generated_at: indexManifest.generated_at,
    copied_files: nextCopyState,
    objects: runtimeBuild.objects,
    latest_build: manifest.build,
  };
  await mkdir(path.dirname(buildStatePath), { recursive: true });
  await writeFile(buildStatePath, `${JSON.stringify(nextState, null, 2)}\n`, 'utf8');

  const finalFiles = await listFilesRecursive(packageRoot);
  let finalBytes = 0;
  for (const file of finalFiles) {
    // eslint-disable-next-line no-await-in-loop
    finalBytes += await fileSize(path.join(packageRoot, file));
  }

  const result = {
    status: 'packaged',
    packageRoot,
    packageName,
    version,
    objectCount: manifest.counts.object_count,
    registryJsonlCount: registryCount,
    fileCount: finalFiles.length,
    byteCount: finalBytes,
    runtimeContentHash: runtimeHash,
    incremental: manifest.build,
  };

  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
