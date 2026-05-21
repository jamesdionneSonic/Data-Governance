---
name: usp_DimVehicle
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


/* ************************************************************************************************* */
/* Author: Jo Carter	Date: 2018-01-17	Change: Creation										 */
/* Modified: Jo Carter	Date: 2018-06-14	Change: when UVC is not null - record cant be updated	 */
/* Modified: Jo Carter	Date: 2018-07-12	Change: pull standard color from source					 */
/* ************************************************************************************************* */

CREATE PROCEDURE [dbo].[usp_DimVehicle]
(
	@InsertedRowCnts INT OUTPUT,
	@UpdatedRowCnts INT OUTPUT
)
AS
SET NOCOUNT ON;


/* ************************************************************************************ */
/* Vin's can be in more than once Source ********************************************** */
/* Update the Flag by SourceSystemWeight as to which Vin is processed ***************** */
/* ************************************************************************************ */
UPDATE	[tgt]
SET		[ToProcessFlag] = 1
FROM	(
		SELECT	[Vin], MAX([Meta_SourceSystemWeight]) AS MaxWeight
		FROM	[SynWrkDimVehicleVehicle]
		group BY [Vin]
		) AS src
		inner JOIN SynWrkDimVehicleVehicle AS tgt
			ON [src].[Vin] = [tgt].[vin]
			AND [src].[MaxWeight] = [tgt].[Meta_SourceSystemWeight];


/* ************************************************************************************ */
/* Insert Missing BodyStyle IDs ******************************************************* */
/* ************************************************************************************ */
INSERT INTO [dbo].[DimVehicleBodyStyle](
	BodyStyleDescription
	, StandardBodyStyle
	, SourceBodyStyleCode
	, SourceSystemId
	, Meta_ComputerName
	, Meta_LoadDate
	, Meta_RowLastChangeDate
	, Meta_UserID
)
SELECT	DISTINCT [src].[BodyStyle]
		, 'Needs Mapping' AS StandardBodyStyle
		, [src].[BodyStyle] AS SourceBodyStyleCode
		, [src].[Meta_Src_Sys_ID] AS SourceSystemID
		, [src].[Meta_ComputerName]
		, SYSDATETIME() AS Meta_LoadDate
		, SYSDATETIME() AS Meta_RowLastChangeDate
		, [src].[Meta_UserID]
from	[SynWrkDimVehicleVehicle] AS src
		LEFT JOIN [dbo].[DimVehicleBodyStyle] AS tgt
			ON [src].[Meta_Src_Sys_ID] = [tgt].[SourceSystemID]
			AND [src].[BodyStyle] = [tgt].[SourceBodyStyleCode]
WHERE	[tgt].[VehicleBodyStyleId] IS NULL
		AND [src].[BodyStyle] IS NOT NULL
		AND [src].[ToProcessFlag] = 1;
/* Update BodyStyle IDs *************************************************************** */
UPDATE	[tgt]
SET		[tgt].[BodyStyleId] = [src].[VehicleBodyStyleID]
FROM	[SynWrkDimVehicleVehicle] AS tgt
		INNER JOIN [dbo].[DimVehicleBodyStyle] AS src
			ON [tgt].[Meta_Src_Sys_ID] = [src].[SourceSystemID]
			AND [tgt].[BodyStyle] = [src].[SourceBodyStyleCode];





/* ************************************************************************************ */
/* Insert Missing Cab IDs ************************************************************* */
/* ************************************************************************************ */
INSERT INTO [dbo].[DimVehicleCab](
	CabDescription
	, StandardCabDescription
	, SourceCabCode
	, SourceSystemId
	, Meta_ComputerName
	, Meta_LoadDate
	, Meta_RowLastChangeDate
	, Meta_UserID
)
SELECT	DISTINCT [src].[CabDescription]
		, 'Needs Mapping' AS StandardCabDescription
		, [src].[CabDescription] AS SourceCabCode
		, [src].[Meta_Src_Sys_ID] AS SourceSystemID
		, [src].[Meta_ComputerName]
		, SYSDATETIME() AS Meta_LoadDate
		, SYSDATETIME() AS Meta_RowLastChangeDate
		, [src].[Meta_UserID]
from	[SynWrkDimVehicleVehicle] AS src
		LEFT JOIN [dbo].[DimVehicleCab] AS tgt
			ON [src].[Meta_Src_Sys_ID] = [tgt].[SourceSystemID]
			AND [src].[CabDescription] = [tgt].[SourceCabCode]
WHERE	[tgt].[VehicleCabId] IS NULL
		AND [src].[CabDescription] IS NOT NULL
		AND [src].[ToProcessFlag] = 1;
/* Update Cab IDs ********************************************************************* */
UPDATE	[tgt]
SET		[tgt].[CabId] = [src].[VehicleCabID]
FROM	[SynWrkDimVehicleVehicle] AS tgt
		INNER JOIN [dbo].[DimVehicleCab] AS src
			ON [tgt].[Meta_Src_Sys_ID] = [src].[SourceSystemID]
			AND [tgt].[CabDescription] = [src].[SourceCabCode];





/* ************************************************************************************ */
/* Insert Missing Category IDs ******************************************************** */
/* ************************************************************************************ */
INSERT INTO [dbo].[DimVehicleCategory](
	CategoryDescription
	, StandardCategoryDescription
	, SourceCategoryCode
	, SourceSystemId
	, Meta_ComputerName
	, Meta_LoadDate
	, Meta_RowLastChangeDate
	, Meta_UserID
)
SELECT	DISTINCT [src].[CategoryCode]
		, 'Needs Mapping' AS StandardCategory
		, [src].[CategoryCode] AS SourceCategoryCode
		, [src].[Meta_Src_Sys_ID] AS SourceSystemID
		, [src].[Meta_ComputerName]
		, SYSDATETIME() AS Meta_LoadDate
		, SYSDATETIME() AS Meta_RowLastChangeDate
		, [src].[Meta_UserID]
from	[SynWrkDimVehicleVehicle] AS src
		LEFT JOIN [dbo].[DimVehicleCategory] AS tgt
			ON [src].[Meta_Src_Sys_ID] = [tgt].[SourceSystemID]
			AND [src].[CategoryCode] = [tgt].[SourceCategoryCode]
