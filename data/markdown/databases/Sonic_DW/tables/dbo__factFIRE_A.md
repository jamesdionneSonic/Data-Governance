---
name: factFIRE_A
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
column_count: 47
index_count: 7
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
| `DIMVehicleKey`            | int       | ✓        |          |         |             |

## Indexes

- **IDX_AccountingDateDealCount** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: AccountingDateKey ASC, DealCount ASC, EntityKey ASC, fiwipstatuscode ASC
- **IDX_AccountingDateProductKey** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: AccountingDateKey ASC, FIGLProductCategoryKey ASC
  - Included Columns: EntityKey, DealNo, PenetrationCount
- **IX_factFIRE_A_AccountingDateKey** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: AccountingDateKey ASC
  - Included Columns: EntityKey, DealNo, FIMgrKey, SalesMgrKey, SalesPersonKey, makename, modelname, DIMVehicleKey, PurchaseType, TransactionType, IsRetail, CustomerKey, DMSCustomerKey, LenderKey, VehicleKey, VehicleMileage, VehicleYear, CertifiedFlag, DealCount, ContractDateKey, DealTypeKey, FIGLProductCategoryKey, FIAccountType, fiwipstatuscode, Stockno, StockType
- **IX_factFIRE_A_EntityKey_AccountingDateKey** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: EntityKey ASC, AccountingDateKey ASC
  - Included Columns: DealTypeKey, FIGLProductCategoryKey
- **IX_factFIRE_A_EntityKey_DealNo_AccountingDateKey** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: EntityKey ASC, DealNo ASC, AccountingDateKey ASC
  - Included Columns: StockType, DealTypeKey, PurchaseType, SalesMgrKey, SalesPersonKey, FIAccountType, fiwipstatuscode, Stockno, DMSCustomerKey, TransactionType, VehicleMileage, VehicleYear, CertifiedFlag, FIGLProductCategoryKey, FIMgrKey
- **IX_factFIRE_A_EntityKey_FIAccountType_AccountingDateKey** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: EntityKey ASC, FIAccountType ASC, AccountingDateKey ASC
  - Included Columns: FIGLProductCategoryKey, Amount
- **IX_factFIRE_A_SalesPersonKey_PurchaseType_AccountingDateKey** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: SalesPersonKey ASC, PurchaseType ASC, AccountingDateKey ASC
  - Included Columns: VehicleYear, CertifiedFlag, FIGLProductCategoryKey, EntityKey, Stockno, StockType, DealTypeKey, VehicleKey, VehicleMileage

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
