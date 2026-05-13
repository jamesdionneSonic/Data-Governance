---
name: xrf_RENT_LIBORGroup
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

| Name             | Type     | Nullable | Identity | Default     | Description |
| ---------------- | -------- | -------- | -------- | ----------- | ----------- |
| `LIBORGroupID`   | int      |          | ✓        |             |             |
| `LIBORGroupDesc` | varchar  |          |          |             |             |
| `LIBORGroupLow`  | float    |          |          |             |             |
| `LIBORGroupHigh` | float    |          |          |             |             |
| `FloorFlag`      | bit      | ✓        |          | ((0))       |             |
| `Created`        | datetime | ✓        |          | (getdate()) |             |

## Constraints

- **Primary Key**: PK_xrf_RENT_LIBORGroup
  - Columns: LIBORGroupID

## Indexes

- **PK_xrf_RENT_LIBORGroup** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: LIBORGroupID ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.xrf_RENT_LIBORGroup → dbo.xrf_RENT_LIBORPropertyRates
  - Confidence: 80%
  - Evidence: Exact column name match: "liborgroupid" in both tables
  - Column: `LIBORGroupID` → `LIBORGroupID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
