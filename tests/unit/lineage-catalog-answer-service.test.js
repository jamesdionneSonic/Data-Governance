import {
  buildDatabaseCatalogAnswer,
  renderDatabaseCatalogAnswer,
} from '../../src/services/lineageCatalogAnswerService.js';

describe('Lineage Catalog Answer Service', () => {
  test('separates numeric catalog entries and renders a table instead of a comma blob', () => {
    const databaseIndex = {
      database_count: 3,
      databases: {
        22: {
          object_count: 38,
          types: { table: 38 },
          schemas: { 183: 38 },
          context_readme_path: 'context-packs/databases/22--abc/README.md',
        },
        Sonic_DW: {
          object_count: 1732,
          types: { table: 1010, view: 384, procedure: 324 },
          schemas: { dbo: 1405, wrk: 33 },
          context_readme_path: 'context-packs/databases/Sonic_DW--abc/README.md',
        },
        VendorData: {
          object_count: 311,
          types: { table: 201, procedure: 70, view: 34 },
          schemas: { dbo: 160, uccx: 20 },
          context_readme_path: 'context-packs/databases/VendorData--abc/README.md',
        },
      },
    };
    const rowsByDatabase = new Map([
      [
        '22',
        [
          {
            object_id: '206.22.183.247.SONICWEBV_VEH.dbo.veh_inventory',
            display_name: '247.SONICWEBV_VEH.dbo.veh_inventory',
            object_type: 'table',
          },
        ],
      ],
    ]);

    const answer = buildDatabaseCatalogAnswer(databaseIndex, rowsByDatabase);
    const rendered = renderDatabaseCatalogAnswer(answer);

    expect(answer.databases.map((row) => row.database)).toEqual(['Sonic_DW', 'VendorData']);
    expect(answer.anomalous_entries).toEqual([
      expect.objectContaining({
        database: '22',
        note: expect.stringContaining('Numeric/anomalous catalog entry'),
      }),
    ]);
    expect(rendered).toContain('| Database | Objects | Main types | Schemas | Notes |');
    expect(rendered).toContain('**Catalog Quality Notes**');
    expect(rendered).not.toMatch(/entries:\s+`?22`?\s*,\s*`?Sonic_DW`?/);
  });
});
