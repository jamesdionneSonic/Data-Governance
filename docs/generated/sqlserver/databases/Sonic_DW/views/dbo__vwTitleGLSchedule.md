---
name: vwTitleGLSchedule
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







CREATE VIEW [dbo].[vwTitleGLSchedule]
AS
SELECT 
 s.entitykey   
,e.EntCora_Account_ID      
,e.EntADPCompanyID
,e.EntAccountingPrefix
,e.EntDealerLvl1    
,e.EntBrand   
,e.EntRegion
,e.entlineofbusiness
,currentmonthkey
,cm.fulldate as CurrentMonth
,Control as Stockno 
,MIN(ControlDesc) as ControlDesc
,min(dk.Fulldate) as AgeDate --used for stock in date
,max(ad.fulldate) as MaxAccountingDate
,max(pd.fulldate) as MaxPostingDate
,SUM(PostingAmt) as Balance 
,1 a
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
