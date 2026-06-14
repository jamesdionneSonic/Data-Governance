import { basename, extname, join, relative } from 'path';
import { existsSync, readdirSync } from 'fs';
import { readTextFile } from './fileHelpers.js';
import { truncateText } from './promptHelpers.js';
import {
  DEFAULT_SNIPPET_LIMIT,
  SSIS_CURATED_ROOT,
  SSIS_RAW_XML_ROOT,
  TABLE_CURATED_ROOT,
  TABLE_RAW_SQL_ROOT,
} from './constants.js';
import { parseFrontmatter, getArray, getString } from './markdownHelpers.js';
import { splitLineageEdges, totalEdgeCount } from './provenance.js';

const GENERATED_DIRS = ['_drafts', '_runtime', '_rebuild_backups', '_prompt_queue'];
const EDGE_GROUP_KEYS = ['depends_on', 'reads_from', 'writes_to', 'calls'];
const REVERSE_EDGE_GROUP_KEYS = ['created_by', 'used_by', 'called_by'];
const INFERRED_EDGE_GROUP_KEYS = ['created_via', 'inferred_edges', 'probable_edges'];
const CONTEXT_EDGE_GROUP_KEYS = ['contextual_reads', 'contextual_edges', 'edges'];
const TEMPLATE_METADATA_KEYS = [
  'name',
  'package_name',
  'package_path',
  'type',
  'schema',
  'database',
  'owner',
  'steward',
  'domain_manager',
  'custodian',
  'sensitivity',
  'tags',
  'description',
  'row_count',
  'size_kb',
  'column_count',
  'index_count',
  'check_constraint_count',
  'catalog_confidence',
  'lineage_quality',
  'confidence_label',
  'extraction_warnings',
  'extracted_at',
  'last_updated',
];

function emptyEdgeGroup(keys) {
  return Object.fromEntries(keys.map((key) => [key, []]));
}

function compactEdgeGroups(edgeGroups, keepEdgeValues) {
  if (keepEdgeValues) return edgeGroups;
  return {
    direct: emptyEdgeGroup(EDGE_GROUP_KEYS),
    reverse: emptyEdgeGroup(REVERSE_EDGE_GROUP_KEYS),
    inferred: emptyEdgeGroup(INFERRED_EDGE_GROUP_KEYS),
    context: emptyEdgeGroup(CONTEXT_EDGE_GROUP_KEYS),
    directCount: edgeGroups.directCount,
    reverseCount: edgeGroups.reverseCount,
    inferredCount: edgeGroups.inferredCount,
    contextCount: edgeGroups.contextCount,
  };
}

function compactMetadata(metadata, keepEdgeValues) {
  const output = {};
  for (const key of TEMPLATE_METADATA_KEYS) {
    if (Object.prototype.hasOwnProperty.call(metadata, key)) {
      output[key] = metadata[key];
    }
  }
  if (keepEdgeValues) {
    for (const key of [
      ...EDGE_GROUP_KEYS,
      ...REVERSE_EDGE_GROUP_KEYS,
      ...INFERRED_EDGE_GROUP_KEYS,
      ...CONTEXT_EDGE_GROUP_KEYS,
    ]) {
      if (Object.prototype.hasOwnProperty.call(metadata, key)) {
        output[key] = metadata[key];
      }
    }
  }
  return output;
}

function combinedEdges(edgeGroups, keepEdgeValues) {
  if (!keepEdgeValues) return [];
  return [
    ...Object.values(edgeGroups.direct).flat(),
    ...Object.values(edgeGroups.reverse).flat(),
    ...Object.values(edgeGroups.inferred).flat(),
    ...Object.values(edgeGroups.context).flat(),
  ];
}

function matchesEvidenceTarget(record, target) {
  if (!target) return true;
  const needle = String(target).toLowerCase();
  return [
    record.markdownPath,
    record.rawPath,
    record.objectName,
    record.displayName,
    record.objectType,
    record.kind,
  ]
    .filter(Boolean)
    .some((value) => String(value).toLowerCase().includes(needle));
}

function walkMarkdownFiles(rootDir) {
  const files = [];
  if (!existsSync(rootDir)) return files;
  const stack = [rootDir];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const fullPath = join(current, entry.name);
      if (entry.isDirectory()) {
        if (!GENERATED_DIRS.includes(entry.name)) {
          stack.push(fullPath);
        }
      } else if (entry.isFile() && extname(entry.name) === '.md') {
        files.push(fullPath);
      }
    }
  }
  return files.sort();
}

let rawXmlFilesCache = null;

function listRawXmlFiles() {
  if (rawXmlFilesCache) return rawXmlFilesCache;
  const files = [];
  if (!existsSync(SSIS_RAW_XML_ROOT)) {
    rawXmlFilesCache = files;
    return files;
  }
  const stack = [SSIS_RAW_XML_ROOT];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const fullPath = join(current, entry.name);
      if (entry.isDirectory()) stack.push(fullPath);
      else if (entry.isFile() && /\.xml$/i.test(entry.name)) files.push(fullPath);
    }
  }
  rawXmlFilesCache = files.sort();
  return rawXmlFilesCache;
}

function findMatchingRawFile(sourcePath, curatedRoot, rawRoot) {
  const rel = sourcePath.slice(curatedRoot.length + 1).replace(/\.md$/i, '.md');
  const direct = join(rawRoot, rel);
  return existsSync(direct) ? direct : null;
}

