import {
  DEFAULT_EDGE_HARD_THRESHOLD,
  DEFAULT_EDGE_OVERPOPULATED_THRESHOLD,
  SSIS_HIGH_FANOUT_ALLOWLIST,
  TABLE_HIGH_FANOUT_ALLOWLIST,
} from './constants.js';

function normalize(text) {
  return String(text || '').toLowerCase();
}

function hasKeyword(text, keywords) {
  return keywords.some((keyword) => text.includes(keyword));
}

export function classifySsisRecords(records) {
  const baseline =
    records.find((record) => normalize(record.objectName).includes('dimvehicle_dim_dimvehicle')) ||
    records.find((record) => normalize(record.objectName).includes('dimvehicle')) ||
    records[0];

  const anomalies = records.filter((record) => {
    if (record.edgeCount === 0) return true;
    if (record.edgeCount <= DEFAULT_EDGE_OVERPOPULATED_THRESHOLD) return false;
    if (record.edgeCount <= DEFAULT_EDGE_HARD_THRESHOLD && hasKeyword(normalize([record.objectName, record.displayName, record.description, record.tags].join(' ')), SSIS_HIGH_FANOUT_ALLOWLIST)) {
      return false;
    }
    return !hasKeyword(normalize([record.objectName, record.displayName, record.description, record.tags].join(' ')), SSIS_HIGH_FANOUT_ALLOWLIST);
  });

  return { baseline, anomaly: anomalies.sort((a, b) => b.edgeCount - a.edgeCount)[0] || records[0], anomalies };
}

export function classifyTableRecords(records) {
  const baseline = records.find((record) => normalize(record.objectName).includes('bt_checklistrecord')) || records[0];
  const anomalies = records.filter((record) => {
    if (record.edgeCount === 0) return true;
    if (record.edgeCount <= DEFAULT_EDGE_OVERPOPULATED_THRESHOLD) return false;
    const blob = normalize([record.objectName, record.objectType, record.description, record.rawSnippet].join(' '));
    if (record.edgeCount <= DEFAULT_EDGE_HARD_THRESHOLD && hasKeyword(blob, TABLE_HIGH_FANOUT_ALLOWLIST)) {
      return false;
    }
    return !hasKeyword(blob, TABLE_HIGH_FANOUT_ALLOWLIST);
  });
  return { baseline, anomaly: anomalies.sort((a, b) => b.edgeCount - a.edgeCount)[0] || records[0], anomalies };
}
