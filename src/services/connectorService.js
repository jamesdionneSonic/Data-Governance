/**
 * Managed metadata connector registry.
 * Stores connector configuration and permissioned execution metadata without exposing secrets.
 */

import { randomUUID } from 'crypto';
import { spawn } from 'child_process';
import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from 'fs';
import path from 'path';
import {
  buildAdapterCoverage,
  executeConnectorBiProfile,
  executeConnectorExtraction,
  executeConnectorMetadataProfile,
  executeConnectorProfile,
  executeConnectorTest,
  planConnectorBiProfile,
  planConnectorMetadataProfile,
  planConnectorProfile,
  planConnectorExtraction,
} from './connectorRuntime/extractionKernel.js';
import { diagnoseSqlServerConnectionVariants } from './connectorRuntime/sqlServerConnection.js';

const SENSITIVE_FIELD_PATTERN = /password|secret|token|key|credential|clientSecret|privateKey/i;
const CONNECTOR_RUNTIME_LOG_DIR = path.resolve(process.cwd(), 'logs');
const CONNECTOR_RUNTIME_LOG_PATH = path.join(CONNECTOR_RUNTIME_LOG_DIR, 'connector-runtime.log');
const CONNECTOR_RUN_TIMEOUT_MS = Number(process.env.CONNECTOR_RUN_TIMEOUT_MS || 45000);
const CONNECTOR_TEST_TIMEOUT_MS = Number(process.env.CONNECTOR_TEST_TIMEOUT_MS || 15000);
const SSIS_CONNECTOR_TEST_TIMEOUT_MS = Number(
  process.env.SSIS_CONNECTOR_TEST_TIMEOUT_MS || CONNECTOR_TEST_TIMEOUT_MS * 3
);
const WIZARD_SUPPORTED_TYPES = new Set([
  'sql_server',
  'ssis',
  'postgresql',
  'snowflake',
  'azure_storage',
  'power_bi',
  'tableau',
  'git_repository',
  'openapi',
]);

function writeConnectorRuntimeLog(entry = {}) {
  try {
    if (!existsSync(CONNECTOR_RUNTIME_LOG_DIR)) {
      mkdirSync(CONNECTOR_RUNTIME_LOG_DIR, { recursive: true });
    }
    appendFileSync(
      CONNECTOR_RUNTIME_LOG_PATH,
      `${JSON.stringify({ timestamp: new Date().toISOString(), ...entry })}\n`,
      'utf8'
    );
  } catch (err) {
    console.error('[connectorService] Failed to write connector runtime log:', err.message);
  }
}

