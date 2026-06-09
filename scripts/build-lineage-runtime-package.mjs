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
const RUNTIME_BUILDER_VERSION = 4;
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
  'registry/database-artifact-index.json',
  'registry/object-path-index.json',
  'answers/catalog/databases.json',
  'indexes/entrypoints.json',
  'indexes/path-contract.json',
  'indexes/artifact-manifest.json',
  'registry/object-registry-summary.json',
  'indexes/index-manifest.json',
  'profile-index/manifest.json',
  'profile-index/latest-summary.json',
  'AI_README.md',
];
const RANKING_LIMIT = 500;
const TOP_USED_LIMIT = 100;
const DIRECT_EDGE_LIMIT = 120;
const DEFAULT_PROFILE_RUNTIME_STORE = './data/_runtime/profiles/profile-scheduler-store.json';
const DEFAULT_PROFILE_RUN_ARTIFACT_ROOT = './data/markdown/_runtime/profile-runs';
const PROFILE_INDEX_SCHEMA_VERSION = 1;
const PROFILE_INDEX_FORBIDDEN_KEYS = new Set([
  'sample_values',
  'sample_value',
  'raw_rows',
  'raw_row',
  'preview_data',
  'example_value',
  'example_values',
  'raw_payload',
  'source_payload',
  'report_result_rows',
  'dashboard_cell_values',
  'connection_string',
  'authorization',
  'password',
  'token',
  'access_token',
  'refresh_token',
  'credential',
  'credentials',
  'vault_reference',
  'vault_ref',
]);

function argValue(name) {
  const prefix = `${name}=`;
  const found = process.argv.slice(2).find((arg) => arg.startsWith(prefix));
  return found ? found.slice(prefix.length) : '';
}

function hasFlag(name) {
  return process.argv.slice(2).includes(name);
}

