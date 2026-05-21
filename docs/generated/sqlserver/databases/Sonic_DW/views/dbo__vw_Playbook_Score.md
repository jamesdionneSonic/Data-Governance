---
name: vw_Playbook_Score
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

1- **Type**: View

- **Schema**: dbo

## Definition

```sql
CREATE VIEW dbo.vw_Playbook_Score
AS
SELECT     PBePlaybookYear AS pbYear, PlaybookNameSub, EntityKey, SCORE, Max_Score
FROM         dbo.vw_PlayBookSummary_Scores
UNION
SELECT     pbyear, Playbook AS playbooknamesub, EntityKey, TotalPoints AS Score, TotalPossible AS Max_Score
FROM         dbo.vw_PlayBookSummary_All_Diffwtd

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
