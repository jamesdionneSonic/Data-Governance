---
name: vw_TMAdv_Union
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

1- **Type**: View
- **Schema**: dbo

## Definition

```sql
CREATE VIEW dbo.vw_TMAdv_Union
AS
SELECT        EntityKey, NewUsedID, CalendarYearMonth, metric_name, value
FROM            dbo.DM_AdvertisingExpense 

UNION ALL
SELECT  EntityKey, NewUsedID, CalendarYearMonth, metric_name, value FROM
                         dbo.vw_TMDOCProjectionsAdvertising

```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
