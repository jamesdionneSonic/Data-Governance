---
name: usp_Fuel2_Insert_Dim_GLSchedule_degen_BK_03152017
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
/* ************************************************************************
	Author:			NCarpender
	Create date:	20150331
	Description:	This code creates the insert to add values into the
					dim_GLSchedule_degen table for new records.
*************************************************************************/
CREATE PROCEDURE usp_Fuel2_Insert_Dim_GLSchedule_degen
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

				--	MERGE dim_GLSchedule_degen AS T
			MERGE dbo.dim_GLSchedule_degen AS T		/*	added the schema to the table name.	*/
			USING ETL_Staging.wrk.GLSchedule_Step_5 AS S
				ON (
						T.hostitemid = S.hostitemid
							--and T.controlcase = S.schedControlCase /* modified to account for nulls*/
						and isnull(T.controlcase,'') = isnull(S.schedControlCase,'')

					)
			WHEN NOT MATCHED BY TARGET THEN
				INSERT	(
							  HostItemID
							, Control
							, ControlDesc
							, refer
							, schedulenumber
							, docdescription
							, detaildescription
							, hostitemidshort
							, controlcase
							, ETLExecution_ID		/*	added field 20150331	*/
							, User_ID				/*	added field 20150331	*/
							, Meta_LoadDate			/*	added field 20150331	*/
							, Meta_ComputerName		/*	added field 20150331	*/
							, Meta_SourceSystemName	/*	added field 20150331	*/

						)
				VALUES	(
							  S.HostItemID
							, S.Control
							, ISNULL(S.ControlDesc,'Unknown')
							, S.refer,S.schedulenumber
							, S.docdescription
							, S.detaildescription
							, S.hostitemidshort
							, S.SchedControlCase
							, S.ETLExecution_ID			/*	added field 20150331	*/
							, S.User_ID					/*	added field 20150331	*/
							, S.Meta_LoadDate			/*	added field 20150331	*/
							, S.Meta_ComputerName		/*	added field 20150331	*/
							, S.Meta_SourceSystemName	/*	added field 20150331	*/
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
