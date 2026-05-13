---
name: Fact_TSDTemp
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - fact-table
  - core-schema
depends_on: []
row_count: 0
size_kb: 0
column_count: 10
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

| Name            | Type    | Nullable | Identity | Default | Description |
| --------------- | ------- | -------- | -------- | ------- | ----------- |
| `FactTSDKey`    | int     |          | ✓        |         |             |
| `Datekey`       | int     |          |          |         |             |
| `DealerNumber`  | int     |          |          |         |             |
| `Unit`          | varchar | ✓        |          |         |             |
| `Year`          | int     | ✓        |          |         |             |
| `Make`          | varchar | ✓        |          |         |             |
| `Model`         | varchar | ✓        |          |         |             |
| `VIN`           | varchar |          |          |         |             |
| `VehicleStatus` | varchar | ✓        |          |         |             |
| `SubsidyStatus` | varchar | ✓        |          |         |             |

## Constraints

- **Primary Key**: PK_Fact_TSDTemp
  - Columns: FactTSDKey

## Indexes

- **IDX_DateKey** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: Datekey ASC
  - Included Columns: DealerNumber, Make, VIN
- **PK_Fact_TSDTemp** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: FactTSDKey ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.Fact_TSDTemp → dbo.Fact_TSDTempImport
  - Confidence: 80%
  - Evidence: Exact column name match: "subsidystatus" in both tables
  - Column: `SubsidyStatus` → `SubsidyStatus`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
