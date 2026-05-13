---
name: vw_Fact_PartsSalesDetail
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - Fact_PartsSalesDetail
  - vw_Dim_Entity
dependency_count: 2
column_count: 46
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Fact_PartsSalesDetail** (U )
- **dbo.vw_Dim_Entity** (V )

## Columns

| Name                      | Type     | Nullable | Description |
| ------------------------- | -------- | -------- | ----------- |
| `PartsSalesDetailKey`     | int      |          |             |
| `EntityKey`               | int      | ✓        |             |
| `CustomerKey`             | int      | ✓        |             |
| `VehicleKey`              | int      | ✓        |             |
| `TechnicianKey`           | int      | ✓        |             |
| `OpenDateKey`             | int      | ✓        |             |
| `CloseDateKey`            | int      | ✓        |             |
| `PartKey`                 | int      | ✓        |             |
| `cora_acct_id_parts`      | int      | ✓        |             |
| `cora_acct_id_accounting` | int      | ✓        |             |
| `AccountingAccount`       | varchar  | ✓        |             |
| `ReferenceNumber`         | varchar  | ✓        |             |
| `SequenceNumber`          | int      | ✓        |             |
| `InvoiceNumber`           | varchar  | ✓        |             |
| `PONumber`                | varchar  | ✓        |             |
| `PartNumber`              | varchar  | ✓        |             |
| `InvSaleType`             | varchar  | ✓        |             |
| `QuantityOrdered`         | int      | ✓        |             |
| `QuantitySold`            | int      | ✓        |             |
| `ExtendedSale`            | money    | ✓        |             |
| `ExtendedCost`            | money    | ✓        |             |
| `UnitCoreSalePrice`       | money    | ✓        |             |
| `UnitCoreCost`            | money    | ✓        |             |
| `UnitSalePrice`           | money    | ✓        |             |
| `UnitCost`                | money    | ✓        |             |
| `UnitServiceCharge`       | money    | ✓        |             |
| `custno`                  | varchar  | ✓        |             |
| `vehid`                   | varchar  | ✓        |             |
| `vin`                     | varchar  | ✓        |             |
| `stockno`                 | varchar  | ✓        |             |
| `technician`              | varchar  | ✓        |             |
| `opendate`                | datetime | ✓        |             |
| `closedate`               | datetime | ✓        |             |
| `ETLExecution_ID`         | int      | ✓        |             |
| `Meta_Src_Sys_ID`         | int      | ✓        |             |
| `Meta_SourceSystemName`   | varchar  | ✓        |             |
| `Meta_RowEffectiveDate`   | datetime | ✓        |             |
| `Meta_RowExpiredDate`     | datetime | ✓        |             |
| `Meta_RowIsCurrent`       | char     | ✓        |             |
| `Meta_RowLastChangedDate` | datetime | ✓        |             |
| `Meta_AuditKey`           | int      | ✓        |             |
| `Meta_NaturalKey`         | varchar  | ✓        |             |
| `Meta_Checksum`           | int      | ✓        |             |
| `User_ID`                 | varchar  | ✓        |             |
| `Meta_ComputerName`       | varchar  | ✓        |             |
| `EntDealerLvl1`           | varchar  | ✓        |             |

## Definition

```sql
CREATE VIEW [dbo].[vw_Fact_PartsSalesDetail]
AS
SELECT     dbo.Fact_PartsSalesDetail.*, dbo.vw_Dim_Entity.EntDealerLvl1
FROM         dbo.Fact_PartsSalesDetail INNER JOIN
                      dbo.vw_Dim_Entity ON dbo.Fact_PartsSalesDetail.EntityKey = dbo.vw_Dim_Entity.EntityKey

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
