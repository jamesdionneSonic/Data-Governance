---
name: factFIRE_A_BMWMini
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on: []
row_count: 0
size_kb: 0
column_count: 46
index_count: 0
check_constraint_count: 0
extraction_warnings:
  - MISSING_VIEW_DATABASE_STATE
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: table
- **Schema**: dbo
- **Row Count**: 0
- **Size**: 0 KB

## Columns

| Name                       | Type      | Nullable | Identity | Default | Description |
| -------------------------- | --------- | -------- | -------- | ------- | ----------- |
| `FactFireAKey`             | int       |          | ✓        |         |             |
| `EntityKey`                | int       | ✓        |          |         |             |
| `DealNo`                   | varchar   | ✓        |          |         |             |
| `FIMgrKey`                 | int       | ✓        |          |         |             |
| `SalesMgrKey`              | int       | ✓        |          |         |             |
| `SalesPersonKey`           | int       |          |          |         |             |
| `AccountingDateKey`        | int       | ✓        |          |         |             |
| `ContractDateKey`          | int       | ✓        |          |         |             |
| `CashPrice`                | numeric   | ✓        |          |         |             |
| `Stockno`                  | varchar   | ✓        |          |         |             |
| `StockType`                | varchar   | ✓        |          |         |             |
| `DealTypeKey`              | int       | ✓        |          |         |             |
| `PurchaseType`             | varchar   | ✓        |          |         |             |
| `TransactionType`          | varchar   | ✓        |          |         |             |
| `IsRetail`                 | varchar   | ✓        |          |         |             |
| `VehicleKey`               | int       |          |          |         |             |
| `VehicleMileage`           | int       | ✓        |          |         |             |
| `VehicleYear`              | int       | ✓        |          |         |             |
| `CertifiedFlag`            | varchar   | ✓        |          |         |             |
| `FIGLProductCategoryKey`   | int       | ✓        |          |         |             |
| `FIAccountType`            | char      | ✓        |          |         |             |
| `Amount`                   | float     | ✓        |          |         |             |
| `DealCount`                | float     |          |          |         |             |
| `ProductCount`             | float     |          |          |         |             |
| `PenetrationCount`         | float     |          |          |         |             |
| `CustomerKey`              | int       | ✓        |          |         |             |
| `DMSCustomerKey`           | int       | ✓        |          |         |             |
| `fiwipstatuscode`          | char      | ✓        |          |         |             |
| `LenderKey`                | int       | ✓        |          |         |             |
| `apr`                      | float     | ✓        |          |         |             |
| `age`                      | int       | ✓        |          |         |             |
| `buyrateapr`               | float     | ✓        |          |         |             |
| `buyrateaddon`             | float     | ✓        |          |         |             |
| `buyratelfm`               | float     | ✓        |          |         |             |
| `extwarrantyexpmileslease` | int       | ✓        |          |         |             |
| `extwarrantytermlease`     | int       | ✓        |          |         |             |
| `frontweowesgrosssales`    | numeric   | ✓        |          |         |             |
| `mbilimit`                 | int       | ✓        |          |         |             |
| `mbiname`                  | varchar   | ✓        |          |         |             |
| `mbiterm`                  | varchar   | ✓        |          |         |             |
| `makename`                 | varchar   | ✓        |          |         |             |
| `modelname`                | varchar   | ✓        |          |         |             |
| `sellrateapr`              | float     | ✓        |          |         |             |
| `totaltradesover`          | numeric   | ✓        |          |         |             |
| `term`                     | int       | ✓        |          |         |             |
| `VSC_RowLastUpdated`       | datetime2 | ✓        |          |         |             |

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
