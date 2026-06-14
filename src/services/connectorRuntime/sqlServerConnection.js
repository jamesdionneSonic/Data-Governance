import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { ConnectorRuntimeError } from './connectorErrors.js';

export function runtimeProcessIdentityDetails() {
  const user = process.env.USERNAME || process.env.USER || '';
  const domain = process.env.USERDOMAIN || '';
  const host = process.env.COMPUTERNAME || process.env.HOSTNAME || '';
  return {
    runtime_process_user: user || null,
    runtime_process_domain: domain || null,
    runtime_process_identity: domain && user ? `${domain}\\${user}` : user || null,
    runtime_process_host: host || null,
  };
}

function credentialValue(connector, ...keys) {
  for (const key of keys) {
    const value = connector.credential?.[key] ?? connector.config?.[key];
    if (value !== undefined && value !== null && value !== '') return value;
  }
  return null;
}

export function parseSqlServerEndpoint(serverValue, portValue) {
  const rawServer = String(serverValue || '').trim();
  let server = rawServer;
  let port = portValue;
  let instance = '';

  const commaPort = rawServer.match(/^([^,]+),(\d+)$/);
  if (commaPort) {
    server = commaPort[1].trim();
    port = port || Number(commaPort[2]);
  }

  const namedInstance = String(server || '').match(/^([^\\]+)\\([^\\]+)$/);
  if (namedInstance) {
    server = namedInstance[1].trim();
    instance = namedInstance[2].trim();
  }

  const numericPort = Number(port);
  return {
    raw_server: rawServer || null,
    server,
    instance: instance || null,
    port: Number.isFinite(numericPort) && numericPort > 0 ? numericPort : undefined,
    uses_named_instance: Boolean(instance),
    resolved_endpoint:
      Number.isFinite(numericPort) && numericPort > 0
        ? `${server},${numericPort}`
        : rawServer || server,
  };
}

function escapeConnectionStringValue(value) {
  const text = String(value ?? '');
  if (!/[;{}]/.test(text)) return text;
  return '{' + text.replace(/}/g, '}}') + '}';
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

function endpointForConnectionString(endpoint = {}) {
  if (endpoint.port) return `${endpoint.server},${endpoint.port}`;
  if (endpoint.instance) return `${endpoint.server}\\${endpoint.instance}`;
  return endpoint.server;
}

function buildTrustedConnectionString(connector = {}, endpoint = {}) {
  const database = connector.config?.database;
  const serverEndpoint = endpointForConnectionString(endpoint);
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
    [
      'FailoverPartnerSPN',
      connector.config?.failoverPartnerSpn || connector.config?.failover_partner_spn,
    ],
  ].filter(([, value]) => value !== undefined && value !== null && value !== '');

  return entries.map(([key, value]) => `${key}=${connectionStringValue(key, value)}`).join(';');
}

function buildStudioStyleTrustedConnectionString(connector = {}, endpoint = {}) {
  const database = connector.config?.database;
  const serverEndpoint = endpointForConnectionString(endpoint);
  const entries = [
    ['Driver', sqlServerDriverName(connector.config || {})],
    ['Server', serverEndpoint],
    ['Database', database],
    ['Trusted_Connection', 'Yes'],
  ].filter(([, value]) => value !== undefined && value !== null && value !== '');

  return entries.map(([key, value]) => `${key}=${connectionStringValue(key, value)}`).join(';');
}

export function sqlServerCredentialMode(connector = {}) {
  return connector.credential?.mode || connector.credential?.kind || 'secret_reference';
}

