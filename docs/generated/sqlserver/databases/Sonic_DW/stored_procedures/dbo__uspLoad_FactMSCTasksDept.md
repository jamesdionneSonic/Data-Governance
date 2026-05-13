---
name: uspLoad_FactMSCTasksDept
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


CREATE       PROCEDURE [dbo].[uspLoad_FactMSCTasksDept]

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
FMSCT.ScheduledTextCompleted = Stage.ScheduledTextCompleted,
FMSCT.TextsChanged = Stage.TextsChanged,
FMSCT.ManualTask = Stage.ManualTask,
FMSCT.ManualTaskCompleted = Stage.ManualTaskCompleted,
FMSCT.ScheduledTask = Stage.ScheduledTask,
FMSCT.ScheduledTaskCompleted = Stage.ScheduledTaskCompleted,
FMSCT.TasksChanged = Stage.TasksChanged,
FMSCT.ETLExecution_ID = Stage.ETLExecution_ID,
FMSCT.Meta_ComputerName = Stage.Meta_ComputerName,
FMSCT.Meta_UserID = Stage.Meta_UserID,
FMSCT.Meta_RowLastChangeDate = GETDATE() AT TIME ZONE 'Eastern Standard Time'
FROM dbo.FactMSCTasksDept AS FMSCT
INNER JOIN (
	SELECT ISNULL(DE.EntityKey,-1) AS EntityKey
		, DD.DateKey
		, ISNULL(du.DimUserCDKID, -1) AS DimUserCDKID
		--, ISNULL(dudm.DimUserDepartmentMapCDKID, -1) AS DimUserDepartmentMapCDKID
		--, ISNULL(ddep.DimDepartmentCDKID, -1) AS DimDepartmentCDKID
		, Stg.ManualCall
		, Stg.ManualCallCompleted
		, Stg.WorkflowCall AS ScheduledCall
		, Stg.WorkflowCallCompleted AS ScheduledCallCompleted
		, Stg.CallsChanged
		, Stg.ManualEmail
		, Stg.ManualEmailCompleted
		, Stg.WorkflowEmail AS ScheduledEmail
		, Stg.WorkflowEmailCompleted AS ScheduledEmailCompleted
		, Stg.EmailsChanged
		, Stg.ManualText
		, Stg.ManualTextCompleted
		, Stg.WorkflowText AS ScheduledText
		, Stg.WorkflowTextCompleted AS ScheduledTextCompleted
		, Stg.TextsChanged
		, Stg.ManualTask
		, Stg.ManualTaskCompleted
		, Stg.WorkflowTask AS ScheduledTask
		, Stg.WorkflowTaskCompleted AS ScheduledTaskCompleted
		, Stg.TasksChanged
		, Stg.Meta_ComputerName
		, Stg.UserID AS Meta_UserID
		, GETDATE() AT TIME ZONE 'Eastern Standard Time' AS Meta_LoadDate
		, Stg.ETLExecution_ID
	FROM ETL_Staging.stage.Sonic_MSC_Tasks_Department AS Stg WITH (NOLOCK)
	LEFT JOIN (
            SELECT DISTINCT
                ISNULL(enteleadnewid, enteleadid) AS eleadid,
                EntityKey
            FROM sonic_dw.dbo.dim_entity
            WHERE entactive = 'Active'
              AND ententitytype = 'Dealership'
              AND EntEleadDefault = 1
              AND ISNULL(enteleadnewid, enteleadid) IS NOT NULL
        ) de
            ON stg.lChildCompanyID = de.eleadid
	LEFT JOIN dbo.Dim_Date AS DD WITH (NOLOCK)
		ON Stg.MSCDate = DD.FullDate
	LEFT JOIN Sonic_DW.dbo.DimUserCDK du
		ON stg.lUserID = du.CDKUserID
		--AND stg.lChildCompanyID = du.CDKCompanyID
	--LEFT JOIN Sonic_DW.dbo.DimDepartmentCDK ddep
	--	ON stg.Department = ddep.Department
	--LEFT JOIN Sonic_DW.dbo.DimUserDepartmentMapCDK dudm
	--	ON stg.lUserID = dudm.CDKUserID
	--		AND DE.EntityKey = dudm.EntityKey
	--		AND stg.Department = dudm.Department
) AS Stage
ON FMSCT.EntityKey = STAGE.EntityKey
AND FMSCT.DateKey = STAGE.DateKey
--AND FMSCT.DimUserDepartmentMapCDKID = STAGE.DimUserDepartmentMapCDKID
--AND FMSCT.DimDepartmentCDKID = STAGE.DimDepartmentCDKID
AND FMSCT.DimUserCDKID = STAGE.DimUserCDKID

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
(FMSCT.ScheduledTextCompleted <> Stage.ScheduledTextCompleted) OR
(FMSCT.TextsChanged <> Stage.TextsChanged) OR
(FMSCT.ManualTask <> Stage.ManualTask) OR
(FMSCT.ManualTaskCompleted <> Stage.ManualTaskCompleted) OR
(FMSCT.ScheduledTask <> Stage.ScheduledTask) OR
(FMSCT.ScheduledTaskCompleted <> Stage.ScheduledTaskCompleted) OR
(FMSCT.TasksChanged <> Stage.TasksChanged) ;