WHERE	[tgt].[VehicleCategoryId] IS NULL
		AND [src].[CategoryCode] IS NOT NULL
		AND [src].[ToProcessFlag] = 1;
/* Update Category IDs *************************************************************** */
UPDATE	[tgt]
SET		[tgt].[CategoryId] = [src].[VehicleCategoryID]
FROM	[SynWrkDimVehicleVehicle] AS tgt
		INNER JOIN [dbo].[DimVehicleCategory] AS src
			ON [tgt].[Meta_Src_Sys_ID] = [src].[SourceSystemID]
			AND [tgt].[CategoryCode] = [src].[SourceCategoryCode];








/* ************************************************************************************ */
/* Insert Missing Chassis IDs ********************************************************* */
/* ************************************************************************************ */
INSERT INTO [dbo].[DimVehicleChassis](
	ChassisDescription
	, StandardChassisDescription
	, SourceChassisCode
	, SourceSystemId
	, Meta_ComputerName
	, Meta_LoadDate
	, Meta_RowLastChangeDate
	, Meta_UserID
)
SELECT	DISTINCT [src].[ChassisDescription]
		, 'Needs Mapping' AS StandardChassis
		, [src].[ChassisDescription] AS SourceChassisCode
		, [src].[Meta_Src_Sys_ID] AS SourceSystemID
		, [src].[Meta_ComputerName]
		, SYSDATETIME() AS Meta_LoadDate
		, SYSDATETIME() AS Meta_RowLastChangeDate
		, [src].[Meta_UserID]
from	[SynWrkDimVehicleVehicle] AS src
		LEFT JOIN [dbo].[DimVehicleChassis] AS tgt
			ON [src].[Meta_Src_Sys_ID] = [tgt].[SourceSystemID]
			AND [src].[ChassisDescription] = [tgt].[SourceChassisCode]
WHERE	[tgt].[VehicleChassisId] IS NULL
		AND [src].[ChassisDescription] IS NOT NULL
		AND [src].[ToProcessFlag] = 1;
/* Update Chassis IDs ***************************************************************** */
UPDATE	[tgt]
SET		[tgt].[ChassisId] = [src].[VehicleChassisID]
FROM	[SynWrkDimVehicleVehicle] AS tgt
		INNER JOIN [dbo].[DimVehicleChassis] AS src
			ON [tgt].[Meta_Src_Sys_ID] = [src].[SourceSystemID]
			AND [tgt].[ChassisDescription] = [src].[SourceChassisCode];




/* ************************************************************************************ */
/* Insert Missing Cylinder IDs ******************************************************** */
/* ************************************************************************************ */
INSERT INTO [dbo].[DimVehicleCylinders](
	CylinderDescription
	, StandardCylinderDescription
	, NumberOfCylinders
	, SourceCylinderCode
	, SourceSystemId
	, Meta_ComputerName
	, Meta_LoadDate
	, Meta_RowLastChangeDate
	, Meta_UserID
)
SELECT	DISTINCT [src].[CylinderDescription]
		, 'Needs Mapping' AS StandardCylinderDescription
		, src.NumberOfCylinders
		, [src].[CylinderDescription] AS SourceCylinderCode
		, [src].[Meta_Src_Sys_ID] AS SourceSystemID
		, [src].[Meta_ComputerName]
		, SYSDATETIME() AS Meta_LoadDate
		, SYSDATETIME() AS Meta_RowLastChangeDate
		, [src].[Meta_UserID]
from	[SynWrkDimVehicleVehicle] AS src
		LEFT JOIN [dbo].[DimVehicleCylinders] AS tgt
			ON [src].[Meta_Src_Sys_ID] = [tgt].[SourceSystemID]
			AND [src].[CylinderDescription] = [tgt].[SourceCylinderCode]
WHERE	[tgt].[VehicleCylinderId] IS NULL
		AND [src].[CylinderDescription] IS NOT NULL
		AND [src].[ToProcessFlag] = 1;
/* Update Cylinder IDs *************************************************************** */
UPDATE	[tgt]
SET		[tgt].[CylinderId] = [src].[VehicleCylinderID]
FROM	[SynWrkDimVehicleVehicle] AS tgt
		INNER JOIN [dbo].[DimVehicleCylinders] AS src
			ON [tgt].[Meta_Src_Sys_ID] = [src].[SourceSystemID]
			AND [tgt].[CylinderDescription] = [src].[SourceCylinderCode];






/* ************************************************************************************ */
/* Insert Missing Drivetype IDs ******************************************************* */
/* ************************************************************************************ */
INSERT INTO [dbo].[DimVehicleDrivetype](
	DrivetypeDescription
	, StandardDrivetypeDescription
	, SourceDrivetypeCode
	, SourceSystemId
	, Meta_ComputerName
	, Meta_LoadDate
	, Meta_RowLastChangeDate
	, Meta_UserID
)
SELECT	DISTINCT [src].[Drivetype]
		, 'Needs Mapping' AS StandardDrivetype
		, [src].[Drivetype] AS SourceDrivetypeCode
		, [src].[Meta_Src_Sys_ID] AS SourceSystemID
		, [src].[Meta_ComputerName]
		, SYSDATETIME() AS Meta_LoadDate
		, SYSDATETIME() AS Meta_RowLastChangeDate
		, [src].[Meta_UserID]
from	[SynWrkDimVehicleVehicle] AS src
		LEFT JOIN [dbo].[DimVehicleDrivetype] AS tgt
			ON [src].[Meta_Src_Sys_ID] = [tgt].[SourceSystemID]
			AND [src].[Drivetype] = [tgt].[SourceDrivetypeCode]
WHERE	[tgt].[VehicleDrivetypeId] IS NULL
		AND [src].[Drivetype] IS NOT NULL
		AND [src].[ToProcessFlag] = 1;
