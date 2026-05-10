---
name: vw_Sales_ProjectionGoal_daily
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

CREATE VIEW [dbo].[vw_Sales_ProjectionGoal_daily]
AS

SELECT g.entregion, g.EntityKey, g.entdealerlvl1,g.entbrand,d.CalendarYearMonth,d.datekey, g.SourceType, g.LeadProvider, g.Make, g.Model, 
g.Zipcode, g.newused,CAST(p.Projection AS decimal(34, 2)) AS Projection, CAST(g.Goal AS decimal(34, 2)) AS Goal ,g.workingdaysofmonth,
 CAST(g.Goal AS decimal(34, 2)) / g.workingdaysofmonth AS DailyGoal,d.FullDate
                 FROM    dbo.Dim_Date d
				 left join 
				(select  entregion, ent
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
