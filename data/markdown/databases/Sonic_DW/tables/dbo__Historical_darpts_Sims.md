---
name: Historical_darpts_Sims
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
column_count: 14
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
| `vin`             | varchar  | ✓        |          |         |             |
| `cbs_status`      | varchar  | ✓        |          |         |             |
| `cbs_location`    | varchar  | ✓        |          |         |             |
| `store`           | varchar  | ✓        |          |         |             |
| `stock_no`        | varchar  | ✓        |          |         |             |
| `year`            | float    | ✓        |          |         |             |
| `make`            | varchar  | ✓        |          |         |             |
| `model`           | varchar  | ✓        |          |         |             |
| `trim`            | varchar  | ✓        |          |         |             |
| `age`             | smallint | ✓        |          |         |             |
| `buyer`           | varchar  | ✓        |          |         |             |
| `wherepurchd`     | varchar  | ✓        |          |         |             |
| `purchase_date`   | datetime | ✓        |          |         |             |
| `on_purchase_log` | varchar  | ✓        |          |         |             |

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