/* Update Drivetype IDs *************************************************************** */
UPDATE	[tgt]
SET		[tgt].[DrivetypeId] = [src].[VehicleDrivetypeID]
FROM	[SynWrkDimVehicleVehicle] AS tgt
		INNER JOIN [dbo].[DimVehicleDrivetype] AS src
			ON [tgt].[Meta_Src_Sys_ID] = [src].[SourceSystemID]
			AND [tgt].[Drivetype] = [src].[SourceDrivetypeCode];




/* ************************************************************************************ */
/* Insert Missing DMVCategory IDs ***************************************************** */
/* ************************************************************************************ */
INSERT INTO [dbo].[DimVehicleDMVCategory](
	DMVCategoryDescription
	, StandardDMVCategoryDescription
	, SourceDMVCategoryCode
	, SourceSystemId
	, Meta_ComputerName
	, Meta_LoadDate
	, Meta_RowLastChangeDate
	, Meta_UserID
)
SELECT	DISTINCT [src].[DMVCategoryCode]
		, 'Needs Mapping' AS StandardDMVCategory
		, [src].[DMVCategoryCode] AS SourceDMVCategoryCode
		, [src].[Meta_Src_Sys_ID] AS SourceSystemID
		, [src].[Meta_ComputerName]
		, SYSDATETIME() AS Meta_LoadDate
		, SYSDATETIME() AS Meta_RowLastChangeDate
		, [src].[Meta_UserID]
from	[SynWrkDimVehicleVehicle] AS src
		LEFT JOIN [dbo].[DimVehicleDMVCategory] AS tgt
			ON [src].[Meta_Src_Sys_ID] = [tgt].[SourceSystemID]
			AND [src].[DMVCategoryCode] = [tgt].[SourceDMVCategoryCode]
WHERE	[tgt].[VehicleDMVCategoryId] IS NULL
		AND [src].[DMVCategoryCode] IS NOT NULL
		AND [src].[ToProcessFlag] = 1;
/* Update DMVCategory IDs ************************************************************* */
UPDATE	[tgt]
SET		[tgt].[DMVCategoryId] = [src].[VehicleDMVCategoryID]
FROM	[SynWrkDimVehicleVehicle] AS tgt
		INNER JOIN [dbo].[DimVehicleDMVCategory] AS src
			ON [tgt].[Meta_Src_Sys_ID] = [src].[SourceSystemID]
			AND [tgt].[DMVCategoryCode] = [src].[SourceDMVCategoryCode];





/* ************************************************************************************ */
/* Insert Missing Engine IDs ********************************************************** */
/* ************************************************************************************ */
INSERT INTO [dbo].[DimVehicleEngine](
	EngineDescription
	, StandardEngineDescription
	, SourceEngineCode
	, SourceSystemId
	, Meta_ComputerName
	, Meta_LoadDate
	, Meta_RowLastChangeDate
	, Meta_UserID
)
SELECT	DISTINCT [src].[EngineDescription]
		, 'Needs Mapping' AS StandardEngine
		, [src].[EngineDescription] AS SourceEngineCode
		, [src].[Meta_Src_Sys_ID] AS SourceSystemID
		, [src].[Meta_ComputerName]
		, SYSDATETIME() AS Meta_LoadDate
		, SYSDATETIME() AS Meta_RowLastChangeDate
		, [src].[Meta_UserID]
from	[SynWrkDimVehicleVehicle] AS src
		LEFT JOIN [dbo].[DimVehicleEngine] AS tgt
			ON [src].[Meta_Src_Sys_ID] = [tgt].[SourceSystemID]
			AND [src].[EngineDescription] = [tgt].[SourceEngineCode]
WHERE	[tgt].[VehicleEngineId] IS NULL
		AND [src].[EngineDescription] IS NOT NULL
		AND [src].[ToProcessFlag] = 1;
/* Update Engine IDs ****************************************************************** */
UPDATE	[tgt]
SET		[tgt].[EngineId] = [src].[VehicleEngineID]
FROM	[SynWrkDimVehicleVehicle] AS tgt
		INNER JOIN [dbo].[DimVehicleEngine] AS src
			ON [tgt].[Meta_Src_Sys_ID] = [src].[SourceSystemID]
			AND [tgt].[EngineDescription] = [src].[SourceEngineCode];






/* ************************************************************************************ */
/* Insert Missing Exterior Color IDs ************************************************** */
/* ************************************************************************************ */
INSERT INTO [dbo].[DimVehicleExteriorColor] (
	[ExteriorColorDescription]
	, [StandardExteriorColor]
	, [SourceExteriorColorID]
	, [SourceSystemID]
	, [Meta_ComputerName]
	, [Meta_UserID]
	, [Meta_LoadDate]
	, [Meta_RowLastChangeDate]
)
SELECT	[src].[ExteriorColorDescription]
		, [src].[StandardExteriorColor]
		, [src].[SourceExteriorColorID]
		, [src].[SourceSystemID]
		, [src].[Meta_ComputerName]
		, [src].[Meta_UserID]
		, SYSDATETIME() AS Meta_LoadDate
		, SYSDATETIME() AS Meta_RowLastChangeDate
FROM	(
		SELECT	[src].[ExteriorColorDescription]
				, [src].[ExteriorColorDescriptionGeneral] AS StandardExteriorColor
				, [src].[ExteriorColorCode] AS SourceExteriorColorID
				, [src].[Meta_Src_Sys_ID] AS SourceSystemID
				, [src].[Meta_ComputerName]
				, [src].[Meta_UserID]
				, ROW_NUMBER()
					OVER( PARTITION BY [src].[Meta_Src_Sys_ID], [src].[ExteriorColorCode]
					ORDER BY [src].[ExteriorColorDescriptionGeneral],[src].[ExteriorColorDescription]) as seq
		FROM	[SynWrkDimVehicleVehicle] AS src
				LEFT JOIN [dbo].[DimVehicleExteriorColor] AS tgt
					ON [src].[Meta_Src_Sys_ID] = [tgt].[SourceSystemID]
					AND [src].[ExteriorColorCode] = [tgt].[SourceExteriorColorID]
		WHERE	[tgt].[VehicleExteriorColorID] IS NULL
				AND [src].[ExteriorColorCode] IS NOT NULL
				AND [src].[ToProcessFlag] = 1
		) AS src
