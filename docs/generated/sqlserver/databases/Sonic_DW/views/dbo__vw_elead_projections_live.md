---
name: vw_elead_projections_live
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
CREATE view [dbo].[vw_elead_projections_live] as



select distinct e.entregion
,e.EntLineOfBusiness
,e.entdealerlvl1
,e.entbrand
,o.entitykey
,Case when o.NewVehicleFlag=1 then 'New' else 'Used' end as NewUsed
,d.fiscalmonthkey
--,(case when os.SrcSourceDesc in ('KBB Instant Cash Offer', 'Autotrader-TIM-KBB',
--'KBB-TIM',
--'TIM-KBB/CR',
--'AutoTrader TIM ATC',
--'AutoTrader TIM Kelley Blue Book',
--'TIM-ATC',
--'TIM-ATC/CR',
--'AutoTrader TIM-KBB
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
