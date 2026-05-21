---
name: uspScoresDimVehicleSoughtLoad
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



-- ================================================
-- Author:       Bhramar Chandrakar / Umberto Sartori
-- Create date:  12/02/2016
-- Description:  Inserts/Update Vehicle Sought Load
--
-- ubs - 4/21/2016 - Added a current date for MetaRowEffectiveDate; set MetaRowIsCurrent = 'Y' for new inserts
-- ubs - 4/29/2016 - Changed MERGE join to employ key columns instead of the HASH value of the key columns.
--					 Also changed default values of Model year columns to -1 instead of 0.
-- ubs - 5/3/2016  - Changed source data partition by to "make, model, trim, newUsed, ModelYear, ModelYearFrom, ModelYearTo" from VehicleSoughtHashKey
-- ================================================
CREATE PROCEDURE [dbo].[uspScoresDimVehicleSoughtLoad] (
	@Meta_ComputerName VARCHAR(50)
	,@Meta_SrcSysID INT
	,@Meta_SourceSystemName VARCHAR(20)
	,@User_ID VARCHAR(50)
	,@Meta_LoadDate DATETIME2(7)
	,@ETLExecution_ID INT
	,@InsertedRows INT OUTPUT
	)
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @rowcounts TABLE (MergeAction VARCHAR(20));

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


	MERGE dbo.DimVehicleSought AS [tgt]
	USING (
		SELECT ISNULL(CAST([VehicleSoughtHashKey] AS int), -1) as Meta_Checksum
			,CAST([Make] AS VARCHAR(20)) as Make
			,CAST([Model] AS VARCHAR(100)) as  Model
			,CAST('UNKNOWN' AS VARCHAR(20)) as Style
			,CAST([Trim] AS VARCHAR(128)) as Trim
			,CAST([NewUsed] AS SMALLINT) as NewUsed
			,CAST([ModelYear] AS INT) as ModelYear
			,CAST([ModelYearFrom] AS INT) as ModelYearFrom
			,CAST([ModelYearTo] AS INT) as ModelYearTo
			,@Meta_LoadDate AS MetaRowLastChangedDate		-- select * from ETL_Staging.dbo.StgDimVehicleSought
			,Meta_NaturalKey
			,SourceSystemName
			,SourceSystemID = CASE WHEN SourceSystemName = 'EchoPark SCORES DealerContact' THEN @echoParkSysID
								  WHEN SourceSystemName = 'SCORESMSCRM' THEN @scoresSysID
								  ELSE @unknownSysID
							  END
		FROM (
			SELECT ROW_NUMBER() OVER (
					PARTITION BY make, model, trim, newUsed, ModelYear, ModelYearFrom, ModelYearTo ORDER BY ModifiedOn DESC
					) AS RNDups
				, A.*,
				(make + model + trim + cast(NewUsed as varchar) + cast(modelYear as varchar) + cast(modelYearFrom as varchar) +
				 cast(modelYearTo as varchar)) as Meta_NaturalKey
			FROM (
				SELECT DISTINCT HASHBYTES('SHA1', CAST('UNDEFINED' as varchar(20))) AS VehicleSoughtHashKey
					,ISNULL(ISNULL(DV.VehMakeDesc, sa_make), 'UNKNOWN') AS Make
					,ISNULL((ISNULL(DV.VehModelDesc, sa_model)), 'UNKNOWN') AS Model
					,ISNULL(DVS.sa_trim, 'UNKNOWN') AS Trim
					,ISNULL(DVS.sa_newused, 0) AS NewUsed
					,ISNULL((ISNULL(DV.VehModelYear, DVS.sa_maxyear)), 1900) AS ModelYear
					,CASE
						WHEN DVS.sa_minyear = 0
							THEN ISNULL(DV.VehModelYear, 1900)
						ELSE ISNULL((ISNULL(DVS.sa_minyear, DV.VehModelYear)), 1900)
						END AS ModelYearFrom
					,CASE
						WHEN DVS.sa_maxyear = 0
							THEN ISNULL(DV.VehModelYear, 1900)
						ELSE ISNULL((ISNULL(DVS.sa_maxyear, DV.VehModelYear)), 1900)
						END AS ModelYearTo
					,DVS.modifiedon AS ModifiedOn
					,DVS.SourceSystemName
				FROM ETL_Staging.dbo.StgDimVehicleSought DVS LEFT JOIN dbo.Dim_Vehicle DV
							ON cast(DVS.sa_vin as varchar(17)) = DV.VehVIN
				) AS A
			) AS B
		WHERE RNDups = 1
		) AS [src]
		ON src.Make = tgt.Make
			and src.Model = tgt.Model
			and src.Trim = tgt.Trim
			and src.NewUsed = tgt.NewVehicleFlag
			and src.ModelYear = tgt.ModelYear
			and src.ModelYearFrom = tgt.ModelYearFrom
			and src.ModelYearTo = tgt.ModelYearTo
			and tgt.Meta_SourceSystemName in ('SCORESMSCRM', 'EchoPark SCORES DealerContact')
	WHEN MATCHED and src.Style <> tgt.Style
		THEN
			UPDATE
				SET tgt.Style = src.Style,
					tgt.ETLExecution_ID = @ETLExecution_ID,
					tgt.Meta_RowLastChangedDate = @Meta_LoadDate
	WHEN NOT MATCHED
		THEN
			INSERT (
				[Make]
				,[Model]
				,[Style]
				,[Trim]
				,[NewVehicleFlag]
				,[ModelYear]
				,[ModelYearFrom]
				,[ModelYearTo]
				,[Meta_SrcSysID]
				,[Meta_SourceSystemName]
				,Meta_ComputerName
				,[Meta_RowEffectiveDate]
				,[Meta_RowExpiredDate]
				,[Meta_RowIsCurrent]
				,[Meta_RowLastChangedDate]
				,[Meta_AuditKey]
				,[Meta_AuditScore]
				,[Meta_NaturalKey]
				,Meta_Checksum
				,[User_ID]
				,[Meta_LoadDate]
				,[ETLExecution_ID]
				)
			VALUES (
				SRC.[Make]
				,SRC.[Model]
				,SRC.[Style]
				,SRC.[Trim]
				,SRC.[NewUsed]
				,SRC.[ModelYear]
				,SRC.[ModelYearFrom]
				,SRC.[ModelYearTo]
				,SRC.SourceSystemID
				,SRC.SourceSystemName
				,@Meta_ComputerName
				,@Meta_LoadDate
				,NULL
				,'Y'	-- ubs 4/21/16	- current row for newly inserted rows is 1, since this is a type 1 SCD.
				,@Meta_LoadDate
				,-1
				,-1
				,SRC.Meta_NaturalKey
				,SRC.Meta_CheckSum
				,@User_ID
				,@Meta_LoadDate
				,@ETLExecution_ID
				)
	OUTPUT $ACTION
	INTO @rowcounts;

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
