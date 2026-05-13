---
name: MetricAccountXref
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on:
  - Metric
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

| Name             | Type | Nullable | Identity | Default | Description |
| ---------------- | ---- | -------- | -------- | ------- | ----------- |
| `MetricXrefID`   | int  |          |          |         |             |
| `MetricID`       | int  |          |          |         |             |
| `AccountMgmtKey` | int  |          |          |         |             |

## Constraints

- **Primary Key**: PK_MetricAccountXref
  - Columns: MetricXrefID

## Indexes

- **PK_MetricAccountXref** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: MetricXrefID ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.Metric → dbo.MetricAccountXref
  - Confidence: 80%
  - Evidence: Exact column name match: "metricid" in both tables
  - Column: `MetricID` → `MetricID`
- **column_match**: dbo.MetricAccountXref → dbo.MetricReportGroup
  - Confidence: 80%
  - Evidence: Exact column name match: "metricid" in both tables
  - Column: `MetricID` → `MetricID`
- **column_match**: dbo.MetricAccountXref → dbo.PettyCashMisuse
  - Confidence: 80%
  - Evidence: Exact column name match: "metricid" in both tables
  - Column: `MetricID` → `MetricID`
- **column_match**: dbo.MetricAccountXref → dbo.START_Metrics
  - Confidence: 80%
  - Evidence: Exact column name match: "metricid" in both tables
  - Column: `MetricID` → `MetricID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
