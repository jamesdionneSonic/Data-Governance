import { promises as fs } from 'fs';
import path from 'path';
import yaml from 'yaml';
import MarkdownGenerator from '../src/services/markdownFromSqlServer.js';
import {
  SsisMetadataExtractor,
  parseSsisPackageXmlForLineage,
} from '../src/services/ssisExtractor.js';
import { loadAllMarkdown, validateMetadata } from '../src/services/markdownService.js';

const ROOT = process.cwd();
const RAW_SQL_ROOT = path.join(ROOT, 'data', 'analysis', 'raw', 'sqlserver', 'servers');
const RAW_SSIS_XML_ROOT = path.join(ROOT, 'data', 'analysis', 'raw', 'ssis', 'xml');
const OUTPUT_ROOT = path.join(ROOT, 'data', 'markdown');
const OUTPUT_SERVERS_ROOT = path.join(OUTPUT_ROOT, 'servers');
const CATALOG_MANIFEST_PATH = path.join(OUTPUT_ROOT, 'catalog-manifest.json');
const ALIAS_CONFIG_PATH = path.join(ROOT, 'config', 'lineage-aliases.json');

const SQL_OBJECT_DIRS = new Set([
  'tables',
  'views',
  'stored_procedures',
  'functions',
  'triggers',
  'synonyms',
]);

const DB_CASE = new Map([
  ['etl_staging', 'ETL_Staging'],
  ['sonic_dw', 'Sonic_DW'],
  ['stagingdb', 'StagingDB'],
  ['vendordata', 'VendorData'],
  ['ssisdb', 'SSISDB'],
]);

function markdownScalar(value) {
  const text = String(value ?? '');
  if (text === '') return '""';
  if (/^[A-Za-z0-9_.-]+$/.test(text)) return text;
  return JSON.stringify(text);
}

function manifestPath(filePath) {
  return path.relative(OUTPUT_ROOT, filePath).replace(/\\/g, '/');
}

function appendYamlValue(lines, key, value, indent = '') {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      lines.push(`${indent}${key}: []`);
      return;
    }
    lines.push(`${indent}${key}:`);
    for (const item of value) {
      if (item && typeof item === 'object' && !Array.isArray(item)) {
        lines.push(`${indent}  -`);
        for (const [childKey, childValue] of Object.entries(item)) {
          appendYamlValue(lines, childKey, childValue, `${indent}    `);
        }
      } else {
        lines.push(`${indent}  - ${markdownScalar(item)}`);
      }
    }
    return;
  }

  if (value && typeof value === 'object') {
    lines.push(`${indent}${key}:`);
    for (const [childKey, childValue] of Object.entries(value)) {
      appendYamlValue(lines, childKey, childValue, `${indent}  `);
    }
    return;
  }

  if (typeof value === 'string') {
    lines.push(`${indent}${key}: ${markdownScalar(value)}`);
  } else if (typeof value === 'number') {
    lines.push(`${indent}${key}: ${value}`);
  } else if (typeof value === 'boolean') {
    lines.push(`${indent}${key}: ${value}`);
  } else {
    lines.push(`${indent}${key}: null`);
  }
}

function renderFrontmatter(frontmatter) {
  const lines = [];
  for (const [key, value] of Object.entries(frontmatter)) {
    appendYamlValue(lines, key, value);
  }
  return `---\n${lines.join('\n')}\n---\n\n`;
}

function sanitizePathSegment(value, fallback = 'unknown') {
  const safe = String(value || fallback)
    .trim()
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, '_')
    .replace(/\s+/g, '_');
  return safe || fallback;
}

