---
name: vw_MTD
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
| `MTD_DateKey` | int  |          |             |
| `DateKey`     | int  |          |             |

## Definition

```sql
CREATE VIEW dbo.vw_MTD
AS
SELECT     dbo.vw_Dim_date.DateKey AS MTD_DateKey, vw_Dim_date_1.DateKey
FROM         dbo.vw_Dim_date CROSS JOIN
                      dbo.vw_Dim_date AS vw_Dim_date_1
WHERE     (dbo.vw_Dim_date.FullDate BETWEEN vw_Dim_date_1.Month_StartDate AND vw_Dim_date_1.FullDate) AND (vw_Dim_date_1.DateKey BETWEEN
                      20080101 AND 20200101)

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
