---
name: vw_autotrader_inventory
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

| Name                       | Type    | Nullable | Identity | Default | Description |
| -------------------------- | ------- | -------- | -------- | ------- | ----------- |
| `vwATInvID`                | bigint  |          |          |         |             |
| `AutoTraderDealerParentID` | int     | ✓        |          |         |             |
| `entregion`                | varchar | ✓        |          |         |             |
| `EntityKey`                | int     | ✓        |          |         |             |
| `entdealerlvl1`            | varchar | ✓        |          |         |             |
| `entbrand`                 | varchar | ✓        |          |         |             |
| `dealerCity`               | varchar | ✓        |          |         |             |
| `dealerState`              | varchar | ✓        |          |         |             |
| `fulldate`                 | date    | ✓        |          |         |             |
| `DateKey`                  | int     | ✓        |          |         |             |
| `make`                     | varchar | ✓        |          |         |             |
| `model`                    | varchar | ✓        |          |         |             |
| `NewUsed`                  | varchar | ✓        |          |         |             |
| `InventoryCount`           | int     | ✓        |          |         |             |

## Constraints

- **Primary Key**: vw_autotrader_inventoryPK
  - Columns: vwATInvID

## Indexes

- **vw_autotrader_inventoryPK** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: vwATInvID ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
