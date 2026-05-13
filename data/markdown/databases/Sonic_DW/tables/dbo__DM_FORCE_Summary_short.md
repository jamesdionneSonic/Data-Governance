---
name: DM_FORCE_Summary_short
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on:
  - DM_FORCE_SUMMARY
  - DM_FORCE_SUMMARY_Dev
  - DM_FORCE_SUMMARY
  - DM_FORCE_SUMMARY_Dev
  - DM_FORCE_SUMMARY
  - DM_FORCE_SUMMARY_Dev
row_count: 0
size_kb: 0
column_count: 91
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

| Name                | Type    | Nullable | Identity | Default | Description |
| ------------------- | ------- | -------- | -------- | ------- | ----------- |
| `DateKey`           | int     | ✓        |          |         |             |
| `EntityKey`         | int     | ✓        |          |         |             |
| `ServiceType`       | varchar | ✓        |          |         |             |
| `ServiceAdvisorKey` | int     | ✓        |          |         |             |
| `CPLIRO`            | int     | ✓        |          |         |             |
| `INTLIRO`           | int     | ✓        |          |         |             |
| `OTHLIRO`           | int     | ✓        |          |         |             |
| `WTYLIRO`           | int     | ✓        |          |         |             |
| `RprLS`             | money   | ✓        |          |         |             |
| `RprHours`          | numeric | ✓        |          |         |             |
| `NALS`              | money   | ✓        |          |         |             |
| `NAHours`           | numeric | ✓        |          |         |             |
| `MaintLS`           | money   | ✓        |          |         |             |
| `MaintHours`        | numeric | ✓        |          |         |             |
| `CPFRH`             | numeric | ✓        |          |         |             |
| `WTYFRH`            | numeric | ✓        |          |         |             |
| `CPLaborSales`      | money   | ✓        |          |         |             |
| `WTYLaborSales`     | money   | ✓        |          |         |             |
| `OneLineItem`       | int     | ✓        |          |         |             |
| `CountofROLine`     | int     | ✓        |          |         |             |
| `SoldHours`         | numeric | ✓        |          |         |             |
| `GridOP`            | int     | ✓        |          |         |             |
| `GridOpDone`        | int     | ✓        |          |         |             |
| `LaborSales`        | money   | ✓        |          |         |             |
| `LaborCost`         | money   | ✓        |          |         |             |
| `MenuCls`           | int     | ✓        |          |         |             |
| `MenuUps`           | int     | ✓        |          |         |             |
| `PartsCost`         | money   | ✓        |          |         |             |
| `PartsSales`        | money   | ✓        |          |         |             |
| `ROCountDetail`     | int     | ✓        |          |         |             |
| `VIPReinspection`   | int     | ✓        |          |         |             |
| `DoorRate`          | numeric | ✓        |          |         |             |
| `DaysOpen`          | int     | ✓        |          |         |             |
| `TargetHourRate`    | numeric | ✓        |          |         |             |
| `GridOverRide`      | int     | ✓        |          |         |             |
| `UpsellCount`       | int     | ✓        |          |         |             |
| `UpsellSales`       | money   | ✓        |          |         |             |
| `UpsellHours`       | numeric | ✓        |          |         |             |
| `OPCWeight`         | int     | ✓        |          |         |             |
| `FDCICount`         | int     | ✓        |          |         |             |
| `MenuCount`         | int     | ✓        |          |         |             |
| `CPItemCount`       | int     | ✓        |          |         |             |
| `WTYPartsSales`     | money   | ✓        |          |         |             |
| `CPPartsSales`      | money   | ✓        |          |         |             |
| `WTYPartsCost`      | money   | ✓        |          |         |             |
| `CPPartsCost`       | money   | ✓        |          |         |             |
| `WTYLaborCost`      | money   | ✓        |          |         |             |
| `CPLaborCost`       | money   | ✓        |          |         |             |
| `OTHLaborSales`     | money   | ✓        |          |         |             |
| `OTHLaborCost`      | money   | ✓        |          |         |             |
| `OTHPartsCost`      | money   | ✓        |          |         |             |
| `OTHPartsSales`     | money   | ✓        |          |         |             |
| `CPMiscCost`        | money   | ✓        |          |         |             |
| `CPMiscSales`       | money   | ✓        |          |         |             |
| `INTFRH`            | numeric | ✓        |          |         |             |
| `OTHFRH`            | numeric | ✓        |          |         |             |
| `Discounts`         | money   | ✓        |          |         |             |
| `DiscountsLabor`    | money   | ✓        |          |         |             |
| `DiscountsParts`    | money   | ✓        |          |         |             |
| `MenuHours`         | numeric | ✓        |          |         |             |
| `CompHours`         | numeric | ✓        |          |         |             |
| `CompLS`            | money   | ✓        |          |         |             |
| `LOFHours`          | numeric | ✓        |          |         |             |
| `LOFLS`             | money   | ✓        |          |         |             |
| `INTPartsSales`     | money   | ✓        |          |         |             |
| `INTPartsCost`      | money   | ✓        |          |         |             |
| `INTLaborCost`      | money   | ✓        |          |         |             |
| `INTLaborSales`     | money   | ✓        |          |         |             |
| `MiscSales`         | money   | ✓        |          |         |             |
| `MiscCost`          | money   | ✓        |          |         |             |
| `SSPSales`          | money   | ✓        |          |         |             |
| `SSPCost`           | money   | ✓        |          |         |             |
| `INTMiscSales`      | money   | ✓        |          |         |             |
| `INTMiscCost`       | money   | ✓        |          |         |             |
| `INTSSPSales`       | money   | ✓        |          |         |             |
| `INTSSPCost`        | money   | ✓        |          |         |             |
| `WTYMiscSales`      | money   | ✓        |          |         |             |
| `WTYMiscCost`       | money   | ✓        |          |         |             |
| `WTYSSPSales`       | money   | ✓        |          |         |             |
| `WTYSSPCost`        | money   | ✓        |          |         |             |
| `CPSSPSales`        | money   | ✓        |          |         |             |
| `CPSSPCost`         | money   | ✓        |          |         |             |
| `OTHMiscSales`      | money   | ✓        |          |         |             |
| `OTHMiscCost`       | money   | ✓        |          |         |             |
| `OTHSSPSales`       | money   | ✓        |          |         |             |
| `OTHSSPCost`        | money   | ✓        |          |         |             |
| `CountofDLX`        | int     | ✓        |          |         |             |
| `CountofSplitRO`    | int     | ✓        |          |         |             |
| `WTYLICount`        | int     | ✓        |          |         |             |
| `INTLICount`        | int     | ✓        |          |         |             |
| `OTHLICount`        | int     | ✓        |          |         |             |

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.DM_FORCE_SUMMARY → dbo.DM_FORCE_Summary_short
  - Confidence: 80%
  - Evidence: Exact column name match: "gridop" in both tables
  - Column: `GridOP` → `GridOP`
