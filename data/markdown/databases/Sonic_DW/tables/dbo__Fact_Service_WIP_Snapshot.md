---
name: Fact_Service_WIP_Snapshot
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - fact-table
  - core-schema
depends_on: []
row_count: 0
size_kb: 0
column_count: 16
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

| Name            | Type    | Nullable | Identity | Default | Description |
| --------------- | ------- | -------- | -------- | ------- | ----------- |
| `EntDealerLvl1` | varchar | ✓        |          |         |             |
| `EntityKey`     | int     | ✓        |          |         |             |
| `LaborSales`    | money   | ✓        |          |         |             |
| `LaborCost`     | money   | ✓        |          |         |             |
| `PartsSales`    | money   | ✓        |          |         |             |
| `PartsCost`     | money   | ✓        |          |         |             |
| `MiscSales`     | money   | ✓        |          |         |             |
| `MiscCost`      | money   | ✓        |          |         |             |
| `ROCountDetail` | int     | ✓        |          |         |             |
| `SSPSales`      | money   | ✓        |          |         |             |
| `SSPCost`       | money   | ✓        |          |         |             |
| `CPROCount`     | int     | ✓        |          |         |             |
| `WTYROCount`    | int     | ✓        |          |         |             |
| `IntROCCount`   | int     | ✓        |          |         |             |
| `OTHROCCount`   | int     | ✓        |          |         |             |
| `LoadDate`      | date    | ✓        |          |         |             |

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
