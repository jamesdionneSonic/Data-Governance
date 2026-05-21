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
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
---

## Overview

2- **Type**: View

- **Schema**: dbo

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

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
