---
name: Dim_LaborType_Transact_MERGE_MDS_Data_Push
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

- **dbo.Dim_LaborType_Transact** (U )

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
-- Create date: 12/8/2014
-- Description:	merges data from the staging table, which has been populated from MDS, into the Dim_LaborType_Transact table.
--	USER	DATE		DESCRIPTION
--	NWC		20141208	Create proc
-- =============================================
CREATE PROCEDURE [dq].[Dim_LaborType_Transact_MERGE_MDS_Data_Push]
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
MERGE dbo.Dim_LaborType_Transact as tgt
USING	(
			SELECT CoraAcctID
				, LaborType
				, LaborTypeCategory
				, ProcessReady
				, Meta_LoadDate
				, Meta_Src_Sys_ID
				, User_ID
				, Meta_ComputerName
				, ETLExecution_ID
				, Meta_LastModifiedDate
			FROM ETL_Staging.wrk.MDS_StandardData_LaborType_Transact_Staging
		) as src
		ON tgt.lbrCoraAcctID = src.CoraAcctID
			and tgt.lbrLaborType = src.LaborType	/* nulls are ignored and will be deleted since they must have a labor type*/

	--	update existing records
	WHEN MATCHED AND src.ProcessReady = 1
							and
								(
									src.LaborTypeCategory <> tgt.lbrLaborTypeCategory
									or tgt.lbrLaborTypeCategory is null
								)
		THEN
			UPDATE SET
						  tgt.lbrLaborTypeCategory	= src.LaborTypeCategory
						, tgt.Meta_Src_Sys_ID		= src.Meta_Src_Sys_ID
						, tgt.[User_ID]				= src.[User_ID]
						, tgt.Meta_ComputerName		= src.Meta_ComputerName
						, tgt.ETLExecution_ID		= src.ETLExecution_ID
						, tgt.Meta_LastModifiedDate = src.Meta_LastModifiedDate

	--	insert new records
	WHEN NOT MATCHED BY TARGET AND ProcessReady = 1
		THEN
			INSERT
				(
					  lbrCoraAcctID
					, lbrLaborType
					, lbrLaborTypeCategory
					, Meta_LoadDate
					, Meta_Src_Sys_ID
					, User_ID
					, Meta_ComputerName
					, ETLExecution_ID
					, Meta_LastModifiedDate
				)
			VALUES
				(
					  src.CoraAcctID
					, src.LaborType
					, src.LaborTypeCategory
					, src.Meta_LoadDate
					, src.Meta_Src_Sys_ID
					, src.User_ID
					, src.Meta_ComputerName
					, src.ETLExecution_ID
					, src.Meta_LastModifiedDate
				)

	--do not perform delete in case someone adds records outside of MDM. This shouldn't occur but since this is a early adopted practice we
	--	want to be careful.
	/*
	--	remove any records not in MDM
		WHEN NOT MATCHED BY SOURCE THEN
			DELETE
	*/

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
