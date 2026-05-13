---
name: vw_Dim_Step
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - Dim_Step
dependency_count: 1
column_count: 14
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_Step** (U )

## Columns

| Name                      | Type     | Nullable | Description |
| ------------------------- | -------- | -------- | ----------- |
| `StepKey`                 | int      |          |             |
| `StepName`                | varchar  | ✓        |             |
| `StepNumber`              | int      | ✓        |             |
| `ProcessName`             | varchar  | ✓        |             |
| `Meta_Src_Sys_ID`         | int      | ✓        |             |
| `Meta_SourceSystemName`   | char     | ✓        |             |
| `Meta_RowEffectiveDate`   | datetime | ✓        |             |
| `Meta_RowExpiredDate`     | date     | ✓        |             |
| `Meta_RowIsCurrent`       | char     | ✓        |             |
| `Meta_RowLastChangedDate` | date     | ✓        |             |
| `ETLExecution_ID`         | int      | ✓        |             |
| `User_ID`                 | char     | ✓        |             |
| `Meta_ComputerName`       | char     | ✓        |             |
| `Meta_LoadDate`           | datetime | ✓        |             |

## Definition

```sql

CREATE VIEW [dbo].[vw_Dim_Step]
AS
SELECT     StepKey, StepName, StepNumber, ProcessName, Meta_Src_Sys_ID, Meta_SourceSystemName, Meta_RowEffectiveDate, Meta_RowExpiredDate, Meta_RowIsCurrent,
                      Meta_RowLastChangedDate, ETLExecution_ID, User_ID, Meta_ComputerName, Meta_LoadDate
FROM         dbo.Dim_Step


```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