export function buildSqlServerConnectionConfig(connector = {}, timeoutMs) {
  const credentialMode = sqlServerCredentialMode(connector);
  const endpoint = parseSqlServerEndpoint(
    connector.config?.server || connector.config?.host,
    connector.config?.port
  );
  const { server, port, instance } = endpoint;
  const windowsIntegrated = credentialMode === 'windows_integrated';
  const baseConfig = {
    server,
    port,
    database: connector.config?.database,
    options: {
      encrypt: connector.config?.encrypt !== false,
      trustServerCertificate: connector.config?.trustServerCertificate !== false,
      trustedConnection: windowsIntegrated || undefined,
      readOnlyIntent: true,
      ...(instance && !port ? { instanceName: instance } : {}),
      ...(connector.config?.options || {}),
    },
    requestTimeout:
      timeoutMs || connector.config?.requestTimeout || connector.config?.query_timeout_ms,
    connectionTimeout:
      connector.config?.connectionTimeout || timeoutMs || connector.config?.query_timeout_ms,
    pool: { max: 1, min: 0, idleTimeoutMillis: 5000 },
  };

  let config = baseConfig;
  if (windowsIntegrated) {
    const studioCompatible = connector.config?.windowsIntegratedCompat !== false;
    const connectionString = studioCompatible
      ? buildStudioStyleTrustedConnectionString(connector, endpoint)
      : buildTrustedConnectionString(connector, endpoint);
    config = {
      driver: 'msnodesqlv8',
      connectionString,
      requestTimeout: baseConfig.requestTimeout,
      connectionTimeout: baseConfig.connectionTimeout,
      pool: baseConfig.pool,
    };
  } else {
    config.user = credentialValue(connector, 'username', 'user');
    config.password = credentialValue(connector, 'password');
  }

  Object.keys(config).forEach((key) => config[key] === undefined && delete config[key]);
  return { credentialMode, config };
}

function timeoutError(timeoutMs, label) {
  const err = new Error(`${label} timed out after ${timeoutMs} ms.`);
  err.code = 'SQL_SERVER_DIAGNOSTIC_TIMEOUT';
  return err;
}

function withTimeout(promise, timeoutMs, label) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(timeoutError(timeoutMs, label)), timeoutMs);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

function diagnosticVariants(connector = {}, options = {}) {
  const requestedDrivers = Array.isArray(options.drivers) ? options.drivers : [];
  const drivers = requestedDrivers.length
    ? requestedDrivers
    : [
        connector.config?.odbcDriver ||
          connector.config?.odbc_driver ||
          connector.config?.sqlDriver ||
          connector.config?.sql_driver,
        'ODBC Driver 17 for SQL Server',
        'ODBC Driver 18 for SQL Server',
        'SQL Server Native Client 11.0',
        'SQL Server',
      ];
  return [...new Set(drivers.filter(Boolean))].map((driver) => ({
    name: driver,
    connector: {
      ...connector,
      config: {
        ...(connector.config || {}),
        odbcDriver: driver,
        odbc_driver: undefined,
        sqlDriver: undefined,
        sql_driver: undefined,
      },
    },
  }));
}

function childDiagnosticTimeout(connector, timeoutMs, label) {
  return {
    status: 'failed',
    tested_at: new Date().toISOString(),
    credential_mode: sqlServerCredentialMode(connector),
    endpoint: null,
    ...runtimeProcessIdentityDetails(),
    results: [
      {
        driver: 'diagnostic_worker',
        status: 'failed',
        elapsed_ms: timeoutMs,
        error: {
          code: 'SQL_SERVER_DIAGNOSTIC_WORKER_TIMEOUT',
          message: `${label} timed out after ${timeoutMs} ms and the diagnostic worker was stopped.`,
          category: 'diagnostic_worker_timeout',
          remediation:
            'The SQL Server native driver did not return inside the diagnostic window. Validate the endpoint, SQL Browser/named-instance resolution, Windows auth delegation, and installed ODBC driver from the same host.',
        },
      },
    ],
  };
}

