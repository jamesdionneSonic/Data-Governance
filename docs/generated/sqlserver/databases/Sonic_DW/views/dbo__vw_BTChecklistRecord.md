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

CREATE VIEW [dbo].[vw_BTChecklistRecord]
AS
SELECT        ChecklistKey, EntityKey, Reviewer, DateStarted, DateFinished, FORMAT(CONVERT(date, DateStarted), 'yyyyMM') AS FiscalMonthKey, (CASE WHEN DateFinished IS NULL THEN 1 ELSE 2 END) AS StatusKey
FROM            dbo.BT_ChecklistRecord

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
