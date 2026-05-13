---
name: MetricReport
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on:
  - Metric
row_count: 0
size_kb: 0
column_count: 10
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
| `ReportID`          | int      |          |          |         |             |
| `ReportName`        | varchar  |          |          |         |             |
| `ReportDescription` | varchar  | ✓        |          |         |             |
| `CreatedOn`         | datetime |          |          |         |             |
| `CreatedBy`         | varchar  |          |          |         |             |
| `ModifiedOn`        | datetime | ✓        |          |         |             |
| `ModifiedBy`        | varchar  | ✓        |          |         |             |
| `ApprovedOn`        | datetime | ✓        |          |         |             |
| `ApprovedBy`        | varchar  | ✓        |          |         |             |
| `StatusID`          | int      | ✓        |          |         |             |

## Constraints

- **Primary Key**: PK_MetricReport
  - Columns: ReportID

## Indexes

- **PK_MetricReport** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: ReportID ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.Metric → dbo.MetricReport
  - Confidence: 80%
  - Evidence: Exact column name match: "statusid" in both tables
  - Column: `StatusID` → `StatusID`
- **column_match**: dbo.MetricReport → dbo.OpsReviewItem
  - Confidence: 80%
  - Evidence: Exact column name match: "statusid" in both tables
  - Column: `StatusID` → `StatusID`
- **column_match**: dbo.MetricReport → dbo.OpsReviewItemDetail
  - Confidence: 80%
  - Evidence: Exact column name match: "statusid" in both tables
  - Column: `StatusID` → `StatusID`
- **column_match**: dbo.MetricReport → dbo.OpsStatus
  - Confidence: 80%
  - Evidence: Exact column name match: "statusid" in both tables
  - Column: `StatusID` → `StatusID`
- **column_match**: dbo.MetricReport → dbo.PlaybookStatus
  - Confidence: 80%
  - Evidence: Exact column name match: "statusid" in both tables
  - Column: `StatusID` → `StatusID`
- **column_match**: dbo.MetricReport → dbo.START_Metrics
  - Confidence: 80%
  - Evidence: Exact column name match: "statusid" in both tables
  - Column: `StatusID` → `StatusID`
- **column_match**: dbo.MetricReport → dbo.MetricReportGroup
  - Confidence: 80%
  - Evidence: Exact column name match: "reportid" in both tables
  - Column: `ReportID` → `ReportID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
