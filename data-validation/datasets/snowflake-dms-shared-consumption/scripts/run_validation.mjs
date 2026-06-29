import 'dotenv/config';

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import { getConnector } from '../../../../src/services/connectorService.js';
import { connectorConfigValue, connectorCredentialValue } from '../../../../src/services/connectorRuntime/runtimeValues.js';
import {
  buildSqlServerConnectionConfig,
  loadSqlServerDriver,
  sqlServerCredentialMode,
} from '../../../../src/services/connectorRuntime/sqlServerConnection.js';

const DATASET_ID = 'snowflake-dms-shared-consumption';
const SNOWFLAKE_CONNECTOR_ID = 'snowflake-bipslyv-tlb12786';
const SQLSERVER_CONNECTOR_ID = 'sqlserver-l1-dwasql-02-12010-dms';
const AMOUNT_TOLERANCE = 1;

const actor = {
  id: 'system',
  name: 'System',
  role: 'admin',
  roles: ['Admin'],
};

const profileJobs = [
  {
    id: 'snowflake_vehicle_sales_profile',
    source: 'snowflake',
    sql: 'sql/snowflake/vehicle_sales_raw_profile.sql',
    output: 'raw/snowflake_vehicle_sales_profile.csv',
  },
  {
    id: 'snowflake_repair_order_profile',
    source: 'snowflake',
    sql: 'sql/snowflake/repair_order_raw_profile.sql',
    output: 'raw/snowflake_repair_order_profile.csv',
  },
  {
    id: 'sqlserver_dms_vehicle_sales_profile',
    source: 'sqlserver',
    sql: 'sql/sqlserver/dms_vehicle_sales_profile.sql',
    output: 'raw/sqlserver_dms_vehicle_sales_profile.csv',
  },
  {
    id: 'sqlserver_dms_repair_order_profile',
    source: 'sqlserver',
    sql: 'sql/sqlserver/dms_repair_order_profile.sql',
    output: 'raw/sqlserver_dms_repair_order_profile.csv',
  },
  {
    id: 'sqlserver_dms_repair_order_header_profile',
    source: 'sqlserver',
    sql: 'sql/sqlserver/dms_repair_order_header_profile.sql',
    output: 'raw/sqlserver_dms_repair_order_header_profile.csv',
  },
];

const summaryJobs = [
  {
    id: 'snowflake_vehicle_sales_daily',
    subject: 'vehicle_sales',
    source: 'snowflake',
    sql: 'sql/snowflake/vehicle_sales_daily_summary.sql',
    output: 'normalized/snowflake_vehicle_sales_daily.csv',
  },
  {
    id: 'sqlserver_dms_vehicle_sales_daily',
    subject: 'vehicle_sales',
    source: 'sqlserver',
    sql: 'sql/sqlserver/dms_vehicle_sales_daily_summary.sql',
    output: 'normalized/sqlserver_dms_vehicle_sales_daily.csv',
  },
  {
    id: 'snowflake_repair_order_daily',
    subject: 'repair_orders',
    source: 'snowflake',
    sql: 'sql/snowflake/repair_order_daily_summary.sql',
    output: 'normalized/snowflake_repair_order_daily.csv',
  },
  {
    id: 'sqlserver_dms_repair_order_daily',
    subject: 'repair_orders',
    source: 'sqlserver',
    sql: 'sql/sqlserver/dms_repair_order_daily_summary.sql',
    output: 'normalized/sqlserver_dms_repair_order_daily.csv',
  },
];

const detailJobs = [
  {
    id: 'snowflake_vehicle_sales_detail',
    subject: 'vehicle_sales',
    source: 'snowflake',
    sql: 'sql/snowflake/vehicle_sales_detail_extract.sql',
    output: 'normalized/snowflake_vehicle_sales_detail.csv',
  },
  {
    id: 'sqlserver_dms_vehicle_sales_detail',
    subject: 'vehicle_sales',
    source: 'sqlserver',
    sql: 'sql/sqlserver/dms_vehicle_sales_detail_extract.sql',
    output: 'normalized/sqlserver_dms_vehicle_sales_detail.csv',
  },
  {
    id: 'snowflake_repair_order_detail',
    subject: 'repair_orders',
    source: 'snowflake',
    sql: 'sql/snowflake/repair_order_detail_extract.sql',
    output: 'normalized/snowflake_repair_order_detail.csv',
  },
  {
    id: 'sqlserver_dms_repair_order_detail',
    subject: 'repair_orders',
    source: 'sqlserver',
    sql: 'sql/sqlserver/dms_repair_order_detail_extract.sql',
    output: 'normalized/sqlserver_dms_repair_order_detail.csv',
  },
];

const exceptionHeaders = [
  'exception_id',
  'run_id',
  'subject_area',
  'cora_acct_code',
  'business_date',
  'business_key',
  'exception_type',
  'raw_exception_type',
  'review_classification',
  'classification_group',
  'classification_reason',
  'snowflake_found_elsewhere',
  'snowflake_dealercode',
  'snowflake_storenumber',
  'snowflake_eis_store_id',
  'snowflake_accountingaccount',
  'accuracy_check_status',
  'dms_seen',
  'snowflake_seen',
  'first_seen_run',
  'last_seen_run',
  'days_open',
  'status',
  'review_notes',
];

const changedRecordHeaders = [
  'exception_id',
  'run_id',
  'subject_area',
  'cora_acct_code',
  'business_date',
  'business_key',
  'field_name',
  'dms_value',
  'snowflake_value',
  'difference',
  'raw_exception_type',
  'review_classification',
  'classification_group',
  'classification_reason',
  'snowflake_found_elsewhere',
  'snowflake_dealercode',
  'snowflake_storenumber',
  'snowflake_eis_store_id',
  'snowflake_accountingaccount',
  'accuracy_check_status',
  'status',
  'review_notes',
];

function argValue(name, fallback = null) {
  const index = process.argv.indexOf(name);
  if (index >= 0 && process.argv[index + 1]) return process.argv[index + 1];
  const prefix = `${name}=`;
  const found = process.argv.find((arg) => arg.startsWith(prefix));
  return found ? found.slice(prefix.length) : fallback;
}

function hasFlag(name) {
  return process.argv.includes(name);
}

function runtimeReadyConnector(connector = {}) {
  return {
    ...connector,
    credential: {
      ...(connector.credential || {}),
      ...(connector.credential?.values || {}),
    },
  };
}

function datasetRoot() {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
}

function utcStamp() {
  return new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

function csvCell(value) {
  if (value === null || value === undefined) return '';
  if (value instanceof Date) return value.toISOString();
  const text = String(value);
  if (/[",\r\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function rowsToCsv(rows = [], expectedHeaders = null) {
  const headers = expectedHeaders || [...new Set(rows.flatMap((row) => Object.keys(row || {})))];
  if (!headers.length) return '';
  return [
    headers.map(csvCell).join(','),
    ...rows.map((row) => headers.map((header) => csvCell(row?.[header])).join(',')),
  ].join('\n') + '\n';
}

async function writeCsv(file, rows, expectedHeaders = null) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, rowsToCsv(rows, expectedHeaders), 'utf8');
}

async function writeJson(file, value) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

async function copyIfExists(from, to) {
  try {
    await fs.mkdir(path.dirname(to), { recursive: true });
    await fs.copyFile(from, to);
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }
}

function parseCsv(text) {
  const rows = [];
  let field = '';
  let row = [];
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (quoted && char === '"' && next === '"') {
      field += '"';
      i += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (!quoted && char === ',') {
      row.push(field);
      field = '';
    } else if (!quoted && (char === '\n' || char === '\r')) {
      if (char === '\r' && next === '\n') i += 1;
      row.push(field);
      if (row.some((value) => value !== '')) rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }
  if (field || row.length) {
    row.push(field);
    if (row.some((value) => value !== '')) rows.push(row);
  }
  if (!rows.length) return [];
  const [headers, ...dataRows] = rows;
  return dataRows.map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] || ''])));
}

