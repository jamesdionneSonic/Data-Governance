---
name: spLoadDimTransportCompany
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - DimTransportCompany
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

- **dbo.DimTransportCompany** (U )

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
03/15/2021:  Chaitra - removed the AssociateKey checks from update logic
*******************************************************************************************/

CREATE    PROC [dbo].[spLoadDimTransportCompany]
(
 @updatedRowCnts  INT OUTPUT, -- added on 01/29/2021
 @insertedRowCnts  INT OUTPUT  -- added on 01/29/2021
)
AS
     BEGIN

         DECLARE @rundate datetime = GETDATE(); -- added on 01/29/2021

IF OBJECT_ID ('tempdb..#stage') is not null drop table #stage;

CREATE TABLE #stage
	(
	TransportCompanyName varchar(500),
	IsActive bit,
	IsEchoParkActive bit,
	IsSonicActive bit,
	EmailAddress varchar(1000) NULL,
	CreatedByAssociateKey int,
	ModifiedByAssociateKey int NULL,
	Meta_LoadDate datetime,
	Meta_RowEffectiveDate datetime,
	Meta_RowExpiredDate datetime,
	Meta_RowIsCurrent char(1),
	ETLExecution_ID int,
	Meta_Naturalkey varchar(500),
	Meta_Src_System_ID int,
	User_ID varchar(50),
	Meta_ComputerName varchar(50),
	);
INSERT INTO #stage

SELECT   TransportCompanyName
		,IsActive
		,IsEchoParkActive
		,IsSonicActive
		,EmailAddress
		,CreatedByAssociateKey
		,ModifiedByAssociateKey
		,Meta_LoadDate
		,Meta_RowEffectiveDate
		,Meta_RowExpiredDate
		,Meta_RowIsCurrent
		,ETLExecution_ID
		,Meta_NaturalKey
		,Meta_SrcSysID
		,User_ID
		,Meta_ComputerName
FROM
(
MERGE dbo.DimTransportCompany TGT
USING
(
SELECT 	TransportCompanyName
		,IsActive
		,IsEchoParkActive
		,IsSonicActive
		,EmailAddress
		,ISNULL(CreatedByAssociateKey,-1) AS CreatedByAssociateKey
		,ISNULL(ModifiedByAssociateKey,-1) AS ModifiedByAssociateKey
		--,Meta_LoadDate
		,Meta_RowEffectiveDate
		--,Meta_RowExpiredDate
		,ETLExecution_ID
		,Meta_NaturalKey
		--,Meta_RowIsCurrent
		,Meta_SrcSysID
		,User_ID
		,Meta_ComputerName
  FROM [ETL_Staging].[stage].[DimTransportCompanyStaging]
) SRC

	ON TGT.Meta_NaturalKey = SRC.Meta_NaturalKey

	WHEN NOT MATCHED THEN
	INSERT
(
		 TransportCompanyName
		,IsActive
		,IsEchoParkActive
		,IsSonicActive
		,EmailAddress
		,CreatedByAssociateKey
		,ModifiedByAssociateKey
		,Meta_LoadDate
		,Meta_RowEffectiveDate
		,Meta_RowExpiredDate
		,Meta_RowIsCurrent
		,ETLExecution_ID
		,Meta_NaturalKey
		,Meta_Src_System_ID
		,User_ID
		,Meta_ComputerName
)
VALUES
(
		 SRC.TransportCompanyName
		,SRC.IsActive
		,SRC.IsEchoParkActive
		,SRC.IsSonicActive
		,SRC.EmailAddress
		,SRC.CreatedByAssociateKey
		,SRC.ModifiedByAssociateKey
		,@rundate
		,SRC.Meta_RowEffectiveDate
		,'9999-12-31 23:59:59'
		,'Y'
		,SRC.ETLExecution_ID
		,SRC.Meta_NaturalKey
		,SRC.Meta_SrcSysID
		,SRC.User_ID
		,SRC.Meta_ComputerName
)

WHEN MATCHED AND TGT.Meta_RowIsCurrent = 'Y' AND
	(  TGT.TransportCompanyName <> SRC.TransportCompanyName
	OR TGT.IsActive <> SRC.IsActive
	OR TGT.IsEchoParkActive <> SRC.IsEchoParkActive
	OR TGT.IsSonicActive <> SRC.IsSonicActive
	OR TGT.EmailAddress <> SRC.EmailAddress
	--OR TGT.CreatedByAssociateKey <> SRC.CreatedByAssociateKey --commented on 03/15/2021
	--OR TGT.ModifiedByAssociateKey <> SRC.ModifiedByAssociateKey --commented on 03/15/2021
	)
THEN UPDATE SET
	TGT.Meta_RowExpiredDate = SRC.Meta_RowEffectiveDate
	,TGT.Meta_RowIsCurrent = 'N'
OUTPUT $Action Action_Out, SRC.TransportCompanyName
		,SRC.IsActive
		,SRC.IsEchoParkActive
		,SRC.IsSonicActive
		,SRC.EmailAddress
		,SRC.CreatedByAssociateKey
		,SRC.ModifiedByAssociateKey
		,@rundate AS Meta_LoadDate
		,SRC.Meta_RowEffectiveDate
		,'9999-12-31 23:59:59' AS Meta_RowExpiredDate
		,'Y' AS Meta_RowIsCurrent
		,SRC.ETLExecution_ID
		,SRC.Meta_NaturalKey
		,SRC.Meta_SrcSysID
		,SRC.User_ID
		,SRC.Meta_ComputerName
) AS MERGE_OUT
WHERE MERGE_OUT.Action_Out = 'UPDATE'

INSERT INTO dbo.DimTransportCompany
	(
		 TransportCompanyName
		,IsActive
		,IsEchoParkActive
		,IsSonicActive
		,EmailAddress
		,CreatedByAssociateKey
		,ModifiedByAssociateKey
		,Meta_LoadDate
		,Meta_RowEffectiveDate
		,Meta_RowExpiredDate
		,Meta_RowIsCurrent
		,ETLExecution_ID
		,Meta_NaturalKey
		,Meta_Src_System_ID
		,User_ID
		,Meta_ComputerName
	)
SELECT 	TransportCompanyName
		,IsActive
		,IsEchoParkActive
		,IsSonicActive
		,EmailAddress
		,CreatedByAssociateKey
		,ModifiedByAssociateKey
		,Meta_LoadDate
		,Meta_RowEffectiveDate
		,Meta_RowExpiredDate
		,Meta_RowIsCurrent
		,ETLExecution_ID
		,Meta_Naturalkey
		,Meta_Src_System_ID
		,User_ID
		,Meta_ComputerName
FROM #stage


SET @updatedRowCnts = @@ROWCOUNT -- added on 01/29/2021
SET @insertedRowCnts = (SELECT COUNT(*)  FROM  dbo.DimTransportCompany WHERE Meta_LoadDate = @rundate) - @updatedRowCnts  -- added on 01/29/2021
END

;
```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
