---
name: usp_DimVehicleVehicleMart
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

/* **************************************************************************************************** */
/* Author: Jo Carter	Date: 2018-06-15	Change: Creation											*/
/* Modified: Jo Carter	Date: 2018-07-12	Change: change to use DimUVC to pull back Series, Make		*/
/*													Model, Category and SubCategory						*/
/* **************************************************************************************************** */

CREATE PROCEDURE [dbo].[usp_DimVehicleVehicleMart]
(
	@InsertedRowCnts INT OUTPUT,
	@UpdatedRowCnts INT OUTPUT
)
AS
SET NOCOUNT ON;

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
SELECT	DISTINCT [src].[Style]
		, 'Needs Mapping' AS StandardBodyStyle
		, [src].[Style] AS SourceBodyStyleCode
		, [src].[Meta_Src_Sys_ID] AS SourceSystemID
		, [src].[Meta_ComputerName]
		, SYSDATETIME() AS Meta_LoadDate
		, SYSDATETIME() AS Meta_RowLastChangeDate
		, [src].[Meta_UserID]
from	[SynWrkDimVehicleVehicleMart] AS src
		LEFT JOIN [dbo].[DimVehicleBodyStyle] AS tgt
			ON [src].[Meta_Src_Sys_ID] = [tgt].[SourceSystemID]
			AND [src].[Style] = [tgt].[SourceBodyStyleCode]
WHERE	[tgt].[VehicleBodyStyleId] IS NULL
		AND [src].[Style] IS NOT NULL;
/* Update BodyStyle IDs *************************************************************** */
UPDATE	[tgt]
SET		[tgt].[BodyStyleId] = [src].[VehicleBodyStyleID]
FROM	[SynWrkDimVehicleVehicleMart] AS tgt
		INNER JOIN [dbo].[DimVehicleBodyStyle] AS src
			ON [tgt].[Meta_Src_Sys_ID] = [src].[SourceSystemID]
			AND [tgt].[Style] = [src].[SourceBodyStyleCode];





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
SELECT	DISTINCT [src].[CylinderCount]
		, 'Needs Mapping' AS StandardCylinderDescription
		, src.NumberOfCylinders
		, [src].[CylinderCount] AS SourceCylinderCode
		, [src].[Meta_Src_Sys_ID] AS SourceSystemID
		, [src].[Meta_ComputerName]
		, SYSDATETIME() AS Meta_LoadDate
		, SYSDATETIME() AS Meta_RowLastChangeDate
		, [src].[Meta_UserID]
from	[SynWrkDimVehicleVehicleMart] AS src
		LEFT JOIN [dbo].[DimVehicleCylinders] AS tgt
			ON [src].[Meta_Src_Sys_ID] = [tgt].[SourceSystemID]
			AND [src].[CylinderCount] = [tgt].[SourceCylinderCode]
WHERE	[tgt].[VehicleCylinderId] IS NULL
		AND [src].[CylinderCount] IS NOT NULL;
/* Update Cylinder IDs *************************************************************** */
UPDATE	[tgt]
SET		[tgt].[CylinderId] = [src].[VehicleCylinderID]
FROM	[SynWrkDimVehicleVehicleMart] AS tgt
		INNER JOIN [dbo].[DimVehicleCylinders] AS src
			ON [tgt].[Meta_Src_Sys_ID] = [src].[SourceSystemID]
			AND [tgt].[CylinderCount] = [src].[SourceCylinderCode];






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
from	[SynWrkDimVehicleVehicleMart] AS src
		LEFT JOIN [dbo].[DimVehicleDrivetype] AS tgt
			ON [src].[Meta_Src_Sys_ID] = [tgt].[SourceSystemID]
			AND [src].[Drivetype] = [tgt].[SourceDrivetypeCode]
WHERE	[tgt].[VehicleDrivetypeId] IS NULL
		AND [src].[Drivetype] IS NOT NULL;
