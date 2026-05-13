---
name: SoxReviewStatus
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on:
  - SoxReview
row_count: 0
size_kb: 0
column_count: 3
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

| Name              | Type    | Nullable | Identity | Default | Description |
| ----------------- | ------- | -------- | -------- | ------- | ----------- |
| `ReviewStatusID`  | int     |          |          |         |             |
| `ReviewStatus`    | varchar | ✓        |          |         |             |
| `ReviewStatusURL` | varchar | ✓        |          |         |             |

## Constraints

- **Primary Key**: PK_SoxReviewStatus
  - Columns: ReviewStatusID

## Indexes

- **IDX_SoxReviewStatus** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: ReviewStatusID ASC, ReviewStatus ASC
- **PK_SoxReviewStatus** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: ReviewStatusID ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

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
