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
depends_on:
  - PlaybookName
  - PlaybookSurvey
dependency_count: 2
column_count: 14
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.PlaybookName** (U )
- **dbo.PlaybookSurvey** (U )

## Columns

| Name               | Type     | Nullable | Description |
| ------------------ | -------- | -------- | ----------- |
| `PlaybookSurveyID` | int      |          |             |
| `PlaybookName`     | varchar  | ✓        |             |
| `EntityKey`        | int      |          |             |
| `PlaybookID`       | int      |          |             |
| `PlaybookYear`     | int      | ✓        |             |
| `SurveyComments`   | varchar  | ✓        |             |
| `CommentUserID`    | varchar  | ✓        |             |
| `SurveyApproval`   | tinyint  | ✓        |             |
| `PlaybookStatusID` | int      |          |             |
| `ApprovalDate`     | datetime | ✓        |             |
| `ReviewSignoffID`  | varchar  | ✓        |             |
| `CreateDate`       | datetime | ✓        |             |
| `SurveyQuarter`    | tinyint  | ✓        |             |
| `ApprovalUserID`   | varchar  | ✓        |             |

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

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
