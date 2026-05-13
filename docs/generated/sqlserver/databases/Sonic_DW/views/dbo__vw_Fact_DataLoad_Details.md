---
name: vw_Fact_DataLoad_Details
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
CREATE VIEW [dbo].[vw_Fact_DataLoad_Details]
AS
SELECT     TOP (100) PERCENT
	  Dt.FullDate
	, Step.ProcessName
	, Step.StepName
	, Step.StepNumber
	, Src.SourceName
	, Src.SourceSystem
	, Src.SourceLocation
	, Tgt.TargetName
	, tgt.TargetSystem
	, fact.SourceKey
	, fact.TargetKey
	, fact.StepKey
	, fact.StatusKey
	, fact.EntityKey
	, fact.DateKey
	, fact.ExecutionInstance
	, fact.SequenceNumber
	, fact.StartTime
	, fact.EndTime
	, fact.StepStarted
	, fact.StepCompleted
	, fact.DurationSec
	, fact.ExpectedRows
	, fact.ActualRows
	, fact.WarningCount
	, fact.ErrorCount
	, Stat.StatusCode
	, Stat.StatusDescription
	, fact.Meta_Src_Sys_ID
	, fact.Meta_SourceSystemName
	, fact.Meta_RowEffectiveDate
	, fact.Meta_RowExpiredDate
	, fact.Meta_RowIsCurrent
	, fact.Meta_RowLastChangedDate
	, fact.ETLExecution_ID
	, fact.User_ID
	, fact.Meta_ComputerName
	, fact.Meta_LoadDate
FROM sonic_dw.dbo.Fact_DataLoad AS fact WITH (nolock)
	LEFT OUTER JOIN sonic_dw.dbo.Dim_StepSource AS Src WITH (nolock)
		ON fact.SourceKey = Src.SourceKey
	LEFT OUTER JOIN sonic_dw.dbo.Dim_StepTarget AS Tgt WITH (nolock)
		ON fact.TargetKey = Tgt.TargetKey
	LEFT OUTER JOIN sonic_dw.dbo.Dim_Status AS Stat WITH (nolock)
		ON fact.StatusKey = Stat.StatusKey
	LEFT OUTER JOIN sonic_dw.dbo.Dim_Step AS Step WITH (nolock)
		ON fact.StepKey = Step.StepKey
	LEFT OUTER JOIN Sonic_DW.dbo.Dim_Date AS Dt WITH (nolock)
		ON fact.DateKey = Dt.DateKey
	LEFT OUTER JOIN Sonic_DW.dbo.Dim_Entity AS Ent WITH (nolock)
		ON fact.EntityKey = Ent.EntityKey
ORDER BY Dt.FullDate, Step.StepNumber, Src.SourceName, fact.ExecutionInstance, fact.SequenceNumber

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
