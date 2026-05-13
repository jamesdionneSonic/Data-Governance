---
name: Dim_AccountMgmtGrouping_MERGE_MDS_Data_Push
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

- **dbo.Dim_AccountMgmtGrouping** (U )

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
-- Description:	merges data from the staging table, which has been populated from MDS, into the Dim_AccountMgmt
-- =============================================
CREATE PROCEDURE [dq].[Dim_AccountMgmtGrouping_MERGE_MDS_Data_Push]
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
MERGE dbo.Dim_AccountMgmtGrouping as tgt
USING	(
			SELECT
					[AccountMgmtKey]
				  ,[GroupID]
				  ,[GroupDescription]
				  ,[GroupElement]
				  ,[Level8]
				  ,[GroupElementSort]
				  ,[CheckSumHash]
				  ,[ETLExecution_ID]
				  ,[Meta_Src_Sys_ID]
				  ,[User_ID]
				  ,[Meta_ComputerName]
				  ,[Meta_LoadDate]
				  ,[Meta_NaturalKey]
				  ,ProcessReady
			  FROM ETL_Staging.wrk.MDS_AccountMgmtGrouping_Push_Staging
		) as src
	ON tgt.AccountMgmtKey = src.AccountMgmtKey
		and tgt.GroupID = src.GroupID

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
					  [AccountMgmtKey]			= src.[AccountMgmtKey]
						,[GroupID]				= src.[GroupID]
						,[GroupDescription]		= src.[GroupDescription]
						,[GroupElement]			= src.[GroupElement]
						,[Level8]				= src.[Level8]
						,[GroupElementSort]		= src.[GroupElementSort]
						,[ETLExecution_ID]		= src.[ETLExecution_ID]
						,[Meta_Src_Sys_ID]		= src.[Meta_Src_Sys_ID]
						,[User_ID]				= src.[User_ID]
						,[Meta_ComputerName]	= src.[Meta_ComputerName]
						,[Meta_RowLastChangedDate] = convert(date,getdate())
						,[Meta_NaturalKey]		= src.[Meta_NaturalKey]
						,[CheckSumHash]			= src.[CheckSumHash]

	WHEN NOT MATCHED BY TARGET AND ProcessReady = 1
		THEN
			INSERT
				(
					 [AccountMgmtKey]
					  ,[GroupID]
					  ,[GroupDescription]
					  ,[GroupElement]
					  ,[Level8]
					  ,[GroupElementSort]
					  ,[ETLExecution_ID]
					  ,[Meta_Src_Sys_ID]
					  ,[User_ID]
					  ,[Meta_ComputerName]
					  ,[Meta_LoadDate]
					  ,[Meta_RowEffectiveDate]
					  ,[Meta_RowExpiredDate]
					  ,[Meta_RowIsCurrent]
					  ,[Meta_RowLastChangedDate]
					  ,[Meta_AuditKey]
					  ,[Meta_NaturalKey]
					  ,[CheckSumHash]

				)
			VALUES
				(
					 src.[AccountMgmtKey]
					  ,src.[GroupID]
					  ,src.[GroupDescription]
					  ,src.[GroupElement]
					  ,src.[Level8]
					  ,src.[GroupElementSort]
					  ,src.[ETLExecution_ID]
					  ,src.[Meta_Src_Sys_ID]
					  ,src.[User_ID]
					  ,src.[Meta_ComputerName]
					  ,convert(date,getdate())
					  ,'1901-01-01'
					  ,'9999-12-31'
					  ,'y'
					  ,convert(date,getdate())
					  ,-1
					  ,src.[Meta_NaturalKey]
					  ,src.[CheckSumHash]
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
