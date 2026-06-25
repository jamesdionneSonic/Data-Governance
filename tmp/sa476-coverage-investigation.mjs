import 'dotenv/config';

import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';

import { getConnector } from '../src/services/connectorService.js';
import { connectorConfigValue, connectorCredentialValue } from '../src/services/connectorRuntime/runtimeValues.js';
import {
  buildSqlServerConnectionConfig,
  loadSqlServerDriver,
  sqlServerCredentialMode,
} from '../src/services/connectorRuntime/sqlServerConnection.js';

const actor = { id: 'system', name: 'System', role: 'admin', roles: ['Admin'] };
const datasetDir = 'data-validation/datasets/snowflake-dms-shared-consumption';
const outputDir = path.join(datasetDir, 'current/coverage/sa476');

function runtimeReadyConnector(connector = {}) {
  return {
    ...connector,
    credential: {
      ...(connector.credential || {}),
      ...(connector.credential?.values || {}),
    },
  };
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

function executeSnowflake(connection, sqlText) {
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

function csvCell(value) {
  if (value === null || value === undefined) return '';
  const text = String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

async function writeCsv(file, rows) {
  await fsp.mkdir(path.dirname(file), { recursive: true });
  const headers = [...new Set(rows.flatMap((row) => Object.keys(row)))];
  const lines = [
    headers.map(csvCell).join(','),
    ...rows.map((row) => headers.map((header) => csvCell(row[header])).join(',')),
  ];
  await fsp.writeFile(file, `${lines.join('\n')}\n`, 'utf8');
}

function lowerRow(row = {}) {
  return Object.fromEntries(Object.entries(row).map(([key, value]) => [key.toLowerCase(), value]));
}

function quotedList(values) {
  return values.map((value) => `'${String(value).replace(/'/g, "''")}'`).join(',');
}

function countBy(rows, field) {
  const out = {};
  for (const row of rows) out[row[field] || '(blank)'] = (out[row[field] || '(blank)'] || 0) + 1;
  return out;
}

function topEntries(object, limit = 20) {
  return Object.entries(object)
    .sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0])))
    .slice(0, limit)
    .map(([key, count]) => ({ key, count }));
}

