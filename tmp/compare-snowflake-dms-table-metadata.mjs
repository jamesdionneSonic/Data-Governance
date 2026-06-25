import 'dotenv/config';

import fs from 'node:fs/promises';
import path from 'node:path';
import snowflakeModule from 'snowflake-sdk';
import mssqlModule from 'mssql/msnodesqlv8.js';

import { buildSqlServerConnectionConfig } from '../src/services/connectorRuntime/sqlServerConnection.js';

const snowflake = snowflakeModule.default || snowflakeModule;
const sql = mssqlModule.default || mssqlModule;

const SNOWFLAKE_DATABASE = 'CDK_DN_TITAN_FTR_UNMASK_E100030_SHARE';
const SNOWFLAKE_SCHEMA = 'CONSUMPTION_SHARED_E100030';
const SNOWFLAKE_TABLES = ['REPAIR_ORDER_RAW', 'VEHICLE_SALES_RAW'];

const dmsConnector = {
  id: 'sqlserver-l1-dwasql-02-12010-dms',
  type: 'sql_server',
  label: 'DMS SQL Server',
  config: {
    server: 'L1-DWASQL-02',
    port: 12010,
    database: 'DMS',
    encrypt: true,
    trustServerCertificate: true,
    connectionTimeout: 15000,
    requestTimeout: 300000,
    windowsIntegratedCompat: true,
  },
  credential: {
    mode: 'windows_integrated',
  },
};

function quoteIdent(value) {
  return `"${String(value).replace(/"/g, '""')}"`;
}

function executeSnowflake(connection, sqlText) {
  return new Promise((resolve, reject) => {
    connection.execute({
      sqlText,
      complete: (error, _statement, rows) => (error ? reject(error) : resolve(rows || [])),
    });
  });
}

async function withSnowflake(callback) {
  const connection = snowflake.createConnection({
    account: 'bipslyv-tlb12786',
    username: process.env.SNOWFLAKE_BIPSLYV_TLB12786_USERNAME,
    password: process.env.SNOWFLAKE_BIPSLYV_TLB12786_PASSWORD,
    warehouse: process.env.SNOWFLAKE_BIPSLYV_TLB12786_WAREHOUSE,
    role: process.env.SNOWFLAKE_BIPSLYV_TLB12786_ROLE || undefined,
    database: SNOWFLAKE_DATABASE,
    schema: SNOWFLAKE_SCHEMA,
  });
  await new Promise((resolve, reject) =>
    connection.connect((error) => (error ? reject(error) : resolve())),
  );
  try {
    return await callback(connection);
  } finally {
    connection.destroy(() => {});
  }
}

async function fetchSnowflakeMetadata() {
  return withSnowflake(async (connection) => {
    const tables = await executeSnowflake(
      connection,
      `select table_name, table_type, row_count, bytes, created, last_altered
       from ${quoteIdent(SNOWFLAKE_DATABASE)}.information_schema.tables
       where table_schema = '${SNOWFLAKE_SCHEMA}'
         and table_name in (${SNOWFLAKE_TABLES.map((table) => `'${table}'`).join(', ')})
       order by table_name`,
    );
    const columns = await executeSnowflake(
      connection,
      `select table_name, ordinal_position, column_name, data_type, is_nullable
       from ${quoteIdent(SNOWFLAKE_DATABASE)}.information_schema.columns
       where table_schema = '${SNOWFLAKE_SCHEMA}'
         and table_name in (${SNOWFLAKE_TABLES.map((table) => `'${table}'`).join(', ')})
       order by table_name, ordinal_position`,
    );
    return { tables, columns };
  });
}