- **column_match**: dbo.DM_FORCE_SUMMARY_Dev → dbo.DM_FORCE_Summary_short
  - Confidence: 80%
  - Evidence: Exact column name match: "gridop" in both tables
  - Column: `GridOP` → `GridOP`
- **column_match**: dbo.DM_FORCE_Summary_short → dbo.DM_FORCE_Summary_short_dev
  - Confidence: 80%
  - Evidence: Exact column name match: "gridop" in both tables
  - Column: `GridOP` → `GridOP`
- **column_match**: dbo.DM_FORCE_SUMMARY → dbo.DM_FORCE_Summary_short
  - Confidence: 80%
  - Evidence: Exact column name match: "gridopdone" in both tables
  - Column: `GridOpDone` → `GridOpDone`
- **column_match**: dbo.DM_FORCE_SUMMARY_Dev → dbo.DM_FORCE_Summary_short
  - Confidence: 80%
  - Evidence: Exact column name match: "gridopdone" in both tables
  - Column: `GridOpDone` → `GridOpDone`
- **column_match**: dbo.DM_FORCE_Summary_short → dbo.DM_FORCE_Summary_short_dev
  - Confidence: 80%
  - Evidence: Exact column name match: "gridopdone" in both tables
  - Column: `GridOpDone` → `GridOpDone`
- **column_match**: dbo.DM_FORCE_SUMMARY → dbo.DM_FORCE_Summary_short
  - Confidence: 80%
  - Evidence: Exact column name match: "gridoverride" in both tables
  - Column: `GridOverRide` → `GridOverRide`
- **column_match**: dbo.DM_FORCE_SUMMARY_Dev → dbo.DM_FORCE_Summary_short
  - Confidence: 80%
  - Evidence: Exact column name match: "gridoverride" in both tables
  - Column: `GridOverRide` → `GridOverRide`
- **column_match**: dbo.DM_FORCE_Summary_short → dbo.DM_FORCE_Summary_short_dev
  - Confidence: 80%
  - Evidence: Exact column name match: "gridoverride" in both tables
  - Column: `GridOverRide` → `GridOverRide`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
