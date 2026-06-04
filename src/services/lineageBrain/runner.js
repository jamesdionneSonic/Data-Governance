import { basename, join } from 'path';
import { extractSsisEvidence, extractTableEvidence, hydrateEvidenceRecord } from './evidenceExtractor.js';
import { classifySsisRecords, classifyTableRecords } from './anomalyClassifier.js';
import { buildSsisPrompt, buildTablePrompt } from './promptBuilder.js';
import { rewriteMarkdownFromRecord } from './markdownRewriter.js';
import { buildDiffSummary, buildRunDiffReport } from './diffReporter.js';
import { writeTextFile } from './fileHelpers.js';
import {
  ACTIVE_RULES_PATH,
  DEFAULT_DIFF_REPORT_PATH,
  PROPOSED_RULES_PATH,
  REJECTED_RULES_PATH,
} from './constants.js';
import { sha256Text } from './provenance.js';
import {
  appendRuleProposals,
  buildRuleProposals,
  loadLineageBrainRules,
} from './rulesStore.js';

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

function applyLimit(items, limit) {
  const number = Number(limit);
  if (!Number.isInteger(number) || number <= 0) return items;
  return items.slice(0, number);
}

function recordSignature(records) {
  return sha256Text(
    JSON.stringify(
      records.map((record) => ({
        markdownPath: record.markdownPath,
        rawPath: record.rawPath,
        edgeCount: record.edgeCount,
        directCount: record.edgeGroups?.directCount || 0,
        inferredCount: record.edgeGroups?.inferredCount || 0,
        contextCount: record.edgeGroups?.contextCount || 0,
      }))
    )
  );
}

function laneSignature(lane, target, rules) {
  const records =
    lane === 'ssis'
      ? extractSsisEvidence({ target }).filter((record) => matchesTarget(record, target))
      : extractTableEvidence({ target }).filter((record) => matchesTarget(record, target));
  const classified =
    lane === 'ssis' ? classifySsisRecords(records, rules) : classifyTableRecords(records, rules);
  return {
    lane,
    target: target || null,
    recordCount: records.length,
    recordSignature: recordSignature(records),
    baselinePath: classified.baseline?.markdownPath || null,
    anomalyCount: classified.anomalies?.length || 0,
    anomalyPaths: (classified.anomalies || [])
      .slice()
      .sort((left, right) => right.edgeCount - left.edgeCount || left.markdownPath.localeCompare(right.markdownPath))
      .slice(0, 25)
      .map((record) => record.markdownPath),
  };
}

function validateExtractorStability(mode, options, rules) {
  const selected = String(mode || 'both').toLowerCase();
  const lanes = [];
  if (selected === 'ssis' || selected === 'both' || selected === 'all') lanes.push('ssis');
  if (selected === 'table' || selected === 'both' || selected === 'all') lanes.push('table');
  const first = lanes.map((lane) => laneSignature(lane, options.target || null, rules));
  const second = lanes.map((lane) => laneSignature(lane, options.target || null, rules));
  return {
    stable: JSON.stringify(first) === JSON.stringify(second),
    first,
    second,
  };
}

function writeLiveCorrections(results, { applyCorrections, confirmLiveWrite, maxChanges }) {
  if (!applyCorrections) return [];
  const limit = Number(maxChanges);
  if (!confirmLiveWrite || !Number.isInteger(limit) || limit <= 0) {
    throw new Error(
      'Live correction writes require --apply-corrections, --confirm-live-write, and --max-changes N.'
    );
  }

  const writable = results.filter((result) => result.diff.changed).slice(0, limit);
  for (const result of writable) {
    writeTextFile(result.anomaly.markdownPath, result.correctionMarkdown);
  }
  return writable.map((result) => result.anomaly.markdownPath);
}

function runSsis(options = {}) {
  const records = extractSsisEvidence({ target: options.target }).filter((record) => matchesTarget(record, options.target));
  const { baseline, anomalies } = classifySsisRecords(records, options.rules);
  const selectedAnomalies = applyLimit(
    anomalies.slice().sort((a, b) => b.edgeCount - a.edgeCount || a.markdownPath.localeCompare(b.markdownPath)),
    options.maxChanges
  );
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
  const hydratedBaseline = hydrateEvidenceRecord(baseline, 'ssis');

  for (const anomaly of selectedAnomalies) {
    const hydratedAnomaly = hydrateEvidenceRecord(anomaly, 'ssis');
    const prompt = buildSsisPrompt(hydratedBaseline, hydratedAnomaly);
    reportLines.push(`## ${anomaly.markdownPath}`);
    reportLines.push(prompt);
    reportLines.push('');
    const draftPath = buildDraftPath(hydratedAnomaly, options.draftRoot, 'ssis');
    const correctionMarkdown = rewriteMarkdownFromRecord(hydratedAnomaly, {
      lane: 'ssis',
      outputPath: draftPath || undefined,
    });
    const diff = buildDiffSummary(hydratedAnomaly.markdownPath, correctionMarkdown);
    results.push({ lane: 'ssis', baseline: hydratedBaseline, anomaly: hydratedAnomaly, anomalies, prompt, correctionMarkdown, diff, draftPath });
  }
  return { results, reportLines };
}