function runIsolatedSqlServerDiagnostic(connector = {}, options = {}) {
  const timeoutMs = Math.min(Number(options.workerTimeoutMs || options.timeout_ms || 15000), 60000);
  const workerPath = fileURLToPath(
    new URL('../../../scripts/sql-server-connection-diagnostic-worker.mjs', import.meta.url)
  );
  const payload = {
    connector,
    options: {
      ...options,
      processIsolated: false,
      sqlDriver: undefined,
    },
  };

  return new Promise((resolve) => {
    const started = Date.now();
    let child;
    try {
      child = spawn(process.execPath, [workerPath], {
        cwd: process.cwd(),
        stdio: ['pipe', 'pipe', 'pipe'],
        windowsHide: true,
      });
    } catch (err) {
      resolve({
        status: 'failed',
        tested_at: new Date().toISOString(),
        credential_mode: sqlServerCredentialMode(connector),
        endpoint: parseSqlServerEndpoint(
          connector.config?.server || connector.config?.host,
          connector.config?.port
        ),
        ...runtimeProcessIdentityDetails(),
        results: [
          {
            driver: 'diagnostic_worker',
            status: 'failed',
            elapsed_ms: Date.now() - started,
            error: {
              code: err.code || 'SQL_SERVER_DIAGNOSTIC_WORKER_FAILED',
              message: err.message,
              category: 'diagnostic_worker_failed',
              remediation:
                'The diagnostic worker could not start. Check Node.js runtime permissions on the app host.',
            },
          },
        ],
      });
      return;
    }
    let stdout = '';
    let stderr = '';
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      child.kill('SIGKILL');
      resolve(
        childDiagnosticTimeout(
          connector,
          Date.now() - started,
          'SQL Server connection diagnostic worker'
        )
      );
    }, timeoutMs);

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });
    child.on('error', (err) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({
        status: 'failed',
        tested_at: new Date().toISOString(),
        credential_mode: sqlServerCredentialMode(connector),
        endpoint: parseSqlServerEndpoint(
          connector.config?.server || connector.config?.host,
          connector.config?.port
        ),
        ...runtimeProcessIdentityDetails(),
        results: [
          {
            driver: 'diagnostic_worker',
            status: 'failed',
            elapsed_ms: Date.now() - started,
            error: {
              code: 'SQL_SERVER_DIAGNOSTIC_WORKER_FAILED',
              message: err.message,
              category: 'diagnostic_worker_failed',
              remediation:
                'The diagnostic worker could not start. Check Node.js runtime permissions on the app host.',
            },
          },
        ],
      });
    });
    child.on('close', () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      try {
        resolve(JSON.parse(stdout.trim()));
      } catch {
        resolve({
          status: 'failed',
          tested_at: new Date().toISOString(),
          credential_mode: sqlServerCredentialMode(connector),
          endpoint: parseSqlServerEndpoint(
            connector.config?.server || connector.config?.host,
            connector.config?.port
          ),
          ...runtimeProcessIdentityDetails(),
          results: [
            {
              driver: 'diagnostic_worker',
              status: 'failed',
              elapsed_ms: Date.now() - started,
              error: {
                code: 'SQL_SERVER_DIAGNOSTIC_WORKER_BAD_OUTPUT',
                message: stderr.trim() || 'The diagnostic worker exited without valid JSON output.',
                category: 'diagnostic_worker_bad_output',
                remediation: 'Review backend logs for the diagnostic worker stderr output.',
              },
            },
          ],
        });
      }
    });

    child.stdin.end(JSON.stringify(payload));
  });
}

export async function diagnoseSqlServerConnectionVariants(connector = {}, options = {}) {
  if (options.processIsolated !== false && !options.sqlDriver) {
    return runIsolatedSqlServerDiagnostic(connector, options);
  }
  return diagnoseSqlServerConnectionVariantsInProcess(connector, options);
}

