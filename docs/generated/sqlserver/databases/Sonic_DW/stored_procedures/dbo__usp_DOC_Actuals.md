---
name: usp_DOC_Actuals
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
-- Author:		Jonathan Henin
-- Create date: 6/4/2014
-- Description:	Insert new records into FUEL Daily Doc datamart
-- =============================================
CREATE PROCEDURE [dbo].[usp_DOC_Actuals]

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

/*
Drop intermediate DM_FUEL_DailyDOC_short
Delete all actual records
Insert actual records into intermediate table DM_FUEL_DailyDOC_short
Insert actual records into Doc_Short
*/

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Doc_short]') AND type in (N'U'))
	drop table [dbo].[Doc_short]

DELETE FROM [dbo].[Doc_Actual]
DELETE FROM [dbo].[Doc_Actual_Summary]

SELECT * INTO [dbo].[Doc_short]
FROM
 (
 SELECT 	a11.[EntityKey]  EntityKey,
			a11.[AccountingDateKey]  DateKey,
			a14.[GroupElementSort]  GroupElementSort,
			a14.[GroupElement]  GroupElement,
			a14.[GroupSubElement]  GroupSubElement,
			CASE WHEN a14.[GroupSubElement] in ('Dealership Gross', 'Units') THEN sum(a11.[PostingAmount] * -1) ELSE sum(a11.[PostingAmount]) END  Amount,
			sum(a11.[StatCount])  StatCount,
			max(1)  MetricTypeKey
	FROM	dbo.Fact_AccountingDetail	a11
		JOIN dbo.vw_Dim_Account a12
			ON a11.AccountKey = a12.AccountKey
		JOIN dbo.Doc_AccountGrouping a13
			ON a12.AccAccount = a13.AccAccount
		JOIN dbo.Dim_DOCMetrics a14
			ON a13.GroupElementSort = a14.GroupElementSort

	GROUP BY	a11.[EntityKey],
		a11.[AccountingDateKey],
		a14.[GroupElementSort],
		a14.[GroupElement],
		a14.[GroupSubElement]
) A1

INSERT INTO [dbo].[Doc_Actual]
SELECT * FROM [dbo].[Doc_short]

/*
Delete all booked records
Insert booked records into Doc_Booked
*/

--DELETE FROM [dbo].[Doc_Booked]

-- INSERT INTO [dbo].[Doc_Booked]
-- SELECT 	a11.[EntityKey]  EntityKey,
--			a11.[AccountingDateKey]  DateKey,
--			a14.[GroupElementSort]  GroupElementSort,
--			a14.[GroupElement]  GroupElement,
--			a14.[GroupSubElement]  GroupSubElement,
--			CASE WHEN a14.[GroupSubElement] in ('Dealership Gross', 'Units') THEN sum(a11.[PostingAmount] * -1) ELSE sum(a11.[PostingAmount]) END  Amount,
--			sum(a11.[StatCount])  StatCount,
--			max(2)  MetricTypeKey
--	FROM	dbo.vw_FIREBkdDealsAsFUEL	a11
--		JOIN dbo.vw_Dim_Account a12
--			ON a11.AccountKey = a12.AccountKey
--		JOIN dbo.Doc_AccountGrouping a13
--			ON a12.AccAccount = a13.AccAccount
--		JOIN dbo.Dim_DOCMetrics a14
--			ON a13.GroupElementSort = a14.GroupElementSort

--	GROUP BY	a11.[EntityKey],
--		a11.[AccountingDateKey],
--		a14.[GroupElementSort],
--		a14.[GroupElement],
--		a14.[GroupSubElement]

--Calculated values for actual table
DECLARE @DDTempTable table(EntityKey INT, DateKey INT, MetricID INT, MetricNum MONEY)

