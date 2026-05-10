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
extracted_at: 2026-05-09T12:34:14.349Z
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
                         dbo.Fact_GLScheduleSummary.Except
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