function runTable(options = {}) {
  const records = extractTableEvidence({ target: options.target }).filter((record) => matchesTarget(record, options.target));
  const { baseline, anomalies } = classifyTableRecords(records, options.rules);
  const selectedAnomalies = applyLimit(
    anomalies.slice().sort((a, b) => b.edgeCount - a.edgeCount || a.markdownPath.localeCompare(b.markdownPath)),
    options.maxChanges
  );
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
  const hydratedBaseline = hydrateEvidenceRecord(baseline, 'table');

  for (const anomaly of selectedAnomalies) {
    const hydratedAnomaly = hydrateEvidenceRecord(anomaly, 'table');
    const prompt = buildTablePrompt(hydratedBaseline, hydratedAnomaly);
    reportLines.push(`## ${anomaly.markdownPath}`);
    reportLines.push(prompt);
    reportLines.push('');
    const draftPath = buildDraftPath(hydratedAnomaly, options.draftRoot, 'table');
    const correctionMarkdown = rewriteMarkdownFromRecord(hydratedAnomaly, {
      lane: 'table',
      outputPath: draftPath || undefined,
    });
    const diff = buildDiffSummary(hydratedAnomaly.markdownPath, correctionMarkdown);
    results.push({ lane: 'table', baseline: hydratedBaseline, anomaly: hydratedAnomaly, anomalies, prompt, correctionMarkdown, diff, draftPath });
  }
  return { results, reportLines };
}

export function runLineageBrain(mode = 'both', options = {}) {
  const selected = String(mode || 'both').toLowerCase();
  const rulesPath = options.rulesPath || ACTIVE_RULES_PATH;
  const rules = options.rules || loadLineageBrainRules(rulesPath);
  const results = [];
  const reportSections = [];
  const sharedDraftRoot = options.draftRoot || null;
  const maxChanges = options.maxChanges || null;
  if (selected === 'ssis' || selected === 'both' || selected === 'all') {
    const ssisRun = runSsis({
      ...(options.ssis || {}),
      draftRoot: sharedDraftRoot,
      target: options.target || null,
      maxChanges,
      rules,
    });
    results.push(...ssisRun.results);
    reportSections.push(ssisRun.reportLines.join('\n'));
  }
  if (selected === 'table' || selected === 'both' || selected === 'all') {
    const tableRun = runTable({
      ...(options.table || {}),
      draftRoot: sharedDraftRoot,
      target: options.target || null,
      maxChanges,
      rules,
    });
    results.push(...tableRun.results);
    reportSections.push(tableRun.reportLines.join('\n'));
  }
  if (options.summaryFile) writeTextFile(options.summaryFile, reportSections.join('\n\n'));

  const appliedFiles = writeLiveCorrections(results, {
    applyCorrections: Boolean(options.applyCorrections),
    confirmLiveWrite: Boolean(options.confirmLiveWrite),
    maxChanges,
  });
  const generatedAt = new Date().toISOString();
  const proposals =
    options.proposeRules === false
      ? []
      : [
          ...buildRuleProposals({
            lane: 'ssis',
            records: results.filter((result) => result.lane === 'ssis').map((result) => result.anomaly),
            rules,
            generatedAt,
          }),
          ...buildRuleProposals({
            lane: 'table',
            records: results.filter((result) => result.lane === 'table').map((result) => result.anomaly),
            rules,
            generatedAt,
          }),
        ];
  const proposalWrite = appendRuleProposals(proposals, {
    proposedPath: options.proposedRulesPath || PROPOSED_RULES_PATH,
    rejectedPath: options.rejectedRulesPath || REJECTED_RULES_PATH,
  });
  const stability = options.validateStability
    ? validateExtractorStability(selected, options, rules)
    : null;
  const diffReport = buildRunDiffReport(results, {
    generatedAt,
    mode: selected,
    target: options.target || null,
    rulesPath,
    draftRoot: sharedDraftRoot,
    appliedFiles,
    proposals,
    proposalWrite,
    stability,
  });
  if (options.reportFile !== false) {
    writeTextFile(
      options.reportFile || DEFAULT_DIFF_REPORT_PATH,
      `${JSON.stringify(diffReport, null, 2)}\n`
    );
  }
  return results;
}

export default runLineageBrain;
