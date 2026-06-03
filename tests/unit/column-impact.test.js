import { analyzeColumnImpact } from '../../src/services/columnImpactService.js';

describe('Column Impact Service', () => {
  const sourceId = 'DW01.VendorData.jma.SourceClaims';
  const stagingId = 'DW01.StagingDB.jma.StgClaims';
  const factId = 'DW01.Sonic_DW.dbo.FactClaim';
  const packageId = 'SSIS01.SSISDB.Claims.Claims.LoadClaims.dtsx';
  const procId = 'DW01.Sonic_DW.etl.LoadFactClaim';
  const viewId = 'DW01.Sonic_DW.reporting.vwClaimSummary';

  function buildObjects() {
    return new Map([
      [
        sourceId,
        {
          id: sourceId,
          name: 'SourceClaims',
          database: 'VendorData',
          schema: 'jma',
          type: 'table',
          columns: [{ name: 'Amount', column_id: `${sourceId}.Amount`, data_type: 'decimal' }],
        },
      ],
      [
        stagingId,
        {
          id: stagingId,
          name: 'StgClaims',
          database: 'StagingDB',
          schema: 'jma',
          type: 'table',
          columns: [{ name: 'Amount', column_id: `${stagingId}.Amount`, data_type: 'decimal' }],
        },
      ],
      [
        factId,
        {
          id: factId,
          name: 'FactClaim',
          database: 'Sonic_DW',
          schema: 'dbo',
          type: 'table',
          columns: [
            { name: 'ClaimAmount', column_id: `${factId}.ClaimAmount`, data_type: 'decimal' },
          ],
        },
      ],
      [
        packageId,
        {
          id: packageId,
          name: 'LoadClaims.dtsx',
          database: 'ssisdb',
          type: 'package',
          column_lineage: [
            {
              source_column_id: `${sourceId}.Amount`,
              target_column_id: `${stagingId}.Amount`,
              process_id: packageId,
              transform_type: 'direct',
              evidence_type: 'ssis_dataflow_column_mapping',
              evidence_text: 'InputColumn=Amount; ExternalColumn=Amount',
              validation_status: 'validated',
              confidence: 1,
            },
          ],
        },
      ],
      [
        procId,
        {
          id: procId,
          name: 'LoadFactClaim',
          database: 'Sonic_DW',
          schema: 'etl',
          type: 'procedure',
          column_usage: [
            {
              column_id: `${stagingId}.Amount`,
              process_id: procId,
              column_name: 'Amount',
              usage_type: 'read',
              usage_context: 'insert_select',
              evidence_type: 'sql_definition',
              evidence_text: 'src.Amount',
              validation_status: 'validated',
            },
            {
              column_id: `${factId}.ClaimAmount`,
              process_id: procId,
              column_name: 'ClaimAmount',
              usage_type: 'insert_target',
              usage_context: 'insert_column_list',
              evidence_type: 'sql_definition',
              evidence_text: 'ClaimAmount',
              validation_status: 'validated',
            },
          ],
          column_lineage: [
            {
              source_column_id: `${stagingId}.Amount`,
              target_column_id: `${factId}.ClaimAmount`,
              process_id: procId,
              transform_type: 'calculation',
              expression: 'src.Amount * 1.0',
              evidence_type: 'sql_definition',
              evidence_text: 'src.Amount * 1.0 AS ClaimAmount',
              validation_status: 'validated',
              confidence: 0.95,
            },
          ],
          column_risk_flags: [
            {
              process_id: procId,
              flag_type: 'insert_without_column_list',
              severity: 'high',
              reason: 'Positional insert risk',
              evidence_type: 'sql_definition',
              evidence_text: 'INSERT INTO dbo.FactClaim SELECT ...',
              validation_status: 'risk_flag',
            },
          ],
        },
      ],
      [
        viewId,
        {
          id: viewId,
          name: 'vwClaimSummary',
          database: 'Sonic_DW',
          schema: 'reporting',
          type: 'view',
          column_usage: [
            {
              column_id: `${factId}.ClaimAmount`,
              process_id: viewId,
              column_name: 'ClaimAmount',
              usage_type: 'read',
              usage_context: 'select_list',
              evidence_type: 'sql_definition',
              evidence_text: 'FactClaim.ClaimAmount',
              validation_status: 'validated',
            },
          ],
        },
      ],
    ]);
  }

  test('reports dropped-column impact through downstream lineage and SQL usage', () => {
    const result = analyzeColumnImpact(buildObjects(), {
      object_id: sourceId,
      column_name: 'Amount',
      change_type: 'drop_column',
    });

    expect(result.summary.impacted_count).toBeGreaterThanOrEqual(4);
    expect(result.impacts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          process_id: packageId,
          column_id: `${stagingId}.Amount`,
          impact_type: 'runtime_load_failure',
          severity: 'critical',
        }),
        expect.objectContaining({
          process_id: procId,
          column_id: `${stagingId}.Amount`,
          impact_type: 'compile_time_break',
          severity: 'high',
        }),
        expect.objectContaining({
          process_id: procId,
          column_id: `${factId}.ClaimAmount`,
          severity: 'critical',
        }),
        expect.objectContaining({
          process_id: viewId,
          column_id: `${factId}.ClaimAmount`,
          impact_type: 'compile_time_break',
        }),
      ])
    );
    expect(result.unresolved_risks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          process_id: procId,
          flag_type: 'insert_without_column_list',
          severity: 'high',
        }),
      ])
    );
  });

  test('reports resized-column impact as downstream data quality and load risk', () => {
    const result = analyzeColumnImpact(buildObjects(), {
      column_id: `${sourceId}.Amount`,
      change_type: 'change_length_precision_scale',
    });

    expect(result.summary.highest_severity).toBe('high');
    expect(result.impacts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          process_id: packageId,
          column_id: `${stagingId}.Amount`,
          severity: 'medium',
        }),
        expect.objectContaining({
          process_id: procId,
          column_id: `${factId}.ClaimAmount`,
          impact_type: 'data_quality_risk',
          severity: 'high',
        }),
        expect.objectContaining({
          process_id: viewId,
          column_id: `${factId}.ClaimAmount`,
          impact_type: 'data_quality_risk',
        }),
      ])
    );
  });
});