function findMatchingSsisRawXml(markdownPath, metadata) {
  const names = [
    getString(metadata, 'package_name', ''),
    getString(metadata, 'package_path', ''),
    getString(metadata, 'name', ''),
    basename(markdownPath, '.md'),
  ]
    .filter(Boolean)
    .map((value) => basename(String(value).toLowerCase(), '.md').replace(/\.xml$/i, ''));

  return (
    listRawXmlFiles().find((filePath) => {
      const fileName = basename(filePath).toLowerCase();
      return names.some((name) => fileName.includes(name));
    }) || null
  );
}

function findMatchingTableRawFile(markdownPath) {
  const rel = relative(TABLE_CURATED_ROOT, markdownPath).replace(/\.md$/i, '.md');
  const parts = rel.split(/[\\/]/);
  const databaseIndex = parts.findIndex((part) => part === 'databases');
  const candidates = [
    join(TABLE_RAW_SQL_ROOT, 'servers', rel),
    databaseIndex >= 0 ? join(TABLE_RAW_SQL_ROOT, parts.slice(databaseIndex).join('/')) : null,
    findMatchingRawFile(markdownPath, TABLE_CURATED_ROOT, TABLE_RAW_SQL_ROOT),
  ].filter(Boolean);
  return candidates.find((candidate) => existsSync(candidate)) || markdownPath;
}

export function extractSsisEvidence(options = {}) {
  const keepEdgeValues = Boolean(options.keepEdgeValues);
  const includeRawSnippet = Boolean(options.includeRawSnippet);
  const files = (options.paths || walkMarkdownFiles(SSIS_CURATED_ROOT)).filter((path) =>
    path.includes('ssis_packages')
  );
  const records = [];
  for (const markdownPath of files) {
    const content = readTextFile(markdownPath);
    const { metadata, body } = parseFrontmatter(content);
    const rawXmlPath = findMatchingSsisRawXml(markdownPath, metadata);
    const edgeGroups = splitLineageEdges(metadata);
    const compactGroups = compactEdgeGroups(edgeGroups, keepEdgeValues);
    const record = {
      markdownPath,
      rawPath: rawXmlPath,
      kind: 'ssis',
      objectName: getString(metadata, 'package_name', basename(markdownPath).replace('.md', '')),
      displayName: getString(metadata, 'name', basename(markdownPath).replace('.md', '')),
      description: getString(metadata, 'description', ''),
      tags: getArray(metadata, 'tags'),
      edgeCount: totalEdgeCount(edgeGroups),
      edges: combinedEdges(edgeGroups, keepEdgeValues),
      edgeGroups: compactGroups,
      body: truncateText(body, DEFAULT_SNIPPET_LIMIT),
      metadata: compactMetadata(metadata, keepEdgeValues),
      rawSnippet:
        includeRawSnippet && rawXmlPath
          ? truncateText(readTextFile(rawXmlPath), DEFAULT_SNIPPET_LIMIT)
          : truncateText(body, DEFAULT_SNIPPET_LIMIT),
    };
    if (matchesEvidenceTarget(record, options.target)) records.push(record);
  }
  return records;
}

export function extractTableEvidence(options = {}) {
  const keepEdgeValues = Boolean(options.keepEdgeValues);
  const includeRawSnippet = Boolean(options.includeRawSnippet);
  const files = (options.paths || walkMarkdownFiles(TABLE_CURATED_ROOT)).filter((filePath) =>
    filePath.replace(/\\/g, '/').includes('/databases/')
  );
  const records = [];
  for (const markdownPath of files) {
    const content = readTextFile(markdownPath);
    const { metadata, body } = parseFrontmatter(content);
    const rawPath = findMatchingTableRawFile(markdownPath);
    const edgeGroups = splitLineageEdges(metadata);
    const compactGroups = compactEdgeGroups(edgeGroups, keepEdgeValues);
    const record = {
      markdownPath,
      rawPath,
      kind: 'table',
      objectName: getString(metadata, 'name', basename(markdownPath).replace('.md', '')),
      objectType: getString(metadata, 'type', 'unknown'),
      description: getString(metadata, 'description', ''),
      edgeCount: totalEdgeCount(edgeGroups),
      edges: combinedEdges(edgeGroups, keepEdgeValues),
      edgeGroups: compactGroups,
      body: truncateText(body, DEFAULT_SNIPPET_LIMIT),
      metadata: compactMetadata(metadata, keepEdgeValues),
      rawSnippet: includeRawSnippet
        ? truncateText(readTextFile(rawPath), DEFAULT_SNIPPET_LIMIT)
        : '',
    };
    if (matchesEvidenceTarget(record, options.target)) records.push(record);
  }
  return records;
}

export function hydrateEvidenceRecord(record, lane, options = {}) {
  if (!record?.markdownPath) return record;
  const hydrateOptions = {
    paths: [record.markdownPath],
    keepEdgeValues: true,
    includeRawSnippet: true,
    ...options,
  };
  const hydrated =
    lane === 'ssis'
      ? extractSsisEvidence(hydrateOptions)[0]
      : extractTableEvidence(hydrateOptions)[0];
  return hydrated || record;
}
