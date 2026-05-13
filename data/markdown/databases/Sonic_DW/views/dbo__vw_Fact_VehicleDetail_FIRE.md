---
name: vw_Fact_VehicleDetail_FIRE
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - factFIRE_A
dependency_count: 1
column_count: 10
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.factFIRE_A** (U )

## Columns

| Name                | Type    | Nullable | Description |
| ------------------- | ------- | -------- | ----------- |
| `EntityKey`         | int     | ✓        |             |
| `AccountingDateKey` | int     | ✓        |             |
| `VehicleKey`        | int     |          |             |
| `VehicleMileage`    | int     | ✓        |             |
| `StockType`         | varchar | ✓        |             |
| `VehicleYear`       | int     | ✓        |             |
| `CertifiedFlag`     | varchar | ✓        |             |
| `Stockno`           | varchar | ✓        |             |
| `StocknoPrefix`     | varchar | ✓        |             |
| `StockType_FIRE`    | varchar | ✓        |             |

## Definition

```sql
CREATE VIEW dbo.vw_Fact_VehicleDetail_FIRE
AS
SELECT     EntityKey, AccountingDateKey, VehicleKey, VehicleMileage, StockType, VehicleYear, CertifiedFlag, Stockno, LEFT(Stockno, 1) AS StocknoPrefix,
                      CASE WHEN StockType = 'New' THEN 'New' WHEN (StockType = 'USED' AND CertifiedFlag = 'Y') THEN 'CPO' WHEN ((StockType = 'Used' OR
                      (StockType = 'NA' AND DealTypeKey = 5)) AND ((VehicleMileage > 80000) OR
                      ((FLOOR(AccountingDateKey / 10000) - VehicleYear > 6))))
                      THEN 'C-Car' WHEN StockType = 'USED' THEN 'Used - Regular' WHEN StockType = 'F' THEN 'Fleet' WHEN StockType IS NULL AND
                      DealTypeKey = 2 THEN 'Used - Regular' WHEN StockType IS NULL AND (DealTypeKey = 1 OR
                      DealTypeKey = 7) THEN 'New' ELSE COALESCE (StockType, 'Unknown') END AS StockType_FIRE
FROM         dbo.factFIRE_A
GROUP BY EntityKey, AccountingDateKey, VehicleKey, VehicleMileage, StockType, VehicleYear, CertifiedFlag, Stockno, LEFT(Stockno, 1), DealTypeKey

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
