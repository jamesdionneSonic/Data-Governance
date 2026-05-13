---
name: vw_BTChecklistRecord
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - BT_ChecklistRecord
dependency_count: 1
column_count: 7
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.BT_ChecklistRecord** (U )

## Columns

| Name             | Type     | Nullable | Description |
| ---------------- | -------- | -------- | ----------- |
| `ChecklistKey`   | int      |          |             |
| `EntityKey`      | int      |          |             |
| `Reviewer`       | varchar  | ✓        |             |
| `DateStarted`    | datetime | ✓        |             |
| `DateFinished`   | datetime | ✓        |             |
| `FiscalMonthKey` | nvarchar | ✓        |             |
| `StatusKey`      | int      |          |             |

## Definition

```sql

CREATE VIEW [dbo].[vw_BTChecklistRecord]
AS
SELECT        ChecklistKey, EntityKey, Reviewer, DateStarted, DateFinished, FORMAT(CONVERT(date, DateStarted), 'yyyyMM') AS FiscalMonthKey, (CASE WHEN DateFinished IS NULL THEN 1 ELSE 2 END) AS StatusKey
FROM            dbo.BT_ChecklistRecord

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
