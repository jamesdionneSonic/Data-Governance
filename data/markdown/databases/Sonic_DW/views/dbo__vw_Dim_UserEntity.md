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
depends_on:
  - Dim_Entity
  - Dim_UserEntity
dependency_count: 2
column_count: 12
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_Entity** (U )
- **dbo.Dim_UserEntity** (U )

## Columns

| Name                      | Type     | Nullable | Description |
| ------------------------- | -------- | -------- | ----------- |
| `UserEntityKey`           | int      |          |             |
| `EmployeeID`              | bigint   | ✓        |             |
| `EntityKey`               | int      |          |             |
| `UE_isActive`             | bit      |          |             |
| `UE_isDefault`            | bit      |          |             |
| `UE_isGM`                 | bit      |          |             |
| `UE_isController`         | bit      |          |             |
| `UE_DOCPermission`        | int      |          |             |
| `Meta_RowCreatedDate`     | datetime |          |             |
| `Meta_RowLastChangedDate` | datetime |          |             |
| `Meta_LastChangeUserName` | varchar  | ✓        |             |
| `EntLineOfBusiness`       | varchar  | ✓        |             |

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

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
