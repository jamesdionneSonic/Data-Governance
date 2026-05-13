---
name: SoxReview
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on:
  - SoxReviewResult
row_count: 0
size_kb: 0
column_count: 8
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
| `ReviewID`           | int      |          | ✓        |         |             |
| `EntityKey`          | int      | ✓        |          |         |             |
| `ReviewStartDate`    | datetime | ✓        |          |         |             |
| `ControllerName`     | varchar  | ✓        |          |         |             |
| `ReviewCompleteDate` | datetime |          |          |         |             |
| `ReviewCompletedBy`  | varchar  | ✓        |          |         |             |
| `ReviewStatusID`     | int      | ✓        |          |         |             |
| `ReviewMonth`        | int      | ✓        |          |         |             |

## Constraints

- **Primary Key**: PK203
  - Columns: ReviewID

## Indexes

- **IDX_SoxReview** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: ReviewID ASC, EntityKey ASC, ReviewMonth ASC
  - Included Columns: ReviewStartDate, ControllerName, ReviewCompleteDate, ReviewCompletedBy, ReviewStatusID
- **PK203** (NONCLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: ReviewID ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **explicit_fk**: dbo.SoxReviewResult → dbo.SoxReview
  - Confidence: 100%
  - Evidence: undefined
  - Column: `ReviewID` → `ReviewID`
- **column_match**: dbo.SoxReview → dbo.SoxReviewResult
  - Confidence: 80%
  - Evidence: Exact column name match: "reviewid" in both tables
  - Column: `ReviewID` → `ReviewID`
- **column_match**: dbo.SoxReview → dbo.SoxReviewStatus
  - Confidence: 80%
  - Evidence: Exact column name match: "reviewstatusid" in both tables
  - Column: `ReviewStatusID` → `ReviewStatusID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