;with CalcTable as
	(SELECT     EntityKey,
				DateKey,
				SUM(isnull(NewUnits,0)) AS NewUnits,
				SUM(isnull(UsedUnits,0)) AS UsedUnits,
				SUM(isnull(NewGross,0)) AS NewGross,
				SUM(isnull(UsedGross,0)) AS UsedGross,
				SUM(isnull(FIGrossNew,0)) AS FIGrossNew,
				SUM(isnull(FIGrossUsed,0)) AS FIGrossUsed,
				SUM(isnull(PackCreditsNew,0)) AS PackCreditsNew,
				SUM(isnull(PackCreditsUsed,0)) AS PackCreditsUsed,
				SUM(isnull(FIComp,0)) AS FIComp,
				SUM(isnull(NewPackDoc,0)) AS NewPackDoc,
				SUM(isnull(UsedPackDoc,0)) AS UsedPackDoc,
				SUM(isnull(FOComp,0)) AS FOComp,
				SUM(isnull(FOGross,0)) AS FOGross,
				SUM(isnull(DealershipGross,0)) AS DealershipGross,
				SUM(isnull(Expenses,0)) AS Expenses,
				SUM(isnull(Other,0)) AS Other
	FROM         (SELECT    EntityKey,
							DateKey,
							CASE WHEN GroupElementSort IN (10) THEN StatCount END AS NewUnits,
							CASE WHEN GroupElementSort IN (20) THEN StatCount END AS UsedUnits,
							CASE WHEN GroupElementSort IN (10, 30) THEN Amount END AS NewGross,
							CASE WHEN GroupElementSort IN (20, 50) THEN Amount END AS UsedGross,
							CASE WHEN GroupElementSort IN (110, 112, 113) THEN Amount END AS FIGrossNew,
							CASE WHEN GroupElementSort IN (114, 115, 116) THEN Amount END AS FIGrossUsed,
							CASE WHEN GroupElementSort IN (170) THEN Amount END As PackCreditsNew,
							CASE WHEN GroupElementSort IN (171) THEN Amount END As PackCreditsUsed,
							CASE WHEN GroupElementSort IN (180) THEN Amount END As FIComp,
							CASE WHEN GroupElementSort IN (32) THEN Amount END As NewPackDoc,
							CASE WHEN GroupElementSort IN (52) THEN Amount END As UsedPackDoc,
							CASE WHEN GroupElementSort IN (130) THEN Amount END As FOComp,
							CASE WHEN GroupElementSort IN (80, 81, 82, 83, 90, 100, 102) THEN Amount END As FOGross,
							CASE WHEN GroupSubElement IN ('Dealership Gross', 'Units') THEN Amount END AS DealershipGross,
							CASE WHEN GroupSubElement IN ('Selling Expenses', 'Operating Expenses', 'Overhead') THEN Amount END AS Expenses,
							CASE WHEN GroupSubElement IN ('Other Inc/Ded') THEN Amount END AS Other
                   FROM dbo.Doc_Actual
                   ) a11
	GROUP BY EntityKey, DateKey)

--Unpivot calculated values and assign key values
INSERT INTO @DDTempTable (EntityKey, DateKey, MetricID, MetricNum)
SELECT EntityKey, DateKey, 11, (NewGross / nullif(NewUnits,0)) FROM CalcTable
	UNION ALL
SELECT EntityKey, DateKey, 21, (UsedGross / nullif(UsedUnits,0)) FROM CalcTable
	UNION ALL
SELECT EntityKey, DateKey, 111, ((FIGrossNew + FIGrossUsed) / nullif((NewUnits + UsedUnits),0)) FROM CalcTable
	UNION ALL
SELECT EntityKey, DateKey, 172, (PackCreditsNew / nullif(NewUnits,0)) FROM CalcTable
	UNION ALL
SELECT EntityKey, DateKey, 173, (PackCreditsUsed / nullif(UsedUnits,0)) FROM CalcTable
	UNION ALL
SELECT EntityKey, DateKey, 181, (FIComp / nullif((FIGrossNew + FIGrossUsed),0)) FROM CalcTable
	UNION ALL
SELECT EntityKey, DateKey, 33, (NewPackDoc / nullif(NewUnits,0)) FROM CalcTable
	UNION ALL
SELECT EntityKey, DateKey, 53, (UsedPackDoc / nullif(UsedUnits,0)) FROM CalcTable
	UNION ALL
