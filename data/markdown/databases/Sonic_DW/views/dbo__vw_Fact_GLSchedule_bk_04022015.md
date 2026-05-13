---
name: vw_Fact_GLSchedule_bk_04022015
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
column_count: 31
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
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

## Definition

```sql



CREATE VIEW [dbo].[vw_Fact_GLSchedule_bk_04022015]
AS
SELECT     dbo.Fact_GLSchedule.*, dbo.dim_GLSchedule_degen.Control, dbo.dim_GLSchedule_degen.refer, dbo.dim_GLSchedule_degen.ControlDesc
FROM         dbo.Fact_GLSchedule INNER JOIN
                      dbo.dim_GLSchedule_degen ON dbo.Fact_GLSchedule.GLSchedDegenKey = dbo.dim_GLSchedule_degen.GLSchedDegenKey




```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
