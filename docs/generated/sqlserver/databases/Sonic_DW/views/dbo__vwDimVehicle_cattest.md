---
name: vwDimVehicle_cattest
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Definition

```sql





CREATE VIEW [dbo].[vwDimVehicle_cattest] AS
SELECT	/* vin records */
		[vin].[VehicleKey], [vin].[Vin]
		, CASE WHEN [vin].[IsActiveVin] = 1 THEN 'Y' ELSE 'N' END AS IsActiveVin
		, [vin].[IsValidVin]

		/* vehicle records */
		, [bs].[VehicleBodyStyleId]
		, [bs].[BodyStyleDescription]
		, [bs].[StandardBodyStyle]

		, [cab].[VehicleCabId]
		, [cab].[CabDescription]
		, [cab].[StandardCabDescription]

		, [cat].[VehicleCategoryId]
		, [cat].[CategoryDescription]
		, [cat].[StandardCategoryDescription]

		, [cha].[VehicleChassisId]
		, [cha].[ChassisDescription]
		, [cha].[StandardChassisDescription]

		--, [veh].[ChromeStyleId]

		, [cyl].[VehicleCylinderId]
		, [cyl].[CylinderDescription]
		, [cyl].[StandardCylinderDescription]
		, [cyl].[NumberOfCylinders]

		, [dmv].[VehicleDMVCategoryId]
		, [dmv].[StandardDMVCategoryDescription]
		, [dmv].[DMVCategoryDescription]

		, [veh].[Displacement]

		, [dri].[VehicleDriveTypeId]
		, [dri].[DriveTypeDescription]
		, [dri].[StandardDriveTypeDescription]

		, [veh].[EpaMileage]

		, [eng].[VehicleEngineId]
		, [eng].[EngineDescription]
		, [eng].[StandardEngineDescription]

		, [ext].[VehicleExteriorColorId]
		, [ext].[ExteriorColorDescription]
		, [ext].[StandardExteriorColor]

		, [fue].[VehicleFuelTypeId]
		, [fue].[FuelTypeDescription]
		, [fue].[StandardFuelTypeDescription]

		, [vic].[VehicleInteriorColorId]
		, [vic].[InteriorColorDescription]
		, [vic].[StandardInteriorColor]

		, [veh].[IsChromeDecoded]
		, [veh].[IsPanoramic]
		, [veh].[IsNav]
		, [veh].[IsLeather]

		, [mak].[VehicleMakeId]
		, [mak].[StandardMakeDescription]
		, [mak].[MakeDescription]

		, [mdl].[VehicleModelId]
		, [mdl].[ModelDescription]
		, ISNULL([vmc].[ModelCategory], 'Needs Mapping') as ModelCategory
		, ISNULL([vmc].[ModelSubCategory], 'Needs Mapping') as ModelSubCategory

		, [mnum].[VehicleModelNumberId]
		, [mnum].[ModelNumberDescription]
		, [mnum].[StandardModelNumberDescription]

		, [veh].[ModelYear]
		, [veh].[NumberOfDoors]
		, [veh].[NumberOfPassengers]

		, [res].[VehicleRestraintsId]
		, [res].[RestraintsDescription]
		, [res].[StandardRestraintsDescription]

		, [ser].[VehicleSeriesId]
		, [ser].[SeriesDescription]
		, [ser].[StandardSeriesDescription]

		, [trn].[VehicleTransmissionId]
		, [trn].[TransmissionDescription]
		, [trn].[StandardTransmissionDescription]

		, [trm].[VehicleTrimId]
		, [trm].[TrimDescription]
		, [trm].[StandardTrimDescription]

		, [veh].[UVC]
		, [veh].[Meta_RowEffectiveDate]
		, [veh].[Meta_Src_Sys_ID_Current]
		, [veh].[Meta_SourceSystemNameCurrent]
		, [veh].[Meta_SourceSystemName]
FROM	[dbo].[DimVin] AS [vin]
		LEFT JOIN [DimVehicle] AS veh
			ON [vin].[vehiclekey] = ISNULL([veh].[vehiclekey],-1)
		LEFT JOIN [DimVehicleBodyStyle] AS bs
			ON [veh].[VehicleBodyStyleId] = [bs].[VehicleBodyStyleId]
		LEFT JOIN [DimVehicleCab] AS cab
			ON [veh].[VehicleCabId] = [cab].[VehicleCabId]
		LEFT JOIN [DimVehicleCategory] AS cat
			ON [veh].[VehicleCategoryId] = [cat].[VehicleCategoryId]
		LEFT JOIN [DimVehicleChassis] AS cha
			ON [veh].[VehicleChassisId] = [cha].[VehicleChassisId]
		LEFT JOIN [DimVehicleCylinders] AS cyl
			ON [veh].[VehicleCylinderId] = [cyl].[VehicleCylinderId]
		LEFT JOIN [DimVehicleDMVCategory] AS dmv
			ON [veh].[VehicleDMVCategoryId] = [dmv].[VehicleDMVCategoryId]
		LEFT JOIN [DimVehicleDriveType] AS dri
			ON [veh].[VehicleDriveTypeId] = [dri].[VehicleDriveTypeId]
		LEFT JOIN [DimVehicleEngine] AS eng
			ON [veh].[VehicleEngineId] = [eng].[VehicleEngineId]
		LEFT JOIN [DimVehicleExteriorColor] AS ext
			ON [veh].[VehicleExteriorColorId] = [ext].[VehicleExteriorColorId]
		LEFT JOIN [DimVehicleFuelType] AS fue
			ON [veh].[VehicleFuelTypeId] = [fue].[VehicleFuelTypeId]
		LEFT JOIN [DimVehicleInteriorColor] AS vic
			ON [veh].[VehicleInteriorColorId] = [vic].[VehicleInteriorColorId]
		LEFT JOIN [DimVehicleMake] AS mak
			ON [veh].[VehicleMakeId] = [mak].[VehicleMakeId]
		LEFT JOIN [DimVehicleModel] AS mdl
			ON [veh].[VehicleModelId] = [mdl].[VehicleModelId]
		LEFT JOIN [DimVehicleModelNumber] AS mnum
			ON [veh].[VehicleModelNumberId] = [mnum].[VehicleModelNumberId]
		LEFT JOIN [DimVehicleRestraints] AS res
			ON [veh].[VehicleRestraintsId] = [res].[VehicleRestraintsId]
		LEFT JOIN [DimVehicleSeries] AS ser
			ON [veh].[VehicleSeriesID] = [ser].[VehicleSeriesId]
		LEFT JOIN [DimVehicleTransmission] AS trn
			ON [veh].[VehicleTransmissionId] = [trn].[VehicleTransmissionId]
		LEFT JOIN [DimVehicleTrim] AS trm
			ON [veh].[VehicleTrimId] = [trm].[VehicleTrimId]
		Left join Dim_Vehicle dv
			ON vin.vin = dv.vehVIN
		Left join DimVehicleModelCategory vmc
			ON vmc.[SourceMakeCode] = dv.vehMakeCode
				and vmc.[SourceMakeDesc] = dv.vehMakeDesc
				and vmc.[SourceModelCode] = dv.vehModelCode
				and vmc.[SourceModelDesc] = dv.vehModelDesc
				and vmc.ModelCategory = dv.vehModelCategory
				and vmc.ModelSubCategory = dv.vehModelSubCategory


```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
