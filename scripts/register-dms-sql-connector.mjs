import 'dotenv/config';

const { getConnector, upsertConnector } = await import('../src/services/connectorService.js');

const actor = {
  id: 'system',
  name: 'System',
  role: 'admin',
  roles: ['Admin'],
};

const connectorInput = {
  id: 'sqlserver-l1-dwasql-02-12010-dms',
  type: 'sql_server',
  label: 'DMS SQL Server',
  description: 'Permanent framework connector for DMS metadata on L1-DWASQL-02,12010.',
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
    2,
  ),
);
