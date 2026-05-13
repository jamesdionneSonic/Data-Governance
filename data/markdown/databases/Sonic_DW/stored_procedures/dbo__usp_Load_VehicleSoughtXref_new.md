---
name: usp_Load_VehicleSoughtXref_new
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - DimVehicleSought
  - DimVehicleSoughtXref
  - FactOpportunity
dependency_count: 3
parameter_count: 6
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.DimVehicleSought** (U )
- **dbo.DimVehicleSoughtXref** (U )
- **dbo.FactOpportunity** (U )

## Parameters

| Name                    | Type     | Output | Default |
| ----------------------- | -------- | ------ | ------- |
| `@Meta_ComputerName`    | varchar  | No     | No      |
| `@MetaSrcSysID`         | int      | No     | No      |
| `@MetaSourceSystemName` | varchar  | No     | No      |
| `@MetaUserID`           | varchar  | No     | No      |
| `@MetaLoadDate`         | datetime | No     | No      |
| `@ETLExecution_ID`      | int      | No     | No      |

## Definition

```sql

-- =================================================
-- Author:       Umberto Sartori

-- Update : 1/8/2019 - Added [VOIOriginalPrice] and [VOILastNotifiedPrice] column = NULL for new inserts (RAJ)

-- Create date:  4/23/2016
-- Description:  Inserts/Update DimVehicleSoughtXref
-- ubs - 4/23/2016 - Added a current date for MetaRowEffectiveDate; set MetaRowIsCurrent = 'Y' for new inserts
-- ubs - 12/13/2016 - Added dtStart_NewUsed, dtEnd_NewUsed, bNewUsed and bActiveNewUsed columns to support new/used logic.
-- ubs - 1/6/2017   - changed name of NewVehicleFlag to Active in target dimension.
-- Derrick Davis - 02/24/2021	- Removed used of additional non matching criteria for VehicleKey and VINSought for MERGE UPDATE for dupe fix
-- Derrick Davis - 03/24/2021	- Changed MERGE to match only OpportunityKey and VinSought to combat dupes and update records if other columns don't match and Added rownumber to pull in only unique values
-- Derrick Davis - 08/09/2021	- Changed INNER JOIN to FactOpportunity to LEFT JOIN to get all Vehicle Sought records due eLead Opportunity timing issue
-- Derrick Davis - 04/13/2022	- Changed Active value in DimVehicleSoughtXref to populate from SoughtStillActive (bActive column in source) column instead of NewVehicleFlag
-- =================================================
CREATE PROCEDURE [dbo].[usp_Load_VehicleSoughtXref_new] (
	@Meta_ComputerName VARCHAR(50)
	,@MetaSrcSysID INT
	,@MetaSourceSystemName VARCHAR(20)
	,@MetaUserID VARCHAR(50)
	,@MetaLoadDate DATETIME
	,@ETLExecution_ID INT
	)
AS
BEGIN
	SET NOCOUNT ON;

--DECLARE @Meta_ComputerName VARCHAR(50) = HOST_NAME()
--DECLARE @MetaSrcSysID INT = 2
--DECLARE @MetaSourceSystemName VARCHAR(20) = 'eLeadDW'
--DECLARE @MetaUserID VARCHAR(50) = SYSTEM_USER
--DECLARE @MetaLoadDate DATETIME = GETDATE()
--DECLARE @ETLExecution_ID INT = 107532


	MERGE dbo.DimVehicleSoughtXref AS [tgt]
	USING (
			SELECT * FROM
			(
			SELECT DISTINCT
				ROW_NUMBER() OVER(PARTITION BY fac.FactOpportunityKey,ISNULL(opp.SoughtVIN, 'UNKNOWN') ORDER BY fac.VehicleKey DESC, StartDate.DateKey DESC, EndDate.DateKey DESC, StartTime.TimeKey DESC, EndTime.TimeKey DESC) AS rn
				,ISNULL(fac.FactOpportunityKey,-1) AS [FactOpportunityKey]
				,ISNULL(vs.VehicleSoughtKey, -1) AS VehicleSoughtKey
				,ISNULL(opp.SoughtVIN, 'UNKNOWN') AS VINSought
				,ISNULL(fac.VehicleKey,-1) AS [VehicleKey]
				,ISNULL(opp.SoughtStillActive, 1) SoughtStillActive
				,ISNULL(opp.lOppID,-1) AS [lOppID]
				,opp.NewUsed
				,StartDate.DateKey AS StartDateKey
				,StartTime.TimeKey AS StartTimeKey
				,EndDate.DateKey AS EndDateKey
				,EndTime.TimeKey AS EndTimeKey
				,opp.bActiveNewUsed  AS NewVehicleFlag
				,CONVERT(VARCHAR,opp.Meta_NaturalKey) AS Meta_NaturalKey
				,opp.Meta_OriginalDealid
			FROM etl_staging.[wrk].[Dim_VehicleSoughtXref_Staging] opp LEFT JOIN dbo.FactOpportunity fac
					---ON CAST(opp.lOppID AS VARCHAR) = LEFT(fac.meta_naturalKey, CHARINDEX('-', fac.meta_naturalKey) - 1)
					ON CAST(opp.Meta_OriginalDealid AS VARCHAR) = fac.Meta_OriginalDealID
						AND fac.Meta_SourceSystemName = @MetaSourceSystemName
																       LEFT OUTER JOIN sonic_dw.dbo.Dim_Date StartDate
					ON StartDate.FullDate = CAST(opp.dtStart_NewUsed AS DATE)
																	   LEFT OUTER JOIN sonic_dw.dbo.Dim_Time StartTime
					ON StartTime.TimeTime = CONVERT(CHAR(8), opp.dtStart_NewUsed, 114)
																       LEFT OUTER JOIN sonic_dw.dbo.Dim_Date EndDate
					ON EndDate.FullDate = CAST(opp.dtEnd_NewUsed AS DATE)
																	   LEFT OUTER JOIN sonic_dw.dbo.Dim_Time EndTime
					ON EndTime.TimeTime = CONVERT(CHAR(8), opp.dtEnd_NewUsed, 114)
																	   LEFT OUTER JOIN dbo.DimVehicleSought vs
					ON LTRIM(RTRIM(opp.Make)) = LTRIM(RTRIM(vs.Make))
						AND vs.Meta_SourceSystemName = @MetaSourceSystemName
						AND LTRIM(RTRIM(opp.Model)) = LTRIM(RTRIM(vs.Model))
						--and opp.Style = vs.Style
						AND LTRIM(RTRIM(opp.Trim)) = LTRIM(RTRIM(vs.Trim))
						AND opp.ModelYear = vs.ModelYear
						AND opp.ModelYearFrom = vs.ModelYearFrom
						AND opp.ModelYearTo = vs.ModelYearTo
						AND ISNULL(opp.NewUsed,1) = vs.NewVehicleFlag

			--WHERE opp.LOppID <> -1 -- 08/24/2021 ---Doug/Raj update
			--	AND opp.LOppID IS NOT NULL ---- 08/24/2021 ---Doug/Raj update
			) x
			WHERE x.rn = 1
		) AS src
		ON src.Meta_NaturalKey = tgt.Meta_NaturalKey								---- 08/10/2021: DMD added to pull in all Vehicle Sought records and update opporunity information as it comes in
			AND src.Meta_OriginalDealid = tgt.Meta_OriginalDealid					---- 08/10/2021: DMD added to pull in all Vehicle Sought records and update opporunity information as it comes in
			--AND src.VehicleSoughtKey = tgt.VehicleSoughtKey						---- 03/24/2021: DMD commented out
			--AND src.StartDateKey = tgt.InterestedVehicleStartDateKey
			--AND	src.StartTimeKey = tgt.InterestedVehicleStartTimeKey
			--AND	src.EndDateKey = tgt.InterestedVehicleEndDateKey
			--AND src.EndTimeKey = tgt.InterestedVehicleEndTimeKey
			--AND src.VINSought = tgt.VINSought
			--AND src.soughtStillActive = tgt.Active
			AND tgt.Meta_SourceSystemName = @MetaSourceSystemName
	WHEN MATCHED
		--AND (src.VINSought <> tgt.VINSought OR
		--			  src.VehicleKey <> tgt.VehicleKey
		--			 )
			AND (
				src.VehicleSoughtKey <> tgt.VehicleSoughtKey						---- 03/24/2021: DMD added to update existing records instead of inserting dupes WHEN Matched
			OR	src.FactOpportunityKey <> tgt.FactOpportunityKey					---- 08/10/2021: DMD added to update FactOpportunity when it comes through in eLead load due to timing issues
			OR	src.VINSought <> tgt.VINSought
			OR	src.StartDateKey <> tgt.InterestedVehicleStartDateKey
			OR	src.StartTimeKey <> tgt.InterestedVehicleStartTimeKey
			OR	src.EndDateKey <> tgt.InterestedVehicleEndDateKey
			OR	src.EndTimeKey <> tgt.InterestedVehicleEndTimeKey
			--OR	src.soughtStillActive <> tgt.Active
				)
		THEN UPDATE
			SET	 tgt.VehicleSoughtKey = src.VehicleSoughtKey
				,tgt.FactOpportunityKey = src.FactOpportunityKey
				,tgt.VehicleKey = src.VehicleKey
				,tgt.InterestedVehicleStartDateKey = src.StartDateKey			---- 03/24/2021: DMD added to update existing records instead of inserting dupes
				,tgt.InterestedVehicleStartTimeKey = src.StartTimeKey			---- 03/24/2021: DMD added to update existing records instead of inserting dupes
				,tgt.InterestedVehicleEndDateKey = src.EndDateKey				---- 03/24/2021: DMD added to update existing records instead of inserting dupes
				,tgt.InterestedVehicleEndTimeKey = src.EndTimeKey				---- 03/24/2021: DMD added to update existing records instead of inserting dupes
				,tgt.Active = src.SoughtStillActive
				,tgt.NewVehicleFlag = src.NewUsed
				,tgt.ETLExecution_ID = @ETLExecution_ID
				,tgt.Meta_RowLastChangedDate = @MetaLoadDate
	WHEN NOT MATCHED
		THEN
			INSERT (
				FactOpportunityKey
				,VehicleSoughtKey
				,VINSought
				,VehicleKey
				,NewVehicleFlag
				,Active
				,InterestedVehicleStartDateKey
				,InterestedVehicleStartTimeKey
				,InterestedVehicleEndDateKey
				,InterestedVehicleEndTimeKey
				,Meta_LoadDate
				,Meta_SrcSysID
				,Meta_SourceSystemName
				,Meta_ComputerName
				,Meta_RowEffectiveDate
				,Meta_RowExpiredDate
				,Meta_RowIsCurrent
				,Meta_RowLastChangedDate
				,Meta_AuditKey
				,Meta_AuditScore
				,Meta_NaturalKey
				,Meta_Checksum
				,[User_ID]
				,ETLExecution_ID
				,[VOIOriginalPrice]
                ,[VOILastNotifiedPrice]
				,[Meta_OriginalDealid]
				)
			VALUES (
				SRC.FactOpportunityKey
				,SRC.VehicleSoughtKey
				,SRC.VINSought
				,SRC.VehicleKey
				,SRC.NewUsed
				,SRC.SoughtStillActive				---- 04/13/2022: DMD corrected to fix numerous NULL values in Active which should not be
				,SRC.StartDateKey
				,SRC.StartTimeKey
				,SRC.EndDateKey
				,SRC.EndTimeKey
				,@MetaLoadDate
				,@MetaSrcSysID
				,@MetaSourceSystemName
				,@Meta_ComputerName
				,@MetaLoadDate
				,NULL
				,'Y'
				,@MetaLoadDate
				,-1
				,-1
				,[Meta_NaturalKey]
				,-1
				,@MetaUserID
				,@ETLExecution_ID
				,NULL
				,NULL
				,[Meta_OriginalDealid]
				);

END


























```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
