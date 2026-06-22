import { promises as fs } from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import yaml from 'yaml';
import MarkdownGenerator from '../src/services/markdownFromSqlServer.js';
import { applyDictionaryEnrichmentContract } from '../src/services/markdownEnrichmentContract.js';
import {
  SsisMetadataExtractor,
  buildSsisExternalObjectId,
  parseSsisPackageXmlForLineage,
} from '../src/services/ssisExtractor.js';
import {
  getMarkdownFiles,
  parseMarkdownMetadataFile,
  validateMetadata,
} from '../src/services/markdownService.js';
import { resolveColumnLineage } from '../src/services/columnLineageResolver.js';
import {
  classifyReadRole,
  classifyWriteOperation,
} from '../src/services/semanticLineageService.js';

const ROOT = process.cwd();
const RAW_SQL_ROOT = path.join(ROOT, 'data', 'analysis', 'raw', 'sqlserver', 'servers');
const RAW_SSIS_XML_ROOT = path.join(ROOT, 'data', 'analysis', 'raw', 'ssis', 'xml');
const RAW_SSIS_METADATA_PATH = path.join(ROOT, 'data', 'analysis', 'raw', 'ssis', 'ssis-metadata.json');
const OUTPUT_ROOT = path.join(ROOT, 'data', 'markdown');
const OUTPUT_SERVERS_ROOT = path.join(OUTPUT_ROOT, 'servers');
const CATALOG_MANIFEST_PATH = path.join(OUTPUT_ROOT, 'catalog-manifest.json');
const REBUILD_REPORT_JSON_PATH = path.join(OUTPUT_ROOT, 'rebuild-report.json');
const REBUILD_REPORT_MARKDOWN_PATH = path.join(OUTPUT_ROOT, 'rebuild-report.md');
const ALIAS_CONFIG_PATH = path.join(ROOT, 'config', 'lineage-aliases.json');
const SSIS_COLUMN_MAPPING_EMBED_LIMIT = 25;
const SSIS_COLUMN_MAPPING_CHUNK_SIZE = 250;
const COLUMN_LINEAGE_EMBED_LIMIT = 200;
const UNRESOLVED_COLUMN_LINEAGE_EMBED_LIMIT = 75;
const MARKDOWN_FRONTMATTER_READ_CHUNK_BYTES = 64 * 1024;
const MARKDOWN_FRONTMATTER_MAX_READ_BYTES = 8 * 1024 * 1024;
const SSIS_READ_EDGE_TYPES = new Set(['READS_FROM', 'LOOKUP', 'USES_LOOKUP', 'EXTRACTS']);
const SSIS_WRITE_EDGE_TYPES = new Set(['WRITES_TO']);
const SSIS_CALL_EDGE_TYPES = new Set(['CALLS']);
const DEBUG_REBUILD = process.env.REBUILD_DEBUG === '1';
const ENFORCE_REBUILD_GATES = process.argv.includes('--enforce-gates');
const DRY_RUN_REBUILD = process.argv.includes('--dry-run');
const USE_LIVE_SSIS_METADATA =
  process.argv.includes('--use-live-ssis-metadata') || process.env.USE_LIVE_SSIS_METADATA === '1';
const SSIS_REBUILD_LIMIT = readPositiveIntegerOption('--ssis-limit', 'REBUILD_SSIS_LIMIT');
const DEFAULT_REBUILD_GATES = {
  maxInvalidObjects: 0,
  maxMissingConfidenceObjects: 0,
  maxLowNeedsReviewRatio: 0.05,
  minAverageConfidence: 0.72,
  maxUnresolvedFactRatio: 0.5,
  maxSsisEdgeDropRatio: 0.1,
  maxNewSourceLowNeedsReviewRatio: 0.2,
  minNewSourceAverageConfidence: 0.75,
  minNewSourceObjectsForGate: 10,
};

const SQL_OBJECT_DIRS = new Set([
  'tables',
  'views',
  'stored_procedures',
  'functions',
  'triggers',
  'synonyms',
]);
const RAW_SCAN_SKIP_DIRS = new Set(['_quarantine', '_runtime', '_drafts', '_rebuild_backups']);
const QUARANTINED_SQL_SAMPLE_LIMIT = 25;

const DB_CASE = new Map([
  ['dbsonicdw', 'Sonic_DW'],
  ['etl_staging', 'ETL_Staging'],
  ['sonic_dw', 'Sonic_DW'],
  ['sonicdw', 'Sonic_DW'],
  ['stagingdb', 'StagingDB'],
  ['vendordata', 'VendorData'],
  ['ssisdb', 'SSISDB'],
]);

const EXTERNAL_SSIS_COMPONENT_PATTERNS = [
  /FlatFile/i,
  /Excel/i,
  /Raw/i,
  /XML/i,
  /SharePoint/i,
  /Access/i,
  /Recordset/i,
];

function readPositiveIntegerOption(flagName, envName = '') {
  const equalsPrefix = `${flagName}=`;
  const equalsArg = process.argv.find((arg) => arg.startsWith(equalsPrefix));
  const flagIndex = process.argv.indexOf(flagName);
  const rawValue =
    equalsArg?.slice(equalsPrefix.length) ||
    (flagIndex >= 0 ? process.argv[flagIndex + 1] : '') ||
    (envName ? process.env[envName] : '');
  const value = Number(rawValue);
  return Number.isInteger(value) && value > 0 ? value : 0;
}

function memoryUsageMb() {
  const usage = process.memoryUsage();
  return {
    rss: Math.round(usage.rss / 1024 / 1024),
    heapTotal: Math.round(usage.heapTotal / 1024 / 1024),
    heapUsed: Math.round(usage.heapUsed / 1024 / 1024),
    external: Math.round(usage.external / 1024 / 1024),
    arrayBuffers: Math.round(usage.arrayBuffers / 1024 / 1024),
  };
}

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