export async function diagnoseSqlServerConnectionVariantsInProcess(connector = {}, options = {}) {
  const credentialMode = sqlServerCredentialMode(connector);
  const timeoutMs = Number(options.variantTimeoutMs || options.timeout_ms || 3000);
  const sqlDriver = options.sqlDriver || (await loadSqlServerDriver(credentialMode));
  const variants = diagnosticVariants(connector, options);
  const results = [];

  for (const variant of variants) {
    const started = Date.now();
    const { config } = buildSqlServerConnectionConfig(variant.connector, timeoutMs);
    let pool;
    try {
      pool = new sqlDriver.ConnectionPool(config);
      await withTimeout(
        pool.connect(),
        timeoutMs,
        `SQL Server diagnostic variant '${variant.name}'`
      );
      const query = pool
        .request()
        .query(
          'SELECT DB_NAME() AS database_name, @@SERVERNAME AS server_name, SYSTEM_USER AS login_name;'
        );
      const result = await withTimeout(
        query,
        timeoutMs,
        `SQL Server diagnostic query '${variant.name}'`
      );
      const row = result.recordset?.[0] || {};
      results.push({
        driver: variant.name,
        status: 'succeeded',
        elapsed_ms: Date.now() - started,
        config: {
          connectionString: config.connectionString,
          driver: config.driver,
        },
        details: {
          server_name: row.server_name || null,
          database_name: row.database_name || null,
          login_name: row.login_name || null,
        },
      });
      if (options.stopOnSuccess !== false) break;
    } catch (err) {
      const runtimeError = sqlServerConnectionRuntimeError(
        err,
        variant.connector,
        'connection_diagnostic'
      );
      results.push({
        driver: variant.name,
        status: 'failed',
        elapsed_ms: Date.now() - started,
        config: {
          connectionString: config.connectionString,
          driver: config.driver,
        },
        error: {
          code: err.code || runtimeError.code,
          message: err.message,
          category: runtimeError.details?.failure_category || null,
          remediation: runtimeError.remediation,
        },
        details: runtimeError.details,
      });
    } finally {
      if (pool)
        await withTimeout(
          pool.close().catch(() => {}),
          1000,
          `SQL Server diagnostic close '${variant.name}'`
        ).catch(() => {});
    }
  }

  return {
    status: results.some((result) => result.status === 'succeeded') ? 'succeeded' : 'failed',
    tested_at: new Date().toISOString(),
    credential_mode: credentialMode,
    endpoint: parseSqlServerEndpoint(
      connector.config?.server || connector.config?.host,
      connector.config?.port
    ),
    ...runtimeProcessIdentityDetails(),
    results,
  };
}

export async function loadSqlServerDriver(credentialMode) {
  const moduleName = credentialMode === 'windows_integrated' ? 'mssql/msnodesqlv8.js' : 'mssql';
  const sqlModule = await import(moduleName);
  return sqlModule.default || sqlModule;
}

