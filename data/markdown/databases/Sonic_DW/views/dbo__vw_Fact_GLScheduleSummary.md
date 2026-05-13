---
name: vw_Fact_GLScheduleSummary
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - Dim_Date
  - Dim_GLScheduleSummary_degen
  - Dim_Month
  - Dim_SchedExceptionAccounts
  - Dim_ScheduleException
  - Dim_ScheduleType
  - Fact_GLScheduleSummary
dependency_count: 7
column_count: 45
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

2- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_Date** (U )
- **dbo.Dim_GLScheduleSummary_degen** (U )
- **dbo.Dim_Month** (U )
- **dbo.Dim_SchedExceptionAccounts** (U )
- **dbo.Dim_ScheduleException** (U )
- **dbo.Dim_ScheduleType** (U )
- **dbo.Fact_GLScheduleSummary** (U )

## Columns

| Name                      | Type     | Nullable | Description |
| ------------------------- | -------- | -------- | ----------- |
| `GLSchedSummaryKey`       | int      |          |             |
| `CurrentMonthKey`         | int      | ✓        |             |
| `EntityKey`               | int      | ✓        |             |
| `AccountKey`              | int      | ✓        |             |
| `SchedTypeKey`            | int      | ✓        |             |
| `ControlTypeKey`          | int      | ✓        |             |
| `ExceptionAccountKey`     | int      | ✓        |             |
| `GLSchedSumDegenKey`      | int      | ✓        |             |
| `ExceptionKey`            | int      | ✓        |             |
| `DoosiKey`                | int      | ✓        |             |
| `DMSCustomerKey`          | int      | ✓        |             |
| `DMSVendorKey`            | int      | ✓        |             |
| `AssociateKey`            | int      | ✓        |             |
| `VehicleKey`              | int      | ✓        |             |
| `Days_MonthEnd`           | int      | ✓        |             |
| `Amount`                  | money    | ✓        |             |
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
| `ExceptionDescription`    | varchar  | ✓        |             |
| `ScheduleName`            | varchar  | ✓        |             |
| `AccountCategory`         | varchar  | ✓        |             |
| `DoosiDate`               | date     |          |             |
| `Control`                 | varchar  | ✓        |             |
| `ControlDesc`             | varchar  | ✓        |             |
| `ExceptionFilter`         | varchar  | ✓        |             |
| `SchedType`               | int      | ✓        |             |
| `SchedTypeDesc`           | varchar  | ✓        |             |
| `DebitFlag`               | int      |          |             |
| `DebitAmount`             | money    | ✓        |             |
| `CreditAmount`            | money    | ✓        |             |
| `CreditFlag`              | int      |          |             |
| `ControlType`             | int      | ✓        |             |
| `EntCora_Account_ID`      | int      | ✓        |             |
| `FiscalMonthKey`          | int      |          |             |

## Definition

```sql

CREATE VIEW [dbo].[vw_Fact_GLScheduleSummary]
AS
SELECT        dbo.Fact_GLScheduleSummary.GLSchedSummaryKey, dbo.Fact_GLScheduleSummary.CurrentMonthKey, dbo.Fact_GLScheduleSummary.EntityKey, dbo.Fact_GLScheduleSummary.AccountKey,
                         dbo.Fact_GLScheduleSummary.SchedTypeKey, dbo.Fact_GLScheduleSummary.ControlTypeKey, dbo.Fact_GLScheduleSummary.ExceptionAccountKey, dbo.Fact_GLScheduleSummary.GLSchedSumDegenKey,
                         dbo.Fact_GLScheduleSummary.ExceptionKey, dbo.Fact_GLScheduleSummary.DoosiKey, dbo.Fact_GLScheduleSummary.DMSCustomerKey, dbo.Fact_GLScheduleSummary.DMSVendorKey,
                         dbo.Fact_GLScheduleSummary.AssociateKey, dbo.Fact_GLScheduleSummary.VehicleKey, dbo.Fact_GLScheduleSummary.Days_MonthEnd, dbo.Fact_GLScheduleSummary.Amount,
                         dbo.Fact_GLScheduleSummary.Meta_LoadDate, dbo.Fact_GLScheduleSummary.ETLExecution_ID, dbo.Fact_GLScheduleSummary.Meta_Src_Sys_ID, dbo.Fact_GLScheduleSummary.Meta_SourceSystemName,
                         dbo.Fact_GLScheduleSummary.Meta_RowEffectiveDate, dbo.Fact_GLScheduleSummary.Meta_RowExpiredDate, dbo.Fact_GLScheduleSummary.Meta_RowIsCurrent, dbo.Fact_GLScheduleSummary.Meta_RowLastChangedDate,
                         dbo.Fact_GLScheduleSummary.Meta_AuditKey, dbo.Fact_GLScheduleSummary.Meta_NaturalKey, dbo.Fact_GLScheduleSummary.Meta_Checksum, dbo.Fact_GLScheduleSummary.User_ID,
                         dbo.Fact_GLScheduleSummary.Meta_ComputerName, dbo.Dim_ScheduleException.ExceptionDescription, dbo.Dim_SchedExceptionAccounts.ScheduleName, dbo.Dim_SchedExceptionAccounts.AccountCategory,
                         dbo.Dim_Date.FullDate AS DoosiDate, dbo.Dim_GLScheduleSummary_degen.Control, dbo.Dim_GLScheduleSummary_degen.ControlDesc, dbo.Dim_ScheduleException.ExceptionFilter, dbo.Dim_ScheduleType.SchedType,
                         dbo.Dim_ScheduleType.SchedTypeDesc, CASE WHEN Amount > 0 THEN 1 ELSE 0 END AS DebitFlag, CASE WHEN Amount > 0 THEN Amount ELSE NULL END AS DebitAmount, CASE WHEN Amount < 0 THEN Amount ELSE NULL
                         END AS CreditAmount, CASE WHEN Amount < 0 THEN 1 ELSE 0 END AS CreditFlag, dbo.Dim_GLScheduleSummary_degen.ControlType, dbo.Dim_GLScheduleSummary_degen.EntCora_Account_ID,
                         dbo.Dim_Month.FiscalMonthKey
FROM            dbo.Dim_ScheduleType RIGHT OUTER JOIN
                         dbo.Dim_Date INNER JOIN
                         dbo.Dim_Month INNER JOIN
                         dbo.Fact_GLScheduleSummary ON dbo.Dim_Month.StartDateKey = dbo.Fact_GLScheduleSummary.CurrentMonthKey ON dbo.Dim_Date.DateKey = dbo.Fact_GLScheduleSummary.DoosiKey ON
                         dbo.Dim_ScheduleType.SchedTypeKey = dbo.Fact_GLScheduleSummary.SchedTypeKey LEFT OUTER JOIN
                         dbo.Dim_SchedExceptionAccounts ON dbo.Fact_GLScheduleSummary.ExceptionAccountKey = dbo.Dim_SchedExceptionAccounts.ExceptionAccountKey LEFT OUTER JOIN
                         dbo.Dim_GLScheduleSummary_degen ON dbo.Fact_GLScheduleSummary.GLSchedSumDegenKey = dbo.Dim_GLScheduleSummary_degen.GLSchedSumDegenKey LEFT OUTER JOIN
                         dbo.Dim_ScheduleException ON dbo.Fact_GLScheduleSummary.ExceptionKey = dbo.Dim_ScheduleException.ExceptionKey

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
