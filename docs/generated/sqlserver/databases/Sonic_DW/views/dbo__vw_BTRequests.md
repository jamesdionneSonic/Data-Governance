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
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
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
                         dbo.BT_RequestsRecord ON r.BTKey = dbo.BT_RequestsRecord.BTKey LEFT OUTER JOIN
                         dbo.Dim_Date ON r.IssueCompleteDateKey = dbo.Dim_Date.DateKey

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