SELECT EntityKey, DateKey, 131, (FOComp / nullif(FOGross,0)) FROM CalcTable
	UNION ALL
SELECT EntityKey, DateKey, 101, (FOGross) FROM CalcTable
	UNION ALL
SELECT EntityKey, DateKey, 119, (DealershipGross) FROM CalcTable
	UNION ALL
SELECT EntityKey, DateKey, 451, (Expenses) FROM CalcTable
	UNION ALL
SELECT EntityKey, DateKey, 500, ((DealershipGross - Expenses) - Other) FROM CalcTable
	UNION ALL
SELECT EntityKey, DateKey, 452, 0 FROM CalcTable


--Insert calculated values into Doc_Actual
INSERT INTO [dbo].[Doc_Actual]
	SELECT a11.[EntityKey]  EntityKey,
		a11.[DateKey]  DateKey,
		a12.[GroupElementSort]  GroupElementSort,
		a12.[GroupElement]  GroupElement,
		a12.[GroupSubElement]  GroupSubElement,
		MetricNum,
		0,
		1  MetricTypeKey
	FROM @DDTempTable a11
	JOIN dbo.Dim_DOCMetrics a12
			ON a11.MetricID = a12.GroupElementSort



--Actual Summary metric table--
DECLARE @DDTempTableSummary table(EntityKey INT, DateKey INT, MetricID INT, MetricNum MONEY)

;with CalcTableS as
		(SELECT     EntityKey,
				MonthStartDateKey AS DateKey,
				SUM(isnull(NewUnits,0)) AS NewUnits,
				SUM(isnull(UsedUnits,0)) AS UsedUnits,
				SUM(isnull(NewGross,0)) AS NewGross,
				SUM(isnull(UsedGross,0)) AS UsedGross,
				SUM(isnull(FIGrossNew,0)) AS FIGrossNew,
				SUM(isnull(FIGrossUsed,0)) AS FIGrossUsed,
				SUM(isnull(PackCreditsNew,0)) AS PackCreditsNew,
				SUM(isnull(PackCreditsUsed,0)) AS PackCreditsUsed,
				SUM(isnull(FIComp,0)) AS FIComp,
				SUM(isnull(NewPackDoc,0)) AS NewPackDoc,
				SUM(isnull(UsedPackDoc,0)) AS UsedPackDoc,
				SUM(isnull(FOComp,0)) AS FOComp,
				SUM(isnull(FOGross,0)) AS FOGross,
				SUM(isnull(DealershipGross,0)) AS DealershipGross,
				SUM(isnull(Expenses,0)) AS Expenses,
				SUM(isnull(Other,0)) AS Other
	FROM         (SELECT    EntityKey,
							MonthStartDateKey,
							CASE WHEN GroupElementSort IN (10) THEN StatCount END AS NewUnits,
							CASE WHEN GroupElementSort IN (20) THEN StatCount END AS UsedUnits,
							CASE WHEN GroupElementSort IN (10, 30, 31, 32) THEN Amount END AS NewGross,
							CASE WHEN GroupElementSort IN (20, 50, 51, 52) THEN Amount END AS UsedGross,
							CASE WHEN GroupElementSort IN (110, 112, 113) THEN Amount END AS FIGrossNew,
							CASE WHEN GroupElementSort IN (114, 115, 116) THEN Amount END AS FIGrossUsed,
							CASE WHEN GroupElementSort IN (170) THEN Amount END As PackCreditsNew,
							CASE WHEN GroupElementSort IN (171) THEN Amount END As PackCreditsUsed,
							CASE WHEN GroupElementSort IN (180) THEN Amount END As FIComp,
							CASE WHEN GroupElementSort IN (32) THEN Amount END As NewPackDoc,
							CASE WHEN GroupElementSort IN (52) THEN Amount END As UsedPackDoc,
							CASE WHEN GroupElementSort IN (130) THEN Amount END As FOComp,
							CASE WHEN GroupElementSort IN (80, 81, 82, 83, 90, 100) THEN Amount END As FOGross,
							CASE WHEN GroupSubElement IN ('Dealership Gross', 'Units') THEN Amount END AS DealershipGross,
							CASE WHEN GroupSubElement IN ('Selling Expenses', 'Operating Expenses', 'Overhead') THEN Amount END AS Expenses,
							CASE WHEN GroupSubElement IN ('Other Inc/Ded') THEN Amount END AS Other
                   FROM dbo.Doc_Actual a
							JOIN dbo.vw_Dim_date b on a.DateKey = b.DateKey
                   ) a11
	GROUP BY EntityKey, MonthStartDateKey)

