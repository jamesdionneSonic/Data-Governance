import { ConnectorRuntimeError } from './connectorErrors.js';

function credentialValue(connector, ...keys) {
  for (const key of keys) {
    const value = connector.credential?.[key] ?? connector.config?.[key];
    if (value !== undefined && value !== null && value !== '') return value;
  }
  return null;
}

function parseEndpoint(serverValue, portValue) {
  const rawServer = String(serverValue || '').trim();
  let server = rawServer;
  let port = portValue;

  const commaPort = rawServer.match(/^([^,]+),(\d+)$/);
  if (commaPort) {
    server = commaPort[1].trim();
    port = port || Number(commaPort[2]);
  }

  const numericPort = Number(port);
  return {
    server,
    port: Number.isFinite(numericPort) && numericPort > 0 ? numericPort : undefined,
  };
}

function escapeConnectionStringValue(value) {
  const text = String(value ?? '');
  return /[;{}]/.test(text) ? '{' + text.replace(/}/g, '}}') + '}' : text;
}

function boolKeyword(value) {
  return value ? 'Yes' : 'No';
}

function sqlServerDriverName(config = {}) {
  return (
    config.odbcDriver ||
    config.odbc_driver ||
    config.sqlDriver ||
    config.sql_driver ||
    'ODBC Driver 17 for SQL Server'
  );
}

function connectionStringValue(key, value) {
  if (key === 'Driver' && !/^\{.*\}$/.test(String(value))) {
    return '{' + String(value).replace(/}/g, '}}') + '}';
  }
  return escapeConnectionStringValue(value);
}

function buildTrustedConnectionString(connector = {}, server, port) {
  const database = connector.config?.database;
  const serverEndpoint = port ? `${server},${port}` : server;
  const encrypt = connector.config?.encrypt !== false;
  const trustServerCertificate = connector.config?.trustServerCertificate !== false;
  const entries = [
    ['Driver', sqlServerDriverName(connector.config || {})],
    ['Server', serverEndpoint],
    ['Database', database],
    ['Trusted_Connection', 'Yes'],
    ['Encrypt', boolKeyword(encrypt)],
    ['TrustServerCertificate', boolKeyword(trustServerCertificate)],
    ['ApplicationIntent', 'ReadOnly'],
    ['ServerSPN', connector.config?.serverSpn || connector.config?.server_spn],
    ['FailoverPartnerSPN', connector.config?.failoverPartnerSpn || connector.config?.failover_partner_spn],
  ].filter(([, value]) => value !== undefined && value !== null && value !== '');

  return entries.map(([key, value]) => `${key}=${connectionStringValue(key, value)}`).join(';');
}

export function sqlServerCredentialMode(connector = {}) {
  return connector.credential?.mode || connector.credential?.kind || 'secret_reference';
}

export function buildSqlServerConnectionConfig(connector = {}, timeoutMs) {
  const credentialMode = sqlServerCredentialMode(connector);
  const { server, port } = parseEndpoint(connector.config?.server || connector.config?.host, connector.config?.port);
  const config = {
    server,
    port,
    database: connector.config?.database,
    options: {
      encrypt: connector.config?.encrypt !== false,
      trustServerCertificate: connector.config?.trustServerCertificate !== false,
      readOnlyIntent: true,
      ...(connector.config?.options || {}),
    },
    requestTimeout: timeoutMs || connector.config?.requestTimeout || connector.config?.query_timeout_ms,
    connectionTimeout: connector.config?.connectionTimeout || timeoutMs || connector.config?.query_timeout_ms,
    pool: { max: 1, min: 0, idleTimeoutMillis: 5000 },
  };

  if (credentialMode === 'windows_integrated') {
    config.connectionString = buildTrustedConnectionString(connector, server, port);
  } else {
    config.user = credentialValue(connector, 'username', 'user');
    config.password = credentialValue(connector, 'password');
  }

  Object.keys(config).forEach((key) => config[key] === undefined && delete config[key]);
  return { credentialMode, config };
}

export async function loadSqlServerDriver(credentialMode) {
  const moduleName = credentialMode === 'windows_integrated' ? 'mssql/msnodesqlv8.js' : 'mssql';
  const sqlModule = await import(moduleName);
  return sqlModule.default || sqlModule;
}

export function sqlServerConnectionRemediation(err, credentialMode = 'secret_reference') {
  const message = String(err?.message || err || '');
  const lower = message.toLowerCase();
  if (
    credentialMode === 'windows_integrated' &&
    (lower.includes('cannot generate sspi context') ||
      lower.includes('target principal name is incorrect') ||
      lower.includes('security package') ||
      lower.includes('sspi'))
  ) {
    return (
      'Windows Integrated Auth reached SQL Server but failed Kerberos/SSPI negotiation. Verify the SQL Server MSSQLSvc SPN ' +
      'for the host and port, run the app as the domain user that has read access, or add the correct serverSpn in the connector config.'
    );
  }
  if (credentialMode === 'windows_integrated' && (lower.includes('server is not found') || lower.includes('failed to connect'))) {
    return (
      'Windows Integrated Auth could not complete the SQL Server connection. Verify server/port/DNS/firewall first; if TCP is open, ' +
      'verify the SQL Server MSSQLSvc SPN for the host and port or add the correct serverSpn in the connector config.'
    );
  }
  if (lower.includes('login failed')) {
    return 'Verify the configured SQL login or Windows account has read access to the selected database.';
  }
  if (lower.includes('enotfound') || lower.includes('server is not found') || lower.includes('failed to connect')) {
    return 'Verify server, port, DNS, firewall, SQL Server TCP/IP configuration, and the connector endpoint format.';
  }
  return 'Verify SQL Server availability, read-only permissions, driver installation, encryption settings, and connector configuration.';
}

export function sqlServerConnectionRuntimeError(err, connector = {}, phase = 'profile_execution') {
  const credentialMode = sqlServerCredentialMode(connector);
  const { config } = buildSqlServerConnectionConfig(connector);
  return new ConnectorRuntimeError(`SQL Server connection failed: ${err.message}`, {
    code: credentialMode === 'windows_integrated' ? 'SQL_SERVER_WINDOWS_INTEGRATED_CONNECTION_FAILED' : 'SQL_SERVER_CONNECTION_FAILED',
    connector_id: connector.id,
    connector_type: connector.type,
    phase,
    remediation: sqlServerConnectionRemediation(err, credentialMode),
    details: {
      credential_mode: credentialMode,
      server: config.server || null,
      port: config.port || null,
      database: config.database || null,
      driver: sqlServerDriverName(connector.config || {}),
      driver_error_code: err.code || null,
      original_error: err.message,
    },
  });
}
