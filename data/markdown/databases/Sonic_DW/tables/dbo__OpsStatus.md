---
name: OpsStatus
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on:
  - OpsReviewItem
  - OpsReviewItemDetail
  - Metric
  - MetricReport
  - OpsReviewItem
  - OpsReviewItemDetail
row_count: 0
size_kb: 0
column_count: 3
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

| Name                | Type    | Nullable | Identity | Default | Description |
| ------------------- | ------- | -------- | -------- | ------- | ----------- |
| `StatusID`          | int     |          |          |         |             |
| `StatusCode`        | varchar | ✓        |          |         |             |
| `StatusDescription` | varchar | ✓        |          |         |             |

## Constraints

- **Primary Key**: PK125
  - Columns: StatusID

## Indexes

- **PK125** (NONCLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: StatusID ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **explicit_fk**: dbo.OpsReviewItem → dbo.OpsStatus
  - Confidence: 100%
  - Evidence: undefined
  - Column: `StatusID` → `StatusID`
- **explicit_fk**: dbo.OpsReviewItemDetail → dbo.OpsStatus
  - Confidence: 100%
  - Evidence: undefined
  - Column: `StatusID` → `StatusID`
- **column_match**: dbo.Metric → dbo.OpsStatus
  - Confidence: 80%
  - Evidence: Exact column name match: "statusid" in both tables
  - Column: `StatusID` → `StatusID`
- **column_match**: dbo.MetricReport → dbo.OpsStatus
  - Confidence: 80%
  - Evidence: Exact column name match: "statusid" in both tables
  - Column: `StatusID` → `StatusID`
- **column_match**: dbo.OpsReviewItem → dbo.OpsStatus
  - Confidence: 80%
  - Evidence: Exact column name match: "statusid" in both tables
  - Column: `StatusID` → `StatusID`
- **column_match**: dbo.OpsReviewItemDetail → dbo.OpsStatus
  - Confidence: 80%
  - Evidence: Exact column name match: "statusid" in both tables
  - Column: `StatusID` → `StatusID`
- **column_match**: dbo.OpsStatus → dbo.PlaybookStatus
  - Confidence: 80%
  - Evidence: Exact column name match: "statusid" in both tables
  - Column: `StatusID` → `StatusID`
- **column_match**: dbo.OpsStatus → dbo.START_Metrics
  - Confidence: 80%
  - Evidence: Exact column name match: "statusid" in both tables
  - Column: `StatusID` → `StatusID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