WHERE [src].[seq] = 1;
/* Update Exterior Color IDs ********************************************************** */
UPDATE	[tgt]
SET		[tgt].[exteriorcolorid] = [src].[VehicleExteriorColorID]
FROM	[SynWrkDimVehicleVehicle] AS tgt
		INNER JOIN [dbo].[DimVehicleExteriorColor] AS src
			ON [tgt].[Meta_Src_Sys_ID] = [src].[SourceSystemID]
			AND [tgt].[ExteriorColorCode] = [src].[SourceExteriorColorID];





/* ************************************************************************************ */
/* Insert Missing FuelType IDs ******************************************************** */
/* ************************************************************************************ */
INSERT INTO [dbo].[DimVehicleFuelType](
	FuelTypeDescription
	, StandardFuelTypeDescription
	, SourceFuelTypeCode
	, SourceSystemId
	, Meta_ComputerName
	, Meta_LoadDate
	, Meta_RowLastChangeDate
	, Meta_UserID
)
SELECT	DISTINCT [src].[FuelType]
		, 'Needs Mapping' AS StandardFuelType
		, [src].[FuelType] AS SourceFuelTypeCode
		, [src].[Meta_Src_Sys_ID] AS SourceSystemID
		, [src].[Meta_ComputerName]
		, SYSDATETIME() AS Meta_LoadDate
		, SYSDATETIME() AS Meta_RowLastChangeDate
		, [src].[Meta_UserID]
from	[SynWrkDimVehicleVehicle] AS src
		LEFT JOIN [dbo].[DimVehicleFuelType] AS tgt
			ON [src].[Meta_Src_Sys_ID] = [tgt].[SourceSystemID]
			AND [src].[FuelType] = [tgt].[SourceFuelTypeCode]
WHERE	[tgt].[VehicleFuelTypeId] IS NULL
		AND [src].[FuelType] IS NOT NULL
		AND [src].[ToProcessFlag] = 1;
/* Update FuelType IDs **************************************************************** */
UPDATE	[tgt]
SET		[tgt].[FuelTypeId] = [src].[VehicleFuelTypeID]
FROM	[SynWrkDimVehicleVehicle] AS tgt
		INNER JOIN [dbo].[DimVehicleFuelType] AS src
			ON [tgt].[Meta_Src_Sys_ID] = [src].[SourceSystemID]
			AND [tgt].[FuelType] = [src].[SourceFuelTypeCode];






/* ************************************************************************************ */
/* Insert Missing Interior Color IDs ************************************************** */
/* ************************************************************************************ */
INSERT INTO [dbo].[DimVehicleInteriorColor](
	InteriorColorDescription
	, StandardInteriorColor
	, SourceInteriorColorId
	, SourceSystemId
	, Meta_ComputerName
	, Meta_UserID
	, Meta_LoadDate
	, Meta_RowLastChangeDate
)
SELECT	[src].[InteriorColorDescription]
		, [src].[StandardInteriorColor]
		, [src].[SourceInteriorColorID]
		, [src].[SourceSystemID]
		, [src].[Meta_ComputerName]
		, [src].[Meta_UserID]
		, SYSDATETIME() AS Meta_LoadDate
		, SYSDATETIME() AS Meta_RowLastChangeDate
FROM	(
		SELECT	[src].[InteriorColorDescription]
				, [src].[InteriorColorDescriptionGeneral] AS StandardInteriorColor
				, [src].[InteriorColorCode] AS SourceInteriorColorID
				, [src].[Meta_Src_Sys_ID] AS SourceSystemID
				, [src].[Meta_ComputerName]
				, [src].[Meta_UserID]
				, ROW_NUMBER()
					OVER( PARTITION BY [src].[Meta_Src_Sys_ID], [src].[InteriorColorCode]
					ORDER BY [src].[InteriorColorDescriptionGeneral], [src].[InteriorColorDescription]) as seq
		FROM 	[SynWrkDimVehicleVehicle] AS src
				LEFT JOIN [dbo].[DimVehicleInteriorColor] AS tgt
					ON [src].[Meta_Src_Sys_ID] = [tgt].[SourceSystemID]
					AND [src].[InteriorColorCode] = [tgt].[SourceInteriorColorID]
		WHERE	[tgt].[VehicleInteriorColorID] IS NULL
				AND [src].[InteriorColorCode] IS NOT NULL
				AND [src].[ToProcessFlag] = 1
		) as src
WHERE	seq = 1 ;
/* Update Interior Color IDs ********************************************************** */
UPDATE	[tgt]
SET		[tgt].[InteriorColorId] = [src].[VehicleInteriorColorID]
FROM	[SynWrkDimVehicleVehicle] AS tgt
		INNER JOIN [dbo].[DimVehicleInteriorColor] AS src
			ON [tgt].[Meta_Src_Sys_ID] = [src].[SourceSystemID]
			AND [tgt].[InteriorColorCode] = [src].[SourceInteriorColorID];




/* ************************************************************************************ */
/* Insert Missing MakeIDs ************************************************************* */
/* ************************************************************************************ */
insert INTO [dbo].[DimVehicleMake](
		[SourceMakeCode]
		, [StandardMakeDescription]
		, [MakeDescription]
		, [Meta_ComputerName]
		, [Meta_LoadDate]
		, [Meta_RowLastChangeDate]
		, [Meta_UserID]
)
SELECT	[src].[MakeCode]
		, 'Needs Mapping' AS StandardMakeCode
		, [src].[MakeDescription]
		, [src].[Meta_ComputerName]
		, SYSDATETIME() AS Meta_LoadDate
		, SYSDATETIME() AS Meta_RowLastChangeDate
		, [src].[Meta_UserID]
