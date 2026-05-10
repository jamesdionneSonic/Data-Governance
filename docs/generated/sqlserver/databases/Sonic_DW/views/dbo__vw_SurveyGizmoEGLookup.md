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
extracted_at: 2026-05-09T12:34:14.349Z
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
  ,coalesce(a.asotimeclockid,aso.asot
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
