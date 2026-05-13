---
name: vw_MSDynamicDistributionList
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
  - Doc_TXN_Login
  - fn_UniqueidentifierToCharMSTR
  - MicroStrategyContactGrouping
dependency_count: 4
column_count: 9
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

2- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_Entity** (U )
- **dbo.Doc_TXN_Login** (U )
- **dbo.fn_UniqueidentifierToCharMSTR** (FN)
- **dbo.MicroStrategyContactGrouping** (U )

## Columns

| Name                                | Type     | Nullable | Description |
| ----------------------------------- | -------- | -------- | ----------- |
| `MicroStrategyLogin`                | nvarchar |          |             |
| `EmailAddress`                      | nvarchar | ✓        |             |
| `EntityKey`                         | int      | ✓        |             |
| `MSTRMetadataDeviceGUID`            | varchar  | ✓        |             |
| `Personalization`                   | varchar  | ✓        |             |
| `MSTRMetaDataUserID`                | char     |          |             |
| `GroupingID`                        | int      |          |             |
| `MSDynamicDistributionListRowCount` | int      | ✓        |             |
| `EntDealerLvl1`                     | varchar  | ✓        |             |

## Definition

```sql
CREATE VIEW dbo.vw_MSDynamicDistributionList
AS
SELECT DISTINCT
                         A.LOGIN AS MicroStrategyLogin, B.ADDRESS AS EmailAddress, D.EntityKey, REPLACE(REPLACE(F.MSTRMetadataDeviceGUID, CHAR(10), ''), CHAR(13), '') AS MSTRMetadataDeviceGUID, REPLACE(F.Personalization, '#0',
                         E.EntDealerLvl1) AS Personalization, A.MSTRUSER_ID AS MSTRMetaDataUserID, F.GroupingID, SUM(1) AS MSDynamicDistributionListRowCount, E.EntDealerLvl1
FROM            (SELECT        CONTACT_ID, ADDRESS_ID, DISP_NAME, ADDRESS, DELIVERY_TYPE, IS_DEFAULT, DEVICE_ID, VERSION_ID, CREATION_TIME, MODIFICATION_TIME
                          FROM            USTRAT.MSMetaData.dbo.DSSCSADDRESS AS DSSCSADDRESS_1
                          WHERE        (DELIVERY_TYPE = 1) AND (IS_DEFAULT = - 1)) AS B RIGHT OUTER JOIN
                             (SELECT        a1.CONTACT_ID, b1.LOGIN, a1.MSTRUSER_ID
                               FROM            USTRAT.MSMetaData.dbo.DSSCSCONTACT AS a1 INNER JOIN
                                                             (SELECT        PROJECT_ID, OBJECT_ID, LOGIN, PASSWD, NTSID, DBLOGIN, ISGROUP, LDAP_DN, U_ID, LDAP_DN_HASHED, U_ID_HASHED
                                                               FROM            USTRAT.MSMetaData.dbo.DSSMDUSRACCT AS DSSMDUSRACCT_1
                                                               WHERE        (LOGIN NOT IN
                                                                                             (SELECT        EM_USER_ABBREV
                                                                                               FROM            USTRAT.MSTRStatistics.dbo.EM_USER AS EM_USER_1
                                                                                               WHERE        (EM_ENABLED = 0)
                                                                                               GROUP BY EM_USER_ABBREV))) AS b1 ON dbo.fn_UniqueidentifierToCharMSTR(b1.OBJECT_ID) = a1.MSTRUSER_ID) AS A ON A.CONTACT_ID = B.CONTACT_ID INNER JOIN
                             (SELECT        a2.PROJECT_ID, a2.OBJECT_ID, a2.OBJECT_TYPE, a2.SUBTYPE, a2.OBJECT_NAME, a2.ABBREVIATION, a2.DESCRIPTION, a2.VERSION_ID, a2.PARENT_ID, a2.OWNER_ID, a2.HIDDEN, a2.CREATE_TIME,
                                                         a2.MOD_TIME, a2.OBJECT_UNAME, a2.OBJECT_STATE, a2.LOCALE, a2.EXTENDED_TYPE, a2.VIEW_MEDIA, a2.ICON_PATH, b2.OBJECT_NAME AS GroupName, c2.GroupingID
                               FROM            USTRAT.MSMetaData.dbo.DSSMDOBJDEPN AS d INNER JOIN
                                                         USTRAT.MSMetaData.dbo.DSSMDOBJINFO AS a2 ON d.OBJECT_ID = a2.OBJECT_ID INNER JOIN
                                                         USTRAT.MSMetaData.dbo.DSSMDOBJINFO AS b2 ON d.DEPN_OBJID = b2.OBJECT_ID INNER JOIN
                                                         dbo.MicroStrategyContactGrouping AS c2 ON ';' + c2.MicroStrategyGroup + ';' LIKE '%;' + CAST(b2.OBJECT_NAME AS varchar(60)) + ';%'
                               WHERE        (a2.OBJECT_TYPE = 34) AND (a2.SUBTYPE = 8704) AND (b2.OBJECT_TYPE = 34) AND (b2.SUBTYPE = 8705)) AS C ON C.ABBREVIATION = A.LOGIN INNER JOIN
                         dbo.Doc_TXN_Login AS D ON A.LOGIN = D.MicroStrategyLogin INNER JOIN
                         dbo.Dim_Entity AS E ON D.EntityKey = E.EntityKey INNER JOIN
                             (SELECT        GroupingID, GroupingDESC, MSTRMetadataDeviceGUID, Personalization, MicroStrategyGroup
                               FROM            dbo.MicroStrategyContactGrouping) AS F ON C.GroupingID = F.GroupingID
GROUP BY A.LOGIN, B.ADDRESS, D.EntityKey, REPLACE(REPLACE(F.MSTRMetadataDeviceGUID, CHAR(10), ''), CHAR(13), ''), E.EntDealerLvl1, REPLACE(F.Personalization, '#0', E.EntDealerLvl1), A.MSTRUSER_ID, F.GroupingID
HAVING        (D.EntityKey <> - 1) AND (LEN(B.ADDRESS) > 1)

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
