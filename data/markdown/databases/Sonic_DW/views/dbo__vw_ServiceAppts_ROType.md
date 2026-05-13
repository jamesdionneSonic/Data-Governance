---
name: vw_ServiceAppts_ROType
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - DIM_DATE_TBL
  - DIM_DEALERSHIP_TBL
  - DIM_METRIC_ATTRIBUTE_TBL
  - DIM_METRIC_TBL
  - EDWH_METRIC_TBL
dependency_count: 5
column_count: 7
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Dependencies

This view depends on:

- **Metric.DIM_DATE_TBL** (U )
- **Metric.DIM_DEALERSHIP_TBL** (U )
- **Metric.DIM_METRIC_ATTRIBUTE_TBL** (U )
- **Metric.DIM_METRIC_TBL** (U )
- **Metric.EDWH_METRIC_TBL** (U )

## Columns

| Name                  | Type    | Nullable | Description |
| --------------------- | ------- | -------- | ----------- |
| `DEALERSHIP_NAME`     | varchar | ✓        |             |
| `ENTITY_KEY`          | int     | ✓        |             |
| `METRIC_CAPTURE_DATE` | date    |          |             |
| `METRIC_DATEKEY`      | int     | ✓        |             |
| `METRIC_DESC`         | varchar |          |             |
| `RO_Type`             | varchar |          |             |
| `Metric_Value`        | int     | ✓        |             |

## Definition

```sql

CREATE VIEW [dbo].[vw_ServiceAppts_ROType]
AS
SELECT        D.DEALERSHIP_NAME, D.ENTITY_KEY, M.METRIC_CAPTURE_DATE, CAST(CONVERT(varchar(10), CONVERT(datetime, M.METRIC_CAPTURE_DATE, 126), 112) AS INT) AS METRIC_DATEKEY, MT.METRIC_DESC,
                         (CASE WHEN [METRIC_DESC] = 'Service Appointment - Warranty Pay - Total' THEN 'Warranty' WHEN [METRIC_DESC] = 'Service Appointment - Customer Pay - Total' THEN 'Customer Pay' WHEN [METRIC_DESC] = 'Service Appointment - Internal Pay - Total'
                          THEN 'Warranty' WHEN [METRIC_DESC] = 'Service Appointment - Other Pay - Total' THEN 'Warranty' ELSE 'Total' END) AS RO_Type, CAST(M.METRIC_VALUE AS int) AS Metric_Value
FROM            Metric.EDWH_METRIC_TBL AS M INNER JOIN
                         Metric.DIM_DEALERSHIP_TBL AS D ON M.DEALERSHIP_ID = D.DEALERSHIP_ID INNER JOIN
                         Metric.DIM_METRIC_TBL AS MT ON M.DIM_METRIC_ID = MT.DIM_METRIC_ID INNER JOIN
                         Metric.DIM_METRIC_ATTRIBUTE_TBL AS A ON M.DIM_METRIC_ATTRIBUTE_ID = A.DIM_METRIC_ATTRIBUTE_ID INNER JOIN
                         Metric.DIM_DATE_TBL AS DT ON M.METRIC_CAPTURE_DATE = DT.FULL_DATE
WHERE        (MT.METRIC_TYPE = 'Turbo_Service_Appointments')  AND (MT.METRIC_DESC IN ('Service Appointment - Warranty Pay - Total',
                         'Service Appointment - Customer Pay - Total', 'Service Appointment - All - Total', 'Service Appointment - Internal Pay - Total', 'Service Appointment - Other Pay - Total'))

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