function payloadMode() {
  const mode = (
    argValue('--mode') ||
    argValue('--payload-mode') ||
    process.env.LINEAGE_RUNTIME_PAYLOAD_MODE ||
    'compat'
  ).toLowerCase();
  if (['compat', 'compact', 'full'].includes(mode)) return mode;
  throw new Error(`Unsupported runtime payload mode '${mode}'. Use compat, compact, or full.`);
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

async function removeTreeIfExists(root, relativePath) {
  const filePath = path.join(root, relativePath);
  if (!(await fileExists(filePath))) return false;
  await rm(filePath, { recursive: true, force: true, maxRetries: 8, retryDelay: 300 });
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

function profileIndexHash(profileIndexManifest = {}) {
  return sha256Text(
    JSON.stringify({
      schema_version: profileIndexManifest.schema_version || 0,
      source_run_ids: profileIndexManifest.source_run_ids || [],
      counts: profileIndexManifest.counts || {},
      safety: profileIndexManifest.safety || {},
    })
  );
}

function runtimeContentHashWithProfiles({ sourceManifest, objects, profileIndexManifest, mode = 'compat' }) {
  return sha256Text(
    JSON.stringify({
      builder_version: RUNTIME_BUILDER_VERSION,
      payload_mode: mode,
      catalog_generated_at: sourceManifest.generated_at || '',
      catalog_schema_version: sourceManifest.schema_version || 0,
      object_fingerprints: sortedObjectFingerprintRows(objects),
      profile_index_hash: profileIndexHash(profileIndexManifest),
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

function safeProfileSegment(value, fallback = 'value') {
  const raw = String(value || fallback).trim() || fallback;
  const normalized = raw
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, '_')
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');
  return `${(normalized || fallback).slice(0, 100)}--${hashValue(raw, 10)}`;
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

function resolverFileKey(value, fallback = 'unknown') {
  const compact = compactLookupKey(value || fallback);
  return (compact || fallback).slice(0, 180);
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
    answer_cards: row.answer_cards || undefined,
  };
}

function objectSummaryAnswerCard(row, contextPack, relationIndex = {}) {
  const semanticLineage = deriveSemanticLineageGroups(row.object_id, contextPack, relationIndex);
  const upstreamCount = Number(row.upstream_count || contextPack?.lineage?.upstream_count || 0);
  const downstreamCount = Number(row.downstream_count || contextPack?.lineage?.downstream_count || 0);
  return {
    schema_version: 1,
    question_type: 'object-summary',
    object: briefObject(row),
    answer: {
      summary: `${row.display_name || row.object_name || row.object_id} is a ${row.object_type || 'catalog object'} in ${[row.database, row.schema].filter(Boolean).join('.') || 'the catalog'}.`,
      upstream_count: upstreamCount,
      downstream_count: downstreamCount,
      column_count: Number(row.column_count || contextPack?.columns?.count || 0),
      confidence_label: row.confidence_label || '',
      has_logic_summary: Boolean(contextPack?.logic_summary),
      semantic_downstream_counts: semanticLineage.counts || {},
    },
    recommended_next_cards: {
      usage_count: normalizePath(row.answer_cards?.usage_count || ''),
      upstream: normalizePath(row.answer_cards?.upstream || ''),
      downstream: normalizePath(row.answer_cards?.downstream || ''),
      profile_teaser: normalizePath(row.answer_cards?.profile_teaser || ''),
    },
    context_pack_json_path: normalizePath(row.compact_context_pack_path || row.context_pack_json_path || ''),
  };
}

async function profileTeaserAnswerCard(packageRoot, row) {
  const profileByObjectIdPath = `profile-index/by-object-id/${safeProfileSegment(row.object_id, 'object')}.json`;
  const profileByObjectNamePath = `profile-index/by-object-name/${safeProfileSegment(normalizeLookupKey(row.object_name || row.display_name || row.object_id), 'object-name')}.json`;
  const profileByObjectId = await pathEntry(packageRoot, profileByObjectIdPath);
  const profileByObjectName = await pathEntry(packageRoot, profileByObjectNamePath);
  let profileSummary = null;
  if (profileByObjectId.available) {
    const profile = await readJson(path.join(packageRoot, profileByObjectIdPath));
    profileSummary = {
      status: profile.status || '',
      run_kind: profile.run_kind || '',
      profiled_at: profile.profiled_at || '',
      row_count: profile.profile_summary?.row_count ?? null,
      column_count: profile.profile_summary?.column_count ?? null,
      warning_count: profile.profile_summary?.warning_count ?? null,
      raw_values_retained: false,
    };
  }
  return {
    schema_version: 1,
    question_type: 'profile-teaser',
    object: briefObject(row),
    answer: {
      profile_available: Boolean(profileByObjectId.available),
      profile_match_mode: profileByObjectId.available ? 'object_id' : profileByObjectName.available ? 'object_name_candidates' : 'none',
      raw_values_retained: false,
      profile_summary: profileSummary,
    },
    paths: {
      by_object_id: availablePath(profileByObjectId),
      by_object_name: availablePath(profileByObjectName),
    },
  };
}

function compactRegistryRow(row) {
  return {
    ...row,
    context_pack_json_path: normalizePath(row.compact_context_pack_path || row.context_pack_json_path || ''),
    context_pack_path: '',
    runtime_payload_mode: 'compact',
  };
}

function csvEscape(value) {
  const text = String(value ?? '');
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function registryCsv(rows) {
  const headers = [
    'object_id',
    'display_name',
    'server',
    'database',
    'schema',
    'object_name',
    'object_type',
    'confidence',
    'upstream_count',
    'downstream_count',
    'column_count',
    'context_pack_json_path',
    'compact_context_pack_path',
    'source_markdown_path',
  ];
  return [
    headers.join(','),
    ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(',')),
  ].join('\n') + '\n';
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
  const byQualifiedName = new Map();
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
      summary: `answers/summary/by-object-id/${objectHash}.json`,
      usage_count: `answers/usage-count/by-object-id/${objectHash}.json`,
      upstream: `answers/upstream/by-object-id/${objectHash}.json`,
      downstream: `answers/downstream/by-object-id/${objectHash}.json`,
      profile_teaser: `answers/profile-teaser/by-object-id/${objectHash}.json`,
    };
    row.answer_cards = answerCards;
    row.compact_context_pack_path = `context-packs/objects/by-id/${objectHash}.json`;

    const previousObject = previousObjects[row.object_id];
    const reusable =
      previousObject?.fingerprint === objectFingerprint &&
      Array.isArray(previousObject.lookup_keys) &&
      Array.isArray(previousObject.alias_keys) &&
      previousObject.compact_context_pack_path === row.compact_context_pack_path &&
      previousObject.answer_cards?.summary === answerCards.summary &&
      previousObject.answer_cards?.usage_count === answerCards.usage_count &&
      previousObject.answer_cards?.profile_teaser === answerCards.profile_teaser &&
      // eslint-disable-next-line no-await-in-loop
      (await fileExists(path.join(packageRoot, answerCards.summary))) &&
      // eslint-disable-next-line no-await-in-loop
      (await fileExists(path.join(packageRoot, row.compact_context_pack_path))) &&
      // eslint-disable-next-line no-await-in-loop
      (await fileExists(path.join(packageRoot, answerCards.usage_count))) &&
      // eslint-disable-next-line no-await-in-loop
      (await fileExists(path.join(packageRoot, answerCards.upstream))) &&
      // eslint-disable-next-line no-await-in-loop
      (await fileExists(path.join(packageRoot, answerCards.downstream))) &&
      // eslint-disable-next-line no-await-in-loop
      (await fileExists(path.join(packageRoot, answerCards.profile_teaser)));

    if (reusable) {
      row.lookup_keys = previousObject.lookup_keys;
      row.alias_keys = previousObject.alias_keys;
      stats.objectsReused += 1;
      stats.objectFilesSkipped += 6;
    } else {
      // eslint-disable-next-line no-await-in-loop
      const contextPack = contextPackByObjectId.get(row.object_id) || null;
      row.lookup_keys = lookupKeysForRow(row, contextPack);
      row.alias_keys = aliasKeysForRow(row, contextPack);

      // eslint-disable-next-line no-await-in-loop
      const summaryResult = await writeJsonIfChanged(packageRoot, answerCards.summary, objectSummaryAnswerCard(row, contextPack, relationIndex));
      // eslint-disable-next-line no-await-in-loop
      const usageResult = await writeJsonIfChanged(packageRoot, answerCards.usage_count, usageAnswerCard(row));
      // eslint-disable-next-line no-await-in-loop
      const upstreamResult = await writeJsonIfChanged(packageRoot, answerCards.upstream, directionAnswerCard(row, 'upstream', contextPack, relationIndex));
      // eslint-disable-next-line no-await-in-loop
      const downstreamResult = await writeJsonIfChanged(packageRoot, answerCards.downstream, directionAnswerCard(row, 'downstream', contextPack, relationIndex));
      // eslint-disable-next-line no-await-in-loop
      const compactResult = await writeJsonIfChanged(packageRoot, row.compact_context_pack_path, compactContextPack(row, contextPack, answerCards, relationIndex));
      // Profile teaser is overwritten after profile-index generation; this placeholder keeps incremental reuse valid.
      // eslint-disable-next-line no-await-in-loop
      const profileTeaserResult = await writeJsonIfChanged(packageRoot, answerCards.profile_teaser, {
        schema_version: 1,
        question_type: 'profile-teaser',
        object: briefObject(row),
        answer: {
          profile_available: false,
          profile_match_mode: 'pending_profile_index',
          raw_values_retained: false,
          profile_summary: null,
        },
        paths: {
          by_object_id: null,
          by_object_name: null,
        },
      });
      for (const result of [summaryResult, usageResult, upstreamResult, downstreamResult, compactResult, profileTeaserResult]) {
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

    answerCardFileCount += 5;
    compactContextFileCount += 1;

    for (const key of row.lookup_keys) addToMapList(byName, key, row);
    for (const key of row.alias_keys) addToMapList(byAlias, key, row);
    addToMapList(byDatabase, row.database || 'unknown', row);
    addToMapList(bySchema, `${row.database || 'unknown'}.${row.schema || 'unknown'}`, row);
    for (const key of [
      row.object_id,
      `${row.schema || ''}.${row.object_name || row.display_name || ''}`,
      `${row.database || ''}.${row.schema || ''}.${row.object_name || row.display_name || ''}`,
      `${row.server || ''}.${row.database || ''}.${row.schema || ''}.${row.object_name || row.display_name || ''}`,
    ]) {
      const normalized = normalizeLookupKey(key);
      if (normalized) addToMapList(byQualifiedName, normalized, row);
    }
  }

  for (const [objectId, previousObject] of Object.entries(previousObjects)) {
    if (nextObjects[objectId]) continue;
    stats.objectsRemoved += 1;
    const stalePaths = [
      previousObject.compact_context_pack_path,
      previousObject.answer_cards?.usage_count,
      previousObject.answer_cards?.summary,
      previousObject.answer_cards?.upstream,
      previousObject.answer_cards?.downstream,
      previousObject.answer_cards?.profile_teaser,
    ].filter(Boolean);
    for (const relativePath of stalePaths) {
      // eslint-disable-next-line no-await-in-loop
      if (await removeIfExists(packageRoot, relativePath)) stats.objectFilesRemoved += 1;
    }
  }

  for (const rowsForKey of [...byName.values(), ...byAlias.values(), ...byDatabase.values(), ...bySchema.values(), ...byQualifiedName.values()]) {
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
  await removeTreeIfExists(packageRoot, 'indexes/resolve/by-qualified-name');
  let qualifiedResolverFileCount = 0;
  for (const [lookupKey, matches] of byQualifiedName.entries()) {
    const relativePath = `indexes/resolve/by-qualified-name/${resolverFileKey(lookupKey)}.json`;
    // eslint-disable-next-line no-await-in-loop
    const result = await writeJsonIfChanged(packageRoot, relativePath, {
      schema_version: 1,
      index_type: 'resolve-by-qualified-name',
      lookup_key: lookupKey,
      file_key: resolverFileKey(lookupKey),
      match_count: matches.length,
      matches: matches.map((row) => indexObject(row)),
    });
    if (result.written) stats.indexFilesWritten += 1;
    else stats.indexFilesSkipped += 1;
    qualifiedResolverFileCount += 1;
  }

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
      resolve_by_qualified_name: 'indexes/resolve/by-qualified-name/',
      resolve_by_qualified_name_strategy:
        'compact normalized object id, schema.object, database.schema.object, or server.database.schema.object',
      aliases: 'indexes/aliases/',
      aliases_shard_strategy: 'first two normalized alphanumeric characters of alias',
      top_used: 'indexes/top-used/',
      rankings: 'indexes/rankings/',
    },
    answer_cards: {
      summary_by_object_id: 'answers/summary/by-object-id/',
      usage_count_by_object_id: 'answers/usage-count/by-object-id/',
      upstream_by_object_id: 'answers/upstream/by-object-id/',
      downstream_by_object_id: 'answers/downstream/by-object-id/',
      profile_teaser_by_object_id: 'answers/profile-teaser/by-object-id/',
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
      qualified_resolver_files: qualifiedResolverFileCount,
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

  return {
    indexManifest,
    objects: nextObjects,
    stats,
    runtimeRows: [...runtimeRowsById.values()].map(compactRegistryRow),
    canonicalRows: canonicalRows.map(compactRegistryRow),
    duplicateRows: duplicateRows.map(compactRegistryRow),
    unresolvedRows: unresolvedRows.map(compactRegistryRow),
  };
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

async function pathEntry(packageRoot, relativePath, kind = 'file') {
  const normalized = normalizePath(relativePath);
  if (!normalized) {
    return { available: false, path: null, kind };
  }
  const absolutePath = path.join(packageRoot, normalized);
  if (!(await fileExists(absolutePath))) {
    return { available: false, path: normalized, kind };
  }
  const entryStat = await stat(absolutePath);
  return {
    available: true,
    path: normalized,
    kind: entryStat.isDirectory() ? 'directory' : kind,
    byte_count: entryStat.isFile() ? entryStat.size : undefined,
    content_hash: entryStat.isFile() ? await sha256File(absolutePath) : undefined,
  };
}

async function directoryFileCount(packageRoot, relativePath) {
  const absolutePath = path.join(packageRoot, normalizePath(relativePath));
  if (!(await fileExists(absolutePath))) return 0;
  return (await listFilesRecursive(absolutePath)).length;
}

function availablePath(entry) {
  return entry.available ? entry.path : null;
}

function lineageIntentCards() {
  const baseResolutionOrder = [
    'indexes/entrypoints.json',
    'indexes/path-contract.json',
    'indexes/artifact-manifest.json',
    'indexes/index-manifest.json',
  ];
  return [
    {
      file: 'answers/intents/catalog.databases.json',
      intent: 'catalog.databases',
      purpose: 'List cataloged databases without reading object registries.',
      primary_entrypoint: 'answers/catalog/databases.json',
      resolution_order: [...baseResolutionOrder, 'answers/catalog/databases.json'],
    },
    {
      file: 'answers/intents/database.most_used_tables.json',
      intent: 'database.most_used_tables',
      purpose: 'Answer most-used table questions for a database.',
      primary_entrypoint: 'indexes/rankings/{database}/tables-by-downstream-count.json',
      resolution_order: [...baseResolutionOrder, 'indexes/top-used/{database}.json', 'indexes/rankings/{database}/tables-by-downstream-count.json'],
    },
    {
      file: 'answers/intents/table.tell_me_about.json',
      intent: 'table.tell_me_about',
      purpose: 'Answer a concise object summary question.',
      primary_entrypoint: 'answers/summary/by-object-id/{object_hash}.json',
      resolution_order: [
        ...baseResolutionOrder,
        'indexes/resolve/by-qualified-name/{compact_lookup_key}.json',
        'answers/summary/by-object-id/{object_hash}.json',
        'context-packs/objects/by-id/{object_hash}.json',
      ],
    },
    {
      file: 'answers/intents/table.profile_summary.json',
      intent: 'table.profile_summary',
      purpose: 'Answer whether profile data exists and where the safe profile shard is.',
      primary_entrypoint: 'answers/profile-teaser/by-object-id/{object_hash}.json',
      resolution_order: [
        ...baseResolutionOrder,
        'indexes/resolve/by-qualified-name/{compact_lookup_key}.json',
        'answers/profile-teaser/by-object-id/{object_hash}.json',
        'profile-index/by-object-id/{profile_key}.json',
      ],
    },
    {
      file: 'answers/intents/object.where_used.json',
      intent: 'object.where_used',
      purpose: 'Answer downstream usage and consumer questions.',
      primary_entrypoint: 'answers/downstream/by-object-id/{object_hash}.json',
      resolution_order: [
        ...baseResolutionOrder,
        'indexes/resolve/by-qualified-name/{compact_lookup_key}.json',
        'answers/downstream/by-object-id/{object_hash}.json',
        'context-packs/objects/by-id/{object_hash}.json',
      ],
    },
    {
      file: 'answers/intents/object.what_feeds.json',
      intent: 'object.what_feeds',
      purpose: 'Answer upstream/source/producer questions.',
      primary_entrypoint: 'answers/upstream/by-object-id/{object_hash}.json',
      resolution_order: [
        ...baseResolutionOrder,
        'indexes/resolve/by-qualified-name/{compact_lookup_key}.json',
        'answers/upstream/by-object-id/{object_hash}.json',
        'context-packs/objects/by-id/{object_hash}.json',
      ],
    },
    {
      file: 'answers/intents/object.impact.json',
      intent: 'object.impact',
      purpose: 'Answer what would be impacted if an object changes.',
      primary_entrypoint: 'answers/downstream/by-object-id/{object_hash}.json',
      resolution_order: [
        ...baseResolutionOrder,
        'indexes/resolve/by-qualified-name/{compact_lookup_key}.json',
        'answers/downstream/by-object-id/{object_hash}.json',
        'context-packs/objects/by-id/{object_hash}.json',
      ],
    },
    {
      file: 'answers/intents/package.what_runs.json',
      intent: 'package.what_runs',
      purpose: 'Answer SSIS/package orchestration questions.',
      primary_entrypoint: 'answers/summary/by-object-id/{object_hash}.json',
      resolution_order: [
        ...baseResolutionOrder,
        'indexes/resolve/by-qualified-name/{compact_lookup_key}.json',
        'answers/summary/by-object-id/{object_hash}.json',
        'answers/downstream/by-object-id/{object_hash}.json',
      ],
    },
    {
      file: 'answers/intents/procedure.business_logic.json',
      intent: 'procedure.business_logic',
      purpose: 'Answer concise stored procedure dependency and logic-summary questions.',
      primary_entrypoint: 'context-packs/objects/by-id/{object_hash}.json',
      resolution_order: [
        ...baseResolutionOrder,
        'indexes/resolve/by-qualified-name/{compact_lookup_key}.json',
        'answers/summary/by-object-id/{object_hash}.json',
        'context-packs/objects/by-id/{object_hash}.json',
      ],
    },
  ];
}

async function writeIntentCards(packageRoot, generatedAt) {
  const cards = lineageIntentCards();
  for (const card of cards) {
    // eslint-disable-next-line no-await-in-loop
    await writeJson(packageRoot, card.file, {
      schema_version: 1,
      generated_at: generatedAt,
      question_type: 'intent-route',
      intent: card.intent,
      purpose: card.purpose,
      primary_entrypoint: card.primary_entrypoint,
      resolution_order: card.resolution_order,
      fallback_policy: 'do_not_probe_missing_paths',
      missing_policy: 'Use only advertised paths. If an advertised path is absent or unavailable, report that artifact as unavailable.',
    });
  }
  return cards.length;
}

async function buildArtifactManifests(packageRoot, { runtimeBuild, profileIndexManifest }) {
  const databaseIndex = await readJson(path.join(packageRoot, 'registry/database-index.json'));
  const generatedAt = new Date().toISOString();
  const intentCardCount = await writeIntentCards(packageRoot, generatedAt);
  const runtimeRows = runtimeBuild.runtimeRows || [];
  const objectPaths = {};
  for (const row of runtimeRows) {
    const profileByObjectId = await pathEntry(packageRoot, `profile-index/by-object-id/${safeProfileSegment(row.object_id, 'object')}.json`);
    const qualifiedKey = normalizeLookupKey(
      `${row.database || ''}.${row.schema || ''}.${row.object_name || row.display_name || ''}`
    );
    objectPaths[row.object_id] = {
      object_id: row.object_id,
      display_name: row.display_name || row.object_name || row.object_id,
      database: row.database || '',
      schema: row.schema || '',
      object_name: row.object_name || row.display_name || '',
      object_type: row.object_type || '',
      counts: {
        upstream: Number(row.upstream_count || 0),
        downstream: Number(row.downstream_count || 0),
        columns: Number(row.column_count || 0),
      },
      paths: {
        compact_context_pack: normalizePath(row.compact_context_pack_path || ''),
        context_pack_json: normalizePath(row.context_pack_json_path || ''),
        context_pack_markdown: normalizePath(row.context_pack_path || ''),
        source_markdown: normalizePath(row.source_markdown_path || ''),
        summary_answer: normalizePath(row.answer_cards?.summary || ''),
        usage_answer: normalizePath(row.answer_cards?.usage_count || ''),
        upstream_answer: normalizePath(row.answer_cards?.upstream || ''),
        downstream_answer: normalizePath(row.answer_cards?.downstream || ''),
        profile_teaser: normalizePath(row.answer_cards?.profile_teaser || ''),
        profile: availablePath(profileByObjectId),
        qualified_name_resolver: qualifiedKey
          ? `indexes/resolve/by-qualified-name/${resolverFileKey(qualifiedKey)}.json`
          : null,
      },
      confidence: {
        score: row.confidence ?? null,
        label: row.confidence_label || '',
      },
    };
  }

  const databases = {};
  for (const [database, info] of Object.entries(databaseIndex.databases || {})) {
    const databaseKey = safeSegment(database);
    const profileKey = safeProfileSegment(database, 'database');
    const byDatabase = await pathEntry(packageRoot, `indexes/by-database/${databaseKey}.json`);
    const topUsed = await pathEntry(packageRoot, `indexes/top-used/${databaseKey}.json`);
    const rankingDownstream = await pathEntry(
      packageRoot,
      `indexes/rankings/${databaseKey}/tables-by-downstream-count.json`
    );
    const rankingUpstream = await pathEntry(
      packageRoot,
      `indexes/rankings/${databaseKey}/tables-by-upstream-count.json`
    );
    const profile = await pathEntry(packageRoot, `profile-index/by-database/${profileKey}.json`);
    databases[database] = {
      database,
      database_key: databaseKey,
      object_count: info.object_count || 0,
      types: info.types || {},
      paths: {
        context_readme: normalizePath(info.context_readme_path || ''),
        by_database_index: availablePath(byDatabase),
        top_used: availablePath(topUsed),
        tables_by_downstream_count: availablePath(rankingDownstream),
        tables_by_upstream_count: availablePath(rankingUpstream),
        profile_index: availablePath(profile),
      },
      availability: {
        by_database_index: byDatabase.available,
        top_used: topUsed.available,
        tables_by_downstream_count: rankingDownstream.available,
        tables_by_upstream_count: rankingUpstream.available,
        profile_index: profile.available,
      },
    };
  }

  await writeJson(packageRoot, 'registry/object-path-index.json', {
    schema_version: 1,
    generated_at: generatedAt,
    object_count: Object.keys(objectPaths).length,
    objects: objectPaths,
  });
  await writeJson(packageRoot, 'registry/database-artifact-index.json', {
    schema_version: 1,
    generated_at: generatedAt,
    database_count: Object.keys(databases).length,
    databases,
  });

  const routingEntrypoints = {
    schema_version: 1,
    generated_at: generatedAt,
    purpose: 'Small routing manifest for low-token lineage lookup. Start here, then use exact advertised paths only.',
    intents_path: 'answers/intents/',
    intent_card_count: intentCardCount,
    common_intents: Object.fromEntries(lineageIntentCards().map((card) => [card.intent, card.file])),
    object_resolution: {
      exact_qualified_name: 'indexes/resolve/by-qualified-name/{compact_lookup_key}.json',
      by_name_shards: 'indexes/by-name/{first_two_chars}.json',
      aliases: 'indexes/aliases/{first_two_chars}.json',
      object_path_index: 'registry/object-path-index.json',
    },
    database_questions: {
      catalog: 'answers/catalog/databases.json',
      artifact_index: 'registry/database-artifact-index.json',
      top_used: 'indexes/top-used/{database_key}.json',
      table_rankings: 'indexes/rankings/{database_key}/tables-by-downstream-count.json',
    },
    object_answer_cards: {
      summary: 'answers/summary/by-object-id/{object_hash}.json',
      usage_count: 'answers/usage-count/by-object-id/{object_hash}.json',
      upstream: 'answers/upstream/by-object-id/{object_hash}.json',
      downstream: 'answers/downstream/by-object-id/{object_hash}.json',
      profile_teaser: 'answers/profile-teaser/by-object-id/{object_hash}.json',
    },
    profiles: {
      teaser_first: 'answers/profile-teaser/by-object-id/{object_hash}.json',
      safe_index_by_object_id: 'profile-index/by-object-id/{profile_key}.json',
      safe_index_by_object_name: 'profile-index/by-object-name/{profile_key}.json',
      unpublished_profile_run_artifacts: 'data/markdown/_runtime/profile-runs/**',
    },
    policy: {
      missing_paths: 'do_not_probe_variants',
      local_profile_run_artifacts_published: false,
    },
  };

  const pathContract = {
    schema_version: 1,
    generated_at: generatedAt,
    purpose: 'Declares supported runtime artifact paths and forbidden probe patterns.',
    supported_patterns: {
      route_manifest: 'indexes/entrypoints.json',
      path_contract: 'indexes/path-contract.json',
      artifact_manifest: 'indexes/artifact-manifest.json',
      index_manifest: 'indexes/index-manifest.json',
      intent_cards: 'answers/intents/*.json',
      object_resolver: 'indexes/resolve/by-qualified-name/{compact_lookup_key}.json',
      summary_answer: 'answers/summary/by-object-id/{object_hash}.json',
      usage_answer: 'answers/usage-count/by-object-id/{object_hash}.json',
      upstream_answer: 'answers/upstream/by-object-id/{object_hash}.json',
      downstream_answer: 'answers/downstream/by-object-id/{object_hash}.json',
      profile_teaser: 'answers/profile-teaser/by-object-id/{object_hash}.json',
      compact_context_pack: 'context-packs/objects/by-id/{object_hash}.json',
      profile_index_object: 'profile-index/by-object-id/{profile_key}.json',
    },
    unpublished_patterns: [
      'data/markdown/_runtime/profile-runs/**',
      'data/_runtime/profiles/**',
    ],
    missing_policy: 'If a path is null, unavailable, or not listed here, consumers must not probe path variants.',
  };

  await writeJson(packageRoot, 'indexes/entrypoints.json', routingEntrypoints);
  await writeJson(packageRoot, 'indexes/path-contract.json', pathContract);

  const entrypoints = {
    manifest: { available: true, path: 'manifest.json', kind: 'file' },
    latest: { available: true, path: 'latest.json', kind: 'file' },
    catalog_manifest: await pathEntry(packageRoot, 'catalog-manifest.json'),
    database_index: await pathEntry(packageRoot, 'registry/database-index.json'),
    database_artifact_index: await pathEntry(packageRoot, 'registry/database-artifact-index.json'),
    object_path_index: await pathEntry(packageRoot, 'registry/object-path-index.json'),
    object_registry: await pathEntry(packageRoot, 'registry/object-registry.jsonl'),
    canonical_registry: await pathEntry(packageRoot, 'registry/canonical-objects.jsonl'),
    index_manifest: await pathEntry(packageRoot, 'indexes/index-manifest.json'),
    artifact_manifest: { available: true, path: 'indexes/artifact-manifest.json', kind: 'file' },
    routing_entrypoints: await pathEntry(packageRoot, 'indexes/entrypoints.json'),
    path_contract: await pathEntry(packageRoot, 'indexes/path-contract.json'),
    intent_cards: await pathEntry(packageRoot, 'answers/intents', 'directory'),
    catalog_databases_answer: await pathEntry(packageRoot, 'answers/catalog/databases.json'),
    profile_manifest: await pathEntry(packageRoot, 'profile-index/manifest.json'),
    profile_latest_summary: await pathEntry(packageRoot, 'profile-index/latest-summary.json'),
  };

  const artifactManifest = {
    schema_version: 1,
    generated_at: generatedAt,
    purpose: 'Advertises exact runtime artifact paths so consumers never guess path variants.',
    capabilities: {
      catalog_answers: {
        available: entrypoints.catalog_databases_answer.available,
        path: entrypoints.catalog_databases_answer.path,
      },
      object_contexts: {
        available: (await directoryFileCount(packageRoot, 'context-packs/objects/by-id')) > 0,
        path: 'context-packs/objects/by-id/',
        count: runtimeRows.length,
      },
      object_answer_cards: {
        available: (await directoryFileCount(packageRoot, 'answers/usage-count/by-object-id')) > 0,
        paths: {
          summary: 'answers/summary/by-object-id/',
          usage_count: 'answers/usage-count/by-object-id/',
          upstream: 'answers/upstream/by-object-id/',
          downstream: 'answers/downstream/by-object-id/',
          profile_teaser: 'answers/profile-teaser/by-object-id/',
        },
        count: runtimeRows.length * 5,
      },
      intent_routes: {
        available: entrypoints.intent_cards.available,
        path: entrypoints.intent_cards.path,
        count: intentCardCount,
      },
      direct_object_resolution: {
        available: (await directoryFileCount(packageRoot, 'indexes/resolve/by-qualified-name')) > 0,
        path: 'indexes/resolve/by-qualified-name/',
      },
      rankings: {
        available: (await directoryFileCount(packageRoot, 'indexes/rankings')) > 0,
        path: 'indexes/rankings/',
      },
      top_used: {
        available: (await directoryFileCount(packageRoot, 'indexes/top-used')) > 0,
        path: 'indexes/top-used/',
      },
      profile_index: {
        available: entrypoints.profile_manifest.available && entrypoints.profile_latest_summary.available,
        manifest_path: entrypoints.profile_manifest.path,
        latest_summary_path: entrypoints.profile_latest_summary.path,
        counts: profileIndexManifest.counts || {},
      },
    },
    entrypoints,
    indexes: {
      databases: 'registry/database-artifact-index.json',
      objects: 'registry/object-path-index.json',
      lookup_manifest: 'indexes/index-manifest.json',
      routing_entrypoints: 'indexes/entrypoints.json',
      path_contract: 'indexes/path-contract.json',
      qualified_name_resolver: 'indexes/resolve/by-qualified-name/',
    },
    missing_policy: 'If a path is null or availability is false, consumers must not probe path variants.',
  };

  await writeJson(packageRoot, 'indexes/artifact-manifest.json', artifactManifest);

  return artifactManifest;
}

function forbiddenProfileKey(key) {
  const normalized = normalizeLookupKey(key).replace(/[^a-z0-9_]/g, '_');
  return PROFILE_INDEX_FORBIDDEN_KEYS.has(normalized);
}

function assertProfileIndexSafe(value, location = 'profile-index') {
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertProfileIndexSafe(item, `${location}[${index}]`));
    return;
  }
  if (!value || typeof value !== 'object') return;
  for (const [key, nested] of Object.entries(value)) {
    if (forbiddenProfileKey(key)) {
      throw new Error(`Forbidden profile-index field '${key}' at ${location}.${key}`);
    }
    assertProfileIndexSafe(nested, `${location}.${key}`);
  }
}

function profileRunKind(run = {}) {
  if (run.summary?.bi_profile_run) return 'bi_profile';
  if (run.summary?.metadata_profile_run) return 'metadata_profile';
  if (run.summary?.profile_run) return 'aggregate_profile';
  return 'metadata_harvest';
}

function profileRunCompletedAt(run = {}) {
  return run.completed_at || run.profile?.run?.completed_at || run.profile?.executed_at || run.extraction?.extracted_at || '';
}

function profileRunProfiles(run = {}) {
  return run.profile?.run?.profiles || run.profile?.profiles || {};
}

function profileConnectorConfig(run = {}, connectorById = new Map()) {
  const connector = connectorById.get(run.connector_id) || {};
  return connector.config || {};
}

function profileRunDatabase(run = {}, connectorById = new Map()) {
  const config = profileConnectorConfig(run, connectorById);
  return config.database || run.database || run.summary?.database || '';
}

function profileRunServer(run = {}, connectorById = new Map()) {
  const config = profileConnectorConfig(run, connectorById);
  return config.server || run.server || run.summary?.server || '';
}

function profileSourceEvidence(sourceArtifactPath = '', run = {}) {
  const artifactPath = normalizePath(sourceArtifactPath);
  const jsonPath = workspaceRelativePath(run.artifact?.json_path || sourceArtifactPath || '');
  const markdownPath = run.artifact?.markdown_path ? workspaceRelativePath(run.artifact.markdown_path) : '';
  const referenceBasis = [artifactPath, jsonPath, markdownPath].filter(Boolean).join('|');
  return {
    source_artifact_published: false,
    source_artifact_reference: referenceBasis ? hashValue(referenceBasis, 16) : '',
    source_artifact_note:
      'Source profile-run artifacts are local build provenance and are not published to the DevOps runtime package.',
  };
}

function profileRunShard(run = {}, connectorById = new Map(), sourceArtifactPath = '') {
  const summary = run.summary || {};
  return {
    schema_version: PROFILE_INDEX_SCHEMA_VERSION,
    run_id: run.id,
    connector_id: run.connector_id || '',
    connector_type: run.connector_type || '',
    run_kind: profileRunKind(run),
    status: run.status || '',
    mode: run.mode || '',
    completed_at: profileRunCompletedAt(run),
    server: profileRunServer(run, connectorById),
    database: profileRunDatabase(run, connectorById),
    raw_data_captured: false,
    raw_values_retained: false,
    secret_exposed: false,
    profile_index_safe: true,
    counts: {
      assets_profiled: Number(summary.assets_profiled || 0),
      assets_planned: Number(summary.assets_planned || 0),
      assets_skipped: Number(summary.assets_skipped || 0),
      columns_profiled: Number(summary.columns_profiled || 0),
      discovered_objects: Number(summary.discovered_objects || summary.object_count || 0),
      discovered_columns: Number(summary.discovered_columns || summary.column_count || 0),
      discovered_lineage_edges: Number(summary.discovered_lineage_edges || summary.lineage_edge_count || 0),
      warnings: Number(summary.warning_count || 0),
    },
    evidence: {
      ...profileSourceEvidence(sourceArtifactPath, run),
    },
    caveats: profileRunKind(run) === 'metadata_harvest'
      ? ['This run harvested metadata. It did not execute aggregate table profiling.']
      : [],
  };
}

function isExecutedAggregateProfileRun(runOrShard = {}) {
  return (
    runOrShard.run_kind === 'aggregate_profile' &&
    ['succeeded', 'partial_failure'].includes(String(runOrShard.status || '').toLowerCase()) &&
    Number(runOrShard.counts?.assets_profiled || runOrShard.summary?.assets_profiled || 0) > 0
  );
}

function isPlannedAggregateProfileRun(runOrShard = {}) {
  return (
    runOrShard.run_kind === 'aggregate_profile' &&
    ['planned', 'dry_run'].includes(String(runOrShard.status || runOrShard.mode || '').toLowerCase())
  );
}

function profileCoverageSummary(entries = []) {
  const runs = entries.filter((entry) => entry.run_id && !entry.object_id);
  const executedAggregateRuns = runs.filter(isExecutedAggregateProfileRun);
  const plannedAggregateRuns = runs.filter(isPlannedAggregateProfileRun);
  const metadataHarvestRuns = runs.filter((run) => run.run_kind === 'metadata_harvest');
  const objectProfiles = entries.filter((entry) => entry.object_id && entry.run_kind === 'aggregate_profile');
  const metadataObjects = entries.filter((entry) => entry.object_id && entry.run_kind === 'metadata_harvest');
  const status = executedAggregateRuns.length
    ? 'live_aggregate_profile_available'
    : plannedAggregateRuns.length
      ? 'profile_planned_not_executed'
      : metadataHarvestRuns.length || metadataObjects.length
        ? 'metadata_inventory_only'
        : 'no_profile_evidence';
  return {
    status,
    executed_aggregate_run_count: executedAggregateRuns.length,
    planned_aggregate_run_count: plannedAggregateRuns.length,
    metadata_harvest_run_count: metadataHarvestRuns.length,
    aggregate_profile_object_count: objectProfiles.length,
    metadata_inventory_object_count: metadataObjects.length,
    caveat:
      status === 'live_aggregate_profile_available'
        ? ''
        : status === 'profile_planned_not_executed'
          ? 'Aggregate profiling has been planned, but no live/simulated aggregate profile results are available yet.'
          : status === 'metadata_inventory_only'
            ? 'Only metadata harvest/schema inventory evidence is available; row/null/distinct/min/max profile statistics are not present.'
            : 'No profile evidence is available in the packaged profile index.',
  };
}

function objectProfileShard(run = {}, assetId = '', profile = {}, connectorById = new Map(), sourceArtifactPath = '') {
  const columns = profile.columns || {};
  const columnRows = Object.entries(columns).map(([columnName, stats]) => ({
    column_name: columnName,
    row_count: stats.row_count ?? profile.row_count ?? null,
    null_count: stats.null_count ?? null,
    null_percent: stats.null_percent ?? null,
    distinct_count: stats.distinct_count ?? null,
    min: stats.min ?? null,
    max: stats.max ?? null,
    mean: stats.mean ?? null,
    profiled_at: stats.profiled_at || profile.profiled_at || profile.generated_at || profileRunCompletedAt(run),
    raw_values_retained: false,
  }));
  return {
    schema_version: PROFILE_INDEX_SCHEMA_VERSION,
    object_id: assetId,
    display_name: profile.display_name || profile.object_name || assetId,
    connector_id: run.connector_id || '',
    connector_type: run.connector_type || '',
    run_id: run.id,
    run_kind: profileRunKind(run),
    status: run.status || '',
    server: profile.server || profileRunServer(run, connectorById),
    database: profile.database || profileRunDatabase(run, connectorById),
    schema: profile.schema || '',
    object_name: profile.object_name || profile.display_name || assetId,
    object_type: profile.object_type || 'table',
    profiled_at: profile.profiled_at || profile.generated_at || profileRunCompletedAt(run),
    raw_data_captured: false,
    raw_values_retained: false,
    secret_exposed: false,
    profile_index_safe: true,
    profile_summary: {
      row_count: profile.row_count ?? null,
      column_count: Object.keys(columns).length,
      warning_count: Array.isArray(profile.warnings) ? profile.warnings.length : 0,
    },
    columns: columnRows,
    evidence: {
      ...profileSourceEvidence(sourceArtifactPath, run),
    },
  };
}

function eventObjectShard(run = {}, event = {}, connectorById = new Map(), sourceArtifactPath = '') {
  const attributes = event.attributes || {};
  const name = event.name || attributes.name || event.external_id || event.id || '';
  return {
    schema_version: PROFILE_INDEX_SCHEMA_VERSION,
    object_id: event.id || event.external_id || name,
    display_name: name,
    connector_id: run.connector_id || event.connector_id || '',
    connector_type: run.connector_type || event.connector_type || '',
    run_id: run.id,
    run_kind: profileRunKind(run),
    status: run.status || '',
    server: profileRunServer(run, connectorById),
    database: profileRunDatabase(run, connectorById),
    schema: attributes.schema || '',
    object_name: name,
    object_type: event.object_type || attributes.object_type || event.stream || event.type || '',
    profiled_at: profileRunCompletedAt(run),
    raw_data_captured: false,
    raw_values_retained: false,
    secret_exposed: false,
    profile_index_safe: true,
    profile_summary: {
      row_count: null,
      column_count: event.type === 'metadata.column' ? 1 : null,
      warning_count: 0,
    },
    columns: [],
    evidence: {
      stream: event.stream || '',
      ...profileSourceEvidence(sourceArtifactPath, run),
    },
    caveats: ['Metadata inventory record only; aggregate row/null statistics are not present for this object.'],
  };
}

async function readProfileRunArtifacts(artifactRoot) {
  if (!(await fileExists(artifactRoot))) return [];
  const files = await listFilesRecursive(artifactRoot);
  const runs = [];
  for (const relativePath of files.filter((file) => file.endsWith('.json') && !file.endsWith('devops-upload-pending.json'))) {
    const filePath = path.join(artifactRoot, relativePath);
    // eslint-disable-next-line no-await-in-loop
    const parsed = await readJson(filePath);
    const run = parsed.run || parsed;
    if (!run?.id) continue;
    run.artifact = {
      ...(run.artifact || {}),
      markdown_path: run.artifact?.markdown_path || parsed.markdown_path || '',
      json_path: run.artifact?.json_path || parsed.json_path || normalizePath(path.relative(process.cwd(), filePath)),
      devops_upload_pending: run.artifact?.devops_upload_pending ?? parsed.devops_upload_pending ?? false,
    };
    runs.push({
      run,
      sourceArtifactPath: normalizePath(path.relative(process.cwd(), filePath)),
    });
  }
  return runs;
}

async function readProfileRuntimeStore(storePath) {
  if (!(await fileExists(storePath))) return { connectors: [], runs: [] };
  const parsed = await readJson(storePath);
  return {
    connectors: Array.isArray(parsed.connectors) ? parsed.connectors : [],
    runs: Array.isArray(parsed.connector_runs) ? parsed.connector_runs : [],
  };
}

function mergeProfileRuns(artifactRuns = [], runtimeRuns = []) {
  const byId = new Map();
  for (const item of artifactRuns) byId.set(item.run.id, item);
  for (const run of runtimeRuns) {
    if (!run?.id || byId.has(run.id)) continue;
    byId.set(run.id, { run, sourceArtifactPath: '' });
  }
  return [...byId.values()].sort((a, b) =>
    String(profileRunCompletedAt(b.run)).localeCompare(String(profileRunCompletedAt(a.run)))
  );
}

function addToMapArray(map, key, value) {
  const normalized = key || 'unknown';
  if (!map.has(normalized)) map.set(normalized, []);
  map.get(normalized).push(value);
}

function profileIndexShardReference(relativePath, summary = {}) {
  return {
    path: normalizePath(relativePath),
    ...summary,
  };
}

function workspaceRelativePath(filePath) {
  const resolved = path.isAbsolute(String(filePath || '')) ? filePath : path.resolve(process.cwd(), String(filePath || ''));
  const relative = path.relative(process.cwd(), resolved);
  return normalizePath(relative && !relative.startsWith('..') && !path.isAbsolute(relative) ? relative : filePath);
}

async function buildProfileIndex(packageRoot, options = {}) {
  const artifactRoot = path.resolve(
    process.cwd(),
    options.artifactRoot || process.env.PROFILE_RUN_ARTIFACT_ROOT || DEFAULT_PROFILE_RUN_ARTIFACT_ROOT
  );
  const storePath = path.resolve(
    process.cwd(),
    options.storePath || process.env.PROFILE_SCHEDULER_STORE_PATH || DEFAULT_PROFILE_RUNTIME_STORE
  );
  const [artifactRuns, runtimeStore] = await Promise.all([
    readProfileRunArtifacts(artifactRoot),
    readProfileRuntimeStore(storePath),
  ]);
  const connectorById = new Map(runtimeStore.connectors.map((connector) => [connector.id, connector]));
  const runs = mergeProfileRuns(artifactRuns, runtimeStore.runs);
  const runShards = [];
  const objectShards = [];
  const databaseMap = new Map();
  const objectNameMap = new Map();
  const columnNameMap = new Map();
  const connectorMap = new Map();
  for (const directory of [
    'profile-index/by-database',
    'profile-index/by-object-id',
    'profile-index/by-object-name',
    'profile-index/by-column-name',
    'profile-index/runs/by-run-id',
    'profile-index/runs/by-connector',
    'profile-index/flags',
  ]) {
    // eslint-disable-next-line no-await-in-loop
    await mkdir(path.join(packageRoot, directory), { recursive: true });
  }

  for (const { run, sourceArtifactPath } of runs) {
    const runShard = profileRunShard(run, connectorById, sourceArtifactPath);
    assertProfileIndexSafe(runShard, `run:${run.id}`);
    const runRelativePath = `profile-index/runs/by-run-id/${safeProfileSegment(run.id, 'run')}.json`;
    // eslint-disable-next-line no-await-in-loop
    await writeJson(packageRoot, runRelativePath, runShard);
    runShards.push(profileIndexShardReference(runRelativePath, {
      run_id: run.id,
      connector_id: runShard.connector_id,
      run_kind: runShard.run_kind,
      status: runShard.status,
      completed_at: runShard.completed_at,
    }));
    addToMapArray(connectorMap, runShard.connector_id, runShard);
    addToMapArray(databaseMap, runShard.database || 'unknown', runShard);

    const profiles = profileRunProfiles(run);
    for (const [assetId, profile] of Object.entries(profiles)) {
      const objectShard = objectProfileShard(run, assetId, profile, connectorById, sourceArtifactPath);
      assertProfileIndexSafe(objectShard, `object:${assetId}`);
      objectShards.push(objectShard);
    }

    for (const event of run.extraction?.events || []) {
      if (!event?.id || (event.type !== 'metadata.object' && event.type !== 'metadata.column')) continue;
      const objectShard = eventObjectShard(run, event, connectorById, sourceArtifactPath);
      assertProfileIndexSafe(objectShard, `event:${event.id}`);
      objectShards.push(objectShard);
    }
  }

  const latestByObject = new Map();
  for (const shard of objectShards) {
    const existing = latestByObject.get(shard.object_id);
    if (!existing || String(shard.profiled_at || '').localeCompare(String(existing.profiled_at || '')) >= 0) {
      latestByObject.set(shard.object_id, shard);
    }
  }

  for (const shard of latestByObject.values()) {
    const objectPath = `profile-index/by-object-id/${safeProfileSegment(shard.object_id, 'object')}.json`;
    // eslint-disable-next-line no-await-in-loop
    await writeJson(packageRoot, objectPath, shard);
    const objectReference = profileIndexShardReference(objectPath, {
      object_id: shard.object_id,
      display_name: shard.display_name,
      database: shard.database,
      object_type: shard.object_type,
      profiled_at: shard.profiled_at,
    });
    addToMapArray(objectNameMap, normalizeLookupKey(shard.object_name || shard.display_name || shard.object_id), objectReference);
    addToMapArray(databaseMap, shard.database || 'unknown', objectReference);
    for (const column of shard.columns || []) {
      addToMapArray(columnNameMap, normalizeLookupKey(column.column_name), {
        ...objectReference,
        column_name: column.column_name,
        null_percent: column.null_percent,
        distinct_count: column.distinct_count,
      });
    }
  }

  for (const [connectorId, connectorRuns] of connectorMap.entries()) {
    const connectorPath = `profile-index/runs/by-connector/${safeProfileSegment(connectorId, 'connector')}.json`;
    const payload = {
      schema_version: PROFILE_INDEX_SCHEMA_VERSION,
      connector_id: connectorId,
      profile_index_safe: true,
      raw_data_captured: false,
      raw_values_retained: false,
      secret_exposed: false,
      profile_coverage: profileCoverageSummary(connectorRuns),
      runs: connectorRuns,
    };
    assertProfileIndexSafe(payload, `connector:${connectorId}`);
    // eslint-disable-next-line no-await-in-loop
    await writeJson(packageRoot, connectorPath, payload);
  }

  for (const [database, entries] of databaseMap.entries()) {
    const databasePath = `profile-index/by-database/${safeProfileSegment(database, 'database')}.json`;
    const payload = {
      schema_version: PROFILE_INDEX_SCHEMA_VERSION,
      database,
      profile_index_safe: true,
      raw_data_captured: false,
      raw_values_retained: false,
      secret_exposed: false,
      profile_coverage: profileCoverageSummary(entries),
      entries,
    };
    assertProfileIndexSafe(payload, `database:${database}`);
    // eslint-disable-next-line no-await-in-loop
    await writeJson(packageRoot, databasePath, payload);
  }

  for (const [objectName, entries] of objectNameMap.entries()) {
    const objectNamePath = `profile-index/by-object-name/${safeProfileSegment(objectName, 'object-name')}.json`;
    // eslint-disable-next-line no-await-in-loop
    await writeJson(packageRoot, objectNamePath, {
      schema_version: PROFILE_INDEX_SCHEMA_VERSION,
      lookup_key: objectName,
      profile_index_safe: true,
      raw_data_captured: false,
      raw_values_retained: false,
      secret_exposed: false,
      matches: entries,
    });
  }

  for (const [columnName, entries] of columnNameMap.entries()) {
    const columnNamePath = `profile-index/by-column-name/${safeProfileSegment(columnName, 'column-name')}.json`;
    // eslint-disable-next-line no-await-in-loop
    await writeJson(packageRoot, columnNamePath, {
      schema_version: PROFILE_INDEX_SCHEMA_VERSION,
      lookup_key: columnName,
      profile_index_safe: true,
      raw_data_captured: false,
      raw_values_retained: false,
      secret_exposed: false,
      matches: entries,
    });
  }

  const flags = {
    'profile-index/flags/pii.json': { flag: 'pii', matches: [] },
    'profile-index/flags/metrics.json': { flag: 'metrics', matches: [] },
    'profile-index/flags/quality-gaps.json': { flag: 'quality-gaps', matches: [] },
    'profile-index/flags/stale-profiles.json': { flag: 'stale-profiles', matches: [] },
  };
  for (const [relativePath, payload] of Object.entries(flags)) {
    // eslint-disable-next-line no-await-in-loop
    await writeJson(packageRoot, relativePath, {
      schema_version: PROFILE_INDEX_SCHEMA_VERSION,
      profile_index_safe: true,
      raw_data_captured: false,
      raw_values_retained: false,
      secret_exposed: false,
      ...payload,
    });
  }

  const manifest = {
    schema_version: PROFILE_INDEX_SCHEMA_VERSION,
    generated_at: new Date().toISOString(),
    source_store_published: false,
    source_store_reference: hashValue(workspaceRelativePath(storePath), 16),
    source_artifact_root_published: false,
    source_artifact_root_reference: hashValue(workspaceRelativePath(artifactRoot), 16),
    source_artifact_root_note: 'Local profile-run artifact root is intentionally not published in the runtime package.',
    source_run_ids: runs.map(({ run }) => run.id).filter(Boolean).sort(),
    counts: {
      run_count: runs.length,
      aggregate_profile_run_count: runs.filter(({ run }) => profileRunKind(run) === 'aggregate_profile').length,
      executed_aggregate_profile_run_count: runShards.filter(isExecutedAggregateProfileRun).length,
      planned_aggregate_profile_run_count: runShards.filter(isPlannedAggregateProfileRun).length,
      metadata_harvest_run_count: runs.filter(({ run }) => profileRunKind(run) === 'metadata_harvest').length,
      bi_profile_run_count: runs.filter(({ run }) => profileRunKind(run) === 'bi_profile').length,
      metadata_profile_run_count: runs.filter(({ run }) => profileRunKind(run) === 'metadata_profile').length,
      object_profile_count: latestByObject.size,
      aggregate_profile_object_count: [...latestByObject.values()].filter((shard) => shard.run_kind === 'aggregate_profile').length,
      metadata_inventory_object_count: [...latestByObject.values()].filter((shard) => shard.run_kind === 'metadata_harvest').length,
      object_name_index_count: objectNameMap.size,
      column_name_index_count: columnNameMap.size,
      database_index_count: databaseMap.size,
      connector_index_count: connectorMap.size,
    },
    entrypoints: {
      latest_summary: 'profile-index/latest-summary.json',
      by_database: 'profile-index/by-database/',
      by_object_id: 'profile-index/by-object-id/',
      by_object_name: 'profile-index/by-object-name/',
      by_column_name: 'profile-index/by-column-name/',
      runs_by_id: 'profile-index/runs/by-run-id/',
      runs_by_connector: 'profile-index/runs/by-connector/',
      flags: 'profile-index/flags/',
    },
    safety: {
      raw_data_captured: false,
      raw_values_retained: false,
      secret_exposed: false,
      profile_index_safe: true,
      validation_status: 'passed',
      forbidden_field_count: 0,
    },
  };
  assertProfileIndexSafe(manifest, 'profile-index:manifest');
  await writeJson(packageRoot, 'profile-index/manifest.json', manifest);
  await writeJson(packageRoot, 'profile-index/latest-summary.json', {
    schema_version: PROFILE_INDEX_SCHEMA_VERSION,
    generated_at: manifest.generated_at,
    profile_index_safe: true,
    raw_data_captured: false,
    raw_values_retained: false,
    secret_exposed: false,
    counts: manifest.counts,
    profile_coverage: profileCoverageSummary([...runShards, ...latestByObject.values()]),
    latest_runs: runShards.slice(0, 20),
    caveats: [
      'Aggregate row/null profile statistics appear only for runs that executed an aggregate profile.',
      'Metadata harvest runs contribute inventory and coverage evidence, not table row counts.',
    ],
  });
  return manifest;
}

async function writeProfileTeaserCards(packageRoot, runtimeRows = []) {
  let written = 0;
  let skipped = 0;
  for (const row of runtimeRows) {
    if (!row.answer_cards?.profile_teaser) continue;
    // eslint-disable-next-line no-await-in-loop
    const card = await profileTeaserAnswerCard(packageRoot, row);
    // eslint-disable-next-line no-await-in-loop
    const result = await writeJsonIfChanged(
      packageRoot,
      row.answer_cards.profile_teaser,
      card
    );
    if (result.written) written += 1;
    else skipped += 1;
  }
  return {
    profile_teaser_files_written: written,
    profile_teaser_files_skipped: skipped,
  };
}

async function applyCompactPayloadMode(packageRoot, runtimeBuild) {
  const runtimeRows = runtimeBuild.runtimeRows || [];
  await writeJsonl(packageRoot, 'registry/object-registry.jsonl', runtimeRows);
  await writeJsonl(packageRoot, 'registry/canonical-objects.jsonl', runtimeBuild.canonicalRows || []);
  await writeJsonl(packageRoot, 'registry/duplicate-objects.jsonl', runtimeBuild.duplicateRows || []);
  await writeJsonl(packageRoot, 'registry/unresolved-server-objects.jsonl', runtimeBuild.unresolvedRows || []);
  await writeText(packageRoot, 'registry/object-registry.csv', registryCsv(runtimeRows));

  const removed = [];
  for (const relativePath of [
    'servers',
    'ssis',
    'reports',
    'context-packs/databases',
  ]) {
    // eslint-disable-next-line no-await-in-loop
    if (await removeTreeIfExists(packageRoot, relativePath)) removed.push(relativePath);
  }
  return {
    mode: 'compact',
    registry_rows_rewritten: runtimeRows.length,
    removed_paths: removed,
    retained_paths: [
      'manifest.json',
      'latest.json',
      'AI_README.md',
      'README.md',
      'catalog-manifest.json',
      'schemas/',
      'docs/',
      'registry/',
      'indexes/',
      'answers/',
      'context-packs/objects/',
      'profile-index/',
    ],
  };
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
6. Use \`profile-index/\` first for profile, quality, metric, sensitivity, and freshness questions.
7. Use Confluence only for governance explanation, policy, stewardship, or curated narrative.

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
- Never treat profile run markdown as the primary large-scale profile index.
- Never expose raw rows, sample values, report result rows, unrestricted source payloads, credentials, tokens, connection strings, or vault references.
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
- \`profile-index/manifest.json\`
- \`profile-index/latest-summary.json\`
- \`profile-index/by-database/**\`
- \`profile-index/by-object-id/**\`
- \`profile-index/by-object-name/**\`
- \`profile-index/by-column-name/**\`
- \`answers/**\`
- \`context-packs/**\`
- \`ssis/**\`

## AI Routing

AI assistants should read \`manifest.json\`, then use the smallest relevant index. The registry row contains exact context pack and answer-card paths to read. For profile, quality, metric, sensitivity, and freshness questions, use \`profile-index/\` before profile run markdown or Confluence. Confluence is secondary and should be used only for human-friendly governance context.

## Profile Index

The \`profile-index/\` folder is the machine-readable profile payload. It is built from sanitized connector/profile run artifacts and operational profile state. It is safe for DevOps publication only when \`npm run lineage:runtime:check\` passes.

Profile-index shards must not contain raw row values, sample values, report result rows, unrestricted source payloads, credentials, tokens, connection strings, or vault references.

## Local Validation

Run:

\`\`\`powershell
npm run lineage:runtime:check
\`\`\`
`;
}

async function main() {
  const forceRebuild = hasFlag('--force') || hasFlag('--full-rebuild');
  const mode = payloadMode();
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
  const profileIndexManifest = await buildProfileIndex(packageRoot);
  const profileTeaserBuild = await writeProfileTeaserCards(packageRoot, runtimeBuild.runtimeRows || []);
  const artifactManifest = await buildArtifactManifests(packageRoot, { runtimeBuild, profileIndexManifest });
  const compactPayload =
    mode === 'compact'
      ? await applyCompactPayloadMode(packageRoot, runtimeBuild)
      : { mode, registry_rows_rewritten: 0, removed_paths: [], retained_paths: [] };
  const { indexManifest } = runtimeBuild;
  const registryCount = await countJsonl(path.join(packageRoot, 'registry/object-registry.jsonl'));
  const contentHashes = await buildHashes(packageRoot);
  const runtimeHash = runtimeContentHashWithProfiles({
    sourceManifest,
    objects: runtimeBuild.objects,
    profileIndexManifest,
    mode,
  });

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
        indexManifest.counts.qualified_resolver_files +
        indexManifest.counts.top_used_files +
        indexManifest.counts.ranking_files,
      answer_card_file_count: indexManifest.counts.answer_card_files,
      qualified_resolver_file_count: indexManifest.counts.qualified_resolver_files,
      compact_context_pack_count: indexManifest.counts.compact_context_pack_files,
      profile_index_run_count: profileIndexManifest.counts.run_count,
      profile_index_object_count: profileIndexManifest.counts.object_profile_count,
      profile_index_database_count: profileIndexManifest.counts.database_index_count,
    },
    build: {
      builder_version: RUNTIME_BUILDER_VERSION,
      payload_mode: mode,
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
      profile_teaser_files_written: profileTeaserBuild.profile_teaser_files_written,
      profile_teaser_files_skipped: profileTeaserBuild.profile_teaser_files_skipped,
    },
    registry_path: 'registry/object-registry.jsonl',
    indexes: {
      object_name: 'indexes/by-name/',
      object_name_shard_strategy: 'first two normalized alphanumeric characters of lookup key',
      database: 'indexes/by-database/',
      schema: 'indexes/by-schema/',
      qualified_name_resolver: 'indexes/resolve/by-qualified-name/',
      aliases: 'indexes/aliases/',
      aliases_shard_strategy: 'first two normalized alphanumeric characters of alias',
      top_used: 'indexes/top-used/',
      rankings: 'indexes/rankings/',
      manifest: 'indexes/index-manifest.json',
    },
    answer_cards: {
      summary: 'answers/summary/by-object-id/',
      usage_count: 'answers/usage-count/by-object-id/',
      upstream: 'answers/upstream/by-object-id/',
      downstream: 'answers/downstream/by-object-id/',
      profile_teaser: 'answers/profile-teaser/by-object-id/',
      catalog_databases: 'answers/catalog/databases.json',
      intent_cards: 'answers/intents/',
    },
    compact_context_packs: {
      by_object_id: 'context-packs/objects/by-id/',
    },
    profile_index: {
      manifest: 'profile-index/manifest.json',
      latest_summary: 'profile-index/latest-summary.json',
      by_database: 'profile-index/by-database/',
      by_object_id: 'profile-index/by-object-id/',
      by_object_name: 'profile-index/by-object-name/',
      by_column_name: 'profile-index/by-column-name/',
      runs_by_id: 'profile-index/runs/by-run-id/',
      runs_by_connector: 'profile-index/runs/by-connector/',
      flags: 'profile-index/flags/',
    },
    entrypoints: {
      registry_jsonl: 'registry/object-registry.jsonl',
      canonical_registry_jsonl: 'registry/canonical-objects.jsonl',
      duplicate_registry_jsonl: 'registry/duplicate-objects.jsonl',
      unresolved_server_registry_jsonl: 'registry/unresolved-server-objects.jsonl',
      registry_csv: 'registry/object-registry.csv',
      database_index: 'registry/database-index.json',
      database_artifact_index: 'registry/database-artifact-index.json',
      object_path_index: 'registry/object-path-index.json',
      database_catalog_answer: 'answers/catalog/databases.json',
      registry_summary: 'registry/object-registry-summary.json',
      index_manifest: 'indexes/index-manifest.json',
      artifact_manifest: 'indexes/artifact-manifest.json',
      routing_entrypoints: 'indexes/entrypoints.json',
      path_contract: 'indexes/path-contract.json',
      intent_cards: 'answers/intents/',
      profile_index_manifest: 'profile-index/manifest.json',
      profile_index_latest_summary: 'profile-index/latest-summary.json',
      catalog_manifest: 'catalog-manifest.json',
      ai_readme: 'AI_README.md',
      runtime_guide: 'docs/runtime-package-guide.md',
    },
    retrieval_order: [
      'manifest.json',
      'indexes/entrypoints.json and indexes/path-contract.json',
      'indexes/by-name, indexes/aliases, indexes/by-database, indexes/by-schema, or indexes/rankings',
      'indexes/resolve/by-qualified-name for exact object names',
      'registry/canonical-objects.jsonl before registry/object-registry.jsonl',
      'answers/summary, usage-count, upstream, downstream, and profile-teaser by object id',
      'profile-index/ for profile, quality, metric, sensitivity, and freshness questions',
      'row.compact_context_pack_path, row.answer_cards, or row.context_pack_json_path',
      'Confluence only for human governance explanation',
    ],
    quality_gates: {
      blocked_raw_server_database_pairs: [{ server: 'unknown', database: 'Sonic_DW' }],
      unknown_sonic_dw_blocked: true,
      require_context_pack_paths: true,
      require_case_insensitive_unique_paths: true,
      require_profile_index_safety: true,
      compact_payload_registry_points_to_compact_context: mode === 'compact',
    },
    payload: compactPayload,
    artifact_manifest: artifactManifest,
    profile_index_manifest: profileIndexManifest,
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
    routing_entrypoints_path: manifest.entrypoints.routing_entrypoints,
    path_contract_path: manifest.entrypoints.path_contract,
    profile_index_manifest_path: manifest.entrypoints.profile_index_manifest,
    profile_index_latest_summary_path: manifest.entrypoints.profile_index_latest_summary,
    indexes: manifest.indexes,
    profile_index: manifest.profile_index,
  });

  const nextState = {
    schema_version: 1,
    builder_version: RUNTIME_BUILDER_VERSION,
    package_name: packageName,
    package_root: normalizePath(packageRoot),
    payload_mode: mode,
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
    latest_payload: manifest.payload,
    profile_index_manifest: profileIndexManifest,
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
