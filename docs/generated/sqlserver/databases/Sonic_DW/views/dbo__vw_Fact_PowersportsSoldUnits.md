---
name: vw_Fact_PowersportsSoldUnits
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

2- **Type**: View

- **Schema**: dbo

## Definition

```sql
CREATE VIEW dbo.vw_Fact_PowersportsSoldUnits
AS
SELECT        dbo.Dim_Date.FullDate, dbo.Dim_Date.DateKey, dbo.Dim_Date.FiscalMonthKey, dbo.Dim_PowersportCMF2Entity.EntityKey, dbo.Fact_PowersportsSoldUnits.Units, dbo.Fact_PowersportsSoldUnits.NewUsed,
                         dbo.Fact_PowersportsSoldUnits.SoldPriceTotal, dbo.Fact_PowersportsSoldUnits.InventoryStatus, dbo.vw_Dim_Month.StartDateKey, dbo.Fact_PowersportsSoldUnits.DealershipName
FROM            dbo.Dim_Date INNER JOIN
                         dbo.Fact_PowersportsSoldUnits ON dbo.Dim_Date.FullDate = dbo.Fact_PowersportsSoldUnits.SoldDate INNER JOIN
                         dbo.vw_Dim_Month ON dbo.Dim_Date.FiscalMonthKey = dbo.vw_Dim_Month.FiscalMonthKey LEFT OUTER JOIN
                         dbo.Dim_PowersportCMF2Entity ON dbo.Fact_PowersportsSoldUnits.DealershipName = dbo.Dim_PowersportCMF2Entity.SIMSDealershipName

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
