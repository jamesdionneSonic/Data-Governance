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
extracted_at: 2026-05-09T12:34:14.349Z
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

WHERE        (ea.IsActive = 1) AND (ea.AsoJobCode IN ('SLSPER', 'OSOEEG', 'EXPGD', 'DSKS
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
