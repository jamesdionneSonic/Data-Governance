import {
  buildGovernanceContext,
  buildGovernanceSummaries,
} from '../../src/services/governanceContextService.js';
import { resetTaxonomyCache } from '../../src/services/classificationService.js';

describe('governanceContextService', () => {
  beforeEach(() => {
    resetTaxonomyCache();
  });

  test('returns null when asset does not exist', () => {
    const assets = new Map();
    const context = buildGovernanceContext('missing.asset', assets, new Map());
    expect(context).toBeNull();
  });

  test('builds governance context with lineage from Set graph and glossary links', () => {
    const assets = new Map([
      [
        'sales.orders',
        {
          name: 'orders',
          database: 'sales',
          type: 'table',
          owner: 'owner@example.com',
          steward: 'steward@example.com',
          sensitivity: 'confidential',
          tags: ['pii', 'finance', 'retention'],
          description: 'Customer order records used for billing and compliance reporting.',
          certified: true,
        },
      ],
      [
        'sales.customers',
        {
          name: 'customers',
          database: 'sales',
          type: 'table',
          tags: ['pii'],
        },
      ],
      ['sales.products', { name: 'products', database: 'sales', type: 'table' }],
      ['sales.invoices', { name: 'invoices', database: 'sales', type: 'table' }],
    ]);

    const lineageGraph = new Map([
      ['sales.orders', new Set(['sales.customers', 'sales.products'])],
      ['sales.invoices', new Set(['sales.orders'])],
    ]);

    const context = buildGovernanceContext('sales.orders', assets, lineageGraph);

    expect(context).toBeTruthy();
    expect(context.asset_id).toBe('sales.orders');
    expect(context.asset.name).toBe('orders');
    expect(context.lineage.upstream).toEqual(
      expect.arrayContaining(['sales.customers', 'sales.products'])
    );
    expect(context.lineage.downstream).toContain('sales.invoices');
    expect(Array.isArray(context.classifications)).toBe(true);
    expect(context.trust).toBeDefined();
    expect(Array.isArray(context.glossary_links)).toBe(true);
    expect(context.glossary_links.length).toBeLessThanOrEqual(5);
    expect(typeof context.generated_at).toBe('string');
  });

  test('builds context with object-form lineage node and no downstream edges', () => {
    const assets = new Map([
      [
        'core.asset',
        {
          name: 'core_asset',
          database: 'core',
          type: 'view',
          tags: [],
        },
      ],
    ]);

    const lineageGraph = new Map([
      ['core.asset', { upstream: ['upstream.one'], depends_on: ['upstream.two'] }],
    ]);

    const context = buildGovernanceContext('core.asset', assets, lineageGraph);

    expect(context).toBeTruthy();
    expect(context.lineage.upstream).toEqual(['upstream.one']);
    expect(context.lineage.downstream).toEqual([]);
  });

  test('returns empty summaries when assets map is missing', () => {
    expect(buildGovernanceSummaries(null)).toEqual([]);
  });

  test('builds and sorts governance summaries by trust score descending', () => {
    const assets = new Map([
      [
        'low.asset',
        {
          name: 'low',
          database: 'd1',
          type: 'table',
          owner: 'unknown',
          description: '',
          tags: [],
          depends_on: [],
        },
      ],
      [
        'high.asset',
        {
          name: 'high',
          database: 'd1',
          type: 'table',
          owner: 'owner@example.com',
          steward: 'steward@example.com',
          description: 'Long description '.repeat(20),
          sensitivity: 'confidential',
          tags: ['pii', 'finance', 'critical'],
          depends_on: ['src.one'],
          certified: true,
        },
      ],
    ]);

    const summaries = buildGovernanceSummaries(assets);

    expect(summaries).toHaveLength(2);
    expect(summaries[0].asset_id).toBe('high.asset');
    expect(summaries[0].trust_score).toBeGreaterThanOrEqual(summaries[1].trust_score);
    expect(summaries[0]).toHaveProperty('classifications');
  });
});
