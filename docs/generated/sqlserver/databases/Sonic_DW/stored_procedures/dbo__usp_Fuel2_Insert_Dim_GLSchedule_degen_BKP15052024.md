---
name: usp_Fuel2_Insert_Dim_GLSchedule_degen_BKP15052024
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
 Update --- Raj 04/25/2019 ---

 Author:   NCarpender
 Create date: 20150331
-- Description: This code creates the insert to add values into the
--     dim_GLSchedule_degen table for new records.
--*************************************************************************/
CREATE PROCEDURE [dbo].[usp_Fuel2_Insert_Dim_GLSchedule_degen_BKP15052024]
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

    -- MERGE dim_GLSchedule_degen AS T
   MERGE dbo.dim_GLSchedule_degen AS T  /* added the schema to the table name. */
   USING (select * from ETL_Staging.wrk.GLSchedule_Step_5A
   where hostitemid not in (
'132*80*FIEC0424*20575*41781483*223'
,'132*10*RX003299*20572*69374600*51'
,'132*10*RX003299*20572*69392831*2'
,'132*10*RX003299*20572*69374600*36'
,'132*80*FIEC0424*20575*51904043*223'
,'132*56*212488*20574*52802035*2'
,'132*80*FIEC0424*20575*49038023*223'
,'132*10*RX003299*20572*69374600*52'
,'132*10*RX003299*20572*69392831*1'
)
)
    AS S
    ON (
      T.hostitemid = S.hostitemid
       --and T.controlcase = S.schedControlCase /* modified to account for nulls*/
      and isnull(T.controlcase,'') = isnull(S.schedControlCase,'')
      and s.[cora_acct_id] = t.[cora_acct_id]
      -----AND s.schedulenumber = t.ScheduleNumber --- added 07/011/2021 raj/Adam
     )

------------Below code is added Raj 04/08/2019 ---
   WHEN MATCHED AND

      [t].[ControlDesc] <> [s].[ControlDesc]
   THEN
   UPDATE SET
      [t].[ControlDesc]     =   [s].[ControlDesc]
     ,[t].[Meta_RowLastDMLAction]  = 'U'
     ,[t].[ETLExecution_ID]    = [s].[ETLExecution_ID]
     ,[t].[Meta_RowLastChangedDate]  = GETDATE()
     ,[t].[Meta_ComputerName]   = [s].[Meta_ComputerName]
     ,[t].[User_ID]      = [s].[User_ID]

------------above code is added Raj 04/08/2019 ---

   WHEN NOT MATCHED BY TARGET THEN
    INSERT (
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
       , ETLExecution_ID  /* added field 20150331 */
       , User_ID    /* added field 20150331 */
       , Meta_LoadDate   /* added field 20150331 */
       , Meta_ComputerName  /* added field 20150331 */
       , Meta_SourceSystemName /* added field 20150331 */

      )
    VALUES (
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
       , S.ETLExecution_ID   /* added field 20150331 */
       , S.User_ID     /* added field 20150331 */
       , S.Meta_LoadDate   /* added field 20150331 */
       , S.Meta_ComputerName  /* added field 20150331 */
       , S.Meta_SourceSystemName /* added field 20150331 */
      )

    OUTPUT 1, $action INTO @SummaryOfChanges;

  ------------------------------------------------------------------------------------------
  -- Return resutls of the merge to show actions taken
  ------------------------------------------------------------------------------------------

   set @InsertedRows = (select sum(ChangeOccured) as cnt from @SummaryOfChanges where Change = 'INSERT')

END






```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
