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
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

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

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
