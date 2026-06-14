import { mkdir, mkdtemp, readFile, rm, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';

import { buildConfluenceExport } from '../../src/services/confluenceExportService.js';

describe('Confluence Export Service', () => {
  let tempRoot;

  beforeEach(async () => {
    tempRoot = await mkdtemp(join(tmpdir(), 'dg-confluence-export-'));
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
      join(tableDir, 'dbo__FactClaim.md'),
      [
        '---',
        'id: DW01.Sonic_DW.dbo.FactClaim',
        'name: FactClaim',
        'server: DW01',
        'database: Sonic_DW',
        'schema: dbo',
        'type: table',
        'owner: data-team',
        'used_by:',
        '  - DW01.Sonic_DW.etl.LoadFactClaim',
        'columns:',
        '  - name: ClaimID',
        '    column_id: DW01.Sonic_DW.dbo.FactClaim.ClaimID',
        'catalog_confidence:',
        '  overall_score: 0.91',
        '  confidence_label: high',
        '---',
        '',
        'Fact claim table.',
      ].join('\n'),
      'utf8'
    );

    await writeFile(
      join(procDir, 'etl__LoadFactClaim.md'),
      [
        '---',
        'id: DW01.Sonic_DW.etl.LoadFactClaim',
        'name: LoadFactClaim',
        'server: DW01',
        'database: Sonic_DW',
        'schema: etl',
        'type: procedure',
        'owner: data-team',
        'writes_to:',
        '  - DW01.Sonic_DW.dbo.FactClaim',
        'catalog_confidence:',
        '  overall_score: 0.83',
        '  confidence_label: medium',
        '---',
        '',
        'Loads fact claims.',
      ].join('\n'),
      'utf8'
    );

    await writeFile(
      join(markdownRoot, 'catalog-manifest.json'),
      JSON.stringify({
        files: [
          'servers/DW01/databases/Sonic_DW/tables/dbo__FactClaim.md',
          'servers/DW01/databases/Sonic_DW/stored_procedures/etl__LoadFactClaim.md',
        ],
      }),
      'utf8'
    );
    await writeFile(join(markdownRoot, 'rebuild-report.md'), '# Catalog Rebuild Report\n', 'utf8');
    return markdownRoot;
  }

  test('builds summary pages, shard pages, attachments, and manifest', async () => {
    const markdownRoot = await seedCatalog();
    const outputRoot = join(tempRoot, 'confluence-export');
    const staleRunFile = join(
      outputRoot,
      'runs',
      'old-run',
      'shards',
      '001__unknown__Sonic_DW.md'
    );
    const staleRootFile = join(outputRoot, 'shards', '001__unknown__Sonic_DW.md');

    await mkdir(join(outputRoot, 'runs', 'old-run', 'shards'), { recursive: true });
    await mkdir(join(outputRoot, 'shards'), { recursive: true });
    await writeFile(staleRunFile, 'unknown.Sonic_DW stale run page', 'utf8');
    await writeFile(staleRootFile, 'unknown.Sonic_DW stale root page', 'utf8');
    await writeFile(join(outputRoot, 'confluence-export-manifest.json'), '{"stale":true}', 'utf8');

    const result = await buildConfluenceExport({
      markdownRoot,
      outputRoot,
      parentPageId: '2221670415',
      confluenceBaseUrl: 'https://sonicautomotive.atlassian.net/wiki',
      spaceKey: 'TDE',
    });

    await expect(readFile(staleRunFile, 'utf8')).rejects.toThrow();
    await expect(readFile(staleRootFile, 'utf8')).rejects.toThrow();

    expect(result.manifest.pages.map((page) => page.title)).toEqual(
      expect.arrayContaining([
        'Sonic Data Lineage README',
        'Latest Rebuild Report',
        'Governance Portal',
        'Object Index',
      ])
    );
    expect(result.manifest.shard_pages).toHaveLength(2);
    expect(result.manifest.object_locator_pages.length).toBeGreaterThan(0);
    expect(result.manifest.quick_context_pages.length).toBeGreaterThan(0);
    expect(result.manifest.object_locator_pages[0].title).toContain('Object Locator');
    expect(result.manifest.quick_context_pages[0].title).toContain(
      'Lineage Quick Context'
    );
    expect(result.manifest.shard_pages.every((page) => page.publish === true)).toBe(true);
    expect(result.manifest.object_locator_pages.every((page) => page.publish === true)).toBe(true);
    expect(result.manifest.quick_context_pages.every((page) => page.publish === true)).toBe(true);
    expect(result.manifest.object_pages.length).toBeGreaterThan(0);
    expect(result.manifest.attachments.map((attachment) => attachment.file_name)).toEqual(
      expect.arrayContaining([
        'catalog-object-index.json',
        'catalog-object-registry.json',
        'catalog-object-registry.csv',
        'lineage-catalog.zip',
      ])
    );

    const shardPages = await Promise.all(
      result.manifest.shard_pages.map((page) => readFile(join(outputRoot, page.file), 'utf8'))
    );
    expect(shardPages.join('\n')).toContain('## Objects');
    expect(shardPages.join('\n')).toContain('object_id: DW01.Sonic_DW.dbo.FactClaim');
    expect(shardPages.join('\n')).toContain('source_markdown_path:');

    const quickContextPages = await Promise.all(
      result.manifest.quick_context_pages.map((page) => readFile(join(outputRoot, page.file), 'utf8'))
    );
    expect(quickContextPages.join('\n')).toContain('object_id: DW01.Sonic_DW.dbo.FactClaim');
    expect(quickContextPages.join('\n')).toContain('direct_downstream_count: 1');
    expect(quickContextPages.join('\n')).toMatch(/shard_title: "?Catalog Shard/);

    const objectLocatorPages = await Promise.all(
      result.manifest.object_locator_pages.map((page) => readFile(join(outputRoot, page.file), 'utf8'))
    );
    expect(objectLocatorPages.join('\n')).toContain('object_id: DW01.Sonic_DW.dbo.FactClaim');
    expect(objectLocatorPages.join('\n')).toMatch(/quick_context_title: "?Lineage Quick Context/);

    const manifest = JSON.parse(
      await readFile(join(outputRoot, 'confluence-export-manifest.json'), 'utf8')
    );
    expect(manifest.stats.objects).toBe(2);
    expect(manifest.stats.object_locator_pages).toBeGreaterThan(0);
    expect(manifest.stats.quick_context_pages).toBeGreaterThan(0);
    expect(manifest.stats.shard_pages).toBe(2);
    expect(manifest.stats.governed_asset_pages).toBeGreaterThan(0);
    expect(manifest.confluence.parent_page_id).toBe('2221670415');
  });
});
