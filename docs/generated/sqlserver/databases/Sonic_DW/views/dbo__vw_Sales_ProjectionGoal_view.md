---
name: vw_Sales_ProjectionGoal_view
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

1- **Type**: View
- **Schema**: dbo

## Definition

```sql
CREATE VIEW dbo.vw_Sales_ProjectionGoal_view
AS
WITH goal AS (SELECT        e.EntRegion, e.EntityKey, e.EntDealerLvl1, e.EntBrand, d.CalendarYearMonth, d.DateKey, CASE WHEN b.GroupElement = 'New Units' THEN 'New' ELSE 'Used' END AS NewUsed, b.StatCount AS Goal, 
                                                         d.VOpsDaysMonth AS workingdaysofmonth
                                FROM            dbo.vw_Doc_Budget AS b INNER JOIN
                                                       
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
