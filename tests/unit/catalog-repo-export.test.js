import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';

import { buildRuntimeCatalogIndexes } from '../../src/services/catalogRuntimeService.js';
import { exportCatalogRepo } from '../../src/services/catalogRepoExportService.js';

describe('Catalog Repo Export Service', () => {
  let tempRoot;

  beforeEach(async () => {
    tempRoot = await mkdtemp(join(tmpdir(), 'dg-catalog-export-'));
  });

  afterEach(async () => {
    await rm(tempRoot, { recursive: true, force: true });
  });

  async function seedCatalog() {
    const markdownRoot = join(tempRoot, 'markdown');
    const tableDir = join(markdownRoot, 'servers', 'DW01', 'databases', 'Sonic_DW', 'tables');
    const procDir = join(markdownRoot, 'servers', 'DW01', 'databases', 'Sonic_DW', 'stored_procedures');
    await mkdir(tableDir, { recursive: true });
    await mkdir(procDir, { recursive: true });

    await writeFile(
      join(tableDir, 'dbo__DimVehicle.md'),
      [
        '---',
        'id: DW01.Sonic_DW.dbo.DimVehicle',
        'name: DimVehicle',
        'server: DW01',
        'database: Sonic_DW',
        'schema: dbo',
        'type: table',
        'owner: data-team',
        'created_by:',
        '  - DW01.Sonic_DW.dbo.usp_DimVehicle',
        'used_by:',
        '  - DW01.Sonic_DW.dbo.usp_DimVehicle',
        'columns: []',
        'catalog_confidence:',
        '  overall_score: 0.95',
        '  edge_correctness_score: 1',
        '  column_lineage_score: 0.5',
        '  confidence_label: very_high',
        '---',
        '',
        'Vehicle dimension.',
      ].join('\n'),
      'utf8'
    );

    await writeFile(
      join(procDir, 'dbo__usp_DimVehicle.md'),
      [
        '---',
        'id: DW01.Sonic_DW.dbo.usp_DimVehicle',
        'name: usp_DimVehicle',
        'server: DW01',
        'database: Sonic_DW',
        'schema: dbo',
        'type: procedure',
        'owner: data-team',
        'reads_from:',
        '  - DW01.Sonic_DW.dbo.DimVehicle',
        '  - DW01.Sonic_DW.dbo.SynWrkDimVehicleVehicle',
        'writes_to:',
        '  - DW01.Sonic_DW.dbo.DimVehicle',
        'catalog_confidence:',
        '  overall_score: 0.83',
        '  edge_correctness_score: 1',
        '  column_lineage_score: 0.28',
        '  confidence_label: medium',
        '---',
        '',
        '## Definition',
        '',
        '```sql',
        'CREATE PROCEDURE [dbo].[usp_DimVehicle]',
        'AS',
        'BEGIN',
        '  UPDATE tgt',
        '     SET tgt.ModelName = src.ModelName',
        '    FROM dbo.SynWrkDimVehicleVehicle AS src',
        '    INNER JOIN dbo.DimVehicle AS tgt ON src.VehicleKey = tgt.VehicleKey;',
        '',
        '  INSERT INTO dbo.DimVehicle (VehicleKey, ModelName)',
        '  SELECT src.VehicleKey, src.ModelName',
        '    FROM dbo.SynWrkDimVehicleVehicle AS src',
        '    LEFT JOIN dbo.DimVehicle AS tgt ON src.VehicleKey = tgt.VehicleKey',
        '   WHERE tgt.VehicleKey IS NULL;',
        'END',
        '```',
      ].join('\n'),
      'utf8'
    );

    return markdownRoot;
  }

  async function findFile(root, pattern) {
    const entries = await readdir(root, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(root, entry.name);
      if (entry.isDirectory()) {
        // eslint-disable-next-line no-await-in-loop
        const nested = await findFile(fullPath, pattern);
        if (nested) return nested;
      } else if (pattern.test(entry.name)) {
        return fullPath;
      }
    }
    return null;
  }

  test('exports raw source markdown and packaged procedure logic', async () => {
    const markdownRoot = await seedCatalog();
    await buildRuntimeCatalogIndexes(markdownRoot, {});
    const targetRoot = join(tempRoot, 'repo');

    await exportCatalogRepo({
      markdownRoot,
      targetRoot,
    });

    const procPackPath = await findFile(join(targetRoot, 'context-packs'), /^usp_DimVehicle--.*\.json$/);
    expect(procPackPath).toBeTruthy();
    const procPack = JSON.parse(await readFile(procPackPath, 'utf8'));
    expect(procPack.logic_summary).toContain('Reads staged vehicle rows');
    expect(procPack.evidence_snippets).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: 'Target update' }),
        expect.objectContaining({ label: 'Target insert' }),
      ])
    );
    expect(procPack.evidence.source_markdown_available).toBe(true);

    const exportedRaw = await readFile(
      join(
        targetRoot,
        'servers',
        'DW01',
        'databases',
        'Sonic_DW',
        'stored_procedures',
        'dbo__usp_DimVehicle.md'
      ),
      'utf8'
    );
    expect(exportedRaw).toContain('CREATE PROCEDURE [dbo].[usp_DimVehicle]');

    const manifest = JSON.parse(await readFile(join(targetRoot, 'catalog-manifest.json'), 'utf8'));
    expect(manifest.files.raw_markdown_root).toBe('servers/');
    expect(manifest.raw_source_markdown_count).toBeGreaterThan(0);
  });
});