async function main() {
  const missingRows = parseCsv(path.join(datasetDir, 'current/exceptions/repair_orders_missing_from_snowflake.csv'))
    .filter((row) => row.dealer_name === 'SA476 family (dealer name pending)');
  const missingRoNumbers = [...new Set(missingRows.map((row) => row.business_key.split('|')[1]).filter(Boolean))];

  const snowflakeConnector = runtimeReadyConnector(getConnector('snowflake-bipslyv-tlb12786', actor));
  const sqlServerConnector = runtimeReadyConnector(getConnector('sqlserver-l1-dwasql-02-12010-dms', actor));
  const credentialMode = sqlServerCredentialMode(sqlServerConnector);
  const sqlDriver = await loadSqlServerDriver(credentialMode);
  const { config } = buildSqlServerConnectionConfig(sqlServerConnector, 300000);
  const snowflake = await connectSnowflake(snowflakeConnector);
  const sqlserver = new sqlDriver.ConnectionPool(config);
  await sqlserver.connect();

  try {
    const roList = quotedList(missingRoNumbers);
    const broadSnowflake = missingRoNumbers.length
      ? (await executeSnowflake(snowflake, `
          select
            cast(RONUM as varchar) as ro_number,
            cast(DEALERCODE as varchar) as dealercode,
            cast(STORENUMBER as varchar) as store_number,
            cast(EIS_STORE_ID as varchar) as eis_store_id,
            cast(ACCOUNTINGACCOUNT as varchar) as accounting_account,
            cast(ROOPENDATE as date) as ro_open_date,
            cast(ROCLOSEDATE as date) as ro_close_date,
            cast(INVOICEPOSTDATE as date) as invoice_post_date,
            try_to_number(PAYCPTOTAL) as pay_cp_total,
            cast(LANDING_TIME as timestamp_tz) as landing_time
          from CDK_DN_TITAN_FTR_UNMASK_E100030_SHARE.CONSUMPTION_SHARED_E100030.REPAIR_ORDER_RAW
          where cast(RONUM as varchar) in (${roList})
          order by ro_number, dealercode
        `)).map(lowerRow)
      : [];

    const dmsDetail = missingRoNumbers.length
      ? (await executeSqlServer(sqlserver, `
          with base as (
            select
              'closed' as source_table,
              1 as source_priority,
              cast(ronumber as varchar(100)) as ro_number,
              try_convert(date, opendate) as open_date,
              try_convert(date, closedate) as close_date,
              coalesce(try_convert(datetime2, rowlastupdated), try_convert(datetime2, Meta_LoadDate)) as latest_update_timestamp,
              coalesce(try_convert(decimal(19, 4), laborsalecustomerpay), 0)
                + coalesce(try_convert(decimal(19, 4), partssalecustomerpay), 0)
                + coalesce(try_convert(decimal(19, 4), miscsalecustomerpay), 0) as customer_pay_total
            from dbo.servicesalesclosed
            where cora_acct_id = 20246 and cast(ronumber as varchar(100)) in (${roList})
            union all
            select
              'open',
              2,
              cast(ronumber as varchar(100)),
              try_convert(date, opendate),
              try_convert(date, closedate),
              coalesce(try_convert(datetime2, rowlastupdated), try_convert(datetime2, Meta_LoadDate)),
              coalesce(try_convert(decimal(19, 4), laborsalecustomerpay), 0)
                + coalesce(try_convert(decimal(19, 4), partssalecustomerpay), 0)
                + coalesce(try_convert(decimal(19, 4), miscsalecustomerpay), 0)
            from dbo.servicesalesopen
            where cora_acct_id = 20246 and cast(ronumber as varchar(100)) in (${roList})
          ),
          ranked as (
            select *,
              row_number() over (partition by ro_number order by source_priority, latest_update_timestamp desc) as rn,
              count(*) over (partition by ro_number) as duplicate_source_rows
            from base
          )
          select *
          from ranked
          where rn = 1
          order by ro_number
        `)).map(lowerRow)
      : [];

    const snowflakeRoSet = new Set(broadSnowflake.map((row) => String(row.ro_number)));
    const foundElsewhere = broadSnowflake.filter((row) => !['R0429', 'S000500622'].includes(String(row.dealercode)));
    const stillAbsent = missingRows.filter((row) => !snowflakeRoSet.has(row.business_key.split('|')[1]));

    const results = {
      generated_at: new Date().toISOString(),
      run_id: missingRows[0]?.run_id || '',
      sa476_missing_from_snowflake_count: missingRows.length,
      distinct_ro_numbers_checked: missingRoNumbers.length,
      broad_snowflake_matches: broadSnowflake.length,
      distinct_ros_found_anywhere_in_snowflake: snowflakeRoSet.size,
      found_under_other_snowflake_dealer_codes: foundElsewhere.length,
      still_absent_from_snowflake: stillAbsent.length,
      missing_by_business_date: topEntries(countBy(missingRows, 'business_date')),
      broad_snowflake_matches_by_dealercode: countBy(broadSnowflake, 'dealercode'),
      dms_missing_rows_by_selected_source: countBy(dmsDetail, 'source_table'),
      dms_missing_rows_by_close_date: topEntries(countBy(dmsDetail, 'close_date')),
      dms_missing_rows_by_open_date: topEntries(countBy(dmsDetail, 'open_date')),
      conclusion:
        snowflakeRoSet.size === 0
          ? 'No SA476 missing RO numbers were found anywhere in Snowflake REPAIR_ORDER_RAW by RONUM. This points away from dealer-code mapping and toward feed coverage, filter, or source extraction behavior.'
          : 'Some SA476 missing RO numbers were found in Snowflake outside the current mapped dealer codes. Investigate dealer mapping.',
    };

    await fsp.mkdir(outputDir, { recursive: true });
    await writeCsv(path.join(outputDir, 'sa476_missing_dms_ro_rows.csv'), missingRows);
    await writeCsv(path.join(outputDir, 'sa476_missing_dms_ro_detail.csv'), dmsDetail);
    await writeCsv(path.join(outputDir, 'sa476_broad_snowflake_ro_search.csv'), broadSnowflake);
    await writeCsv(path.join(outputDir, 'sa476_still_absent_from_snowflake.csv'), stillAbsent);
    await fsp.writeFile(path.join(outputDir, 'sa476_coverage_summary.json'), `${JSON.stringify(results, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify(results, null, 2));
  } finally {
    await sqlserver.close().catch(() => {});
    await new Promise((resolve) => snowflake.destroy(() => resolve())).catch(() => {});
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
