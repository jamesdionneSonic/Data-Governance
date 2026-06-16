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
    const procDir = join(
      markdownRoot,
      'servers',
      'DW01',
      'databases',
      'Sonic_DW',
      'stored_procedures'
    );
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

  async function seedSsisCatalog() {
    const markdownRoot = join(tempRoot, 'markdown');
    const ssisDir = join(
      markdownRoot,
      'servers',
      'SSIS01',
      'ssis_packages',
      'FOCUS',
      'MainProject'
    );
    await mkdir(ssisDir, { recursive: true });

    await writeFile(
      join(ssisDir, 'MainPackage.dtsx.md'),
      [
        '---',
        'id: SSIS01.SSISDB.FOCUS.MainProject.MainPackage.dtsx',
        'name: FOCUS.MainProject.MainPackage.dtsx',
        'server: SSIS01',
        'database: ssisdb',
        'folder_name: FOCUS',
        'project_name: MainProject',
        'package_name: MainPackage.dtsx',
        'package_path: FOCUS.MainProject.MainPackage.dtsx',
        'type: package',
        'owner: ssis-platform',
        'reads_from:',
        '  - SQL01.StagingDB.dbo.SourceLead',
        'writes_to:',
        '  - SQL02.Sonic_DW.dbo.FactLead',
        'ssis_edge_summary:',
        '  reads:',
        '    direct_source_reads:',
        '      - SQL01.StagingDB.dbo.SourceLead',
        '    lookup_reads: []',
        '    target_maintenance_reads: []',
        '    business_consumer_reads: []',
        '  writes:',
        '    direct_writes: []',
        '    insert_writes: []',
        '    update_writes: []',
        '    delete_writes: []',
        '    upsert_writes:',
        '      - SQL02.Sonic_DW.dbo.FactLead',
        '  calls: []',
        'catalog_confidence:',
        '  overall_score: 0.94',
        '  edge_correctness_score: 0.99',
        '  column_lineage_score: 0.72',
        '  confidence_label: high',
        '---',
        '',
        'Main package.',
      ].join('\n'),
      'utf8'
    );

    await writeFile(
      join(ssisDir, 'MainPackage.dtsx.column_mappings.chunk_001.md'),
      [
        '---',
        'id: SSIS01.SSISDB.FOCUS.MainProject.MainPackage.dtsx.ssis_column_mappings.chunk_001',
        'name: FOCUS.MainProject.MainPackage.dtsx.column_mappings.chunk_001',
        'server: SSIS01',
        'database: ssisdb',
        'folder_name: FOCUS',
        'project_name: MainProject',
        'package_name: MainPackage.dtsx',
        'package_path: FOCUS.MainProject.MainPackage.dtsx',
        'type: dataset',
        'owner: ssis-platform',
        'depends_on:',
        '  - SSIS01.SSISDB.FOCUS.MainProject.MainPackage.dtsx',
        'catalog_confidence:',
        '  overall_score: 0.9',
        '  edge_correctness_score: 0.95',
        '  column_lineage_score: 0.8',
        '  confidence_label: high',
        '---',
        '',
        'Column mapping sidecar.',
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

    const procPackPath = await findFile(
      join(targetRoot, 'context-packs'),
      /^usp_DimVehicle--.*\.json$/
    );
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

  test('exports SSIS navigation with native hierarchy wording and separate evidence sidecars', async () => {
    const markdownRoot = await seedSsisCatalog();
    await buildRuntimeCatalogIndexes(markdownRoot, {});
    const targetRoot = join(tempRoot, 'repo');

    await exportCatalogRepo({
      markdownRoot,
      targetRoot,
    });

    const ssisRootReadme = await readFile(join(targetRoot, 'ssis', 'README.md'), 'utf8');
    expect(ssisRootReadme).toContain('native SSIS folder and project hierarchy');
    expect(ssisRootReadme).toContain('| Folder | Packages | Evidence Sidecars |');
    expect(ssisRootReadme).toContain('| [FOCUS](f/');
    expect(ssisRootReadme).toContain('| 1 | 1 |');

    const folderDirs = await readdir(join(targetRoot, 'ssis', 'f'));
    expect(folderDirs.length).toBeGreaterThan(0);
    const folderReadmePath = join(targetRoot, 'ssis', 'f', folderDirs[0], 'README.md');
    const folderReadme = await readFile(folderReadmePath, 'utf8');
    expect(folderReadme).toContain('Native SSIS folder project index');
    expect(folderReadme).toContain('| Project | Packages | Evidence Sidecars |');

    const projectDirs = await readdir(join(targetRoot, 'ssis', 'f', folderDirs[0], 'p'));
    expect(projectDirs.length).toBeGreaterThan(0);
    const projectReadmePath = join(
      targetRoot,
      'ssis',
      'f',
      folderDirs[0],
      'p',
      projectDirs[0],
      'README.md'
    );
    const projectReadme = await readFile(projectReadmePath, 'utf8');
    expect(projectReadme).toContain('## Packages');
    expect(projectReadme).toContain('## Evidence Sidecars');
    expect(projectReadme).toContain('MainPackage.dtsx');
    expect(projectReadme).toContain('column_mappings.chunk_001');
  });
});