async function withConnectorRunTimeout(task, timeoutMs, context = {}) {
  let timer = null;
  try {
    return await Promise.race([
      task,
      new Promise((_, reject) => {
        timer = setTimeout(() => {
          const error = new Error(
            `Connector runtime timed out after ${timeoutMs}ms for ${context.connector_id || 'unknown connector'}.`
          );
          error.code = 'CONNECTOR_RUN_TIMEOUT';
          error.status = 504;
          error.details = {
            timeout_ms: timeoutMs,
            connector_id: context.connector_id || null,
            connector_type: context.connector_type || null,
            phase: context.phase || 'connector_runtime',
          };
          reject(error);
        }, timeoutMs);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export function connectorTestTimeoutMs(connector = {}, options = {}) {
  const requested = Number(options.timeout_ms || options.timeoutMs);
  const defaultTimeout =
    connector.type === CONNECTOR_TYPES.SSIS.type
      ? SSIS_CONNECTOR_TEST_TIMEOUT_MS
      : CONNECTOR_TEST_TIMEOUT_MS;
  const effective = Number.isFinite(requested) && requested > 0 ? requested : defaultTimeout;
  return Math.min(CONNECTOR_RUN_TIMEOUT_MS, effective);
}

export function connectorRuntimeAuthRemediationPacket(connector = {}, requestedId, err = {}) {
  const details = err.details || {};
  const failureCategory = details.failure_category || null;
  const isWindowsAuthFailure =
    failureCategory === 'windows_security_negotiation_failed' ||
    err.code === 'SQL_SERVER_WINDOWS_INTEGRATED_CONNECTION_FAILED';
  if (!isWindowsAuthFailure) return null;

  const server = connector.config?.server || connector.config?.host || details.server || null;
  const database = connector.config?.database || connector.config?.catalogDatabase || details.database || null;
  const authMode = sanitizeCredential(connector.credential).mode || details.credential_mode || null;
  const runtimeIdentity =
    details.runtime_process_identity ||
    (details.runtime_process_domain && details.runtime_process_user
      ? `${details.runtime_process_domain}\\${details.runtime_process_user}`
      : details.runtime_process_user || null);

  return {
    title: 'Windows Integrated SQL Server authentication needs infrastructure confirmation.',
    connector_id: connector.id || null,
    requested_connector_id: requestedId || connector.id || null,
    connector_type: connector.type || null,
    endpoint: {
      server,
      database,
      port: connector.config?.port || details.port || null,
      raw_server: details.raw_server || server,
      instance: details.instance || null,
      resolved_endpoint: details.resolved_endpoint || null,
      uses_named_instance: details.uses_named_instance === true,
      trust_server_certificate:
        connector.config?.trustServerCertificate ?? connector.config?.trust_server_certificate ?? null,
      encrypt: connector.config?.encrypt ?? null,
      server_spn_configured: Boolean(connector.config?.serverSpn || connector.config?.server_spn),
    },
    runtime_identity: {
      identity: runtimeIdentity,
      user: details.runtime_process_user || null,
      domain: details.runtime_process_domain || null,
      host: details.runtime_process_host || null,
    },
    auth_mode: authMode,
    shared_runtime_rule:
      'Do not bypass the connector framework with direct SQL probes; resolve endpoint/auth here and retest through saved connector TEST.',
    dba_infrastructure_asks: [
      'Confirm the MSSQLSvc SPN registered for the SQL Server host and port or named instance used by this connector.',
      'Confirm whether the app runtime identity is allowed to authenticate to the SQL Server service with Windows Integrated Auth.',
      'Confirm the exact SSMS/Ingestion Studio endpoint, port or instance, encryption, and trustServerCertificate settings that succeed.',
      'For named instances, confirm SQL Browser/fixed-port behavior and whether the saved connector should use a fixed port.',
      'Only add serverSpn to connector config after infrastructure/DBA confirms the exact SPN value.',
    ],
  };
}

const AUTH_MODE_HELP = Object.freeze({
  windows_integrated: 'Use the Windows account running the app. No password is stored in the connector.',
  managed_identity: 'Use the runtime managed identity for Azure-hosted access.',
  service_account: 'Use a username and password, or store the password in a secret reference.',
  secret_reference: 'Use a username plus a secret-store reference for the password or token.',
  service_principal: 'Use an application identity with client credentials.',
  delegated_oauth: 'Use a delegated OAuth flow for user-scoped SaaS access.',
  oauth: 'Use OAuth client credentials or an external token exchange flow.',
  oauth_app: 'Use an OAuth app registration for repository or SaaS access.',
  api_client: 'Use API client credentials issued by the SaaS platform.',
  api_token_reference: 'Store the API token in a secret reference or provide it one time.',
  api_key_reference: 'Store the API key in a secret reference or provide it one time.',
  bearer_token_reference: 'Store the bearer token in a secret reference or provide it one time.',
  pat: 'Use a personal access token directly or through a secret reference.',
  pat_reference: 'Store the personal access token in a secret reference.',
  key_pair: 'Use a username plus a private key or key reference.',
  sas_reference: 'Use a SAS token for Azure Storage access.',
  ssh_key_reference: 'Use an SSH key reference for repository access.',
  none: 'No credential is required for this connector.',
});

const CONNECTOR_WIZARD_METADATA = Object.freeze({
  sql_server: {
    supports_test: true,
    supports_discovery: true,
    recommended_test_options: { dry_run: false, streams: ['schemas', 'tables', 'views'] },
    basic_fields: [
      { key: 'server_host', label: 'Server', input: 'text', required: true, placeholder: 'L1-5FSQL-01', config_group: 'sql_server_endpoint', config_part: 'host' },
      { key: 'instance_name', label: 'Instance', input: 'text', placeholder: 'INST1', config_group: 'sql_server_endpoint', config_part: 'instance' },
      { key: 'database', label: 'Database', input: 'text', required: true, placeholder: 'Sonic_DW', config_key: 'database' },
      { key: 'port', label: 'Port', input: 'number', placeholder: '1433', config_key: 'port' },
    ],
    advanced_fields: [
      { key: 'schema', label: 'Default schema', input: 'text', placeholder: 'dbo', config_key: 'schema' },
      { key: 'encrypt', label: 'Encrypt connection', input: 'toggle', config_key: 'encrypt' },
      { key: 'trustServerCertificate', label: 'Trust server certificate', input: 'toggle', config_key: 'trustServerCertificate' },
      { key: 'connectionTimeout', label: 'Connection timeout (ms)', input: 'number', placeholder: '15000', config_key: 'connectionTimeout' },
    ],
  },
  ssis: {
    supports_test: true,
    supports_discovery: true,
    recommended_test_options: { dry_run: false, streams: ['catalog', 'packages', 'tasks', 'connections'] },
    basic_fields: [
      { key: 'server_host', label: 'Catalog server', input: 'text', required: true, placeholder: 'L1-5FSQL-01', config_group: 'sql_server_endpoint', config_part: 'host' },
      { key: 'instance_name', label: 'Instance', input: 'text', placeholder: 'INST1', config_group: 'sql_server_endpoint', config_part: 'instance' },
      { key: 'catalogDatabase', label: 'Catalog database', input: 'text', placeholder: 'SSISDB', config_key: 'database' },
      { key: 'folder', label: 'Folder (optional)', input: 'text', placeholder: 'FinanceETL', config_key: 'folder' },
      { key: 'project', label: 'Project (optional)', input: 'text', placeholder: 'NightlyLoads', config_key: 'project' },
    ],
    advanced_fields: [
      { key: 'environment', label: 'Environment', input: 'text', placeholder: 'UAT', config_key: 'environment' },
      { key: 'connectionString', label: 'Override connection string', input: 'textarea', placeholder: 'Data Source=...;', config_key: 'connectionString' },
    ],
  },
  postgresql: {
    supports_test: true,
    supports_discovery: true,
    recommended_test_options: { dry_run: false, streams: ['schemas', 'tables', 'views'] },
    basic_fields: [
      { key: 'host', label: 'Host', input: 'text', required: true, placeholder: 'postgres.example.com', config_key: 'host' },
      { key: 'port', label: 'Port', input: 'number', placeholder: '5432', config_key: 'port' },
      { key: 'database', label: 'Database', input: 'text', required: true, placeholder: 'analytics', config_key: 'database' },
      { key: 'schema', label: 'Schema', input: 'text', placeholder: 'public', config_key: 'schema' },
    ],
    advanced_fields: [
      { key: 'ssl', label: 'Use SSL', input: 'toggle', config_key: 'ssl' },
    ],
  },
  snowflake: {
    supports_test: true,
    supports_discovery: true,
    recommended_test_options: { dry_run: false, streams: ['databases', 'schemas', 'tables'] },
    basic_fields: [
      { key: 'account', label: 'Account', input: 'text', required: true, placeholder: 'xy12345.us-east-1', config_key: 'account' },
      { key: 'warehouse', label: 'Warehouse', input: 'text', required: true, placeholder: 'COMPUTE_WH', config_key: 'warehouse' },
      { key: 'database', label: 'Database', input: 'text', required: true, placeholder: 'ANALYTICS', config_key: 'database' },
      { key: 'schema', label: 'Schema', input: 'text', placeholder: 'PUBLIC', config_key: 'schema' },
    ],
    advanced_fields: [
      { key: 'role', label: 'Role', input: 'text', placeholder: 'SYSADMIN', config_key: 'role' },
    ],
  },
  azure_storage: {
    supports_test: true,
    supports_discovery: true,
    recommended_test_options: { dry_run: false, streams: ['accounts', 'containers', 'paths'] },
    basic_fields: [
      { key: 'account', label: 'Storage account', input: 'text', required: true, placeholder: 'sonicdatalake', config_key: 'account' },
      { key: 'container', label: 'Container / filesystem', input: 'text', placeholder: 'raw', config_key: 'container' },
      { key: 'path', label: 'Path prefix', input: 'text', placeholder: '/landing/vendor', config_key: 'path' },
    ],
    advanced_fields: [
      { key: 'base_url', label: 'Custom endpoint', input: 'text', placeholder: 'https://account.dfs.core.windows.net', config_key: 'base_url' },
      { key: 'account_kind', label: 'Storage kind', input: 'select', config_key: 'account_kind', options: [{ title: 'ADLS Gen2', value: 'adls_gen2' }, { title: 'Blob Storage', value: 'blob' }] },
    ],
  },
  power_bi: {
    supports_test: true,
    supports_discovery: true,
    recommended_test_options: { dry_run: false, streams: ['workspaces', 'datasets', 'reports'] },
    basic_fields: [
      { key: 'tenant_id', label: 'Tenant ID', input: 'text', required: true, placeholder: '00000000-0000-0000-0000-000000000000', config_key: 'tenant_id' },
      { key: 'workspace_id', label: 'Workspace ID', input: 'text', placeholder: 'workspace-guid', config_key: 'workspace_id' },
      { key: 'organization', label: 'Organization', input: 'text', placeholder: 'myorg', config_key: 'organization' },
    ],
    advanced_fields: [
      { key: 'activity_start', label: 'Activity start override', input: 'text', placeholder: '2026-01-01T00:00:00Z', config_key: 'activity_start' },
      { key: 'activity_end', label: 'Activity end override', input: 'text', placeholder: '2026-01-02T00:00:00Z', config_key: 'activity_end' },
    ],
  },
  tableau: {
    supports_test: true,
    supports_discovery: true,
    recommended_test_options: { dry_run: false, streams: ['projects', 'workbooks', 'datasources'] },
    basic_fields: [
      { key: 'server_url', label: 'Server URL', input: 'text', required: true, placeholder: 'https://tableau.company.com', config_key: 'server_url' },
      { key: 'site_id', label: 'Site ID', input: 'text', required: true, placeholder: 'marketing', config_key: 'site_id' },
    ],
    advanced_fields: [
      { key: 'api_version', label: 'API version', input: 'text', placeholder: '3.21', config_key: 'api_version' },
    ],
  },
  git_repository: {
    supports_test: true,
    supports_discovery: true,
    recommended_test_options: { dry_run: false, streams: ['repositories', 'python_scripts', 'sql_files'] },
    basic_fields: [
      { key: 'repo_url', label: 'Repository URL', input: 'text', required: true, placeholder: 'https://dev.azure.com/org/project/_git/repo', config_key: 'repo_url' },
      { key: 'branch', label: 'Branch', input: 'text', placeholder: 'main', config_key: 'branch' },
      { key: 'path', label: 'Root path', input: 'text', placeholder: '/', config_key: 'path' },
      { key: 'files', label: 'Known files (optional)', input: 'textarea', placeholder: 'jobs/load_vehicle.py\nsql/stage_vehicle.sql', config_key: 'files', value_format: 'newline_array' },
    ],
    advanced_fields: [
      { key: 'repository_api_url', label: 'Repository API URL override', input: 'text', placeholder: 'https://api.github.com/repos/org/repo', config_key: 'repository_api_url' },
    ],
  },
  openapi: {
    supports_test: true,
    supports_discovery: false,
    recommended_test_options: { dry_run: false, streams: ['openapi_spec', 'endpoints', 'schemas'] },
    basic_fields: [
      { key: 'spec_url', label: 'OpenAPI spec URL', input: 'text', required: true, placeholder: 'https://api.company.com/openapi.json', config_key: 'spec_url' },
      { key: 'base_url', label: 'Base API URL', input: 'text', placeholder: 'https://api.company.com', config_key: 'base_url' },
    ],
    advanced_fields: [
      { key: 'lineage_endpoint', label: 'Lineage endpoint override', input: 'text', placeholder: 'https://api.company.com/metadata', config_key: 'lineage_endpoint' },
    ],
  },
});

export const CONNECTOR_CATEGORIES = Object.freeze({
  DATABASE: 'database',
  WAREHOUSE: 'warehouse',
  CLOUD_STORAGE: 'cloud_storage',
  CLOUD_PLATFORM: 'cloud_platform',
  BI: 'business_intelligence',
  PIPELINE: 'pipeline',
  API: 'api',
  REPOSITORY: 'repository',
  STREAMING: 'streaming',
  ML: 'ml_feature_platform',
  ERP_CRM: 'erp_crm',
});

export const CONNECTOR_ACTIONS = Object.freeze({
  VIEW: 'view',
  RUN: 'run',
  EDIT: 'edit',
  ADMIN: 'admin',
});

export const CONNECTOR_TYPES = Object.freeze({
  SQL_SERVER: {
    type: 'sql_server',
    label: 'SQL Server',
    provider: 'Microsoft',
    category: CONNECTOR_CATEGORIES.DATABASE,
    cloud: 'hybrid',
    metadata: ['schemas', 'tables', 'views', 'columns', 'procedures', 'functions', 'constraints', 'indexes', 'lineage hints'],
    credentialKinds: ['service_account', 'managed_identity', 'windows_integrated'],
  },
  POSTGRESQL: {
    type: 'postgresql',
    label: 'PostgreSQL',
    provider: 'Open Source',
    category: CONNECTOR_CATEGORIES.DATABASE,
    cloud: 'hybrid',
    metadata: ['schemas', 'tables', 'views', 'columns', 'constraints', 'indexes', 'routines'],
    credentialKinds: ['service_account', 'secret_reference'],
  },
  SNOWFLAKE: {
    type: 'snowflake',
    label: 'Snowflake',
    provider: 'Snowflake',
    category: CONNECTOR_CATEGORIES.WAREHOUSE,
    cloud: 'multi-cloud',
    metadata: ['databases', 'schemas', 'tables', 'views', 'columns', 'tags', 'query usage'],
    credentialKinds: ['key_pair', 'oauth', 'service_account'],
  },
  BIGQUERY: {
    type: 'bigquery',
    label: 'BigQuery',
    provider: 'Google Cloud',
    category: CONNECTOR_CATEGORIES.WAREHOUSE,
    cloud: 'gcp',
    metadata: ['projects', 'datasets', 'tables', 'views', 'columns', 'policy tags', 'jobs'],
    credentialKinds: ['service_account', 'workload_identity'],
  },
  DATABRICKS: {
    type: 'databricks',
    label: 'Databricks',
    provider: 'Databricks',
    category: CONNECTOR_CATEGORIES.WAREHOUSE,
    cloud: 'multi-cloud',
    metadata: ['workspaces', 'unity catalog', 'schemas', 'tables', 'views', 'jobs', 'clusters', 'notebooks'],
    credentialKinds: ['service_principal', 'pat', 'oauth'],
  },
  AZURE_PURVIEW: {
    type: 'azure_purview',
    label: 'Microsoft Purview',
    provider: 'Microsoft Azure',
    category: CONNECTOR_CATEGORIES.CLOUD_PLATFORM,
    cloud: 'azure',
    metadata: ['collections', 'assets', 'classifications', 'lineage', 'glossary'],
    credentialKinds: ['managed_identity', 'service_principal'],
  },
  AZURE_STORAGE: {
    type: 'azure_storage',
    label: 'Azure Storage / ADLS',
    provider: 'Microsoft Azure',
    category: CONNECTOR_CATEGORIES.CLOUD_STORAGE,
    cloud: 'azure',
    metadata: ['accounts', 'containers', 'paths', 'file formats', 'classifications'],
    credentialKinds: ['managed_identity', 'service_principal', 'sas_reference'],
  },
  AZURE_DATA_FACTORY: {
    type: 'azure_data_factory',
    label: 'Azure Data Factory',
    provider: 'Microsoft Azure',
    category: CONNECTOR_CATEGORIES.PIPELINE,
    cloud: 'azure',
    metadata: ['factories', 'pipelines', 'activities', 'datasets', 'linked services', 'triggers'],
    credentialKinds: ['managed_identity', 'service_principal'],
  },
  SSIS: {
    type: 'ssis',
    label: 'SQL Server Integration Services',
    provider: 'Microsoft',
    category: CONNECTOR_CATEGORIES.PIPELINE,
    cloud: 'on_prem',
    metadata: ['catalog folders', 'projects', 'packages', 'tasks', 'connections', 'parameters', 'environments', 'agent jobs', 'lineage edges'],
    credentialKinds: ['windows_integrated', 'service_account', 'secret_reference'],
  },
  AWS_GLUE: {
    type: 'aws_glue',
    label: 'AWS Glue Data Catalog',
    provider: 'AWS',
    category: CONNECTOR_CATEGORIES.CLOUD_PLATFORM,
    cloud: 'aws',
    metadata: ['databases', 'tables', 'columns', 'partitions', 'crawlers', 'jobs'],
    credentialKinds: ['iam_role', 'access_key_reference'],
  },
  AWS_S3: {
    type: 'aws_s3',
    label: 'Amazon S3',
    provider: 'AWS',
    category: CONNECTOR_CATEGORIES.CLOUD_STORAGE,
    cloud: 'aws',
    metadata: ['buckets', 'prefixes', 'objects', 'file formats', 'classifications'],
    credentialKinds: ['iam_role', 'access_key_reference'],
  },
  AWS_REDSHIFT: {
    type: 'aws_redshift',
    label: 'Amazon Redshift',
    provider: 'AWS',
    category: CONNECTOR_CATEGORIES.WAREHOUSE,
    cloud: 'aws',
    metadata: ['databases', 'schemas', 'tables', 'views', 'columns', 'query usage'],
    credentialKinds: ['iam_role', 'secret_reference'],
  },
  GCP_DATAPLEX: {
    type: 'gcp_dataplex',
    label: 'Google Dataplex / Data Catalog',
    provider: 'Google Cloud',
    category: CONNECTOR_CATEGORIES.CLOUD_PLATFORM,
    cloud: 'gcp',
    metadata: ['lakes', 'zones', 'entries', 'schemas', 'policy tags', 'lineage'],
    credentialKinds: ['service_account', 'workload_identity'],
  },
  GCS: {
    type: 'gcs',
    label: 'Google Cloud Storage',
    provider: 'Google Cloud',
    category: CONNECTOR_CATEGORIES.CLOUD_STORAGE,
    cloud: 'gcp',
    metadata: ['buckets', 'prefixes', 'objects', 'file formats', 'classifications'],
    credentialKinds: ['service_account', 'workload_identity'],
  },
  LOOKER: {
    type: 'looker',
    label: 'Looker',
    provider: 'Google Cloud',
    category: CONNECTOR_CATEGORIES.BI,
    cloud: 'multi-cloud',
    metadata: ['models', 'explores', 'dashboards', 'looks', 'fields', 'metrics'],
    credentialKinds: ['api_client'],
  },
  MICROSTRATEGY_CLOUD: {
    type: 'microstrategy_cloud',
    label: 'MicroStrategy Cloud',
    provider: 'MicroStrategy',
    category: CONNECTOR_CATEGORIES.BI,
    cloud: 'saas',
    metadata: ['projects', 'dossiers', 'documents', 'reports', 'cubes', 'attributes', 'metrics', 'facts', 'prompts', 'data sources'],
    credentialKinds: ['oauth', 'api_token_reference', 'service_account'],
  },
  SSAS_ON_PREM: {
    type: 'ssas_on_prem',
    label: 'SQL Server Analysis Services',
    provider: 'Microsoft',
    category: CONNECTOR_CATEGORIES.BI,
    cloud: 'on_prem',
    metadata: ['servers', 'databases', 'models', 'cubes', 'perspectives', 'dimensions', 'measures', 'partitions', 'roles', 'data sources'],
    credentialKinds: ['windows_integrated', 'service_account', 'secret_reference'],
  },
  POWER_BI: {
    type: 'power_bi',
    label: 'Power BI',
    provider: 'Microsoft',
    category: CONNECTOR_CATEGORIES.BI,
    cloud: 'azure',
    metadata: ['workspaces', 'datasets', 'reports', 'dashboards', 'measures', 'semantic models'],
    credentialKinds: ['service_principal', 'delegated_oauth'],
  },
  POWER_BI_REPORT_SERVER: {
    type: 'power_bi_report_server',
    label: 'Power BI Report Server',
    provider: 'Microsoft',
    category: CONNECTOR_CATEGORIES.BI,
    cloud: 'on_prem',
    metadata: ['folders', 'pbix reports', 'paginated reports', 'mobile reports', 'linked reports', 'datasource references'],
    credentialKinds: ['windows_integrated', 'service_account', 'secret_reference'],
  },
  SSRS: {
    type: 'ssrs',
    label: 'SQL Server Reporting Services',
    provider: 'Microsoft',
    category: CONNECTOR_CATEGORIES.BI,
    cloud: 'on_prem',
    metadata: ['folders', 'rdl reports', 'subscriptions', 'shared data sources', 'shared datasets', 'parameters'],
    credentialKinds: ['windows_integrated', 'service_account', 'secret_reference'],
  },
  TABLEAU: {
    type: 'tableau',
    label: 'Tableau',
    provider: 'Salesforce',
    category: CONNECTOR_CATEGORIES.BI,
    cloud: 'multi-cloud',
    metadata: ['sites', 'workbooks', 'dashboards', 'datasources', 'fields', 'calculated fields'],
    credentialKinds: ['pat', 'service_account'],
  },
  QLIK_CLOUD: {
    type: 'qlik_cloud',
    label: 'Qlik Cloud',
    provider: 'Qlik',
    category: CONNECTOR_CATEGORIES.BI,
    cloud: 'saas',
    metadata: ['spaces', 'apps', 'sheets', 'charts', 'datasets', 'fields', 'measures', 'reload tasks'],
    credentialKinds: ['oauth', 'api_key_reference'],
  },
  QLIK_SENSE: {
    type: 'qlik_sense',
    label: 'Qlik Sense Enterprise',
    provider: 'Qlik',
    category: CONNECTOR_CATEGORIES.BI,
    cloud: 'hybrid',
    metadata: ['streams', 'apps', 'sheets', 'charts', 'reload tasks', 'data connections', 'fields', 'measures'],
    credentialKinds: ['certificate_reference', 'service_account', 'api_key_reference'],
  },
  DOMO: {
    type: 'domo',
    label: 'Domo',
    provider: 'Domo',
    category: CONNECTOR_CATEGORIES.BI,
    cloud: 'saas',
    metadata: ['datasets', 'cards', 'dashboards', 'dataflows', 'beast modes', 'owners'],
    credentialKinds: ['oauth', 'api_client'],
  },
  SIGMA: {
    type: 'sigma',
    label: 'Sigma',
    provider: 'Sigma',
    category: CONNECTOR_CATEGORIES.BI,
    cloud: 'saas',
    metadata: ['workbooks', 'pages', 'elements', 'datasets', 'connections', 'calculations'],
    credentialKinds: ['api_client', 'oauth'],
  },
  MODE: {
    type: 'mode',
    label: 'Mode',
    provider: 'Mode',
    category: CONNECTOR_CATEGORIES.BI,
    cloud: 'saas',
    metadata: ['spaces', 'reports', 'queries', 'charts', 'datasets', 'schedules'],
    credentialKinds: ['api_token_reference'],
  },
  METABASE: {
    type: 'metabase',
    label: 'Metabase',
    provider: 'Metabase',
    category: CONNECTOR_CATEGORIES.BI,
    cloud: 'hybrid',
    metadata: ['collections', 'dashboards', 'cards', 'questions', 'models', 'database references'],
    credentialKinds: ['api_token_reference', 'service_account'],
  },
  SUPERSET: {
    type: 'superset',
    label: 'Apache Superset',
    provider: 'Apache',
    category: CONNECTOR_CATEGORIES.BI,
    cloud: 'hybrid',
    metadata: ['databases', 'datasets', 'charts', 'dashboards', 'metrics', 'calculated columns'],
    credentialKinds: ['service_account', 'oauth', 'api_token_reference'],
  },
  REDASH: {
    type: 'redash',
    label: 'Redash',
    provider: 'Redash',
    category: CONNECTOR_CATEGORIES.BI,
    cloud: 'hybrid',
    metadata: ['data sources', 'queries', 'visualizations', 'dashboards', 'alerts'],
    credentialKinds: ['api_key_reference'],
  },
  QUICK_SIGHT: {
    type: 'quicksight',
    label: 'Amazon QuickSight',
    provider: 'AWS',
    category: CONNECTOR_CATEGORIES.BI,
    cloud: 'aws',
    metadata: ['analyses', 'dashboards', 'datasets', 'data sources', 'calculated fields', 'themes'],
    credentialKinds: ['iam_role', 'access_key_reference'],
  },
  GRAFANA: {
    type: 'grafana',
    label: 'Grafana',
    provider: 'Grafana Labs',
    category: CONNECTOR_CATEGORIES.BI,
    cloud: 'hybrid',
    metadata: ['folders', 'dashboards', 'panels', 'queries', 'datasources', 'alerts'],
    credentialKinds: ['service_account_token_reference', 'api_key_reference'],
  },
  COGNOS: {
    type: 'cognos',
    label: 'IBM Cognos Analytics',
    provider: 'IBM',
    category: CONNECTOR_CATEGORIES.BI,
    cloud: 'hybrid',
    metadata: ['packages', 'reports', 'dashboards', 'data modules', 'queries', 'dimensions', 'measures'],
    credentialKinds: ['service_account', 'oauth', 'secret_reference'],
  },
  SAP_BUSINESSOBJECTS: {
    type: 'sap_businessobjects',
    label: 'SAP BusinessObjects',
    provider: 'SAP',
    category: CONNECTOR_CATEGORIES.BI,
    cloud: 'hybrid',
    metadata: ['universes', 'web intelligence documents', 'crystal reports', 'folders', 'objects', 'data foundations'],
    credentialKinds: ['service_account', 'secret_reference'],
  },
  ORACLE_ANALYTICS: {
    type: 'oracle_analytics',
    label: 'Oracle Analytics',
    provider: 'Oracle',
    category: CONNECTOR_CATEGORIES.BI,
    cloud: 'hybrid',
    metadata: ['workbooks', 'analyses', 'dashboards', 'datasets', 'semantic models', 'subject areas'],
    credentialKinds: ['oauth', 'api_token_reference', 'service_account'],
  },
  THOUGHTSPOT: {
    type: 'thoughtspot',
    label: 'ThoughtSpot',
    provider: 'ThoughtSpot',
    category: CONNECTOR_CATEGORIES.BI,
    cloud: 'saas',
    metadata: ['answers', 'liveboards', 'worksheets', 'tables', 'columns', 'formulas'],
    credentialKinds: ['api_token_reference', 'oauth'],
  },
  SISENSE: {
    type: 'sisense',
    label: 'Sisense',
    provider: 'Sisense',
    category: CONNECTOR_CATEGORIES.BI,
    cloud: 'hybrid',
    metadata: ['dashboards', 'widgets', 'data models', 'elasticubes', 'datasets', 'formulas'],
    credentialKinds: ['api_token_reference', 'service_account'],
  },
  AIRFLOW: {
    type: 'airflow',
    label: 'Apache Airflow',
    provider: 'Apache',
    category: CONNECTOR_CATEGORIES.PIPELINE,
    cloud: 'hybrid',
    metadata: ['dags', 'tasks', 'connections', 'schedules', 'operators'],
    credentialKinds: ['basic_auth', 'bearer_token_reference'],
  },
  DBT: {
    type: 'dbt',
    label: 'dbt Core / Cloud',
    provider: 'dbt Labs',
    category: CONNECTOR_CATEGORIES.PIPELINE,
    cloud: 'multi-cloud',
    metadata: ['manifest', 'catalog', 'sources', 'models', 'tests', 'metrics', 'exposures'],
    credentialKinds: ['repo_reference', 'api_token_reference'],
  },
  OPENAPI: {
    type: 'openapi',
    label: 'OpenAPI / Swagger',
    provider: 'API',
    category: CONNECTOR_CATEGORIES.API,
    cloud: 'multi-cloud',
    metadata: ['endpoints', 'schemas', 'operations', 'request fields', 'response fields'],
    credentialKinds: ['none', 'api_token_reference'],
  },
  GIT_REPOSITORY: {
    type: 'git_repository',
    label: 'Git Repository',
    provider: 'GitHub / Azure DevOps / GitLab / Bitbucket',
    category: CONNECTOR_CATEGORIES.REPOSITORY,
    cloud: 'multi-cloud',
    metadata: ['repositories', 'branches', 'python scripts', 'sql files', 'dbt manifests', 'notebooks', 'pipeline code'],
    credentialKinds: ['oauth_app', 'pat_reference', 'ssh_key_reference'],
  },
  KAFKA: {
    type: 'kafka',
    label: 'Kafka',
    provider: 'Apache / Confluent',
    category: CONNECTOR_CATEGORIES.STREAMING,
    cloud: 'multi-cloud',
    metadata: ['clusters', 'topics', 'schemas', 'consumers', 'producers'],
    credentialKinds: ['service_account', 'api_key_reference'],
  },
  SALESFORCE: {
    type: 'salesforce',
    label: 'Salesforce',
    provider: 'Salesforce',
    category: CONNECTOR_CATEGORIES.ERP_CRM,
    cloud: 'saas',
    metadata: ['objects', 'fields', 'relationships', 'reports', 'dashboards'],
    credentialKinds: ['connected_app', 'oauth'],
  },
  SAP: {
    type: 'sap',
    label: 'SAP',
    provider: 'SAP',
    category: CONNECTOR_CATEGORIES.ERP_CRM,
    cloud: 'hybrid',
    metadata: ['tables', 'views', 'odata services', 'extractors', 'business objects'],
    credentialKinds: ['service_account', 'oauth'],
  },
});

const connectorStore = new Map();
const runHistoryStore = [];
const snapshotStore = new Map();
const profileScheduleStore = new Map();
const profileScheduleRunStore = [];

const PROFILE_SCHEDULE_TYPES = new Set(['auto', 'aggregate', 'bi', 'metadata']);
const PROFILE_SCHEDULE_STATUSES = new Set(['ACTIVE', 'PAUSED']);
const PROFILE_SCHEDULER_DEFAULT_INTERVAL_MS = 60_000;
const PROFILE_SCHEDULER_MAX_HISTORY = 1000;
const PROFILE_CONNECTOR_MAX_HISTORY = 5000;
const RUNTIME_USER = { id: 'profile-scheduler', email: 'scheduler@platform.local', roles: ['Admin'] };
let runtimeStoreHydrated = false;
let profileSchedulerTimer = null;
let profileSchedulerStatus = {
  enabled: false,
  running: false,
  interval_ms: PROFILE_SCHEDULER_DEFAULT_INTERVAL_MS,
  started_at: null,
  last_tick_at: null,
  last_result: null,
  last_error: null,
};

function nowIso() {
  return new Date().toISOString();
}

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60_000);
}

function normalizeRoles(roles = []) {
  return Array.isArray(roles) ? roles.map((role) => String(role).toLowerCase()) : [];
}

function isAdmin(user = {}) {
  return normalizeRoles(user.roles).includes('admin');
}

function actorId(user = {}) {
  return user.id || user.sub || user.email || 'system';
}

function toArray(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (value === undefined || value === null || value === '') return [];
  return String(value)
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeConnectorType(type) {
  const normalized = String(type || '').trim().toLowerCase();
  const found = Object.values(CONNECTOR_TYPES).find((definition) => definition.type === normalized);
  if (!found) {
    throw new Error(`Unsupported connector type '${type}'.`);
  }
  return found;
}

function connectorWizardMetadataForType(type) {
  const normalized = String(type || '').trim().toLowerCase();
  const wizard = CONNECTOR_WIZARD_METADATA[normalized];
  if (wizard) return { ...wizard };
  return {
    supports_test: WIZARD_SUPPORTED_TYPES.has(normalized),
    supports_discovery: false,
    basic_fields: [],
    advanced_fields: [],
  };
}

function maskValue(value) {
  if (value === undefined || value === null || value === '') return value;
  const text = String(value);
  if (text.length <= 4) return '****';
  return `${text.slice(0, 2)}****${text.slice(-2)}`;
}

function sanitizeConfig(config = {}) {
  return Object.fromEntries(
    Object.entries(config || {}).map(([key, value]) => [
      key,
      SENSITIVE_FIELD_PATTERN.test(key) ? maskValue(value) : value,
    ])
  );
}

function sanitizeCredential(credential = {}) {
  if (!credential || Object.keys(credential).length === 0) {
    return { mode: 'none', secret_ref: null, status: 'not_configured' };
  }
  const visibleFields = Object.fromEntries(
    Object.entries(credential)
      .filter(([key]) => !['secret_ref', 'secretRef', 'vault', 'status', 'fields', 'values'].includes(key))
      .filter(([key]) => !SENSITIVE_FIELD_PATTERN.test(key))
  );
  return {
    mode: credential.mode || credential.kind || 'secret_reference',
    secret_ref: credential.secret_ref || credential.secretRef || null,
    vault: credential.vault || credential.vault_name || null,
    status: credential.secret_ref || credential.secretRef ? 'stored_reference' : 'configured',
    fields: Object.keys(credential).filter(
      (key) => !['secret_ref', 'secretRef', 'vault', 'status', 'fields', 'values'].includes(key)
    ),
    values: visibleFields,
  };
}

function normalizeCredentialForPersistence(credential = {}) {
  if (!credential || Object.keys(credential).length === 0) {
    return { mode: 'none' };
  }
  const normalized = {
    mode: credential.mode || credential.kind || 'secret_reference',
  };
  const secretRef = credential.secret_ref || credential.secretRef;
  if (secretRef) normalized.secret_ref = 'stored_reference';
  const vault = credential.vault || credential.vault_name;
  if (vault) normalized.vault = 'stored_reference';
  for (const [key, value] of Object.entries(credential)) {
    if (
      ['mode', 'kind', 'secret_ref', 'secretRef', 'vault', 'vault_name', 'status', 'fields', 'values'].includes(key) ||
      SENSITIVE_FIELD_PATTERN.test(key) ||
      value === undefined ||
      value === null ||
      value === ''
    ) {
      continue;
    }
    normalized[key] = value;
  }
  return normalized;
}

function sanitizeConnector(connector) {
  if (!connector) return null;
  return {
    ...connector,
    config: sanitizeConfig(connector.config),
    credential: sanitizeCredential(connector.credential),
  };
}

function normalizeConnectorLookupValue(value = '') {
  return String(value || '').trim().toLowerCase();
}

function connectorLookupAliases(connector = {}) {
  return [
    connector.id,
    connector.label,
    connector.name,
    connector.config?.database,
    connector.config?.catalog,
    connector.config?.catalogDatabase,
    connector.config?.databaseName,
  ]
    .map(normalizeConnectorLookupValue)
    .filter(Boolean);
}

function resolveConnectorRecord(id) {
  hydrateRuntimeStore();
  const exact = connectorStore.get(id);
  if (exact) return { connector: exact, requested_id: id, resolved_id: exact.id, alias_match: false };

  const requested = normalizeConnectorLookupValue(id);
  if (!requested) return { connector: null, requested_id: id, resolved_id: null, alias_match: false };

  const matches = [...connectorStore.values()].filter((connector) =>
    connectorLookupAliases(connector).includes(requested)
  );
  if (matches.length !== 1) return { connector: null, requested_id: id, resolved_id: null, alias_match: false };
  return { connector: matches[0], requested_id: id, resolved_id: matches[0].id, alias_match: true };
}

function sanitizeProfileOptions(options = {}) {
  const sanitized = sanitizeConfig(options || {});
  delete sanitized.metadata_payload;
  delete sanitized.metadataPayload;
  delete sanitized.mockMetadata;
  return sanitized;
}

function scheduleDryRunRequested(options = {}) {
  return options.dry_run === true || options.dryRun === true || options.execution_mode === 'dry_run' || options.executionMode === 'dry_run';
}

function normalizeScheduleRuntimeOptions(options = {}, warnings = []) {
  const normalized = sanitizeProfileOptions({
    fail_fast: false,
    ...options,
    dry_run: false,
    execution_mode: options.execution_mode && options.execution_mode !== 'dry_run' ? options.execution_mode : 'live',
  });
  delete normalized.dryRun;
  delete normalized.executionMode;
  if (scheduleDryRunRequested(options)) {
    warnings.push({
      code: 'PROFILE_SCHEDULE_DRY_RUN_NORMALIZED',
      message: 'Recurring profile schedules must run live; dry_run was normalized to false.',
    });
  }
  return normalized;
}

function assertProfileScheduleNotDryRun(options = {}) {
  if (!scheduleDryRunRequested(options)) return;
  const error = new Error('Recurring profile schedules cannot be saved as dry runs. Use a one-time profile run for dry-run previews.');
  error.code = 'CONNECTOR_CONFIG_ERROR';
  error.status = 400;
  error.remediation = 'Set options.dry_run to false and execution_mode to live before saving the schedule.';
  error.details = {
    dry_run: options.dry_run ?? options.dryRun ?? null,
    execution_mode: options.execution_mode || options.executionMode || null,
  };
  throw error;
}

function normalizeScheduleInterval(input = {}) {
  const cadence = String(input.cadence || input.frequency || '').toLowerCase();
  const intervalMinutes = Number(input.interval_minutes || input.intervalMinutes);
  if (Number.isFinite(intervalMinutes) && intervalMinutes >= 5) return Math.round(intervalMinutes);
  if (cadence === 'hourly') return 60;
  if (cadence === 'daily') return 1440;
  if (cadence === 'weekly') return 10080;
  return 1440;
}

function computeNextRunAt(schedule = {}, from = new Date()) {
  const start = schedule.start_at ? new Date(schedule.start_at) : null;
  if (start && Number.isFinite(start.getTime()) && start > from) return start.toISOString();
  return addMinutes(from, schedule.interval_minutes || 1440).toISOString();
}

function sanitizeProfileSchedule(schedule) {
  return schedule ? { ...schedule, options: sanitizeProfileOptions(schedule.options || {}) } : null;
}

function normalizePersistedProfileSchedule(schedule = {}) {
  const warnings = Array.isArray(schedule.validation_warnings) ? [...schedule.validation_warnings] : [];
  const options = normalizeScheduleRuntimeOptions(schedule.options || {}, warnings);
  return {
    ...schedule,
    options,
    validation_warnings: warnings.length ? warnings : undefined,
  };
}

function runtimePersistenceEnabled() {
  const explicit = String(process.env.PROFILE_SCHEDULER_PERSISTENCE || '').toLowerCase();
  if (explicit === 'on' || explicit === 'true') return true;
  if (explicit === 'off' || explicit === 'false') return false;
  return process.env.NODE_ENV !== 'test' && !process.env.JEST_WORKER_ID;
}

function profileRuntimeDir() {
  return process.env.PROFILE_RUNTIME_DIR || path.join(process.cwd(), 'data', '_runtime', 'profiles');
}

function profileSchedulerStorePath() {
  return process.env.PROFILE_SCHEDULER_STORE_PATH || path.join(profileRuntimeDir(), 'profile-scheduler-store.json');
}

function profileRunArtifactDir() {
  return process.env.PROFILE_ARTIFACT_DIR || path.join(profileRuntimeDir(), 'runs');
}

function profileMarkdownDir() {
  return process.env.PROFILE_MARKDOWN_DIR || path.join(process.cwd(), 'data', 'markdown', '_runtime', 'profile-runs');
}

function profilePublicationQueuePath() {
  return path.join(profileMarkdownDir(), 'profile-publication-queue.json');
}

function sanitizeForPersistence(value) {
  if (Array.isArray(value)) return value.map(sanitizeForPersistence);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => !/metadata_payload|metadataPayload|mockMetadata/i.test(key))
      .map(([key, nested]) => [
        key,
        SENSITIVE_FIELD_PATTERN.test(key) && typeof nested === 'string'
          ? maskValue(nested)
          : sanitizeForPersistence(nested),
      ])
  );
}

function safePathSegment(value) {
  return String(value || 'unknown')
    .replace(/[^a-z0-9_.-]+/gi, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 120) || 'unknown';
}

function profileRunKind(run = {}) {
  if (run.summary?.bi_profile_run) return 'bi_profile';
  if (run.summary?.metadata_profile_run) return 'metadata_profile';
  if (run.summary?.profile_run) return 'aggregate_profile';
  return 'metadata_harvest';
}

function profileRowsFromRun(run = {}) {
  const profiles = run.profile?.run?.profiles || run.profile?.profiles || {};
  return Object.entries(profiles).map(([assetId, profile]) => ({
    asset_id: assetId,
    row_count: profile.row_count ?? '',
    column_count: Object.keys(profile.columns || {}).length,
    generated_at: profile.generated_at || profile.profiled_at || '',
  }));
}

function columnRowsFromRun(run = {}) {
  const profiles = run.profile?.run?.profiles || run.profile?.profiles || {};
  return Object.entries(profiles).flatMap(([assetId, profile]) =>
    Object.entries(profile.columns || {}).map(([columnName, stats]) => ({
      asset_id: assetId,
      column_name: columnName,
      row_count: stats.row_count ?? profile.row_count ?? '',
      null_count: stats.null_count ?? '',
      null_percent: stats.null_percent ?? '',
      distinct_count: stats.distinct_count ?? '',
      min: stats.min ?? '',
      max: stats.max ?? '',
      mean: stats.mean ?? '',
    }))
  );
}

function successfulProfileAssetIds(run = {}) {
  return profileRowsFromRun(run).map((row) => row.asset_id).filter(Boolean);
}

function failedProfileAssetIds(run = {}) {
  const errors = run.errors || run.profile?.errors || run.profile?.run?.errors || [];
  return [...new Set(errors
    .map((error) => error?.asset_id || error?.assetId || error?.object_id || error?.objectId)
    .filter(Boolean))];
}

function profilePublishState(run = {}) {
  const successfulAssets = successfulProfileAssetIds(run);
  const failedAssets = failedProfileAssetIds(run);
  const existing = run.artifact?.profile_publish || {};
  const hasSuccessfulProfiles = successfulAssets.length > 0;
  const status = existing.status || (hasSuccessfulProfiles ? 'pending' : 'not_applicable');
  return {
    status,
    successful_asset_count: successfulAssets.length,
    failed_asset_count: failedAssets.length,
    successful_assets: successfulAssets,
    failed_assets: failedAssets,
    published_asset_count: existing.published_asset_count || 0,
    published_assets: existing.published_assets || [],
    pending_assets: existing.pending_assets || successfulAssets,
    last_attempt_at: existing.last_attempt_at || null,
    last_published_at: existing.last_published_at || null,
    last_error: existing.last_error || null,
    targets: existing.targets || [],
  };
}

function readPublicationQueue() {
  const queuePath = profilePublicationQueuePath();
  if (!existsSync(queuePath)) return { version: 1, updated_at: null, runs: [] };
  try {
    return JSON.parse(readFileSync(queuePath, 'utf8'));
  } catch {
    return { version: 1, updated_at: null, runs: [] };
  }
}

function writePublicationQueue(queue) {
  const queuePath = profilePublicationQueuePath();
  const legacyQueuePath = path.join(profileMarkdownDir(), 'devops-upload-pending.json');
  mkdirSync(path.dirname(queuePath), { recursive: true });
  const normalized = { ...queue, updated_at: nowIso() };
  writeFileSync(queuePath, JSON.stringify(normalized, null, 2));
  writeFileSync(
    legacyQueuePath,
    JSON.stringify(
      {
        version: normalized.version || 1,
        updated_at: normalized.updated_at,
        runs: (normalized.runs || []).map((entry) => ({
          run_id: entry.run_id,
          connector_id: entry.connector_id,
          status: entry.status === 'published' ? 'published' : 'pending',
          profile_publish_status: entry.status,
          successful_asset_count: entry.successful_asset_count || 0,
          failed_asset_count: entry.failed_asset_count || 0,
          markdown_path: entry.markdown_path || null,
          json_path: entry.json_path || null,
          updated_at: entry.updated_at || normalized.updated_at,
        })),
      },
      null,
      2
    )
  );
}

function updateProfilePublicationQueue(run = {}) {
  const publish = profilePublishState(run);
  if (publish.successful_asset_count <= 0) return publish;
  const queue = readPublicationQueue();
  const entry = {
    run_id: run.id,
    connector_id: run.connector_id,
    run_kind: profileRunKind(run),
    status: publish.status,
    successful_asset_count: publish.successful_asset_count,
    failed_asset_count: publish.failed_asset_count,
    successful_assets: publish.successful_assets,
    failed_assets: publish.failed_assets,
    markdown_path: run.artifact?.markdown_path || null,
    json_path: run.artifact?.json_path || null,
    updated_at: nowIso(),
  };
  queue.runs = [entry, ...(queue.runs || []).filter((item) => item.run_id !== run.id)];
  writePublicationQueue(queue);
  return publish;
}

function tableMarkdown(headers, rows) {
  if (!rows.length) return '';
  const header = `| ${headers.join(' | ')} |`;
  const divider = `| ${headers.map(() => '---').join(' | ')} |`;
  const body = rows.map((row) => `| ${headers.map((key) => String(row[key] ?? '').replace(/\|/g, '\\|')).join(' | ')} |`);
  return [header, divider, ...body].join('\n');
}

function exportConnectorRunMarkdown(run = {}) {
  try {
    const root = profileMarkdownDir();
    const connectorDir = path.join(root, safePathSegment(run.connector_id));
    mkdirSync(connectorDir, { recursive: true });
    const completed = run.completed_at || nowIso();
    const fileBase = `${completed.replace(/[:.]/g, '-')}-${safePathSegment(run.id)}`;
    const mdPath = path.join(connectorDir, `${fileBase}.md`);
    const jsonPath = path.join(connectorDir, `${fileBase}.json`);
    const summary = sanitizeForPersistence(run.summary || {});
    const assetRows = profileRowsFromRun(run);
    const columnRows = columnRowsFromRun(run);
    const streamRows = (run.extraction?.stream_results || []).map((stream) => ({
      stream: stream.stream,
      status: stream.status,
      event_count: stream.event_count ?? '',
      endpoint: stream.plan?.endpoint || '',
    }));
    const markdown = [
      '---',
      `id: ${run.id}`,
      `connector_id: ${run.connector_id}`,
      `connector_type: ${run.connector_type}`,
      `run_kind: ${profileRunKind(run)}`,
      `status: ${run.status}`,
      `mode: ${run.mode}`,
      `profiled_at: ${completed}`,
      'raw_data_captured: false',
      'raw_values_retained: false',
      'devops_upload_pending: true',
      `profile_publish_status: ${profilePublishState(run).status}`,
      '---',
      '',
      `# Connector Run ${run.id}`,
      '',
      `- Connector: ${run.connector_id}`,
      `- Type: ${run.connector_type}`,
      `- Kind: ${profileRunKind(run)}`,
      `- Status: ${run.status}`,
      `- Mode: ${run.mode}`,
      `- Completed: ${completed}`,
      '',
      '## Summary',
      '',
      '```json',
      JSON.stringify(summary, null, 2),
      '```',
      '',
      assetRows.length ? '## Profiled Assets' : '',
      assetRows.length ? tableMarkdown(['asset_id', 'row_count', 'column_count', 'generated_at'], assetRows) : '',
      '',
      columnRows.length ? '## Column Profile Results' : '',
      columnRows.length
        ? tableMarkdown(['asset_id', 'column_name', 'row_count', 'null_count', 'null_percent', 'distinct_count', 'min', 'max', 'mean'], columnRows)
        : '',
      '',
      streamRows.length ? '## Metadata Streams' : '',
      streamRows.length ? tableMarkdown(['stream', 'status', 'event_count', 'endpoint'], streamRows) : '',
      '',
      '## DevOps Upload',
      '',
      '- Status: pending',
      '- Include this file in the next catalog/runtime export to DevOps.',
      '',
    ]
      .filter((line) => line !== null && line !== undefined)
      .join('\n');
    const jsonPayload = sanitizeForPersistence({
      run,
      markdown_path: mdPath,
      json_path: jsonPath,
      devops_upload_pending: true,
      profile_publish: profilePublishState(run),
    });
    writeFileSync(mdPath, markdown);
    writeFileSync(jsonPath, JSON.stringify(jsonPayload, null, 2));
    const pendingPath = path.join(root, 'devops-upload-pending.json');
    const existing = existsSync(pendingPath) ? JSON.parse(readFileSync(pendingPath, 'utf8')) : { version: 1, runs: [] };
    const entry = {
      run_id: run.id,
      connector_id: run.connector_id,
      status: 'pending',
      profile_publish_status: profilePublishState(run).status,
      successful_asset_count: successfulProfileAssetIds(run).length,
      failed_asset_count: failedProfileAssetIds(run).length,
      markdown_path: mdPath,
      json_path: jsonPath,
      updated_at: nowIso(),
    };
    existing.runs = [entry, ...(existing.runs || []).filter((item) => item.run_id !== run.id)];
    writeFileSync(pendingPath, JSON.stringify(existing, null, 2));
    return {
      markdown_path: mdPath,
      json_path: jsonPath,
      devops_upload_pending: true,
      profile_publish: updateProfilePublicationQueue({
        ...run,
        artifact: {
          ...(run.artifact || {}),
          markdown_path: mdPath,
          json_path: jsonPath,
        },
      }),
    };
  } catch (err) {
    return {
      error: {
        code: 'CONNECTOR_RUN_MARKDOWN_EXPORT_ERROR',
        message: err.message,
        remediation: 'Check data/markdown/_runtime/profile-runs permissions and retry the connector/profile run.',
      },
    };
  }
}

function shouldAutoPublishProfiles() {
  const value = String(process.env.PROFILE_AUTO_PUBLISH_ON_RUN || '').toLowerCase();
  return value === 'true' || value === 'on' || value === '1';
}

function autoPublishTargets(options = {}) {
  const rawTargets = Array.isArray(options.auto_publish_targets || options.autoPublishTargets)
    ? options.auto_publish_targets || options.autoPublishTargets
    : String(options.auto_publish_targets || options.autoPublishTargets || 'devops').split(',');
  const normalized = [...new Set(rawTargets.map((target) => String(target).trim().toLowerCase()).filter(Boolean))];
  return normalized.filter((target) => ['devops', 'confluence'].includes(target));
}

function npmCommand() {
  return process.platform === 'win32' ? 'npm.cmd' : 'npm';
}

function npmCliPath() {
  if (process.env.npm_execpath) return process.env.npm_execpath;
  if (process.platform !== 'win32') return null;
  const nodeDir = path.dirname(process.execPath);
  return path.join(nodeDir, 'node_modules', 'npm', 'bin', 'npm-cli.js');
}

function runtimeBuildStatePath() {
  return path.join(process.cwd(), 'data', 'lineage-runtime-package', '.build-state.json');
}

function runtimePackageVersionPrefix(date = new Date()) {
  return `${date.getUTCFullYear()}.${date.getUTCMonth() + 1}.${date.getUTCDate()}-`;
}

function nextRuntimePackageVersion() {
  const prefix = runtimePackageVersionPrefix();
  let maxSuffix = 0;

  try {
    const buildStatePath = runtimeBuildStatePath();
    if (existsSync(buildStatePath)) {
      const buildState = JSON.parse(readFileSync(buildStatePath, 'utf8'));
      for (const candidate of [buildState.version, buildState.last_published_version]) {
        const match = String(candidate || '').match(/^(\d{4}\.\d{1,2}\.\d{1,2})-(\d+)$/);
        if (match && `${match[1]}-` === prefix) {
          maxSuffix = Math.max(maxSuffix, Number(match[2]) || 0);
        }
      }
    }
  } catch {
    // Fall back to today's first suffix if the build state is unreadable.
  }

  return `${prefix}${Math.max(1, maxSuffix + 1)}`;
}

function directScriptCommand(scriptName, args = []) {
  const passthroughArgs = args.filter((arg) => arg !== '--');
  const scriptMap = {
    'lineage:runtime:package': ['scripts/build-lineage-runtime-package.mjs'],
    'lineage:runtime:check': ['scripts/check-lineage-runtime-package.mjs'],
    'lineage:runtime:sync': ['scripts/sync-lineage-runtime-to-catalog-repo.mjs'],
    'lineage:runtime:publish': ['scripts/publish-lineage-runtime-package.mjs'],
    'confluence:export': ['scripts/build-confluence-export.mjs'],
    'confluence:check': ['scripts/check-confluence-export.mjs'],
    'confluence:publish': ['scripts/sync-confluence-catalog.mjs', '--publish'],
  };
  const entry = scriptMap[scriptName];
  if (!entry) return null;
  return {
    command: process.execPath,
    args: [path.join(process.cwd(), entry[0]), ...entry.slice(1), ...passthroughArgs],
  };
}

function runNpmScript(scriptName, args = []) {
  return new Promise((resolve) => {
    const startedAt = nowIso();
    const direct = directScriptCommand(scriptName, args);
    const npmCli = direct ? null : npmCliPath();
    const command = direct?.command || (npmCli ? process.execPath : npmCommand());
    const commandArgs = direct?.args || (npmCli ? [npmCli, 'run', scriptName, ...args] : ['run', scriptName, ...args]);
    const child = spawn(command, commandArgs, {
      cwd: process.cwd(),
      env: process.env,
      shell: false,
    });
    let stdout = '';
    let stderr = '';
    child.stdout?.on('data', (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr?.on('data', (chunk) => {
      stderr += chunk.toString();
    });
    child.on('error', (error) => {
      resolve({
        script: scriptName,
        args,
        status: 'failed',
        exit_code: 1,
        started_at: startedAt,
        completed_at: nowIso(),
        stdout,
        stderr: `${stderr}${error.message}`,
      });
    });
    child.on('close', (code) => {
      resolve({
        script: scriptName,
        args,
        status: code === 0 ? 'succeeded' : 'failed',
        exit_code: code,
        started_at: startedAt,
        completed_at: nowIso(),
        stdout: stdout.slice(-8000),
        stderr: stderr.slice(-8000),
      });
    });
  });
}

function mergeRunPublishState(run, nextState) {
  run.artifact = {
    ...(run.artifact || {}),
    devops_upload_pending: !['published', 'partial_published'].includes(nextState.status),
    profile_publish: {
      ...profilePublishState(run),
      ...nextState,
    },
  };
  updateProfilePublicationQueue(run);
}

function refreshPublishedRunArtifacts(run = {}) {
  const markdownPath = run.artifact?.markdown_path;
  const jsonPath = run.artifact?.json_path;
  if (!markdownPath || !jsonPath || !existsSync(markdownPath) || !existsSync(jsonPath)) return;

  try {
    const publish = profilePublishState(run);
    const pending = publish.pending_assets.length > 0;
    const publishedAt = publish.last_published_at || 'not yet published';
    const statusLine = `profile_publish_status: ${publish.status}`;
    const devopsPendingLine = `devops_upload_pending: ${pending ? 'true' : 'false'}`;
    const devopsSection = [
      '## DevOps Upload',
      '',
      `- Status: ${publish.status}`,
      `- Last published at: ${publishedAt}`,
      `- Pending assets: ${publish.pending_assets.length}`,
      `- Published assets: ${publish.published_asset_count}`,
      publish.last_error?.message ? `- Last error: ${publish.last_error.message}` : '- Last error: none',
      '',
    ].join('\n');

    const markdown = readFileSync(markdownPath, 'utf8')
      .replace(/profile_publish_status:\s*.*/u, statusLine)
      .replace(/devops_upload_pending:\s*.*/u, devopsPendingLine)
      .replace(/## DevOps Upload[\s\S]*$/u, devopsSection);

    writeFileSync(markdownPath, markdown, 'utf8');

    const payload = JSON.parse(readFileSync(jsonPath, 'utf8'));
    payload.devops_upload_pending = pending;
    payload.profile_publish = publish;
    writeFileSync(jsonPath, JSON.stringify(payload, null, 2));
  } catch {
    // Keep publication state updates resilient even if artifact refresh fails.
  }
}

function profileRunsEligibleForPublication(filters = {}, user = {}) {
  hydrateRuntimeStore();
  return runHistoryStore
    .filter((run) => !filters.connector_id || run.connector_id === filters.connector_id)
    .filter((run) => !filters.run_id || run.id === filters.run_id)
    .filter((run) => profilePublishState(run).successful_asset_count > 0)
    .filter((run) => {
      const status = profilePublishState(run).status;
      return filters.include_published === true || !['published', 'partial_published'].includes(status);
    })
    .filter((run) => {
      const connector = connectorStore.get(run.connector_id);
      return connector ? canUseConnector(connector, user, CONNECTOR_ACTIONS.ADMIN) : isAdmin(user);
    });
}

function publicationTargets(options = {}) {
  const rawTargets = Array.isArray(options.targets)
    ? options.targets
    : String(options.targets || 'devops,confluence').split(',');
  return [...new Set(rawTargets.map((target) => String(target).trim().toLowerCase()).filter(Boolean))]
    .filter((target) => ['devops', 'confluence'].includes(target));
}

export async function publishConnectorProfileRuns(options = {}, user = {}) {
  hydrateRuntimeStore();
  if (!isAdmin(user)) {
    const error = new Error('Only Admin users can publish profile indexes to DevOps or Confluence.');
    error.code = 'CONNECTOR_FORBIDDEN';
    error.status = 403;
    throw error;
  }
  const targets = publicationTargets(options);
  const dryRun = options.dry_run === true || options.dryRun === true || process.env.NODE_ENV === 'test';
  const eligibleRuns = profileRunsEligibleForPublication(
    {
      connector_id: options.connector_id || options.connectorId,
      run_id: options.run_id || options.runId,
      include_published: options.include_published === true || options.includePublished === true,
    },
    user
  );
  if (eligibleRuns.length === 0) {
    return {
      status: 'no_op',
      dry_run: dryRun,
      targets,
      run_count: 0,
      successful_asset_count: 0,
      message: 'No unpublished successful profile assets were found.',
      queue: readPublicationQueue(),
    };
  }

  const attemptedAt = nowIso();
  const runtimePackageVersion = targets.includes('devops') ? nextRuntimePackageVersion() : null;
  for (const run of eligibleRuns) {
    mergeRunPublishState(run, {
      status: dryRun ? 'publish_ready' : 'publishing',
      last_attempt_at: attemptedAt,
      targets,
      last_error: null,
    });
  }
  persistRuntimeStore();

  const steps = [];
  if (targets.includes('devops')) {
    const versionArgs = runtimePackageVersion ? [`--version=${runtimePackageVersion}`] : [];
    steps.push({ target: 'devops', script: 'lineage:runtime:package', args: versionArgs });
    steps.push({ target: 'devops', script: 'lineage:runtime:check', args: [] });
    steps.push({ target: 'devops', script: 'lineage:runtime:sync', args: [] });
    steps.push({
      target: 'devops',
      script: 'lineage:runtime:publish',
      args: [...versionArgs, ...(dryRun ? ['--', '--dry-run'] : [])],
    });
  }
  if (targets.includes('confluence')) {
    steps.push({ target: 'confluence', script: 'confluence:export', args: [] });
    steps.push({ target: 'confluence', script: 'confluence:check', args: [] });
    steps.push({ target: 'confluence', script: 'confluence:publish', args: dryRun ? ['--', '--dry-run'] : [] });
  }

  const results = [];
  if (dryRun && options.execute_dry_run !== true && options.executeDryRun !== true) {
    results.push(...steps.map((step) => ({
      ...step,
      status: 'planned',
      exit_code: null,
      stdout: '',
      stderr: '',
    })));
  } else {
    for (const step of steps) {
      const result = await runNpmScript(step.script, step.args);
      results.push({ target: step.target, ...result });
      if (result.status !== 'succeeded') break;
    }
  }

  const failedStep = results.find((result) => result.status === 'failed');
  const completedAt = nowIso();
  const finalStatus = failedStep
    ? 'publish_failed'
    : eligibleRuns.some((run) => failedProfileAssetIds(run).length > 0)
      ? 'partial_published'
      : 'published';
  const allPublishedAssets = eligibleRuns.flatMap((run) => successfulProfileAssetIds(run));
  for (const run of eligibleRuns) {
    const successfulAssets = successfulProfileAssetIds(run);
    const existing = profilePublishState(run);
    mergeRunPublishState(run, {
      status: dryRun ? 'publish_ready' : finalStatus,
      published_asset_count: dryRun || failedStep ? existing.published_asset_count : successfulAssets.length,
      published_assets: dryRun || failedStep ? existing.published_assets : successfulAssets,
      pending_assets: dryRun || failedStep ? successfulAssets : [],
      last_published_at: dryRun || failedStep ? null : completedAt,
      last_error: failedStep
        ? {
            script: failedStep.script,
            exit_code: failedStep.exit_code,
            message: failedStep.stderr || failedStep.stdout || 'Profile publication step failed.',
          }
        : null,
      targets,
    });
    refreshPublishedRunArtifacts(run);
  }
  persistRuntimeStore();

  return {
    status: dryRun ? 'planned' : finalStatus,
    dry_run: dryRun,
    targets,
    runtime_package_version: runtimePackageVersion,
    run_count: eligibleRuns.length,
    successful_asset_count: allPublishedAssets.length,
    failed_asset_count: eligibleRuns.flatMap((run) => failedProfileAssetIds(run)).length,
    runs: eligibleRuns.map((run) => sanitizeForPersistence({
      id: run.id,
      connector_id: run.connector_id,
      status: run.status,
      profile_publish: profilePublishState(run),
    })),
    steps: results,
    queue: readPublicationQueue(),
  };
}

export function recordPublishedConnectorProfileRuns(options = {}, user = {}) {
  hydrateRuntimeStore();
  if (!isAdmin(user)) {
    const error = new Error('Only Admin users can record profile publication state.');
    error.code = 'CONNECTOR_FORBIDDEN';
    error.status = 403;
    throw error;
  }

  const targets = publicationTargets(options);
  const eligibleRuns = profileRunsEligibleForPublication(
    {
      connector_id: options.connector_id || options.connectorId,
      run_id: options.run_id || options.runId,
      include_published: options.include_published === true || options.includePublished === true,
    },
    user
  );

  if (eligibleRuns.length === 0) {
    return {
      status: 'no_op',
      run_count: 0,
      successful_asset_count: 0,
      message: 'No unpublished successful profile assets were found.',
      queue: readPublicationQueue(),
    };
  }

  const completedAt = nowIso();
  for (const run of eligibleRuns) {
    const successfulAssets = successfulProfileAssetIds(run);
    mergeRunPublishState(run, {
      status: failedProfileAssetIds(run).length > 0 ? 'partial_published' : 'published',
      published_asset_count: successfulAssets.length,
      published_assets: successfulAssets,
      pending_assets: [],
      last_attempt_at: completedAt,
      last_published_at: completedAt,
      last_error: null,
      targets,
    });
    refreshPublishedRunArtifacts(run);
  }
  persistRuntimeStore();

  return {
    status: eligibleRuns.some((run) => failedProfileAssetIds(run).length > 0) ? 'partial_published' : 'published',
    targets,
    run_count: eligibleRuns.length,
    successful_asset_count: eligibleRuns.flatMap((run) => successfulProfileAssetIds(run)).length,
    failed_asset_count: eligibleRuns.flatMap((run) => failedProfileAssetIds(run)).length,
    runs: eligibleRuns.map((run) => sanitizeForPersistence({
      id: run.id,
      connector_id: run.connector_id,
      status: run.status,
      profile_publish: profilePublishState(run),
    })),
    queue: readPublicationQueue(),
  };
}

function maybeAutoPublishProfiles(run, user, options = {}) {
  const autoPublishRequested =
    options.auto_publish === true ||
    options.autoPublish === true ||
    shouldAutoPublishProfiles();
  if (!autoPublishRequested || profilePublishState(run).successful_asset_count <= 0) return;
  const targets = autoPublishTargets(options);
  publishConnectorProfileRuns({ run_id: run.id, targets }, user)
    .catch((err) => {
      mergeRunPublishState(run, {
        status: 'publish_failed',
        last_error: {
          code: err.code || 'PROFILE_AUTO_PUBLISH_ERROR',
          message: err.message,
        },
      });
      persistRuntimeStore();
    });
}

function connectorForPersistence(connector) {
  if (!connector) return null;
  const sanitized = sanitizeForPersistence({
    ...connector,
    config: sanitizeConfig(connector.config || {}),
    credential: undefined,
  });
  sanitized.credential = normalizeCredentialForPersistence(connector.credential || {});
  return sanitized;
}

function connectorRunForPersistence(run) {
  if (!run) return null;
  return sanitizeForPersistence({
    id: run.id,
    connector_id: run.connector_id,
    connector_type: run.connector_type,
    actor: run.actor,
    status: run.status,
    mode: run.mode,
    started_at: run.started_at,
    completed_at: run.completed_at,
    summary: run.summary,
    stream_results: run.stream_results,
    errors: run.errors,
    warnings: run.warnings,
    artifact: run.artifact,
    publication: run.publication,
    profile_publish: run.profile_publish,
  });
}

function persistRuntimeStore() {
  if (!runtimePersistenceEnabled()) return;
  try {
    const storePath = profileSchedulerStorePath();
    mkdirSync(path.dirname(storePath), { recursive: true });
    writeFileSync(
      storePath,
      JSON.stringify(
        {
          version: 1,
          saved_at: nowIso(),
          connectors: [...connectorStore.values()].map(connectorForPersistence),
          connector_runs: runHistoryStore.slice(0, PROFILE_CONNECTOR_MAX_HISTORY).map(connectorRunForPersistence),
          snapshots: [...snapshotStore.values()].map(sanitizeForPersistence),
          profile_schedules: [...profileScheduleStore.values()].map(sanitizeProfileSchedule),
          profile_schedule_runs: profileScheduleRunStore
            .slice(0, PROFILE_SCHEDULER_MAX_HISTORY)
            .map(sanitizeForPersistence),
        },
        null,
        2
      )
    );
  } catch (err) {
    profileSchedulerStatus.last_error = {
      code: 'PROFILE_SCHEDULER_STORE_WRITE_ERROR',
      message: err.message,
      remediation: 'Check PROFILE_RUNTIME_DIR permissions and available disk space.',
    };
  }
}

function hydrateRuntimeStore() {
  if (runtimeStoreHydrated || !runtimePersistenceEnabled()) return;
  runtimeStoreHydrated = true;
  const storePath = profileSchedulerStorePath();
  if (!existsSync(storePath)) return;
  try {
    const parsed = JSON.parse(readFileSync(storePath, 'utf8'));
    let migratedConnectors = false;
    for (const connector of parsed.connectors || []) {
      if (connector?.id && !connectorStore.has(connector.id)) {
        const normalizedCredential = normalizeCredentialForPersistence(connector.credential || {});
        migratedConnectors =
          migratedConnectors || JSON.stringify(normalizedCredential) !== JSON.stringify(connector.credential || {});
        connectorStore.set(connector.id, {
          ...connector,
          credential: normalizedCredential,
        });
      }
    }
    for (const run of parsed.connector_runs || []) {
      if (run?.id && !runHistoryStore.some((existing) => existing.id === run.id)) {
        if (!run.artifact?.markdown_path) run.artifact = exportConnectorRunMarkdown(run);
        runHistoryStore.push(run);
      }
    }
    for (const snapshot of parsed.snapshots || []) {
      if (snapshot?.connector_id && !snapshotStore.has(snapshot.connector_id)) {
        snapshotStore.set(snapshot.connector_id, snapshot);
      }
    }
    let migratedSchedules = false;
    for (const schedule of parsed.profile_schedules || []) {
      if (schedule?.id && !profileScheduleStore.has(schedule.id)) {
        const normalized = normalizePersistedProfileSchedule(schedule);
        migratedSchedules = migratedSchedules || JSON.stringify(normalized.options || {}) !== JSON.stringify(schedule.options || {});
        profileScheduleStore.set(schedule.id, normalized);
      }
    }
    for (const run of parsed.profile_schedule_runs || []) {
      if (run?.id && !profileScheduleRunStore.some((existing) => existing.id === run.id)) {
        profileScheduleRunStore.push(run);
      }
    }
    if (migratedSchedules || migratedConnectors) persistRuntimeStore();
  } catch (err) {
    profileSchedulerStatus.last_error = {
      code: 'PROFILE_SCHEDULER_STORE_READ_ERROR',
      message: err.message,
      remediation: 'Validate or remove the local profile scheduler store JSON file.',
    };
  }
}

function exportProfileRunArtifacts(schedule, run, startedAt, completedAt) {
  if (!runtimePersistenceEnabled()) return null;
  try {
    const runId = run?.id || randomUUID();
    const scheduleDir = path.join(profileRunArtifactDir(), schedule.id);
    mkdirSync(scheduleDir, { recursive: true });
    const safeTimestamp = completedAt.replace(/[:.]/g, '-');
    const basePath = path.join(scheduleDir, `${safeTimestamp}-${runId}`);
    const payload = sanitizeForPersistence({
      schedule: sanitizeProfileSchedule(schedule),
      run,
      started_at: startedAt,
      completed_at: completedAt,
    });
    writeFileSync(`${basePath}.json`, JSON.stringify(payload, null, 2));
    const summary = [
      `# Profile Run ${runId}`,
      '',
      `- Schedule: ${schedule.name || schedule.id}`,
      `- Connector: ${schedule.connector_id}`,
      `- Profile type: ${schedule.profile_type}`,
      `- Status: ${run?.status || 'failed'}`,
      `- Started: ${startedAt}`,
      `- Completed: ${completedAt}`,
      `- Raw data captured: ${run?.summary?.raw_data_captured === true ? 'yes' : 'no'}`,
      '',
      '## Summary',
      '',
      '```json',
      JSON.stringify(sanitizeForPersistence(run?.summary || {}), null, 2),
      '```',
    ].join('\n');
    writeFileSync(`${basePath}.md`, summary);
    return {
      json_path: `${basePath}.json`,
      markdown_path: `${basePath}.md`,
      confluence_ready: true,
    };
  } catch (err) {
    return {
      error: {
        code: 'PROFILE_RUN_ARTIFACT_WRITE_ERROR',
        message: err.message,
        remediation: 'Check PROFILE_ARTIFACT_DIR permissions and available disk space.',
      },
    };
  }
}

function recordProfileScheduleRun(entry) {
  profileScheduleRunStore.unshift(sanitizeForPersistence(entry));
  profileScheduleRunStore.splice(PROFILE_SCHEDULER_MAX_HISTORY);
}

function permissionDefaults(createdBy) {
  return {
    users: createdBy ? { [createdBy]: [CONNECTOR_ACTIONS.VIEW, CONNECTOR_ACTIONS.RUN, CONNECTOR_ACTIONS.EDIT] } : {},
    roles: {
      Admin: [
        CONNECTOR_ACTIONS.VIEW,
        CONNECTOR_ACTIONS.RUN,
        CONNECTOR_ACTIONS.EDIT,
        CONNECTOR_ACTIONS.ADMIN,
      ],
    },
    groups: {},
  };
}

function hasAction(list = [], action) {
  return list.includes(CONNECTOR_ACTIONS.ADMIN) || list.includes(action);
}

export function canUseConnector(connector, user = {}, action = CONNECTOR_ACTIONS.VIEW) {
  if (!connector || !user) return false;
  if (isAdmin(user)) return true;
  const permissions = connector.permissions || {};
  const userId = actorId(user);
  const email = user.email || '';
  const userGrants = [
    ...(permissions.users?.[userId] || []),
    ...(permissions.users?.[email] || []),
  ];
  if (hasAction(userGrants, action)) return true;
  const roleGrants = normalizeRoles(user.roles).flatMap((role) => {
    const matchedKey = Object.keys(permissions.roles || {}).find(
      (key) => key.toLowerCase() === role
    );
    return matchedKey ? permissions.roles[matchedKey] || [] : [];
  });
  if (hasAction(roleGrants, action)) return true;
  const userGroups = toArray(user.groups);
  const groupGrants = userGroups.flatMap((group) => permissions.groups?.[group] || []);
  return hasAction(groupGrants, action);
}

export function listConnectorDefinitions(filters = {}) {
  const cloud = String(filters.cloud || '').toLowerCase();
  const category = String(filters.category || '').toLowerCase();
  return Object.values(CONNECTOR_TYPES)
    .filter((definition) => !cloud || definition.cloud === cloud || definition.cloud === 'multi-cloud')
    .filter((definition) => !category || definition.category === category)
    .map((definition) => ({
      ...definition,
      wizard: {
        ...connectorWizardMetadataForType(definition.type),
        auth_modes: definition.credentialKinds.map((mode) => ({
          value: mode,
          title: mode.replace(/_/g, ' ').replace(/\b\w/g, (match) => match.toUpperCase()),
          help: AUTH_MODE_HELP[mode] || 'Use the credential pattern supported by this source.',
        })),
      },
    }));
}

export function upsertConnector(input = {}, actor = {}) {
  hydrateRuntimeStore();
  const definition = normalizeConnectorType(input.type);
  const id = input.id || `connector-${definition.type}-${randomUUID().slice(0, 8)}`;
  const existing = connectorStore.get(id);
  const createdBy = existing?.created_by || actorId(actor);
  const connector = {
    id,
    type: definition.type,
    label: input.label || input.name || existing?.label || definition.label,
    description: input.description || existing?.description || '',
    provider: definition.provider,
    category: definition.category,
    cloud: definition.cloud,
    status: input.status || existing?.status || 'active',
    config: {
      ...(existing?.config || {}),
      ...(input.config || {}),
    },
    credential: {
      ...(existing?.credential || {}),
      ...(input.credential || {}),
    },
    permissions: input.permissions || existing?.permissions || permissionDefaults(createdBy),
    schedule: input.schedule || existing?.schedule || null,
    metadata_targets: input.metadata_targets || existing?.metadata_targets || definition.metadata,
    created_by: createdBy,
    updated_by: actorId(actor),
    created_at: existing?.created_at || nowIso(),
    updated_at: nowIso(),
  };
  connectorStore.set(id, connector);
  persistRuntimeStore();
  return sanitizeConnector(connector);
}

export function listConnectors(filters = {}, user = {}) {
  hydrateRuntimeStore();
  return [...connectorStore.values()]
    .filter((connector) => !filters.type || connector.type === filters.type)
    .filter((connector) => !filters.category || connector.category === filters.category)
    .filter((connector) => !filters.cloud || connector.cloud === filters.cloud || connector.cloud === 'multi-cloud')
    .filter((connector) => canUseConnector(connector, user, filters.action || CONNECTOR_ACTIONS.VIEW))
    .map(sanitizeConnector);
}

export function getConnector(id, user = {}, action = CONNECTOR_ACTIONS.VIEW) {
  const resolved = resolveConnectorRecord(id);
  const connector = resolved.connector;
  if (!connector) return null;
  if (!canUseConnector(connector, user, action)) {
    const error = new Error(`User is not allowed to ${action} connector '${id}'.`);
    error.code = 'CONNECTOR_FORBIDDEN';
    throw error;
  }
  return sanitizeConnector({
    ...connector,
    requested_id: resolved.requested_id,
    resolved_id: resolved.resolved_id,
    alias_match: resolved.alias_match,
  });
}

export function grantConnectorPermission(id, grant = {}, actor = {}) {
  hydrateRuntimeStore();
  const connector = connectorStore.get(id);
  if (!connector) {
    throw new Error(`Connector '${id}' not found.`);
  }
  if (!isAdmin(actor) && !canUseConnector(connector, actor, CONNECTOR_ACTIONS.ADMIN)) {
    const error = new Error(`User is not allowed to administer connector '${id}'.`);
    error.code = 'CONNECTOR_FORBIDDEN';
    throw error;
  }
  const scope = grant.scope || 'users';
  const subject = grant.subject || grant.user || grant.role || grant.group;
  const actions = toArray(grant.actions || grant.action || CONNECTOR_ACTIONS.RUN);
  if (!['users', 'roles', 'groups'].includes(scope)) {
    throw new Error(`Unsupported permission scope '${scope}'.`);
  }
  if (!subject) {
    throw new Error('Permission subject is required.');
  }
  connector.permissions = {
    users: { ...(connector.permissions?.users || {}) },
    roles: { ...(connector.permissions?.roles || {}) },
    groups: { ...(connector.permissions?.groups || {}) },
  };
  connector.permissions[scope][subject] = [...new Set(actions)];
  connector.updated_at = nowIso();
  connector.updated_by = actorId(actor);
  connectorStore.set(id, connector);
  persistRuntimeStore();
  return sanitizeConnector(connector);
}

function extractPythonScripts(config = {}) {
  const files = toArray(config.files || config.paths || config.repository_files);
  return files
    .filter((file) => /\.py$/i.test(file))
    .map((file) => ({
      path: file,
      object_type: 'python_script',
      lineage_hint: /airflow|dag/i.test(file)
        ? 'pipeline_orchestration'
        : /extract|load|transform|etl|sql/i.test(file)
          ? 'etl_logic'
          : 'code_metadata',
    }));
}

function estimateHarvest(connector) {
  const definition = normalizeConnectorType(connector.type);
  const configuredTargets = toArray(connector.config?.targets || connector.metadata_targets);
  const targetCount = configuredTargets.length || definition.metadata.length;
  const base = Math.max(1, targetCount);
  const repositoryScripts =
    connector.type === CONNECTOR_TYPES.GIT_REPOSITORY.type ? extractPythonScripts(connector.config) : [];
  return {
    planned_objects: base + repositoryScripts.length,
    planned_columns: connector.category === CONNECTOR_CATEGORIES.REPOSITORY ? 0 : base * 8,
    planned_lineage_edges:
      connector.category === CONNECTOR_CATEGORIES.PIPELINE || connector.category === CONNECTOR_CATEGORIES.REPOSITORY
        ? Math.max(1, base + repositoryScripts.length)
        : Math.max(0, Math.floor(base / 2)),
    python_scripts: repositoryScripts,
  };
}

export async function runConnector(id, options = {}, user = {}) {
  hydrateRuntimeStore();
  const connector = connectorStore.get(id);
  if (!connector) {
    writeConnectorRuntimeLog({
      event: 'connector.run.missing',
      connector_id: id,
      actor: actorId(user),
    });
    throw new Error(`Connector '${id}' not found.`);
  }
  if (!canUseConnector(connector, user, CONNECTOR_ACTIONS.RUN)) {
    const error = new Error(`User is not allowed to run connector '${id}'.`);
    error.code = 'CONNECTOR_FORBIDDEN';
    writeConnectorRuntimeLog({
      event: 'connector.run.forbidden',
      connector_id: id,
      connector_type: connector.type,
      actor: actorId(user),
    });
    throw error;
  }
  const started = nowIso();
  const definition = normalizeConnectorType(connector.type);
  writeConnectorRuntimeLog({
    event: 'connector.run.started',
    connector_id: id,
    connector_type: connector.type,
    actor: actorId(user),
    dry_run: options.dry_run !== false,
    server: connector.config?.server || null,
    database: connector.config?.database || null,
    credential_mode: sanitizeCredential(connector.credential).mode,
  });
  let extraction;
  try {
    extraction = await withConnectorRunTimeout(
      executeConnectorExtraction({ connector, definition, options }),
      CONNECTOR_RUN_TIMEOUT_MS,
      {
        connector_id: id,
        connector_type: connector.type,
        phase: 'execute_connector_extraction',
      }
    );
  } catch (err) {
    writeConnectorRuntimeLog({
      event: err?.code === 'CONNECTOR_RUN_TIMEOUT' ? 'connector.run.timed_out' : 'connector.run.crashed',
      connector_id: id,
      connector_type: connector.type,
      actor: actorId(user),
      message: err?.message || 'Unknown connector extraction crash',
      code: err?.code || null,
      details: err?.details || null,
      stack: err?.stack || null,
    });
    throw err;
  }
  const estimate = estimateHarvest(connector);
  const dryRun = options.dry_run !== false;
  const run = {
    id: randomUUID(),
    connector_id: id,
    connector_type: connector.type,
    actor: actorId(user),
    status: extraction.status,
    mode: dryRun ? 'dry_run' : 'metadata_harvest',
    started_at: started,
    completed_at: nowIso(),
    summary: {
      ...(dryRun
        ? {
            planned_objects: estimate.planned_objects,
            planned_columns: estimate.planned_columns,
            planned_lineage_edges: estimate.planned_lineage_edges,
            discovered_objects: 0,
            discovered_columns: 0,
            discovered_lineage_edges: 0,
            dry_run_only: true,
            source_contacted: false,
          }
        : {
            discovered_objects: extraction.summary.object_count ?? estimate.planned_objects,
            discovered_columns: extraction.summary.column_count ?? estimate.planned_columns,
            discovered_lineage_edges: extraction.summary.lineage_edge_count ?? estimate.planned_lineage_edges,
            dry_run_only: false,
            source_contacted: true,
          }),
      ...extraction.summary,
      connection_status: extraction.connection_check?.status || (extraction.status === 'failed' ? 'failed' : 'unknown'),
      live_connection_valid: extraction.connection_check?.live_connection_valid === true,
      metadata_discovery_valid:
        extraction.connection_check?.metadata_discovery_valid !== false,
      connection_details: sanitizeForPersistence(extraction.connection_check?.details || {}),
      credential_mode: sanitizeCredential(connector.credential).mode,
      secret_exposed: false,
      raw_data_captured: false,
    },
    extraction,
    stream_results: extraction.stream_results,
    errors: extraction.errors,
    warnings: [
      ...(dryRun ? ['Dry run only: no external source was contacted and no raw data was captured.'] : []),
      ...extraction.events
        .filter((event) => event.type === 'extraction.warning')
        .map((event) => event.attributes?.message)
        .filter(Boolean),
    ],
  };
  run.artifact = exportConnectorRunMarkdown(run);
  writeConnectorRuntimeLog({
    event: 'connector.run.completed',
    connector_id: id,
    connector_type: connector.type,
    actor: actorId(user),
    status: run.status,
    discovered_objects: run.summary?.discovered_objects ?? 0,
    live_connection_valid: run.summary?.live_connection_valid === true,
    metadata_discovery_valid: run.summary?.metadata_discovery_valid !== false,
    connection_status: run.summary?.connection_status || 'unknown',
    errors: (run.errors || []).slice(0, 5).map((error) => ({
      code: error?.code || null,
      message: error?.message || null,
      phase: error?.phase || null,
    })),
  });
  runHistoryStore.unshift(run);
  runHistoryStore.splice(PROFILE_CONNECTOR_MAX_HISTORY);
  if (!dryRun || connector.type === CONNECTOR_TYPES.GIT_REPOSITORY.type) {
    snapshotStore.set(id, {
      connector_id: id,
      run_id: run.id,
      captured_at: run.completed_at,
      object_count: dryRun ? estimate.planned_objects : extraction.summary.object_count ?? estimate.planned_objects,
      column_count: dryRun ? estimate.planned_columns : extraction.summary.column_count ?? estimate.planned_columns,
      lineage_edge_count: dryRun ? estimate.planned_lineage_edges : extraction.summary.lineage_edge_count ?? estimate.planned_lineage_edges,
      canonical_summary: extraction.summary,
      stream_results: extraction.stream_results,
      python_scripts: estimate.python_scripts,
    });
  }
  persistRuntimeStore();
  return run;
}

export async function testConnector(id, options = {}, user = {}) {
  const resolved = resolveConnectorRecord(id);
  const connector = resolved.connector;
  if (!connector) {
    throw new Error(`Connector '${id}' not found.`);
  }
  if (!canUseConnector(connector, user, CONNECTOR_ACTIONS.RUN)) {
    const error = new Error(`User is not allowed to test connector '${id}'.`);
    error.code = 'CONNECTOR_FORBIDDEN';
    throw error;
  }
  const definition = normalizeConnectorType(connector.type);
  writeConnectorRuntimeLog({
    event: 'connector.test.started',
    connector_id: connector.id,
    requested_connector_id: id,
    alias_match: resolved.alias_match,
    connector_type: connector.type,
    actor: actorId(user),
    server: connector.config?.server || connector.config?.host || null,
    database: connector.config?.database || connector.config?.catalogDatabase || null,
    credential_mode: sanitizeCredential(connector.credential).mode,
  });
  const timeoutMs = connectorTestTimeoutMs(connector, options);
  let test;
  try {
    test = await withConnectorRunTimeout(
      executeConnectorTest({ connector, definition, options }),
      timeoutMs,
      {
        connector_id: connector.id,
        connector_type: connector.type,
        phase: 'connection_validation',
      }
    );
  } catch (err) {
    const remediationPacket = connectorRuntimeAuthRemediationPacket(connector, id, err);
    test = {
      status: 'failed',
      connector_id: connector.id,
      requested_connector_id: id,
      alias_match: resolved.alias_match,
      connector_type: connector.type,
      tested_at: nowIso(),
      elapsed_ms: timeoutMs,
      phase: err.details?.phase || 'connection_validation',
      captures_raw_data: false,
      secret_exposed: false,
      diagnostics: {
        success: false,
        connector_id: connector.id,
        requested_connector_id: id,
        alias_match: resolved.alias_match,
        connector_type: connector.type,
        phase: err.details?.phase || 'connection_validation',
        server: connector.config?.server || connector.config?.host || null,
        database: connector.config?.database || connector.config?.catalogDatabase || null,
        elapsed_ms: timeoutMs,
        connection_status: 'failed',
        live_connection_valid: false,
        metadata_discovery_valid: false,
        actionable_error: {
          code: err.code || 'CONNECTOR_TEST_FAILED',
          message: err.message,
          remediation:
            err.remediation ||
            'Verify the saved connector endpoint, driver, network path, authentication mode, and timeout settings.',
          details: err.details || null,
          remediation_packet: remediationPacket,
        },
        remediation_packet: remediationPacket,
      },
      errors: [
        {
          code: err.code || 'CONNECTOR_TEST_FAILED',
          message: err.message,
          phase: err.details?.phase || 'connection_validation',
          status: err.status || 500,
          remediation:
            err.remediation ||
            'Verify the saved connector endpoint, driver, network path, authentication mode, and timeout settings.',
          details: err.details || null,
          remediation_packet: remediationPacket,
        },
      ],
    };
  }
  const testError = test.errors?.[0] || test.diagnostics?.actionable_error || test.diagnostics?.error || {};
  const remediationPacket =
    test.status === 'failed' ? connectorRuntimeAuthRemediationPacket(connector, id, testError) : null;
  if (remediationPacket) {
    test.diagnostics = {
      ...(test.diagnostics || {}),
      remediation_packet: remediationPacket,
      actionable_error: {
        ...(test.diagnostics?.actionable_error || {}),
        remediation_packet: remediationPacket,
      },
    };
    test.errors = (test.errors || []).map((error) => ({
      ...error,
      remediation_packet: remediationPacket,
    }));
  }
  const summary = {
    test_only: true,
    source_contacted: true,
    dry_run_only: false,
    connection_status: test.diagnostics?.connection_status || test.status,
    live_connection_valid: test.diagnostics?.live_connection_valid === true,
    metadata_discovery_valid: test.diagnostics?.metadata_discovery_valid !== false,
    connection_details: sanitizeForPersistence(test.diagnostics?.details || {}),
    credential_mode: sanitizeCredential(connector.credential).mode,
    elapsed_ms: test.elapsed_ms,
    server: test.diagnostics?.server || null,
    database: test.diagnostics?.database || null,
    login: test.diagnostics?.login || null,
    phase: test.phase,
    connector_id: connector.id,
    requested_connector_id: id,
    resolved_connector_id: connector.id,
    alias_match: resolved.alias_match,
    connector_type: connector.type,
    secret_exposed: false,
    raw_data_captured: false,
  };
  const result = {
    id: `connector-test-${randomUUID().slice(0, 12)}`,
    connector_id: connector.id,
    requested_connector_id: id,
    resolved_connector_id: connector.id,
    alias_match: resolved.alias_match,
    connector_type: connector.type,
    actor: actorId(user),
    status: test.status,
    mode: 'connection_test',
    started_at: test.tested_at,
    completed_at: nowIso(),
    summary,
    diagnostics: sanitizeForPersistence(test.diagnostics || {}),
    errors: test.errors || [],
    warnings: (test.diagnostics?.warnings || [])
      .map((warning) => warning?.attributes?.message || warning?.message || warning?.name || String(warning))
      .filter(Boolean),
  };
  writeConnectorRuntimeLog({
    event: 'connector.test.completed',
    connector_id: connector.id,
    requested_connector_id: id,
    alias_match: resolved.alias_match,
    connector_type: connector.type,
    actor: actorId(user),
    status: result.status,
    elapsed_ms: result.summary.elapsed_ms,
    live_connection_valid: result.summary.live_connection_valid,
    metadata_discovery_valid: result.summary.metadata_discovery_valid,
    error: result.errors?.[0]?.message || null,
  });
  return result;
}

export async function diagnoseConnectorConnection(id, options = {}, user = {}) {
  const resolved = resolveConnectorRecord(id);
  const connector = resolved.connector;
  if (!connector) {
    throw new Error(`Connector '${id}' not found.`);
  }
  if (!canUseConnector(connector, user, CONNECTOR_ACTIONS.RUN)) {
    const error = new Error(`User is not allowed to diagnose connector '${id}'.`);
    error.code = 'CONNECTOR_FORBIDDEN';
    throw error;
  }
  if (!['sql_server', 'ssis'].includes(connector.type)) {
    const error = new Error(`Connector diagnostics are not supported for connector type '${connector.type}'.`);
    error.code = 'CONNECTOR_DIAGNOSTIC_UNSUPPORTED';
    error.status = 400;
    throw error;
  }

  writeConnectorRuntimeLog({
    event: 'connector.diagnostic.started',
    connector_id: connector.id,
    requested_connector_id: id,
    alias_match: resolved.alias_match,
    connector_type: connector.type,
    actor: actorId(user),
  });
  const diagnostic = await diagnoseSqlServerConnectionVariants(connector, {
    variantTimeoutMs: Math.min(Number(options.variantTimeoutMs || options.timeout_ms || 3000), 10000),
    drivers: options.drivers,
    stopOnSuccess: options.stopOnSuccess !== false,
  });
  const result = sanitizeForPersistence({
    connector_id: connector.id,
    requested_connector_id: id,
    resolved_connector_id: connector.id,
    alias_match: resolved.alias_match,
    connector_type: connector.type,
    status: diagnostic.status,
    diagnostic,
  });
  writeConnectorRuntimeLog({
    event: 'connector.diagnostic.completed',
    connector_id: connector.id,
    requested_connector_id: id,
    connector_type: connector.type,
    actor: actorId(user),
    status: result.status,
    variant_count: result.diagnostic?.results?.length || 0,
  });
  return result;
}

export async function planConnector(id, options = {}, user = {}) {
  hydrateRuntimeStore();
  const connector = connectorStore.get(id);
  if (!connector) {
    throw new Error(`Connector '${id}' not found.`);
  }
  if (!canUseConnector(connector, user, CONNECTOR_ACTIONS.VIEW)) {
    const error = new Error(`User is not allowed to view connector '${id}'.`);
    error.code = 'CONNECTOR_FORBIDDEN';
    throw error;
  }
  const definition = normalizeConnectorType(connector.type);
  return planConnectorExtraction({ connector, definition, options });
}

export async function planConnectorProfiling(id, options = {}, user = {}) {
  hydrateRuntimeStore();
  const connector = connectorStore.get(id);
  if (!connector) {
    throw new Error(`Connector '${id}' not found.`);
  }
  if (!canUseConnector(connector, user, CONNECTOR_ACTIONS.VIEW)) {
    const error = new Error(`User is not allowed to view connector '${id}'.`);
    error.code = 'CONNECTOR_FORBIDDEN';
    throw error;
  }
  const definition = normalizeConnectorType(connector.type);
  return planConnectorProfile({ connector, definition, options });
}

export async function runConnectorProfiling(id, options = {}, user = {}) {
  hydrateRuntimeStore();
  const connector = connectorStore.get(id);
  if (!connector) {
    throw new Error(`Connector '${id}' not found.`);
  }
  if (!canUseConnector(connector, user, CONNECTOR_ACTIONS.RUN)) {
    const error = new Error(`User is not allowed to run connector '${id}'.`);
    error.code = 'CONNECTOR_FORBIDDEN';
    throw error;
  }
  const requestedMode = options.execution_mode || options.executionMode || options.safety?.execution_mode;
  if (requestedMode === 'live' && !isAdmin(user)) {
    const error = new Error(`Live profiling requires Admin permission on connector '${id}'.`);
    error.code = 'CONNECTOR_FORBIDDEN';
    error.status = 403;
    throw error;
  }
  const definition = normalizeConnectorType(connector.type);
  const profile = await executeConnectorProfile({ connector, definition, options });
  const run = {
    id: randomUUID(),
    connector_id: id,
    connector_type: connector.type,
    actor: actorId(user),
    status: profile.status,
    mode: requestedMode || profile.run?.safety?.execution_mode || 'dry_run',
    started_at: profile.run?.started_at || profile.executed_at,
    completed_at: profile.run?.completed_at || profile.executed_at,
    summary: {
      ...(profile.run?.summary || {}),
      secret_exposed: false,
      raw_data_captured: false,
      profile_run: true,
    },
    profile,
    errors: profile.errors || [],
    warnings: profile.run?.warnings || [],
  };
  run.artifact = exportConnectorRunMarkdown(run);
  runHistoryStore.unshift(run);
  runHistoryStore.splice(PROFILE_CONNECTOR_MAX_HISTORY);
  persistRuntimeStore();
  maybeAutoPublishProfiles(run, user);
  return run;
}

export async function planConnectorBiProfiling(id, options = {}, user = {}) {
  hydrateRuntimeStore();
  const connector = connectorStore.get(id);
  if (!connector) {
    throw new Error(`Connector '${id}' not found.`);
  }
  if (!canUseConnector(connector, user, CONNECTOR_ACTIONS.VIEW)) {
    const error = new Error(`User is not allowed to view connector '${id}'.`);
    error.code = 'CONNECTOR_FORBIDDEN';
    throw error;
  }
  const definition = normalizeConnectorType(connector.type);
  return planConnectorBiProfile({ connector, definition, options });
}

export async function runConnectorBiProfiling(id, options = {}, user = {}) {
  hydrateRuntimeStore();
  const connector = connectorStore.get(id);
  if (!connector) {
    throw new Error(`Connector '${id}' not found.`);
  }
  if (!canUseConnector(connector, user, CONNECTOR_ACTIONS.RUN)) {
    const error = new Error(`User is not allowed to run connector '${id}'.`);
    error.code = 'CONNECTOR_FORBIDDEN';
    throw error;
  }
  const started = nowIso();
  const definition = normalizeConnectorType(connector.type);
  const profileResult = await executeConnectorBiProfile({ connector, definition, options });
  const run = {
    id: randomUUID(),
    connector_id: id,
    connector_type: connector.type,
    actor: actorId(user),
    status: profileResult.status,
    mode: options.dry_run === false ? 'bi_metadata_profile' : 'bi_profile_dry_run',
    started_at: started,
    completed_at: nowIso(),
    summary: {
      ...(profileResult.profile?.summary || {}),
      secret_exposed: false,
      raw_data_captured: false,
      raw_report_data_captured: false,
      profile_run: true,
      bi_profile_run: true,
    },
    profile: profileResult,
    errors: profileResult.errors || [],
    warnings: [
      ...(options.dry_run === false ? [] : ['Dry run only: no external source was contacted and no report result rows were captured.']),
      ...((profileResult.warnings || []).map((warning) => warning.attributes?.message || warning.name).filter(Boolean)),
    ],
  };
  run.artifact = exportConnectorRunMarkdown(run);
  runHistoryStore.unshift(run);
  runHistoryStore.splice(PROFILE_CONNECTOR_MAX_HISTORY);
  snapshotStore.set(id, {
    ...(snapshotStore.get(id) || {}),
    connector_id: id,
    run_id: run.id,
    captured_at: run.completed_at,
    bi_profile_summary: profileResult.profile?.summary || null,
    bi_profile_coverage_score: profileResult.profile?.coverage_score || 0,
    bi_artifact_count: profileResult.profile?.inventory?.length || 0,
    bi_lineage_edge_count: profileResult.profile?.lineage_edges?.length || 0,
  });
  persistRuntimeStore();
  maybeAutoPublishProfiles(run, user);
  return run;
}

export async function planConnectorMetadataProfiling(id, options = {}, user = {}) {
  hydrateRuntimeStore();
  const connector = connectorStore.get(id);
  if (!connector) {
    throw new Error(`Connector '${id}' not found.`);
  }
  if (!canUseConnector(connector, user, CONNECTOR_ACTIONS.VIEW)) {
    const error = new Error(`User is not allowed to view connector '${id}'.`);
    error.code = 'CONNECTOR_FORBIDDEN';
    throw error;
  }
  const definition = normalizeConnectorType(connector.type);
  return planConnectorMetadataProfile({ connector, definition, options });
}

export async function runConnectorMetadataProfiling(id, options = {}, user = {}) {
  hydrateRuntimeStore();
  const connector = connectorStore.get(id);
  if (!connector) {
    throw new Error(`Connector '${id}' not found.`);
  }
  if (!canUseConnector(connector, user, CONNECTOR_ACTIONS.RUN)) {
    const error = new Error(`User is not allowed to run connector '${id}'.`);
    error.code = 'CONNECTOR_FORBIDDEN';
    throw error;
  }
  const started = nowIso();
  const definition = normalizeConnectorType(connector.type);
  const profileResult = await executeConnectorMetadataProfile({ connector, definition, options });
  const run = {
    id: randomUUID(),
    connector_id: id,
    connector_type: connector.type,
    actor: actorId(user),
    status: profileResult.status,
    mode: options.dry_run === false ? 'connector_metadata_profile' : 'metadata_profile_dry_run',
    started_at: started,
    completed_at: nowIso(),
    summary: {
      ...(profileResult.profile?.summary || {}),
      secret_exposed: false,
      raw_data_captured: false,
      raw_payload_values_captured: false,
      profile_run: true,
      metadata_profile_run: true,
    },
    profile: profileResult,
    errors: profileResult.errors || [],
    warnings: [
      ...(options.dry_run === false ? [] : ['Dry run only: no external source was contacted and no raw source payload values were captured.']),
      ...((profileResult.warnings || []).map((warning) => warning.attributes?.message || warning.name).filter(Boolean)),
    ],
  };
  run.artifact = exportConnectorRunMarkdown(run);
  runHistoryStore.unshift(run);
  runHistoryStore.splice(PROFILE_CONNECTOR_MAX_HISTORY);
  snapshotStore.set(id, {
    ...(snapshotStore.get(id) || {}),
    connector_id: id,
    run_id: run.id,
    captured_at: run.completed_at,
    metadata_profile_summary: profileResult.profile?.summary || null,
    metadata_profile_coverage_score: profileResult.profile?.coverage_score || 0,
    metadata_inventory_count: profileResult.profile?.inventory?.length || 0,
    metadata_lineage_edge_count: profileResult.profile?.lineage_edges?.length || 0,
  });
  persistRuntimeStore();
  maybeAutoPublishProfiles(run, user);
  return run;
}

function inferProfileScheduleType(connector, requestedType = 'auto') {
  const definition = normalizeConnectorType(connector.type);
  const type = String(requestedType || 'auto').toLowerCase();
  if (!PROFILE_SCHEDULE_TYPES.has(type)) {
    const error = new Error(`Unsupported profile schedule type '${requestedType}'.`);
    error.code = 'CONNECTOR_CONFIG_ERROR';
    error.status = 400;
    error.remediation = 'Use one of: auto, aggregate, bi, metadata.';
    throw error;
  }
  if (type !== 'auto') return type;
  if ([CONNECTOR_CATEGORIES.DATABASE, CONNECTOR_CATEGORIES.WAREHOUSE].includes(definition.category)) return 'aggregate';
  if (definition.category === CONNECTOR_CATEGORIES.BI) return 'bi';
  return 'metadata';
}

function normalizeQueueState(queueState = {}) {
  return {
    timeout_penalties: typeof queueState.timeout_penalties === 'object' && queueState.timeout_penalties
      ? { ...queueState.timeout_penalties }
      : {},
    live_successes: typeof queueState.live_successes === 'object' && queueState.live_successes
      ? { ...queueState.live_successes }
      : {},
  };
}

function normalizeAssetQueueKey(value = '') {
  return String(value || '').trim().toLowerCase().replace(/[\[\]`"]/g, '').replace(/^([^.,]+),\d+\./, '$1.');
}

function timeoutLikeError(error = {}) {
  const text = `${error.code || ''} ${error.message || ''} ${error.remediation || ''}`.toLowerCase();
  return /timeout|timed out|requesttimeout|statement_timeout|lock timeout|econnreset/.test(text);
}

function updateQueueStateFromRun(queueState = {}, run = {}) {
  const next = normalizeQueueState(queueState);
  const actionAssetIds = [...new Set((run?.profile?.plan?.actions || []).map((action) => action?.asset_id).filter(Boolean))];
  const errorByAsset = new Map((run?.errors || []).map((error) => [normalizeAssetQueueKey(error?.asset_id), error]));
  const completedAt = run?.completed_at || nowIso();

  for (const assetId of actionAssetIds) {
    const key = normalizeAssetQueueKey(assetId);
    if (!key) continue;
    const error = errorByAsset.get(key);
    if (error && timeoutLikeError(error)) {
      const previous = next.timeout_penalties[key] || { count: 0 };
      next.timeout_penalties[key] = {
        count: Number(previous.count || 0) + 1,
        last_timed_out_at: completedAt,
      };
      continue;
    }
    if (!error) {
      next.live_successes[key] = completedAt;
      delete next.timeout_penalties[key];
    }
  }

  return next;
}

async function runConnectorProfileByType(connectorId, profileType, options, user) {
  if (profileType === 'aggregate') {
    const executionMode =
      options.execution_mode ||
      options.executionMode ||
      (options.dry_run === false ? 'live' : 'dry_run');
    return runConnectorProfiling(
      connectorId,
      {
        ...options,
        execution_mode: executionMode,
      },
      user
    );
  }
  if (profileType === 'bi') return runConnectorBiProfiling(connectorId, options, user);
  return runConnectorMetadataProfiling(connectorId, options, user);
}

async function planConnectorProfileByType(connectorId, profileType, options, user) {
  if (profileType === 'aggregate') {
    const executionMode =
      options.execution_mode ||
      options.executionMode ||
      (options.dry_run === false ? 'live' : 'dry_run');
    return planConnectorProfiling(
      connectorId,
      {
        ...options,
        execution_mode: executionMode,
      },
      user
    );
  }
  if (profileType === 'bi') return planConnectorBiProfiling(connectorId, options, user);
  return planConnectorMetadataProfiling(connectorId, options, user);
}

export function upsertConnectorProfileSchedule(input = {}, actor = {}) {
  hydrateRuntimeStore();
  const existing = input.id ? profileScheduleStore.get(input.id) : null;
  const connectorId = input.connector_id || input.connectorId || existing?.connector_id;
  const connector = connectorStore.get(connectorId);
  if (!connector) {
    throw new Error(`Connector '${connectorId || ''}' not found.`);
  }
  if (!isAdmin(actor) && !canUseConnector(connector, actor, CONNECTOR_ACTIONS.ADMIN)) {
    const error = new Error(`User is not allowed to schedule connector '${connectorId}'.`);
    error.code = 'CONNECTOR_FORBIDDEN';
    throw error;
  }
  const id = input.id || `profile-schedule-${randomUUID().slice(0, 8)}`;
  const now = nowIso();
  const intervalMinutes = normalizeScheduleInterval(input);
  const requestedStatus = String(input.status || '').toUpperCase();
  assertProfileScheduleNotDryRun(input.options || {});
  const validationWarnings = Array.isArray(existing?.validation_warnings) ? [...existing.validation_warnings] : [];
  const schedule = {
    id,
    connector_id: connectorId,
    connector_type: connector.type,
    name: input.name || existing?.name || `${connector.label || connector.id} profile schedule`,
    profile_type: inferProfileScheduleType(connector, input.profile_type || input.profileType || existing?.profile_type || 'auto'),
    status: PROFILE_SCHEDULE_STATUSES.has(requestedStatus) ? requestedStatus : existing?.status || 'ACTIVE',
    cadence: input.cadence || input.frequency || existing?.cadence || 'daily',
    interval_minutes: intervalMinutes,
    timezone: input.timezone || existing?.timezone || 'UTC',
    start_at: input.start_at || input.startAt || existing?.start_at || now,
    next_run_at: input.next_run_at || input.nextRunAt || existing?.next_run_at || null,
    max_failures: Number(input.max_failures || input.maxFailures || existing?.max_failures || 3),
    options: normalizeScheduleRuntimeOptions(
      {
        ...(existing?.options || {}),
        ...(input.options || {}),
      },
      validationWarnings
    ),
    validation_warnings: validationWarnings.length ? validationWarnings : undefined,
    created_by: existing?.created_by || actorId(actor),
    updated_by: actorId(actor),
    created_at: existing?.created_at || now,
    updated_at: now,
    last_run_at: existing?.last_run_at || null,
    last_status: existing?.last_status || null,
    last_run_id: existing?.last_run_id || null,
    run_count: existing?.run_count || 0,
    failure_count: existing?.failure_count || 0,
    last_error: existing?.last_error || null,
  };
  if (schedule.profile_type === 'aggregate') {
    schedule.options.max_live_tables = Math.max(1, Number(schedule.options.max_live_tables || 15));
    schedule.options.live_profile_stale_days = Math.max(1, Number(schedule.options.live_profile_stale_days || 30));
    schedule.options.execution_mode = 'live';
  }
  schedule.next_run_at = schedule.next_run_at || computeNextRunAt(schedule, new Date(schedule.start_at));
  profileScheduleStore.set(id, schedule);
  persistRuntimeStore();
  return sanitizeProfileSchedule(schedule);
}

export function listConnectorProfileSchedules(filters = {}, user = {}) {
  hydrateRuntimeStore();
  return [...profileScheduleStore.values()]
    .filter((schedule) => !filters.connector_id || schedule.connector_id === filters.connector_id)
    .filter((schedule) => !filters.status || schedule.status === filters.status)
    .filter((schedule) => {
      const connector = connectorStore.get(schedule.connector_id);
      return connector ? canUseConnector(connector, user, CONNECTOR_ACTIONS.VIEW) : isAdmin(user);
    })
    .map(sanitizeProfileSchedule);
}

export function getConnectorProfileSchedule(id, user = {}) {
  hydrateRuntimeStore();
  const schedule = profileScheduleStore.get(id);
  if (!schedule) return null;
  const connector = connectorStore.get(schedule.connector_id);
  if (connector && !canUseConnector(connector, user, CONNECTOR_ACTIONS.VIEW)) {
    const error = new Error(`User is not allowed to view profile schedule '${id}'.`);
    error.code = 'CONNECTOR_FORBIDDEN';
    throw error;
  }
  return sanitizeProfileSchedule(schedule);
}

export function deleteConnectorProfileSchedule(id, actor = {}) {
  hydrateRuntimeStore();
  const schedule = profileScheduleStore.get(id);
  if (!schedule) return false;
  const connector = connectorStore.get(schedule.connector_id);
  if (connector && !isAdmin(actor) && !canUseConnector(connector, actor, CONNECTOR_ACTIONS.ADMIN)) {
    const error = new Error(`User is not allowed to delete profile schedule '${id}'.`);
    error.code = 'CONNECTOR_FORBIDDEN';
    throw error;
  }
  const deleted = profileScheduleStore.delete(id);
  persistRuntimeStore();
  return deleted;
}

export async function runConnectorProfileSchedule(id, actor = {}) {
  hydrateRuntimeStore();
  const schedule = profileScheduleStore.get(id);
  if (!schedule) {
    throw new Error(`Profile schedule '${id}' not found.`);
  }
  if (schedule.status !== 'ACTIVE') {
    const error = new Error(`Profile schedule '${id}' is not active.`);
    error.code = 'CONNECTOR_CONFIG_ERROR';
    error.status = 400;
    error.remediation = 'Activate the schedule before running it.';
    throw error;
  }
  const connector = connectorStore.get(schedule.connector_id);
  if (!connector) {
    throw new Error(`Connector '${schedule.connector_id}' not found.`);
  }
  const runnerUser = isAdmin(actor) ? actor : RUNTIME_USER;
  const startedAt = nowIso();
  try {
    const queueState = normalizeQueueState(schedule.options?.queue_state || schedule.options?.queueState || {});
    const effectiveOptions = {
      ...schedule.options,
      dry_run: false,
      max_live_tables: Math.max(1, Number(schedule.options?.max_live_tables || 15)),
      live_profile_stale_days: Math.max(1, Number(schedule.options?.live_profile_stale_days || 30)),
      execution_mode: schedule.profile_type === 'aggregate' ? 'live' : schedule.options?.execution_mode || 'live',
      queue_state: queueState,
    };
    const run = await runConnectorProfileByType(schedule.connector_id, schedule.profile_type, effectiveOptions, runnerUser);
    const completedAt = nowIso();
    const succeeded = !['failed', 'partial_failure'].includes(run.status);
    const nextQueueState = updateQueueStateFromRun(queueState, run);
    const updated = {
      ...schedule,
      last_run_at: completedAt,
      last_status: run.status,
      last_run_id: run.id,
      run_count: schedule.run_count + 1,
      failure_count: succeeded ? 0 : schedule.failure_count + 1,
      last_error: run.errors?.[0] || null,
      next_run_at: computeNextRunAt(schedule, new Date(completedAt)),
      updated_at: completedAt,
      options: sanitizeProfileOptions({
        ...(schedule.options || {}),
        ...effectiveOptions,
        queue_state: nextQueueState,
      }),
    };
    if (updated.failure_count >= updated.max_failures) updated.status = 'PAUSED';
    profileScheduleStore.set(id, updated);
    const artifact = exportProfileRunArtifacts(updated, run, startedAt, completedAt);
    recordProfileScheduleRun({
      id: `profile-schedule-run-${randomUUID().slice(0, 12)}`,
      schedule_id: id,
      connector_id: updated.connector_id,
      connector_type: updated.connector_type,
      profile_type: updated.profile_type,
      run_id: run.id,
      status: run.status,
      started_at: startedAt,
      completed_at: completedAt,
      artifact,
      summary: run.summary || {},
      error: run.errors?.[0] || null,
    });
    persistRuntimeStore();
    maybeAutoPublishProfiles(run, runnerUser, updated.options || {});
    return {
      schedule: sanitizeProfileSchedule(updated),
      run,
      artifact,
      started_at: startedAt,
      completed_at: completedAt,
    };
  } catch (err) {
    const completedAt = nowIso();
    const updated = {
      ...schedule,
      last_run_at: completedAt,
      last_status: 'failed',
      run_count: schedule.run_count + 1,
      failure_count: schedule.failure_count + 1,
      last_error: {
        code: err.code || 'PROFILE_SCHEDULE_RUN_ERROR',
        message: err.message,
        remediation: err.remediation || 'Review connector permissions, profile type, schedule options, and source availability.',
      },
      next_run_at: computeNextRunAt(schedule, new Date(completedAt)),
      updated_at: completedAt,
    };
    if (updated.failure_count >= updated.max_failures) updated.status = 'PAUSED';
    profileScheduleStore.set(id, updated);
    recordProfileScheduleRun({
      id: `profile-schedule-run-${randomUUID().slice(0, 12)}`,
      schedule_id: id,
      connector_id: updated.connector_id,
      connector_type: updated.connector_type,
      profile_type: updated.profile_type,
      run_id: null,
      status: 'failed',
      started_at: startedAt,
      completed_at: completedAt,
      artifact: null,
      summary: {},
      error: updated.last_error,
    });
    persistRuntimeStore();
    throw err;
  }
}

export async function runDueConnectorProfileSchedules(options = {}, actor = {}) {
  hydrateRuntimeStore();
  const now = options.now ? new Date(options.now) : new Date();
  const due = [...profileScheduleStore.values()]
    .filter((schedule) => schedule.status === 'ACTIVE')
    .filter((schedule) => !schedule.next_run_at || new Date(schedule.next_run_at) <= now)
    .slice(0, Number(options.limit || 25));
  const results = [];
  for (const schedule of due) {
    try {
      const result = await runConnectorProfileSchedule(schedule.id, actor);
      const status = ['failed', 'partial_failure'].includes(result.run?.status) ? 'failed' : 'succeeded';
      results.push({ schedule_id: schedule.id, status, result });
    } catch (err) {
      results.push({
        schedule_id: schedule.id,
        status: 'failed',
        error: {
          code: err.code || 'PROFILE_SCHEDULE_RUN_ERROR',
          message: err.message,
          remediation: err.remediation || 'Review profile schedule configuration and connector state.',
        },
      });
    }
  }
  return {
    ran_at: now.toISOString(),
    due_count: due.length,
    results,
  };
}

export function listConnectorProfileScheduleRuns(scheduleId, user = {}, filters = {}) {
  hydrateRuntimeStore();
  const schedule = profileScheduleStore.get(scheduleId);
  if (!schedule) return [];
  const connector = connectorStore.get(schedule.connector_id);
  if (connector && !canUseConnector(connector, user, CONNECTOR_ACTIONS.VIEW)) {
    const error = new Error(`User is not allowed to view profile schedule '${scheduleId}'.`);
    error.code = 'CONNECTOR_FORBIDDEN';
    throw error;
  }
  return profileScheduleRunStore
    .filter((run) => run.schedule_id === scheduleId)
    .slice(0, Number(filters.limit || 50));
}

function queuePreviewObjectType(asset = {}) {
  return String(asset?.object_type || asset?.type || '').toLowerCase();
}

function queuePreviewAssetId(asset = {}) {
  return asset?.id || asset?.object_id || asset?.qualified_name || asset?.qualifiedName || asset?.name || '';
}

function queuePreviewObjectName(asset = {}) {
  return asset?.name || asset?.object_name || queuePreviewAssetId(asset);
}

function queuePreviewSchema(asset = {}) {
  return asset?.schema || asset?.schema_name || asset?.owner_schema || 'dbo';
}

function queuePreviewNormalizeObjectId(value = '') {
  return String(value || '').replace(/[\[\]`"]/g, '').trim().toLowerCase();
}

function queuePreviewStripServerPort(value = '') {
  return String(value || '').replace(/^([^.,]+),\d+\./, '$1.').trim();
}

function queuePreviewTimeoutPenalty(asset = {}, queueState = {}) {
  const penalties = queueState.timeout_penalties || {};
  const keys = [
    queuePreviewAssetId(asset),
    asset?.object_id,
    asset?.qualified_name,
    asset?.qualifiedName,
    queuePreviewStripServerPort(queuePreviewAssetId(asset)),
  ].map(queuePreviewNormalizeObjectId);
  for (const key of keys) {
    if (key && penalties[key]) return Number(penalties[key].count || 0) || 0;
  }
  return 0;
}

export async function getConnectorProfileScheduleQueuePreview(scheduleId, user = {}, filters = {}) {
  hydrateRuntimeStore();
  const schedule = profileScheduleStore.get(scheduleId);
  if (!schedule) return null;
  const connector = connectorStore.get(schedule.connector_id);
  if (connector && !canUseConnector(connector, user, CONNECTOR_ACTIONS.VIEW)) {
    const error = new Error(`User is not allowed to view profile schedule '${scheduleId}'.`);
    error.code = 'CONNECTOR_FORBIDDEN';
    throw error;
  }

  const queueState = normalizeQueueState(schedule.options?.queue_state || schedule.options?.queueState || {});
  const effectiveOptions = {
    ...schedule.options,
    dry_run: false,
    max_live_tables: Math.max(1, Number(schedule.options?.max_live_tables || 15)),
    live_profile_stale_days: Math.max(1, Number(schedule.options?.live_profile_stale_days || 30)),
    execution_mode: schedule.profile_type === 'aggregate' ? 'live' : schedule.options?.execution_mode || 'live',
    queue_state: queueState,
  };
  const latestConnectorRun = runHistoryStore.find((run) =>
    run.connector_id === schedule.connector_id &&
    run.profile?.plan?.coverage &&
    ['live', 'metadata_harvest', 'dry_run'].includes(String(run.mode || '').toLowerCase())
  );
  let plan = latestConnectorRun?.profile?.plan || null;
  if (!plan || filters.refresh === true || filters.refresh === 'true') {
    const planResult = await planConnectorProfileByType(schedule.connector_id, schedule.profile_type, effectiveOptions, user);
    plan = planResult?.profile?.plan || planResult?.plan || planResult;
  }
  const historicalQueue = plan?.coverage?.live_upgrade_queue || [];
  const queue = historicalQueue.filter((item) => item && item.asset_id);
  const coverageAssets = Array.isArray(plan?.coverage?.assets) ? plan.coverage.assets : [];
  const liveCapableAssets = coverageAssets.filter((asset) =>
    ['table', 'view'].includes(queuePreviewObjectType(asset))
  );
  const actionAssets = [...new Set((plan?.actions || []).map((action) => action.asset_id).filter(Boolean))];
  const liveEligibleIds = new Set(queue.map((item) => queuePreviewNormalizeObjectId(item.asset_id)));
  const freshSkippedAssets = liveCapableAssets
    .filter((asset) => !liveEligibleIds.has(queuePreviewNormalizeObjectId(queuePreviewAssetId(asset))))
    .map((asset) => ({
      asset_id: queuePreviewAssetId(asset),
      object_name: queuePreviewObjectName(asset),
      object_type: queuePreviewObjectType(asset) || 'unknown',
      schema: queuePreviewSchema(asset),
      estimated_rows: Number(asset?.estimated_rows ?? asset?.estimatedRows ?? asset?.row_count ?? asset?.rowCount ?? 0) || 0,
      column_count: Array.isArray(asset?.columns) ? asset.columns.length : 0,
      skip_reason: 'fresh_within_window',
    }));
  const timeoutPenaltyAssets = queue
    .map((asset) => ({
      ...asset,
      timeout_penalty_count: queuePreviewTimeoutPenalty(asset, queueState),
    }))
    .filter((asset) => asset.timeout_penalty_count > 0)
    .sort((left, right) => right.timeout_penalty_count - left.timeout_penalty_count);
  const limit = Math.max(1, Number(filters.limit || 25));
  const desiredBatch = Math.max(1, Number(effectiveOptions.max_live_tables || 15));
  const queueByAssetId = new Map(queue.map((item) => [item.asset_id, item]));
  const nextAssets = actionAssets.length >= desiredBatch
    ? actionAssets
      .slice(0, Math.min(limit, desiredBatch))
      .map((assetId, index) => queueByAssetId.get(assetId) || {
        asset_id: assetId,
        object_name: assetId.split('.').slice(-1)[0] || assetId,
        object_type: 'unknown',
        schema: assetId.split('.').slice(-2, -1)[0] || 'dbo',
        queue_rank: index + 1,
      })
    : queue.slice(0, Math.min(limit, desiredBatch));
  const recentRuns = profileScheduleRunStore
    .filter((run) => run.schedule_id === scheduleId)
    .slice(0, Number(filters.history_limit || 10))
    .map((run) => ({
      id: run.id,
      run_id: run.run_id,
      status: run.status,
      completed_at: run.completed_at,
      queue_status: run.summary?.coverage_queue_status || null,
      error: run.error || null,
    }));

  return {
    schedule: sanitizeProfileSchedule(schedule),
    queue_status: {
      ...(plan?.coverage?.queue_status || {}),
      live_capable_assets: Math.max(
        liveCapableAssets.length,
        Number(plan?.coverage?.queue_status?.live_eligible_assets || 0) + freshSkippedAssets.length
      ),
      fresh_skipped_assets: freshSkippedAssets.length,
      timeout_penalty_assets: Object.keys(queueState.timeout_penalties || {}).length,
    },
    queue_options: {
      coverage_mode: effectiveOptions.coverage_mode || 'all_objects',
      live_priority: effectiveOptions.live_priority || 'most_used_first',
      max_live_tables: effectiveOptions.max_live_tables,
      live_profile_stale_days: effectiveOptions.live_profile_stale_days,
      execution_mode: effectiveOptions.execution_mode,
    },
    next_assets: nextAssets,
    queued_assets: queue.slice(0, limit),
    fresh_skipped_assets: freshSkippedAssets.slice(0, limit),
    timeout_penalty_assets: timeoutPenaltyAssets.slice(0, limit),
    recent_runs: recentRuns,
  };
}

export function getProfileSchedulerStatus() {
  hydrateRuntimeStore();
  return {
    ...profileSchedulerStatus,
    persistence_enabled: runtimePersistenceEnabled(),
    store_path: runtimePersistenceEnabled() ? profileSchedulerStorePath() : null,
    artifact_dir: runtimePersistenceEnabled() ? profileRunArtifactDir() : null,
    schedule_count: profileScheduleStore.size,
    history_count: profileScheduleRunStore.length,
  };
}

export function startProfileSchedulerWorker(options = {}) {
  const explicitEnabled = String(process.env.PROFILE_SCHEDULER_ENABLED || '').toLowerCase();
  const enabled =
    options.enabled === true ||
    explicitEnabled === 'true' ||
    explicitEnabled === 'on' ||
    (explicitEnabled !== 'false' && explicitEnabled !== 'off' && process.env.NODE_ENV !== 'test');
  const intervalMs = Math.max(
    5_000,
    Number(options.interval_ms || options.intervalMs || process.env.PROFILE_SCHEDULER_INTERVAL_MS || PROFILE_SCHEDULER_DEFAULT_INTERVAL_MS)
  );
  profileSchedulerStatus = {
    ...profileSchedulerStatus,
    enabled,
    interval_ms: intervalMs,
  };
  if (!enabled || profileSchedulerTimer) return getProfileSchedulerStatus();
  hydrateRuntimeStore();
  profileSchedulerStatus.running = true;
  profileSchedulerStatus.started_at = nowIso();
  profileSchedulerTimer = setInterval(async () => {
    try {
      profileSchedulerStatus.last_tick_at = nowIso();
      profileSchedulerStatus.last_result = await runDueConnectorProfileSchedules(
        { limit: Number(process.env.PROFILE_SCHEDULER_TICK_LIMIT || 25) },
        RUNTIME_USER
      );
      profileSchedulerStatus.last_error = null;
    } catch (err) {
      profileSchedulerStatus.last_error = {
        code: err.code || 'PROFILE_SCHEDULER_WORKER_ERROR',
        message: err.message,
        remediation: err.remediation || 'Review scheduler store, connector configuration, and profile options.',
      };
    }
  }, intervalMs);
  if (typeof profileSchedulerTimer.unref === 'function') profileSchedulerTimer.unref();
  return getProfileSchedulerStatus();
}

export function stopProfileSchedulerWorker() {
  if (profileSchedulerTimer) clearInterval(profileSchedulerTimer);
  profileSchedulerTimer = null;
  profileSchedulerStatus = {
    ...profileSchedulerStatus,
    running: false,
    enabled: false,
  };
  return getProfileSchedulerStatus();
}

export async function runConnectorExtractionForConfig({
  id,
  type,
  label,
  config = {},
  credential = {},
  options = {},
}) {
  const definition = normalizeConnectorType(type);
  const connector = {
    id: id || `transient-${definition.type}`,
    type: definition.type,
    label: label || definition.label,
    provider: definition.provider,
    category: definition.category,
    cloud: definition.cloud,
    config,
    credential,
    metadata_targets: definition.metadata,
  };
  return executeConnectorExtraction({ connector, definition, options });
}

export function getConnectorAdapterCoverage() {
  return buildAdapterCoverage(Object.values(CONNECTOR_TYPES));
}

export function listConnectorRuns(filters = {}, user = {}) {
  hydrateRuntimeStore();
  const runs = runHistoryStore
    .filter((run) => !filters.connector_id || run.connector_id === filters.connector_id)
    .filter((run) => {
      const connector = connectorStore.get(run.connector_id);
      return connector ? canUseConnector(connector, user, CONNECTOR_ACTIONS.VIEW) : isAdmin(user);
    })
    .slice(0, Number(filters.limit || 100));
  let backfilled = false;
  for (const run of runs) {
    if (!run.artifact?.markdown_path) {
      run.artifact = exportConnectorRunMarkdown(run);
      backfilled = true;
    } else if (!run.artifact?.profile_publish && profilePublishState(run).successful_asset_count > 0) {
      run.artifact = {
        ...(run.artifact || {}),
        profile_publish: updateProfilePublicationQueue(run),
      };
      backfilled = true;
    }
  }
  if (backfilled) persistRuntimeStore();
  return runs.map(sanitizeForPersistence);
}

export function getConnectorSnapshot(id, user = {}) {
  hydrateRuntimeStore();
  const connector = connectorStore.get(id);
  if (!connector) return null;
  if (!canUseConnector(connector, user, CONNECTOR_ACTIONS.VIEW)) {
    const error = new Error(`User is not allowed to view connector '${id}'.`);
    error.code = 'CONNECTOR_FORBIDDEN';
    throw error;
  }
  return snapshotStore.get(id) || {
    connector_id: id,
    captured_at: null,
    object_count: 0,
    column_count: 0,
    lineage_edge_count: 0,
    python_scripts: [],
  };
}

export function deleteConnector(id, actor = {}) {
  hydrateRuntimeStore();
  const connector = connectorStore.get(id);
  if (!connector) return false;
  if (!isAdmin(actor) && !canUseConnector(connector, actor, CONNECTOR_ACTIONS.ADMIN)) {
    const error = new Error(`User is not allowed to delete connector '${id}'.`);
    error.code = 'CONNECTOR_FORBIDDEN';
    throw error;
  }
  connectorStore.delete(id);
  snapshotStore.delete(id);
  for (const [scheduleId, schedule] of profileScheduleStore.entries()) {
    if (schedule.connector_id === id) profileScheduleStore.delete(scheduleId);
  }
  persistRuntimeStore();
  return true;
}

export function resetConnectorStore() {
  stopProfileSchedulerWorker();
  connectorStore.clear();
  runHistoryStore.length = 0;
  snapshotStore.clear();
  profileScheduleStore.clear();
  profileScheduleRunStore.length = 0;
  runtimeStoreHydrated = false;
}

export default {
  CONNECTOR_ACTIONS,
  CONNECTOR_CATEGORIES,
  CONNECTOR_TYPES,
  canUseConnector,
  deleteConnector,
  diagnoseConnectorConnection,
  deleteConnectorProfileSchedule,
  getProfileSchedulerStatus,
  getConnector,
  getConnectorProfileSchedule,
  getConnectorProfileScheduleQueuePreview,
  getConnectorSnapshot,
  grantConnectorPermission,
  getConnectorAdapterCoverage,
  listConnectorDefinitions,
  listConnectorProfileSchedules,
  listConnectorProfileScheduleRuns,
  listConnectorRuns,
  listConnectors,
  planConnector,
  planConnectorBiProfiling,
  planConnectorMetadataProfiling,
  planConnectorProfiling,
  resetConnectorStore,
  runConnectorBiProfiling,
  runConnectorExtractionForConfig,
  runConnectorMetadataProfiling,
  runConnectorProfiling,
  runConnectorProfileSchedule,
  runDueConnectorProfileSchedules,
  testConnector,
  runConnector,
  recordPublishedConnectorProfileRuns,
  publishConnectorProfileRuns,
  startProfileSchedulerWorker,
  stopProfileSchedulerWorker,
  upsertConnectorProfileSchedule,
  upsertConnector,
};
