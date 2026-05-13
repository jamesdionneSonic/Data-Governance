---
name: usp_DOC_BudgetPS
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
-- Description:	Insert new records into FUEL Daily Doc Budget
-- =============================================
CREATE PROCEDURE [dbo].[usp_DOC_BudgetPS]

AS



BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

/*
Delete all budget records
Insert budget records into DM_FUEL_DailyDOC_Budget
Do not insert records 120 and 130 which need to be split out by department
*/

TRUNCATE TABLE [dbo].[Doc_BudgetPS]


INSERT INTO [dbo].[Doc_BudgetPS]
SELECT	a11.[EntityKey]  EntityKey,
	a11.[DateKey]  DateKey,
	a12.[GroupElementSort]  GroupElementSort,
	CASE WHEN a13.[GroupSubElement] in ('Dealership Gross', 'Units') THEN sum(a11.[Amount]) ELSE sum(a11.[Amount] * -1) END  Amount,
	--sum(a11.Amount) Amount,
	sum(a11.[StatCount])  StatCount,
	max(3)  MetricTypeKey
FROM	(SELECT [Fact_HFM_Key]
      ,[DateKey]
      ,[HFMBrandKey]
      ,[ScenarioKey]
      ,[EntityKey]
      ,[DepartmentKey]
      ,[AccountMgmtKey]
      ,[BudgetAmountStore] AS [Amount]
      ,[StatCount]
  FROM [dbo].[vw_Fact_HFMBudget])	a11
	JOIN	(SELECT DISTINCT AccountMgmtKey, GroupElementSort
			FROM [vw_Dim_AccountPS]
			WHERE GroupElementSort IS NOT NULL)	a12
		ON 	(a11.[AccountMgmtKey] = a12.[AccountMgmtKey])
	JOIN dbo.Doc_MetricsPS a13
			ON a13.GroupElementSort = a12.GroupElementSort
	JOIN (SELECT * FROM dbo.Dim_Entity WHERE EntLineOfBusiness = 'Powersports') a14
			ON a11.EntityKey = a14.EntityKey
GROUP BY	a11.[EntityKey],
	a11.[DateKey],
	a12.[GroupElementSort],
	a13.GroupSubElement

/*
Insert budget records 120 and 130 into DM_FUEL_DailyDOC_Budget
*/

--INSERT INTO [dbo].[Doc_Budget]
--SELECT	a11.[EntityKey]  EntityKey,
--	a11.[DateKey]  DateKey,
--	CASE a11.[DepartmentSubType] WHEN 'FixOps' THEN 130 ELSE 120 END  GroupElementSort,
--	CASE a11.[DepartmentSubType] WHEN 'FixOps' THEN 'Fixed Ops Sales Comp' ELSE 'N/U Sales Comp' END GroupElement,
--	a13.[GroupSubElement]  GroupSubElement,
--	sum(a11.[Amount] * -1)  Amount,
--	sum(a11.[StatCount])  StatCount,
--	max(3)  MetricTypeKey
--FROM	(SELECT [Fact_HFM_Key]
--      ,[DateKey]
--      ,[HFMBrandKey]
--      ,[ScenarioKey]
--      ,[EntityKey]
--      ,aa12.[DepartmentKey]
--      ,[AccountMgmtKey]
--      ,[BudgetAmountStore] AS [Amount]
--      ,[StatCount]
--	  ,[DepartmentSubType]
--  FROM [dbo].[vw_Fact_HFMBudget] aa11
--	JOIN [dbo].[Dim_DepartmentRoll] aa12
--		ON aa11.[DepartmentKey] = aa12.[DepartmentKey]
--  WHERE [ScenarioKey] = 7)	a11
--	JOIN	(SELECT AccountMgmtKey, GroupElementSort
--			FROM Dim_AccountMgmtGrouping
--			WHERE GroupID = 11)	a12
--		ON 	(a11.[AccountMgmtKey] = a12.[AccountMgmtKey])
--	JOIN dbo.Dim_DOCMetrics a13
--			ON a13.GroupElementSort = a12.GroupElementSort
--	JOIN dbo.Dim_Entity a14
--			ON a11.EntityKey = a14.EntityKey

