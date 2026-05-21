---
name: vw_DimVehicleBridge
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

2- **Type**: View

- **Schema**: dbo

## Definition

```sql

CREATE VIEW [dbo].[vw_DimVehicleBridge]
AS
SELECT
VehicleKey,
StandardMakeDescription,
MakeDescription,
a.SourceMakeCode,
ModelDescription,
ModelCategory,
ModelSubCategory,
SourceModelCode,
SeriesDescription,
StandardSeriesDescription,
Vin,
TrimDescription,
StandardTrimDescription,
SourceTrimCode,
Dim_VehicleKey,
a.VehMakeDesc,
a.VehModelCode,
a.VehModelDesc,
VehModelYear,
VehSeriesCode,
VehSeriesDesc,
StockNumber,
FuelTypeDescription,
StandardFuelTypeDescription,
SourceFuelTypeCode,
StandardFuelTypeDescriptionRaw
,VM.StandardMakeCode, ev.vehmakecode, CASE WHEN vehmodelyear < 1997 THEN 'ICE' ELSE (CASE WHEN StandardFuelTypeDescriptionRaw NOT IN ('Unknown', 'Needs Mapping') THEN StandardFuelTypeDescriptionRaw ELSE ev.fueltype END) END fueltype, a.VehMakeCode AS VehMakeCodeRaw FROM
(SELECT      v.VehicleKey, vmake.StandardMakeDescription, vmake.MakeDescription, vmake.SourceMakeCode, vmod.ModelDescription, vmod.ModelCategory, vmod.ModelSubCategory, vmod.SourceModelCode, vseries.SeriesDescription,
                         vseries.StandardSeriesDescription, vvin.Vin, vtrim.TrimDescription, vtrim.StandardTrimDescription, vtrim.SourceTrimCode, vmain.VehicleKey AS Dim_VehicleKey, vmain.VehMakeCode,
                         vmain.VehMakeDesc, vmain.VehModelCode, vmain.VehModelDesc, vmain.VehModelYear, vmain.VehSeriesCode, vmain.VehSeriesDesc,
                         Sims_DW.dbo.vw_FactVehicleInventorySimsCurrent.StockNumber, dbo.DimVehicleFuelType.FuelTypeDescription,
                         CASE WHEN StandardFuelTypeDescription = 'Unknown' THEN 'ICE' ELSE StandardFuelTypeDescription END AS StandardFuelTypeDescription, dbo.DimVehicleFuelType.SourceFuelTypeCode,
                         dbo.DimVehicleFuelType.StandardFuelTypeDescription AS StandardFuelTypeDescriptionRaw
FROM            dbo.Dim_Vehicle AS vmain RIGHT OUTER JOIN
                         dbo.DimVehicle AS v INNER JOIN
                         dbo.DimVehicleMake AS vmake ON v.VehicleMakeId = vmake.VehicleMakeId INNER JOIN
                         dbo.DimVehicleModel AS vmod ON v.VehicleModelId = vmod.VehicleModelId INNER JOIN
                         dbo.DimVin AS vvin ON v.VehicleKey = vvin.VehicleKey INNER JOIN
                         dbo.DimVehicleTrim AS vtrim ON v.VehicleTrimId = vtrim.VehicleTrimId INNER JOIN
                         dbo.DimVehicleSeries AS vseries ON v.VehicleSeriesID = vseries.VehicleSeriesId INNER JOIN
                         dbo.DimVehicleFuelType ON v.VehicleFuelTypeId = dbo.DimVehicleFuelType.VehicleFuelTypeId LEFT OUTER JOIN
                         Sims_DW.dbo.vw_FactVehicleInventorySimsCurrent ON v.VehicleKey = Sims_DW.dbo.vw_FactVehicleInventorySimsCurrent.VehicleKey ON vmain.VehVIN = vvin.Vin) a
						 LEFT OUTER JOIN
                             (SELECT DISTINCT SourceMakeCode, StandardMakeCode
                               FROM            dbo.DimVehicleMake) AS VM ON COALESCE(a.VehMakeCode, a.SourceMakeCode) = VM.SourceMakeCode
						LEFT OUTER JOIN [ETL_Staging].[dbo].[Microstrategy_EV_Vehicle_Mapping] ev
						ON VM.StandardMakeCode = ev.vehmakecode AND COALESCE(a.VehModelDesc, ModelDescription) = ev.vehmodeldesc

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
