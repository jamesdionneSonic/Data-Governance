---
name: vwCallidusWealthAssociate_bk
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
| `AsoLocation`               | int       |          |             |
| `AsoEmployeeNumber`         | int       |          |             |
| `AsoDMS4Digit`              | int       |          |             |
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



create view [dbo].[vwCallidusWealthAssociate_bk] as

SELECT	distinct e.EntBrand
		,e.EntStoreBrand
		,e.EntDealerLvl1
		,COALESCE(gm.GMName,oldsup.AsoSupervisorName, a.AsoSupervisorName) as AsoSupervisorName
		,a.AsoLastName + ', ' +a.AsoFirstName + case when a.AsoMiddleName = 'UNKNOWN' THEN '' else ' ' + a.AsoMiddleName end AssociateName
		,a.AsoLocation
		,a.AsoEmployeeNumber
		,a.AsoDMS4Digit
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
FROM	[dbo].[DimAssociate] a
		left join dbo.Dim_Entity e
			on cast(a.AsoDMS4Digit as varchar)= cast(e.EntADPCompanyID as varchar)+ cast (e.EntAccountingPrefix as varchar)
		left join (
			SELECT	distinct r.entitykey
					,entdealerlvl1
					--,r.integerfield as ControllerID
					,a.asodms4digit
					,a.asolocation
					,ca.asofirstname as GMFirstName
					,ca.asolastname as GMLastName
					,ca.AsoLastName + ', ' + ca.AsoFirstName  as GMName
					, a.asoemployeenumber GMEmployeeID
					,a.asojobfamily
					,a.asoecjobtitle
					-- ,asosupervisorid
					,r.integerfield as NewSupervisorID
			FROM	[Sonic_DW].[dbo].[DimAssociate] a
					JOIN sonic_dw.dbo.dim_entity e ON a.asolocation = e.entadpcompanyid
						AND substring(convert(char(4),asodms4digit),4,1) = entaccountingprefix
					JOIN DimEntityRelationship r ON r.entitykey = e.entitykey
					JOIN DimEntityRelationshipType t ON r.relationshiptypeguid = t.RelationshipTypeGuid
					join Sonic_dw.dbo.DimAssociate ca on ca.asoemployeenumber = r.integerfield
			WHERE	a.asojobfamily = '01. General Managers' --asoecjobtitle = 'General Manager'
					AND a.meta_rowiscurrent = 'Y'
					AND a.asoemployeestatus = 'Active'
					AND e.entactive = 'Active'
					AND t.relationshiptype = 'CallidusControllerID'
					AND r.isactive = 1
					AND [EntDefaultDlrshpLvl1] = 1
					and e.currentprefixflag = 'Active'
					--order by entdealerlvl1
		) as gm
		on a.AsoEmployeeNumber = gm.GMEmployeeID
		left join (
			select	dim.AssociateKey, sup.AsoEmployeeNumber, sup.AsoSupervisorID, sup.AsoSupervisorName
			from	(
					select	AssociateKey, AsoEmployeeNumber
					from	dbo.dimassociate
					where	meta_rowiscurrent = 'Y'
							and AsoEmployeeStatus in ('leave of absence', 'on leave of absence')
					) dim
					inner join (
						select	AsoEmployeeNumber, AsoSupervisorID, AsoSupervisorName
								, ROW_NUMBER() over(partition by asoemployeenumber order by associatekey desc) seq
						from	dbo.DimAssociate
						where	Meta_RowIsCurrent = 'N'
								and AsoEmployeeStatus = 'active'
					) sup
						on dim.AsoEmployeeNumber = sup.AsoEmployeeNumber
						and sup.seq = 1
			) oldSup on a.AssociateKey = oldsup.AssociateKey
where	a.Meta_RowIsCurrent = 'Y'
		and (
			a.AsoEmployeeStatus in ('active','leave of absence', 'on leave of absence') -- raj 04032020
			or  (
				a.AsoEmployeeStatus like  '%term%'
				and
				AsoTerminationDateKey >=   CONVERT(VARCHAR(8), dateadd(dd,-90,GETDATE()), 112))
			)-- 90 days of terminations

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
