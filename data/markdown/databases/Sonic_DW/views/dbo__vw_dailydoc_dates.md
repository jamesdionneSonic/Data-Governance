---
name: vw_dailydoc_dates
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - vw_dailydoc_end_date
  - vw_dailydoc_start_date
  - vw_Dim_date
dependency_count: 3
column_count: 3
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.vw_dailydoc_end_date** (V )
- **dbo.vw_dailydoc_start_date** (V )
- **dbo.vw_Dim_date** (V )

## Columns

| Name        | Type     | Nullable | Description |
| ----------- | -------- | -------- | ----------- |
| `DateKey`   | int      |          |             |
| `FullDate`  | datetime | ✓        |             |
| `DummyDate` | int      |          |             |

## Definition

```sql
CREATE view [dbo].[vw_dailydoc_dates] as
SELECT
a11.DateKey  DateKey, a11.FullDate FullDate, a11.DateKey  DummyDate
FROM
vw_Dim_date	a11, dbo.vw_dailydoc_start_date a12,dbo.vw_dailydoc_end_date A13
WHERE
a11.[FullDate] BETWEEN a12.[FullFirstDate] AND a13.[FullLastDate]

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
