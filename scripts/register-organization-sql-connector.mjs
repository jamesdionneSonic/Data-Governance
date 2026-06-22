import 'dotenv/config';

const { getConnector, upsertConnector } = await import('../src/services/connectorService.js');

const actor = {
  id: 'system',
  name: 'System',
  role: 'admin',
  roles: ['Admin'],
};

const connectorInput = {
  id: 'sqlserver-d1-sql-07a-inst1-organization',
  type: 'sql_server',
  label: 'Organization SQL Server',
  description:
    'Permanent framework connector for Organization metadata on D1-SQL-07A\\INST1.',
  config: {
    server: 'D1-SQL-07A',
    port: 11011,
    database: 'Organization',
    encrypt: true,
    trustServerCertificate: true,
    connectionTimeout: 15000,
    requestTimeout: 300000,
    windowsIntegratedCompat: true,
  },
  credential: {
    mode: 'windows_integrated',
  },
  metadata_targets: [
    'schemas',
    'tables',
    'views',
    'columns',
    'procedures',
    'functions',
    'triggers',
    'constraints',
    'indexes',
    'lineage hints',
  ],
};

const connector = upsertConnector(connectorInput, actor);

console.log(
  JSON.stringify(
    {
      status: 'saved',
      connector,
      persisted_connector: getConnector(connector.id, actor),
    },
    null,
    2
  )
);
