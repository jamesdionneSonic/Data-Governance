---
name: vw_Fact_AccountingDetail_20250522
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - Dim_AccountMgmt
  - Dim_Date
  - Dim_DocType
  - Dim_Entity
  - Fact_AccountingDetail
  - vw_Dim_GLDetail
dependency_count: 6
column_count: 36
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_AccountMgmt** (U )
- **dbo.Dim_Date** (U )
- **dbo.Dim_DocType** (U )
- **dbo.Dim_Entity** (U )
- **dbo.Fact_AccountingDetail** (U )
- **dbo.vw_Dim_GLDetail** (V )

## Columns

| Name                       | Type     | Nullable | Description |
| -------------------------- | -------- | -------- | ----------- |
| `FactAccountDetailKey`     | int      |          |             |
| `AccountingDateKey`        | int      |          |             |
| `DetReferenceNumberPrefix` | varchar  | ✓        |             |
| `DetReferenceNumber`       | varchar  | ✓        |             |
| `EntityKey`                | int      |          |             |
| `EntDealerLvl1`            | varchar  | ✓        |             |
| `AccountKey`               | int      |          |             |
| `VehicleKey`               | int      |          |             |
| `VendorKey`                | int      |          |             |
| `OperatorKey`              | int      |          |             |
| `JournalKey`               | int      |          |             |
| `CustomerKey`              | int      |          |             |
| `PostingDateKey`           | int      |          |             |
| `DocTypeKey`               | smallint |          |             |
| `InterfaceCodeKey`         | smallint |          |             |
| `FlagsKey`                 | int      |          |             |
| `DetailKey`                | int      |          |             |
| `EntryDateKey`             | int      |          |             |
| `AccountMgmtKey`           | int      | ✓        |             |
| `PostingAmount`            | money    | ✓        |             |
| `StatCount`                | int      | ✓        |             |
| `MgmtRollupKey`            | int      |          |             |
| `AccountingFullDate`       | date     | ✓        |             |
| `DetControl`               | varchar  | ✓        |             |
| `DMSVendorKey`             | int      |          |             |
| `DMSCustomerKey`           | int      |          |             |
| `MetricTypeKey`            | int      |          |             |
| `DocTypeCode`              | smallint | ✓        |             |
| `DaysAlignedFullKey`       | char     | ✓        |             |
| `FiscalMonthKey`           | int      | ✓        |             |
| `Meta_SourceSystemName`    | varchar  | ✓        |             |
| `DisplayAmount`            | money    | ✓        |             |
| `SECRollupKey`             | int      |          |             |
| `ScenarioKey`              | int      |          |             |
| `HFMBrandKey`              | int      | ✓        |             |
| `DIMVehicleKey`            | int      | ✓        |             |

## Definition

```sql

CREATE VIEW [dbo].[vw_Fact_AccountingDetail_20250522]
AS
SELECT        a1.FactAccountDetailKey, a1.AccountingDateKey, a2.DetReferenceNumberPrefix, a2.DetReferenceNumber, a1.EntityKey, a3.EntDealerLvl1, a1.AccountKey, a1.VehicleKey, a1.VendorKey, a1.OperatorKey, a1.JournalKey,
                         a1.CustomerKey, a1.PostingDateKey, a1.DocTypeKey, a1.InterfaceCodeKey, a1.FlagsKey, a1.DetailKey, a1.EntryDateKey, a1.AccountMgmtKey, a1.PostingAmount, a1.StatCount, a1.MgmtRollupKey,
                         dbo.Dim_Date.FullDate AS AccountingFullDate, a2.DetControl, a1.DMSVendorKey, a1.DMSCustomerKey, 1 AS MetricTypeKey, dbo.Dim_DocType.DocTypeCode, CAST(dbo.Dim_Date.FiscalMonthKey AS char(6))
                         + CAST(CAST(CEILING(CAST(dbo.Dim_Date.DayNumberOfMonth AS FLOAT) / 7) AS char(1)) + CAST(dbo.Dim_Date.DayNumberOfWeek_Sun_Start AS char(1)) AS Char(2)) AS DaysAlignedFullKey, dbo.Dim_Date.FiscalMonthKey,
                         a1.Meta_SourceSystemName, dbo.Dim_AccountMgmt.FUEL_Sign * a1.PostingAmount AS DisplayAmount, a1.SECRollupKey, 31 AS ScenarioKey, a1.HFMBrandKey, a1.DIMVehicleKey
FROM            dbo.Fact_AccountingDetail AS a1 INNER JOIN
                         dbo.Dim_AccountMgmt ON a1.AccountMgmtKey = dbo.Dim_AccountMgmt.AccountMgmtKey LEFT OUTER JOIN
                         dbo.Dim_Entity AS a3 ON a1.EntityKey = a3.EntityKey LEFT OUTER JOIN
                         dbo.Dim_Date ON a1.AccountingDateKey = dbo.Dim_Date.DateKey LEFT OUTER JOIN
                         dbo.Dim_DocType ON a1.DocTypeKey = dbo.Dim_DocType.DimDocTypeID LEFT OUTER JOIN
                         dbo.vw_Dim_GLDetail AS a2 ON a1.DetailKey = a2.DetailKey

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
