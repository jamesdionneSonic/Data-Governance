---
name: Fact_AccountingPS_Stage
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - fact-table
  - core-schema
depends_on:
  - Dim_PowersportCMF2Entity
  - Fact_AccountingPS
  - Fact_AccountingPS_History
row_count: 0
size_kb: 0
column_count: 12
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

| Name              | Type     | Nullable | Identity | Default | Description |
| ----------------- | -------- | -------- | -------- | ------- | ----------- |
| `AccountingPSKey` | varchar  | ✓        |          |         |             |
| `Dealership`      | nvarchar | ✓        |          |         |             |
| `CMFID`           | int      | ✓        |          |         |             |
| `AcctCode`        | varchar  | ✓        |          |         |             |
| `DeptCode`        | int      | ✓        |          |         |             |
| `DebitCredit`     | varchar  | ✓        |          |         |             |
| `ConsAcctNum`     | varchar  | ✓        |          |         |             |
| `FiscalYear`      | int      | ✓        |          |         |             |
| `MonthKey`        | int      | ✓        |          |         |             |
| `Amount`          | decimal  | ✓        |          |         |             |
| `DetailLevel`     | varchar  | ✓        |          |         |             |
| `AcctDesc`        | varchar  | ✓        |          |         |             |

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.Dim_PowersportCMF2Entity → dbo.Fact_AccountingPS_Stage
  - Confidence: 80%
  - Evidence: Exact column name match: "cmfid" in both tables
  - Column: `CMFID` → `CMFID`
- **column_match**: dbo.Fact_AccountingPS → dbo.Fact_AccountingPS_Stage
  - Confidence: 80%
  - Evidence: Exact column name match: "cmfid" in both tables
  - Column: `CMFID` → `CMFID`
- **column_match**: dbo.Fact_AccountingPS_History → dbo.Fact_AccountingPS_Stage
  - Confidence: 80%
  - Evidence: Exact column name match: "cmfid" in both tables
  - Column: `CMFID` → `CMFID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
