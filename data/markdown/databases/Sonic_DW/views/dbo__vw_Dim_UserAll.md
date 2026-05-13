---
name: vw_Dim_UserAll
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - Dim_ADUsers
  - Dim_Entity
  - DimAssociate
  - vw_Dim_Associate
  - vw_Dim_UserEntity
dependency_count: 5
column_count: 13
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_ADUsers** (U )
- **dbo.Dim_Entity** (U )
- **dbo.DimAssociate** (U )
- **dbo.vw_Dim_Associate** (V )
- **dbo.vw_Dim_UserEntity** (V )

## Columns

| Name                 | Type     | Nullable | Description |
| -------------------- | -------- | -------- | ----------- |
| `EmployeeID`         | varchar  | ✓        |             |
| `ADName`             | varchar  | ✓        |             |
| `ADEmail`            | varchar  | ✓        |             |
| `EntityKey`          | int      | ✓        |             |
| `AsoFirstName`       | varchar  |          |             |
| `AsoLastName`        | varchar  |          |             |
| `AsoecJobtitle`      | varchar  |          |             |
| `AsoJobCode`         | varchar  | ✓        |             |
| `MSTRMetadataUserID` | char     | ✓        |             |
| `EntDealerLvl1`      | varchar  | ✓        |             |
| `AssociateKey`       | int      | ✓        |             |
| `LastChangeDate`     | datetime | ✓        |             |
| `AsoJobFamily`       | varchar  |          |             |

## Definition

```sql
CREATE VIEW dbo.vw_Dim_UserAll
AS
SELECT        u.EmployeeID, u.ADName, u.ADEmail, u.EntityKey, u.AsoFirstName, u.AsoLastName, u.AsoecJobtitle, u.AsoJobCode, u.MSTRMetadataUserID, dbo.Dim_Entity.EntDealerLvl1, u.AssociateKey, u.LastChangeDate,
                         u.AsoJobFamily
FROM            (SELECT        a0.EmployeeID, a0.ADName, a0.ADEmail, COALESCE (a3.EntityKey, a1.EntityKey, - 1) AS EntityKey, a1.AsoFirstName, a1.AsoLastName, a1.AsoecJobtitle, a1.AsoJobCode, a2_1.MSTRMetadataUserID,
                                                    a1.AssociateKey, a1.LastChangeDate, a1.AsoJobFamily
                          FROM            (SELECT        a1_1.AsoEmployeeNumber, a1_2.EntityKey, a1_2.AsoFirstName, a1_2.AsoLastName, a1_2.AsoecJobtitle, a1_2.AsoJobCode, a1_2.AsoJobFamily, a1_1.AssociateKey, a1_1.LastChangeDate
                                                    FROM            (SELECT        AsoEmployeeNumber, MAX(AssociateKey) AS AssociateKey, MAX(Meta_RowLastChangedDate) AS LastChangeDate
                                                                              FROM            dbo.DimAssociate
                                                                              WHERE        (Meta_RowIsCurrent = 'Y') AND (AsoEmployeeStatus = 'Active')
                                                                              GROUP BY AsoEmployeeNumber) AS a1_1 INNER JOIN
                                                                              dbo.vw_Dim_Associate AS a1_2 ON a1_1.AssociateKey = a1_2.AssociateKey LEFT OUTER JOIN
                                                                              dbo.Dim_Entity AS a1_3 ON a1_2.EntityKey = a1_3.EntityKey) AS a1 INNER JOIN
                                                    dbo.Dim_ADUsers AS a0 LEFT OUTER JOIN
                                                        (SELECT        EmployeeID, EntityKey
                                                          FROM            dbo.vw_Dim_UserEntity
                                                          WHERE        (UE_isDefault = 1)) AS a3 ON TRY_CAST(CASE WHEN IsNumeric(a0.EmployeeID)  = 1 THEN a0.EmployeeID ELSE NULL END AS bigint) = a3.EmployeeID LEFT OUTER JOIN
                                                        (SELECT        ABBREVIATION AS LOGIN, MSTRMetadataUserID
                                                          FROM            MSMetaData.dbo.vw_DSSMDOBJINFO AS a
                                                          WHERE        (OBJECT_TYPE = 34) AND (SUBTYPE = 8704)) AS a2_1 ON a0.ADName = a2_1.LOGIN ON a1.AsoEmployeeNumber = TRY_CAST(CASE WHEN IsNumeric(a0.EmployeeID)  = 1 THEN a0.EmployeeID ELSE NULL END AS bigint)) AS u INNER JOIN
                         dbo.Dim_Entity ON u.EntityKey = dbo.Dim_Entity.EntityKey

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
