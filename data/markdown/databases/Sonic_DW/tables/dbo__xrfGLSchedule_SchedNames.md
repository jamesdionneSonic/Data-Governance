---
name: xrfGLSchedule_SchedNames
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on:
  - xrfGLSchedule_SchedAccounts
  - xrfGLSchedule_SchedGroups
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

| Name                   | Type    | Nullable | Identity | Default | Description |
| ---------------------- | ------- | -------- | -------- | ------- | ----------- |
| `ScheduleNameID`       | int     | ✓        |          |         |             |
| `ScheduleNameDesc`     | varchar | ✓        |          |         |             |
| `ScheduleCategory`     | varchar | ✓        |          |         |             |
| `Ex_Days`              | int     | ✓        |          |         |             |
| `Ex_CreditBalanceFlag` | int     | ✓        |          |         |             |
| `Ex_DebitBalanceFlag`  | int     | ✓        |          |         |             |
| `Ex_VehicleDepr`       | int     | ✓        |          |         |             |
| `Ex_Amount`            | money   | ✓        |          |         |             |

## Indexes

- **IDX_ScheduleCategory** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: ScheduleCategory ASC
- **IDX_ScheduleName** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: ScheduleNameID ASC
  - Included Columns: ScheduleNameDesc

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.xrfGLSchedule_SchedAccounts → dbo.xrfGLSchedule_SchedNames
  - Confidence: 80%
  - Evidence: Exact column name match: "schedulenameid" in both tables
  - Column: `ScheduleNameID` → `ScheduleNameID`
- **column_match**: dbo.xrfGLSchedule_SchedGroups → dbo.xrfGLSchedule_SchedNames
  - Confidence: 80%
  - Evidence: Exact column name match: "schedulenameid" in both tables
  - Column: `ScheduleNameID` → `ScheduleNameID`
- **column_match**: dbo.xrfGLSchedule_SchedNames → dbo.xrfGLSchedule_SchedNames2
  - Confidence: 80%
  - Evidence: Exact column name match: "schedulenameid" in both tables
  - Column: `ScheduleNameID` → `ScheduleNameID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
