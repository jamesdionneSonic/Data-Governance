---
name: vw_Corp_Report_Permissions
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
column_count: 6
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

| Name                        | Type     | Nullable | Description |
| --------------------------- | -------- | -------- | ----------- |
| `Corp_Report_PermissionKey` | int      |          |             |
| `MicroStrategyLogin`        | nvarchar |          |             |
| `DepartmentKey`             | int      | ✓        |             |
| `DepartmentHeadFlag`        | bit      |          |             |
| `DepartmentName`            | varchar  | ✓        |             |
| `DepartmentDescription`     | varchar  | ✓        |             |

## Definition

```sql
CREATE VIEW dbo.vw_Corp_Report_Permissions
AS
SELECT        dbo.Corp_Report_Permissions.Corp_Report_PermissionKey, dbo.Corp_Report_Permissions.MicroStrategyLogin, dbo.Corp_Report_Permissions.DepartmentKey, dbo.Corp_Report_Permissions.DepartmentHeadFlag,
                         dbo.Dim_DepartmentRoll.DepartmentName, dbo.Dim_DepartmentRoll.DepartmentDescription
FROM            dbo.Corp_Report_Permissions INNER JOIN
                         dbo.Dim_DepartmentRoll ON dbo.Corp_Report_Permissions.DepartmentKey = dbo.Dim_DepartmentRoll.DepartmentKey

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
