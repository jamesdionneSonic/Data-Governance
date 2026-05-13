---
name: vw_DMR_Targets
database: Sonic_DW
type: view
schema: kpi
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
dependency_count: 4
column_count: 0
extracted_at: 2026-05-12T20:14:33.860Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: kpi

## Dependencies

This view depends on:

- **dbo.vw_Dim_date** (V )
- **dbo.vw_Dim_EntityEP** (V )
- **kpi.Dim_KPIMetrics** (U )
- **kpi.Fact_KPIMetricTarget_TXN** (U )

## Definition

```sql




CREATE VIEW [kpi].[vw_DMR_Targets]
AS

--View to show the most recent DMR targets for the current month (or prior month if not entered yet).
select
	e.EntityKey, b.fiscalMonthKey, m.KpiMetricKey,
	e.entregion Region, e.entdealerlvl1 Dealership, m.KPIMetricDesc MetricName, coalesce(a.targetmonth, b.targetmonth) TargetMonth, coalesce(a.MetricValue, b.MetricValue) TargetValue
--select count()
	from kpi.dim_kpimetrics m cross join dbo.vw_dim_entityEP e
left join (select t.*, concat(d.MonthNameAbbreviation, ' ', d.calendaryear) TargetMonth, d.FiscalMonthKey
			from kpi.Fact_KPIMetricTarget_TXN t join dbo.vw_dim_date d on d.datekey = t.datekey
			and d.fulldate = DATEFROMPARTS(year(dateadd(day, -1, getdate())), month(dateadd(day, -1, getdate())), 1)
			join kpi.Dim_KPIMetrics m on m.KPIMetricKey = t.KPIMetricKey where m.IsActive = 1 and m.IsDMR = 1) a
on a.entitykey = e.EntityKey and a.KPIMetricKey = m.kpimetrickey
left join (select t.*, concat(d.MonthNameAbbreviation, ' ', d.calendaryear) TargetMonth, d.FiscalMonthKey
			from kpi.Fact_KPIMetricTarget_TXN t join dbo.vw_dim_date d on d.datekey = t.datekey
			and d.fulldate = DATEFROMPARTS(year(dateadd(day, -1, getdate())), month(dateadd(month, -1,dateadd(day, -1, getdate()))), 1)
			join kpi.Dim_KPIMetrics m on m.KPIMetricKey = t.KPIMetricKey where m.IsActive = 1 and m.IsDMR = 1) b
on b.entitykey = e.EntityKey and b.KPIMetricKey = m.kpimetrickey
where m.IsActive = 1 and m.IsDMR = 1 and e.entregion <> 'RFJ' and e.EntDefaultDlrshpLvl1=1;




```

## Governance

- **Last Extracted**: 2026-05-12T20:14:33.860Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
