import 'dotenv/config';
import { readFileSync } from 'node:fs';

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
      complete: (err, stmt, rows) => {
        if (err) reject(err);
        else resolve({ stmt, rows: rows || [] });
      },
    });
  });
}

await new Promise((resolve, reject) => {
  connection.connect((err) => (err ? reject(err) : resolve()));
});

try {
  const rawSql = readFileSync('tmp/BaseData_cdk_roadster_snowflake.sql', 'utf8');
  const finalOrderBy = rawSql.lastIndexOf('ORDER BY');
  const testingComment = rawSql.indexOf('-- Add this while testing');
  const sql = `${rawSql.slice(0, finalOrderBy)}LIMIT 1;\n\n${rawSql.slice(testingComment)}`;
  const result = await execute(sql);
  console.log(JSON.stringify({
    rowCount: result.rows.length,
    columns: result.rows[0] ? Object.keys(result.rows[0]) : [],
  }, null, 2));
} finally {
  connection.destroy(() => {});
}