--WHERE	a12.[GroupElementSort] in (120, 130)

--GROUP BY	a11.[EntityKey],
--	a11.[DateKey],
--	a12.[GroupElementSort],
--	a13.[GroupElement],
--	a13.[GroupSubElement],
--	a11.[DepartmentSubType]

--Calculated values for budget table
DECLARE @DDTempTable table(EntityKey INT, DateKey INT, MetricID INT, MetricNum MONEY)

;with CalcTable as
	(SELECT     EntityKey,
				DateKey,
				SUM(isnull(NewUnits,0)) AS NewUnits,
				SUM(isnull(UsedUnits,0)) AS UsedUnits,
				SUM(isnull(NewGross,0)) AS NewGross,
				SUM(isnull(UsedGross,0)) AS UsedGross,
				--SUM(isnull(FIGrossNew,0)) AS FIGrossNew,
				--SUM(isnull(FIGrossUsed,0)) AS FIGrossUsed,
				--SUM(isnull(PackCreditsNew,0)) AS PackCreditsNew,
				--SUM(isnull(PackCreditsUsed,0)) AS PackCreditsUsed,
				SUM(isnull(NetFI,0)) AS NetFI,
				--SUM(isnull(NewPackDoc,0)) AS NewPackDoc,
				--SUM(isnull(UsedPackDoc,0)) AS UsedPackDoc,
				--SUM(isnull(FOComp,0)) AS FOComp,
				SUM(isnull(FOGross,0)) AS FOGross,
				SUM(isnull(DealershipGross,0)) AS DealershipGross,
				SUM(isnull(TotalOverhead,0)) AS TotalOverhead,
				SUM(isnull(TotalSellingExpenses,0)) AS TotalSellingExpenses,
				SUM(isnull(TotalOperatingExpenses,0)) AS TotalOperatingExpenses,
				SUM(isnull(Expenses,0)) AS Expenses,
				SUM(isnull(Other,0)) AS Other
	FROM         (SELECT    EntityKey,
							DateKey,
							CASE WHEN bps.GroupElementSort IN (10) THEN StatCount END AS NewUnits,
							CASE WHEN bps.GroupElementSort IN (20) THEN StatCount END AS UsedUnits,
							CASE WHEN bps.GroupElementSort IN (10, 12) THEN Amount END AS NewGross,
							CASE WHEN bps.GroupElementSort IN (20, 22) THEN Amount END AS UsedGross,
							--CASE WHEN GroupElementSort IN (110, 112, 113) THEN Amount END AS FIGrossNew,
							--CASE WHEN GroupElementSort IN (114, 115, 116) THEN Amount END AS FIGrossUsed,
							CASE WHEN bps.GroupElementSort IN (70) THEN Amount END AS NetFI,
							--CASE WHEN GroupElementSort IN (170) THEN Amount END As PackCreditsNew,
							--CASE WHEN GroupElementSort IN (171) THEN Amount END As PackCreditsUsed,
							--CASE WHEN GroupElementSort IN (180) THEN Amount END AS FIComp,
							--CASE WHEN GroupElementSort IN (32) THEN Amount END AS NewPackDoc,
							--CASE WHEN GroupElementSort IN (52) THEN Amount END AS UsedPackDoc,
							--CASE WHEN GroupElementSort IN (130) THEN Amount END AS FOComp,
							CASE WHEN bps.GroupElementSort IN (40,50) THEN Amount END AS FOGross,
							--CASE WHEN GroupElementSort IN (60) THEN
							CASE WHEN GroupSubElement IN ('Dealership Gross', 'Units') THEN Amount END AS DealershipGross,
							CASE WHEN GroupSubElement IN ('Overhead') THEN Amount END AS TotalOverhead,
							CASE WHEN GroupSubElement IN ('Selling Expenses') THEN Amount END AS TotalSellingExpenses,
							CASE WHEN GroupSubElement IN ('Operating Expenses') THEN Amount END AS TotalOperatingExpenses,
							CASE WHEN GroupSubElement IN ('Selling Expenses', 'Operating Expenses', 'Overhead') THEN Amount END AS Expenses,
							CASE WHEN GroupSubElement IN ('Other Inc/Ded') THEN Amount END AS Other
                   FROM dbo.Doc_BudgetPS bps
				   JOIN dbo.Doc_MetricsPS mps
					ON bps.groupelementsort = mps.groupelementsort
                   ) a11
	GROUP BY EntityKey, DateKey)

