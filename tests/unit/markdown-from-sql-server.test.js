import MarkdownGenerator from '../../src/services/markdownFromSqlServer.js';
import { parseMarkdownContent } from '../../src/services/markdownService.js';

describe('Markdown From SQL Server', () => {
  it('emits structured table column inventory with stable column IDs and key/index evidence', () => {
    const generator = new MarkdownGenerator({
      serverName: 'DW01',
      database: 'Sonic_DW',
      extractedAt: '2026-06-02T00:00:00.000Z',
      relationships: [
        {
          type: 'explicit_fk',
          fromTable: 'DW01.Sonic_DW.dbo.FactClaim',
          fromColumn: 'DealerID',
          toTable: 'DW01.Sonic_DW.dbo.DimDealer',
          toColumn: 'DealerID',
          constraintName: 'FK_FactClaim_DimDealer',
        },
      ],
    });

    const markdown = generator.generateTableMarkdown({
      id: 'DW01.Sonic_DW.dbo.FactClaim',
      name: 'FactClaim',
      serverName: 'DW01',
      schema: 'dbo',
      type: 'table',
      description: '',
      rowCount: 10,
      sizeKb: 64,
      columns: [
        {
          name: 'ClaimID',
          ordinal: 1,
          dataType: 'bigint',
          maxLength: 8,
          precision: 19,
          scale: 0,
          isNullable: false,
          isIdentity: true,
        },
        {
          name: 'DealerID',
          ordinal: 2,
          dataType: 'int',
          maxLength: 4,
          precision: 10,
          scale: 0,
          isNullable: false,
        },
      ],
      indexes: [
        {
          name: 'PK_FactClaim',
          type: 'CLUSTERED',
          isUnique: true,
          isPrimaryKey: true,
          keyColumns: [{ name: 'ClaimID', keyOrdinal: 1, sort: 'ASC' }],
          includedColumns: [],
        },
        {
          name: 'IX_FactClaim_DealerID',
          type: 'NONCLUSTERED',
          isUnique: false,
          isPrimaryKey: false,
          keyColumns: [{ name: 'DealerID', keyOrdinal: 1, sort: 'ASC' }],
          includedColumns: ['ClaimID'],
        },
      ],
      primaryKey: {
        name: 'PK_FactClaim',
        columns: [{ name: 'ClaimID', keyOrdinal: 1 }],
      },
      uniqueConstraints: [],
      checkConstraints: [],
    });

    const parsed = parseMarkdownContent(markdown, 'generated-table.md');

    expect(parsed.columns).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'ClaimID',
          column_id: 'DW01.Sonic_DW.dbo.FactClaim.ClaimID',
          data_type: 'bigint',
          primary_key: true,
          identity: true,
          indexes: expect.arrayContaining([
            expect.objectContaining({ name: 'PK_FactClaim', role: 'key', primary_key: true }),
            expect.objectContaining({ name: 'IX_FactClaim_DealerID', role: 'included' }),
          ]),
        }),
        expect.objectContaining({
          name: 'DealerID',
          column_id: 'DW01.Sonic_DW.dbo.FactClaim.DealerID',
          foreign_keys: [
            expect.objectContaining({
              constraint_name: 'FK_FactClaim_DimDealer',
              references_column_id: 'DW01.Sonic_DW.dbo.DimDealer.DealerID',
            }),
          ],
        }),
      ])
    );
  });

  it('emits structured view column inventory with canonical column IDs', () => {
    const generator = new MarkdownGenerator({
      serverName: 'DW01',
      database: 'Sonic_DW',
      extractedAt: '2026-06-02T00:00:00.000Z',
    });

    const markdown = generator.generateViewMarkdown({
      id: 'DW01.Sonic_DW.reporting.vwClaims',
      name: 'vwClaims',
      serverName: 'DW01',
      schema: 'reporting',
      description: '',
      definition: 'SELECT ClaimID FROM dbo.FactClaim;',
      dependencies: [],
      used_by: [],
      columns: [
        {
          name: 'ClaimID',
          ordinal: 1,
          dataType: 'bigint',
          maxLength: 8,
          precision: 19,
          scale: 0,
          isNullable: false,
        },
      ],
    });

    const parsed = parseMarkdownContent(markdown, 'generated-view.md');

    expect(parsed.columns).toEqual([
      expect.objectContaining({
        name: 'ClaimID',
        column_id: 'DW01.Sonic_DW.reporting.vwClaims.ClaimID',
        data_type: 'bigint',
      }),
    ]);
  });

  it('extracts explicit SQL column usage for insert, select, join, filter, group, and calculations', () => {
    const generator = new MarkdownGenerator({
      serverName: 'DW01',
      database: 'Sonic_DW',
      extractedAt: '2026-06-02T00:00:00.000Z',
      tables: [
        {
          id: 'DW01.Sonic_DW.dbo.FactClaim',
          serverName: 'DW01',
          schema: 'dbo',
          name: 'FactClaim',
          columns: [
            { name: 'ClaimID' },
            { name: 'DealerID' },
            { name: 'ClaimAmount' },
          ],
        },
        {
          id: 'DW01.Sonic_DW.staging.Claims',
          serverName: 'DW01',
          schema: 'staging',
          name: 'Claims',
          columns: [
            { name: 'ClaimID' },
            { name: 'Amount' },
            { name: 'DealerCode' },
            { name: 'Status' },
          ],
        },
        {
          id: 'DW01.Sonic_DW.dbo.DimDealer',
          serverName: 'DW01',
          schema: 'dbo',
          name: 'DimDealer',
          columns: [
            { name: 'DealerID' },
            { name: 'DealerCode' },
          ],
        },
      ],
    });

    const markdown = generator.generateStoredProcedureMarkdown({
      id: 'DW01.Sonic_DW.etl.LoadFactClaim',
      name: 'LoadFactClaim',
      serverName: 'DW01',
      schema: 'etl',
      definition: `
        CREATE PROCEDURE etl.LoadFactClaim AS
        INSERT INTO dbo.FactClaim (ClaimID, DealerID, ClaimAmount)
        SELECT src.ClaimID, d.DealerID, src.Amount + 1 AS ClaimAmount
        FROM staging.Claims AS src
        JOIN dbo.DimDealer AS d ON src.DealerCode = d.DealerCode
        WHERE src.Status = 'A'
        GROUP BY src.ClaimID, d.DealerID, src.Amount;
      `,
      dependencies: [],
      parameters: [],
    });

    const parsed = parseMarkdownContent(markdown, 'column-usage-procedure.md');

    expect(parsed.column_usage).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          column_id: 'DW01.Sonic_DW.dbo.FactClaim.ClaimID',
          usage_type: 'insert_target',
          usage_context: 'insert_column_list',
        }),
        expect.objectContaining({
          column_id: 'DW01.Sonic_DW.staging.Claims.ClaimID',
          usage_type: 'read',
          usage_context: 'select_list',
        }),
        expect.objectContaining({
          column_id: 'DW01.Sonic_DW.staging.Claims.Amount',
          usage_type: 'calculation',
          usage_context: 'select_list',
        }),
        expect.objectContaining({
          column_id: 'DW01.Sonic_DW.staging.Claims.DealerCode',
          usage_type: 'join_key',
          usage_context: 'join_on',
        }),
        expect.objectContaining({
          column_id: 'DW01.Sonic_DW.dbo.DimDealer.DealerCode',
          usage_type: 'join_key',
          usage_context: 'join_on',
        }),
        expect.objectContaining({
          column_id: 'DW01.Sonic_DW.staging.Claims.Status',
          usage_type: 'filter',
          usage_context: 'where',
        }),
        expect.objectContaining({
          column_id: 'DW01.Sonic_DW.staging.Claims.Amount',
          usage_type: 'group_by',
          usage_context: 'group_by',
        }),
      ])
    );
    expect(parsed.unresolved_column_usage).toEqual([]);
  });

  it('extracts merge column usage for merge keys and update/insert targets', () => {
    const generator = new MarkdownGenerator({
      serverName: 'DW01',
      database: 'Sonic_DW',
      extractedAt: '2026-06-02T00:00:00.000Z',
      tables: [
        {
          id: 'DW01.Sonic_DW.dbo.FactClaim',
          serverName: 'DW01',
          schema: 'dbo',
          name: 'FactClaim',
          columns: [
            { name: 'ClaimID' },
            { name: 'ClaimAmount' },
          ],
        },
        {
          id: 'DW01.Sonic_DW.staging.Claims',
          serverName: 'DW01',
          schema: 'staging',
          name: 'Claims',
          columns: [
            { name: 'ClaimID' },
            { name: 'Amount' },
          ],
        },
      ],
    });

    const markdown = generator.generateStoredProcedureMarkdown({
      id: 'DW01.Sonic_DW.etl.MergeFactClaim',
      name: 'MergeFactClaim',
      serverName: 'DW01',
      schema: 'etl',
      definition: `
        CREATE PROCEDURE etl.MergeFactClaim AS
        MERGE INTO dbo.FactClaim AS target
        USING staging.Claims AS src
        ON target.ClaimID = src.ClaimID
        WHEN MATCHED THEN
          UPDATE SET target.ClaimAmount = src.Amount
        WHEN NOT MATCHED THEN
          INSERT (ClaimID, ClaimAmount) VALUES (src.ClaimID, src.Amount);
      `,
      dependencies: [],
      parameters: [],
    });

    const parsed = parseMarkdownContent(markdown, 'merge-column-usage.md');

    expect(parsed.column_usage).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          column_id: 'DW01.Sonic_DW.dbo.FactClaim.ClaimID',
          usage_type: 'merge_key',
        }),
        expect.objectContaining({
          column_id: 'DW01.Sonic_DW.staging.Claims.ClaimID',
          usage_type: 'merge_key',
        }),
        expect.objectContaining({
          column_id: 'DW01.Sonic_DW.dbo.FactClaim.ClaimAmount',
          usage_type: 'update_target',
          usage_context: 'merge_update_set',
        }),
        expect.objectContaining({
          column_id: 'DW01.Sonic_DW.dbo.FactClaim.ClaimID',
          usage_type: 'insert_target',
          usage_context: 'merge_insert_column_list',
        }),
      ])
    );
  });

  it('extracts standalone update targets and source reads', () => {
    const generator = new MarkdownGenerator({
      serverName: 'DW01',
      database: 'Sonic_DW',
      extractedAt: '2026-06-02T00:00:00.000Z',
      tables: [
        {
          id: 'DW01.Sonic_DW.dbo.FactClaim',
          serverName: 'DW01',
          schema: 'dbo',
          name: 'FactClaim',
          columns: [
            { name: 'ClaimID' },
            { name: 'ClaimAmount' },
          ],
        },
        {
          id: 'DW01.Sonic_DW.staging.Claims',
          serverName: 'DW01',
          schema: 'staging',
          name: 'Claims',
          columns: [
            { name: 'ClaimID' },
            { name: 'Amount' },
          ],
        },
      ],
    });

    const markdown = generator.generateStoredProcedureMarkdown({
      id: 'DW01.Sonic_DW.etl.UpdateFactClaim',
      name: 'UpdateFactClaim',
      serverName: 'DW01',
      schema: 'etl',
      definition: `
        CREATE PROCEDURE etl.UpdateFactClaim AS
        UPDATE target
        SET target.ClaimAmount = src.Amount
        FROM dbo.FactClaim AS target
        JOIN staging.Claims AS src ON target.ClaimID = src.ClaimID;
      `,
      dependencies: [],
      parameters: [],
    });

    const parsed = parseMarkdownContent(markdown, 'update-column-usage.md');

    expect(parsed.column_usage).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          column_id: 'DW01.Sonic_DW.dbo.FactClaim.ClaimAmount',
          usage_type: 'update_target',
          usage_context: 'set_clause',
        }),
        expect.objectContaining({
          column_id: 'DW01.Sonic_DW.staging.Claims.Amount',
          usage_type: 'read',
          usage_context: 'set_clause',
        }),
        expect.objectContaining({
          column_id: 'DW01.Sonic_DW.dbo.FactClaim.ClaimID',
          usage_type: 'join_key',
        }),
      ])
    );
  });

  it('captures CTE alias references as unresolved while preserving base table usage', () => {
    const generator = new MarkdownGenerator({
      serverName: 'DW01',
      database: 'Sonic_DW',
      extractedAt: '2026-06-02T00:00:00.000Z',
      tables: [
        {
          id: 'DW01.Sonic_DW.staging.Claims',
          serverName: 'DW01',
          schema: 'staging',
          name: 'Claims',
          columns: [
            { name: 'ClaimID' },
            { name: 'Status' },
          ],
        },
      ],
    });

    const markdown = generator.generateStoredProcedureMarkdown({
      id: 'DW01.Sonic_DW.etl.ReadClaimCte',
      name: 'ReadClaimCte',
      serverName: 'DW01',
      schema: 'etl',
      definition: `
        CREATE PROCEDURE etl.ReadClaimCte AS
        WITH claim_cte AS (
          SELECT src.ClaimID
          FROM staging.Claims AS src
          WHERE src.Status = 'A'
        )
        SELECT claim_cte.ClaimID
        FROM claim_cte;
      `,
      dependencies: [],
      parameters: [],
    });

    const parsed = parseMarkdownContent(markdown, 'cte-column-usage.md');

    expect(parsed.column_usage).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          column_id: 'DW01.Sonic_DW.staging.Claims.ClaimID',
          usage_type: 'read',
        }),
        expect.objectContaining({
          column_id: 'DW01.Sonic_DW.staging.Claims.Status',
          usage_type: 'filter',
        }),
      ])
    );
    expect(parsed.unresolved_column_usage).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          alias: 'claim_cte',
          column_name: 'ClaimID',
          reason: 'alias_not_resolved_to_known_table_or_view',
        }),
      ])
    );
  });

  it('resolves four-part linked-server column references when the exact object exists', () => {
    const generator = new MarkdownGenerator({
      serverName: 'DW01',
      database: 'Sonic_DW',
      extractedAt: '2026-06-02T00:00:00.000Z',
      tables: [
        {
          id: 'L1-DWASQL-02,12010.VendorData.JMA.Claims',
          serverName: 'L1-DWASQL-02,12010',
          database: 'VendorData',
          schema: 'JMA',
          name: 'Claims',
          columns: [
            { name: 'ClaimID' },
            { name: 'ClaimAmount' },
          ],
        },
      ],
    });

    const markdown = generator.generateStoredProcedureMarkdown({
      id: 'DW01.Sonic_DW.etl.ReadVendorClaims',
      name: 'ReadVendorClaims',
      serverName: 'DW01',
      schema: 'etl',
      definition: `
        CREATE PROCEDURE etl.ReadVendorClaims AS
        SELECT v.ClaimID, v.ClaimAmount
        FROM [L1-DWASQL-02,12010].VendorData.JMA.Claims AS v;
      `,
      dependencies: [],
      parameters: [],
    });

    const parsed = parseMarkdownContent(markdown, 'linked-server-column-usage.md');

    expect(parsed.column_usage).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          column_id: 'L1-DWASQL-02,12010.VendorData.JMA.Claims.ClaimID',
          usage_type: 'read',
        }),
        expect.objectContaining({
          column_id: 'L1-DWASQL-02,12010.VendorData.JMA.Claims.ClaimAmount',
          usage_type: 'read',
        }),
      ])
    );
    expect(parsed.unresolved_column_usage).toEqual([]);
  });

  it('captures unresolved column usage when an alias cannot be resolved', () => {
    const generator = new MarkdownGenerator({
      serverName: 'DW01',
      database: 'Sonic_DW',
      extractedAt: '2026-06-02T00:00:00.000Z',
      tables: [
        {
          id: 'DW01.Sonic_DW.dbo.FactClaim',
          serverName: 'DW01',
          schema: 'dbo',
          name: 'FactClaim',
          columns: [{ name: 'ClaimID' }],
        },
      ],
    });

    const markdown = generator.generateStoredProcedureMarkdown({
      id: 'DW01.Sonic_DW.etl.BadAlias',
      name: 'BadAlias',
      serverName: 'DW01',
      schema: 'etl',
      definition: `
        CREATE PROCEDURE etl.BadAlias AS
        SELECT missing.ClaimID
        FROM dbo.FactClaim AS f;
      `,
      dependencies: [],
      parameters: [],
    });

    const parsed = parseMarkdownContent(markdown, 'unresolved-column-usage.md');

    expect(parsed.unresolved_column_usage).toEqual([
      expect.objectContaining({
        alias: 'missing',
        column_name: 'ClaimID',
        reason: 'alias_not_resolved_to_known_table_or_view',
        validation_status: 'unresolved',
      }),
    ]);
    expect(parsed.column_risk_flags).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          flag_type: 'unresolved_parser_context',
          validation_status: 'risk_flag',
        }),
      ])
    );
  });

  it('emits column risk flags for unsafe SQL patterns', () => {
    const generator = new MarkdownGenerator({
      serverName: 'DW01',
      database: 'Sonic_DW',
      extractedAt: '2026-06-02T00:00:00.000Z',
      tables: [
        {
          id: 'DW01.Sonic_DW.dbo.FactClaim',
          serverName: 'DW01',
          schema: 'dbo',
          name: 'FactClaim',
          columns: [
            { name: 'ClaimID' },
            { name: 'ClaimAmount' },
          ],
        },
        {
          id: 'DW01.Sonic_DW.staging.Claims',
          serverName: 'DW01',
          schema: 'staging',
          name: 'Claims',
          columns: [
            { name: 'ClaimID' },
            { name: 'Amount' },
          ],
        },
      ],
    });

    const markdown = generator.generateStoredProcedureMarkdown({
      id: 'DW01.Sonic_DW.etl.RiskyLoad',
      name: 'RiskyLoad',
      serverName: 'DW01',
      schema: 'etl',
      definition: `
        CREATE PROCEDURE etl.RiskyLoad AS
        SELECT c.*
        FROM staging.Claims AS c;

        INSERT INTO dbo.FactClaim
        SELECT c.ClaimID, c.Amount
        FROM staging.Claims AS c;

        MERGE INTO dbo.FactClaim AS target
        USING staging.Claims AS src
        ON target.ClaimID = src.ClaimID
        WHEN NOT MATCHED THEN
          INSERT VALUES (src.ClaimID, src.Amount);

        DECLARE @sql nvarchar(max);
        SET @sql = N'SELECT ' + @columnList + N' FROM ' + QUOTENAME(@tableName);
        EXEC sp_executesql @sql;
      `,
      dependencies: [],
      parameters: [],
    });

    const parsed = parseMarkdownContent(markdown, 'risky-column-patterns.md');

    expect(parsed.column_risk_flags).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ flag_type: 'select_star' }),
        expect.objectContaining({ flag_type: 'insert_without_column_list' }),
        expect.objectContaining({ flag_type: 'merge_without_explicit_column_mapping' }),
        expect.objectContaining({ flag_type: 'dynamic_sql' }),
        expect.objectContaining({ flag_type: 'dynamic_table_name' }),
        expect.objectContaining({ flag_type: 'dynamic_column_name' }),
      ])
    );
    expect(parsed.column_risk_flags.every((flag) => flag.validation_status === 'risk_flag')).toBe(
      true
    );
  });

  it('keeps procedure write targets out of read dependencies and preserves four-part sources', () => {
    const generator = new MarkdownGenerator({
      serverName: 'L1-5FSQL-01',
      database: 'ETL_Staging',
      extractedAt: '2026-06-02T00:00:00.000Z',
    });
    const sourceTable =
      'L1-DWASQL-02,12010.VENDORDATA.JMA.JMA_CLAIMS_FINANCIAL_TRANSACTIONS_TBL';
    const targetTable =
      'L1-5FSQL-01.ETL_STAGING.JMA.ETL_STG_JMA_CLAIMS_FINANCIAL_TRANSACTIONS_TBL';
    const markdown = generator.generateStoredProcedureMarkdown({
      id: 'L1-5FSQL-01.ETL_Staging.JMA.Load_Claim_Financial_Transactions',
      name: 'Load_Claim_Financial_Transactions',
      serverName: 'L1-5FSQL-01',
      schema: 'JMA',
      definition: `
        CREATE PROCEDURE [JMA].[Load_Claim_Financial_Transactions] AS
        INSERT INTO ETL_STAGING.JMA.ETL_STG_JMA_CLAIMS_FINANCIAL_TRANSACTIONS_TBL
        SELECT *
        FROM [L1-DWASQL-02,12010].VENDORDATA.JMA.JMA_CLAIMS_FINANCIAL_TRANSACTIONS_TBL;
      `,
      dependencies: [
        { referencedObject: targetTable },
        { referencedObject: sourceTable },
      ],
      parameters: [],
    });

    const parsed = parseMarkdownContent(markdown, 'generated-procedure.md');

    expect(parsed.reads_from).toContain(sourceTable);
    expect(parsed.depends_on).toContain(sourceTable);
    expect(parsed.depends_on).not.toContain(targetTable);
    expect(parsed.writes_to).toContain(
      'ETL_STAGING.JMA.ETL_STG_JMA_CLAIMS_FINANCIAL_TRANSACTIONS_TBL'
    );
  });

  it('extracts fact MERGE targets and removes local CTE/comment noise', () => {
    const generator = new MarkdownGenerator({
      serverName: 'L1-5FSQL-01',
      database: 'ETL_Staging',
      extractedAt: '2026-06-02T00:00:00.000Z',
    });
    const targetTable = 'L1-5FSQL-01.SONIC_DW.dbo.FACT_JMA_CLAIMS_TBL';
    const markdown = generator.generateStoredProcedureMarkdown({
      id: 'L1-5FSQL-01.ETL_Staging.JMA.LOAD_FACT_JMA_CLAIMS_TBL',
      name: 'LOAD_FACT_JMA_CLAIMS_TBL',
      serverName: 'L1-5FSQL-01',
      schema: 'JMA',
      definition: `
        CREATE PROCEDURE [JMA].[LOAD_FACT_JMA_CLAIMS_TBL] AS
        WITH CTE_Source AS (
          SELECT src.*
          FROM ETL_Staging.JMA.ETL_STG_JMA_CLAIMS_FINANCIAL_TRANSACTIONS_TBL AS src
        )
        -- Merge statement
        -- exec sp_help 'SONIC_DW.dbo.FACT_JMA_CLAIMS_TBL'
        MERGE INTO SONIC_DW.dbo.FACT_JMA_CLAIMS_TBL AS target
        USING CTE_Source AS source
        ON target.JMA_CLAIMS_REF = source.JMA_CLAIMS_REF;
      `,
      dependencies: [
        { referencedObject: 'L1-5FSQL-01.ETL_Staging.JMA.ETL_STG_JMA_CLAIMS_FINANCIAL_TRANSACTIONS_TBL' },
        { referencedObject: targetTable },
      ],
      parameters: [],
    });

    const parsed = parseMarkdownContent(markdown, 'generated-fact-procedure.md');

    expect(parsed.writes_to).toContain('SONIC_DW.dbo.FACT_JMA_CLAIMS_TBL');
    expect(parsed.writes_to).not.toContain('statement');
    expect(parsed.depends_on).not.toContain(targetTable);
    expect(parsed.reads_from).not.toContain('CTE_Source');
    expect(parsed.calls).toEqual([]);
  });
});
