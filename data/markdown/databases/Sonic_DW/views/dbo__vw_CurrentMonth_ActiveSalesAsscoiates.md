---
name: vw_CurrentMonth_ActiveSalesAsscoiates
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - Dim_Date
  - Dim_Entity
  - vw_EmployeesActiveByMonth
dependency_count: 3
column_count: 3
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_Date** (U )
- **dbo.Dim_Entity** (U )
- **dbo.vw_EmployeesActiveByMonth** (V )

## Columns

| Name                      | Type    | Nullable | Description |
| ------------------------- | ------- | -------- | ----------- |
| `EntityKey`               | int     |          |             |
| `EntDealerLvl1`           | varchar | ✓        |             |
| `CurrentActiveAssociates` | int     | ✓        |             |

## Definition

```sql

Create VIEW [dbo].[vw_CurrentMonth_ActiveSalesAsscoiates]

AS

SELECT        e.EntityKey, e.EntDealerLvl1, count(distinct asoemployeenumber) AS CurrentActiveAssociates

FROM            dbo.vw_EmployeesActiveByMonth AS ea INNER JOIN

                         dbo.Dim_Date AS d ON d.FiscalMonthKey = ea.FiscalMonthKey INNER JOIN

                         dbo.Dim_Entity AS e ON e.EntityKey = ea.EntityKey

WHERE        (ea.IsActive = 1) AND (ea.AsoJobCode IN ('SLSPER', 'OSOEEG', 'EXPGD', 'DSKSAL', 'DSKSLNS', 'BDCIA', 'BDCIAV')) AND (e.EntActive = 'active') AND (d.FullDate = DATEADD(day, - 1, CAST(GETDATE() AS DATE)))

GROUP BY e.EntityKey, e.EntDealerLvl1


```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