/* Update Drivetype IDs *************************************************************** */
UPDATE	[tgt]
SET		[tgt].[DrivetypeId] = [src].[VehicleDrivetypeID]
FROM	[SynWrkDimVehicleVehicleMart] AS tgt
		INNER JOIN [dbo].[DimVehicleDrivetype] AS src
			ON [tgt].[Meta_Src_Sys_ID] = [src].[SourceSystemID]
			AND [tgt].[Drivetype] = [src].[SourceDrivetypeCode];





/* ************************************************************************************ */
/* Insert Missing Exterior Color IDs ************************************************** */
/* ************************************************************************************ */
INSERT INTO [dbo].[DimVehicleExteriorColor] (
	[ExteriorColorDescription]
	, [StandardExteriorColor]
	, [SourceExteriorColorID]
	, [SourceSystemID]
	, [Meta_ComputerName]
	, [Meta_LoadDate]
	, [Meta_RowLastChangeDate]
	, [Meta_UserID]
)
SELECT	DISTINCT [src].[ExteriorColor]
		, 'Needs Mapping' AS StandardExteriorColor
		, [src].[ExteriorColor] AS SourceExteriorColorID
		, [src].[Meta_Src_Sys_ID] AS SourceSystemID
		, [src].[Meta_ComputerName]
		, SYSDATETIME() AS Meta_LoadDate
		, SYSDATETIME() AS Meta_RowLastChangeDate
		, [src].[Meta_UserID]
from	[SynWrkDimVehicleVehicleMart] AS src
		LEFT JOIN [dbo].[DimVehicleExteriorColor] AS tgt
			ON [src].[Meta_Src_Sys_ID] = [tgt].[SourceSystemID]
			AND [src].[ExteriorColor] = [tgt].[SourceExteriorColorID]
WHERE	[tgt].[VehicleExteriorColorID] IS NULL
		AND [src].[ExteriorColor] IS NOT NULL;
/* Update Exterior Color IDs ********************************************************** */
UPDATE	[tgt]
SET		[tgt].[exteriorcolorid] = [src].[VehicleExteriorColorID]
FROM	[SynWrkDimVehicleVehicleMart] AS tgt
		INNER JOIN [dbo].[DimVehicleExteriorColor] AS src
			ON [tgt].[Meta_Src_Sys_ID] = [src].[SourceSystemID]
			AND [tgt].[ExteriorColor] = [src].[SourceExteriorColorID];





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
from	[SynWrkDimVehicleVehicleMart] AS src
		LEFT JOIN [dbo].[DimVehicleFuelType] AS tgt
			ON [src].[Meta_Src_Sys_ID] = [tgt].[SourceSystemID]
			AND [src].[FuelType] = [tgt].[SourceFuelTypeCode]
WHERE	[tgt].[VehicleFuelTypeId] IS NULL
		AND [src].[FuelType] IS NOT NULL;
/* Update FuelType IDs **************************************************************** */
UPDATE	[tgt]
SET		[tgt].[FuelTypeId] = [src].[VehicleFuelTypeID]
FROM	[SynWrkDimVehicleVehicleMart] AS tgt
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
	, Meta_LoadDate
	, Meta_RowLastChangeDate
	, Meta_UserID
)
SELECT	DISTINCT [src].[InteriorColor]
		, 'Needs Mapping' AS StandardInteriorColor
		, [src].[InteriorColor] AS SourceInteriorColorID
		, [src].[Meta_Src_Sys_ID] AS SourceSystemID
		, [src].[Meta_ComputerName]
		, SYSDATETIME() AS Meta_LoadDate
		, SYSDATETIME() AS Meta_RowLastChangeDate
		, [src].[Meta_UserID]
from	[SynWrkDimVehicleVehicleMart] AS src
		LEFT JOIN [dbo].[DimVehicleInteriorColor] AS tgt
			ON [src].[Meta_Src_Sys_ID] = [tgt].[SourceSystemID]
			AND [src].[InteriorColor] = [tgt].[SourceInteriorColorID]
