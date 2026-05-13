---
name: DELETE_METRIC_DATA
database: Sonic_DW
type: procedure
schema: Metric
owner: Data Team
tags:
  - procedure
  - auto-extracted
dependency_count: 2
parameter_count: 2
extracted_at: 2026-05-12T20:14:33.860Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: Metric

## Dependencies

This procedure depends on:

- **Metric.DIM_METRIC_TBL** (U )
- **Metric.EDWH_METRIC_TBL** (U )

## Parameters

| Name           | Type    | Output | Default |
| -------------- | ------- | ------ | ------- |
| `@Metric_Name` | varchar | No     | No      |
| `@Delete_Date` | date    | No     | No      |

## Definition

```sql
CREATE procedure [Metric].[DELETE_METRIC_DATA]
	@Metric_Name varchar(2000)
	,@Delete_Date date = NULL
AS
begin
/* Block used for Testing
set @Metric_Name = 'Website Inventory Count'
set	@Delete_Date = getdate()
*/

if @Delete_Date is null
BEGIN
	delete Metric.EDWH_METRIC_TBL
	from Metric.EDWH_METRIC_TBL E
		inner join Metric.DIM_METRIC_TBL M on E.DIM_METRIC_ID = M.DIM_METRIC_ID
	where M.METRIC_DESC in (@Metric_Name)
end
else
begin
	delete Metric.EDWH_METRIC_TBL
	from Metric.EDWH_METRIC_TBL E
		inner join Metric.DIM_METRIC_TBL M on E.DIM_METRIC_ID = M.DIM_METRIC_ID
	where M.METRIC_DESC in (@Metric_Name)
		and E.METRIC_CAPTURE_DATE >= @Delete_Date
end
end;

```

## Governance

- **Last Extracted**: 2026-05-12T20:14:33.860Z
