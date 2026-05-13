---
name: uspScoresFactOpportunityLoad_withTemp_BK_02082018
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - FactOpportunity
dependency_count: 1
parameter_count: 9
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.FactOpportunity** (U )

## Parameters

| Name                    | Type      | Output | Default |
| ----------------------- | --------- | ------ | ------- |
| `@MetaComputerName`     | varchar   | No     | No      |
| `@MetaSrcSysId`         | int       | No     | No      |
| `@MetaSourceSystemName` | varchar   | No     | No      |
| `@MetaUserId`           | varchar   | No     | No      |
| `@MetaLoadDate`         | datetime2 | No     | No      |
| `@ETLExecutionId`       | int       | No     | No      |
| `@ExecutionConfig`      | varchar   | No     | No      |
| `@InsertedRows`         | int       | Yes    | No      |
| `@UpdatedRows`          | int       | Yes    | No      |

## Definition

```sql






--declare @insertedRows int, @updatedRows int;

--exec dbo.uspScoresFactOpportunityLoad_withTemp 'SHQBT0091', 40, 'SCORESMSCRM', 'Umberto.Sartori', '7/19/2017',55618, 'IncrementalLoad', @insertedRows, @updatedRows
------ =============================================
---- Author:       Bhramar Chandrakar
---- Create date:  12/02/2016
---- Description:  Inserts/Update Fact Opportunity

---- 5/18/2016 - ubs - Add VehicleKey data
---- 7/21/2016 - ubs - updated to use eleaddw.dbo.SCORES_DealershipLoad to determine SCORES live entities.
---- 7/25/2016 - ubs - updated flag values to 0/1 instead of flag-occurrence-count.
---- 10/26/2016 - ubs - changed CTEs into temp tables. Too large a set for CTEs.
---- 12/6/2016  - ubs  - added LeadState to the MERGE statement
---- 3/14/2017  - ubs  - replaced temp tables with permanent working tables.
---- 4/2/2017   - ubs  - added SCORES	EchoPark opportunity records
---- 5/5/2017   - ubs  - completed elead-to-SCORES migration
---- =============================================
CREATE PROCEDURE [dbo].[uspScoresFactOpportunityLoad_withTemp_BK_02082018] (
	@MetaComputerName VARCHAR(50)
	,@MetaSrcSysId INT
	,@MetaSourceSystemName VARCHAR(20)
	,@MetaUserId VARCHAR(50)
	,@MetaLoadDate DATETIME2(7)
	,@ETLExecutionId INT
	,@ExecutionConfig varchar(50)
	,@InsertedRows INT OUTPUT
	,@UpdatedRows INT OUTPUT
	)
AS
SET NOCOUNT ON;

--declare	@MetaComputerName VARCHAR(50)
--	,@MetaSrcSysId INT
--	,@MetaSourceSystemName VARCHAR(20)
--	,@MetaUserId VARCHAR(50)
--	,@MetaLoadDate DATETIME2(7)
--	,@ETLExecutionId INT
--	,@ExecutionConfig varchar(50)

--set @metacomputername = 'SHQBT0091'
--set @metasrcsysid = 40
--set @MetaSourceSystemName = 'SCORESMSCRM'
--set @metauserid = 'umberto.sartori'
--set @MetaLoadDate = getdate()
--set @etlexecutionid = 9299
--set @ExecutionConfig = 'FullLoad'

DECLARE @now datetime2(7);

SET @now = getdate();


	DECLARE @rowcounts TABLE (MergeAction VARCHAR(20));

	DECLARE @sourceSystemName varchar(20), @originalSourceSystem varchar(20), @originalSourceSystemID int;

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

	select @originalSourceSystem = SourceSystemName,
		   @originalSourceSystemID = sourceSystemID
	from [ETL_Staging].Meta.SourceSystem
	where SourceSystemName = 'eLeadDW'

	-- get active SCORES companies
	SELECT EntityKey,
		cast(EntSCORES_Company_Dealership_ID as varchar(36)) as EntSCORES_Company_Dealership_ID,
		entScoresGoLiveDate as GoLiveDate,
		EntDealerLvl1 as DealershipName,
		EntLineOfBusiness,
		EntEleadID as lCompanyID
	INTO #liveDealers	-- select * from #liveDealers		-- drop table #liveDealers
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
		EntDealerLvl1 as DealershipName,
		EntLineOfBusiness,
		EntEleadID as lCompanyID
	FROM   sonic_dw.dbo.Dim_Entity de
	WHERE  entlineofbusiness = 'EchoPark'
		   and entactive = 'Active'
		   AND de.EntEntityType = 'dealership'

	create index idx_dealership on #LiveDealers (EntSCORES_Company_Dealership_ID)


	SELECT OpportunityNaturalKey
			,SUM(CASE
					WHEN ActivityType = 'Email'
						THEN 1
					ELSE 0
					END) AS EmailCount
			,SUM(CASE
					WHEN ActivityType = 'Email'
						AND ActivityStateDesc = 'Open'
						THEN 1
					ELSE 0
					END) EmailCountOpen
			,SUM(CASE
					WHEN ActivityType = 'Email'
						AND ActivityStateDesc = 'Completed'
						THEN 1
					ELSE 0
					END) AS EmailCountCompleted
			,SUM(CASE
					WHEN ActivityType = 'Phone Call'
						THEN 1
					ELSE 0
					END) AS PhoneCallCount
			,SUM(CASE
					WHEN ActivityType = 'Phone Call'
						AND ActivityStateDesc = 'Open'
						THEN 1
					ELSE 0
					END) PhonecallCountOpen
			,SUM(CASE
					WHEN ActivityType = 'Phone Call'
						AND ActivityStateDesc = 'Completed'
						THEN 1
					ELSE 0
					END) AS PhoneCallCountCompleted
			--,SUM(CASE
			--		WHEN ActivityType = 'Prospect Survey'
			--			THEN 1
			--		ELSE 0
			--		END) AS ProspectSurvey
			,SUM(CASE
					WHEN ActivityType = 'Delivery Appointment'
						THEN 1
					ELSE 0
					END) AS DeliveryAppointment
			,MAX(CASE
					WHEN ActivityType = 'Showroom Visit'
						AND OpportunityNaturalKey IS NOT NULL
						THEN 1
					ELSE 0
					END) AS InShowRoomCount
			,MIN(CASE
					WHEN ActivityType = 'Showroom Appointment'
						THEN DD4.FullDate
					END) AS MinScheduledStart
			,MIN(CASE
					WHEN ActivityType = 'Showroom Appointment'
						THEN DD6.FullDate
					END) AS MinActualStart
			,SUM(CASE
					WHEN ActivityType = 'Showroom Appointment'
						AND ActivityStateDesc = 'Open'
						THEN 1
					ELSE 0
					END) ShowroomCountOpen
			,SUM(CASE
					WHEN ActivityType = 'Showroom Appointment'
						AND ActivityStateDesc = 'Completed'
						THEN 1
					ELSE 0
					END) ShowroomCountCompleted
			,SUM(CASE
					WHEN ActivityType = 'Showroom Appointment'
						AND ActivityStateDesc = 'Canceled'
						THEN 1
					ELSE 0
					END) ShowroomCountNoShow
			,SUM(CASE
					WHEN ActivityType = 'Showroom Appointment'
						AND DD4.FullDate IS NOT NULL
						THEN 1
					ELSE 0
					END) ShowRoomCountScheduled
			,MAX(CASE
					WHEN ActivityType = 'Showroom Appointment'
						AND ActivityStateDesc = 'Completed'
						THEN 1
					ELSE 0
					END) ApptStatusComplt
			,SUM(CASE
					WHEN ActivityType = 'Showroom Appointment'
						AND ActivityStateDesc = 'Completed'
						AND ActualEndDateKey IS NOT NULL
						THEN 1
					ELSE 0
					END) ShowroomApptShown
			,MAX(CASE
					WHEN ActivityType = 'Showroom Appointment'
						AND ConfirmedFlag = 1
						AND DD5.FullDate IS NOT NULL
						THEN 1
					ELSE
						CASE WHEN ActivityType <> 'Showroom Appointment'
								THEN NULL
							 ELSE 0
						END
					END) ApptConfFlag
		INTO #FA		-- drop table #fa
		FROM [Sonic_DW].[dbo].[FactActivity] A
		LEFT JOIN [Sonic_DW].[dbo].[DimActivityType] B ON A.ActivityTypeKey = B.ActivityTypeKey
		LEFT JOIN [Sonic_DW].[dbo].[DimActivityStatus] C ON A.ActivityStatusKey = C.ActivityStatusKey
		LEFT JOIN [Sonic_DW].[dbo].[Dim_Date] DD1 ON A.[CreatedOnDateKey] = DD1.DateKey
		LEFT JOIN [Sonic_DW].[dbo].[Dim_Date] DD2 ON A.[ModifiedOnDateKey] = DD2.DateKey
		LEFT JOIN [Sonic_DW].[dbo].[Dim_Date] DD3 ON A.[NextActivityDateDueKey] = DD3.DateKey
		LEFT JOIN [Sonic_DW].[dbo].[Dim_Date] DD4 ON A.[ScheduledStartDateKey] = DD4.DateKey
		LEFT JOIN [Sonic_DW].[dbo].[Dim_Date] DD5 ON A.[ScheduledEndDateKey] = DD5.DateKey
		LEFT JOIN [Sonic_DW].[dbo].[Dim_Date] DD6 ON A.[ActualStartDateKey] = DD6.DateKey
		LEFT JOIN [Sonic_DW].[dbo].[Dim_Date] DD7 ON A.[OpportunityCreatedOnDateKey] = DD7.DateKey
		LEFT JOIN [Sonic_DW].[dbo].[Dim_Date] DD8 ON A.[ActualEndDateKey] = DD8.DateKey
		WHERE C.Meta_SourceSystemName in ('SCORESMSCRM', 'EchoPark SCORES DealerContact')
		GROUP BY OpportunityNaturalKey

	CREATE INDEX IDX_FA ON #FA (OpportunityNaturalKey)

	-- get deal numbers so we can filter out legacy numbers from SCORES deals.
	SELECT DISTINCT cast(lDealID as nvarchar(50)) as lDealID
	INTO #legacy	-- drop table #legacy
	FROM ETL_Staging.dbo.dwFullOpportunity
	WHERE lDealID IS NOT NULL
		AND (dwActive = 1 OR dwActive IS NULL)
		AND dtProspectIn >= '1/1/2015'	-- the archive table already starts from 1/1/2015



	CREATE INDEX idx_lDealID on #legacy(lDealID)


	-- get source data for merge
	SELECT ISNULL(DE.EntityKey, -1) AS [EntityKey]
			,CAST(stg.opportunityid AS VARCHAR(36)) AS opportunityid
			,CAST(stg.sa_dealership AS VARCHAR(36)) as sa_dealership
			,stg.sa_dealermasterid
			,stg.sa_sourceid
			,stg.sa_primarysalesprofessional
			,stg.createdon
			,stg.modifiedon
			,stg.sa_closedate
			,stg.statuscode
			,stg.sa_opportunityid
			,stg.sa_purchasetype
			,CASE
				WHEN stg.sa_newused = 100000000
					THEN 1
				ELSE 0
			 END AS [NewVehicleFlag]
			,stg.sa_duplicateleadcount
			,MAX(ABS(DATEDIFF(DD, ISNULL(stg.createdon, stg.sa_firstappointment), CASE
							WHEN YEAR(ISNULL(stg.sa_closedate, stg.actualclosedate)) > 1910
								THEN ISNULL(stg.sa_closedate, stg.actualclosedate)
							ELSE GETDATE()
							END))) AS [DaysActive]
			,stg.sa_opportunitystate
			,stg.sa_dmsstatus
			,SUM(CASE
					WHEN stg.sa_opportunitystate = 100000002
						THEN 1
					ELSE 0
					END) AS [SoldCount]
			,SUM(CASE
					WHEN stg.sa_dmsstatus = 100000003
						THEN 1
					ELSE 0
					END) AS [DMSSoldCount]
			,stg.sa_beback
			,stg.sa_demos
			,stg.sa_writeups
			,stg.parentcontactid
			,stg.sa_firstappointment
			,stg.SCRIBE_DELETEDON AS ScribeDeletedOn
			,stg.sa_lastinteractiondate
			,stg.Opp_Meta_NaturalKey
			,stg.SalesAssociateKey
			,cast(stg.lDealID as varchar(10)) as lDealID
			,stg.dtSold
			,stg.sa_opportunitystate_displayname
			,stg.MetaSourceName
			,CASE WHEN stg.MetaSourceName = 'EchoPark SCORES DealerContact' THEN @echoParkSysID
				  WHEN stg.MetaSourceName = 'SCORESMSCRM' THEN @scoresSysID
				  ELSE @unknownSysID
			 END AS MetaSourceID
			,cast(stg.sa_legacycrmid as int) as sa_legacycrmid
			,stg.MetaSourceName AS OriginalSourceSystem
			,CASE WHEN stg.MetaSourceName = 'EchoPark SCORES DealerContact' THEN @echoParkSysID
				  WHEN stg.MetaSourceName = 'SCORESMSCRM' THEN @scoresSysID
				  ELSE @unknownSysID
			 END  AS OriginalSourceSystemID
			,DE.lCompanyID
			,stg.sa_vin
		INTO #MergeSource	-- select * from #mergeSource	-- drop table #mergeSource
		FROM [ETL_Staging].[dbo].[StgFactOppScores] stg	--
				INNER JOIN #liveDealers DE ON stg.sa_dealership = DE.EntSCORES_Company_Dealership_ID
				LEFT JOIN #legacy opp ON stg.sa_legacycrmid = opp.lDealID

		--WHERE opp.lDealID IS NULL
		GROUP BY
			ISNULL(DE.EntityKey, -1)
			,CAST(stg.opportunityid AS VARCHAR(36))
			,CAST(stg.sa_dealership AS VARCHAR(36))
			,stg.sa_dealermasterid
			,stg.sa_sourceid
			,stg.sa_primarysalesprofessional
			,stg.createdon
			,stg.modifiedon
			,stg.sa_closedate
			,stg.statuscode
			,CASE
				WHEN stg.sa_newused = 100000000
					THEN 1
				ELSE 0
			 END
			,stg.sa_duplicateleadcount
			,stg.sa_opportunitystate
			,stg.sa_dmsstatus
			,stg.sa_dmsstatus
			,stg.sa_beback
			,stg.sa_demos
			,stg.sa_writeups
			,stg.parentcontactid
			,stg.sa_opportunityid
			,stg.sa_purchasetype
			,stg.sa_firstappointment
			,stg.SCRIBE_DELETEDON
			,stg.sa_lastinteractiondate
			,stg.Opp_Meta_NaturalKey
			,stg.SalesAssociateKey
			,cast(stg.lDealID as varchar(10))
			,stg.dtSold
			,stg.sa_opportunitystate_displayname
			,stg.MetaSourceName
			,CASE WHEN stg.MetaSourceName = 'EchoPark SCORES DealerContact' THEN @echoParkSysID
				  WHEN stg.MetaSourceName = 'SCORESMSCRM' THEN @scoresSysID
				  ELSE @unknownSysID
			 END
			,cast(stg.sa_legacycrmid as int)
			,DE.lCompanyID
			,stg.sa_vin


	CREATE INDEX IDX_DealerMasterID ON #MergeSource (sa_dealerMasterID, opp_meta_naturalKey)

--************************************************************	MIGRATE ELEAD OPPORTUNITIES TO SCORES AS NEEDED ***************************************
	IF @ExecutionConfig <> 'FullLoad'
		BEGIN
			-- find out legacy crm id duplicates
			select sa_legacycrmid, count(*) as cnt
			into #dupcrm		-- drop table #dupcrm
			from #MergeSource
			group by sa_legacycrmid
			having count(*) > 1


			-- find out duplicate opportunity records to remove from SCORES opportunity data set
			select *
			into #opp		-- drop table #opp	-- select * from #opp
			from (
			select opportunityid
				,modifiedon
				,sa_legacycrmid
				,row_number() over(partition by sa_legacycrmid order by modifiedon desc) as rowNumber
			from #mergeSource
			where sa_legacycrmid in (select sa_legacycrmid from #dupcrm)) zz
			where rowNumber > 1

			-- remove duplicate legacy crm id references from  SCORES opportunity data set
			delete sc
			from #mergeSource sc inner join #opp opp
						on sc.opportunityid = opp.opportunityid
							and sc.sa_legacycrmid = opp.sa_legacycrmid
							and sc.modifiedon = opp.modifiedon

			-- locate FactOpportunity natural keys related to SCORES legacycrmid
			select cast(opp.ldealid as varchar) + '-' + cast(isnull(opp.lvehicleid, -1) as varchar) as OpportunityNaturalKey,
					opp.ldealid as OpportunityDealID,
					mrg.opportunityid
			into #eleadOpps		-- select * from #eleadOpps		-- drop table #eleadOpps
			from etl_staging.dbo.dwFullOpportunity opp inner join #mergeSource mrg
					on opp.ldealid = mrg.sa_legacycrmid

			-- retire Elead opportunites migrating to SCORES
			update opp
				set opp.Meta_RowIsCurrent = 'N',
					opp.Meta_RowExpiredDate = @now,
					opp.ETLExecution_ID = @ETLExecutionId
			from sonic_dw.dbo.factOpportunity opp inner join #eleadOpps act
						on opp.meta_NaturalKey = act.OpportunityNaturalKey
							and opp.Meta_RowIsCurrent = 'Y'
							and opp.Meta_SourceSystemName = 'eLeadDW'

			-- retire Elead activities migrating to SCORES
			update act
				set act.Meta_RowIsCurrent = 'N',
					act.Meta_RowExpiredDate = @now,
					act.ETLExecution_ID = @ETLExecutionId
			from sonic_dw.dbo.factActivity act inner join #eleadOpps opp
						on act.OpportunityNaturalKey = opp.OpportunityNaturalKey
							and act.Meta_RowIsCurrent = 'Y'
							and act.Meta_SourceSystemName = 'eLeadDW'

			-- update meta data for SCORES fact opportunity records
			update #mergeSource
				set OriginalSourceSystem = case when sa_legacycrmid is not null then @originalSourceSystem else MetaSourceName end,
					OriginalSourceSystemID = case when sa_legacycrmid is not null then @originalSourceSystemID else MetaSourceID end

			 --drop table #legacy
			 --drop table #liveDealers
			 --drop table #fa
			 --drop table #mergeSource
			 --drop table #dupcrm
			 --drop table #opp
			 --drop table #eleadOpps
		END

--************************************************************	MIGRATE ELEAD OPPORTUNITIES TO SCORES AS NEEDED ***************************************


	-- clear temp table
	TRUNCATE TABLE etl_staging.wrk.Focus_SCORES_Opportunity_TempTable

	INSERT INTO etl_staging.wrk.Focus_SCORES_Opportunity_TempTable
	SELECT A.EntityKey
		,ISNULL(DFC.FocusCustomerKey, -1) AS [FocusCustomerKey]
		,ISNULL(DOS.SourceKey, -1) AS [SourceKey]
		,A.SalesAssociateKey AS [PrimarySalesAssociateKey] -- sa_primarysalesprofessional
		,ISNULL(DD1.DateKey, 19000101) AS [DateProspectInKey]
		,ISNULL(DD2.DateKey, 19000101) AS [LastActivityDateKey]
		,ISNULL(ModifiedTime.TimeKey, -1) AS [LastActivityTimeKey]
		,ISNULL(CASE
				WHEN A.sa_opportunitystate = 100000002
					THEN CONVERT(INT, (CONVERT(VARCHAR(10), A.sa_closedate, 112)), 112)
				ELSE NULL
				END, 19000101) AS [DateSoldKey]
		,ISNULL(CASE
				WHEN A.sa_dmsstatus = 100000003
					THEN CONVERT(INT, (CONVERT(VARCHAR(10), A.sa_closedate, 112)), 112)
				ELSE NULL
				END, 19000101) AS [DMSDateSoldKey]
		,ISNULL(CONVERT(INT, (
					CONVERT(VARCHAR(10), ISNULL(CASE
								WHEN A.sa_closedate = '19000101'
									THEN NULL
								ELSE A.sa_closedate
								END, CASE
								WHEN A.sa_lastinteractiondate = '19000101'
									THEN NULL
								ELSE A.sa_lastinteractiondate
								END), 112)
					), 112), 19000101) AS [InactiveDateKey]
		,isnull(vhc.VehicleKey, -1) AS VehicleKey
		,isnull(tradeIn.VehicleKey, -1) AS [TradeInVehicleKey]
		,ISNULL(DLS.LeadStatusKey, - 1) AS [LeadStatusKey]
		,ISNULL(DDT.DealTypeKey, - 1) AS [DealTypeKey]
		,ISNULL([NewVehicleFlag], -1) AS NewVehicleFlag
		,1 AS [LeadCount]
		,ISNULL(sa_duplicateleadcount, 0) AS [DuplicateLeadCount]
		,0 AS [LeadCost]
		,ISNULL([DaysActive], 0) as DaysActive
		,ISNULL([SoldCount], 0) as SoldCount
		,ISNULL([DMSSoldCount], 0) as DMSSoldCount
		,0 AS [TradeInCount]
		,ISNULL(#FA.ShowroomApptShown, 0) AS [ApptShowCount]
		,ISNULL(#FA.ShowroomCountNoShow, 0) AS [ApptNoShowCount]
		,ISNULL(#FA.ShowRoomCountScheduled, 0) AS [ApptSetCount]
		,CASE
			WHEN #FA.ApptStatusComplt > 0
				AND A.sa_opportunitystate = 100000002
				THEN 1
			ELSE 0
		 END AS [ApptSoldCount]
		,CASE
			WHEN #FA.MinScheduledStart IS NOT NULL
				THEN ABS(DATEDIFF(DD, ISNULL(A.createdon, A.sa_firstappointment), (#FA.MinScheduledStart)))
			ELSE -1
		 END AS [DaysToFirstAppt]
		,ISNULL(#FA.[EmailCount], 0) AS [EmailSentCount]
		,ISNULL(#FA.[PhoneCallCount], 0) AS [PhoneCallCount]
		,CASE
			WHEN ShowroomCountCompleted > 0
					AND ShowRoomCountScheduled > 0
				THEN ISNULL(ShowroomCountCompleted, 0)
			ELSE 0
		 END + ISNULL(#FA.EmailCountCompleted, 0) + ISNULL(#FA.PhonecallCountCompleted, 0) AS [CompletedActivityCount]
		,NULL AS [IncompleteActivityCount]
		--,ISNULL(#FA.[ProspectSurvey], 0) AS [ProspectSurvey]
		--,ISNULL(#FA.[DeliveryAppointment], 0) AS [DeliveryAppointment]
		,CASE
			WHEN A.sa_closedate IS NULL
				THEN (
						CASE
							WHEN #FA.ShowroomCountOpen > 0
								AND ShowroomCountScheduled > 0
								THEN ISNULL(ShowroomCountOpen, 0)
							ELSE 0
							END
						) + ISNULL(#FA.EmailCountOpen, 0) + ISNULL(#FA.PhonecallCountOpen, 0)
			ELSE 0
			END AS [FutureActivityCount]
		,CASE
			WHEN ISNULL(#FA.[InShowRoomCount], 0) > 0
				THEN 1
			ELSE 0
			END AS [InShowRoomFlag]
		,#FA.ApptConfFlag
		,CASE WHEN sa_beback IS NOT NULL then
					case when sa_beback >= 1 then 1 else 0 end
			  ELSE NULL
		 END AS BeBackFlag
		,ISNULL(#FA.ShowRoomCountScheduled, 0) + ISNULL(#FA.EmailCount, 0) + ISNULL(#FA.PhonecallCount, 0) AS [ActivityCount]
		,NULL AS [NewProspectFlag]
		,CASE WHEN sa_demos IS NOT NULL then
					case when [sa_demos] >= 1 then 1 else 0 end
			  ELSE NULL
		 END AS DemoFlag
		,CASE WHEN sa_writeups IS NOT NULL then
					case when sa_writeups >= 1 then 1 else 0 end
			  ELSE NULL
		 END AS WriteUpFlag
		,NULL AS TOFlag
		,0 AS [TotalSurveyCount]
		,0 AS [TotalSurveySoldCount]
		,@MetaComputerName AS [MetaComputerName]
		,@MetaLoadDate AS MetaLoadDate
		,A.MetaSourceID AS MetaSrcSysID
		,A.MetaSourceName AS MetaSourceSystemName
		,@MetaLoadDate AS MetaRowEffectiveDate
		,CAST(NULL AS DATETIME2(7)) AS MetaRowExpiredDate
		,'Y' AS MetaRowIsCurrent
		,@MetaLoadDate AS MetaRowLastChangedDate
		,NULL AS MetaAuditKey
		,-1 AS MetaChecksum
		,CAST([opportunityid] AS VARCHAR(36)) AS MetaNaturalKey
		,@ETLExecutionId AS ETLExecutionID
		,ISNULL(ScribeDeletedOn, '1/1/1900') AS ScribeDeletedOn
		,ISNULL(sa_opportunitystate_displayname, 'UNKNOWN') AS sa_opportunitystate_displayname
		,A.originalSourceSystem
		,A.originalSourceSystemID
		,ISNULL(A.sa_legacycrmid, -1) as sa_legacycrmid
	FROM #MergeSource AS A
		LEFT JOIN Sonic_DW.dbo.DimFocusCustomer DFC ON A.sa_dealermasterid = RTRIM(LTRIM(DFC.[Meta_NaturalKey]))
														AND DFC.Meta_RowIsCurrent = 'Y'		-- select distinct meta_sourcesystemname from dbo.dimFocusCustomer
		LEFT JOIN Sonic_DW.dbo.DimOpportunitySource AS DOS ON A.Opp_Meta_NaturalKey = RTRIM(LTRIM(DOS.Meta_NaturalKey))
														AND DOS.Meta_SourceSystemName = A.MetaSourceName  -- in ('SCORESMSCRM', 'EchoPark SCORES DealerContact')
														AND DOS.Meta_RowIsCurrent = 'Y'
		LEFT JOIN Sonic_DW.dbo.Dim_Date AS DD1 ON cast(A.[createdon] as date) = DD1.FullDate
		LEFT JOIN Sonic_DW.dbo.Dim_Date AS DD2 ON cast(A.[modifiedon] as date) = DD2.FullDate
		LEFT JOIN Sonic_dw.dbo.Dim_time ModifiedTime ON	convert(char(8), A.[modifiedon], 108) =  ModifiedTime.TimeTime
		LEFT JOIN Sonic_DW.dbo.Dim_Date AS DD3 ON cast(A.[sa_closedate] as date) = DD3.FullDate
		LEFT JOIN Sonic_DW.dbo.Dim_LeadStatus AS DLS ON A.sa_opportunitystate = DLS.LeadStatusCode
														AND DLS.Meta_SourceSystemName = 'SCORESMSCRM'
														AND DLS.Meta_RowIsCurrent = 'Y'
		LEFT JOIN Sonic_DW.dbo.DimDealType AS DDT ON A.sa_purchasetype = DDT.Meta_NaturalKey
														AND DDT.Meta_SourceSystemName = 'SCORESMSCRM'
														AND DDT.Meta_RowIsCurrent = 'Y'
		LEFT JOIN #FA ON A.opportunityid = #FA.OpportunityNaturalKey
		LEFT JOIN [L1-DWASQL-02,12010].DMS.dbo.VehicleSalesCurrent vsc ON cast(A.sa_legacycrmid as varchar) = vsc.DealNo
														AND A.dtSold = vsc.ContractDate
		LEFT JOIN Sonic_dw.dbo.Dim_Vehicle vhc ON A.sa_vin = vhc.VehVIN
		LEFT JOIN Sonic_dw.dbo.Dim_Vehicle tradeIn ON vsc.Trade1Vin = tradeIn.VehVIN

	-- clear temp table
	TRUNCATE TABLE etl_staging.wrk.Focus_SCORES_Opportunity_Dup

	-- order data set by vehicle updates
	insert into etl_staging.wrk.Focus_SCORES_Opportunity_Dup
	select RowNumber = row_number() over (partition by metaNaturalKey order by VehicleKey desc)
		,opp.*
	from (select distinct * from etl_staging.wrk.Focus_SCORES_Opportunity_TempTable) opp

	-- clear temp table
	TRUNCATE TABLE etl_staging.wrk.Focus_SCORES_Opportunity_ScoresFactSource

	IF EXISTS(SELECT * FROM ETL_Staging.sys.indexes WHERE object_id = object_id('ETL_Staging.wrk.Focus_SCORES_Opportunity_ScoresFactSource') AND NAME ='IDX_MetaNaturalkey')
		DROP INDEX IDX_MetaNaturalkey ON ETL_Staging.wrk.Focus_SCORES_Opportunity_ScoresFactSource;

	-- remove VehicleKey related duplicates
	insert into etl_staging.wrk.Focus_SCORES_Opportunity_ScoresFactSource
	select *
	from etl_staging.wrk.Focus_SCORES_Opportunity_Dup aa
	where rowNumber = 1

	CREATE INDEX IDX_MetaNaturalkey on etl_staging.wrk.Focus_SCORES_Opportunity_ScoresFactSource(MetaNaturalKey)

	DROP TABLE #FA
	DROP TABLE #MergeSource
	DROP TABLE #liveDealers

	---- delete opportunity records to be updated
	--DELETE opp
	--FROM dbo.factOpportunity opp INNER JOIN etl_staging.wrk.Focus_SCORES_Opportunity_ScoresFactSource src
	--		on opp.Meta_NaturalKey = src.MetaNaturalKey
	--WHERE opp.Meta_SourceSystemName <> 'eleaddw'

	-- populate from temp table
	MERGE dbo.FactOpportunity AS [TGT]
	USING etl_staging.wrk.Focus_SCORES_Opportunity_ScoresFactSource AS [SRC]
		ON SRC.MetaNaturalKey = TGT.Meta_NaturalKey
			AND TGT.Meta_SourceSystemName <> 'eleaddw'
	WHEN MATCHED
		AND (
			SRC.[EntityKey] <> TGT.[EntityKey]
			OR SRC.[FocusCustomerKey] <> TGT.[FocusCustomerKey]
			OR SRC.[SourceKey] <> TGT.[SourceKey]
			OR SRC.[PrimarySalesAssociateKey] <> TGT.[PrimarySalesAssociateKey]
			OR SRC.[DateProspectInKey] <> TGT.[DateProspectInKey]
			OR SRC.[LastActivityDateKey] <> TGT.[LastActivityDateKey]
			OR SRC.[LastActivityTimeKey] <> TGT.[LastActivityTimeKey]
			OR SRC.[DateSoldKey] <> TGT.[DateSoldKey]
			OR SRC.[DMSDateSoldKey] <> TGT.[DMSDateSoldKey]
			OR SRC.[InactiveDateKey] <> TGT.[InactiveDateKey]
			OR SRC.[VehicleKey] <> TGT.[VehicleKey]
			OR SRC.[TradeInVehicleKey] <> TGT.[TradeInVehicleKey]
			OR SRC.[LeadStatusKey] <> TGT.[LeadStatusKey]
			OR SRC.[DealTypeKey] <> TGT.[DealTypeKey]
			OR SRC.[NewVehicleFlag] <> TGT.[NewVehicleFlag]
			OR SRC.[LeadCount] <> TGT.[LeadCount]
			OR SRC.[DuplicateLeadCount] <> TGT.[DuplicateLeadCount]
			OR SRC.[LeadCost] <> TGT.[LeadCost]
			OR SRC.[DaysActive] <> TGT.[DaysActive]
			OR SRC.[SoldCount] <> TGT.[SoldCount]
			OR SRC.[DMSSoldCount] <> TGT.[DMSSoldCount]
			OR SRC.[TradeInCount] <> TGT.[TradeInCount]
			OR SRC.[ApptShowCount] <> TGT.[ApptShowCount]
			OR SRC.[ApptNoShowCount] <> TGT.[ApptNoShowCount]
			OR SRC.[ApptSetCount] <> TGT.[ApptSetCount]
			OR SRC.[ApptSoldCount] <> TGT.[ApptSoldCount]
			OR SRC.[DaysToFirstAppt] <> TGT.[DaysToFirstAppt]
			OR SRC.[EmailSentCount] <> TGT.[EmailSentCount]
			OR SRC.[PhoneCallCount] <> TGT.[PhoneCallCount]
			OR SRC.[CompletedActivityCount] <> TGT.[CompletedActivityCount]
			--OR ISNULL(SRC.[IncompleteActivityCount], 0) <> ISNULL(TGT.[IncompleteActivityCount], 0)
			--OR SRC.[ProspectSurvey] <> TGT.[ProspectSurvey]
			--OR SRC.[DeliveryAppointment] <> TGT.[DeliveryAppointment]
			OR SRC.[FutureActivityCount] <> TGT.[FutureActivityCount]
			OR SRC.[InShowRoomFlag] <> TGT.[InShowRoomFlag]
			OR SRC.[ApptConfFlag] <> TGT.[ApptIsConfirmedFlag]
			OR SRC.[BeBackFlag] <> TGT.[BeBackFlag]
			OR SRC.[DemoFlag] <> TGT.[DemoFlag]
			OR SRC.[WriteUpFlag] <> TGT.[WriteUpFlag]
			--OR ISNULL(SRC.[TOFlag], 0) <> ISNULL(TGT.[TOFlag], 0)
			OR SRC.[ActivityCount] <> TGT.[ActivityCount]
			--OR ISNULL(SRC.[NewProspectFlag], 0) <> ISNULL(TGT.[NewProspectFlag], 0)
			OR SRC.[ScribeDeletedOn] <> TGT.[ScribeDeletedOn]
			OR SRC.sa_opportunitystate_displayname <> TGT.LeadState
			)
		THEN
			UPDATE
			SET TGT.[EntityKey] = SRC.[EntityKey]
				,TGT.[FocusCustomerKey] = SRC.[FocusCustomerKey]
				,TGT.[SourceKey] = SRC.[SourceKey]
				,TGT.[PrimarySalesAssociateKey] = SRC.[PrimarySalesAssociateKey]
				,TGT.[DateProspectInKey] = SRC.[DateProspectInKey]
				,TGT.[LastActivityDateKey] = SRC.[LastActivityDateKey]
				,TGT.[LastActivityTimeKey] = SRC.[LastActivityTimeKey]
				,TGT.[DateSoldKey] = SRC.[DateSoldKey]
				,TGT.[DMSDateSoldKey] = SRC.[DMSDateSoldKey]
				,TGT.[InactiveDateKey] = SRC.[InactiveDateKey]
				,TGT.[VehicleKey] = SRC.[VehicleKey]
				,TGT.[TradeInVehicleKey] = SRC.[TradeInVehicleKey]
				,TGT.[LeadStatusKey] = SRC.[LeadStatusKey]
				,TGT.[DealTypeKey] = SRC.[DealTypeKey]
				,TGT.[NewVehicleFlag] = SRC.[NewVehicleFlag]
				,TGT.[LeadCount] = SRC.[LeadCount]
				,TGT.[DuplicateLeadCount] = SRC.[DuplicateLeadCount]
				,TGT.[LeadCost] = SRC.[LeadCost]
				,TGT.[DaysActive] = SRC.[DaysActive]
				,TGT.[SoldCount] = SRC.[SoldCount]
				,TGT.[DMSSoldCount] = SRC.[DMSSoldCount]
				,TGT.[TradeInCount] = SRC.[TradeInCount]
				,TGT.[ApptShowCount] = SRC.[ApptShowCount]
				,TGT.[ApptNoShowCount] = SRC.[ApptNoShowCount]
				,TGT.[ApptSetCount] = SRC.[ApptSetCount]
				,TGT.[ApptSoldCount] = SRC.[ApptSoldCount]
				,TGT.[DaysToFirstAppt] = SRC.[DaysToFirstAppt]
				,TGT.[EmailSentCount] = SRC.[EmailSentCount]
				,TGT.[PhoneCallCount] = SRC.[PhoneCallCount]
				,TGT.[CompletedActivityCount] = SRC.[CompletedActivityCount]
				--,TGT.[IncompleteActivityCount] = SRC.[IncompleteActivityCount]
				--,TGT.[ProspectSurvey] = SRC.[ProspectSurvey]
				--,TGT.[DeliveryAppointment] = SRC.[DeliveryAppointment]
				,TGT.[FutureActivityCount] = SRC.[FutureActivityCount]
				,TGT.[InShowRoomFlag] = SRC.[InShowRoomFlag]
				,TGT.[ApptIsConfirmedFlag] = SRC.[ApptConfFlag]
				,TGT.[BeBackFlag] = SRC.[BeBackFlag]
				,TGT.[ActivityCount] = SRC.[ActivityCount]
				--,TGT.[NewProspectFlag] = SRC.[NewProspectFlag]
				--,TGT.[MetaComputerName] = SRC.[MetaComputerName]
				--,TGT.[MetaAuditScore] = SRC.[MetaAuditScore]
				--,TGT.[MetaSrcSysId] = SRC.[MetaSrcSysId]
				--,TGT.[MetaSourceSystemName] = SRC.[MetaSourceSystemName]
				----,TGT.[MetaRowEffectiveDate] = SRC.[MetaRowEffectiveDate]
				----,TGT.[MetaRowExpiredDate] = SRC.[MetaRowExpiredDate]
				--,TGT.[MetaRowIsCurrent] = SRC.[MetaRowIsCurrent]
				,TGT.[Meta_RowLastChangedDate] = @MetaLoadDate
				--,TGT.[MetaAuditKey] = SRC.[MetaAuditKey]
				--,TGT.[MetaChecksum] = SRC.[MetaChecksum]
				--,TGT.[MetaNaturalKey] = SRC.[MetaNaturalKey]
				,TGT.[ETLExecution_ID] = SRC.[ETLExecutionID]
				,TGT.[DemoFlag] = SRC.[DemoFlag]
				,TGT.[WriteUpFlag] = SRC.[WriteUpFlag]
				--,TGT.[TOFlag] = SRC.[TOFlag]
				,TGT.[TotalSurveyCount] = SRC.[TotalSurveyCount]
				,TGT.[TotalSurveySoldCount] = SRC.[TotalSurveySoldCount]
				,TGT.[ScribeDeletedOn] = SRC.[ScribeDeletedOn]
				,TGT.LeadState = SRC.sa_opportunitystate_displayname
	WHEN NOT MATCHED
		THEN
			INSERT (
				[EntityKey]
				,[FocusCustomerKey]
				,[SourceKey]
				,[PrimarySalesAssociateKey]
				,[DateProspectInKey]
				,[LastActivityDateKey]
				,[LastActivityTimeKey]
				,[DateSoldKey]
				,[DMSDateSoldKey]
				,[InactiveDateKey]
				,[VehicleKey]
				,[TradeInVehicleKey]
				,[LeadStatusKey]
				,[DealTypeKey]
				,[NewVehicleFlag]
				,[LeadCount]
				,[DuplicateLeadCount]
				,[LeadCost]
				,[DaysActive]
				,[SoldCount]
				,[DMSSoldCount]
				,[TradeInCount]
				,[ApptShowCount]
				,[ApptNoShowCount]
				,[ApptSetCount]
				,[ApptSoldCount]
				,[DaysToFirstAppt]
				,[EmailSentCount]
				,[PhoneCallCount]
				,[CompletedActivityCount]
				--,[IncompleteActivityCount]
				--,[ProspectSurvey]
				--,[DeliveryAppointment]
				,[FutureActivityCount]
				,[InShowRoomFlag]
				,[ApptIsConfirmedFlag]
				,[BeBackFlag]
				,[ActivityCount]
				--,[NewProspectFlag]
				,[Meta_ComputerName]
				,[Meta_LoadDate]
				,[Meta_SrcSysId]
				,[Meta_SourceSystemName]
				,[Meta_RowEffectiveDate]
				,[Meta_RowExpiredDate]
				,[Meta_RowIsCurrent]
				,[Meta_RowLastChangedDate]
				,[Meta_Checksum]
				,[Meta_NaturalKey]
				,[ETLExecution_ID]
				,[DemoFlag]
				,[WriteUpFlag]
				--,[TOFlag]
				,[TotalSurveyCount]
				,[TotalSurveySoldCount]
				,[ScribeDeletedOn]
				,[User_ID]
				,LeadState
				,Meta_OriginalSourceSystem
				,Meta_OriginalSourceSystemID
				,Meta_OriginalDealID
				)
			VALUES (
				SRC.[EntityKey]
				,SRC.[FocusCustomerKey]
				,SRC.[SourceKey]
				,SRC.[PrimarySalesAssociateKey]
				,SRC.[DateProspectInKey]
				,SRC.[LastActivityDateKey]
				,SRC.[LastActivityTimeKey]
				,SRC.[DateSoldKey]
				,SRC.[DMSDateSoldKey]
				,SRC.[InactiveDateKey]
				,SRC.[VehicleKey]
				,SRC.[TradeInVehicleKey]
				,SRC.[LeadStatusKey]
				,SRC.[DealTypeKey]
				,SRC.[NewVehicleFlag]
				,SRC.[LeadCount]
				,SRC.[DuplicateLeadCount]
				,SRC.[LeadCost]
				,SRC.[DaysActive]
				,SRC.[SoldCount]
				,SRC.[DMSSoldCount]
				,SRC.[TradeInCount]
				,SRC.[ApptShowCount]
				,SRC.[ApptNoShowCount]
				,SRC.[ApptSetCount]
				,SRC.[ApptSoldCount]
				,SRC.[DaysToFirstAppt]
				,SRC.[EmailSentCount]
				,SRC.[PhoneCallCount]
				,SRC.[CompletedActivityCount]
				--,SRC.[IncompleteActivityCount]
				--,SRC.[ProspectSurvey]
				--,SRC.[DeliveryAppointment]
				,SRC.[FutureActivityCount]
				,SRC.[InShowRoomFlag]
				,SRC.[ApptConfFlag]
				,SRC.[BeBackFlag]
				,SRC.[ActivityCount]
				--,SRC.[NewProspectFlag]
				,SRC.[MetaComputerName]
				,SRC.[MetaLoadDate]
				,SRC.[MetaSrcSysId]
				,SRC.[MetaSourceSystemName]
				,SRC.[MetaRowEffectiveDate]
				,SRC.[MetaRowExpiredDate]
				,SRC.[MetaRowIsCurrent]
				,SRC.MetaRowLastChangedDate
				,SRC.[MetaChecksum]
				,SRC.[MetaNaturalKey]
				,SRC.[ETLExecutionID]
				,SRC.[DemoFlag]
				,SRC.[WriteUpFlag]
				--,SRC.[TOFlag]
				,SRC.[TotalSurveyCount]
				,SRC.[TotalSurveySoldCount]
				,SRC.[ScribeDeletedOn]
				,@MetaUserId
				,SRC.sa_opportunitystate_displayname
				,SRC.OriginalSourceSystem
				,SRC.OriginalSourceSystemID
				,SRC.sa_legacycrmid
				)
	OUTPUT $ACTION
	INTO @rowcounts;

	--******************* Update FactOpportunityKey values in FactActivity records *************************


	   -- get reference records between activity and opportunity - ('SCORESMSCRM', 'EchoPark SCORES DealerContact')
	   TRUNCATE TABLE etl_staging.wrk.FOCUS_Elead_Update_Keys;

	   IF EXISTS (SELECT Name FROM etl_staging.dbo.sysindexes WHERE Name = 'idx_keys')
		DROP INDEX idx_keys on etl_staging.wrk.FOCUS_Elead_Update_Keys

	   insert into etl_staging.wrk.FOCUS_Elead_Update_Keys
	   select distinct act.FactActivityKey, opp.FactOpportunityKey
		from sonic_dw.dbo.FactActivity act inner join sonic_dw.dbo.FactOpportunity opp
			on act.OpportunityNaturalKey = opp.Meta_NaturalKey
		where act.meta_sourceSystemName in ('SCORESMSCRM', 'EchoPark SCORES DealerContact')
			and opp.meta_sourceSystemName in ('SCORESMSCRM', 'EchoPark SCORES DealerContact')

	   create index idx_keys on etl_staging.wrk.FOCUS_Elead_Update_Keys (FactActivityKey)

		-- update activty records with respective opportunity surrogate key
	   update act
			set FactOpportunityKey = sgt.FactOpportunityKey
		from sonic_dw.dbo.factActivity act inner join etl_staging.wrk.FOCUS_Elead_Update_Keys sgt
					on act.factActivityKey = sgt.FactActivityKey
		 where act.Meta_SourceSystemName in ('SCORESMSCRM', 'EchoPark SCORES DealerContact')

	  -- -- remove activities with no fact opportunity reference
	  -- delete from dbo.factActivity
	  -- where factOpportunityKey is null
			--and meta_SourceSystemName in ('SCORESMSCRM', 'EchoPark SCORES DealerContact')

	   -- clear disk space right away
	   TRUNCATE TABLE etl_staging.wrk.FOCUS_Elead_Update_Keys;


	--******************* Update FactOpportunityKey values in FactActivity records *************************

	SELECT @InsertedRows = [INSERT]
		,@UpdatedRows = [UPDATE]
	FROM (
		SELECT MergeAction
			,1 ROWS
		FROM @rowcounts
		) AS p
	PIVOT(COUNT(rows) FOR p.MergeAction IN (
				[INSERT]
				,[UPDATE]
				,[DELETE]
				)) AS pvt












```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
