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
depends_on:
  - Dim_Entity
  - Dim_UserEntity
  - vw_Dim_ADUsers
dependency_count: 3
column_count: 14
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_Entity** (U )
- **dbo.Dim_UserEntity** (U )
- **dbo.vw_Dim_ADUsers** (V )

## Columns

| Name                         | Type     | Nullable | Description |
| ---------------------------- | -------- | -------- | ----------- |
| `UserEntityKey`              | int      |          |             |
| `EmployeeID`                 | int      |          |             |
| `EntityKey`                  | int      |          |             |
| `UE_isActive`                | bit      |          |             |
| `UE_isDefault`               | bit      |          |             |
| `UE_isGM`                    | bit      |          |             |
| `UE_isController`            | bit      |          |             |
| `UE_DOCPermission`           | int      |          |             |
| `UE_TitleTrackingPermission` | int      |          |             |
| `Meta_RowCreatedDate`        | datetime |          |             |
| `Meta_RowLastChangedDate`    | datetime |          |             |
| `Meta_LastChangeUserName`    | varchar  | ✓        |             |
| `EntDealerLvl1`              | varchar  | ✓        |             |
| `ADName`                     | varchar  | ✓        |             |

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

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
