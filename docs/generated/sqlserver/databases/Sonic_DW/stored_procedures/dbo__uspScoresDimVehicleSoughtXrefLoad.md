---
name: uspScoresDimVehicleSoughtXrefLoad
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




-- =================================================
-- Author:       Bhramar Chandrakar
-- Create date:  01/03/2016
-- Description:  Inserts/Update DimVehicleSoughtXref
--
-- ubs - 4/21/2016 - Added a current date for MetaRowEffectiveDate; set MetaRowIsCurrent = 'Y' for new inserts
-- ubs - 4/26/1016 - Added MATCHED section to MERGE statement
-- ubs - 5/4/2016  - Changed HASHBYTES checksum function to CHECKSUM
-- ubs - 10/26/2016 - Removed VehicleKey as part of the Xref composite key
-- ubs - 12/28/2016 - added date/time keys, NewUsed and NewVehicleFlag
-- =================================================
CREATE PROCEDURE [dbo].[uspScoresDimVehicleSoughtXrefLoad] (
	@Meta_ComputerName VARCHAR(50)
	,@MetaSrcSysID INT
	,@MetaSourceSystemName VARCHAR(20)
	,@MetaUserID VARCHAR(50)
	,@MetaLoadDate DATETIME
	,@ETLExecution_ID INT
	,@InsertedRows INT OUTPUT
	)
AS
BEGIN
	SET NOCOUNT ON;

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

	-- source data
	SELECT DISTINCT ISNULL(CAST(FO.FactOpportunityKey AS VARCHAR), '-1')  + '-' + ISNULL(CAST(DVS.VehicleSoughtKey AS VARCHAR), '-1') + '-' + ISNULL(CAST(FO.VehicleKey AS VARCHAR), '-1') AS Meta_NaturalKey
			,CHECKSUM(CAST(ISNULL(XR.sa_vin, 'UNKNOWN') AS VARCHAR(50)) + CAST(ISNULL(XR.statecode, -1) AS VARCHAR(50))) AS Checksum_type1
			,ISNULL(FO.FactOpportunityKey, - 1) AS FactOpportunityKey
			,ISNULL(DVS.VehicleSoughtKey, -1) AS VehicleSoughtKey
			,ISNULL(XR.sa_vin, 'UNKNOWN') AS VINSought
			,ISNULL(FO.VehicleKey, -1) AS VehicleKey
			,XR.NewUsed
			,XR.NewVehicleFlag
			,StartDate.DateKey AS StartDateKey
			,StartTime.TimeKey AS StartTimeKey
			,EndDate.DateKey AS EndDateKey
			,EndTime.TimeKey AS EndTimeKey
			,DVS.Meta_SourceSystemName
			,SourceSystemID = CASE WHEN DVS.Meta_SourceSystemName = 'EchoPark SCORES DealerContact' THEN @echoParkSysID
								   WHEN DVS.Meta_SourceSystemName = 'SCORESMSCRM' THEN @scoresSysID
							       ELSE @unknownSysID
							  END
	into #data
	FROM ETL_Staging.dbo.StgDimVehicleSoughtXref XR INNER JOIN dbo.DimVehicleSought DVS
				ON CAST(XR.sa_make AS VARCHAR(20)) = DVS.Make
					AND CAST(XR.sa_model AS VARCHAR(100)) = DVS.Model
					AND CAST(XR.sa_trim AS VARCHAR(128)) = DVS.Trim
					AND CAST(XR.NewUsed AS SMALLINT) = DVS.NewVehicleFlag
					AND CAST(XR.ModelYear AS INT) = DVS.ModelYear
					AND CAST(XR.ModelYearFrom AS INT) = DVS.ModelYearFrom
					AND CAST(XR.ModelYearTo AS INT) = DVS. ModelYearTo
														INNER JOIN dbo.FactOpportunity FO
				ON CAST(XR.sa_opportunityid AS VARCHAR(100)) = FO.Meta_NaturalKey
						AND FO.meta_SourceSystemName in ('SCORESMSCRM', 'EchoPark SCORES DealerContact')
														INNER JOIN dbo.Dim_Date StartDate
				ON StartDate.FullDate = CAST(XR.InterestedVehicleStartDate AS DATE)
														INNER JOIN dbo.Dim_Time StartTime
				ON StartTime.TimeTime = CONVERT(CHAR(8), XR.InterestedVehicleStartDate, 114)
														INNER JOIN dbo.Dim_Date EndDate
				ON EndDate.FullDate = CAST(XR.InterestedVehicleEndDate AS DATE)
														INNER JOIN dbo.Dim_Time EndTime
				ON EndTime.TimeTime = CONVERT(CHAR(8), XR.InterestedVehicleEndDate, 114)
	WHERE XR.sa_opportunityid IS NOT NULL
				AND FO.FactOpportunityKey <> -1
				AND DVS.VehicleSoughtKey <> -1

	create index idx_data on #data (FactOpportunityKey, VehicleSoughtKey)


	DECLARE @rowcounts TABLE (MergeAction VARCHAR(20));

	MERGE dbo.DimVehicleSoughtXref AS [tgt]
	USING #data AS src
		ON src.FactOpportunityKey = tgt.FactOpportunityKey
			AND src.VehicleSoughtKey = tgt.VehicleSoughtKey
			AND src.StartDateKey = tgt.InterestedVehicleStartDateKey
			AND	src.StartTimeKey = tgt.InterestedVehicleStartTimeKey
			AND	src.EndDateKey = tgt.InterestedVehicleEndDateKey
			AND src.EndTimeKey = tgt.InterestedVehicleEndTimeKey
	WHEN MATCHED AND src.checksum_type1 <> tgt.meta_checksum
		THEN UPDATE
			SET	tgt.VINSought =	CAST(src.VINSought AS VARCHAR(100))
				,tgt.VehicleKey = src.VehicleKey
				,tgt.NewVehicleFlag = src.NewUsed
				,tgt.Active = src.NewVehicleFlag
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
				,SRC.NewUsed
				,SRC.NewVehicleFlag
				,SRC.StartDateKey
				,SRC.StartTimeKey
				,SRC.EndDateKey
				,SRC.EndTimeKey
				,@MetaLoadDate
				,SRC.SourceSystemID
				,SRC.Meta_SourceSystemName
				,@Meta_ComputerName
				,@MetaLoadDate
				,NULL
				,'Y'
				,@MetaLoadDate
				,-1
				,-1
				,SRC.Meta_NaturalKey
				,SRC.Checksum_Type1
				,@MetaUserID
				,@ETLExecution_ID
				)
	OUTPUT $ACTION
	INTO @rowcounts;

	DROP TABLE #data

	SELECT @InsertedRows = [INSERT]
	FROM (
		SELECT MergeAction
			,1 ROWS
		FROM @rowcounts
		) AS p
	PIVOT(COUNT(rows) FOR p.MergeAction IN ([INSERT])) AS pvt
END
























```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