async function fetchSqlServerMetadataLive() {
  const { config } = buildSqlServerConnectionConfig(dmsConnector);
  const pool = await sql.connect(config);
  try {
    const tables = await pool.request().query(`
      set nocount on;
      select
        s.name as schema_name,
        o.name as table_name,
        case when o.type = 'V' then 'view' else 'table' end as object_type,
        o.create_date,
        o.modify_date,
        sum(p.rows) as row_count
      from sys.objects o
      join sys.schemas s on s.schema_id = o.schema_id
      left join sys.partitions p on p.object_id = o.object_id and p.index_id in (0, 1)
      where o.type in ('U', 'V')
      group by s.name, o.name, o.type, o.create_date, o.modify_date
      order by s.name, o.name;
    `);
    const columns = await pool.request().query(`
      set nocount on;
      select
        s.name as schema_name,
        o.name as object_name,
        o.type_desc as object_type,
        c.column_id,
        c.name as column_name,
        ty.name as data_type,
        c.max_length,
        c.precision,
        c.scale,
        c.is_nullable
      from sys.columns c
      join sys.objects o on o.object_id = c.object_id
      join sys.schemas s on s.schema_id = o.schema_id
      join sys.types ty on ty.user_type_id = c.user_type_id
      where o.type in ('U', 'V')
      order by s.name, o.name, c.column_id;
    `);
    return {
      source: 'live_sql_server_connector',
      tables: tables.recordset,
      columns: columns.recordset,
    };
  } finally {
    await pool.close();
  }
}

function markdownPathForDmsObject(schema, objectName, type) {
  const folder = type === 'view' ? 'views' : 'tables';
  const safe = `${schema}__${objectName}.md`;
  return path.join('data', 'markdown', 'servers', 'L1-DWASQL-02,12010', 'databases', 'DMS', folder, safe);
}

async function fetchSqlServerMetadataFromCatalogFallback() {
  const root = path.join('data', 'markdown', 'servers', 'L1-DWASQL-02,12010', 'databases', 'DMS');
  const folders = [
    { folder: 'tables', type: 'table' },
    { folder: 'views', type: 'view' },
  ];
  const objects = [];
  const columns = [];
  for (const { folder, type } of folders) {
    const dir = path.join(root, folder);
    let files = [];
    try {
      files = await fs.readdir(dir);
    } catch {
      continue;
    }
    for (const file of files.filter((name) => name.endsWith('.md'))) {
      const match = file.match(/^(.+?)__(.+)\.md$/);
      if (!match) continue;
      const [, schema, objectName] = match;
      const content = await fs.readFile(path.join(dir, file), 'utf8');
      objects.push({ schema_name: schema, table_name: objectName, object_type: type, source_file: path.join(dir, file) });
      const columnSection = content.match(/## Columns\s+([\s\S]*?)(?:\n## |\n# |$)/i);
      if (columnSection) {
        for (const line of columnSection[1].split(/\r?\n/)) {
          const row = line.trim();
          if (!row.startsWith('|') || /^(\|\s*-)|(\|\s*Name\s*\|)/i.test(row)) continue;
          const cells = row
            .split('|')
            .slice(1, -1)
            .map((cell) => cell.trim().replace(/^`|`$/g, ''));
          const [columnName, dataType] = cells;
          if (columnName) {
            columns.push({
              schema_name: schema,
              object_name: objectName,
              object_type: type,
              column_name: columnName,
              data_type: dataType || '',
            });
          }
        }
      }
    }
  }
  return {
    source: 'local_catalog_fallback',
    tables: objects,
    columns,
  };
}

function normalizeName(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/raw$/i, '')
    .replace(/^vw_?/i, '')
    .replace(/[^a-z0-9]+/g, '');
}

function tokenize(value) {
  const text = String(value || '')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_\W]+/g, ' ')
    .toLowerCase();
  return new Set(text.split(/\s+/).filter((token) => token && token.length > 1 && token !== 'raw'));
}

function jaccard(left, right) {
  if (!left.size && !right.size) return 0;
  const intersection = [...left].filter((item) => right.has(item)).length;
  const union = new Set([...left, ...right]).size;
  return intersection / union;
}

function buildColumnMap(rows, tableKeyAccessor) {
  const map = new Map();
  for (const row of rows) {
    const key = tableKeyAccessor(row);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(row);
  }
  return map;
}

