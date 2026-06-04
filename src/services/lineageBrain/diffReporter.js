import { readTextFile } from './fileHelpers.js';
import { sha256Text } from './provenance.js';

function lineStats(original, rewritten) {
  const originalLines = original.split(/\r?\n/);
  const rewrittenLines = rewritten.split(/\r?\n/);
  const maxLength = Math.max(originalLines.length, rewrittenLines.length);
  let changedLineCount = 0;
  const preview = [];

  for (let index = 0; index < maxLength; index += 1) {
    if (originalLines[index] === rewrittenLines[index]) continue;
    changedLineCount += 1;
    if (preview.length < 20) {
      preview.push({
        line: index + 1,
        before: originalLines[index] ?? '',
        after: rewrittenLines[index] ?? '',
      });
    }
  }

  return {
    originalLineCount: originalLines.length,
    rewrittenLineCount: rewrittenLines.length,
    changedLineCount,
    preview,
  };
}

export function buildDiffSummary(originalPath, rewrittenMarkdown) {
  const original = readTextFile(originalPath);
  const originalLength = original.length;
  const rewrittenLength = rewrittenMarkdown.length;
  const lines = lineStats(original, rewrittenMarkdown);
  return {
    originalPath,
    originalLength,
    rewrittenLength,
    delta: rewrittenLength - originalLength,
    originalHash: sha256Text(original),
    rewrittenHash: sha256Text(rewrittenMarkdown),
    changed: original !== rewrittenMarkdown,
    ...lines,
  };
}

export function buildRunDiffReport(results, context = {}) {
  const changedResults = results.filter((result) => result.diff.changed);
  return {
    generated_at: context.generatedAt || new Date().toISOString(),
    mode: context.mode || 'both',
    target: context.target || null,
    rules_path: context.rulesPath || null,
    draft_root: context.draftRoot || null,
    total_results: results.length,
    changed_files: changedResults.length,
    unchanged_files: results.length - changedResults.length,
    total_delta_bytes: results.reduce((sum, result) => sum + Number(result.diff.delta || 0), 0),
    applied_files: context.appliedFiles || [],
    rule_proposals: {
      count: (context.proposals || []).length,
      written: context.proposalWrite?.written || 0,
      skipped: context.proposalWrite?.skipped || 0,
      path: context.proposalWrite?.path || null,
    },
    stability: context.stability || null,
    files: results.map((result) => ({
      lane: result.lane,
      original_path: result.anomaly.markdownPath,
      draft_path: result.draftPath || null,
      changed: result.diff.changed,
      delta_bytes: result.diff.delta,
      original_hash: result.diff.originalHash,
      rewritten_hash: result.diff.rewrittenHash,
      changed_line_count: result.diff.changedLineCount,
      edge_count: result.anomaly.edgeCount,
      baseline_path: result.baseline?.markdownPath || null,
      preview: result.diff.preview,
    })),
  };
}

export default buildDiffSummary;
