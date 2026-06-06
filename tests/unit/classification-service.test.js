import { jest } from '@jest/globals';
import {
  bulkClassifyAssets,
  classifyAsset,
  classifyAssetDetailed,
  loadTaxonomy,
  propagateClassifications,
  resetTaxonomyCache,
} from '../../src/services/classificationService.js';
import {
  analyzeColumnSemantics,
  buildExternalPiiAnalysis,
  buildPiiMaskPlan,
  maskRecord,
} from '../../src/services/piiPolicyService.js';

describe('classificationService', () => {
  beforeEach(() => {
    resetTaxonomyCache();
  });

  test('loads required built-in classification categories with hierarchy', () => {
    const taxonomy = loadTaxonomy();
    const labels = taxonomy.categories.map((category) => category.label);

    expect(labels).toEqual(
      expect.arrayContaining([
        'Public',
        'Confidential',
        'Restricted',
        'PII',
        'PHI',
        'GDPR',
        'HIPAA',
        'CCPA',
        'Financial',
      ])
    );
    expect(taxonomy.categories.find((category) => category.label === 'GDPR')).toMatchObject({
      parent: 'pii',
    });
  });

  test('detects PII and Financial classifications from column naming rules', () => {
    const result = classifyAssetDetailed({
      id: 'hr.employee_payroll',
      name: 'employee_payroll',
      sensitivity: 'internal',
      tags: ['hr'],
      columns: [
        { name: 'employee_email_address' },
        { name: 'salary_amount' },
        { name: 'department_name' },
      ],
    });

    expect(result.classifications).toEqual(expect.arrayContaining(['PII', 'Financial']));
    expect(result.matches.some((match) => match.source === 'rule')).toBe(true);
    expect(result.confidence).toBeGreaterThanOrEqual(0.9);
  });

  test('supports bulk manual override audit evidence', () => {
    const assets = new Map([
      [
        'sales.customer',
        {
          id: 'sales.customer',
          name: 'customer',
          sensitivity: 'public',
          columns: [{ name: 'customer_key' }],
        },
      ],
    ]);

    const [result] = bulkClassifyAssets(assets, [
      {
        asset_id: 'sales.customer',
        manual_classification: 'Restricted',
        reason: 'Steward override',
        changed_by: 'steward@example.com',
      },
    ]);

    expect(result.classifications).toContain('Restricted');
    expect(result.matches[0]).toMatchObject({
      label: 'Restricted',
      source: 'manual_override',
      confidence: 1,
    });
  });

  test('propagates seed classifications to downstream dependent assets', () => {
    const assets = new Map([
      [
        'raw.customer',
        {
          id: 'raw.customer',
          name: 'customer',
          sensitivity: 'restricted',
          columns: [{ name: 'email_address' }],
        },
      ],
      [
        'mart.customer_summary',
        {
          id: 'mart.customer_summary',
          name: 'customer_summary',
          sensitivity: 'internal',
          depends_on: ['raw.customer'],
        },
      ],
    ]);

    const result = propagateClassifications('raw.customer', assets);

    expect(classifyAsset(assets.get('raw.customer'))).toContain('PII');
    expect(result.propagated).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          asset_id: 'mart.customer_summary',
          classifications: expect.arrayContaining(['Restricted', 'PII']),
        }),
      ])
    );
  });
});

describe('piiPolicyService', () => {
  test('builds a metadata-only mask plan for PII columns', () => {
    const plan = buildPiiMaskPlan({
      id: 'sales.customer',
      columns: [
        { name: 'customer_email_address', data_type: 'varchar' },
        { name: 'phone_number', data_type: 'varchar' },
        { name: 'total_revenue', data_type: 'decimal' },
      ],
    });

    expect(plan.retention).toMatchObject({
      raw_pii_allowed: false,
      store_raw_values: false,
      allowed_storage: 'metadata_only',
    });
    expect(plan.summary).toMatchObject({ total_columns: 3, pii_columns: 2 });
    expect(plan.masking_actions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ column_name: 'customer_email_address', strategy: 'email' }),
        expect.objectContaining({ column_name: 'phone_number', strategy: 'phone' }),
      ])
    );
  });

  test('masks sample records without retaining raw PII values', () => {
    const plan = buildPiiMaskPlan({
      id: 'sales.customer',
      columns: [
        { name: 'customer_email_address' },
        { name: 'ssn' },
        { name: 'total_revenue', data_type: 'decimal' },
      ],
    });

    const masked = maskRecord(
      {
        customer_email_address: 'jane@example.com',
        ssn: '123-45-6789',
        total_revenue: 42,
      },
      plan
    );

    expect(masked).toEqual({
      customer_email_address: 'j***@example.com',
      ssn: '***6789',
      total_revenue: 42,
    });
  });

  test('answers which columns are metrics from column metadata', () => {
    const semantics = analyzeColumnSemantics({
      id: 'sales.fact_sales',
      columns: [
        { name: 'CustomerKey', data_type: 'int', primary_key: false },
        { name: 'SaleAmount', data_type: 'decimal' },
        { name: 'SaleDate', data_type: 'datetime' },
      ],
    });

    expect(semantics.can_answer_metric_question).toBe(true);
    expect(semantics.metric_columns).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          column_name: 'SaleAmount',
          semantic_type: 'metric',
          is_metric: true,
        }),
      ])
    );
    expect(semantics.columns.find((column) => column.column_name === 'CustomerKey')).toMatchObject({
      semantic_type: 'identifier',
      is_metric: false,
    });
  });

  test('keeps external PII analysis disabled until Presidio endpoint is configured', async () => {
    const previousEndpoint = process.env.PRESIDIO_ANALYZER_URL;
    delete process.env.PRESIDIO_ANALYZER_URL;

    const analysis = await buildExternalPiiAnalysis({
      id: 'sales.customer',
      columns: [{ name: 'customer_email_address', description: 'Customer email' }],
    });

    expect(analysis).toMatchObject({
      asset_id: 'sales.customer',
      enabled: false,
      provider: 'presidio',
      status: 'disabled',
      raw_text_retained: false,
    });

    if (previousEndpoint) process.env.PRESIDIO_ANALYZER_URL = previousEndpoint;
  });

  test('maps mocked Presidio entities to mask strategies without retaining raw text', async () => {
    const originalFetch = global.fetch;
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        { entity_type: 'EMAIL_ADDRESS', start: 0, end: 5, score: 0.97 },
        { entity_type: 'US_SSN', start: 6, end: 12, score: 0.91 },
      ],
    });

    const analysis = await buildExternalPiiAnalysis(
      {
        id: 'sales.customer',
        columns: [{ name: 'email_address' }, { name: 'ssn' }],
      },
      { endpoint: 'http://presidio.test', scoreThreshold: 0.7 }
    );

    expect(global.fetch).toHaveBeenCalledWith(
      'http://presidio.test/analyze',
      expect.objectContaining({ method: 'POST' })
    );
    expect(analysis.raw_text_retained).toBe(false);
    expect(analysis.entities).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ entity_type: 'EMAIL_ADDRESS', mask_strategy: 'email' }),
        expect.objectContaining({ entity_type: 'US_SSN', mask_strategy: 'last4' }),
      ])
    );

    global.fetch = originalFetch;
  });
});