--Unpivot calculated values and assign key values
INSERT INTO @DDTempTable (EntityKey, DateKey, MetricID, MetricNum)
--New PVR
SELECT EntityKey, DateKey, 11, (NewGross / nullif(NewUnits,0)) FROM CalcTable
	UNION ALL
--Used PVR
SELECT EntityKey, DateKey, 21, (UsedGross / nullif(UsedUnits,0)) FROM CalcTable
	UNION ALL
--SELECT EntityKey, DateKey, 111, ((FIGrossNew + FIGrossUsed) / nullif((NewUnits + UsedUnits),0)) FROM CalcTable
--	UNION ALL
--SELECT EntityKey, DateKey, 172, (PackCreditsNew / nullif(NewUnits,0)) FROM CalcTable
--	UNION ALL
--SELECT EntityKey, DateKey, 173, (PackCreditsUsed / nullif(UsedUnits,0)) FROM CalcTable
--	UNION ALL
--FI PVR
SELECT EntityKey, DateKey, 71, (NetFI / nullif((NewUnits + UsedUnits),0)) FROM CalcTable
	UNION ALL
--SELECT EntityKey, DateKey, 33, (NewPackDoc / nullif(NewUnits,0)) FROM CalcTable
--	UNION ALL
--SELECT EntityKey, DateKey, 53, (UsedPackDoc / nullif(UsedUnits,0)) FROM CalcTable
--	UNION ALL
--SELECT EntityKey, DateKey, 131, (FOComp / nullif(FOGross,0)) FROM CalcTable
--	UNION ALL
--SELECT EntityKey, DateKey, 101, (FOGross) FROM CalcTable
--	UNION ALL
SELECT EntityKey, DateKey, 80, (DealershipGross) FROM CalcTable
	UNION ALL
SELECT EntityKey, DateKey, 180, (TotalSellingExpenses) FROM CalcTable
	UNION ALL
SELECT EntityKey, DateKey, 350, (TotalOperatingExpenses) FROM CalcTable
	UNION ALL
SELECT EntityKey, DateKey, 560, (TotalOverhead) FROM CalcTable
	UNION ALL
SELECT EntityKey, DateKey, 570, (Expenses) FROM CalcTable
	UNION ALL
SELECT EntityKey, DateKey, 640, ((isnull(DealershipGross,0) - isnull(Expenses,0)) - isnull(Other,0)) FROM CalcTable


--Insert calculated values into Doc_Budget
INSERT INTO [dbo].[Doc_BudgetPS]
	SELECT a11.[EntityKey]  EntityKey,
		a11.[DateKey]  DateKey,
		a12.[GroupElementSort]  GroupElementSort,
		--a12.[GroupElement]  GroupElement,
		--a12.[GroupSubElement]  GroupSubElement,
		MetricNum,
		0,
		3  MetricTypeKey
	FROM @DDTempTable a11
	JOIN dbo.Doc_MetricsPS a12
			ON a11.MetricID = a12.GroupElementSort

END


```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
