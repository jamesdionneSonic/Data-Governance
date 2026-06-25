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
const snowflakeConnectorId = 'snowflake-bipslyv-tlb12786';
const sqlServerConnectorId = 'sqlserver-l1-dwasql-02-12010-dms';

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

async function main() {
  const snowflakeConnector = runtimeReadyConnector(getConnector(snowflakeConnectorId, actor));
  const sqlServerConnector = runtimeReadyConnector(getConnector(sqlServerConnectorId, actor));
  const credentialMode = sqlServerCredentialMode(sqlServerConnector);
  const sql = await loadSqlServerDriver(credentialMode);
  const { config } = buildSqlServerConnectionConfig(sqlServerConnector, 300000);
  const snowflake = await connectSnowflake(snowflakeConnector);
  const sqlPool = await sql.connect(config);

  try {
    const checks = {};

    checks.snowflakeTables = (await executeSnowflake(snowflake, `
      select table_catalog, table_schema, table_name, row_count
      from CDK_DN_TITAN_FTR_UNMASK_E100030_SHARE.information_schema.tables
      where table_schema = 'CONSUMPTION_SHARED_E100030'
        and table_name in ('VEHICLE_SALES_RAW', 'REPAIR_ORDER_RAW')
      order by table_name
    `)).map(lowerRow);

    checks.sqlServerTables = (await executeSqlServer(sqlPool, `
      select
        db_name() as database_name,
        schema_name(t.schema_id) as schema_name,
        t.name as table_name,
        sum(p.rows) as row_count
      from sys.tables t
      join sys.partitions p on p.object_id = t.object_id and p.index_id in (0, 1)
      where schema_name(t.schema_id) = 'dbo'
        and t.name in ('vehiclesalescurrent', 'servicesalesclosed', 'servicesalesopen', 'servicesalesdetailsclosed', 'appointments')
      group by t.schema_id, t.name
      order by t.name
    `)).map(lowerRow);

    checks.vehicleDealerCounts = {
      snowflake: (await executeSnowflake(snowflake, `
        select cast(branch as varchar) as branch, count(*) as row_count, count(distinct dealnumber) as deals
        from CDK_DN_TITAN_FTR_UNMASK_E100030_SHARE.CONSUMPTION_SHARED_E100030.VEHICLE_SALES_RAW
        where coalesce(SALESDATE, CONTRACTDATE, DEALSTATUSDATE, DELIVERYDATE, cast(LANDING_TIME as date))
              >= dateadd(day, -30, current_date())
          and (cast(branch as varchar) like '466%' or cast(branch as varchar) like '476%')
        group by cast(branch as varchar)
        order by branch
      `)).map(lowerRow),
      sqlserver: (await executeSqlServer(sqlPool, `
        select cast(branch as varchar(100)) as branch, count(*) as row_count, count(distinct dealno) as deals
        from dbo.vehiclesalescurrent
        where coalesce(try_convert(date, salesdate), try_convert(date, contractdate), try_convert(date, accountingdate), try_convert(date, rowlastupdated), try_convert(date, Meta_LoadDate))
              >= dateadd(day, -30, cast(getdate() as date))
          and (cast(branch as varchar(100)) like '466%' or cast(branch as varchar(100)) like '476%')
        group by cast(branch as varchar(100))
        order by branch
      `)).map(lowerRow),
    };

    checks.repairDealerCounts = {
      snowflake: (await executeSnowflake(snowflake, `
        select cast(dealercode as varchar) as dealercode, count(*) as row_count, count(distinct ronum) as repair_orders
        from CDK_DN_TITAN_FTR_UNMASK_E100030_SHARE.CONSUMPTION_SHARED_E100030.REPAIR_ORDER_RAW
        where coalesce(ROCLOSEDATE, ROOPENDATE, APPOINTMENTDATE, INVOICEPOSTDATE, cast(LANDING_TIME as date))
              >= dateadd(day, -30, current_date())
          and cast(dealercode as varchar) in ('05179', 'R0429', 'S000500622')
        group by cast(dealercode as varchar)
        order by dealercode
      `)).map(lowerRow),
      sqlserver: (await executeSqlServer(sqlPool, `
        select 'servicesalesclosed' as source_table, cora_acct_id, count(*) as row_count, count(distinct ronumber) as repair_orders
        from dbo.servicesalesclosed
        where coalesce(try_convert(date, closedate), try_convert(date, opendate), try_convert(date, rowlastupdated), try_convert(date, Meta_LoadDate))
              >= dateadd(day, -30, cast(getdate() as date))
          and cora_acct_id in (445, 20246)
        group by cora_acct_id
        union all
        select 'servicesalesopen', cora_acct_id, count(*) as row_count, count(distinct ronumber) as repair_orders
        from dbo.servicesalesopen
        where coalesce(try_convert(date, closedate), try_convert(date, opendate), try_convert(date, rowlastupdated), try_convert(date, Meta_LoadDate))
              >= dateadd(day, -30, cast(getdate() as date))
          and cora_acct_id in (445, 20246)
        group by cora_acct_id
        order by source_table, cora_acct_id
      `)).map(lowerRow),
    };

    checks.repairAmountCandidates = {
      snowflakeColumns: (await executeSnowflake(snowflake, `
        select column_name, data_type
        from CDK_DN_TITAN_FTR_UNMASK_E100030_SHARE.information_schema.columns
        where table_schema = 'CONSUMPTION_SHARED_E100030'
          and table_name = 'REPAIR_ORDER_RAW'
          and (
            column_name ilike '%PAY%' or column_name ilike '%TOTAL%' or column_name ilike '%LABOR%' or
            column_name ilike '%PART%' or column_name ilike '%MISC%' or column_name ilike '%SALE%'
          )
        order by column_name
      `)).map(lowerRow),
      sqlServerClosedColumns: (await executeSqlServer(sqlPool, `
        select c.name as column_name, ty.name as data_type
        from sys.columns c
        join sys.types ty on ty.user_type_id = c.user_type_id
        where c.object_id = object_id('dbo.servicesalesclosed')
          and (
            c.name like '%pay%' or c.name like '%total%' or c.name like '%labor%' or
            c.name like '%part%' or c.name like '%misc%' or c.name like '%sale%'
          )
        order by c.name
      `)).map(lowerRow),
    };

    checks.repairMatchedKeySample = {
      snowflake: (await executeSnowflake(snowflake, `
        select
          case
            when cast(DEALERCODE as varchar) in ('05179') then 'SA466'
            when cast(DEALERCODE as varchar) in ('R0429', 'S000500622') then 'SA476'
          end || '|' || cast(RONUM as varchar) as business_key,
          cast(DEALERCODE as varchar) as dealercode,
          cast(RONUM as varchar) as ronum,
          to_varchar(cast(ROOPENDATE as date)) as ro_open_date,
          to_varchar(cast(ROCLOSEDATE as date)) as ro_close_date,
          try_to_number(PAYCPTOTAL) as pay_cp_total,
          try_to_number(PAYBALANCEDUE) as pay_balance_due,
          try_to_number(TOTALTAXPRICE) as total_tax_price
        from CDK_DN_TITAN_FTR_UNMASK_E100030_SHARE.CONSUMPTION_SHARED_E100030.REPAIR_ORDER_RAW
        where coalesce(ROCLOSEDATE, ROOPENDATE, APPOINTMENTDATE, INVOICEPOSTDATE, cast(LANDING_TIME as date))
              >= dateadd(day, -30, current_date())
          and cast(dealercode as varchar) in ('05179', 'R0429', 'S000500622')
        order by ro_close_date nulls last, ro_open_date, business_key
        limit 20
      `)).map(lowerRow),
      sqlserver: (await executeSqlServer(sqlPool, `
        select top (20)
          case when cora_acct_id = 445 then 'SA466' when cora_acct_id = 20246 then 'SA476' end + '|' + cast(ronumber as varchar(100)) as business_key,
          cora_acct_id,
          cast(ronumber as varchar(100)) as ronumber,
          convert(varchar(30), try_convert(date, opendate), 23) as open_date,
          convert(varchar(30), try_convert(date, closedate), 23) as close_date,
          try_convert(decimal(19, 4), laborsale) as labor_sale,
          try_convert(decimal(19, 4), partssale) as parts_sale,
          try_convert(decimal(19, 4), miscsale) as misc_sale,
          coalesce(try_convert(decimal(19, 4), laborsale), 0) + coalesce(try_convert(decimal(19, 4), partssale), 0) + coalesce(try_convert(decimal(19, 4), miscsale), 0) as current_compare_total
        from (
          select cora_acct_id, ronumber, opendate, closedate, laborsale, partssale, miscsale
          from dbo.servicesalesclosed
          where coalesce(try_convert(date, closedate), try_convert(date, opendate), try_convert(date, rowlastupdated), try_convert(date, Meta_LoadDate))
                >= dateadd(day, -30, cast(getdate() as date))
            and cora_acct_id in (445, 20246)
          union all
          select cora_acct_id, ronumber, opendate, closedate, laborsale, partssale, miscsale
          from dbo.servicesalesopen
          where coalesce(try_convert(date, closedate), try_convert(date, opendate), try_convert(date, rowlastupdated), try_convert(date, Meta_LoadDate))
                >= dateadd(day, -30, cast(getdate() as date))
            and cora_acct_id in (445, 20246)
        ) x
        order by close_date, open_date, business_key
      `)).map(lowerRow),
    };

    checks.currentProcessFinding = {
      vehicle_sales: 'Uses the intended Snowflake VEHICLE_SALES_RAW table and SQL Server dbo.vehiclesalescurrent table. Dealer/date/key choices are plausible for first-pass validation.',
      repair_orders: 'Uses the intended Snowflake REPAIR_ORDER_RAW table and SQL Server dbo.servicesalesclosed/open header tables, but the amount comparison is not yet proven equivalent and should not be treated as a source data defect.',
    };

    const outFile = path.resolve('tmp/snowflake-dms-validation-process-audit.json');
    await fs.writeFile(outFile, `${JSON.stringify(checks, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify({ status: 'succeeded', outFile, checks: Object.keys(checks) }, null, 2));
  } finally {
    await sqlPool.close();
    snowflake.destroy(() => {});
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
