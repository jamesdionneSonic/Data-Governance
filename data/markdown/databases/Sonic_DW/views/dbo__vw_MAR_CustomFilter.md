---
name: vw_MAR_CustomFilter
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on: []
dependency_count: 0
column_count: 2
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Columns

| Name         | Type    | Nullable | Description |
| ------------ | ------- | -------- | ----------- |
| `DateKey`    | int     |          |             |
| `DATE_RANGE` | varchar |          |             |

## Definition

```sql

CREATE VIEW [dbo].[vw_MAR_CustomFilter]
AS
SELECT		 [DateKey], 'LM' AS DATE_RANGE
FROM		 [Sonic_DW].[dbo].[vw_Dim_date]
WHERE		 FullDate >= DATEADD(month, -1, DATEADD(month, DATEDIFF(month, 0, GETDATE()), 0)) AND FullDate < DATEADD(month, DATEDIFF(month, 0, GETDATE()), 0)
UNION
SELECT       [DateKey], 'MTD' AS DATE_RANGE
FROM         [Sonic_DW].[dbo].[vw_Dim_date]
WHERE        Year([FullDate]) = YEAR(GETDATE() -1) AND MONTH([FullDate]) = MONTH(GETDATE() -1) AND FullDate <= CAST(GETDATE() - 1 AS Date)
UNION
SELECT       [DateKey], 'YTD' AS DATE_RANGE
FROM         [Sonic_DW].[dbo].[vw_Dim_date]
WHERE        Year([FullDate]) = YEAR(GETDATE() - 1) AND FullDate <= CAST(GETDATE() - 1 AS Date)
UNION
SELECT       [DateKey], 'L7D' AS DATE_RANGE
FROM         [Sonic_DW].[dbo].[vw_Dim_date]
WHERE        [FullDate] >= DATEADD(day, - 8, GETDATE()) AND [FullDate] <= GETDATE() -1
UNION
SELECT       [DateKey], 'Custom' AS DATE_RANGE
FROM         [Sonic_DW].[dbo].[vw_Dim_date]
WHERE        DateKey > 20190000 AND Year([FullDate]) <= YEAR(GETDATE() - 1)

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
