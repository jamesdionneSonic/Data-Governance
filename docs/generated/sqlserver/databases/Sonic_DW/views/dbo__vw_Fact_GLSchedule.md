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
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

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

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
