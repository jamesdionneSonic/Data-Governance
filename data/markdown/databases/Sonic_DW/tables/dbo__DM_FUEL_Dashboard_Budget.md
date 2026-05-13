---
name: DM_FUEL_Dashboard_Budget
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
column_count: 39
index_count: 3
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

| Name                    | Type  | Nullable | Identity | Default | Description |
| ----------------------- | ----- | -------- | -------- | ------- | ----------- |
| `DateKey`               | int   | ✓        |          |         |             |
| `DepartmentKey`         | int   | ✓        |          |         |             |
| `EntityKey`             | int   | ✓        |          |         |             |
| `FIPrBudgetCount`       | float | ✓        |          |         |             |
| `CPROCountBSB`          | float | ✓        |          |         |             |
| `ROCountServB`          | float | ✓        |          |         |             |
| `CPROCountServB`        | float | ✓        |          |         |             |
| `ReconAmountB`          | float | ✓        |          |         |             |
| `BFactoryBonus`         | float | ✓        |          |         |             |
| `BFactoryBonusUsed`     | float | ✓        |          |         |             |
| `ServiceBudgetDol`      | float | ✓        |          |         |             |
| `UVBudgetDol`           | float | ✓        |          |         |             |
| `BSBudgetDol`           | float | ✓        |          |         |             |
| `PartsBudgetDol`        | float | ✓        |          |         |             |
| `NVFGB`                 | float | ✓        |          |         |             |
| `UVBudgetCount`         | float | ✓        |          |         |             |
| `FIBudgetCount`         | float | ✓        |          |         |             |
| `NVBudgetCount`         | float | ✓        |          |         |             |
| `FIBudgetDol`           | float | ✓        |          |         |             |
| `WholesaleBudCount`     | float | ✓        |          |         |             |
| `WholesaleBudDol`       | float | ✓        |          |         |             |
| `ServiceWTYBudgetDol`   | float | ✓        |          |         |             |
| `ServiceSubBudgetDol`   | float | ✓        |          |         |             |
| `ServiceINTBudgetDol`   | float | ✓        |          |         |             |
| `ServiceCPBudgetDol`    | float | ✓        |          |         |             |
| `ROCountBsB`            | float | ✓        |          |         |             |
| `PartsCountB`           | float | ✓        |          |         |             |
| `SGABud`                | float | ✓        |          |         |             |
| `SLPBud`                | float | ✓        |          |         |             |
| `RevBud`                | float | ✓        |          |         |             |
| `CostBud`               | float | ✓        |          |         |             |
| `BSCostB`               | float | ✓        |          |         |             |
| `BSRevB`                | float | ✓        |          |         |             |
| `ServiceContractCountB` | float | ✓        |          |         |             |
| `PartsCostB`            | float | ✓        |          |         |             |
| `PartsRevB`             | float | ✓        |          |         |             |
| `ReserveCountB`         | float | ✓        |          |         |             |
| `ServiceCostB`          | float | ✓        |          |         |             |
| `ServiceRevB`           | float | ✓        |          |         |             |

## Indexes

- **IDX_DateKey** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: DateKey ASC
- **IDX_DepartmentKey** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: DepartmentKey ASC
- **IDX_EntityKey** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: EntityKey ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
