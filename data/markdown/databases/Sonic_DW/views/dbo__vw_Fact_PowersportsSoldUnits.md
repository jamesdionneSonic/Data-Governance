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
depends_on:
  - Dim_Date
  - Dim_PowersportCMF2Entity
  - Fact_PowersportsSoldUnits
  - vw_Dim_Month
dependency_count: 4
column_count: 10
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

2- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_Date** (U )
- **dbo.Dim_PowersportCMF2Entity** (U )
- **dbo.Fact_PowersportsSoldUnits** (U )
- **dbo.vw_Dim_Month** (V )

## Columns

| Name              | Type     | Nullable | Description |
| ----------------- | -------- | -------- | ----------- |
| `FullDate`        | date     |          |             |
| `DateKey`         | int      |          |             |
| `FiscalMonthKey`  | int      | ✓        |             |
| `EntityKey`       | int      | ✓        |             |
| `Units`           | int      |          |             |
| `NewUsed`         | nvarchar |          |             |
| `SoldPriceTotal`  | money    | ✓        |             |
| `InventoryStatus` | nvarchar |          |             |
| `StartDateKey`    | int      | ✓        |             |
| `DealershipName`  | nvarchar |          |             |

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

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
