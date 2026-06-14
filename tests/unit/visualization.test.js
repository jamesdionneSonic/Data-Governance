import { buildCenteredLineageGraph } from '../../src/services/visualizationService.js';

describe('Visualization Service', () => {
  it('includes parent SSIS packages when bridge tables are loaded by child packages', () => {
    const focusId = 'L1-5FSQL-01.Sonic_DW.dbo.FACT_JMA_CLAIMS_TBL';
    const loadFactProcId = 'L1-5FSQL-01.ETL_Staging.JMA.LOAD_FACT_JMA_CLAIMS_TBL';
    const etlTableId = 'L1-5FSQL-01.ETL_Staging.JMA.ETL_STG_JMA_CLAIMS_FINANCIAL_TRANSACTIONS_TBL';
    const loadVendorProcId = 'L1-5FSQL-01.ETL_Staging.JMA.Load_Claim_Financial_Transactions';
    const vendorTableId = 'L1-DWASQL-02,12010.VendorData.JMA.JMA_CLAIMS_FINANCIAL_TRANSACTIONS_TBL';
    const stagingTableId =
      'L1-DWASQL-02,12010.StagingDB.JMA.STG_JMA_CLAIMS_FINANCIAL_TRANSACTIONS_TBL';
    const childPackageId = 'V1-SSIS25-01, 11040.SSISDB.DOWC.DOWC.Dowc_ClaimsFileLoad.dtsx';
    const masterPackageId = 'V1-SSIS25-01, 11040.SSISDB.DOWC.DOWC.DOWC_Master_Dev.dtsx';

    const objects = new Map([
      [
        focusId,
        {
          id: focusId,
          name: 'FACT_JMA_CLAIMS_TBL',
          database: 'Sonic_DW',
          schema: 'dbo',
          type: 'table',
        },
      ],
      [
        loadFactProcId,
        {
          id: loadFactProcId,
          name: 'LOAD_FACT_JMA_CLAIMS_TBL',
          database: 'ETL_Staging',
          schema: 'JMA',
          type: 'procedure',
          reads_from: [etlTableId],
          writes_to: [focusId],
        },
      ],
      [
        etlTableId,
        {
          id: etlTableId,
          name: 'ETL_STG_JMA_CLAIMS_FINANCIAL_TRANSACTIONS_TBL',
          database: 'ETL_Staging',
          schema: 'JMA',
          type: 'table',
        },
      ],
      [
        loadVendorProcId,
        {
          id: loadVendorProcId,
          name: 'Load_Claim_Financial_Transactions',
          database: 'ETL_Staging',
          schema: 'JMA',
          type: 'procedure',
          reads_from: [vendorTableId],
          writes_to: [etlTableId],
        },
      ],
      [
        vendorTableId,
        {
          id: vendorTableId,
          name: 'JMA_CLAIMS_FINANCIAL_TRANSACTIONS_TBL',
          database: 'VendorData',
          schema: 'JMA',
          type: 'table',
          created_by: [stagingTableId],
        },
      ],
      [
        stagingTableId,
        {
          id: stagingTableId,
          name: 'STG_JMA_CLAIMS_FINANCIAL_TRANSACTIONS_TBL',
          database: 'StagingDB',
          schema: 'JMA',
          type: 'table',
        },
      ],
      [
        childPackageId,
        {
          id: childPackageId,
          name: 'DOWC.DOWC.Dowc_ClaimsFileLoad.dtsx',
          packageName: 'Dowc_ClaimsFileLoad.dtsx',
          packagePath: 'DOWC.DOWC.Dowc_ClaimsFileLoad.dtsx',
          database: 'ssisdb',
          type: 'package',
          writes_to: [stagingTableId, vendorTableId],
          calls: [loadVendorProcId],
        },
      ],
      [
        masterPackageId,
        {
          id: masterPackageId,
          name: 'DOWC.DOWC.DOWC_Master_Dev.dtsx',
          packageName: 'DOWC_Master_Dev.dtsx',
          packagePath: 'DOWC.DOWC.DOWC_Master_Dev.dtsx',
          database: 'ssisdb',
          type: 'package',
          calls: [childPackageId],
        },
      ],
    ]);

    const graph = buildCenteredLineageGraph(focusId, objects, { maxBridgeDepth: 6 });
    const nodeIds = graph.nodes.map((node) => node.data.id);

    expect(nodeIds).toContain(masterPackageId);
    expect(graph.edges).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          data: expect.objectContaining({
            source: masterPackageId,
            target: childPackageId,
            label: 'runs',
          }),
        }),
      ])
    );
  });
});
