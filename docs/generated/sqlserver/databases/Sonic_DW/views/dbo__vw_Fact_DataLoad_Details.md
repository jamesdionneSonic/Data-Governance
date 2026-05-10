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
extracted_at: 2026-05-09T12:34:14.349Z
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

```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
