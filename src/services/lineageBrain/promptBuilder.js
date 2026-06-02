import { compactPrompt, wrapEvidence } from './promptHelpers.js';

function buildEvidenceBlock(record) {
  return compactPrompt([
    `name:${record.objectName}`,
    `count:${record.edgeCount}`,
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
  ]);
}
