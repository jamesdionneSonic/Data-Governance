---
name: vw_PlaybookSurveyStatus
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

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Definition

```sql

CREATE VIEW [dbo].[vw_PlaybookSurveyStatus]
AS
SELECT        A.PlaybookID, A.FiscalQuarter AS SurveyQuarter, A.EntityKey, ps.PlaybookSurveyID, COALESCE (ps.PlaybookStatusID, 0) AS PlaybookStatusID
FROM            (SELECT        PlaybookID, FiscalQuarter, EntityKey
                          FROM            (SELECT DISTINCT EE.PlaybookID, d.FiscalQuarter, EE.EntityKey
                                                    FROM            (SELECT        e1.EntityKey, p1.PlaybookID, p1.PlaybookN
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
