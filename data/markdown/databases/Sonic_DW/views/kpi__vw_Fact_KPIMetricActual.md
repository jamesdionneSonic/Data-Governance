---
name: vw_Fact_KPIMetricActual
database: Sonic_DW
type: view
schema: kpi
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
- **Schema**: kpi

## Dependencies

This view depends on:

- **kpi.Fact_KPIMetricActual_Calc** (U )
- **kpi.Fact_KPIMetricActual_TXN** (U )

## Definition

```sql

CREATE VIEW [kpi].[vw_Fact_KPIMetricActual] AS
select KPIMetricKey, EntityKey, DateKey, MetricValue, Meta_LoadDate, Meta_RowLastChangeDate, Meta_UserID
from kpi.Fact_KPIMetricActual_Calc
union all
select kpimetrickey, entitykey, datekey, metricvalue, meta_loaddate, meta_rowlastchangedate, meta_userid
from kpi.Fact_KPIMetricActual_TXN

```

## Governance

- **Last Extracted**: 2026-05-12T20:14:33.860Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
