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
            title: 'Sonic Data Lineage README',
            file: 'pages/readme.md',
            hash: 'abc',
            bytes: 9,
            publish: true,
            labels: ['data-lineage'],
          },
        ],
        object_locator_pages: [
          {
            title: 'Object Locator 001 - FactClaim to LoadFactClaim',
            file: 'object-locator/001.md',
            hash: 'locator',
            bytes: 100,
            publish: true,
            labels: ['object-locator'],
          },
        ],
        quick_context_pages: [
          {
            title: 'Lineage Quick Context 001 - FactClaim to LoadFactClaim',
            file: 'quick-context/001.md',
            hash: 'quick',
            bytes: 100,
            publish: true,
            labels: ['lineage-quick-context'],
          },
        ],
        shard_pages: [
          {
            title: 'Catalog Shard 001 - DW01 Sonic_DW table',
            file: 'shards/001.md',
            hash: 'shard',
            bytes: 100,
            publish: true,
            labels: ['catalog-shard'],
          },
        ],
        object_pages: [
          {
            title: 'FactClaim',
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
    expect(result.pages[0].title).toBe('Sonic Data Lineage README');
    expect(result.pages[1].title).toBe('Object Locator 001 - FactClaim to LoadFactClaim');
    expect(result.pages[2].title).toBe('Lineage Quick Context 001 - FactClaim to LoadFactClaim');
    expect(result.pages[3].title).toBe('Catalog Shard 001 - DW01 Sonic_DW table');
    expect(result.attachments).toHaveLength(1);
    expect(result.warnings).toEqual([]);
  });

  test('publish cleans legacy AUTO pages before publishing clean generated titles', async () => {
    await seedExportManifest();

    const deletedUrls = [];
    const createdTitles = [];
    const legacyPagesByParent = {
      2221670415: [
        {
          id: 'legacy-root',
          title: '[AUTO] Sonic Data Lineage README',
          metadata: { labels: { results: [] } },
        },
      ],
      'legacy-root': [
        {
          id: 'legacy-child',
          title: '[AUTO] Old Child',
          metadata: { labels: { results: [] } },
        },
      ],
      'legacy-child': [],
    };

    const httpClient = {
      async get(url) {
        const childMatch = url.match(/\/rest\/api\/content\/([^/]+)\/child\/page$/);
        if (childMatch) {
          return { data: { results: legacyPagesByParent[childMatch[1]] || [] } };
        }
        return { data: { results: [] } };
      },
      async post(url, body) {
        if (url.endsWith('/rest/api/content')) {
          createdTitles.push(body.title);
          return { data: { id: `created-${createdTitles.length}` } };
        }
        return { data: { id: 'created-attachment' } };
      },
      async put() {
        return { data: { id: 'updated' } };
      },
      async delete(url) {
        deletedUrls.push(url);
        return { data: {} };
      },
    };

    const result = await syncConfluenceExport({
      exportRoot: tempRoot,
      dryRun: false,
      skipAttachments: true,
      httpClient,
      config: {
        baseUrl: 'https://sonicautomotive.atlassian.net/wiki',
        spaceKey: 'TDE',
        parentPageId: '2221670415',
        email: 'catalog@example.com',
        apiToken: 'token',
      },
    });

    expect(result.deletedPages.map((page) => page.title)).toEqual([
      '[AUTO] Old Child',
      '[AUTO] Sonic Data Lineage README',
    ]);
    expect(deletedUrls).toEqual([
      'https://sonicautomotive.atlassian.net/wiki/rest/api/content/legacy-child',
      'https://sonicautomotive.atlassian.net/wiki/rest/api/content/legacy-root',
    ]);
    expect(createdTitles).toEqual(
      expect.arrayContaining([
        'Sonic Data Lineage README',
        'Object Locator 001 - FactClaim to LoadFactClaim',
        'Lineage Quick Context 001 - FactClaim to LoadFactClaim',
        'Catalog Shard 001 - DW01 Sonic_DW table',
      ])
    );
  });

  test('renders markdown to Confluence storage HTML with generated notice', () => {
    const storage = pageStorageFromMarkdown('# Hello\n\n```mermaid\nflowchart LR\n```');

    expect(storage).toContain('Generated content');
    expect(storage).toContain('<h1>Hello</h1>');
    expect(storage).toContain('language-mermaid');
  });
});
