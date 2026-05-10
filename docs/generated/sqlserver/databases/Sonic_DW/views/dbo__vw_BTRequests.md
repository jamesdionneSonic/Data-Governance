---
name: vw_BTRequests
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
CREATE VIEW dbo.vw_BTRequests
AS
SELECT        r.BTIssuesKey, r.BTKey, r.OwnerName, r.IssueComment, r.IssueCompleteDateKey, r.IssueTicketOpened, r.IssueTicket, r.IssueCategoryID, r.IssueResolution, dbo.Dim_Date.FullDate AS IssueCompleteDate, 
                         (CASE WHEN IssueCompleteDateKey IS NULL THEN 'Active' ELSE 'Closed' END) AS IssueStatus, r.RequesterName, dbo.BT_RequestsRecord.SurveyStartTime
FROM            dbo.BT_Requests AS r INNER JOIN
                         dbo.BT_Req
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
