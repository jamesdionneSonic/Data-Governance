---
name: Dim_NewUsed
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - dimension
  - core-schema
depends_on:
  - CustomerMatchResult
  - CustomerMatchResult_bak
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

| Name           | Type    | Nullable | Identity | Default | Description |
| -------------- | ------- | -------- | -------- | ------- | ----------- |
| `ID`           | int     |          |          |         |             |
| `Description`  | varchar | ✓        |          |         |             |
| `Abbreviation` | varchar | ✓        |          |         |             |

## Constraints

- **Primary Key**: PK**Dim_NewU**3214EC27D6AAE1AF
  - Columns: ID

## Indexes

- **PK**Dim_NewU**3214EC27D6AAE1AF** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: ID ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.CustomerMatchResult → dbo.Dim_NewUsed
  - Confidence: 80%
  - Evidence: Exact column name match: "id" in both tables
  - Column: `ID` → `ID`
- **column_match**: dbo.CustomerMatchResult_bak → dbo.Dim_NewUsed
  - Confidence: 80%
  - Evidence: Exact column name match: "id" in both tables
  - Column: `ID` → `ID`
- **column_match**: dbo.Dim_NewUsed → dbo.Dim_Scenario
  - Confidence: 80%
  - Evidence: Exact column name match: "id" in both tables
  - Column: `ID` → `ID`
- **column_match**: dbo.Dim_NewUsed → dbo.dim_Time_Lgcy
  - Confidence: 80%
  - Evidence: Exact column name match: "id" in both tables
  - Column: `ID` → `ID`
- **column_match**: dbo.Dim_NewUsed → dbo.HFM_Account_Corp_Dim
  - Confidence: 80%
  - Evidence: Exact column name match: "id" in both tables
  - Column: `ID` → `ID`
- **column_match**: dbo.Dim_NewUsed → dbo.HFM_Account_MGMT_Dim
  - Confidence: 80%
  - Evidence: Exact column name match: "id" in both tables
  - Column: `ID` → `ID`
- **column_match**: dbo.Dim_NewUsed → dbo.Jobcode_Totalcost
  - Confidence: 80%
  - Evidence: Exact column name match: "id" in both tables
  - Column: `ID` → `ID`
- **column_match**: dbo.Dim_NewUsed → dbo.PettyCashMisuse
  - Confidence: 80%
  - Evidence: Exact column name match: "id" in both tables
  - Column: `ID` → `ID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
