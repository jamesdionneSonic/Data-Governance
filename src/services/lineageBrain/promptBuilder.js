import { compactPrompt, wrapEvidence } from './promptHelpers.js';

function buildEvidenceBlock(record) {
  const edgeGroups = record.edgeGroups || {};
  return compactPrompt([
    `name:${record.objectName}`,
    `count:${record.edgeCount}`,
    `direct_edges:${edgeGroups.directCount || 0}`,
    `inferred_edges:${edgeGroups.inferredCount || 0}`,
    `context_edges:${edgeGroups.contextCount || 0}`,
    `path:${record.markdownPath}`,
    `kind:${record.kind}`,
    wrapEvidence('snippet', record.rawSnippet),
  ]);
}

export function buildSsisPrompt(baseline, anomaly) {
  return compactPrompt([
    'task:fix-ssis-lineage-overcapture',
    'output:code-only',
    'target:nearest-executable-or-component',
    wrapEvidence('baseline', buildEvidenceBlock(baseline)),
    wrapEvidence('anomaly', buildEvidenceBlock(anomaly)),
    'goal:stop-sibling-object-capture',
    'rule:do-not-promote-new-rules-without-review',
  ]);
}

export function buildTablePrompt(baseline, anomaly) {
  return compactPrompt([
    'task:fix-table-lineage-overcapture',
    'output:code-only',
    'target:direct-source-target-only',
    wrapEvidence('baseline', buildEvidenceBlock(baseline)),
    wrapEvidence('anomaly', buildEvidenceBlock(anomaly)),
    'goal:ignore-broad-joins-audit-helper-tables',
    'rule:do-not-promote-new-rules-without-review',
  ]);
}
