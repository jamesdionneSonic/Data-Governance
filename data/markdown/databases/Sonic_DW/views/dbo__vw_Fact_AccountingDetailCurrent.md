---
name: vw_Fact_AccountingDetailCurrent
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - Dim_GLDetail
  - Fact_AccountingDetailCurrent
dependency_count: 2
column_count: 42
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_GLDetail** (U )
- **dbo.Fact_AccountingDetailCurrent** (U )

## Columns

| Name                     | Type     | Nullable | Description |
| ------------------------ | -------- | -------- | ----------- |
| `FactAccountDetailKey`   | int      |          |             |
| `AccountKey`             | int      |          |             |
| `VehicleKey`             | int      |          |             |
| `DMSVendorKey`           | int      |          |             |
| `DMSCustomerKey`         | int      |          |             |
| `VendorKey`              | int      |          |             |
| `AssociateKey`           | int      |          |             |
| `OperatorKey`            | int      |          |             |
| `JournalKey`             | int      |          |             |
| `CustomerKey`            | int      |          |             |
| `EntityKey`              | int      |          |             |
| `PostingDateKey`         | int      |          |             |
| `AccountingDateKey`      | int      |          |             |
| `EntryDateKey`           | int      |          |             |
| `DocTypeKey`             | smallint |          |             |
| `InterfaceCodeKey`       | smallint |          |             |
| `VehicleGeneralKey`      | int      | ✓        |             |
| `FlagsKey`               | int      |          |             |
| `DetailKey`              | int      |          |             |
| `SourceEntityKey`        | int      |          |             |
| `MgmtRollupKey`          | int      |          |             |
| `SECRollupKey`           | int      |          |             |
| `AccountMgmtKey`         | int      | ✓        |             |
| `PostingAmount`          | money    | ✓        |             |
| `StatCount`              | int      | ✓        |             |
| `User_ID`                | varchar  | ✓        |             |
| `Meta_ComputerName`      | varchar  | ✓        |             |
| `Meta_LoadDate`          | datetime | ✓        |             |
| `Meta_AuditScore`        | int      | ✓        |             |
| `Meta_Src_Sys_ID`        | int      | ✓        |             |
| `Meta_SourceSystemName`  | varchar  | ✓        |             |
| `Meta_RowEffectiveDate`  | datetime | ✓        |             |
| `Meta_RowLastChanedDate` | datetime | ✓        |             |
| `Meta_Checksum`          | varchar  | ✓        |             |
| `ETLExecutionID`         | int      | ✓        |             |
| `HFMBrandKey`            | int      | ✓        |             |
| `DetControl`             | varchar  | ✓        |             |
| `DetControl2`            | varchar  | ✓        |             |
| `DetReferenceNumber`     | varchar  | ✓        |             |
| `DetCora_Acct_ID`        | int      | ✓        |             |
| `DetHeaderDescription`   | varchar  | ✓        |             |
| `DetDetailDescription`   | varchar  | ✓        |             |

## Definition

```sql

CREATE VIEW [dbo].[vw_Fact_AccountingDetailCurrent]
AS
SELECT        fadc.FactAccountDetailKey, fadc.AccountKey, fadc.VehicleKey, fadc.DMSVendorKey, fadc.DMSCustomerKey, fadc.VendorKey, fadc.AssociateKey, fadc.OperatorKey, fadc.JournalKey, fadc.CustomerKey,
                                                    fadc.EntityKey, fadc.PostingDateKey, fadc.AccountingDateKey, fadc.EntryDateKey, fadc.DocTypeKey, fadc.InterfaceCodeKey, fadc.VehicleGeneralKey, fadc.FlagsKey, fadc.DetailKey, fadc.SourceEntityKey,
                                                    fadc.MgmtRollupKey, fadc.SECRollupKey, fadc.AccountMgmtKey, fadc.PostingAmount, fadc.StatCount, fadc.User_ID, fadc.Meta_ComputerName, fadc.Meta_LoadDate, fadc.Meta_AuditScore, fadc.Meta_Src_Sys_ID,
                                                    fadc.Meta_SourceSystemName, fadc.Meta_RowEffectiveDate, fadc.Meta_RowLastChanedDate, fadc.Meta_Checksum, fadc.ETLExecutionID, fadc.HFMBrandKey, dbo.Dim_GLDetail.DetControl,
                                                    dbo.Dim_GLDetail.DetControl2, dbo.Dim_GLDetail.DetReferenceNumber, dbo.Dim_GLDetail.DetCora_Acct_ID, dbo.Dim_GLDetail.DetHeaderDescription, dbo.Dim_GLDetail.DetDetailDescription
                          FROM            dbo.Fact_AccountingDetailCurrent AS fadc LEFT OUTER JOIN
                                                    dbo.Dim_GLDetail ON fadc.DetailKey = dbo.Dim_GLDetail.DetailKey

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
