---
name: START_Metrics
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on:
  - Metric
  - MetricReport
  - OpsReviewItem
  - OpsReviewItemDetail
  - OpsStatus
  - PlaybookStatus
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
  - Metric
  - Metric
  - MetricAccountXref
  - MetricReportGroup
  - PettyCashMisuse
  - Metric
row_count: 0
size_kb: 0
column_count: 19
index_count: 1
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
| `FactType`          | varchar  | ✓        |          |         |             |
| `Department`        | varchar  | ✓        |          |         |             |
| `SourceSystemID`    | int      | ✓        |          |         |             |
| `CreatedBy`         | varchar  | ✓        |          |         |             |
| `CreatedOn`         | datetime | ✓        |          |         |             |
| `ModifiedBy`        | varchar  | ✓        |          |         |             |
| `ModifiedOn`        | datetime | ✓        |          |         |             |
| `ApprovedBy`        | varchar  | ✓        |          |         |             |
| `ApprovedOn`        | datetime | ✓        |          |         |             |
| `StatusID`          | int      | ✓        |          |         |             |

## Constraints

- **Primary Key**: PK_START_Metrics
  - Columns: MetricID

## Indexes

- **PK_START_Metrics** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: MetricID ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.Metric → dbo.START_Metrics
  - Confidence: 80%
  - Evidence: Exact column name match: "statusid" in both tables
  - Column: `StatusID` → `StatusID`
- **column_match**: dbo.MetricReport → dbo.START_Metrics
  - Confidence: 80%
  - Evidence: Exact column name match: "statusid" in both tables
  - Column: `StatusID` → `StatusID`
- **column_match**: dbo.OpsReviewItem → dbo.START_Metrics
  - Confidence: 80%
  - Evidence: Exact column name match: "statusid" in both tables
  - Column: `StatusID` → `StatusID`
- **column_match**: dbo.OpsReviewItemDetail → dbo.START_Metrics
  - Confidence: 80%
  - Evidence: Exact column name match: "statusid" in both tables
  - Column: `StatusID` → `StatusID`
- **column_match**: dbo.OpsStatus → dbo.START_Metrics
  - Confidence: 80%
  - Evidence: Exact column name match: "statusid" in both tables
  - Column: `StatusID` → `StatusID`
- **column_match**: dbo.PlaybookStatus → dbo.START_Metrics
  - Confidence: 80%
  - Evidence: Exact column name match: "statusid" in both tables
  - Column: `StatusID` → `StatusID`
- **column_match**: dbo.DimSourceSystem → dbo.START_Metrics
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemID` → `SourceSystemID`
- **column_match**: dbo.DimVehicleBodyStyle → dbo.START_Metrics
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemID`
- **column_match**: dbo.DimVehicleCab → dbo.START_Metrics
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemID`
- **column_match**: dbo.DimVehicleCategory → dbo.START_Metrics
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemID`
- **column_match**: dbo.DimVehicleChassis → dbo.START_Metrics
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemID`
- **column_match**: dbo.DimVehicleCylinders → dbo.START_Metrics
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemID`
- **column_match**: dbo.DimVehicleDMVCategory → dbo.START_Metrics
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemID`
- **column_match**: dbo.DimVehicleDriveType → dbo.START_Metrics
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemID`
- **column_match**: dbo.DimVehicleEngine → dbo.START_Metrics
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemID`
- **column_match**: dbo.DimVehicleExteriorColor → dbo.START_Metrics
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemID`
- **column_match**: dbo.DimVehicleFuelType → dbo.START_Metrics
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemID`
- **column_match**: dbo.DimVehicleInteriorColor → dbo.START_Metrics
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemID`
- **column_match**: dbo.DimVehicleModelNumber → dbo.START_Metrics
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemID`
- **column_match**: dbo.DimVehicleRestraints → dbo.START_Metrics
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemID`
- **column_match**: dbo.DimVehicleSeries → dbo.START_Metrics
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemID`
- **column_match**: dbo.DimVehicleTransmission → dbo.START_Metrics
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemID`
- **column_match**: dbo.DimVehicleTrim → dbo.START_Metrics
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemID`
- **column_match**: dbo.Metric → dbo.START_Metrics
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemID` → `SourceSystemID`
- **column_match**: dbo.Metric → dbo.START_Metrics
  - Confidence: 80%
  - Evidence: Exact column name match: "metricid" in both tables
  - Column: `MetricID` → `MetricID`
- **column_match**: dbo.MetricAccountXref → dbo.START_Metrics
  - Confidence: 80%
  - Evidence: Exact column name match: "metricid" in both tables
  - Column: `MetricID` → `MetricID`
- **column_match**: dbo.MetricReportGroup → dbo.START_Metrics
  - Confidence: 80%
  - Evidence: Exact column name match: "metricid" in both tables
  - Column: `MetricID` → `MetricID`
- **column_match**: dbo.PettyCashMisuse → dbo.START_Metrics
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
