import {
  buildRebuildReport,
  buildSsisSqlEndpointRecords,
  evaluateRebuildGates,
} from '../../scripts/rebuild-catalog-from-raw.mjs';
import { resolveColumnLineage } from '../../src/services/columnLineageResolver.js';

describe('Rebuild confidence report and SSIS endpoint gates', () => {
  test('creates SSIS-observed SQL endpoint records that promote column lineage', () => {
    const sourceId = 'cor-sql-02.eLeadDW.dbo.SourceClaims';
    const targetId = 'L1-5FSQL-01.ETL_Staging.dbo.TargetClaims';
    const packageId = 'V1-SSIS25-01, 11040.SSISDB.Claims.CopyClaims.CopyClaims.dtsx';
    const records = new Map([
      [
        packageId.toLowerCase(),
        {
          id: packageId,
          type: 'package',
          frontmatter: {
            id: packageId,
            name: 'CopyClaims.dtsx',
            database: 'ssisdb',
            type: 'package',
            reads_from: [sourceId],
            writes_to: [targetId],
            ssis_column_mappings: [
              {
                package_id: packageId,
                source_object: 'dbo.SourceClaims',
                destination_object: 'dbo.TargetClaims',
                input_column: 'ClaimID',
                output_column: 'ClaimID',
                external_metadata_column: 'ClaimID',
                transform_type: 'direct',
                validation_status: 'validated',
                evidence_type: 'ssis_dataflow_column_mapping',
                evidence_text: 'InputColumn=ClaimID; ExternalColumn=ClaimID',
              },
            ],
          },
        },
      ],
    ]);

    const endpointRecords = buildSsisSqlEndpointRecords(records);
    expect(endpointRecords).toHaveLength(2);
    expect(endpointRecords).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: sourceId,
          frontmatter: expect.objectContaining({
            external_source: true,
            tags: expect.arrayContaining(['ssis-sql-endpoint', 'source']),
            columns: [expect.objectContaining({ column_id: `${sourceId}.ClaimID` })],
          }),
        }),
        expect.objectContaining({
          id: targetId,
          frontmatter: expect.objectContaining({
            external_source: true,
            tags: expect.arrayContaining(['ssis-sql-endpoint', 'destination']),
            columns: [expect.objectContaining({ column_id: `${targetId}.ClaimID` })],
          }),
        }),
      ])
    );

    for (const endpoint of endpointRecords) {
      records.set(endpoint.id.toLowerCase(), endpoint);
    }

    const objects = new Map(
      Array.from(records.values()).map((record) => [record.id, record.frontmatter])
    );
    const lineage = resolveColumnLineage(objects, { includeSqlUsage: false });

    expect(lineage.validated).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          process_id: packageId,
          source_column_id: `${sourceId}.ClaimID`,
          target_column_id: `${targetId}.ClaimID`,
          validation_status: 'validated',
          confidence: 1,
        }),
      ])
    );
  });

  test('builds rebuild report with distribution, deltas, regressions, and gates', () => {
    const packageId = 'SSIS01.SSISDB.Claims.CopyClaims.CopyClaims.dtsx';
    const recordList = [
      {
        id: packageId,
        type: 'package',
        frontmatter: {
          id: packageId,
          name: 'CopyClaims.dtsx',
          server: 'SSIS01',
          database: 'ssisdb',
          type: 'package',
          reads_from: ['SQL01.SourceDB.dbo.Claims'],
          writes_to: ['SQL02.TargetDB.dbo.Claims'],
          lineage_quality: {
            validated_edges: 2,
            probable_edges: 0,
            unresolved_facts: 1,
          },
          column_lineage: [
            {
              source_column_id: 'SQL01.SourceDB.dbo.Claims.ClaimID',
              target_column_id: 'SQL02.TargetDB.dbo.Claims.ClaimID',
              confidence: 1,
            },
          ],
          catalog_confidence: {
            overall_score: 0.82,
            edge_correctness_score: 1,
            coverage_score: 0.75,
            column_lineage_score: 1,
            unresolved_risk_score: 0.1,
            confidence_label: 'medium',
          },
        },
      },
      {
        id: 'SQL02.TargetDB.dbo.Claims',
        type: 'table',
        frontmatter: {
          id: 'SQL02.TargetDB.dbo.Claims',
          name: 'Claims',
          server: 'SQL02',
          database: 'TargetDB',
          schema: 'dbo',
          type: 'table',
          catalog_confidence: {
            overall_score: 0.51,
            edge_correctness_score: 1,
            coverage_score: 0.5,
            column_lineage_score: 0.2,
            unresolved_risk_score: 0.2,
            confidence_label: 'low',
          },
        },
      },
    ];
    const summary = {
      loadedObjects: 2,
      invalidObjects: 0,
      invalidSample: [],
      sqlObjects: 1,
      ssisPackages: 1,
      ssisEdges: 10,
      ssisSqlEndpointRecords: 0,
    };
    const previousReport = {
      metrics: {
        ssis_edges: 12,
        direct_edge_refs: 4,
        column_lineage_records: 1,
      },
      package_confidence_index: {
        [packageId]: {
          id: packageId,
          score: 0.9,
          label: 'high',
        },
      },
      source_summary: [{ source_key: 'SSIS01.ssisdb' }],
    };

    const report = buildRebuildReport({
      summary,
      recordList,
      previousReport,
      thresholds: {
        maxLowNeedsReviewRatio: 0.75,
        minAverageConfidence: 0.6,
      },
    });

    expect(report.confidence.distribution.medium).toBe(1);
    expect(report.confidence.distribution.low).toBe(1);
    expect(report.confidence.low_or_needs_review_objects).toBe(1);
    expect(report.edge_deltas.ssis_edges.delta).toBe(-2);
    expect(report.package_confidence_regressions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: packageId,
          previous_score: 0.9,
          current_score: 0.82,
        }),
      ])
    );
    expect(report.new_data_sources).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          source_key: 'SQL02.TargetDB',
        }),
      ])
    );
    expect(report.gates.checks.length).toBeGreaterThan(0);
  });

  test('gate evaluation fails on invalid generated objects', () => {
    const report = {
      validation: { invalid_objects: 1 },
      confidence: {
        missing_confidence_objects: 0,
        low_or_needs_review_ratio: 0,
        average_scores: { overall: 0.9 },
      },
      metrics: { unresolved_fact_ratio: 0 },
      edge_deltas: { ssis_edges: { delta_ratio: 0 } },
      new_data_sources: [],
    };

    const gates = evaluateRebuildGates(report, { maxInvalidObjects: 0 });

    expect(gates.status).toBe('failed');
    expect(gates.failed).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'invalid_objects',
        }),
      ])
    );
  });
});
