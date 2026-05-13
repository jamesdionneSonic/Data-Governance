---
name: dimFIProduct
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on:
  - Dim_FIProduct
row_count: 0
size_kb: 0
column_count: 8
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

| Name               | Type     | Nullable | Identity | Default | Description |
| ------------------ | -------- | -------- | -------- | ------- | ----------- |
| `ProductID`        | int      |          | ✓        |         |             |
| `ProductCode`      | varchar  |          |          |         |             |
| `ProductDesc`      | varchar  | ✓        |          |         |             |
| `ProductCategory`  | varchar  | ✓        |          |         |             |
| `ProductCategory2` | varchar  | ✓        |          |         |             |
| `SalesAccount`     | varchar  | ✓        |          |         |             |
| `CostAccount`      | varchar  | ✓        |          |         |             |
| `Created`          | datetime | ✓        |          |         |             |

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.Dim_FIProduct → dbo.dimFIProduct
  - Confidence: 80%
  - Evidence: Exact column name match: "productid" in both tables
  - Column: `ProductID` → `ProductID`
- **column_match**: dbo.dimFIProduct → dbo.FactFireBookings_preDW
  - Confidence: 80%
  - Evidence: Exact column name match: "productid" in both tables
  - Column: `ProductID` → `productid`
- **column_match**: dbo.dimFIProduct → dbo.factFIREBookingsWeOwe
  - Confidence: 80%
  - Evidence: Exact column name match: "productid" in both tables
  - Column: `ProductID` → `productid`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