INSERT INTO dbo.FactMSCTasksDept (
	EntityKey ,
	DateKey,
	DimUserCDKID,
	--DimUserDepartmentMapCDKID,
	--DimDepartmentCDKID,
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
	ScheduledTextCompleted ,
	TextsChanged ,
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
SELECT ISNULL(DE.EntityKey,-1) AS EntityKey
	, DD.DateKey
	, ISNULL(du.DimUserCDKID, -1) AS DimUserCDKID
	--, ISNULL(dudm.DimUserDepartmentMapCDKID, -1) AS DimUserDepartmentMapCDKID
	--, ISNULL(ddep.DimDepartmentCDKID, -1) AS DimDepartmentCDKID
	, Stg.ManualCall
	, Stg.ManualCallCompleted
	, Stg.WorkflowCall AS ScheduledCall
	, Stg.WorkflowCallCompleted AS ScheduledCallCompleted
	, Stg.CallsChanged
	, Stg.ManualEmail
	, Stg.ManualEmailCompleted
	, Stg.WorkflowEmail AS ScheduledEmail
	, Stg.WorkflowEmailCompleted AS ScheduledEmailCompleted
	, Stg.EmailsChanged
	, Stg.ManualText
	, Stg.ManualTextCompleted
	, Stg.WorkflowText AS ScheduledText
	, Stg.WorkflowTextCompleted AS ScheduledTextCompleted
	, Stg.TextsChanged
	, Stg.ManualTask
	, Stg.ManualTaskCompleted
	, Stg.WorkflowTask AS ScheduledTask
	, Stg.WorkflowTaskCompleted AS ScheduledTaskCompleted
	, Stg.TasksChanged
	, GETDATE() AT TIME ZONE 'Eastern Standard Time' AS Meta_LoadDate
	, Stg.ETLExecution_ID
	, Stg.Meta_ComputerName
	, Stg.UserID AS Meta_UserID
	, GETDATE() AT TIME ZONE 'Eastern Standard Time' AS Meta_RowLastChangeDate
FROM ETL_Staging.stage.Sonic_MSC_Tasks_Department AS Stg WITH (NOLOCK)
JOIN (SELECT	DISTINCT
			  ISNULL(e.enteleadnewid, e.enteleadid) AS eleadid
			, e.EntityKey
			, e.EntDealerLvl1
		FROM	sonic_dw.dbo.dim_entity e WITH (NOLOCK)
		--JOIN [ETL_Staging].[dbo].[TrafficSummaryEleadStoreList] s
		--	ON isnull(e.enteleadnewid, e.enteleadid) = isnull(s.lchildid, s.lparentid)
		WHERE	e.entactive = 'Active'
				AND e.ententitytype = 'Dealership'
				--and e.entdefaultdlrshplvl1 = 1
				AND e.EntEleadDefault = 1
				AND ISNULL(e.enteleadnewid, e.enteleadid) IS NOT NULL
		) AS DE
	ON Stg.lChildCompanyID = de.eleadid --COALESCE(de.enteleadnewid, de.enteleadid)
LEFT JOIN dbo.Dim_Date AS DD WITH (NOLOCK)
	ON Stg.MSCDate = DD.FullDate
LEFT JOIN Sonic_DW.dbo.DimUserCDK du
	ON stg.lUserID = du.CDKUserID
	--AND stg.lChildCompanyID = du.CDKCompanyID
--LEFT JOIN Sonic_DW.dbo.DimDepartmentCDK ddep
--	ON stg.Department = ddep.Department
--LEFT JOIN Sonic_DW.dbo.DimUserDepartmentMapCDK dudm
--	ON stg.lUserID = dudm.CDKUserID
--		AND DE.EntityKey = dudm.EntityKey
--		AND stg.Department = dudm.Department
WHERE NOT EXISTS (
	SELECT 1
	FROM dbo.FactMSCTasksDept AS FCT
	WHERE FCT.EntityKey = DE.EntityKey
		AND FCT.DateKey = DD.DateKey
		--AND FMSCT.DimUserDepartmentMapCDKID = dudm.DimUserDepartmentMapCDKID
		--AND FMSCT.DimDepartmentCDKID = ddep.DimDepartmentCDKID
		AND FCT.DimUserCDKID = du.DimUserCDKID
) ;

END

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
