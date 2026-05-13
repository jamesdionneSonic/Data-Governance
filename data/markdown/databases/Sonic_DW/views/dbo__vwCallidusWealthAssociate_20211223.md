---
name: vwCallidusWealthAssociate_20211223
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
  - DimAssociate
  - DimEntityRelationship
  - DimEntityRelationshipType
dependency_count: 4
column_count: 28
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_Entity** (U )
- **dbo.DimAssociate** (U )
- **dbo.DimEntityRelationship** (U )
- **dbo.DimEntityRelationshipType** (U )

## Columns

| Name                        | Type      | Nullable | Description |
| --------------------------- | --------- | -------- | ----------- |
| `EntBrand`                  | varchar   | ✓        |             |
| `EntStoreBrand`             | varchar   | ✓        |             |
| `EntDealerLvl1`             | varchar   | ✓        |             |
| `AsoSupervisorName`         | varchar   | ✓        |             |
| `AssociateName`             | varchar   |          |             |
| `AsoLocation`               | int       | ✓        |             |
| `AsoEmployeeNumber`         | int       |          |             |
| `AsoDMS4Digit`              | varchar   | ✓        |             |
| `AsoDepartmentCode`         | varchar   |          |             |
| `AsoDepartment`             | varchar   |          |             |
| `AsoDMSGLCode`              | varchar   |          |             |
| `AsoFirstName`              | varchar   |          |             |
| `AsoMiddleName`             | varchar   |          |             |
| `AsoLastName`               | varchar   |          |             |
| `AsoOriginalHireDateKey`    | int       |          |             |
| `AsoSeniorityDateKey`       | int       |          |             |
| `AsoTerminationDateKey`     | int       | ✓        |             |
| `AsoEmployeeStatus`         | varchar   | ✓        |             |
| `AsoEmplStatusStartDateKey` | int       |          |             |
| `AsoFullOrPartTime`         | varchar   | ✓        |             |
| `AsoDateInJobKey`           | int       |          |             |
| `AsoJobCode`                | varchar   | ✓        |             |
| `AsoecJobtitle`             | varchar   |          |             |
| `AsoSupervisorID`           | int       | ✓        |             |
| `AsoWorkEmailAddress`       | varchar   |          |             |
| `AsoTimeClockID`            | varchar   |          |             |
| `AsoSystemUpdatedDateTime`  | datetime2 |          |             |
| `AsoAssignNo`               | varchar   | ✓        |             |

## Definition

