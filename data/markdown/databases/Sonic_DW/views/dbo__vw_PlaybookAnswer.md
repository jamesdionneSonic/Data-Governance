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
depends_on:
  - Dim_Entity
  - PlaybookAnswer
  - PlaybookName
  - PlaybookQuestions
dependency_count: 4
column_count: 14
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

2- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_Entity** (U )
- **dbo.PlaybookAnswer** (U )
- **dbo.PlaybookName** (U )
- **dbo.PlaybookQuestions** (U )

## Columns

| Name               | Type     | Nullable | Description |
| ------------------ | -------- | -------- | ----------- |
| `AnswerId`         | int      |          |             |
| `PlaybookSurveyID` | int      |          |             |
| `QuestionID`       | int      |          |             |
| `PointsPossible`   | int      | ✓        |             |
| `ScoreCodeID`      | int      | ✓        |             |
| `QuestionScore`    | int      | ✓        |             |
| `EntDealerLvl1`    | varchar  | ✓        |             |
| `EntityKey`        | int      |          |             |
| `PlaybookYear`     | int      | ✓        |             |
| `AnswerComment`    | varchar  | ✓        |             |
| `PlaybookID`       | int      |          |             |
| `ScoreSubmitDate`  | datetime | ✓        |             |
| `ScoreUserId`      | varchar  | ✓        |             |
| `UpdateDate`       | datetime | ✓        |             |

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

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
