---
name: usp_Load_VehicleSoughtXref
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
-- Create date:  4/23/2016
-- Description:  Inserts/Update DimVehicleSoughtXref
--o
-- ubs - 4/23/2016 - Added a current date for MetaRowEffectiveDate; set MetaRowIsCurrent = 'Y' for new inserts
-- ubs - 12/13/2016 - Added dtStart_NewUsed, dtEnd_NewUsed, bNewUsed and bActiveNewUsed columns to support new/used logic.
-- ubs - 1/6/2017   - changed name of NewVehicleFlag to Active in target dimension.
-- =================================================
CREATE PROCEDURE [dbo].[usp_Load_VehicleSoughtXref] (
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

	MERGE dbo.DimVehicleSoughtXref AS [tgt]
	USING (
			SELECT DISTINCT fac.FactOpportunityKey
				,ISNULL(vs.VehicleSoughtKey, -1) AS VehicleSoughtKey
				,ISNULL(opp.SoughtVIN, 'UNKNOWN') AS VINSought
				,fac.VehicleKey
				,ISNULL(opp.SoughtStillActive, 1) SoughtStillActive
				,opp.lOppID
				,opp.NewUsed
				,StartDate.DateKey AS StartDateKey
				,StartTime.TimeKey AS StartTimeKey
				,EndDate.DateKey AS EndDateKey
				,EndTime.TimeKey AS EndTimeKey
				,opp.bActiveNewUsed  AS NewVehicleFlag
			FROM etl_staging.[wrk].[Dim_VehicleSoughtXref_Staging] opp INNER JOIN dbo.FactOpportunity fac
					ON CAST(opp.lOppID AS VARCHAR) = LEFT(fac.meta_naturalKey, CHARINDEX('-', fac.meta_naturalKey) - 1)
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
					ON opp.Make = vs.Make
						AND vs.Meta_SourceSystemName = @MetaSourceSystemName
						AND opp.Model = vs.Model
						--and opp.Style = vs.Style
						AND opp.Trim = vs.Trim
						AND opp.ModelYear = vs.ModelYear
						AND opp.ModelYearFrom = vs.ModelYearFrom
						AND opp.ModelYearTo = vs.ModelYearTo
						AND opp.NewUsed = vs.NewVehicleFlag

			WHERE opp.LOppID <> -1
				AND opp.LOppID IS NOT NULL
		) AS src
		ON src.FactOpportunityKey = tgt.FactOpportunityKey
			AND src.VehicleSoughtKey = tgt.VehicleSoughtKey
			AND src.StartDateKey = tgt.InterestedVehicleStartDateKey
			AND	src.StartTimeKey = tgt.InterestedVehicleStartTimeKey
			AND	src.EndDateKey = tgt.InterestedVehicleEndDateKey
			AND src.EndTimeKey = tgt.InterestedVehicleEndTimeKey
			AND src.VINSought = tgt.VINSought
			AND src.soughtStillActive = tgt.Active
			AND tgt.Meta_SourceSystemName = @MetaSourceSystemName
	WHEN MATCHED AND (src.VINSought <> tgt.VINSought OR
					  src.VehicleKey <> tgt.VehicleKey
					 )
		THEN UPDATE
			SET	tgt.VINSought = src.VINSought
				,tgt.VehicleKey = src.VehicleKey
				,tgt.Active = src.NewVehicleFlag
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
				)
			VALUES (
				SRC.FactOpportunityKey
				,SRC.VehicleSoughtKey
				,SRC.VINSought
				,SRC.VehicleKey
				,NewUsed
				,NewVehicleFlag
				,StartDateKey
				,StartTimeKey
				,EndDateKey
				,EndTimeKey
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
				,''
				,-1
				,@MetaUserID
				,@ETLExecution_ID
				);

END























```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
