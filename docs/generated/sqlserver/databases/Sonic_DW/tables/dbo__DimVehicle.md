---
name: DimVehicle
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - core-schema
depends_on: []
row_count: 0
size_kb: 0
extraction_warnings:
  - MISSING_VIEW_DATABASE_STATE
  - LITE_MODE_ENABLED
extracted_at: 2026-05-09T12:34:14.349Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: view
- **Schema**: dbo
- **Row Count**: 0
- **Size**: 0 KB

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.
- **LITE_MODE_ENABLED**: Column-level lineage analysis disabled for large extraction (751 tables). Only explicit foreign keys detected.

## Relationships

### High Confidence (≥ 0.8)

- **explicit_fk**: dbo.DimVehicle → dbo.DimVehicleBodyStyle
  - Confidence: 95%
  - Evidence: undefined
  - Column: `VehicleBodyStyleId` → `VehicleBodyStyleId`
- **explicit_fk**: dbo.DimVehicle → dbo.DimVehicleCab
  - Confidence: 95%
  - Evidence: undefined
  - Column: `VehicleCabId` → `VehicleCabId`
- **explicit_fk**: dbo.DimVehicle → dbo.DimVehicleCategory
  - Confidence: 95%
  - Evidence: undefined
  - Column: `VehicleCategoryId` → `VehicleCategoryId`
- **explicit_fk**: dbo.DimVehicle → dbo.DimVehicleDMVCategory
  - Confidence: 95%
  - Evidence: undefined
  - Column: `VehicleDMVCategoryId` → `VehicleDMVCategoryId`
- **explicit_fk**: dbo.DimVehicle → dbo.DimVehicleChassis
  - Confidence: 95%
  - Evidence: undefined
  - Column: `VehicleChassisId` → `VehicleChassisId`
- **explicit_fk**: dbo.DimVehicle → dbo.DimVehicleCylinders
  - Confidence: 95%
  - Evidence: undefined
  - Column: `VehicleCylinderId` → `VehicleCylinderId`
- **explicit_fk**: dbo.DimVehicle → dbo.DimVehicleDriveType
  - Confidence: 95%
  - Evidence: undefined
  - Column: `VehicleDriveTypeId` → `VehicleDriveTypeId`
- **explicit_fk**: dbo.DimVehicle → dbo.DimVehicleEngine
  - Confidence: 95%
  - Evidence: undefined
  - Column: `VehicleEngineId` → `VehicleEngineId`
- **explicit_fk**: dbo.DimVehicle → dbo.DimVehicleExteriorColor
  - Confidence: 95%
  - Evidence: undefined
  - Column: `VehicleExteriorColorId` → `VehicleExteriorColorId`
- **explicit_fk**: dbo.DimVehicle → dbo.DimVehicleFuelType
  - Confidence: 95%
  - Evidence: undefined
  - Column: `VehicleFuelTypeId` → `VehicleFuelTypeId`
- **explicit_fk**: dbo.DimVehicle → dbo.DimVehicleInteriorColor
  - Confidence: 95%
  - Evidence: undefined
  - Column: `VehicleInteriorColorId` → `VehicleInteriorColorId`
- **explicit_fk**: dbo.DimVehicle → dbo.DimVehicleMake
  - Confidence: 95%
  - Evidence: undefined
  - Column: `VehicleMakeId` → `VehicleMakeId`
- **explicit_fk**: dbo.DimVehicle → dbo.DimVehicleModel
  - Confidence: 95%
  - Evidence: undefined
  - Column: `VehicleModelId` → `VehicleModelId`
- **explicit_fk**: dbo.DimVehicle → dbo.DimVehicleRestraints
  - Confidence: 95%
  - Evidence: undefined
  - Column: `VehicleRestraintsId` → `VehicleRestraintsId`
- **explicit_fk**: dbo.DimVehicle → dbo.DimVehicleTransmission
  - Confidence: 95%
  - Evidence: undefined
  - Column: `VehicleTransmissionId` → `VehicleTransmissionId`
- **explicit_fk**: dbo.DimVehicle → dbo.DimVehicleTrim
  - Confidence: 95%
  - Evidence: undefined
  - Column: `VehicleTrimId` → `VehicleTrimId`
- **explicit_fk**: dbo.DimVehicle → dbo.DimVehicleModelNumber
  - Confidence: 95%
  - Evidence: undefined
  - Column: `VehicleModelNumberId` → `VehicleModelNumberId`
- **explicit_fk**: dbo.DimVehicle → dbo.DimVehicleSeries
  - Confidence: 95%
  - Evidence: undefined
  - Column: `VehicleSeriesID` → `VehicleSeriesId`

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
