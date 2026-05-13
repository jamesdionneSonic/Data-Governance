---
name: factRENT
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
column_count: 4
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

| Name         | Type     | Nullable | Identity | Default     | Description |
| ------------ | -------- | -------- | -------- | ----------- | ----------- |
| `PropertyID` | int      | ✓        |          |             |             |
| `DateKey`    | int      | ✓        |          |             |             |
| `Expense`    | money    | ✓        |          |             |             |
| `Created`    | datetime | ✓        |          | (getdate()) |             |

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.factRENT → dbo.xrf_RENT_Contribution
  - Confidence: 80%
  - Evidence: Exact column name match: "propertyid" in both tables
  - Column: `PropertyID` → `PropertyID`
- **column_match**: dbo.factRENT → dbo.xrf_RENT_Escalation
  - Confidence: 80%
  - Evidence: Exact column name match: "propertyid" in both tables
  - Column: `PropertyID` → `PropertyID`
- **column_match**: dbo.factRENT → dbo.xrf_RENT_LIBORPropertyRates
  - Confidence: 80%
  - Evidence: Exact column name match: "propertyid" in both tables
  - Column: `PropertyID` → `PropertyID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
