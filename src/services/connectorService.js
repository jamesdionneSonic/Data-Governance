/**
 * Managed metadata connector registry.
 * Stores connector configuration and permissioned execution metadata without exposing secrets.
 */

import { randomUUID } from 'crypto';
import {
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
  planConnectorBiProfile,
  planConnectorMetadataProfile,
  planConnectorProfile,
  planConnectorExtraction,
} from './connectorRuntime/extractionKernel.js';

const SENSITIVE_FIELD_PATTERN = /password|secret|token|key|credential|clientSecret|privateKey/i;

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
  return {
    mode: credential.mode || credential.kind || 'secret_reference',
    secret_ref: credential.secret_ref || credential.secretRef || null,
    vault: credential.vault || credential.vault_name || null,
    status: credential.secret_ref || credential.secretRef ? 'stored_reference' : 'configured',
    fields: Object.keys(credential).filter((key) => !['secret_ref', 'secretRef', 'vault'].includes(key)),
  };
}

function sanitizeConnector(connector) {
  if (!connector) return null;
  return {
    ...connector,
    config: sanitizeConfig(connector.config),
    credential: sanitizeCredential(connector.credential),
  };
}

function sanitizeProfileOptions(options = {}) {
  const sanitized = sanitizeConfig(options || {});
  delete sanitized.metadata_payload;
  delete sanitized.metadataPayload;
  delete sanitized.mockMetadata;
  return sanitized;
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

function connectorForPersistence(connector) {
  if (!connector) return null;
  const credential = sanitizeCredential(connector.credential || {});
  return sanitizeForPersistence({
    ...connector,
    config: sanitizeConfig(connector.config || {}),
    credential: {
      ...credential,
      secret_ref: credential.secret_ref ? 'stored_reference' : null,
    },
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
          connector_runs: runHistoryStore.slice(0, PROFILE_CONNECTOR_MAX_HISTORY).map(sanitizeForPersistence),
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
    for (const connector of parsed.connectors || []) {
      if (connector?.id && !connectorStore.has(connector.id)) connectorStore.set(connector.id, connector);
    }
    for (const run of parsed.connector_runs || []) {
      if (run?.id && !runHistoryStore.some((existing) => existing.id === run.id)) runHistoryStore.push(run);
    }
    for (const snapshot of parsed.snapshots || []) {
      if (snapshot?.connector_id && !snapshotStore.has(snapshot.connector_id)) {
        snapshotStore.set(snapshot.connector_id, snapshot);
      }
    }
    for (const schedule of parsed.profile_schedules || []) {
      if (schedule?.id && !profileScheduleStore.has(schedule.id)) profileScheduleStore.set(schedule.id, schedule);
    }
    for (const run of parsed.profile_schedule_runs || []) {
      if (run?.id && !profileScheduleRunStore.some((existing) => existing.id === run.id)) {
        profileScheduleRunStore.push(run);
      }
    }
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
    .map((definition) => ({ ...definition }));
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
  hydrateRuntimeStore();
  const connector = connectorStore.get(id);
  if (!connector) return null;
  if (!canUseConnector(connector, user, action)) {
    const error = new Error(`User is not allowed to ${action} connector '${id}'.`);
    error.code = 'CONNECTOR_FORBIDDEN';
    throw error;
  }
  return sanitizeConnector(connector);
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
    discovered_objects: base + repositoryScripts.length,
    discovered_columns: connector.category === CONNECTOR_CATEGORIES.REPOSITORY ? 0 : base * 8,
    discovered_lineage_edges:
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
    throw new Error(`Connector '${id}' not found.`);
  }
  if (!canUseConnector(connector, user, CONNECTOR_ACTIONS.RUN)) {
    const error = new Error(`User is not allowed to run connector '${id}'.`);
    error.code = 'CONNECTOR_FORBIDDEN';
    throw error;
  }
  const started = nowIso();
  const definition = normalizeConnectorType(connector.type);
  const extraction = await executeConnectorExtraction({ connector, definition, options });
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
      ...estimate,
      ...extraction.summary,
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
  runHistoryStore.unshift(run);
  runHistoryStore.splice(PROFILE_CONNECTOR_MAX_HISTORY);
  snapshotStore.set(id, {
    connector_id: id,
    run_id: run.id,
    captured_at: run.completed_at,
    object_count: estimate.discovered_objects,
    column_count: estimate.discovered_columns,
    lineage_edge_count: estimate.discovered_lineage_edges,
    canonical_summary: extraction.summary,
    stream_results: extraction.stream_results,
    python_scripts: estimate.python_scripts,
  });
  persistRuntimeStore();
  return run;
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
  runHistoryStore.unshift(run);
  runHistoryStore.splice(PROFILE_CONNECTOR_MAX_HISTORY);
  persistRuntimeStore();
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

async function runConnectorProfileByType(connectorId, profileType, options, user) {
  if (profileType === 'aggregate') return runConnectorProfiling(connectorId, options, user);
  if (profileType === 'bi') return runConnectorBiProfiling(connectorId, options, user);
  return runConnectorMetadataProfiling(connectorId, options, user);
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
    options: sanitizeProfileOptions({
      dry_run: true,
      fail_fast: false,
      ...(existing?.options || {}),
      ...(input.options || {}),
    }),
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
    const run = await runConnectorProfileByType(schedule.connector_id, schedule.profile_type, schedule.options, runnerUser);
    const completedAt = nowIso();
    const succeeded = !['failed', 'partial_failure'].includes(run.status);
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
  return runHistoryStore
    .filter((run) => !filters.connector_id || run.connector_id === filters.connector_id)
    .filter((run) => {
      const connector = connectorStore.get(run.connector_id);
      return connector ? canUseConnector(connector, user, CONNECTOR_ACTIONS.VIEW) : isAdmin(user);
    })
    .slice(0, Number(filters.limit || 100));
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
  deleteConnectorProfileSchedule,
  getProfileSchedulerStatus,
  getConnector,
  getConnectorProfileSchedule,
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
  runConnector,
  startProfileSchedulerWorker,
  stopProfileSchedulerWorker,
  upsertConnectorProfileSchedule,
  upsertConnector,
};
