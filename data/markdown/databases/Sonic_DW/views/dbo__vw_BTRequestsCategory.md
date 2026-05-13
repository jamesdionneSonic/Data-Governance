---
name: vw_BTRequestsCategory
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - BT_RequestsCategory
dependency_count: 1
column_count: 2
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.BT_RequestsCategory** (U )

## Columns

| Name                | Type    | Nullable | Description |
| ------------------- | ------- | -------- | ----------- |
| `IssueCategoryID`   | int     |          |             |
| `IssueCategoryDesc` | varchar | ✓        |             |

## Definition

```sql

CREATE VIEW [dbo].[vw_BTRequestsCategory]
AS
SELECT        IssueCategoryID, IssueCategoryDesc
FROM            dbo.BT_RequestsCategory


```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
