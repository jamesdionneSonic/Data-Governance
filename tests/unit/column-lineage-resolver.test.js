import { resolveColumnLineage } from '../../src/services/columnLineageResolver.js';

describe('Column Lineage Resolver', () => {
  const sourceTableId = 'DW01.StagingDB.dbo.SourceClaims';
  const targetTableId = 'DW01.Sonic_DW.dbo.FactClaim';
  const packageId = 'SSIS01.SSISDB.Claims.Claims.LoadClaims.dtsx';
  const procId = 'DW01.Sonic_DW.etl.LoadFactClaim';

  function buildObjects() {
    return new Map([
      [
        sourceTableId,
        {
          id: sourceTableId,
          name: 'SourceClaims',
          database: 'StagingDB',
          schema: 'dbo',
          type: 'table',
          columns: [
            { name: 'ClaimID', column_id: `${sourceTableId}.ClaimID` },
            { name: 'ClaimAmount', column_id: `${sourceTableId}.ClaimAmount` },
          ],
        },
      ],
      [
        targetTableId,
        {
          id: targetTableId,
          name: 'FactClaim',
          database: 'Sonic_DW',
          schema: 'dbo',
          type: 'table',
          columns: [
            { name: 'ClaimID', column_id: `${targetTableId}.ClaimID` },
            { name: 'ClaimAmount', column_id: `${targetTableId}.ClaimAmount` },
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
          reads_from: [sourceTableId],
          writes_to: [targetTableId],
          ssis_column_mappings: [
            {
              package_id: packageId,
              component_name: 'OLE DB Destination',
              component_type: 'Microsoft.OLEDBDestination',
              source_object: 'StagingDB.dbo.SourceClaims',
              destination_object: 'Sonic_DW.dbo.FactClaim',
              input_column: 'ClaimID',
              output_column: 'ClaimID',
              external_metadata_column: 'ClaimID',
              transform_type: 'direct',
              expression: 'ClaimID',
              evidence_type: 'ssis_dataflow_column_mapping',
              evidence_text: 'InputColumn=ClaimID; ExternalColumn=ClaimID',
              validation_status: 'validated',
            },
            {
              package_id: packageId,
              component_name: 'Flat File Destination',
              component_type: 'Microsoft.OLEDBDestination',
              source_object: 'Flat File Source',
              destination_object: 'Sonic_DW.dbo.FactClaim',
              input_column: 'ClaimAmount',
              output_column: 'ClaimAmount',
              external_metadata_column: 'ClaimAmount',
              transform_type: 'rename',
              expression: 'ClaimAmount',
              evidence_type: 'ssis_dataflow_column_mapping',
              evidence_text: 'InputColumn=ClaimAmount; ExternalColumn=ClaimAmount',
              validation_status: 'validated',
            },
          ],
          unresolved_ssis_column_mappings: [
            {
              package_id: packageId,
              component_name: 'DynamicClaimsConnection',
              reason: 'dynamic_connection_manager',
              evidence_type: 'ssis_dynamic_connection',
              evidence_text: '@[User::ClaimsConnectionString]',
              validation_status: 'unresolved',
            },
          ],
        },
      ],
      [
        `${packageId}.ssis_column_mappings.chunk_001`,
        {
          id: `${packageId}.ssis_column_mappings.chunk_001`,
          package_id: packageId,
          name: 'LoadClaims.dtsx.column_mappings.chunk_001',
          database: 'ssisdb',
          type: 'dataset',
          reads_from: [sourceTableId],
          writes_to: [targetTableId],
          ssis_column_mappings: [
            {
              package_id: packageId,
              component_name: 'OLE DB Destination',
              component_type: 'Microsoft.OLEDBDestination',
              source_object: 'SourceClaims',
              destination_object: 'FactClaim',
              input_column: 'ClaimAmount',
              output_column: 'ClaimAmount',
              external_metadata_column: 'ClaimAmount',
              transform_type: 'direct',
              expression: 'ClaimAmount',
              evidence_type: 'ssis_dataflow_column_mapping',
              evidence_text: 'sidecar full mapping',
              validation_status: 'validated',
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
              column_id: `${targetTableId}.ClaimAmount`,
              object_id: targetTableId,
              process_id: procId,
              column_name: 'ClaimAmount',
              usage_type: 'insert_target',
              usage_context: 'insert_column_list',
              expression: 'ClaimAmount',
              evidence_type: 'sql_definition',
              evidence_text: 'ClaimAmount',
              validation_status: 'validated',
            },
            {
              column_id: `${sourceTableId}.ClaimAmount`,
              object_id: sourceTableId,
              process_id: procId,
              column_name: 'ClaimAmount',
              usage_type: 'read',
              usage_context: 'insert_column_list',
              expression: 'src.ClaimAmount',
              evidence_type: 'sql_definition',
              evidence_text: 'src.ClaimAmount',
              validation_status: 'validated',
            },
          ],
          column_lineage: [
            {
              source_column_id: 'DW01.StagingDB.dbo.SourceClaims.DoesNotExist',
              target_column_id: `${targetTableId}.ClaimID`,
              process_id: procId,
              transform_type: 'direct',
              evidence_type: 'existing_column_lineage',
              evidence_text: 'bad source id',
              validation_status: 'validated',
            },
          ],
        },
      ],
    ]);
  }

  it('separates validated, probable, unresolved, and rejected column mappings', () => {
    const result = resolveColumnLineage(buildObjects());

    expect(result.validated).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          source_column_id: `${sourceTableId}.ClaimID`,
          target_column_id: `${targetTableId}.ClaimID`,
          process_id: packageId,
          transform_type: 'direct',
          validation_status: 'validated',
          confidence: 1,
        }),
        expect.objectContaining({
          source_column_id: `${sourceTableId}.ClaimAmount`,
          target_column_id: `${targetTableId}.ClaimAmount`,
          process_id: packageId,
          transform_type: 'rename',
          validation_status: 'validated',
        }),
        expect.objectContaining({
          source_column_id: `${sourceTableId}.ClaimAmount`,
          target_column_id: `${targetTableId}.ClaimAmount`,
          process_id: packageId,
          transform_type: 'direct',
          evidence_text: 'sidecar full mapping',
          validation_status: 'validated',
        }),
      ])
    );

    expect(result.probable).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          process_id: procId,
          source_column_id: `${sourceTableId}.ClaimAmount`,
          target_column_id: `${targetTableId}.ClaimAmount`,
          reason: 'sql_column_usage_does_not_encode_explicit_source_target_mapping_id',
          validation_status: 'probable',
        }),
      ])
    );

    expect(result.unresolved).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          process_id: packageId,
          reason: 'dynamic_connection_manager',
          validation_status: 'unresolved',
        }),
      ])
    );

    expect(result.rejected).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          process_id: procId,
          source_column_id: 'DW01.StagingDB.dbo.SourceClaims.DoesNotExist',
          target_column_id: `${targetTableId}.ClaimID`,
          reason: 'source_canonical_column_id_not_found',
          validation_status: 'rejected',
        }),
      ])
    );
  });
});
