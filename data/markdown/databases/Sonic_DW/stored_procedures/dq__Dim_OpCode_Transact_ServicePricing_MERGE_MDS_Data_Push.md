---
name: Dim_OpCode_Transact_ServicePricing_MERGE_MDS_Data_Push
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

- **dbo.Dim_OpCode_Transact** (U )

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
-- Description:	merges data from the staging table, which has been populated from MDS, into the Dim_OpCode_transact table. If any record
--		is signified as being from mdm and is not present, then it will be marked as not active.
--	USER	DATE		DESCRIPTION
--	NWC		20141226	Create proc
-- =====================================================================================================================================

CREATE PROCEDURE [dq].[Dim_OpCode_Transact_ServicePricing_MERGE_MDS_Data_Push]
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
MERGE dbo.Dim_OpCode_Transact as tgt
USING	(
			SELECT
					OpcCoraAcctId
				  , OpcOpCode
				  , 'TBD'			as [OpcOpCodeCategory]	/* values defaulted */
				  , 'NA'			as [OpcMenu]			/* values defaulted */
				  , 'NA'			as [OpcOther]			/* values defaulted */
				  , 1				as [OpcWeight]			/* values defaulted */
				  , Meta_RowLastChangedDate
				  , [Meta_SourceSystemName]
				  , ProcessReady
				  , Null			as [OpcMenuNotNA]		/* values defaulted */

			 FROM ETL_Staging.wrk.MDS_StandardData_ServicePricingOpcode_Staging
		) as src
		ON tgt.OpcCoraAcctId = src.OpcCoraAcctId
			and tgt.OpcOpCode = src.OpcOpCode	/* nulls are ignored and will be deleted since they must have a OpCode */

	--	update existing records do nothing. Only add new records. Another process will handle the values.
	/*	WHEN MATCHED AND src.ProcessReady = 1	*/


	--	insert new records
	WHEN NOT MATCHED BY TARGET AND src.ProcessReady = 1
		THEN
			INSERT
				(
					OpcCoraAcctId
				  , OpcOpCode
				  , [OpcOpCodeCategory]
				  , [OpcMenu]
				  , [OpcOther]
				  , [OpcWeight]
				  , [Meta_RowLastChangedDate]
				  , [User_ID]
				  , [OpcMenuNotNA]
				)
			VALUES
				(
					src.OpcCoraAcctId
				  , src.OpcOpCode
				  , src.OpcOpCodeCategory	/* values defaulted */
				  , src.OpcMenu				/* values defaulted */
				  , src.OpcOther			/* values defaulted */
				  , src.OpcWeight			/* values defaulted */
				  , src.Meta_RowLastChangedDate
				  , src.Meta_SourceSystemName
				  , src.OpcMenuNotNA		/* values defaulted */
				)


	--	Will not remove records from transact table.
		/*	WHEN NOT MATCHED BY SOURCE AND src.ProcessReady = 1 AND tgt.Meta_ComputerName = 'MDM - ServicePricing'
		THEN
			-- do nothing
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
