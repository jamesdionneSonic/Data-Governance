import 'dotenv/config';

import { existsSync, mkdirSync, writeFileSync } from 'fs';
import path from 'path';
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

const AWS_CLI_PATH =
  process.env.AWS_CLI_PATH ||
  (existsSync('C:\\Program Files\\Amazon\\AWSCLIV2\\aws.exe')
    ? 'C:\\Program Files\\Amazon\\AWSCLIV2\\aws.exe'
    : 'aws');

const SSO_START_URL = 'https://sonicautomotive1.awsapps.com/start';
const SSO_SESSION = 'sonic-data-lineage';
const DEFAULT_REGION = process.env.AWS_METADATA_REGION || 'us-east-1';
const CURRENT_AWS_PRODUCT_AREA = 'MDP';
const CURRENT_AWS_BUSINESS_DOMAIN = 'Marketing Data Platform';
const CURRENT_AWS_PRODUCT_ROUTE_ID = 'mdp-aws-lineage-context';
const CURRENT_AWS_HUMAN_CATALOG_ROOT =
  'Sonic Data Lineage / Data Product Catalog / MDP AWS Lineage Context';
const CURRENT_AWS_OWNER_BOUNDARY = {
  system_owner: 'MDP team',
  data_team_role: 'feed contributor and lineage consumer',
  ownership_note:
    'Current registered AWS accounts are MDP-specific. Future AWS connectors must declare their own product_area instead of inheriting MDP by default.',
};

const accounts = [
  {
    name: 'svc_dev_mdp',
    profile: 'sonic-dev-mdp',
    account_id: '499876093606',
    role_name: 'SonicDeveloperAccess',
  },
  {
    name: 'svc_np_mdp',
    profile: 'sonic-np-mdp',
    account_id: '470660935268',
    role_name: 'SonicDeveloperAccess',
  },
  {
    name: 'svc_pp_mdp',
    profile: 'sonic-pp-mdp',
    account_id: '477562029833',
    role_name: 'SonicDeveloperAccess',
  },
  {
    name: 'svc_prd_mdp',
    profile: 'sonic-prd-mdp',
    account_id: '118570350539',
    role_name: 'SonicDeveloperAccess',
  },
  {
    name: 'SVC_Sandbox_MDP',
    profile: 'sonic-sandbox-mdp',
    account_id: '730335615353',
    role_name: 'AWSAdministratorAccess',
  },
  {
    name: 'Northwest Motorsport - Production',
    profile: 'northwest-motorsport-prod',
    account_id: '120126178335',
    role_name: 'AWSAdministratorAccess',
  },
];

const servicePlans = [
  {
    type: 'aws_s3',
    service: 's3',
    label: 'Amazon S3',
    streams: ['buckets'],
    metadata_targets: ['buckets', 'prefixes', 'objects', 'file formats', 'classifications'],
  },
  {
    type: 'aws_glue',
    service: 'glue',
    label: 'AWS Glue Data Catalog',
    streams: ['databases', 'tables', 'columns', 'jobs'],
    metadata_targets: ['databases', 'tables', 'columns', 'partitions', 'crawlers', 'jobs'],
  },
  {
    type: 'aws_athena',
    service: 'athena',
    label: 'Amazon Athena',
    streams: ['workgroups', 'data_catalogs', 'databases', 'named_queries'],
    metadata_targets: [
      'workgroups',
      'data catalogs',
      'databases',
      'tables',
      'named queries',
      'query execution metadata',
    ],
  },
];

const quickSightAccountProfiles = new Set(['northwest-motorsport-prod']);