function logRebuildPhase(message) {
  if (DEBUG_REBUILD) {
    console.error(`[rebuild] ${message}`);
  }
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

  const linkedServerAliases = aliases.linkedServerAliases || {};
  for (const [alias, canonical] of Object.entries(linkedServerAliases)) {
    if (cleaned.toLowerCase() === cleanSegment(alias).toLowerCase()) {
      return canonical;
    }
  }

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

function isUnknownServer(value) {
  const cleaned = cleanSegment(value).toLowerCase();
  return !cleaned || cleaned === 'unknown' || cleaned === 'unknown_server';
}

function recordSqlRawQuarantine(quarantined, record) {
  quarantined.count += 1;
  if (quarantined.sample.length < QUARANTINED_SQL_SAMPLE_LIMIT) {
    quarantined.sample.push(record);
  }
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

async function readMarkdownBodyContent(filePath) {
  const { body } = parseMarkdownFileContent(await fs.readFile(filePath, 'utf8'), filePath);
  return body;
}

async function readMarkdownFrontmatterContent(filePath) {
  const chunks = [];
  const buffer = Buffer.alloc(MARKDOWN_FRONTMATTER_READ_CHUNK_BYTES);
  let bytesReadTotal = 0;
  let handle;

  try {
    handle = await fs.open(filePath, 'r');

    while (bytesReadTotal < MARKDOWN_FRONTMATTER_MAX_READ_BYTES) {
      const { bytesRead } = await handle.read(buffer, 0, buffer.length, bytesReadTotal);
      if (bytesRead === 0) break;

      chunks.push(Buffer.from(buffer.subarray(0, bytesRead)));
      bytesReadTotal += bytesRead;

      const content = Buffer.concat(chunks).toString('utf8').replace(/^\uFEFF/, '');
      if (!content.startsWith('---')) return content;

      const match = content.match(/^---\r?\n[\s\S]*?\r?\n---/);
      if (match) return match[0];
    }
  } finally {
    if (handle) await handle.close();
  }

  return fs.readFile(filePath, 'utf8');
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
        if (RAW_SCAN_SKIP_DIRS.has(entry.name)) continue;
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

function pushUniqueText(values, value) {
  const out = Array.isArray(values) ? values : [];
  const text = String(value || '').trim();
  if (!text) return out;
  const key = text.toLowerCase();

  for (const existing of out) {
    if (String(existing || '').trim().toLowerCase() === key) return out;
  }

  out.push(text);
  return out;
}

function mergeUniqueTextGroups(...groups) {
  const out = [];

  for (const group of groups) {
    for (const value of group || []) {
      pushUniqueText(out, value);
    }
  }

  return out;
}

function uniqueStructuredRecords(records = []) {
  const seen = new Set();
  const out = [];

  for (const record of records) {
    addUniqueStructuredRecord(out, seen, record);
  }
  return out;
}

function mergeUniqueStructuredRecords(...recordGroups) {
  const seen = new Set();
  const out = [];

  for (const records of recordGroups) {
    for (const record of records || []) {
      addUniqueStructuredRecord(out, seen, record);
    }
  }
  return out;
}

function structuredRecordKeyPart(value) {
  return String(value || '').toLowerCase();
}

function addUniqueStructuredRecord(out, seen, record) {
  if (!record || typeof record !== 'object') return;
  const key =
    `${structuredRecordKeyPart(record.source_column_id)}|` +
    `${structuredRecordKeyPart(record.target_column_id)}|` +
    `${structuredRecordKeyPart(record.column_id || record.object_id)}|` +
    `${structuredRecordKeyPart(record.process_id)}|` +
    `${structuredRecordKeyPart(record.package_id)}|` +
    `${structuredRecordKeyPart(record.validation_status)}|` +
    `${structuredRecordKeyPart(record.transform_type)}|` +
    `${structuredRecordKeyPart(record.flag_type)}|` +
    `${structuredRecordKeyPart(record.usage_type)}|` +
    `${structuredRecordKeyPart(record.usage_context)}|` +
    `${structuredRecordKeyPart(record.expression || record.evidence_text)}|` +
    `${structuredRecordKeyPart(record.reason)}|` +
    `${structuredRecordKeyPart(record.alias)}|` +
    structuredRecordKeyPart(record.column_name);
  if (seen.has(key)) return;
  seen.add(key);
  out.push(record);
}

function isDirectSqlReference(reference) {
  return MarkdownGenerator.splitSqlReferences([reference]).direct.length > 0;
}

function stripAliasSuffix(reference) {
  return String(reference || '').replace(/\s+(?:AS\s+)?[A-Za-z_][A-Za-z0-9_]*$/i, '').trim();
}

function splitDotSegments(value) {
  const text = String(value || '');
  const parts = [];
  let start = 0;

  for (let index = 0; index < text.length; index += 1) {
    if (text[index] !== '.') continue;
    if (index > start) parts.push(text.slice(start, index));
    start = index + 1;
  }

  if (start < text.length) parts.push(text.slice(start));
  return parts;
}

function appendDotSegment(out, value) {
  const text = String(value || '');
  if (!text) return out;
  return out ? `${out}.${text}` : text;
}

function joinDotSegments(parts, start = 0, end = parts.length) {
  let out = '';
  for (let index = start; index < end; index += 1) {
    out = appendDotSegment(out, parts[index]);
  }
  return out;
}

function fixedDotSegment(value) {
  return String(value ?? '');
}

function isIpv4Segment(value) {
  if (!/^\d{1,3}$/.test(String(value || ''))) return false;
  const number = Number(value);
  return number >= 0 && number <= 255;
}

function startsWithIpv4Parts(parts) {
  return parts.length >= 4 && parts.slice(0, 4).every(isIpv4Segment);
}

function scoreReferenceContext(value, contextServer, contextDatabase) {
  const text = String(value || '');
  const firstDot = text.indexOf('.');
  if (firstDot < 0) {
    return text.toLowerCase() === contextServer ? 3 : 0;
  }

  let score = 0;
  if (text.slice(0, firstDot).toLowerCase() === contextServer) score += 3;
  const secondStart = firstDot + 1;
  const secondDot = text.indexOf('.', secondStart);
  const secondSegment =
    secondDot < 0 ? text.slice(secondStart) : text.slice(secondStart, secondDot);
  if (secondSegment.toLowerCase() === contextDatabase) score += 2;
  return score;
}

function tailDotSegmentsMatch(parts, suffixParts) {
  if (parts.length < suffixParts.length) return false;
  const offset = parts.length - suffixParts.length;
  for (let index = 0; index < suffixParts.length; index += 1) {
    if (parts[offset + index] !== suffixParts[index]) return false;
  }
  return true;
}

function splitSqlReference(reference) {
  const cleaned = cleanSegment(stripAliasSuffix(reference));
  return splitDotSegments(cleaned);
}

function makeSqlId(server, database, schema, name) {
  let id = '';
  id = appendDotSegment(id, server);
  id = appendDotSegment(id, canonicalDatabase(database));
  id = appendDotSegment(id, schema || 'dbo');
  id = appendDotSegment(id, name);
  return id;
}

function normalizeColumnInventory(record) {
  const columns = Array.isArray(record.metadata?.columns) ? record.metadata.columns : [];
  const sourceColumns = columns.length > 0
    ? columns
    : Array.isArray(record.markdownColumns)
      ? record.markdownColumns
      : [];
  const normalized = [];

  for (const column of sourceColumns) {
    if (!column || typeof column !== 'object' || !column.name) continue;
    const dataType = column.data_type || column.dataType || '';
    normalized.push({
      name: column.name,
      column_id: column.column_id || `${record.id}.${column.name}`,
      ordinal: column.ordinal ?? normalized.length + 1,
      data_type: dataType,
      max_length: column.max_length ?? column.maxLength ?? null,
      precision: column.precision ?? null,
      scale: column.scale ?? null,
      nullable: Boolean(column.nullable ?? column.isNullable ?? false),
      identity: Boolean(column.identity ?? column.isIdentity ?? false),
      computed: Boolean(column.computed ?? column.isComputed ?? false),
      computed_definition: column.computed_definition || column.computedDefinition || null,
      default: column.default ?? column.defaultValue ?? null,
      description: column.description || '',
      primary_key: Boolean(column.primary_key ?? column.primaryKey ?? false),
      unique_keys: Array.isArray(column.unique_keys) ? column.unique_keys : [],
      foreign_keys: Array.isArray(column.foreign_keys) ? column.foreign_keys : [],
      referenced_by_foreign_keys: Array.isArray(column.referenced_by_foreign_keys)
        ? column.referenced_by_foreign_keys
        : [],
      indexes: Array.isArray(column.indexes) ? column.indexes : [],
      sensitivity: column.sensitivity || 'internal',
      classification_tags: Array.isArray(column.classification_tags)
        ? column.classification_tags
        : [],
      extraction_evidence: column.extraction_evidence || {
        source: 'raw_markdown_columns_table',
        extracted_at: record.metadata?.extracted_at || record.metadata?.extractedAt || null,
      },
    });
  }

  return normalized;
}

function parseMarkdownColumns(body, record) {
  const sectionMatch = String(body || '').match(/## Columns\s*\r?\n([\s\S]*?)(?=\r?\n## |\s*$)/i);
  if (!sectionMatch) return [];

  const rows = sectionMatch[1]
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith('|') && !/^\|\s*-+/.test(line));

  if (rows.length < 2) return [];
  const headers = splitMarkdownTableRow(rows[0]).map((header) => header.toLowerCase());
  const dataRows = rows.slice(1);
  const columnIndex = (name) => headers.findIndex((header) => header === name);
  const nameIndex = columnIndex('name');
  const typeIndex = columnIndex('type');
  const nullableIndex = columnIndex('nullable');
  const identityIndex = columnIndex('identity');
  const defaultIndex = columnIndex('default');
  const descriptionIndex = columnIndex('description');

  if (nameIndex < 0) return [];

  return dataRows
    .map((row, index) => {
      const cells = splitMarkdownTableRow(row);
      const name = cleanMarkdownCell(cells[nameIndex]);
      if (!name) return null;
      return {
        name,
        ordinal: index + 1,
        data_type: cleanMarkdownCell(cells[typeIndex]),
        nullable: markdownCellTruthy(cells[nullableIndex]),
        identity: markdownCellTruthy(cells[identityIndex]),
        default: cleanMarkdownCell(cells[defaultIndex]) || null,
        description: cleanMarkdownCell(cells[descriptionIndex]),
      };
    })
    .filter(Boolean);
}

function splitMarkdownTableRow(row) {
  return String(row || '')
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim());
}

function cleanMarkdownCell(value) {
  return String(value || '')
    .trim()
    .replace(/^`|`$/g, '')
    .replace(/&nbsp;/gi, ' ')
    .trim();
}

function markdownCellTruthy(value) {
  const cleaned = cleanMarkdownCell(value).toLowerCase();
  return cleaned === 'yes' || cleaned === 'true' || cleaned === '1' || cleaned.includes('✓') || cleaned.includes('œ“');
}

function sqlRecordForColumnUsage(record) {
  return {
    id: record.id,
    serverName: record.server,
    database: record.database,
    schema: record.schema,
    name: record.name,
    type: record.type,
    columns: Array.isArray(record.columns) ? record.columns : [],
  };
}

function buildColumnUsageMetadata(records) {
  const tables = [];
  const views = [];

  for (const record of records.values()) {
    const sqlRecord = sqlRecordForColumnUsage(record);
    if (sqlRecord.type === 'table') {
      tables.push(sqlRecord);
    } else if (sqlRecord.type === 'view') {
      views.push(sqlRecord);
    }
  }

  return {
    serverName: '',
    database: '',
    tables,
    views,
  };
}

function clearColumnUsageMetadata(columnUsageMetadata = {}) {
  if (Array.isArray(columnUsageMetadata.tables)) columnUsageMetadata.tables.length = 0;
  if (Array.isArray(columnUsageMetadata.views)) columnUsageMetadata.views.length = 0;
}

function extractColumnUsageForRecord(record, columnUsageMetadata) {
  const existingColumnUsage = Array.isArray(record.metadata.column_usage)
    ? record.metadata.column_usage
    : [];
  const existingUnresolved = Array.isArray(record.metadata.unresolved_column_usage)
    ? record.metadata.unresolved_column_usage
    : [];
  const existingRiskFlags = Array.isArray(record.metadata.column_risk_flags)
    ? record.metadata.column_risk_flags
    : [];

  if (!record.definition) {
    return {
      column_usage: existingColumnUsage,
      unresolved_column_usage: existingUnresolved,
      column_risk_flags: existingRiskFlags,
    };
  }

  const generated = MarkdownGenerator.extractSqlColumnUsage(
    record.definition,
    {
      id: record.id,
      serverName: record.server,
      database: record.database,
      schema: record.schema,
      name: record.name,
    },
    columnUsageMetadata
  );

  return {
    column_usage: mergeUniqueStructuredRecords(existingColumnUsage, generated.column_usage),
    unresolved_column_usage: mergeUniqueStructuredRecords(
      existingUnresolved,
      generated.unresolved_column_usage
    ),
    column_risk_flags: mergeUniqueStructuredRecords(existingRiskFlags, generated.column_risk_flags),
  };
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
  const contextServer = String(context.server || '').toLowerCase();
  const contextDatabase = String(context.database || '').toLowerCase();
  let bestId = '';
  let bestScore = -1;

  for (const id of candidates) {
    const score = scoreReferenceContext(id, contextServer, contextDatabase);
    if (!bestId || score > bestScore || (score === bestScore && id.localeCompare(bestId) < 0)) {
      bestId = id;
      bestScore = score;
    }
  }

  return bestId;
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
    name = joinDotSegments(parts, 3);
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
  let lookupKeys;
  if (parts.length >= 4) {
    lookupKeys = [qualified, `${database}.${schema}.${name}`];
  } else if (parts.length === 3) {
    lookupKeys = [qualified, `${database}.${schema}.${name}`];
  } else {
    lookupKeys = [qualified, `${schema}.${name}`, name];
  }

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
  const normalized = [];

  for (const ref of references) {
    if (!isDirectSqlReference(ref)) continue;
    const qualified = qualifyReference(ref, context, aliases, referenceIndex);
    if (isDirectSqlReference(qualified)) normalized.push(qualified);
  }

  return unique(normalized);
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
    project = firstNonEmptyUnderscoreSegment(withoutExt) || 'unknown_project';
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
      const { metadata } = parseMarkdownFileContent(
        await readMarkdownFrontmatterContent(filePath),
        filePath
      );
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
  let bestCandidate = candidates[0];
  let bestScore = -1;

  for (const candidate of candidates) {
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
    if (score > bestScore) {
      bestCandidate = candidate;
      bestScore = score;
    }
  }

  return bestCandidate;
}

function cleanPackageToken(value) {
  return String(value || '')
    .replace(/\.dtsx$/i, '')
    .replace(/[^a-z0-9]+/gi, '')
    .toLowerCase();
}

function firstNonEmptyUnderscoreSegment(value) {
  const text = String(value || '');
  let start = 0;

  for (let index = 0; index <= text.length; index += 1) {
    if (index < text.length && text[index] !== '_') continue;
    if (index > start) return text.slice(start, index);
    start = index + 1;
  }

  return '';
}

function packageId(server, folder, project, pkg) {
  return `${fixedDotSegment(server)}.SSISDB.${fixedDotSegment(folder)}.${fixedDotSegment(
    project
  )}.${fixedDotSegment(pkg)}`;
}

function parseSqlId(id) {
  const parts = splitDotSegments(id);
  if (parts.length < 4) return null;
  if (parts.length >= 7 && startsWithIpv4Parts(parts)) {
    return {
      server: joinDotSegments(parts, 0, 4),
      database: canonicalDatabase(parts[4]),
      schema: parts[5],
      name: joinDotSegments(parts, 6),
    };
  }
  return {
    server: parts[0],
    database: canonicalDatabase(parts[1]),
    schema: parts[2],
    name: joinDotSegments(parts, 3),
  };
}

function canonicalSqlIdFromParsedSqlId(parsed) {
  if (!parsed?.name || !parsed.database || !parsed.schema) return '';
  return makeSqlId(
    parsed.server || 'unknown',
    parsed.database,
    parsed.schema,
    parsed.name
  );
}

function sqlRawQuarantineReason({ schema = '', name = '', type = '' } = {}) {
  const schemaText = String(schema || '').trim();
  const nameText = String(name || '').trim();
  const lowerSchema = schemaText.toLowerCase();
  const lowerName = nameText.toLowerCase();
  const objectType = String(type || '').toLowerCase();

  if (/[\[\]]/.test(nameText) && !/^\[[^\]]+\]$/.test(nameText)) {
    return 'malformed_bracketed_object_name';
  }

  if (/^(dbo|wrk|stage|stg|clean|jump)\./i.test(nameText)) {
    return 'embedded_schema_token_in_object_name';
  }

  if (objectType === 'table' && ['wrrk', 'wrkk', 'stgae', 'stag'].includes(lowerSchema)) {
    return 'typo_schema_name';
  }

  if (lowerSchema === 'dbo' && /^(wrk|stage|stg|clean|jump)\./i.test(lowerName)) {
    return 'dbo_schema_with_embedded_non_dbo_name';
  }

  return '';
}

const LINEAGE_TOKEN_STOP_WORDS = new Set([
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

function lineageTokens(value) {
  const withCamelBreaks = String(value || '').replace(/([a-z])([A-Z])/g, '$1_$2');
  const tokens = new Set();

  for (const rawToken of withCamelBreaks.toLowerCase().split(/[^a-z0-9]+/g)) {
    const token =
      rawToken.length > 3 && rawToken.endsWith('s') ? rawToken.slice(0, -1) : rawToken;
    if (token.length > 2 && !LINEAGE_TOKEN_STOP_WORDS.has(token)) {
      tokens.add(token);
    }
  }

  return tokens;
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

function appendUniqueStructuredRecord(records = [], record = {}) {
  const next = Array.isArray(records) ? [...records] : [];
  const key = JSON.stringify(record);
  if (!next.some((existing) => JSON.stringify(existing) === key)) next.push(record);
  return next;
}

function normalizeSsisReference(value, aliases, referenceIndex) {
  const cleaned = cleanSegment(value);
  if (!cleaned || cleaned === 'UNKNOWN' || cleaned === 'UNRESOLVED_DYNAMIC_EDGE') return '';
  const parts = splitDotSegments(cleaned);

  if (parts.length >= 5 && parts[1]?.toLowerCase() === 'ssisdb') {
    return cleaned;
  }

  if (parts.length >= 4) {
    const parsed = parseSqlId(cleaned);
    if (!parsed?.name || !parsed.database || !parsed.schema) return cleaned;
    const database = parsed.database;
    const server = canonicalServer(parsed.server, database, aliases);
    const schema = parsed.schema || 'dbo';
    const name = parsed.name;
    return qualifyReference(makeSqlId(server, database, schema, name), {
      server,
      database,
      schema,
    }, aliases, referenceIndex);
  }

  return cleaned;
}

function lowerSsisLookupKey(value) {
  return String(value || '').toLowerCase();
}

function addLowerSsisLookupKey(set, rawKey) {
  const key = lowerSsisLookupKey(rawKey);
  if (key) set.add(key);
}

function lowerSsisLookupKeySet(values = []) {
  const keys = new Set();
  for (const value of values) {
    addLowerSsisLookupKey(keys, value);
  }
  return keys;
}

function hasLowerSsisLookupKey(keys, values = []) {
  for (const value of values) {
    const key = lowerSsisLookupKey(value);
    if (key && keys.has(key)) return true;
  }
  return false;
}

function pushLookupValue(map, key, value) {
  if (!key || !value) return;
  if (!map.has(key)) map.set(key, []);
  map.get(key).push(value);
}

function pushLowerLookupValue(map, rawKey, value) {
  const key = lowerSsisLookupKey(rawKey);
  pushLookupValue(map, key, value);
}

function setLowerLookupValue(map, rawKey, value) {
  const key = lowerSsisLookupKey(rawKey);
  if (!key || !value || map.has(key)) return;
  map.set(key, value);
}

function buildSsisMarkdownIndexes(
  lineageEdges = [],
  xmlMetadata = [],
  runtimeSupport = [],
  catalog = []
) {
  const edgesByKey = new Map();
  const xmlMetadataByKey = new Map();
  const runtimeSupportByKey = new Map();
  const topMostPackageKeys = new Set();
  const packageLookupToKey = new Map();
  const packageKey = (folder, project, packageName) =>
    `${cleanSegment(folder)}.${cleanSegment(project)}.${cleanSegment(packageName)}`.toLowerCase();
  const addPackageLookup = (rawKey, key) => {
    const normalized = lowerSsisLookupKey(rawKey);
    if (normalized && key) packageLookupToKey.set(normalized, key);
  };

  for (const row of catalog || []) {
    const key = packageKey(row.folder_name, row.project_name, row.package_name);
    addPackageLookup(row.package_name, key);
    addPackageLookup(`${row.project_name}.${row.package_name}`, key);
    addPackageLookup(`${row.folder_name}.${row.project_name}.${row.package_name}`, key);
    addPackageLookup(packageId('V1-SSIS25-01, 11040', row.folder_name, row.project_name, row.package_name), key);
  }

  for (const edge of lineageEdges) {
    pushLowerLookupValue(edgesByKey, edge.packageName, edge);
    pushLowerLookupValue(edgesByKey, edge.from, edge);
    pushLowerLookupValue(edgesByKey, edge.packageId, edge);
    pushLowerLookupValue(edgesByKey, edge.packagePath, edge);
    pushLowerLookupValue(edgesByKey, edge.objectName, edge);
  }

  const incomingPackageCalls = new Set();
  const triggeredPackages = new Set();
  for (const edge of lineageEdges || []) {
    const targetKey = packageLookupToKey.get(lowerSsisLookupKey(edge.to));
    if (!targetKey) continue;
    if (edge.edgeType === 'CALLS') incomingPackageCalls.add(targetKey);
    if (edge.edgeType === 'TRIGGERS') triggeredPackages.add(targetKey);
  }

  for (const metadata of xmlMetadata) {
    const folder = metadata.folderName || metadata.folder_name;
    const project = metadata.projectName || metadata.project_name;
    setLowerLookupValue(xmlMetadataByKey, metadata.objectName, metadata);
    setLowerLookupValue(xmlMetadataByKey, metadata.packageName, metadata);
    if (project && metadata.objectName) {
      setLowerLookupValue(xmlMetadataByKey, `${project}.${metadata.objectName}`, metadata);
    }
    if (folder && project && metadata.objectName) {
      setLowerLookupValue(
        xmlMetadataByKey,
        `${folder}.${project}.${metadata.objectName}`,
        metadata
      );
    }
  }

  for (const row of runtimeSupport || []) {
    runtimeSupportByKey.set(packageKey(row.folder_name, row.project_name, row.package_name), row);
  }

  for (const row of catalog || []) {
    const key = packageKey(row.folder_name, row.project_name, row.package_name);
    if (triggeredPackages.has(key) || !incomingPackageCalls.has(key)) {
      topMostPackageKeys.add(key);
    }
  }

  return { edgesByKey, xmlMetadataByKey, runtimeSupportByKey, topMostPackageKeys };
}

function indexedSsisEdges(indexes, keys) {
  if (!(indexes?.edgesByKey instanceof Map)) return null;
  const edges = [];
  const seen = new Set();

  for (const key of keys) {
    for (const edge of indexes.edgesByKey.get(key) || []) {
      if (seen.has(edge)) continue;
      seen.add(edge);
      edges.push(edge);
    }
  }

  return edges.length > 0 ? edges : null;
}

function indexedSsisXmlMetadata(indexes, keys) {
  if (!(indexes?.xmlMetadataByKey instanceof Map)) return null;
  for (const key of keys) {
    const metadata = indexes.xmlMetadataByKey.get(key);
    if (metadata) return metadata;
  }
  return null;
}

function parseSsisReferenceMetadata(reference = '') {
  const normalized = String(reference || '').trim().replace(/\[|\]/g, '');
  if (!normalized) return {};

  const parts = normalized.split('.').filter(Boolean);
  if (parts.length < 2) {
    return {
      name: normalized,
      type: 'table',
    };
  }

  return {
    server: parts.length >= 4 ? parts.slice(0, -3).join('.') : '',
    database: parts.length >= 3 ? parts[parts.length - 3] : '',
    schema: parts.length >= 2 ? parts[parts.length - 2] : '',
    name: parts[parts.length - 1] || normalized,
    type: 'table',
  };
}

function emptySsisEdgeSummary() {
  return {
    reads: {
      direct_source_reads: [],
      lookup_reads: [],
      target_maintenance_reads: [],
      business_consumer_reads: [],
    },
    writes: {
      direct_writes: [],
      insert_writes: [],
      update_writes: [],
      delete_writes: [],
      upsert_writes: [],
    },
    calls: [],
  };
}

function deriveSsisMappingReference(reference, packageMetadata, aliases, referenceIndex) {
  if (splitDotSegments(reference).length < 2 || !isDirectSqlReference(reference)) return '';
  return qualifyReference(
    reference,
    {
      server: packageMetadata.server || 'V1-SSIS25-01, 11040',
      database: packageMetadata.database || 'Sonic_DW',
      schema: 'dbo',
    },
    aliases,
    referenceIndex
  );
}

function summarizeSsisPackageEdges(
  packageEdges,
  aliases,
  referenceIndex,
  packageMetadata = {},
  packageXmlMetadata = {}
) {
  const readsFrom = [];
  const writesTo = [];
  const calls = [];
  const ssisEdgeSummary = emptySsisEdgeSummary();
  const lineageQuality = {
    validated_edges: 0,
    probable_edges: 0,
    unresolved_facts: 0,
  };

  for (const edge of packageEdges) {
    if (edge.validation_status === 'validated') lineageQuality.validated_edges += 1;
    if (edge.validation_status === 'probable') lineageQuality.probable_edges += 1;
    if (
      edge.validation_status === 'unresolved' ||
      edge.edgeType === 'UNRESOLVED_DYNAMIC_EDGE'
    ) {
      lineageQuality.unresolved_facts += 1;
    }

    const normalizedRef = normalizeSsisReference(edge.to, aliases, referenceIndex);
    if (!normalizedRef) continue;

    if (SSIS_READ_EDGE_TYPES.has(edge.edgeType)) {
      pushUniqueText(readsFrom, normalizedRef);
    }
    if (SSIS_WRITE_EDGE_TYPES.has(edge.edgeType)) {
      pushUniqueText(writesTo, normalizedRef);
    }
    if (SSIS_CALL_EDGE_TYPES.has(edge.edgeType)) {
      pushUniqueText(calls, normalizedRef);
    }
  }

  for (const mapping of packageXmlMetadata.ssisColumnMappings || []) {
    if (mapping.validation_status && mapping.validation_status !== 'validated') continue;

    const sourceRef = deriveSsisMappingReference(
      mapping.source_object || mapping.sourceObject || '',
      packageMetadata,
      aliases,
      referenceIndex
    );
    if (sourceRef) {
      pushUniqueText(readsFrom, sourceRef);
      lineageQuality.validated_edges += 1;
    }

    const targetRef = deriveSsisMappingReference(
      mapping.destination_object || mapping.target_object || mapping.targetObject || '',
      packageMetadata,
      aliases,
      referenceIndex
    );
    if (targetRef) {
      pushUniqueText(writesTo, targetRef);
      lineageQuality.validated_edges += 1;
    }
  }

  const consumerMetadata = {
    ...packageMetadata,
    ...packageXmlMetadata,
    type: 'package',
  };

  for (const ref of readsFrom) {
    const readRole = classifyReadRole(parseSsisReferenceMetadata(ref), consumerMetadata);
    if (readRole === 'source_read') {
      pushUniqueText(ssisEdgeSummary.reads.direct_source_reads, ref);
    } else if (readRole === 'lookup_read') {
      pushUniqueText(ssisEdgeSummary.reads.lookup_reads, ref);
    } else if (readRole === 'business_consumer_read') {
      pushUniqueText(ssisEdgeSummary.reads.business_consumer_reads, ref);
    } else {
      pushUniqueText(ssisEdgeSummary.reads.business_consumer_reads, ref);
    }
  }

  const processMetadata = {
    ...consumerMetadata,
    reads_from: readsFrom,
    writes_to: writesTo,
    definition: (packageXmlMetadata.sqlTasks || [])
      .map((task) => task.sqlText || task.sqlCommand || '')
      .filter(Boolean)
      .join('\n'),
  };

  const readSet = new Set(readsFrom.map((ref) => String(ref || '').toLowerCase()));
  for (const ref of writesTo) {
    const targetMetadata = parseSsisReferenceMetadata(ref);
    const operation = classifyWriteOperation(processMetadata, ref, targetMetadata);
    if (readSet.has(String(ref || '').toLowerCase())) {
      pushUniqueText(ssisEdgeSummary.reads.target_maintenance_reads, ref);
    }
    if (operation === 'insert_write') {
      pushUniqueText(ssisEdgeSummary.writes.insert_writes, ref);
    } else if (operation === 'update_write') {
      pushUniqueText(ssisEdgeSummary.writes.update_writes, ref);
    } else if (operation === 'delete_write') {
      pushUniqueText(ssisEdgeSummary.writes.delete_writes, ref);
    } else if (operation === 'upsert_write') {
      pushUniqueText(ssisEdgeSummary.writes.upsert_writes, ref);
    } else {
      pushUniqueText(ssisEdgeSummary.writes.direct_writes, ref);
    }
  }

  ssisEdgeSummary.calls = calls;

  return {
    readsFrom,
    writesTo,
    calls,
    ssisEdgeSummary,
    lineageQuality,
  };
}

function buildSsisMarkdown(result, packageRow, server, aliases, referenceIndex, indexes = {}) {
  const folder = packageRow.folder_name || 'unknown_folder';
  const project = packageRow.project_name || 'unknown_project';
  const pkg = packageRow.package_name || 'unknown_package.dtsx';
  const id = packageId(server, folder, project, pkg);
  const runtimeKey = `${cleanSegment(folder)}.${cleanSegment(project)}.${cleanSegment(pkg)}`.toLowerCase();
  const isTopMostWorkflow = indexes.topMostPackageKeys?.has(runtimeKey) === true;
  const ssisRuntimeBaseline = isTopMostWorkflow
    ? indexes.runtimeSupportByKey?.get(runtimeKey) || null
    : null;
  const keys = lowerSsisLookupKeySet([
    pkg,
    id,
    `${project}.${pkg}`,
    `${folder}.${project}.${pkg}`,
  ]);
  const packageXmlMetadata =
    indexedSsisXmlMetadata(indexes, keys) ||
    (result.xmlMetadata || []).find((metadata) =>
      hasLowerSsisLookupKey(keys, [
        metadata.objectName,
        metadata.packageName,
        `${project}.${metadata.objectName}`,
        `${folder}.${project}.${metadata.objectName}`,
      ])
    );
  const packageEdges =
    indexedSsisEdges(indexes, keys) ||
    (result.lineageEdges || []).filter((edge) =>
      hasLowerSsisLookupKey(keys, [
        edge.packageName,
        edge.from,
        edge.packageId,
        edge.packagePath,
        edge.objectName,
      ])
    );

  const edgeSummary = summarizeSsisPackageEdges(
    packageEdges,
    aliases,
    referenceIndex,
    {
      server,
      database: 'Sonic_DW',
      name: `${folder}.${project}.${pkg}`,
      folder_name: folder,
      project_name: project,
      package_name: pkg,
    },
    packageXmlMetadata
  );
  const { readsFrom, writesTo, calls } = edgeSummary;
  const ssisColumnMappings = Array.isArray(packageXmlMetadata?.ssisColumnMappings)
    ? packageXmlMetadata.ssisColumnMappings
    : [];
  const mappingPriority = (mapping) => {
    const evidenceType = String(mapping.evidence_type || '').toLowerCase();
    if (evidenceType === 'ssis_dataflow_column_mapping') return 0;
    if (evidenceType === 'ssis_lookup_output') return 1;
    if (evidenceType === 'ssis_derived_column_expression') return 2;
    return 3;
  };
  const sortedSsisColumnMappings = [...ssisColumnMappings].sort(
    (left, right) => mappingPriority(left) - mappingPriority(right)
  );
  const embeddedSsisColumnMappings = sortedSsisColumnMappings.slice(
    0,
    SSIS_COLUMN_MAPPING_EMBED_LIMIT
  );
  const sidecarChunkCount = Math.ceil(
    sortedSsisColumnMappings.length / SSIS_COLUMN_MAPPING_CHUNK_SIZE
  );
  const sidecars = [];
  const sidecarRefs = [];

  for (
    let chunkStart = 0, chunkNumber = 1;
    chunkStart < sortedSsisColumnMappings.length;
    chunkStart += SSIS_COLUMN_MAPPING_CHUNK_SIZE, chunkNumber += 1
  ) {
    const chunk = sortedSsisColumnMappings.slice(
      chunkStart,
      chunkStart + SSIS_COLUMN_MAPPING_CHUNK_SIZE
    );
    const chunkLabel = String(chunkNumber).padStart(3, '0');
    const sidecarId = `${id}.ssis_column_mappings.chunk_${chunkLabel}`;
    const sidecarFrontmatter = {
      id: sidecarId,
      name: `${folder}.${project}.${pkg}.column_mappings.chunk_${chunkLabel}`,
      server,
      folder_name: folder,
      project_name: project,
      package_name: pkg,
      package_id: id,
      package_path: `${folder}.${project}.${pkg}`,
      database: 'ssisdb',
      schema: 'externalized_column_mappings',
      type: 'dataset',
      owner: 'ssis-platform',
      sensitivity: 'internal',
      tags: ['ssis', 'column-lineage', 'mapping-sidecar'],
      depends_on: [id],
      reads_from: readsFrom,
      writes_to: writesTo,
      ssis_column_mapping_summary: {
        total_mappings: sortedSsisColumnMappings.length,
        chunk_number: chunkNumber,
        chunk_count: sidecarChunkCount,
        chunk_mappings: chunk.length,
      },
      ssis_column_mappings: chunk,
      unresolved_ssis_column_mappings: [],
      description: `Complete SSIS column mapping chunk ${chunkLabel} for ${folder}.${project}.${pkg}.`,
    };
    const sidecarBody = `# SSIS Column Mapping Chunk ${chunkLabel}

## Package
- Package ID: ${id}
- Package Path: ${folder}.${project}.${pkg}
- Chunk: ${chunkNumber} of ${sidecarChunkCount}
- Mapping Records: ${chunk.length}

This sidecar preserves complete SSIS column mapping evidence without forcing every
mapping into the parent package frontmatter.
`;
    sidecars.push({
      id: sidecarId,
      frontmatter: sidecarFrontmatter,
      body: sidecarBody,
      content: `${renderFrontmatter(sidecarFrontmatter)}${sidecarBody}`,
      chunkNumber,
      recordCount: chunk.length,
    });
    sidecarRefs.push({
      id: sidecarId,
      chunk_number: chunkNumber,
      records: chunk.length,
    });
  }
  const unresolvedSsisColumnMappings = Array.isArray(
    packageXmlMetadata?.unresolvedSsisColumnMappings
  )
    ? packageXmlMetadata.unresolvedSsisColumnMappings
    : [];
  const ssisFileReferences = Array.isArray(packageXmlMetadata?.ssisFileReferences)
    ? packageXmlMetadata.ssisFileReferences
    : [];
  const ssisConnectionManagers = Array.isArray(packageXmlMetadata?.connectionManagers)
    ? packageXmlMetadata.connectionManagers.map((cm) => ({
        connection_name: cm.connName || '',
        connection_type: cm.connType || '',
        server_name: cm.serverName || '',
        database_name: cm.databaseName || '',
        file_path: cm.filePath || '',
        dynamic_resolved: cm.dynamicResolved === true,
        dynamic_variables: Array.isArray(cm.dynamicVariables) ? cm.dynamicVariables : [],
      }))
    : [];

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
    ssis_column_mapping_summary: {
      total_mappings: ssisColumnMappings.length,
      embedded_mappings: embeddedSsisColumnMappings.length,
      sidecar_mappings: sortedSsisColumnMappings.length,
      sidecar_chunks: sidecars.length,
      truncated: false,
    },
    ssis_column_mapping_sidecars: sidecarRefs,
    ssis_column_mappings: embeddedSsisColumnMappings,
    unresolved_ssis_column_mappings: unresolvedSsisColumnMappings,
    ssis_file_references: ssisFileReferences,
    ssis_connection_managers: ssisConnectionManagers,
    ssis_top_most_workflow: isTopMostWorkflow,
    ssis_runtime_baseline: ssisRuntimeBaseline || null,
    ssis_edge_summary: edgeSummary.ssisEdgeSummary,
    lineage_quality: edgeSummary.lineageQuality,
    description: `SSIS package metadata extracted from folder ${folder}, project ${project}, package ${pkg}.`,
  };

  const runtimeBaselineBody = ssisRuntimeBaseline
    ? `

## Runtime Baseline
- As of: ${ssisRuntimeBaseline.as_of || 'n/a'}
- Lookback days: ${ssisRuntimeBaseline.lookback_days || 'n/a'}
- Last successful run: ${ssisRuntimeBaseline.last_success_time || 'n/a'}
- Last failed run: ${ssisRuntimeBaseline.last_failure_time || 'n/a'}
- Typical successful runtime seconds: ${ssisRuntimeBaseline.typical_success_runtime_seconds ?? 'n/a'}
- P90 successful runtime seconds: ${ssisRuntimeBaseline.p90_success_runtime_seconds ?? 'n/a'}
- Recent failure count: ${ssisRuntimeBaseline.failure_count ?? '0'}
- Runtime caveat: Support baseline from SSISDB history, not a service-level guarantee.
`
    : '';

  const body = `# SSIS Package ${folder}.${project}.${pkg}

## Identity
- Folder: ${folder}
- Project: ${project}
- Package: ${pkg}
- Entry Point: ${packageRow.entry_point ? 'Yes' : 'No'}

## Runtime Summary
- Detected lineage edges: ${packageEdges.length}
- SSIS column mappings: ${embeddedSsisColumnMappings.length} embedded; ${sortedSsisColumnMappings.length} preserved in ${sidecars.length} sidecar chunk(s)
- Unresolved SSIS column mappings: ${unresolvedSsisColumnMappings.length}
- File/config references: ${ssisFileReferences.length}
- Upstream entities: ${readsFrom.length}
- SPs Called: ${calls.length}
- Target entities: ${writesTo.length}
- Last validation: ${packageRow.package_last_validation || 'n/a'}
${runtimeBaselineBody}

## Classified SSIS Edge Summary
- Direct source reads: ${edgeSummary.ssisEdgeSummary.reads.direct_source_reads.length}
- Lookup reads: ${edgeSummary.ssisEdgeSummary.reads.lookup_reads.length}
- Target-maintenance reads: ${edgeSummary.ssisEdgeSummary.reads.target_maintenance_reads.length}
- Business or contextual reads: ${edgeSummary.ssisEdgeSummary.reads.business_consumer_reads.length}
- Direct writes: ${edgeSummary.ssisEdgeSummary.writes.direct_writes.length}
- Insert writes: ${edgeSummary.ssisEdgeSummary.writes.insert_writes.length}
- Update writes: ${edgeSummary.ssisEdgeSummary.writes.update_writes.length}
- Delete writes: ${edgeSummary.ssisEdgeSummary.writes.delete_writes.length}
- Upsert or maintenance writes: ${edgeSummary.ssisEdgeSummary.writes.upsert_writes.length}
- Package or procedure calls: ${edgeSummary.ssisEdgeSummary.calls.length}

## Extraction Notes
- Generated by scripts/rebuild-catalog-from-raw.mjs from raw SSIS XML.
`;

  return { id, frontmatter, body, content: `${renderFrontmatter(frontmatter)}${body}`, sidecars };
}

function buildSsisSummary(result, server) {
  const lineageEdges = result.lineageEdges || [];
  const lineageQuality = {
    validated_edges: 0,
    probable_edges: 0,
    unresolved_facts: 0,
  };

  for (const edge of lineageEdges) {
    if (edge.validation_status === 'validated' || edge.confidence === 'high') {
      lineageQuality.validated_edges += 1;
    }
    if (edge.validation_status === 'probable' || edge.confidence === 'medium') {
      lineageQuality.probable_edges += 1;
    }
    if (
      edge.validation_status === 'unresolved' ||
      edge.edgeType === 'UNRESOLVED_DYNAMIC_EDGE'
    ) {
      lineageQuality.unresolved_facts += 1;
    }
  }

  const frontmatter = {
    name: 'ssis_catalog_lineage',
    server,
    database: 'ssisdb',
    type: 'dataset',
    owner: 'ssis-platform',
    sensitivity: 'internal',
    tags: ['ssis', 'lineage', 'operational'],
    depends_on: [],
    lineage_quality: lineageQuality,
    description: 'Consolidated SSIS lineage edges rebuilt from raw SSIS XML.',
  };
  frontmatter.catalog_confidence = buildCatalogConfidence(frontmatter);

  const lines = [];
  const previewEdgeCount = Math.min(lineageEdges.length, 500);
  for (let index = 0; index < previewEdgeCount; index += 1) {
    const edge = lineageEdges[index];
    lines.push(
      `- ${edge.from || 'UNKNOWN'} -> ${edge.to || 'UNKNOWN'} (type=${edge.edgeType || 'ETL'}, confidence=${edge.confidence ?? 'n/a'}, via=${edge.via || 'n/a'})`
    );
  }
  const body = `# SSIS Catalog Lineage Summary

## Overview
- Extracted At: ${result.extractedAt}
- SSISDB Present: ${result.ssisdbPresent ? 'Yes' : 'No'}
- Total Edges: ${lineageEdges.length}

## Top Lineage Edges
${lines.length ? lines.join('\n') : '- No edges generated.'}
`;

  return `${renderFrontmatter(frontmatter)}${body}`;
}

function isExternalSsisComponent(component = {}) {
  const type = String(component.componentType || '');
  return EXTERNAL_SSIS_COMPONENT_PATTERNS.some((pattern) => pattern.test(type));
}

function columnsFromSsisComponent(component = {}, objectId = '', role = 'source') {
  const seen = new Set();
  const columns = [];

  const appendColumns = (candidateColumns = []) => {
    for (const column of candidateColumns || []) {
      const name = cleanSegment(column?.name || column?.cachedName || '');
      if (!name) continue;
      const key = name.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      columns.push({
        name,
        column_id: `${objectId}.${name}`,
        ordinal: columns.length + 1,
        data_type: column.dataType || 'external',
        max_length: column.length || null,
        nullable: true,
        sensitivity: 'internal',
        extraction_evidence: {
          source: 'ssis_external_component_metadata',
          component_name: component.componentName || '',
          component_type: component.componentType || '',
        },
      });
    }
  };

  if (role === 'destination') {
    appendColumns(component.externalMetadataColumns);
    appendColumns(component.inputColumns);
    appendColumns(component.outputColumns);
  } else {
    appendColumns(component.outputColumns);
    appendColumns(component.externalMetadataColumns);
    appendColumns(component.inputColumns);
  }

  return columns;
}

function buildExternalSsisRecords(result, server) {
  const records = [];

  for (const pkg of result.xmlMetadata || []) {
    const folder = pkg.folderName || 'unknown_folder';
    const project = pkg.projectName || 'unknown_project';
    const packageName = pkg.packageName || pkg.objectName || 'unknown_package.dtsx';
    const packageObjectId = packageId(server, folder, project, packageName);

    for (const component of pkg.dataFlowComponents || []) {
      if (!isExternalSsisComponent(component)) continue;
      if (component.role !== 'SOURCE' && component.role !== 'DESTINATION') continue;

      const externalId = buildSsisExternalObjectId({
        serverName: server,
        folderName: folder,
        projectName: project,
        packageName,
        componentName: component.componentName,
        role: component.role.toLowerCase(),
        reference: component.tableName || component.sqlCommand || '',
      });
      const name = `${folder}.${project}.${packageName}.${component.componentName}`;
      const role = component.role === 'DESTINATION' ? 'destination' : 'source';
      const columns = columnsFromSsisComponent(component, externalId, role);
      const frontmatter = {
        id: externalId,
        name,
        server,
        database: 'ssisdb',
        schema: 'external_sources',
        type: 'dataset',
        owner: 'ssis-platform',
        sensitivity: 'internal',
        tags: ['ssis', 'external-source', role],
        external_source: true,
        depends_on: [],
        created_via: role === 'destination' ? [packageObjectId] : [],
        used_by: role === 'source' ? [packageObjectId] : [],
        columns,
        extraction_evidence: {
          source: 'ssis_external_component',
          package_id: packageObjectId,
          component_name: component.componentName || '',
          component_type: component.componentType || '',
          role: component.role,
          table_name: component.tableName || '',
          sql_command: component.sqlCommand || '',
        },
        description: `External SSIS ${role} component ${component.componentName || 'unknown'} from ${name}.`,
      };
      const body = `# External SSIS ${role === 'source' ? 'Source' : 'Destination'} ${component.componentName || 'unknown'}

## Package
- Package ID: ${packageObjectId}
- Package Path: ${folder}.${project}.${packageName}
- Component Type: ${component.componentType || 'unknown'}
- Role: ${component.role}

This object represents a non-SQL SSIS endpoint so column lineage can retain
validated edges for flat files, Excel files, XML, SharePoint, raw files, and
other external components.
`;

      records.push({
        id: externalId,
        type: 'dataset',
        frontmatter,
        body,
        server,
        database: 'ssisdb',
        schema: 'external_sources',
        name,
        outputPath: path.join(
          OUTPUT_SERVERS_ROOT,
          sanitizePathSegment(server),
          'ssis_external_sources',
          sanitizePathSegment(folder),
          sanitizePathSegment(project),
          sanitizePathSegment(packageName),
          `${sanitizePathSegment(component.componentName || 'external_component')}.md`
        ),
      });
    }
  }

  return records;
}

function referenceMatchesCandidate(candidateId = '', reference = '') {
  const candidate = cleanSegment(candidateId).toLowerCase();
  const hint = cleanSegment(reference).toLowerCase();
  if (!candidate || !hint) return false;
  if (candidate === hint || candidate.endsWith(`.${hint}`)) return true;

  const candidateParts = splitDotSegments(candidate);
  const hintParts = splitDotSegments(hint);
  if (hintParts.length === 1) {
    return candidateParts[candidateParts.length - 1] === hintParts[0];
  }
  if (hintParts.length === 2) {
    return tailDotSegmentsMatch(candidateParts, hintParts);
  }
  if (hintParts.length === 3) {
    return tailDotSegmentsMatch(candidateParts, hintParts);
  }
  return false;
}

function resolveUniqueCandidateReference(candidates = [], reference = '') {
  const seen = new Set();
  let match = '';

  for (const value of candidates) {
    const candidate = String(value || '').trim();
    if (!candidate) continue;
    const key = candidate.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    if (!referenceMatchesCandidate(candidate, reference)) continue;
    if (match) return '';
    match = candidate;
  }

  return match;
}

function addSsisEndpointColumn(endpoint, columnName, mapping = {}, role = 'source') {
  const name = cleanSegment(columnName);
  if (!name) return;
  const key = name.toLowerCase();
  if (endpoint.columnNames.has(key)) return;
  endpoint.columnNames.add(key);
  endpoint.columns.push({
    name,
    column_id: `${endpoint.id}.${name}`,
    ordinal: endpoint.columns.length + 1,
    data_type: 'ssis_observed',
    nullable: true,
    sensitivity: 'internal',
    extraction_evidence: {
      source: 'ssis_sql_endpoint_column_mapping',
      package_id: mapping.package_id || mapping.packageId || '',
      component_name: mapping.component_name || '',
      component_type: mapping.component_type || '',
      role,
      evidence_text: mapping.evidence_text || '',
    },
  });
}

function ensureSsisSqlEndpoint(endpoints, endpointId, packageIdValue, role) {
  const parsed = parseSqlId(endpointId);
  if (!parsed?.name || !parsed.database || !parsed.schema) return null;
  const canonicalEndpointId = canonicalSqlIdFromParsedSqlId(parsed);
  const normalizedId = canonicalEndpointId.toLowerCase();
  if (!normalizedId) return null;

  if (!endpoints.has(normalizedId)) {
    endpoints.set(normalizedId, {
      id: canonicalEndpointId,
      server: parsed.server || 'unknown',
      database: parsed.database,
      schema: parsed.schema,
      name: parsed.name,
      role,
      columns: [],
      columnNames: new Set(),
      usedBy: [],
      createdVia: [],
      packages: [],
      mappings: 0,
    });
  }

  const endpoint = endpoints.get(normalizedId);
  endpoint.role = endpoint.role === role ? role : 'source_and_target';
  endpoint.packages = pushUniqueText(endpoint.packages, packageIdValue);
  if (role === 'source') {
    endpoint.usedBy = pushUniqueText(endpoint.usedBy, packageIdValue);
  } else {
    endpoint.createdVia = pushUniqueText(endpoint.createdVia, packageIdValue);
  }
  endpoint.mappings += 1;
  return endpoint;
}

function* buildSsisSqlEndpointRecords(records) {
  const endpoints = new Map();

  for (const record of records.values()) {
    const frontmatter = record?.frontmatter || {};
    if (
      !Array.isArray(frontmatter.ssis_column_mappings) ||
      frontmatter.ssis_column_mappings.length === 0 ||
      (frontmatter.type !== 'package' && frontmatter.type !== 'dataset')
    ) {
      continue;
    }

    const packageIdValue = frontmatter.package_id || frontmatter.id || record.id;
    const sourceCandidates = mergeUniqueTextGroups(
      frontmatter.reads_from,
      frontmatter.depends_on
    );
    const targetCandidates = Array.isArray(frontmatter.writes_to) ? frontmatter.writes_to : [];

    for (const mapping of frontmatter.ssis_column_mappings || []) {
      if (mapping.validation_status && mapping.validation_status !== 'validated') continue;

      const sourceId = resolveUniqueCandidateReference(
        sourceCandidates,
        mapping.source_object || mapping.sourceObject || ''
      );
      if (sourceId && !records.has(sourceId.toLowerCase())) {
        const endpoint = ensureSsisSqlEndpoint(endpoints, sourceId, packageIdValue, 'source');
        if (endpoint) {
          addSsisEndpointColumn(
            endpoint,
            mapping.input_column || mapping.source_column || mapping.output_column,
            mapping,
            'source'
          );
        }
      }

      const targetId = resolveUniqueCandidateReference(
        targetCandidates,
        mapping.destination_object || mapping.target_object || mapping.targetObject || ''
      );
      if (targetId && !records.has(targetId.toLowerCase())) {
        const endpoint = ensureSsisSqlEndpoint(endpoints, targetId, packageIdValue, 'destination');
        if (endpoint) {
          addSsisEndpointColumn(
            endpoint,
            mapping.external_metadata_column || mapping.output_column || mapping.target_column,
            mapping,
            'destination'
          );
        }
      }
    }
  }

  for (const endpoint of endpoints.values()) {
    const roleTags =
      endpoint.role === 'source_and_target'
        ? ['source', 'destination']
        : [endpoint.role === 'destination' ? 'destination' : 'source'];
    const frontmatter = {
      id: endpoint.id,
      name: endpoint.name,
      server: endpoint.server,
      database: endpoint.database,
      schema: endpoint.schema,
      type: 'table',
      owner: 'ssis-platform',
      sensitivity: 'internal',
      tags: ['ssis', 'ssis-sql-endpoint', ...roleTags],
      external_source: true,
      depends_on: [],
      created_via: endpoint.createdVia,
      used_by: endpoint.usedBy,
      columns: endpoint.columns,
      lineage_quality: {
        validated_edges: endpoint.createdVia.length + endpoint.usedBy.length,
        probable_edges: 0,
        unresolved_facts: 0,
      },
      extraction_evidence: {
        source: 'ssis_sql_endpoint_from_package_mapping',
        package_ids: endpoint.packages,
        observed_mapping_count: endpoint.mappings,
        note:
          'This object was inferred from SSIS package metadata because the SQL endpoint was not present in the raw SQL extraction.',
      },
      description: `SQL endpoint ${endpoint.id} observed in SSIS mappings but not present in raw SQL extraction.`,
    };
    const body = `# SSIS-Observed SQL Endpoint ${endpoint.id}

## Extraction Evidence
- Source: SSIS package column mappings
- Packages: ${endpoint.packages.length}
- Observed Columns: ${endpoint.columns.length}

This markdown record preserves SSIS-observed SQL endpoint evidence so object and
column impact analysis can remain connected until a full SQL extraction for this
source is available.
`;

    yield {
      id: endpoint.id,
      type: 'table',
      frontmatter,
      body,
      server: endpoint.server,
      database: endpoint.database,
      schema: endpoint.schema,
      name: endpoint.name,
    };
  }
}

async function loadSqlRawObjects(aliases) {
  const files = await listFiles(
    RAW_SQL_ROOT,
    (filePath) => filePath.toLowerCase().endsWith('.md')
  );
  const candidates = new Map();
  const quarantined = { count: 0, sample: [] };
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
      const serverInput = !isUnknownServer(metadata.server) ? metadata.server : relParts[0];
      const server = canonicalServer(serverInput, database, aliases);
      const schema = cleanSegment(metadata.schema || path.basename(filePath, '.md').split('__')[0] || 'dbo');
      const name = cleanSegment(metadata.name || path.basename(filePath, '.md').split('__').slice(1).join('__'));
      const type = typeFromDirectory(kind);
      const quarantineReason = sqlRawQuarantineReason({ schema, name, type });
      if (isUnknownServer(server)) {
        recordSqlRawQuarantine(quarantined, {
          reason: 'unknown_sql_server',
          sourcePath: path.relative(ROOT, filePath),
          pathServer: relParts[0] || '',
          metadataServer: metadata.server || '',
          database,
          schema,
          name,
          type,
        });
        continue;
      }
      if (quarantineReason) {
        recordSqlRawQuarantine(quarantined, {
          reason: quarantineReason,
          sourcePath: path.relative(ROOT, filePath),
          pathServer: relParts[0] || '',
          metadataServer: metadata.server || '',
          database,
          schema,
          name,
          type,
        });
        continue;
      }
      const id = makeSqlId(server, database, schema, name);
      const markdownColumns =
        Array.isArray(metadata.columns) && metadata.columns.length > 0
          ? []
          : parseMarkdownColumns(body, { id, metadata });
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
        markdownColumns,
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

  return { records: candidates, skipped, quarantined };
}

function rewriteSqlLineage(records, aliases) {
  const referenceIndex = buildReferenceIndex(records);

  for (const record of records.values()) {
    record.columns = normalizeColumnInventory(record);
  }

  const columnUsageMetadata = buildColumnUsageMetadata(records);

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
      dependsOn = mergeUniqueTextGroups(readsFrom, calls);
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

    const columnUsage = extractColumnUsageForRecord(record, columnUsageMetadata);

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
      live_row_count: record.metadata.live_row_count ?? record.metadata.liveRowCount ?? null,
      size_kb: record.metadata.size_kb || 0,
      column_count: record.metadata.column_count || 0,
      columns: record.columns,
      column_usage: columnUsage.column_usage,
      unresolved_column_usage: columnUsage.unresolved_column_usage,
      column_risk_flags: columnUsage.column_risk_flags,
      index_count: record.metadata.index_count || 0,
      check_constraint_count: record.metadata.check_constraint_count || 0,
      extraction_warnings: Array.isArray(record.metadata.extraction_warnings)
        ? record.metadata.extraction_warnings
        : [],
      extracted_at: new Date().toISOString(),
    };

    delete record.metadata;
    delete record.definition;
    delete record.markdownColumns;
    delete record.columns;
  }

  clearColumnUsageMetadata(columnUsageMetadata);
  return referenceIndex;
}

function applyForwardSqlEdges(records, referenceIndex) {
  for (const record of records.values()) {
    const fm = record.frontmatter;

    for (const targetId of fm.writes_to || []) {
      const target = records.get(targetId.toLowerCase());
      if (!target || target.type !== 'table') continue;
      target.frontmatter.created_by = pushUniqueText(target.frontmatter.created_by, record.id);
      target.frontmatter.depends_on = pushUniqueText(target.frontmatter.depends_on, record.id);
      target.frontmatter.lineage_status = 'creator_found';
    }

    for (const sourceId of fm.reads_from || []) {
      const source = records.get(sourceId.toLowerCase());
      if (!source || source.type !== 'table') continue;
      source.frontmatter.used_by = pushUniqueText(source.frontmatter.used_by, record.id);
    }
  }

  return referenceIndex;
}

function applySynonymSourceExpansion(records) {
  let expandedReads = 0;

  for (const record of records.values()) {
    const fm = record.frontmatter;
    if (!fm || !['procedure', 'stored_procedure', 'proc', 'view'].includes(String(record.type || fm.type || '').toLowerCase())) {
      continue;
    }

    const readsFrom = Array.isArray(fm.reads_from) ? fm.reads_from : [];
    for (const sourceId of readsFrom) {
      const source = records.get(String(sourceId || '').toLowerCase());
      if (!source || String(source.type || source.frontmatter?.type || '').toLowerCase() !== 'synonym') {
        continue;
      }

      const baseObjects = Array.isArray(source.frontmatter?.depends_on)
        ? source.frontmatter.depends_on
        : [];
      for (const baseId of baseObjects) {
        const base = records.get(String(baseId || '').toLowerCase());
        if (!base || base.id === record.id) continue;

        const before = fm.reads_from?.length || 0;
        fm.reads_from = pushUniqueText(fm.reads_from, base.id);
        fm.depends_on = pushUniqueText(fm.depends_on, base.id);
        source.frontmatter.used_by = pushUniqueText(source.frontmatter.used_by, record.id);
        if (base.type === 'table') {
          base.frontmatter.used_by = pushUniqueText(base.frontmatter.used_by, record.id);
        }
        fm.tags = appendUniqueTag(fm.tags, 'lineage-stitch:synonym-source-expansion');
        source.frontmatter.tags = appendUniqueTag(
          source.frontmatter.tags,
          'lineage-stitch:synonym-source-expanded'
        );
        if ((fm.reads_from?.length || 0) > before) expandedReads += 1;
      }
    }
  }

  return { expandedReads };
}

function applyExactSsisPackageTableEdges(records, packageUpdates = []) {
  let readEdges = 0;
  let writeEdges = 0;

  for (const update of packageUpdates) {
    const packageIdValue = update.packageId;
    for (const sourceId of update.readsFrom || []) {
      const source = records.get(String(sourceId || '').toLowerCase());
      if (!source || source.type !== 'table') continue;
      source.frontmatter.used_by = pushUniqueText(source.frontmatter.used_by, packageIdValue);
      source.frontmatter.tags = appendUniqueTag(
        source.frontmatter.tags,
        'lineage-stitch:ssis-package-read'
      );
      readEdges += 1;
    }

    for (const targetId of update.writesTo || []) {
      const target = records.get(String(targetId || '').toLowerCase());
      if (!target || target.type !== 'table') continue;
      target.frontmatter.created_by = pushUniqueText(target.frontmatter.created_by, packageIdValue);
      target.frontmatter.created_via = pushUniqueText(target.frontmatter.created_via, packageIdValue);
      target.frontmatter.tags = appendUniqueTag(
        target.frontmatter.tags,
        'lineage-stitch:ssis-package-write'
      );
      if (target.frontmatter.lineage_status !== 'creator_found') {
        target.frontmatter.lineage_status = 'creator_found';
      }
      writeEdges += 1;
    }
  }

  return { readEdges, writeEdges };
}

async function rebuildSsis(aliases, referenceIndex, records, existingSsisCatalog, options = {}) {
  const server = 'V1-SSIS25-01, 11040';
  const liveSsisMetadata = USE_LIVE_SSIS_METADATA
    ? await readJsonIfExists(RAW_SSIS_METADATA_PATH, null)
    : null;
  let catalog = [];
  let xmlMetadata = [];
  let sourceMode = 'raw_xml';
  let skipped = 0;
  let processedXmlFiles = 0;
  let discoveredXmlFiles = 0;
  const ssisLimit = Math.max(0, Number(options.ssisLimit || 0));
  const packageKey = (folder, project, packageName) =>
    `${cleanSegment(folder)}.${cleanSegment(project)}.${cleanSegment(packageName)}`.toLowerCase();
  const liveCatalogByKey = new Map();
  const liveXmlByKey = new Map();

  if (
    liveSsisMetadata &&
    Array.isArray(liveSsisMetadata.catalog) &&
    Array.isArray(liveSsisMetadata.xmlMetadata)
  ) {
    sourceMode = 'raw_xml_with_live_ssisdb_metadata';
    for (const row of liveSsisMetadata.catalog) {
      liveCatalogByKey.set(
        packageKey(row.folder_name, row.project_name, row.package_name),
        row
      );
    }
    for (const metadata of liveSsisMetadata.xmlMetadata) {
      liveXmlByKey.set(
        packageKey(metadata.folderName, metadata.projectName, metadata.packageName || metadata.objectName),
        metadata
      );
    }
  }

  const xmlFiles = await listFiles(
    RAW_SSIS_XML_ROOT,
    (filePath) => filePath.toLowerCase().endsWith('.dtsx.xml')
  );
  discoveredXmlFiles = xmlFiles.length;

  for (const filePath of xmlFiles) {
    if (ssisLimit > 0 && processedXmlFiles >= ssisLimit) break;
    processedXmlFiles += 1;
    try {
      const xmlText = await fs.readFile(filePath, 'utf8');
      const { folder, project, packageName } = inferSsisFileParts(
        filePath,
        xmlText,
        existingSsisCatalog
      );
      const key = packageKey(folder, project, packageName);
      const liveRow = liveCatalogByKey.get(key);
      const row = {
        folder_name: folder,
        project_name: project,
        package_name: packageName,
        entry_point: liveRow?.entry_point ?? /master/i.test(packageName),
        package_last_validation: liveRow?.package_last_validation || null,
      };
      catalog.push(row);
      const parsed = parseSsisPackageXmlForLineage(xmlText, {
        objectName: packageName,
        packageName,
        projectName: project,
        folderName: folder,
        serverName: server,
        packageId: packageId(server, folder, project, packageName),
        parameterOverrides: aliases.ssisProjectParameterOverrides || {},
        connectionOverrides: aliases.ssisProjectConnectionOverrides || {},
      });
      const liveParsed = liveXmlByKey.get(key);
      if (parsed && liveParsed) {
        xmlMetadata.push({
          ...parsed,
          connectionManagers: liveParsed.connectionManagers || parsed.connectionManagers,
          ssisFileReferences: liveParsed.ssisFileReferences || parsed.ssisFileReferences,
          warnings: [
            ...(Array.isArray(parsed.warnings) ? parsed.warnings : []),
            ...(Array.isArray(liveParsed.warnings) ? liveParsed.warnings : []),
          ],
        });
      } else if (parsed) {
        xmlMetadata.push(parsed);
      }
    } catch (err) {
      skipped += 1;
      console.warn(`[raw-ssis] skipped ${filePath}: ${err.message}`);
    }
  }

  const knownCatalogKeys = new Set(catalog.map((row) => packageKey(row.folder_name, row.project_name, row.package_name)));
  if (ssisLimit <= 0 && liveCatalogByKey.size > 0) {
    for (const [key, liveRow] of liveCatalogByKey.entries()) {
      if (knownCatalogKeys.has(key)) continue;
      catalog.push(liveRow);
      const liveParsed = liveXmlByKey.get(key);
      if (liveParsed) xmlMetadata.push(liveParsed);
    }
  }

  const extractor = new SsisMetadataExtractor({
    server,
    ssisProjectParameterOverrides: aliases.ssisProjectParameterOverrides || {},
    ssisProjectConnectionOverrides: aliases.ssisProjectConnectionOverrides || {},
  });
  const result = {
    extractedAt: new Date().toISOString(),
    ssisdbPresent: true,
    catalog,
    xmlMetadata,
    parameters: liveSsisMetadata?.parameters || [],
    environments: liveSsisMetadata?.environments || {},
    runtimeSupport: liveSsisMetadata?.runtimeSupport || [],
    agentJobs: liveSsisMetadata?.agentJobs || { jobs: [], ssisSteps: [] },
    warnings: liveSsisMetadata?.warnings || [],
    ssis_source_mode: sourceMode,
  };
  result.lineageEdges = extractor.buildLineageEdges(
    catalog,
    xmlMetadata,
    result.agentJobs,
    result.parameters,
    result.environments
  );
  const markdownIndexes = buildSsisMarkdownIndexes(
    result.lineageEdges,
    result.xmlMetadata,
    result.runtimeSupport,
    catalog
  );
  const pendingPackageTargetUpdates = [];

  for (const row of catalog) {
    const md = buildSsisMarkdown(result, row, server, aliases, referenceIndex, markdownIndexes);
    records.set(md.id.toLowerCase(), {
      id: md.id,
      type: 'package',
      frontmatter: md.frontmatter,
      body: md.body,
      server,
      database: 'ssisdb',
      schema: '',
      name: md.frontmatter.package_name,
    });

    for (const sidecar of md.sidecars || []) {
      const sidecarOutputPath = path.join(
        OUTPUT_SERVERS_ROOT,
        sanitizePathSegment(server),
        'ssis_packages',
        sanitizePathSegment(md.frontmatter.folder_name),
        sanitizePathSegment(md.frontmatter.project_name),
        `${sanitizePathSegment(md.frontmatter.package_name)}.column_mappings.chunk_${String(sidecar.chunkNumber).padStart(3, '0')}.md`
      );
      records.set(sidecar.id.toLowerCase(), {
        id: sidecar.id,
        type: 'dataset',
        frontmatter: sidecar.frontmatter,
        body: sidecar.body,
        content: sidecar.content,
        server,
        database: 'ssisdb',
        schema: 'externalized_column_mappings',
        name: sidecar.frontmatter.name,
        outputPath: sidecarOutputPath,
      });
    }

    pendingPackageTargetUpdates.push({
      packageId: md.id,
      readsFrom: md.frontmatter.reads_from || [],
      writesTo: md.frontmatter.writes_to || [],
    });
  }

  for (const externalRecord of buildExternalSsisRecords(result, server)) {
    records.set(externalRecord.id.toLowerCase(), externalRecord);
  }

  let ssisSqlEndpointRecords = 0;
  for (const endpointRecord of buildSsisSqlEndpointRecords(records)) {
    records.set(endpointRecord.id.toLowerCase(), endpointRecord);
    ssisSqlEndpointRecords += 1;
  }

  const exactSsisPackageTableEdges = applyExactSsisPackageTableEdges(
    records,
    pendingPackageTargetUpdates
  );

  return {
    server,
    result,
    packageCount: catalog.length,
    edgeCount: result.lineageEdges.length,
    discoveredXmlFiles,
    processedXmlFiles,
    limited: ssisLimit > 0 && processedXmlFiles < discoveredXmlFiles,
    ssisSqlEndpointRecords,
    exactSsisPackageTableEdges,
    skipped,
  };
}

function applySsisBridgeInferences(records) {
  const tableCandidatesFor = createBridgeTableCandidateResolver(records);
  const tableTokenCache = new Map();
  let inferred = 0;

  const tableTokensFor = (table) => {
    const key = String(table.id || table.name || '').toLowerCase();
    if (!tableTokenCache.has(key)) {
      tableTokenCache.set(key, lineageTokens(table.name));
    }
    return tableTokenCache.get(key);
  };

  const chooseBestBridgeTarget = (tables, procTokens, stageTokens) => {
    let best = null;

    for (const table of tables) {
      const tableTokens = tableTokensFor(table);
      const baseScore =
        intersectionSize(tableTokens, procTokens) +
        intersectionSize(tableTokens, stageTokens);
      if (baseScore < 4) continue;

      const score = baseScore - lineageRolePenalty(table.name, procTokens);
      if (
        !best ||
        score > best.score ||
        (score === best.score &&
          String(table.name || '').localeCompare(String(best.table.name || '')) < 0)
      ) {
        best = { table, score };
      }
    }

    return best?.table || null;
  };

  for (const pkg of records.values()) {
    if (pkg.type !== 'package') continue;
    const writes = Array.isArray(pkg.frontmatter?.writes_to) ? pkg.frontmatter.writes_to : [];
    const calls = Array.isArray(pkg.frontmatter?.calls) ? pkg.frontmatter.calls : [];
    const stageWrites = [];

    for (const ref of writes) {
      const parsed = parseSqlId(ref);
      const db = parsed?.database?.toLowerCase();
      if (db !== 'stagingdb' && db !== 'etl_staging' && !db?.includes('staging')) continue;
      stageWrites.push({
        ref,
        parsed,
        record: records.get(String(ref).toLowerCase()),
      });
    }

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

        const target = chooseBestBridgeTarget(
          tableCandidatesFor(callDb, parsedCall.schema),
          procTokens,
          stageTokens
        );
        if (!target || target.id.toLowerCase() === stage.ref.toLowerCase()) continue;

        target.frontmatter.probable_edges = appendUniqueStructuredRecord(
          target.frontmatter.probable_edges,
          {
            source: stage.ref,
            via: pkg.id,
            relationship: 'stage_to_target_bridge_candidate',
            validation_status: 'review',
            confidence: 0.65,
            evidence_type: 'token_bridge_inference',
          }
        );
        target.frontmatter.contextual_reads = pushUniqueText(
          target.frontmatter.contextual_reads,
          stage.ref
        );
        target.frontmatter.tags = appendUniqueTag(
          target.frontmatter.tags,
          'lineage-review:ssis-bridge-candidate'
        );

        if (stage.record?.frontmatter) {
          stage.record.frontmatter.used_by = pushUniqueText(
            stage.record.frontmatter.used_by,
            target.id
          );
        }
        inferred += 1;
      }
    }
  }

  return inferred;
}

