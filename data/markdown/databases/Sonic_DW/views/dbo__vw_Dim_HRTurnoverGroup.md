---
name: vw_Dim_HRTurnoverGroup
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - Dim_HRTurnoverGroups
dependency_count: 1
column_count: 8
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_HRTurnoverGroups** (U )

## Columns

| Name                | Type     | Nullable | Description |
| ------------------- | -------- | -------- | ----------- |
| `TurnoverGroupKey`  | int      |          |             |
| `TurnoverGroupID`   | int      | ✓        |             |
| `TurnoverGroupDesc` | nvarchar | ✓        |             |
| `JobCode`           | nvarchar | ✓        |             |
| `JobCodeDesc`       | nvarchar | ✓        |             |
| `ReportCategory`    | nvarchar | ✓        |             |
| `ReportLevel`       | nvarchar | ✓        |             |
| `JobSort`           | int      | ✓        |             |

## Definition

```sql

CREATE VIEW [dbo].[vw_Dim_HRTurnoverGroup]
AS
SELECT        TurnoverGroupKey, TurnoverGroupID, TurnoverGroupDesc, JobCode, JobCodeDesc, ReportCategory, ReportLevel, JobSort
FROM            dbo.Dim_HRTurnoverGroups

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
