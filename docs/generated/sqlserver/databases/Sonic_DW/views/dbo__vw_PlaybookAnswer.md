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
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
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
                         dbo.PlaybookAnswer.ScoreSubmitDate, dbo.PlaybookAnswer.ScoreUserId, dbo.PlaybookAnswer.UpdateDate
FROM            dbo.PlaybookName INNER JOIN
                         dbo.PlaybookAnswer INNER JOIN
                         dbo.Dim_Entity ON dbo.PlaybookAnswer.EntityKey = dbo.Dim_Entity.EntityKey ON dbo.PlaybookName.PlaybookID = dbo.PlaybookAnswer.PlaybookID LEFT OUTER JOIN
                         dbo.PlaybookQuestions ON dbo.PlaybookAnswer.QuestionID = dbo.PlaybookQuestions.QuestionID
WHERE        (1 = 1)


```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