WHERE	[tgt].[VehicleInteriorColorID] IS NULL
		AND [src].[InteriorColor] IS NOT NULL;
/* Update Interior Color IDs ********************************************************** */
UPDATE	[tgt]
SET		[tgt].[InteriorColorId] = [src].[VehicleInteriorColorID]
FROM	[SynWrkDimVehicleVehicleMart] AS tgt
		INNER JOIN [dbo].[DimVehicleInteriorColor] AS src
			ON [tgt].[Meta_Src_Sys_ID] = [src].[SourceSystemID]
			AND [tgt].[InteriorColor] = [src].[SourceInteriorColorID];




/* ************************************************************************************ */
/* Insert Missing MakeIDs ************************************************************* */
/* ************************************************************************************ */
INSERT INTO [dbo].[DimVehicleMake](
		[SourceMakeCode]
		, [StandardMakeDescription]
		, [MakeDescription]
		, [Meta_ComputerName]
		, [Meta_LoadDate]
		, [Meta_RowLastChangeDate]
		, [Meta_UserID]
)
SELECT	DISTINCT [src].[Make] AS SourceMakeCode
		, 'Unknown' AS StandardMakeDescription /* unknown instead of needs mapping per business */
		, [src].[Make] AS MakeDesription
		, [src].[Meta_ComputerName]
		, SYSDATETIME() AS Meta_LoadDate
		, SYSDATETIME() AS Meta_RowLastChangeDate
		, [src].[Meta_UserID]
FROM 	[SynWrkDimVehicleVehicleMart] AS src
		LEFT JOIN [dbo].[DimVehicleMake] AS tgt
			ON [src].[Make] = [tgt].[SourceMakeCode]
WHERE	[tgt].[VehicleMakeID] IS NULL
		AND [src].[Make] IS NOT NULL;
/* Update Make IDs ******************************************************************** */
UPDATE	[src]
SET		[src].[MakeID] = [tgt].[VehicleMakeID]
FROM 	[SynWrkDimVehicleVehicleMart] AS src
		INNER JOIN [dbo].[DimVehicleMake] AS tgt
			ON [src].[Make] = [tgt].[SourceMakeCode];





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
SELECT	DISTINCT [src].[Make]
		, [src].[ModelCode] AS SourceModelCode
		, [src].[Model] AS ModelDescription
		, [src].[Model] AS ModelCategory
		, ISNULL(NULLIF(LTRIM(RTRIM([src].[Series])),''),[src].[Model]) AS ModelSubCategory
		, [src].[Meta_ComputerName]
		, SYSDATETIME() AS Meta_LoadDate
		, SYSDATETIME() AS Meta_RowLastChangeDate
		, [src].[Meta_UserID]
FROM 	[SynWrkDimVehicleVehicleMart] AS src
		LEFT JOIN [dbo].[DimVehicleModel] AS tgt
			ON [src].[Make] = [tgt].[SourceMakeCode]
			AND [src].[ModelCode] = [tgt].[SourceModelCode]
WHERE	[tgt].[VehicleModelID] IS NULL
		AND [src].[Make] is not NULL
		AND [src].[ModelCode] IS NOT NULL;
/* Update Model IDs ******************************************************************* */
UPDATE	[tgt]
SET		[tgt].[ModelID] = [src].[VehicleModelID]
FROM	[SynWrkDimVehicleVehicleMart] AS tgt
		INNER JOIN [dbo].[DimVehicleModel] AS src
			ON [tgt].[Make] = [src].[SourceMakeCode]
			AND [tgt].[ModelCode] = [src].[SourceModelCode];





