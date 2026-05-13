---
name: spLoadFactCBAMarketTarget
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - FactCBAMarketTarget
dependency_count: 1
parameter_count: 2
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.FactCBAMarketTarget** (U )

## Parameters

| Name               | Type | Output | Default |
| ------------------ | ---- | ------ | ------- |
| `@updatedRowCnts`  | int  | Yes    | No      |
| `@insertedRowCnts` | int  | Yes    | No      |

## Definition

```sql

/******************** CHANGE LOG **********************************************************
06/10/2020:  Derrick Davis - Create stored proc for type 2 insert/update
01/29/2021:  Chaitra - updated stored proc for populating the Fact_DataAudit table
03/15/2021:  Chaitra - corrected the join condition with DimMarket table,
                       removed the AssociateKey check in update logic
*******************************************************************************************/

CREATE PROC [dbo].[spLoadFactCBAMarketTarget]
(
 @updatedRowCnts  INT OUTPUT,   --added on 01/29/2021
 @insertedRowCnts INT OUTPUT    --added on 01/29/2021
)
AS
     BEGIN

	 DECLARE @rundate datetime = GETDATE(); --Meta_LoadDate for the insert and update records --added on 01/29/2021


IF OBJECT_ID ('tempdb..#stage') is not null drop table #stage;

CREATE TABLE #stage
	(
	MarketKey int,
	WeekStartDateKey int,
	WeekEndDateKey int,
	MinTarget int,
	MaxTarget int,
	CreatedByAssociateKey int,
	CreatedOnDateKey int,
	ModifiedByAssociateKey int,
	ModifiedOnDateKey int,
	ETLExecutionID int NULL,
	Meta_LoadDate datetime,
	Meta_RowEffectiveDate datetime,
	Meta_RowExpiredDate datetime,
	Meta_RowIsCurrent char(1),
	Meta_NaturalKey varchar(50),
	Meta_Src_System_ID int,
	User_ID varchar(50),
	Meta_ComputerName varchar(50),
	);
INSERT INTO #stage

SELECT
       MarketKey
      ,WeekStartDateKey
      ,WeekEndDateKey
      ,MinTarget
      ,MaxTarget
      ,CreatedByAssociateKey
      ,CreatedOnDateKey
      ,ModifiedByAssociateKey
      ,ModifiedOnDateKey
      ,ETLExecutionID
      ,Meta_LoadDate
      ,Meta_RowEffectiveDate
      ,Meta_RowExpiredDate
      ,Meta_RowIsCurrent
      ,Meta_NaturalKey
      ,Meta_Src_System_ID
      ,User_ID
      ,Meta_ComputerName
FROM
(
MERGE dbo.FactCBAMarketTarget TGT
USING
(
SELECT 	 ISNULL(m.MarketKey,-1) AS MarketKey
		,ISNULL(sd.DateKey,19000101) AS WeekStartDateKey
		,ISNULL(ed.DateKey,19000101) AS WeekEndDateKey
		,s.MinTarget
		,s.MaxTarget
		,ISNULL(s.CreatedByAssociateKey,-1) AS CreatedByAssociateKey
		,ISNULL(cdk.DateKey,19000101) AS CreatedOnDateKey
		,ISNULL(s.ModifiedByAssociateKey,-1) AS ModifiedByAssociateKey
		,ISNULL(mdk.DateKey,19000101) AS ModifiedOnDateKey
		,s.ETLExecutionID
		,s.ModifiedOn AS Meta_RowEffectiveDate
		,s.Meta_NaturalKey
		,s.Meta_Src_System_ID
		,s.User_ID
		,s.Meta_ComputerName
  FROM [ETL_Staging].[stage].[FactCBAMarketTargetStaging] s
	LEFT JOIN Sonic_DW.dbo.DimMarket m
		ON s.MarketKey = m.Meta_NaturalKey AND Meta_RowIsCurrent = 'Y' --updated on 03/15/2021
	LEFT JOIN Sonic_DW.dbo.Dim_Date sd
		ON s.WeekStartDateKey = sd.DateKey
	LEFT JOIN Sonic_DW.dbo.Dim_Date ed
		ON s.WeekEndDateKey = ed.DateKey
	LEFT JOIN Sonic_DW.dbo.Dim_Date cdk
		ON s.CreatedOnDateKey = cdk.DateKey
	LEFT JOIN Sonic_DW.dbo.Dim_Date mdk
		ON s.ModifiedOnDateKey = mdk.DateKey
) SRC

	ON TGT.Meta_NaturalKey = SRC.Meta_NaturalKey

	WHEN NOT MATCHED THEN
	INSERT
(
       MarketKey
      ,WeekStartDateKey
      ,WeekEndDateKey
      ,MinTarget
      ,MaxTarget
      ,CreatedByAssociateKey
      ,CreatedOnDateKey
      ,ModifiedByAssociateKey
      ,ModifiedOnDateKey
      ,ETLExecutionID
      ,Meta_LoadDate
      ,Meta_RowEffectiveDate
      ,Meta_RowExpiredDate
      ,Meta_RowIsCurrent
      ,Meta_NaturalKey
      ,Meta_Src_System_ID
      ,User_ID
      ,Meta_ComputerName
)
VALUES
(
		 SRC.MarketKey
		,SRC.WeekStartDateKey
		,SRC.WeekEndDateKey
		,SRC.MinTarget
		,SRC.MaxTarget
		,SRC.CreatedByAssociateKey
		,SRC.CreatedOnDateKey
		,SRC.ModifiedByAssociateKey
		,SRC.ModifiedOnDateKey
		,SRC.ETLExecutionID
		,@rundate
		,SRC.Meta_RowEffectiveDate
		,'9999-12-31 23:59:59'
		,'Y'
		,SRC.Meta_NaturalKey
		,SRC.Meta_Src_System_ID
		,SRC.User_ID
		,SRC.Meta_ComputerName
)

WHEN MATCHED AND TGT.Meta_RowIsCurrent = 'Y' AND
	(TGT.WeekStartDateKey <> SRC.WeekStartDateKey
	OR TGT.WeekEndDateKey <> SRC.WeekEndDateKey
	OR TGT.MinTarget <> SRC.MinTarget
	OR TGT.MaxTarget <> SRC.MaxTarget
	--OR TGT.CreatedByAssociateKey <> SRC.CreatedByAssociateKey --Commented On 2021-03-15
	OR TGT.CreatedOnDateKey <> SRC.CreatedOnDateKey
	--OR TGT.ModifiedByAssociateKey <> SRC.ModifiedByAssociateKey --Commented On 2021-03-15
	OR TGT.ModifiedOnDateKey <> SRC.ModifiedOnDateKey	)
THEN UPDATE SET
	TGT.Meta_RowExpiredDate = SRC.Meta_RowEffectiveDate
    ,TGT.Meta_RowIsCurrent = 'N'
OUTPUT $Action Action_Out
		,SRC.MarketKey
		,SRC.WeekStartDateKey
		,SRC.WeekEndDateKey
		,SRC.MinTarget
		,SRC.MaxTarget
		,SRC.CreatedByAssociateKey
		,SRC.CreatedOnDateKey
		,SRC.ModifiedByAssociateKey
		,SRC.ModifiedOnDateKey
		,SRC.ETLExecutionID
		,@rundate AS Meta_LoadDate
		,SRC.Meta_RowEffectiveDate
		,'9999-12-31 23:59:59' AS Meta_RowExpiredDate
		,'Y' AS Meta_RowIsCurrent
		,SRC.Meta_NaturalKey
		,SRC.Meta_Src_System_ID
		,SRC.User_ID
		,SRC.Meta_ComputerName
) AS MERGE_OUT
WHERE MERGE_OUT.Action_Out = 'UPDATE'

INSERT INTO dbo.FactCBAMarketTarget
	(
       MarketKey
      ,WeekStartDateKey
      ,WeekEndDateKey
      ,MinTarget
      ,MaxTarget
      ,CreatedByAssociateKey
      ,CreatedOnDateKey
      ,ModifiedByAssociateKey
      ,ModifiedOnDateKey
      ,ETLExecutionID
      ,Meta_LoadDate
      ,Meta_RowEffectiveDate
      ,Meta_RowExpiredDate
      ,Meta_RowIsCurrent
      ,Meta_NaturalKey
      ,Meta_Src_System_ID
      ,User_ID
      ,Meta_ComputerName
	)
SELECT 	 MarketKey
		,WeekStartDateKey
		,WeekEndDateKey
		,MinTarget
		,MaxTarget
		,CreatedByAssociateKey
		,CreatedOnDateKey
		,ModifiedByAssociateKey
		,ModifiedOnDateKey
		,ETLExecutionID
		,Meta_LoadDate
		,Meta_RowEffectiveDate
		,Meta_RowExpiredDate
		,Meta_RowIsCurrent
		,Meta_NaturalKey
		,Meta_Src_System_ID
		,User_ID
		,Meta_ComputerName
FROM #stage

SELECT @updatedRowCnts = @@ROWCOUNT   --added on 01/29/2021
SELECT @insertedRowCnts = (SELECT COUNT(*)  FROM  dbo.FactCBAMarketTarget  WHERE Meta_LoadDate = @rundate) - @updatedRowCnts  --added on 01/29/2021
END
;
```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
