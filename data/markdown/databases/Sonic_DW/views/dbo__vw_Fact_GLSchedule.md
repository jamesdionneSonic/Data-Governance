---
name: vw_Fact_GLSchedule
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - dim_GLSchedule_degen
  - Fact_GLSchedule
dependency_count: 2
column_count: 32
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.dim_GLSchedule_degen** (U )
- **dbo.Fact_GLSchedule** (U )

## Columns

| Name                      | Type     | Nullable | Description |
| ------------------------- | -------- | -------- | ----------- |
| `GLSchedKey`              | bigint   |          |             |
| `EntityKey`               | int      |          |             |
| `AccountKey`              | int      |          |             |
| `CurrentMonthKey`         | int      |          |             |
| `AccountingDateKey`       | int      |          |             |
| `DoosiKey`                | int      | ✓        |             |
| `GLSchedDegenKey`         | int      |          |             |
| `ControlTypeKey`          | int      | ✓        |             |
| `SchedTypeKey`            | int      | ✓        |             |
| `JournalKey`              | int      | ✓        |             |
| `DimInterfaceCodeID`      | int      | ✓        |             |
| `PostingDateKey`          | int      | ✓        |             |
| `PostingTimeKey`          | int      | ✓        |             |
| `OperatorKey`             | int      | ✓        |             |
| `PostingAmt`              | money    | ✓        |             |
| `Meta_LoadDate`           | datetime | ✓        |             |
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
| `Control`                 | varchar  |          |             |
| `refer`                   | varchar  | ✓        |             |
| `ControlDesc`             | varchar  |          |             |
| `Control2`                | varchar  |          |             |

## Definition

```sql
/*************************************************************************************************************

*- Updated RAJ 04/02/2015 added new column Meta_LoadDate

***************************************************************************************************************/
CREATE VIEW dbo.vw_Fact_GLSchedule
AS
SELECT        dbo.Fact_GLSchedule.GLSchedKey, dbo.Fact_GLSchedule.EntityKey, dbo.Fact_GLSchedule.AccountKey, dbo.Fact_GLSchedule.CurrentMonthKey, dbo.Fact_GLSchedule.AccountingDateKey, dbo.Fact_GLSchedule.DoosiKey,
                         dbo.Fact_GLSchedule.GLSchedDegenKey, dbo.Fact_GLSchedule.ControlTypeKey, dbo.Fact_GLSchedule.SchedTypeKey, dbo.Fact_GLSchedule.JournalKey, dbo.Fact_GLSchedule.DimInterfaceCodeID,
                         dbo.Fact_GLSchedule.PostingDateKey, dbo.Fact_GLSchedule.PostingTimeKey, dbo.Fact_GLSchedule.OperatorKey, dbo.Fact_GLSchedule.PostingAmt, dbo.Fact_GLSchedule.Meta_LoadDate,
                         dbo.Fact_GLSchedule.ETLExecution_ID, dbo.Fact_GLSchedule.Meta_Src_Sys_ID, dbo.Fact_GLSchedule.Meta_SourceSystemName, dbo.Fact_GLSchedule.Meta_RowEffectiveDate, dbo.Fact_GLSchedule.Meta_RowExpiredDate,
                         dbo.Fact_GLSchedule.Meta_RowIsCurrent, dbo.Fact_GLSchedule.Meta_RowLastChangedDate, dbo.Fact_GLSchedule.Meta_AuditKey, dbo.Fact_GLSchedule.Meta_NaturalKey, dbo.Fact_GLSchedule.Meta_Checksum,
                         dbo.Fact_GLSchedule.User_ID, dbo.Fact_GLSchedule.Meta_ComputerName, dbo.dim_GLSchedule_degen.Control, dbo.dim_GLSchedule_degen.refer, dbo.dim_GLSchedule_degen.ControlDesc,
                         dbo.dim_GLSchedule_degen.Control2
FROM            dbo.Fact_GLSchedule INNER JOIN
                         dbo.dim_GLSchedule_degen ON dbo.Fact_GLSchedule.GLSchedDegenKey = dbo.dim_GLSchedule_degen.GLSchedDegenKey

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
