import fs from 'node:fs';
import path from 'node:path';

function parseCsv(file) {
  const text = fs.readFileSync(file, 'utf8').trim();
  if (!text) return [];
  const [headerLine, ...lines] = text.split(/\r?\n/);
  const headers = parseLine(headerLine);
  return lines.map((line) => {
    const values = parseLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? '']));
  });
}

function parseLine(line) {
  const values = [];
  let cell = '';
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"' && line[index + 1] === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === ',' && !quoted) {
      values.push(cell);
      cell = '';
    } else {
      cell += char;
    }
  }
  values.push(cell);
  return values;
}

function number(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function bucketDifference(absDiff) {
  if (absDiff < 1) return 'under_1';
  if (absDiff < 10) return '1_to_9_99';
  if (absDiff < 50) return '10_to_49_99';
  if (absDiff < 100) return '50_to_99_99';
  if (absDiff < 500) return '100_to_499_99';
  return '500_plus';
}

const root = 'data-validation/datasets/snowflake-dms-shared-consumption/current';
const changed = parseCsv(path.join(root, 'exceptions/changed_records.csv'))
  .filter((row) => row.subject_area === 'repair_orders');
const missingSf = parseCsv(path.join(root, 'exceptions/repair_orders_missing_from_snowflake.csv'));
const missingDms = parseCsv(path.join(root, 'exceptions/repair_orders_missing_from_dms.csv'));
const dmsRepair = parseCsv(path.join(root, 'normalized/sqlserver_dms_repair_order_detail.csv'));
const snowflakeRepair = parseCsv(path.join(root, 'normalized/snowflake_repair_order_detail.csv'));

const changedBuckets = {};
const changedByDealer = {};
const changedByDate = {};
let changedAbsTotal = 0;
const changedExamples = [];
for (const row of changed) {
  const diff = number(row.difference);
  const abs = Math.abs(diff);
  changedAbsTotal += abs;
  changedBuckets[bucketDifference(abs)] = (changedBuckets[bucketDifference(abs)] || 0) + 1;
  changedByDealer[row.dealer_name] = (changedByDealer[row.dealer_name] || 0) + 1;
  changedByDate[row.business_date] = (changedByDate[row.business_date] || 0) + 1;
  if (changedExamples.length < 12) changedExamples.push(row);
}

function countBy(rows, field) {
  const out = {};
  for (const row of rows) out[row[field] || '(blank)'] = (out[row[field] || '(blank)'] || 0) + 1;
  return out;
}

function topEntries(object, limit = 10) {
  return Object.entries(object)
    .sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0])))
    .slice(0, limit)
    .map(([key, count]) => ({ key, count }));
}

const sourceMix = countBy(dmsRepair, 'selected_source_table');
const overlapRows = dmsRepair.filter((row) => number(row.duplicate_source_rows) > 1).length;

const result = {
  generated_at: new Date().toISOString(),
  current_run_id: changed[0]?.run_id || missingSf[0]?.run_id || missingDms[0]?.run_id || '',
  repair_changed_values: {
    count: changed.length,
    average_abs_difference: changed.length ? Math.round((changedAbsTotal / changed.length) * 100) / 100 : 0,
    difference_buckets: changedBuckets,
    by_dealer: changedByDealer,
    top_dates: topEntries(changedByDate),
    classification: 'field_definition_or_fee_component_candidate',
    rationale: 'Most remaining changed values are small customer-pay amount deltas after switching away from all-sale totals; likely tax, fee, sublet, rounding, or source-timing components remain.',
    examples: changedExamples,
  },
  repair_missing_from_snowflake: {
    count: missingSf.length,
    by_dealer: countBy(missingSf, 'dealer_name'),
    top_dates: topEntries(countBy(missingSf, 'business_date')),
    classification: 'feed_coverage_or_filter_candidate',
    rationale: 'These remain after DMS grain/amount repair, so they are key-presence differences rather than amount logic differences.',
    examples: missingSf.slice(0, 12),
  },
  repair_missing_from_dms: {
    count: missingDms.length,
    by_dealer: countBy(missingDms, 'dealer_name'),
    top_dates: topEntries(countBy(missingDms, 'business_date')),
    classification: 'timing_candidate',
    rationale: 'Samples are concentrated on the current business date, which is consistent with Snowflake being ahead of the DMS extract or source timing differences.',
    examples: missingDms.slice(0, 12),
  },
  dms_repair_extract_health: {
    row_count: dmsRepair.length,
    unique_business_keys: new Set(dmsRepair.map((row) => row.business_key)).size,
    duplicate_business_key_count: dmsRepair.length - new Set(dmsRepair.map((row) => row.business_key)).size,
    selected_source_mix: sourceMix,
    rows_with_open_closed_overlap: overlapRows,
  },
  snowflake_repair_extract_health: {
    row_count: snowflakeRepair.length,
    unique_business_keys: new Set(snowflakeRepair.map((row) => row.business_key)).size,
  },
};

const outFile = 'tmp/repair-order-current-difference-classification.json';
fs.writeFileSync(outFile, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ status: 'succeeded', outFile }, null, 2));
