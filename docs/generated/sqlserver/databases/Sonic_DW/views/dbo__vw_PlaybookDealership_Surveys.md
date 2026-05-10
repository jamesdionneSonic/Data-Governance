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
extracted_at: 2026-05-09T12:34:14.349Z
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
FROM            dbo.vw_PlaybookSurvey AS a15 INNER JO
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
