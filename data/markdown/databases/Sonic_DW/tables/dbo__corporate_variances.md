---
name: corporate_variances
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on: []
row_count: 0
size_kb: 0
column_count: 16
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

| Name                    | Type     | Nullable | Identity | Default | Description |
| ----------------------- | -------- | -------- | -------- | ------- | ----------- |
| `CommentKey`            | int      |          | ✓        |         |             |
| `FiscalMonthKey`        | int      | ✓        |          |         |             |
| `SECRollupKey`          | int      | ✓        |          |         |             |
| `DepartmentKey`         | int      | ✓        |          |         |             |
| `Comments`              | nvarchar | ✓        |          |         |             |
| `Reviewer_Comment`      | varchar  | ✓        |          |         |             |
| `CFO_Comment`           | varchar  | ✓        |          |         |             |
| `Approved`              | int      | ✓        |          | ((0))   |             |
| `Denied`                | int      | ✓        |          | ((0))   |             |
| `mstr_user_input`       | varchar  | ✓        |          |         |             |
| `mstr_user_review`      | varchar  | ✓        |          |         |             |
| `Meta_LastUpdateDate`   | datetime | ✓        |          |         |             |
| `Meta_LoadDate`         | datetime | ✓        |          |         |             |
| `Reviewer_Notification` | int      | ✓        |          |         |             |
| `CFO_Notification`      | int      | ✓        |          |         |             |
| `Other_Notification`    | int      | ✓        |          |         |             |

## Indexes

- **IDX_DepartmentKey** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: DepartmentKey ASC
  - Included Columns: FiscalMonthKey, SECRollupKey, Approved, Denied

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
