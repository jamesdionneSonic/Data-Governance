import { ConnectorRuntimeError } from './connectorErrors.js';
import { profileFromAggregateRow } from '../profilingExecutionService.js';

const DATABASE_CONNECTORS = new Set([
  'sql_server',
  'postgresql',
  'snowflake',
  'bigquery',
  'databricks',
  'aws_redshift',
]);

function credentialValue(connector, ...keys) {
  for (const key of keys) {
    const value = connector.credential?.[key] ?? connector.config?.[key];
    if (value !== undefined && value !== null && value !== '') return value;
  }
  return null;
}

function endpoint(connector, ...keys) {
  return credentialValue(connector, ...keys);
}

function profileError(connector, action, message, remediation, details = {}) {
  return new ConnectorRuntimeError(message, {
    connector_id: connector.id,
    connector_type: connector.type,
    phase: 'profile_execution',
    remediation,
    details: {
      dialect: action.query?.dialect,
      asset_id: action.asset_id,
      ...details,
    },
  });
}

export function supportsConnectorLiveProfiling(connector = {}) {
  return DATABASE_CONNECTORS.has(connector.type);
}

export function createProfileExecutor({ connector, options = {} }) {
  if (!supportsConnectorLiveProfiling(connector)) {
    return null;
  }
  return {
    async runProfileAction(action) {
      if (options.mockProfileRows || connector.config?.mockProfileRows) {
        const rows = options.mockProfileRows || connector.config.mockProfileRows;
        const row = Array.isArray(rows) ? rows.shift() || rows[0] || {} : rows[action.asset_id] || rows.default || rows;
        return profileFromAggregateRow(action, row);
      }
      if (connector.config?.profile_endpoint || options.profile_endpoint) {
        return runProfileEndpoint({ connector, action, options });
      }
      if (connector.type === 'sql_server') return runSqlServerProfile({ connector, action });
      if (connector.type === 'postgresql') return runPostgresProfile({ connector, action });
      if (connector.type === 'snowflake') return runSnowflakeProfile({ connector, action });
      if (connector.type === 'bigquery') return runBigQueryProfile({ connector, action });
      if (connector.type === 'databricks') return runDatabricksProfile({ connector, action });
      if (connector.type === 'aws_redshift') return runRedshiftProfile({ connector, action });
      return null;
    },
  };
}

async function runSqlServerProfile({ connector, action }) {
  let sql;
  try {
    const sqlModule = await import('mssql');
    sql = sqlModule.default || sqlModule;
  } catch {
    throw profileError(
      connector,
      action,
      'SQL Server live profiling requires the mssql package.',
      'Install/enable mssql and configure read-only SQL Server credentials.'
    );
  }
  const config = {
    server: connector.config.server || connector.config.host,
    port: connector.config.port,
    database: connector.config.database,
    user: credentialValue(connector, 'username', 'user'),
    password: credentialValue(connector, 'password'),
    options: {
      encrypt: connector.config.encrypt !== false,
      trustServerCertificate: connector.config.trustServerCertificate !== false,
      readOnlyIntent: true,
      ...(connector.config.options || {}),
    },
    requestTimeout: action.query.timeout_ms,
    connectionTimeout: connector.config.connectionTimeout || action.query.timeout_ms,
    pool: { max: 1, min: 0, idleTimeoutMillis: 5000 },
  };
  const pool = new sql.ConnectionPool(config);
  await pool.connect();
  try {
    const request = pool.request();
    request.timeout = action.query.timeout_ms;
    const result = await request.query(action.query.sql);
    return profileFromAggregateRow(action, result.recordset?.[0] || {});
  } finally {
    await pool.close().catch(() => {});
  }
}

async function runPostgresProfile({ connector, action }) {
  let pg;
  try {
    pg = await import('pg');
  } catch {
    throw profileError(
      connector,
      action,
      'PostgreSQL live profiling requires the pg package.',
      'Install pg or configure profile_endpoint to execute approved aggregate profile SQL.'
    );
  }
  const { Client } = pg.default || pg;
  const client = new Client({
    host: connector.config.host,
    port: connector.config.port || 5432,
    database: connector.config.database,
    user: credentialValue(connector, 'username', 'user'),
    password: credentialValue(connector, 'password'),
    ssl: connector.config.ssl || undefined,
    statement_timeout: action.query.timeout_ms,
    query_timeout: action.query.timeout_ms,
  });
  await client.connect();
  try {
    const result = await client.query(action.query.sql);
    return profileFromAggregateRow(action, result.rows?.[0] || {});
  } finally {
    await client.end().catch(() => {});
  }
}

