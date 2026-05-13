---
name: MetricReportGroup
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on:
  - Metric
  - MetricAccountXref
  - MetricReport
row_count: 0
size_kb: 0
column_count: 5
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

| Name                        | Type | Nullable | Identity | Default | Description |
| --------------------------- | ---- | -------- | -------- | ------- | ----------- |
| `MetricRptGroupID`          | int  |          |          |         |             |
| `ReportID`                  | int  |          |          |         |             |
| `MetricID`                  | int  |          |          |         |             |
| `SortOrder`                 | int  |          |          |         |             |
| `MetricReportSubGroupingID` | int  |          |          |         |             |

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.Metric → dbo.MetricReportGroup
  - Confidence: 80%
  - Evidence: Exact column name match: "metricid" in both tables
  - Column: `MetricID` → `MetricID`
- **column_match**: dbo.MetricAccountXref → dbo.MetricReportGroup
  - Confidence: 80%
  - Evidence: Exact column name match: "metricid" in both tables
  - Column: `MetricID` → `MetricID`
- **column_match**: dbo.MetricReportGroup → dbo.PettyCashMisuse
  - Confidence: 80%
  - Evidence: Exact column name match: "metricid" in both tables
  - Column: `MetricID` → `MetricID`
- **column_match**: dbo.MetricReportGroup → dbo.START_Metrics
  - Confidence: 80%
  - Evidence: Exact column name match: "metricid" in both tables
  - Column: `MetricID` → `MetricID`
- **column_match**: dbo.MetricReport → dbo.MetricReportGroup
  - Confidence: 80%
  - Evidence: Exact column name match: "reportid" in both tables
  - Column: `ReportID` → `ReportID`
- **column_match**: dbo.MetricReportGroup → dbo.MetricReportSubGrouping
  - Confidence: 80%
  - Evidence: Exact column name match: "metricreportsubgroupingid" in both tables
  - Column: `MetricReportSubGroupingID` → `MetricReportSubGroupingID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
