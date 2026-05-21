---
name: vw_FactMSCTasks
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
CREATE VIEW [dbo].[vw_FactMSCTasks]
AS
SELECT        FactMSCTasksID, EntityKey, DateKey, ManualCall, ManualCallCompleted, ScheduledCall, ScheduledCallCompleted, CallsChanged, ManualEmail, ManualEmailCompleted, ScheduledEmail, ScheduledEmailCompleted,
                         EmailsChanged, ManualText, ManualTextCompleted, ScheduledText, TextsChanged, ScheduledTextCompleted, ManualTask, ManualTaskCompleted, ScheduledTask, ScheduledTaskCompleted, TasksChanged, Meta_LoadDate,
                         ETLExecution_ID, Meta_ComputerName, Meta_UserID, Meta_RowLastChangeDate
FROM            dbo.FactMSCTasks



```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
