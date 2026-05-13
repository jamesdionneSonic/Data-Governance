---
name: vw_Doc_AccountGroupingPS
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - Doc_AccountGroupingPS
dependency_count: 1
column_count: 4
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Doc_AccountGroupingPS** (U )

## Columns

| Name               | Type    | Nullable | Description |
| ------------------ | ------- | -------- | ----------- |
| `AccountID`        | varchar | ✓        |             |
| `AccAccount`       | varchar |          |             |
| `DepartmentID`     | int     | ✓        |             |
| `GroupElementSort` | int     | ✓        |             |

## Definition

```sql
CREATE VIEW dbo.vw_Doc_AccountGroupingPS
AS
SELECT        AccAccount + '-' + CAST(COALESCE (DepartmentID, 0) AS Varchar(2)) AS AccountID, AccAccount, COALESCE (DepartmentID, 0) AS DepartmentID, GroupElementSort
FROM            dbo.Doc_AccountGroupingPS

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
