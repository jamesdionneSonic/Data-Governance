import { readdirSync } from 'fs';
import { basename, extname, join, relative } from 'path';
import {
  DEFAULT_EDGE_HARD_THRESHOLD,
  DEFAULT_SNIPPET_LIMIT,
  SSIS_CURATED_ROOT,
  SSIS_HIGH_FANOUT_ALLOWLIST,
  SSIS_RAW_XML_ROOT,
} from './constants.js';
import { readTextFile, writeTextFile } from './fileHelpers.js';
import { getArray, getString, parseFrontmatter } from './markdownHelpers.js';
import { compactPrompt, truncateText, wrapEvidence } from './promptHelpers.js';
import { isExpectedHighFanoutSSIS } from './anomalyRules.js';
import { renderLineageMarkdownTemplate } from './markdownTemplateRenderer.js';
import { writeCorrectedMarkdown } from './markdownCorrectionWriter.js';
import { templateValuesFromRecord } from './provenance.js';

function listMarkdownFiles(rootDir) {
  const files = [];
  const stack = [rootDir];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const fullPath = join(current, entry.name);
      if (entry.isDirectory()) {
        if (!['_drafts', '_runtime', '_rebuild_backups', '_prompt_queue'].includes(entry.name)) {
          stack.push(fullPath);
        }
      } else if (entry.isFile() && extname(entry.name) === '.md') files.push(fullPath);
    }
  }
  return files.sort();
}

function findRawXml(markdownPath) {
  const stem = basename(markdownPath, '.md');
  const candidates = listMarkdownFiles(SSIS_RAW_XML_ROOT).filter((path) =>
    basename(path).includes(stem)
  );
  return candidates[0] || null;
}

function buildSnippet(xmlText, packageName, hint) {
  const lower = xmlText.toLowerCase();
  const needle = [packageName, hint].filter(Boolean).map((v) => v.toLowerCase());
  const index = needle.map((n) => lower.indexOf(n)).find((i) => i >= 0);
  if (index < 0) return truncateText(xmlText, DEFAULT_SNIPPET_LIMIT);
  const start = Math.max(0, index - 240);
  const end = Math.min(xmlText.length, index + 1200);
  return truncateText(xmlText.slice(start, end), DEFAULT_SNIPPET_LIMIT);
}

export function generateSsisPrompts(outputFile = 'generated_llm_prompts.txt', options = {}) {
  const { writeCorrection = false, correctionOutputPath = null } = options;
  const hardThreshold = DEFAULT_EDGE_HARD_THRESHOLD;
  const files = listMarkdownFiles(SSIS_CURATED_ROOT).filter((path) =>
    path.includes('ssis_packages')
  );
  const records = files.map((markdownPath) => {
    const content = readTextFile(markdownPath);
    const { metadata, body } = parseFrontmatter(content);
    const rawXmlPath = findRawXml(markdownPath);
    const edges = [
      ...(getArray(metadata, 'edges') || []),
      ...getArray(metadata, 'depends_on'),
      ...getArray(metadata, 'writes_to'),
      ...getArray(metadata, 'calls'),
    ].map(String);
    return {
      markdownPath,
      rawXmlPath,
      metadata,
      body,
      edges,
      edgeCount: edges.length,
      packageName: getString(metadata, 'package_name', basename(markdownPath).replace('.md', '')),
      displayName: getString(metadata, 'name', basename(markdownPath).replace('.md', '')),
      description: getString(metadata, 'description', ''),
      tags: getArray(metadata, 'tags'),
    };
  });

  const anomalies = records.filter(
    (record) =>
      record.edgeCount > hardThreshold &&
      !isExpectedHighFanoutSSIS(record, SSIS_HIGH_FANOUT_ALLOWLIST)
  );
  const baseline =
    records.find((record) =>
      record.packageName.toLowerCase().includes('dimvehicle_dim_dimvehicle')
    ) ||
    records.find((record) => record.packageName.toLowerCase().includes('dimvehicle')) ||
    records[0];
  const anomaly = anomalies.sort((a, b) => b.edgeCount - a.edgeCount)[0] || records[0];

  const baselineSnippet = baseline.rawXmlPath
    ? buildSnippet(readTextFile(baseline.rawXmlPath), baseline.packageName, baseline.displayName)
    : truncateText(baseline.body, DEFAULT_SNIPPET_LIMIT);
  const anomalySnippet = anomaly.rawXmlPath
    ? buildSnippet(readTextFile(anomaly.rawXmlPath), anomaly.packageName, anomaly.displayName)
    : truncateText(anomaly.body, DEFAULT_SNIPPET_LIMIT);

  const prompt = compactPrompt([
    'task:fix-ssis-lineage-overcapture',
    'output:code-only',
    'target:nearest-executable-or-component',
    wrapEvidence('baseline', baselineSnippet),
    wrapEvidence('anomaly', anomalySnippet),
    'goal:stop-sibling-object-capture',
  ]);

  const report = compactPrompt([
    '=== SSIS ANOMALY DETECTOR REPORT ===',
    `baseline:${relative(process.cwd(), baseline.markdownPath)}`,
    `anomaly:${relative(process.cwd(), anomaly.markdownPath)}`,
    `anomalies:${anomalies.length}`,
    '',
    prompt,
  ]);

  writeTextFile(outputFile, report);
  const correctionMarkdown = renderLineageMarkdownTemplate(
    templateValuesFromRecord(
      {
        ...baseline,
        rawPath: baseline.rawXmlPath,
        kind: 'ssis',
        objectName: baseline.packageName,
      },
      'ssis'
    )
  );
  if (writeCorrection && correctionOutputPath) {
    writeCorrectedMarkdown(correctionOutputPath, correctionMarkdown);
  }
  return { outputFile, baseline, anomaly, anomalies, correctionMarkdown };
}

export default generateSsisPrompts;
