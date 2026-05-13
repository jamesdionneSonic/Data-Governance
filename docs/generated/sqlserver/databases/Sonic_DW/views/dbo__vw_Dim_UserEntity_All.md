---
name: vw_Dim_UserEntity_All
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
CREATE VIEW dbo.vw_Dim_UserEntity_All
AS
SELECT        dbo.Dim_UserEntity.UserEntityKey, dbo.Dim_UserEntity.EmployeeID, dbo.Dim_UserEntity.EntityKey, dbo.Dim_UserEntity.UE_isActive, dbo.Dim_UserEntity.UE_isDefault, dbo.Dim_UserEntity.UE_isGM,
                         dbo.Dim_UserEntity.UE_isController, dbo.Dim_UserEntity.UE_DOCPermission, dbo.Dim_UserEntity.UE_TitleTrackingPermission, dbo.Dim_UserEntity.Meta_RowCreatedDate, dbo.Dim_UserEntity.Meta_RowLastChangedDate,
                         dbo.Dim_UserEntity.Meta_LastChangeUserName, dbo.Dim_Entity.EntDealerLvl1, u.ADName
FROM            dbo.Dim_UserEntity LEFT OUTER JOIN
                         dbo.vw_Dim_ADUsers AS u ON dbo.Dim_UserEntity.EmployeeID = u.EmployeeID LEFT OUTER JOIN
                         dbo.Dim_Entity ON dbo.Dim_UserEntity.EntityKey = dbo.Dim_Entity.EntityKey

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
