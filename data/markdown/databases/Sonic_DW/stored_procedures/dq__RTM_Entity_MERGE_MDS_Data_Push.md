---
name: RTM_Entity_MERGE_MDS_Data_Push
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

- **dbo.Dim_RegionalTechnologyManager** (U )

## Parameters

| Name            | Type | Output | Default |
| --------------- | ---- | ------ | ------- |
| `@InsertedRows` | int  | Yes    | No      |
| `@UpdatedRows`  | int  | Yes    | No      |
| `@DeletedRows`  | int  | Yes    | No      |

## Definition

```sql

-- ===============================================================================================================
-- Author:		NCARPENDER
-- Create date: 11/1/2013
-- Description:	merges data from the staging table, which has been populated from MDS, into the entity.
--	USER	DATE		DESCRIPTION
--	NWC		20150219	Created
-- ===============================================================================================================
CREATE PROCEDURE [dq].[RTM_Entity_MERGE_MDS_Data_Push]
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
MERGE dbo.Dim_RegionalTechnologyManager as tgt
USING	(
			SELECT
				 [ID]
				,[RegionName]
				,[ManagerName]
				,[EmailAddress]
				,[PhoneNumber]
				,[PhoneNumberExt]
				,[ProcessReady]
				,[CheckSumHash]
				,[Meta_LoadDate]
				,[Meta_LastModifiedDate]
				,[Meta_Src_Sys_ID]
				,[User_ID]
				,[Meta_DataChgUser]
				,[Meta_ComputerName]
				,[ETLExecution_ID]
				,[MetaRowIsCurrent]
			FROM ETL_Staging.[wrk].[MDS_RTM_Entity_Push_Staging]
		) as src
	ON tgt.RTM_ID = src.ID

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
				  [RTM_ID]				= src.[ID]
				, [RTM_RegionName]		= src.[RegionName]
				, [RTM_Name]			= src.[ManagerName]
				, [RTM_EmailAddress]	= src.[EmailAddress]
				, [RTM_PhoneNumber]		= src.[PhoneNumber]
				, [RTM_PhoneNumberExt] = src.[PhoneNumberExt]
				, [CheckSumHash]		= src.[CheckSumHash]
				, [Meta_LoadDate]		= src.[Meta_LoadDate]
				, [Meta_LastModifiedDate] = src.[Meta_LastModifiedDate]
				, [Meta_Src_Sys_ID]		= src.[Meta_Src_Sys_ID]
				, [User_ID]				= src.[User_ID]
				, [Meta_DataChgUser]	= src.[Meta_DataChgUser]
				, [Meta_ComputerName]	= src.[Meta_ComputerName]
				, [ETLExecution_ID]		= src.[ETLExecution_ID]
				, [MetaRowIsCurrent]	= src.[MetaRowIsCurrent]

	WHEN NOT MATCHED BY TARGET AND ProcessReady = 1
		THEN
			INSERT
				(
					 [RTM_ID]
					,[RTM_RegionName]
					,[RTM_Name]
					,[RTM_EmailAddress]
					,[RTM_PhoneNumber]
					,[RTM_PhoneNumberExt]
					,[CheckSumHash]
					,[Meta_LoadDate]
					,[Meta_LastModifiedDate]
					,[Meta_Src_Sys_ID]
					,[User_ID]
					,[Meta_DataChgUser]
					,[Meta_ComputerName]
					,[ETLExecution_ID]
					,[MetaRowIsCurrent]
				)
			VALUES
				(
					 src.[ID]
					,src.[RegionName]
					,src.[ManagerName]
					,src.[EmailAddress]
					,src.[PhoneNumber]
					,src.[PhoneNumberExt]
					,src.[CheckSumHash]
					,src.[Meta_LoadDate]
					,src.[Meta_LastModifiedDate]
					,src.[Meta_Src_Sys_ID]
					,src.[User_ID]
					,src.[Meta_DataChgUser]
					,src.[Meta_ComputerName]
					,src.[ETLExecution_ID]
					,src.[MetaRowIsCurrent]
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
