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
extracted_at: 2026-05-09T12:34:14.349Z
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
                         dbo.PlaybookSurve
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
