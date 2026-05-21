---
name: spLoadFactCBABuyerTarget
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

/******************** CHANGE LOG **********************************************************
06/10/2020:  Derrick Davis - Create stored proc
01/29/2021:  Chaitra - updated stored proc for populating the Fact_DataAudit table
03/15/2021:  Chaitra - removed the AssociateKey checks in the Update logic
*******************************************************************************************/

CREATE   PROC [dbo].[spLoadFactCBABuyerTarget]
(
 @insertedRowCnts  INT OUTPUT,     --added on 01/29/2021
 @updatedRowCnts   INT OUTPUT      --added on 01/29/2021
)
AS

 BEGIN
         DECLARE @rowcounts TABLE(MergeAction VARCHAR(20));   --added on 01/29/2021
         DECLARE @insertedCount INT, @updatedCount INT;       --added on 01/29/2021

MERGE dbo.FactCBABuyerTarget TGT
USING
(
SELECT 	 ISNULL(s.BuyerKey,-1) AS BuyerKey
		,s.TargetValue
		,ISNULL(sd.DateKey,19000101) AS WeekStartDateKey
		,ISNULL(ed.DateKey,19000101) AS WeekEndDateKey
		,ISNULL(s.CreatedByAssociateKey,-1) AS CreatedByAssociateKey
		,ISNULL(cdk.DateKey,19000101) AS CreatedOnDateKey
		,ISNULL(s.ModifiedByAssociateKey,-1) AS ModifiedByAssociateKey
		,ISNULL(mdk.DateKey,19000101) AS ModifiedOnDateKey
		,s.ETLExecution_ID
		,s.ModifiedOn AS [Meta_RowLastChangedDate]
		,s.Meta_NaturalKey
		,s.Meta_Src_System_ID
		,s.User_ID
		,s.Meta_ComputerName
  FROM [ETL_Staging].[stage].[FactCBABuyerTargetStaging] s
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
		 BuyerKey
		,TargetValue
		,WeekStartDateKey
		,WeekEndDateKey
		,CreatedByAssociateKey
		,CreatedOnDateKey
		,ModifiedByAssociateKey
		,ModifiedOnDateKey
		,ETLExecution_ID
		,Meta_LoadDate
		,Meta_RowLastChangedDate
		,Meta_Naturalkey
		,Meta_Src_System_ID
		,User_ID
		,Meta_ComputerName
)
VALUES
(
		 SRC.BuyerKey
		,SRC.TargetValue
		,SRC.WeekStartDateKey
		,SRC.WeekEndDateKey
		,SRC.CreatedByAssociateKey
		,SRC.CreatedOnDateKey
		,SRC.ModifiedByAssociateKey
		,SRC.ModifiedOnDateKey
		,SRC.ETLExecution_ID
		,GETDATE()
		,GETDATE()
		,SRC.Meta_NaturalKey
		,SRC.Meta_Src_System_ID
		,SRC.User_ID
		,SRC.Meta_ComputerName
)

WHEN MATCHED AND
	(
	TGT.TargetValue <> SRC.TargetValue
	--OR TGT.BuyerKey <> SRC.BuyerKey --updated on 03/15/2021
	OR TGT.WeekStartDateKey <> SRC.WeekStartDateKey
	OR TGT.WeekEndDateKey <> SRC.WeekEndDateKey
	--OR TGT.CreatedByAssociateKey <> SRC.CreatedByAssociateKey --updated on 03/15/2021
	OR TGT.CreatedOnDateKey <> SRC.CreatedOnDateKey
	--OR TGT.ModifiedByAssociateKey <> SRC.ModifiedByAssociateKey  --updated on 03/15/2021
	OR TGT.ModifiedOnDateKey <> SRC.ModifiedOnDateKey
	)
THEN UPDATE SET
	 TGT.BuyerKey = SRC.BuyerKey
	,TGT.TargetValue = SRC.TargetValue
	,TGT.WeekStartDateKey = SRC.WeekStartDateKey
	,TGT.WeekEndDateKey = SRC.WeekEndDateKey
	,TGT.CreatedByAssociateKey = SRC.CreatedByAssociateKey
	,TGT.CreatedOnDateKey = SRC.CreatedOnDateKey
	,TGT.ModifiedByAssociateKey = SRC.ModifiedByAssociateKey
	,TGT.ModifiedOnDateKey = SRC.ModifiedOnDateKey
                  ,TGT.ETLExecution_ID=SRC.ETLExecution_ID
	,TGT.Meta_RowLastChangedDate = GETDATE()
OUTPUT $ACTION                              --added on 01/29/2021
    INTO @rowcounts;


		SELECT @insertedCount = [INSERT]
			,@updatedCount = [UPDATE]
		FROM (
			SELECT MergeAction
				,1 ROWS FROM @rowcounts
			) AS p
		PIVOT(COUNT(rows) FOR p.MergeAction IN (
					[INSERT]
					,[UPDATE]
					)) AS pvt

         SELECT @insertedRowCnts = isnull(@insertedcount, 0) ,
                @updatedRowCnts = isnull(@updatedCount, 0)
END
;
```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