```sql





CREATE view [dbo].[vwCallidusWealthAssociate_20211223] as

SELECT distinct e.EntBrand
              ,e.EntStoreBrand
              ,e.EntDealerLvl1
              ,COALESCE(gm.GMName,oldsup.AsoSupervisorName, a.AsoSupervisorName) as AsoSupervisorName
              ,a.AsoLastName + ', ' +a.AsoFirstName + case when a.AsoMiddleName = 'UNKNOWN' THEN '' else ' ' + a.AsoMiddleName end AssociateName
              ,a.AsoLocation
              ,a.AsoEmployeeNumber
              ,convert(varchar(4),Case when a. asolineofbusiness = 'EchoPark' and a.asolocation between 800 and 899 then substring(convert(varchar(4),a.asolocation),1,3) + '0' else a.AsoDMS4Digit end) as AsoDMS4Digit
              ,a.AsoDepartmentCode
              ,a.AsoDepartment
              ,a.AsoDMSGLCode
              ,a.AsoFirstName
              ,case when a.AsoMiddleName = 'UNKNOWN' then '' else a.AsoMiddleName end as AsoMiddleName
              ,a.AsoLastName
              ,a.AsoOriginalHireDateKey
              ,a.AsoSeniorityDateKey
              ,case when [AsoChangeReason] = 'NOT ON FILE' and a.AsoTerminationDateKey = '99991231'
                           then convert(varchar(8),EOMONTH(a.Meta_LoadDate),112)
                           else a.AsoTerminationDateKey end as AsoTerminationDateKey
              ,case when a.AsoEmployeeStatus = 'On Leave of Absence' then 'Leave of Absence'
                           when a.AsoEmployeeStatus = 'Leave of Absence' then 'Leave of Absence'
                           else a.AsoEmployeeStatus end as AsoEmployeeStatus -- raj 04032020
              ,a.AsoEmplStatusStartDateKey
              ,a.AsoFullOrPartTime
              ,a.AsoDateInJobKey
              ,a.AsoJobCode
              ,a.AsoecJobtitle
              ,COALESCE(NewSupervisorID, oldsup.AsoSupervisorID, a.AsoSupervisorID) as AsoSupervisorID
              ,a.AsoWorkEmailAddress
              ,a.[AsoTimeClockID]
              ,a.AsoSystemUpdatedDateTime
              ,a.AsoAssignNo  as AsoAssignNo
FROM   [dbo].[DimAssociate] a
             LEFT JOIN sonic_dw.dbo.dim_entity e
                                                          ON convert(int,substring(convert(varchar(4),a.asolocation),1,3)) = e.entadpcompanyid--a.asolocation = e.entadpcompanyid
                                                          AND Case when a. asolineofbusiness = 'EchoPark' and a.asolocation between 800 and 899 then 0 else substring(convert(char(4),asodms4digit),4,1) end = entaccountingprefix
                  --   on cast(a.AsoDMS4Digit as varchar)= cast(e.EntADPCompanyID as varchar)+ cast (e.EntAccountingPrefix as varchar)
             LEFT join (
                       --This first query pulls back the primary GM location from Fusion and the Controller EmployeeNumber from the relationship table
                       --GM records for secondary locations are Unioned to the main query down below.
                    SELECT r.entitykey
                          ,entdealerlvl1
                          --,r.integerfield as ControllerID
                          ,convert(char(3),e.entadpcompanyid) + convert(char(1),e.EntAccountingPrefix) as asodms4digit--,   a.asodms4digit
                          --,e.EntADPCompanyID as asolocation
                                                                                        --,e.entitykey
                                                                                        --,a.associatekey
                                                                                        ,r.relationshipid
                                                                                        ,a.asolocation
                          ,ca.asofirstname as GMFirstName
                          ,ca.asolastname as GMLastName
                          ,ca.AsoLastName + ', ' + ca.AsoFirstName  as GMName
                          , a.asoemployeenumber GMEmployeeID
                          ,a.asojobfamily
                          ,a.asoecjobtitle
                          -- ,asosupervisorid
                          ,r.integerfield as NewSupervisorID
                     FROM   [Sonic_DW].[dbo].[DimAssociate] a
                          left JOIN sonic_dw.dbo.dim_entity e ON convert(int,substring(convert(varchar(4),a.asolocation),1,3)) = e.entadpcompanyid--a.asolocation = e.entadpcompanyid
                             AND Case when a. asolineofbusiness = 'EchoPark' and a.asolocation between 800 and 899 then 0 else substring(convert(char(4),asodms4digit),4,1) end = entaccountingprefix
                        LEFT JOIN DimEntityRelationship r
                                                                                                     ON r.entitykey = e.entitykey
                         LEFT JOIN DimEntityRelationshipType t
                                                                                                     ON r.relationshiptypeguid = t.RelationshipTypeGuid
                                                                                                                   AND t.relationshiptype = 'CallidusControllerID'
                          left join Sonic_dw.dbo.DimAssociate ca on ca.asoemployeenumber = r.integerfield

                     WHERE  a.asojobfamily = '01. General Managers' --asoecjobtitle = 'General Manager'
                                  AND a.meta_rowiscurrent = 'Y'
                                  AND a.asoemployeestatus = 'Active'
                                  AND e.entactive = 'Active'
                                  AND t.relationshiptype = 'CallidusControllerID'
                                  AND r.isactive = 1
                                 -- AND [EntDefaultDlrshpLvl1] = 1
                                  and e.currentprefixflag = 'Active'
                                                                                                                     and ca.meta_rowiscurrent = 'Y'
                                                                                                                     and ca.asoemployeestatus = 'Active'
                                                                                                     --              and a.asolocation in (245,161)
                                                          --            order by entdealerlvl1
    /*

                             select ca.AsoEmployeeNumber,r.integerfield, e.entdealerlvl1,e.entitykey, a.* from DimAssociate a
                                                                        left JOIN sonic_dw.dbo.dim_entity e ON convert(int,substring(convert(varchar(4),a.asolocation),1,3)) = e.entadpcompanyid--a.asolocation = e.entadpcompanyid
                           AND Case when a. asolineofbusiness = 'EchoPark' and a.asolocation between 800 and 899 then 0 else substring(convert(char(4),asodms4digit),4,1) end = entaccountingprefix
                                                                        JOIN DimEntityRelationship r ON r.entitykey = e.entitykey
                     JOIN DimEntityRelationshipType t ON r.relationshiptypeguid = t.RelationshipTypeGuid
                                                                                                                   AND t.relationshiptype = 'CallidusControllerID'
                                                                                                                   AND r.isactive = 1
                                                                        left join Sonic_dw.dbo.DimAssociate ca on ca.asoemployeenumber = r.integerfield
                                                                                        AND ca.meta_rowiscurrent = 'Y'
                                                                                        AND ca.asoemployeestatus = 'Active'

                                                                        where a.asojobfamily = '01. General Managers'
                                                                        and a.asolocation in (245,161)
                                                                        and a.meta_rowiscurrent = 'Y'
                                                                        and a.asoemployeestatus = 'Active'

              */
              ) as gm
              on a.AsoEmployeeNumber = gm.GMEmployeeID
              left join (
                     select dim.AssociateKey, sup.AsoEmployeeNumber, sup.AsoSupervisorID, sup.AsoSupervisorName
                     from   (
                                  select AssociateKey, AsoEmployeeNumber
                                  from   dbo.dimassociate
                                  where  meta_rowiscurrent = 'Y'
                                                and AsoEmployeeStatus in ('leave of absence', 'on leave of absence')
                                  ) dim
                                  inner join (
                                         select AsoEmployeeNumber, AsoSupervisorID, AsoSupervisorName
                                                       , ROW_NUMBER() over(partition by asoemployeenumber order by associatekey desc) seq
                                         from   dbo.DimAssociate
                                         where  Meta_RowIsCurrent = 'N'
                                                       and AsoEmployeeStatus = 'active'
                                  ) sup
                                         on dim.AsoEmployeeNumber = sup.AsoEmployeeNumber
                                         and sup.seq = 1
                     ) oldSup on a.AssociateKey = oldsup.AssociateKey
where  a.Meta_RowIsCurrent = 'Y'
              and (
                     a.AsoEmployeeStatus in ('active','leave of absence', 'on leave of absence') -- raj 04032020
                     or  (
                           a.AsoEmployeeStatus like  '%term%'
                           and
                           AsoTerminationDateKey >=   CONVERT(VARCHAR(8), dateadd(dd,-90,GETDATE()), 112))
                     )-- 90 days of terminations

UNION --below are the gm records for secondary locations not in Fusion


           SELECT e.EntBrand
              ,e.EntStoreBrand
              ,e.EntDealerLvl1
              ,ca2.AsoLastName + ', ' + ca2.AsoFirstName as SupervisorName
              ,ca.AsoLastName + ', ' +ca.AsoFirstName + case when ca.AsoMiddleName = 'UNKNOWN' THEN '' else ' ' + ca.AsoMiddleName end AssociateName
              ,e.EntADPCompanyID as asolocation--ca.AsoLocation
              ,ca.AsoEmployeeNumber
			  --,e.entadpcompanyid
			  --,e.entaccountingprefix
              ,convert(char(3),e.entadpcompanyid) + convert(char(1),e.EntAccountingPrefix) as asodms4digit--ca.AsoDMS4Digit
              ,ca.AsoDepartmentCode
              ,ca.AsoDepartment
              ,ca.AsoDMSGLCode
              ,ca.AsoFirstName
              ,case when ca.AsoMiddleName = 'UNKNOWN' then '' else ca.AsoMiddleName end as AsoMiddleName
              ,ca.AsoLastName
              ,ca.AsoOriginalHireDateKey
              ,ca.AsoSeniorityDateKey
              ,case when ca.[AsoChangeReason] = 'NOT ON FILE' and ca.AsoTerminationDateKey = '99991231'
                           then convert(varchar(8),EOMONTH(ca.Meta_LoadDate),112)
                           else ca.AsoTerminationDateKey end as AsoTerminationDateKey
              ,case when ca.AsoEmployeeStatus = 'On Leave of Absence' then 'Leave of Absence'
                           when ca.AsoEmployeeStatus = 'Leave of Absence' then 'Leave of Absence'
                           else ca.AsoEmployeeStatus end as AsoEmployeeStatus -- raj 04032020
              ,ca.AsoEmplStatusStartDateKey
              ,ca.AsoFullOrPartTime
              ,ca.AsoDateInJobKey
              ,ca.AsoJobCode
              ,ca.AsoecJobtitle
              ,r2.integerfield as AsoSupervisorID -- ,COALESCE(NewSupervisorID, oldsup.AsoSupervisorID, ca.AsoSupervisorID) as AsoSupervisorID
              ,ca.AsoWorkEmailAddress
              ,ca.[AsoTimeClockID]
              ,ca.AsoSystemUpdatedDateTime
              ,ca.AsoAssignNo  as AsoAssignNo
                    from DimEntityRelationship r
                                                            JOIN DimEntityRelationshipType t
                                                                        ON r.relationshiptypeguid = t.RelationshipTypeGuid  -- Relationship for secondary gm locations
                                                            join Sonic_dw.dbo.DimAssociate ca
                                                                        ON ca.asoemployeenumber = r.integerfield
                                                            join dim_entity e
                                                                        ON e.entitykey = r.entitykey
                                                            JOIN DimEntityRelationship r2  --controllers as supervisor
                                                                        ON r2.entitykey = e.entitykey
                                                            JOIN DimEntityRelationshipType t2
                                                                        ON r2.relationshiptypeguid = t2.RelationshipTypeGuid
                                                            join Sonic_dw.dbo.DimAssociate ca2
                                                                        ON ca2.asoemployeenumber = r2.integerfield

          WHERE ca.meta_rowiscurrent = 'Y'
                                                          and ca2.meta_rowiscurrent = 'Y'
                                                          AND t.relationshiptype = 'GMSecondaryAssignment'  -- Relationship for secondary gm locations
                                                          and t2.relationshiptype = 'CallidusControllerID'
                                                          and r2.IsActive = 1
                                                            and (
                                                            ca.AsoEmployeeStatus in ('active','leave of absence', 'on leave of absence') -- raj 04032020
                                                            or  (
                                                                  ca.AsoEmployeeStatus like  '%term%'
                                                                  and
                                                                  ca.AsoTerminationDateKey >=   CONVERT(VARCHAR(8), dateadd(dd,-90,GETDATE()), 112))
                                                            )-- 90 days of termin



```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
