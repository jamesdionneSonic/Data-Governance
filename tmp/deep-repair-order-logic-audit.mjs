import 'dotenv/config';

import fs from 'node:fs/promises';
import path from 'node:path';

import { getConnector } from '../src/services/connectorService.js';
import { connectorConfigValue, connectorCredentialValue } from '../src/services/connectorRuntime/runtimeValues.js';
import {
  buildSqlServerConnectionConfig,
  loadSqlServerDriver,
  sqlServerCredentialMode,
} from '../src/services/connectorRuntime/sqlServerConnection.js';

const actor = { id: 'system', name: 'System', role: 'admin', roles: ['Admin'] };

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

function lowerRow(row = {}) {
  return Object.fromEntries(Object.entries(row).map(([key, value]) => [key.toLowerCase(), value]));
}

function number(value) {
  if (value === null || value === undefined || value === '') return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function rounded(value) {
  return Math.round(number(value) * 100) / 100;
}

function scoreCandidate(name, matchedRows) {
  let withinOne = 0;
  let exact = 0;
  let totalAbsDiff = 0;
  const examples = [];
  for (const row of matchedRows) {
    const dmsValue = rounded(row.dms[name]);
    const sfValue = rounded(row.sf.pay_cp_total);
    const diff = rounded(sfValue - dmsValue);
    const abs = Math.abs(diff);
    totalAbsDiff += abs;
    if (abs < 1) withinOne += 1;
    if (abs === 0) exact += 1;
    if (abs >= 1 && examples.length < 8) {
      examples.push({
        business_key: row.business_key,
        dms_source_table: row.dms.source_table,
        dms_business_date: row.dms.business_date,
        snowflake_business_date: row.sf.business_date,
        dms_value: dmsValue,
        snowflake_pay_cp_total: sfValue,
        difference: diff,
      });
    }
  }
  return {
    candidate: name,
    matched_keys: matchedRows.length,
    exact,
    within_one: withinOne,
    diff_ge_one: matchedRows.length - withinOne,
    average_abs_diff: matchedRows.length ? rounded(totalAbsDiff / matchedRows.length) : 0,
    examples,
  };
}

async function main() {
  const snowflakeConnector = runtimeReadyConnector(getConnector('snowflake-bipslyv-tlb12786', actor));
  const sqlServerConnector = runtimeReadyConnector(getConnector('sqlserver-l1-dwasql-02-12010-dms', actor));
  const credentialMode = sqlServerCredentialMode(sqlServerConnector);
  const sqlDriver = await loadSqlServerDriver(credentialMode);
  const { config } = buildSqlServerConnectionConfig(sqlServerConnector, 300000);
  const snowflake = await connectSnowflake(snowflakeConnector);
  const sqlserver = new sqlDriver.ConnectionPool(config);
  await sqlserver.connect();

  try {
    const overlap = (await executeSqlServer(sqlserver, `
      with closed_keys as (
        select
          case when cora_acct_id = 445 then 'SA466' when cora_acct_id = 20246 then 'SA476' end + '|' + cast(ronumber as varchar(100)) as business_key,
          cora_acct_id
        from dbo.servicesalesclosed
        where coalesce(try_convert(date, closedate), try_convert(date, opendate), try_convert(date, rowlastupdated), try_convert(date, Meta_LoadDate))
              >= dateadd(day, -30, cast(getdate() as date))
          and cora_acct_id in (445, 20246)
      ),
      open_keys as (
        select
          case when cora_acct_id = 445 then 'SA466' when cora_acct_id = 20246 then 'SA476' end + '|' + cast(ronumber as varchar(100)) as business_key,
          cora_acct_id
        from dbo.servicesalesopen
        where coalesce(try_convert(date, closedate), try_convert(date, opendate), try_convert(date, rowlastupdated), try_convert(date, Meta_LoadDate))
              >= dateadd(day, -30, cast(getdate() as date))
          and cora_acct_id in (445, 20246)
      )
      select
        coalesce(c.cora_acct_id, o.cora_acct_id) as cora_acct_id,
        count(distinct c.business_key) as closed_keys,
        count(distinct o.business_key) as open_keys,
        count(distinct case when c.business_key is not null and o.business_key is not null then c.business_key end) as overlapping_keys
      from closed_keys c
      full outer join open_keys o on o.business_key = c.business_key
      group by coalesce(c.cora_acct_id, o.cora_acct_id)
      order by coalesce(c.cora_acct_id, o.cora_acct_id)
    `)).map(lowerRow);

    const dmsRows = (await executeSqlServer(sqlserver, `
      with base as (
        select
          'closed' as source_table,
          1 as source_priority,
          case when cora_acct_id = 445 then 'SA466' when cora_acct_id = 20246 then 'SA476' end + '|' + cast(ronumber as varchar(100)) as business_key,
          case when cora_acct_id = 445 then 'SA466 family (dealer name pending)' when cora_acct_id = 20246 then 'SA476 family (dealer name pending)' end as dealer_name,
          try_convert(date, closedate) as business_date,
          try_convert(date, opendate) as open_date,
          try_convert(date, closedate) as close_date,
          coalesce(try_convert(datetime2, rowlastupdated), try_convert(datetime2, Meta_LoadDate)) as latest_update_timestamp,
          coalesce(try_convert(decimal(19, 4), laborsale), 0) + coalesce(try_convert(decimal(19, 4), partssale), 0) + coalesce(try_convert(decimal(19, 4), miscsale), 0) as all_sale_total,
          coalesce(try_convert(decimal(19, 4), laborsalecustomerpay), 0) + coalesce(try_convert(decimal(19, 4), partssalecustomerpay), 0) + coalesce(try_convert(decimal(19, 4), miscsalecustomerpay), 0) as cp_core_total,
          coalesce(try_convert(decimal(19, 4), laborsalecustomerpay), 0) + coalesce(try_convert(decimal(19, 4), partssalecustomerpay), 0) + coalesce(try_convert(decimal(19, 4), miscsalecustomerpay), 0) + coalesce(try_convert(decimal(19, 4), rosubletsalecp), 0) as cp_with_sublet_total,
          coalesce(try_convert(decimal(19, 4), laborsalecustomerpay), 0) + coalesce(try_convert(decimal(19, 4), partssalecustomerpay), 0) + coalesce(try_convert(decimal(19, 4), miscsalecustomerpay), 0) + coalesce(try_convert(decimal(19, 4), rosubletsalecp), 0) as cp_with_sublet_total_duplicate
        from dbo.servicesalesclosed
        where coalesce(try_convert(date, closedate), try_convert(date, opendate), try_convert(date, rowlastupdated), try_convert(date, Meta_LoadDate))
              >= dateadd(day, -30, cast(getdate() as date))
          and cora_acct_id in (445, 20246)
        union all
        select
          'open',
          2,
          case when cora_acct_id = 445 then 'SA466' when cora_acct_id = 20246 then 'SA476' end + '|' + cast(ronumber as varchar(100)),
          case when cora_acct_id = 445 then 'SA466 family (dealer name pending)' when cora_acct_id = 20246 then 'SA476 family (dealer name pending)' end,
          try_convert(date, opendate),
          try_convert(date, opendate),
          try_convert(date, closedate),
          coalesce(try_convert(datetime2, rowlastupdated), try_convert(datetime2, Meta_LoadDate)),
          coalesce(try_convert(decimal(19, 4), laborsale), 0) + coalesce(try_convert(decimal(19, 4), partssale), 0) + coalesce(try_convert(decimal(19, 4), miscsale), 0),
          coalesce(try_convert(decimal(19, 4), laborsalecustomerpay), 0) + coalesce(try_convert(decimal(19, 4), partssalecustomerpay), 0) + coalesce(try_convert(decimal(19, 4), miscsalecustomerpay), 0),
          coalesce(try_convert(decimal(19, 4), laborsalecustomerpay), 0) + coalesce(try_convert(decimal(19, 4), partssalecustomerpay), 0) + coalesce(try_convert(decimal(19, 4), miscsalecustomerpay), 0) + coalesce(try_convert(decimal(19, 4), rosubletsalecp), 0),
          coalesce(try_convert(decimal(19, 4), laborsalecustomerpay), 0) + coalesce(try_convert(decimal(19, 4), partssalecustomerpay), 0) + coalesce(try_convert(decimal(19, 4), miscsalecustomerpay), 0) + coalesce(try_convert(decimal(19, 4), rosubletsalecp), 0)
        from dbo.servicesalesopen
        where coalesce(try_convert(date, closedate), try_convert(date, opendate), try_convert(date, rowlastupdated), try_convert(date, Meta_LoadDate))
              >= dateadd(day, -30, cast(getdate() as date))
          and cora_acct_id in (445, 20246)
      ),
      ranked as (
        select *,
          row_number() over (
            partition by business_key
            order by source_priority, latest_update_timestamp desc
          ) as rn,
          count(*) over (partition by business_key) as duplicate_source_rows
        from base
      )
      select *
      from ranked
      where rn = 1
      order by business_key
    `)).map(lowerRow);

    const snowflakeRows = (await executeSnowflake(snowflake, `
      select
        case
          when cast(DEALERCODE as varchar) in ('05179') then 'SA466'
          when cast(DEALERCODE as varchar) in ('R0429', 'S000500622') then 'SA476'
        end || '|' || cast(RONUM as varchar) as business_key,
        case
          when cast(DEALERCODE as varchar) in ('05179') then 'SA466 family (dealer name pending)'
          when cast(DEALERCODE as varchar) in ('R0429', 'S000500622') then 'SA476 family (dealer name pending)'
        end as dealer_name,
        case when ROCLOSEDATE is not null then cast(ROCLOSEDATE as date) else cast(ROOPENDATE as date) end as business_date,
        cast(ROOPENDATE as date) as open_date,
        cast(ROCLOSEDATE as date) as close_date,
        cast(DEALERCODE as varchar) as dealer_code,
        try_to_number(PAYCPTOTAL) as pay_cp_total,
        try_to_number(PAYBALANCEDUE) as pay_balance_due,
        try_to_number(PAYPAYMENTSMADE) as pay_payments_made,
        try_to_number(ESTROLINETOTAL) as est_ro_line_total,
        try_to_number(TOTALTAXPRICE) as total_tax_price,
        cast(LANDING_TIME as timestamp_tz) as latest_update_timestamp
      from CDK_DN_TITAN_FTR_UNMASK_E100030_SHARE.CONSUMPTION_SHARED_E100030.REPAIR_ORDER_RAW
      where coalesce(ROCLOSEDATE, ROOPENDATE, APPOINTMENTDATE, INVOICEPOSTDATE, cast(LANDING_TIME as date))
            >= dateadd(day, -30, current_date())
        and cast(DEALERCODE as varchar) in ('05179', 'R0429', 'S000500622')
      order by business_key
    `)).map(lowerRow);

    const dmsByKey = new Map(dmsRows.map((row) => [row.business_key, row]));
    const sfByKey = new Map(snowflakeRows.map((row) => [row.business_key, row]));
    const matchedRows = [];
    for (const [businessKey, dms] of dmsByKey.entries()) {
      const sf = sfByKey.get(businessKey);
      if (sf) matchedRows.push({ business_key: businessKey, dms, sf });
    }

    const dateAlignment = matchedRows.reduce((acc, row) => {
      if (String(row.dms.business_date).slice(0, 10) === String(row.sf.business_date).slice(0, 10)) acc.same += 1;
      else acc.different += 1;
      return acc;
    }, { same: 0, different: 0 });

    const sourcePriorityMix = dmsRows.reduce((acc, row) => {
      acc[row.source_table] = (acc[row.source_table] || 0) + 1;
      return acc;
    }, {});

    const audit = {
      generated_at: new Date().toISOString(),
      basis: '30-day live read-only repair-order validation logic audit',
      open_closed_overlap: overlap,
      row_counts_after_dms_dedup: {
        dms_unique_rows: dmsRows.length,
        snowflake_rows: snowflakeRows.length,
        matched_keys: matchedRows.length,
        dms_missing_from_snowflake: dmsRows.filter((row) => !sfByKey.has(row.business_key)).length,
        snowflake_missing_from_dms: snowflakeRows.filter((row) => !dmsByKey.has(row.business_key)).length,
        dms_source_priority_mix: sourcePriorityMix,
      },
      date_alignment_on_matched_keys: dateAlignment,
      amount_candidate_scores_against_snowflake_pay_cp_total: [
        scoreCandidate('all_sale_total', matchedRows),
        scoreCandidate('cp_core_total', matchedRows),
        scoreCandidate('cp_with_sublet_total', matchedRows),
      ],
      recommended_logic: {
        dms_repair_order_grain: 'one row per dealer plus RO number after combining open and closed; prefer closed row when present, otherwise open row',
        repair_amount_candidate: 'replace current all-sale amount with a customer-pay DMS candidate; live scores identify the best available candidate but business confirmation is still required',
        repair_changed_value_status: 'do not treat changed_value repair-order output as source-quality evidence until amount mapping is corrected',
      },
    };

    const outFile = path.resolve('tmp/deep-repair-order-logic-audit.json');
    await fs.writeFile(outFile, `${JSON.stringify(audit, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify({ status: 'succeeded', outFile }, null, 2));
  } finally {
    await sqlserver.close().catch(() => {});
    await new Promise((resolve) => snowflake.destroy(() => resolve())).catch(() => {});
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
