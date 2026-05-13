---
name: uspScoresFactActivityLoad_testing
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - FactActivity
dependency_count: 1
parameter_count: 8
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.FactActivity** (U )

## Parameters

| Name                    | Type      | Output | Default |
| ----------------------- | --------- | ------ | ------- |
| `@MetaComputerName`     | varchar   | No     | No      |
| `@MetaSrcSysID`         | int       | No     | No      |
| `@MetaUserID`           | varchar   | No     | No      |
| `@MetaLoadDate`         | datetime2 | No     | No      |
| `@MetaSourceSystemName` | varchar   | No     | No      |
| `@ETLExecution_ID`      | int       | No     | No      |
| `@insertedRowCnts`      | int       | Yes    | No      |
| `@updatedRowCnts`       | int       | Yes    | No      |

## Definition

```sql





--declare @insertedRowCnts int, @updateRowCnts int;

--execute [dbo].[uspScoresFactActivityLoad] 'computer', 41, 'usartori', '3/172017', 'eleads_crm', 9207, @insertedRowCnts output, @updateRowCnts output


-- =============================================     select * from dbo.FactActivity
-- Author:        Amrendra Kumar
-- Create date:  01/07/2016
-- Description:   Inserts/Update FactActivity

-- 5/10/2016 - ubs - updated USING statement for CAST from uniqueidentifier to VARCHAR(100) for two predicates.
-- 7/21/2016 - ubs - updated to use eleaddw.dbo.SCORES_DealershipLoad to determine SCORES live entities.
-- 7/25/2016 - ubs - updated flag values to 0/1 instead of flag-occurrence-count.
-- 2/17/2017 - ubs - changed from using a temp table on the source data set, to a permanent working table, ETL_Staging.wrk.FactActivity_LoadSource
-- 4/12/2017 - ubs - add filter for EchoPart data
-- 5/5/2017  - ubs - updated for elead-to-SCORES activity migration
-- =============================================
CREATE PROCEDURE [dbo].[uspScoresFactActivityLoad_testing] (
	@MetaComputerName VARCHAR(50)
	,@MetaSrcSysID INT
	,@MetaUserID VARCHAR(50)
	,@MetaLoadDate DATETIME2(7)
	,@MetaSourceSystemName VARCHAR(20)
	,@ETLExecution_ID INT
	,@insertedRowCnts INT OUTPUT
	,@updatedRowCnts INT OUTPUT
	)
AS
SET NOCOUNT ON;

DECLARE @rowcounts TABLE (MergeAction VARCHAR(20));
DECLARE @insertedCount INT
	,@updatedCount INT
	,@SecMetaLoadDate DATETIME2(7);

DECLARE @now datetime

SET @now = getdate();

	DECLARE @echoParkSysID int, @scoresSysID int, @unknownSysID int;

	select @scoresSysID = sourceSystemID
	from [ETL_Staging].Meta.SourceSystem
	where SourceSystemName = 'SCORESMSCRM'

	select @echoParkSysID = sourceSystemID
	from [ETL_Staging].Meta.SourceSystem
	where SourceSystemName = 'EchoPark SCORES DealerContact'

	select @unknownSysID = sourceSystemID
	from [ETL_Staging].Meta.SourceSystem
	where SourceSystemName = 'Placeholder'



	---- use the following to select live SCORES dealerships
	SELECT EntityKey,
		cast(EntSCORES_Company_Dealership_ID as varchar(36)) as EntSCORES_Company_Dealership_ID,
		entScoresGoLiveDate as GoLiveDate,
		EntName as DealershipName,
		EntEleadID as lCompanyID,
		EntUtcOffSetST
	INTO #liveDealers	-- select * from #liveDealers			-- select * from sonic_dw.dbo.dim_entity
	FROM   sonic_dw.dbo.dim_entity
	WHERE  entactive = 'active' --- record active for current and historical reporting
				AND entScoresLiveFlag = 1 --- scores is active
				AND EntScoresDefault = 1 --- master scores record
				AND entlineofbusiness <> 'EchoPark'

	UNION

	---- use the following to select live SCORES EchoPark dealerships
	SELECT EntityKey,
		cast(EntSCORES_Company_Dealership_ID as varchar(36)) as EntSCORES_Company_Dealership_ID,
		entScoresGoLiveDate as GoLiveDate,
		EntName as DealershipName,
		EntEleadID as lCompanyID,
		EntUtcOffSetST
	FROM   sonic_dw.dbo.Dim_Entity de
	WHERE  entlineofbusiness = 'EchoPark'
		   and entactive = 'Active'
		   AND de.EntEntityType = 'dealership'


	create index idx_dealership on #LiveDealers (EntSCORES_Company_Dealership_ID)

	-- adjust time offset on ScheduledStart, ActualStart and ActualEnd
	update opp
		set scheduledStart = dateadd(hour, deal.EntUtcOffSetST, opp.scheduledStart),
			ActualStart = dateadd(hour, deal.EntUtcOffSetST, opp.ActualStart),
			ActualEnd = dateadd(hour, deal.EntUtcOffSetST, opp.actualEnd)
	from etl_staging.dbo.stgFactActivity opp inner join #liveDealers deal
			on opp.Sa_DealerShip = deal.EntSCORES_Company_Dealership_ID
	where ActivityType = 'Showroom Appointment'

	---- get task numbers so we can filter out legacy numbers from SCORES activities.
	--SELECT DISTINCT cast(act.lTaskID as varchar(100)) as lTaskID, cast(act.lDealID as nvarchar(50)) as lDealID
	--INTO #legacyTask	-- drop table #legacyTask		select count(*) from eleadw
	--FROM ETL_Staging.dbo.dwFullActivity act inner join ETL_Staging.dbo.dwFullOpportunity opp
	--		on act.lDealID = opp.lDealID
	--WHERE 1=1
	--	AND (opp.dwActive = 1 OR opp.dwActive IS NULL)
	--	AND (act.dwActive = 1 OR act.dwActive IS NULL)
	--	AND opp.dtProspectIN >= '1/1/2015'

	--CREATE INDEX idx_legacyTask on #legacyTask(lTaskID)


	---- get deal numbers so we can filter out legacy numbers from SCORES activities.
	--SELECT DISTINCT cast(act.lDealID as nvarchar(50)) as lDealID
	--INTO #legacyDeal	-- drop table #legacyDeal		select count(*) from eleadw
	--FROM ETL_Staging.dbo.dwFullActivity act inner join ETL_Staging.dbo.dwFullOpportunity opp
	--		on act.lDealID = opp.lDealID
	--WHERE 1=1
	--	AND (opp.dwActive = 1 OR opp.dwActive IS NULL)
	--	AND (act.dwActive = 1 OR act.dwActive IS NULL)
	--	AND opp.dtProspectIN >= '1/1/2015'

	--CREATE INDEX idx_legacyDeal on #legacyDeal(lDealID)


	IF EXISTS(SELECT * FROM ETL_Staging.sys.indexes WHERE object_id = object_id('ETL_Staging.wrk.FactActivity_LoadSource') AND NAME ='idx_source')
		DROP INDEX idx_source ON ETL_Staging.wrk.FactActivity_LoadSource;

	TRUNCATE TABLE ETL_Staging.wrk.FactActivity_LoadSource;

	INSERT INTO etl_staging.wrk.FactActivity_LoadSource	-- select COUNT(*) from etl_staging.wrk.FactActivity_LoadSource
	SELECT DISTINCT ISNULL(DE.EntityKey, -1) AS EntityKey
			,ISNULL(DLS.LeadStatusKey, -1) AS [LeadStatusKey]
			,ISNULL(D.DateKey, 19000101) AS CreatedOnDateKey
			,ISNULL(T4.TimeKey, -1) AS CreatedOnTimeKey
			,ISNULL(SourceKey, -1) AS SourceKey
			,ISNULL(D1.DateKey, 19000101) AS OpportunityCreatedOnDateKey
			,-1 AS CreatedByKey
			,ISNULL(AT.ActivityTypeKey, -1) AS ActivityTypeKey
			,-1 AS [WorkflowKey]
			,ISNULL(DS.ActivityStatusKey, - 1) AS [ActivityStatusKey]
			,ISNULL(CAST(FA.RegardingObjectId AS VARCHAR(100)), 'UNKNOWN') AS [OpportunityNaturalKey]
			,ISNULL(T.TimeKey, -1) AS ScheduledStartTimeKey
			,ISNULL(T1.TimeKey, -1) AS ScheduledEndTimeKey
			,ISNULL(T2.TimeKey, -1) AS ActualStartTimeKey
			,ISNULL(T3.TimeKey, -1) AS ActualEndTimeKey
			,ISNULL(D2.DateKey, 19000101) AS ModifiedOnDateKey
			,ISNULL(D3.DateKey, 19000101) AS NextActivityDateDueKey
			,ISNULL(D4.DateKey, 19000101) AS scheduledStartDateKey
			,ISNULL(D6.DateKey, 19000101) AS [ActualStartDateKey]
			,ISNULL(D7.DateKey, 19000101) AS [ActualEndDateKey]
			,ISNULL(D5.DateKey, 19000101) AS scheduledEndDateKey
			,-1 AS [ScheduledByKey]
			,-1 AS [ConfirmedByKey]
			,-1 AS [CompletedByKey]
			,-1 AS [ModifiedByKey]
			,-1 AS [ModifiedOnBehalfByKey]
			,-1 AS [CreatedOnBehalfBykey]
			,ISNULL(V.VehicleKey, -1) AS VehicleKey
			,1 AS ActivityCount
			,FA.ActualDurationMinutes AS ActualDurationMinutes
			,sa_accessoriespresented AS AccessoriesPresentedFlag
			,sa_activityispartofprocess AS ActivityIsPartOfProcessFlag
			,sa_AppointmentMade AS AppointmentMadeFlag
			,sa_appraisal AS AppraisalCompletedFlag
			,sa_attempted AS ActivityAttemptedFlag
			,sa_autoclosed AS ActivityAutoClosedFlag
			,sa_bypassfollowup AS BypassFollowupFlag
			,sa_callcenter AS CallCenterFlag
			,sa_ConfirmationSent AS ConfirmationSentFlag
			,sa_confirmed AS ConfirmedFlag
			,sa_contactsince AS ContactSinceFlag
			,sa_createnextactivity AS CreateNextActivityFlag
			,sa_demo AS DemoFlag
			,sa_esales AS ESalesFlag
			,sa_isautomated AS IsAutomatedFlag
			,sa_lifestyleproductspresented AS LifestyleProductsPresentedFlag
			,sa_metmanager AS MetManagerFlag
			,sa_simsreservevehicle AS SIMSReserveVehicleFlag
			,sa_stopworkflow AS StopWorkflowFlag
			,sa_writeup AS WriteUpFlag
			,@ETLExecution_ID AS ETLExecutionID
			,ActivityID AS MetaNaturalKey
			,FA.ScribeDeletedOn AS ScribeDeletedOn
			,FA.MetaSource
	FROM ETL_Staging.dbo.StgFactActivity FA INNER JOIN #liveDealers de		-- select count(*) from ETL_Staging.dbo.StgFactActivity
					on FA.sa_dealership = de.entscores_company_dealership_id
		-- the following joins were originally used to filter out Elead activities.
		--LEFT OUTER JOIN #legacyTask oppTask
		--			on oppTask.lTaskID =  FA.sa_crmlegacyid
		--LEFT OUTER JOIN #legacyDeal oppDeal
		--			on oppDeal.lDealID = FA.sa_legacycrmid
		LEFT JOIN Sonic_Dw.dbo.Dim_Date D ON CAST(FA.CreatedOn AS DATE) = D.FullDate
		LEFT JOIN Sonic_Dw.dbo.Dim_Date D1 ON CAST(FA.OppCreatedOn AS DATE) = D1.FullDate
		LEFT JOIN Sonic_Dw.dbo.dim_Time T ON CONVERT(VARCHAR(20), FA.ScheduledStart, 108) = T.TimeTime
		LEFT JOIN Sonic_Dw.dbo.dim_Time T1 ON CONVERT(VARCHAR(20), FA.ScheduledEnd, 108) = T1.TimeTime
		LEFT JOIN Sonic_Dw.dbo.dim_Time T2 ON CONVERT(VARCHAR(20), FA.ActualStart, 108) = T2.TimeTime
		LEFT JOIN Sonic_Dw.dbo.dim_Time T3 ON CONVERT(VARCHAR(20), FA.ActualEnd, 108) = T3.TimeTime
		LEFT JOIN Sonic_Dw.dbo.dim_Time T4 ON CONVERT(VARCHAR(20), FA.CreatedOn, 108) = T4.TimeTime
		LEFT JOIN Sonic_Dw.dbo.Dim_Date D2 ON CAST(FA.modifiedOn AS DATE) = D2.FullDate
		LEFT JOIN Sonic_Dw.dbo.Dim_Date D3 ON CAST(FA.sa_nextactivityduedate AS DATE) = D3.FullDate
		LEFT JOIN Sonic_Dw.dbo.Dim_Date D4 ON CAST(FA.scheduledStart AS DATE) = D4.FullDate
		LEFT JOIN Sonic_Dw.dbo.Dim_Date D5 ON CAST(FA.scheduledEnd AS DATE) = D5.FullDate
		LEFT JOIN Sonic_Dw.dbo.Dim_Date D6 ON CAST(FA.ActualStart AS DATE) = D6.FullDate
		LEFT JOIN Sonic_Dw.dbo.Dim_Date D7 ON CAST(FA.ActualEnd AS DATE) = D7.FullDate
		LEFT JOIN Sonic_Dw.dbo.Dim_Vehicle V ON FA.SA_Vin = V.VehVIN
		LEFT JOIN Sonic_DW.dbo.DimLeadStatus AS DLS ON FA.LeadStatusCode = DLS.LeadStatusCode	-- select * from dbo.DimLeadStatus truncate table dbo.DimLeadStatus
			AND DLS.Meta_SourceSystemName in ('SCORESMSCRM', 'EchoPark SCORES DealerContact')
			AND DLS.Meta_RowIsCurrent = 'Y'
		LEFT JOIN Sonic_DW.dbo.DimOpportunitySource OS ON FA.OppSource_NaturalKey = OS.Meta_NaturalKey -- select * from dbo.DimOpportunitySource
			AND OS.Meta_SourceSystemName = FA.MetaSourceSystemName    --  in ('SCORESMSCRM', 'EchoPark SCORES DealerContact')
			AND OS.Meta_RowIsCurrent = 'Y'
		LEFT JOIN Sonic_DW.dbo.DimActivityType AT ON FA.ActivityType = AT.ActivityType
		LEFT JOIN Sonic_DW.dbo.DimActivityStatus DS ON FA.ActivityStatusDesc = DS.ActivityStatusDesc	-- select * from dbo.FactActivity where sourcekey <> -1
			AND FA.ActivityStateDesc = DS.ActivityStateDesc
			AND DS.Meta_RowIsCurrent = 'Y'
	---- the following conditions were originally used to filter out Elead activities.
	--WHERE oppTask.lTaskID IS NULL
	--	AND oppDeal.lDealID IS  NULL


	--DROP TABLE #legacyTask
	--DROP TABLE #legacyDeal
	DROP TABLE #livedealers


	CREATE INDEX idx_source on etl_staging.wrk.FactActivity_LoadSource(metaNaturalKey, EntityKey) -- select * from etl_staging.wrk.FactActivity_LoadSource

	---- remove current activity records to be updated
	--DELETE dip
	--FROM dbo.factActivity dip INNER JOIN etl_staging.wrk.FactActivity_LoadSource stg
	--	on dip.meta_NaturalKey = stg.metaNaturalKey
	--		and dip.entitykey = stg.entityKey
	--WHERE 1=1
	--	AND dip.meta_SourceSystemName <> 'eleaddw'


	--select tgt.*
	--from dbo.factActivity tgt inner join etl_staging.wrk.FactActivity_LoadSource AS SRC
	--		on tgt.meta_naturalKey = src.metaNaturalKey
	--				AND TGT.Meta_SourceSystemName <> 'eleaddw'
	--				AND SRC.EntityKey = TGT.EntityKey



	MERGE INTO dbo.FactActivity AS [TGT]		-- select count(*) from sonic_dw.dbo.factActivity
	USING etl_staging.wrk.FactActivity_LoadSource AS SRC
		ON SRC.MetaNaturalKey = TGT.Meta_NaturalKey
			AND SRC.EntityKey = TGT.EntityKey
			AND TGT.Meta_SourceSystemName <> 'eleaddw'
	WHEN MATCHED
		AND (
			SRC.EntityKey <> TGT.EntityKey
			OR SRC.LeadStatusKey <> TGT.LeadStatusKey
			OR SRC.CreatedOnDateKey <> TGT.CreatedOnDateKey
			OR SRC.CreatedOnTimeKey <> TGT.CreatedOnTimeKey
			OR SRC.SourceKey <> TGT.SourceKey
			OR SRC.OpportunityCreatedOnDateKey <> TGT.OpportunityCreatedOnDateKey
			OR SRC.CreatedByKey <> TGT.CreatedByKey
			OR SRC.ActivityTypeKey <> TGT.ActivityTypeKey
			OR SRC.WorkflowKey <> TGT.WorkflowKey
			OR SRC.ActivityStatusKey <> TGT.ActivityStatusKey
			OR isnull(SRC.OpportunityNaturalKey, '') <> isnull(TGT.OpportunityNaturalKey, '')
			OR SRC.ScheduledStartTimeKey <> TGT.ScheduledStartTimeKey
			OR SRC.ScheduledEndTimeKey <> TGT.ScheduledEndTimeKey
			OR SRC.ActualStartTimeKey <> TGT.ActualStartTimeKey
			OR SRC.ActualEndTimeKey <> TGT.ActualEndTimeKey
			OR SRC.ModifiedOnDateKey <> TGT.ModifiedOnDateKey
			OR SRC.NextActivityDateDueKey <> TGT.NextActivityDateDueKey
			OR SRC.ScheduledStartDateKey <> TGT.ScheduledStartDateKey
			OR SRC.ActualStartDateKey <> TGT.ActualStartDateKey
			OR SRC.ActualEndDateKey <> TGT.ActualEndDateKey
			OR SRC.ScheduledEndDateKey <> TGT.ScheduledEndDateKey
			OR SRC.ScheduledByKey <> TGT.ScheduledByKey
			OR SRC.ConfirmedByKey <> TGT.ConfirmedByKey
			OR SRC.CompletedByKey <> TGT.CompletedByKey
			OR SRC.ModifiedByKey <> TGT.ModifiedBykey
			OR SRC.ModifiedOnBehalfByKey <> TGT.ModifiedOnBehalfByKey
			OR SRC.CreatedOnBehalfBykey <> TGT.CreatedOnBehalfBykey
			OR SRC.VehicleKey <> TGT.VehicleKey
			OR ISNULL(SRC.ActivityCount, 0) <> ISNULL(TGT.ActivityCount, 0)
			OR ISNULL(SRC.ActualDurationMinutes, 0) <> ISNULL(TGT.ActualDurationMinutes, 0)
			OR ISNULL(SRC.AccessoriesPresentedFlag, 0) <> ISNULL(TGT.AccessoriesPresentedFlag, 0)
			OR ISNULL(SRC.ActivityIsPartOfProcessFlag, 0) <> ISNULL(TGT.ActivityIsPartOfProcessFlag, 0)
			OR ISNULL(SRC.AppointmentMadeFlag, 0) <> ISNULL(TGT.AppointmentMadeFlag, 0)
			OR ISNULL(SRC.AppraisalCompletedFlag, 0) <> ISNULL(TGT.AppraisalCompletedFlag, 0)
			OR ISNULL(SRC.ActivityAttemptedFlag, 0) <> ISNULL(TGT.ActivityAttemptedFlag, 0)
			OR ISNULL(SRC.ActivityAutoClosedFlag, 0) <> ISNULL(TGT.ActivityAutoClosedFlag, 0)
			OR ISNULL(SRC.BypassFollowupFlag, 0) <> ISNULL(TGT.BypassFollowupFlag, 0)
			OR ISNULL(SRC.CallCenterFlag, 0) <> ISNULL(TGT.CallCenterFlag, 0)
			OR ISNULL(SRC.ConfirmationSentFlag, 0) <> ISNULL(TGT.ConfirmationSentFlag, 0)
			OR ISNULL(SRC.ConfirmedFlag, 0) <> ISNULL(TGT.ConfirmedFlag, 0)
			OR ISNULL(SRC.ContactSinceFlag, 0) <> ISNULL(TGT.ContactSinceFlag, 0)
			OR ISNULL(SRC.CreateNextActivityFlag, 0) <> ISNULL(TGT.CreateNextActivityFlag, 0)
			OR ISNULL(SRC.DemoFlag, 0) <> ISNULL(TGT.DemoFlag, 0)
			OR ISNULL(SRC.ESalesFlag, 0) <> ISNULL(TGT.ESalesFlag, 0)
			OR ISNULL(SRC.IsAutomatedFlag, 0) <> ISNULL(TGT.IsAutomatedFlag, 0)
			OR ISNULL(SRC.LifestyleProductsPresentedFlag, 0) <> ISNULL(TGT.LifestyleProductsPresentedFlag, 0)
			OR ISNULL(SRC.MetManagerFlag, 0) <> ISNULL(TGT.MetManagerFlag, 0)
			OR ISNULL(SRC.SIMSReserveVehicleFlag, 0) <> ISNULL(TGT.SIMSReserveVehicleFlag, 0)
			OR ISNULL(SRC.StopWorkflowFlag, 0) <> ISNULL(TGT.StopWorkflowFlag, 0)
			OR ISNULL(SRC.WriteUpFlag, 0) <> ISNULL(TGT.WriteUpFlag, 0)
			OR ISNULL(SRC.ScribeDeletedOn, '1/1/1900') <> ISNULL(TGT.ScribeDeletedOn, '1/1/1900')
			)
		THEN
			UPDATE
			SET TGT.EntityKey = SRC.EntityKey
				,TGT.LeadStatusKey = SRC.LeadStatusKey
				,TGT.CreatedOnDateKey = SRC.CreatedOnDateKey
				,TGT.CreatedOnTimeKey = SRC.CreatedOnTimeKey
				,TGT.SourceKey = SRC.SourceKey
				,TGT.OpportunityCreatedOnDateKey = SRC.OpportunityCreatedOnDateKey
				,TGT.CreatedByKey = SRC.CreatedByKey
				,TGT.ActivityTypeKey = SRC.ActivityTypeKey
				,TGT.WorkflowKey = SRC.WorkflowKey
				,TGT.ActivityStatusKey = SRC.ActivityStatusKey
				,TGT.OpportunityNaturalKey = SRC.OpportunityNaturalKey
				,TGT.ScheduledStartTimeKey = SRC.ScheduledStartTimeKey
				,TGT.ScheduledEndTimeKey = SRC.ScheduledEndTimeKey
				,TGT.ActualStartTimeKey = SRC.ActualStartTimeKey
				,TGT.ActualEndTimeKey = SRC.ActualEndTimeKey
				,TGT.ModifiedOnDateKey = SRC.ModifiedOnDateKey
				,TGT.NextActivityDateDueKey = SRC.NextActivityDateDueKey
				,TGT.ScheduledStartDateKey = SRC.ScheduledStartDateKey
				,TGT.ActualStartDateKey = SRC.ActualStartDateKey
				,TGT.ActualEndDateKey = SRC.ActualEndDateKey
				,TGT.ScheduledEndDateKey = SRC.ScheduledEndDateKey
				,TGT.ScheduledByKey = SRC.ScheduledByKey
				,TGT.ConfirmedByKey = SRC.ConfirmedByKey
				,TGT.CompletedByKey = SRC.CompletedByKey
				,TGT.ModifiedByKey = SRC.ModifiedByKey
				,TGT.ModifiedOnBehalfByKey = SRC.ModifiedOnBehalfByKey
				,TGT.CreatedOnBehalfBykey = SRC.CreatedOnBehalfBykey
				,TGT.VehicleKey = SRC.VehicleKey
				,TGT.ActivityCount = ISNULL(SRC.ActivityCount, 0)
				,TGT.ActualDurationMinutes = ISNULL(SRC.ActualDurationMinutes, 0)
				,TGT.AccessoriesPresentedFlag = ISNULL(SRC.AccessoriesPresentedFlag, 0)
				,TGT.ActivityIsPartOfProcessFlag = ISNULL(SRC.ActivityIsPartOfProcessFlag, 0)
				,TGT.AppointmentMadeFlag = ISNULL(SRC.AppointmentMadeFlag, 0)
				,TGT.AppraisalCompletedFlag = ISNULL(SRC.AppraisalCompletedFlag, 0)
				,TGT.ActivityAttemptedFlag = ISNULL(SRC.ActivityAttemptedFlag, 0)
				,TGT.ActivityAutoClosedFlag = ISNULL(SRC.ActivityAutoClosedFlag, 0)
				,TGT.BypassFollowupFlag = ISNULL(SRC.BypassFollowupFlag, 0)
				,TGT.CallCenterFlag = ISNULL(SRC.CallCenterFlag, 0)
				,TGT.ConfirmationSentFlag = ISNULL(SRC.ConfirmationSentFlag, 0)
				,TGT.ConfirmedFlag = ISNULL(SRC.ConfirmedFlag, 0)
				,TGT.ContactSinceFlag = ISNULL(SRC.ContactSinceFlag, 0)
				,TGT.CreateNextActivityFlag = ISNULL(SRC.CreateNextActivityFlag, 0)
				,TGT.DemoFlag = ISNULL(SRC.DemoFlag, 0)
				,TGT.ESalesFlag = ISNULL(SRC.ESalesFlag, 0)
				,TGT.IsAutomatedFlag = ISNULL(SRC.IsAutomatedFlag, 0)
				,TGT.LifestyleProductsPresentedFlag = ISNULL(SRC.LifestyleProductsPresentedFlag, 0)
				,TGT.MetManagerFlag = ISNULL(SRC.MetManagerFlag, 0)
				,TGT.SIMSReserveVehicleFlag = ISNULL(SRC.SIMSReserveVehicleFlag, 0)
				,TGT.StopWorkflowFlag = ISNULL(SRC.StopWorkflowFlag, 0)
				,TGT.WriteUpFlag = ISNULL(SRC.WriteUpFlag, 0)
				,TGT.Meta_RowLastChangedDate = @MetaLOadDate
				,TGT.ETLExecution_ID = SRC.ETLExecutionID
				,TGT.ScribeDeletedOn = ISNULL(SRC.ScribeDeletedOn, '1/1/1900')
	WHEN NOT MATCHED
		THEN
			INSERT (
				[EntityKey]
				,[LeadStatusKey]
				,[CreatedOnDateKey]
				,[CreatedOnTimeKey]
				,[SourceKey]
				,[OpportunityCreatedOnDateKey]
				,[CreatedByKey]
				,[ActivityTypeKey]
				,[WorkflowKey]
				,[ActivityStatusKey]
				,[OpportunityNaturalKey]
				,[ScheduledStartTimeKey]
				,[ScheduledEndTimeKey]
				,[ActualStartTimeKey]
				,[ActualEndTimeKey]
				,[ModifiedOnDateKey]
				,[NextActivityDateDueKey]
				,[ScheduledStartDateKey]
				,[ActualStartDateKey]
				,[ActualEndDateKey]
				,[ScheduledEndDateKey]
				,[ScheduledByKey]
				,[ConfirmedByKey]
				,[CompletedByKey]
				,[ModifiedBykey]
				,[ModifiedOnBehalfByKey]
				,[CreatedOnBehalfBykey]
				,[VehicleKey]
				,[ActivityCount]
				,[ActualDurationMinutes]
				,[AccessoriesPresentedFlag]
				,[ActivityIsPartOfProcessFlag]
				,[AppointmentMadeFlag]
				,[AppraisalCompletedFlag]
				,[ActivityAttemptedFlag]
				,[ActivityAutoClosedFlag]
				,[BypassFollowupFlag]
				,[CallCenterFlag]
				,[ConfirmationSentFlag]
				,[ConfirmedFlag]
				,[ContactSinceFlag]
				,[CreateNextActivityFlag]
				,[DemoFlag]
				,[ESalesFlag]
				,[IsAutomatedFlag]
				,[LifestyleProductsPresentedFlag]
				,[MetManagerFlag]
				,[SIMSReserveVehicleFlag]
				,[StopWorkflowFlag]
				,[WriteUpFlag]
				,[Meta_ComputerName]
				,[Meta_LoadDate]
				,[Meta_AuditScore]
				,[Meta_SrcSysID]
				,[Meta_SourceSystemName]
				,[Meta_RowEffectiveDate]
				,Meta_RowExpiredDate
				,[Meta_RowIsCurrent]
				,[Meta_RowLastChangedDate]
				,[Meta_NaturalKey]
				,[Meta_Checksum]
				,[ETLExecution_ID]
				,[ScribeDeletedOn]
				)
			VALUES (
				SRC.EntityKey
				,SRC.LeadStatusKey
				,SRC.CreatedOnDateKey
				,SRC.CreatedOnTimeKey
				,SRC.SourceKey
				,SRC.OpportunityCreatedOnDateKey
				,SRC.CreatedByKey
				,SRC.ActivityTypeKey
				,SRC.WorkflowKey
				,SRC.ActivityStatusKey
				,SRC.OpportunityNaturalKey
				,SRC.ScheduledStartTimeKey
				,SRC.ScheduledEndTimeKey
				,SRC.ActualStartTimeKey
				,SRC.ActualEndTimeKey
				,SRC.ModifiedOnDateKey
				,SRC.NextActivityDateDueKey
				,SRC.ScheduledStartDateKey
				,SRC.ActualStartDateKey
				,SRC.ActualEndDateKey
				,SRC.ScheduledEndDateKey
				,SRC.ScheduledByKey
				,SRC.ConfirmedByKey
				,SRC.CompletedByKey
				,SRC.ModifiedByKey
				,SRC.ModifiedOnBehalfByKey
				,SRC.CreatedOnBehalfBykey
				,SRC.VehicleKey
				,ISNULL(SRC.ActivityCount, 0)
				,ISNULL(SRC.ActualDurationMinutes, 0)
				,ISNULL(SRC.AccessoriesPresentedFlag, 0)
				,ISNULL(SRC.ActivityIsPartOfProcessFlag, 0)
				,ISNULL(SRC.AppointmentMadeFlag, 0)
				,ISNULL(SRC.AppraisalCompletedFlag, 0)
				,ISNULL(SRC.ActivityAttemptedFlag, 0)
				,ISNULL(SRC.ActivityAutoClosedFlag, 0)
				,ISNULL(SRC.BypassFollowupFlag, 0)
				,ISNULL(SRC.CallCenterFlag, 0)
				,ISNULL(SRC.ConfirmationSentFlag, 0)
				,ISNULL(SRC.ConfirmedFlag, 0)
				,ISNULL(SRC.ContactSinceFlag, 0)
				,ISNULL(SRC.CreateNextActivityFlag, 0)
				,ISNULL(SRC.DemoFlag, 0)
				,ISNULL(SRC.ESalesFlag, 0)
				,ISNULL(SRC.IsAutomatedFlag, 0)
				,ISNULL(SRC.LifestyleProductsPresentedFlag, 0)
				,ISNULL(SRC.MetManagerFlag, 0)
				,ISNULL(SRC.SIMSReserveVehicleFlag, 0)
				,ISNULL(SRC.StopWorkflowFlag, 0)
				,ISNULL(SRC.WriteUpFlag, 0)
				,@MetaComputerName
				,@MetaLoadDate
				,NULL
				,CASE WHEN SRC.MetaSource = 'EchoPark SCORES DealerContact' THEN @echoParkSysID
					  WHEN SRC.MetaSource = 'SCORESMSCRM' THEN @scoresSysID
					  ELSE @unknownSysID
				 END
				,SRC.MetaSource
				,@MetaLoadDate
				,NULL
				,'Y'
				,@MetaLoadDate
				,SRC.MetaNaturalKey
				,-1
				,@ETLExecution_ID
				,ISNULL(SRC.ScribeDeletedOn, '1/1/1900')
				)
	OUTPUT $ACTION
	INTO @rowcounts;


-- do a soft delete on deleted activities
update fact
	set meta_rowiscurrent = 'N'
from etl_staging.dbo.StgFactActivity opp inner join dbo.factActivity fact
		on cast(opp.activityid as varchar(100)) = fact.meta_naturalKey
where 1=1
	and fact.Meta_SourceSystemName <> 'eleaddw'
	and fact.scribedeletedon <> '1900-01-01'



SELECT @insertedCount = [INSERT]
	,@updatedCount = [UPDATE]
FROM (
	SELECT MergeAction
		,1 ROWS
	FROM @rowcounts
	) AS p
PIVOT(COUNT(rows) FOR p.MergeAction IN (
			[INSERT]
			,[UPDATE]
			)) AS pvt

SELECT @insertedRowCnts = isnull(@insertedcount, 0)
	,@updatedRowCnts = isnull(@updatedCount, 0)







































```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
