---
name: vw_Dim_UserEntity
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
CREATE VIEW dbo.vw_Dim_UserEntity
AS
SELECT        ue.UserEntityKey, CAST(ue.EmployeeID AS bigint) AS EmployeeID, ue.EntityKey, ue.UE_isActive, ue.UE_isDefault, ue.UE_isGM, ue.UE_isController, ue.UE_DOCPermission, ue.Meta_RowCreatedDate,
                         ue.Meta_RowLastChangedDate, ue.Meta_LastChangeUserName, dbo.Dim_Entity.EntLineOfBusiness
FROM            dbo.Dim_UserEntity AS ue LEFT OUTER JOIN
                         dbo.Dim_Entity ON ue.EntityKey = dbo.Dim_Entity.EntityKey
WHERE        (dbo.Dim_Entity.EntLineOfBusiness = 'Sonic')

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
