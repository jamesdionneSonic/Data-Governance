import 'dotenv/config';

const { getConnector, upsertConnector } = await import('../src/services/connectorService.js');

const actor = {
  id: 'system',
  name: 'System',
  role: 'admin',
  roles: ['Admin'],
};

const connectorInput = {
  id: 'sqlserver-vehiclemart-11014-vehiclemart',
  type: 'sql_server',
  label: 'VehicleMart SQL Server',
  description: 'Permanent framework connector for VehicleMart metadata on VEHICLEMART,11014.',
  config: {
    server: 'VEHICLEMART',
    port: 11014,
    database: 'VehicleMart',
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