function applyExactPackageProcedureChainStitching(records) {
  let stitched = 0;

  for (const pkg of records.values()) {
    if (pkg.type !== 'package') continue;
    const calls = Array.isArray(pkg.frontmatter?.calls) ? pkg.frontmatter.calls : [];
    if (calls.length === 0) continue;

    for (const call of calls) {
      const proc = records.get(String(call || '').toLowerCase());
      const procWrites = Array.isArray(proc?.frontmatter?.writes_to)
        ? proc.frontmatter.writes_to
        : [];
      if (!proc || !['procedure', 'stored_procedure', 'proc'].includes(String(proc.type || proc.frontmatter?.type || '').toLowerCase())) {
        continue;
      }

      for (const targetId of procWrites) {
        const target = records.get(String(targetId || '').toLowerCase());
        if (!target || target.type !== 'table') continue;

        target.frontmatter.created_by = pushUniqueText(
          target.frontmatter.created_by,
          proc.id
        );
        target.frontmatter.created_via = pushUniqueText(
          target.frontmatter.created_via,
          pkg.id
        );
        target.frontmatter.depends_on = pushUniqueText(
          target.frontmatter.depends_on,
          proc.id
        );
        target.frontmatter.lineage_status = 'creator_found';
        target.frontmatter.tags = appendUniqueTag(
          target.frontmatter.tags,
          'lineage-stitch:package-procedure-writer'
        );
        proc.frontmatter.used_by = pushUniqueText(proc.frontmatter.used_by, target.id);
        stitched += 1;
      }
    }
  }

  return stitched;
}

