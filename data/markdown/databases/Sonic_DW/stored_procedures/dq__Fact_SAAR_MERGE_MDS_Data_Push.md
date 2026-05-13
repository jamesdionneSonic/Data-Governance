---
name: Fact_SAAR_MERGE_MDS_Data_Push
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

- **dbo.Fact_SAAR** (U )

## Parameters

| Name            | Type | Output | Default |
| --------------- | ---- | ------ | ------- |
| `@InsertedRows` | int  | Yes    | No      |
| `@UpdatedRows`  | int  | Yes    | No      |
| `@DeletedRows`  | int  | Yes    | No      |

## Definition

```sql


-- ===========================================================================================================================
-- Author:		NCARPENDER
-- Create date: 2/26/2014
-- Description:	merges data from the staging table, which has been populated from MDS, into the fact_SAAR table.
-- ===========================================================================================================================
CREATE PROCEDURE [dq].[Fact_SAAR_MERGE_MDS_Data_Push]
	@InsertedRows int output
	,@UpdatedRows int output
	,@DeletedRows int output
AS
BEGIN

	SET NOCOUNT ON;

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
MERGE dbo.Fact_SAAR as tgt
USING	(
			SELECT
				  Code as SAARKey
				, YearNum
				, MonthNum
				, SAARValue
				, ProcessReady
				, CheckSumHash
				, Meta_LoadDate
				, Meta_LastModifiedDate
				, Meta_Src_Sys_ID
				, [User_ID]
				, Meta_ComputerName
				, ETLExecutionID
			  FROM ETL_Staging.wrk.MDS_Industry_SAAR_Push_Staging
		) as src
	ON tgt.SAARKey = src.SAARKey

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
					      SAARKey				= src.SAARKey
						, YearNum				= src.YearNum
						, MonthNum				= src.MonthNum
						, SAARValue				= src.SAARValue
						, CheckSumHash			= src.CheckSumHash
						, Meta_LastModifiedDate = src.Meta_LastModifiedDate
						, Meta_Src_Sys_ID		= src.Meta_Src_Sys_ID
						, [User_ID]				= src.[User_ID]
						, Meta_ComputerName		= src.Meta_ComputerName
						, ETLExecutionID		= src.ETLExecutionID

	WHEN NOT MATCHED BY TARGET AND ProcessReady = 1
		THEN
			INSERT
				(
					  SAARKey
					, YearNum
					, MonthNum
					, SAARValue
					, CheckSumHash
					, Meta_LoadDate
					, Meta_LastModifiedDate
					, Meta_Src_Sys_ID
					, [User_ID]
					, Meta_ComputerName
					, ETLExecutionID
				)
			VALUES
				(
					  src.SAARKey
					, src.YearNum
					, src.MonthNum
					, src.SAARValue
					, src.CheckSumHash
					, src.Meta_LoadDate
					, src.Meta_LastModifiedDate
					, src.Meta_Src_Sys_ID
					, src.[User_ID]
					, src.Meta_ComputerName
					, src.ETLExecutionID
				)
	WHEN NOT MATCHED BY SOURCE THEN
		DELETE

		OUTPUT 1, $action INTO @SummaryOfChanges;

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
