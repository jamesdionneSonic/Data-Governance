---
name: usp_Load_FactOpportunity_BK_03212018
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






/************************************************************	 exec [dbo].[usp_Load_FactOpportunity] 9299
--
-- Created By ubs on 5/24/2016
-- Load query to create FactOpportunity dw data set

---- 5/24/16 ubs - first draft
---- 6/22/16 ubs - added MetaActionFlag filter to "NOT MATCHED" section
---- 12/7/16 ubs - added code to update FactOpportunityKey in FactActivity records after MERGE.
*************************************************************/
CREATE procedure [dbo].[usp_Load_FactOpportunity]
	@ETLExecutionID int,
	@SourceSystemName varchar(40)
AS

SET NOCOUNT ON;

BEGIN

	--SELECT MetaNaturalKey, count(*) as cnt
	--INTO #dup
	--FROM ETL_Staging.clean.FactOpportunity	-- select * from etl_staging.clean.factOpportunity	--	select count(*) from dbo.factOpportunity where etlexecution_id = 55643
	--WHERE ETLExecutionID = @ETLExecutionID
	--GROUP BY MetaNaturalKey
	--HAVING count(*) > 1

	--DELETE FROM ETL_Staging.clean.FactOpportunity
	--WHERE MetaNaturalKey in (SELECT MetaNaturalKey FROM #dup)

-----------------------------update 01/31/2018 RAJ/LANA----------------------
;WITH CTE AS
(
SELECT
MetaNaturalKey,
ROW_NUMBER() OVER (PARTITION BY MetaNaturalKey ORDER BY MetaNaturalKey ) AS RN
FROM ETL_Staging.clean.FactOpportunity
WHERE ETLExecutionID = @ETLExecutionID
)
DELETE from CTE WHERE RN<>1
-----------------------------update 01/31/2018 RAJ/LANA----------------------

	-- new opportunities need the surrogate key set to NULL for the MERGE to enable INSERT
	UPDATE ETL_Staging.clean.FactOpportunity
	set FactOpportunityKey = null where factOpportunityKey = -1

	MERGE dbo.FactOpportunity AS fac
		USING ETL_Staging.clean.FactOpportunity AS opp
		ON fac.FactOpportunityKey = opp.FactOpportunityKey
			AND opp.ETLExecutionID = @ETLExecutionID AND opp.MetaActionFlag = 1
		WHEN MATCHED
			THEN UPDATE
				SET fac.LastActivityDateKey  = opp.LastActivityDateKey
					,fac.TradeinCount = opp.lTradeinCount
					,fac.BeBackFlag = opp.BeBackFlag
					,fac.NewProspectFlag = opp.NewProspectFlag
					,fac.CompletedActivityCount = opp.CompletedActivityCount
					,fac.IncompleteActivityCount = opp.IncompleteActivityCount
					,fac.ActivityCount = opp.ActivityCount
					,fac.FutureActivityCount = opp.FutureActivityCount
					,fac.ApptNoShowCount = opp.ApptNoShowCount
					,fac.ApptShowCount = opp.ApptShowCount
					,fac.ApptSetCount = opp.ApptSetCount
					,fac.ApptSoldCount = opp.ApptSoldCount
					,fac.PhoneCallCount = opp.PhoneCallCount
					,fac.EmailSentCount = opp.EmailSentCount
					,fac.DaysToFirstAppt = opp.DaysToFirstAppt
					,fac.InShowRoomFlag = opp.InShowRoomFlag
					,fac.ApptIsConfirmedFlag = opp.ApptIsConfirmed
					,fac.LeadState = opp.LeadState
					,fac.DemoFlag = opp.Demo
					,fac.WriteUpFlag = opp.WriteUp
					,fac.[TOFlag] = opp.[TO]
					,fac.TotalSurveyCount = opp.TotalSurveyCount
					,fac.Meta_RowLastChangedDate = opp.MetaRowLastChangeDate
					,fac.ETLExecution_ID = opp.ETLExecutionID
		WHEN NOT MATCHED
			THEN INSERT(EntityKey,
						[FocusCustomerKey],
						SourceKey,
						PrimarySalesAssociateKey,
						DateProspectInKey,
						LastActivityDateKey,
						LastActivityTimeKey,
						DateSoldKey,
						DMSDateSoldKey,
						InactiveDateKey,
						VehicleKey,
						TradeInVehicleKey,
						LeadStatusKey,
						DealTypeKey,
						LeadState,
						NewVehicleFlag,
						LeadCount,
						DuplicateLeadCount,
						LeadCost,
						DaysActive,
						SoldCount,
						DMSSoldCount,
						TradeinCount,
						BeBackFlag,
						NewProspectFlag,
						CompletedActivityCount,
						IncompleteActivityCount,
						ActivityCount,
						FutureActivityCount,
						ApptNoShowCount,
						ApptShowCount,
						ApptSetCount,
						ApptSoldCount,
						PhoneCallCount,
						EmailSentCount,
						DaysToFirstAppt,
						InShowRoomFlag,
						ApptIsConfirmedFlag,
						DemoFlag,
						WriteUpFlag,
						[TOFlag],
						TotalSurveyCount,
						TotalSurveySoldCount,
						Meta_LoadDate,
						Meta_SrcSysID,
						Meta_RowEffectiveDate,
						Meta_RowExpiredDate,
						Meta_RowIsCurrent,
						Meta_SourceSystemName,
						Meta_ComputerName,
						Meta_RowLastChangedDate,
						Meta_AuditKey,
						Meta_AuditScore,
						Meta_NaturalKey,
						Meta_Checksum,
						ETLExecution_ID,
						[user_id],
						[Meta_OriginalSourceSystem],
						[Meta_OriginalSourceSystemID],
						Meta_OriginalDealID
					)
					VALUES(opp.EntityKey,
								opp.DimCustomerID,
								opp.SourceKey,
								opp.PrimarySalesAssociate,
								opp.DateProspectInKey,
								opp.LastActivityDateKey,
								opp.LastActivityTimeKey,
								opp.DateSoldKey,
								opp.DMSDateSoldKey,
								opp.InactiveDateKey,
								opp.VehicleKey,
								opp.TradeInVehicleKey,
								opp.LeadStatusKey,
								opp.DealTypeKey,
								opp.LeadState,
								opp.NewVehicleFlag,
								opp.LeadCount,
								opp.DuplicateLeadCount,
								opp.LeadCost,
								opp.DaysActive,
								opp.SoldCount,
								opp.DMSSoldCount,
								opp.lTradeinCount,
								opp.BeBackFlag,
								opp.NewProspectFlag,
								opp.CompletedActivityCount,
								opp.IncompleteActivityCount,
								opp.ActivityCount,
								opp.FutureActivityCount,
								opp.ApptNoShowCount,
								opp.ApptShowCount,
								opp.ApptSetCount,
								opp.ApptSoldCount,
								opp.PhoneCallCount,
								opp.EmailSentCount,
								opp.DaysToFirstAppt,
								opp.InShowRoomFlag,
								opp.ApptIsConfirmed,
								opp.Demo,
								opp.WriteUp,
								opp.[TO],
								opp.TotalSurveyCount,
								opp.TotalSurveySoldCount,
								opp.MetaRowEffectiveDate,
								opp.MetaSrcSysID,
								opp.MetaRowEffectiveDate,
								opp.MetaRowExpiredDate,
								opp.MetaRowIsCurrent,
								opp.MetaSourceSystemName,
								opp.MetaComputerName,
								opp.MetaRowLastChangeDate,
								opp.MetaAuditKey,
								opp.MetaAuditScore,
								opp.MetaNaturalKey,
								opp.MetaChecksum,
								opp.ETLExecutionID,
								opp.[user_id],
								opp.MetaSourceSystemName,
								opp.MetaSrcSysID,
								left (opp.MetaNaturalKey, charindex('-', opp.MetaNaturalKey) - 1)
							  );
END



	   --******************* Update FactOpportunityKey values in FactActivity records *************************

	   -- get reference records between activity and opportunity - eLead
	   TRUNCATE TABLE etl_staging.wrk.FOCUS_Elead_Update_Keys;

	   IF EXISTS (SELECT Name FROM etl_staging.dbo.sysindexes WHERE Name = 'idx_keys')
			DROP INDEX idx_keys on etl_staging.wrk.FOCUS_Elead_Update_Keys

	   insert into etl_staging.wrk.FOCUS_Elead_Update_Keys
	   select distinct act.FactActivityKey, opp.FactOpportunityKey
		from sonic_dw.dbo.FactActivity act inner join sonic_dw.dbo.FactOpportunity opp
			on act.OpportunityNaturalKey = opp.Meta_NaturalKey
		where act.ETLExecution_ID = @ETLExecutionID
			and act.meta_sourceSystemName = 'eLeadDW'
			and opp.meta_sourceSystemName = 'eLeadDW'

	   create index idx_keys on etl_staging.wrk.FOCUS_Elead_Update_Keys (FactActivityKey)

		-- update activty records with respective opportunity surrogate key
	   update act
			set FactOpportunityKey = sgt.FactOpportunityKey
		from sonic_dw.dbo.factActivity act inner join etl_staging.wrk.FOCUS_Elead_Update_Keys sgt
					on act.factActivityKey = sgt.FactActivityKey
		 where act.Meta_SourceSystemName = 'eLeadDW'

	  -- -- remove activities with no fact opportunity reference
	  -- delete from dbo.factActivity
	  -- where factOpportunityKey is null
			--and meta_SourceSystemName = 'eLeadDW'

	   -- clear disk space right away
	   TRUNCATE TABLE etl_staging.wrk.FOCUS_Elead_Update_Keys;


	   --******************* Update FactOpportunityKey values in FactActivity records *************************


		-- soft delete records which have been marked to remove
		update opp
			set Meta_RowIsCurrent = 'N'
		from dbo.FactOpportunity opp inner join ETL_Staging.dbo.dwFullOpportunity cl
				on opp.Meta_NaturalKey = cast(cl.lDealID as varchar) + '-' + cast(isnull(cl.lvehicleID, -1) as varchar)
					and opp.Meta_SourceSystemName = 'eLeadDW'
					and cl.ETLExecution_ID = @ETLExecutionID
					and cl.dwActive = 0




















```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
