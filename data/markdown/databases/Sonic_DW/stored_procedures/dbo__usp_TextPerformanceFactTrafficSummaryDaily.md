---
name: usp_TextPerformanceFactTrafficSummaryDaily
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - FactTrafficSummaryDaily
dependency_count: 1
parameter_count: 0
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.FactTrafficSummaryDaily** (U )

## Definition

```sql



-- =================================================
-- Author:       Derrick Davis
-- Create date:  08/9/2024

------------------------CHANGES---------------------
-- 09/20/2024 - Added parameters in SRC query to get rid of NULL EntityKeys
-- =================================================
CREATE PROC [dbo].[usp_TextPerformanceFactTrafficSummaryDaily]
--(
--	@ReadRowCnts INT OUTPUT,
--	@InsertedRowCnts INT OUTPUT,
--	@UpdatedRowCnts INT OUTPUT
--)
--(
--	@Meta_ComputerName VARCHAR(50)
--	,@MetaSrcSysID INT
--	,@MetaSourceSystemName VARCHAR(20)
--	,@MetaUserID VARCHAR(50)
--	,@ETLExecution_ID INT
--	)
AS
BEGIN
	SET NOCOUNT ON;

-------------Begin MERGE-----------------------

	MERGE dbo.FactTrafficSummaryDaily AS [tgt]
	USING (
    SELECT tp.EntityKey
      ,tp.szUpType
      ,ISNULL(u.UpTypeKey,-1) AS UpTypeKey
      ,tp.szNewUsed
      ,tp.FiscalMonthDateKey
      ,SUM(tp.LeadCount) AS TextLeadCount
      ,SUM(tp.OptInRequest) AS TextOptInRequest
      ,SUM(tp.NoOptInRequest) AS TextNoOptInRequest
      ,SUM(tp.OptIn) AS TextOptIn
      ,SUM(tp.OptOut) AS TextOptOut
      ,SUM(tp.TextSent) AS TextSent
      ,SUM(tp.TextReceived) AS TextReceived
      ,SUM(tp.TxtAppt) AS TextAppt
      ,SUM(tp.TxtSold) AS TextSold
      ,SUM(tp.LeadCountNoPhone) AS TextLeadCountNoPhone
      ,SUM(tp.OptInRequestNoPhone) AS TextOptInRequestNoPhone
      ,SUM(tp.NoOptInRequestNoPhone) AS TextNoOptInRequestNoPhone
      ,SUM(tp.OptInNoPhone) AS TextOptInNoPhone
      ,SUM(tp.OptOutNoPhone) AS TextOptOutNoPhone
      ,SUM(tp.TextSentNoPhone) AS TextSentNoPhone
      ,SUM(tp.TextReceivedNoPhone) AS TextReceivedNoPhone
      ,SUM(tp.TxtApptNoPhone) AS TextApptNoPhone
      ,SUM(tp.TxtSoldNoPhone) AS TextSoldNoPhone
    FROM ETL_Staging.dbo.[StageTrafficTextPerformance] tp
    JOIN Sonic_DW.dbo.DimUpType u
     ON LTRIM(RTRIM(tp.szUpType)) = LTRIM(RTRIM(ISNULL(u.szUpType,u.UpType)))
	 WHERE tp.EntityKey IS NOT NULL
    GROUP BY tp.EntityKey
      ,tp.szUpType
      ,ISNULL(u.UpTypeKey,-1)
      ,tp.szNewUsed
      ,FiscalMonthDateKey
		) AS src
		ON	src.EntityKey = tgt.EntityKey
		AND src.FiscalMonthDateKey = tgt.FiscalMonthDateKey
		AND src.UpTypeKey = tgt.UpTypeKey
		AND LTRIM(RTRIM(src.szNewUsed)) = LTRIM(RTRIM(tgt.szNewUsed))
	WHEN MATCHED
					AND (
					   ISNULL(tgt.TextLeadCount,0) <> src.TextLeadCount
					OR ISNULL(tgt.TextOptInRequest,0) <> src.TextOptInRequest
					OR ISNULL(tgt.TextNoOptInRequest,0) <> src.TextNoOptInRequest
					OR ISNULL(tgt.TextOptIn,0) <> src.TextOptIn
					OR ISNULL(tgt.TextOptOut,0) <> src.TextOptOut
					OR ISNULL(tgt.TextSent,0) <> src.TextSent
					OR ISNULL(tgt.TextReceived,0) <> src.TextReceived
					OR ISNULL(tgt.TextAppt,0) <> src.TextAppt
					OR ISNULL(tgt.TextSold,0) <> src.TextSold
					OR ISNULL(tgt.TextLeadCountNoPhone,0) <> src.TextLeadCountNoPhone
					OR ISNULL(tgt.TextOptInRequestNoPhone,0) <> src.TextOptInRequestNoPhone
					OR ISNULL(tgt.TextNoOptInRequestNoPhone,0) <> src.TextNoOptInRequestNoPhone
					OR ISNULL(tgt.TextOptInNoPhone,0) <> src.TextOptInNoPhone
					OR ISNULL(tgt.TextOptOutNoPhone,0) <> src.TextOptOutNoPhone
					OR ISNULL(tgt.TextSentNoPhone,0) <> src.TextSentNoPhone
					OR ISNULL(tgt.TextReceivedNoPhone,0) <> src.TextReceivedNoPhone
					OR ISNULL(tgt.TextApptNoPhone,0) <> src.TextApptNoPhone
					OR ISNULL(tgt.TextSoldNoPhone,0) <> src.TextSoldNoPhone
					 )
		THEN UPDATE
			SET	 tgt.TextLeadCount = src.TextLeadCount
				,tgt.TextOptInRequest = src.TextOptInRequest
				,tgt.TextNoOptInRequest = src.TextNoOptInRequest
				,tgt.TextOptIn = src.TextOptIn
				,tgt.TextOptOut = src.TextOptOut
				,tgt.TextSent = src.TextSent
				,tgt.TextReceived = src.TextReceived
				,tgt.TextAppt = src.TextAppt
				,tgt.TextSold = src.TextSold
				,tgt.TextLeadCountNoPhone = src.TextLeadCountNoPhone
				,tgt.TextOptInRequestNoPhone = src.TextOptInRequestNoPhone
				,tgt.TextNoOptInRequestNoPhone = src.TextNoOptInRequestNoPhone
				,tgt.TextOptInNoPhone = src.TextOptInNoPhone
				,tgt.TextOptOutNoPhone = src.TextOptOutNoPhone
				,tgt.TextSentNoPhone = src.TextSentNoPhone
				,tgt.TextReceivedNoPhone = src.TextReceivedNoPhone
				,tgt.TextApptNoPhone = src.TextApptNoPhone
				,tgt.TextSoldNoPhone = src.TextSoldNoPhone
				,tgt.Meta_ComputerName = HOST_NAME()
				,tgt.Meta_UserID = SYSTEM_USER
				,tgt.Meta_RowLastChangeDate = GETDATE()
	WHEN NOT MATCHED
		THEN
			INSERT (
				   [EntityKey]
				  ,[UpTypeKey]
				  ,szUpType
				  ,[szNewUsed]
				  ,FiscalMonthDateKey
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
				  ,TextLeadCount
				  ,TextOptInRequest
				  ,TextNoOptInRequest
				  ,TextOptIn
				  ,TextOptOut
				  ,TextSent
				  ,TextReceived
				  ,TextAppt
				  ,TextSold
				  ,TextLeadCountNoPhone
				  ,TextOptInRequestNoPhone
				  ,TextNoOptInRequestNoPhone
				  ,TextOptInNoPhone
				  ,TextOptOutNoPhone
				  ,TextSentNoPhone
				  ,TextReceivedNoPhone
				  ,TextApptNoPhone
				  ,TextSoldNoPhone
				  ,[ETLExecution_ID]
				  ,[Meta_Loaddate]
				  ,[Meta_ComputerName]
				  ,[Meta_UserID]
				  ,[Meta_RowLastChangeDate]
				)
			VALUES (
					src.[EntityKey]
					,src.[UpTypeKey]
					,src.szUpType
					,src.[szNewUsed]
					,src.FiscalMonthDateKey
					,0		 --[LeadCount]
					,0       --[ShowroomVisits]
					,0       --[Bebacks]
					,0       --[Sold]
					,0       --[ApptCreated]
					,0       --[ApptDue]
					,0       --[ApptShown]
					,0       --[ApptSold]
					,0       --[ApptConfirmed]
					,0       --[ApptAttemptedConfirmed]
					,0       --[ApprApptCreated]
					,0       --[ApprApptDue]
					,0       --[ApprApptShown]
					,0       --[ApprApptAcquired]
					,0       --[ApprApptConfirmed]
					,0       --[Acquired]
					,0       --[IsAppraisalAppt]
					,0       --[Demos]
					,0       --[WriteUps]
					,0       --[TOs]
					,0       --[Appraisals]
					,0       --[Lost]
					,0       --[BadLead]
					,0       --[BoughtElsewhere]
					,0       --[Reassigned]
					,src.TextLeadCount
					,src.TextOptInRequest
					,src.TextNoOptInRequest
					,src.TextOptIn
					,src.TextOptOut
					,src.TextSent
					,src.TextReceived
					,src.TextAppt
					,src.TextSold
					,src.TextLeadCountNoPhone
					,src.TextOptInRequestNoPhone
					,src.TextNoOptInRequestNoPhone
					,src.TextOptInNoPhone
					,src.TextOptOutNoPhone
					,src.TextSentNoPhone
					,src.TextReceivedNoPhone
					,src.TextApptNoPhone
					,src.TextSoldNoPhone
					,(SELECT MAX([ETLExecution_ID]) FROM Sonic_DW.dbo.FactTrafficSummaryDaily)	--[ETLExecution_ID]
					,GETDATE()		--Meta_LoadDate
					,HOST_NAME()	--Meta_ComputerName
					,SYSTEM_USER	--MetaUserID
					,GETDATE()		--[Meta_RowLastChangeDate]
				);

END
























```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
