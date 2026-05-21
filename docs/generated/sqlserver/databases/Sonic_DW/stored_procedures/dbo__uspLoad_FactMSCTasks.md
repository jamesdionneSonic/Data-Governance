---
name: uspLoad_FactMSCTasks
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

CREATE     PROCEDURE [dbo].[uspLoad_FactMSCTasks]

AS

BEGIN

UPDATE FMSCT SET
FMSCT.ManualCall = Stage.ManualCall,
FMSCT.ManualCallCompleted = Stage.ManualCallCompleted,
FMSCT.ScheduledCall = Stage.ScheduledCall,
FMSCT.ScheduledCallCompleted = Stage.ScheduledCallCompleted,
FMSCT.CallsChanged = Stage.CallsChanged,
FMSCT.ManualEmail = Stage.ManualEmail,
FMSCT.ManualEmailCompleted = Stage.ManualEmailCompleted,
FMSCT.ScheduledEmail = Stage.ScheduledEmail,
FMSCT.ScheduledEmailCompleted = Stage.ScheduledEmailCompleted,
FMSCT.EmailsChanged = Stage.EmailsChanged,
FMSCT.ManualText = Stage.ManualText,
FMSCT.ManualTextCompleted = Stage.ManualTextCompleted,
FMSCT.ScheduledText = Stage.ScheduledText,
FMSCT.TextsChanged = Stage.TextsChanged,
FMSCT.ScheduledTextCompleted = Stage.ScheduledTextCompleted,
FMSCT.ManualTask = Stage.ManualTask,
FMSCT.ManualTaskCompleted = Stage.ManualTaskCompleted,
FMSCT.ScheduledTask = Stage.ScheduledTask,
FMSCT.ScheduledTaskCompleted = Stage.ScheduledTaskCompleted,
FMSCT.TasksChanged = Stage.TasksChanged,
FMSCT.ETLExecution_ID = Stage.ETLExecution_ID,
FMSCT.Meta_ComputerName = Stage.Meta_ComputerName,
FMSCT.Meta_UserID = Stage.Meta_UserID,
FMSCT.Meta_RowLastChangeDate = GETDATE() AT TIME ZONE 'Eastern Standard Time'
FROM dbo.FactMSCTasks as FMSCT
INNER JOIN (
select ISNULL(DE.EntityKey,-1) as EntityKey
, DD.DateKey
, Stg.ManualCall
, Stg.ManualCallCompleted
, Stg.WorkflowCall as ScheduledCall
, Stg.WorkflowCallCompleted as ScheduledCallCompleted
, Stg.CallsChanged
, Stg.ManualEmail
, Stg.ManualEmailCompleted
, Stg.WorkflowEmail as ScheduledEmail
, Stg.WorkflowEmailCompleted as ScheduledEmailCompleted
, Stg.EmailsChanged
, Stg.ManualText
, Stg.ManualTextCompleted
, Stg.WorkflowText as ScheduledText
, Stg.TextsChanged
, Stg.WorkflowTextCompleted as ScheduledTextCompleted
, Stg.ManualTask
, Stg.ManualTaskCompleted
, Stg.WorkflowTask as ScheduledTask
, Stg.WorkflowTaskCompleted as ScheduledTaskCompleted
, Stg.TasksChanged
, Stg.Meta_ComputerName
, Stg.UserID as Meta_UserID
, getdate() AT TIME ZONE 'Eastern Standard Time' as Meta_LoadDate
, Stg.ETLExecution_ID
from ETL_Staging.stage.Sonic_MSC_Tasks as Stg with (nolock)
left join dbo.Dim_Entity as DE with (nolock)
on Stg.lChildCompanyID = COALESCE(de.enteleadnewid, de.enteleadid)
left join dbo.Dim_Date as DD with (nolock)
on Stg.MSCDate = DD.FullDate
) as Stage
ON FMSCT.EntityKey = STAGE.EntityKey
AND FMSCT.DateKey = STAGE.DateKey
WHERE (FMSCT.ManualCall <> Stage.ManualCall) OR
(FMSCT.ManualCallCompleted <> Stage.ManualCallCompleted) OR
(FMSCT.ScheduledCall <> Stage.ScheduledCall) OR
(FMSCT.ScheduledCallCompleted <> Stage.ScheduledCallCompleted) OR
(FMSCT.CallsChanged <> Stage.CallsChanged) OR
(FMSCT.ManualEmail <> Stage.ManualEmail) OR
(FMSCT.ManualEmailCompleted <> Stage.ManualEmailCompleted) OR
(FMSCT.ScheduledEmail <> Stage.ScheduledEmail) OR
(FMSCT.ScheduledEmailCompleted <> Stage.ScheduledEmailCompleted) OR
(FMSCT.EmailsChanged <> Stage.EmailsChanged) OR
(FMSCT.ManualText <> Stage.ManualText) OR
(FMSCT.ManualTextCompleted <> Stage.ManualTextCompleted) OR
(FMSCT.ScheduledText <> Stage.ScheduledText) OR
(FMSCT.TextsChanged <> Stage.TextsChanged) OR
(FMSCT.ScheduledTextCompleted <> Stage.ScheduledTextCompleted) OR
(FMSCT.ManualTask <> Stage.ManualTask) OR
(FMSCT.ManualTaskCompleted <> Stage.ManualTaskCompleted) OR
(FMSCT.ScheduledTask <> Stage.ScheduledTask) OR
(FMSCT.ScheduledTaskCompleted <> Stage.ScheduledTaskCompleted) OR
(FMSCT.TasksChanged <> Stage.TasksChanged) ;


