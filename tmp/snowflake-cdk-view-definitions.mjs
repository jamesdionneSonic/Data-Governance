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
  const views = await execute(`
    select table_catalog, table_schema, table_name, view_definition
    from CDK_ROADSTER_ELEAD_SONIC.information_schema.views
    where table_schema = 'SONIC'
      and table_name in ('COMPANY','CUSTOMERS','DEALS','INVENTORY','PURCHASES','TASKS','AGENTS')
    order by table_name
  `);

  const summary = views.map((row) => {
    const sql = row.VIEW_DEFINITION || '';
    return {
      table_name: row.TABLE_NAME,
      definition_length: sql.length,
      has_join: /\bjoin\b/i.test(sql),
      has_group_by: /\bgroup\s+by\b/i.test(sql),
      has_qualify: /\bqualify\b/i.test(sql),
      has_window_functions: /\bover\s*\(/i.test(sql),
      has_case: /\bcase\b/i.test(sql),
      has_array_logic: /\barray_|arrayagg|flatten|object_/i.test(sql),
      has_where_filter: /\bwhere\b/i.test(sql),
      referenced_fragments: [...new Set((sql.match(/\b[A-Z0-9_]+\.[A-Z0-9_]+\.[A-Z0-9_]+\b/gi) || []).slice(0, 25))],
      first_500_chars: sql.slice(0, 500),
    };
  });

  writeFileSync('tmp/cdk-roadster-view-definitions.json', JSON.stringify({ summary, views }, null, 2));
  console.log(JSON.stringify({ summary, outputPath: 'tmp/cdk-roadster-view-definitions.json' }, null, 2));
} finally {
  connection.destroy(() => {});
}