from	(
		SELECT	[wrk].[MakeCode]
				, [wrk].[MakeDescription]
				, [wrk].[Meta_ComputerName]
				, [wrk].[Meta_UserID]
				, ROW_NUMBER()
					OVER(PARTITION BY [wrk].[MakeCode]
							ORDER BY [wrk].[Meta_SourceSystemWeight] DESC) as seq
		FROM	(
				SELECT	DISTINCT [src].[MakeCode]
						, [src].[MakeDescription]
						, [src].[Meta_ComputerName]
						, [src].[Meta_UserID]
						, [src].[Meta_Src_Sys_ID]
						, [src].[Meta_SourceSystemWeight]
				FROM 	[SynWrkDimVehicleVehicle] AS src
						LEFT JOIN [dbo].[DimVehicleMake] AS tgt
							ON [src].[MakeCode] = [tgt].[SourceMakeCode]
				WHERE	[tgt].[VehicleMakeID] IS NULL
						AND [src].[MakeCode] IS NOT NULL
						AND [src].[ToProcessFlag] = 1
				) wrk
		) src
WHERE	seq = 1;
/* Update Make IDs ******************************************************************** */
UPDATE	[src]
SET		[src].[MakeID] = [tgt].[VehicleMakeID]
FROM 	[SynWrkDimVehicleVehicle] AS src
		INNER JOIN [dbo].[DimVehicleMake] AS tgt
			ON [src].[MakeCode] = [tgt].[SourceMakeCode];






/* ************************************************************************************ */
/* Insert Missing ModelIDs ************************************************************ */
/* ************************************************************************************ */
INSERT INTO [dbo].[DimVehicleModel](
		[SourceMakeCode]
		, [SourceModelCode]
		, [ModelDescription]
		, [ModelCategory]
		, [ModelSubCategory]
		, [Meta_ComputerName]
		, [Meta_LoadDate]
		, [Meta_RowLastChangeDate]
		, [Meta_UserID]
)
SELECT	[src].[MakeCode]
		, [src].[ModelCode]
		, [src].[ModelDescription]
		, 'Needs Mapping' AS ModelCategory
		, 'Needs Mapping' AS ModelSubCategory
		, [src].[Meta_ComputerName]
		, SYSDATETIME() AS Meta_LoadDate
		, SYSDATETIME() AS Meta_RowLastChangeDate
		, [src].[Meta_UserID]
FROM	(
		SELECT	[wrk].[MakeCode]
				, [wrk].[ModelCode]
				, [wrk].[ModelDescription]
				, [wrk].[Meta_ComputerName]
				, [wrk].[Meta_UserID]
				, ROW_NUMBER()
					OVER(PARTITION BY [wrk].[MakeCode], [wrk].[ModelCode]
							ORDER BY [wrk].[Meta_SourceSystemWeight] DESC) as seq
		FROM	(
				SELECT	DISTINCT [src].[MakeCode]
						, [src].[ModelCode]
						, [src].[ModelDescription]
						, [src].[Meta_ComputerName]
						, [src].[Meta_UserID]
						, [src].[Meta_SourceSystemWeight]
				FROM 	[SynWrkDimVehicleVehicle] AS src
						LEFT JOIN [dbo].[DimVehicleModel] AS tgt
							ON [src].[MakeCode] = [tgt].[SourceMakeCode]
							AND [src].[ModelCode] = [tgt].[SourceModelCode]
				WHERE	[tgt].[VehicleModelID] IS NULL
						AND [src].[MakeCode] is not NULL
						AND [src].[ModelCode] IS NOT NULL
						AND [src].[ToProcessFlag] = 1
				) wrk
		) src
WHERE	seq = 1;
/* Update Model IDs ******************************************************************* */
UPDATE	[tgt]
SET		[tgt].[ModelID] = [src].[VehicleModelID]
FROM	[SynWrkDimVehicleVehicle] AS tgt
		INNER JOIN [dbo].[DimVehicleModel] AS src
			ON [tgt].[MakeCode] = [src].[SourceMakeCode]
			AND [tgt].[ModelCode] = [src].[SourceModelCode];






/* ************************************************************************************ */
/* Insert Missing ModelNumbers ******************************************************** */
/* ************************************************************************************ */
INSERT INTO [dbo].[DimVehicleModelNumber](
	ModelNumberDescription
	, StandardModelNumberDescription
	, SourceMakeCode
	, SourceModelNumberCode
	, SourceSystemId
	, Meta_ComputerName
	, Meta_LoadDate
	, Meta_RowLastChangeDate
	, Meta_UserID
)
SELECT	DISTINCT 'Needs Mapping ' AS [ModelNumberDescription]
		, 'Needs Mapping' AS StandardModelNumberDescription
		, [src].[MakeCode] AS SourceMakeCode
		, [src].[ModelNumber] AS SourceModelNumberCode
		, [src].[Meta_Src_Sys_ID] AS SourceSystemID
		, [src].[Meta_ComputerName]
		, SYSDATETIME() AS Meta_LoadDate
		, SYSDATETIME() AS Meta_RowLastChangeDate
		, [src].[Meta_UserID]
from	[SynWrkDimVehicleVehicle] AS src
		LEFT JOIN [dbo].[DimVehicleModelNumber] AS tgt
			ON [src].[Meta_Src_Sys_ID] = [tgt].[SourceSystemID]
			AND [src].[MakeCode] = [tgt].[SourceMakeCode]
			AND [src].[ModelNumber] = [tgt].[SourceModelNumberCode]
WHERE	[tgt].[VehicleModelNumberId] IS NULL
		AND [src].[MakeCode] IS NOT NULL
		AND [src].[ModelNumber] IS NOT NULL
		AND [src].[ToProcessFlag] = 1;
/* Update Model Numbers IDs *********************************************************** */
UPDATE	[tgt]
SET		[tgt].[ModelNumberId] = [src].[VehicleModelNumberID]
FROM	[SynWrkDimVehicleVehicle] AS tgt
		INNER JOIN [dbo].[DimVehicleModelNumber] AS src
			ON [tgt].[Meta_Src_Sys_ID] = [src].[SourceSystemID]
			AND [tgt].[MakeCode] = [src].[SourceMakeCode]
			AND [tgt].[ModelNumber] = [src].[SourceModelNumberCode];





