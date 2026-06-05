import { buildLineageAnswer, buildLineageQuestionHelp } from '../../src/services/lineageAnswerService.js';

describe('Lineage Answer Service', () => {
  const tableId = 'L1-5FSQL-01.Sonic_DW.dbo.DimVehicle';
  const procId = 'L1-5FSQL-01.Sonic_DW.dbo.usp_DimVehicle';
  const packageId = 'V1-SSIS25-01.SSISDB.DimVehicle.DimVehicle_DIM_DimVehicle.dtsx';
  const stageId = 'L1-5FSQL-01.Sonic_DW.dbo.SynWrkDimVehicleVehicle';
  const dimVinId = 'L1-5FSQL-01.Sonic_DW.dbo.DimVin';
  const viewId = 'L1-5FSQL-01.Sonic_DW.dbo.vwDimVehicle';

  function buildObjects() {
    return new Map([
      [
        tableId,
        {
          id: tableId,
          name: 'DimVehicle',
          server: 'L1-5FSQL-01',
          database: 'Sonic_DW',
          schema: 'dbo',
          type: 'table',
          created_by: [procId],
          used_by: [procId, viewId],
        },
      ],
      [
        procId,
        {
          id: procId,
          name: 'usp_DimVehicle',
          server: 'L1-5FSQL-01',
          database: 'Sonic_DW',
          schema: 'dbo',
          type: 'procedure',
          reads_from: [stageId, dimVinId, tableId],
          writes_to: [tableId],
          definition: `
            UPDATE tgt
               SET tgt.ModelName = src.ModelName
              FROM dbo.SynWrkDimVehicleVehicle AS src
              INNER JOIN dbo.DimVehicle AS tgt
                ON src.VehicleKey = tgt.VehicleKey;

            INSERT INTO dbo.DimVehicle (VehicleKey, ModelName)
            SELECT src.VehicleKey, src.ModelName
              FROM dbo.SynWrkDimVehicleVehicle AS src
              LEFT JOIN dbo.DimVehicle AS tgt
                ON src.VehicleKey = tgt.VehicleKey
             WHERE tgt.VehicleKey IS NULL;
          `,
        },
      ],
      [
        packageId,
        {
          id: packageId,
          name: 'DimVehicle_DIM_DimVehicle.dtsx',
          server: 'V1-SSIS25-01',
          database: 'SSISDB',
          schema: 'dbo',
          packageName: 'DimVehicle_DIM_DimVehicle.dtsx',
          packagePath: '/DimVehicle/DimVehicle_DIM_DimVehicle.dtsx',
          type: 'ssis_package',
          calls: [procId],
        },
      ],
      [
        stageId,
        {
          id: stageId,
          name: 'SynWrkDimVehicleVehicle',
          server: 'L1-5FSQL-01',
          database: 'Sonic_DW',
          schema: 'dbo',
          type: 'synonym',
        },
      ],
      [
        dimVinId,
        {
          id: dimVinId,
          name: 'DimVin',
          server: 'L1-5FSQL-01',
          database: 'Sonic_DW',
          schema: 'dbo',
          type: 'table',
        },
      ],
      [
        viewId,
        {
          id: viewId,
          name: 'vwDimVehicle',
          server: 'L1-5FSQL-01',
          database: 'Sonic_DW',
          schema: 'dbo',
          type: 'view',
          reads_from: [tableId],
        },
      ],
    ]);
  }

  test('builds a full-lineage answer with plain English and table-ready impacted objects', () => {
    const answer = buildLineageAnswer(buildObjects(), {
      object_id: tableId,
      intent: 'full_lineage',
    });

    expect(answer.plain_english).toContain('DimVehicle is maintained by dbo.usp_DimVehicle.');
    expect(answer.caveats).toEqual(
      expect.arrayContaining([
        expect.stringContaining('Maintenance reads are shown separately'),
      ])
    );
    expect(answer.impacted_objects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          role: 'Orchestrates load',
          id: packageId,
        }),
        expect.objectContaining({
          role: 'Loads target',
          id: procId,
          operation: 'upsert_write',
        }),
        expect.objectContaining({
          role: 'Source input',
          id: stageId,
        }),
        expect.objectContaining({
          role: 'Business consumer',
          id: viewId,
        }),
        expect.objectContaining({
          role: 'Maintenance read',
          id: procId,
        }),
      ])
    );
  });

  test('builds a uses answer without target-maintenance reads', () => {
    const answer = buildLineageAnswer(buildObjects(), {
      object_id: tableId,
      intent: 'uses',
    });

    expect(answer.intent).toBe('uses');
    expect(answer.impacted_objects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          role: 'Business consumer',
          id: viewId,
        }),
        expect.objectContaining({
          role: 'Maintenance read',
          id: procId,
        }),
        expect.objectContaining({
          role: 'Orchestrates load',
          id: packageId,
        }),
      ])
    );
    expect(answer.plain_english).toContain('1 downstream business consumer, 1 maintenance/load-path procedure');
    expect(answer.plain_english).toContain('1 orchestrating SSIS package');
    expect(answer.caveats).toEqual(
      expect.arrayContaining([
        expect.stringContaining('shown separately'),
      ])
    );
  });

  test('returns help examples that teach question phrasing', () => {
    const help = buildLineageQuestionHelp();

    expect(help.plain_english).toContain('Use "feeds" for upstream sources');
    expect(help.examples).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          prompt: 'what loads DimVehicle?',
        }),
        expect.objectContaining({
          prompt: 'tell me about the business logic in dbo.usp_DimVehicle',
        }),
      ])
    );
  });
});
