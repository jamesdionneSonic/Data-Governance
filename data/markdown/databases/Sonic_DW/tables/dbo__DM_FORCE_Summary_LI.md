---
name: DM_FORCE_Summary_LI
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
column_count: 18
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

| Name               | Type    | Nullable | Identity | Default | Description |
| ------------------ | ------- | -------- | -------- | ------- | ----------- |
| `DateKey`          | int     | ✓        |          |         |             |
| `EntityKey`        | int     | ✓        |          |         |             |
| `LineItemType`     | varchar |          |          |         |             |
| `ServiceType`      | varchar | ✓        |          |         |             |
| `LaborSales`       | money   | ✓        |          |         |             |
| `LaborCost`        | money   | ✓        |          |         |             |
| `MiscCost`         | money   | ✓        |          |         |             |
| `MiscSales`        | money   | ✓        |          |         |             |
| `PartsCost`        | money   | ✓        |          |         |             |
| `PartsSales`       | money   | ✓        |          |         |             |
| `ROADPCount`       | int     | ✓        |          |         |             |
| `ROCountDetail`    | int     | ✓        |          |         |             |
| `SSPCost`          | money   | ✓        |          |         |             |
| `SSPSales`         | money   | ✓        |          |         |             |
| `SoldHours`        | numeric | ✓        |          |         |             |
| `CountofROLine`    | int     | ✓        |          |         |             |
| `FixedOpsDayFlag`  | int     | ✓        |          |         |             |
| `FixedOpsDayMonth` | int     | ✓        |          |         |             |

## Indexes

- **IDX_DM_FORCE_Summary_LI** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: DateKey ASC
  - Included Columns: EntityKey, SoldHours, CountofROLine, PartsCost, PartsSales, ROADPCount, ROCountDetail, SSPCost, SSPSales, LineItemType, ServiceType, LaborSales, LaborCost, MiscCost, MiscSales

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
