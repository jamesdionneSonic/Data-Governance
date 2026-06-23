import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { ConnectorRuntimeError } from './connectorErrors.js';
import { profileFromAggregateRow } from '../profilingExecutionService.js';
import {
  buildSqlServerConnectionConfig,
  loadSqlServerDriver,
  sqlServerCredentialMode,
  sqlServerConnectionRuntimeError,
} from './sqlServerConnection.js';
import { connectorConfigValue, connectorCredentialValue } from './runtimeValues.js';

const execFileAsync = promisify(execFile);

const DATABASE_CONNECTORS = new Set([
  'sql_server',
  'postgresql',
  'snowflake',
  'bigquery',
  'databricks',
  'aws_redshift',
]);

function credentialValue(connector, ...keys) {
  const resolvedCredential = connectorCredentialValue(connector, ...keys);
  if (resolvedCredential) return resolvedCredential;
  const resolvedConfig = connectorConfigValue(connector, ...keys);
  if (resolvedConfig) return resolvedConfig;
  for (const key of keys) {
    const value = connector.credential?.[key] ?? connector.config?.[key];
    if (value !== undefined && value !== null && value !== '') return value;
  }
  return null;
}

function endpoint(connector, ...keys) {
  return credentialValue(connector, ...keys);
}

function connectionStrategy(connector = {}, options = {}) {
  return String(
    options.connection_strategy ||
      options.connectionStrategy ||
      connector.config?.connection_strategy ||
      connector.config?.connectionStrategy ||
      ''
  )
    .trim()
    .toLowerCase();
}

function usesSqlcmdWindowsAuth(connector = {}, options = {}) {
  return ['sqlcmd_windows_auth', 'sqlcmd', 'sqlcmd_windows_integrated'].includes(
    connectionStrategy(connector, options)
  );
}

function sqlcmdServer(connector = {}) {
  const server =
    connector.config?.server ||
    connector.config?.host ||
    connector.config?.data_source ||
    connector.config?.dataSource;
  const port = connector.config?.port;
  if (port && !String(server || '').includes(',')) return `${server},${port}`;
  return server;
}

function sqlcmdDatabase(connector = {}) {
  return connector.config?.database || connector.config?.catalog;
}

function sqlcmdJson(output = '') {
  const body = String(output || '')
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter((line) => {
      const value = line.trim();
      return (
        value &&
        !/^JSON_/i.test(value) &&
        !/^-+$/.test(value) &&
        !/^\(\d+ rows affected\)$/i.test(value)
      );
    })
    .join('');
  return body ? JSON.parse(body) : null;
}

function splitSqlStatements(sql = '') {
  return String(sql || '')
    .split(';')
    .map((statement) => statement.trim())
    .filter(Boolean);
}

function sqlcmdProfileSql(sql = '') {
  const statements = splitSqlStatements(sql);
  const selectIndex = [...statements]
    .reverse()
    .findIndex((statement) => /^select\b/i.test(statement));
  if (selectIndex < 0) return sql;
  const actualIndex = statements.length - 1 - selectIndex;
  const preamble = statements
    .slice(0, actualIndex)
    .map((statement) => `${statement};`)
    .join('\n');
  const select = statements[actualIndex].replace(/;+\s*$/, '');
  return [
    'SET NOCOUNT ON;',
    preamble,
    `SELECT * FROM (${select}) AS profile_row FOR JSON PATH, WITHOUT_ARRAY_WRAPPER;`,
  ]
    .filter(Boolean)
    .join('\n');
}

async function runSqlcmdJsonQuery({ connector, action, sql }) {
  const server = sqlcmdServer(connector);
  const database = sqlcmdDatabase(connector) || action.database;
  if (!server || !database) {
    throw profileError(
      connector,
      action,
      'SQL Server sqlcmd profiling requires connector server and database configuration.',
      'Set connector config.server and config.database before running live SQL Server profiles through sqlcmd.'
    );
  }
  const { stdout } = await execFileAsync(
    connector.config?.sqlcmd_path || connector.config?.sqlcmdPath || 'sqlcmd',
    ['-S', server, '-E', '-C', '-d', database, '-w', '65535', '-y', '0', '-Q', sql],
    {
      windowsHide: true,
      maxBuffer: Number(
        connector.config?.sqlcmd_max_buffer ||
          connector.config?.sqlcmdMaxBuffer ||
          128 * 1024 * 1024
      ),
      timeout: Number(
        action.query?.timeout_ms ||
          connector.config?.sqlcmd_timeout_ms ||
          connector.config?.sqlcmdTimeoutMs ||
          120000
      ),
    }
  );
  return sqlcmdJson(stdout) || {};
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
        const row = Array.isArray(rows)
          ? rows.shift() || rows[0] || {}
          : rows[action.asset_id] || rows.default || rows;
        return profileFromAggregateRow(action, row);
      }
      if (connector.config?.profile_endpoint || options.profile_endpoint) {
        return runProfileEndpoint({ connector, action, options });
      }
      if (connector.type === 'sql_server')
        return runSqlServerProfile({ connector, action, options });
      if (connector.type === 'postgresql') return runPostgresProfile({ connector, action });
      if (connector.type === 'snowflake') return runSnowflakeProfile({ connector, action });
      if (connector.type === 'bigquery') return runBigQueryProfile({ connector, action });
      if (connector.type === 'databricks') return runDatabricksProfile({ connector, action });
      if (connector.type === 'aws_redshift') return runRedshiftProfile({ connector, action });
      return null;
    },
  };
}