function createBridgeTableCandidateResolver(records) {
  const tablesByDatabase = new Map();
  const candidateCache = new Map();

  for (const record of records.values()) {
    if (record.type !== 'table') continue;
    const database = String(record.database || '').toLowerCase();
    if (!database) continue;
    if (!tablesByDatabase.has(database)) tablesByDatabase.set(database, []);
    tablesByDatabase.get(database).push(record);
  }

  return (database, schema) => {
    const dbKey = String(database || '').toLowerCase();
    const schemaKey = String(schema || '').toLowerCase();
    const cacheKey = `${dbKey}|${schemaKey}`;
    if (candidateCache.has(cacheKey)) return candidateCache.get(cacheKey);

    const dbTables = tablesByDatabase.get(dbKey) || [];
    let candidates = dbTables;
    if (schemaKey) {
      candidates = [];
      for (const table of dbTables) {
        const tableSchema = String(table.schema || '').toLowerCase();
        if (!tableSchema || tableSchema === schemaKey) candidates.push(table);
      }
    }

    candidateCache.set(cacheKey, candidates);
    return candidates;
  };
}

function groupByProcessId(entries = []) {
  const grouped = new Map();
  for (const entry of entries) {
    const processId = String(entry.process_id || entry.package_id || '').trim();
    if (!processId) continue;
    const key = processId.toLowerCase();
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(entry);
  }
  return grouped;
}

