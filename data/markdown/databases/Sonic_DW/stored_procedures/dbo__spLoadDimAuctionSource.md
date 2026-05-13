---
name: spLoadDimAuctionSource
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - DimAuctionSource
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

- **dbo.DimAuctionSource** (U )

## Parameters

| Name               | Type | Output | Default |
| ------------------ | ---- | ------ | ------- |
| `@updatedRowCnts`  | int  | Yes    | No      |
| `@insertedRowCnts` | int  | Yes    | No      |

## Definition

```sql


/******************** CHANGE LOG **********************************************************
05/12/2020:  Derrick Davis - Create stored proc for type 2 insert/update
01/29/2021:  Chaitra - updated stored proc for populating the Fact_DataAudit table
03/15/2021:  Chaitra - removed the AssociateKey check in the update logic
*******************************************************************************************/

CREATE    PROC [dbo].[spLoadDimAuctionSource]
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
		AuctionSourceName VARCHAR(500)
		,IsActive BIT
		,IsEchoParkActive BIT
		,IsSonicActive BIT
		,AuctionFee DECIMAL(18,2)
		,CreatedByAssociateKey INT
		,ModifiedByAssociateKey INT
		,[ETLExecution_ID] INT
		,Meta_LoadDate DATETIME
		,Meta_RowEffectiveDate DATETIME
		,Meta_RowExpiredDate DATETIME
		,Meta_RowIsCurrent CHAR(1)
		,Meta_NaturalKey VARCHAR(500)
		,Meta_SrcSysID INT
		,User_ID VARCHAR(50)
		,Meta_ComputerName VARCHAR(50)
	);
INSERT INTO #stage

SELECT   AuctionSourceName
		,IsActive
		,IsEchoParkActive
		,IsSonicActive
		,AuctionFee
		,CreatedByAssociateKey
		,ModifiedByAssociateKey
		,[ETLExecution_ID]
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
MERGE dbo.DimAuctionSource TGT
USING
(
SELECT 	AuctionSourceName
		,IsActive
		,IsEchoParkActive
		,IsSonicActive
		,ISNULL(AuctionFee,0) AS AuctionFee
		,ISNULL(CreatedByAssociateKey,-1) AS CreatedByAssociateKey
		,ISNULL(ModifiedByAssociateKey,-1) AS ModifiedByAssociateKey
		,[ETLExecution_ID]
		--,Meta_LoadDate
		,Meta_RowEffectiveDate
		--,Meta_RowExpiredDate
		,Meta_NaturalKey
		--,Meta_RowIsCurrent
		,Meta_SrcSysID
		,User_ID
		,Meta_ComputerName
		--,CHECKSUM(AuctionSourceName,IsActive,IsEchoParkActive,IsSonicActive,ISNULL(AuctionFee,0),ISNULL(CreatedByAssociateKey,-1),ISNULL(ModifiedByAssociateKey,-1)) AS [CheckSum]
  FROM [ETL_Staging].[stage].[DimAuctionSourceStaging]
) SRC

	ON TGT.Meta_NaturalKey = SRC.Meta_NaturalKey

	WHEN NOT MATCHED THEN
	INSERT
(
		 AuctionSourceName
		,IsActive
		,IsEchoParkActive
		,IsSonicActive
		,AuctionFee
		,CreatedByAssociateKey
		,ModifiedByAssociateKey
		,[ETLExecution_ID]
		,Meta_LoadDate
		,Meta_RowEffectiveDate
		,Meta_RowExpiredDate
		,Meta_NaturalKey
		,Meta_RowIsCurrent
		,[Meta_Src_System_ID]
		,User_ID
		,Meta_ComputerName
)
VALUES
(
		 SRC.AuctionSourceName
		,SRC.IsActive
		,SRC.IsEchoParkActive
		,SRC.IsSonicActive
		,SRC.AuctionFee
		,SRC.CreatedByAssociateKey
		,SRC.ModifiedByAssociateKey
		,SRC.[ETLExecution_ID]
		,@rundate
		,SRC.Meta_RowEffectiveDate
		,'9999-12-31 23:59:59'
		,SRC.Meta_NaturalKey
		,'Y'
		,SRC.Meta_SrcSysID
		,SRC.User_ID
		,SRC.Meta_ComputerName
)

WHEN MATCHED AND TGT.Meta_RowIsCurrent = 'Y' AND
	(  TGT.AuctionSourceName <> SRC.AuctionSourceName
	OR TGT.IsActive <> SRC.IsActive
	OR TGT.IsEchoParkActive <> SRC.IsEchoParkActive
	OR TGT.IsSonicActive <> SRC.IsSonicActive
	OR TGT.AuctionFee <> SRC.AuctionFee
	--OR TGT.CreatedByAssociateKey <> SRC.CreatedByAssociateKey --commented on 03/15/2021
	--OR TGT.ModifiedByAssociateKey <> SRC.ModifiedByAssociateKey --commented on 03/15/2021
	)
THEN UPDATE SET
	TGT.Meta_RowExpiredDate = SRC.Meta_RowEffectiveDate
	,TGT.Meta_RowIsCurrent = 'N'
OUTPUT $Action Action_Out, SRC.AuctionSourceName
		,SRC.IsActive
		,SRC.IsEchoParkActive
		,SRC.IsSonicActive
		,SRC.AuctionFee
		,SRC.CreatedByAssociateKey
		,SRC.ModifiedByAssociateKey
		,SRC.[ETLExecution_ID]
		,@rundate AS Meta_LoadDate
		,SRC.Meta_RowEffectiveDate
		,'9999-12-31 23:59:59' AS Meta_RowExpiredDate
		,SRC.Meta_NaturalKey
		,'Y' AS Meta_RowIsCurrent
		,SRC.Meta_SrcSysID
		,SRC.User_ID
		,SRC.Meta_ComputerName
) AS MERGE_OUT
WHERE MERGE_OUT.Action_Out = 'UPDATE'


INSERT INTO dbo.DimAuctionSource
		(
		AuctionSourceName,
		IsActive,
		IsEchoParkActive,
		IsSonicActive,
		AuctionFee,
		CreatedByAssociateKey,
		ModifiedByAssociateKey,
		Meta_LoadDate,
		ETLExecution_ID,
		Meta_RowEffectiveDate,
		Meta_RowExpiredDate,
		Meta_RowIsCurrent,
		Meta_Naturalkey,
		Meta_Src_System_ID,
		User_ID,
		Meta_ComputerName
		)
	SELECT
		AuctionSourceName
		,IsActive
		,IsEchoParkActive
		,IsSonicActive
		,AuctionFee
		,CreatedByAssociateKey
		,ModifiedByAssociateKey
		,Meta_LoadDate
		,ETLExecution_ID
		,Meta_RowEffectiveDate
		,Meta_RowExpiredDate
		,Meta_RowIsCurrent
		,Meta_NaturalKey
		,Meta_SrcSysID
		,User_ID
		,Meta_ComputerName
	FROM #stage
	SELECT @updatedRowCnts = @@ROWCOUNT    --added on 01/29/2021
     SELECT @insertedRowCnts = (SELECT COUNT(*)  FROM  dbo.DimAuctionSource  WHERE Meta_LoadDate = @rundate) - @updatedRowCnts --added on 01/29/2021
END
;

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
