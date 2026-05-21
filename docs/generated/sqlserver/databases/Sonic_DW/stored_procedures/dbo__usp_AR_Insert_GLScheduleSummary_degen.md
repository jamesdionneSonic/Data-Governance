---
name: usp_AR_Insert_GLScheduleSummary_degen
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


-- =============================================
-- Author:		Rajamani Bandi
-- Create date: 07/20/2015
-- Description:	Inserts/Update
-- =============================================
CREATE PROCEDURE [dbo].[usp_AR_Insert_GLScheduleSummary_degen]


	@InsertedRows int output
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
MERGE [Sonic_DW].dbo.Dim_GLScheduleSummary_degen  AS [tgt]
USING ETL_Staging.wrk.AR_Dim_GLScheduleSummary_degen AS [stg]
ON [tgt].[EntCora_Account_ID]= [stg].[EntCora_Account_ID]
AND [tgt].[ControlType] = [stg].[ControlType]
AND [tgt].[Control] =[stg].[Control]

WHEN MATCHED AND

	[tgt].[ControlDesc]	<> [stg].[ControlDesc]

THEN
	UPDATE SET

		 [tgt].[ControlDesc]			=	[stg].[ControlDesc]
		,[tgt].[Meta_RowLastDMLAction]	=	'U'
		,[tgt].[Meta_NaturalKey]		=	[stg].[Meta_NaturalKey]
		,[tgt].[ETLExecution_ID]		=	[stg].[ETLExecution_ID]
		,[tgt].[Meta_RowEffectiveDate]	=	[stg].Meta_RowEffectiveDate
		,[tgt].[Meta_RowLastChangedDate] =	GETDATE()
		,[tgt].[Meta_RowIsCurrent]		=	[stg].[Meta_RowIsCurrent]
		,[tgt].[Meta_ComputerName]		=	[stg].[Meta_ComputerName]
		,[tgt].[User_ID]				=	[stg].[User_ID]


WHEN NOT MATCHED THEN
	INSERT(

					[EntCora_Account_ID]
					,[ControlType]
					,[Control]
					,[ControlDesc]
					,[Meta_RowLastDMLAction]
					,[Meta_NaturalKey]
					,[Meta_Src_Sys_ID]
					,[User_ID]
					,[Meta_LoadDate]
					,[Meta_ComputerName]
					,[Meta_SourceSystemName]
					,[Meta_RowEffectiveDate]
					--,[Meta_RowExpiredDate]
					,[Meta_RowIsCurrent]
					,[Meta_RowLastChangedDate]
					,[ETLExecution_ID]

			)

	VALUES(
					[stg].[EntCora_Account_ID]
					,[stg].[ControlType]
					,[stg].[Control]
					,[stg].[ControlDesc]
					,'I'
					,[stg].[Meta_NaturalKey]
					,[stg].[Meta_Src_Sys_ID]
					,[stg].[User_ID]
					,[stg].[Meta_LoadDate]
					,[stg].[Meta_ComputerName]
					,[stg].[Meta_SourceSystemName]
					,[stg].[Meta_RowEffectiveDate]
					--,[stg].Meta_RowExpiredDate
					,'Y'
					,GETDATE()
					,[stg].[ETLExecution_ID]
				)

				OUTPUT 1, $action INTO @SummaryOfChanges;

		------------------------------------------------------------------------------------------
		--	Return resutls of the merge to show actions taken
		------------------------------------------------------------------------------------------

			set @InsertedRows = (select sum(ChangeOccured) as cnt from @SummaryOfChanges where Change = 'INSERT')

END



```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