function attachColumnLineageGroup(record, field, entries, limit, overflowMessage) {
  const uniqueEntries = uniqueStructuredRecords(entries);
  const embedded = uniqueEntries.slice(0, limit);
  if (embedded.length > 0) {
    record.frontmatter[field] = embedded;
  }

  if (uniqueEntries.length <= embedded.length) {
    return embedded.length;
  }

  const diagnostic = {
    process_id: record.id,
    reason: `${field}_payload_truncated`,
    evidence_type: 'column_lineage_resolution_summary',
    evidence_text: overflowMessage(uniqueEntries.length, embedded.length),
    total_records: uniqueEntries.length,
    embedded_records: embedded.length,
    validation_status: 'unresolved',
    suggested_action:
      'Use the rebuild summary or a dedicated column-lineage export before relying on the truncated markdown payload.',
  };

  record.frontmatter.unresolved_column_lineage = uniqueStructuredRecords([
    ...(record.frontmatter.unresolved_column_lineage || []),
    diagnostic,
  ]);
  return embedded.length;
}

function applyColumnLineageResolution(records) {
  const objects = new Map();
  const recordsById = new Map();

  for (const record of records.values()) {
    if (!record?.frontmatter) continue;
    const objectId = record.id || record.frontmatter.id;
    if (!record.frontmatter.id) record.frontmatter.id = objectId;
    objects.set(objectId, record.frontmatter);
    recordsById.set(String(objectId || '').toLowerCase(), record);
    delete record.frontmatter.column_lineage;
    delete record.frontmatter.unresolved_column_lineage;
  }

  const resolution = resolveColumnLineage(objects, {
    includeSqlUsage: false,
    maxSqlColumnLineageDiagnosticsPerObject: 40,
  });
  const validatedByProcess = groupByProcessId(resolution.validated);
  const nonPromotedByProcess = groupByProcessId([
    ...resolution.probable,
    ...resolution.unresolved,
    ...resolution.rejected,
  ]);

  let embeddedValidated = 0;
  let embeddedNonPromoted = 0;

  for (const [processKey, entries] of validatedByProcess.entries()) {
    const record = recordsById.get(processKey);
    if (!record) continue;
    embeddedValidated += attachColumnLineageGroup(
      record,
      'column_lineage',
      entries,
      COLUMN_LINEAGE_EMBED_LIMIT,
      (total, embedded) =>
        `Embedded ${embedded} of ${total} validated column lineage records in object markdown.`
    );
  }

  for (const [processKey, entries] of nonPromotedByProcess.entries()) {
    const record = recordsById.get(processKey);
    if (!record) continue;
    embeddedNonPromoted += attachColumnLineageGroup(
      record,
      'unresolved_column_lineage',
      entries,
      UNRESOLVED_COLUMN_LINEAGE_EMBED_LIMIT,
      (total, embedded) =>
        `Embedded ${embedded} of ${total} probable/unresolved/rejected column lineage diagnostics in object markdown.`
    );
  }

  return {
    validated: resolution.validated.length,
    probable: resolution.probable.length,
    unresolved: resolution.unresolved.length,
    rejected: resolution.rejected.length,
    embeddedValidated,
    embeddedNonPromoted,
  };
}

function score(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0;
  return Number(Math.max(0, Math.min(1, numeric)).toFixed(3));
}

function roundMetric(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0;
  return Number(numeric.toFixed(3));
}

function countArray(value) {
  return Array.isArray(value) ? value.length : 0;
}

function normalizedText(value) {
  return String(value || '').trim().toLowerCase();
}

function hasAnyPattern(value, patterns = []) {
  const text = String(value || '');
  return patterns.some((pattern) => pattern.test(text));
}

function appendUniqueTag(tags = [], tag = '') {
  const cleanTag = String(tag || '').trim();
  if (!cleanTag) return Array.isArray(tags) ? tags : [];
  const next = Array.isArray(tags) ? [...tags] : [];
  if (!next.some((existing) => normalizedText(existing) === normalizedText(cleanTag))) {
    next.push(cleanTag);
  }
  return next;
}

function hasHardCreatorEvidence(frontmatter = {}) {
  return (
    countArray(frontmatter.created_by) > 0 ||
    countArray(frontmatter.created_via) > 0 ||
    String(frontmatter.lineage_status || '') === 'creator_found'
  );
}

function effectiveRowCount(frontmatter = {}) {
  const live = Number(frontmatter.live_row_count ?? frontmatter.liveRowCount);
  if (Number.isFinite(live) && live >= 0) return live;
  const generated = Number(frontmatter.row_count ?? frontmatter.rowCount ?? 0);
  return Number.isFinite(generated) && generated >= 0 ? generated : 0;
}

function catalogFreshnessDiagnostic(frontmatter = {}) {
  const generated = Number(frontmatter.row_count ?? 0);
  const live = Number(frontmatter.live_row_count ?? frontmatter.liveRowCount);
  if (!Number.isFinite(live) || live < 0) return null;
  if (!Number.isFinite(generated) || generated !== 0 || live <= 0) return null;
  return {
    status: 'catalog_freshness_conflict',
    reason: 'generated_row_count_zero_but_live_row_count_positive',
    generated_row_count: generated,
    live_row_count: live,
  };
}

