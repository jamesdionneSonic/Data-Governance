import 'dotenv/config';

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
  const showViews = await execute('show views in schema CDK_ROADSTER_ELEAD_SONIC.SONIC');
  const ddlResults = [];
  for (const viewName of ['COMPANY', 'DEALS', 'TASKS', 'PURCHASES', 'INVENTORY']) {
    try {
      const rows = await execute(`select get_ddl('VIEW', 'CDK_ROADSTER_ELEAD_SONIC.SONIC.${viewName}') as ddl`);
      ddlResults.push({ viewName, ddlLength: rows[0]?.DDL?.length || 0, ddlStart: (rows[0]?.DDL || '').slice(0, 300) });
    } catch (err) {
      ddlResults.push({ viewName, error: err.message, code: err.code, sqlState: err.sqlState });
    }
  }
  console.log(JSON.stringify({ showViews, ddlResults }, null, 2));
} finally {
  connection.destroy(() => {});
}
