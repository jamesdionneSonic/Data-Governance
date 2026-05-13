---
name: vw_SurveyGizmoEGLookup
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

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Definition

```sql
 CREATE View dbo.vw_SurveyGizmoEGLookup
as

  with aso as (
     select asolastname+','+asofirstname as asoname,asotimeclockid,AsoWorkEmailAddress,AsoLastName+', '+AsoFirstName as AsoAssociateName
	 from DimAssociate
	 where asolocation = 826 and asojobcode = 'EPGECONS'
   and meta_rowiscurrent = 'Y'
   --and asoemployeestatus = 'Active'
  -- order by asolastname
  )


  select distinct
  empname1
  ,custno
  ,ff.dealno
  ,ff.entitykey
  ,coalesce(a.asotimeclockid,aso.asotimeclockid) as asotimeclockid
  , count(distinct dealno) as DealCount
  , max(ff.accountingdatekey) as MaxDate
  ,coalesce(a.AsoWorkEmailAddress,aso.asoworkemailaddress) as AsoWorkEmailAddress
  , coalesce(a.AsoLastName+', '+a.AsoFirstName,aso.AsoAssociateName) as AsoAssociateName
  from factfire ff
  join dim_DMSEmployee ee
  on ff.salesperson1key = ee.associatekey
  left join DimAssociate a
  on a.asotimeclockid = ee.custno
  and a.meta_rowiscurrent = 'Y'
  left join aso
  on aso.asoname = ee.empname1
   where entitykey = 523 and accountingdatekey >= 20210101 and ff.fiwipstatuscode = 'F'
   group by empname1,ff.entitykey,custno,ff.dealno,a.asotimeclockid,aso.asotimeclockid,a.AsoWorkEmailAddress, AsoLastName,AsoFirstName,aso.AsoAssociateName,aso.AsoWorkEmailAddress
   --order by empname1


  -- select * from dbo.vw_SurveyGizmoEGLookup
```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
