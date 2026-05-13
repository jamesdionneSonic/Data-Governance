---
name: vw_PlaybookDealership_Surveys
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - PlaybookAnswer
  - PlaybookQuestions
  - vw_Dim_Entity
  - vw_PlaybookSurvey
dependency_count: 4
column_count: 8
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

2- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.PlaybookAnswer** (U )
- **dbo.PlaybookQuestions** (U )
- **dbo.vw_Dim_Entity** (V )
- **dbo.vw_PlaybookSurvey** (V )

## Columns

| Name               | Type     | Nullable | Description |
| ------------------ | -------- | -------- | ----------- |
| `EntDealerLvl1`    | varchar  | ✓        |             |
| `PlaybookSurveyID` | int      |          |             |
| `PlaybookName`     | varchar  | ✓        |             |
| `QuestionID`       | int      |          |             |
| `Question`         | varchar  | ✓        |             |
| `AnswerId`         | int      |          |             |
| `UpdateDate`       | datetime | ✓        |             |
| `PlaybookYear`     | int      | ✓        |             |

## Definition

```sql

/***********************************************************************
* - Created by Jonathan Henin
* - Updated 07/16/2012
* - Used by MicroStrategy
*
*
************************************************************************/
CREATE VIEW [dbo].[vw_PlaybookDealership_Surveys]
AS
SELECT DISTINCT a14.EntDealerLvl1, a11.PlaybookSurveyID, a15.PlaybookName, a11.QuestionID, a16.Question, a11.AnswerId, a11.UpdateDate, a15.PlaybookYear
FROM            dbo.vw_PlaybookSurvey AS a15 INNER JOIN
                         dbo.PlaybookAnswer AS a11 ON a15.PlaybookSurveyID = a11.PlaybookSurveyID INNER JOIN
                         dbo.PlaybookQuestions AS a16 ON a11.QuestionID = a16.QuestionID INNER JOIN
                         dbo.vw_Dim_Entity AS a14 ON a11.EntityKey = a14.EntityKey


```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
