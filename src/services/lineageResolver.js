/**
 * Corpus Lineage Resolver
 * Reconciles cross-file and cross-database lineage after markdown generation.
 */

import { readdir } from 'fs/promises';
import { mkdir, writeFile, appendFile } from 'fs/promises';
import { join, extname } from 'path';
import {
  parseMarkdownFile,
  updateMarkdownMetadata,
} from './markdownService.js';

async function walkMarkdownFiles(dirPath) {
  const files = [];

  async function walk(currentPath) {
    try {
      const entries = await readdir(currentPath, { withFileTypes: true });
      await Promise.all(entries.map(async (entry) => {
        const fullPath = join(currentPath, entry.name);
        if (entry.isDirectory()) {
          await walk(fullPath);
        } else if (entry.isFile() && extname(entry.name) === '.md') {
          files.push(fullPath);
        }
      }));
    } catch (err) {
      console.error(`Error reading directory ${currentPath}:`, err.message);
    }
  }

  await walk(dirPath);
  return files;
}

function normalizeRef(value) {
  return String(value ?? '')
    .trim()
    .replace(/^"+|"+$/g, '')
    .replace(/^'+|'+$/g, '')
    .replace(/\[|\]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/^ssis\//i, '')
    .trim();
}

function normalizeId(value) {
  return normalizeRef(value).toLowerCase();
}

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

function pushUnique(map, key, value) {
  if (!key || !value) return;
  if (!map.has(key)) {
    map.set(key, new Set());
  }
  map.get(key).add(value);
}

function isCanonicalSqlId(value) {
  const parts = normalizeRef(value).split('.').filter(Boolean);
  return parts.length === 4 && parts.every(Boolean);
}

function isCanonicalPackageId(value) {
  const parts = normalizeRef(value).split('.').filter(Boolean);
  return parts.length >= 5 && String(parts[1] || '').toLowerCase() === 'ssisdb';
}

function isCanonicalResolvableId(value) {
  return isCanonicalSqlId(value) || isCanonicalPackageId(value);
}

function buildAliasIndex(records) {
  const aliasIndex = new Map();

  for (const record of records) {
    const { metadata } = record;
    const aliases = [
      metadata.id,
      ...(Array.isArray(metadata.aliases) ? metadata.aliases : []),
    ]
      .filter(Boolean)
      .map((alias) => normalizeId(alias));

    for (const alias of aliases) {
      if (!isCanonicalResolvableId(alias)) continue;
      if (!aliasIndex.has(alias)) {
        aliasIndex.set(alias, new Set());
      }
      aliasIndex.get(alias).add(metadata.id);
    }
  }

  return aliasIndex;
}

function resolveReference(reference, aliasIndex, sourceMetadata = {}) {
  const key = normalizeId(reference);
  if (!isCanonicalResolvableId(key)) {
    return [];
  }

  const matches = Array.from(aliasIndex.get(key) || []);

  const sourceServer = normalizeId(sourceMetadata.server || sourceMetadata.serverName);
  const sourceDatabase = normalizeId(sourceMetadata.database);
  const refParts = key.split('.').filter(Boolean);
  const refServer = refParts.length > 3 ? refParts[0] : '';
  const refDatabase = refParts.length > 3 ? refParts[1] : refParts.length > 2 ? refParts[0] : '';

  const scoped = matches.filter((matchId) => {
    const target = normalizeId(matchId);
    const targetParts = target.split('.').filter(Boolean);
    const targetServer = targetParts.length > 3 ? targetParts[0] : '';
    const targetDatabase = targetParts.length > 3 ? targetParts[1] : targetParts.length > 2 ? targetParts[0] : '';

    if (sourceServer && targetServer && sourceServer !== targetServer) return false;
    if (sourceDatabase && targetDatabase && sourceDatabase !== targetDatabase) return false;
    if (refServer && targetServer && refServer !== targetServer) return false;
    if (refDatabase && targetDatabase && refDatabase !== targetDatabase) return false;
    return true;
  });

  return scoped.length > 0 ? scoped : matches;
}

function filterTopologyReferences(referenceList, objectById, relationshipType) {
  const result = [];
  for (const reference of referenceList) {
    const id = normalizeId(reference);
    const target = objectById.get(id);
    if (!target) {
      result.push(reference);
      continue;
    }
    if (relationshipType === 'created_via' && String(target.type || '').toLowerCase() !== 'package') {
      continue;
    }
    result.push(target.id);
  }
  return Array.from(new Set(result));
}

function isPackageLike(metadata) {
  return String(metadata.type || '').toLowerCase() === 'package' || Boolean(metadata.packageName);
}

function isProcedureLike(metadata) {
  return String(metadata.type || '').toLowerCase() === 'procedure';
}

function isTableLike(metadata) {
  return ['table', 'view', 'dataset'].includes(String(metadata.type || '').toLowerCase());
}

function getTraceLogPath() {
  return join(process.cwd(), 'data', 'logs', 'edge_resolution_trace.log');
}

async function initTraceLog() {
  const logPath = getTraceLogPath();
  await mkdir(join(process.cwd(), 'data', 'logs'), { recursive: true });
  await writeFile(logPath, '', 'utf8');
  return logPath;
}

function compactId(value) {
  return String(value || '').replace(/^SSIS\//i, '');
}

export async function resolveLineageCorpus(dataPath) {
  const traceLogPath = await initTraceLog();
  const traceLines = [];
  const files = await walkMarkdownFiles(dataPath);
  const records = [];

  for (const filePath of files) {
    try {
      const metadata = await parseMarkdownFile(filePath);
      records.push({ filePath, metadata });
    } catch (err) {
      console.error(`Resolver parse failed for ${filePath}:`, err.message);
    }
  }

  const aliasIndex = buildAliasIndex(records);
  const outgoingWrites = new Map();
  const outgoingCalls = new Map();
  const outgoingReads = new Map();

  for (const record of records) {
    const sourceId = record.metadata.id;
    if (record.metadata.external_source) {
      traceLines.push(`[EXTERNAL] Tagged ${sourceId} as external_source`);
    }

    for (const ref of ensureArray(record.metadata.writes_to)) {
      const matches = resolveReference(ref, aliasIndex, record.metadata);
      if (matches.length === 0) {
        traceLines.push(`[REJECTED] ${sourceId} -> ${compactId(ref)} (No exact match)`);
      }
      for (const targetId of matches) {
        pushUnique(outgoingWrites, targetId, sourceId);
        traceLines.push(`[MAPPED] ${sourceId} -> ${targetId} via writes_to`);
      }
    }

    for (const ref of ensureArray(record.metadata.calls)) {
      const matches = resolveReference(ref, aliasIndex, record.metadata);
      if (matches.length === 0) {
        traceLines.push(`[REJECTED] ${sourceId} -> ${compactId(ref)} (No exact match)`);
      }
      for (const targetId of matches) {
        pushUnique(outgoingCalls, targetId, sourceId);
        traceLines.push(`[MAPPED] ${sourceId} -> ${targetId} via calls`);
      }
    }

    for (const ref of ensureArray(record.metadata.reads_from)) {
      const matches = resolveReference(ref, aliasIndex, record.metadata);
      if (matches.length === 0) {
        traceLines.push(`[REJECTED] ${sourceId} -> ${compactId(ref)} (No exact match)`);
      }
      for (const targetId of matches) {
        pushUnique(outgoingReads, targetId, sourceId);
        traceLines.push(`[MAPPED] ${sourceId} -> ${targetId} via reads_from`);
      }
    }
  }

  const objectById = new Map();
  for (const record of records) {
    objectById.set(record.metadata.id, record.metadata);
    objectById.set(normalizeId(record.metadata.id), record.metadata);
  }
  const reverseCallGraph = new Map();

  for (const [calleeId, callerSet] of outgoingCalls.entries()) {
    for (const callerId of callerSet) {
      pushUnique(reverseCallGraph, calleeId, callerId);
    }
  }

  const packageAncestorsFor = (seedIds) => {
    const seen = new Set();
    const stack = [...seedIds];
    while (stack.length > 0) {
      const currentId = stack.pop();
      const parents = reverseCallGraph.get(currentId);
      if (!parents) continue;
      for (const parentId of parents) {
        if (seen.has(parentId)) continue;
        seen.add(parentId);
        const parent = objectById.get(parentId);
        if (parent && isPackageLike(parent)) {
          stack.push(parentId);
        } else if (parent && isProcedureLike(parent)) {
          stack.push(parentId);
        }
      }
    }
    return Array.from(seen);
  };

  const updates = [];

  for (const record of records) {
    const { metadata } = record;
    if (!isTableLike(metadata)) continue;

    const existingCreators = ensureArray(metadata.created_by);
    const incomingWrites = Array.from(outgoingWrites.get(metadata.id) || []);
    const directCreators = Array.from(new Set([...existingCreators, ...incomingWrites])).sort();
    const resolvedCreators = filterTopologyReferences(directCreators, objectById, 'creator');
    const createdVia = filterTopologyReferences(packageAncestorsFor(resolvedCreators), objectById, 'created_via');
    const usedBy = filterTopologyReferences(Array.from(outgoingReads.get(metadata.id) || []).sort(), objectById, 'used_by');
    const contextualReads = filterTopologyReferences(ensureArray(metadata.contextual_reads), objectById, 'contextual');
    const existingExternalSource = Boolean(metadata.external_source);
    let lineageStatus = 'creator_unresolved';
    if (resolvedCreators.length > 0) {
      lineageStatus = 'creator_found';
    } else if (existingExternalSource) {
      lineageStatus = 'source_external';
    }

    const next = {
      created_by: resolvedCreators,
      created_via: createdVia,
      used_by: usedBy,
      contextual_reads: contextualReads,
      lineage_status: lineageStatus,
      external_source: existingExternalSource,
    };

    if (existingExternalSource) {
      traceLines.push(`[EXTERNAL] Tagged ${metadata.id} as external_source`);
    }

    for (const creator of resolvedCreators) {
      traceLines.push(`[MAPPED] ${creator} -> ${metadata.id} via created_by`);
    }

    const changed =
      JSON.stringify(ensureArray(metadata.created_by)) !== JSON.stringify(resolvedCreators) ||
      JSON.stringify(ensureArray(metadata.created_via)) !== JSON.stringify(createdVia) ||
      JSON.stringify(ensureArray(metadata.used_by)) !== JSON.stringify(usedBy) ||
      JSON.stringify(ensureArray(metadata.contextual_reads)) !== JSON.stringify(contextualReads) ||
      Boolean(metadata.external_source) !== existingExternalSource ||
      String(metadata.lineage_status || '') !== lineageStatus;

    if (changed) {
      updates.push({ filePath: record.filePath, next });
    }
  }

  if (traceLines.length > 0) {
    await appendFile(traceLogPath, `${traceLines.join('\n')}\n`, 'utf8');
  }

  for (const update of updates) {
    try {
      await updateMarkdownMetadata(update.filePath, update.next);
    } catch (err) {
      console.error(`Resolver write failed for ${update.filePath}:`, err.message);
    }
  }

  return {
    scannedFiles: files.length,
    parsedObjects: records.length,
    updatesWritten: updates.length,
  };
}

export default resolveLineageCorpus;