export async function buildSqlServerApiConnectionContext(
  payload = {},
  {
    requireDatabase = true,
    defaultDatabase = undefined,
    defaultPort = 1433,
    defaultEncrypt = true,
    defaultTrustServerCertificate = false,
    connectionTimeout = 15000,
    requestTimeout = 300000,
    pool = { max: 20, min: 0, idleTimeoutMillis: 30000 },
    sqlAuthLabel = 'SQL Server authentication',
    windowsDriverMessage = 'Windows integrated auth requires msnodesqlv8 on a Windows host.',
    windowsIntegratedCredentialMessage = 'For NTLM Windows auth, provide both username and password. For integrated auth, leave both blank.',
    windowsDriverInstallMessage = 'Windows integrated auth requires msnodesqlv8.',
    azureAdMode = null,
  } = {}
) {
  const {
    server,
    port: rawPort,
    database = defaultDatabase,
    username,
    password,
    domain,
    clientId,
    clientSecret,
    tenantId,
    authentication = 'sql-server',
    encrypt = defaultEncrypt,
    trustServerCertificate = defaultTrustServerCertificate,
  } = payload;
  const hasExplicitPort = rawPort !== undefined && rawPort !== null && rawPort !== '';
  const port = hasExplicitPort ? rawPort : defaultPort;

  if (!server || (requireDatabase && !database)) {
    return {
      error: {
        status: 400,
        code: 'BAD_REQUEST',
        message: requireDatabase ? 'server and database are required' : 'server is required',
      },
    };
  }

  const connector = {
    type: 'sql_server',
    config: {
      server,
      port,
      database,
      encrypt: encrypt === true || encrypt === 'true',
      trustServerCertificate: trustServerCertificate === true || trustServerCertificate === 'true',
      connectionTimeout,
      requestTimeout,
      pool,
      options: {
        enableArithAbort: true,
      },
      windowsIntegratedCompat: true,
    },
    credential: {},
  };

  if (authentication === 'sql-server') {
    if (!username || !password) {
      return {
        error: {
          status: 400,
          code: 'BAD_REQUEST',
          message: `username and password are required for ${sqlAuthLabel}`,
        },
      };
    }
    connector.credential = {
      mode: 'service_account',
      username,
      password,
    };
  } else if (authentication === 'windows') {
    if (!username && !password) {
      connector.credential = {
        mode: 'windows_integrated',
      };
    } else {
      if (!username || !password) {
        return {
          error: {
            status: 400,
            code: 'BAD_REQUEST',
            message: windowsIntegratedCredentialMessage,
          },
        };
      }

      let resolvedDomain = domain || '';
      let resolvedUsername = username;
      if (!resolvedDomain && String(username).includes('\\')) {
        const [parsedDomain, parsedUser] = String(username).split('\\');
        if (parsedDomain && parsedUser) {
          resolvedDomain = parsedDomain;
          resolvedUsername = parsedUser;
        }
      }

      connector.credential = {
        mode: 'service_account',
        username: resolvedUsername,
        password,
      };
      connector.config.domain = resolvedDomain;
      connector.config.authentication = {
        type: 'ntlm',
        options: {
          userName: resolvedUsername,
          password,
          domain: resolvedDomain,
        },
      };
    }
  } else if (azureAdMode && authentication === 'azure-ad') {
    if (!clientId || !clientSecret || !tenantId) {
      return {
        error: {
          status: 400,
          code: 'BAD_REQUEST',
          message: 'clientId, clientSecret, and tenantId are required for Azure AD authentication',
        },
      };
    }
    connector.credential = {
      mode: 'service_principal',
      clientId,
      clientSecret,
      tenantId,
    };
    connector.config.authentication = {
      type: azureAdMode,
      options: { clientId, clientSecret, tenantId },
    };
  } else {
    return {
      error: {
        status: 400,
        code: 'BAD_REQUEST',
        message: `Unsupported authentication method: ${authentication}`,
      },
    };
  }

  try {
    const { credentialMode, config } = buildSqlServerConnectionConfig(connector);
    let sqlDriver;
    try {
      sqlDriver = await loadSqlServerDriver(credentialMode);
    } catch (_driverLoadErr) {
      if (credentialMode === 'windows_integrated') {
        return {
          error: {
            status: 400,
            code: 'BAD_REQUEST',
            message: `${windowsDriverInstallMessage} Install with \`npm i msnodesqlv8\`, or provide username/password for NTLM.`,
          },
        };
      }
      throw _driverLoadErr;
    }

    if (connector.config.authentication?.type === 'ntlm') {
      config.authentication = connector.config.authentication;
    }

    return {
      connConfig: config,
      sqlDriver,
      credentialMode,
      diagnostics: {
        authentication,
        connection_variant:
          credentialMode === 'windows_integrated'
            ? 'windows_integrated_shared'
            : 'credential_shared',
        endpoint: parseSqlServerEndpoint(server, hasExplicitPort ? rawPort : undefined),
        ...runtimeProcessIdentityDetails(),
      },
    };
  } catch (_err) {
    return {
      error: {
        status: 400,
        code: 'BAD_REQUEST',
        message: windowsDriverMessage,
      },
    };
  }
}

export function sqlServerConnectionRemediation(err, credentialMode = 'secret_reference') {
  const message = String(err?.message || err || '');
  const lower = message.toLowerCase();
  const category = sqlServerConnectionFailureCategory(err, credentialMode);
  if (category === 'windows_security_negotiation_failed') {
    return (
      'Windows Integrated Auth reached the driver but failed Windows security negotiation. Verify the runtime Windows identity, ' +
      'Kerberos/SSPI availability, SQL Server MSSQLSvc SPN for the host and port, and whether the connector needs serverSpn.'
    );
  }
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
  if (
    credentialMode === 'windows_integrated' &&
    (lower.includes('server is not found') || lower.includes('failed to connect'))
  ) {
    return (
      'Windows Integrated Auth could not complete the SQL Server connection. Verify server/port/DNS/firewall first; if TCP is open, ' +
      'verify the SQL Server MSSQLSvc SPN for the host and port or add the correct serverSpn in the connector config.'
    );
  }
  if (lower.includes('login failed')) {
    return 'Verify the configured SQL login or Windows account has read access to the selected database.';
  }
  if (
    lower.includes('enotfound') ||
    lower.includes('server is not found') ||
    lower.includes('failed to connect')
  ) {
    return 'Verify server, port, DNS, firewall, SQL Server TCP/IP configuration, and the connector endpoint format.';
  }
  return 'Verify SQL Server availability, read-only permissions, driver installation, encryption settings, and connector configuration.';
}

