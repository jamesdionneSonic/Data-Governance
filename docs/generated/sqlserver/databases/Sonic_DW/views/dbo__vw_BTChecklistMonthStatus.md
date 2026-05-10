---
name: vw_BTChecklistMonthStatus
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

1- **Type**: View
- **Schema**: dbo

## Definition

```sql
CREATE VIEW dbo.vw_BTChecklistMonthStatus
AS
SELECT        CAST(em.FiscalMonthKey AS char(6)) + '.' + CAST(em.EntityKey AS varchar(4)) AS ChecklistMonthStatusKey, em.FiscalMonthKey, em.EntityKey, dbo.vw_BTChecklistRecord.ChecklistKey, dbo.vw_BTChecklistRecord.Reviewer, 
                         dbo.vw_BTChecklistRecord.DateStarted, dbo.vw_BTChecklistRecord.DateFinished, COALESCE (dbo.vw_BTChecklistRecord.StatusKey, 0) AS StatusKey, 1 AS ChecklistCounter
FROM            (SELECT        m.Fisca
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
