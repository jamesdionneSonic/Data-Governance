import {
  buildSqlServerConnectionConfig,
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
      server: 'L1-DWASQL-02',
      port: 12010,
      database: 'VendorData',
      options: expect.objectContaining({
        encrypt: true,
        trustServerCertificate: true,
      }),
    });
    expect(config.connectionString).toContain('Driver={ODBC Driver 17 for SQL Server}');
    expect(config.connectionString).toContain('Server=L1-DWASQL-02,12010');
    expect(config.connectionString).toContain('Database=VendorData');
    expect(config.connectionString).toContain('Trusted_Connection=Yes');
    expect(config.connectionString).toContain('TrustServerCertificate=Yes');
    expect(config.connectionString).toContain('ApplicationIntent=ReadOnly');
    expect(config.connectionString).toContain('ServerSPN=MSSQLSvc/L1-DWASQL-02.sonic.com:12010');
    expect(config).not.toHaveProperty('user');
    expect(config).not.toHaveProperty('password');
  });

  test('splits SQL Server comma-port notation for the Node driver', () => {
    const { config } = buildSqlServerConnectionConfig({
      config: { server: 'L1-DWASQL-02,12010', database: 'VendorData' },
      credential: { mode: 'windows_integrated' },
    });

    expect(config.server).toBe('L1-DWASQL-02');
    expect(config.port).toBe(12010);
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
    });
  });
});
