---
name: OpsReviewItemDetail
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
  - OpsReviewItem
row_count: 0
size_kb: 0
column_count: 9
index_count: 2
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

| Name                 | Type     | Nullable | Identity | Default | Description |
| -------------------- | -------- | -------- | -------- | ------- | ----------- |
| `ItemDetailID`       | int      |          | ✓        |         |             |
| `OpsReviewItemID`    | int      |          |          |         |             |
| `ActionItems`        | varchar  | ✓        |          |         |             |
| `Comments`           | varchar  | ✓        |          |         |             |
| `CreatedByUserName`  | varchar  | ✓        |          |         |             |
| `ModifiedByUserName` | varchar  | ✓        |          |         |             |
| `CreatedOn`          | datetime | ✓        |          |         |             |
| `ModifiedOn`         | datetime | ✓        |          |         |             |
| `StatusID`           | int      |          |          |         |             |

## Constraints

- **Primary Key**: PK132
  - Columns: ItemDetailID

## Indexes

- **IDX_OpsReviewItemDetail_ItemID** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: OpsReviewItemID ASC
  - Included Columns: ItemDetailID, ActionItems, Comments
- **PK132** (NONCLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: ItemDetailID ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **explicit_fk**: dbo.OpsReviewItemDetail → dbo.OpsReviewItem
  - Confidence: 100%
  - Evidence: undefined
  - Column: `OpsReviewItemID` → `OpsReviewItemID`
- **explicit_fk**: dbo.OpsReviewItemDetail → dbo.OpsStatus
  - Confidence: 100%
  - Evidence: undefined
  - Column: `StatusID` → `StatusID`
- **column_match**: dbo.Metric → dbo.OpsReviewItemDetail
  - Confidence: 80%
  - Evidence: Exact column name match: "statusid" in both tables
  - Column: `StatusID` → `StatusID`
- **column_match**: dbo.MetricReport → dbo.OpsReviewItemDetail
  - Confidence: 80%
  - Evidence: Exact column name match: "statusid" in both tables
  - Column: `StatusID` → `StatusID`
- **column_match**: dbo.OpsReviewItem → dbo.OpsReviewItemDetail
  - Confidence: 80%
  - Evidence: Exact column name match: "statusid" in both tables
  - Column: `StatusID` → `StatusID`
- **column_match**: dbo.OpsReviewItemDetail → dbo.OpsStatus
  - Confidence: 80%
  - Evidence: Exact column name match: "statusid" in both tables
  - Column: `StatusID` → `StatusID`
- **column_match**: dbo.OpsReviewItemDetail → dbo.PlaybookStatus
  - Confidence: 80%
  - Evidence: Exact column name match: "statusid" in both tables
  - Column: `StatusID` → `StatusID`
- **column_match**: dbo.OpsReviewItemDetail → dbo.START_Metrics
  - Confidence: 80%
  - Evidence: Exact column name match: "statusid" in both tables
  - Column: `StatusID` → `StatusID`
- **column_match**: dbo.OpsReviewItem → dbo.OpsReviewItemDetail
  - Confidence: 80%
  - Evidence: Exact column name match: "opsreviewitemid" in both tables
  - Column: `OpsReviewItemID` → `OpsReviewItemID`
- **column_match**: dbo.OpsReviewItemDetail → dbo.OpsServiceDealership
  - Confidence: 80%
  - Evidence: Exact column name match: "opsreviewitemid" in both tables
  - Column: `OpsReviewItemID` → `OpsReviewItemID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
