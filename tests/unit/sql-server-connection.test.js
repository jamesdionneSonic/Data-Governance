import {
  buildSqlServerApiConnectionContext,
  buildSqlServerConnectionConfig,
  diagnoseSqlServerConnectionVariants,
  parseSqlServerEndpoint,
  sqlServerConnectionFailureCategory,
  sqlServerConnectionRuntimeError,
  sqlServerCredentialMode,
} from '../../src/services/connectorRuntime/sqlServerConnection.js';

describe('SQL Server connector connection config', () => {
  test('uses Windows Integrated Auth without blank SQL credentials', () => {
    const connector = {
      type: 'sql_server',
      config: {
        server: 'L1-DWASQL-02',
        port: 12010,
        database: 'VendorData',
        encrypt: true,
        trustServerCertificate: true,
        serverSpn: 'MSSQLSvc/L1-DWASQL-02.sonic.com:12010',
      },
      credential: { mode: 'windows_integrated' },
    };

    const { config, credentialMode } = buildSqlServerConnectionConfig(connector, 30000);

    expect(credentialMode).toBe('windows_integrated');
    expect(sqlServerCredentialMode(connector)).toBe('windows_integrated');
    expect(config).toMatchObject({
      driver: 'msnodesqlv8',
      connectionString: expect.any(String),
    });
    expect(config.connectionString).toContain('Driver={ODBC Driver 17 for SQL Server}');
    expect(config.connectionString).toContain('Server=L1-DWASQL-02,12010');
    expect(config.connectionString).toContain('Database=VendorData');
    expect(config.connectionString).toContain('Trusted_Connection=Yes');
    expect(config).not.toHaveProperty('server');
    expect(config).not.toHaveProperty('port');
    expect(config).not.toHaveProperty('database');
    expect(config).not.toHaveProperty('options');
    expect(config).not.toHaveProperty('user');
    expect(config).not.toHaveProperty('password');
  });

  test('splits SQL Server comma-port notation for the Node driver', () => {
    const { config } = buildSqlServerConnectionConfig({
      config: { server: 'L1-DWASQL-02,12010', database: 'VendorData' },
      credential: { mode: 'windows_integrated' },
    });

    expect(config.connectionString).toContain('Server=L1-DWASQL-02,12010');
    expect(config).not.toHaveProperty('server');
    expect(config).not.toHaveProperty('port');
  });

  test('parses named instances and resolved endpoints for diagnostics', () => {
    expect(parseSqlServerEndpoint('L1-5FSQL-01\\INST1')).toMatchObject({
      raw_server: 'L1-5FSQL-01\\INST1',
      server: 'L1-5FSQL-01',
      instance: 'INST1',
      uses_named_instance: true,
      resolved_endpoint: 'L1-5FSQL-01\\INST1',
    });
  });

  test('preserves named instances in Windows Integrated connection strings', () => {
    const { config } = buildSqlServerConnectionConfig({
      config: { server: 'L1-5FSQL-01\\INST1', database: 'ETL_Staging' },
      credential: { mode: 'windows_integrated' },
    });

    expect(config.connectionString).toContain('Server=L1-5FSQL-01\\INST1');
    expect(config.connectionString).toContain('Database=ETL_Staging');
    expect(config.connectionString).toContain('Trusted_Connection=Yes');
    expect(config).not.toHaveProperty('server');
    expect(config).not.toHaveProperty('port');
    expect(config).not.toHaveProperty('options');
  });

  test('builds shared API connection context for Windows integrated auth', async () => {
    const built = await buildSqlServerApiConnectionContext(
      {
        server: 'L1-DWASQL-02,12010',
        database: 'VendorData',
        authentication: 'windows',
        encrypt: true,
        trustServerCertificate: true,
      },
      {
        requireDatabase: true,
        windowsDriverMessage: 'driver message',
        windowsDriverInstallMessage: 'install message',
      }
    );

    expect(built.error).toBeUndefined();
    expect(built.credentialMode).toBe('windows_integrated');
    expect(built.connConfig.connectionString).toContain('Trusted_Connection=Yes');
    expect(built.connConfig.driver).toBe('msnodesqlv8');
    expect(built.connConfig.pool).toMatchObject({
      max: 20,
      min: 0,
      idleTimeoutMillis: 30000,
    });
    expect(built.diagnostics).toMatchObject({
      authentication: 'windows',
      connection_variant: 'windows_integrated_shared',
      endpoint: expect.objectContaining({
        server: 'L1-DWASQL-02',
        port: 12010,
      }),
    });
  });

  test('does not default named-instance API connections to port 1433', async () => {
    const built = await buildSqlServerApiConnectionContext(
      {
        server: 'L1-5FSQL-01\\INST1',
        database: 'Sonic_DW',
        authentication: 'windows',
        encrypt: true,
        trustServerCertificate: true,
      },
      {
        requireDatabase: true,
        windowsDriverMessage: 'driver message',
        windowsDriverInstallMessage: 'install message',
      }
    );

    expect(built.error).toBeUndefined();
    expect(built.connConfig.connectionString).toContain('Server=L1-5FSQL-01\\INST1');
    expect(built.connConfig.connectionString).not.toContain('Server=L1-5FSQL-01,1433');
    expect(built.diagnostics.endpoint).toMatchObject({
      server: 'L1-5FSQL-01',
      instance: 'INST1',
      port: undefined,
      uses_named_instance: true,
    });
  });

  test('classifies Windows Integrated SSPI failures with actionable remediation', () => {
    const error = sqlServerConnectionRuntimeError(
      new Error('The target principal name is incorrect. Cannot generate SSPI context.'),
      {
        id: 'VendorData',
        type: 'sql_server',
        config: { server: 'L1-DWASQL-02', port: 12010, database: 'VendorData' },
        credential: { mode: 'windows_integrated' },
      }
    );

    expect(error.code).toBe('SQL_SERVER_WINDOWS_INTEGRATED_CONNECTION_FAILED');
    expect(error.remediation).toContain('MSSQLSvc SPN');
    expect(error.details).toMatchObject({
      credential_mode: 'windows_integrated',
      server: 'L1-DWASQL-02',
      port: 12010,
      database: 'VendorData',
      resolved_endpoint: 'L1-DWASQL-02,12010',
      failure_category: 'windows_security_negotiation_failed',
    });
    expect(error.details.diagnostic_hints).toEqual(
      expect.arrayContaining([
        expect.stringContaining('shared connector runtime'),
        expect.stringContaining('SSMS works'),
      ])
    );
  });

  test('classifies native Windows security package code even when driver text says network-related', () => {
    const driverError = new Error(
      '[Microsoft][ODBC Driver 17 for SQL Server]A network-related or instance-specific error has occurred while establishing a connection to SQL Server.'
    );
    driverError.code = -2146893042;

    expect(sqlServerConnectionFailureCategory(driverError, 'windows_integrated')).toBe(
      'windows_security_negotiation_failed'
    );

    const error = sqlServerConnectionRuntimeError(driverError, {
      id: 'SSIS_UAT',
      type: 'ssis',
      config: { server: 'V1-SSIS25-01', port: 11040, database: 'SSISDB' },
      credential: { mode: 'windows_integrated' },
    });

    expect(error.remediation).toContain('Windows security negotiation');
    expect(error.details.failure_category).toBe('windows_security_negotiation_failed');
    expect(error.details.resolved_endpoint).toBe('V1-SSIS25-01,11040');
  });

  test('adds named-instance hints for endpoint failures without direct SQL probes', () => {
    const error = sqlServerConnectionRuntimeError(
      new Error('Server is not found or not accessible.'),
      {
        id: 'ETL_Staging',
        type: 'sql_server',
        config: { server: 'L1-5FSQL-01\\INST1', database: 'ETL_Staging' },
        credential: { mode: 'windows_integrated' },
      }
    );

    expect(error.details).toMatchObject({
      failure_category: 'endpoint_unreachable_or_incorrect',
      uses_named_instance: true,
      instance: 'INST1',
    });
    expect(error.details.diagnostic_hints).toEqual(
      expect.arrayContaining([expect.stringContaining('SQL Browser')])
    );
  });

  test('diagnoses SQL Server driver variants with bounded shared-runtime probes', async () => {
    const attempted = [];
    const mockDriver = {
      ConnectionPool: class {
        constructor(config) {
          this.config = config;
          attempted.push(config.connectionString);
        }

        async connect() {
          if (this.config.connectionString.includes('Driver={Bad Driver}')) {
            throw new Error('driver failed');
          }
        }

        request() {
          return {
            async query() {
              return {
                recordset: [
                  {
                    database_name: 'Sonic_DW',
                    server_name: 'L1-5FSQL-01\\INST1',
                    login_name: 'SONIC\\James.Dionne',
                  },
                ],
              };
            },
          };
        }

        async close() {}
      },
    };

    const result = await diagnoseSqlServerConnectionVariants(
      {
        id: 'GPA',
        type: 'sql_server',
        config: { server: 'L1-5FSQL-01\\INST1', database: 'Sonic_DW' },
        credential: { mode: 'windows_integrated' },
      },
      {
        sqlDriver: mockDriver,
        drivers: ['Bad Driver', 'SQL Server Native Client 11.0', 'ODBC Driver 17 for SQL Server'],
        variantTimeoutMs: 100,
      }
    );

    expect(result.status).toBe('succeeded');
    expect(result.results).toHaveLength(2);
    expect(result.results[0]).toMatchObject({ driver: 'Bad Driver', status: 'failed' });
    expect(result.results[1]).toMatchObject({
      driver: 'SQL Server Native Client 11.0',
      status: 'succeeded',
      details: {
        database_name: 'Sonic_DW',
        login_name: 'SONIC\\James.Dionne',
      },
    });
    expect(attempted).toEqual([
      expect.stringContaining('Driver={Bad Driver}'),
      expect.stringContaining('Driver={SQL Server Native Client 11.0}'),
    ]);
  });

  test('marks diagnostic variants as timed out without waiting for the driver forever', async () => {
    const mockDriver = {
      ConnectionPool: class {
        async connect() {
          return new Promise(() => {});
        }

        async close() {}
      },
    };

    const result = await diagnoseSqlServerConnectionVariants(
      {
        id: 'GPA',
        type: 'sql_server',
        config: { server: 'L1-5FSQL-01\\INST1', database: 'Sonic_DW' },
        credential: { mode: 'windows_integrated' },
      },
      {
        sqlDriver: mockDriver,
        drivers: ['ODBC Driver 17 for SQL Server'],
        variantTimeoutMs: 10,
      }
    );

    expect(result.status).toBe('failed');
    expect(result.results[0]).toMatchObject({
      driver: 'ODBC Driver 17 for SQL Server',
      status: 'failed',
      error: {
        code: 'SQL_SERVER_DIAGNOSTIC_TIMEOUT',
      },
    });
  });
});
