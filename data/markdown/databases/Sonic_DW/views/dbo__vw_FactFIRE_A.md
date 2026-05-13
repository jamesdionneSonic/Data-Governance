---
name: vw_FactFIRE_A
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
  - vw_Dim_date
dependency_count: 2
column_count: 29
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.factFIRE_A** (U )
- **dbo.vw_Dim_date** (V )

## Columns

| Name                     | Type    | Nullable | Description |
| ------------------------ | ------- | -------- | ----------- |
| `EntityKey`              | int     | ✓        |             |
| `DealNo`                 | varchar | ✓        |             |
| `FIMgrKey`               | int     | ✓        |             |
| `SalesMgrKey`            | int     | ✓        |             |
| `SalesPersonKey`         | int     |          |             |
| `AccountingDateKey`      | int     | ✓        |             |
| `ContractDateKey`        | int     | ✓        |             |
| `Stockno`                | varchar | ✓        |             |
| `StockType`              | varchar | ✓        |             |
| `DealTypeKey`            | int     | ✓        |             |
| `PurchaseType`           | varchar | ✓        |             |
| `DealTypeFIRE`           | varchar | ✓        |             |
| `TransactionType`        | varchar | ✓        |             |
| `VehicleKey`             | int     |          |             |
| `VehicleMileage`         | int     | ✓        |             |
| `VehicleYear`            | int     | ✓        |             |
| `CertifiedFlag`          | varchar | ✓        |             |
| `FIGLProductCategoryKey` | int     | ✓        |             |
| `FIAccountType`          | char    | ✓        |             |
| `Amount`                 | float   | ✓        |             |
| `DealCount`              | float   |          |             |
| `ProductCount`           | float   |          |             |
| `PenetrationCount`       | float   |          |             |
| `CustomerKey`            | int     | ✓        |             |
| `fiwipstatuscode`        | char    | ✓        |             |
| `LenderKey`              | int     | ✓        |             |
| `DMSCustomerKey`         | int     | ✓        |             |
| `DaysAlignedFullKey`     | int     | ✓        |             |
| `FactFireAKey`           | int     |          |             |

## Definition

```sql
CREATE VIEW dbo.vw_FactFIRE_A
AS
SELECT        dbo.factFIRE_A.EntityKey, dbo.factFIRE_A.DealNo, dbo.factFIRE_A.FIMgrKey, dbo.factFIRE_A.SalesMgrKey, dbo.factFIRE_A.SalesPersonKey, dbo.factFIRE_A.AccountingDateKey, dbo.factFIRE_A.ContractDateKey,
                         dbo.factFIRE_A.Stockno, dbo.factFIRE_A.StockType, dbo.factFIRE_A.DealTypeKey, dbo.factFIRE_A.PurchaseType, CASE WHEN TransactionType = 'Product Only' THEN 'Product Only' WHEN ([PurchaseType] = 'Finance(Buy)')
                         THEN 'Finance(Buy)' WHEN ([PurchaseType] = 'Lease') THEN 'Lease' WHEN ([PurchaseType] = 'Cash(Buy)' AND TransactionType = 'Vehicle Deal')
                         THEN 'Cash(Buy)' WHEN TransactionType = 'NA' THEN 'Accounting' ELSE [PurchaseType] END AS DealTypeFIRE, dbo.factFIRE_A.TransactionType, dbo.factFIRE_A.VehicleKey, dbo.factFIRE_A.VehicleMileage,
                         dbo.factFIRE_A.VehicleYear, dbo.factFIRE_A.CertifiedFlag, dbo.factFIRE_A.FIGLProductCategoryKey, dbo.factFIRE_A.FIAccountType, dbo.factFIRE_A.Amount, dbo.factFIRE_A.DealCount, dbo.factFIRE_A.ProductCount,
                         dbo.factFIRE_A.PenetrationCount, dbo.factFIRE_A.CustomerKey, dbo.factFIRE_A.fiwipstatuscode, dbo.factFIRE_A.LenderKey, COALESCE (dbo.factFIRE_A.DMSCustomerKey, - 1) AS DMSCustomerKey,
                         dbo.vw_Dim_date.DaysAlignedFullKey, dbo.factFIRE_A.FactFireAKey
FROM            dbo.factFIRE_A INNER JOIN
                         dbo.vw_Dim_date ON dbo.factFIRE_A.AccountingDateKey = dbo.vw_Dim_date.DateKey
WHERE        (dbo.factFIRE_A.AccountingDateKey >= CONVERT(VARCHAR(10), DATEADD(yy, - 6, DATEADD(yy, DATEDIFF(yy, 0, GETDATE()), 0)), 112))

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
