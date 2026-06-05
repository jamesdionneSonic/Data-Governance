import {
  buildSemanticLineageEdges,
  buildSemanticLineagePack,
} from '../../src/services/semanticLineageService.js';

describe('Semantic Lineage Service', () => {
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

  test('classifies upsert writes, maintenance reads, and orchestration separately', () => {
    const edges = buildSemanticLineageEdges(buildObjects());

    expect(edges).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          source: procId,
          target: tableId,
          semantic_type: 'upsert_write',
          raw_types: expect.arrayContaining(['writes_to', 'created_by']),
        }),
        expect.objectContaining({
          source: tableId,
          target: procId,
          semantic_type: 'target_maintenance_read',
          show_in_downstream: false,
        }),
        expect.objectContaining({
          source: stageId,
          target: procId,
          semantic_type: 'source_read',
        }),
        expect.objectContaining({
          source: dimVinId,
          target: procId,
          semantic_type: 'lookup_read',
        }),
        expect.objectContaining({
          source: packageId,
          target: procId,
          semantic_type: 'orchestrates',
        }),
        expect.objectContaining({
          source: tableId,
          target: viewId,
          semantic_type: 'business_consumer_read',
        }),
      ])
    );
  });

  test('builds a compact lineage pack with plain-English maintenance caveats', () => {
    const pack = buildSemanticLineagePack(buildObjects(), tableId);

    expect(pack.summary.plain_english).toContain('DimVehicle is maintained by dbo.usp_DimVehicle.');
    expect(pack.summary.plain_english).toContain('orchestrates dbo.usp_DimVehicle');
    expect(pack.summary.plain_english).toContain('maintenance read, not a downstream business dependency');
    expect(pack.summary.counts).toEqual(
      expect.objectContaining({
        loaders: 1,
        source_inputs: 1,
        lookup_dependencies: 1,
        business_consumers: 1,
        maintenance_reads: 1,
        orchestrators: 1,
      })
    );
    expect(pack.loaders[0]).toEqual(
      expect.objectContaining({
        id: procId,
        operation: 'upsert_write',
      })
    );
    expect(pack.maintenance_reads[0]).toEqual(
      expect.objectContaining({
        id: procId,
        semantic_type: 'target_maintenance_read',
      })
    );
  });
});
