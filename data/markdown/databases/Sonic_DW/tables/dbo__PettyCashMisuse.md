---
name: PettyCashMisuse
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
  - HFM_Account_MGMT_Dim
  - Jobcode_Totalcost
  - Metric
  - MetricAccountXref
  - MetricReportGroup
row_count: 0
size_kb: 0
column_count: 10
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

| Name              | Type    | Nullable | Identity | Default | Description |
| ----------------- | ------- | -------- | -------- | ------- | ----------- |
| `ID`              | int     |          | ✓        |         |             |
| `MetricID`        | int     |          |          |         |             |
| `EntityKey`       | int     |          |          |         |             |
| `FiscalMonthKey`  | int     |          |          |         |             |
| `CheckDate`       | date    |          |          |         |             |
| `CheckNumber`     | varchar | ✓        |          |         |             |
| `Payee`           | varchar |          |          |         |             |
| `CheckWriter`     | varchar |          |          |         |             |
| `CheckAmount`     | money   |          |          |         |             |
| `ReferenceNumber` | varchar | ✓        |          |         |             |

## Constraints

- **Primary Key**: PK_PettyCashMisuse
  - Columns: ID

## Indexes

- **PK_PettyCashMisuse** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: ID ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.CustomerMatchResult → dbo.PettyCashMisuse
  - Confidence: 80%
  - Evidence: Exact column name match: "id" in both tables
  - Column: `ID` → `ID`
- **column_match**: dbo.CustomerMatchResult_bak → dbo.PettyCashMisuse
  - Confidence: 80%
  - Evidence: Exact column name match: "id" in both tables
  - Column: `ID` → `ID`
- **column_match**: dbo.Dim_NewUsed → dbo.PettyCashMisuse
  - Confidence: 80%
  - Evidence: Exact column name match: "id" in both tables
  - Column: `ID` → `ID`
- **column_match**: dbo.Dim_Scenario → dbo.PettyCashMisuse
  - Confidence: 80%
  - Evidence: Exact column name match: "id" in both tables
  - Column: `ID` → `ID`
- **column_match**: dbo.dim_Time_Lgcy → dbo.PettyCashMisuse
  - Confidence: 80%
  - Evidence: Exact column name match: "id" in both tables
  - Column: `ID` → `ID`
- **column_match**: dbo.HFM_Account_Corp_Dim → dbo.PettyCashMisuse
  - Confidence: 80%
  - Evidence: Exact column name match: "id" in both tables
  - Column: `ID` → `ID`
- **column_match**: dbo.HFM_Account_MGMT_Dim → dbo.PettyCashMisuse
  - Confidence: 80%
  - Evidence: Exact column name match: "id" in both tables
  - Column: `ID` → `ID`
- **column_match**: dbo.Jobcode_Totalcost → dbo.PettyCashMisuse
  - Confidence: 80%
  - Evidence: Exact column name match: "id" in both tables
  - Column: `ID` → `ID`
- **column_match**: dbo.Metric → dbo.PettyCashMisuse
  - Confidence: 80%
  - Evidence: Exact column name match: "metricid" in both tables
  - Column: `MetricID` → `MetricID`
- **column_match**: dbo.MetricAccountXref → dbo.PettyCashMisuse
  - Confidence: 80%
  - Evidence: Exact column name match: "metricid" in both tables
  - Column: `MetricID` → `MetricID`
- **column_match**: dbo.MetricReportGroup → dbo.PettyCashMisuse
  - Confidence: 80%
  - Evidence: Exact column name match: "metricid" in both tables
  - Column: `MetricID` → `MetricID`
- **column_match**: dbo.PettyCashMisuse → dbo.START_Metrics
  - Confidence: 80%
  - Evidence: Exact column name match: "metricid" in both tables
  - Column: `MetricID` → `MetricID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
