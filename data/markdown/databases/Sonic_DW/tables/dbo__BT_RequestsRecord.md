---
name: BT_RequestsRecord
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on:
  - BT_Requests
  - BT_RequestsRecord
row_count: 0
size_kb: 0
column_count: 6
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

| Name              | Type     | Nullable | Identity | Default                                  | Description |
| ----------------- | -------- | -------- | -------- | ---------------------------------------- | ----------- |
| `BTKey`           | int      |          | ✓        |                                          |             |
| `EntityKey`       | int      |          |          |                                          |             |
| `Login`           | nvarchar |          |          |                                          |             |
| `DateKey`         | int      |          |          | (CONVERT([varchar](10),getdate(),(112))) |             |
| `SurveyStartTime` | datetime |          |          | (getdate())                              |             |
| `GMName`          | nvarchar | ✓        |          |                                          |             |

## Constraints

- **Primary Key**: PK_BT_IssuesRecord
  - Columns: BTKey

## Indexes

- **PK_BT_IssuesRecord** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: BTKey ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **explicit_fk**: dbo.BT_Requests → dbo.BT_RequestsRecord
  - Confidence: 100%
  - Evidence: undefined
  - Column: `BTKey` → `BTKey`
- **explicit_fk**: dbo.BT_RequestsRecord → dbo.BT_RequestsRecord
  - Confidence: 100%
  - Evidence: undefined
  - Column: `BTKey` → `BTKey`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
