---
name: vw_dailydoc_start_date
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - vw_dailydoc_totsonic
dependency_count: 1
column_count: 3
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.vw_dailydoc_totsonic** (V )

## Columns

| Name            | Type     | Nullable | Description |
| --------------- | -------- | -------- | ----------- |
| `DateKey`       | int      | ✓        |             |
| `FirstDate`     | int      | ✓        |             |
| `FullFirstDate` | datetime | ✓        |             |

## Definition

```sql
CREATE view [dbo].[vw_dailydoc_start_date] as
SELECT
(CONVERT(INT,((CONVERT(VARCHAR,(DATEPART(yyyy,CONVERT(DATE,(select max(a.DocDate)))))))
+ (CONVERT(VARCHAR,(DATEPART(mm,CONVERT(DATE,(select max(a.DocDate)))))))
+ ('01')))) AS DateKey,
(CONVERT(INT,((CONVERT(VARCHAR,(DATEPART(yyyy,CONVERT(DATE,(select max(a.DocDate)))))))
+ (CONVERT(VARCHAR,(DATEPART(mm,CONVERT(DATE,(select max(a.DocDate)))))))
+ ('01')))) AS FirstDate,
(CONVERT(DATETIME,((CONVERT(VARCHAR,(DATEPART(yyyy,CONVERT(DATE,(select max(a.DocDate)))))))
+ (CONVERT(VARCHAR,(DATEPART(mm,CONVERT(DATE,(select max(a.DocDate)))))))
+ ('01')))) AS FullFirstDate
from dbo.vw_dailydoc_totsonic as a

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
