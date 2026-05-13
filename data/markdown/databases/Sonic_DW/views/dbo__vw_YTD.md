---
name: vw_YTD
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - vw_Dim_date
dependency_count: 1
column_count: 2
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.vw_Dim_date** (V )

## Columns

| Name          | Type | Nullable | Description |
| ------------- | ---- | -------- | ----------- |
| `DateKey`     | int  |          |             |
| `YTD_DateKey` | int  |          |             |

## Definition

```sql
CREATE VIEW dbo.vw_YTD
AS
SELECT     vw_Dim_date_1.DateKey, dbo.vw_Dim_date.DateKey AS YTD_DateKey
FROM         dbo.vw_Dim_date CROSS JOIN
                      dbo.vw_Dim_date AS vw_Dim_date_1
WHERE     (dbo.vw_Dim_date.FullDate BETWEEN CAST('01 jan' + CAST(DATEPART(year, vw_Dim_date_1.FullDate) AS varchar) AS DATETIME) AND
                      vw_Dim_date_1.FullDate) AND (vw_Dim_date_1.DateKey BETWEEN 20100101 AND 20150101)

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
