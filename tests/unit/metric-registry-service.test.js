import {
  assessMetricFormulaImpact,
  buildMetricRegistry,
  buildTableMetricAnswer,
  explainMetricLogic,
} from '../../src/services/metricRegistryService.js';

function seedCatalog() {
  const objects = new Map([
    [
      'sales.orders',
      {
        id: 'sales.orders',
        name: 'orders',
        database: 'sales',
        schema: 'dbo',
        type: 'table',
        owner: 'sales-ops',
        columns: [
          { name: 'order_id', data_type: 'int', primary_key: true },
          { name: 'gross_amount', data_type: 'decimal', semantic_type: 'metric' },
          { name: 'margin_rate', data_type: 'decimal', expression: 'gross_amount - cost_amount' },
        ],
      },
    ],
    [
      'mart.sales_summary',
      {
        id: 'mart.sales_summary',
        name: 'sales_summary',
        database: 'mart',
        schema: 'dbo',
        type: 'view',
        columns: [{ name: 'gross_amount', data_type: 'decimal' }],
        column_usage: [
          {
            column_id: 'sales.orders.gross_amount',
            column_name: 'gross_amount',
            usage_type: 'calculation',
            usage_context: 'select_list',
            evidence_text: 'SUM(gross_amount) AS total_gross_amount',
          },
        ],
      },
    ],
    [
      'etl.load_sales_summary',
      {
        id: 'etl.load_sales_summary',
        name: 'load_sales_summary',
        type: 'procedure',
        column_lineage: [
          {
            source_column_id: 'sales.orders.gross_amount',
            target_column_id: 'mart.sales_summary.gross_amount',
            transform_type: 'aggregate',
            confidence: 0.91,
            evidence_text: 'SUM(sales.orders.gross_amount)',
          },
        ],
      },
    ],
  ]);
  const lineage = new Map([['mart.sales_summary', new Set(['sales.orders'])]]);
  return { objects, lineage };
}

describe('metricRegistryService', () => {
  test('builds a metric registry without classifying identifiers as metrics', () => {
    const { objects, lineage } = seedCatalog();
    const registry = buildMetricRegistry(objects, lineage);

    expect(registry.summary.total_metrics).toBe(3);
    expect(registry.metrics.map((metric) => metric.column_name)).toEqual(
      expect.arrayContaining(['gross_amount', 'margin_rate'])
    );
    expect(registry.metrics.map((metric) => metric.column_name)).not.toContain('order_id');
    expect(
      registry.metrics.find(
        (metric) => metric.object_id === 'sales.orders' && metric.column_name === 'gross_amount'
      )
    ).toMatchObject({
      metric_state: 'confirmed',
      confidence_label: 'high',
    });

    const tableRegistry = buildMetricRegistry(objects, lineage, { object_id: 'sales.orders' });
    expect(tableRegistry.summary.total_metrics).toBe(2);
  });

  test('answers table metric questions with evidence-ready rows', () => {
    const { objects, lineage } = seedCatalog();
    const answer = buildTableMetricAnswer(objects, lineage, 'sales.orders');

    expect(answer.answer).toContain('sales.dbo.orders has 2 metric-like columns');
    expect(answer.rows).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          column: 'gross_amount',
          state: 'confirmed',
          why: expect.stringContaining('column_semantic_type'),
        }),
      ])
    );
  });

  test('explains metric logic from expressions and lineage evidence', () => {
    const { objects, lineage } = seedCatalog();
    const logic = explainMetricLogic(objects, lineage, {
      object_id: 'sales.orders',
      column_name: 'gross_amount',
    });

    expect(logic.metric.column_name).toBe('gross_amount');
    expect(logic.logic.upstream_sources).toHaveLength(0);
    expect(logic.logic.downstream_consumers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          process_id: 'etl.load_sales_summary',
          transform_type: 'aggregate',
        }),
        expect.objectContaining({
          object_id: 'mart.sales_summary',
          usage_type: 'calculation',
        }),
      ])
    );
  });

  test('assesses formula-change impact using column impact evidence when available', () => {
    const { objects, lineage } = seedCatalog();
    const impact = assessMetricFormulaImpact(objects, lineage, {
      object_id: 'sales.orders',
      column_name: 'gross_amount',
      change_type: 'change_data_type',
    });

    expect(impact.answer).toContain('Changing the logic');
    expect(impact.risk.impacted_count).toBeGreaterThan(0);
    expect(impact.risk.recommended_actions).toEqual(
      expect.arrayContaining(['Run reconciliation before and after the formula change.'])
    );
  });
});
