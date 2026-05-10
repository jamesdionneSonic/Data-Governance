---
name: vw_FactCallSource
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

CREATE VIEW [dbo].[vw_FactCallSource]
AS
--added Adsource4 and ThirdPartySourceStandard. Point of this was to use this view for all callsource as its most updated. Changes made 12/3/2024

SELECT        a.FactCallSourceId, CASE WHEN a.EntityKey = 170 THEN 401 ELSE a.EntityKey END AS EntityKey, a.CallDateKey, a.ResultKey, a.AdSourceKey, a.ReviewStatusKey, a.CallDurationSeconds, a.CallCount, UPPER(a.CallerNumber) 
                         AS CallerNumber, case when a.adsource4='DNI' then 'We
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