/* ************************************************************************************ */
/* Insert Missing Series ************************************************************** */
/* ************************************************************************************ */
INSERT INTO [dbo].[DimVehicleSeries](
		[SourceModelCode]
		, [SourceSeriesCode]
		, [SourceSystemId]
		, [SeriesDescription]
		, [StandardSeriesDescription]
		, [Meta_ComputerName]
		, [Meta_LoadDate]
		, [Meta_RowLastChangeDate]
		, [Meta_UserID]
)
SELECT	DISTINCT [src].[Model] AS SourceModelCode
		, [src].[Series] AS SourceSeriesCode
		, [src].[Meta_Src_Sys_ID] AS [SourceSystemID]
		, [src].[Series] AS SeriesDescription
		, [src].[Series] AS StandardSeriesDescription
		, [src].[Meta_ComputerName]
		, SYSDATETIME() AS Meta_LoadDate
		, SYSDATETIME() AS Meta_RowLastChangeDate
		, [src].[Meta_UserID]
FROM 	[SynWrkDimVehicleVehicleMart] AS src
		LEFT JOIN [dbo].[DimVehicleSeries] AS tgt
			ON  [src].[Meta_Src_Sys_id] = [tgt].[SourceSystemId]
			AND [src].[model] = [tgt].[SourceModelCode]
			AND [src].[series] = [tgt].[SourceSeriesCode]
WHERE	[tgt].[VehicleSeriesID] IS NULL
		AND [src].[Model] is not NULL
		AND [src].[Series] IS NOT NULL;
/* Update Model IDs ******************************************************************* */
UPDATE	[tgt]
SET		[tgt].[SeriesID] = [src].[VehicleSeriesID]
FROM	[SynWrkDimVehicleVehicleMart] AS tgt
		INNER JOIN [dbo].[DimVehicleSeries] AS src
			ON  [tgt].[Meta_Src_Sys_ID] = [src].[SourceSystemId]
			AND [tgt].[Model] = [src].[SourceModelCode]
			AND [tgt].[Series] = [src].[SourceSeriesCode];





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
SELECT	DISTINCT [src].[TrimCode]
		, 'Needs Mapping' AS StandardTrimDescription
		, [src].[TrimCode]
		, [src].[Meta_Src_Sys_Id]
		, [src].[Meta_ComputerName]
		, SYSDATETIME() AS Meta_LoadDate
		, SYSDATETIME() AS Meta_RowLastChangeDate
		, [src].[Meta_UserID]
FROM 	[SynWrkDimVehicleVehicleMart] AS src
		LEFT JOIN [dbo].[DimVehicleTrim] AS tgt
			ON [src].[Meta_Src_Sys_id] = [tgt].[SourceSystemId]
			AND [src].[TrimCode] = [tgt].[SourceTrimCode]
WHERE	[tgt].[VehicleTrimID] IS NULL
		AND [src].[TrimCode] is not NULL;
/* Update Trim IDs ******************************************************************** */
UPDATE	[tgt]
SET		[tgt].[TrimID] = [src].[VehicleTrimID]
FROM	[SynWrkDimVehicleVehicleMart] AS tgt
		INNER JOIN [dbo].[DimVehicleTrim] AS src
			ON [tgt].[Meta_Src_Sys_Id] = [src].[SourceSystemId]
			AND [tgt].[TrimCode] = [src].[SourceTrimCode];





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
SELECT	DISTINCT [src].[Transmission]
		, 'Needs Mapping' AS StandardTransmission
		, [src].[Transmission] AS SourceTransmissionCode
		, [src].[Meta_Src_Sys_ID] AS SourceSystemID
		, [src].[Meta_ComputerName]
		, SYSDATETIME() AS Meta_LoadDate
		, SYSDATETIME() AS Meta_RowLastChangeDate
		, [src].[Meta_UserID]
from	[SynWrkDimVehicleVehicleMart] AS src
		LEFT JOIN [dbo].[DimVehicleTransmission] AS tgt
			ON [src].[Meta_Src_Sys_ID] = [tgt].[SourceSystemID]
			AND [src].[Transmission] = [tgt].[SourceTransmissionCode]
WHERE	[tgt].[VehicleTransmissionId] IS NULL
		AND [src].[Transmission] IS NOT NULL;
