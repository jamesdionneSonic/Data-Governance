---
name: vw_Dim_UserLocations
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

CREATE VIEW [dbo].[vw_Dim_UserLocations]
AS
SELECT        CONVERT(varchar(12), u.EmployeeID) + '.' + CONVERT(varchar(3), u.EntityKey) AS UserLocationKey, u.EmployeeID, u.ADName, u.ADEmail, u.EntityKey, u.AsoFirstName, u.AsoLastName, u.AsoecJobtitle, u.AsoJobCode,
                         u.MSTRMetadataUserID, e.EntDealerLvl1, u.AssociateKey, COALESCE (u.UE_isDefault, 1) AS UE_isDefault, u.UE_DOCPermission, u.UE_TitleTrackingPermission, u.UE_isController, u.UE_isGM, e.EntLineOfBusiness
FROM            (SELECT        a0.EmployeeID, a0.ADName, a0.ADEmail, COALESCE (a3.EntityKey, a1.EntityKey, - 1) AS EntityKey, a1.AsoFirstName, a1.AsoLastName, a1.AsoecJobtitle, a1.AsoJobCode, a2_1.MSTRMetadataUserID,
                                                    a1.AssociateKey, a3.UE_isDefault, a3.UE_isController, a3.UE_isGM, a3.UE_DOCPermission, a3.UE_TitleTrackingPermission
                          FROM            (SELECT        a1_1.AsoEmployeeNumber, a1_2.EntityKey, a1_2.AsoFirstName, a1_2.AsoLastName, a1_2.AsoecJobtitle, a1_2.AsoJobCode, a1_1.AssociateKey
                                                    FROM          ( Select u1.AsoEmployeeNumber, u1.AssociateKey from (SELECT        AsoEmployeeNumber, MAX(AssociateKey) AS AssociateKey
                                                                              FROM            dbo.DimAssociate
                                                                              WHERE        (Meta_RowIsCurrent = 'Y') AND (AsoEmployeeStatus = 'Active') OR
                                                                                                        (AsoEmployeeNumber > 9990000)
                                                                              GROUP BY AsoEmployeeNumber
																			   union
                                                                            Select 	AsoEmployeenumber, Associatekey from [dbo].[Dim_VendorAssociates])u1
																			  ) AS a1_1 left outer JOIN
                                                                              dbo.vw_Dim_Associate AS a1_2 ON a1_1.AssociateKey = a1_2.AssociateKey LEFT OUTER JOIN
                                                                              dbo.Dim_Entity AS a1_3 ON a1_2.EntityKey = a1_3.EntityKey) AS a1 INNER JOIN
                                                    dbo.vw_Dim_ADUsers AS a0 LEFT OUTER JOIN
                                                        (SELECT        EmployeeID, EntityKey, UE_isDefault, UE_isController, UE_isGM, UE_DOCPermission, UE_TitleTrackingPermission
                                                          FROM            dbo.Dim_UserEntity
                                                          WHERE        (UE_isActive = 1)) AS a3 ON a0.EmployeeID = a3.EmployeeID LEFT OUTER JOIN
                                                        (SELECT        ABBREVIATION AS LOGIN, MSTRMetadataUserID
                                                          FROM            MSMetaData.dbo.vw_DSSMDOBJINFO AS a
                                                          WHERE        (OBJECT_TYPE = 34) AND (SUBTYPE = 8704)) AS a2_1 ON a0.ADName = a2_1.LOGIN ON a1.AsoEmployeeNumber = a0.EmployeeID) AS u INNER JOIN
                         dbo.Dim_Entity AS e ON u.EntityKey = e.EntityKey

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