/* ************************************************************************************ */
/* Insert Missing Restraint IDs **************************************************** */
/* ************************************************************************************ */
INSERT INTO [dbo].[DimVehicleRestraints](
	RestraintsDescription
	, StandardRestraintsDescription
	, SourceRestraintsCode
	, SourceSystemId
	, Meta_ComputerName
	, Meta_LoadDate
	, Meta_RowLastChangeDate
	, Meta_UserID
)
SELECT	DISTINCT [src].[RestraintsDescription]
		, 'Needs Mapping' AS StandardRestraint
		, [src].[RestraintsDescription] AS SourceRestraintCode
		, [src].[Meta_Src_Sys_ID] AS SourceSystemID
		, [src].[Meta_ComputerName]
		, SYSDATETIME() AS Meta_LoadDate
		, SYSDATETIME() AS Meta_RowLastChangeDate
		, [src].[Meta_UserID]
from	[SynWrkDimVehicleVehicle] AS src
		LEFT JOIN [dbo].[DimVehicleRestraints] AS tgt
			ON [src].[Meta_Src_Sys_ID] = [tgt].[SourceSystemID]
			AND [src].[RestraintsDescription] = [tgt].[SourceRestraintsCode]
WHERE	[tgt].[VehicleRestraintsId] IS NULL
		AND [src].[RestraintsDescription] IS NOT NULL
		AND [src].[ToProcessFlag] = 1;
/* Update Restraint IDs *************************************************************** */
UPDATE	[tgt]
SET		[tgt].[RestraintsId] = [src].[VehicleRestraintsID]
FROM	[SynWrkDimVehicleVehicle] AS tgt
		INNER JOIN [dbo].[DimVehicleRestraints] AS src
			ON [tgt].[Meta_Src_Sys_ID] = [src].[SourceSystemID]
			AND [tgt].[RestraintsDescription] = [src].[SourceRestraintsCode];





/* ************************************************************************************ */
/* Insert Missing Series ID's ********************************************************* */
/* ************************************************************************************ */
INSERT INTO [dbo].[DimVehicleSeries](
	SourceSystemId
	, SourceModelCode
	, SourceSeriesCode
	, SeriesDescription
	, StandardSeriesDescription
	, Meta_ComputerName
	, Meta_LoadDate
	, Meta_RowLastChangeDate
	, Meta_UserID
)
SELECT	SourceSystemId
		, SourceModelCode
		, SourceSeriesCode
		, SeriesDescription
		, 'Needs Mapping' AS StandardSeriesCodeDescription
		, Meta_ComputerName
		, SYSDATETIME() AS Meta_LoadDate
		, SYSDATETIME() AS Meta_RowLastChangeDate
		, Meta_UserID
FROM	(
		SELECT	[src].[Meta_Src_Sys_ID] AS SourceSystemID
				, [src].[ModelCode] AS SourceModelCode
				, [src].[SeriesCode] AS SourceSeriesCode
				, [src].[SeriesDescription]
				, [src].[Meta_ComputerName]
				, [src].[Meta_UserID]
				, ROW_NUMBER()
					OVER(PARTITION BY [src].[Meta_Src_Sys_ID], [src].[ModelCode], [src].[SeriesCode]
					ORDER BY [src].[Meta_SourceSystemWeight] DESC) seq
		FROM 	[SynWrkDimVehicleVehicle] AS src
				LEFT JOIN [dbo].[DimVehicleSeries] AS tgt
					ON [src].[Meta_Src_Sys_ID] = [tgt].[SourceSystemID]
					AND [src].[ModelCode] = [tgt].[SourceModelCode]
					AND [src].[SeriesCode] = [tgt].[SourceSeriesCode]
		WHERE	[tgt].[VehicleSeriesId] IS NULL
				AND [src].[ModelCode] IS NOT NULL
				AND [src].[SeriesCode] IS NOT NULL
				AND [src].[ToProcessFlag] = 1
		) as src
WHERE src.seq = 1;
/* Update Series IDs ****************************************************************** */
UPDATE	[tgt]
SET		[tgt].[SeriesId] = [src].[VehicleSeriesID]
FROM	[SynWrkDimVehicleVehicle] AS tgt
		INNER JOIN [dbo].[DimVehicleSeries] AS src
			ON [tgt].[Meta_Src_Sys_ID] = [src].[SourceSystemID]
			AND [tgt].[ModelCode] = [src].[SourceModelCode]
			AND [tgt].[SeriesCode] = [src].[SourceSeriesCode];





/* ************************************************************************************ */
/* Insert Missing TrimIDs ************************************************************* */
/* ************************************************************************************ */
INSERT INTO [dbo].[DimVehicleTrim](
		[TrimDescription]
		, [StandardTrimDescription]
		, [SourceTrimCode]
		, [SourceSystemId]
		, [Meta_ComputerName]
		, [Meta_LoadDate]
		, [Meta_RowLastChangeDate]
		, [Meta_UserID]
)
SELECT	DISTINCT [src].[TrimDescription]
		, 'Needs Mapping' AS StandardTrimDescription
		, [src].[TrimCode]
		, [src].[Meta_Src_Sys_Id]
		, [src].[Meta_ComputerName]
		, SYSDATETIME() AS Meta_LoadDate
		, SYSDATETIME() AS Meta_RowLastChangeDate
		, [src].[Meta_UserID]
FROM 	[SynWrkDimVehicleVehicle] AS src
		LEFT JOIN [dbo].[DimVehicleTrim] AS tgt
			ON [src].[TrimCode] = [tgt].[SourceTrimCode]
			AND [src].[Meta_Src_Sys_id] = [tgt].[SourceSystemId]
WHERE	[tgt].[VehicleTrimID] IS NULL
		AND [src].[TrimCode] is not NULL
		AND [src].[ToProcessFlag] = 1;
/* Update Trim IDs ******************************************************************** */
UPDATE	[tgt]
SET		[tgt].[TrimID] = [src].[VehicleTrimID]
FROM	[SynWrkDimVehicleVehicle] AS tgt
		INNER JOIN [dbo].[DimVehicleTrim] AS src
			ON [tgt].[TrimCode] = [src].[SourceTrimCode]
			AND [tgt].[Meta_Src_Sys_Id] = [src].[SourceSystemId];





