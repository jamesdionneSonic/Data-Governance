/**
 * Markdown Service Tests
 * Tests for parsing and validating markdown files
 */

import { mkdir, mkdtemp, rm, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import {
  extractPlainText,
  getMarkdownFiles,
  loadAllMarkdown,
  parseMarkdownContent,
  validateMetadata,
} from '../../src/services/markdownService.js';

describe('Markdown Service', () => {
  describe('Plain Text Extraction', () => {
    it('should remove markdown headers', () => {
      const markdown = '# Header 1\n## Header 2\nSome text';
      const text = extractPlainText(markdown);
      expect(text).not.toContain('#');
    });

    it('should remove bold markdown', () => {
      const markdown = '**bold text** and normal text';
      const text = extractPlainText(markdown);
      expect(text).toContain('bold text');
      expect(text).not.toContain('**');
    });

    it('should remove links', () => {
      const markdown = '[link text](https://example.com)';
      const text = extractPlainText(markdown);
      expect(text).toContain('link text');
      expect(text).not.toContain('https://');
    });

    it('should remove inline code', () => {
      const markdown = 'Use `code` here';
      const text = extractPlainText(markdown);
      expect(text).toContain('Use');
      expect(text).not.toContain('`');
    });

    it('should limit text to 500 characters', () => {
      const markdown = 'a'.repeat(1000);
      const text = extractPlainText(markdown);
      expect(text.length).toBeLessThanOrEqual(500);
    });
  });

  describe('Metadata Validation', () => {
    const validMetadata = {
      name: 'test_table',
      database: 'production_db',
      type: 'table',
      owner: 'data-team',
      sensitivity: 'internal',
      tags: ['pii', 'critical'],
      depends_on: [],
    };

    it('should validate correct metadata', () => {
      const errors = validateMetadata(validMetadata);
      expect(errors).toEqual([]);
    });

    it('should fail on missing name', () => {
      const metadata = { ...validMetadata };
      delete metadata.name;
      const errors = validateMetadata(metadata);
      expect(errors.some((e) => e.includes('name'))).toBe(true);
    });

    it('should fail on missing database', () => {
      const metadata = { ...validMetadata };
      delete metadata.database;
      const errors = validateMetadata(metadata);
      expect(errors.some((e) => e.includes('database'))).toBe(true);
    });

    it('should fail on missing type', () => {
      const metadata = { ...validMetadata };
      delete metadata.type;
      const errors = validateMetadata(metadata);
      expect(errors.some((e) => e.includes('type'))).toBe(true);
    });

    it('should fail on invalid type', () => {
      const metadata = { ...validMetadata, type: 'invalid_type' };
      const errors = validateMetadata(metadata);
      expect(errors.some((e) => e.includes('Invalid type'))).toBe(true);
    });

    it('should fail on invalid sensitivity', () => {
      const metadata = { ...validMetadata, sensitivity: 'super-secret' };
      const errors = validateMetadata(metadata);
      expect(errors.some((e) => e.includes('Invalid sensitivity'))).toBe(true);
    });

    it('should fail if tags is not array', () => {
      const metadata = { ...validMetadata, tags: 'not-an-array' };
      const errors = validateMetadata(metadata);
      expect(errors.some((e) => e.includes('tags'))).toBe(true);
    });

    it('should fail if depends_on is not array', () => {
      const metadata = { ...validMetadata, depends_on: 'string' };
      const errors = validateMetadata(metadata);
      expect(errors.some((e) => e.includes('depends_on'))).toBe(true);
    });

    it('should accept valid types', () => {
      const validTypes = ['table', 'procedure', 'function', 'view', 'package', 'dataset'];

      for (const type of validTypes) {
        const metadata = { ...validMetadata, type };
        const errors = validateMetadata(metadata);
        expect(errors).toEqual([]);
      }
    });

    it('should accept valid sensitivities', () => {
      const validSensitivities = ['public', 'internal', 'confidential', 'restricted'];

      for (const sensitivity of validSensitivities) {
        const metadata = { ...validMetadata, sensitivity };
        const errors = validateMetadata(metadata);
        expect(errors).toEqual([]);
      }
    });
  });

  describe('Frontmatter Parsing', () => {
    it('should parse markdown frontmatter with a leading UTF-8 BOM', () => {
      const metadata = parseMarkdownContent(
        '\uFEFF---\nname: claims\ndatabase: VendorData\ntype: table\nowner: data-team\n---\n\nClaims table.',
        'bom.md'
      );

      expect(metadata).toEqual(
        expect.objectContaining({
          id: 'claims',
          name: 'claims',
          database: 'VendorData',
          type: 'table',
        })
      );
    });
  });

  describe('Catalog Manifest', () => {
    let tempDir;

    afterEach(async () => {
      if (tempDir) {
        await rm(tempDir, { recursive: true, force: true });
      }
      tempDir = null;
    });

    it('should load only manifest-listed markdown files when a catalog manifest exists', async () => {
      tempDir = await mkdtemp(join(tmpdir(), 'markdown-manifest-'));
      await mkdir(join(tempDir, 'servers', 'current'), { recursive: true });
      await mkdir(join(tempDir, 'servers', 'stale'), { recursive: true });

      await writeFile(
        join(tempDir, 'servers', 'current', 'claims.md'),
        [
          '---',
          'id: current.claims',
          'name: claims',
          'database: VendorData',
          'type: table',
          'owner: data-team',
          '---',
          '',
          'Current catalog object.',
        ].join('\n'),
        'utf-8'
      );
      await writeFile(
        join(tempDir, 'servers', 'stale', 'claims.md'),
        [
          '---',
          'id: stale.claims',
          'name: claims',
          'database: VendorData',
          'type: table',
          'owner: data-team',
          '---',
          '',
          'Stale catalog object.',
        ].join('\n'),
        'utf-8'
      );
      await writeFile(
        join(tempDir, 'catalog-manifest.json'),
        JSON.stringify({ files: ['servers/current/claims.md'] }),
        'utf-8'
      );

      const files = await getMarkdownFiles(tempDir);
      const objects = await loadAllMarkdown(tempDir);

      expect(files).toHaveLength(1);
      expect(files[0]).toContain(join('servers', 'current', 'claims.md'));
      expect(objects.has('current.claims')).toBe(true);
      expect(objects.has('stale.claims')).toBe(false);
    });
  });

  describe('Object ID Generation', () => {
    it('should generate correct object ID', () => {
      const metadata = {
        name: 'customers',
        database: 'sales',
        type: 'table',
        owner: 'sales-team',
        sensitivity: 'confidential',
        tags: [],
        depends_on: [],
      };

      const id = `${metadata.database}.${metadata.name}`;
      expect(id).toBe('sales.customers');
    });
  });

  describe('Metadata Structure', () => {
    it('should include required fields in parsed metadata', () => {
      const metadata = {
        name: 'test_obj',
        database: 'test_db',
        type: 'table',
        owner: 'team',
        sensitivity: 'public',
        tags: [],
        depends_on: [],
        description: 'Test description',
        id: 'test_db.test_obj',
        filePath: '/path/to/file.md',
        createdAt: new Date(),
      };

      expect(metadata).toHaveProperty('id');
      expect(metadata).toHaveProperty('name');
      expect(metadata).toHaveProperty('database');
      expect(metadata).toHaveProperty('type');
      expect(metadata).toHaveProperty('owner');
      expect(metadata).toHaveProperty('sensitivity');
      expect(metadata).toHaveProperty('tags');
      expect(metadata).toHaveProperty('depends_on');
      expect(metadata).toHaveProperty('description');
    });
  });
});
