import { allowlistForLane, thresholdsFromRules } from './rulesStore.js';
import { readTextFile } from './fileHelpers.js';

function normalize(text) {
  return String(text || '').toLowerCase();
}

function hasKeyword(text, keywords) {
  return keywords.some((keyword) => text.includes(keyword));
}

function tableHasAllowlistKeyword(record, allowlist) {
  const baseText = normalize([record.objectName, record.objectType, record.description, record.rawSnippet].join(' '));
  if (hasKeyword(baseText, allowlist)) return true;
  if (!record.rawPath || record.rawSnippet) return false;

  try {
    return hasKeyword(normalize(readTextFile(record.rawPath)), allowlist);
  } catch {
    return false;
  }
}

export function classifySsisRecords(records, rules = null) {
  const { review, hard } = thresholdsFromRules(rules);
  const allowlist = allowlistForLane(rules, 'ssis');
  const baseline =
    records.find((record) => normalize(record.objectName).includes('dimvehicle_dim_dimvehicle')) ||
    records.find((record) => normalize(record.objectName).includes('dimvehicle')) ||
    records[0];

  const anomalies = records.filter((record) => {
    if (record.edgeCount === 0) return true;
    if (record.edgeCount <= review) return false;
    if (
      record.edgeCount <= hard &&
      hasKeyword(
        normalize([record.objectName, record.displayName, record.description, record.tags].join(' ')),
        allowlist
      )
    ) {
      return false;
    }
    return !hasKeyword(
      normalize([record.objectName, record.displayName, record.description, record.tags].join(' ')),
      allowlist
    );
  });

  return { baseline, anomaly: anomalies.sort((a, b) => b.edgeCount - a.edgeCount)[0] || records[0], anomalies };
}

export function classifyTableRecords(records, rules = null) {
  const { review, hard } = thresholdsFromRules(rules);
  const allowlist = allowlistForLane(rules, 'table');
  const baseline = records.find((record) => normalize(record.objectName).includes('bt_checklistrecord')) || records[0];
  const anomalies = records.filter((record) => {
    if (record.edgeCount === 0) return true;
    if (record.edgeCount <= review) return false;
    const hasAllowlistKeyword = tableHasAllowlistKeyword(record, allowlist);
    if (record.edgeCount <= hard && hasAllowlistKeyword) {
      return false;
    }
    return !hasAllowlistKeyword;
  });
  return { baseline, anomaly: anomalies.sort((a, b) => b.edgeCount - a.edgeCount)[0] || records[0], anomalies };
}