function applyCatalogFreshnessDiagnostics(records) {
  let conflicts = 0;

  for (const record of records.values()) {
    const fm = record.frontmatter;
    if (!fm) continue;
    const diagnostic = catalogFreshnessDiagnostic(fm);
    if (!diagnostic) continue;

    fm.catalog_freshness = diagnostic;
    fm.tags = appendUniqueTag(fm.tags, 'catalog-freshness:live-row-count-conflict');
    conflicts += 1;
  }

  return { conflicts };
}

function classifyLineageObjectRole(frontmatter = {}) {
  const type = normalizedText(frontmatter.type);
  const database = normalizedText(frontmatter.database);
  const schema = normalizedText(frontmatter.schema);
  const name = String(frontmatter.name || '').trim();
  const rowCount = effectiveRowCount(frontmatter);
  const hasHardCreator = hasHardCreatorEvidence(frontmatter);
  const directConsumers = countArray(frontmatter.used_by);
  const directReads = countArray(frontmatter.reads_from) + countArray(frontmatter.depends_on);
  const contextualReads = countArray(frontmatter.contextual_reads);
  const probableEdges = countArray(frontmatter.probable_edges);
  const columns = Array.isArray(frontmatter.columns) ? frontmatter.columns : [];
  const columnNames = new Set(
    columns
      .map((column) => normalizedText(column?.name || column?.column_name || ''))
      .filter(Boolean)
  );

  if (type === 'view') {
    return {
      lineage_role: 'view_or_helper_read_model',
      status: null,
      reason: 'view_dependency_surface',
      tag: 'lineage-role:view-helper-read-model',
    };
  }

  if (type !== 'table') return null;

  if (
    !hasHardCreator &&
    (
      hasAnyPattern(name, [
        /(^|[_-])queue([_-]|$)/i,
        /(^|[_-])process([_-]|$)/i,
        /(^|[_-])state([_-]|$)/i,
        /automation/i,
        /(^|[_-])pending([_-]|$)/i,
        /(^|[_-])retry([_-]|$)/i,
      ]) ||
      ['retrypending', 'retrycounter', 'recordcreationdate', 'recordcreatedate', 'processstate'].some((column) =>
        columnNames.has(column)
      )
    )
  ) {
    return {
      lineage_role: 'application_owned_process_table',
      status: 'application_owned_final_writer_unresolved',
      reason: 'queue_state_process_shape_without_writer',
      tag: 'lineage-role:application-owned-process',
      training_label: 'unresolved_final_writer',
    };
  }

  if (
    hasAnyPattern(name, [
      /(^|[_-])(bk|bkp|bak|backup)([_-]|$)/i,
      /(^|[_-])old([_-]|$)/i,
      /(^|[_-])orig([_-]|$)/i,
      /(^|[_-])copy([_-]|$)/i,
      /(^|[_-])(dev|uat|test)([_-]|$)/i,
      /(?:^|[_-])\d{8}$/i,
      /_\d{6,8}$/i,
    ])
  ) {
    return {
      lineage_role: 'clone_dev_backup_table',
      status: hasHardCreator ? null : 'clone_or_backup_unresolved',
      reason: 'clone_dev_backup_name_pattern',
      tag: 'lineage-role:clone-dev-backup',
    };
  }

  if (
    hasAnyPattern(name, [/manual/i, /reference/i, /seed/i, /static/i, /lookup/i]) &&
    !hasHardCreator &&
    rowCount <= 10000
  ) {
    return {
      lineage_role: 'manual_or_reference_seed',
      status: 'manual_or_reference_seed_unresolved',
      reason: 'small_manual_reference_without_writer',
      tag: 'lineage-role:manual-reference-seed',
    };
  }

  if (
    hasAnyPattern(name, [/test/i, /error[_-]?output/i, /bad[_-]?rows?/i, /reject/i, /failed/i]) &&
    !hasHardCreator &&
    rowCount <= 10000
  ) {
    return {
      lineage_role: 'test_or_error_artifact',
      status: 'test_or_error_artifact_unresolved',
      reason: 'test_error_output_without_writer',
      tag: 'lineage-role:test-error-artifact',
    };
  }

  if (
    database === 'sonic_dw' &&
    schema === 'dbo' &&
    hasAnyPattern(name, [/^stg_/i, /^wrk_/i, /^tmp_/i, /^update_/i, /^processed_/i, /audit/i]) &&
    !hasHardCreator &&
    rowCount === 0
  ) {
    return {
      lineage_role: 'transient_work_artifact',
      status: 'transient_work_artifact_unresolved',
      reason: 'empty_transient_work_name_without_writer',
      tag: 'lineage-role:transient-work-artifact',
    };
  }

  if (hasAnyPattern(name, [/xref/i, /xrf/i, /bridge/i, /mapping/i, /map$/i, /keylu/i])) {
    return {
      lineage_role: hasHardCreator
        ? 'loaded_xref_bridge_or_mapping'
        : directConsumers > 0
          ? 'xref_bridge_lookup_source'
          : 'xref_bridge_or_mapping_review',
      status: hasHardCreator ? null : 'xref_bridge_or_mapping_review',
      reason: hasHardCreator ? 'xref_mapping_has_writer' : 'xref_mapping_without_writer',
      tag: 'lineage-role:xref-bridge-map',
    };
  }

  if (
    database === 'sonic_dw' &&
    schema === 'dbo' &&
    hasAnyPattern(name, [/ops/i, /permission/i, /playbook/i, /txn/i, /error/i, /security/i, /audit/i, /survey/i])
  ) {
    return {
      lineage_role: hasHardCreator ? 'procedure_owned_operational_table' : 'operational_app_table_review',
      status: hasHardCreator ? null : 'operational_app_table_review',
      reason: hasHardCreator ? 'operational_table_has_procedure_writer' : 'operational_app_table_without_writer',
      tag: 'lineage-role:operational-app-table',
    };
  }

  if (
    database === 'vendordata' &&
    schema === 'dbo' &&
    !hasHardCreator &&
    contextualReads > 0 &&
    directReads === 0
  ) {
    return {
      lineage_role: 'external_vendor_output_unresolved',
      status: 'external_vendor_output_unresolved',
      reason: 'vendor_context_without_executable_writer',
      tag: 'lineage-role:external-vendor-output',
      training_label: 'unresolved_final_writer',
    };
  }

  if (!hasHardCreator && probableEdges > 0) {
    return {
      lineage_role: 'final_writer_unresolved_with_strong_upstream_evidence',
      status: 'final_writer_unresolved_with_strong_upstream_evidence',
      reason: 'probable_upstream_evidence_without_physical_writer',
      tag: 'lineage-role:final-writer-unresolved',
      training_label: 'unresolved_final_writer',
    };
  }

  if (['wrk', 'stage', 'stg'].includes(schema) && !hasHardCreator) {
    return {
      lineage_role: rowCount > 0 ? 'active_intermediate_review' : 'empty_intermediate_review',
      status: rowCount > 0 ? 'active_intermediate_unresolved' : 'empty_intermediate_unresolved',
      reason: rowCount > 0 ? 'intermediate_schema_populated_without_writer' : 'intermediate_schema_empty_without_writer',
      tag: 'lineage-role:intermediate-review',
    };
  }

  return null;
}

function applyLineageRoleClassifications(records) {
  let classified = 0;

  for (const record of records.values()) {
    const fm = record.frontmatter;
    if (!fm) continue;
    const classification = classifyLineageObjectRole(fm);
    if (!classification) continue;

    fm.lineage_role = classification.lineage_role;
    fm.lineage_classification_reason = classification.reason;
    fm.tags = appendUniqueTag(fm.tags, classification.tag);
    if (classification.training_label) {
      fm.training_label = classification.training_label;
    }
    if (classification.status && !hasHardCreatorEvidence(fm)) {
      fm.lineage_status = classification.status;
    }
    classified += 1;
  }

  return { classified };
}

function uniqueEdgeCount(frontmatter = {}) {
  const edgeRefs = new Set();
  const addRefs = (values = []) => {
    for (const ref of values || []) {
      const cleaned = String(ref || '').trim();
      if (cleaned) edgeRefs.add(cleaned);
    }
  };

  addRefs(frontmatter.depends_on);
  addRefs(frontmatter.reads_from);
  addRefs(frontmatter.writes_to);
  addRefs(frontmatter.calls);
  addRefs(frontmatter.created_by);
  addRefs(frontmatter.created_via);
  addRefs(frontmatter.used_by);
  return edgeRefs.size;
}

function averageConfidence(records = []) {
  let sum = 0;
  let count = 0;

  for (const record of records) {
    const value = Number(record?.confidence ?? 1);
    if (!Number.isFinite(value)) continue;
    sum += value;
    count += 1;
  }

  return count === 0 ? 1 : sum / count;
}

function confidenceLabel(overallScore, coverageScore, unresolvedRiskScore) {
  if (unresolvedRiskScore >= 0.6 || coverageScore < 0.35) return 'needs_review';
  if (overallScore >= 0.95) return 'very_high';
  if (overallScore >= 0.85) return 'high';
  if (overallScore >= 0.7) return 'medium';
  if (overallScore >= 0.5) return 'low';
  return 'needs_review';
}

function confidenceWarnings(frontmatter = {}, evidence = {}) {
  const warnings = [];
  const packageName = String(frontmatter.package_name || frontmatter.name || '');

  if (evidence.direct_edge_count === 0 && evidence.unresolved_edge_facts === 0) {
    warnings.push('no_direct_lineage_edges');
  }
  if (evidence.unresolved_edge_facts > 0) warnings.push('unresolved_lineage_facts_present');
  if (evidence.unresolved_column_lineage > 0) warnings.push('unresolved_column_lineage_present');
  if (evidence.unresolved_column_usage > 0) warnings.push('unresolved_column_usage_present');
  if (evidence.column_risk_flags > 0) warnings.push('column_risk_flags_present');
  if (/copy/i.test(packageName) && evidence.unresolved_edge_facts > 0) {
    warnings.push('generic_copy_package_partial_coverage');
  }
  if (
    (frontmatter.column_risk_flags || []).some((flag) =>
      /dynamic/i.test(String(flag?.flag_type || flag?.reason || flag?.evidence_type || ''))
    )
  ) {
    warnings.push('dynamic_sql_or_dynamic_reference_present');
  }

  return unique(warnings);
}

function buildCatalogConfidence(frontmatter = {}) {
  const lineageQuality = frontmatter.lineage_quality || {};
  const directEdgeCount = uniqueEdgeCount(frontmatter);
  const validatedEdges = Math.max(Number(lineageQuality.validated_edges || 0), directEdgeCount);
  const probableEdges = Number(lineageQuality.probable_edges || 0);
  const unresolvedEdgeFacts =
    Number(lineageQuality.unresolved_facts || 0) +
    countArray(frontmatter.unresolved_ssis_column_mappings);
  const promotedEdgeFacts = validatedEdges + probableEdges;
  const edgeEvidenceTotal = promotedEdgeFacts + unresolvedEdgeFacts;

  const columnLineage = countArray(frontmatter.column_lineage);
  const unresolvedColumnLineage = countArray(frontmatter.unresolved_column_lineage);
  const columnUsage = countArray(frontmatter.column_usage);
  const unresolvedColumnUsage = countArray(frontmatter.unresolved_column_usage);
  const columnRiskFlags = countArray(frontmatter.column_risk_flags);
  const columnEvidenceTotal =
    columnLineage + unresolvedColumnLineage + columnUsage + unresolvedColumnUsage + columnRiskFlags;

  const edgeCorrectnessScore =
    promotedEdgeFacts > 0
      ? score((validatedEdges + probableEdges * 0.85) / promotedEdgeFacts)
      : unresolvedEdgeFacts > 0
        ? 0.25
        : 1;
  const coverageScore =
    edgeEvidenceTotal > 0
      ? score((validatedEdges + probableEdges * 0.75) / edgeEvidenceTotal)
      : directEdgeCount > 0
        ? 0.85
        : 0.7;
  const columnLineageScore =
    columnEvidenceTotal > 0
      ? score(
          averageConfidence(frontmatter.column_lineage || []) *
            (columnLineage + columnUsage * 0.6) /
            columnEvidenceTotal
        )
      : countArray(frontmatter.columns) > 0
        ? 0.75
        : 0.9;
  const unresolvedRiskScore = score(
    (unresolvedEdgeFacts + unresolvedColumnLineage + unresolvedColumnUsage + columnRiskFlags) /
      Math.max(
        1,
        edgeEvidenceTotal +
          columnEvidenceTotal +
          countArray(frontmatter.columns) +
          countArray(frontmatter.ssis_column_mappings)
      )
  );
  const overallScore = score(
    edgeCorrectnessScore * 0.35 +
      coverageScore * 0.35 +
      columnLineageScore * 0.2 +
      (1 - unresolvedRiskScore) * 0.1
  );
  const evidenceCounts = {
    direct_edge_count: directEdgeCount,
    validated_edges: validatedEdges,
    probable_edges: probableEdges,
    unresolved_edge_facts: unresolvedEdgeFacts,
    column_lineage: columnLineage,
    unresolved_column_lineage: unresolvedColumnLineage,
    column_usage: columnUsage,
    unresolved_column_usage: unresolvedColumnUsage,
    column_risk_flags: columnRiskFlags,
    ssis_column_mappings: countArray(frontmatter.ssis_column_mappings),
    unresolved_ssis_column_mappings: countArray(frontmatter.unresolved_ssis_column_mappings),
  };

  return {
    overall_score: overallScore,
    edge_correctness_score: edgeCorrectnessScore,
    coverage_score: coverageScore,
    column_lineage_score: columnLineageScore,
    unresolved_risk_score: unresolvedRiskScore,
    confidence_label: confidenceLabel(overallScore, coverageScore, unresolvedRiskScore),
    evidence_counts: evidenceCounts,
    warnings: confidenceWarnings(frontmatter, evidenceCounts),
    scoring_version: 'catalog-confidence-v1',
  };
}

function applyCatalogConfidence(records) {
  const summary = {
    scoredObjects: 0,
    veryHigh: 0,
    high: 0,
    medium: 0,
    low: 0,
    needsReview: 0,
  };

  for (const record of records.values()) {
    if (!record?.frontmatter) continue;
    record.frontmatter.catalog_confidence = buildCatalogConfidence(record.frontmatter);
    summary.scoredObjects += 1;
    const label = record.frontmatter.catalog_confidence.confidence_label;
    if (label === 'very_high') summary.veryHigh += 1;
    else if (label === 'high') summary.high += 1;
    else if (label === 'medium') summary.medium += 1;
    else if (label === 'low') summary.low += 1;
    else summary.needsReview += 1;
  }

  return summary;
}

function applyDictionaryEnrichment(records) {
  const summary = {
    enrichedObjects: 0,
    enrichedColumns: 0,
    inferredMetrics: 0,
    sensitiveColumns: 0,
  };

  for (const record of records.values()) {
    if (!record?.frontmatter) continue;
    record.frontmatter = applyDictionaryEnrichmentContract(record.frontmatter, {
      enrichedAt: record.frontmatter.extracted_at || new Date().toISOString(),
    });
    summary.enrichedObjects += 1;

    if (Array.isArray(record.frontmatter.columns)) {
      summary.enrichedColumns += record.frontmatter.columns.length;
      summary.inferredMetrics += record.frontmatter.columns.filter((column) => column.is_metric).length;
      summary.sensitiveColumns += record.frontmatter.columns.filter((column) =>
        ['restricted', 'confidential'].includes(String(column.sensitivity || '').toLowerCase())
      ).length;
    }
  }

  return summary;
}

function average(values = []) {
  let sum = 0;
  let count = 0;

  for (const value of values) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) continue;
    sum += numeric;
    count += 1;
  }

  return count === 0 ? 0 : score(sum / count);
}

function ratio(part, total) {
  const denominator = Number(total);
  if (!Number.isFinite(denominator) || denominator <= 0) return 0;
  return score(Number(part || 0) / denominator);
}

function recordConfidence(record = {}) {
  return record.frontmatter?.catalog_confidence || null;
}

function recordObjectId(record = {}) {
  return record.id || record.frontmatter?.id || '';
}

function recordSourceKey(record = {}) {
  const frontmatter = record.frontmatter || {};
  const server = frontmatter.server || record.server || 'unknown';
  const database = frontmatter.database || record.database || 'unknown';
  return `${server}.${database}`;
}

function unresolvedFactCount(record = {}) {
  const frontmatter = record.frontmatter || {};
  const lineageQuality = frontmatter.lineage_quality || {};
  return (
    Number(lineageQuality.unresolved_facts || 0) +
    countArray(frontmatter.unresolved_column_lineage) +
    countArray(frontmatter.unresolved_column_usage) +
    countArray(frontmatter.unresolved_ssis_column_mappings)
  );
}

