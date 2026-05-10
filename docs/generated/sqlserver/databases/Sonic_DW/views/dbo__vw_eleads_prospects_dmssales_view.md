---
name: vw_eleads_prospects_dmssales_view
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





---in Sonic DW
CREATE view [dbo].[vw_eleads_prospects_dmssales_view] as 




select distinct e.entregion
,e.EntLineOfBusiness
,e.entdealerlvl1
,e.entbrand
,d.fulldate
,d.datekey
,o.entitykey
,ut.uptype as SrcUpType
,os.LeadSourcekey as SrcSourceID
,LeadSourceName as SrcSourceDesc
,sls.Standardleadsourcename
,isnull(m.thirdpartystandard, 'Other') ThirdPartySourceStandard
,eleadsubsourceid as SrcSubSourceID
,leadsubsourcename as SrcSubSourceDesc
,Case when  o.NewVehic
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
