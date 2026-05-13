---
name: usp_Fuel2_Insert_Dim_GLSchedule_degen_test
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
CREATE PROCEDURE [dbo].[usp_Fuel2_Insert_Dim_GLSchedule_degen_test]
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
			MERGE dbo.dim_GLSchedule_degen_test AS T		/*	added the schema to the table name.	*/
			USING ETL_Staging.wrk.GLSchedule_Step_5A AS S
				ON (
						T.hostitemid = S.hostitemid
							--and T.controlcase = S.schedControlCase /* modified to account for nulls*/
						and isnull(T.controlcase,'') = isnull(S.schedControlCase,'')
						and s.[cora_acct_id] = t.[cora_acct_id]
					---	and s.currentmonth = 2019-04-01
					)

------------Below code is added Raj 04/08/2019 ---
			WHEN MATCHED AND

					 [t].[ControlDesc] <> [s].[ControlDesc]
			THEN
			UPDATE SET
					 [t].[ControlDesc]					=   [s].[ControlDesc]
					,[t].[Meta_RowLastDMLAction]		=	'U'
					,[t].[ETLExecution_ID]				=	[s].[ETLExecution_ID]
					,[t].[Meta_RowLastChangedDate]		=	GETDATE()
					,[t].[Meta_ComputerName]			=	[s].[Meta_ComputerName]
					,[t].[User_ID]						=	[s].[User_ID]

------------above code is added Raj 04/08/2019 ---

			WHEN NOT MATCHED BY TARGET THEN
				INSERT	(
							  cora_acct_id
							, HostItemID
							, Control
							, ControlDesc
							, control2
							, refer
							, schedulenumber
							, docdescription
							, detaildescription
							, hostitemidshort
							, controlcase
							, [source]
							, ETLExecution_ID		/*	added field 20150331	*/
							, User_ID				/*	added field 20150331	*/
							, Meta_LoadDate			/*	added field 20150331	*/
							, Meta_ComputerName		/*	added field 20150331	*/
							, Meta_SourceSystemName	/*	added field 20150331	*/

						)
				VALUES	(
							  s.cora_acct_id
							, S.HostItemID
							, S.SchedControl  --- changed from Control to SchedControl Raj/Lindsay 12/09/2016
							, ISNULL(S.ControlDesc,'Unknown')
							, ISNULL(s.control2,'Unknown')
							, S.refer,S.schedulenumber
							, S.docdescription
							, S.detaildescription
							, S.hostitemidshort
							, S.SchedControlCase
							,[source]
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
