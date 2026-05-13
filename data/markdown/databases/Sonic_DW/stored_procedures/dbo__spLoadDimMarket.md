---
name: spLoadDimMarket
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - DimMarket
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

- **dbo.DimMarket** (U )

## Parameters

| Name               | Type | Output | Default |
| ------------------ | ---- | ------ | ------- |
| `@updatedRowCnts`  | int  | Yes    | No      |
| `@insertedRowCnts` | int  | Yes    | No      |

## Definition

```sql

/******************** CHANGE LOG **********************************************************
05/13/2020:  Derrick Davis - Create stored proc for type 2 insert/update
01/29/2021:  Chaitra - updated stored proc for populating the Fact_DataAudit table
03/15/2021:  Chaitra - removed the AssociateKey check in the update logic
*******************************************************************************************/

CREATE   PROC [dbo].[spLoadDimMarket]
(
 @updatedRowCnts  INT OUTPUT,   -- added on 01/29/2021
 @insertedRowCnts INT OUTPUT    -- added on 01/29/2021
)
AS
     BEGIN

	 DECLARE @rundate datetime = GETDATE(); -- Meta_LoadDate for the insert and update records -- added on 01/29/2021

IF OBJECT_ID ('tempdb..#stage') is not null drop table #stage;

CREATE TABLE #stage
	(
	MarketName varchar(100),
	IsActive bit,
	IsEchoParkActive bit,
	IsRetailActive bit,
	CreatedByAssociateKey int,
	ModifiedByAssociateKey int,
	ETLExecutionID int NULL,
	Meta_LoadDate datetime,
	Meta_RowEffectiveDate datetime,
	Meta_RowExpiredDate datetime,
	Meta_RowIsCurrent char(1),
	Meta_NaturalKey varchar(50),
	Meta_Src_System_ID int,
	User_ID varchar(50),
	Meta_ComputerName varchar(50)
	);
INSERT INTO #stage

SELECT   MarketName
		,IsActive
		,IsEchoParkActive
		,IsSonicActive
		,CreatedByAssociateKey
		,ModifiedByAssociateKey
		,ETLExecution_ID
		,Meta_LoadDate
		,Meta_RowEffectiveDate
		,Meta_RowExpiredDate
		,Meta_RowIsCurrent
		,Meta_NaturalKey
		,Meta_SrcSysID
		,User_ID
		,Meta_ComputerName
FROM
(
MERGE dbo.DimMarket TGT
USING
(
SELECT 	MarketName
		,IsActive
		,IsEchoParkActive
		,IsSonicActive
		,ISNULL(CreatedByAssociateKey,-1) AS CreatedByAssociateKey
		,ISNULL(ModifiedByAssociateKey,-1) AS ModifiedByAssociateKey
		,ETLExecution_ID
		--,Meta_LoadDate
		,Meta_RowEffectiveDate
		--,Meta_RowExpiredDate
		,Meta_NaturalKey
		--,Meta_RowIsCurrent
		,Meta_SrcSysID
		,User_ID
		,Meta_ComputerName
  FROM [ETL_Staging].[stage].[DimMarketStaging]
) SRC

	ON TGT.Meta_NaturalKey = SRC.Meta_NaturalKey

	WHEN NOT MATCHED THEN
	INSERT
(
		 MarketName
		,IsActive
		,IsEchoParkActive
		,[IsRetailActive]
		,CreatedByAssociateKey
		,ModifiedByAssociateKey
		,ETLExecutionID
		,Meta_LoadDate
		,Meta_RowEffectiveDate
		,Meta_RowExpiredDate
		,Meta_RowIsCurrent
		,Meta_NaturalKey
		,[Meta_Src_System_ID]
		,User_ID
		,Meta_ComputerName
)
VALUES
(
		 SRC.MarketName
		,SRC.IsActive
		,SRC.IsEchoParkActive
		,SRC.IsSonicActive
		,SRC.CreatedByAssociateKey
		,SRC.ModifiedByAssociateKey
		,SRC.ETLExecution_ID
		,@rundate
		,SRC.Meta_RowEffectiveDate
		,'9999-12-31 23:59:59'
		,'Y'
		,SRC.Meta_NaturalKey
		,SRC.Meta_SrcSysID
		,SRC.User_ID
		,SRC.Meta_ComputerName
)

WHEN MATCHED AND TGT.Meta_RowIsCurrent = 'Y' AND
	(  TGT.MarketName <> SRC.MarketName
	OR TGT.IsActive <> SRC.IsActive
	OR TGT.IsEchoParkActive <> SRC.IsEchoParkActive
	OR TGT.[IsRetailActive] <> SRC.IsSonicActive
	--OR TGT.CreatedByAssociateKey <> SRC.CreatedByAssociateKey --commented on 03/15/2021
	--OR TGT.ModifiedByAssociateKey <> SRC.ModifiedByAssociateKey --commented on 03/15/2021
	)
THEN UPDATE SET
	TGT.Meta_RowExpiredDate = SRC.Meta_RowEffectiveDate
	,TGT.Meta_RowIsCurrent = 'N'
OUTPUT $Action Action_Out, SRC.MarketName
		,SRC.IsActive
		,SRC.IsEchoParkActive
		,SRC.IsSonicActive
		,SRC.CreatedByAssociateKey
		,SRC.ModifiedByAssociateKey
		,SRC.ETLExecution_ID
		,@rundate AS Meta_LoadDate
		,SRC.Meta_RowEffectiveDate
		,'9999-12-31 23:59:59' AS Meta_RowExpiredDate
		,'Y' AS Meta_RowIsCurrent
		,SRC.Meta_NaturalKey
		,SRC.Meta_SrcSysID
		,SRC.User_ID
		,SRC.Meta_ComputerName
) AS MERGE_OUT
WHERE MERGE_OUT.Action_Out = 'UPDATE'

INSERT INTO dbo.DimMarket
	(
		[MarketName],
		[IsActive],
		[IsEchoParkActive],
		[IsRetailActive],
		[CreatedByAssociateKey],
		[ModifiedByAssociateKey],
		[ETLExecutionID],
		[Meta_LoadDate],
		[Meta_RowEffectiveDate],
		[Meta_RowExpiredDate],
		[Meta_RowIsCurrent],
		[Meta_NaturalKey],
		[Meta_Src_System_ID],
		[User_ID],
		[Meta_ComputerName]
	)
SELECT 	 MarketName
		,IsActive
		,IsEchoParkActive
		,IsRetailActive
		,CreatedByAssociateKey
		,ModifiedByAssociateKey
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
SELECT @updatedRowCnts = @@ROWCOUNT ---- added on 01/29/2021
SELECT @insertedRowCnts = (SELECT COUNT(*)  FROM  dbo.DimMarket  WHERE Meta_LoadDate = @rundate) - @updatedRowCnts  -- added on 01/29/2021
END
;
```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
