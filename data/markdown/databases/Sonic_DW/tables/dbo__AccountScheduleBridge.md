---
name: AccountScheduleBridge
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
column_count: 2
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

| Name          | Type | Nullable | Identity | Default | Description |
| ------------- | ---- | -------- | -------- | ------- | ----------- |
| `ScheduleKey` | int  |          |          |         |             |
| `AccountKey`  | int  |          |          |         |             |

## Constraints

- **Primary Key**: PK_AccountScheduleBridge
  - Columns: ScheduleKey, AccountKey

## Indexes

- **PK_AccountScheduleBridge** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: ScheduleKey ASC, AccountKey ASC
- **Ref108** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: AccountKey ASC
- **Ref187** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: ScheduleKey ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **explicit_fk**: dbo.AccountScheduleBridge → dbo.Dim_Account_old
  - Confidence: 100%
  - Evidence: undefined
  - Column: `AccountKey` → `AccountKey`
- **explicit_fk**: dbo.AccountScheduleBridge → dbo.Dim_Schedule
  - Confidence: 100%
  - Evidence: undefined
  - Column: `ScheduleKey` → `ScheduleKey`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
