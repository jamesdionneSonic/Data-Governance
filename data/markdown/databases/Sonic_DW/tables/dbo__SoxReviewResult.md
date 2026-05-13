---
name: SoxReviewResult
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on:
  - SoxReview
  - SoxReviewItem
row_count: 0
size_kb: 0
column_count: 12
index_count: 3
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

| Name                   | Type     | Nullable | Identity | Default | Description |
| ---------------------- | -------- | -------- | -------- | ------- | ----------- |
| `SoxResultID`          | int      |          | ✓        |         |             |
| `ReviewID`             | int      |          |          |         |             |
| `ReviewItemID`         | int      |          |          |         |             |
| `EntityKey`            | int      |          |          |         |             |
| `ReviewDate`           | datetime | ✓        |          |         |             |
| `ReviewedBy`           | varchar  | ✓        |          |         |             |
| `ReviewResult`         | int      | ✓        |          |         |             |
| `ReviewComment`        | varchar  | ✓        |          |         |             |
| `ControllerReviewed`   | int      | ✓        |          |         |             |
| `ControllerReviewDate` | datetime | ✓        |          |         |             |
| `TrainingComment`      | varchar  | ✓        |          |         |             |
| `RowCreateDate`        | datetime | ✓        |          |         |             |

## Constraints

- **Primary Key**: PK200
  - Columns: SoxResultID

## Indexes

- **IDX_SoxReviewResult** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: ReviewID ASC, ReviewResult ASC, ReviewItemID ASC, SoxResultID ASC, EntityKey ASC
  - Included Columns: ReviewComment, ControllerReviewDate
- **IX_SoxReviewResult_EntityKey_ReviewResult** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: EntityKey ASC, ReviewResult ASC
  - Included Columns: ReviewItemID, ControllerReviewDate
- **PK200** (NONCLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: SoxResultID ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **explicit_fk**: dbo.SoxReviewResult → dbo.SoxReviewItem
  - Confidence: 100%
  - Evidence: undefined
  - Column: `ReviewItemID` → `ReviewItemID`
- **explicit_fk**: dbo.SoxReviewResult → dbo.SoxReview
  - Confidence: 100%
  - Evidence: undefined
  - Column: `ReviewID` → `ReviewID`
- **column_match**: dbo.SoxReview → dbo.SoxReviewResult
  - Confidence: 80%
  - Evidence: Exact column name match: "reviewid" in both tables
  - Column: `ReviewID` → `ReviewID`
- **column_match**: dbo.SoxReviewItem → dbo.SoxReviewResult
  - Confidence: 80%
  - Evidence: Exact column name match: "reviewitemid" in both tables
  - Column: `ReviewItemID` → `ReviewItemID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