/* Update Transmission IDs ************************************************************ */
UPDATE	[tgt]
SET		[tgt].[TransmissionId] = [src].[VehicleTransmissionID]
FROM	[SynWrkDimVehicleVehicleMart] AS tgt
		INNER JOIN [dbo].[DimVehicleTransmission] AS src
			ON [tgt].[Meta_Src_Sys_ID] = [src].[SourceSystemID]
			AND [tgt].[Transmission] = [src].[SourceTransmissionCode];





/* ************************************************************************************ */
/* Update Dim VIN with Vehicle Mart Data ********************************************** */
/* ************************************************************************************ */
UPDATE	[tgt]
SET		[tgt].[VehicleMartId]			= [src].[VehId]
		, [tgt].[Meta_ComputerName]		= [src].[Meta_ComputerName]
		, [tgt].[Meta_Src_Sys_ID]		= [src].[Meta_Src_Sys_ID]
		, [tgt].[Meta_SourceSystemName]	= [src].[Meta_SourceSystemName]
		, [tgt].[Meta_UserID]			= [src].[Meta_UserID]
FROM	[DimVin] AS tgt
		INNER JOIN [SynWrkDimVehicleVehicleMart] AS src
			ON [tgt].[VehicleKey] = [src].[VehicleKey];





/* ************************************************************************************ */
/* Update Dim Vehicle with Vehicle Mart Data ****************************************** */
/* ************************************************************************************ */
UPDATE	[tgt]
SET		[tgt].[VehicleBodyStyleId]			= [src].[BodyStyleId]
		, [tgt].[VehicleCylinderID]			= [src].[CylinderId]
		, [tgt].[Displacement]				= [src].[Displacement]
		, [tgt].[VehicleDriveTypeId]		= [src].[DriveTypeId]
		, [tgt].[EpaMileage]				= [src].[EpaMileage]
		, [tgt].[VehicleExteriorColorId]	= [src].[ExteriorColorId]
		, [tgt].[VehicleFuelTypeId]			= [src].[FuelTypeId]
		, [tgt].[VehicleInteriorColorId]	= [src].[InteriorColorId]
		, [tgt].[IsPanoramic]				= [src].[IsPanoramic]
		, [tgt].[IsNav]						= [src].[IsNav]
		, [tgt].[IsLeather]					= [src].[IsLeather]
		, [tgt].[VehicleMakeId]				= [src].[MakeId]
		, [tgt].[VehicleModelId]			= [src].[ModelId]
		, [tgt].[ModelYear]					= [src].[ModelYear]
		, [tgt].[VehicleSeriesID]			= [src].[SeriesId]
		, [tgt].[VehicleTransmissionId]		= [src].[TransmissionId]
		, [tgt].[VehicleTrimId]				= [src].[TrimId]
		, [tgt].[UVC]						= [src].[UVC]
		, [tgt].[ETLExecution_ID]			= [src].[ETLExecution_ID]
		, [tgt].[Meta_ComputerName]			= [src].[Meta_ComputerName]
		, [tgt].[Meta_SourceSystemName]		= [src].[Meta_SourceSystemName]
		, [tgt].[Meta_SourceSystemWeight]	= [src].[Meta_SourceSystemWeight]
		, [tgt].[Meta_Src_Sys_ID]			= [src].[Meta_Src_Sys_ID]
		, [tgt].[Meta_UserID]				= [src].[Meta_UserID]
		---, Meta_Src_Sys_ID_Current, Meta_SourceSystemNameCurrent, Meta_SourceSystemWeightCurrent -- only updated from lower Source systems
FROM	[DimVehicle] AS tgt
		INNER JOIN [SynWrkDimVehicleVehicleMart] AS src
			ON [tgt].[VehicleKey] = [src].[VehicleKey];
/* capture update counts ************************************************************** */
SELECT	@InsertedRowCnts = 0
		, @UpdatedRowCnts = @@rowcount;
```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
