---
name: vw_Fact_Activity
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

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Definition

```sql

CREATE VIEW [dbo].[vw_Fact_Activity]
AS
SELECT        FactActivityKey, EntityKey, LeadStatusKey, CreatedOnDateKey, CreatedOnTimeKey, SourceKey, OpportunityCreatedOnDateKey, CreatedByKey, ActivityTypeKey, WorkflowKey, ActivityStatusKey, 
                         OpportunityNaturalKey, ScheduledStartTimeKey, ScheduledEndTimeKey, ActualStartTimeKey, ActualEndDateKey, ActualEndTimeKey, ModifiedOnDateKey, NextActivityDateDueKey, ScheduledStartDateKey, 
                         ActualStartDateKe
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
