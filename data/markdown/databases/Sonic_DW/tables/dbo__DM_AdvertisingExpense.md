---
name: DM_AdvertisingExpense
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on:
  - DimTrafficManagementNewUsed
row_count: 0
size_kb: 0
column_count: 7
index_count: 0
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

| Name                  | Type     | Nullable | Identity | Default     | Description |
| --------------------- | -------- | -------- | -------- | ----------- | ----------- |
| `EntityKey`           | int      | ✓        |          |             |             |
| `NewUsedID`           | nchar    | ✓        |          |             |             |
| `CalendarYearMonth`   | varchar  | ✓        |          |             |             |
| `metric_name`         | varchar  | ✓        |          |             |             |
| `value`               | money    | ✓        |          |             |             |
| `Meta_RowLastUpdated` | datetime |          |          | (getdate()) |             |
| `value2`              | money    | ✓        |          |             |             |

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.DimTrafficManagementNewUsed → dbo.DM_AdvertisingExpense
  - Confidence: 80%
  - Evidence: Exact column name match: "newusedid" in both tables
  - Column: `NewUsedID` → `NewUsedID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
