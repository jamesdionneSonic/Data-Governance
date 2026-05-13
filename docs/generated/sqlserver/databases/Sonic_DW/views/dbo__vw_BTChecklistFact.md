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

CREATE VIEW [dbo].[vw_BTChecklistFact]
AS
SELECT        ChecklistFactKey, ChecklistKey, ChecklistQuestionID, ChecklistAnswer, ChecklistComment, DateLastModified, ModifierName, ChecklistAnswerID
FROM            dbo.BT_ChecklistFact

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
