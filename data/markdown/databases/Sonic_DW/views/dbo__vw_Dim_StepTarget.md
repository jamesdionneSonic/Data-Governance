---
name: vw_Dim_StepTarget
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - Dim_StepTarget
dependency_count: 1
column_count: 18
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_StepTarget** (U )

## Columns

| Name                      | Type     | Nullable | Description |
| ------------------------- | -------- | -------- | ----------- |
| `TargetKey`               | int      |          |             |
| `TargetName`              | varchar  | ✓        |             |
| `TargetType`              | varchar  | ✓        |             |
| `TargetLocation`          | varchar  | ✓        |             |
| `TargetStepNumber`        | int      | ✓        |             |
| `TargetStepName`          | varchar  | ✓        |             |
| `TargetSystem`            | varchar  | ✓        |             |
| `IsFinalDestinationFlag`  | char     | ✓        |             |
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
CREATE VIEW [dbo].[vw_Dim_StepTarget]
AS
SELECT     TargetKey, LOWER(TargetName) AS TargetName, TargetType, TargetLocation, TargetStepNumber, TargetStepName, TargetSystem, IsFinalDestinationFlag,
                      Meta_Src_Sys_ID, Meta_SourceSystemName, Meta_RowEffectiveDate, Meta_RowExpiredDate, Meta_RowIsCurrent, Meta_RowLastChangedDate, ETLExecution_ID,
                      User_ID, Meta_ComputerName, Meta_LoadDate
FROM         dbo.Dim_StepTarget

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
