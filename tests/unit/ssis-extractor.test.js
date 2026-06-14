import { extractSsisMetadata, SsisMetadataExtractor } from '../../src/services/ssisExtractor.js';

describe('extractSsisMetadata', () => {
  test('uses trusted SQL Server connector config and provided driver for Windows auth connectors', async () => {
    const capturedConfigs = [];
    const mockDriver = {
      ConnectionPool: class {
        constructor(config) {
          capturedConfigs.push(config);
        }

        async connect() {}

        request() {
          return {
            async query(sqlText) {
              if (/sys\.databases/i.test(sqlText)) {
                return { recordset: [{ name: 'SSISDB' }] };
              }
              return { recordset: [] };
            },
          };
        }

        async close() {}
      },
    };

    const metadata = await extractSsisMetadata(
      {
        id: 'SSIS_UAT',
        type: 'ssis',
        config: {
          server: 'V1-SSIS25-01',
          port: 11040,
          database: 'SSISDB',
          trustServerCertificate: true,
          encrypt: true,
        },
        credential: {
          mode: 'windows_integrated',
        },
      },
      {
        extractXml: false,
        sqlDriver: mockDriver,
      }
    );

    expect(capturedConfigs).toHaveLength(1);
    expect(capturedConfigs[0].driver).toBe('msnodesqlv8');
    expect(capturedConfigs[0]).not.toHaveProperty('database');
    expect(capturedConfigs[0]).not.toHaveProperty('options');
    expect(capturedConfigs[0].connectionString).toContain('Server=V1-SSIS25-01,11040');
    expect(capturedConfigs[0].connectionString).toContain('Database=SSISDB');
    expect(capturedConfigs[0].connectionString).toContain('Trusted_Connection=Yes');
    expect(metadata.catalog).toEqual([]);
  });

  test('filters SQL Agent job lineage to the selected SSIS package scope', async () => {
    const mockDriver = {
      ConnectionPool: class {
        async connect() {}

        request() {
          return {
            async query(sqlText) {
              if (/sys\.databases/i.test(sqlText)) {
                return { recordset: [{ name: 'SSISDB' }] };
              }
              if (/msdb\.dbo\.sysjobsteps/i.test(sqlText)) {
                return {
                  recordset: [
                    {
                      job_id: 'job-dimvehicle',
                      step_name: 'Run DimVehicle package',
                      subsystem: 'SSIS',
                      command:
                        '/ISSERVER "\\SSISDB\\DimVehicle\\DimVehicle\\DimVehicle_DIM_DimVehicle.dtsx"',
                    },
                    {
                      job_id: 'job-other',
                      step_name: 'Run unrelated package',
                      subsystem: 'SSIS',
                      command: '/ISSERVER "\\SSISDB\\Exports\\GPA\\GPA_AnswersExport.dtsx"',
                    },
                  ],
                };
              }
              if (/msdb\.dbo\.sysjobs\b/i.test(sqlText)) {
                return {
                  recordset: [
                    { job_id: 'job-dimvehicle', job_name: 'Load DimVehicle', enabled: true },
                    { job_id: 'job-other', job_name: 'Load Something Else', enabled: true },
                  ],
                };
              }
              return { recordset: [] };
            },
          };
        }

        async close() {}
      },
    };

    const metadata = await extractSsisMetadata(
      {
        server: 'V1-SSIS25-01',
        database: 'SSISDB',
      },
      {
        extractXml: false,
        folder: 'DimVehicle',
        project: 'DimVehicle',
        packages: ['DimVehicle_DIM_DimVehicle.dtsx'],
        sqlDriver: mockDriver,
      }
    );

    expect(metadata.agentJobs.ssidSteps).toBeUndefined();
    expect(metadata.agentJobs.ssisSteps).toHaveLength(1);
    expect(metadata.agentJobs.ssisSteps[0].command).toContain('DimVehicle_DIM_DimVehicle.dtsx');
    expect(metadata.lineageEdges).toHaveLength(1);
    expect(metadata.lineageEdges[0]).toMatchObject({
      from: 'AGENT_JOB/Load DimVehicle',
      edgeType: 'TRIGGERS',
      evidence_type: 'sql_agent_job_step',
    });
    expect(metadata.lineageEdges[0].to).toContain(
      'SSISDB.DimVehicle.DimVehicle.DimVehicle_DIM_DimVehicle.dtsx'
    );
  });

  test('resolves OLE DB source SQL command variables into stored procedure call edges', () => {
    const extractor = new SsisMetadataExtractor({ server: 'V1-SSIS25-01' });
    const edges = extractor.buildLineageEdges(
      [
        {
          folder_name: 'FOCUS',
          project_name: 'Incremental',
          package_name: 'Sonic_Transform_FactOpportunity_INC.dtsx',
        },
      ],
      [
        {
          folderName: 'FOCUS',
          projectName: 'Incremental',
          packageName: 'Sonic_Transform_FactOpportunity_INC.dtsx',
          objectName: 'Sonic_Transform_FactOpportunity_INC.dtsx',
          packageVariables: [
            {
              namespace: 'User',
              name: 'TransformQuery',
              value: 'execute dbo.usp_Fact_Opportunity_Transform_INC 55000',
            },
          ],
          connectionManagers: [
            {
              id: 'Package.ConnectionManagers[OLEDB_ETL_Staging]',
              refId: 'Package.ConnectionManagers[OLEDB_ETL_Staging]',
              connName: 'OLEDB_ETL_Staging',
              serverName: 'L1-5FSQL-01',
              databaseName: 'ETL_Staging',
            },
          ],
          dataFlowComponents: [
            {
              role: 'SOURCE',
              componentName: 'SODB - FactOpportunity',
              componentType: 'Microsoft.OLEDBSource',
              connectionManagerId: 'Package.ConnectionManagers[OLEDB_ETL_Staging]',
              sqlCommandVariable: 'User::TransformQuery',
            },
          ],
          sqlTasks: [],
          packageTasks: [],
        },
      ],
      { jobs: [], ssisSteps: [] },
      [],
      {}
    );

    expect(edges).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          edgeType: 'CALLS',
          evidence_type: 'ssis_source_sql_command_variable_call',
          to: 'L1-5FSQL-01.ETL_Staging.dbo.usp_Fact_Opportunity_Transform_INC',
        }),
      ])
    );
    expect(edges).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          edgeType: 'UNRESOLVED_DYNAMIC_EDGE',
          via: expect.stringContaining('SODB - FactOpportunity'),
        }),
      ])
    );
  });
});
