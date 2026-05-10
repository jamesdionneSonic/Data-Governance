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
extracted_at: 2026-05-09T12:34:14.349Z
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
                         dbo.Dim_DepartmentRoll ON dbo.Corp_Report_Permissio
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