export function sqlServerConnectionFailureCategory(err, credentialMode = 'secret_reference') {
  const message = String(err?.message || err || '');
  const lower = message.toLowerCase();
  const code = String(err?.code ?? '');
  if (
    credentialMode === 'windows_integrated' &&
    (code === '-2146893042' ||
      lower.includes('no credentials are available in the security package') ||
      lower.includes('security package') ||
      lower.includes('cannot generate sspi context') ||
      lower.includes('target principal name is incorrect') ||
      lower.includes('sspi'))
  ) {
    return 'windows_security_negotiation_failed';
  }
  if (
    lower.includes('server is not found') ||
    lower.includes('not accessible') ||
    lower.includes('econnrefused') ||
    lower.includes('etimedout') ||
    lower.includes('enotfound') ||
    lower.includes('failed to connect')
  ) {
    return 'endpoint_unreachable_or_incorrect';
  }
  if (lower.includes('login failed')) return 'login_failed';
  if (
    lower.includes('encrypt') ||
    lower.includes('ssl provider') ||
    lower.includes('certificate')
  ) {
    return 'encryption_or_certificate_failed';
  }
  return 'unknown_sql_server_connection_failure';
}

export function sqlServerConnectionDiagnosticHints(err, connector = {}) {
  const credentialMode = sqlServerCredentialMode(connector);
  const endpoint = parseSqlServerEndpoint(
    connector.config?.server || connector.config?.host,
    connector.config?.port
  );
  const category = sqlServerConnectionFailureCategory(err, credentialMode);
  const hints = [];
  if (category === 'windows_security_negotiation_failed') {
    hints.push(
      'Do not create a new SQL connection path; fix Windows auth/SPN/runtime identity in the shared connector runtime configuration.'
    );
    hints.push(
      'If SSMS works, compare its exact server, port/instance, encryption, trust, and Windows identity to this connector.'
    );
  }
  if (category === 'endpoint_unreachable_or_incorrect') {
    hints.push(
      'Verify DNS, SQL Server TCP/IP enablement, firewall, and whether the saved connector should use a fixed port or named instance.'
    );
  }
  if (endpoint.uses_named_instance && !endpoint.port) {
    hints.push('Named instances may require SQL Browser/UDP 1434 or a configured fixed TCP port.');
  }
  if (
    credentialMode === 'windows_integrated' &&
    !connector.config?.serverSpn &&
    !connector.config?.server_spn
  ) {
    hints.push(
      'For Kerberos issues, add serverSpn only after confirming the MSSQLSvc SPN with infrastructure/DBA.'
    );
  }
  return hints;
}

export function sqlServerConnectionRuntimeError(err, connector = {}, phase = 'profile_execution') {
  const credentialMode = sqlServerCredentialMode(connector);
  const { config } = buildSqlServerConnectionConfig(connector);
  const endpoint = parseSqlServerEndpoint(
    connector.config?.server || connector.config?.host,
    connector.config?.port
  );
  const failureCategory = sqlServerConnectionFailureCategory(err, credentialMode);
  return new ConnectorRuntimeError(`SQL Server connection failed: ${err.message}`, {
    code:
      credentialMode === 'windows_integrated'
        ? 'SQL_SERVER_WINDOWS_INTEGRATED_CONNECTION_FAILED'
        : 'SQL_SERVER_CONNECTION_FAILED',
    connector_id: connector.id,
    connector_type: connector.type,
    phase,
    remediation: sqlServerConnectionRemediation(err, credentialMode),
    details: {
      credential_mode: credentialMode,
      server: endpoint.server || config.server || null,
      port: endpoint.port || config.port || null,
      database: connector.config?.database || config.database || null,
      driver: sqlServerDriverName(connector.config || {}),
      raw_server: endpoint.raw_server || null,
      instance: endpoint.instance || null,
      resolved_endpoint: endpoint.resolved_endpoint || null,
      uses_named_instance: endpoint.uses_named_instance,
      failure_category: failureCategory,
      connection_variant:
        credentialMode === 'windows_integrated' &&
        connector.config?.windowsIntegratedCompat !== false
          ? 'windows_integrated_shared'
          : credentialMode,
      diagnostic_hints: sqlServerConnectionDiagnosticHints(err, connector),
      ...runtimeProcessIdentityDetails(),
      driver_error_code: err.code || null,
      original_error: err.message,
    },
  });
}
