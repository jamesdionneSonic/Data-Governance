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
depends_on:
  - vw_PlayBookSummary_All_Diffwtd
  - vw_PlayBookSummary_Scores
dependency_count: 2
column_count: 5
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.vw_PlayBookSummary_All_Diffwtd** (V )
- **dbo.vw_PlayBookSummary_Scores** (V )

## Columns

| Name              | Type     | Nullable | Description |
| ----------------- | -------- | -------- | ----------- |
| `pbYear`          | int      | ✓        |             |
| `PlaybookNameSub` | nvarchar | ✓        |             |
| `EntityKey`       | int      | ✓        |             |
| `SCORE`           | float    | ✓        |             |
| `Max_Score`       | float    | ✓        |             |

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

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
