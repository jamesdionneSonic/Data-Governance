import {
  buildDictionaryMarkdownExport,
  buildObjectDictionary,
  buildSchemaDictionary,
  normalizeBusinessMetadataUpdates,
} from '../../src/services/schemaDictionaryService.js';

describe('schemaDictionaryService', () => {
  const objects = new Map([
    [
      'sales.orders',
      {
        id: 'sales.orders',
        name: 'orders',
        database: 'sales',
        schema: 'dbo',
        type: 'table',
        owner: 'sales-owner',
        steward: 'sales-steward',
        business_domain: 'Sales',
        description: 'Order transaction table',
        tags: ['orders'],
        columns: [
          { name: 'order_id', data_type: 'int', keyOrdinal: 1 },
          {
            name: 'gross_amount',
            data_type: 'decimal',
            semantic_type: 'metric',
            description: 'Gross sale amount',
          },
        ],
      },
    ],
    [
      'sales.order_report',
      {
        id: 'sales.order_report',
        name: 'order_report',
        database: 'sales',
        schema: 'bi',
        type: 'view',
        owner: 'bi-owner',
        columns: [{ name: 'gross_amount', data_type: 'decimal' }],
      },
    ],
  ]);

  const lineageGraph = new Map([
    ['sales.orders', new Set()],
    ['sales.order_report', new Set(['sales.orders'])],
  ]);

  test('builds a filterable schema hierarchy with object and column counts', () => {
    const dictionary = buildSchemaDictionary(objects, lineageGraph, { database: 'sales' });

    expect(dictionary.summary).toMatchObject({
      total_objects: 2,
      total_columns: 3,
      databases: 1,
      schemas: 2,
    });
    expect(dictionary.hierarchy.find((group) => group.schema === 'dbo')).toMatchObject({
      object_count: 1,
      column_count: 2,
    });
  });

  test('builds object-level dictionary with normalized columns and downstream users', () => {
    const dictionary = buildObjectDictionary(objects, lineageGraph, 'sales.orders');

    expect(dictionary.object).toMatchObject({
      id: 'sales.orders',
      business_domain: 'Sales',
      downstream_count: 1,
    });
    expect(dictionary.columns[1]).toMatchObject({
      name: 'gross_amount',
      data_type: 'decimal',
      semantic_type: 'metric',
      is_metric: true,
    });
    expect(dictionary.relationships.downstream[0].id).toBe('sales.order_report');
  });

  test('exports object dictionary as markdown without raw data values', () => {
    const dictionary = buildObjectDictionary(objects, lineageGraph, 'sales.orders');
    const markdown = buildDictionaryMarkdownExport(dictionary);

    expect(markdown).toContain('# Schema Dictionary - sales.dbo.orders');
    expect(markdown).toContain('| gross_amount | decimal |');
    expect(markdown).not.toContain('sample value');
  });

  test('normalizes business metadata enrichment arrays from comma strings', () => {
    const updates = normalizeBusinessMetadataUpdates({
      business_domain: 'Sales',
      business_processes: 'Revenue reporting, Month end close',
      tags: ['finance', 'orders'],
      ignored: 'nope',
    });

    expect(updates).toEqual({
      business_domain: 'Sales',
      business_processes: ['Revenue reporting', 'Month end close'],
      tags: ['finance', 'orders'],
    });
  });
});
