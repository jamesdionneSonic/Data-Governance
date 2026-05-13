---
name: Dim_Geography
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - dimension
  - core-schema
depends_on:
  - Dim_Customer
  - Dim_DMSCustomer
  - dim_dmsCustomer_bk05052022
  - Dim_DMSCustomer_history
row_count: 0
size_kb: 0
column_count: 13
index_count: 0
check_constraint_count: 0
extraction_warnings:
  - MISSING_VIEW_DATABASE_STATE
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: table
- **Schema**: dbo
- **Row Count**: 0
- **Size**: 0 KB

## Columns

| Name                | Type    | Nullable | Identity | Default | Description |
| ------------------- | ------- | -------- | -------- | ------- | ----------- |
| `DimGeoLocationId`  | int     |          |          |         |             |
| `IsSonicRegion`     | varchar | ✓        |          |         |             |
| `Region`            | varchar |          |          |         |             |
| `SubRegion`         | varchar | ✓        |          |         |             |
| `StateProvince`     | varchar | ✓        |          |         |             |
| `StateProvinceCode` | varchar | ✓        |          |         |             |
| `County`            | varchar | ✓        |          |         |             |
| `CountyFIPS`        | varchar | ✓        |          |         |             |
| `MetroArea`         | varchar | ✓        |          |         |             |
| `City`              | varchar | ✓        |          |         |             |
| `PostalCode`        | varchar | ✓        |          |         |             |
| `Latitude`          | float   | ✓        |          |         |             |
| `Longitude`         | float   | ✓        |          |         |             |

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.Dim_Customer → dbo.Dim_Geography
  - Confidence: 80%
  - Evidence: Exact column name match: "dimgeolocationid" in both tables
  - Column: `DimGeoLocationID` → `DimGeoLocationId`
- **column_match**: dbo.Dim_DMSCustomer → dbo.Dim_Geography
  - Confidence: 80%
  - Evidence: Exact column name match: "dimgeolocationid" in both tables
  - Column: `DimGeoLocationID` → `DimGeoLocationId`
- **column_match**: dbo.dim_dmsCustomer_bk05052022 → dbo.Dim_Geography
  - Confidence: 80%
  - Evidence: Exact column name match: "dimgeolocationid" in both tables
  - Column: `DimGeoLocationID` → `DimGeoLocationId`
- **column_match**: dbo.Dim_DMSCustomer_history → dbo.Dim_Geography
  - Confidence: 80%
  - Evidence: Exact column name match: "dimgeolocationid" in both tables
  - Column: `DimGeoLocationID` → `DimGeoLocationId`
- **column_match**: dbo.Dim_Geography → dbo.Dim_GeoLocation
  - Confidence: 80%
  - Evidence: Exact column name match: "dimgeolocationid" in both tables
  - Column: `DimGeoLocationId` → `DimGeoLocationId`
- **column_match**: dbo.Dim_Geography → dbo.ServiceCustomerDetail
  - Confidence: 80%
  - Evidence: Exact column name match: "dimgeolocationid" in both tables
  - Column: `DimGeoLocationId` → `DimGeoLocationID`
- **column_match**: dbo.Dim_Geography → dbo.xDim_Customer
  - Confidence: 80%
  - Evidence: Exact column name match: "dimgeolocationid" in both tables
  - Column: `DimGeoLocationId` → `DimGeoLocationID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
