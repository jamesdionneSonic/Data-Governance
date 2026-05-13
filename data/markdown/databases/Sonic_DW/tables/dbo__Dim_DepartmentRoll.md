---
name: Dim_DepartmentRoll
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
column_count: 12
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

| Name                    | Type    | Nullable | Identity | Default | Description |
| ----------------------- | ------- | -------- | -------- | ------- | ----------- |
| `DepartmentKey`         | int     |          |          |         |             |
| `DepartmentName`        | varchar | ✓        |          |         |             |
| `DepartmentDescription` | varchar | ✓        |          |         |             |
| `DeptRGroup`            | varchar | ✓        |          |         |             |
| `DepartmentType`        | varchar | ✓        |          |         |             |
| `DepartmentSubType`     | varchar | ✓        |          |         |             |
| `DepartmentSubLevel3`   | varchar | ✓        |          |         |             |
| `HFMID`                 | int     | ✓        |          |         |             |
| `MarketingGroup`        | varchar | ✓        |          |         |             |
| `DepartmentNum`         | nchar   | ✓        |          |         |             |
| `OSName`                | varchar | ✓        |          |         |             |
| `DepartmentIDPS`        | int     | ✓        |          |         |             |

## Constraints

- **Primary Key**: PK_Dim_DepartmentRoll
  - Columns: DepartmentKey

## Indexes

- **idx_nc_Dim_DeptRoll_Name** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: DepartmentName ASC
  - Included Columns: DepartmentKey, DepartmentDescription
- **PK_Dim_DepartmentRoll** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: DepartmentKey ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
