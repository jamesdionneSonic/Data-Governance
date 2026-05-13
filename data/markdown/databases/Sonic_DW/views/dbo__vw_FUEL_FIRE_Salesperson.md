---
name: vw_FUEL_FIRE_Salesperson
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - dim_FIGLAccounts
  - factFIRE
dependency_count: 2
column_count: 8
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.dim_FIGLAccounts** (U )
- **dbo.factFIRE** (U )

## Columns

| Name                | Type    | Nullable | Description |
| ------------------- | ------- | -------- | ----------- |
| `AccountingDateKey` | int     | ✓        |             |
| `EntityKey`         | int     | ✓        |             |
| `DealTypeKey`       | int     | ✓        |             |
| `VehicleKey`        | int     | ✓        |             |
| `StockNo`           | varchar | ✓        |             |
| `SalesPerson1Key`   | int     | ✓        |             |
| `SalesPerson2Key`   | int     | ✓        |             |
| `SalesPerson3Key`   | int     | ✓        |             |

## Definition

```sql

CREATE VIEW [dbo].[vw_FUEL_FIRE_Salesperson]
AS
SELECT     dbo.factFIRE.AccountingDateKey, dbo.factFIRE.EntityKey, dbo.factFIRE.DealTypeKey, dbo.factFIRE.VehicleKey, dbo.factFIRE.StockNo, dbo.factFIRE.SalesPerson1Key,
                      dbo.factFIRE.SalesPerson2Key, dbo.factFIRE.SalesPerson3Key
FROM         dbo.factFIRE INNER JOIN
                      dbo.dim_FIGLAccounts ON dbo.factFIRE.FIGLProductKey = dbo.dim_FIGLAccounts.FIGLProductKey
WHERE     (NOT (dbo.dim_FIGLAccounts.FIAccountClassification = 'InterCompany')) AND (dbo.factFIRE.statcount = 1)
GROUP BY dbo.factFIRE.AccountingDateKey, dbo.factFIRE.EntityKey, dbo.factFIRE.DealTypeKey, dbo.factFIRE.VehicleKey, dbo.factFIRE.StockNo,
                      dbo.factFIRE.SalesPerson1Key, dbo.factFIRE.SalesPerson2Key, dbo.factFIRE.SalesPerson3Key
HAVING      (dbo.factFIRE.DealTypeKey IN (1, 2, 3, 7))


```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
