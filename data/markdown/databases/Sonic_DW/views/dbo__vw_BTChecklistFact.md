---
name: vw_BTChecklistFact
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - BT_ChecklistFact
dependency_count: 1
column_count: 8
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.BT_ChecklistFact** (U )

## Columns

| Name                  | Type     | Nullable | Description |
| --------------------- | -------- | -------- | ----------- |
| `ChecklistFactKey`    | int      |          |             |
| `ChecklistKey`        | int      |          |             |
| `ChecklistQuestionID` | int      |          |             |
| `ChecklistAnswer`     | varchar  | ✓        |             |
| `ChecklistComment`    | varchar  | ✓        |             |
| `DateLastModified`    | datetime | ✓        |             |
| `ModifierName`        | varchar  | ✓        |             |
| `ChecklistAnswerID`   | int      | ✓        |             |

## Definition

```sql

CREATE VIEW [dbo].[vw_BTChecklistFact]
AS
SELECT        ChecklistFactKey, ChecklistKey, ChecklistQuestionID, ChecklistAnswer, ChecklistComment, DateLastModified, ModifierName, ChecklistAnswerID
FROM            dbo.BT_ChecklistFact

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
