---
name: usp_LoadFactTrafficSummarySubSource_uat
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - FactTrafficSummarySubSource
dependency_count: 1
parameter_count: 3
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.FactTrafficSummarySubSource** (U )

## Parameters

| Name               | Type | Output | Default |
| ------------------ | ---- | ------ | ------- |
| `@ReadRowCnts`     | int  | Yes    | No      |
| `@InsertedRowCnts` | int  | Yes    | No      |
| `@UpdatedRowCnts`  | int  | Yes    | No      |

## Definition

```sql


-- =================================================
-- Author:       Derrick Davis
-- Create date:  06/12/2023
-- 08/02/2023:	DMD - Added row counts for process management
-- =================================================
CREATE PROCEDURE [dbo].[usp_LoadFactTrafficSummarySubSource]
(
	@ReadRowCnts INT OUTPUT,
	@InsertedRowCnts INT OUTPUT,
	@UpdatedRowCnts INT OUTPUT
)
--(
--	@Meta_ComputerName VARCHAR(50)
--	,@MetaSrcSysID INT
--	,@MetaSourceSystemName VARCHAR(20)
--	,@MetaUserID VARCHAR(50)
--	,@ETLExecution_ID INT
--	)
AS

/* variables */
DECLARE @RowCounts TABLE (MergeAction VARCHAR(20));

	MERGE dbo.FactTrafficSummarySubSource AS [tgt]
	USING (
SELECT DISTINCT
		EntityKey
	  ,isnull(UpTypeKey,-1) as UpTypeKey
      ,[szNewUsed]
      ,dd.datekey as [EventDateKey]
	  ,isnull(dls.leadsourcekey,-1) as LeadSourceKey
	  ,isnull(dlss.leadsubsourcekey,-1) as LeadSubSourceKey
      ,SUM([LeadCount]) [LeadCount]
      ,SUM([ShowroomVisits]) [ShowroomVisits]
      ,SUM([Bebacks]) [Bebacks]
      ,SUM([Sold]) [Sold]
      ,SUM([ApptCreated]) [ApptCreated]
      ,SUM([ApptDue]) [ApptDue]
      ,SUM([ApptShown]) [ApptShown]
      ,SUM([ApptSold]) [ApptSold]
      ,SUM([ApptConfirmed]) [ApptConfirmed]
      ,SUM([ApptAttemptedConfirmed]) [ApptAttemptedConfirmed]
      ,SUM([ApprApptCreated]) [ApprApptCreated]
      ,SUM([ApprApptDue]) [ApprApptDue]
      ,SUM([ApprApptShown]) [ApprApptShown]
      ,SUM([ApprApptAcquired]) [ApprApptAcquired]
      ,SUM([ApprApptConfirmed]) [ApprApptConfirmed]
      ,SUM([Acquired]) [Acquired]
      ,SUM([IsAppraisalAppt]) [IsAppraisalAppt]
      ,SUM([Demos]) [Demos]
      ,SUM([WriteUps]) [WriteUps]
      ,SUM([TOs]) [TOs]
      ,SUM([Appraisals]) [Appraisals]
      ,SUM([Lost]) [Lost]
      ,SUM([BadLead]) [BadLead]
      ,SUM([BoughtElsewhere]) [BoughtElsewhere]
      ,SUM([Reassigned]) [Reassigned]
	  --,getdate() as Meta_Loaddate
	  --,agg.Meta_ComputerName
	  --,agg.Meta_UserID
	  ,MAX(agg.ETLExecutionID) [ETLExecution_ID]
  FROM [ETL_Staging].[dbo].[StageTrafficDailySourceSubSourceAgg] agg
  join sonic_dw.dbo.dim_entity e
  on coalesce(enteleadnewid, enteleadid) = agg.lchildcompanyid
  left join (SELECT DISTINCT MAX(LeadSourceKey) LeadSourceKey, LeadSourceName FROM sonic_dw.dbo.DimLeadSource GROUP BY LeadSourceName) dls
  on LTRIM(RTRIM(ISNULL(agg.szsource,'UNKNOWN'))) = LTRIM(RTRIM(dls.LeadSourceName))
  left join (SELECT DISTINCT MAX(LeadSubSourceKey) LeadSubSourceKey, LeadSubSourceName, eLeadChildCompanyID FROM sonic_dw.dbo.DimLeadSubSource GROUP BY eLeadChildCompanyID,LeadSubSourceName) dlss
  on LTRIM(RTRIM(isnull(agg.szsubsource,'UNKNOWN'))) = LTRIM(RTRIM(dlss.LeadSubSourceName))
  and agg.lchildcompanyid = dlss.eleadChildCompanyId
  left join sonic_dw.dbo.dimUpType ut
  on case when agg.szUpType = 'Showroom Up' then 'Walk-In' else replace(agg.szUpType,'up','') end = ut.UpType
  join sonic_dw.dbo.dim_Date dd
  on dd.fulldate = convert(date,agg.eventdate)
  --where agg.lchildcompanyid = 634

  group by
  	EntityKey
	  ,isnull(UpTypeKey,-1)
      ,[szNewUsed]
      ,dd.datekey
	  ,isnull(dls.leadsourcekey,-1)
	  ,isnull(dlss.leadsubsourcekey,-1)
		) AS src
		ON	src.EntityKey = tgt.EntityKey
		AND src.UpTypeKey = tgt.UpTypeKey
		AND src.szNewUsed = tgt.szNewUsed
		AND src.EventDateKey = tgt.EventDateKey
		AND src.LeadSourceKey = tgt.LeadSourceKey
		AND src.LeadSubSourceKey = tgt.LeadSubSourceKey
	WHEN MATCHED
					AND (
					 tgt.LeadCount <> src.LeadCount
					OR tgt.ShowroomVisits <> src.ShowroomVisits
					OR tgt.Bebacks <> src.Bebacks
					OR tgt.Sold <> src.Sold
					OR tgt.ApptCreated <> src.ApptCreated
					OR tgt.ApptDue <> src.ApptDue
					OR tgt.ApptShown <> src.ApptShown
					OR tgt.ApptSold <> src.ApptSold
					OR tgt.ApptConfirmed <> src.ApptConfirmed
					OR tgt.ApptAttemptedConfirmed <> src.ApptAttemptedConfirmed
					OR tgt.ApprApptCreated <> src.ApprApptCreated
					OR tgt.ApprApptDue <> src.ApprApptDue
					OR tgt.ApprApptShown <> src.ApprApptShown
					OR tgt.ApprApptAcquired <> src.ApprApptAcquired
					OR tgt.ApprApptConfirmed <> src.ApprApptConfirmed
					OR tgt.Acquired <> src.Acquired
					OR tgt.IsAppraisalAppt <> src.IsAppraisalAppt
					OR tgt.Demos <> src.Demos
					OR tgt.WriteUps <> src.WriteUps
					OR tgt.TOs <> src.TOs
					OR tgt.Appraisals <> src.Appraisals
					OR tgt.Lost <> src.Lost
					OR tgt.BadLead <> src.BadLead
					OR tgt.BoughtElsewhere <> src.BoughtElsewhere
					OR tgt.Reassigned <> src.Reassigned
					 )
		THEN UPDATE
			SET	 tgt.LeadCount = src.LeadCount
				,tgt.ShowroomVisits = src.ShowroomVisits
				,tgt.Bebacks = src.Bebacks
				,tgt.Sold = src.Sold
				,tgt.ApptCreated = src.ApptCreated
				,tgt.ApptDue = src.ApptDue
				,tgt.ApptShown = src.ApptShown
				,tgt.ApptSold = src.ApptSold
				,tgt.ApptConfirmed = src.ApptConfirmed
				,tgt.ApptAttemptedConfirmed = src.ApptAttemptedConfirmed
				,tgt.ApprApptCreated = src.ApprApptCreated
				,tgt.ApprApptDue = src.ApprApptDue
				,tgt.ApprApptShown = src.ApprApptShown
				,tgt.ApprApptAcquired = src.ApprApptAcquired
				,tgt.ApprApptConfirmed = src.ApprApptConfirmed
				,tgt.Acquired = src.Acquired
				,tgt.IsAppraisalAppt = src.IsAppraisalAppt
				,tgt.Demos = src.Demos
				,tgt.WriteUps = src.WriteUps
				,tgt.TOs = src.TOs
				,tgt.Appraisals = src.Appraisals
				,tgt.Lost = src.Lost
				,tgt.BadLead = src.BadLead
				,tgt.BoughtElsewhere = src.BoughtElsewhere
				,tgt.Reassigned = src.Reassigned
				,tgt.Meta_ComputerName = HOST_NAME()
				,tgt.Meta_UserID = SYSTEM_USER
				,tgt.Meta_RowLastChangeDate = GETDATE()
				,tgt.ETLExecution_ID = src.ETLExecution_ID
	WHEN NOT MATCHED
		THEN
			INSERT (
				   [EntityKey]
				  ,[UpTypeKey]
				  ,[szNewUsed]
				  ,[EventDateKey]
				  ,[LeadSourceKey]
				  ,[LeadSubSourceKey]
				  ,[LeadCount]
				  ,[ShowroomVisits]
				  ,[Bebacks]
				  ,[Sold]
				  ,[ApptCreated]
				  ,[ApptDue]
				  ,[ApptShown]
				  ,[ApptSold]
				  ,[ApptConfirmed]
				  ,[ApptAttemptedConfirmed]
				  ,[ApprApptCreated]
				  ,[ApprApptDue]
				  ,[ApprApptShown]
				  ,[ApprApptAcquired]
				  ,[ApprApptConfirmed]
				  ,[Acquired]
				  ,[IsAppraisalAppt]
				  ,[Demos]
				  ,[WriteUps]
				  ,[TOs]
				  ,[Appraisals]
				  ,[Lost]
				  ,[BadLead]
				  ,[BoughtElsewhere]
				  ,[Reassigned]
				  ,[ETLExecution_ID]
				  ,[Meta_Loaddate]
				  ,[Meta_ComputerName]
				  ,[Meta_UserID]
				  ,[Meta_RowLastChangeDate]
				)
			VALUES (
					src.[EntityKey]
					,src.[UpTypeKey]
					,src.[szNewUsed]
					,src.[EventDateKey]
					,src.[LeadSourceKey]
					,src.[LeadSubSourceKey]
					,src.[LeadCount]
					,src.[ShowroomVisits]
					,src.[Bebacks]
					,src.[Sold]
					,src.[ApptCreated]
					,src.[ApptDue]
					,src.[ApptShown]
					,src.[ApptSold]
					,src.[ApptConfirmed]
					,src.[ApptAttemptedConfirmed]
					,src.[ApprApptCreated]
					,src.[ApprApptDue]
					,src.[ApprApptShown]
					,src.[ApprApptAcquired]
					,src.[ApprApptConfirmed]
					,src.[Acquired]
					,src.[IsAppraisalAppt]
					,src.[Demos]
					,src.[WriteUps]
					,src.[TOs]
					,src.[Appraisals]
					,src.[Lost]
					,src.[BadLead]
					,src.[BoughtElsewhere]
					,src.[Reassigned]
					,src.[ETLExecution_ID]
					,GETDATE()		--Meta_LoadDate
					,HOST_NAME()	--Meta_ComputerName
					,SYSTEM_USER	--MetaUserID
					,GETDATE()		--[Meta_RowLastChangeDate]
				)

	OUTPUT $ACTION INTO @RowCounts;

/* collect merge counts */
SELECT	@ReadRowCnts = [READ]
		, @InsertedRowCnts = [INSERT]
		, @UpdatedRowCnts = [UPDATE]
FROM	(SELECT MergeAction, 1 ROWS  FROM @RowCounts) AS p
PIVOT	(COUNT(rows) FOR p.MergeAction IN ([READ],[INSERT], [UPDATE])) AS pvt;

























```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
