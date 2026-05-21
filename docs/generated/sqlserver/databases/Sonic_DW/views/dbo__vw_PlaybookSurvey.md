---
name: vw_PlaybookSurvey
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

/***********************************************************************
* - Created by Jonathan Henin
* - Updated 07/16/2012
* - Used by MicroStrategy
*
*
************************************************************************/
CREATE VIEW [dbo].[vw_PlaybookSurvey]
AS
SELECT        dbo.PlaybookSurvey.PlaybookSurveyID, dbo.PlaybookName.PlaybookName, dbo.PlaybookSurvey.EntityKey, dbo.PlaybookSurvey.PlaybookID, dbo.PlaybookName.PlaybookYear,
                         dbo.PlaybookSurvey.SurveyComments, dbo.PlaybookSurvey.CommentUserID, dbo.PlaybookSurvey.SurveyApproval, dbo.PlaybookSurvey.PlaybookStatusID, dbo.PlaybookSurvey.ApprovalDate,
                         dbo.PlaybookSurvey.ReviewSignoffID, dbo.PlaybookSurvey.CreateDate, dbo.PlaybookSurvey.SurveyQuarter, dbo.PlaybookSurvey.ApprovalUserID
FROM            dbo.PlaybookSurvey INNER JOIN
                         dbo.PlaybookName ON dbo.PlaybookSurvey.PlaybookID = dbo.PlaybookName.PlaybookID
WHERE        (1 = 1)


```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
