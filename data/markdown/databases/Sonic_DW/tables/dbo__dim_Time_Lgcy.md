---
name: dim_Time_Lgcy
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
  - Dim_NewUsed
  - Dim_Scenario
row_count: 0
size_kb: 0
column_count: 8
index_count: 8
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

| Name           | Type | Nullable | Identity | Default | Description |
| -------------- | ---- | -------- | -------- | ------- | ----------- |
| `ID`           | int  |          | ✓        |         |             |
| `Time`         | char |          |          |         |             |
| `Hour`         | char |          |          |         |             |
| `MilitaryHour` | char |          |          |         |             |
| `Minute`       | char |          |          |         |             |
| `Second`       | char |          |          |         |             |
| `AmPm`         | char |          |          |         |             |
| `StandardTime` | char | ✓        |          |         |             |

## Constraints

- **Primary Key**: PK_dim_Time
  - Columns: ID

## Indexes

- **IDX_dim_Time_AmPm** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: AmPm ASC
- **IDX_dim_Time_Hour** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: Hour ASC
- **IDX_dim_Time_MilitaryHour** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: MilitaryHour ASC
- **IDX_dim_Time_Minute** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: Minute ASC
- **IDX_dim_Time_Second** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: Second ASC
- **IDX_dim_Time_StandardTime** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: StandardTime ASC
- **IDX_dim_Time_Time** (NONCLUSTERED)
  - Unique: Yes
  - Primary Key: No
  - Key Columns: Time ASC
- **PK_dim_Time** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: ID ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.CustomerMatchResult → dbo.dim_Time_Lgcy
  - Confidence: 80%
  - Evidence: Exact column name match: "id" in both tables
  - Column: `ID` → `ID`
- **column_match**: dbo.CustomerMatchResult_bak → dbo.dim_Time_Lgcy
  - Confidence: 80%
  - Evidence: Exact column name match: "id" in both tables
  - Column: `ID` → `ID`
- **column_match**: dbo.Dim_NewUsed → dbo.dim_Time_Lgcy
  - Confidence: 80%
  - Evidence: Exact column name match: "id" in both tables
  - Column: `ID` → `ID`
- **column_match**: dbo.Dim_Scenario → dbo.dim_Time_Lgcy
  - Confidence: 80%
  - Evidence: Exact column name match: "id" in both tables
  - Column: `ID` → `ID`
- **column_match**: dbo.dim_Time_Lgcy → dbo.HFM_Account_Corp_Dim
  - Confidence: 80%
  - Evidence: Exact column name match: "id" in both tables
  - Column: `ID` → `ID`
- **column_match**: dbo.dim_Time_Lgcy → dbo.HFM_Account_MGMT_Dim
  - Confidence: 80%
  - Evidence: Exact column name match: "id" in both tables
  - Column: `ID` → `ID`
- **column_match**: dbo.dim_Time_Lgcy → dbo.Jobcode_Totalcost
  - Confidence: 80%
  - Evidence: Exact column name match: "id" in both tables
  - Column: `ID` → `ID`
- **column_match**: dbo.dim_Time_Lgcy → dbo.PettyCashMisuse
  - Confidence: 80%
  - Evidence: Exact column name match: "id" in both tables
  - Column: `ID` → `ID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
