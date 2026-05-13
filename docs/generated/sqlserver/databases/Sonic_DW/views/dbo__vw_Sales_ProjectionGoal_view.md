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
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
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
                                                         dbo.vw_Dim_EntityMAR AS e ON b.EntityKey = e.EntityKey AND e.EntActive = 'Active' AND e.EntLineOfBusiness = 'Sonic' INNER JOIN
                                                         dbo.Dim_Date AS d ON d.DateKey = b.DateKey
                                WHERE        (b.GroupSubElement = 'Units') AND (d.FullDate BETWEEN DATEADD(year, - 4, datefromparts(YEAR(DATEADD(day, - 1, GETDATE())), MONTH(DATEADD(day, - 1, GETDATE())), 1)) AND CAST(DATEADD(day, - 1,
                                                         GETDATE()) AS date))), projection AS
    (SELECT        e.EntRegion, e.EntityKey, e.EntDealerLvl1, e.EntBrand, d.CalendarYearMonth, d.DateKey, CASE WHEN b.GroupElement = 'New Units' THEN 'New' ELSE 'Used' END AS NewUsed, b.StatCount AS Projection
      FROM            dbo.Doc_Projection AS b WITH (NOLOCK) INNER JOIN
                                dbo.vw_Dim_EntityMAR AS e ON b.EntityKey = e.EntityKey AND e.EntActive = 'Active' AND e.EntLineOfBusiness = 'Sonic' INNER JOIN
                                dbo.Dim_Date AS d ON d.DateKey = b.DateKey
      WHERE        (b.GroupSubElement = 'Units') AND (d.FullDate BETWEEN DATEADD(year, - 4, datefromparts(YEAR(DATEADD(day, - 1, GETDATE())), MONTH(DATEADD(day, - 1, GETDATE())), 1)) AND CAST(DATEADD(day, - 1, GETDATE())
                                AS date)))
    SELECT        p.EntRegion, p.EntityKey, p.EntDealerLvl1, p.EntBrand, p.CalendarYearMonth, p.DateKey, 'Unknown' AS SourceType, 'Unknown' AS LeadProvider, 'Unknown' AS Make, 'Unknown' AS Model, 'Unknown' AS Zipcode, p.NewUsed,
                              p.Projection, g.Goal, g.workingdaysofmonth
     FROM            projection AS p INNER JOIN
                              goal AS g ON p.EntityKey = g.EntityKey AND p.EntBrand = g.EntBrand AND p.NewUsed = g.NewUsed AND p.CalendarYearMonth = g.CalendarYearMonth

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
