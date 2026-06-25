import 'dotenv/config';
import { writeFileSync } from 'node:fs';

const mod = await import('snowflake-sdk');
const snowflake = mod.default || mod;

const connection = snowflake.createConnection({
  account: 'bipslyv-tlb12786',
  username: process.env.SNOWFLAKE_BIPSLYV_TLB12786_USERNAME,
  password: process.env.SNOWFLAKE_BIPSLYV_TLB12786_PASSWORD,
  warehouse: process.env.SNOWFLAKE_BIPSLYV_TLB12786_WAREHOUSE,
  database: 'CDK_ROADSTER_ELEAD_SONIC',
  schema: 'SONIC',
  role: process.env.SNOWFLAKE_BIPSLYV_TLB12786_ROLE,
});

function execute(sqlText) {
  return new Promise((resolve, reject) => {
    connection.execute({
      sqlText,
      complete: (err, _stmt, rows) => (err ? reject(err) : resolve(rows || [])),
    });
  });
}

await new Promise((resolve, reject) => {
  connection.connect((err) => (err ? reject(err) : resolve()));
});

try {
  const context = await execute(
    'select current_database() db, current_schema() schema, current_role() role, current_warehouse() wh'
  );
  const tables = await execute(`
    select table_catalog, table_schema, table_name, table_type, row_count
    from CDK_ROADSTER_ELEAD_SONIC.information_schema.tables
    where table_schema = 'SONIC'
    order by table_name
  `);
  const columns = await execute(`
    select table_name, column_name, data_type, ordinal_position
    from CDK_ROADSTER_ELEAD_SONIC.information_schema.columns
    where table_schema = 'SONIC'
      and table_name in ('COMPANY','CUSTOMERS','DEALS','INVENTORY','PURCHASES','TASKS','AGENTS')
    order by table_name, ordinal_position
  `);
  const payload = { context, tables, columns };
  writeFileSync('tmp/cdk-roadster-metadata.json', JSON.stringify(payload, null, 2));
  console.log(JSON.stringify({
    context,
    tableCount: tables.length,
    columnCount: columns.length,
    outputPath: 'tmp/cdk-roadster-metadata.json',
  }, null, 2));
} finally {
  connection.destroy(() => {});
}
