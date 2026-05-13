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
depends_on:
  - FactMSCTasks
dependency_count: 1
column_count: 28
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.FactMSCTasks** (U )

## Columns

| Name                      | Type     | Nullable | Description |
| ------------------------- | -------- | -------- | ----------- |
| `FactMSCTasksID`          | int      |          |             |
| `EntityKey`               | int      |          |             |
| `DateKey`                 | int      |          |             |
| `ManualCall`              | int      | ✓        |             |
| `ManualCallCompleted`     | int      | ✓        |             |
| `ScheduledCall`           | int      | ✓        |             |
| `ScheduledCallCompleted`  | int      | ✓        |             |
| `CallsChanged`            | int      | ✓        |             |
| `ManualEmail`             | int      | ✓        |             |
| `ManualEmailCompleted`    | int      | ✓        |             |
| `ScheduledEmail`          | int      | ✓        |             |
| `ScheduledEmailCompleted` | int      | ✓        |             |
| `EmailsChanged`           | int      | ✓        |             |
| `ManualText`              | int      | ✓        |             |
| `ManualTextCompleted`     | int      | ✓        |             |
| `ScheduledText`           | int      | ✓        |             |
| `TextsChanged`            | int      | ✓        |             |
| `ScheduledTextCompleted`  | int      | ✓        |             |
| `ManualTask`              | int      | ✓        |             |
| `ManualTaskCompleted`     | int      | ✓        |             |
| `ScheduledTask`           | int      | ✓        |             |
| `ScheduledTaskCompleted`  | int      | ✓        |             |
| `TasksChanged`            | int      | ✓        |             |
| `Meta_LoadDate`           | datetime | ✓        |             |
| `ETLExecution_ID`         | int      | ✓        |             |
| `Meta_ComputerName`       | varchar  |          |             |
| `Meta_UserID`             | varchar  |          |             |
| `Meta_RowLastChangeDate`  | datetime | ✓        |             |

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

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