async function runSnowflakeProfile({ connector, action }) {
  let snowflake;
  try {
    const snowflakeModule = await import('snowflake-sdk');
    snowflake = snowflakeModule.default || snowflakeModule;
  } catch {
    throw profileError(
      connector,
      action,
      'Snowflake live profiling requires the snowflake-sdk package.',
      'Install snowflake-sdk or configure profile_endpoint to execute approved aggregate profile SQL.'
    );
  }
  const connection = snowflake.createConnection({
    account: connector.config.account,
    username: credentialValue(connector, 'username', 'user'),
    password: credentialValue(connector, 'password'),
    warehouse: connector.config.warehouse,
    database: connector.config.database,
    schema: connector.config.schema,
    role: connector.config.role,
  });
  await new Promise((resolve, reject) => connection.connect((err) => (err ? reject(err) : resolve())));
  try {
    const rows = await new Promise((resolve, reject) => {
      connection.execute({
        sqlText: action.query.sql,
        complete: (err, _statement, resultRows) => (err ? reject(err) : resolve(resultRows || [])),
      });
    });
    return profileFromAggregateRow(action, rows[0] || {});
  } finally {
    connection.destroy(() => {});
  }
}

async function runBigQueryProfile({ connector, action }) {
  const token = credentialValue(connector, 'access_token', 'token', 'bearer_token');
  const projectId = connector.config.project_id || connector.config.projectId || action.database;
  if (!token || !projectId) {
    throw profileError(
      connector,
      action,
      'BigQuery live profiling requires an access token and project_id.',
      'Resolve service-account/workload-identity credentials and configure project_id before running live profiling.'
    );
  }
  const url = `https://bigquery.googleapis.com/bigquery/v2/projects/${encodeURIComponent(projectId)}/queries`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: action.query.sql,
      useLegacySql: false,
      timeoutMs: action.query.timeout_ms,
      maximumBytesBilled: connector.config.maximumBytesBilled || connector.config.maximum_bytes_billed,
    }),
  });
  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw profileError(
      connector,
      action,
      `BigQuery live profiling returned HTTP ${response.status}.`,
      'Check service-account permissions, project_id, dataset access, job timeout, and maximum bytes billed.',
      { status: response.status, error: json.error?.message || null }
    );
  }
  const row = Object.fromEntries(
    (json.schema?.fields || []).map((field, index) => [field.name, json.rows?.[0]?.f?.[index]?.v])
  );
  return profileFromAggregateRow(action, row);
}

async function runDatabricksProfile({ connector, action }) {
  const baseUrl = endpoint(connector, 'workspace_url', 'server_url', 'base_url');
  const token = credentialValue(connector, 'access_token', 'token', 'pat');
  const warehouseId = connector.config.warehouse_id || connector.config.sql_warehouse_id;
  if (!baseUrl || !token || !warehouseId) {
    throw profileError(
      connector,
      action,
      'Databricks live profiling requires workspace_url, token, and warehouse_id.',
      'Configure a read-only SQL warehouse connector with workspace_url, token/PAT, and warehouse_id.'
    );
  }
  const response = await fetch(`${String(baseUrl).replace(/\/+$/, '')}/api/2.0/sql/statements`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      warehouse_id: warehouseId,
      statement: action.query.sql,
      wait_timeout: `${Math.max(5, Math.ceil(action.query.timeout_ms / 1000))}s`,
      disposition: 'INLINE',
    }),
  });
  const json = await response.json().catch(() => ({}));
  if (!response.ok || json.status?.state === 'FAILED') {
    throw profileError(
      connector,
      action,
      `Databricks live profiling failed${response.ok ? '' : ` with HTTP ${response.status}`}.`,
      'Check SQL warehouse permissions, token scope, catalog/schema access, and statement timeout.',
      { status: response.status, error: json.status?.error?.message || json.message || null }
    );
  }
  const columns = json.manifest?.schema?.columns || [];
  const values = json.result?.data_array?.[0] || [];
  return profileFromAggregateRow(action, Object.fromEntries(columns.map((column, index) => [column.name, values[index]])));
}

async function runRedshiftProfile({ connector, action }) {
  const endpointUrl = endpoint(connector, 'profile_endpoint', 'redshift_data_endpoint');
  if (!endpointUrl) {
    throw profileError(
      connector,
      action,
      'Redshift live profiling requires a Redshift Data API profile_endpoint in this framework.',
      'Configure a signed Redshift Data API sidecar/profile_endpoint, or add AWS SDK v3 Redshift Data execution support.'
    );
  }
  return runProfileEndpoint({ connector, action, options: { profile_endpoint: endpointUrl } });
}

async function runProfileEndpoint({ connector, action, options = {} }) {
  const url = options.profile_endpoint || connector.config.profile_endpoint;
  const token = credentialValue(connector, 'access_token', 'token', 'bearer_token', 'api_key');
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      connector_id: connector.id,
      connector_type: connector.type,
      dialect: action.query?.dialect,
      asset_id: action.asset_id,
      sql: action.query?.sql,
      timeout_ms: action.query?.timeout_ms,
      raw_values_retained: false,
    }),
  });
  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw profileError(
      connector,
      action,
      `Profile endpoint returned HTTP ${response.status}.`,
      'Check profile endpoint health, connector authorization, source permissions, and timeout settings.',
      { status: response.status, endpoint: safeEndpoint(url), error: json.message || json.error || null }
    );
  }
  return json.profile || profileFromAggregateRow(action, json.row || json.rows?.[0] || json);
}

function safeEndpoint(value) {
  try {
    const parsed = new URL(value);
    return parsed.origin + parsed.pathname;
  } catch {
    return String(value || '');
  }
}

export default {
  createProfileExecutor,
  supportsConnectorLiveProfiling,
};
