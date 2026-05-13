---
name: vw_Dim_DepartmentHead
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - Corp_Report_Permissions
  - Dim_DepartmentRoll
dependency_count: 2
column_count: 4
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Corp_Report_Permissions** (U )
- **dbo.Dim_DepartmentRoll** (U )

## Columns

| Name                    | Type     | Nullable | Description |
| ----------------------- | -------- | -------- | ----------- |
| `DepartmentKey`         | int      |          |             |
| `DepartmentName`        | varchar  | ✓        |             |
| `DepartmentDescription` | varchar  | ✓        |             |
| `MicroStrategyLogin`    | nvarchar | ✓        |             |

## Definition

```sql

CREATE VIEW [dbo].[vw_Dim_DepartmentHead]
AS
SELECT        a1.DepartmentKey, a1.DepartmentName, a1.DepartmentDescription, b1.MicroStrategyLogin
FROM            dbo.Dim_DepartmentRoll AS a1 LEFT OUTER JOIN
                             (SELECT DISTINCT MicroStrategyLogin, DepartmentKey
                               FROM            dbo.Corp_Report_Permissions
                               WHERE        (DepartmentHeadFlag = 1)) AS b1 ON a1.DepartmentKey = b1.DepartmentKey


```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
