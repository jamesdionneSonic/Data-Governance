---
name: Metric
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on:
  - DimSourceSystem
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
  - DimVehicleModelNumber
  - DimVehicleRestraints
  - DimVehicleSeries
  - DimVehicleTransmission
  - DimVehicleTrim
row_count: 0
size_kb: 0
column_count: 19
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

| Name                | Type     | Nullable | Identity | Default | Description |
| ------------------- | -------- | -------- | -------- | ------- | ----------- |
| `MetricID`          | int      |          |          |         |             |
| `HFM_ID`            | int      | ✓        |          |         |             |
| `MetricCode`        | varchar  | ✓        |          |         |             |
| `ParentMetricCode`  | int      | ✓        |          |         |             |
| `MetricName`        | varchar  | ✓        |          |         |             |
| `MetricDescription` | varchar  | ✓        |          |         |             |
| `IsLeaf`            | int      | ✓        |          |         |             |
| `DistanceFromLeaf`  | int      | ✓        |          |         |             |
| `MetricType`        | varchar  | ✓        |          |         |             |
| `Department`        | varchar  | ✓        |          |         |             |
| `SourceSystemID`    | int      | ✓        |          |         |             |
| `CreatedBy`         | varchar  | ✓        |          |         |             |
| `CreatedOn`         | datetime | ✓        |          |         |             |
| `ModifiedBy`        | varchar  | ✓        |          |         |             |
| `ModifiedOn`        | datetime | ✓        |          |         |             |
| `ApprovedBy`        | varchar  | ✓        |          |         |             |
| `ApprovedOn`        | datetime | ✓        |          |         |             |
| `StatusID`          | int      | ✓        |          |         |             |
| `FactType`          | varchar  | ✓        |          |         |             |

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.Metric → dbo.MetricReport
  - Confidence: 80%
  - Evidence: Exact column name match: "statusid" in both tables
  - Column: `StatusID` → `StatusID`
- **column_match**: dbo.Metric → dbo.OpsReviewItem
  - Confidence: 80%
  - Evidence: Exact column name match: "statusid" in both tables
  - Column: `StatusID` → `StatusID`
- **column_match**: dbo.Metric → dbo.OpsReviewItemDetail
  - Confidence: 80%
  - Evidence: Exact column name match: "statusid" in both tables
  - Column: `StatusID` → `StatusID`
- **column_match**: dbo.Metric → dbo.OpsStatus
  - Confidence: 80%
  - Evidence: Exact column name match: "statusid" in both tables
  - Column: `StatusID` → `StatusID`
- **column_match**: dbo.Metric → dbo.PlaybookStatus
  - Confidence: 80%
  - Evidence: Exact column name match: "statusid" in both tables
  - Column: `StatusID` → `StatusID`
- **column_match**: dbo.Metric → dbo.START_Metrics
  - Confidence: 80%
  - Evidence: Exact column name match: "statusid" in both tables
  - Column: `StatusID` → `StatusID`
- **column_match**: dbo.DimSourceSystem → dbo.Metric
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemID` → `SourceSystemID`
- **column_match**: dbo.DimVehicleBodyStyle → dbo.Metric
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemID`
- **column_match**: dbo.DimVehicleCab → dbo.Metric
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemID`
- **column_match**: dbo.DimVehicleCategory → dbo.Metric
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemID`
- **column_match**: dbo.DimVehicleChassis → dbo.Metric
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemID`
- **column_match**: dbo.DimVehicleCylinders → dbo.Metric
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemID`
- **column_match**: dbo.DimVehicleDMVCategory → dbo.Metric
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemID`
- **column_match**: dbo.DimVehicleDriveType → dbo.Metric
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemID`
- **column_match**: dbo.DimVehicleEngine → dbo.Metric
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemID`
- **column_match**: dbo.DimVehicleExteriorColor → dbo.Metric
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemID`
- **column_match**: dbo.DimVehicleFuelType → dbo.Metric
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemID`
- **column_match**: dbo.DimVehicleInteriorColor → dbo.Metric
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemID`
- **column_match**: dbo.DimVehicleModelNumber → dbo.Metric
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemID`
- **column_match**: dbo.DimVehicleRestraints → dbo.Metric
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemID`
- **column_match**: dbo.DimVehicleSeries → dbo.Metric
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemID`
- **column_match**: dbo.DimVehicleTransmission → dbo.Metric
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemID`
- **column_match**: dbo.DimVehicleTrim → dbo.Metric
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemID`
- **column_match**: dbo.Metric → dbo.START_Metrics
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemID` → `SourceSystemID`
- **column_match**: dbo.Metric → dbo.MetricAccountXref
  - Confidence: 80%
  - Evidence: Exact column name match: "metricid" in both tables
  - Column: `MetricID` → `MetricID`
- **column_match**: dbo.Metric → dbo.MetricReportGroup
  - Confidence: 80%
  - Evidence: Exact column name match: "metricid" in both tables
  - Column: `MetricID` → `MetricID`
- **column_match**: dbo.Metric → dbo.PettyCashMisuse
  - Confidence: 80%
  - Evidence: Exact column name match: "metricid" in both tables
  - Column: `MetricID` → `MetricID`
- **column_match**: dbo.Metric → dbo.START_Metrics
  - Confidence: 80%
  - Evidence: Exact column name match: "metricid" in both tables
  - Column: `MetricID` → `MetricID`
- **column_match**: dbo.Metric → dbo.START_Metrics
  - Confidence: 80%
  - Evidence: Exact column name match: "hfm_id" in both tables
  - Column: `HFM_ID` → `HFM_ID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
