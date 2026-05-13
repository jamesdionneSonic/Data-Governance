---
name: usp_LoadSameDayAppointments_MetricDataModel
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - DIM_METRIC_ATTRIBUTE_TBL
  - DIM_METRIC_TBL
  - EDWH_METRIC_TBL
dependency_count: 3
parameter_count: 3
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **Metric.DIM_METRIC_ATTRIBUTE_TBL** (U )
- **Metric.DIM_METRIC_TBL** (U )
- **Metric.EDWH_METRIC_TBL** (U )

## Parameters

| Name               | Type | Output | Default |
| ------------------ | ---- | ------ | ------- |
| `@ReadRowCnts`     | int  | Yes    | No      |
| `@InsertedRowCnts` | int  | Yes    | No      |
| `@UpdatedRowCnts`  | int  | Yes    | No      |

## Definition

```sql

-- =================================================
-- Author:       DMD
-- Create date:  09/25/2025
--
-- =================================================
CREATE   PROCEDURE [dbo].[usp_LoadSameDayAppointments_MetricDataModel]
(
	@ReadRowCnts INT OUTPUT,
	@InsertedRowCnts INT OUTPUT,
	@UpdatedRowCnts INT OUTPUT
)

AS


/* variables */
DECLARE @RowCounts TABLE (MergeAction VARCHAR(20));

---CREATE TEMP TBL FOR RAW DATA
create table #TEMP_RAW_DATA_TBL (DATE date
    ,DATE_TIME datetime2
    ,DEALERSHIP_ID varchar(75)
    ,METRIC_ATTRIBUTE varchar(75)
    ,METRIC_NAME varchar(75)
    ,METRIC_TOTAL varchar(75)
    ,METRIC_DATA_TYPE varchar(75)
    )

----LOAD RAW DATA
insert into #TEMP_RAW_DATA_TBL
(
    DATE
  , DATE_TIME
  , DEALERSHIP_ID
  , METRIC_ATTRIBUTE
  , METRIC_NAME
  , METRIC_TOTAL
  , METRIC_DATA_TYPE
)
SELECT	DISTINCT
		s.ApptDate AS [DATE]
		,CONVERT(DATETIME,s.ApptDate) AS [DATE_TIME]
		--,d.DEALERSHIP_NAME
		,d.DEALERSHIP_ID
		--,e.EntityKey
		,NULL AS METRIC_ATTRIBUTE
		,m.[METRIC_DESC] AS METRIC_NAME
		,s.SameDayAppts AS METRIC_TOTAL
		,'INT' AS METRIC_DATA_TYPE
FROM ETL_Staging.[dbo].[StageSameDayAppt] s
INNER JOIN Sonic_DW.dbo.Dim_Entity e
	ON s.lChildCompanyID = ISNULL(e.EntEleadNewID,e.EntEleadID)
INNER JOIN [Sonic_DW].[Metric].[DIM_DEALERSHIP_TBL] d
	ON e.EntityKey = d.ENTITY_KEY
	AND d.ACTIVE_IND = 1
INNER JOIN [Sonic_DW].[Metric].[DIM_METRIC_TBL] m
	ON m.METRIC_CODE = 'TSDA_SDA'
	AND m.METRIC_TYPE = 'TURBO_Same_Day_Appointments'
	AND m.ACTIVE_IND = 1
ORDER BY d.DEALERSHIP_ID, ApptDate

----CREATE SOURCE FOR MERGE STMT
create table #MERGE_SOURCE_TBL (DEALERSHIP_ID varchar(75)
    ,DIM_METRIC_ID int
    ,DIM_METRIC_ATTRIBUTE_ID INT
    ,METRIC_CAPTURE_DATE date
    ,METRIC_CAPTURE_DATETIME datetime2
    ,METRIC_VALUE varchar(75)
    ,METRIC_DATATYPE varchar(75)
    )

----INSERT INTO MERGE SOURCE TBL
insert into #MERGE_SOURCE_TBL
(
    DEALERSHIP_ID
  , DIM_METRIC_ID
  , DIM_METRIC_ATTRIBUTE_ID
  , METRIC_CAPTURE_DATE
  , METRIC_CAPTURE_DATETIME
  , METRIC_VALUE
  , METRIC_DATATYPE
)
select R.DEALERSHIP_ID
    , M.DIM_METRIC_ID
    , MA.DIM_METRIC_ATTRIBUTE_ID
    , DATE METRIC_CAPTURE_DATE
    , DATE_TIME METRIC_CAPTURE_DATETIME
    , METRIC_TOTAL METRIC_VALUE
    , METRIC_DATA_TYPE METRIC_DATATYPE
from #TEMP_RAW_DATA_TBL R
    inner join Metric.DIM_METRIC_TBL M on R.METRIC_NAME = M.METRIC_DESC
    left join Metric.DIM_METRIC_ATTRIBUTE_TBL MA on M.DIM_METRIC_ID = MA.DIM_METRIC_ID and R.METRIC_ATTRIBUTE = MA.ATTRIBUTE_DESC


----CREATE MERGE STEP
merge Metric.EDWH_METRIC_TBL as Target
using #MERGE_SOURCE_TBL as SOURCE
on Target.DEALERSHIP_ID = SOURCE.DEALERSHIP_ID
    and Target.DIM_METRIC_ID = SOURCE.DIM_METRIC_ID
    and isnull(Target.DIM_METRIC_ATTRIBUTE_ID, -1) = isnull(SOURCE.DIM_METRIC_ATTRIBUTE_ID, -1)
    and Target.METRIC_CAPTURE_DATE = SOURCE.METRIC_CAPTURE_DATE
    and Target.METRIC_CAPTURE_DATETIME = Source.METRIC_CAPTURE_DATETIME
when matched then
    update set
        Target.METRIC_VALUE = source.METRIC_VALUE
        ,Target.METRIC_DATATYPE = SOURCE.METRIC_DATATYPE
        ,Target.UPDATE_DATETIME = sysdatetime()
when not matched then
    insert (DEALERSHIP_ID, DIM_METRIC_ID, DIM_METRIC_ATTRIBUTE_ID, METRIC_CAPTURE_DATE, METRIC_CAPTURE_DATETIME, METRIC_VALUE, METRIC_DATATYPE)
    values (SOURCE.DEALERSHIP_ID, SOURCE.DIM_METRIC_ID, SOURCE.DIM_METRIC_ATTRIBUTE_ID, SOURCE.METRIC_CAPTURE_DATE, SOURCE.METRIC_CAPTURE_DATETIME, SOURCE.METRIC_VALUE, SOURCE.METRIC_DATATYPE)

OUTPUT $ACTION INTO @RowCounts;

/* collect merge counts */
SELECT	@ReadRowCnts = [READ]
		, @InsertedRowCnts = [INSERT]
		, @UpdatedRowCnts = [UPDATE]
FROM	(SELECT MergeAction, 1 ROWS  FROM @RowCounts) AS p
PIVOT	(COUNT(rows) FOR p.MergeAction IN ([READ],[INSERT], [UPDATE])) AS pvt;


----SCRIPT CLEAN UP
drop table #TEMP_RAW_DATA_TBL
drop table #MERGE_SOURCE_TBL


```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
