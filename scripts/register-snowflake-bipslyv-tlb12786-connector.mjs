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
  id: 'snowflake-bipslyv-tlb12786',
  type: 'snowflake',
  label: 'Snowflake BIPSLYV TLB12786',
  description:
    'Permanent framework connector for the Snowflake account exposed through https://app.snowflake.com/bipslyv/tlb12786/.',
  config: {
    account: 'bipslyv-tlb12786',
    organization: 'bipslyv',
    account_name: 'tlb12786',
    snowsight_url: 'https://app.snowflake.com/bipslyv/tlb12786/',
    runtime_env: {
      warehouse: 'SNOWFLAKE_BIPSLYV_TLB12786_WAREHOUSE',
      database: 'SNOWFLAKE_BIPSLYV_TLB12786_DATABASE',
      schema: 'SNOWFLAKE_BIPSLYV_TLB12786_SCHEMA',
      role: 'SNOWFLAKE_BIPSLYV_TLB12786_ROLE',
    },
  },
  credential: {
    mode: 'service_account',
    secret_ref: 'env:snowflake-bipslyv-tlb12786',
    runtime_env: {
      username: 'SNOWFLAKE_BIPSLYV_TLB12786_USERNAME',
      password: 'SNOWFLAKE_BIPSLYV_TLB12786_PASSWORD',
    },
  },
  metadata_targets: [
    'databases',
    'schemas',
    'tables',
    'views',
    'columns',
    'tags',
    'query usage',
  ],
};

const shouldVerifyLive = process.argv.includes('--verify-live');

const connector = upsertConnector(connectorInput, actor);
let test = null;
let liveRun = null;

if (shouldVerifyLive) {
  test = await testConnector(connector.id, {}, actor);
  liveRun = await runConnector(
    connector.id,
    {
      dry_run: false,
      fail_fast: false,
      streams: ['databases', 'schemas', 'tables', 'columns', 'tags'],
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
      test: test
        ? {
            status: test.status,
            diagnostics: test.diagnostics,
          }
        : null,
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
