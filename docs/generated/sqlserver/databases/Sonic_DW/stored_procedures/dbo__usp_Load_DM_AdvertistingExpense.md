---
name: usp_Load_DM_AdvertistingExpense
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
dependency_count: 0
parameter_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Definition

```sql

-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[usp_Load_DM_AdvertistingExpense]
AS
BEGIN


IF OBJECT_ID('tempdb..#TempAdvertisingExpense') IS NOT NULL
	drop table [#TempAdvertisingExpense];

CREATE TABLE #TempAdvertisingExpense (
    EntityKey INT,
    NewUsedID NCHAR(2),
    CalendarYearMonth VARCHAR(7),
    metric_name VARCHAR(50),
    value MONEY
);

DECLARE @DocMonth INT = (SELECT LEFT(Max(DocRolloverDate),6) FROM [dbo].[Dim_Date] WHERE FullDate = CONVERT(date, GETDATE()))
DECLARE @MaxAdvMonth INT = (SELECT Max(FiscalMonthKey) FROM [dbo].[Fact_FranchiseBudgetBreakout])


/*
Get TURBO Data, such as Leads, Appointment, and Sold Units
*/
INSERT INTO #TempAdvertisingExpense (EntityKey, NewUsedID, CalendarYearMonth, metric_name, value)
SELECT
    [EntityKey],
    [NewUsedID],
    [CalendarYearMonth],
    column_name AS metric_name,  -- Change column_name to metric_name
    CAST(value AS MONEY) AS value  -- Convert value to MONEY,
FROM
    (SELECT
        coalesce([pa11].[EntityKey], [pa12].[EntityKey]) AS [EntityKey],
        coalesce([pa11].[NewUsedID], [pa12].[NewUsedID], 'Uk') AS [NewUsedID],
        coalesce([pa11].[CalendarYearMonth], [pa12].[FiscalMonthKey]) AS [CalendarYearMonth],
        CAST([pa11].[Leads] AS MONEY) AS [Leads],  -- Convert Leads to MONEY
        CAST([pa12].[AdvGrossAdSpend] AS MONEY) AS [GrossAdSpend],  -- Convert AdvGrossAdSpend to MONEY
        CAST((ISNULL([pa12].[AdvGrossAdSpend], 0) + ISNULL([pa12].[AdvCredits], 0)) AS MONEY) AS [NetAdSpend],  -- Convert NetAdSpend to MONEY
		CAST([pa12].[AdvGrossAdSpend] AS MONEY) AS [GrossCPL],  -- Convert AdvGrossAdSpend to MONEY
        CAST((ISNULL([pa12].[AdvGrossAdSpend], 0) + ISNULL([pa12].[AdvCredits], 0)) AS MONEY) AS [NetCPL],  -- Convert NetAdSpend to MONEY
		CAST([pa12].[AdvGrossAdSpend] AS MONEY) AS [GrossCPC],  -- Convert AdvGrossAdSpend to MONEY
        CAST((ISNULL([pa12].[AdvGrossAdSpend], 0) + ISNULL([pa12].[AdvCredits], 0)) AS MONEY) AS [NetCPC],  -- Convert NetAdSpend to MONEY
		CAST([pa11].[ApptDue] AS MONEY) AS [ApptDue],  -- Convert ApptsDue to MONEY
		CAST([pa11].[ApptShown] AS MONEY) AS [ApptShown],  -- Convert ApptShown to MONEY
		CAST([pa11].[ApptSold] AS MONEY) AS [ApptSold],  -- Convert ApptSold to MONEY
        CAST([pa11].[SoldUnits] AS MONEY) AS [SoldUnits]  -- Convert SoldUnits to MONEY
    FROM
        (SELECT
            [a11].[szNewUsed] AS [NewUsedID],
            [a12].[FiscalMonthKey] AS [CalendarYearMonth],
            [a13].[RollupEntityKey] AS [EntityKey],
            SUM([a11].[LeadCount]) AS [Leads],
			SUM([a11].[ApptDue]) AS [ApptDue],
			SUM([a11].[ApptShown]) AS [ApptShown],
			SUM([a11].[ApptSold]) AS [ApptSold],
            SUM([a11].[Sold]) AS [SoldUnits]
        FROM
            [vw_FactTrafficSummaryDaily] [a11]
            JOIN [dbo].[vw_Dim_date] [a12] ON ([a11].[DateKey] = [a12].[DateKey])
			LEFT JOIN [dbo].[vw_Dim_Entity_All] [a13] ON ([a11].[EntityKey] = [a13].[EntityKey])
		WHERE szUpType NOT IN ('Campaign')  --Exclude Campaign Leads per Jen and Chris Hearl
        GROUP BY
            [a11].[szNewUsed],
            [a12].[FiscalMonthKey],
            [a13].[RollupEntityKey]
        ) [pa11]
    FULL OUTER JOIN
	/*
		Get Advertising Expense from Accounting Data, both Gross and Net spend
		Net is Gross + Credits + Rebates
	*/
        (SELECT
            [a14].[NewUsedID] AS [NewUsedID],
            [a13].[FiscalMonthKey] AS [FiscalMonthKey],
            [a15].[RollupEntityKey] AS [EntityKey],
            SUM(CASE
                    WHEN [a12].[Level7] IN ('Advertising Expense - Centralized Spend', 'Advertising Expense - Store Level Spend')
                    THEN [a11].[PostingAmount]
                    ELSE NULL
                END) AS [AdvGrossAdSpend],
            SUM(CASE
                    WHEN [a12].[Level7] IN ('Advertising Expense - Credits/Rebates')
                    THEN [a11].[PostingAmount]
                    ELSE NULL
                END) AS [AdvCredits]
        FROM
            [dbo].[vw_Fact_AccountingDetail] [a11]
            JOIN [Dim_AccountMgmt] [a12] ON ([a11].[AccountMgmtKey] = [a12].[AccountMgmtKey])
            JOIN [dbo].[vw_Dim_date] [a13] ON ([a11].[AccountingDateKey] = [a13].[DateKey])
            JOIN [vw_Dim_Account] [a14] ON ([a11].[AccountKey] = [a14].[AccountKey])
			LEFT JOIN [dbo].[vw_Dim_Entity_All] [a15] ON ([a11].[EntityKey] = [a15].[EntityKey])
        WHERE
            ([a12].[Level7] IN ('Advertising Expense - Centralized Spend', 'Advertising Expense - Store Level Spend','Advertising Expense - Credits/Rebates')
			and [a13].[FullDate] < '01-01-2024'
			--and [a13].[FullDate] NOT BETWEEN '01-01-2024' AND '03-31-2024')  --EOMONTH(CAST(CONVERT(VARCHAR, DocRolloverDate))) AS DATE
			)
        GROUP BY
            [a14].[NewUsedID],
            [a13].[FiscalMonthKey],
            [a15].[RollupEntityKey]
	UNION ALL
		SELECT
			[NewUsedID],
			[FiscalMonthKey],
			EntityKey,
			CASE WHEN [NewUsedID] = 'N' THEN NewGrossActual WHEN [NewUsedID] = 'U' THEN UsedGrossActual WHEN [NewUsedID] = 'S' THEN ServiceGrossActual END AS AdvGrossAdSpend,
			--CASE WHEN [NewUsedID] = 'N' THEN NewGrossPercent WHEN [NewUsedID] = 'U' THEN UsedGrossPercent WHEN [NewUsedID] = 'S' THEN ServiceGrossPercent END AS GrossPercent,
			CASE WHEN [NewUsedID] = 'N' THEN TotalAdCredits ELSE 0 END AS AdvCredits
			FROM
				[Sonic_DW].[dbo].[vw_FactFranchiseBudgetBreakout]
		CROSS JOIN [dbo].[DimTrafficManagementNewUsed] tmnu
		WHERE [NewUsedID] <> 'Uk') [pa12]
    ON ([pa11].[CalendarYearMonth] = [pa12].[FiscalMonthKey]
        AND [pa11].[EntityKey] = [pa12].[EntityKey]
        AND [pa11].[NewUsedID] = [pa12].[NewUsedID])
    ) AS SourceTable
UNPIVOT
    (value FOR column_name IN ([Leads], [GrossAdSpend], [NetAdSpend], [GrossCPL], [NetCPL], [ApptDue], [ApptShown], [ApptSold], [SoldUnits], [GrossCPC], [NetCPC])) AS Unpivoted;

/*
Get the DOC Projections for Gross Ad Spend and Credits (to calculate Net)
*/

IF @DocMonth <> @MaxAdvMonth
BEGIN

WITH doc_proj AS (
	SELECT DISTINCT
		[a15].[DealershipLvl1EntityKey] AS [EntityKey],
		[pa12].[FiscalMonthKey],
		CONVERT(INT, [pa12].[GrossAdSpend]) AS [GrossAdSpend],
		CONVERT(INT, [pa12].[Credits] + [pa12].[GrossAdSpend]) AS [NetAdSpend],
		CONVERT(INT, [pa12].[Credits]) AS [Credits]
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
		JOIN (
			SELECT
				p.[EntityKey],
				MAX([DateKey]) AS MaxDateKey
			FROM [Sonic_DW].[dbo].[vw_Doc_Projection] p
			INNER JOIN [vw_Dim_Entity_All] e
				ON p.EntityKey = e.EntityKey
			WHERE
				e.[EntDOCReportFlag] = 'Active'
				AND e.EntDefaultDlrshpLvl1 = 1
			GROUP BY p.EntityKey
		) AS [MaxDates]
			ON [a11].[DateKey] = [MaxDates].[MaxDateKey] AND [a11].[EntityKey] = [MaxDates].[EntityKey]
		WHERE
			[a11].[MetricTypeKey] = 4
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

/*
Get the average percentage of New/Used/Fixed vs Total Ad Spend,
so we can multiply by DOC projection to get an allocation amount in next step.
*/
ad_actuals AS (
    SELECT
        [EntityKey],
        AdvGrossAdSpendNew / NULLIF(AdvGrossAdSpend,0) AS AdvGrossAdSpendNewPercent,
        AdvGrossAdSpendUsed / NULLIF(AdvGrossAdSpend,0) AS AdvGrossAdSpendUsedPercent,
		AdvGrossAdSpendFixed / NULLIF(AdvGrossAdSpend,0) AS AdvGrossAdSpendFixedPercent,
        AdvNetAdSpendNew / NULLIF(AdvNetAdSpend,0) AS AdvNetAdSpendNewPercent,
        AdvNetAdSpendUsed / NULLIF(AdvNetAdSpend,0) AS AdvNetAdSpendUsedPercent,
		AdvNetAdSpendFixed / NULLIF(AdvNetAdSpend,0) AS AdvNetAdSpendFixedPercent
    FROM (
        SELECT DISTINCT
            [pa14].[EntDealerLvl1] AS [EntDealerLvl1],
            [a15].[DealershipLvl1EntityKey] AS [EntityKey],
            [pa14].[AdvGrossAdSpendNew] AS [AdvGrossAdSpendNew],
            [pa14].[AdvGrossAdSpendUsed] AS [AdvGrossAdSpendUsed],
			[pa14].[AdvGrossAdSpendFixed] AS [AdvGrossAdSpendFixed],
            [pa14].[AdvCreditsNew] + [pa14].[AdvGrossAdSpendNew] AS [AdvNetAdSpendNew],
            [pa14].[AdvCreditsUsed] + [pa14].[AdvGrossAdSpendUsed] AS [AdvNetAdSpendUsed],
			[pa14].[AdvCreditsFixed] + [pa14].[AdvGrossAdSpendFixed] AS [AdvNetAdSpendFixed],
            [pa14].[AdvGrossAdSpendNew] + [pa14].[AdvGrossAdSpendUsed] + [pa14].[AdvGrossAdSpendFixed] AS [AdvGrossAdSpend],
            [pa14].[AdvGrossAdSpendNew] + [pa14].[AdvGrossAdSpendUsed] + [pa14].[AdvCreditsNew] + [pa14].[AdvCreditsUsed] + [pa14].[AdvGrossAdSpendFixed] + [AdvCreditsFixed] AS [AdvNetAdSpend]
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
                        WHEN ([a13].[NewUsedID] IN (N'S',N'P') AND [a12].[Level7] IN ('Advertising Expense - Centralized Spend', 'Advertising Expense - Store Level Spend'))
                        THEN [a11].[PostingAmount] ELSE 0
                    END) AS [AdvGrossAdSpendFixed],
                SUM(CASE
                        WHEN ([a12].[Level7] IN ('Advertising Expense - Credits/Rebates') AND [a13].[NewUsedID] IN (N'N'))
                        THEN [a11].[PostingAmount] ELSE 0
                    END) AS [AdvCreditsNew],
                SUM(CASE
                        WHEN ([a12].[Level7] IN ('Advertising Expense - Credits/Rebates') AND [a13].[NewUsedID] IN (N'U'))
                        THEN [a11].[PostingAmount] ELSE 0
                    END) AS [AdvCreditsUsed],
                SUM(CASE
                        WHEN ([a12].[Level7] IN ('Advertising Expense - Credits/Rebates') AND [a13].[NewUsedID] IN (N'S',N'P'))
                        THEN [a11].[PostingAmount] ELSE 0
                    END) AS [AdvCreditsFixed]
            FROM [dbo].[vw_Fact_AccountingDetail] AS [a11]
            JOIN [Dim_AccountMgmt] AS [a12] ON ([a11].[AccountMgmtKey] = [a12].[AccountMgmtKey])
            JOIN [vw_Dim_Account] AS [a13] ON [a11].[AccountKey] = [a13].[AccountKey]
			JOIN [vw_Dim_Date] AS [a14] ON [a11].AccountingDateKey = [a14].DateKey
            WHERE
                ([a11].[AccountingFullDate] BETWEEN DATEADD(MONTH, DATEDIFF(MONTH, 0, EOMONTH(CAST(CONVERT(VARCHAR, DocRolloverDate) AS DATE))) - 4, 0)
                AND DATEADD(MONTH, DATEDIFF(MONTH, 0, EOMONTH(CAST(CONVERT(VARCHAR, DocRolloverDate) AS DATE))) - 1, -1))
                AND [a13].[NewUsedID] IN ('N', 'U', 'S', 'P')
                AND [a12].[Level7] IN ('Advertising Expense - Centralized Spend', 'Advertising Expense - Store Level Spend', 'Advertising Expense - Credits/Rebates')
            GROUP BY [a11].[EntDealerLvl1]
        ) AS [pa14]
        JOIN [vw_Dim_Dealership] AS [a15] ON ([pa14].[EntDealerLvl1] = [a15].[EntDealerLvl1])
    ) AS source_percent
)
/*
Multiply Percentage by DOC amounts to get allocated amount
*/
	INSERT INTO #TempAdvertisingExpense (EntityKey, NewUsedID, CalendarYearMonth, metric_name, value)
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
				WHEN tmnu.NewUsedID = 'N' THEN NewGrossPercent
				WHEN tmnu.NewUsedID = 'U' THEN UsedGrossPercent
				ELSE ServiceGrossPercent
			 END) * [GrossAdSpend] AS [GrossAdSpendForecast],
			(CASE
				--WHEN tmnu.NewUsedID = 'N' THEN NetAdSpend - (UsedGrossPercent * [GrossAdSpend]) - (ServiceGrossPercent * [GrossAdSpend])
				WHEN tmnu.NewUsedID = 'N' THEN (NewGrossPercent * [GrossAdSpend]) + (Credits)
				WHEN tmnu.NewUsedID = 'U' THEN UsedGrossPercent * [GrossAdSpend]
				ELSE ServiceGrossPercent * [GrossAdSpend]
			 END) AS [NetAdSpendForecast]
			 ,CAST(0 AS MONEY) AS [GrossCPL]  --Adds a dummy value
			 ,CAST(0 AS MONEY) AS [GrossCPC]  --Adds a dummy value
		FROM [vw_Dim_Dealership_All] da
		CROSS JOIN [dbo].[DimTrafficManagementNewUsed] tmnu
		CROSS JOIN Dim_Date d
		LEFT OUTER JOIN doc_proj dp
			ON da.DealershipLvl1EntityKey = dp.EntityKey
			AND LEFT(d.DocRolloverdate, 6) = dp.[FiscalMonthKey]
		LEFT OUTER JOIN [Sonic_DW].[dbo].[vw_FactFranchiseBudgetBreakout] ad
			ON da.DealershipLvl1EntityKey = ad.EntityKey
			AND ad.FiscalMonthKey = (SELECT max(FiscalMonthKey) FROM [Sonic_DW].[dbo].[vw_FactFranchiseBudgetBreakout])
		WHERE tmnu.NewUsedID IN ('N','U','S')
			AND d.FullDate = CONVERT(VARCHAR, GETDATE(), 23)
			AND GrossAdSpend IS NOT NULL
	) AS SourceTable
	UNPIVOT
		(value FOR column_name IN ([GrossAdSpendForecast], [NetAdSpendForecast], [GrossCPL], [GrossCPC])) AS Unpivoted;
END
--SELECT * FROM #TempAdvertisingExpense
--WHERE CalendarYearMonth = 202401
--and EntityKey = 59

TRUNCATE table DM_AdvertisingExpense

/*
Merge data into the DM_AdvertistingExpense table
*/
MERGE INTO DM_AdvertisingExpense AS target
USING #TempAdvertisingExpense AS source
ON target.EntityKey = source.EntityKey
   AND target.NewUsedID = source.NewUsedID
   AND target.CalendarYearMonth = source.CalendarYearMonth
   AND target.metric_name = source.metric_name
--WHEN MATCHED THEN
--    UPDATE SET
--        target.value = source.value,
--		target.meta_rowlastupdated = getdate()
WHEN NOT MATCHED BY TARGET THEN
    INSERT (EntityKey, NewUsedID, CalendarYearMonth, metric_name, value, meta_rowlastupdated)
    VALUES (source.EntityKey, source.NewUsedID, source.CalendarYearMonth, source.metric_name, source.value, getdate());

DROP TABLE #TempAdvertisingExpense;

/*
Add Leads into the value2 column so that we can do the CPL calculation.
*/
UPDATE t
SET t.[value2] = s.value
FROM [dbo].[DM_AdvertisingExpense] t
JOIN (SELECT value, [EntityKey]
      ,[NewUsedID]
      ,[CalendarYearMonth]
  FROM [Sonic_DW].[dbo].[DM_AdvertisingExpense]
  WHERE metric_name = 'Leads') AS S ON t.EntityKey = s.EntityKey AND t.NewUsedID = s.NewUsedID ANd t.CalendarYearMonth = s.CalendarYearMonth

 WHERE metric_name IN ('GrossCPL', 'NetCPL')

UPDATE t
SET t.[value2] = s.value
FROM [dbo].[DM_AdvertisingExpense] t
JOIN (SELECT value, [EntityKey]
      ,[NewUsedID]
      ,[CalendarYearMonth]
  FROM [Sonic_DW].[dbo].[DM_AdvertisingExpense]
  WHERE metric_name = 'SoldUnits') AS S ON t.EntityKey = s.EntityKey AND t.NewUsedID = s.NewUsedID ANd t.CalendarYearMonth = s.CalendarYearMonth

 WHERE metric_name IN ('GrossCPC', 'NetCPC')

UPDATE t
SET t.[value] = s.value
FROM [dbo].[DM_AdvertisingExpense] t
JOIN (SELECT value, [EntityKey]
      ,[NewUsedID]
      ,[CalendarYearMonth]
  FROM [Sonic_DW].[dbo].[DM_AdvertisingExpense]
  WHERE metric_name IN ('GrossAdSpendForecast')) AS S ON t.EntityKey = s.EntityKey AND t.NewUsedID = s.NewUsedID ANd t.CalendarYearMonth = s.CalendarYearMonth

 WHERE metric_name IN ('GrossCPL', 'GrossCPC')

UPDATE t
SET t.[value] = s.value
FROM [dbo].[DM_AdvertisingExpense] t
JOIN (SELECT value, [EntityKey]
      ,[NewUsedID]
      ,[CalendarYearMonth]
  FROM [Sonic_DW].[dbo].[DM_AdvertisingExpense]
  WHERE metric_name IN ('NetAdSpendForecast')) AS S ON t.EntityKey = s.EntityKey AND t.NewUsedID = s.NewUsedID ANd t.CalendarYearMonth = s.CalendarYearMonth

 WHERE metric_name IN ('NetCPL', 'NetCPC')

END

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
