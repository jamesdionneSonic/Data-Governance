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
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

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

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
