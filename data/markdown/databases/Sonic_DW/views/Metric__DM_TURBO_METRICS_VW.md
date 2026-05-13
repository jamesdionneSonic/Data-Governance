---
name: DM_TURBO_METRICS_VW
database: Sonic_DW
type: view
schema: Metric
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
dependency_count: 5
column_count: 0
extracted_at: 2026-05-12T20:14:33.860Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: Metric

## Dependencies

This view depends on:

- **Metric.DIM_DATE_TBL** (U )
- **Metric.DIM_DEALERSHIP_TBL** (U )
- **Metric.DIM_METRIC_ATTRIBUTE_TBL** (U )
- **Metric.DIM_METRIC_TBL** (U )
- **Metric.EDWH_METRIC_TBL** (U )

## Definition

```sql


CREATE view [Metric].[DM_TURBO_METRICS_VW]
as
select DEALERSHIP_NAME
, ENTITY_KEY
, METRIC_CAPTURE_DATE
, cast(convert(varchar(10), convert(datetime, METRIC_CAPTURE_DATE, 126), 112) as int) as METRIC_DATEKEY
, isnull(ATTRIBUTE_DESC, 'N/A') as METRIC_BREAKDOWN
, sum(case when BASE_DATA.METRIC_DESC in ('Service Appointment - All - No Show') then BASE_DATA.METRIC_VALUE else 0 end) as ALL_NO_SHOW
, sum(case when BASE_DATA.METRIC_DESC in ('Service Appointment - All - Total') then BASE_DATA.METRIC_VALUE else 0 end) as ALL_TOTAL
, sum(case when BASE_DATA.METRIC_DESC in ('Service Appointment - Customer Pay - Total') then BASE_DATA.METRIC_VALUE else 0 end) as CUSTOMER_PAY_TOTAL
, sum(case when BASE_DATA.METRIC_DESC in ('Service Appointment - Warranty Pay - Total') then BASE_DATA.METRIC_VALUE else 0 end) as WARRANTY_PAY_TOTAL
, sum(case when BASE_DATA.METRIC_DESC in ('Same Day Appointments') then BASE_DATA.METRIC_VALUE else 0 end) SAME_DAY_APPOINTMENTS
, sum(case when BASE_DATA.METRIC_DESC in ('Website Inventory Count') then BASE_DATA.METRIC_VALUE else 0 end) WEBSITE_INVENTORY_COUNT
, sum(case when BASE_DATA.METRIC_DESC in ('Quote Provided') then BASE_DATA.METRIC_VALUE else 0 end) QUOTE_PROVIDED
from
(select M.DEALERSHIP_ID
, D.DEALERSHIP_NAME
, D.ENTITY_KEY
, M.DIM_METRIC_ID
, MT.METRIC_DESC
, MT.METRIC_SOURCE
, A.ATTRIBUTE_DESC
, M.METRIC_DATATYPE
, cast(M.METRIC_VALUE as int) as METRIC_VALUE
, M.METRIC_CAPTURE_DATE
, DT.PREVIOUS_YEAR_IND
, DT.CURRENT_YEAR_IND
, DT.YTD_IND
, DT.PREVIOUS_MONTH_IND
, DT.CURRENT_MONTH_IND
, DT.CURRENT_MONTH_PREVIOUS_YEAR_IND
from Metric.EDWH_METRIC_TBL as M
	inner join Metric.DIM_DEALERSHIP_TBL as D on M.DEALERSHIP_ID = D.DEALERSHIP_ID
	inner join Metric.DIM_METRIC_TBL as MT on M.DIM_METRIC_ID = MT.DIM_METRIC_ID
	left outer join Metric.DIM_METRIC_ATTRIBUTE_TBL as A on M.DIM_METRIC_ATTRIBUTE_ID = A.DIM_METRIC_ATTRIBUTE_ID
	inner join Metric.DIM_DATE_TBL as DT on M.METRIC_CAPTURE_DATE = DT.FULL_DATE
where (MT.METRIC_TYPE in ('Turbo_Website_Inventory', 'TURBO_Same_Day_Appointments', 'Turbo_Service_Appointments', 'Turbo_Quote_Provided' ))) as BASE_DATA
group by DEALERSHIP_NAME
, ENTITY_KEY
, METRIC_CAPTURE_DATE
, ATTRIBUTE_DESC

```

## Governance

- **Last Extracted**: 2026-05-12T20:14:33.860Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
