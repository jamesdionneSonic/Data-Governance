import 'dotenv/config';

const mod = await import('snowflake-sdk');
const snowflake = mod.default || mod;

const connection = snowflake.createConnection({
  account: 'bipslyv-tlb12786',
  username: process.env.SNOWFLAKE_BIPSLYV_TLB12786_USERNAME,
  password: process.env.SNOWFLAKE_BIPSLYV_TLB12786_PASSWORD,
  warehouse: process.env.SNOWFLAKE_BIPSLYV_TLB12786_WAREHOUSE,
  database: process.env.SNOWFLAKE_BIPSLYV_TLB12786_DATABASE,
  schema: process.env.SNOWFLAKE_BIPSLYV_TLB12786_SCHEMA,
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
    select table_catalog, table_schema, table_name, row_count
    from HYPERNOVA_SONIC_CUSTACCESS.information_schema.tables
    where table_schema = 'COSMOS_SONIC'
      and table_name in (
        'DWFULLACTIVITY',
        'DWFULLCOMPANY',
        'DWFULLCOMPANYHIERARCHY',
        'DWFULLCOMPANYCHILDCOMPANYMAP',
        'DWFULLDEAL',
        'DWFULLCUSTOMER',
        'DWFULLVEHICLESOUGHT',
        'DWFULLSOURCE',
        'DWFULLCOMPANYSOURCE',
        'DWFULLOPPORTUNITY',
        'DWFULLDESKLOGVISIT',
        'DWFULLMESSAGES',
        'DWFULLCOMPANYOPTION',
        'DWFULLSCHEDULE',
        'DWFULLHOLIDAY',
        'DWFULLPURCHASEDETAILS',
        'DWFULLVEHICLE',
        'DWFULLTASKREMINDER',
        'DWFULLTASKITEM',
        'DWFULLDEALSALESPERSONMAP',
        'DWFULLUSER',
        'DWTBLPERSON',
        'DWFULLLEGACYEMPLOYEEID',
        'DWFULLLEADPROVIDERINACTIVEREASONMAP',
        'DWFULLPRODUCTORSERVICE',
        'DWFULLDEALERPROGRAM',
        'DWFULLREPORTCREDITCONFIGURATION',
        'PROCCRMSOLDLU'
      )
    order by table_name
  `);
  const dealLike = await execute(`
    select table_catalog, table_schema, table_name, row_count
    from HYPERNOVA_SONIC_CUSTACCESS.information_schema.tables
    where table_schema = 'COSMOS_SONIC'
      and (
        table_name like '%DEAL%'
        or table_name like '%PERSON%'
        or table_name like '%CRMSOLD%'
      )
    order by table_name
  `);
  const columns = await execute(`
    select table_name, column_name, data_type, ordinal_position
    from HYPERNOVA_SONIC_CUSTACCESS.information_schema.columns
    where table_schema = 'COSMOS_SONIC'
      and table_name in (
        'DWFULLOPPORTUNITY',
        'DWFULLACTIVITY',
        'DWFULLPURCHASEDETAILS',
        'DWFULLVEHICLE',
        'DWFULLVEHICLESOUGHT',
        'DWFULLSOURCE',
        'DWFULLCOMPANYSOURCE',
        'DWFULLCOMPANY',
        'DWFULLCOMPANYHIERARCHY',
        'DWFULLCOMPANYCHILDCOMPANYMAP',
        'DWFULLDESKLOGVISIT',
        'DWFULLTASKREMINDER',
        'DWFULLTASKITEM',
        'DWFULLDEALSALESPERSONMAP'
      )
      and (
        column_name ilike '%DEAL%'
        or column_name ilike '%COMPANY%'
        or column_name ilike '%SOURCE%'
        or column_name ilike '%STATUS%'
        or column_name ilike '%COLOR%'
        or column_name ilike '%CATEGORY%'
        or column_name ilike '%TASK%'
        or column_name ilike '%DATE%'
        or column_name ilike 'DT%'
        or column_name ilike '%VEHICLE%'
        or column_name ilike '%VIN%'
        or column_name ilike '%SOLD%'
        or column_name ilike '%GROSS%'
        or column_name ilike '%PERSON%'
        or column_name ilike '%CUSTOMER%'
        or column_name ilike '%MAKE%'
        or column_name ilike '%NEWUSED%'
        or column_name ilike '%SUB%'
        or column_name ilike '%ACTIVE%'
        or column_name ilike '%PRIMARY%'
        or column_name ilike '%POSITION%'
      )
    order by table_name, ordinal_position
  `);
  console.log(JSON.stringify({ context, tables, dealLike, columns }, null, 2));
} finally {
  connection.destroy(() => {});
}