async function runSqlServerProfile({ connector, action, options = {} }) {
  if (usesSqlcmdWindowsAuth(connector, options)) {
    try {
      const row = await runSqlcmdJsonQuery({
        connector,
        action,
        sql: sqlcmdProfileSql(action.query.sql),
      });
      return profileFromAggregateRow(action, row);
    } catch (err) {
      if (err instanceof ConnectorRuntimeError) throw err;
      throw profileError(
        connector,
        action,
        `SQL Server sqlcmd live profiling failed: ${err.message}`,
        'Verify sqlcmd is installed, the Windows user has read access, the table exists, and the generated aggregate SQL is valid.',
        { connection_strategy: 'sqlcmd_windows_auth', original_error: err.message }
      );
    }
  }
  const credentialMode = sqlServerCredentialMode(connector);
  let sql;
  try {
    sql = await loadSqlServerDriver(credentialMode);
  } catch {
    throw profileError(
      connector,
      action,
      credentialMode === 'windows_integrated'
        ? 'SQL Server Windows Integrated profiling requires mssql/msnodesqlv8 on a Windows host.'
        : 'SQL Server live profiling requires the mssql package.',
      credentialMode === 'windows_integrated'
        ? 'Run the app on Windows as the intended user and install/enable msnodesqlv8. For hosted execution, use a service account connector.'
        : 'Install/enable mssql and configure read-only SQL Server credentials.'
    );
  }
  const { config } = buildSqlServerConnectionConfig(connector, action.query.timeout_ms);
  const pool = new sql.ConnectionPool(config);
  try {
    await pool.connect();
  } catch (err) {
    throw sqlServerConnectionRuntimeError(err, connector, 'profile_connection');
  }
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
    account: connectorConfigValue(connector, 'account'),
    username: credentialValue(connector, 'username', 'user'),
    password: credentialValue(connector, 'password'),
    warehouse: connectorConfigValue(connector, 'warehouse'),
    database: connectorConfigValue(connector, 'database'),
    schema: connectorConfigValue(connector, 'schema'),
    role: connectorConfigValue(connector, 'role'),
  });
  await new Promise((resolve, reject) =>
    connection.connect((err) => (err ? reject(err) : resolve()))
  );
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
      maximumBytesBilled:
        connector.config.maximumBytesBilled || connector.config.maximum_bytes_billed,
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
  return profileFromAggregateRow(
    action,
    Object.fromEntries(columns.map((column, index) => [column.name, values[index]]))
  );
}

