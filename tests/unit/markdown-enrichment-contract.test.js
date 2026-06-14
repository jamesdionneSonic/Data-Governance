import {
  applyDictionaryEnrichmentContract,
  enrichColumnMetadata,
  inferBusinessDomain,
} from '../../src/services/markdownEnrichmentContract.js';

describe('markdownEnrichmentContract', () => {
  test('adds dictionary object fields while preserving steward-authored values', () => {
    const enriched = applyDictionaryEnrichmentContract(
      {
        id: 'L1.Sonic_DW.dbo.DimVehicle',
        name: 'DimVehicle',
        database: 'Sonic_DW',
        schema: 'dbo',
        type: 'table',
        owner: 'Data Team',
        business_domain: 'Custom Domain',
        business_justification: 'Curated steward text',
        columns: [],
      },
      { enrichedAt: '2026-06-06T00:00:00.000Z' }
    );

    expect(enriched.business_domain).toBe('Custom Domain');
    expect(enriched.business_justification).toBe('Curated steward text');
    expect(enriched).toMatchObject({
      business_processes: expect.any(Array),
      use_cases: expect.any(Array),
      documentation_links: [],
      related_dashboards: [],
      data_dictionary: {
        status: 'generated',
        source: 'raw_metadata',
        enrichment_version: 1,
        enriched_at: '2026-06-06T00:00:00.000Z',
      },
    });
  });

  test('infers business domain from technical metadata', () => {
    expect(inferBusinessDomain({ database: 'VehicleMart', name: 'FactVehicleSales' })).toBe(
      'Vehicle'
    );
    expect(inferBusinessDomain({ database: 'HRData', name: 'Employee' })).toBe('Human Resources');
  });

  test('infers metric columns without turning identifiers into metrics', () => {
    const amount = enrichColumnMetadata({ name: 'TotalAmount', data_type: 'decimal' });
    const id = enrichColumnMetadata({ name: 'CustomerID', data_type: 'int' });

    expect(amount).toMatchObject({
      semantic_type: 'metric',
      is_metric: true,
      business_name: 'Total Amount',
    });
    expect(id).toMatchObject({
      semantic_type: 'identifier',
      is_metric: false,
      is_identifier: true,
    });
  });

  test('classifies likely PII and financial fields from column names', () => {
    const email = enrichColumnMetadata({ name: 'CustomerEmailAddress', data_type: 'nvarchar' });
    const salary = enrichColumnMetadata({ name: 'AnnualSalaryAmount', data_type: 'money' });

    expect(email.sensitivity).toBe('restricted');
    expect(email.classifications).toContain('PII');
    expect(salary.sensitivity).toBe('confidential');
    expect(salary.classifications).toContain('Financial');
  });
});
