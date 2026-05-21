---
name: usp_Load_Fact_Activity
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






/************************************************************
--
-- Created By ubs on 3/29/2016
-- Query to create FactActivity load data set
---- 3/28/16 ubs - first draft
---- 1/30/17 ubs - remove activities that are not linked to a deal
---- 11/7/17 ubs - removed "opp.ETLExecutionID = @ETLExecutionID" filter from MERGE
---- 12/5/17 ubs - added code to identify and save activities whose activity type has changed.
---- 02/01/2023 DMD - Removed soft deletes due to source change from ETL_Staging to eLeadDW.  Soft delete is now performed in SSIS package
---- 07/14/2023 DMD - Added query with row_number for opp to get rid of dupes
*************************************************************/
CREATE procedure [dbo].[usp_Load_Fact_Activity]
		@ETLExecutionID int,
		@SourceSystemName varchar(20)
AS

SET NOCOUNT ON;

BEGIN

-- remove from transform the activity records which are not linked to a deal
delete fac
from ETL_Staging.clean.FactActivity fac left outer join dbo.FactOpportunity opp
	on fac.[Opportunity_NaturalKey] = case when opp.meta_NaturalKey like '%*%' then substring(opp.meta_NaturalKey,1,charindex('*',opp.meta_NaturalKey)-1) else opp.meta_NaturalKey end
where opp.meta_SourceSystemName = @SourceSystemName
	and opp.meta_NaturalKey is NULL
