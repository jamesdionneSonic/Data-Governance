---
name: vw_Dim_TurnoverReports
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - Dim_TurnoverReports
dependency_count: 1
column_count: 3
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_TurnoverReports** (U )

## Columns

| Name                | Type    | Nullable | Description |
| ------------------- | ------- | -------- | ----------- |
| `TurnoverReportKey` | int     |          |             |
| `ReportName`        | varchar | ✓        |             |
| `IsActive`          | int     | ✓        |             |

## Definition

```sql

CREATE VIEW [dbo].[vw_Dim_TurnoverReports]
AS
SELECT        TurnoverReportKey, ReportName, IsActive
FROM            dbo.Dim_TurnoverReports

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
