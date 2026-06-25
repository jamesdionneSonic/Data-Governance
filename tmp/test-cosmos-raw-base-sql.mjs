import 'dotenv/config';
import { readFileSync } from 'node:fs';

const mod = await import('snowflake-sdk');
const snowflake = mod.default || mod;

const connection = snowflake.createConnection({
  account: 'bipslyv-tlb12786',
  username: process.env.SNOWFLAKE_BIPSLYV_TLB12786_USERNAME,
  password: process.env.SNOWFLAKE_BIPSLYV_TLB12786_PASSWORD,
  warehouse: process.env.SNOWFLAKE_BIPSLYV_TLB12786_WAREHOUSE,
  database: 'HYPERNOVA_SONIC_CUSTACCESS',
  schema: 'COSMOS_SONIC',
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
  const rawSql = readFileSync('tmp/BaseData_cosmos_sonic_raw_snowflake.sql', 'utf8');
  const finalOrderBy = rawSql.lastIndexOf('ORDER BY');
  const testingComment = rawSql.indexOf('-- Add this while testing');
  const innerSql = `${rawSql.slice(0, finalOrderBy)}LIMIT 1`;
  const sql = `EXPLAIN USING TEXT ${innerSql}`;
  const rows = await execute(sql);
  console.log(JSON.stringify({
    rowCount: rows.length,
    columns: rows[0] ? Object.keys(rows[0]) : [],
  }, null, 2));
} finally {
  connection.destroy(() => {});
}
