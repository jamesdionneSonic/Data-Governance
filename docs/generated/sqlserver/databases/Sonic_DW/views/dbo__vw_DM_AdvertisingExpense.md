---
name: vw_DM_AdvertisingExpense
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
CREATE VIEW dbo.vw_DM_AdvertisingExpense
AS
SELECT        dbo.Dim_Month.StartDateKey AS DateKey, dbo.DM_AdvertisingExpense.EntityKey, RTRIM(dbo.DM_AdvertisingExpense.NewUsedID) AS NewUsedID, dbo.DM_AdvertisingExpense.CalendarYearMonth AS FiscalMonthKey, 
                         dbo.Dim_AdvertisingMetrics.AdvertisingMetricGroupName AS metric_name, SUM(dbo.DM_AdvertisingExpense.value) AS value, SUM(dbo.DM_AdvertisingExpense.value2) AS value2, dbo.Dim_AdvertisingMetrics.CalcMode, 
            
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
