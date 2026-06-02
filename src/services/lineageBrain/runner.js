import { basename, join } from 'path';
import { extractSsisEvidence, extractTableEvidence } from './evidenceExtractor.js';
import { classifySsisRecords, classifyTableRecords } from './anomalyClassifier.js';
import { buildSsisPrompt, buildTablePrompt } from './promptBuilder.js';
import { rewriteMarkdownFromRecord } from './markdownRewriter.js';
import { buildDiffSummary } from './diffReporter.js';
import { writeTextFile } from './fileHelpers.js';

function buildDraftPath(record, draftRoot, lane) {
  if (!draftRoot) return null;
  const fileName = basename(record.markdownPath);
  if (lane === 'ssis') {
    return join(draftRoot, 'ssis', fileName);
  }
  return join(draftRoot, 'table', fileName);
}

function matchesTarget(record, target) {
  if (!target) return true;
  const needle = String(target).toLowerCase();
  const values = [
    record.markdownPath,
    record.rawPath,
    record.objectName,
    record.displayName,
    record.objectType,
    record.kind,
  ].filter(Boolean);
  return values.some((value) => String(value).toLowerCase().includes(needle));
}

function runSsis(options = {}) {
  const records = extractSsisEvidence().filter((record) => matchesTarget(record, options.target));
  const { baseline, anomalies } = classifySsisRecords(records);
  const results = [];
  const reportLines = [`=== SSIS ANOMALY DETECTOR REPORT ===`];

  if (!baseline || !Array.isArray(anomalies)) {
    reportLines.push('baseline:none');
    reportLines.push('anomalies:0');
    reportLines.push('');
    reportLines.push('[EMPTY] No SSIS anomalies were classified; skipping draft generation.');
    return { results, reportLines };
  }

  reportLines.push(`baseline:${baseline.markdownPath}`, `anomalies:${anomalies.length}`, '');

  for (const anomaly of anomalies) {
    const prompt = buildSsisPrompt(baseline, anomaly);
    reportLines.push(`## ${anomaly.markdownPath}`);
    reportLines.push(prompt);
    reportLines.push('');
    const draftPath = buildDraftPath(anomaly, options.draftRoot, 'ssis');
    const correctionMarkdown = rewriteMarkdownFromRecord(anomaly, {
      database: 'ssisdb',
      type: 'package',
      schema: 'dbo',
      owner: anomaly.metadata?.owner || 'ssis-platform',
      sensitivity: anomaly.metadata?.sensitivity || 'internal',
      tags: anomaly.tags || [],
      depends_on: anomaly.edges || [],
      lineage_confidence: 'unknown',
      lineage_strategy: 'ssis-package-lineage',
      lineage_pattern_class: 'ssis-package',
      lineage_source: 'ssis_raw_xml',
      lineage_source_path: anomaly.rawPath || '',
      outputPath: draftPath || undefined,
    });
    const diff = buildDiffSummary(anomaly.markdownPath, correctionMarkdown);
    results.push({ lane: 'ssis', baseline, anomaly, anomalies, prompt, correctionMarkdown, diff, draftPath });
  }
  return { results, reportLines };
}

function runTable(options = {}) {
  const records = extractTableEvidence().filter((record) => matchesTarget(record, options.target));
  const { baseline, anomalies } = classifyTableRecords(records);
  const results = [];
  const reportLines = [`=== TABLE ANOMALY DETECTOR REPORT ===`];

  if (!baseline || !Array.isArray(anomalies)) {
    reportLines.push('baseline:none');
    reportLines.push('anomalies:0');
    reportLines.push('');
    reportLines.push('[EMPTY] No table anomalies were classified; skipping draft generation.');
    return { results, reportLines };
  }

  reportLines.push(`baseline:${baseline.markdownPath}`, `anomalies:${anomalies.length}`, '');

  for (const anomaly of anomalies) {
    const prompt = buildTablePrompt(baseline, anomaly);
    reportLines.push(`## ${anomaly.markdownPath}`);
    reportLines.push(prompt);
    reportLines.push('');
    const draftPath = buildDraftPath(anomaly, options.draftRoot, 'table');
    const correctionMarkdown = rewriteMarkdownFromRecord(anomaly, {
      database: anomaly.metadata?.database || 'unknown',
      type: anomaly.objectType || 'unknown',
      schema: anomaly.metadata?.schema || 'dbo',
      owner: anomaly.metadata?.owner || 'Data Team',
      sensitivity: anomaly.metadata?.sensitivity || 'internal',
      tags: anomaly.metadata?.tags || [],
      depends_on: anomaly.metadata?.depends_on || [],
      reads_from: anomaly.metadata?.reads_from || [],
      writes_to: anomaly.metadata?.writes_to || [],
      calls: anomaly.metadata?.calls || [],
      lineage_confidence: 'unknown',
      lineage_strategy: 'sql-reference-count',
      lineage_pattern_class: 'sql-server-object',
      lineage_source: 'sqlserver_raw_sql',
      lineage_source_path: anomaly.rawPath || '',
      outputPath: draftPath || undefined,
    });
    const diff = buildDiffSummary(anomaly.markdownPath, correctionMarkdown);
    results.push({ lane: 'table', baseline, anomaly, anomalies, prompt, correctionMarkdown, diff, draftPath });
  }
  return { results, reportLines };
}

export function runLineageBrain(mode = 'both', options = {}) {
  const selected = String(mode || 'both').toLowerCase();
  const results = [];
  const reportSections = [];
  const sharedDraftRoot = options.draftRoot || null;
  if (selected === 'ssis' || selected === 'both' || selected === 'all') {
    const ssisRun = runSsis({ ...(options.ssis || {}), draftRoot: sharedDraftRoot, target: options.target || null });
    results.push(...ssisRun.results);
    reportSections.push(ssisRun.reportLines.join('\n'));
  }
  if (selected === 'table' || selected === 'both' || selected === 'all') {
    const tableRun = runTable({ ...(options.table || {}), draftRoot: sharedDraftRoot, target: options.target || null });
    results.push(...tableRun.results);
    reportSections.push(tableRun.reportLines.join('\n'));
  }
  if (options.summaryFile) writeTextFile(options.summaryFile, reportSections.join('\n\n'));
  return results;
}

export default runLineageBrain;
