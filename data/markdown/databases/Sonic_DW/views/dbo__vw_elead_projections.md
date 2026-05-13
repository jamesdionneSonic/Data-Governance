---
name: vw_elead_projections
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - Dim_Entity
  - Fact_elead_projections
dependency_count: 2
column_count: 12
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_Entity** (U )
- **dbo.Fact_elead_projections** (U )

## Columns

| Name                | Type      | Nullable | Description |
| ------------------- | --------- | -------- | ----------- |
| `EntRegion`         | varchar   | ✓        |             |
| `EntLineOfBusiness` | varchar   | ✓        |             |
| `EntDealerLvl1`     | varchar   | ✓        |             |
| `EntBrand`          | varchar   | ✓        |             |
| `EntityKey`         | int       |          |             |
| `NewUsed`           | varchar   |          |             |
| `FiscalMonthKey`    | int       | ✓        |             |
| `Tracking`          | int       | ✓        |             |
| `LeadCountTY`       | int       | ✓        |             |
| `EleadsDMSSold`     | int       | ✓        |             |
| `SysStartTime`      | datetime2 |          |             |
| `SysEndTime`        | datetime2 |          |             |

## Definition

```sql
CREATE VIEW dbo.vw_elead_projections
AS
SELECT        dbo.Dim_Entity.EntRegion, dbo.Dim_Entity.EntLineOfBusiness, dbo.Dim_Entity.EntDealerLvl1, dbo.Dim_Entity.EntBrand, dbo.Fact_elead_projections.EntityKey, dbo.Fact_elead_projections.NewUsed,
                         dbo.Fact_elead_projections.FiscalMonthKey, dbo.Fact_elead_projections.Tracking, dbo.Fact_elead_projections.LeadCountTY, dbo.Fact_elead_projections.EleadsDMSSold, dbo.Fact_elead_projections.SysStartTime,
                         dbo.Fact_elead_projections.SysEndTime
FROM            dbo.Fact_elead_projections INNER JOIN
                         dbo.Dim_Entity ON dbo.Fact_elead_projections.EntityKey = dbo.Dim_Entity.EntityKey

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
