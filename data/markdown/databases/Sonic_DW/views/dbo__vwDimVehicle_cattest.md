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
depends_on:
  - Dim_Vehicle
  - DimVehicle
  - DimVehicleBodyStyle
  - DimVehicleCab
  - DimVehicleCategory
  - DimVehicleChassis
  - DimVehicleCylinders
  - DimVehicleDMVCategory
  - DimVehicleDriveType
  - DimVehicleEngine
  - DimVehicleExteriorColor
  - DimVehicleFuelType
  - DimVehicleInteriorColor
  - DimVehicleMake
  - DimVehicleModel
  - DimVehicleModelCategory
  - DimVehicleModelNumber
  - DimVehicleRestraints
  - DimVehicleSeries
  - DimVehicleTransmission
  - DimVehicleTrim
  - DimVin
dependency_count: 22
column_count: 74
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_Vehicle** (U )
- **dbo.DimVehicle** (U )
- **dbo.DimVehicleBodyStyle** (U )
- **dbo.DimVehicleCab** (U )
- **dbo.DimVehicleCategory** (U )
- **dbo.DimVehicleChassis** (U )
- **dbo.DimVehicleCylinders** (U )
- **dbo.DimVehicleDMVCategory** (U )
- **dbo.DimVehicleDriveType** (U )
- **dbo.DimVehicleEngine** (U )
- **dbo.DimVehicleExteriorColor** (U )
- **dbo.DimVehicleFuelType** (U )
- **dbo.DimVehicleInteriorColor** (U )
- **dbo.DimVehicleMake** (U )
- **dbo.DimVehicleModel** (U )
- **dbo.DimVehicleModelCategory** (U )
- **dbo.DimVehicleModelNumber** (U )
- **dbo.DimVehicleRestraints** (U )
- **dbo.DimVehicleSeries** (U )
- **dbo.DimVehicleTransmission** (U )
- **dbo.DimVehicleTrim** (U )
- **dbo.DimVin** (U )

## Columns

| Name                              | Type      | Nullable | Description |
| --------------------------------- | --------- | -------- | ----------- |
| `VehicleKey`                      | int       |          |             |
| `Vin`                             | varchar   |          |             |
| `IsActiveVin`                     | varchar   |          |             |
| `IsValidVin`                      | varchar   |          |             |
| `VehicleBodyStyleId`              | int       | ✓        |             |
| `BodyStyleDescription`            | varchar   | ✓        |             |
| `StandardBodyStyle`               | varchar   | ✓        |             |
| `VehicleCabId`                    | int       | ✓        |             |
| `CabDescription`                  | varchar   | ✓        |             |
| `StandardCabDescription`          | varchar   | ✓        |             |
| `VehicleCategoryId`               | int       | ✓        |             |
| `CategoryDescription`             | varchar   | ✓        |             |
| `StandardCategoryDescription`     | varchar   | ✓        |             |
| `VehicleChassisId`                | int       | ✓        |             |
| `ChassisDescription`              | varchar   | ✓        |             |
| `StandardChassisDescription`      | varchar   | ✓        |             |
| `VehicleCylinderId`               | int       | ✓        |             |
| `CylinderDescription`             | varchar   | ✓        |             |
| `StandardCylinderDescription`     | varchar   | ✓        |             |
| `NumberOfCylinders`               | smallint  | ✓        |             |
| `VehicleDMVCategoryId`            | int       | ✓        |             |
| `StandardDMVCategoryDescription`  | varchar   | ✓        |             |
| `DMVCategoryDescription`          | varchar   | ✓        |             |
| `Displacement`                    | varchar   | ✓        |             |
| `VehicleDriveTypeId`              | int       | ✓        |             |
| `DriveTypeDescription`            | varchar   | ✓        |             |
| `StandardDriveTypeDescription`    | varchar   | ✓        |             |
| `EpaMileage`                      | varchar   | ✓        |             |
| `VehicleEngineId`                 | int       | ✓        |             |
| `EngineDescription`               | varchar   | ✓        |             |
| `StandardEngineDescription`       | varchar   | ✓        |             |
| `VehicleExteriorColorId`          | int       | ✓        |             |
| `ExteriorColorDescription`        | varchar   | ✓        |             |
| `StandardExteriorColor`           | varchar   | ✓        |             |
| `VehicleFuelTypeId`               | int       | ✓        |             |
| `FuelTypeDescription`             | varchar   | ✓        |             |
| `StandardFuelTypeDescription`     | varchar   | ✓        |             |
| `VehicleInteriorColorId`          | int       | ✓        |             |
| `InteriorColorDescription`        | varchar   | ✓        |             |
| `StandardInteriorColor`           | varchar   | ✓        |             |
| `IsChromeDecoded`                 | bit       | ✓        |             |
| `IsPanoramic`                     | bit       | ✓        |             |
| `IsNav`                           | bit       | ✓        |             |
| `IsLeather`                       | bit       | ✓        |             |
| `VehicleMakeId`                   | int       | ✓        |             |
| `StandardMakeDescription`         | varchar   | ✓        |             |
| `MakeDescription`                 | varchar   | ✓        |             |
| `VehicleModelId`                  | int       | ✓        |             |
| `ModelDescription`                | varchar   | ✓        |             |
| `ModelCategory`                   | varchar   |          |             |
| `ModelSubCategory`                | varchar   |          |             |
| `VehicleModelNumberId`            | int       | ✓        |             |
| `ModelNumberDescription`          | varchar   | ✓        |             |
| `StandardModelNumberDescription`  | varchar   | ✓        |             |
| `ModelYear`                       | int       | ✓        |             |
| `NumberOfDoors`                   | int       | ✓        |             |
| `NumberOfPassengers`              | int       | ✓        |             |
| `VehicleRestraintsId`             | int       | ✓        |             |
| `RestraintsDescription`           | varchar   | ✓        |             |
| `StandardRestraintsDescription`   | varchar   | ✓        |             |
| `VehicleSeriesId`                 | int       | ✓        |             |
| `SeriesDescription`               | varchar   | ✓        |             |
| `StandardSeriesDescription`       | varchar   | ✓        |             |
| `VehicleTransmissionId`           | int       | ✓        |             |
| `TransmissionDescription`         | varchar   | ✓        |             |
| `StandardTransmissionDescription` | varchar   | ✓        |             |
| `VehicleTrimId`                   | int       | ✓        |             |
| `TrimDescription`                 | varchar   | ✓        |             |
| `StandardTrimDescription`         | varchar   | ✓        |             |
| `UVC`                             | decimal   | ✓        |             |
| `Meta_RowEffectiveDate`           | datetime2 | ✓        |             |
| `Meta_Src_Sys_ID_Current`         | int       | ✓        |             |
| `Meta_SourceSystemNameCurrent`    | varchar   | ✓        |             |
| `Meta_SourceSystemName`           | varchar   | ✓        |             |

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

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
