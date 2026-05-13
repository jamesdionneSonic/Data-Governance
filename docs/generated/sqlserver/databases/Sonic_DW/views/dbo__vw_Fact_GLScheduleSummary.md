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
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
---

## Overview

2- **Type**: View

- **Schema**: dbo

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

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