-----------------------------------------------------------------------------------------------
-- find duplicate activities related to duplicate deal IDs.
 ------------select metaNaturalKey, count(*) as cnt
 ------------into #dup
 ------------from etl_staging.clean.factActivity
 ------------where etlexecutionid = @ETLExecutionID
 ------------group by metaNaturalKey
 ------------having count(*) > 1

 -------------- delete the duplicates
 ------------delete etl_staging.clean.factActivity
 ------------where metaNaturalKey in (select metaNaturalKey from #dup)

 ------------drop table #dup
 ----------------------------------------------------------------------------------
 -----------------------------update 02/28/2018 RAJ/LANA----------------------
 ---ADDED ActivityType ON 20-SEP-24
;WITH CTE AS
(
SELECT
MetaNaturalKey,ActivityType,
ROW_NUMBER() OVER (PARTITION BY MetaNaturalKey,ActivityType ORDER BY MetaNaturalKey ) AS RN
FROM ETL_Staging.clean.factActivity
WHERE ETLExecutionID = @ETLExecutionID
)
DELETE from CTE WHERE RN<>1
-----------------------------update 02/28/2018 RAJ/LANA----------------------


 -- collect activities whose activity type has changed

select act.MetaNaturalKey as lTaskID,
	ntp.ActivityType as NewActivityType,
	ntp.ActivityTypeKey as NewActivityTypeKey,
	opp.meta_naturalkey,
	opp.factActivityKey,
	atp.ActivityType as CurrentActivityType,
	opp.ActivityTypeKey as CurrentActivityTypeKey
into #activities
from etl_staging.clean.FactActivity act (nolock) inner join   dbo.factActivity opp (nolock)
		on act.MetaNaturalKey = opp.meta_naturalKey
		and act.ActivityType = opp.ActivityTypeKey---ADDED ON 20-SEP-24
										left outer join sonic_dw.dbo.DimActivityType atp
		on atp.ActivityTypeKey = opp.ActivityTypeKey
										left outer join sonic_dw.dbo.DimActivityType ntp
		on ntp.ActivityTypeKey = act.activityType
where 1=1
	and ntp.activityTypeKey <> atp.ActivityTypeKey


;with factopp
as
(
	SELECT *
	FROM
	(
		SELECT ROW_NUMBER() OVER (PARTITION BY MetaNaturalKey,ActivityType ORDER BY ModifiedOnDateKey DESC, OpportunityCreatedOnDateKey DESC, Opportunity_NaturalKey) AS RN, *
		FROM ETL_Staging.clean.FactActivity (nolock)
	--WHERE MetaNaturalKey = '3805617471'
	)  a
	WHERE RN = 1
)
MERGE dbo.FactActivity AS fac
	USING factopp opp
	ON fac.meta_NaturalKey = opp.metaNaturalKey
	AND fac.ActivityTypeKey = opp.ActivityType---ADDED ON 20-SEP-24
		AND fac.Meta_SourceSystemName = 'eleadDW'
	WHEN MATCHED
		THEN UPDATE
			SET	fac.EntityKey = opp.EntityKey
				,fac.LeadStatusKey = opp.LeadStatusKey
				,fac.CreatedOnDateKey = opp.CreatedOnDateKey
				,fac.CreatedOnTimeKey = opp.CreatedOnTimeKey
				,fac.SourceKey = opp.SourceKey
				,fac.OpportunityCreatedOnDateKey = opp.OpportunityCreatedOnDateKey
				,fac.CreatedByKey = opp.CreatedByKey
				,fac.ActivityTypeKey = opp.ActivityType
				,fac.WorkflowKey = opp.WorkflowKey
				,fac.ActivityStatusKey = opp.ActivityStatusKey
				,fac.OpportunityNaturalKey = opp.Opportunity_NaturalKey
				,fac.ScheduledStartTimeKey = opp.ScheduledStartTimeKey
				,fac.ScheduledEndTimeKey = opp.ScheduledEndTimeKey
				,fac.ActualStartTimeKey = opp.ActualStartTime
				,fac.ActualEndTimeKey = opp.ActualEndTimeKey
				,fac.ActualEndDateKey = opp.ActualEndDateKey
				,fac.ModifiedOnDateKey = opp.ModifiedOnDateKey
				,fac.NextActivityDateDueKey = opp.NextActivityDateDueKey
				,fac.ScheduledStartDateKey = opp.ScheduledStartDateKey
				,fac.ActualStartDateKey = opp.ActualStartDateKey
				,fac.ScheduledEndDateKey = opp.ScheduledEndDateKey
				,fac.ScheduledByKey = opp.ScheduledByKey
				,fac.ConfirmedByKey = opp.ConfirmedByKey
				,fac.CompletedByKey = opp.ComletedByKey
				,fac.ModifiedByKey = opp.ModifiedByKkey
				,fac.ModifiedOnBehalfByKey = opp.ModifiedOnBehalfByKey
				,fac.CreatedOnBehalfBykey = opp.CreatedOnBehalfBykey
				,fac.VehicleKey = opp.VehicleKey
				,fac.ActivityCount = opp.ActivityCount
				,fac.ActualDurationMinutes = opp.ActualDurationMinutes
				,fac.AccessoriesPresentedFlag = opp.AccessoriesPresentedFlag
				,fac.ActivityIsPartOfProcessFlag = opp.ActivityIsPartOfProcessFlag
				,fac.AppointmentMadeFlag = opp.AppointmentMadeFlag
				,fac.AppraisalCompletedFlag = opp.AppraisalCompletedFlag
				,fac.ActivityAttemptedFlag = opp.ActivityAttemptedFlag
				,fac.ActivityAutoClosedFlag = opp.ActivityAutoClosedFlag
				,fac.BypassFollowupFlag = opp.BypassFollowupFlag
				,fac.CallCenterFlag = opp.CallCenterFlag
				,fac.ConfirmationSentFlag = opp.ConfirmationSentFlag
				,fac.ConfirmedFlag = opp.ConfirmedFlag
				,fac.ContactSinceFlag = opp.ContactSinceFlag
				,fac.CreateNextActivityFlag = opp.CreateNextActivityFlag
				,fac.DemoFlag = opp.DemoFlag
				,fac.ESalesFlag = opp.ESalesFlag
				,fac.IsAutomatedFlag = opp.IsAutomatedFlag
				,fac.LifestyleProductsPresentedFlag = opp.LifestyleProductsPresentedFlag
				,fac.MetManagerFlag = opp.MetManagerFlag
				,fac.SIMSReserveVehicleFlag = opp.SIMSReserveVehicleFlag
				,fac.StopWorkflowFlag = opp.StopWorkflowFlag
				,fac.WriteUpFlag = opp.WriteUpFlag
				,fac.Meta_ComputerName = opp.MetaComputerName
				,fac.Meta_AuditScore = opp.MetaAuditScore
				,fac.Meta_SrcSysID = opp.MetaSrcSysID
				,fac.Meta_SourceSystemName = opp.MetaSourceSystemName
				,fac.Meta_RowIsCurrent = opp.MetaRowIsCurrent
				,fac.Meta_RowLastChangedDate = opp.MetaRowLastChangedDate
				,fac.ETLExecution_ID = opp.ETLExecutionID
				,fac.[OwnedByKey] = opp.[OwnedByKey]
				,fac.AppointmentSoldFlag = opp.AppointmentSoldFlag ------ADDED BY SUNILR ON 29OCT24
				,fac.szMake = opp.szMake
				,fac.szModel = opp.szModel
	WHEN NOT MATCHED
		THEN INSERT(EntityKey
					,LeadStatusKey
					,CreatedOnDateKey
					,CreatedOnTimeKey
					,SourceKey
					,OpportunityCreatedOnDateKey
					,CreatedByKey
					,ActivityTypeKey
					,WorkflowKey
					,ActivityStatusKey
					,OpportunityNaturalKey
					,ScheduledStartTimeKey
					,ScheduledEndTimeKey
					,ActualStartTimeKey
					,ActualEndTimeKey
					,ActualEndDateKey
					,ModifiedOnDateKey
					,NextActivityDateDueKey
					,ScheduledStartDateKey
					,ActualStartDateKey
					,ScheduledEndDateKey
					,ScheduledByKey
					,ConfirmedByKey
					,CompletedByKey
					,ModifiedByKey
					,ModifiedOnBehalfByKey
					,CreatedOnBehalfBykey
					,VehicleKey
					,ActivityCount
					,ActualDurationMinutes
					,AccessoriesPresentedFlag
					,ActivityIsPartOfProcessFlag
					,AppointmentMadeFlag
					,AppraisalCompletedFlag
					,ActivityAttemptedFlag
					,ActivityAutoClosedFlag
					,BypassFollowupFlag
					,CallCenterFlag
					,ConfirmationSentFlag
					,ConfirmedFlag
					,ContactSinceFlag
					,CreateNextActivityFlag
					,DemoFlag
					,ESalesFlag
					,IsAutomatedFlag
					,LifestyleProductsPresentedFlag
					,MetManagerFlag
					,SIMSReserveVehicleFlag
					,StopWorkflowFlag
					,WriteUpFlag
					,Meta_ComputerName
					,Meta_LoadDate
					,Meta_AuditScore
					,Meta_SrcSysID
					,Meta_SourceSystemName
					,Meta_RowEffectiveDate
					,Meta_RowIsCurrent
					,Meta_RowLastChangedDate
					,Meta_NaturalKey
					,Meta_Checksum
					,ETLExecution_ID
					,OwnedByKey
					,AppointmentSoldFlag  ------ADDED BY SUNILR ON 29OCT24
					,szMake
					,szModel
				)
				VALUES(opp.EntityKey
					,opp.LeadStatusKey
					,opp.CreatedOnDateKey
					,opp.CreatedOnTimeKey
					,opp.SourceKey
					,opp.OpportunityCreatedOnDateKey
					,opp.CreatedByKey
					,opp.ActivityType
					,opp.WorkflowKey
					,opp.ActivityStatusKey
					,opp.Opportunity_NaturalKey
					,opp.ScheduledStartTimeKey
					,opp.ScheduledEndTimeKey
					,opp.ActualStartTime
					,opp.ActualEndTimeKey
					,opp.ActualEndDateKey
					,opp.ModifiedOnDateKey
					,opp.NextActivityDateDueKey
					,opp.ScheduledStartDateKey
					,opp.ActualStartDateKey
					,opp.ScheduledEndDateKey
					,opp.ScheduledByKey
					,opp.ConfirmedByKey
					,opp.ComletedByKey
					,opp.ModifiedByKkey
					,opp.ModifiedOnBehalfByKey
					,opp.CreatedOnBehalfBykey
					,opp.VehicleKey
					,opp.ActivityCount
					,opp.ActualDurationMinutes
					,opp.AccessoriesPresentedFlag
					,opp.ActivityIsPartOfProcessFlag
					,opp.AppointmentMadeFlag
					,opp.AppraisalCompletedFlag
					,opp.ActivityAttemptedFlag
					,opp.ActivityAutoClosedFlag
					,opp.BypassFollowupFlag
					,opp.CallCenterFlag
					,opp.ConfirmationSentFlag
					,opp.ConfirmedFlag
					,opp.ContactSinceFlag
					,opp.CreateNextActivityFlag
					,opp.DemoFlag
					,opp.ESalesFlag
					,opp.IsAutomatedFlag
					,opp.LifestyleProductsPresentedFlag
					,opp.MetManagerFlag
					,opp.SIMSReserveVehicleFlag
					,opp.StopWorkflowFlag
					,opp.WriteUpFlag
					,opp.MetaComputerName
					,opp.MetaLoadDate
					,opp.MetaAuditScore
					,opp.MetaSrcSysID
					,opp.MetaSourceSystemName
					,opp.MetaRowEffectiveDate
					,opp.MetaRowIsCurrent
					,opp.MetaRowLastChangedDate
					,opp.MetaNaturalKey
					,opp.MetaChecksum
					,opp.ETLExecutionID
					,opp.OwnedByKey
					,opp.AppointmentSoldFlag
					,opp.szMake
					,opp.szModel);

-- save data of activities whose activity type has changed
insert into [dbo].[FOCUS_Elead_ActivityTypeChange]
(
FactActivityKey,	EntityKey,	LeadStatusKey,	CreatedOnDateKey,	CreatedOnTimeKey,	SourceKey,	OpportunityNaturalKey,	OpportunityCreatedOnDateKey,	CreatedByKey,	ActivityTypeKey,
WorkflowKey,	ActivityStatusKey,	ScheduledStartTimeKey,	ScheduledEndTimeKey,	ActualStartTimeKey,	ActualEndDateKey,	ActualEndTimeKey,	ModifiedOnDateKey,	NextActivityDateDueKey,
ScheduledStartDateKey,	ActualStartDateKey,	ScheduledEndDateKey,	ScheduledByKey,	ConfirmedByKey,	CompletedByKey,	ModifiedByKey,	ModifiedOnBehalfByKey,	CreatedOnBehalfBykey,	VehicleKey,
ActivityCount,	ActualDurationMinutes,	AccessoriesPresentedFlag,	ActivityIsPartOfProcessFlag,	AppointmentMadeFlag,	AppraisalCompletedFlag,	ActivityAttemptedFlag,	ActivityAutoClosedFlag,
BypassFollowupFlag,	CallCenterFlag,	ConfirmationSentFlag,	ConfirmedFlag,	ContactSinceFlag,	CreateNextActivityFlag,	DemoFlag,	ESalesFlag,	IsAutomatedFlag,	LifestyleProductsPresentedFlag,
MetManagerFlag,	SIMSReserveVehicleFlag,	StopWorkflowFlag,	WriteUpFlag,	Meta_ComputerName,	Meta_LoadDate,	Meta_AuditScore,	Meta_SrcSysID,	Meta_SourceSystemName,	Meta_RowEffectiveDate,
Meta_RowExpiredDate,	Meta_RowIsCurrent,	Meta_RowLastChangedDate,	Meta_NaturalKey,	Meta_Checksum,	ETLExecution_ID,	ScribeDeletedOn,	FactOpportunityKey,	OldActivityTypeKey,
OwnedByKey,	AppointmentSoldFlag,	szMake,	szModel,	CurrentActivityTypeKey
)

select opp.FactActivityKey,	opp.EntityKey,	opp.LeadStatusKey,	opp.CreatedOnDateKey,	opp.CreatedOnTimeKey,	opp.SourceKey,	opp.OpportunityNaturalKey,	opp.OpportunityCreatedOnDateKey,
opp.CreatedByKey,	opp.ActivityTypeKey,	opp.WorkflowKey,	opp.ActivityStatusKey,	opp.ScheduledStartTimeKey,	opp.ScheduledEndTimeKey,	opp.ActualStartTimeKey,	opp.ActualEndDateKey,
opp.ActualEndTimeKey,	opp.ModifiedOnDateKey,	opp.NextActivityDateDueKey,	opp.ScheduledStartDateKey,	opp.ActualStartDateKey,	opp.ScheduledEndDateKey,	opp.ScheduledByKey,	opp.ConfirmedByKey,
opp.CompletedByKey,	opp.ModifiedByKey,	opp.ModifiedOnBehalfByKey,	opp.CreatedOnBehalfBykey,	opp.VehicleKey,	opp.ActivityCount,	opp.ActualDurationMinutes,	opp.AccessoriesPresentedFlag,
opp.ActivityIsPartOfProcessFlag,	opp.AppointmentMadeFlag,	opp.AppraisalCompletedFlag,	opp.ActivityAttemptedFlag,	opp.ActivityAutoClosedFlag,	opp.BypassFollowupFlag,	opp.CallCenterFlag,
opp.ConfirmationSentFlag,	opp.ConfirmedFlag,	opp.ContactSinceFlag,	opp.CreateNextActivityFlag,	opp.DemoFlag,	opp.ESalesFlag,	opp.IsAutomatedFlag,	opp.LifestyleProductsPresentedFlag,
opp.MetManagerFlag,	opp.SIMSReserveVehicleFlag,	opp.StopWorkflowFlag,	opp.WriteUpFlag,	opp.Meta_ComputerName,	opp.Meta_LoadDate,	opp.Meta_AuditScore,	opp.Meta_SrcSysID,
opp.Meta_SourceSystemName,	opp.Meta_RowEffectiveDate,	opp.Meta_RowExpiredDate,	opp.Meta_RowIsCurrent,	opp.Meta_RowLastChangedDate,	opp.Meta_NaturalKey,	opp.Meta_Checksum,
opp.ETLExecution_ID,	opp.ScribeDeletedOn,	opp.FactOpportunityKey,	opp.ActivityTypeKey,	opp.OwnedByKey,	opp.AppointmentSoldFlag,	opp.szMake,	opp.szModel,	act.CurrentActivityTypeKey
from #activities act inner join dbo.factActivity opp with (nolock)
		on act.factActivityKey = opp.factActivityKey

drop table #activities

-- soft delete records which have been marked to remove
--update act
--	set Meta_RowIsCurrent = 'N'
--from dbo.FactActivity act inner join [L1-DWASQL-02,12010].eLeadDW.dbo.dwFullActivity cl
--		on cast(act.Meta_NaturalKey as bigint) = cl.lTaskID
--			and act.Meta_SourceSystemName = @SourceSystemName
--			and cl.ETLExecution_ID = @ETLExecutionID
--			and cl.dwActive = 0

END




















```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
