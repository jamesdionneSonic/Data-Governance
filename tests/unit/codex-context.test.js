import { buildCodexColumnContext } from '../../src/services/codexContextService.js';
import { buildLineageGraph } from '../../src/services/lineageService.js';

describe('Codex Context Service', () => {
  const sourceId = 'DW01.StagingDB.jma.StgClaims';
  const factId = 'DW01.Sonic_DW.dbo.FactClaim';
  const procId = 'DW01.Sonic_DW.etl.LoadFactClaim';
  const viewId = 'DW01.Sonic_DW.reporting.vwClaimSummary';

  function buildObjects() {
    return new Map([
      [
        sourceId,
        {
          id: sourceId,
          name: 'StgClaims',
          database: 'StagingDB',
          schema: 'jma',
          type: 'table',
          used_by: [procId],
          catalog_confidence: {
            overall_score: 0.91,
            edge_correctness_score: 0.98,
            coverage_score: 0.82,
            column_lineage_score: 0.88,
            unresolved_risk_score: 0.12,
            confidence_label: 'high',
            warnings: ['unresolved_lineage_facts_present'],
          },
          columns: [{ name: 'Amount', column_id: `${sourceId}.Amount`, data_type: 'decimal' }],
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
          depends_on: [procId],
          used_by: [viewId],
          columns: [{ name: 'ClaimAmount', column_id: `${factId}.ClaimAmount` }],
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
          reads_from: [sourceId],
          writes_to: [factId],
          column_usage: [
            {
              column_id: `${sourceId}.Amount`,
              process_id: procId,
              column_name: 'Amount',
              usage_type: 'read',
              usage_context: 'select_list',
              evidence_type: 'sql_definition',
              evidence_text: 'src.Amount',
              validation_status: 'validated',
            },
          ],
          column_lineage: [
            {
              source_column_id: `${sourceId}.Amount`,
              target_column_id: `${factId}.ClaimAmount`,
              process_id: procId,
              transform_type: 'direct',
              evidence_type: 'sql_definition',
              evidence_text: 'src.Amount AS ClaimAmount',
              validation_status: 'validated',
              confidence: 1,
            },
          ],
          unresolved_column_usage: [
            {
              process_id: procId,
              column_name: 'Amount',
              reason: 'alias_not_resolved_to_known_table_or_view',
              evidence_type: 'sql_definition',
              evidence_text: 'cte.Amount',
              validation_status: 'unresolved',
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
          reads_from: [factId],
          column_usage: [
            {
              column_id: `${factId}.ClaimAmount`,
              process_id: viewId,
              column_name: 'ClaimAmount',
              usage_type: 'read',
              usage_context: 'select_list',
              evidence_type: 'sql_definition',
              evidence_text: 'ClaimAmount',
              validation_status: 'validated',
            },
          ],
        },
      ],
    ]);
  }

  test('builds AI-readable table, column, impact, and risk context', () => {
    const objects = buildObjects();
    const graph = buildLineageGraph(objects);
    const context = buildCodexColumnContext(objects, graph, {
      object_id: sourceId,
      column_name: 'Amount',
      change_type: 'drop_column',
    });

    expect(context.focus).toEqual(
      expect.objectContaining({
        object_id: sourceId,
        column_id: `${sourceId}.Amount`,
        column_name: 'Amount',
      })
    );
    expect(context.table_lineage.downstream_count).toBeGreaterThan(0);
    expect(context.column_usage.direct).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          process_id: procId,
          usage_type: 'read',
          evidence_text: 'src.Amount',
        }),
      ])
    );
    expect(context.column_lineage.downstream).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          source_column_id: `${sourceId}.Amount`,
          target_column_id: `${factId}.ClaimAmount`,
          confidence: 1,
        }),
      ])
    );
    expect(context.impact.summary.impacted_count).toBeGreaterThan(0);
    expect(context.catalog_confidence).toEqual(
      expect.objectContaining({
        overall_score: 0.91,
        confidence_label: 'high',
      })
    );
    expect(context.unresolved_risks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          process_id: procId,
          reason: 'alias_not_resolved_to_known_table_or_view',
        }),
      ])
    );
    expect(context.markdown).toContain('## Table-Level Downstream');
    expect(context.markdown).toContain('## Downstream Blast Radius');
    expect(context.markdown).toContain('## Catalog Confidence');
    expect(context.markdown).toContain('Coverage Score: 0.82');
    expect(context.markdown).toContain('[validated, sql_definition]');
  });
});
