---
name: vw_Fact_DataLoad_Errors_Current
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - vw_Fact_DataLoad_Details
dependency_count: 1
column_count: 21
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.vw_Fact_DataLoad_Details** (V )

## Columns

| Name                          | Type    | Nullable | Description |
| ----------------------------- | ------- | -------- | ----------- |
| `TableName`                   | varchar | ✓        |             |
| `Variance_in_Transfer`        | int     |          |             |
| `Error_In_Transfer`           | int     |          |             |
| `Step_Record_Missing`         | int     |          |             |
| `FullDate`                    | date    | ✓        |             |
| `DateKey`                     | varchar | ✓        |             |
| `DMS_to_PG_SourceName`        | varchar |          |             |
| `PG_to_StageDB_SourceName`    | varchar |          |             |
| `StageDB_to_DMS_SourceName`   | varchar |          |             |
| `DMS_to_PG_ExpectedRows`      | int     | ✓        |             |
| `DMS_to_PG_ActualRows`        | int     | ✓        |             |
| `DMS_to_PG_Variance`          | int     | ✓        |             |
| `DMS_to_PG_ErrorCount`        | int     | ✓        |             |
| `PG_to_StageDB_ExpectedRows`  | int     | ✓        |             |
| `PG_to_StageDB_ActualRows`    | int     | ✓        |             |
| `PG_to_StageDB_Variance`      | int     | ✓        |             |
| `PG_to_StageDB_ErrorCount`    | int     | ✓        |             |
| `StageDB_to_DMS_ExpectedRows` | int     | ✓        |             |
| `StageDB_to_DMS_ActualRows`   | int     | ✓        |             |
| `StageDB_to_DMS_Variance`     | int     | ✓        |             |
| `StageDB_to_DMS_ErrorCount`   | int     | ✓        |             |

## Definition

