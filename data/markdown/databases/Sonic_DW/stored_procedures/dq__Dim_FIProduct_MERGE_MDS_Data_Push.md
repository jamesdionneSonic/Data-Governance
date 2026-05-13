---
name: Dim_FIProduct_MERGE_MDS_Data_Push
database: Sonic_DW
type: procedure
schema: dq
owner: Data Team
tags:
  - procedure
  - auto-extracted
dependency_count: 1
parameter_count: 3
extracted_at: 2026-05-12T20:14:33.860Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dq

## Dependencies

This procedure depends on:

- **dbo.Dim_FIProduct** (U )

## Parameters

| Name            | Type | Output | Default |
| --------------- | ---- | ------ | ------- |
| `@InsertedRows` | int  | Yes    | No      |
| `@UpdatedRows`  | int  | Yes    | No      |
| `@DeletedRows`  | int  | Yes    | No      |

## Definition

```sql



-- =============================================
-- Author:		NCARPENDER
-- Create date: 11/1/2013
-- Description:	merges data from the staging table, which has been populated from MDS, into the Dim_FIProduct.
-- =============================================
CREATE PROCEDURE [dq].[Dim_FIProduct_MERGE_MDS_Data_Push]
	@InsertedRows int output
	,@UpdatedRows int output
	,@DeletedRows int output
AS
BEGIN

	SET NOCOUNT ON;

	SET IDENTITY_INSERT dbo.Dim_FIProduct ON;

------------------------------------------------------------------------------------------
-- Create a temporary table variable to hold the output actions.
------------------------------------------------------------------------------------------
	DECLARE @SummaryOfChanges TABLE(ChangeOccured int, Change VARCHAR(20));

	insert into @SummaryOfChanges values(0,'UPDATE');
	insert into @SummaryOfChanges values(0,'DELETE');
	insert into @SummaryOfChanges values(0,'INSERT');


------------------------------------------------------------------------------------------
-- Run the merge statement
------------------------------------------------------------------------------------------
MERGE dbo.Dim_FIProduct as tgt
USING	(
			SELECT
				 [ProductID]
				,[ProductCode]
				,[ProductDesc]
				,[ProductCategory]
				,[ProductCategory2]
				,[SalesAccount]
				,[CostAccount]
				,[FIAccountClassification]
				,[ProcessReady]
				,[CheckSumHash]
				,[Meta_Src_Sys_ID]
				, 'MDS' as [Meta_SourceSystemName]
				,[Meta_LoadDate]
				,[User_ID]
				,[ETLExecution_ID]
				,[Meta_LastModifiedDate]
			  FROM ETL_Staging.wrk.MDS_FIProduct_Push_Staging
		) as src
	ON tgt.ProductID = src.ProductID

	WHEN MATCHED AND (
						src.ProcessReady = 1
						and
							(
								src.CheckSumHash <> tgt.CheckSumHash
								or tgt.CheckSumHash is null
							)

					)
		THEN
			UPDATE SET
					   [ProductCode]			= src.[ProductCode]
					, [ProductDesc]			= src.[ProductDesc]
					, [ProductCategory]		= src.[ProductCategory]
					, [ProductCategory2]	= src.[ProductCategory2]
					, [SalesAccount]		= src.[SalesAccount]
					, [CostAccount]			= src.[CostAccount]
					, [FIAccountClassification] = src.[FIAccountClassification]
					, [CheckSumHash]		= src.[CheckSumHash]
					, [Meta_LoadDate]		= src.[Meta_LoadDate]
					, [Meta_Src_Sys_ID]		= src.[Meta_Src_Sys_ID]
					, [User_ID]				= left(src.[User_ID],20)
					, [ETLExecution_ID]		= src.[ETLExecution_ID]

	WHEN NOT MATCHED BY TARGET AND ProcessReady = 1
		THEN
			INSERT
				(
					 [ProductID]
					,[ProductCode]
					,[ProductDesc]
					,[ProductCategory]
					,[ProductCategory2]
					,[SalesAccount]
					,[CostAccount]
					,[FIAccountClassification]
					,[CheckSumHash]
					,[Meta_LoadDate]
					,[Meta_Src_Sys_ID]
					,[User_ID]
					,[ETLExecution_ID]
					,[Meta_RowEffectiveDate]

				)
			VALUES
				(
					  src.[ProductID]
					, src.[ProductCode]
					, src.[ProductDesc]
					, src.[ProductCategory]
					, src.[ProductCategory2]
					, src.[SalesAccount]
					, src.[CostAccount]
					, src.[FIAccountClassification]
					, src.[CheckSumHash]
					, src.[Meta_LoadDate]
					, src.[Meta_Src_Sys_ID]
					, left(src.[User_ID],20)
					, src.[ETLExecution_ID]
					, getdate()
				)
	WHEN NOT MATCHED BY SOURCE THEN
		DELETE

		OUTPUT 1, $action INTO @SummaryOfChanges;

	SET IDENTITY_INSERT dbo.Dim_FIProduct OFF;

------------------------------------------------------------------------------------------
--	Return resutls of the merge to show actions taken
------------------------------------------------------------------------------------------

	set @InsertedRows = (select sum(ChangeOccured) as cnt from @SummaryOfChanges where Change = 'INSERT')
	set @UpdatedRows = (select sum(ChangeOccured) as cnt from @SummaryOfChanges where Change = 'UPDATE')
	set @DeletedRows = (select sum(ChangeOccured) as cnt from @SummaryOfChanges where Change = 'DELETE');

	SELECT Change, sum(ChangeOccured) AS CountPerChange FROM @SummaryOfChanges GROUP BY Change;

END




```

## Governance

- **Last Extracted**: 2026-05-12T20:14:33.860Z
