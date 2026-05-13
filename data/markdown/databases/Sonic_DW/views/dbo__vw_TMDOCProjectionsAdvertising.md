---
name: vw_TMDOCProjectionsAdvertising
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - Dim_AccountMgmt
  - Dim_Date
  - DimTrafficManagementNewUsed
  - vw_Dim_Account
  - vw_Dim_date
  - vw_Dim_Dealership
  - vw_Dim_Dealership_All
  - vw_Dim_Entity
  - vw_Dim_Month
  - vw_Doc_Union
  - vw_Fact_AccountingDetail
dependency_count: 11
column_count: 5
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_AccountMgmt** (U )
- **dbo.Dim_Date** (U )
- **dbo.DimTrafficManagementNewUsed** (U )
- **dbo.vw_Dim_Account** (V )
- **dbo.vw_Dim_date** (V )
- **dbo.vw_Dim_Dealership** (V )
- **dbo.vw_Dim_Dealership_All** (V )
- **dbo.vw_Dim_Entity** (V )
- **dbo.vw_Dim_Month** (V )
- **dbo.vw_Doc_Union** (V )
- **dbo.vw_Fact_AccountingDetail** (V )

## Columns

| Name                | Type     | Nullable | Description |
| ------------------- | -------- | -------- | ----------- |
| `EntityKey`         | int      | ✓        |             |
| `NewUsedID`         | nchar    |          |             |
| `CalendarYearMonth` | varchar  | ✓        |             |
| `metric_name`       | nvarchar | ✓        |             |
| `value`             | money    | ✓        |             |

## Definition

