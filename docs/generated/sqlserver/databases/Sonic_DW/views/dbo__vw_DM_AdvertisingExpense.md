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
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
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
                         MAX(dbo.DM_AdvertisingExpense.Meta_RowLastUpdated) AS Meta_RowLastUpdated
FROM            dbo.DM_AdvertisingExpense INNER JOIN
                         dbo.Dim_Month ON dbo.DM_AdvertisingExpense.CalendarYearMonth = dbo.Dim_Month.FiscalMonthKey INNER JOIN
                         dbo.Dim_AdvertisingMetrics ON dbo.DM_AdvertisingExpense.metric_name = dbo.Dim_AdvertisingMetrics.AdvertisingMetricName
GROUP BY dbo.Dim_Month.StartDateKey, dbo.DM_AdvertisingExpense.EntityKey, RTRIM(dbo.DM_AdvertisingExpense.NewUsedID), dbo.DM_AdvertisingExpense.CalendarYearMonth,
                         dbo.Dim_AdvertisingMetrics.AdvertisingMetricGroupName, dbo.Dim_AdvertisingMetrics.CalcMode

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
