---
name: vw_Fact_AccountingDetail_old
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - Fact_AccountingDetail
dependency_count: 1
column_count: 33
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Fact_AccountingDetail** (U )

## Columns

| Name                     | Type     | Nullable | Description |
| ------------------------ | -------- | -------- | ----------- |
| `FactAccountDetailKey`   | int      |          |             |
| `AccountKey`             | int      |          |             |
| `VehicleKey`             | int      |          |             |
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
| `VehicleGeneralKey`      | int      |          |             |
| `FlagsKey`               | int      |          |             |
| `DetailKey`              | int      |          |             |
| `SourceEntityKey`        | int      |          |             |
| `MgmtRollupKey`          | int      |          |             |
| `SECRollupKey`           | int      |          |             |
| `PostingAmount`          | money    | ✓        |             |
| `StatCount`              | int      | ✓        |             |
| `Meta_AuditScore`        | int      | ✓        |             |
| `Meta_Src_Sys_ID`        | int      | ✓        |             |
| `Meta_SourceSystemName`  | varchar  | ✓        |             |
| `Meta_RowEffectiveDate`  | datetime | ✓        |             |
| `Meta_RowIsCurrent`      | char     | ✓        |             |
| `Meta_RowLastChanedDate` | datetime | ✓        |             |
| `Meta_Checksum`          | varchar  | ✓        |             |
| `ETLExecutionID`         | int      | ✓        |             |
| `cora_acct_ID`           | int      | ✓        |             |
| `hostitemID`             | varchar  | ✓        |             |
| `Meta_Naturalkey`        | varchar  | ✓        |             |

## Definition

```sql
CREATE VIEW dbo.vw_Fact_AccountingDetail
AS
SELECT     FactAccountDetailKey, AccountKey, VehicleKey, VendorKey, AssociateKey, OperatorKey, JournalKey, CustomerKey, EntityKey, PostingDateKey,
                      AccountingDateKey, EntryDateKey, DocTypeKey, InterfaceCodeKey, VehicleGeneralKey, FlagsKey, DetailKey, SourceEntityKey, MgmtRollupKey,
                      SECRollupKey, PostingAmount, StatCount, Meta_AuditScore, Meta_Src_Sys_ID, Meta_SourceSystemName, Meta_RowEffectiveDate,
                      Meta_RowIsCurrent, Meta_RowLastChanedDate, Meta_Checksum, ETLExecutionID, cora_acct_ID, hostitemID, Meta_Naturalkey
FROM         dbo.Fact_AccountingDetail

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