function summarizeConfidence(recordList = []) {
  const summary = {
    total_objects: recordList.length,
    scored_objects: 0,
    missing_confidence_objects: 0,
    distribution: {
      very_high: 0,
      high: 0,
      medium: 0,
      low: 0,
      needs_review: 0,
      missing: 0,
    },
    average_scores: {
      overall: 0,
      edge_correctness: 0,
      coverage: 0,
      column_lineage: 0,
      unresolved_risk: 0,
    },
    low_or_needs_review_objects: 0,
    low_or_needs_review_ratio: 0,
  };
  const scoreTotals = {
    overall: { sum: 0, count: 0 },
    edge_correctness: { sum: 0, count: 0 },
    coverage: { sum: 0, count: 0 },
    column_lineage: { sum: 0, count: 0 },
    unresolved_risk: { sum: 0, count: 0 },
  };
  const addScore = (key, value) => {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return;
    scoreTotals[key].sum += numeric;
    scoreTotals[key].count += 1;
  };
  const averageScore = (key) => {
    const total = scoreTotals[key];
    return total.count === 0 ? 0 : score(total.sum / total.count);
  };

  for (const record of recordList) {
    const confidence = recordConfidence(record);
    if (!confidence) {
      summary.missing_confidence_objects += 1;
      summary.distribution.missing += 1;
      continue;
    }

    summary.scored_objects += 1;
    const label = confidence.confidence_label || 'missing';
    if (Object.hasOwn(summary.distribution, label)) {
      summary.distribution[label] += 1;
    } else {
      summary.distribution.missing += 1;
    }

    if (label === 'low' || label === 'needs_review') {
      summary.low_or_needs_review_objects += 1;
    }

    addScore('overall', confidence.overall_score);
    addScore('edge_correctness', confidence.edge_correctness_score);
    addScore('coverage', confidence.coverage_score);
    addScore('column_lineage', confidence.column_lineage_score);
    addScore('unresolved_risk', confidence.unresolved_risk_score);
  }

  summary.average_scores = {
    overall: averageScore('overall'),
    edge_correctness: averageScore('edge_correctness'),
    coverage: averageScore('coverage'),
    column_lineage: averageScore('column_lineage'),
    unresolved_risk: averageScore('unresolved_risk'),
  };
  summary.low_or_needs_review_ratio = ratio(
    summary.low_or_needs_review_objects,
    summary.scored_objects
  );
  return summary;
}

function summarizeSources(recordList = []) {
  const grouped = new Map();
  for (const record of recordList) {
    const key = recordSourceKey(record);
    if (!grouped.has(key)) {
      grouped.set(key, {
        source_key: key,
        object_count: 0,
        scored_objects: 0,
        low_or_needs_review_objects: 0,
        unresolved_facts: 0,
        score_total: 0,
      });
    }

    const source = grouped.get(key);
    source.object_count += 1;
    source.unresolved_facts += unresolvedFactCount(record);
    const confidence = recordConfidence(record);
    if (!confidence) continue;
    source.scored_objects += 1;
    source.score_total += Number(confidence.overall_score || 0);
    if (
      confidence.confidence_label === 'low' ||
      confidence.confidence_label === 'needs_review'
    ) {
      source.low_or_needs_review_objects += 1;
    }
  }

  const sources = [];
  for (const source of grouped.values()) {
    sources.push({
      source_key: source.source_key,
      object_count: source.object_count,
      scored_objects: source.scored_objects,
      average_confidence: average([
        source.scored_objects > 0 ? source.score_total / source.scored_objects : 0,
      ]),
      low_or_needs_review_objects: source.low_or_needs_review_objects,
      low_or_needs_review_ratio: ratio(
        source.low_or_needs_review_objects,
        source.scored_objects
      ),
      unresolved_facts: source.unresolved_facts,
    });
  }

  return sources.sort((left, right) => left.source_key.localeCompare(right.source_key));
}

function packageConfidenceIndex(recordList = []) {
  const index = {};
  for (const record of recordList) {
    if (record.frontmatter?.type !== 'package') continue;
    const confidence = recordConfidence(record);
    if (!confidence) continue;
    const id = recordObjectId(record);
    index[id] = {
      id,
      name: record.frontmatter.name || record.frontmatter.package_name || id,
      score: Number(confidence.overall_score || 0),
      label: confidence.confidence_label || 'unknown',
      unresolved_facts: unresolvedFactCount(record),
      reads: countArray(record.frontmatter.reads_from),
      writes: countArray(record.frontmatter.writes_to),
      validated_edges: Number(record.frontmatter.lineage_quality?.validated_edges || 0),
    };
  }
  return index;
}

function objectConfidenceRows(recordList = []) {
  const rows = [];

  for (const record of recordList) {
    const confidence = recordConfidence(record);
    const objectId = recordObjectId(record);
    rows.push({
      id: objectId,
      name: record.frontmatter?.name || record.name || objectId,
      type: record.frontmatter?.type || record.type || 'unknown',
      source_key: recordSourceKey(record),
      score: confidence ? Number(confidence.overall_score || 0) : null,
      label: confidence?.confidence_label || 'missing',
      unresolved_facts: unresolvedFactCount(record),
    });
  }

  return rows.sort((left, right) => {
    const leftScore = left.score ?? -1;
    const rightScore = right.score ?? -1;
    return leftScore - rightScore || right.unresolved_facts - left.unresolved_facts;
  });
}

function comparePackageConfidence(currentIndex = {}, previousIndex = {}) {
  const regressions = [];

  for (const current of Object.values(currentIndex)) {
    const previous = previousIndex[current.id];
    if (!previous || !Number.isFinite(Number(previous.score))) continue;
    const previousScore = Number(previous.score);
    const delta = roundMetric(current.score - previousScore);
    if (delta >= 0) continue;
    regressions.push({
      id: current.id,
      name: current.name,
      previous_score: score(previousScore),
      current_score: score(current.score),
      delta,
      previous_label: previous.label || 'unknown',
      current_label: current.label || 'unknown',
      current_unresolved_facts: current.unresolved_facts,
    });
  }

  return regressions
    .sort((left, right) => left.delta - right.delta)
    .slice(0, 25);
}

function edgeDelta(current, previous) {
  const currentValue = Number(current || 0);
  const previousValue = Number(previous || 0);
  return {
    current: currentValue,
    previous: Number.isFinite(previousValue) ? previousValue : 0,
    delta: currentValue - (Number.isFinite(previousValue) ? previousValue : 0),
    delta_ratio:
      Number.isFinite(previousValue) && previousValue > 0
        ? roundMetric((currentValue - previousValue) / previousValue)
        : null,
  };
}

function evaluateRebuildGates(report, thresholds = DEFAULT_REBUILD_GATES) {
  thresholds = { ...DEFAULT_REBUILD_GATES, ...thresholds };
  const checks = [];
  const addCheck = (name, passed, severity, details = {}) => {
    checks.push({
      name,
      passed: Boolean(passed),
      severity,
      ...details,
    });
  };

  addCheck('invalid_objects', report.validation.invalid_objects <= thresholds.maxInvalidObjects, 'fail', {
    current: report.validation.invalid_objects,
    max: thresholds.maxInvalidObjects,
  });
  addCheck(
    'missing_confidence_objects',
    report.confidence.missing_confidence_objects <= thresholds.maxMissingConfidenceObjects,
    'fail',
    {
      current: report.confidence.missing_confidence_objects,
      max: thresholds.maxMissingConfidenceObjects,
    }
  );
  addCheck(
    'low_needs_review_ratio',
    report.confidence.low_or_needs_review_ratio <= thresholds.maxLowNeedsReviewRatio,
    'warn',
    {
      current: report.confidence.low_or_needs_review_ratio,
      max: thresholds.maxLowNeedsReviewRatio,
    }
  );
  addCheck(
    'average_confidence',
    report.confidence.average_scores.overall >= thresholds.minAverageConfidence,
    'warn',
    {
      current: report.confidence.average_scores.overall,
      min: thresholds.minAverageConfidence,
    }
  );
  addCheck(
    'unresolved_fact_ratio',
    report.metrics.unresolved_fact_ratio <= thresholds.maxUnresolvedFactRatio,
    'warn',
    {
      current: report.metrics.unresolved_fact_ratio,
      max: thresholds.maxUnresolvedFactRatio,
    }
  );

  const ssisEdgeDeltaRatio = report.edge_deltas.ssis_edges.delta_ratio;
  addCheck(
    'ssis_edge_drop',
    ssisEdgeDeltaRatio === null || ssisEdgeDeltaRatio >= -thresholds.maxSsisEdgeDropRatio,
    'fail',
    {
      current: ssisEdgeDeltaRatio,
      min: -thresholds.maxSsisEdgeDropRatio,
    }
  );

  for (const source of report.new_data_sources) {
    if (source.object_count < thresholds.minNewSourceObjectsForGate) continue;
    addCheck(
      `new_source_average_confidence:${source.source_key}`,
      source.average_confidence >= thresholds.minNewSourceAverageConfidence,
      'warn',
      {
        source_key: source.source_key,
        current: source.average_confidence,
        min: thresholds.minNewSourceAverageConfidence,
      }
    );
    addCheck(
      `new_source_low_needs_review_ratio:${source.source_key}`,
      source.low_or_needs_review_ratio <= thresholds.maxNewSourceLowNeedsReviewRatio,
      'warn',
      {
        source_key: source.source_key,
        current: source.low_or_needs_review_ratio,
        max: thresholds.maxNewSourceLowNeedsReviewRatio,
      }
    );
  }

  const failed = [];
  const warnings = [];
  for (const check of checks) {
    if (check.passed) continue;
    if (check.severity === 'fail') {
      failed.push(check);
    } else {
      warnings.push(check);
    }
  }

  return {
    status: failed.length > 0 ? 'failed' : warnings.length > 0 ? 'warning' : 'passed',
    enforceable: ENFORCE_REBUILD_GATES,
    thresholds,
    failed,
    warnings,
    checks,
  };
}

function buildRebuildReport({ summary, recordList, previousReport = null, thresholds = {} }) {
  const mergedThresholds = { ...DEFAULT_REBUILD_GATES, ...thresholds };
  const confidence = summarizeConfidence(recordList);
  const rows = objectConfidenceRows(recordList);
  const sourceSummary = summarizeSources(recordList);
  const currentPackageIndex = packageConfidenceIndex(recordList);
  const previousPackageIndex = previousReport?.package_confidence_index || {};
  const previousSources = new Set();
  for (const source of previousReport?.source_summary || []) {
    previousSources.add(source.source_key);
  }

  const lowOrNeedsReviewTop = [];
  const topUnresolvedObjects = [];
  for (const row of rows) {
    if (
      lowOrNeedsReviewTop.length < 50 &&
      (row.label === 'low' || row.label === 'needs_review')
    ) {
      lowOrNeedsReviewTop.push(row);
    }
    if (row.unresolved_facts > 0) {
      topUnresolvedObjects.push(row);
    }
  }
  topUnresolvedObjects.sort(
    (left, right) => right.unresolved_facts - left.unresolved_facts
  );
  topUnresolvedObjects.length = Math.min(topUnresolvedObjects.length, 50);

  const newDataSources = [];
  if (previousSources.size > 0) {
    for (const source of sourceSummary) {
      if (!previousSources.has(source.source_key)) newDataSources.push(source);
    }
  }

  let totalUnresolvedFacts = 0;
  let totalDirectEdgeRefs = 0;
  let totalColumnLineageRecords = 0;

  for (const record of recordList) {
    totalUnresolvedFacts += unresolvedFactCount(record);
    totalDirectEdgeRefs += uniqueEdgeCount(record.frontmatter || {});
    totalColumnLineageRecords += countArray(record.frontmatter?.column_lineage);
  }

  const report = {
    generated_at: new Date().toISOString(),
    generator: 'scripts/rebuild-catalog-from-raw.mjs',
    report_version: 'rebuild-report-v1',
    validation: {
      loaded_objects: summary.loadedObjects,
      invalid_objects: summary.invalidObjects,
      invalid_sample: summary.invalidSample,
    },
    confidence,
    metrics: {
      sql_objects: summary.sqlObjects,
      ssis_packages: summary.ssisPackages,
      ssis_edges: summary.ssisEdges,
      direct_edge_refs: totalDirectEdgeRefs,
      column_lineage_records: totalColumnLineageRecords,
      unresolved_facts: totalUnresolvedFacts,
      unresolved_fact_ratio: ratio(
        totalUnresolvedFacts,
        totalUnresolvedFacts + totalDirectEdgeRefs + totalColumnLineageRecords
      ),
      ssis_sql_endpoint_records: summary.ssisSqlEndpointRecords || 0,
      quarantined_sql_raw_records: summary.quarantinedSqlRawCount || 0,
    },
    edge_deltas: {
      ssis_edges: edgeDelta(summary.ssisEdges, previousReport?.metrics?.ssis_edges),
      direct_edge_refs: edgeDelta(
        totalDirectEdgeRefs,
        previousReport?.metrics?.direct_edge_refs
      ),
      column_lineage_records: edgeDelta(
        totalColumnLineageRecords,
        previousReport?.metrics?.column_lineage_records
      ),
    },
    low_or_needs_review_top: lowOrNeedsReviewTop,
    top_unresolved_objects: topUnresolvedObjects,
    package_confidence_regressions: comparePackageConfidence(
      currentPackageIndex,
      previousPackageIndex
    ),
    new_data_sources: newDataSources,
    source_summary: sourceSummary,
    package_confidence_index: currentPackageIndex,
  };

  report.gates = evaluateRebuildGates(report, mergedThresholds);
  return report;
}

function renderRebuildReportMarkdown(report) {
  const lines = [
    '# Catalog Rebuild Report',
    '',
    `- Generated At: ${report.generated_at}`,
    `- Gate Status: ${report.gates.status}`,
    `- Loaded Objects: ${report.validation.loaded_objects}`,
    `- Invalid Objects: ${report.validation.invalid_objects}`,
    '',
    '## Confidence Distribution',
    '',
    `- Very High: ${report.confidence.distribution.very_high}`,
    `- High: ${report.confidence.distribution.high}`,
    `- Medium: ${report.confidence.distribution.medium}`,
    `- Low: ${report.confidence.distribution.low}`,
    `- Needs Review: ${report.confidence.distribution.needs_review}`,
    `- Missing Confidence: ${report.confidence.distribution.missing}`,
    `- Low/Needs Review Objects: ${report.confidence.low_or_needs_review_objects}`,
    `- Average Overall Confidence: ${report.confidence.average_scores.overall}`,
    `- Average Edge Correctness: ${report.confidence.average_scores.edge_correctness}`,
    `- Average Column Lineage: ${report.confidence.average_scores.column_lineage}`,
    '',
    '## Unresolved Facts',
    '',
    `- Total Unresolved Facts: ${report.metrics.unresolved_facts}`,
    `- Unresolved Fact Ratio: ${report.metrics.unresolved_fact_ratio}`,
    `- Quarantined SQL Raw Records: ${report.metrics.quarantined_sql_raw_records}`,
    '',
    '## Edge Deltas',
    '',
    `- SSIS Edges: ${report.edge_deltas.ssis_edges.current} (${report.edge_deltas.ssis_edges.delta >= 0 ? '+' : ''}${report.edge_deltas.ssis_edges.delta})`,
    `- Direct Edge Refs: ${report.edge_deltas.direct_edge_refs.current} (${report.edge_deltas.direct_edge_refs.delta >= 0 ? '+' : ''}${report.edge_deltas.direct_edge_refs.delta})`,
    `- Column Lineage Records: ${report.edge_deltas.column_lineage_records.current} (${report.edge_deltas.column_lineage_records.delta >= 0 ? '+' : ''}${report.edge_deltas.column_lineage_records.delta})`,
    '',
    '## Top Packages Losing Confidence',
    '',
  ];

  if (report.package_confidence_regressions.length === 0) {
    lines.push('- No package confidence regressions detected.');
  } else {
    let renderedPackages = 0;
    for (const pkg of report.package_confidence_regressions) {
      if (renderedPackages >= 10) break;
      lines.push(
        `- ${pkg.name}: ${pkg.previous_score} -> ${pkg.current_score} (${pkg.delta})`
      );
      renderedPackages += 1;
    }
  }

  lines.push('', '## Gate Warnings And Failures', '');
  if (report.gates.failed.length === 0 && report.gates.warnings.length === 0) {
    lines.push('- No gate failures or warnings.');
  } else {
    for (const issue of report.gates.failed) {
      lines.push(`- ${issue.severity.toUpperCase()} ${issue.name}: ${JSON.stringify(issue)}`);
    }
    for (const issue of report.gates.warnings) {
      lines.push(`- ${issue.severity.toUpperCase()} ${issue.name}: ${JSON.stringify(issue)}`);
    }
  }

  lines.push('', '## New Data Source Onboarding Gate', '');
  if (report.new_data_sources.length === 0) {
    lines.push('- No new data sources detected against the previous report baseline.');
  } else {
    let renderedSources = 0;
    for (const source of report.new_data_sources) {
      if (renderedSources >= 25) break;
      lines.push(
        `- ${source.source_key}: objects=${source.object_count}, avg=${source.average_confidence}, low_or_needs_review=${source.low_or_needs_review_ratio}`
      );
      renderedSources += 1;
    }
  }

  return `${lines.join('\n')}\n`;
}

