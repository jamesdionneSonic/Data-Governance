import 'dotenv/config';

import {
  getConnector,
  runConnector,
  testConnector,
  upsertConnector,
} from '../src/services/connectorService.js';

const actor = {
  id: 'system',
  name: 'System',
  role: 'admin',
  roles: ['Admin'],
};

const connectorInput = {
  id: 'azure-data-factory-adf-dw-marketing-prod',
  type: 'azure_data_factory',
  label: 'ADF DW Marketing Prod',
  description:
    'Production Azure Data Factory for DW marketing pipelines in rg-data-warehouse-prod.',
  config: {
    tenant_id: 'b7944855-1c04-4fee-8f07-749ae6f28735',
    subscription_id: 'bee9b611-da99-4cfc-9fb7-50f1359e5ca2',
    resource_group: 'rg-data-warehouse-prod',
    factory_name: 'adf-dw-marketing-prod',
    azure_cli_timeout_ms: 30000,
    run_history_lookback_days: 30,
    activity_run_pipeline_limit: 50,
  },
  credential: {
    mode: 'azure_cli',
  },
  metadata_targets: [
    'factory',
    'pipelines',
    'activities',
    'datasets',
    'linked services',
    'triggers',
    'data flows',
    'integration runtimes',
    'managed virtual networks',
    'managed private endpoints',
    'lineage edges',
    'bounded run history',
    'bounded activity run history',
  ],
};

const shouldVerifyLive = process.argv.includes('--verify-live');

const connector = upsertConnector(connectorInput, actor);
const test = await testConnector(connector.id, {}, actor);
let liveRun = null;

if (shouldVerifyLive) {
  liveRun = await runConnector(
    connector.id,
    {
      dry_run: false,
      fail_fast: false,
      streams: [
        'factory',
        'pipelines',
        'tasks',
        'datasets',
        'connections',
        'schedules',
        'dataflows',
        'integration_runtimes',
        'managed_virtual_networks',
        'managed_private_endpoints',
        'lineage',
      ],
    },
    actor
  );
}

console.log(
  JSON.stringify(
    {
      status: 'saved',
      connector,
      persisted_connector: getConnector(connector.id, actor),
      test: {
        status: test.status,
        diagnostics: test.diagnostics,
      },
      live_run: liveRun
        ? {
            status: liveRun.status,
            summary: liveRun.summary,
            stream_results: liveRun.stream_results,
            errors: liveRun.errors,
          }
        : null,
    },
    null,
    2
  )
);