```sql




CREATE VIEW [dbo].[vw_Fact_DataLoad_Errors_Current]
AS
/*****************************************************************************************
DATE		USERNAME		DESCRIPTION
10-1-2013	NCARPENDER		modified script to allow nulls for missing values instead of defaulting to NA
*****************************************************************************************/
WITH
		Expected_Step1 as
					(
						SELECT DISTINCT
						 Src.SourceName
							, tgt.TargetName
							, fact.StepNumber
						FROM (
									select distinct fact.SourceKey, fact.StepKey, fact.TargetKey, step.StepNumber
									from sonic_dw.dbo.Fact_DataLoad AS fact
			 							INNER JOIN sonic_dw.dbo.Dim_Step AS Step
											ON fact.StepKey = Step.StepKey
									where datekey >= convert(int,convert(varchar(10),getdate() - 180,112))
										AND step.StepNumber = 1
								) AS fact
							LEFT OUTER JOIN sonic_dw.dbo.Dim_StepSource	AS Src WITH (nolock)
								ON fact.SourceKey = Src.SourceKey
							LEFT OUTER JOIN sonic_dw.dbo.Dim_StepTarget	AS tgt
								on fact.targetkey = tgt.targetkey
					)
		, Expected_step2 as
					(
						SELECT DISTINCT
							Src.SourceName
							, tgt.TargetName
							, fact.StepNumber
						FROM (
									select distinct fact.SourceKey, fact.StepKey, fact.TargetKey, step.StepNumber
									from sonic_dw.dbo.Fact_DataLoad AS fact
			 							INNER JOIN sonic_dw.dbo.Dim_Step AS Step
											ON fact.StepKey = Step.StepKey
									where datekey >= convert(int,convert(varchar(10),getdate() - 180,112))
										AND step.StepNumber = 2
								) AS fact
							LEFT OUTER JOIN sonic_dw.dbo.Dim_StepSource	AS Src WITH (nolock)
								ON fact.SourceKey = Src.SourceKey
							LEFT OUTER JOIN sonic_dw.dbo.Dim_StepTarget	AS tgt
								on fact.targetkey = tgt.targetkey
					)
		, Expected_step3 as
					(
						SELECT DISTINCT
							 Src.SourceName
							, tgt.TargetName
							, fact.StepNumber
						FROM (
									select distinct fact.SourceKey, fact.StepKey, fact.TargetKey, step.StepNumber
									from sonic_dw.dbo.Fact_DataLoad AS fact
			 							INNER JOIN sonic_dw.dbo.Dim_Step AS Step
											ON fact.StepKey = Step.StepKey
									where datekey >= convert(int,convert(varchar(10),getdate() - 180,112))
										AND step.StepNumber = 3
								) AS fact
							LEFT OUTER JOIN sonic_dw.dbo.Dim_StepSource	AS Src WITH (nolock)
								ON fact.SourceKey = Src.SourceKey
							LEFT OUTER JOIN sonic_dw.dbo.Dim_StepTarget	AS tgt
								on fact.targetkey = tgt.targetkey
					)
		, stp1 as (
						Select
							  d.FullDate
							, es.SourceName
							, isnull(d.SourceName,'Missing') as ActualSourceName
							, d.TargetName
							, Sum(isnull(d.ExpectedRows,0)) as ExpectedRows
							, sum(isnull(d.ActualRows,0)) as ActualRows
							, sum(isnull(d.ErrorCount,0)) as ErrorCount
						from Expected_Step1 es
							left join dbo.vw_Fact_DataLoad_Details d
								on es.SourceName = d.SourceName
								 and es.StepNumber = d.StepNumber
						group by d.FullDate, es.SourceName, d.TargetName, d.SourceName
					)


		, stp2 as (
						Select
							  d.FullDate
							, es.SourceName
							, isnull(d.SourceName,'Missing') as ActualSourceName
							, d.TargetName
							, Sum(isnull(d.ExpectedRows,0)) as ExpectedRows
							, sum(isnull(d.ActualRows,0)) as ActualRows
							, sum(isnull(d.ErrorCount,0)) as ErrorCount
						from Expected_Step2 es
							left join dbo.vw_Fact_DataLoad_Details d
								on es.SourceName = d.SourceName
								 and es.StepNumber = d.StepNumber
						group by d.FullDate, es.SourceName, d.TargetName, d.SourceName
					)
		, stp3 as (
						Select
							  d.FullDate
							, es.SourceName
							, isnull(d.SourceName,'Missing') as ActualSourceName
							, d.TargetName
							, Sum(isnull(d.ExpectedRows,0)) as ExpectedRows
							, sum(isnull(d.ActualRows,0)) as ActualRows
							, sum(isnull(d.ErrorCount,0)) as ErrorCount
						from Expected_Step3 es
							left join dbo.vw_Fact_DataLoad_Details d
								on es.SourceName = d.SourceName
								 and es.StepNumber = d.StepNumber
						group by d.FullDate, es.SourceName, d.TargetName, d.SourceName
					)

		, base as (
					Select	  isnull(stp3.FullDate,isnull(stp1.FullDate,stp2.FullDate)) as FullDate

							, coalesce(stp1.ActualSourceName,stp2.ActualSourceName,stp3.ActualSourceName) as TableName

							, isnull(stp1.ActualSourceName,'N/A') as DMS_to_PG_SourceName
							, isnull(stp2.ActualSourceName,'N/A') as PG_to_StageDB_SourceName
							, isnull(stp3.ActualSourceName,'N/A') as StageDB_to_DMS_SourceName

							, stp1.ExpectedRows		as DMS_to_PG_ExpectedRows
							, stp1.ActualRows		as DMS_to_PG_ActualRows
							, isnull(stp1.ExpectedRows,0) -   isnull(stp1.ActualRows,0)as DMS_to_PG_Variance
							, stp1.ErrorCount		as DMS_to_PG_ErrorCount

							, stp2.ExpectedRows		as PG_to_StageDB_ExpectedRows
							, stp2.ActualRows		as PG_to_StageDB_ActualRows
							, isnull(stp2.ExpectedRows,0) -   isnull(stp2.ActualRows,0) as PG_to_StageDB_Variance
							, stp2.ErrorCount		as PG_to_StageDB_ErrorCount

							, stp3.ExpectedRows		as StageDB_to_DMS_ExpectedRows
							, stp3.ActualRows		as StageDB_to_DMS_ActualRows
							, isnull(stp3.ExpectedRows,0) -   isnull(stp3.ActualRows,0) as StageDB_to_DMS_Variance
							, stp3.ErrorCount		as StageDB_to_DMS_ErrorCount

							, CASE WHEN (stp1.ActualSourceName = 'Missing' or stp2.ActualSourceName = 'Missing' or stp3.ActualSourceName = 'Missing' )	THEN 1 ELSE 0 END AS Step_Record_Missing
							, CASE WHEN (
											(
											( stp1.ActualSourceName is not null and isnull(stp1.ExpectedRows,0) -   isnull(stp1.ActualRows,0) <> 0 ))
											or (stp2.ActualSourceName is not null and isnull(stp2.ExpectedRows,0) -   isnull(stp2.ActualRows,0) <> 0 )
											or (stp3.ActualSourceName is not null and isnull(stp3.ExpectedRows,0) -   isnull(stp3.ActualRows,0) <> 0 )
										)																			THEN 1 ELSE 0 END AS Variance_in_Transfer
							, CASE WHEN ( stp1.ErrorCount  <> 0 or stp2.ErrorCount <> 0 or stp3.ErrorCount <> 0 )	THEN 1 ELSE 0 END AS Error_In_Transfer
					from stp1
						full outer Join stp2
							on stp1.fullDate = stp2.fullDate
							 and stp1.TargetName = stp2.SourceName
						full outer Join stp3
							on stp2.fullDate = stp3.fullDate
							 and stp2.TargetName = stp3.SourceName
				)

Select
	   TableName
	 , Variance_in_Transfer
	 , Error_In_Transfer
	 , Step_Record_Missing
	 , FullDate
	 , convert(varchar,FullDate,112) as DateKey

					, DMS_to_PG_SourceName
					, PG_to_StageDB_SourceName
					, StageDB_to_DMS_SourceName

					, DMS_to_PG_ExpectedRows
					, DMS_to_PG_ActualRows
					, DMS_to_PG_Variance
					, DMS_to_PG_ErrorCount

					, PG_to_StageDB_ExpectedRows
					, PG_to_StageDB_ActualRows
					, PG_to_StageDB_Variance
					, PG_to_StageDB_ErrorCount

					, StageDB_to_DMS_ExpectedRows
					, StageDB_to_DMS_ActualRows
					, StageDB_to_DMS_Variance
					, StageDB_to_DMS_ErrorCount

from base b
where fulldate = convert(date,getdate())
		and (
					Step_Record_Missing = 1
				OR
					Variance_in_Transfer = 1
				OR
					Error_In_Transfer = 1
			)





```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
