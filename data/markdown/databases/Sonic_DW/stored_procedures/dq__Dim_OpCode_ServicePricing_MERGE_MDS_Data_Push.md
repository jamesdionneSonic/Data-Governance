---
name: Dim_OpCode_ServicePricing_MERGE_MDS_Data_Push
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

- **dbo.Dim_OpCode** (U )

## Parameters

| Name            | Type | Output | Default |
| --------------- | ---- | ------ | ------- |
| `@InsertedRows` | int  | Yes    | No      |
| `@UpdatedRows`  | int  | Yes    | No      |
| `@DeletedRows`  | int  | Yes    | No      |

## Definition

```sql

-- =====================================================================================================================================
-- Author:		NCARPENDER
-- Create date: 12/26/2014
-- Description:	merges data from the staging table, which has been populated from MDS, into the Dim_OpCode table. If any record
--		is signified as being from mdm and is not present, then it will be marked as not active.
--	USER	DATE		DESCRIPTION
--	NWC		20141226	Create proc
-- =====================================================================================================================================

CREATE PROCEDURE [dq].[Dim_OpCode_ServicePricing_MERGE_MDS_Data_Push]
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
MERGE dbo.Dim_OpCode as tgt
USING	(
			SELECT
					OpcCoraAcctId
				  , OpcOpCode
				  , OpcOpCodeDescription
				  , OpcFlatSellRate
				  , ProcessReady
				  , ETLExecution_ID
				  , Meta_Src_Sys_ID
				  , Meta_SourceSystemName
				  , Meta_RowEffectiveDate
				  , Meta_RowExpiredDate
				  , Meta_RowIsCurrent
				  , Meta_RowLastChangedDate
				  , [User_ID]
				  , Meta_ComputerName
			 FROM ETL_Staging.wrk.MDS_StandardData_ServicePricingOpcode_Staging
		) as src
		ON tgt.OpcCoraAcctId = src.OpcCoraAcctId
			and tgt.OpcOpCode = src.OpcOpCode	/* nulls are ignored and will be set to N for meta_iscurrent flag since they must have a OpCode */

	--	update existing records
	WHEN MATCHED AND src.ProcessReady = 1
							and
								(
									isnull(src.OpcOpCodeDescription,'') <> isnull(tgt.OpcOpCodeDescription,'')
									or isnull(src.OpcFlatSellRate,0) <> isnull(tgt.OpcFlatSellRate,0)
								)
		THEN
			UPDATE SET
						  tgt.OpcOpCodeDescription	= src.OpcOpCodeDescription
						, tgt.OpcFlatSellRate		= src.OpcFlatSellRate
						, tgt.ETLExecution_ID		= src.ETLExecution_ID
						, tgt.Meta_Src_Sys_ID		= src.Meta_Src_Sys_ID
						, tgt.Meta_SourceSystemName	= src.Meta_SourceSystemName
						--, tgt.Meta_RowEffectiveDate	= src.Meta_RowEffectiveDate	/*not updated since the etl package hard codes the value*/
						--, tgt.Meta_RowExpiredDate	= src.Meta_RowExpiredDate		/*not updated since the etl package hard codes the value*/
						--, tgt.Meta_RowIsCurrent	= src.Meta_RowIsCurrent			/*not updated since the etl package hard codes the value*/
						, tgt.Meta_RowLastChangedDate = src.Meta_RowLastChangedDate
						, tgt.[User_ID]				= src.[User_ID]
						, tgt.Meta_ComputerName		= src.Meta_ComputerName

	--	insert new records
	WHEN NOT MATCHED BY TARGET AND ProcessReady = 1
		THEN
			INSERT
				(
					OpcCoraAcctId
				  , OpcOpCode
				  , OpcOpCodeDescription
				  , OpcFlatSellRate
				  , ETLExecution_ID
				  , Meta_Src_Sys_ID
				  , Meta_SourceSystemName
				  , Meta_RowEffectiveDate
				  , Meta_RowExpiredDate
				  , Meta_RowIsCurrent
				  , Meta_RowLastChangedDate
				  , [User_ID]
				  , Meta_ComputerName
				)
			VALUES
				(
					src.OpcCoraAcctId
				  , src.OpcOpCode
				  , src.OpcOpCodeDescription
				  , src.OpcFlatSellRate
				  , src.ETLExecution_ID
				  , src.Meta_Src_Sys_ID
				  , src.Meta_SourceSystemName
				  , src.Meta_RowEffectiveDate
				  , src.Meta_RowExpiredDate
				  , src.Meta_RowIsCurrent
				  , src.Meta_RowLastChangedDate
				  , src.[User_ID]
				  , src.Meta_ComputerName
				)


	--	remove any records not in MDM
		WHEN NOT MATCHED BY SOURCE AND tgt.Meta_SourceSystemName = 'MDM - ServicePricing' and isnull(tgt.Meta_RowIsCurrent,'N') = 'Y'
		THEN
			UPDATE SET tgt.Meta_RowIsCurrent	= 'N'		/*not updated since the etl package hard codes the value*/

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
