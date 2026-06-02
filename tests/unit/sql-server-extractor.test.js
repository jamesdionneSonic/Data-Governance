import SqlServerMetadataExtractor from '../../src/services/sqlServerExtractor.js';

describe('SQL Server Metadata Extractor', () => {
  test('canonicalizes named SQL instances to the host server for stable catalog IDs', () => {
    expect(
      SqlServerMetadataExtractor.extractServerNameFromConfig({
        server: 'L1-5FSQL-01\\INST1',
      })
    ).toBe('L1-5FSQL-01');
  });

  test('canonicalizes connection string server values before generating object IDs', () => {
    expect(
      SqlServerMetadataExtractor.extractServerNameFromConfig({
        connectionString: 'Server=tcp:L1-5FSQL-01\\INST1,1433;Database=Sonic_DW;',
      })
    ).toBe('L1-5FSQL-01');
  });

  test('preserves port-qualified linked server names when no named instance is present', () => {
    expect(
      SqlServerMetadataExtractor.extractServerNameFromConfig({
        server: 'L1-DWASQL-02,12010',
      })
    ).toBe('L1-DWASQL-02,12010');
  });

  test('extracts MERGE targets from procedure SQL without matching comments as tables', () => {
    const relationships = SqlServerMetadataExtractor.detectProcedureLoadRelationships([
      {
        id: 'L1-5FSQL-01.ETL_Staging.JMA.LOAD_FACT_JMA_CLAIMS_TBL',
        serverName: 'L1-5FSQL-01',
        database: 'ETL_Staging',
        schema: 'JMA',
        name: 'LOAD_FACT_JMA_CLAIMS_TBL',
        definition: `
          -- Merge statement
          MERGE INTO SONIC_DW.dbo.FACT_JMA_CLAIMS_TBL AS target
          USING CTE_Source AS source
          ON target.JMA_CLAIMS_REF = source.JMA_CLAIMS_REF;
        `,
      },
    ]);

    expect(relationships).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'loads',
          target: 'L1-5FSQL-01.SONIC_DW.dbo.FACT_JMA_CLAIMS_TBL',
        }),
      ])
    );
    expect(relationships).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          target: expect.stringContaining('statement'),
        }),
      ])
    );
  });
});
