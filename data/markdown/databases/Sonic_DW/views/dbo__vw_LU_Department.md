---
name: vw_LU_Department
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - Dim_Account
dependency_count: 1
column_count: 2
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_Account** (U )

## Columns

| Name                | Type    | Nullable | Description |
| ------------------- | ------- | -------- | ----------- |
| `AccDepartment`     | varchar | ✓        |             |
| `AccDepartmentName` | varchar | ✓        |             |

## Definition

```sql
CREATE VIEW dbo.vw_LU_Department
AS
SELECT DISTINCT AccDepartment, AccDepartmentName
FROM         dbo.Dim_Account

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
