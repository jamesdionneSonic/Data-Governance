---
name: vw_Dim_Status
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - Dim_Status
dependency_count: 1
column_count: 15
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_Status** (U )

## Columns

| Name                      | Type     | Nullable | Description |
| ------------------------- | -------- | -------- | ----------- |
| `StatusKey`               | int      |          |             |
| `StatusCode`              | varchar  | ✓        |             |
| `StatusDescription`       | varchar  | ✓        |             |
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
| `Is_DataLoad_Err`         | int      |          |             |
| `Is_Val_Err`              | int      |          |             |

## Definition

```sql
CREATE VIEW [dbo].[vw_Dim_Status]
AS
SELECT     StatusKey, StatusCode, StatusDescription, Meta_Src_Sys_ID, Meta_SourceSystemName, Meta_RowEffectiveDate, Meta_RowExpiredDate, Meta_RowIsCurrent,
                      Meta_RowLastChangedDate, ETLExecution_ID, User_ID, Meta_ComputerName, Meta_LoadDate, Is_DataLoad_Err, Is_Val_Err
FROM         dbo.Dim_Status

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
