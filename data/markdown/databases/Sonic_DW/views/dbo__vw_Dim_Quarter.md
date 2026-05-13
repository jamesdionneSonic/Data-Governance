---
name: vw_Dim_Quarter
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
column_count: 6
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.vw_Dim_date** (V )

## Columns

| Name                 | Type     | Nullable | Description |
| -------------------- | -------- | -------- | ----------- |
| `FiscalQuarterKey`   | int      | ✓        |             |
| `FiscalQuarterKeyLY` | int      | ✓        |             |
| `CalendarYearQtr`    | char     |          |             |
| `CalendarQuarter`    | tinyint  |          |             |
| `CalendarYear`       | smallint |          |             |
| `QuarterDesc`        | varchar  | ✓        |             |

## Definition

```sql


/* Name: dbo.vw_Dim_Quarter
* Created by: Sonic Automotive
* Change Control:
* Date			Developer Name		Change Description
* 20250812		Hermann Brandi		Added column FiscalQuarterKey
* 20250829		Hermann Brandi		Added column FiscalQuarterKeyLY for transformations.
*
*/
CREATE   VIEW [dbo].[vw_Dim_Quarter]
AS
SELECT
	DISTINCT CAST(CAST(FiscalYear as varchar) + CAST(FiscalQuarter as varchar) AS INT) As FiscalQuarterKey
	, CAST(CAST(FiscalYear - 1 as VarChar) + CAST(FiscalQuarter as varchar) AS INT) As FiscalQuarterKeyLY
	, CalendarYearQtr
	, CalendarQuarter
	, CalendarYear
	, QuarterDesc
FROM dbo.vw_Dim_date;



```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
