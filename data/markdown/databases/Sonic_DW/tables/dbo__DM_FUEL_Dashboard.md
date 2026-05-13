---
name: DM_FUEL_Dashboard
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
column_count: 43
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

| Name                   | Type    | Nullable | Identity | Default | Description |
| ---------------------- | ------- | -------- | -------- | ------- | ----------- |
| `DateKey`              | int     | ✓        |          |         |             |
| `DepartmentKey`        | int     | ✓        |          |         |             |
| `EntityKey`            | int     | ✓        |          |         |             |
| `NetFIPrCount`         | int     | ✓        |          |         |             |
| `NVCost`               | money   | ✓        |          |         |             |
| `ServiceCost`          | money   | ✓        |          |         |             |
| `SGA`                  | money   | ✓        |          |         |             |
| `UVUnits`              | int     | ✓        |          |         |             |
| `NetFICount`           | int     | ✓        |          |         |             |
| `PartsRevenue`         | numeric | ✓        |          |         |             |
| `BSCost`               | money   | ✓        |          |         |             |
| `CPROCount`            | int     | ✓        |          |         |             |
| `ServiceCount`         | int     | ✓        |          |         |             |
| `UVBG`                 | numeric | ✓        |          |         |             |
| `NVRevenue`            | numeric | ✓        |          |         |             |
| `UVRevenue`            | numeric | ✓        |          |         |             |
| `BSCount`              | int     | ✓        |          |         |             |
| `NVBG`                 | numeric | ✓        |          |         |             |
| `BSRev`                | numeric | ✓        |          |         |             |
| `ServiceRevenue`       | numeric | ✓        |          |         |             |
| `WholesaleRevenue`     | numeric | ✓        |          |         |             |
| `WholesaleCost`        | money   | ✓        |          |         |             |
| `CPRODol`              | numeric | ✓        |          |         |             |
| `PartsCount`           | int     | ✓        |          |         |             |
| `NetFIDol`             | numeric | ✓        |          |         |             |
| `SLP`                  | numeric | ✓        |          |         |             |
| `PartsCost`            | money   | ✓        |          |         |             |
| `NVUnits`              | int     | ✓        |          |         |             |
| `FactoryBonus`         | numeric | ✓        |          |         |             |
| `UVCost`               | money   | ✓        |          |         |             |
| `WholesaleUnits`       | int     | ✓        |          |         |             |
| `FactoryBonusUsed`     | numeric | ✓        |          |         |             |
| `ServiceContractCount` | int     | ✓        |          |         |             |
| `ReserveCount`         | int     | ✓        |          |         |             |
| `CPROCountServ`        | int     | ✓        |          |         |             |
| `TotCost`              | money   | ✓        |          |         |             |
| `TotRevenue`           | numeric | ✓        |          |         |             |
| `ServiceWTYGross`      | numeric | ✓        |          |         |             |
| `ServiceSubGross`      | numeric | ✓        |          |         |             |
| `ServiceINTGross`      | numeric | ✓        |          |         |             |
| `ServiceCPGross`       | numeric | ✓        |          |         |             |
| `ReconAmount`          | money   | ✓        |          |         |             |
| `CPROCountBS`          | int     | ✓        |          |         |             |

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