```sql

CREATE VIEW [dbo].[vw_TMDOCProjectionsAdvertising]
AS
WITH doc_proj AS (
    SELECT DISTINCT
        [a15].[DealershipLvl1EntityKey] AS [EntityKey],
        [pa12].[FiscalMonthKey],
        CONVERT(INT, [pa12].[GrossAdSpend]) AS [GrossAdSpend],
        CONVERT(INT, [pa12].[Credits] + [pa12].[GrossAdSpend]) AS [NetAdSpend]
    FROM (
        SELECT
            [a12].[EntDealerLvl1] AS [EntDealerLvl1],
            [a11].[DOCMonthKey] AS [FiscalMonthKey],
            SUM(CASE
                    WHEN [a11].[GroupElementSort] = 190 THEN [a11].[Amount]
                    ELSE 0
                END) AS [GrossAdSpend],
            SUM(CASE
                    WHEN [a11].[GroupElementSort] = 191 THEN [a11].[Amount]
                    ELSE 0
                END) AS [Credits]
        FROM [vw_Doc_Union] AS [a11]
        JOIN [dbo].[vw_Dim_Entity] AS [a12]
            ON [a11].[EntityKey] = [a12].[EntityKey]
        JOIN [dbo].[vw_Dim_date] AS [a13]
            ON [a11].[DateKey] = [a13].[DateKey]
        WHERE
            [a11].[MetricTypeKey] = 4
            AND [a13].[FullDate] = CONVERT(VARCHAR, GETDATE(), 23)
            AND [a11].[GroupElementSort] IN (190, 191)
        GROUP BY
            [a12].[EntDealerLvl1],
            [a11].[DOCMonthKey]
    ) AS [pa12]
    JOIN [dbo].[vw_Dim_Month] AS [a13]
        ON [pa12].[FiscalMonthKey] = [a13].[FiscalMonthKey]
    JOIN [vw_Dim_Dealership] AS [a15]
        ON [pa12].[EntDealerLvl1] = [a15].[EntDealerLvl1]
),

ad_actuals AS (
    SELECT
        [EntityKey],
        AdvGrossAdSpendNew / AdvGrossAdSpend AS AdvGrossAdSpendNewPercent,
        AdvGrossAdSpendUsed / AdvGrossAdSpend AS AdvGrossAdSpendUsedPercent,
        AdvNetAdSpendNew / AdvNetAdSpend AS AdvNetAdSpendNewPercent,
        AdvNetAdSpendUsed / AdvNetAdSpend AS AdvNetAdSpendUsedPercent
    FROM (
        SELECT DISTINCT
            [pa14].[EntDealerLvl1] AS [EntDealerLvl1],
            [a15].[DealershipLvl1EntityKey] AS [EntityKey],
            [pa14].[AdvGrossAdSpendNew] AS [AdvGrossAdSpendNew],
            [pa14].[AdvGrossAdSpendUsed] AS [AdvGrossAdSpendUsed],
            [pa14].[AdvCreditsNew] + [pa14].[AdvGrossAdSpendNew] AS [AdvNetAdSpendNew],
            [pa14].[AdvCreditsUsed] + [pa14].[AdvGrossAdSpendUsed] AS [AdvNetAdSpendUsed],
            [pa14].[AdvGrossAdSpendNew] + [pa14].[AdvGrossAdSpendUsed] AS [AdvGrossAdSpend],
            [pa14].[AdvGrossAdSpendNew] + [pa14].[AdvGrossAdSpendUsed] + [pa14].[AdvCreditsNew] + [pa14].[AdvCreditsUsed] AS [AdvNetAdSpend]
        FROM (
            SELECT
                [a11].[EntDealerLvl1] AS [EntDealerLvl1],
                SUM(CASE
                        WHEN ([a13].[NewUsedID] IN (N'N') AND [a12].[Level7] IN ('Advertising Expense - Centralized Spend', 'Advertising Expense - Store Level Spend'))
                        THEN [a11].[PostingAmount] ELSE 0
                    END) AS [AdvGrossAdSpendNew],
                SUM(CASE
                        WHEN ([a13].[NewUsedID] IN (N'U') AND [a12].[Level7] IN ('Advertising Expense - Centralized Spend', 'Advertising Expense - Store Level Spend'))
                        THEN [a11].[PostingAmount] ELSE 0
                    END) AS [AdvGrossAdSpendUsed],
                SUM(CASE
                        WHEN ([a12].[Level7] IN ('Advertising Expense - Credits/Rebates') AND [a13].[NewUsedID] IN (N'N'))
                        THEN [a11].[PostingAmount] ELSE 0
                    END) AS [AdvCreditsNew],
                SUM(CASE
                        WHEN ([a12].[Level7] IN ('Advertising Expense - Credits/Rebates') AND [a13].[NewUsedID] IN (N'U'))
                        THEN [a11].[PostingAmount] ELSE 0
                    END) AS [AdvCreditsUsed]
            FROM [dbo].[vw_Fact_AccountingDetail] AS [a11]
            JOIN [Dim_AccountMgmt] AS [a12] ON ([a11].[AccountMgmtKey] = [a12].[AccountMgmtKey])
            JOIN [vw_Dim_Account] AS [a13] ON ([a11].[AccountKey] = [a13].[AccountKey])
            WHERE
                ([a11].[AccountingFullDate] BETWEEN DATEADD(MONTH, DATEDIFF(MONTH, 0, GETDATE()) - 4, 0)
                AND DATEADD(MONTH, DATEDIFF(MONTH, 0, GETDATE()) - 1, -1))
                AND [a13].[NewUsedID] IN ('N', 'U')
                AND [a12].[Level7] IN ('Advertising Expense - Centralized Spend', 'Advertising Expense - Store Level Spend', 'Advertising Expense - Credits/Rebates')
            GROUP BY [a11].[EntDealerLvl1]
        ) AS [pa14]
        JOIN [vw_Dim_Dealership] AS [a15] ON ([pa14].[EntDealerLvl1] = [a15].[EntDealerLvl1])
    ) AS source_percent
)

SELECT
    [EntityKey],
    [NewUsedID],
    [CalendarYearMonth],
    column_name AS metric_name,
    CAST(value AS MONEY) AS value
FROM
(
    SELECT
        [DealershipLvl1EntityKey] AS [EntityKey],
        tmnu.NewUsedID,
        LEFT(d.DocRolloverdate, 6) AS [CalendarYearMonth],
        (CASE
            WHEN tmnu.NewUsedID = 'N' THEN AdvGrossAdSpendNewPercent
            ELSE AdvGrossAdSpendUsedPercent
         END) * [GrossAdSpend] AS [AdvGrossAdSpend],
        (CASE
            WHEN tmnu.NewUsedID = 'N' THEN AdvNetAdSpendNewPercent
            ELSE AdvNetAdSpendUsedPercent
         END) * [NetAdSpend] AS [AdvNetAdSpend]
    FROM [vw_Dim_Dealership_All] da
    CROSS JOIN [dbo].[DimTrafficManagementNewUsed] tmnu
    CROSS JOIN Dim_Date d
    LEFT OUTER JOIN doc_proj dp
        ON da.DealershipLvl1EntityKey = dp.EntityKey
        AND LEFT(d.DocRolloverdate, 6) = dp.[FiscalMonthKey]
    LEFT OUTER JOIN ad_actuals ad
        ON da.DealershipLvl1EntityKey = ad.EntityKey
    WHERE tmnu.NewUsedID IN ('N','U')
        AND d.FullDate = CONVERT(VARCHAR, GETDATE(), 23)
        AND GrossAdSpend IS NOT NULL
) AS SourceTable
UNPIVOT
    (value FOR column_name IN ([AdvGrossAdSpend], [AdvNetAdSpend])) AS Unpivoted;

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
