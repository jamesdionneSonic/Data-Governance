---
name: BT_RequestsCategory
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on:
  - BT_RequestsCategory
  - BT_Requests
row_count: 0
size_kb: 0
column_count: 2
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
| `IssueCategoryID`   | int     |          |          |         |             |
| `IssueCategoryDesc` | varchar | ✓        |          |         |             |

## Constraints

- **Primary Key**: PK_BT_IssuesCategory
  - Columns: IssueCategoryID

## Indexes

- **PK_BT_IssuesCategory** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: IssueCategoryID ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **explicit_fk**: dbo.BT_RequestsCategory → dbo.BT_RequestsCategory
  - Confidence: 100%
  - Evidence: undefined
  - Column: `IssueCategoryID` → `IssueCategoryID`
- **column_match**: dbo.BT_Requests → dbo.BT_RequestsCategory
  - Confidence: 80%
  - Evidence: Exact column name match: "issuecategoryid" in both tables
  - Column: `IssueCategoryID` → `IssueCategoryID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