async function runRedshiftProfile({ connector, action }) {
  const endpointUrl = endpoint(connector, 'profile_endpoint', 'redshift_data_endpoint');
  if (endpointUrl) {
    return runProfileEndpoint({ connector, action, options: { profile_endpoint: endpointUrl } });
  }

  let redshiftData;
  try {
    redshiftData = await import('@aws-sdk/client-redshift-data');
  } catch {
    throw profileError(
      connector,
      action,
      'Redshift live profiling requires the @aws-sdk/client-redshift-data package.',
      'Install @aws-sdk/client-redshift-data or configure profile_endpoint to execute approved aggregate profile SQL.'
    );
  }

  const {
    RedshiftDataClient,
    ExecuteStatementCommand,
    DescribeStatementCommand,
    GetStatementResultCommand,
  } = redshiftData.default || redshiftData;
  const region = connector.config.region || connector.config.aws_region;
  const database = connector.config.database || action.database;
  const clusterIdentifier =
    connector.config.cluster_identifier || connector.config.clusterIdentifier;
  const workgroupName = connector.config.workgroup_name || connector.config.workgroupName;
  const dbUser = credentialValue(connector, 'db_user', 'dbUser', 'username', 'user');
  const secretArn = credentialValue(connector, 'secret_arn', 'secretArn');
  const accessKeyId = credentialValue(connector, 'access_key_id', 'accessKeyId');
  const secretAccessKey = credentialValue(connector, 'secret_access_key', 'secretAccessKey');
  const sessionToken = credentialValue(connector, 'session_token', 'sessionToken');

  if (!region || !database || (!clusterIdentifier && !workgroupName) || (!secretArn && !dbUser)) {
    throw profileError(
      connector,
      action,
      'Redshift live profiling requires region, database, cluster_identifier or workgroup_name, and secret_arn or db_user.',
      'Configure a Redshift Data API connector with region, database, cluster_identifier/workgroup_name, and either secret_arn or db_user. Provide IAM credentials through the runtime environment or connector credential reference.'
    );
  }

  const client = new RedshiftDataClient({
    region,
    ...(accessKeyId && secretAccessKey
      ? { credentials: { accessKeyId, secretAccessKey, ...(sessionToken ? { sessionToken } : {}) } }
      : {}),
  });
  const sqlText = firstExecutableSqlStatement(action.query.sql);
  const executeInput = {
    Database: database,
    Sql: sqlText,
    StatementName: `profile-${String(action.asset_id || 'asset')
      .replace(/[^a-zA-Z0-9_-]/g, '-')
      .slice(0, 400)}`,
    ResultFormat: 'JSON',
    ...(clusterIdentifier ? { ClusterIdentifier: clusterIdentifier } : {}),
    ...(workgroupName ? { WorkgroupName: workgroupName } : {}),
    ...(dbUser && !secretArn ? { DbUser: dbUser } : {}),
    ...(secretArn ? { SecretArn: secretArn } : {}),
  };
  let executeResult;
  try {
    executeResult = await client.send(new ExecuteStatementCommand(executeInput));
  } catch (err) {
    throw profileError(
      connector,
      action,
      `Redshift Data API ExecuteStatement failed: ${err.message}`,
      'Check IAM permissions for redshift-data:ExecuteStatement, database access, cluster/workgroup identifiers, secret ARN/db user, and SQL syntax.',
      { error: err.name || null }
    );
  }

  const statementId = executeResult.Id;
  const deadline = Date.now() + (action.query.timeout_ms || 30000);
  let status = null;
  while (Date.now() < deadline) {
    const describe = await client.send(new DescribeStatementCommand({ Id: statementId }));
    status = describe.Status;
    if (status === 'FINISHED') break;
    if (['FAILED', 'ABORTED'].includes(status)) {
      throw profileError(
        connector,
        action,
        `Redshift Data API statement ${status.toLowerCase()}: ${describe.Error || 'No error detail returned.'}`,
        'Check Redshift SQL syntax, object permissions, warehouse availability, and query timeout settings.',
        { statement_id: statementId, status }
      );
    }
    await sleep(Math.min(1000, Math.max(250, deadline - Date.now())));
  }
  if (status !== 'FINISHED') {
    throw profileError(
      connector,
      action,
      'Redshift Data API profile statement timed out before returning results.',
      'Reduce scope, increase query_timeout_ms, use sampling, or run profiling during a lower-load window.',
      { statement_id: statementId, status: status || 'SUBMITTED' }
    );
  }

  const result = await client.send(new GetStatementResultCommand({ Id: statementId }));
  return profileFromAggregateRow(action, redshiftResultRow(result));
}

export function firstExecutableSqlStatement(sql = '') {
  const statements = String(sql)
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean);
  return (
    statements.find((statement) => /^select\b/i.test(statement)) ||
    statements[statements.length - 1] ||
    String(sql)
  );
}

export function redshiftFieldValue(field = {}) {
  if (field.isNull) return null;
  if (Object.prototype.hasOwnProperty.call(field, 'stringValue')) return field.stringValue;
  if (Object.prototype.hasOwnProperty.call(field, 'longValue')) return field.longValue;
  if (Object.prototype.hasOwnProperty.call(field, 'doubleValue')) return field.doubleValue;
  if (Object.prototype.hasOwnProperty.call(field, 'booleanValue')) return field.booleanValue;
  if (Object.prototype.hasOwnProperty.call(field, 'blobValue')) return field.blobValue;
  return null;
}

export function redshiftResultRow(result = {}) {
  const columns = result.ColumnMetadata || [];
  const record = result.Records?.[0] || [];
  return Object.fromEntries(
    columns.map((column, index) => [column.name, redshiftFieldValue(record[index])])
  );
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
      {
        status: response.status,
        endpoint: safeEndpoint(url),
        error: json.message || json.error || null,
      }
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
