---
name: vw_PlaybookAnswer
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

2- **Type**: View
- **Schema**: dbo

## Definition

```sql

CREATE VIEW [dbo].[vw_PlaybookAnswer]
AS
SELECT        dbo.PlaybookAnswer.AnswerId, dbo.PlaybookAnswer.PlaybookSurveyID, dbo.PlaybookAnswer.QuestionID, dbo.PlaybookQuestions.PointsPossible, dbo.PlaybookAnswer.ScoreCodeID, 
                         dbo.PlaybookAnswer.QuestionScore, dbo.Dim_Entity.EntDealerLvl1, dbo.PlaybookAnswer.EntityKey, dbo.PlaybookName.PlaybookYear, dbo.PlaybookAnswer.AnswerComment, dbo.PlaybookAnswer.PlaybookID, 
                         dbo.PlaybookAnswer.ScoreSubmit
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
