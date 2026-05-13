---
name: Fact_AccountingPS
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
  - Doc_ProjectionPS
  - Doc_ProjectionPS_History
  - Doc_ProjectionPS
  - Doc_ProjectionPS_History
row_count: 0
size_kb: 0
column_count: 12
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

| Name              | Type      | Nullable | Identity | Default | Description |
| ----------------- | --------- | -------- | -------- | ------- | ----------- |
| `AccountingPSKey` | varchar   |          |          |         |             |
| `Dealership`      | nvarchar  | ✓        |          |         |             |
| `CMFID`           | int       | ✓        |          |         |             |
| `AcctCode`        | varchar   | ✓        |          |         |             |
| `DeptCode`        | int       | ✓        |          |         |             |
| `DebitCredit`     | varchar   | ✓        |          |         |             |
| `ConsAcctNum`     | varchar   | ✓        |          |         |             |
| `FiscalYear`      | int       | ✓        |          |         |             |
| `MonthKey`        | int       | ✓        |          |         |             |
| `Amount`          | decimal   | ✓        |          |         |             |
| `ValidFrom`       | datetime2 |          |          |         |             |
| `ValidTo`         | datetime2 |          |          |         |             |

## Constraints

- **Primary Key**: PK**Fact_Acc**AB86817F8F136F9E
  - Columns: AccountingPSKey

## Indexes

- **PK**Fact_Acc**AB86817F8F136F9E** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: AccountingPSKey ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.Dim_PowersportCMF2Entity → dbo.Fact_AccountingPS
  - Confidence: 80%
  - Evidence: Exact column name match: "cmfid" in both tables
  - Column: `CMFID` → `CMFID`
- **column_match**: dbo.Fact_AccountingPS → dbo.Fact_AccountingPS_History
  - Confidence: 80%
  - Evidence: Exact column name match: "cmfid" in both tables
  - Column: `CMFID` → `CMFID`
- **column_match**: dbo.Fact_AccountingPS → dbo.Fact_AccountingPS_Stage
  - Confidence: 80%
  - Evidence: Exact column name match: "cmfid" in both tables
  - Column: `CMFID` → `CMFID`
- **column_match**: dbo.Doc_ProjectionPS → dbo.Fact_AccountingPS
  - Confidence: 80%
  - Evidence: Exact column name match: "validfrom" in both tables
  - Column: `ValidFrom` → `ValidFrom`
- **column_match**: dbo.Doc_ProjectionPS_History → dbo.Fact_AccountingPS
  - Confidence: 80%
  - Evidence: Exact column name match: "validfrom" in both tables
  - Column: `ValidFrom` → `ValidFrom`
- **column_match**: dbo.Fact_AccountingPS → dbo.Fact_AccountingPS_History
  - Confidence: 80%
  - Evidence: Exact column name match: "validfrom" in both tables
  - Column: `ValidFrom` → `ValidFrom`
- **column_match**: dbo.Doc_ProjectionPS → dbo.Fact_AccountingPS
  - Confidence: 80%
  - Evidence: Exact column name match: "validto" in both tables
  - Column: `ValidTo` → `ValidTo`
- **column_match**: dbo.Doc_ProjectionPS_History → dbo.Fact_AccountingPS
  - Confidence: 80%
  - Evidence: Exact column name match: "validto" in both tables
  - Column: `ValidTo` → `ValidTo`
- **column_match**: dbo.Fact_AccountingPS → dbo.Fact_AccountingPS_History
  - Confidence: 80%
  - Evidence: Exact column name match: "validto" in both tables
  - Column: `ValidTo` → `ValidTo`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
