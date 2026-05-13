---
name: HFM_Account_MGMT_Dim
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on:
  - CustomerMatchResult
  - CustomerMatchResult_bak
  - Dim_NewUsed
  - Dim_Scenario
  - dim_Time_Lgcy
  - HFM_Account_Corp_Dim
  - HFM_Account_Corp_Dim
row_count: 0
size_kb: 0
column_count: 18
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

| Name          | Type     | Nullable | Identity | Default | Description |
| ------------- | -------- | -------- | -------- | ------- | ----------- |
| `ParentID`    | int      | ✓        |          |         |             |
| `ID`          | int      | ✓        |          |         |             |
| `Level1`      | varchar  | ✓        |          |         |             |
| `Level2`      | varchar  | ✓        |          |         |             |
| `Level3`      | varchar  | ✓        |          |         |             |
| `Level4`      | varchar  | ✓        |          |         |             |
| `Level5`      | varchar  | ✓        |          |         |             |
| `Level6`      | varchar  | ✓        |          |         |             |
| `Level7`      | varchar  | ✓        |          |         |             |
| `Level8`      | varchar  | ✓        |          |         |             |
| `Level9`      | varchar  | ✓        |          |         |             |
| `Level10`     | varchar  | ✓        |          |         |             |
| `Level11`     | varchar  | ✓        |          |         |             |
| `Level0`      | varchar  | ✓        |          |         |             |
| `Label`       | nvarchar | ✓        |          |         |             |
| `ParentLabel` | nvarchar | ✓        |          |         |             |
| `Description` | nvarchar | ✓        |          |         |             |
| `AccountType` | nvarchar | ✓        |          |         |             |

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.CustomerMatchResult → dbo.HFM_Account_MGMT_Dim
  - Confidence: 80%
  - Evidence: Exact column name match: "id" in both tables
  - Column: `ID` → `ID`
- **column_match**: dbo.CustomerMatchResult_bak → dbo.HFM_Account_MGMT_Dim
  - Confidence: 80%
  - Evidence: Exact column name match: "id" in both tables
  - Column: `ID` → `ID`
- **column_match**: dbo.Dim_NewUsed → dbo.HFM_Account_MGMT_Dim
  - Confidence: 80%
  - Evidence: Exact column name match: "id" in both tables
  - Column: `ID` → `ID`
- **column_match**: dbo.Dim_Scenario → dbo.HFM_Account_MGMT_Dim
  - Confidence: 80%
  - Evidence: Exact column name match: "id" in both tables
  - Column: `ID` → `ID`
- **column_match**: dbo.dim_Time_Lgcy → dbo.HFM_Account_MGMT_Dim
  - Confidence: 80%
  - Evidence: Exact column name match: "id" in both tables
  - Column: `ID` → `ID`
- **column_match**: dbo.HFM_Account_Corp_Dim → dbo.HFM_Account_MGMT_Dim
  - Confidence: 80%
  - Evidence: Exact column name match: "id" in both tables
  - Column: `ID` → `ID`
- **column_match**: dbo.HFM_Account_MGMT_Dim → dbo.Jobcode_Totalcost
  - Confidence: 80%
  - Evidence: Exact column name match: "id" in both tables
  - Column: `ID` → `ID`
- **column_match**: dbo.HFM_Account_MGMT_Dim → dbo.PettyCashMisuse
  - Confidence: 80%
  - Evidence: Exact column name match: "id" in both tables
  - Column: `ID` → `ID`
- **column_match**: dbo.HFM_Account_Corp_Dim → dbo.HFM_Account_MGMT_Dim
  - Confidence: 80%
  - Evidence: Exact column name match: "parentid" in both tables
  - Column: `ParentID` → `ParentID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
