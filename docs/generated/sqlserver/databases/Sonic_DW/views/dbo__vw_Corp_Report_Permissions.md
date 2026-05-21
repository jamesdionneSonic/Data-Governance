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
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

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

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
