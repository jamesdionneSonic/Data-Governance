---
name: vw_Quartile
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

2- **Type**: View
- **Schema**: dbo

## Definition

```sql


CREATE VIEW [dbo].[vw_Quartile]
AS
SELECT     x.EntDealerLvl1, q.dtMonthEnd, q.lLotUpNew, q.lLotUpUsed, q.lLotUpSoldNew, q.lLotUpSoldUsed, q.lDemo, q.lWriteUps, q.lTO, q.lPhoneUpNew, 
                      q.lPhoneUpUsed, q.lPhoneUpApptNew, q.lPhoneUpApptUsed, q.lPhoneUpApptShowNew, q.lPhoneUpApptShowUsed, q.lPhoneUpApptSoldNew, 
                      q.lPhoneUpApptSoldUsed, q.lPhoneUpSoldNew, q.lPhoneUpSoldUsed, q.lWebUpNew, q.lWebUpUsed, q.lWebUpApptNew, q.lWebUpApptUsed, 
           
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
