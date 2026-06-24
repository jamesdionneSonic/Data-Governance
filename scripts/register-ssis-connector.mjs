import 'dotenv/config';

const { getConnector, upsertConnector } = await import('../src/services/connectorService.js');

const actor = {
  id: 'system',
  name: 'System',
  role: 'admin',
  roles: ['Admin'],
};

const connectorInput = {
  id: 'ssis-v1-ssis25-01-11040',
  type: 'ssis',
  label: 'SSIS Catalog V1-SSIS25-01',
  description: 'Permanent framework connector for SSISDB metadata on V1-SSIS25-01,11040.',
  config: {
    server: 'V1-SSIS25-01',
    port: 11040,
    database: 'SSISDB',
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
    'catalog',
    'packages',
    'tasks',
    'connections',
    'parameters',
    'environments',
    'agent jobs',
    'lineage edges',
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