--Unpivot calculated values and assign key values
INSERT INTO @DDTempTableSummary (EntityKey, DateKey, MetricID, MetricNum)
SELECT EntityKey, DateKey, 10, NewUnits FROM CalcTableS
	UNION ALL
SELECT EntityKey, DateKey, 20, UsedUnits FROM CalcTableS
	UNION ALL
SELECT EntityKey, DateKey, 30, NewGross FROM CalcTableS
	UNION ALL
SELECT EntityKey, DateKey, 50, UsedGross FROM CalcTableS
	UNION ALL
SELECT EntityKey, DateKey, 11, (NewGross / nullif(NewUnits,0)) FROM CalcTableS
	UNION ALL
SELECT EntityKey, DateKey, 21, (UsedGross / nullif(UsedUnits,0)) FROM CalcTableS
	UNION ALL
SELECT EntityKey, DateKey, 110, (FIGrossNew) FROM CalcTableS
	UNION ALL
SELECT EntityKey, DateKey, 114, (FIGrossUsed) FROM CalcTableS
	UNION ALL
SELECT EntityKey, DateKey, 111, ((FIGrossNew + FIGrossUsed) / nullif((NewUnits + UsedUnits),0)) FROM CalcTableS
	UNION ALL
SELECT EntityKey, DateKey, 172, (PackCreditsNew / nullif(NewUnits,0)) FROM CalcTableS
	UNION ALL
SELECT EntityKey, DateKey, 173, (PackCreditsUsed / nullif(UsedUnits,0)) FROM CalcTableS
	UNION ALL
SELECT EntityKey, DateKey, 181, (FIComp / nullif((FIGrossNew + FIGrossUsed),0)) FROM CalcTableS
	UNION ALL
SELECT EntityKey, DateKey, 33, (NewPackDoc / nullif(NewUnits,0)) FROM CalcTableS
	UNION ALL
SELECT EntityKey, DateKey, 53, (UsedPackDoc / nullif(UsedUnits,0)) FROM CalcTableS
	UNION ALL
SELECT EntityKey, DateKey, 131, (FOComp / nullif(FOGross,0)) FROM CalcTableS
	UNION ALL
SELECT EntityKey, DateKey, 101, (FOGross) FROM CalcTableS
	UNION ALL
SELECT EntityKey, DateKey, 119, (DealershipGross) FROM CalcTableS
	UNION ALL
SELECT EntityKey, DateKey, 451, (Expenses + Other) FROM CalcTableS
	UNION ALL
SELECT EntityKey, DateKey, 500, ((DealershipGross - Expenses) - Other) FROM CalcTableS
	UNION ALL
SELECT EntityKey, DateKey, 452, 0 FROM CalcTableS


--Insert calculated values into Doc_Actual_Summary
INSERT INTO [dbo].[Doc_Actual_Summary]
	SELECT a11.[EntityKey]  EntityKey,
		a11.[DateKey]  DateKey,
		a12.[GroupElementSort]  GroupElementSort,
		a12.[GroupElement]  GroupElement,
		a12.[GroupSubElement]  GroupSubElement,
		CASE WHEN MetricID NOT IN (10, 20) THEN MetricNum ELSE 0 END,
		CASE WHEN MetricID IN (10, 20) THEN MetricNum ELSE 0 END,
		1  MetricTypeKey
	FROM @DDTempTableSummary a11
	JOIN dbo.Dim_DOCMetrics a12
			ON a11.MetricID = a12.GroupElementSort



END


```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