function compare(snowflakeMetadata, sqlMetadata) {
  const snowflakeColumnMap = buildColumnMap(snowflakeMetadata.columns, (row) => row.TABLE_NAME);
  const sqlColumnMap = buildColumnMap(
    sqlMetadata.columns,
    (row) => `${row.schema_name}.${row.object_name}`,
  );

  const sqlObjects = sqlMetadata.tables.map((row) => {
    const key = `${row.schema_name}.${row.table_name}`;
    const columns = sqlColumnMap.get(key) || [];
    return {
      schema: row.schema_name,
      name: row.table_name,
      type: row.object_type || 'table',
      key,
      normalized_name: normalizeName(row.table_name),
      tokens: tokenize(row.table_name),
      columns,
      normalized_columns: new Set(columns.map((column) => normalizeName(column.column_name))),
      source_file: row.source_file || markdownPathForDmsObject(row.schema_name, row.table_name, row.object_type),
    };
  });

  const results = {};
  for (const sfTable of snowflakeMetadata.tables) {
    const sfColumns = snowflakeColumnMap.get(sfTable.TABLE_NAME) || [];
    const sfNormalizedColumns = new Set(sfColumns.map((column) => normalizeName(column.COLUMN_NAME)));
    const sfTokens = tokenize(sfTable.TABLE_NAME);
    const scored = sqlObjects.map((sqlObject) => {
      const columnOverlap = [...sfNormalizedColumns].filter((column) => sqlObject.normalized_columns.has(column));
      const nameScore =
        sqlObject.normalized_name === normalizeName(sfTable.TABLE_NAME)
          ? 1
          : jaccard(sfTokens, sqlObject.tokens);
      const columnScore = sfNormalizedColumns.size ? columnOverlap.length / sfNormalizedColumns.size : 0;
      const sqlCoverage = sqlObject.normalized_columns.size
        ? columnOverlap.length / sqlObject.normalized_columns.size
        : 0;
      const score = nameScore * 0.45 + columnScore * 0.4 + sqlCoverage * 0.15;
      return {
        schema: sqlObject.schema,
        object: sqlObject.name,
        type: sqlObject.type,
        score: Number(score.toFixed(4)),
        name_score: Number(nameScore.toFixed(4)),
        snowflake_column_coverage: Number(columnScore.toFixed(4)),
        sql_column_coverage: Number(sqlCoverage.toFixed(4)),
        overlapping_columns_count: columnOverlap.length,
        overlapping_columns: columnOverlap.slice(0, 60),
        sql_column_count: sqlObject.columns.length,
        source_file: sqlObject.source_file,
      };
    });
    results[sfTable.TABLE_NAME] = {
      snowflake_table: sfTable,
      snowflake_column_count: sfColumns.length,
      snowflake_columns: sfColumns.map((column) => ({
        ordinal: column.ORDINAL_POSITION,
        name: column.COLUMN_NAME,
        type: column.DATA_TYPE,
        nullable: column.IS_NULLABLE,
      })),
      likely_matches: scored
        .filter((match) => match.score > 0 || match.overlapping_columns_count > 0)
        .sort((left, right) => right.score - left.score)
        .slice(0, 25),
    };
  }
  return results;
}

const snowflakeMetadata = await fetchSnowflakeMetadata();
let sqlMetadata;
let sqlLiveError = null;
try {
  sqlMetadata = await fetchSqlServerMetadataLive();
} catch (error) {
  sqlLiveError = {
    message: error.message,
    code: error.code || null,
  };
  sqlMetadata = await fetchSqlServerMetadataFromCatalogFallback();
}

const report = {
  generated_at: new Date().toISOString(),
  snowflake: {
    database: SNOWFLAKE_DATABASE,
    schema: SNOWFLAKE_SCHEMA,
    metadata_source: 'live_snowflake_connector',
    table_count: snowflakeMetadata.tables.length,
    column_count: snowflakeMetadata.columns.length,
  },
  sql_server: {
    connector_id: dmsConnector.id,
    server: 'L1-DWASQL-02,12010',
    database: 'DMS',
    metadata_source: sqlMetadata.source,
    live_error: sqlLiveError,
    object_count: sqlMetadata.tables.length,
    column_count: sqlMetadata.columns.length,
  },
  matches: compare(snowflakeMetadata, sqlMetadata),
};

await fs.mkdir('tmp', { recursive: true });
await fs.writeFile('tmp/snowflake-dms-table-match-report.json', `${JSON.stringify(report, null, 2)}\n`, 'utf8');

console.log(JSON.stringify(report, null, 2));
