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
depends_on:
  - BT_Requests
  - BT_RequestsRecord
  - Dim_Date
dependency_count: 3
column_count: 13
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.BT_Requests** (U )
- **dbo.BT_RequestsRecord** (U )
- **dbo.Dim_Date** (U )

## Columns

| Name                   | Type     | Nullable | Description |
| ---------------------- | -------- | -------- | ----------- |
| `BTIssuesKey`          | int      |          |             |
| `BTKey`                | int      |          |             |
| `OwnerName`            | nvarchar | ✓        |             |
| `IssueComment`         | varchar  | ✓        |             |
| `IssueCompleteDateKey` | int      | ✓        |             |
| `IssueTicketOpened`    | varchar  | ✓        |             |
| `IssueTicket`          | nvarchar | ✓        |             |
| `IssueCategoryID`      | int      | ✓        |             |
| `IssueResolution`      | varchar  | ✓        |             |
| `IssueCompleteDate`    | date     | ✓        |             |
| `IssueStatus`          | varchar  |          |             |
| `RequesterName`        | varchar  | ✓        |             |
| `SurveyStartTime`      | datetime |          |             |

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

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
