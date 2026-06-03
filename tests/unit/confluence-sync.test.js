import { mkdir, mkdtemp, rm, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';

import {
  loadConfluenceSyncConfig,
  pageStorageFromMarkdown,
  syncConfluenceExport,
  validateConfluenceSyncConfig,
} from '../../src/services/confluenceSyncService.js';

describe('Confluence Sync Service', () => {
  let tempRoot;

  beforeEach(async () => {
    tempRoot = await mkdtemp(join(tmpdir(), 'dg-confluence-sync-'));
  });

  afterEach(async () => {
    await rm(tempRoot, { recursive: true, force: true });
  });

  async function seedExportManifest() {
    await mkdir(join(tempRoot, 'pages'), { recursive: true });
    await mkdir(join(tempRoot, 'object-locator'), { recursive: true });
    await mkdir(join(tempRoot, 'quick-context'), { recursive: true });
    await mkdir(join(tempRoot, 'shards'), { recursive: true });
    await mkdir(join(tempRoot, 'attachments'), { recursive: true });
    await writeFile(join(tempRoot, 'pages', 'readme.md'), '# Readme\n', 'utf8');
    await writeFile(join(tempRoot, 'object-locator', '001.md'), '# Locator\n', 'utf8');
    await writeFile(join(tempRoot, 'quick-context', '001.md'), '# Quick Context\n', 'utf8');
    await writeFile(join(tempRoot, 'shards', '001.md'), '# Shard\n', 'utf8');
    await writeFile(join(tempRoot, 'attachments', 'catalog-object-index.json'), '[]\n', 'utf8');
    await writeFile(
      join(tempRoot, 'confluence-export-manifest.json'),
      JSON.stringify({
        pages: [
          {
            title: '[AUTO] Sonic Data Lineage README',
            file: 'pages/readme.md',
            hash: 'abc',
            bytes: 9,
            publish: true,
            labels: ['data-lineage'],
          },
        ],
        object_locator_pages: [
          {
            title: '[AUTO] Object Locator 001 - FactClaim to LoadFactClaim',
            file: 'object-locator/001.md',
            hash: 'locator',
            bytes: 100,
            publish: true,
            labels: ['object-locator'],
          },
        ],
        quick_context_pages: [
          {
            title: '[AUTO] Lineage Quick Context 001 - FactClaim to LoadFactClaim',
            file: 'quick-context/001.md',
            hash: 'quick',
            bytes: 100,
            publish: true,
            labels: ['lineage-quick-context'],
          },
        ],
        shard_pages: [
          {
            title: '[AUTO] Catalog Shard 001 - DW01 Sonic_DW table',
            file: 'shards/001.md',
            hash: 'shard',
            bytes: 100,
            publish: true,
            labels: ['catalog-shard'],
          },
        ],
        object_pages: [
          {
            title: '[AUTO] FactClaim',
            file: 'object-context/fact.md',
            hash: 'def',
            bytes: 10,
            publish: false,
            labels: ['object-context'],
          },
        ],
        attachments: [
          {
            file_name: 'catalog-object-index.json',
            file: 'attachments/catalog-object-index.json',
            hash: 'ghi',
            bytes: 3,
            publish: true,
            labels: ['object-index'],
          },
        ],
      }),
      'utf8'
    );
  }

  test('validates required config without requiring credentials during dry-run', () => {
    const config = loadConfluenceSyncConfig(
      {},
      {
        baseUrl: 'https://sonicautomotive.atlassian.net/wiki',
        spaceKey: 'TDE',
        parentPageId: '2221670415',
      }
    );

    expect(validateConfluenceSyncConfig(config)).toEqual({ ok: true, missing: [] });
    expect(validateConfluenceSyncConfig(config, { requireCredentials: true })).toEqual({
      ok: false,
      missing: ['CONFLUENCE_EMAIL', 'CONFLUENCE_API_TOKEN'],
    });
  });

  test('creates dry-run plan without credentials or network calls', async () => {
    await seedExportManifest();

    const result = await syncConfluenceExport({
      exportRoot: tempRoot,
      dryRun: true,
      config: {
        baseUrl: 'https://sonicautomotive.atlassian.net/wiki',
        spaceKey: 'TDE',
        parentPageId: '2221670415',
      },
    });

    expect(result.status).toBe('ready');
    expect(result.pages).toHaveLength(4);
    expect(result.pages[0].title).toBe('[AUTO] Sonic Data Lineage README');
    expect(result.pages[1].title).toBe('[AUTO] Object Locator 001 - FactClaim to LoadFactClaim');
    expect(result.pages[2].title).toBe(
      '[AUTO] Lineage Quick Context 001 - FactClaim to LoadFactClaim'
    );
    expect(result.pages[3].title).toBe('[AUTO] Catalog Shard 001 - DW01 Sonic_DW table');
    expect(result.attachments).toHaveLength(1);
    expect(result.warnings[0]).toContain('Legacy object pages');
  });

  test('renders markdown to Confluence storage HTML with generated notice', () => {
    const storage = pageStorageFromMarkdown('# Hello\n\n```mermaid\nflowchart LR\n```');

    expect(storage).toContain('Generated content');
    expect(storage).toContain('<h1>Hello</h1>');
    expect(storage).toContain('language-mermaid');
  });
});
