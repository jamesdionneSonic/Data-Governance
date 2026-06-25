import fs from 'node:fs';

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

const root = 'data-validation/datasets/snowflake-dms-shared-consumption/current/normalized';
const dms = parseCsv(`${root}/sqlserver_dms_repair_order_detail.csv`);
const snowflake = parseCsv(`${root}/snowflake_repair_order_detail.csv`);
const snowflakeByKey = new Map(snowflake.map((row) => [row.business_key, row]));
const dmsKeys = new Set(dms.map((row) => row.business_key));
const snowflakeKeys = new Set(snowflake.map((row) => row.business_key));

let matchedKeys = 0;
let amountSameUnderOne = 0;
let amountDiffGeOne = 0;
let dateSame = 0;
let dateDiff = 0;
const examples = [];

for (const dmsRow of dms) {
  const snowflakeRow = snowflakeByKey.get(dmsRow.business_key);
  if (!snowflakeRow) continue;
  matchedKeys += 1;

  const dmsAmount = Number(dmsRow.amount_total || 0);
  const snowflakeAmount = Number(snowflakeRow.amount_total || 0);
  const difference = snowflakeAmount - dmsAmount;
  if (Math.abs(difference) < 1) {
    amountSameUnderOne += 1;
  } else {
    amountDiffGeOne += 1;
    if (examples.length < 12) {
      examples.push({
        business_key: dmsRow.business_key,
        dms_date: dmsRow.business_date,
        snowflake_date: snowflakeRow.business_date,
        dms_amount: dmsAmount,
        snowflake_amount: snowflakeAmount,
        difference,
      });
    }
  }

  if (dmsRow.business_date === snowflakeRow.business_date) dateSame += 1;
  else dateDiff += 1;
}

console.log(JSON.stringify({
  dms_rows: dms.length,
  snowflake_rows: snowflake.length,
  dms_unique_keys: dmsKeys.size,
  snowflake_unique_keys: snowflakeKeys.size,
  matched_keys: matchedKeys,
  matched_unique_keys: [...dmsKeys].filter((key) => snowflakeKeys.has(key)).length,
  dms_unique_missing_in_snowflake: [...dmsKeys].filter((key) => !snowflakeKeys.has(key)).length,
  snowflake_unique_missing_in_dms: [...snowflakeKeys].filter((key) => !dmsKeys.has(key)).length,
  dms_duplicate_key_rows: dms.length - dmsKeys.size,
  snowflake_duplicate_key_rows: snowflake.length - snowflakeKeys.size,
  amount_same_under_1: amountSameUnderOne,
  amount_diff_ge_1: amountDiffGeOne,
  date_same: dateSame,
  date_diff: dateDiff,
  examples,
}, null, 2));