function safeId(value = '') {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function connectorId(account, service) {
  return `aws-${service}-${safeId(account.profile)}`;
}

function baseConnectorConfig(account, service) {
  return {
    region: DEFAULT_REGION,
    product_area: CURRENT_AWS_PRODUCT_AREA,
    lineage_product: CURRENT_AWS_PRODUCT_AREA,
    business_domain: CURRENT_AWS_BUSINESS_DOMAIN,
    product_route_id: CURRENT_AWS_PRODUCT_ROUTE_ID,
    human_catalog_root: CURRENT_AWS_HUMAN_CATALOG_ROOT,
    system_owner: CURRENT_AWS_OWNER_BOUNDARY.system_owner,
    data_team_role: CURRENT_AWS_OWNER_BOUNDARY.data_team_role,
    ownership_note: CURRENT_AWS_OWNER_BOUNDARY.ownership_note,
    lineage_tags: ['aws', 'mdp', 'product:MDP'],
    account_id: account.account_id,
    aws_account_id: account.account_id,
    account_name: account.name,
    role_name: account.role_name,
    aws_profile: account.profile,
    aws_cli_path: AWS_CLI_PATH,
    aws_cli_timeout_ms: 120000,
    aws_cli_max_buffer: 100 * 1024 * 1024,
    max_sample_items: Number(process.env.AWS_METADATA_SAMPLE_LIMIT || 5),
    sso_start_url: SSO_START_URL,
    sso_session: SSO_SESSION,
    source_system: 'aws_iam_identity_center',
    service,
  };
}

function connectorInput(account, plan) {
  return {
    id: connectorId(account, plan.service),
    type: plan.type,
    label: `${plan.label} - ${account.name}`,
    description:
      `Permanent framework connector for ${plan.label} metadata in AWS account ` +
      `${account.name} (${account.account_id}) using local AWS SSO profile ${account.profile}.`,
    config: baseConnectorConfig(account, plan.service),
    credential: {
      mode: 'aws_cli_profile',
      aws_profile: account.profile,
      sso_session: SSO_SESSION,
    },
    metadata_targets: plan.metadata_targets,
  };
}

function quickSightConnectorInput(account) {
  return {
    id: connectorId(account, 'quicksight'),
    type: 'quicksight',
    label: `Amazon QuickSight - ${account.name}`,
    description:
      `Permanent framework connector for QuickSight metadata in AWS account ` +
      `${account.name} (${account.account_id}) using local AWS SSO profile ${account.profile}.`,
    config: baseConnectorConfig(account, 'quicksight'),
    credential: {
      mode: 'aws_cli_profile',
      aws_profile: account.profile,
      sso_session: SSO_SESSION,
    },
    metadata_targets: ['analyses', 'dashboards', 'datasets', 'data sources', 'calculated fields'],
  };
}

function summarizeEvents(run) {
  const events = run?.extraction?.events || [];
  const sampleNames = events
    .filter((event) => event.type !== 'extraction.warning')
    .slice(0, 10)
    .map((event) => ({
      stream: event.stream,
      type: event.type,
      name: event.name,
      external_id: event.external_id,
    }));
  return {
    status: run?.status || 'not_run',
    run_id: run?.id || null,
    summary: run?.summary || {},
    stream_results: run?.stream_results || [],
    errors: run?.errors || [],
    sample_names: sampleNames,
  };
}

function markdownReport(readback) {
  const rows = readback.connectors
    .map(
      (item) =>
        `| ${item.connector_id} | ${item.type} | ${item.account_name} | ${item.test_status} | ${item.sample_status} | ${item.event_count} | ${item.sample_streams.join(', ')} |`
    )
    .join('\n');
  const skippedRows = readback.skipped
    .map((item) => `| ${item.service} | ${item.account_name} | ${item.reason} |`)
    .join('\n');
  return [
    '# AWS SSO Connector Readiness',
    '',
    `Generated: ${readback.generated_at}`,
    '',
    '## Product Route',
    '',
    '| Signal | Value |',
    '| --- | --- |',
    `| Product area | ${readback.product_area} |`,
    `| Product route id | ${readback.product_route_id} |`,
    `| Human catalog root | ${readback.human_catalog_root} |`,
    `| System owner | ${readback.ownership_boundary.system_owner} |`,
    `| Data team role | ${readback.ownership_boundary.data_team_role} |`,
    '',
    '## Connector Samples',
    '',
    '| Connector | Type | Account | Test | Sample | Events | Streams |',
    '| --- | --- | --- | --- | --- | ---: | --- |',
    rows || '| none | none | none | none | none | 0 | none |',
    '',
    '## Skipped Services',
    '',
    '| Service | Account | Reason |',
    '| --- | --- | --- |',
    skippedRows || '| none | none | none |',
    '',
    '## Notes',
    '',
    '- Authentication uses AWS CLI SSO profiles; no access keys, passwords, or SSO tokens are stored in connector records.',
    '- Samples are metadata-only and bounded by `max_sample_items`.',
    '- Redshift connectors were not registered because no clusters or serverless workgroups were found during the initial access validation.',
  ].join('\n');
}

const shouldVerifyLive = process.argv.includes('--verify-live') || process.argv.includes('--run');
const plans = accounts.flatMap((account) =>
  servicePlans.map((plan) => ({ account, plan, input: connectorInput(account, plan) }))
);
plans.push(
  ...accounts
    .filter((account) => quickSightAccountProfiles.has(account.profile))
    .map((account) => ({
      account,
      plan: {
        type: 'quicksight',
        service: 'quicksight',
        streams: ['dashboards', 'datasets', 'data_sources', 'analyses'],
      },
      input: quickSightConnectorInput(account),
    }))
);

const readback = {
  generated_at: new Date().toISOString(),
  mode: shouldVerifyLive ? 'register_and_verify_live' : 'register_only',
  product_area: CURRENT_AWS_PRODUCT_AREA,
  product_route_id: CURRENT_AWS_PRODUCT_ROUTE_ID,
  human_catalog_root: CURRENT_AWS_HUMAN_CATALOG_ROOT,
  ownership_boundary: CURRENT_AWS_OWNER_BOUNDARY,
  aws_cli_path: AWS_CLI_PATH,
  sso_start_url: SSO_START_URL,
  sso_session: SSO_SESSION,
  region: DEFAULT_REGION,
  connectors: [],
  skipped: [
    ...accounts
      .filter((account) => !quickSightAccountProfiles.has(account.profile))
      .map((account) => ({
        service: 'quicksight',
        account_name: account.name,
        account_id: account.account_id,
        reason:
          'QuickSight is not subscribed or not metadata-accessible for this account in the initial probe.',
      })),
    ...accounts.map((account) => ({
      service: 'redshift',
      account_name: account.name,
      account_id: account.account_id,
      reason:
        'No Redshift clusters or Redshift Serverless workgroups were found in the initial us-east-1 probe.',
    })),
  ],
};

for (const { account, plan, input } of plans) {
  const connector = upsertConnector(input, actor);
  let test = null;
  let sample = null;
  if (shouldVerifyLive) {
    test = await testConnector(connector.id, {}, actor);
    sample = await runConnector(
      connector.id,
      {
        dry_run: false,
        fail_fast: false,
        streams: plan.streams,
        max_sample_items: Number(process.env.AWS_METADATA_SAMPLE_LIMIT || 5),
      },
      actor
    );
  }
  readback.connectors.push({
    connector_id: connector.id,
    type: connector.type,
    account_name: account.name,
    account_id: account.account_id,
    aws_profile: account.profile,
    product_area: connector.config?.product_area || 'unrouted',
    product_route_id: connector.config?.product_route_id || '',
    human_catalog_root: connector.config?.human_catalog_root || '',
    sample_streams: plan.streams,
    persisted: Boolean(getConnector(connector.id, actor)),
    test_status: test?.status || 'not_run',
    sample_status: sample?.status || 'not_run',
    event_count: sample?.summary?.event_count || 0,
    object_count: sample?.summary?.object_count || 0,
    column_count: sample?.summary?.column_count || 0,
    warning_count: sample?.summary?.warning_count || 0,
    sample: summarizeEvents(sample),
  });
}

const outputDir = path.join(process.cwd(), 'docs', 'lineage-runtime-readbacks', 'aws');
mkdirSync(outputDir, { recursive: true });
const stamp = readback.generated_at.replace(/[:.]/g, '-');
const jsonPath = path.join(outputDir, `aws-sso-connector-readiness-${stamp}.json`);
const mdPath = path.join(outputDir, `aws-sso-connector-readiness-${stamp}.md`);
writeFileSync(jsonPath, JSON.stringify(readback, null, 2));
writeFileSync(mdPath, markdownReport(readback));

console.log(
  JSON.stringify(
    {
      status: 'saved',
      mode: readback.mode,
      connector_count: readback.connectors.length,
      verified_count: readback.connectors.filter((item) => item.sample_status === 'succeeded')
        .length,
      partial_count: readback.connectors.filter((item) => item.sample_status === 'partial_failure')
        .length,
      failed_count: readback.connectors.filter((item) => item.sample_status === 'failed').length,
      readback_json: jsonPath,
      readback_markdown: mdPath,
      connectors: readback.connectors.map((item) => ({
        id: item.connector_id,
        type: item.type,
        account: item.account_name,
        test_status: item.test_status,
        sample_status: item.sample_status,
        event_count: item.event_count,
      })),
      skipped: readback.skipped,
    },
    null,
    2
  )
);
