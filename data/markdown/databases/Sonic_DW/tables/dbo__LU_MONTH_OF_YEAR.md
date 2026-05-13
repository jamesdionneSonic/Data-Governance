---
name: LU_MONTH_OF_YEAR
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
column_count: 10
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

| Name                     | Type     | Nullable | Identity | Default | Description |
| ------------------------ | -------- | -------- | -------- | ------- | ----------- |
| `MONTH_OF_YEAR`          | smallint | ✓        |          |         |             |
| `MONTH_OF_YEAR_NAME`     | nvarchar | ✓        |          |         |             |
| `MONTH_OF_YEAR_NAME_DE`  | nvarchar | ✓        |          |         |             |
| `MONTH_OF_YEAR_NAME_FR`  | nvarchar | ✓        |          |         |             |
| `MONTH_OF_YEAR_NAME_ES`  | nvarchar | ✓        |          |         |             |
| `MONTH_OF_YEAR_NAME_IT`  | nvarchar | ✓        |          |         |             |
| `MONTH_OF_YEAR_NAME_PO`  | nvarchar | ✓        |          |         |             |
| `MONTH_OF_YEAR_NAME_JA`  | nvarchar | ✓        |          |         |             |
| `MONTH_OF_YEAR_NAME_SCH` | nvarchar | ✓        |          |         |             |
| `MONTH_OF_YEAR_NAME_KO`  | nvarchar | ✓        |          |         |             |

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