/* ************************************************************************************ */
/* Insert Missing Transmission IDs **************************************************** */
/* ************************************************************************************ */
INSERT INTO [dbo].[DimVehicleTransmission](
	TransmissionDescription
	, StandardTransmissionDescription
	, SourceTransmissionCode
	, SourceSystemId
	, Meta_ComputerName
	, Meta_LoadDate
	, Meta_RowLastChangeDate
	, Meta_UserID
)
SELECT	DISTINCT [src].[TransmissionDescription]
		, 'Needs Mapping' AS StandardTransmission
		, [src].[TransmissionDescription] AS SourceTransmissionCode
		, [src].[Meta_Src_Sys_ID] AS SourceSystemID
		, [src].[Meta_ComputerName]
		, SYSDATETIME() AS Meta_LoadDate
		, SYSDATETIME() AS Meta_RowLastChangeDate
		, [src].[Meta_UserID]
from	[SynWrkDimVehicleVehicle] AS src
		LEFT JOIN [dbo].[DimVehicleTransmission] AS tgt
			ON [src].[Meta_Src_Sys_ID] = [tgt].[SourceSystemID]
			AND [src].[TransmissionDescription] = [tgt].[SourceTransmissionCode]
WHERE	[tgt].[VehicleTransmissionId] IS NULL
		AND [src].[TransmissionDescription] IS NOT NULL
		AND [src].[ToProcessFlag] = 1;
/* Update Transmission IDs ************************************************************ */
UPDATE	[tgt]
SET		[tgt].[TransmissionId] = [src].[VehicleTransmissionID]
FROM	[SynWrkDimVehicleVehicle] AS tgt
		INNER JOIN [dbo].[DimVehicleTransmission] AS src
			ON [tgt].[Meta_Src_Sys_ID] = [src].[SourceSystemID]
			AND [tgt].[TransmissionDescription] = [src].[SourceTransmissionCode];





/* ************************************************************************************ */
/* apply incremental changes based on weight ****************************************** */
/* ************************************************************************************ */
UPDATE tgt
SET		/* Base Source Columns */
		[tgt].[VehicleCabId]				= [src].[CabId]
		, [tgt].[VehicleCategoryId]			= [src].[CategoryId]
		, [tgt].[VehicleChassisId]			= [src].[ChassisId]
		, [tgt].[VehicleDMVCategoryId]		= [src].[DmvCategoryId]
		, [tgt].[VehicleEngineId]			= [src].[EngineId]
		, [tgt].[VehicleModelNumberId]		= [src].[ModelNumberId]
		, [tgt].[NumberOfDoors]				= [src].[NumberOfDoors]
		, [tgt].[NumberOfPassengers]		= [src].[NumberOfPassengers]
		, [tgt].[VehicleRestraintsId]		= [src].[RestraintsId]

		/* Vehicle Mart Columns */
		, [tgt].[VehicleBodyStyleId]	= CASE WHEN [tgt].[Meta_SourceSystemWeight] = 6 THEN [tgt].[VehicleBodyStyleId]		ELSE [src].[BodyStyleId] END
		, [tgt].[VehicleCylinderId]		= CASE WHEN [tgt].[Meta_SourceSystemWeight] = 6 THEN [tgt].[VehicleCylinderId]		ELSE [src].[CylinderId] END
		, [tgt].[VehicleDriveTypeId]	= CASE WHEN [tgt].[Meta_SourceSystemWeight] = 6 THEN [tgt].[VehicleDriveTypeId]		ELSE [src].[DriveTypeId] END
		, [tgt].[VehicleExteriorColorId]= CASE WHEN [tgt].[Meta_SourceSystemWeight] = 6 THEN [tgt].[VehicleExteriorColorId] ELSE [src].[ExteriorColorID] END
		, [tgt].[VehicleFuelTypeId]		= CASE WHEN [tgt].[Meta_SourceSystemWeight] = 6 THEN [tgt].[VehicleFuelTypeId]		ELSE [src].[FuelTypeId] END
		, [tgt].[VehicleInteriorColorId]= CASE WHEN [tgt].[Meta_SourceSystemWeight] = 6 THEN [tgt].[VehicleInteriorColorId] ELSE [src].[InteriorColorID] END
		, [tgt].[VehicleMakeId]			= CASE WHEN [tgt].[Meta_SourceSystemWeight] = 6 THEN [tgt].[VehicleMakeId]			ELSE [src].[MakeID] END
		, [tgt].[VehicleModelId]		= CASE WHEN [tgt].[Meta_SourceSystemWeight] = 6 THEN [tgt].[VehicleModelId]			ELSE [src].[ModelID] END
		, [tgt].[ModelYear]				= CASE WHEN [tgt].[Meta_SourceSystemWeight] = 6 THEN [tgt].[ModelYear]				ELSE [src].[ModelYear] END
		, [tgt].[VehicleSeriesId]		= CASE WHEN [tgt].[Meta_SourceSystemWeight] = 6 THEN [tgt].[VehicleSeriesId]		ELSE [src].[SeriesId] END
		, [tgt].[VehicleTransmissionId]	= CASE WHEN [tgt].[Meta_SourceSystemWeight] = 6 THEN [tgt].[VehicleTransmissionId]	ELSE [src].[TransmissionId] END
		, [tgt].[VehicleTrimId]			= CASE WHEN [tgt].[Meta_SourceSystemWeight] = 6 THEN [tgt].[VehicleTrimId]			ELSE [src].[TrimID] END
		, [tgt].[UVC]					= CASE WHEN [tgt].[Meta_SourceSystemWeight] = 6 THEN [tgt].[UVC]					ELSE [src].[UVC] END

		/* Meta Columns */
		, [tgt].[ETLExecution_ID]					= [src].[ETLExecution_ID]
		, [tgt].[Meta_ComputerName]					= [src].[Meta_ComputerName]
		---, [tgt].[Meta_Src_Sys_ID], [tgt].[Meta_SourceSystemName], [tgt].[Meta_SourceSystemWeight] Only populated on Insert OR an Update from VehicleMart
		, [tgt].[Meta_Src_Sys_ID_Current]			= [src].[Meta_Src_Sys_ID]
		, [tgt].[Meta_SourceSystemNameCurrent]		= [src].[Meta_SourceSystemName]
		, [tgt].[Meta_SourceSystemWeightCurrent]	= [src].[Meta_SourceSystemWeight]
		, [tgt].[Meta_UserID]						= [src].[Meta_UserID]
