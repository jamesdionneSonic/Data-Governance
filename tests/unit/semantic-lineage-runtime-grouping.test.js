import { deriveSemanticLineageGroups } from '../../src/services/semanticLineageRuntimeGrouping.js';

describe('Semantic Lineage Runtime Grouping', () => {
  test('keeps business consumers and maintenance/load-path procedures as separate named groups', () => {
    const objectId = 'L1-5FSQL-01.Sonic_DW.dbo.DimVehicle';
    const contextPack = {
      lineage: {
        direct_edges: [
          {
            type: 'created_by',
            source: 'L1-5FSQL-01.Sonic_DW.dbo.usp_DimVehicle',
            target: objectId,
          },
          {
            type: 'loads',
            source: 'L1-5FSQL-01.Sonic_DW.dbo.usp_Process_DimVehicle_NewVehicleKey',
            target: objectId,
          },
          {
            type: 'used_by',
            source: objectId,
            target: 'L1-5FSQL-01.Sonic_DW.dbo.usp_DimVehicle',
          },
          {
            type: 'reads',
            source: objectId,
            target: 'L1-5FSQL-01.Sonic_DW.dbo.usp_Process_DimVehicle_NewVehicleKey',
          },
          {
            type: 'used_by',
            source: objectId,
            target: 'L1-5FSQL-01.Sonic_DW.dbo.vwDimVehicle',
          },
          {
            type: 'used_by',
            source: objectId,
            target: 'L1-5FSQL-01.Sonic_DW.dbo.usp_MCIDMSServicedata',
          },
        ],
      },
    };

    const groups = deriveSemanticLineageGroups(objectId, contextPack, {
      orchestratorsByTarget: new Map([
        [
          'L1-5FSQL-01.Sonic_DW.dbo.usp_DimVehicle',
          new Set([
            'V1-SSIS25-01, 11040.SSISDB.DimVehicle.DimVehicle.DimVehicle_DIM_DimVehicle.dtsx',
          ]),
        ],
        [
          'L1-5FSQL-01.Sonic_DW.dbo.usp_Process_DimVehicle_NewVehicleKey',
          new Set(['V1-SSIS25-01, 11040.SSISDB.DimVehicle.DimVehicle.DimVehicle_Master.dtsx']),
        ],
      ]),
    });

    expect(groups.counts).toEqual({
      loaders: 2,
      business_consumers: 2,
      maintenance_reads: 2,
      orchestrators: 2,
    });
    expect(groups.business_consumers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          object_id: 'L1-5FSQL-01.Sonic_DW.dbo.vwDimVehicle',
          object_type: 'view',
          role: 'Business consumer view',
        }),
        expect.objectContaining({
          object_id: 'L1-5FSQL-01.Sonic_DW.dbo.usp_MCIDMSServicedata',
          object_type: 'procedure',
          role: 'Business consumer procedure',
        }),
      ])
    );
    expect(groups.maintenance_reads).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          object_id: 'L1-5FSQL-01.Sonic_DW.dbo.usp_DimVehicle',
          role: 'Maintenance / load-path procedure',
        }),
        expect.objectContaining({
          object_id: 'L1-5FSQL-01.Sonic_DW.dbo.usp_Process_DimVehicle_NewVehicleKey',
          role: 'Maintenance / load-path procedure',
        }),
      ])
    );
    expect(groups.orchestrators).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          object_id:
            'V1-SSIS25-01, 11040.SSISDB.DimVehicle.DimVehicle.DimVehicle_DIM_DimVehicle.dtsx',
          role: 'Orchestrating SSIS package',
        }),
        expect.objectContaining({
          object_id: 'V1-SSIS25-01, 11040.SSISDB.DimVehicle.DimVehicle.DimVehicle_Master.dtsx',
          role: 'Orchestrating SSIS package',
        }),
      ])
    );
    expect(groups.downstream_groups).toEqual({
      business_consumers: [
        'L1-5FSQL-01.Sonic_DW.dbo.vwDimVehicle',
        'L1-5FSQL-01.Sonic_DW.dbo.usp_MCIDMSServicedata',
      ],
      maintenance_reads: [
        'L1-5FSQL-01.Sonic_DW.dbo.usp_DimVehicle',
        'L1-5FSQL-01.Sonic_DW.dbo.usp_Process_DimVehicle_NewVehicleKey',
      ],
      orchestrators: [
        'V1-SSIS25-01, 11040.SSISDB.DimVehicle.DimVehicle.DimVehicle_DIM_DimVehicle.dtsx',
        'V1-SSIS25-01, 11040.SSISDB.DimVehicle.DimVehicle.DimVehicle_Master.dtsx',
      ],
    });
  });
});