INSERT INTO dbo.FactMSCTasks (
EntityKey ,
DateKey,
ManualCall ,
ManualCallCompleted ,
ScheduledCall ,
ScheduledCallCompleted ,
CallsChanged ,
ManualEmail ,
ManualEmailCompleted ,
ScheduledEmail ,
ScheduledEmailCompleted ,
EmailsChanged ,
ManualText ,
ManualTextCompleted ,
ScheduledText ,
TextsChanged ,
ScheduledTextCompleted ,
ManualTask ,
ManualTaskCompleted ,
ScheduledTask ,
ScheduledTaskCompleted ,
TasksChanged ,
Meta_LoadDate ,
ETLExecution_ID ,
Meta_ComputerName ,
Meta_UserID ,
Meta_RowLastChangeDate
)
select ISNULL(DE.EntityKey,-1) as EntityKey
, DD.DateKey
, Stg.ManualCall
, Stg.ManualCallCompleted
, Stg.WorkflowCall as ScheduledCall
, Stg.WorkflowCallCompleted as ScheduledCallCompleted
, Stg.CallsChanged
, Stg.ManualEmail
, Stg.ManualEmailCompleted
, Stg.WorkflowEmail as ScheduledEmail
, Stg.WorkflowEmailCompleted as ScheduledEmailCompleted
, Stg.EmailsChanged
, Stg.ManualText
, Stg.ManualTextCompleted
, Stg.WorkflowText as ScheduledText
, Stg.TextsChanged
, Stg.WorkflowTextCompleted as ScheduledTextCompleted
, Stg.ManualTask
, Stg.ManualTaskCompleted
, Stg.WorkflowTask as ScheduledTask
, Stg.WorkflowTaskCompleted as ScheduledTaskCompleted
, Stg.TasksChanged
, getdate() AT TIME ZONE 'Eastern Standard Time' as Meta_LoadDate
, Stg.ETLExecution_ID
, Stg.Meta_ComputerName
, Stg.UserID as Meta_UserID
, getdate() AT TIME ZONE 'Eastern Standard Time'
from ETL_Staging.stage.Sonic_MSC_Tasks as Stg with (nolock)
join (select	distinct
			  isnull(e.enteleadnewid, e.enteleadid) as eleadid
			, e.EntityKey
			, e.EntDealerLvl1
		from	sonic_dw.dbo.dim_entity e with (nolock)
		--JOIN [ETL_Staging].[dbo].[TrafficSummaryEleadStoreList] s
		--	ON isnull(e.enteleadnewid, e.enteleadid) = isnull(s.lchildid, s.lparentid)
		where	e.entactive = 'Active'
				and e.ententitytype = 'Dealership'
				--and e.entdefaultdlrshplvl1 = 1
				and e.EntEleadDefault = 1
				and isnull(e.enteleadnewid, e.enteleadid) is not null
		) as DE
on Stg.lChildCompanyID = de.eleadid --COALESCE(de.enteleadnewid, de.enteleadid)
left join dbo.Dim_Date as DD with (nolock)
on Stg.MSCDate = DD.FullDate
WHERE NOT EXISTS (
SELECT 1
FROM dbo.FactMSCTasks as FCT
WHERE FCT.EntityKey = DE.EntityKey
AND FCT.DateKey = DD.DateKey
) ;

END
```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
