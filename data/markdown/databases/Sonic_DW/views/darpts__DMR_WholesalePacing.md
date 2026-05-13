---
name: DMR_WholesalePacing
database: Sonic_DW
type: view
schema: darpts
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
dependency_count: 2
column_count: 0
extracted_at: 2026-05-12T20:14:33.860Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: darpts

## Dependencies

This view depends on:

- **darpts.DMR_Sold_Whsl** (V )
- **dbo.Dim_Date** (U )

## Definition

```sql

CREATE view darpts.DMR_WholesalePacing as
with counts as (SELECT curr_store_id,
	entitykey
	,COUNT(vin)*1.0 AS whsl
	,d.FiscalMonthKey
	,DAY(EOMONTH(GETDATE()))*1.0 AS DaysInMonth
	,DATEDIFF(day, GETDATE(), EOMONTH(GETDATE()))*1.0 AS DaysLeftInMonth
	,DAY(GETDATE())*1.0 AS DaysPassedInMonth
	--,(COUNT(vin)/DAY(GETDATE()))*DAY(EOMONTH(GETDATE())) as wholesalepace
FROM darpts.DMR_Sold_Whsl s WITH (NOLOCK)
join dim_date d
on s.Sold_Date = d.FullDate
GROUP BY curr_store_id , entitykey, d.FiscalMonthKey)

select entitykey
,curr_store_id
,whsl
,counts.FiscalMonthKey
,daysinmonth
,daysleftinmonth
,dayspassedinmonth
,(whsl/dayspassedinmonth)*daysinmonth as wholesalepace
from counts
```

## Governance

- **Last Extracted**: 2026-05-12T20:14:33.860Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
