import MarkdownGenerator from '../../src/services/markdownFromSqlServer.js';
import { parseMarkdownContent } from '../../src/services/markdownService.js';

describe('Markdown From SQL Server', () => {
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