FROM	[SynWrkDimVehicleVehicle] AS src
		INNER JOIN [DimVin] AS dv
			ON [src].[Vin] = [dv].[Vin]
		INNER JOIN [DimVehicle] AS tgt
			ON [dv].[VehicleKey] = [tgt].[VehicleKey]
WHERE	[src].[ToProcessFlag] = 1 -- only those records flagged to be processed
		/* only when the source system weight is greather than or equal to (hierarchy defined by business) */
		AND [tgt].[Meta_SourceSystemWeightCurrent] <= [src].[Meta_SourceSystemWeight]
		/* only when a value has changed */
		AND (
			[tgt].[VehicleCabId]				!= [src].[CabId]
			OR [tgt].[VehicleCategoryId]		!= [src].[CategoryId]
			OR [tgt].[VehicleChassisId]			!= [src].[ChassisId]
			OR [tgt].[VehicleDMVCategoryId]		!= [src].[DmvCategoryId]
			OR [tgt].[VehicleEngineId]			!= [src].[EngineId]
			OR [tgt].[VehicleModelNumberId]		!= [src].[ModelNumberId]
			OR [tgt].[NumberOfDoors]			!= [src].[NumberOfDoors]
			OR [tgt].[NumberOfPassengers]		!= [src].[NumberOfPassengers]
			OR [tgt].[VehicleRestraintsId]		!= [src].[RestraintsId]

			/* value changed when not locked in by max source Vehicle Mart */
			OR ([tgt].[Meta_SourceSystemWeight] <> 6
				AND (
					[tgt].[VehicleBodyStyleId]			!= [src].[BodyStyleId]
					OR [tgt].[VehicleCylinderId]		!= [src].[CylinderId]
					OR [tgt].[VehicleDriveTypeId]		!= [src].[DriveTypeId]
					OR [tgt].[VehicleExteriorColorId]	!= [src].[ExteriorColorID]
					OR [tgt].[VehicleFuelTypeId]		!= [src].[FuelTypeId]
					OR [tgt].[VehicleInteriorColorId]	!= [src].[InteriorColorID]
					OR [tgt].[VehicleMakeId]			!= [src].[MakeID]
					OR [tgt].[VehicleModelId]			!= [src].[ModelID]
					OR [tgt].[ModelYear]				!= [src].[ModelYear]
					OR [tgt].[VehicleSeriesID]			!= [src].[SeriesId]
					OR [tgt].[VehicleTransmissionId]	!= [src].[TransmissionId]
					OR [tgt].[VehicleTrimId]			!= [src].[TrimID]
					OR [tgt].[UVC]						!= [src].[UVC]
					)
				)
		);
/* Capture Update Count *************************************************************** */
SELECT @UpdatedRowCnts = CAST(@@rowcount as int);






/* ************************************************************************************ */
/* Insert New Records ***************************************************************** */
/* ************************************************************************************ */
INSERT INTO DimVehicle (
	-- Meta_RowEffectiveDate, Meta_RowExpiredDate --- System generated
	--, ChromeStyleId, IsChromeDecoded --- not in use
	--, Displacement, EpaMileage, IsPanoramic, IsNav, IsLeather --- VehicleMart only
	VehicleKey
	, VehicleBodyStyleId
	, VehicleCabId, VehicleCategoryId, VehicleChassisId, VehicleCylinderId
	, VehicleDMVCategoryId, VehicleDriveTypeId
	, VehicleEngineId, VehicleExteriorColorId
	, VehicleFuelTypeId
	, VehicleInteriorColorId
	, VehicleMakeId, VehicleModelId, VehicleModelNumberId, ModelYear
	, NumberOfDoors, NumberOfPassengers
	, VehicleRestraintsId
	, VehicleSeriesID
	, VehicleTransmissionId, VehicleTrimId
	, UVC
	, ETLExecution_ID, Meta_ComputerName, Meta_Src_Sys_ID,  Meta_SourceSystemName, Meta_SourceSystemWeight
	, Meta_Src_Sys_ID_Current, Meta_SourceSystemNameCurrent, Meta_SourceSystemWeightCurrent, Meta_UserID
)
SELECT	[dv].[VehicleKey]
		, [src].[BodyStyleId]
		, [src].[CabId], [src].[CategoryId], [src].[ChassisId], [src].[CylinderId]
		, [src].[DmvCategoryId], [src].[DriveTypeId]
		, [src].[EngineId], [src].[ExteriorColorID]
		, [src].[FuelTypeId]
		, [src].[InteriorColorID]
		, [src].[MakeID], [src].[ModelID], [src].[ModelNumberId], [src].[ModelYear]
		, [src].[NumberOfDoors], [src].[NumberOfPassengers]
		, [src].[RestraintsId]
		, [src].[SeriesId]
		, [src].[TransmissionId], [src].[TrimID]
		, [src].[UVC]
		, [src].[ETLExecution_ID], [src].[Meta_ComputerName],[src].[Meta_Src_Sys_ID], [src].[Meta_SourceSystemName], [src].[Meta_SourceSystemWeight]
		, [src].[Meta_Src_Sys_ID], [src].[Meta_SourceSystemName], [src].[Meta_SourceSystemWeight], [src].[Meta_UserID]
FROM	[SynWrkDimVehicleVehicle] AS src
		INNER JOIN [DimVin] AS dv
			ON [src].[Vin] = [dv].[Vin]
		LEFT JOIN [DimVehicle] AS tgt
			ON [dv].[VehicleKey] = [tgt].[VehicleKey]
WHERE	[tgt].[VehicleKey] IS NULL
		AND [src].[ToProcessFlag] = 1;
/* capture insert count *************************************************************** */
SELECT	@InsertedRowCnts = CAST(@@rowcount as int);

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