function cleanSegment(value) {
  return String(value || '')
    .trim()
    .replace(/^"+|"+$/g, '')
    .replace(/^'+|'+$/g, '')
    .replace(/\]\.\[/g, '.')
    .replace(/\[|\]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function canonicalDatabase(value) {
  const cleaned = cleanSegment(value);
  return DB_CASE.get(cleaned.toLowerCase()) || cleaned;
}

function canonicalServer(value, database = '', aliases = {}) {
  const cleaned = cleanSegment(value)
    .replace(/^tcp:/i, '')
    .replace(/^np:/i, '')
    .replace(/^lpc:/i, '')
    .trim();
  if (!cleaned) return 'unknown';

  const dbKey = canonicalDatabase(database).toLowerCase();
  const dbAliases = aliases.sqlServerAliasesByDatabase?.[dbKey] || {};
  for (const [alias, canonical] of Object.entries(dbAliases)) {
    if (cleaned.toLowerCase() === cleanSegment(alias).toLowerCase()) {
      return canonical;
    }
  }

  const [hostName] = cleaned.split('\\');
  return String(hostName || cleaned).trim();
}

function parseMarkdownFileContent(content, filePath) {
  const normalized = String(content || '').replace(/^\uFEFF/, '');
  const match = normalized.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) throw new Error(`No frontmatter found in ${filePath}`);

  let metadata;
  try {
    metadata = yaml.parse(match[1]) || {};
  } catch (err) {
    throw new Error(`Invalid YAML in ${filePath}: ${err.message}`);
  }

  const body = normalized.slice(match[0].length).trimStart();
  return { metadata, body };
}

async function readJsonIfExists(filePath, fallback = {}) {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

async function listFiles(root, predicate = () => true) {
  const results = [];

  async function walk(current) {
    let entries = [];
    try {
      entries = await fs.readdir(current, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.isFile() && predicate(fullPath)) {
        results.push(fullPath);
      }
    }
  }

  await walk(root);
  return results;
}

function extractDefinition(body) {
  const match = String(body || '').match(/## Definition[\s\S]*?```sql\r?\n([\s\S]*?)\r?\n```/i);
  return match ? match[1].trim() : '';
}

function typeFromDirectory(directoryName) {
  if (directoryName === 'stored_procedures') return 'procedure';
  if (directoryName === 'tables') return 'table';
  if (directoryName === 'views') return 'view';
  if (directoryName === 'functions') return 'function';
  if (directoryName === 'triggers') return 'procedure';
  if (directoryName === 'synonyms') return 'synonym';
  return directoryName.replace(/s$/, '');
}

function objectScore(record) {
  const server = String(record.server || '').toLowerCase();
  const pathServer = String(record.pathServer || '').toLowerCase();
  const dateScore = Date.parse(record.metadata.extracted_at || record.metadata.extractedAt || '') || 0;
  let score = dateScore;
  if (server && server !== 'unknown') score += 10_000_000_000_000;
  if (pathServer && pathServer !== 'unknown') score += 1_000_000_000_000;
  if (!pathServer.includes('_inst')) score += 100_000_000_000;
  return score;
}

function unique(values = []) {
  const seen = new Set();
  const out = [];
  for (const value of values) {
    const text = String(value || '').trim();
    if (!text) continue;
    const key = text.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(text);
  }
  return out;
}

function isDirectSqlReference(reference) {
  return MarkdownGenerator.splitSqlReferences([reference]).direct.length > 0;
}

function stripAliasSuffix(reference) {
  return String(reference || '').replace(/\s+(?:AS\s+)?[A-Za-z_][A-Za-z0-9_]*$/i, '').trim();
}

function splitSqlReference(reference) {
  const cleaned = cleanSegment(stripAliasSuffix(reference));
  return cleaned.split('.').filter(Boolean);
}

function makeSqlId(server, database, schema, name) {
  return [server, canonicalDatabase(database), schema || 'dbo', name].filter(Boolean).join('.');
}

function buildReferenceIndex(records) {
  const index = new Map();

  function add(key, id) {
    const normalized = String(key || '').toLowerCase();
    if (!normalized) return;
    if (!index.has(normalized)) index.set(normalized, new Set());
    index.get(normalized).add(id);
  }

  for (const record of records.values()) {
    add(record.id, record.id);
    add(`${record.database}.${record.schema}.${record.name}`, record.id);
    add(`${record.schema}.${record.name}`, record.id);
    add(record.name, record.id);
  }

  return index;
}

function chooseIndexedReference(candidates, context) {
  if (!candidates || candidates.size === 0) return '';
  const list = Array.from(candidates);
  if (list.length === 1) return list[0];
  const contextServer = String(context.server || '').toLowerCase();
  const contextDatabase = String(context.database || '').toLowerCase();

  const scored = list.map((id) => {
    const parts = id.split('.');
    let score = 0;
    if (parts[0]?.toLowerCase() === contextServer) score += 3;
    if (parts[1]?.toLowerCase() === contextDatabase) score += 2;
    return { id, score };
  });
  scored.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
  return scored[0]?.id || '';
}

function qualifyReference(reference, context, aliases, referenceIndex) {
  const parts = splitSqlReference(reference);
  if (parts.length === 0) return '';

  let server = context.server;
  let database = context.database;
  let schema = context.schema || 'dbo';
  let name = '';

  if (parts.length >= 4) {
    server = canonicalServer(parts[0], parts[1], aliases);
    database = canonicalDatabase(parts[1]);
    schema = parts[2];
    name = parts.slice(3).join('.');
  } else if (parts.length === 3) {
    database = canonicalDatabase(parts[0]);
    server = canonicalServer(context.server, database, aliases);
    schema = parts[1];
    name = parts[2];
  } else if (parts.length === 2) {
    schema = parts[0];
    name = parts[1];
  } else {
    name = parts[0];
  }

  if (!name) return '';
  const qualified = makeSqlId(server, database, schema, name);
  const lookupKeys = [
    qualified,
    `${database}.${schema}.${name}`,
    `${schema}.${name}`,
    name,
  ];

  for (const key of lookupKeys) {
    const resolved = chooseIndexedReference(referenceIndex.get(key.toLowerCase()), {
      server,
      database,
    });
    if (resolved) return resolved;
  }

  return qualified;
}

function normalizeReferenceList(references, context, aliases, referenceIndex) {
  return unique(
    references
      .filter(isDirectSqlReference)
      .map((ref) => qualifyReference(ref, context, aliases, referenceIndex))
      .filter(isDirectSqlReference)
  );
}

function extractPackageIdentityFromXml(xmlText, fallbackPackageName) {
  const match = String(xmlText || '').match(/<DTS:Executable\b[^>]*\bDTS:ObjectName="([^"]+)"/i);
  const objectName = match?.[1] || fallbackPackageName.replace(/\.dtsx$/i, '');
  return objectName.toLowerCase().endsWith('.dtsx') ? objectName : `${objectName}.dtsx`;
}

function inferSsisFileParts(filePath, xmlText, existingCatalog = new Map()) {
  const baseName = path.basename(filePath, '.xml').replace(/^\d+_/, '');
  const withoutExt = baseName.replace(/\.dtsx$/i, '');
  const packageName = extractPackageIdentityFromXml(xmlText, withoutExt);
  const catalogMatch = chooseExistingPackageCatalogRow(packageName, withoutExt, existingCatalog);
  if (catalogMatch) {
    const folder = catalogMatch.folder_name || 'unknown_folder';
    let project = catalogMatch.project_name || 'unknown_project';
    if (project.toLowerCase() === folder.toLowerCase()) project = folder;
    return {
      folder,
      project,
      packageName: catalogMatch.package_name || packageName,
    };
  }

  const packageStem = packageName.replace(/\.dtsx$/i, '');
  const baseLower = withoutExt.toLowerCase();
  const packageStemLower = packageStem.toLowerCase();
  let project = withoutExt;
  if (baseLower.endsWith(`_${packageStemLower}`)) {
    project = withoutExt.slice(0, -packageStem.length - 1);
  } else {
    const parts = withoutExt.split('_').filter(Boolean);
    project = parts[0] || 'unknown_project';
  }
  const folder = project;
  return { folder, project, packageName };
}

async function loadExistingSsisCatalog() {
  const existing = new Map();
  const files = await listFiles(
    OUTPUT_SERVERS_ROOT,
    (filePath) =>
      filePath.toLowerCase().endsWith('.md') &&
      filePath.toLowerCase().includes(`${path.sep}ssis_packages${path.sep}`)
  );

  for (const filePath of files) {
    try {
      const { metadata } = parseMarkdownFileContent(await fs.readFile(filePath, 'utf8'), filePath);
      const packageName = metadata.package_name || metadata.packageName;
      if (!packageName) continue;
      const key = String(packageName).toLowerCase();
      if (!existing.has(key)) existing.set(key, []);
      existing.get(key).push({
        folder_name: metadata.folder_name || metadata.folderName || '',
        project_name: metadata.project_name || metadata.projectName || '',
        package_name: packageName,
        package_path: metadata.package_path || metadata.packagePath || '',
      });
    } catch {
      // Existing package markdown is only an identity hint. Skip malformed hints.
    }
  }

  return existing;
}

function chooseExistingPackageCatalogRow(packageName, rawBaseName, existingCatalog) {
  const candidates = existingCatalog.get(String(packageName || '').toLowerCase()) || [];
  if (candidates.length === 0) return null;
  const rawToken = cleanPackageToken(rawBaseName);
  const packageToken = cleanPackageToken(packageName);

  const scored = candidates.map((candidate) => {
    const folderToken = cleanPackageToken(candidate.folder_name);
    const projectToken = cleanPackageToken(candidate.project_name);
    const pathToken = cleanPackageToken(candidate.package_path);
    let score = 0;
    if (folderToken && rawToken.includes(folderToken)) score += 2;
    if (projectToken && rawToken.includes(projectToken)) score += 3;
    if (pathToken && rawToken.includes(pathToken.replace(packageToken, ''))) score += 1;
    if (candidate.folder_name && candidate.folder_name !== 'unknown_folder') score += 1;
    if (candidate.project_name && candidate.project_name !== 'unknown_project') score += 1;
    if (candidate.package_name && candidate.package_name !== 'Package.dtsx') score += 1;
    return { candidate, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.candidate || candidates[0];
}

function cleanPackageToken(value) {
  return String(value || '')
    .replace(/\.dtsx$/i, '')
    .replace(/[^a-z0-9]+/gi, '')
    .toLowerCase();
}

function packageId(server, folder, project, pkg) {
  return [server, 'SSISDB', folder, project, pkg].join('.');
}

function parseSqlId(id) {
  const parts = String(id || '').split('.').filter(Boolean);
  if (parts.length < 4) return null;
  return {
    server: parts[0],
    database: parts[1],
    schema: parts[2],
    name: parts.slice(3).join('.'),
  };
}

function lineageTokens(value) {
  const withCamelBreaks = String(value || '').replace(/([a-z])([A-Z])/g, '$1_$2');
  const stop = new Set([
    'tbl',
    'table',
    'view',
    'vw',
    'stg',
    'stage',
    'staging',
    'etl',
    'wrk',
    'merge',
    'load',
    'insert',
    'update',
    'delete',
    'fact',
    'dim',
    'dbo',
  ]);
  return new Set(
    withCamelBreaks
      .toLowerCase()
      .split(/[^a-z0-9]+/g)
      .map((token) => (token.length > 3 && token.endsWith('s') ? token.slice(0, -1) : token))
      .filter((token) => token.length > 2 && !stop.has(token))
  );
}

function intersectionSize(left, right) {
  let count = 0;
  for (const token of left) {
    if (right.has(token)) count += 1;
  }
  return count;
}

function lineageRolePenalty(name, intentTokens) {
  const normalized = String(name || '').toLowerCase();
  const wantsError = intentTokens?.has('err') || intentTokens?.has('error');
  const wantsStage =
    intentTokens?.has('stg') || intentTokens?.has('stage') || intentTokens?.has('staging');

  let penalty = 0;
  if (!wantsError && /(^|[_\W])(err|error)([_\W]|$)/i.test(normalized)) penalty += 6;
  if (!wantsStage && /(^|[_\W])(stg|stage|staging)([_\W]|$)/i.test(normalized)) penalty += 4;
  if (/^tmp[_\W]|[_\W]tmp[_\W]|[_\W]temp[_\W]/i.test(normalized)) penalty += 3;
  return penalty;
}

function normalizeSsisReference(value, aliases, referenceIndex) {
  const cleaned = cleanSegment(value);
  if (!cleaned || cleaned === 'UNKNOWN' || cleaned === 'UNRESOLVED_DYNAMIC_EDGE') return '';
  const parts = cleaned.split('.').filter(Boolean);

  if (parts.length >= 5 && parts[1]?.toLowerCase() === 'ssisdb') {
    return cleaned;
  }

  if (parts.length >= 4) {
    const database = canonicalDatabase(parts[1]);
    const server = canonicalServer(parts[0], database, aliases);
    const schema = parts[2] || 'dbo';
    const name = parts.slice(3).join('.');
    return qualifyReference(makeSqlId(server, database, schema, name), {
      server,
      database,
      schema,
    }, aliases, referenceIndex);
  }

  return cleaned;
}

function buildSsisMarkdown(result, packageRow, server, aliases, referenceIndex) {
  const folder = packageRow.folder_name || 'unknown_folder';
  const project = packageRow.project_name || 'unknown_project';
  const pkg = packageRow.package_name || 'unknown_package.dtsx';
  const id = packageId(server, folder, project, pkg);
  const keys = new Set(
    [pkg, id, `${project}.${pkg}`, `${folder}.${project}.${pkg}`]
      .map((value) => String(value || '').toLowerCase())
      .filter(Boolean)
  );
  const packageEdges = (result.lineageEdges || []).filter((edge) =>
    [edge.packageName, edge.from, edge.packageId, edge.packagePath, edge.objectName]
      .map((value) => String(value || '').toLowerCase())
      .some((key) => keys.has(key))
  );

  const refsFor = (edgeTypes) =>
    unique(
      packageEdges
        .filter((edge) => edgeTypes.includes(edge.edgeType))
        .map((edge) => normalizeSsisReference(edge.to, aliases, referenceIndex))
        .filter(Boolean)
    );

  const readsFrom = refsFor(['READS_FROM', 'LOOKUP', 'USES_LOOKUP', 'EXTRACTS']);
  const writesTo = refsFor(['WRITES_TO']);
  const calls = refsFor(['CALLS']);

  const frontmatter = {
    id,
    name: `${folder}.${project}.${pkg}`,
    server,
    folder_name: folder,
    project_name: project,
    package_name: pkg,
    package_path: `${folder}.${project}.${pkg}`,
    database: 'ssisdb',
    type: 'package',
    owner: 'ssis-platform',
    sensitivity: 'internal',
    tags: ['ssis', 'catalog', 'lineage'],
    depends_on: readsFrom,
    reads_from: readsFrom,
    writes_to: writesTo,
    calls,
    lineage_quality: {
      validated_edges: packageEdges.filter((edge) => edge.validation_status === 'validated').length,
      probable_edges: packageEdges.filter((edge) => edge.validation_status === 'probable').length,
      unresolved_facts: packageEdges.filter(
        (edge) => edge.validation_status === 'unresolved' || edge.edgeType === 'UNRESOLVED_DYNAMIC_EDGE'
      ).length,
    },
    description: `SSIS package metadata extracted from folder ${folder}, project ${project}, package ${pkg}.`,
  };

  const body = `# SSIS Package ${folder}.${project}.${pkg}

## Identity
- Folder: ${folder}
- Project: ${project}
- Package: ${pkg}
- Entry Point: ${packageRow.entry_point ? 'Yes' : 'No'}

## Runtime Summary
- Detected lineage edges: ${packageEdges.length}
- Upstream entities: ${readsFrom.length}
- SPs Called: ${calls.length}
- Target entities: ${writesTo.length}
- Last validation: ${packageRow.package_last_validation || 'n/a'}

## Extraction Notes
- Generated by scripts/rebuild-catalog-from-raw.mjs from raw SSIS XML.
`;

  return { id, frontmatter, content: `${renderFrontmatter(frontmatter)}${body}` };
}

function buildSsisSummary(result, server) {
  const lines = (result.lineageEdges || []).slice(0, 500).map((edge) => {
    return `- ${edge.from || 'UNKNOWN'} -> ${edge.to || 'UNKNOWN'} (type=${edge.edgeType || 'ETL'}, confidence=${edge.confidence ?? 'n/a'}, via=${edge.via || 'n/a'})`;
  });
  return `---
name: ssis_catalog_lineage
server: ${server}
database: ssisdb
type: dataset
owner: ssis-platform
sensitivity: internal
tags: ['ssis', 'lineage', 'operational']
depends_on: []
description: Consolidated SSIS lineage edges rebuilt from raw SSIS XML.
---

# SSIS Catalog Lineage Summary

## Overview
- Extracted At: ${result.extractedAt}
- SSISDB Present: ${result.ssisdbPresent ? 'Yes' : 'No'}
- Total Edges: ${(result.lineageEdges || []).length}

## Top Lineage Edges
${lines.length ? lines.join('\n') : '- No edges generated.'}
`;
}

async function loadSqlRawObjects(aliases) {
  const files = await listFiles(
    RAW_SQL_ROOT,
    (filePath) => filePath.toLowerCase().endsWith('.md')
  );
  const candidates = new Map();
  let skipped = 0;

  for (const filePath of files) {
    const relParts = path.relative(RAW_SQL_ROOT, filePath).split(path.sep);
    const dbIndex = relParts.findIndex((part) => part === 'databases');
    const kind = relParts[dbIndex + 2];
    if (dbIndex < 0 || !SQL_OBJECT_DIRS.has(kind)) {
      skipped += 1;
      continue;
    }

    try {
      const { metadata, body } = parseMarkdownFileContent(await fs.readFile(filePath, 'utf8'), filePath);
      const database = canonicalDatabase(metadata.database || relParts[dbIndex + 1]);
      const server = canonicalServer(metadata.server || relParts[0], database, aliases);
      const schema = cleanSegment(metadata.schema || path.basename(filePath, '.md').split('__')[0] || 'dbo');
      const name = cleanSegment(metadata.name || path.basename(filePath, '.md').split('__').slice(1).join('__'));
      const type = typeFromDirectory(kind);
      const id = makeSqlId(server, database, schema, name);
      const record = {
        id,
        server,
        pathServer: relParts[0],
        database,
        schema,
        name,
        type,
        kind,
        metadata,
        body,
        definition: extractDefinition(body),
        sourcePath: filePath,
      };
      const key = id.toLowerCase();
      const existing = candidates.get(key);
      if (!existing || objectScore(record) > objectScore(existing)) {
        candidates.set(key, record);
      }
    } catch (err) {
      skipped += 1;
      console.warn(`[raw-sql] skipped ${filePath}: ${err.message}`);
    }
  }

  return { records: candidates, skipped };
}

function rewriteSqlLineage(records, aliases) {
  const referenceIndex = buildReferenceIndex(records);

  for (const record of records.values()) {
    const context = {
      server: record.server,
      database: record.database,
      schema: record.schema,
    };

    const existingContextual = normalizeReferenceList(
      Array.isArray(record.metadata.contextual_reads) ? record.metadata.contextual_reads : [],
      context,
      aliases,
      referenceIndex
    );

    let dependsOn = [];
    let readsFrom = [];
    let writesTo = [];
    let calls = [];

    if (record.definition && ['procedure', 'view'].includes(record.type)) {
      writesTo = normalizeReferenceList(
        MarkdownGenerator.extractWriteTargets(record.definition),
        context,
        aliases,
        referenceIndex
      );
      readsFrom = normalizeReferenceList(
        MarkdownGenerator.excludeWriteTargets(
          MarkdownGenerator.extractReadSources(record.definition),
          writesTo
        ),
        context,
        aliases,
        referenceIndex
      );
      calls = normalizeReferenceList(
        MarkdownGenerator.extractProcedureCalls(record.definition),
        context,
        aliases,
        referenceIndex
      );
      dependsOn = unique([...readsFrom, ...calls]);
    } else if (record.type === 'function' || record.kind === 'triggers') {
      dependsOn = normalizeReferenceList(
        Array.isArray(record.metadata.depends_on) ? record.metadata.depends_on : [],
        context,
        aliases,
        referenceIndex
      );
      readsFrom = dependsOn;
    } else if (record.type === 'synonym') {
      dependsOn = normalizeReferenceList(
        Array.isArray(record.metadata.depends_on) ? record.metadata.depends_on : [],
        context,
        aliases,
        referenceIndex
      );
    }

    record.frontmatter = {
      id: record.id,
      name: record.name,
      server: record.server,
      database: record.database,
      type: record.type,
      schema: record.schema,
      owner: record.metadata.owner || 'Data Team',
      sensitivity: record.metadata.sensitivity || 'internal',
      tags: Array.isArray(record.metadata.tags) ? record.metadata.tags : ['auto-extracted'],
      depends_on: record.type === 'table' ? [] : dependsOn,
      reads_from: readsFrom,
      writes_to: writesTo,
      calls,
      created_by: [],
      created_via: [],
      used_by: [],
      contextual_reads: existingContextual,
      lineage_status: record.type === 'table' ? 'external_or_unresolved' : '',
      external_source: Boolean(record.metadata.external_source),
      lineage_quality: {
        validated_edges: dependsOn.length + writesTo.length + calls.length,
        probable_edges: 0,
        unresolved_facts: 0,
      },
      row_count: record.metadata.row_count || 0,
      size_kb: record.metadata.size_kb || 0,
      column_count: record.metadata.column_count || 0,
      index_count: record.metadata.index_count || 0,
      check_constraint_count: record.metadata.check_constraint_count || 0,
      extraction_warnings: Array.isArray(record.metadata.extraction_warnings)
        ? record.metadata.extraction_warnings
        : [],
      extracted_at: new Date().toISOString(),
    };
  }

  return referenceIndex;
}

function applyForwardSqlEdges(records, referenceIndex) {
  for (const record of records.values()) {
    const fm = record.frontmatter;

    for (const targetId of fm.writes_to || []) {
      const target = records.get(targetId.toLowerCase());
      if (!target || target.type !== 'table') continue;
      target.frontmatter.created_by = unique([...(target.frontmatter.created_by || []), record.id]);
      target.frontmatter.depends_on = unique([...(target.frontmatter.depends_on || []), record.id]);
      target.frontmatter.lineage_status = 'creator_found';
    }

    for (const sourceId of fm.reads_from || []) {
      const source = records.get(sourceId.toLowerCase());
      if (!source || source.type !== 'table') continue;
      source.frontmatter.used_by = unique([...(source.frontmatter.used_by || []), record.id]);
    }
  }

  return referenceIndex;
}

async function rebuildSsis(aliases, referenceIndex, records, existingSsisCatalog) {
  const xmlFiles = await listFiles(
    RAW_SSIS_XML_ROOT,
    (filePath) => filePath.toLowerCase().endsWith('.dtsx.xml')
  );
  const server = 'V1-SSIS25-01, 11040';
  const catalog = [];
  const xmlMetadata = [];
  let skipped = 0;

  for (const filePath of xmlFiles) {
    try {
      const xmlText = await fs.readFile(filePath, 'utf8');
      const { folder, project, packageName } = inferSsisFileParts(
        filePath,
        xmlText,
        existingSsisCatalog
      );
      const row = {
        folder_name: folder,
        project_name: project,
        package_name: packageName,
        entry_point: /master/i.test(packageName),
        package_last_validation: null,
      };
      catalog.push(row);
      const parsed = parseSsisPackageXmlForLineage(xmlText, {
        objectName: packageName,
        packageName,
        projectName: project,
      });
      if (parsed) xmlMetadata.push(parsed);
    } catch (err) {
      skipped += 1;
      console.warn(`[raw-ssis] skipped ${filePath}: ${err.message}`);
    }
  }

  const extractor = new SsisMetadataExtractor({ server });
  const result = {
    extractedAt: new Date().toISOString(),
    ssisdbPresent: true,
    catalog,
    xmlMetadata,
    agentJobs: { jobs: [], ssisSteps: [] },
    warnings: [],
  };
  result.lineageEdges = extractor.buildLineageEdges(catalog, xmlMetadata, result.agentJobs, [], {});

  const markdowns = catalog.map((row) => buildSsisMarkdown(result, row, server, aliases, referenceIndex));
  for (const md of markdowns) {
    records.set(md.id.toLowerCase(), {
      id: md.id,
      type: 'package',
      frontmatter: md.frontmatter,
      content: md.content,
      server,
      database: 'ssisdb',
      schema: '',
      name: md.frontmatter.package_name,
    });
  }

  for (const md of markdowns) {
    for (const targetId of md.frontmatter.writes_to || []) {
      const target = records.get(targetId.toLowerCase());
      if (!target || target.type !== 'table') continue;
      target.frontmatter.created_via = unique([...(target.frontmatter.created_via || []), md.id]);
      if (target.frontmatter.lineage_status !== 'creator_found') {
        target.frontmatter.lineage_status = 'creator_found';
      }
    }
  }

  return {
    server,
    result,
    packageCount: catalog.length,
    edgeCount: result.lineageEdges.length,
    skipped,
  };
}

function applySsisBridgeInferences(records) {
  const tables = Array.from(records.values()).filter((record) => record.type === 'table');
  let inferred = 0;

  for (const pkg of records.values()) {
    if (pkg.type !== 'package') continue;
    const writes = Array.isArray(pkg.frontmatter?.writes_to) ? pkg.frontmatter.writes_to : [];
    const calls = Array.isArray(pkg.frontmatter?.calls) ? pkg.frontmatter.calls : [];
    const stageWrites = writes
      .map((ref) => ({ ref, parsed: parseSqlId(ref), record: records.get(String(ref).toLowerCase()) }))
      .filter(({ parsed }) => {
        const db = parsed?.database?.toLowerCase();
        return db === 'stagingdb' || db === 'etl_staging' || db?.includes('staging');
      });

    if (stageWrites.length === 0 || calls.length === 0) continue;

    for (const call of calls) {
      const parsedCall = parseSqlId(call);
      const callDb = parsedCall?.database?.toLowerCase();
      if (!parsedCall || !['vendordata', 'etl_staging', 'sonic_dw'].includes(callDb)) continue;
      const procTokens = lineageTokens(parsedCall.name);
      if (procTokens.size < 2) continue;

      for (const stage of stageWrites) {
        const stageTokens = lineageTokens(stage.parsed?.name || stage.ref);
        if (intersectionSize(procTokens, stageTokens) < 2) continue;

        const candidates = tables
          .filter((table) => {
            const dbMatch = table.database.toLowerCase() === callDb;
            const schemaMatch =
              !parsedCall.schema ||
              !table.schema ||
              table.schema.toLowerCase() === parsedCall.schema.toLowerCase();
            return dbMatch && schemaMatch;
          })
          .map((table) => {
            const tableTokens = lineageTokens(table.name);
            const baseScore =
              intersectionSize(tableTokens, procTokens) +
              intersectionSize(tableTokens, stageTokens);
            return {
              table,
              score: baseScore - lineageRolePenalty(table.name, procTokens),
              baseScore,
            };
          })
          .filter(({ baseScore }) => baseScore >= 4)
          .sort((a, b) => b.score - a.score || a.table.name.localeCompare(b.table.name));

        const target = candidates[0]?.table;
        if (!target || target.id.toLowerCase() === stage.ref.toLowerCase()) continue;

        target.frontmatter.created_by = unique([...(target.frontmatter.created_by || []), stage.ref]);
        target.frontmatter.created_via = unique([...(target.frontmatter.created_via || []), pkg.id]);
        target.frontmatter.depends_on = unique([...(target.frontmatter.depends_on || []), stage.ref]);
        target.frontmatter.lineage_status = 'creator_found';

        if (stage.record?.frontmatter) {
          stage.record.frontmatter.used_by = unique([
            ...(stage.record.frontmatter.used_by || []),
            target.id,
          ]);
        }
        inferred += 1;
      }
    }
  }

  return inferred;
}

async function backupExistingServers() {
  if (process.argv.includes('--in-place')) {
    return null;
  }

  try {
    await fs.access(OUTPUT_SERVERS_ROOT);
  } catch {
    return null;
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupRoot = path.join(OUTPUT_ROOT, '_rebuild_backups');
  const backupPath = path.join(backupRoot, `servers_${timestamp}`);
  await fs.mkdir(backupRoot, { recursive: true });
  try {
    await fs.rename(OUTPUT_SERVERS_ROOT, backupPath);
    return backupPath;
  } catch (err) {
    if (process.argv.includes('--clean')) {
      try {
        await fs.rm(OUTPUT_SERVERS_ROOT, { recursive: true, force: true });
        console.warn(
          `[rebuild] could not move existing servers folder for backup (${err.code || err.message}); removed it for clean rebuild`
        );
        return null;
      } catch (removeErr) {
        console.warn(
          `[rebuild] clean remove failed (${removeErr.code || removeErr.message}); rebuilding in place`
        );
        return null;
      }
    }

    console.warn(
      `[rebuild] could not move existing servers folder for backup (${err.code || err.message}); rebuilding in place`
    );
    return null;
  }
}

async function writeRecords(records, ssisSummary) {
  await fs.mkdir(OUTPUT_SERVERS_ROOT, { recursive: true });
  let filesWritten = 0;
  const generatedFiles = [];

  for (const record of records.values()) {
    let outputPath;
    if (record.type === 'package') {
      outputPath = path.join(
        OUTPUT_SERVERS_ROOT,
        sanitizePathSegment(record.server),
        'ssis_packages',
        sanitizePathSegment(record.frontmatter.folder_name),
        sanitizePathSegment(record.frontmatter.project_name),
        `${sanitizePathSegment(record.frontmatter.package_name)}.md`
      );
    } else {
      outputPath = path.join(
        OUTPUT_SERVERS_ROOT,
        sanitizePathSegment(record.server),
        'databases',
        sanitizePathSegment(record.database),
        record.kind || `${record.type}s`,
        `${sanitizePathSegment(record.schema)}__${sanitizePathSegment(record.name)}.md`
      );
    }

    const content = record.content || `${renderFrontmatter(record.frontmatter)}${record.body || ''}`;
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, content, 'utf8');
    generatedFiles.push(manifestPath(outputPath));
    filesWritten += 1;
  }

  if (ssisSummary) {
    const summaryPath = path.join(
      OUTPUT_SERVERS_ROOT,
      sanitizePathSegment(ssisSummary.server),
      'ssis_summaries',
      'ssis_catalog_lineage.md'
    );
    await fs.mkdir(path.dirname(summaryPath), { recursive: true });
    await fs.writeFile(summaryPath, buildSsisSummary(ssisSummary.result, ssisSummary.server), 'utf8');
    generatedFiles.push(manifestPath(summaryPath));
    filesWritten += 1;
  }

  const manifest = {
    generated_at: new Date().toISOString(),
    generator: 'scripts/rebuild-catalog-from-raw.mjs',
    files: generatedFiles.sort(),
  };
  await fs.writeFile(CATALOG_MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

  return { filesWritten, manifestFiles: generatedFiles.length };
}

async function validateOutput() {
  const objects = await loadAllMarkdown(OUTPUT_ROOT);
  const invalid = [];
  for (const object of objects.values()) {
    const errors = validateMetadata(object);
    if (errors.length > 0) {
      invalid.push({ id: object.id, errors });
    }
  }
  return { objectCount: objects.size, invalid };
}

async function main() {
  const aliases = await readJsonIfExists(ALIAS_CONFIG_PATH, {});
  const existingSsisCatalog = await loadExistingSsisCatalog();
  const backupPath = await backupExistingServers();
  const { records, skipped: skippedSql } = await loadSqlRawObjects(aliases);
  const referenceIndex = rewriteSqlLineage(records, aliases);
  applyForwardSqlEdges(records, referenceIndex);
  const ssisSummary = await rebuildSsis(aliases, referenceIndex, records, existingSsisCatalog);
  const inferredSsisBridges = applySsisBridgeInferences(records);
  const writeSummary = await writeRecords(records, ssisSummary);
  const validation = await validateOutput();

  const summary = {
    backupPath,
    sqlObjects: Array.from(records.values()).filter((record) => record.type !== 'package').length,
    ssisPackages: ssisSummary.packageCount,
    ssisEdges: ssisSummary.edgeCount,
    skippedSql,
    skippedSsis: ssisSummary.skipped,
    inferredSsisBridges,
    filesWritten: writeSummary.filesWritten,
    manifestFiles: writeSummary.manifestFiles,
    loadedObjects: validation.objectCount,
    invalidObjects: validation.invalid.length,
    invalidSample: validation.invalid.slice(0, 10),
  };

  console.log(JSON.stringify(summary, null, 2));
  if (validation.invalid.length > 0) {
    process.exitCode = 1;
  }
}

await main();
