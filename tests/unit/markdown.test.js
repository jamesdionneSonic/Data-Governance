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

    it('should fail if columns is not array', () => {
      const metadata = { ...validMetadata, columns: 'not-an-array' };
      const errors = validateMetadata(metadata);
      expect(errors.some((e) => e.includes('columns'))).toBe(true);
    });

    it('should require column entries to include name and column_id', () => {
      const metadata = { ...validMetadata, columns: [{ name: 'ClaimID' }] };
      const errors = validateMetadata(metadata);
      expect(errors.some((e) => e.includes('column_id'))).toBe(true);
    });

    it('should fail if column usage fields are not arrays', () => {
      const metadata = {
        ...validMetadata,
        column_usage: 'not-an-array',
        unresolved_column_usage: 'not-an-array',
        column_risk_flags: 'not-an-array',
        column_lineage: 'not-an-array',
        unresolved_column_lineage: 'not-an-array',
        ssis_column_mappings: 'not-an-array',
        ssis_column_mapping_summary: 'not-an-object',
        ssis_column_mapping_sidecars: 'not-an-array',
        unresolved_ssis_column_mappings: 'not-an-array',
        lineage_quality: 'not-an-object',
        catalog_confidence: 'not-an-object',
      };
      const errors = validateMetadata(metadata);
      expect(errors).toEqual(
        expect.arrayContaining([
          'column_usage must be an array',
          'unresolved_column_usage must be an array',
          'column_risk_flags must be an array',
          'column_lineage must be an array',
          'unresolved_column_lineage must be an array',
          'ssis_column_mappings must be an array',
          'ssis_column_mapping_summary must be an object',
          'ssis_column_mapping_sidecars must be an array',
          'unresolved_ssis_column_mappings must be an array',
          'lineage_quality must be an object',
          'catalog_confidence must be an object',
        ])
      );
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

    it('should preserve structured column metadata from YAML frontmatter', () => {
      const metadata = parseMarkdownContent(
        [
          '---',
          'id: DW01.Sonic_DW.dbo.FactClaim',
          'name: FactClaim',
          'database: Sonic_DW',
          'schema: dbo',
          'type: table',
          'owner: data-team',
          'columns:',
          '  - name: ClaimID',
          '    column_id: DW01.Sonic_DW.dbo.FactClaim.ClaimID',
          '    data_type: bigint',
          '    nullable: false',
          '---',
          '',
          'Fact claim table.',
        ].join('\n'),
        'columns.md'
      );

      expect(metadata.columns).toEqual([
        expect.objectContaining({
          name: 'ClaimID',
          column_id: 'DW01.Sonic_DW.dbo.FactClaim.ClaimID',
          data_type: 'bigint',
          nullable: false,
        }),
      ]);
    });

    it('should preserve column usage and unresolved column usage metadata', () => {
      const metadata = parseMarkdownContent(
        [
          '---',
          'id: DW01.Sonic_DW.etl.LoadFactClaim',
          'name: LoadFactClaim',
          'database: Sonic_DW',
          'schema: etl',
          'type: procedure',
          'owner: data-team',
          'column_usage:',
          '  - column_id: DW01.Sonic_DW.dbo.FactClaim.ClaimID',
          '    object_id: DW01.Sonic_DW.dbo.FactClaim',
          '    process_id: DW01.Sonic_DW.etl.LoadFactClaim',
          '    usage_type: insert_target',
          '    usage_context: insert_column_list',
          '    validation_status: validated',
          'unresolved_column_usage:',
          '  - alias: missing',
          '    column_name: ClaimID',
          '    reason: alias_not_resolved_to_known_table_or_view',
          '    validation_status: unresolved',
          'column_risk_flags:',
          '  - process_id: DW01.Sonic_DW.etl.LoadFactClaim',
          '    flag_type: select_star',
          '    severity: high',
          '    usage_context: select_list',
          '    validation_status: risk_flag',
          'column_lineage:',
          '  - source_column_id: DW01.Sonic_DW.staging.Claims.ClaimID',
          '    target_column_id: DW01.Sonic_DW.dbo.FactClaim.ClaimID',
          '    process_id: DW01.Sonic_DW.etl.LoadFactClaim',
          '    transform_type: direct',
          '    validation_status: validated',
          'unresolved_column_lineage:',
          '  - process_id: DW01.Sonic_DW.etl.LoadFactClaim',
          '    target_column_id: DW01.Sonic_DW.dbo.FactClaim.ClaimAmount',
          '    reason: multiple_source_columns_share_target_context',
          '    validation_status: probable',
          '---',
          '',
          'Load fact claim procedure.',
        ].join('\n'),
        'column-usage.md'
      );

      expect(metadata.column_usage).toEqual([
        expect.objectContaining({
          column_id: 'DW01.Sonic_DW.dbo.FactClaim.ClaimID',
          usage_type: 'insert_target',
        }),
      ]);
      expect(metadata.unresolved_column_usage).toEqual([
        expect.objectContaining({
          alias: 'missing',
          reason: 'alias_not_resolved_to_known_table_or_view',
        }),
      ]);
      expect(metadata.column_risk_flags).toEqual([
        expect.objectContaining({
          flag_type: 'select_star',
          severity: 'high',
          validation_status: 'risk_flag',
        }),
      ]);
      expect(metadata.column_lineage).toEqual([
        expect.objectContaining({
          source_column_id: 'DW01.Sonic_DW.staging.Claims.ClaimID',
          target_column_id: 'DW01.Sonic_DW.dbo.FactClaim.ClaimID',
          validation_status: 'validated',
        }),
      ]);
      expect(metadata.unresolved_column_lineage).toEqual([
        expect.objectContaining({
          target_column_id: 'DW01.Sonic_DW.dbo.FactClaim.ClaimAmount',
          reason: 'multiple_source_columns_share_target_context',
          validation_status: 'probable',
        }),
      ]);
    });

    it('should preserve SSIS column mappings and unresolved SSIS mapping metadata', () => {
      const metadata = parseMarkdownContent(
        [
          '---',
          'id: SSIS01.SSISDB.ETL.Claims.LoadClaims.dtsx',
          'name: ETL.Claims.LoadClaims.dtsx',
          'database: ssisdb',
          'type: package',
          'owner: ssis-platform',
          'ssis_column_mapping_summary:',
          '  total_mappings: 125',
          '  embedded_mappings: 25',
          '  sidecar_mappings: 125',
          '  sidecar_chunks: 1',
          '  truncated: false',
          'ssis_column_mapping_sidecars:',
          '  - id: SSIS01.SSISDB.ETL.Claims.LoadClaims.dtsx.ssis_column_mappings.chunk_001',
          '    chunk_number: 1',
          '    records: 125',
          'ssis_column_mappings:',
          '  - package_id: SSIS01.SSISDB.ETL.Claims.LoadClaims.dtsx',
          '    component_name: OLE DB Destination',
          '    component_type: Microsoft.OLEDBDestination',
          '    source_component: OLE DB Source',
          '    destination_component: OLE DB Destination',
          '    source_object: dbo.SourceClaims',
          '    destination_object: dbo.TargetClaims',
          '    input_column: ClaimID',
          '    output_column: CLAIM_ID',
          '    external_metadata_column: CLAIM_ID',
          '    transform_type: rename',
          '    validation_status: validated',
          'unresolved_ssis_column_mappings:',
          '  - component_name: DynamicConn',
          '    reason: dynamic_connection_manager',
          '    validation_status: unresolved',
          'ssis_edge_summary:',
          '  reads:',
          '    direct_source_reads:',
          '      - SQL01.SourceDB.dbo.SourceClaims',
          '    lookup_reads:',
          '      - SQL01.SourceDB.dbo.DimClaimType',
          '    target_maintenance_reads:',
          '      - SQL02.TargetDB.dbo.TargetClaims',
          '    business_consumer_reads: []',
          '  writes:',
          '    direct_writes: []',
          '    insert_writes: []',
          '    update_writes: []',
          '    delete_writes: []',
          '    upsert_writes:',
          '      - SQL02.TargetDB.dbo.TargetClaims',
          '  calls:',
          '    - SQL02.TargetDB.dbo.usp_LoadClaims',
          'lineage_quality:',
          '  validated_edges: 12',
          '  probable_edges: 1',
          '  unresolved_facts: 2',
          'catalog_confidence:',
          '  overall_score: 0.91',
          '  edge_correctness_score: 0.98',
          '  coverage_score: 0.82',
          '  column_lineage_score: 0.88',
          '  unresolved_risk_score: 0.12',
          '  confidence_label: high',
          '  warnings:',
          '    - unresolved_lineage_facts_present',
          '---',
          '',
          'SSIS package.',
        ].join('\n'),
        'ssis-column-mapping.md'
      );

      expect(metadata.ssis_column_mappings).toEqual([
        expect.objectContaining({
          component_name: 'OLE DB Destination',
          input_column: 'ClaimID',
          output_column: 'CLAIM_ID',
          transform_type: 'rename',
        }),
      ]);
      expect(metadata.ssis_column_mapping_summary).toEqual({
        total_mappings: 125,
        embedded_mappings: 25,
        sidecar_mappings: 125,
        sidecar_chunks: 1,
        truncated: false,
      });
      expect(metadata.ssis_column_mapping_sidecars).toEqual([
        expect.objectContaining({
          id: 'SSIS01.SSISDB.ETL.Claims.LoadClaims.dtsx.ssis_column_mappings.chunk_001',
          chunk_number: 1,
          records: 125,
        }),
      ]);
      expect(metadata.unresolved_ssis_column_mappings).toEqual([
        expect.objectContaining({
          component_name: 'DynamicConn',
          reason: 'dynamic_connection_manager',
        }),
      ]);
      expect(metadata.ssis_edge_summary).toEqual({
        reads: {
          direct_source_reads: ['SQL01.SourceDB.dbo.SourceClaims'],
          lookup_reads: ['SQL01.SourceDB.dbo.DimClaimType'],
          target_maintenance_reads: ['SQL02.TargetDB.dbo.TargetClaims'],
          business_consumer_reads: [],
        },
        writes: {
          direct_writes: [],
          insert_writes: [],
          update_writes: [],
          delete_writes: [],
          upsert_writes: ['SQL02.TargetDB.dbo.TargetClaims'],
        },
        calls: ['SQL02.TargetDB.dbo.usp_LoadClaims'],
      });
      expect(metadata.lineage_quality).toEqual({
        validated_edges: 12,
        probable_edges: 1,
        unresolved_facts: 2,
      });
      expect(metadata.catalog_confidence).toEqual(
        expect.objectContaining({
          overall_score: 0.91,
          confidence_label: 'high',
          warnings: ['unresolved_lineage_facts_present'],
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
