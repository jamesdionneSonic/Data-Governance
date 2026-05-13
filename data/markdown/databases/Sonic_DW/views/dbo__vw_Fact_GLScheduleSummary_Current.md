---
name: vw_Fact_GLScheduleSummary_Current
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

Metadata auto-extracted from SQL Server.

- **Type**: View
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
| `GLSchedSummaryKey`       | bigint   |          |             |
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


CREATE VIEW [dbo].[vw_Fact_GLScheduleSummary_Current]
AS
SELECT        glss.GLSchedSummaryKey, glss.CurrentMonthKey, glss.EntityKey, glss.AccountKey,
                         glss.SchedTypeKey, glss.ControlTypeKey, glss.ExceptionAccountKey, glss.GLSchedSumDegenKey,
                         glss.ExceptionKey, glss.DoosiKey, glss.DMSCustomerKey, glss.DMSVendorKey,
                         glss.AssociateKey, glss.VehicleKey, glss.Days_MonthEnd, glss.Amount,
                         glss.Meta_LoadDate, glss.ETLExecution_ID, glss.Meta_Src_Sys_ID, glss.Meta_SourceSystemName,
                         glss.Meta_RowEffectiveDate, glss.Meta_RowExpiredDate, glss.Meta_RowIsCurrent, glss.Meta_RowLastChangedDate,
                         glss.Meta_AuditKey, glss.Meta_NaturalKey, glss.Meta_Checksum, glss.User_ID,
                         glss.Meta_ComputerName, dbo.Dim_ScheduleException.ExceptionDescription, dbo.Dim_SchedExceptionAccounts.ScheduleName, dbo.Dim_SchedExceptionAccounts.AccountCategory,
                         dbo.Dim_Date.FullDate AS DoosiDate, dbo.Dim_GLScheduleSummary_degen.Control, dbo.Dim_GLScheduleSummary_degen.ControlDesc, dbo.Dim_ScheduleException.ExceptionFilter, dbo.Dim_ScheduleType.SchedType,
                         dbo.Dim_ScheduleType.SchedTypeDesc, CASE WHEN Amount > 0 THEN 1 ELSE 0 END AS DebitFlag, CASE WHEN Amount > 0 THEN Amount ELSE NULL END AS DebitAmount, CASE WHEN Amount < 0 THEN Amount ELSE NULL
                         END AS CreditAmount, CASE WHEN Amount < 0 THEN 1 ELSE 0 END AS CreditFlag, dbo.Dim_GLScheduleSummary_degen.ControlType, dbo.Dim_GLScheduleSummary_degen.EntCora_Account_ID,
                         dbo.Dim_Month.FiscalMonthKey
FROM            dbo.Dim_ScheduleType RIGHT OUTER JOIN
                         dbo.Dim_Date INNER JOIN
                         dbo.Dim_Month INNER JOIN
                         dbo.Fact_GLScheduleSummary AS glss ON dbo.Dim_Month.StartDateKey = glss.CurrentMonthKey ON dbo.Dim_Date.DateKey = glss.DoosiKey ON
                         dbo.Dim_ScheduleType.SchedTypeKey = glss.SchedTypeKey LEFT OUTER JOIN
                         dbo.Dim_SchedExceptionAccounts ON glss.ExceptionAccountKey = dbo.Dim_SchedExceptionAccounts.ExceptionAccountKey LEFT OUTER JOIN
                         dbo.Dim_GLScheduleSummary_degen ON glss.GLSchedSumDegenKey = dbo.Dim_GLScheduleSummary_degen.GLSchedSumDegenKey LEFT OUTER JOIN
                         dbo.Dim_ScheduleException ON glss.ExceptionKey = dbo.Dim_ScheduleException.ExceptionKey
WHERE glss.CurrentMonthKey >= CONVERT(varchar,DATEADD(month, DATEDIFF(month, 0, Getdate())-1,0),112)

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
