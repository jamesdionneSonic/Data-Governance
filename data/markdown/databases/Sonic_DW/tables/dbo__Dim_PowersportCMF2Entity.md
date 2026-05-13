---
name: Dim_PowersportCMF2Entity
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
column_count: 3
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

| Name                 | Type    | Nullable | Identity | Default | Description |
| -------------------- | ------- | -------- | -------- | ------- | ----------- |
| `CMFID`              | int     |          |          |         |             |
| `EntityKey`          | int     |          |          |         |             |
| `SIMSDealershipName` | varchar | ✓        |          |         |             |

## Constraints

- **Primary Key**: PK_Dim_PowersportCMF2Entity
  - Columns: CMFID

## Indexes

- **PK_Dim_PowersportCMF2Entity** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: CMFID ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.Dim_PowersportCMF2Entity → dbo.Fact_AccountingPS
  - Confidence: 80%
  - Evidence: Exact column name match: "cmfid" in both tables
  - Column: `CMFID` → `CMFID`
- **column_match**: dbo.Dim_PowersportCMF2Entity → dbo.Fact_AccountingPS_History
  - Confidence: 80%
  - Evidence: Exact column name match: "cmfid" in both tables
  - Column: `CMFID` → `CMFID`
- **column_match**: dbo.Dim_PowersportCMF2Entity → dbo.Fact_AccountingPS_Stage
  - Confidence: 80%
  - Evidence: Exact column name match: "cmfid" in both tables
  - Column: `CMFID` → `CMFID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
