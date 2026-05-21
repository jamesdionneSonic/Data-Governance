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
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
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
				(select  entregion, entitykey, entdealerlvl1, entbrand, calendaryearmonth, SourceType, LeadProvider, Make, Model, Zipcode, newused,workingdaysofmonth, max(CAST(Goal AS decimal(34, 2))) AS Goal
				 from dbo.vw_Sales_ProjectionGoal_view g
				 group by entregion, entitykey, entdealerlvl1, entbrand, calendaryearmonth, SourceType, LeadProvider, Make, Model, Zipcode, newused,workingdaysofmonth)g
				 on g.calendaryearmonth=d.calendaryearmonth
				 left join dbo.vw_Sales_ProjectionGoal_view p
				 on  g.calendaryearmonth=d.calendaryearmonth and d.DateKey=p.DateKey and p.EntDealerLvl1=g.EntDealerLvl1 and p.NewUsed=g.NewUsed
				 WHERE
				 (FullDate BETWEEN DATEADD(year, - 2, datefromparts(YEAR(DATEADD(day, - 2, GETDATE())), MONTH(DATEADD(day, - 1, GETDATE())), 1)) AND
				 CAST(EOMONTH(DATEADD(day, - 1, GETDATE())) AS date)) and d.VariableOpsDayFlag=1


```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
