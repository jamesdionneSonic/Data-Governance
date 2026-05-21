---
name: usp_DOC_IndividualBudget
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
CREATE PROCEDURE [dbo].[usp_DOC_IndividualBudget]
@EntityKey INT

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

DELETE FROM [dbo].[Doc_Budget] WHERE EntityKey = @EntityKey

INSERT INTO [dbo].[Doc_Budget]
SELECT	a11.[EntityKey]  EntityKey,
	a11.[DateKey]  DateKey,
	a12.[GroupElementSort]  GroupElementSort,
	a13.[GroupElement]  GroupElement,
	a13.[GroupSubElement]  GroupSubElement,
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

	JOIN	(SELECT AccountMgmtKey, GroupElementSort
			FROM Dim_AccountMgmtGrouping
			WHERE GroupID = 11)	a12
		ON 	(a11.[AccountMgmtKey] = a12.[AccountMgmtKey])
	JOIN dbo.Dim_DOCMetrics a13
			ON a13.GroupElementSort = a12.GroupElementSort
	JOIN dbo.Dim_Entity a14
			ON a11.EntityKey = a14.EntityKey

WHERE	a12.[GroupElementSort] not in (120, 130)
AND a14.EntityKey = @EntityKey


GROUP BY	a11.[EntityKey],
	a11.[DateKey],
	a12.[GroupElementSort],
	a13.[GroupElement],
	a13.[GroupSubElement]

/*
Insert budget records 120 and 130 into DM_FUEL_DailyDOC_Budget
*/

INSERT INTO [dbo].[Doc_Budget]
SELECT	a11.[EntityKey]  EntityKey,
	a11.[DateKey]  DateKey,
	CASE a11.[DepartmentSubType] WHEN 'FixOps' THEN 130 ELSE 120 END  GroupElementSort,
	CASE a11.[DepartmentSubType] WHEN 'FixOps' THEN 'Fixed Ops Sales Comp' ELSE 'N/U Sales Comp' END GroupElement,
	a13.[GroupSubElement]  GroupSubElement,
	sum(a11.[Amount] * -1)  Amount,
	sum(a11.[StatCount])  StatCount,
	max(3)  MetricTypeKey
FROM	(SELECT [Fact_HFM_Key]
      ,[DateKey]
      ,[HFMBrandKey]
      ,[ScenarioKey]
      ,[EntityKey]
      ,aa12.[DepartmentKey]
      ,[AccountMgmtKey]
      ,[BudgetAmountStore] AS [Amount]
      ,[StatCount]
	  ,[DepartmentSubType]
  FROM [dbo].[vw_Fact_HFMBudget] aa11
	JOIN [dbo].[Dim_DepartmentRoll] aa12
		ON aa11.[DepartmentKey] = aa12.[DepartmentKey]
  WHERE [ScenarioKey] = 7)	a11
	JOIN	(SELECT AccountMgmtKey, GroupElementSort
			FROM Dim_AccountMgmtGrouping
			WHERE GroupID = 11)	a12
		ON 	(a11.[AccountMgmtKey] = a12.[AccountMgmtKey])
	JOIN dbo.Dim_DOCMetrics a13
			ON a13.GroupElementSort = a12.GroupElementSort
	JOIN dbo.Dim_Entity a14
			ON a11.EntityKey = a14.EntityKey

WHERE	a12.[GroupElementSort] in (120, 130)
AND a14.EntityKey = @EntityKey

GROUP BY	a11.[EntityKey],
	a11.[DateKey],
	a12.[GroupElementSort],
	a13.[GroupElement],
	a13.[GroupSubElement],
	a11.[DepartmentSubType]

--Calculated values for budget table
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
							CASE WHEN GroupElementSort IN (180) THEN Amount END AS FIComp,
							CASE WHEN GroupElementSort IN (32) THEN Amount END AS NewPackDoc,
							CASE WHEN GroupElementSort IN (52) THEN Amount END AS UsedPackDoc,
							CASE WHEN GroupElementSort IN (130) THEN Amount END AS FOComp,
							CASE WHEN GroupElementSort IN (80, 81, 82, 83, 90, 100) THEN Amount END AS FOGross,
							CASE WHEN GroupSubElement IN ('Dealership Gross', 'Units') THEN Amount END AS DealershipGross,
							CASE WHEN GroupSubElement IN ('Selling Expenses', 'Operating Expenses', 'Overhead') THEN Amount END AS Expenses,
							CASE WHEN GroupSubElement IN ('Other Inc/Ded') THEN Amount END AS Other
                   FROM dbo.Doc_Budget
				   WHERE EntityKey = @EntityKey
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
SELECT EntityKey, DateKey, 500, ((isnull(DealershipGross,0) - isnull(Expenses,0)) - isnull(Other,0)) FROM CalcTable


--Insert calculated values into Doc_Budget
INSERT INTO [dbo].[Doc_Budget]
	SELECT a11.[EntityKey]  EntityKey,
		a11.[DateKey]  DateKey,
		a12.[GroupElementSort]  GroupElementSort,
		a12.[GroupElement]  GroupElement,
		a12.[GroupSubElement]  GroupSubElement,
		MetricNum,
		0,
		3  MetricTypeKey
	FROM @DDTempTable a11
	JOIN dbo.Dim_DOCMetrics a12
			ON a11.MetricID = a12.GroupElementSort

END


```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
