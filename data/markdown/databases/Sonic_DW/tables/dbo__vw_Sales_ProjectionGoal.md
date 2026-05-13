---
name: vw_Sales_ProjectionGoal
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on:
  - vw_eleads_goals
  - vw_Sales_Goal_daily
  - vw_Sales_NewUsed
row_count: 0
size_kb: 0
column_count: 16
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

| Name                 | Type    | Nullable | Identity | Default | Description |
| -------------------- | ------- | -------- | -------- | ------- | ----------- |
| `vwSalesPrjGoalID`   | bigint  |          |          |         |             |
| `EntRegion`          | varchar | ✓        |          |         |             |
| `EntityKey`          | int     | ✓        |          |         |             |
| `EntDealerLvl1`      | varchar | ✓        |          |         |             |
| `EntBrand`           | varchar | ✓        |          |         |             |
| `CalendarYearMonth`  | char    | ✓        |          |         |             |
| `DateKey`            | int     | ✓        |          |         |             |
| `SourceType`         | varchar | ✓        |          |         |             |
| `LeadProvider`       | varchar | ✓        |          |         |             |
| `Make`               | varchar | ✓        |          |         |             |
| `Model`              | varchar | ✓        |          |         |             |
| `Zipcode`            | varchar | ✓        |          |         |             |
| `NewUsed`            | varchar | ✓        |          |         |             |
| `Projection`         | money   | ✓        |          |         |             |
| `Goal`               | money   | ✓        |          |         |             |
| `workingdaysofmonth` | int     | ✓        |          |         |             |

## Constraints

- **Primary Key**: vw_Sales_ProjectionGoalPK
  - Columns: vwSalesPrjGoalID

## Indexes

- **vw_Sales_ProjectionGoalPK** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: vwSalesPrjGoalID ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.vw_eleads_goals → dbo.vw_Sales_ProjectionGoal
  - Confidence: 80%
  - Evidence: Exact column name match: "leadprovider" in both tables
  - Column: `LeadProvider` → `LeadProvider`
- **column_match**: dbo.vw_Sales_Goal_daily → dbo.vw_Sales_ProjectionGoal
  - Confidence: 80%
  - Evidence: Exact column name match: "leadprovider" in both tables
  - Column: `LeadProvider` → `LeadProvider`
- **column_match**: dbo.vw_Sales_NewUsed → dbo.vw_Sales_ProjectionGoal
  - Confidence: 80%
  - Evidence: Exact column name match: "leadprovider" in both tables
  - Column: `LeadProvider` → `LeadProvider`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
