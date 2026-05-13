---
name: Dim_DateEvent
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - dimension
  - core-schema
depends_on: []
row_count: 0
size_kb: 0
column_count: 10
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

| Name                    | Type     | Nullable | Identity | Default     | Description |
| ----------------------- | -------- | -------- | -------- | ----------- | ----------- |
| `DateEventID`           | int      |          | ✓        |             |             |
| `EventDescription`      | varchar  | ✓        |          |             |             |
| `IsSonic`               | int      | ✓        |          |             |             |
| `IsEchoPark`            | int      | ✓        |          |             |             |
| `IsPowersports`         | int      | ✓        |          |             |             |
| `IsActive`              | int      |          |          | ((1))       |             |
| `Meta_LoadDate`         | datetime |          |          | (getdate()) |             |
| `Meta_LastModifiedDate` | datetime |          |          | (getdate()) |             |
| `Meta_User`             | varchar  | ✓        |          |             |             |
| `DateGUID`              | varchar  | ✓        |          |             |             |

## Constraints

- **Primary Key**: PK_Dim_DateEvent_New
  - Columns: DateEventID

## Indexes

- **PK_Dim_DateEvent_New** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: DateEventID ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.Dim_DateEvent → dbo.Dim_DateEvent_Old
  - Confidence: 80%
  - Evidence: Exact column name match: "dateeventid" in both tables
  - Column: `DateEventID` → `DateEventID`
- **column_match**: dbo.Dim_DateEvent → dbo.Fact_DateEvent
  - Confidence: 80%
  - Evidence: Exact column name match: "dateeventid" in both tables
  - Column: `DateEventID` → `DateEventID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
