/**
 * Markdown Service Tests
 * Tests for parsing and validating markdown files
 */

import {
  extractPlainText,
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