async function readCsvIfExists(file) {
  try {
    return parseCsv(await fs.readFile(file, 'utf8'));
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

function numberValue(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function rate(numerator, denominator) {
  if (!denominator) return '';
  return (numerator / denominator).toFixed(4);
}

function uniqueValues(rows, field) {
  return [...new Set(rows.map((row) => row?.[field]).filter(Boolean))].sort();
}

function groupCount(rows, field) {
  const counts = new Map();
  for (const row of rows) {
    const key = row?.[field] || 'unclassified';
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return counts;
}

function businessKeySet(rows) {
  return new Set(rows.map((row) => row.business_key).filter(Boolean));
}

function countIntersection(leftSet, rightSet) {
  let count = 0;
  for (const value of leftSet) {
    if (rightSet.has(value)) count += 1;
  }
  return count;
}

function minMaxBusinessDate(rows) {
  const dates = uniqueValues(rows, 'business_date');
  return {
    min: dates[0] || '',
    max: dates[dates.length - 1] || '',
  };
}

function stripSqlComments(sqlText) {
  return String(sqlText || '')
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .split(/\r?\n/)
    .map((line) => line.replace(/--.*$/, ''))
    .join('\n');
}

function assertReadOnlySql(sqlText, job) {
  const stripped = stripSqlComments(sqlText);
  const forbidden = /\b(create|alter|drop|insert|update|delete|merge|truncate|grant|revoke)\b/i;
  const selectStar = /\bselect\s+\*/i;
  if (forbidden.test(stripped)) {
    throw new Error(`Read-only guard failed for ${job.id}: forbidden write/DDL keyword found.`);
  }
  if (selectStar.test(stripped)) {
    throw new Error(`Read-only guard failed for ${job.id}: SELECT * is not allowed.`);
  }
}

async function loadSql(datasetDir, job, daysBack) {
  const file = path.join(datasetDir, job.sql);
  const raw = await fs.readFile(file, 'utf8');
  assertReadOnlySql(raw, job);
  return raw.replaceAll('{{DAYS_BACK}}', String(daysBack));
}

async function connectSnowflake(connector) {
  const mod = await import('snowflake-sdk');
  const snowflake = mod.default || mod;
  const connection = snowflake.createConnection({
    account: connectorConfigValue(connector, 'account'),
    username:
      connectorCredentialValue(connector, 'username', 'user') ||
      connectorConfigValue(connector, 'username', 'user'),
    password:
      connectorCredentialValue(connector, 'password') ||
      connectorConfigValue(connector, 'password'),
    warehouse: connectorConfigValue(connector, 'warehouse'),
    database: 'CDK_DN_TITAN_FTR_UNMASK_E100030_SHARE',
    schema: 'CONSUMPTION_SHARED_E100030',
    role: connectorConfigValue(connector, 'role'),
  });
  await new Promise((resolve, reject) => connection.connect((err) => (err ? reject(err) : resolve())));
  return connection;
}

async function executeSnowflake(connection, sqlText) {
  return new Promise((resolve, reject) => {
    connection.execute({
      sqlText,
      complete: (err, _statement, rows) => (err ? reject(err) : resolve(rows || [])),
    });
  });
}

async function executeSqlServer(pool, sqlText) {
  const result = await pool.request().query(sqlText);
  return result.recordset || [];
}

function normalizeRow(row = {}) {
  const out = {};
  for (const [key, value] of Object.entries(row)) {
    out[String(key).toLowerCase()] = value;
  }
  return out;
}

async function runProfileJob({ datasetDir, currentDir, runDir, job, daysBack, connectors, pools }) {
  const startedAt = new Date().toISOString();
  const sqlText = await loadSql(datasetDir, job, daysBack);
  let rows = [];
  if (job.source === 'snowflake') {
    rows = await executeSnowflake(pools.snowflake, sqlText);
  } else if (job.source === 'sqlserver') {
    rows = await executeSqlServer(pools.sqlserver, sqlText);
  } else {
    throw new Error(`Unsupported job source: ${job.source}`);
  }

  rows = rows.map(normalizeRow);
  const currentFile = path.join(currentDir, job.output);
  const archiveFile = path.join(runDir, job.output);
  await writeCsv(currentFile, rows);
  await copyIfExists(currentFile, archiveFile);

  return {
    job_id: job.id,
    source: job.source,
    connector_id:
      job.source === 'snowflake' ? connectors.snowflake.id : connectors.sqlserver.id,
    status: 'succeeded',
    started_at: startedAt,
    completed_at: new Date().toISOString(),
    row_count: rows.length,
    current_output: path.relative(datasetDir, currentFile).replace(/\\/g, '/'),
    archived_output: path.relative(datasetDir, archiveFile).replace(/\\/g, '/'),
  };
}

async function runExtractJob({ datasetDir, currentDir, runDir, job, daysBack, connectors, pools }) {
  const startedAt = new Date().toISOString();
  const sqlText = await loadSql(datasetDir, job, daysBack);
  let rows = [];
  if (job.source === 'snowflake') {
    rows = await executeSnowflake(pools.snowflake, sqlText);
  } else if (job.source === 'sqlserver') {
    rows = await executeSqlServer(pools.sqlserver, sqlText);
  } else {
    throw new Error(`Unsupported job source: ${job.source}`);
  }

  rows = rows.map(normalizeRow);
  const currentFile = path.join(currentDir, job.output);
  const archiveFile = path.join(runDir, job.output);
  await writeCsv(currentFile, rows);
  await copyIfExists(currentFile, archiveFile);

  return {
    job_id: job.id,
    source: job.source,
    subject: job.subject,
    connector_id:
      job.source === 'snowflake' ? connectors.snowflake.id : connectors.sqlserver.id,
    status: 'succeeded',
    started_at: startedAt,
    completed_at: new Date().toISOString(),
    row_count: rows.length,
    current_output: path.relative(datasetDir, currentFile).replace(/\\/g, '/'),
    archived_output: path.relative(datasetDir, archiveFile).replace(/\\/g, '/'),
    rows,
  };
}

function amount(value) {
  if (value === null || value === undefined || value === '') return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function rounded(value) {
  return Math.round(amount(value) * 100) / 100;
}

function isBlankValue(value) {
  return value === null || value === undefined || String(value).trim() === '';
}

function classifyAmountDifference({ subjectArea, fieldName, dmsValue, snowflakeValue, difference }) {
  const dmsAmount = rounded(dmsValue);
  const snowflakeAmount = rounded(snowflakeValue);
  const absoluteDifference = Math.abs(rounded(difference));

  if (absoluteDifference < AMOUNT_TOLERANCE) {
    return {
      review_classification: 'amount_rounding_difference',
      classification_group: 'amount',
      classification_reason: `Business key matched and ${fieldName} differs by ${absoluteDifference}, which is below the configured ${AMOUNT_TOLERANCE} tolerance.`,
      accuracy_check_status: 'within_rounding_tolerance',
    };
  }

  if ((isBlankValue(dmsValue) && snowflakeAmount === 0) || (isBlankValue(snowflakeValue) && dmsAmount === 0)) {
    return {
      review_classification: 'amount_null_vs_zero_mismatch',
      classification_group: 'amount',
      classification_reason: 'Business key matched, but one source presents the amount as blank/null while the other presents zero.',
      accuracy_check_status: 'needs_null_zero_rule_review',
    };
  }

  if ((dmsAmount < 0 && snowflakeAmount > 0) || (dmsAmount > 0 && snowflakeAmount < 0)) {
    return {
      review_classification: 'amount_sign_or_credit_mismatch',
      classification_group: 'amount',
      classification_reason: 'Business key matched, but the compared amounts have opposite signs and need credit/reversal treatment review.',
      accuracy_check_status: 'needs_credit_sign_rule_review',
    };
  }

  if (subjectArea === 'repair_orders') {
    return {
      review_classification: 'amount_component_gap',
      classification_group: 'amount',
      classification_reason: 'Business key matched, but the repair-order amount differs after comparing DMS customer-pay core fields to Snowflake PAYCPTOTAL. Review tax, fee, shop supply, sublet, discount, or other customer-pay components before treating this as a source error.',
      accuracy_check_status: 'needs_component_formula_review',
    };
  }

  return {
    review_classification: 'material_amount_mismatch_unexplained',
    classification_group: 'unexplained',
    classification_reason: 'Business key matched, but amount differs beyond the current tolerance and has not yet been assigned to a component, rounding, timing, status, sign, or null-vs-zero explanation.',
    accuracy_check_status: 'needs_amount_review',
  };
}

function coraAcctCode(row = {}) {
  if (row.cora_acct_code) return row.cora_acct_code;
  const legacyStoreLabel = String(row[['dealer', 'name'].join('_')] || '');
  if (/SA466/i.test(legacyStoreLabel)) return 'SA466-S';
  if (/SA476/i.test(legacyStoreLabel)) return 'SA476-S';
  return '';
}

function repairOrderNumber(row = {}) {
  const key = String(row.business_key || '');
  const pipe = key.indexOf('|');
  return pipe >= 0 ? key.slice(pipe + 1) : key;
}

function quotedSqlList(values) {
  return values.map((value) => `'${String(value).replace(/'/g, "''")}'`).join(',');
}

function distinctTextValues(values) {
  return [...new Set(values.map((value) => String(value ?? '').trim()).filter(Boolean))].sort();
}

function joinedEvidence(values) {
  return distinctTextValues(values).join('; ');
}

function expectedAccountingPrefix(row = {}) {
  return String(coraAcctCode(row) || '').replace(/-S$/i, '');
}

function hasSecondaryAccountMatch(row, matches) {
  const expected = expectedAccountingPrefix(row);
  if (!expected) return false;
  return (matches || []).some((match) => {
    const accountingAccount = String(match.snowflake_accountingaccount || '').toUpperCase();
    const eisStoreId = String(match.snowflake_eis_store_id || '').toUpperCase();
    return accountingAccount.startsWith(`${expected.toUpperCase()}-`) || eisStoreId.includes(expected.toUpperCase());
  });
}

function baseClassificationFields(exceptionType) {
  const fields = {
    raw_exception_type: exceptionType || '',
    review_classification: '',
    classification_group: '',
    classification_reason: '',
    snowflake_found_elsewhere: '',
    snowflake_dealercode: '',
    snowflake_storenumber: '',
    snowflake_eis_store_id: '',
    snowflake_accountingaccount: '',
    accuracy_check_status: '',
  };

  if (exceptionType === 'missing_from_dms') {
    return {
      ...fields,
      review_classification: 'timing_candidate',
      classification_group: 'timing',
      classification_reason: 'Snowflake has the record but the scoped DMS extract does not. Treat as a timing or freshness candidate until a later run, source window, status, or scope review proves it is truly outside DMS.',
      snowflake_found_elsewhere: 'yes',
      accuracy_check_status: 'needs_timing_or_scope_review',
    };
  }

  return fields;
}

function latestTimestamp(left, right) {
  if (!left) return right || '';
  if (!right) return left || '';
  return String(left) > String(right) ? left : right;
}

function combineByDayDealer(rows, amountFields) {
  const grouped = new Map();
  for (const row of rows || []) {
    const key = `${row.business_date || ''}|${coraAcctCode(row)}`;
    const current = grouped.get(key) || {
      business_date: row.business_date || '',
      cora_acct_code: coraAcctCode(row),
      record_count: 0,
      amount_total: 0,
      labor_amount: 0,
      parts_amount: 0,
      total_amount: 0,
      latest_update_timestamp: '',
    };
    current.record_count += amount(row.record_count);
    for (const field of amountFields || []) {
      current.amount_total += amount(row[field]);
    }
    current.labor_amount += amount(row.labor_amount);
    current.parts_amount += amount(row.parts_amount);
    current.total_amount += amount(row.total_amount);
    current.latest_update_timestamp = latestTimestamp(
      current.latest_update_timestamp,
      row.latest_update_timestamp
    );
    grouped.set(key, current);
  }
  return grouped;
}

function compareClassification(dms, snowflake, amountDiff) {
  if (dms.record_count && !snowflake.record_count) return 'missing_from_snowflake';
  if (!dms.record_count && snowflake.record_count) return 'snowflake_only';
  if (dms.record_count === snowflake.record_count && Math.abs(rounded(amountDiff)) < 1) {
    return 'matched_summary';
  }
  return 'difference_review_needed';
}

function compareVehicleDaily(dmsRows, snowflakeRows) {
  const dms = combineByDayDealer(dmsRows, ['amount_total']);
  const snowflake = combineByDayDealer(snowflakeRows, ['amount_total']);
  const keys = [...new Set([...dms.keys(), ...snowflake.keys()])].sort();
  return keys.map((key) => {
    const d = dms.get(key) || {};
    const s = snowflake.get(key) || {};
    const businessDate = d.business_date || s.business_date || '';
    const coraAcctCode = d.cora_acct_code || s.cora_acct_code || '';
    const dmsAmount = rounded(d.amount_total);
    const snowflakeAmount = rounded(s.amount_total);
    const amountDiff = rounded(snowflakeAmount - dmsAmount);
    return {
      business_date: businessDate,
      cora_acct_code: coraAcctCode,
      dms_record_count: d.record_count || 0,
      snowflake_record_count: s.record_count || 0,
      count_difference: (s.record_count || 0) - (d.record_count || 0),
      dms_amount_total: dmsAmount,
      snowflake_amount_total: snowflakeAmount,
      amount_difference: amountDiff,
      dms_latest_update_timestamp: d.latest_update_timestamp || '',
      snowflake_latest_update_timestamp: s.latest_update_timestamp || '',
      classification: compareClassification(d, s, amountDiff),
    };
  });
}

function compareRepairDaily(dmsRows, snowflakeRows) {
  const dms = combineByDayDealer(dmsRows, []);
  const snowflake = combineByDayDealer(snowflakeRows, []);
  const keys = [...new Set([...dms.keys(), ...snowflake.keys()])].sort();
  return keys.map((key) => {
    const d = dms.get(key) || {};
    const s = snowflake.get(key) || {};
    const businessDate = d.business_date || s.business_date || '';
    const coraAcctCode = d.cora_acct_code || s.cora_acct_code || '';
    const dmsTotal = d.total_amount !== undefined && d.total_amount !== ''
      ? rounded(d.total_amount)
      : rounded((d.labor_amount || 0) + (d.parts_amount || 0));
    const snowflakeTotal = rounded(s.total_amount || 0);
    return {
      business_date: businessDate,
      cora_acct_code: coraAcctCode,
      dms_record_count: d.record_count || 0,
      snowflake_record_count: s.record_count || 0,
      count_difference: (s.record_count || 0) - (d.record_count || 0),
      dms_labor_amount: rounded(d.labor_amount),
      snowflake_labor_amount: '',
      dms_parts_amount: rounded(d.parts_amount),
      snowflake_parts_amount: '',
      dms_total_amount: dmsTotal,
      snowflake_total_amount: snowflakeTotal,
      dms_latest_update_timestamp: d.latest_update_timestamp || '',
      snowflake_latest_update_timestamp: s.latest_update_timestamp || '',
      classification: compareClassification(d, s, snowflakeTotal - dmsTotal),
    };
  });
}

function indexByBusinessKey(rows) {
  const indexed = new Map();
  for (const row of rows || []) {
    if (!row.business_key) continue;
    if (!indexed.has(row.business_key)) {
      indexed.set(row.business_key, { ...row, record_count: amount(row.record_count || 1) });
      continue;
    }
    const current = indexed.get(row.business_key);
    current.record_count = amount(current.record_count) + amount(row.record_count || 1);
    current.amount_total = rounded(amount(current.amount_total) + amount(row.amount_total));
    current.latest_update_timestamp = latestTimestamp(
      current.latest_update_timestamp,
      row.latest_update_timestamp
    );
    indexed.set(row.business_key, current);
  }
  return indexed;
}

function exceptionId(subjectArea, exceptionType, businessKey, fieldName = '') {
  return [subjectArea, exceptionType, businessKey, fieldName]
    .join('|')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 180);
}

function missingException({ runId, subjectArea, row, exceptionType, dmsSeen, snowflakeSeen }) {
  return {
    exception_id: exceptionId(subjectArea, exceptionType, row.business_key),
    run_id: runId,
    subject_area: subjectArea,
    cora_acct_code: coraAcctCode(row),
    business_date: row.business_date || '',
    business_key: row.business_key || '',
    exception_type: exceptionType,
    ...baseClassificationFields(exceptionType),
    dms_seen: dmsSeen,
    snowflake_seen: snowflakeSeen,
    first_seen_run: runId,
    last_seen_run: runId,
    days_open: 0,
    status: 'open',
    review_notes: 'DMS is source of record during validation; Snowflake timing may explain current mismatch.',
  };
}

function changedRecord({ runId, subjectArea, dmsRow, snowflakeRow, fieldName, dmsValue, snowflakeValue }) {
  const difference = rounded(amount(snowflakeValue) - amount(dmsValue));
  const amountClassification = classifyAmountDifference({
    subjectArea,
    fieldName,
    dmsValue,
    snowflakeValue,
    difference,
  });
  return {
    exception_id: exceptionId(subjectArea, 'changed_value', dmsRow.business_key, fieldName),
    run_id: runId,
    subject_area: subjectArea,
    cora_acct_code: coraAcctCode(dmsRow) || coraAcctCode(snowflakeRow),
    business_date: dmsRow.business_date || snowflakeRow.business_date || '',
    business_key: dmsRow.business_key || snowflakeRow.business_key || '',
    field_name: fieldName,
    dms_value: rounded(dmsValue),
    snowflake_value: rounded(snowflakeValue),
    difference,
    ...baseClassificationFields('changed_value'),
    ...amountClassification,
    status: 'open',
    review_notes: 'Value difference is based on bounded local detail extract; confirm transformation rules before treating as source error.',
  };
}

function changedRecordAsOpenException(row, runId) {
  return {
    exception_id: row.exception_id || '',
    run_id: runId,
    subject_area: row.subject_area || '',
    cora_acct_code: coraAcctCode(row),
    business_date: row.business_date || '',
    business_key: row.business_key || '',
    exception_type: 'changed_value',
    raw_exception_type: row.raw_exception_type || 'changed_value',
    review_classification: row.review_classification || '',
    classification_group: row.classification_group || '',
    classification_reason: row.classification_reason || '',
    snowflake_found_elsewhere: row.snowflake_found_elsewhere || '',
    snowflake_dealercode: row.snowflake_dealercode || '',
    snowflake_storenumber: row.snowflake_storenumber || '',
    snowflake_eis_store_id: row.snowflake_eis_store_id || '',
    snowflake_accountingaccount: row.snowflake_accountingaccount || '',
    accuracy_check_status: row.accuracy_check_status || '',
    dms_seen: 'yes',
    snowflake_seen: 'yes',
    first_seen_run: runId,
    last_seen_run: runId,
    days_open: 0,
    status: 'open',
    review_notes: `Changed value: ${row.field_name || 'unknown field'}. ${row.review_notes || ''}`.trim(),
  };
}

function runDate(runId) {
  const match = String(runId || '').match(/^(\d{4})(\d{2})(\d{2})T/);
  if (!match) return null;
  return Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

function daysBetweenRuns(firstRunId, lastRunId) {
  const first = runDate(firstRunId);
  const last = runDate(lastRunId);
  if (first === null || last === null) return 0;
  return Math.max(0, Math.floor((last - first) / 86400000));
}

function updateHistoryRows({ previousOpenRows, currentRows, runId }) {
  const previousById = new Map((previousOpenRows || [])
    .filter((row) => row.exception_id)
    .map((row) => [row.exception_id, row]));
  const currentById = new Map((currentRows || [])
    .filter((row) => row.exception_id)
    .map((row) => [row.exception_id, row]));

  const openRows = [...currentById.values()].map((row) => {
    const previous = previousById.get(row.exception_id);
    const firstSeen = previous?.first_seen_run || row.first_seen_run || runId;
    return {
      ...row,
      run_id: runId,
      first_seen_run: firstSeen,
      last_seen_run: runId,
      days_open: daysBetweenRuns(firstSeen, runId),
      status: 'open',
      review_notes: row.review_notes || previous?.review_notes || '',
    };
  }).sort((a, b) => String(a.exception_id).localeCompare(String(b.exception_id)));

  const resolvedRows = [...previousById.values()]
    .filter((row) => !currentById.has(row.exception_id))
    .map((row) => ({
      ...row,
      run_id: runId,
      cora_acct_code: coraAcctCode(row),
      last_seen_run: runId,
      days_open: daysBetweenRuns(row.first_seen_run || runId, runId),
      status: 'resolved',
      review_notes: 'Resolved in current run; exception no longer present in bounded output.',
    }))
    .sort((a, b) => String(a.exception_id).localeCompare(String(b.exception_id)));

  return { openRows, resolvedRows };
}

async function broadSnowflakeRepairOrderLookup(snowflakeConnection, missingRows) {
  const roNumbers = distinctTextValues((missingRows || []).map(repairOrderNumber));
  if (!roNumbers.length) return new Map();

  const byRo = new Map();
  const chunkSize = 500;
  for (let index = 0; index < roNumbers.length; index += chunkSize) {
    const chunk = roNumbers.slice(index, index + chunkSize);
    const sqlText = `
      select
        cast(RONUM as varchar) as ro_number,
        cast(DEALERCODE as varchar) as snowflake_dealercode,
        cast(STORENUMBER as varchar) as snowflake_storenumber,
        cast(EIS_STORE_ID as varchar) as snowflake_eis_store_id,
        cast(ACCOUNTINGACCOUNT as varchar) as snowflake_accountingaccount,
        to_varchar(ROOPENDATE) as snowflake_ro_open_date,
        to_varchar(ROCLOSEDATE) as snowflake_ro_close_date,
        to_varchar(INVOICEPOSTDATE) as snowflake_invoice_post_date,
        to_varchar(LANDING_TIME) as snowflake_landing_time
      from CDK_DN_TITAN_FTR_UNMASK_E100030_SHARE.CONSUMPTION_SHARED_E100030.REPAIR_ORDER_RAW
      where cast(RONUM as varchar) in (${quotedSqlList(chunk)})
      order by ro_number, snowflake_dealercode, snowflake_eis_store_id, snowflake_accountingaccount
    `;
    const rows = (await executeSnowflake(snowflakeConnection, sqlText)).map(normalizeRow);
    for (const row of rows) {
      const roNumber = String(row.ro_number || '');
      if (!byRo.has(roNumber)) byRo.set(roNumber, []);
      byRo.get(roNumber).push(row);
    }
  }
  return byRo;
}

function classifyRepairMissingFromSnowflake(rows, broadSnowflakeByRo) {
  return (rows || []).map((row) => {
    const roNumber = repairOrderNumber(row);
    const matches = broadSnowflakeByRo.get(roNumber) || [];
    if (!matches.length) {
      return {
        ...row,
        raw_exception_type: 'missing_from_snowflake_scoped_match',
        review_classification: 'true_missing_from_snowflake',
        classification_group: 'coverage',
        classification_reason: 'RO was present in DMS but was not found anywhere in Snowflake REPAIR_ORDER_RAW by RO number during the broad presence check.',
        snowflake_found_elsewhere: 'no',
        accuracy_check_status: 'presence_not_found',
      };
    }

    const dealerCodes = distinctTextValues(matches.map((match) => match.snowflake_dealercode));
    const storeNumbers = distinctTextValues(matches.map((match) => match.snowflake_storenumber));
    const eisStoreIds = distinctTextValues(matches.map((match) => match.snowflake_eis_store_id));
    const accountingAccounts = distinctTextValues(matches.map((match) => match.snowflake_accountingaccount));
    const secondaryAccountMatch = hasSecondaryAccountMatch(row, matches);
    const contextVariantCount = Math.max(dealerCodes.length || 1, storeNumbers.length || 1, eisStoreIds.length || 1, accountingAccounts.length || 1);
    const reviewClassification = contextVariantCount > 1
      ? 'ambiguous_dealer_context'
      : !dealerCodes.length && secondaryAccountMatch
        ? 'blank_primary_dealer_with_secondary_match'
        : 'found_in_snowflake_wrong_dealer_context';
    const classificationReason = reviewClassification === 'blank_primary_dealer_with_secondary_match'
      ? `RO was not found under the scoped ${coraAcctCode(row)} Snowflake match, but broad Snowflake search found ${matches.length} row(s) with blank DEALERCODE and secondary account context that points back to ${expectedAccountingPrefix(row)}.`
      : reviewClassification === 'ambiguous_dealer_context'
        ? `RO was found in Snowflake by RO number under multiple dealer/store/account contexts; human review is needed before applying a mapping rule.`
        : `RO was not found under the scoped ${coraAcctCode(row)} Snowflake match, but broad Snowflake search found ${matches.length} row(s) by RO number with dealer/store/account context outside the current mapping.`;
    return {
      ...row,
      raw_exception_type: 'missing_from_snowflake_scoped_match',
      review_classification: reviewClassification,
      classification_group: 'mapping',
      classification_reason: classificationReason,
      snowflake_found_elsewhere: 'yes',
      snowflake_dealercode: joinedEvidence(matches.map((match) => match.snowflake_dealercode)),
      snowflake_storenumber: joinedEvidence(matches.map((match) => match.snowflake_storenumber)),
      snowflake_eis_store_id: joinedEvidence(matches.map((match) => match.snowflake_eis_store_id)),
      snowflake_accountingaccount: joinedEvidence(matches.map((match) => match.snowflake_accountingaccount)),
      accuracy_check_status: 'presence_found_mapping_review',
      review_notes: reviewClassification === 'blank_primary_dealer_with_secondary_match'
        ? 'DMS is source of record during validation; broad Snowflake presence check found this RO with blank primary dealer code and matching secondary account context. Confirm which Snowflake field should drive account mapping.'
        : 'DMS is source of record during validation; broad Snowflake presence check found this RO outside the scoped dealer/account match. Research dealer/store/account mapping before treating as missing data.',
    };
  });
}

function buildMappingResearchSample(rows, sampleSize = 50) {
  const ordered = [...(rows || [])].sort((a, b) =>
    String(a.review_classification || '').localeCompare(String(b.review_classification || '')) ||
    String(a.cora_acct_code || '').localeCompare(String(b.cora_acct_code || '')) ||
    String(a.business_date || '').localeCompare(String(b.business_date || '')) ||
    String(a.business_key || '').localeCompare(String(b.business_key || ''))
  );
  const mustKeep = ordered.filter((row) =>
    row.review_classification === 'true_missing_from_snowflake' ||
    row.review_classification === 'ambiguous_dealer_context'
  );
  const byClass = new Map();
  for (const row of ordered) {
    if (mustKeep.includes(row)) continue;
    const key = row.review_classification || 'unclassified';
    if (!byClass.has(key)) byClass.set(key, []);
    byClass.get(key).push(row);
  }
  const sample = [...mustKeep];
  const classes = [...byClass.keys()].sort();
  let cursor = 0;
  while (sample.length < sampleSize && classes.length) {
    const key = classes[cursor % classes.length];
    const next = byClass.get(key).shift();
    if (next) sample.push(next);
    for (const emptyKey of classes.filter((classKey) => !byClass.get(classKey).length)) {
      byClass.delete(emptyKey);
    }
    classes.splice(0, classes.length, ...[...byClass.keys()].sort());
    cursor += 1;
  }
  return sample.map((row) => ({
    run_id: row.run_id || '',
    subject_area: row.subject_area || '',
    cora_acct_code: row.cora_acct_code || '',
    business_date: row.business_date || '',
    repair_order_number: repairOrderNumber(row),
    business_key: row.business_key || '',
    raw_exception_type: row.raw_exception_type || '',
    review_classification: row.review_classification || '',
    classification_group: row.classification_group || '',
    classification_reason: row.classification_reason || '',
    snowflake_found_elsewhere: row.snowflake_found_elsewhere || '',
    snowflake_dealercode: row.snowflake_dealercode || '',
    snowflake_storenumber: row.snowflake_storenumber || '',
    snowflake_eis_store_id: row.snowflake_eis_store_id || '',
    snowflake_accountingaccount: row.snowflake_accountingaccount || '',
    vendor_question: row.review_classification === 'blank_primary_dealer_with_secondary_match'
      ? 'Which Snowflake field should be used when DEALERCODE is blank but secondary account context matches the DMS cora_acct_code?'
      : row.review_classification === 'found_in_snowflake_wrong_dealer_context'
        ? 'Why does this RO appear in Snowflake under a different dealer/account context than the DMS cora_acct_code?'
        : 'Can the vendor/source owner confirm whether this RO should be present in the shared Snowflake feed?',
  }));
}

function sampleRows(rows, sampleSize = 50) {
  return [...(rows || [])]
    .sort((a, b) =>
      String(a.cora_acct_code || '').localeCompare(String(b.cora_acct_code || '')) ||
      String(a.business_date || '').localeCompare(String(b.business_date || '')) ||
      String(a.business_key || '').localeCompare(String(b.business_key || '')) ||
      String(a.exception_id || '').localeCompare(String(b.exception_id || ''))
    )
    .slice(0, sampleSize);
}

function accuracySampleFileName(sampleName) {
  return `accuracy/samples/${sampleName}.csv`;
}

function accuracySampleManifestRow({ runId, sampleName, rows, classification, description }) {
  return {
    run_id: runId,
    sample_name: sampleName,
    path: `current/${accuracySampleFileName(sampleName)}`,
    classification,
    row_count: rows.length,
    description,
  };
}

function compareDetailExceptions({ runId, subjectArea, dmsRows, snowflakeRows, rowLimit }) {
  const dms = indexByBusinessKey(dmsRows);
  const snowflake = indexByBusinessKey(snowflakeRows);
  const missingFromSnowflake = [];
  const missingFromDms = [];
  const changedRecords = [];

  for (const [key, dmsRow] of [...dms.entries()].sort()) {
    const snowflakeRow = snowflake.get(key);
    if (!snowflakeRow) {
      missingFromSnowflake.push(missingException({
        runId,
        subjectArea,
        row: dmsRow,
        exceptionType: 'missing_from_snowflake',
        dmsSeen: 'yes',
        snowflakeSeen: 'no',
      }));
      continue;
    }
    const amountDiff = rounded(amount(snowflakeRow.amount_total) - amount(dmsRow.amount_total));
    if (Math.abs(amountDiff) >= AMOUNT_TOLERANCE) {
      changedRecords.push(changedRecord({
        runId,
        subjectArea,
        dmsRow,
        snowflakeRow,
        fieldName: 'amount_total',
        dmsValue: dmsRow.amount_total,
        snowflakeValue: snowflakeRow.amount_total,
      }));
    }
  }

  for (const [key, snowflakeRow] of [...snowflake.entries()].sort()) {
    if (dms.has(key)) continue;
    missingFromDms.push(missingException({
      runId,
      subjectArea,
      row: snowflakeRow,
      exceptionType: 'missing_from_dms',
      dmsSeen: 'no',
      snowflakeSeen: 'yes',
    }));
  }

  return {
    missingFromSnowflake: missingFromSnowflake.slice(0, rowLimit),
    missingFromDms: missingFromDms.slice(0, rowLimit),
    changedRecords: changedRecords.slice(0, rowLimit),
    counts: {
      missing_from_snowflake_total: missingFromSnowflake.length,
      missing_from_dms_total: missingFromDms.length,
      changed_records_total: changedRecords.length,
      row_limit: rowLimit,
    },
  };
}

async function writeDailyComparisons({ datasetDir, currentDir, runDir, extractResults }) {
  const rowsById = new Map(extractResults.map((result) => [result.job_id, result.rows || []]));
  const vehicleRows = compareVehicleDaily(
    rowsById.get('sqlserver_dms_vehicle_sales_daily') || [],
    rowsById.get('snowflake_vehicle_sales_daily') || []
  );
  const repairRows = compareRepairDaily(
    rowsById.get('sqlserver_dms_repair_order_daily') || [],
    rowsById.get('snowflake_repair_order_daily') || []
  );
  const outputs = [
    {
      rows: vehicleRows,
      file: 'summaries/vehicle_sales_daily_compare.csv',
    },
    {
      rows: repairRows,
      file: 'summaries/repair_order_daily_compare.csv',
    },
  ];
  for (const output of outputs) {
    const currentFile = path.join(currentDir, output.file);
    const archiveFile = path.join(runDir, output.file);
    await writeCsv(currentFile, output.rows);
    await copyIfExists(currentFile, archiveFile);
  }
  return outputs.map((output) => ({
    output: output.file,
    row_count: output.rows.length,
  }));
}

async function writeDetailExceptions({ currentDir, runDir, runId, extractResults, rowLimit, pools }) {
  const previousOpenRows = await readCsvIfExists(path.join(currentDir, 'exceptions/open_exceptions.csv'));
  const rowsById = new Map(extractResults.map((result) => [result.job_id, result.rows || []]));
  const vehicle = compareDetailExceptions({
    runId,
    subjectArea: 'vehicle_sales',
    dmsRows: rowsById.get('sqlserver_dms_vehicle_sales_detail') || [],
    snowflakeRows: rowsById.get('snowflake_vehicle_sales_detail') || [],
    rowLimit,
  });
  const repair = compareDetailExceptions({
    runId,
    subjectArea: 'repair_orders',
    dmsRows: rowsById.get('sqlserver_dms_repair_order_detail') || [],
    snowflakeRows: rowsById.get('snowflake_repair_order_detail') || [],
    rowLimit,
  });
  const repairBroadSnowflake = await broadSnowflakeRepairOrderLookup(
    pools.snowflake,
    repair.missingFromSnowflake
  );
  repair.missingFromSnowflake = classifyRepairMissingFromSnowflake(
    repair.missingFromSnowflake,
    repairBroadSnowflake
  );
  const changedRows = [...vehicle.changedRecords, ...repair.changedRecords].slice(0, rowLimit);
  const currentExceptionRows = [
    ...vehicle.missingFromSnowflake,
    ...vehicle.missingFromDms,
    ...repair.missingFromSnowflake,
    ...repair.missingFromDms,
    ...changedRows.map((row) => changedRecordAsOpenException(row, runId)),
  ];
  const history = updateHistoryRows({
    previousOpenRows,
    currentRows: currentExceptionRows,
    runId,
  });
  const outputsToWrite = [
    {
      file: 'exceptions/vehicle_sales_missing_from_snowflake.csv',
      rows: vehicle.missingFromSnowflake,
      headers: exceptionHeaders,
    },
    {
      file: 'exceptions/vehicle_sales_missing_from_dms.csv',
      rows: vehicle.missingFromDms,
      headers: exceptionHeaders,
    },
    {
      file: 'exceptions/repair_orders_missing_from_snowflake.csv',
      rows: repair.missingFromSnowflake,
      headers: exceptionHeaders,
    },
    {
      file: 'exceptions/repair_orders_missing_from_dms.csv',
      rows: repair.missingFromDms,
      headers: exceptionHeaders,
    },
    {
      file: 'exceptions/changed_records.csv',
      rows: changedRows,
      headers: changedRecordHeaders,
    },
    {
      file: 'exceptions/open_exceptions.csv',
      rows: history.openRows,
      headers: exceptionHeaders,
    },
    {
      file: 'exceptions/resolved_since_last_run.csv',
      rows: history.resolvedRows,
      headers: exceptionHeaders,
    },
    {
      file: 'exceptions/research_samples/repair_orders_mapping_research_sample.csv',
      rows: buildMappingResearchSample(repair.missingFromSnowflake),
    },
  ];
  for (const output of outputsToWrite) {
    const currentFile = path.join(currentDir, output.file);
    const archiveFile = path.join(runDir, output.file);
    await writeCsv(currentFile, output.rows, output.headers);
    await copyIfExists(currentFile, archiveFile);
  }
  return [
    ...outputsToWrite.map((output) => ({
      output: output.file,
      row_count: output.rows.length,
    })),
    {
      output: 'exception_counts',
      row_count: 1,
      counts: {
        vehicle_sales: vehicle.counts,
        repair_orders: repair.counts,
        changed_records_written: changedRows.length,
        open_exceptions_written: history.openRows.length,
        resolved_since_last_run_written: history.resolvedRows.length,
      },
    },
  ];
}

function accuracyDecision({
  keyMatchRate,
  rawValueMatchRate,
  readinessRate,
  candidateDefects,
  migrationBlockers,
  eligibleRecords,
}) {
  if (!eligibleRecords) return 'not_scored';
  if (
    keyMatchRate >= 0.995 &&
    rawValueMatchRate >= 0.995 &&
    readinessRate >= 0.995 &&
    candidateDefects === 0 &&
    migrationBlockers === 0
  ) {
    return 'candidate_ready';
  }
  if (
    keyMatchRate >= 0.950 &&
    readinessRate >= 0.950 &&
    candidateDefects <= 25
  ) {
    return 'review_needed';
  }
  return 'not_ready';
}

function accuracyReadout(subjectArea, decisionStatus, facts) {
  const label = subjectArea === 'vehicle_sales' ? 'Vehicle sales' : 'Repair orders';
  if (decisionStatus === 'candidate_ready') {
    return `${label} is inside conservative trust thresholds for this run.`;
  }
  if (decisionStatus === 'review_needed') {
    return `${label} is directionally useful, but ${facts.migrationBlockers} blocker row(s) or question(s) still need review before Snowflake can be treated as trusted.`;
  }
  if (decisionStatus === 'not_scored') {
    return `${label} could not be scored because required denominator evidence is missing.`;
  }
  return `${label} is not ready for a Snowflake trust claim because key coverage, candidate defects, or blockers are outside the conservative thresholds.`;
}

function metricDefinitionRows() {
  return [
    {
      metric_name: 'key_match_rate',
      metric_type: 'key_coverage',
      denominator: 'eligible_records',
      plain_english: 'How much of the DMS scoped population has a matching Snowflake business key.',
      caveat: 'This proves record identity coverage, not amount accuracy.',
    },
    {
      metric_name: 'raw_value_match_rate',
      metric_type: 'value_accuracy',
      denominator: 'value_scored_records',
      plain_english: 'Of records safe to compare by value, how many material values match within tolerance.',
      caveat: 'Repair-order amount component gaps are excluded until PAYCPTOTAL is confirmed.',
    },
    {
      metric_name: 'classification_adjusted_readiness_rate',
      metric_type: 'readiness',
      denominator: 'eligible_records',
      plain_english: 'How much of the population is either matching or has a known review path.',
      caveat: 'This is not final accuracy certification.',
    },
    {
      metric_name: 'candidate_defect_records',
      metric_type: 'risk',
      denominator: 'none',
      plain_english: 'Rows that still look like true gaps or unexplained material value problems.',
      caveat: 'These should be researched before a trust decision.',
    },
    {
      metric_name: 'migration_blocker_count',
      metric_type: 'risk',
      denominator: 'none',
      plain_english: 'Open rows or questions that block a stronger Snowflake readiness statement.',
      caveat: 'Includes formula and mapping blockers, not only proven source defects.',
    },
  ];
}

function blockerRows({ runId, subjectArea, openRows }) {
  const blockingClasses = new Set([
    'true_missing_from_snowflake',
    'material_amount_mismatch_unexplained',
    'found_in_snowflake_wrong_dealer_context',
    'blank_primary_dealer_with_secondary_match',
    'ambiguous_dealer_context',
    'mapping_rule_gap',
    'amount_component_gap',
    'duplicate_source_record',
    'grain_mismatch',
  ]);
  const grouped = groupCount(
    openRows.filter((row) => blockingClasses.has(row.review_classification)),
    'review_classification'
  );
  return [...grouped.entries()].sort().map(([classification, count]) => ({
    run_id: runId,
    subject_area: subjectArea,
    blocker_type: classification,
    blocker_count: count,
    severity: classification === 'true_missing_from_snowflake' || classification === 'material_amount_mismatch_unexplained'
      ? 'high'
      : 'medium',
    first_action: classification === 'amount_component_gap'
      ? 'Confirm the Snowflake PAYCPTOTAL formula against DMS customer-pay components.'
      : classification.includes('dealer') || classification.includes('mapping') || classification.includes('primary')
        ? 'Confirm the authoritative dealer/account mapping fields with the vendor.'
        : 'Research the bounded exception sample and confirm whether the row is a source defect.',
  }));
}

async function writeAccuracyOutputs({ currentDir, runDir, runId, extractResults }) {
  const rowsById = new Map(extractResults.map((result) => [result.job_id, result.rows || []]));
  const openRows = await readCsvIfExists(path.join(currentDir, 'exceptions/open_exceptions.csv'));
  const changedRows = await readCsvIfExists(path.join(currentDir, 'exceptions/changed_records.csv'));
  const subjects = [
    {
      id: 'vehicle_sales',
      dmsJob: 'sqlserver_dms_vehicle_sales_detail',
      snowflakeJob: 'snowflake_vehicle_sales_detail',
    },
    {
      id: 'repair_orders',
      dmsJob: 'sqlserver_dms_repair_order_detail',
      snowflakeJob: 'snowflake_repair_order_detail',
    },
  ];
  const scorecardRows = [];
  const allBlockerRows = [];

  for (const subject of subjects) {
    const dmsRows = rowsById.get(subject.dmsJob) || [];
    const snowflakeRows = rowsById.get(subject.snowflakeJob) || [];
    const subjectOpenRows = openRows.filter((row) => row.subject_area === subject.id && row.status !== 'resolved');
    const subjectChangedRows = changedRows.filter((row) => row.subject_area === subject.id && row.status !== 'resolved');
    const dmsKeys = businessKeySet(dmsRows);
    const snowflakeKeys = businessKeySet(snowflakeRows);
    const matchedKeyRecords = countIntersection(dmsKeys, snowflakeKeys);
    const eligibleRecords = dmsKeys.size;
    const classificationCounts = groupCount(subjectOpenRows, 'review_classification');
    const mappingReviewRecords = subjectOpenRows.filter((row) => row.classification_group === 'mapping').length;
    const timingReviewRecords = subjectOpenRows.filter((row) => row.classification_group === 'timing').length;
    const formulaDefinitionReviewRecords = numberValue(classificationCounts.get('amount_component_gap'));
    const candidateDefectRecords =
      numberValue(classificationCounts.get('true_missing_from_snowflake')) +
      numberValue(classificationCounts.get('material_amount_mismatch_unexplained'));
    const notScoredRecords = subjectOpenRows.filter((row) => ['key_grain', 'date_status'].includes(row.classification_group)).length;
    const valueScoredRecords = Math.max(matchedKeyRecords - formulaDefinitionReviewRecords - notScoredRecords, 0);
    const valueDefectRows = subjectChangedRows.filter((row) => row.review_classification === 'material_amount_mismatch_unexplained').length;
    const validatedValueMatches = Math.max(valueScoredRecords - valueDefectRows, 0);
    const keyMatch = eligibleRecords ? matchedKeyRecords / eligibleRecords : 0;
    const rawValueMatch = valueScoredRecords ? validatedValueMatches / valueScoredRecords : 0;
    const readinessRows = Math.max(eligibleRecords - candidateDefectRecords - notScoredRecords, 0);
    const readiness = eligibleRecords ? readinessRows / eligibleRecords : 0;
    const blockers = blockerRows({ runId, subjectArea: subject.id, openRows: subjectOpenRows });
    allBlockerRows.push(...blockers);
    const migrationBlockers = blockers.reduce((sum, row) => sum + numberValue(row.blocker_count), 0);
    const combinedDateRange = minMaxBusinessDate([...dmsRows, ...snowflakeRows]);
    const decisionStatus = accuracyDecision({
      keyMatchRate: keyMatch,
      rawValueMatchRate: rawValueMatch,
      readinessRate: readiness,
      candidateDefects: candidateDefectRecords,
      migrationBlockers,
      eligibleRecords,
    });
    const confidence = formulaDefinitionReviewRecords || mappingReviewRecords || notScoredRecords
      ? 'medium'
      : eligibleRecords
        ? 'high'
        : 'low';

    scorecardRows.push({
      run_id: runId,
      subject_area: subject.id,
      business_date_start: combinedDateRange.min,
      business_date_end: combinedDateRange.max,
      cora_acct_code_scope: uniqueValues([...dmsRows, ...snowflakeRows], 'cora_acct_code').join('|'),
      dms_scoped_records: dmsRows.length,
      snowflake_scoped_records: snowflakeRows.length,
      eligible_records: eligibleRecords,
      matched_key_records: matchedKeyRecords,
      validated_value_matches: validatedValueMatches,
      missing_from_snowflake: subjectOpenRows.filter((row) => String(row.raw_exception_type || '').includes('missing_from_snowflake')).length,
      snowflake_only: subjectOpenRows.filter((row) => row.raw_exception_type === 'missing_from_dms').length,
      mapping_review_records: mappingReviewRecords,
      timing_review_records: timingReviewRecords,
      formula_definition_review_records: formulaDefinitionReviewRecords,
      candidate_defect_records: candidateDefectRecords,
      not_scored_records: notScoredRecords,
      key_match_rate: rate(matchedKeyRecords, eligibleRecords),
      raw_value_match_rate: rate(validatedValueMatches, valueScoredRecords),
      classification_adjusted_readiness_rate: rate(readinessRows, eligibleRecords),
      migration_blocker_count: migrationBlockers,
      decision_status: decisionStatus,
      confidence,
      plain_english_readout: accuracyReadout(subject.id, decisionStatus, { migrationBlockers }),
    });
  }

  const sampleDefinitions = [
    {
      sampleName: 'accuracy_mapping_review_sample',
      classification: 'blank_primary_dealer_with_secondary_match|found_in_snowflake_wrong_dealer_context|ambiguous_dealer_context|mapping_rule_gap',
      description: 'Bounded rows where the business key is found in Snowflake, but dealer/account context needs review.',
      rows: sampleRows(openRows.filter((row) => row.classification_group === 'mapping')),
    },
    {
      sampleName: 'accuracy_amount_component_gap_sample',
      classification: 'amount_component_gap',
      description: 'Bounded matched-key repair-order rows where DMS customer-pay components do not equal Snowflake PAYCPTOTAL.',
      rows: sampleRows(changedRows.filter((row) => row.review_classification === 'amount_component_gap')),
    },
    {
      sampleName: 'accuracy_unexplained_amount_mismatch_sample',
      classification: 'material_amount_mismatch_unexplained',
      description: 'Bounded matched-key rows with material amount differences that do not yet have a confirmed explanation.',
      rows: sampleRows(changedRows.filter((row) => row.review_classification === 'material_amount_mismatch_unexplained')),
    },
    {
      sampleName: 'accuracy_true_missing_from_snowflake_sample',
      classification: 'true_missing_from_snowflake',
      description: 'Bounded DMS source-of-record rows not found in Snowflake even after the current broad presence checks.',
      rows: sampleRows(openRows.filter((row) => row.review_classification === 'true_missing_from_snowflake')),
    },
    {
      sampleName: 'accuracy_timing_review_sample',
      classification: 'timing_candidate|true_snowflake_only',
      description: 'Bounded rows that may be explained by refresh timing, freshness, or scope review.',
      rows: sampleRows(openRows.filter((row) => row.classification_group === 'timing' || row.review_classification === 'true_snowflake_only')),
    },
  ];
  const sampleOutputs = sampleDefinitions.map((sample) => ({
    file: accuracySampleFileName(sample.sampleName),
    rows: sample.rows,
  }));
  const sampleManifestRows = sampleDefinitions.map((sample) => accuracySampleManifestRow({
    runId,
    sampleName: sample.sampleName,
    rows: sample.rows,
    classification: sample.classification,
    description: sample.description,
  }));

  const outputsToWrite = [
    {
      file: 'accuracy/accuracy_scorecard.csv',
      rows: scorecardRows,
    },
    {
      file: 'accuracy/accuracy_metric_definitions.csv',
      rows: metricDefinitionRows(),
    },
    {
      file: 'accuracy/accuracy_blockers.csv',
      rows: allBlockerRows,
    },
    {
      file: 'accuracy/accuracy_review_samples_manifest.csv',
      rows: sampleManifestRows,
    },
    ...sampleOutputs,
  ];
  for (const output of outputsToWrite) {
    const currentFile = path.join(currentDir, output.file);
    const archiveFile = path.join(runDir, output.file);
    await writeCsv(currentFile, output.rows);
    await copyIfExists(currentFile, archiveFile);
  }
  return outputsToWrite.map((output) => ({
    output: output.file,
    row_count: output.rows.length,
  }));
}

async function openPools(connectors) {
  const snowflake = await connectSnowflake(connectors.snowflake);
  const credentialMode = sqlServerCredentialMode(connectors.sqlserver);
  const sqlDriver = await loadSqlServerDriver(credentialMode);
  const { config } = buildSqlServerConnectionConfig(connectors.sqlserver, 300000);
  const sqlserver = new sqlDriver.ConnectionPool(config);
  await sqlserver.connect();
  return { snowflake, sqlserver };
}

async function closePools(pools = {}) {
  if (pools.snowflake) {
    await new Promise((resolve) => pools.snowflake.destroy(() => resolve())).catch(() => {});
  }
  if (pools.sqlserver) {
    await pools.sqlserver.close().catch(() => {});
  }
}

async function archiveOutputs(datasetDir, runDir) {
  const currentAudit = path.join(datasetDir, 'current/audit/run_status.csv');
  const currentManifest = path.join(datasetDir, 'current/audit/run_manifest.json');
  await copyIfExists(currentAudit, path.join(runDir, 'audit/run_status.csv'));
  await copyIfExists(currentManifest, path.join(runDir, 'audit/run_manifest.json'));
}

async function main() {
  const mode = argValue('--mode', 'profile');
  const daysBack = Number(argValue('--days-back', '30'));
  const rowLimit = Number(argValue('--row-limit', '1000'));
  const planOnly = hasFlag('--plan-only');
  const runId = utcStamp();
  const startedAt = new Date().toISOString();
  const datasetDir = datasetRoot();
  const currentDir = path.join(datasetDir, 'current');
  const runDir = path.join(datasetDir, 'runs', runId);
  const jobResults = [];
  const warnings = [];
  const errors = [];
  const outputs = [];

  const jobs =
    mode === 'profile'
      ? profileJobs
      : mode === 'daily_summary'
        ? summaryJobs
        : mode === 'detail_exceptions'
          ? detailJobs
          : null;
  if (!jobs) {
    throw new Error(`Mode '${mode}' is not implemented yet. Use --mode profile, --mode daily_summary, or --mode detail_exceptions.`);
  }
  if (!Number.isFinite(daysBack) || daysBack <= 0 || daysBack > 366) {
    throw new Error('--days-back must be between 1 and 366.');
  }
  if (!Number.isFinite(rowLimit) || rowLimit <= 0 || rowLimit > 5000) {
    throw new Error('--row-limit must be between 1 and 5000.');
  }

  const connectors = {
    snowflake: runtimeReadyConnector(getConnector(SNOWFLAKE_CONNECTOR_ID, actor)),
    sqlserver: runtimeReadyConnector(getConnector(SQLSERVER_CONNECTOR_ID, actor)),
  };
  if (!connectors.snowflake) throw new Error(`Missing connector: ${SNOWFLAKE_CONNECTOR_ID}`);
  if (!connectors.sqlserver) throw new Error(`Missing connector: ${SQLSERVER_CONNECTOR_ID}`);

  for (const job of jobs) {
    await loadSql(datasetDir, job, daysBack);
    jobResults.push({
      job_id: job.id,
      source: job.source,
      subject: job.subject,
      status: planOnly ? 'planned' : 'pending',
      sql_file: job.sql,
      output: job.output,
    });
  }

  let pools = {};
  try {
    if (!planOnly) {
      pools = await openPools(connectors);
      jobResults.length = 0;
      const extractResults = [];
      for (const job of jobs) {
        const result = mode === 'profile'
          ? await runProfileJob({
            datasetDir,
            currentDir,
            runDir,
            job,
            daysBack,
            connectors,
            pools,
          })
          : await runExtractJob({
            datasetDir,
            currentDir,
            runDir,
            job,
            daysBack,
            connectors,
            pools,
          });
        if (mode === 'daily_summary' || mode === 'detail_exceptions') extractResults.push(result);
        const { rows, ...manifestResult } = result;
        jobResults.push(manifestResult);
      }
      if (mode === 'daily_summary') {
        const comparisonOutputs = await writeDailyComparisons({
          datasetDir,
          currentDir,
          runDir,
          extractResults,
        });
        outputs.push(...comparisonOutputs);
      }
      if (mode === 'detail_exceptions') {
        const exceptionOutputs = await writeDetailExceptions({
          currentDir,
          runDir,
          runId,
          extractResults,
          rowLimit,
          pools,
        });
        outputs.push(...exceptionOutputs);
        const accuracyOutputs = await writeAccuracyOutputs({
          currentDir,
          runDir,
          runId,
          extractResults,
        });
        outputs.push(...accuracyOutputs);
      }
    }
  } catch (err) {
    errors.push({
      message: err.message,
      stack: err.stack,
    });
    throw err;
  } finally {
    await closePools(pools);
    const completedAt = new Date().toISOString();
    const finalStatus = errors.length ? 'failed' : planOnly ? 'planned' : 'succeeded';
    const statusRows = [
      {
        run_id: runId,
        started_at: startedAt,
        completed_at: completedAt,
        status: finalStatus,
        mode,
        dataset_id: DATASET_ID,
        snowflake_status: jobResults.some((job) => job.source === 'snowflake' && job.status === 'succeeded')
          ? 'succeeded'
          : planOnly
            ? 'planned'
            : errors.length
              ? 'failed'
              : 'not_run',
        sqlserver_status: jobResults.some((job) => job.source === 'sqlserver' && job.status === 'succeeded')
          ? 'succeeded'
          : planOnly
            ? 'planned'
            : errors.length
              ? 'failed'
              : 'not_run',
        warning_count: warnings.length,
        error_count: errors.length,
        notes: planOnly
          ? 'Plan-only run validated SQL files and output targets without connecting to source systems.'
          : mode === 'profile'
            ? 'Profile run completed aggregate CSV outputs.'
            : mode === 'daily_summary'
              ? 'Daily summary run completed aggregate comparison CSV outputs.'
              : 'Detail exception run completed bounded local exception CSV outputs.',
      },
    ];
    await writeCsv(path.join(currentDir, 'audit/run_status.csv'), statusRows);
    const manifest = {
      run_id: runId,
      dataset_id: DATASET_ID,
      mode,
      days_back: daysBack,
      row_limit: rowLimit,
      plan_only: planOnly,
      started_at: startedAt,
      completed_at: completedAt,
      status: finalStatus,
      connectors: {
        snowflake: SNOWFLAKE_CONNECTOR_ID,
        sqlserver: SQLSERVER_CONNECTOR_ID,
      },
      jobs: jobResults,
      outputs,
      warnings,
      errors: errors.map((err) => ({ message: err.message })),
    };
    await writeJson(path.join(currentDir, 'audit/run_manifest.json'), manifest);
    await archiveOutputs(datasetDir, runDir);
    console.log(JSON.stringify(manifest, null, 2));
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exitCode = 1;
});
