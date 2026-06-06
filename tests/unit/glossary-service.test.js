import {
  normalizeGlossaryTerm,
  parseTermsCsv,
  resolveAssetGlossaryLinks,
  resolveBusinessQuery,
  serializeTermsCsv,
  slugifyTerm,
} from '../../src/services/glossaryService.js';

describe('Glossary Service semantic layer', () => {
  test('normalizes governed term metadata and asset mappings', () => {
    const term = normalizeGlossaryTerm({
      term: 'Vehicle Dimension',
      domain: 'Sales',
      business_owner: 'Sales Ops',
      steward: 'Data Governance',
      synonyms: 'vehicle dim|DimVehicle',
      related_terms: ['Vehicle'],
      parent: 'vehicle',
      assets: [
        {
          asset_id: 'Sonic_DW.dbo.DimVehicle',
          type: 'table',
          relationship: 'defines',
          confidence: 0.95,
        },
      ],
      definition: 'Canonical vehicle dimension used for sales and service reporting.',
    });

    expect(term.slug).toBe('vehicle-dimension');
    expect(term.business_owner).toBe('Sales Ops');
    expect(term.synonyms).toEqual(['vehicle dim', 'DimVehicle']);
    expect(term.assets).toHaveLength(1);
    expect(term.asset_count).toBe(1);
  });

  test('resolves a business synonym to linked physical assets', async () => {
    const terms = [
      normalizeGlossaryTerm({
        term: 'Vehicle Dimension',
        synonyms: ['DimVehicle', 'Vehicle Master'],
        assets: [
          {
            asset_id: 'Sonic_DW.dbo.DimVehicle',
            type: 'table',
            relationship: 'defines',
            confidence: 0.95,
          },
        ],
      }),
    ];
    const objects = new Map([
      [
        'Sonic_DW.dbo.DimVehicle',
        {
          id: 'Sonic_DW.dbo.DimVehicle',
          name: 'DimVehicle',
          database: 'Sonic_DW',
          schema: 'dbo',
          type: 'table',
        },
      ],
    ]);

    const resolution = await resolveBusinessQuery('vehicle master', objects, { terms });

    expect(resolution.terms[0].term).toBe('Vehicle Dimension');
    expect(resolution.assets[0]).toMatchObject({
      asset_id: 'Sonic_DW.dbo.DimVehicle',
      type: 'table',
    });
    expect(resolution.assets[0].reason).toContain('Vehicle Dimension');
  });

  test('returns glossary links for an asset detail context', () => {
    const terms = [
      normalizeGlossaryTerm({
        term: 'Vehicle Dimension',
        assets: [{ asset_id: 'Sonic_DW.dbo.DimVehicle', relationship: 'defines' }],
      }),
    ];

    const links = resolveAssetGlossaryLinks(
      'Sonic_DW.dbo.DimVehicle',
      { id: 'Sonic_DW.dbo.DimVehicle' },
      terms
    );

    expect(links).toEqual([
      {
        slug: 'vehicle-dimension',
        term: 'Vehicle Dimension',
        domain: 'General',
        relationship: 'defines',
      },
    ]);
  });

  test('exports and imports CSV glossary records', () => {
    const terms = [
      normalizeGlossaryTerm({
        term: 'Repair Order',
        synonyms: ['RO'],
        related_terms: ['Service'],
        assets: ['Sonic_DW.dbo.FactService'],
        definition: 'Service department repair order.',
      }),
    ];

    const csv = serializeTermsCsv(terms);
    const parsed = parseTermsCsv(csv);

    expect(slugifyTerm('Repair Order')).toBe('repair-order');
    expect(parsed[0].term).toBe('Repair Order');
    expect(parsed[0].synonyms).toEqual(['RO']);
    expect(parsed[0].assets[0].asset_id).toBe('Sonic_DW.dbo.FactService');
  });
});