async function writeRebuildReport(report) {
  await fs.mkdir(OUTPUT_ROOT, { recursive: true });
  await fs.writeFile(REBUILD_REPORT_JSON_PATH, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  await fs.writeFile(REBUILD_REPORT_MARKDOWN_PATH, renderRebuildReportMarkdown(report), 'utf8');
  return {
    json: REBUILD_REPORT_JSON_PATH,
    markdown: REBUILD_REPORT_MARKDOWN_PATH,
  };
}

async function backupExistingServers() {
  if (process.argv.includes('--in-place')) {
    return { mode: 'in_place_requested', path: null };
  }

  try {
    await fs.access(OUTPUT_SERVERS_ROOT);
  } catch {
    return { mode: 'not_needed', path: null };
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupRoot = path.join(OUTPUT_ROOT, '_rebuild_backups');
  const backupPath = path.join(backupRoot, `servers_${timestamp}`);
  await fs.mkdir(backupRoot, { recursive: true });

  try {
    await fs.rename(OUTPUT_SERVERS_ROOT, backupPath);
    console.log(`[rebuild] moved existing servers folder to backup ${backupPath}`);
    return { mode: 'moved', path: backupPath };
  } catch (err) {
    const moveMessage = err.code || err.message;
    let copySucceeded = false;

    try {
      await fs.cp(OUTPUT_SERVERS_ROOT, backupPath, {
        recursive: true,
        errorOnExist: true,
        force: false,
      });
      copySucceeded = true;
      console.warn(
        `[rebuild] could not move existing servers folder for backup (${moveMessage}); copied backup to ${backupPath}`
      );
    } catch (copyErr) {
      console.warn(
        `[rebuild] could not copy existing servers folder for backup after move failed (${copyErr.code || copyErr.message})`
      );
      await fs.rm(backupPath, { recursive: true, force: true }).catch(() => {});
    }

    if (process.argv.includes('--clean')) {
      try {
        await fs.rm(OUTPUT_SERVERS_ROOT, { recursive: true, force: true });
        console.warn(
          `[rebuild] removed existing servers folder for clean rebuild after backup move failed (${moveMessage})`
        );
        return {
          mode: copySucceeded ? 'copied_then_removed_for_clean' : 'removed_for_clean_without_backup',
          path: copySucceeded ? backupPath : null,
          warning: copySucceeded
            ? 'Backup move failed; copied backup before clean rebuild.'
            : 'Backup move and copy failed; clean rebuild removed existing servers without backup.',
        };
      } catch (removeErr) {
        console.warn(
          `[rebuild] clean remove failed (${removeErr.code || removeErr.message}); rebuilding in place`
        );
        return {
          mode: copySucceeded ? 'copied_then_in_place' : 'in_place_without_backup',
          path: copySucceeded ? backupPath : null,
          warning: copySucceeded
            ? 'Backup move failed and clean remove failed; copied backup exists but rebuild continued in place.'
            : 'Backup move, copy, and clean remove failed; rebuild continued in place without backup.',
        };
      }
    }

    console.warn('[rebuild] rebuilding in place; pass --clean only when a clean remove is intended');
    return {
      mode: copySucceeded ? 'copied_then_in_place' : 'in_place_without_backup',
      path: copySucceeded ? backupPath : null,
      warning: copySucceeded
        ? 'Backup move failed; copied backup exists but rebuild continued in place.'
        : 'Backup move and copy failed; rebuild continued in place without backup.',
    };
  }
}

async function writeRecords(records, ssisSummary) {
  await fs.mkdir(OUTPUT_SERVERS_ROOT, { recursive: true });
  let filesWritten = 0;
  const generatedFiles = [];

  for (const record of records.values()) {
    let outputPath;
    if (record.outputPath) {
      outputPath = record.outputPath;
    } else if (record.type === 'package') {
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

    const body =
      record.body !== undefined
        ? record.body || ''
        : record.sourcePath
          ? await readMarkdownBodyContent(record.sourcePath)
          : '';
    const content = `${renderFrontmatter(record.frontmatter)}${body}`;
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
  const files = await getMarkdownFiles(OUTPUT_ROOT);
  const invalid = [];

  for (const filePath of files) {
    try {
      const object = await parseMarkdownMetadataFile(filePath);
      const errors = validateMetadata(object);
      if (errors.length > 0) {
        invalid.push({ id: object.id, errors });
      }
    } catch (err) {
      invalid.push({ id: filePath, errors: [err.message] });
    }
  }

  return { objectCount: files.length, invalid };
}

function validateRecords(records) {
  const invalid = [];

  for (const record of records.values()) {
    try {
      const errors = validateMetadata(record.frontmatter || {});
      if (errors.length > 0) {
        invalid.push({ id: record.id || record.frontmatter?.id || 'unknown', errors });
      }
    } catch (err) {
      invalid.push({
        id: record.id || record.frontmatter?.id || 'unknown',
        errors: [err.message],
      });
    }
  }

  return { objectCount: records.size, invalid };
}

function summarizeRecordMetrics(recordList) {
  const metrics = {
    sqlObjects: 0,
    columnInventoryObjects: 0,
    columnInventoryColumns: 0,
    columnUsageObjects: 0,
    columnUsageRecords: 0,
    unresolvedColumnUsageObjects: 0,
    unresolvedColumnUsageRecords: 0,
    columnRiskFlagObjects: 0,
    columnRiskFlags: 0,
    columnLineageObjects: 0,
    columnLineageRecords: 0,
    unresolvedColumnLineageObjects: 0,
    unresolvedColumnLineageRecords: 0,
    ssisColumnMappingObjects: 0,
    ssisColumnMappings: 0,
    unresolvedSsisColumnMappingObjects: 0,
    unresolvedSsisColumnMappings: 0,
  };

  for (const record of recordList) {
    const frontmatter = record.frontmatter || {};
    if (record.type !== 'package') metrics.sqlObjects += 1;

    const columns = countArray(frontmatter.columns);
    if (columns > 0) {
      metrics.columnInventoryObjects += 1;
      metrics.columnInventoryColumns += columns;
    }

    const columnUsage = countArray(frontmatter.column_usage);
    if (columnUsage > 0) {
      metrics.columnUsageObjects += 1;
      metrics.columnUsageRecords += columnUsage;
    }

    const unresolvedColumnUsage = countArray(frontmatter.unresolved_column_usage);
    if (unresolvedColumnUsage > 0) {
      metrics.unresolvedColumnUsageObjects += 1;
      metrics.unresolvedColumnUsageRecords += unresolvedColumnUsage;
    }

    const columnRiskFlags = countArray(frontmatter.column_risk_flags);
    if (columnRiskFlags > 0) {
      metrics.columnRiskFlagObjects += 1;
      metrics.columnRiskFlags += columnRiskFlags;
    }

    const columnLineage = countArray(frontmatter.column_lineage);
    if (columnLineage > 0) {
      metrics.columnLineageObjects += 1;
      metrics.columnLineageRecords += columnLineage;
    }

    const unresolvedColumnLineage = countArray(frontmatter.unresolved_column_lineage);
    if (unresolvedColumnLineage > 0) {
      metrics.unresolvedColumnLineageObjects += 1;
      metrics.unresolvedColumnLineageRecords += unresolvedColumnLineage;
    }

    const ssisColumnMappings = countArray(frontmatter.ssis_column_mappings);
    if (ssisColumnMappings > 0) {
      metrics.ssisColumnMappingObjects += 1;
      metrics.ssisColumnMappings += ssisColumnMappings;
    }

    const unresolvedSsisColumnMappings = countArray(frontmatter.unresolved_ssis_column_mappings);
    if (unresolvedSsisColumnMappings > 0) {
      metrics.unresolvedSsisColumnMappingObjects += 1;
      metrics.unresolvedSsisColumnMappings += unresolvedSsisColumnMappings;
    }
  }

  return metrics;
}

async function main() {
  const memoryCheckpoints = [];
  const recordMemory = (phase) => {
    if (DRY_RUN_REBUILD || DEBUG_REBUILD) {
      memoryCheckpoints.push({ phase, ...memoryUsageMb() });
    }
  };

  recordMemory('start');
  const aliases = await readJsonIfExists(ALIAS_CONFIG_PATH, {});
  recordMemory('aliases_loaded');
  const previousRebuildReport = DRY_RUN_REBUILD
    ? null
    : await readJsonIfExists(REBUILD_REPORT_JSON_PATH, null);
  const existingSsisCatalog = await loadExistingSsisCatalog();
  recordMemory('existing_ssis_catalog_loaded');
  const backup = DRY_RUN_REBUILD
    ? { mode: 'dry_run', path: null }
    : await backupExistingServers();
  logRebuildPhase('loading raw SQL metadata');
  const { records, skipped: skippedSql, quarantined: quarantinedSqlRaw } = await loadSqlRawObjects(aliases);
  recordMemory('sql_raw_loaded');
  logRebuildPhase(`loaded ${records.size} SQL objects`);
  logRebuildPhase('rewriting SQL lineage');
  const referenceIndex = rewriteSqlLineage(records, aliases);
  applyForwardSqlEdges(records, referenceIndex);
  recordMemory('sql_lineage_rewritten');
  logRebuildPhase('expanding synonym source reads');
  const synonymSourceExpansionSummary = applySynonymSourceExpansion(records);
  recordMemory('synonym_source_reads_expanded');
  logRebuildPhase('rebuilding SSIS metadata');
  const ssisSummary = await rebuildSsis(aliases, referenceIndex, records, existingSsisCatalog, {
    ssisLimit: SSIS_REBUILD_LIMIT,
  });
  recordMemory('ssis_rebuilt');
  logRebuildPhase('stitching exact package-procedure writer chains');
  const exactPackageProcedureChains = applyExactPackageProcedureChainStitching(records);
  recordMemory('exact_package_procedure_chains_stitched');
  logRebuildPhase('applying SSIS bridge inferences');
  const inferredSsisBridges = applySsisBridgeInferences(records);
  recordMemory('ssis_bridge_inferences_applied');
  logRebuildPhase('resolving column lineage');
  const columnLineageResolution = applyColumnLineageResolution(records);
  recordMemory('column_lineage_resolved');
  logRebuildPhase('applying dictionary enrichment contract');
  const dictionaryEnrichmentSummary = applyDictionaryEnrichment(records);
  recordMemory('dictionary_enrichment_applied');
  logRebuildPhase('applying catalog freshness diagnostics');
  const catalogFreshnessSummary = applyCatalogFreshnessDiagnostics(records);
  recordMemory('catalog_freshness_diagnostics_applied');
  logRebuildPhase('classifying lineage object roles');
  const lineageRoleClassificationSummary = applyLineageRoleClassifications(records);
  recordMemory('lineage_roles_classified');
  logRebuildPhase('scoring catalog confidence');
  const catalogConfidenceSummary = applyCatalogConfidence(records);
  recordMemory('catalog_confidence_scored');
  const writeSummary = DRY_RUN_REBUILD
    ? { filesWritten: 0, manifestFiles: 0 }
    : await writeRecords(records, ssisSummary);
  recordMemory(DRY_RUN_REBUILD ? 'writes_skipped' : 'records_written');
  logRebuildPhase(DRY_RUN_REBUILD ? 'validating in-memory records' : 'validating generated markdown');
  const validation = DRY_RUN_REBUILD ? validateRecords(records) : await validateOutput();
  recordMemory('validated');
  const recordList = Array.from(records.values());
  const recordMetrics = summarizeRecordMetrics(recordList);
  recordMemory('record_metrics_summarized');

  const summary = {
    dryRun: DRY_RUN_REBUILD,
    ssisLimit: SSIS_REBUILD_LIMIT || null,
    backupPath: backup.path || null,
    backupMode: backup.mode,
    backupWarning: backup.warning || null,
    sqlObjects: recordMetrics.sqlObjects,
    ssisPackages: ssisSummary.packageCount,
    ssisEdges: ssisSummary.edgeCount,
    discoveredSsisXmlFiles: ssisSummary.discoveredXmlFiles,
    processedSsisXmlFiles: ssisSummary.processedXmlFiles,
    ssisLimited: ssisSummary.limited,
    columnInventoryObjects: recordMetrics.columnInventoryObjects,
    columnInventoryColumns: recordMetrics.columnInventoryColumns,
    columnUsageObjects: recordMetrics.columnUsageObjects,
    columnUsageRecords: recordMetrics.columnUsageRecords,
    unresolvedColumnUsageObjects: recordMetrics.unresolvedColumnUsageObjects,
    unresolvedColumnUsageRecords: recordMetrics.unresolvedColumnUsageRecords,
    columnRiskFlagObjects: recordMetrics.columnRiskFlagObjects,
    columnRiskFlags: recordMetrics.columnRiskFlags,
    columnLineageObjects: recordMetrics.columnLineageObjects,
    columnLineageRecords: recordMetrics.columnLineageRecords,
    unresolvedColumnLineageObjects: recordMetrics.unresolvedColumnLineageObjects,
    unresolvedColumnLineageRecords: recordMetrics.unresolvedColumnLineageRecords,
    columnLineageResolution,
    synonymSourceExpansionSummary,
    dictionaryEnrichmentSummary,
    catalogFreshnessSummary,
    lineageRoleClassificationSummary,
    catalogConfidenceSummary,
    ssisColumnMappingObjects: recordMetrics.ssisColumnMappingObjects,
    ssisColumnMappings: recordMetrics.ssisColumnMappings,
    unresolvedSsisColumnMappingObjects: recordMetrics.unresolvedSsisColumnMappingObjects,
    unresolvedSsisColumnMappings: recordMetrics.unresolvedSsisColumnMappings,
    skippedSql,
    quarantinedSqlRawCount: quarantinedSqlRaw.count,
    quarantinedSqlRawSample: quarantinedSqlRaw.sample,
    skippedSsis: ssisSummary.skipped,
    ssisSqlEndpointRecords: ssisSummary.ssisSqlEndpointRecords,
    exactSsisPackageTableEdges: ssisSummary.exactSsisPackageTableEdges,
    exactPackageProcedureChains,
    inferredSsisBridges,
    filesWritten: writeSummary.filesWritten,
    manifestFiles: writeSummary.manifestFiles,
    loadedObjects: validation.objectCount,
    invalidObjects: validation.invalid.length,
    invalidSample: validation.invalid.slice(0, 10),
  };

  const rebuildReport = buildRebuildReport({
    summary,
    recordList,
    previousReport: previousRebuildReport,
    thresholds: aliases.rebuildConfidenceGates || {},
  });
  recordMemory('rebuild_report_built');
  const reportPaths = DRY_RUN_REBUILD
    ? { json: null, markdown: null }
    : await writeRebuildReport(rebuildReport);
  recordMemory(DRY_RUN_REBUILD ? 'report_write_skipped' : 'report_written');
  summary.rebuildReport = {
    gateStatus: rebuildReport.gates.status,
    written: !DRY_RUN_REBUILD,
    json: reportPaths.json,
    markdown: reportPaths.markdown,
    unresolvedFacts: rebuildReport.metrics.unresolved_facts,
    lowOrNeedsReviewObjects: rebuildReport.confidence.low_or_needs_review_objects,
    ssisEdgeDelta: rebuildReport.edge_deltas.ssis_edges.delta,
    packageConfidenceRegressions: rebuildReport.package_confidence_regressions.length,
    newDataSources: rebuildReport.new_data_sources.length,
  };
  summary.memoryUsageMb = memoryUsageMb();
  summary.memoryCheckpointsMb = memoryCheckpoints;

  console.log(JSON.stringify(summary, null, 2));
  if (validation.invalid.length > 0) {
    process.exitCode = 1;
  }
  if (ENFORCE_REBUILD_GATES && rebuildReport.gates.status === 'failed') {
    process.exitCode = 1;
  }
}

export {
  applyExactPackageProcedureChainStitching,
  applyExactSsisPackageTableEdges,
  applySynonymSourceExpansion,
  applyCatalogFreshnessDiagnostics,
  applyLineageRoleClassifications,
  applySsisBridgeInferences,
  buildCatalogConfidence,
  buildRebuildReport,
  buildSsisSqlEndpointRecords,
  catalogFreshnessDiagnostic,
  classifyLineageObjectRole,
  evaluateRebuildGates,
  renderRebuildReportMarkdown,
  sqlRawQuarantineReason,
  summarizeSsisPackageEdges,
  summarizeConfidence,
  summarizeSources,
};

const isDirectRun =
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isDirectRun) {
  await main();
}
