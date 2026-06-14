import {
  buildSemanticLineageEdges,
  buildSemanticLineagePack,
} from '../../src/services/semanticLineageService.js';
import {
  SsisMetadataExtractor,
  parseSsisPackageXmlForLineage,
} from '../../src/services/ssisExtractor.js';
import {
  applyExactPackageProcedureChainStitching,
  applyExactSsisPackageTableEdges,
  applySynonymSourceExpansion,
  applyCatalogFreshnessDiagnostics,
  applyLineageRoleClassifications,
  applySsisBridgeInferences,
  catalogFreshnessDiagnostic,
  classifyLineageObjectRole,
  sqlRawQuarantineReason,
} from '../../scripts/rebuild-catalog-from-raw.mjs';

describe('Lineage engine rule contracts', () => {
  test('does not promote contextual or column-shape evidence into hard writer edges', () => {
    const targetId = 'L1-5FSQL-01.Sonic_DW.wrk.update_Aso_data';
    const siblingId = 'L1-5FSQL-01.Sonic_DW.dbo.DimAssociate';
    const packageId = 'V1-SSIS25-01.SSISDB.Associate.Associate_Load.dtsx';
    const objects = new Map([
      [
        targetId,
        {
          id: targetId,
          name: 'update_Aso_data',
          server: 'L1-5FSQL-01',
          database: 'Sonic_DW',
          schema: 'wrk',
          type: 'table',
          contextual_reads: [siblingId, packageId],
          inferred_edges: [
            {
              source: siblingId,
              target: targetId,
              type: 'column_match',
              confidence: 0.8,
            },
          ],
        },
      ],
      [
        siblingId,
        {
          id: siblingId,
          name: 'DimAssociate',
          server: 'L1-5FSQL-01',
          database: 'Sonic_DW',
          schema: 'dbo',
          type: 'table',
        },
      ],
      [
        packageId,
        {
          id: packageId,
          name: 'Associate_Load.dtsx',
          server: 'V1-SSIS25-01',
          database: 'SSISDB',
          type: 'ssis_package',
        },
      ],
    ]);

    const edges = buildSemanticLineageEdges(objects);

    expect(edges).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          source: siblingId,
          target: targetId,
        }),
        expect.objectContaining({
          source: packageId,
          target: targetId,
        }),
      ])
    );
  });

  test('materializes exact procedure writer evidence once and keeps maintenance reads separate', () => {
    const targetId = 'L1-5FSQL-01.Sonic_DW.dbo.DimVehicle';
    const procId = 'L1-5FSQL-01.Sonic_DW.dbo.usp_DimVehicle';
    const stageId = 'L1-5FSQL-01.ETL_Staging.stage.DimVehicle';
    const objects = new Map([
      [
        targetId,
        {
          id: targetId,
          name: 'DimVehicle',
          server: 'L1-5FSQL-01',
          database: 'Sonic_DW',
          schema: 'dbo',
          type: 'table',
          created_by: [procId],
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
          reads_from: [stageId, targetId],
          writes_to: [targetId],
          definition: `
            UPDATE tgt
               SET tgt.ModelName = src.ModelName
              FROM dbo.DimVehicle AS tgt
              JOIN ETL_Staging.stage.DimVehicle AS src
                ON src.VehicleKey = tgt.VehicleKey;

            INSERT INTO dbo.DimVehicle (VehicleKey, ModelName)
            SELECT VehicleKey, ModelName
              FROM ETL_Staging.stage.DimVehicle;
          `,
        },
      ],
      [
        stageId,
        {
          id: stageId,
          name: 'DimVehicle',
          server: 'L1-5FSQL-01',
          database: 'ETL_Staging',
          schema: 'stage',
          type: 'table',
        },
      ],
    ]);

    const edges = buildSemanticLineageEdges(objects);
    const writeEdges = edges.filter(
      (edge) => edge.source === procId && edge.target === targetId && /_write$|^write$/.test(edge.semantic_type)
    );
    const pack = buildSemanticLineagePack(objects, targetId);

    expect(writeEdges).toHaveLength(1);
    expect(writeEdges[0]).toEqual(
      expect.objectContaining({
        semantic_type: 'upsert_write',
        confidence: 0.95,
      })
    );
    expect(pack.summary.counts).toEqual(
      expect.objectContaining({
        loaders: 1,
        maintenance_reads: 1,
        source_inputs: 1,
      })
    );
    expect(pack.maintenance_reads[0]).toEqual(
      expect.objectContaining({
        id: procId,
        show_in_downstream: false,
      })
    );
  });

  test('keeps same-name objects in different schemas as separate lineage targets', () => {
    const dboTargetId = 'L1-5FSQL-01.ETL_Staging.dbo.dwFullOpportunity';
    const stageTargetId = 'L1-5FSQL-01.ETL_Staging.stage.dwFullOpportunity';
    const procId = 'L1-5FSQL-01.ETL_Staging.dbo.uspLoadStageOpportunity';
    const objects = new Map([
      [
        dboTargetId,
        {
          id: dboTargetId,
          name: 'dwFullOpportunity',
          server: 'L1-5FSQL-01',
          database: 'ETL_Staging',
          schema: 'dbo',
          type: 'table',
        },
      ],
      [
        stageTargetId,
        {
          id: stageTargetId,
          name: 'dwFullOpportunity',
          server: 'L1-5FSQL-01',
          database: 'ETL_Staging',
          schema: 'stage',
          type: 'table',
        },
      ],
      [
        procId,
        {
          id: procId,
          name: 'uspLoadStageOpportunity',
          server: 'L1-5FSQL-01',
          database: 'ETL_Staging',
          schema: 'dbo',
          type: 'procedure',
          writes_to: [stageTargetId],
          definition: 'INSERT INTO stage.dwFullOpportunity SELECT * FROM dbo.SourceOpportunity;',
        },
      ],
    ]);

    const edges = buildSemanticLineageEdges(objects);

    expect(edges).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          source: procId,
          target: stageTargetId,
        }),
      ])
    );
    expect(edges).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          source: procId,
          target: dboTargetId,
        }),
      ])
    );
  });

  test('creates exact SSIS component read/write edges without package-name guessing', () => {
    const xml = `
      <DTS:Executable xmlns:DTS="www.microsoft.com/SqlServer/Dts">
        <pipeline>
          <components>
            <component componentClassID="Microsoft.OLEDBSource" name="SODB - StgCensusEmplWages">
              <properties>
                <property name="OpenRowset">dbo.StgCensusEmplWages</property>
              </properties>
              <connections>
                <connection connectionManagerRefId="Project.ConnectionManagers[StagingDB]" />
              </connections>
            </component>
            <component componentClassID="Microsoft.OLEDBDestination" name="DODB - CensusDataLoad">
              <properties>
                <property name="OpenRowset">dbo.CensusEmplWages</property>
              </properties>
              <connections>
                <connection connectionManagerRefId="Project.ConnectionManagers[VendorData]" />
              </connections>
            </component>
          </components>
        </pipeline>
      </DTS:Executable>
    `;
    const parsed = parseSsisPackageXmlForLineage(xml, {
      serverName: 'V1-SSIS25-01, 11040',
      folderName: 'CensusDataLoad',
      projectName: 'CensusDataLoad',
      packageName: 'CensusDataLoad.dtsx',
    });
    const extractor = new SsisMetadataExtractor({
      server: 'V1-SSIS25-01, 11040',
      ssisProjectConnectionOverrides: {
        CensusDataLoad: {
          StagingDB: {
            serverName: 'L1-5FSQL-01',
            databaseName: 'StagingDB',
          },
          VendorData: {
            serverName: 'L1-DWASQL-02,12010',
            databaseName: 'VendorData',
          },
        },
      },
    });

    const edges = extractor.buildLineageEdges(
      [
        {
          folder_name: 'CensusDataLoad',
          project_name: 'CensusDataLoad',
          package_name: 'CensusDataLoad.dtsx',
        },
      ],
      [parsed],
      { jobs: [], ssisSteps: [] },
      [],
      {}
    );

    expect(edges).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          edgeType: 'READS_FROM',
          to: 'L1-5FSQL-01.StagingDB.dbo.StgCensusEmplWages',
          validation_status: 'validated',
          evidence_type: 'ssis_dataflow_source',
        }),
        expect.objectContaining({
          edgeType: 'WRITES_TO',
          to: 'L1-DWASQL-02,12010.VendorData.dbo.CensusEmplWages',
          validation_status: 'validated',
          evidence_type: 'ssis_dataflow_destination',
        }),
      ])
    );
    expect(edges.map((edge) => edge.id || `${edge.from}->${edge.to}:${edge.edgeType}`)).toEqual(
      Array.from(new Set(edges.map((edge) => edge.id || `${edge.from}->${edge.to}:${edge.edgeType}`)))
    );
  });

  test('classifies sampled unresolved object families without inventing creator edges', () => {
    const cases = [
      [
        'clone/dev/backup',
        {
          type: 'table',
          database: 'Sonic_DW',
          schema: 'dbo',
          name: 'Fact_HFM_bk_20230712',
          row_count: 0,
        },
        {
          lineage_role: 'clone_dev_backup_table',
          status: 'clone_or_backup_unresolved',
        },
      ],
      [
        'manual/reference',
        {
          type: 'table',
          database: 'ETL_Staging',
          schema: 'dbo',
          name: 'ManualJournalData',
          row_count: 3,
        },
        {
          lineage_role: 'manual_or_reference_seed',
          status: 'manual_or_reference_seed_unresolved',
        },
      ],
      [
        'test/error-output',
        {
          type: 'table',
          database: 'StagingDB',
          schema: 'dbo',
          name: 'Pgc_Vehicle_Staging_error_Output',
          row_count: 0,
        },
        {
          lineage_role: 'test_or_error_artifact',
          status: 'test_or_error_artifact_unresolved',
        },
      ],
      [
        'transient work artifact',
        {
          type: 'table',
          database: 'Sonic_DW',
          schema: 'dbo',
          name: 'Processed_synd',
          row_count: 0,
        },
        {
          lineage_role: 'transient_work_artifact',
          status: 'transient_work_artifact_unresolved',
        },
      ],
      [
        'vendor external output',
        {
          type: 'table',
          database: 'VendorData',
          schema: 'dbo',
          name: 'TSDSubsidyMetrics',
          contextual_reads: ['L1-DWASQL-02,12010.VendorData.dbo.TSDSubsidyMetrics_EP'],
          row_count: 0,
        },
        {
          lineage_role: 'external_vendor_output_unresolved',
          status: 'external_vendor_output_unresolved',
        },
      ],
      [
        'application-owned process',
        {
          type: 'table',
          database: 'VendorData',
          schema: 'buyer',
          name: 'VINsProcByAutomation',
          row_count: 100,
          columns: [
            { name: 'RetryPending' },
            { name: 'RetryCounter' },
            { name: 'RecordCreationDate' },
          ],
        },
        {
          lineage_role: 'application_owned_process_table',
          status: 'application_owned_final_writer_unresolved',
          training_label: 'unresolved_final_writer',
        },
      ],
      [
        'final writer unresolved with probable evidence',
        {
          type: 'table',
          database: 'VendorData',
          schema: 'buyer',
          name: 'CBAPurchasesByVIN',
          row_count: 1000,
          probable_edges: [
            {
              source: 'CBS.dbo.vwRetailDailyPurchases',
              validation_status: 'review',
            },
          ],
        },
        {
          lineage_role: 'final_writer_unresolved_with_strong_upstream_evidence',
          status: 'final_writer_unresolved_with_strong_upstream_evidence',
          training_label: 'unresolved_final_writer',
        },
      ],
      [
        'intermediate stage review',
        {
          type: 'table',
          database: 'ETL_Staging',
          schema: 'stage',
          name: 'CustomerIMAMMergeStaging',
          row_count: 0,
        },
        {
          lineage_role: 'empty_intermediate_review',
          status: 'empty_intermediate_unresolved',
        },
      ],
    ];

    for (const [, frontmatter, expected] of cases) {
      expect(classifyLineageObjectRole(frontmatter)).toEqual(expect.objectContaining(expected));
    }
  });

  test('uses live row count freshness diagnostics before classifying active intermediates', () => {
    const frontmatter = {
      type: 'table',
      database: 'ETL_Staging',
      schema: 'wrk',
      name: 'DimCustomer',
      row_count: 0,
      live_row_count: 42080464,
    };
    const records = new Map([
      [
        'l1-5fsql-01.etl_staging.wrk.dimcustomer',
        {
          id: 'L1-5FSQL-01.ETL_Staging.wrk.DimCustomer',
          type: 'table',
          frontmatter: { ...frontmatter, tags: [] },
        },
      ],
    ]);

    expect(catalogFreshnessDiagnostic(frontmatter)).toEqual(
      expect.objectContaining({
        status: 'catalog_freshness_conflict',
        generated_row_count: 0,
        live_row_count: 42080464,
      })
    );
    expect(classifyLineageObjectRole(frontmatter)).toEqual(
      expect.objectContaining({
        lineage_role: 'active_intermediate_review',
        status: 'active_intermediate_unresolved',
      })
    );
    expect(applyCatalogFreshnessDiagnostics(records)).toEqual({ conflicts: 1 });
    expect(records.values().next().value.frontmatter).toEqual(
      expect.objectContaining({
        catalog_freshness: expect.objectContaining({
          status: 'catalog_freshness_conflict',
        }),
        tags: expect.arrayContaining(['catalog-freshness:live-row-count-conflict']),
      })
    );
  });

  test('quarantines malformed extracted SQL identities before they enter lineage', () => {
    expect(
      sqlRawQuarantineReason({
        schema: 'dbo',
        name: 'wrk.RecallMasterService',
        type: 'table',
      })
    ).toBe('embedded_schema_token_in_object_name');
    expect(
      sqlRawQuarantineReason({
        schema: 'wrrk',
        name: 'RecallMasterSales3',
        type: 'table',
      })
    ).toBe('typo_schema_name');
    expect(
      sqlRawQuarantineReason({
        schema: 'wrk',
        name: 'RecallMasterServiceNew',
        type: 'table',
      })
    ).toBe('');
  });

  test('applies classifications but preserves existing hard creator status and edges', () => {
    const targetId = 'L1-5FSQL-01.Sonic_DW.dbo.DimOpportunityPositionXREF';
    const writerId = 'L1-5FSQL-01.Sonic_DW.dbo.uspLoadDimOpportunityPositionXREF';
    const records = new Map([
      [
        targetId.toLowerCase(),
        {
          id: targetId,
          type: 'table',
          frontmatter: {
            id: targetId,
            type: 'table',
            database: 'Sonic_DW',
            schema: 'dbo',
            name: 'DimOpportunityPositionXREF',
            created_by: [writerId],
            probable_edges: [
              {
                source: 'L1-5FSQL-01.Sonic_DW.dbo.DimOpportunity',
                validation_status: 'review',
              },
            ],
            lineage_status: 'creator_found',
            tags: ['auto-extracted'],
          },
        },
      ],
    ]);

    const summary = applyLineageRoleClassifications(records);
    const target = records.get(targetId.toLowerCase()).frontmatter;

    expect(summary).toEqual({ classified: 1 });
    expect(target).toEqual(
      expect.objectContaining({
        lineage_role: 'loaded_xref_bridge_or_mapping',
        lineage_status: 'creator_found',
        created_by: [writerId],
        tags: expect.arrayContaining(['lineage-role:xref-bridge-map']),
      })
    );
    expect(target.training_label).toBeUndefined();
  });

  test('stitches exact package-call-to-procedure writer chains into hard target lineage', () => {
    const packageId = 'V1-SSIS25-01.SSISDB.CallRevu.CallRevu_Master.dtsx';
    const procId = 'L1-5FSQL-01.Sonic_DW.dbo.uspLoadDimAdSource';
    const targetId = 'L1-5FSQL-01.Sonic_DW.dbo.DimAdSource';
    const records = new Map([
      [
        packageId.toLowerCase(),
        {
          id: packageId,
          type: 'package',
          frontmatter: {
            id: packageId,
            type: 'package',
            calls: [procId],
          },
        },
      ],
      [
        procId.toLowerCase(),
        {
          id: procId,
          type: 'procedure',
          frontmatter: {
            id: procId,
            type: 'procedure',
            writes_to: [targetId],
            used_by: [],
          },
        },
      ],
      [
        targetId.toLowerCase(),
        {
          id: targetId,
          type: 'table',
          frontmatter: {
            id: targetId,
            type: 'table',
            database: 'Sonic_DW',
            schema: 'dbo',
            name: 'DimAdSource',
            created_by: [],
            created_via: [],
            depends_on: [],
            tags: [],
            lineage_status: 'external_or_unresolved',
          },
        },
      ],
    ]);

    expect(applyExactPackageProcedureChainStitching(records)).toBe(1);
    expect(records.get(targetId.toLowerCase()).frontmatter).toEqual(
      expect.objectContaining({
        created_by: [procId],
        created_via: [packageId],
        depends_on: [procId],
        lineage_status: 'creator_found',
        tags: expect.arrayContaining(['lineage-stitch:package-procedure-writer']),
      })
    );
  });

  test('expands synonym reads to the exact base source object during rebuild', () => {
    const procId = 'L1-5FSQL-01.Sonic_DW.dbo.usp_DimVehicle';
    const synonymId = 'L1-5FSQL-01.Sonic_DW.dbo.SynWrkDimVehicleVehicle';
    const baseId = 'L1-5FSQL-01.ETL_Staging.wrk.DimVehicle_Vehicle';
    const records = new Map([
      [
        procId.toLowerCase(),
        {
          id: procId,
          type: 'procedure',
          frontmatter: {
            id: procId,
            type: 'procedure',
            reads_from: [synonymId],
            depends_on: [synonymId],
            tags: [],
          },
        },
      ],
      [
        synonymId.toLowerCase(),
        {
          id: synonymId,
          type: 'synonym',
          frontmatter: {
            id: synonymId,
            type: 'synonym',
            depends_on: [baseId],
            used_by: [],
            tags: [],
          },
        },
      ],
      [
        baseId.toLowerCase(),
        {
          id: baseId,
          type: 'table',
          frontmatter: {
            id: baseId,
            type: 'table',
            used_by: [],
          },
        },
      ],
    ]);

    expect(applySynonymSourceExpansion(records)).toEqual({ expandedReads: 1 });
    expect(records.get(procId.toLowerCase()).frontmatter).toEqual(
      expect.objectContaining({
        reads_from: [synonymId, baseId],
        depends_on: [synonymId, baseId],
        tags: expect.arrayContaining(['lineage-stitch:synonym-source-expansion']),
      })
    );
    expect(records.get(baseId.toLowerCase()).frontmatter.used_by).toContain(procId);
    expect(records.get(synonymId.toLowerCase()).frontmatter.used_by).toContain(procId);
  });

  test('materializes exact SSIS package table reads and writes onto table summaries', () => {
    const packageId = 'V1-SSIS25-01.SSISDB.Census.CensusDataLoad.dtsx';
    const sourceId = 'L1-5FSQL-01.StagingDB.dbo.StgCensusEmplWages';
    const targetId = 'L1-DWASQL-02,12010.VendorData.dbo.CensusEmplWages';
    const records = new Map([
      [
        packageId.toLowerCase(),
        {
          id: packageId,
          type: 'package',
          frontmatter: {
            id: packageId,
            type: 'package',
            reads_from: [sourceId],
            writes_to: [targetId],
          },
        },
      ],
      [
        sourceId.toLowerCase(),
        {
          id: sourceId,
          type: 'table',
          frontmatter: {
            id: sourceId,
            type: 'table',
            database: 'StagingDB',
            schema: 'dbo',
            name: 'StgCensusEmplWages',
            used_by: [],
            tags: [],
          },
        },
      ],
      [
        targetId.toLowerCase(),
        {
          id: targetId,
          type: 'table',
          frontmatter: {
            id: targetId,
            type: 'table',
            database: 'VendorData',
            schema: 'dbo',
            name: 'CensusEmplWages',
            created_by: [],
            created_via: [],
            tags: [],
            lineage_status: 'external_or_unresolved',
          },
        },
      ],
    ]);

    expect(
      applyExactSsisPackageTableEdges(records, [
        {
          packageId,
          readsFrom: [sourceId],
          writesTo: [targetId],
        },
      ])
    ).toEqual({ readEdges: 1, writeEdges: 1 });
    expect(records.get(sourceId.toLowerCase()).frontmatter).toEqual(
      expect.objectContaining({
        used_by: [packageId],
        tags: expect.arrayContaining(['lineage-stitch:ssis-package-read']),
      })
    );
    expect(records.get(targetId.toLowerCase()).frontmatter).toEqual(
      expect.objectContaining({
        created_by: [packageId],
        created_via: [packageId],
        lineage_status: 'creator_found',
        tags: expect.arrayContaining(['lineage-stitch:ssis-package-write']),
      })
    );
  });

  test('keeps token-only SSIS bridge candidates review-only instead of creator_found', () => {
    const packageId = 'V1-SSIS25-01.SSISDB.RouteOne.RouteOne_Daily.dtsx';
    const stageId = 'L1-5FSQL-01.ETL_Staging.stage.RouteOne_Daily_Mart_Staging';
    const procId = 'L1-5FSQL-01.Sonic_DW.dbo.usp_Load_DM_RouteOne_Daily_Mart';
    const targetId = 'L1-5FSQL-01.Sonic_DW.dbo.DM_RouteOne_Daily_Mart';
    const records = new Map([
      [
        packageId.toLowerCase(),
        {
          id: packageId,
          type: 'package',
          frontmatter: {
            id: packageId,
            type: 'package',
            writes_to: [stageId],
            calls: [procId],
          },
        },
      ],
      [
        stageId.toLowerCase(),
        {
          id: stageId,
          type: 'table',
          database: 'ETL_Staging',
          schema: 'stage',
          name: 'RouteOne_Daily_Mart_Staging',
          frontmatter: {
            id: stageId,
            type: 'table',
            database: 'ETL_Staging',
            schema: 'stage',
            name: 'RouteOne_Daily_Mart_Staging',
            used_by: [],
          },
        },
      ],
      [
        targetId.toLowerCase(),
        {
          id: targetId,
          type: 'table',
          database: 'Sonic_DW',
          schema: 'dbo',
          name: 'DM_RouteOne_Daily_Mart',
          frontmatter: {
            id: targetId,
            type: 'table',
            database: 'Sonic_DW',
            schema: 'dbo',
            name: 'DM_RouteOne_Daily_Mart',
            created_by: [],
            created_via: [],
            depends_on: [],
            contextual_reads: [],
            tags: [],
            lineage_status: 'external_or_unresolved',
          },
        },
      ],
    ]);

    expect(applySsisBridgeInferences(records)).toBe(1);
    expect(records.get(targetId.toLowerCase()).frontmatter).toEqual(
      expect.objectContaining({
        created_by: [],
        created_via: [],
        depends_on: [],
        contextual_reads: [stageId],
        lineage_status: 'external_or_unresolved',
        tags: expect.arrayContaining(['lineage-review:ssis-bridge-candidate']),
        probable_edges: [
          expect.objectContaining({
            source: stageId,
            via: packageId,
            validation_status: 'review',
          }),
        ],
      })
    );
  });
});
