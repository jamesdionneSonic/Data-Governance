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
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

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

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
