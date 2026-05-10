---
name: vw_Dim_UserEntity_EP
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
CREATE VIEW dbo.vw_Dim_UserEntity_EP
AS
SELECT        dbo.Dim_UserEntity.UserEntityKey, dbo.Dim_UserEntity.EmployeeID, dbo.Dim_UserEntity.EntityKey, dbo.Dim_UserEntity.UE_isActive, dbo.Dim_UserEntity.UE_isDefault, dbo.Dim_UserEntity.UE_isGM, 
                         dbo.Dim_UserEntity.UE_isController, dbo.Dim_UserEntity.UE_DOCPermission, dbo.Dim_UserEntity.Meta_RowCreatedDate, dbo.Dim_UserEntity.Meta_RowLastChangedDate, dbo.Dim_UserEntity.Meta_LastChangeUserName, 
                         d
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
