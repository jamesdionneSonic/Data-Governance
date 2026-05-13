---
name: Dim_AccountMgmt_MERGE_MDS_Data_Push
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

- **dbo.Dim_AccountMgmt** (U )

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
CREATE PROCEDURE [dq].[Dim_AccountMgmt_MERGE_MDS_Data_Push]
	@InsertedRows int output
	,@UpdatedRows int output
	,@DeletedRows int output
AS
BEGIN

	SET NOCOUNT ON;
   SET Identity_Insert dbo.Dim_AccountMgmt ON;
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
MERGE dbo.Dim_AccountMgmt as tgt
USING	(
			SELECT
				 [AccountMgmtKey]
				, ProcessReady
				, MetaNatural_Key
				, AccountType
				, Level1
				, Level2
				, Level3
				, Level4
				, Level5
				, Level6
				, Level7
				, Level8
				, Level8_Description
				, CheckSumHash
				, Meta_LoadDate
				, Meta_Src_Sys_ID
				, User_ID
				, Meta_ComputerName
				, ETLExecutionID
				, Meta_LastModifiedDate
			  FROM ETL_Staging.wrk.MDS_AccountMgmt_Push_Staging
		) as src
	ON tgt.AccountMgmtKey = src.AccountMgmtKey

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
					  [AccountType]			=	src.[AccountType]
					  ,[Level1]				=	src.[Level1]
					  ,[Level2]				=	src.[Level2]
					  ,[Level3]				=	src.[Level3]
					  ,[Level4]				=	src.[Level4]
					  ,[Level5]				=	src.[Level5]
					  ,[Level6]				=	src.[Level6]
					  ,[Level7]				=	src.[Level7]
					  ,[Level8]				=	src.[Level8]
					  ,[Level8_Description]	=	src.[Level8_Description]
					  ,[ETLExecution_ID]	=	src.[ETLExecutionID]
					  ,[Meta_Src_Sys_ID]	=	src.[Meta_Src_Sys_ID]
					  ,[User_ID]			=	src.[User_ID]
					  ,[Meta_ComputerName]	=	src.[Meta_ComputerName]
					  ,[Meta_RowLastChangedDate]	=	getdate()
					  ,[Meta_NaturalKey]	=	src.[MetaNatural_Key]
					  ,[CheckSumHash]		=	src.[CheckSumHash]

	WHEN NOT MATCHED BY TARGET AND ProcessReady = 1
		THEN
			INSERT
				(
					 [AccountMgmtKey]
					  ,[AccountType]
					  ,[Level1]
					  ,[Level2]
					  ,[Level3]
					  ,[Level4]
					  ,[Level5]
					  ,[Level6]
					  ,[Level7]
					  ,[Level8]
					  ,[Level8_Description]
					  ,[ETLExecution_ID]
					  ,[Meta_Src_Sys_ID]
					  ,[User_ID]
					  ,[Meta_ComputerName]
					  ,[Meta_SourceSystemName]
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
					  ,src.[AccountType]
					  ,src.[Level1]
					  ,src.[Level2]
					  ,src.[Level3]
					  ,src.[Level4]
					  ,src.[Level5]
					  ,src.[Level6]
					  ,src.[Level7]
					  ,src.[Level8]
					  ,src.[Level8_Description]
					  ,src.[ETLExecutionID]
					  ,src.[Meta_Src_Sys_ID]
					  ,src.[User_ID]
					  ,src.[Meta_ComputerName]
					  ,'HFM'
					  ,convert(date,getdate())
					  ,'1901-01-01'
					  ,'9999-12-31'
					  ,'Y'
					  ,getdate()
					  ,-1
					  ,src.[MetaNatural_Key]
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


   SET Identity_Insert dbo.Dim_AccountMgmt OFF;

END




```

## Governance

- **Last Extracted**: 2026-05-12T20:14:33.860Z
