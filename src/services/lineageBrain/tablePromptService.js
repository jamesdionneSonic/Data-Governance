import { readdirSync } from 'fs';
import { basename, extname, join, relative } from 'path';
import { DEFAULT_EDGE_HARD_THRESHOLD, DEFAULT_EDGE_OVERPOPULATED_THRESHOLD, DEFAULT_SNIPPET_LIMIT, TABLE_CURATED_ROOT, TABLE_HIGH_FANOUT_ALLOWLIST, TABLE_RAW_SQL_ROOT } from './constants.js';
import { readTextFile, writeTextFile } from './fileHelpers.js';
import { getString, parseFrontmatter } from './markdownHelpers.js';
import { compactPrompt, truncateText, wrapEvidence } from './promptHelpers.js';
import { isExpectedHighFanoutTable } from './anomalyRules.js';
import { renderLineageMarkdownTemplate } from './markdownTemplateRenderer.js';
import { writeCorrectedMarkdown } from './markdownCorrectionWriter.js';

function listMarkdownFiles(rootDir) {
  const files = [];
  const stack = [rootDir];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const fullPath = join(current, entry.name);
      if (entry.isDirectory()) stack.push(fullPath);
      else if (entry.isFile() && extname(entry.name) === '.md') files.push(fullPath);
    }
  }
  return files.sort();
}

function findRawSql(markdownPath) {
  const rel = relative(TABLE_CURATED_ROOT, markdownPath).replace(/\.md$/i, '.md');
  const direct = join(TABLE_RAW_SQL_ROOT, rel);
  return readTextFileExists(direct) ? direct : markdownPath;
}

function readTextFileExists(filePath) {
  try {
    readTextFile(filePath);
    return true;
  } catch {
    return false;
  }
}

function buildSnippet(sqlText, objectName) {
  const lower = sqlText.toLowerCase();
  const needle = objectName.toLowerCase();
  const index = lower.indexOf(needle);
  if (index < 0) return truncateText(sqlText, DEFAULT_SNIPPET_LIMIT);
  return truncateText(sqlText.slice(Math.max(0, index - 240), Math.min(sqlText.length, index + 1200)), DEFAULT_SNIPPET_LIMIT);
}

export function generateTablePrompts(outputFile = 'generated_table_llm_prompts.txt', options = {}) {
  const { writeCorrection = false, correctionOutputPath = null } = options;
  const files = listMarkdownFiles(TABLE_CURATED_ROOT);
  const records = files.map((markdownPath) => {
    const content = readTextFile(markdownPath);
    const { metadata, body } = parseFrontmatter(content);
    const rawSqlPath = findRawSql(markdownPath);
    const sqlText = readTextFile(rawSqlPath);
    return {
      markdownPath,
      rawSqlPath,
      metadata,
      body,
      sqlText,
      objectName: getString(metadata, 'name', basename(markdownPath, '.md')),
      objectType: getString(metadata, 'type', 'unknown'),
      description: getString(metadata, 'description', ''),
      refCount: Number(getString(metadata, 'edge_count', 0)) || 0,
    };
  });

  const anomalies = records.filter((record) => {
    if (record.refCount === 0) return true;
    if (record.refCount <= DEFAULT_EDGE_OVERPOPULATED_THRESHOLD) return false;
    if (record.refCount <= DEFAULT_EDGE_HARD_THRESHOLD && isExpectedHighFanoutTable(record, record.sqlText, TABLE_HIGH_FANOUT_ALLOWLIST)) {
      return false;
    }
    return !isExpectedHighFanoutTable(record, record.sqlText, TABLE_HIGH_FANOUT_ALLOWLIST);
  });

  const baseline =
    records.find((record) => record.objectName.toLowerCase().includes('bt_checklistrecord')) ||
    records[0];
  const anomaly = anomalies.sort((a, b) => b.refCount - a.refCount)[0] || records[0];

  const baselineSnippet = buildSnippet(baseline.sqlText, baseline.objectName);
  const anomalySnippet = buildSnippet(anomaly.sqlText, anomaly.objectName);

  const prompt = compactPrompt([
    'task:fix-table-lineage-overcapture',
    'output:code-only',
    'target:direct-source-target-only',
    wrapEvidence('baseline', baselineSnippet),
    wrapEvidence('anomaly', anomalySnippet),
    'goal:ignore-broad-joins-audit-helper-tables',
  ]);

  const report = compactPrompt([
    '=== TABLE ANOMALY DETECTOR REPORT ===',
    `baseline:${relative(process.cwd(), baseline.markdownPath)}`,
    `anomaly:${relative(process.cwd(), anomaly.markdownPath)}`,
    `anomalies:${anomalies.length}`,
    '',
    prompt,
  ]);

  writeTextFile(outputFile, report);
  const correctionMarkdown = renderLineageMarkdownTemplate({
    name: baseline.objectName,
    database: 'unknown',
    type: baseline.objectType,
    schema: 'dbo',
    owner: baseline.metadata.owner || 'Data Team',
    sensitivity: baseline.metadata.sensitivity || 'internal',
    tags: baseline.metadata.tags || [],
    depends_on: baseline.metadata.depends_on || [],
    reads_from: baseline.metadata.reads_from || [],
    writes_to: baseline.metadata.writes_to || [],
    calls: baseline.metadata.calls || [],
    lineage_confidence: 'unknown',
    lineage_strategy: 'sql-reference-count',
    lineage_pattern_class: 'sql-server-object',
    lineage_source: 'sqlserver_raw_sql',
    lineage_source_path: baseline.rawSqlPath || '',
    lineage_evidence_hash: '',
    extraction_warnings: [],
    edge_count: baseline.refCount,
  });
  if (writeCorrection && correctionOutputPath) {
    writeCorrectedMarkdown(correctionOutputPath, correctionMarkdown);
  }
  return { outputFile, baseline, anomaly, anomalies, correctionMarkdown };
}

export default generateTablePrompts;
