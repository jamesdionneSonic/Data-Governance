---
name: UPDATE_DIM_DATE_TBL
database: Sonic_DW
type: procedure
schema: Metric
owner: Data Team
tags:
  - procedure
  - auto-extracted
dependency_count: 1
parameter_count: 0
extracted_at: 2026-05-12T20:14:33.860Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: Metric

## Dependencies

This procedure depends on:

- **Metric.DIM_DATE_TBL** (U )

## Definition

```sql
CREATE PROCEDURE [Metric].[UPDATE_DIM_DATE_TBL]
AS

/*
----This Block of Code is Used to Reset The Metric.DIM_DATE_TBL.
----This step is not needed in a normal processing window.
DELETE metric.DIM_DATE_TBL;
DBCC CHECKIDENT ( 'metric.DIM_DATE_TBL' ,RESEED,1000 );
*/

----Declare and Set Date Variables
DECLARE @START_DATE AS DATE
	,@END_DATE AS DATE

SELECT @START_DATE = DATEADD(year, -25, DATEFROMPARTS(YEAR(GETDATE()), 1, 1));
SELECT @END_DATE = DATEADD(YEAR, 25, DATEFROMPARTS(YEAR(GETDATE()), 12, 31));

----Create Temporary table for Merge statment
CREATE TABLE #DATE_AND_DATE_IND_TBL (DIM_DATE_ID INT
	,FULL_DATE DATE
	,CURRENT_WEEK_IND INT
	,PREVIOUS_WEEK_IND INT
	,CURRENT_2_WEEK_IND INT
	,PREVIOUS_2_WEEK_IND INT
	,CURRENT_YEAR_IND INT
	,PREVIOUS_YEAR_IND INT
	,YTD_IND INT
	,PREVIOUS_MONTH_IND INT
	,CURRENT_MONTH_IND INT
	,CURRENT_MONTH_PREVIOUS_YEAR_IND INT
	,UPDATE_DATETIME DATETIME2
	,INSERT_DATETIME DATETIME2);

----CTE used to get list of Dates and populate indicator columns
WITH DateRange AS (
    SELECT CAST(@START_DATE AS DATE) AS CalendarDate
    UNION ALL
    SELECT DATEADD(DAY, 1, CalendarDate)
    FROM DateRange
    WHERE CalendarDate < @END_DATE
)
INSERT INTO #DATE_AND_DATE_IND_TBL  --Inserting into temporary table for merge step
(  DIM_DATE_ID
  ,FULL_DATE
  , CURRENT_WEEK_IND
  , PREVIOUS_WEEK_IND
  , CURRENT_2_WEEK_IND
  , PREVIOUS_2_WEEK_IND
  , CURRENT_YEAR_IND
  , PREVIOUS_YEAR_IND
  , YTD_IND
  , PREVIOUS_MONTH_IND
  , CURRENT_MONTH_IND
  , CURRENT_MONTH_PREVIOUS_YEAR_IND
  , UPDATE_DATETIME
  , INSERT_DATETIME)
/*
All date indicators are assuming the week is Monday - Sunday
*/
SELECT CONVERT(INT, CONVERT(CHAR(8), CalendarDate, 112)) DIM_DATE_ID
	,CalendarDate
	,CASE
	WHEN DateRange.CalendarDate >=  DATEADD(wk, DATEDIFF(wk, 0, GETDATE()), 0) AND DateRange.CalendarDate < DATEADD(wk, DATEDIFF(wk, 0, GETDATE()) + 1, 0)
	THEN 1
	ELSE 0
	END CURRENT_WEEK_IND
	,CASE
	WHEN DateRange.CalendarDate >=  DATEADD(wk, DATEDIFF(wk, 0, GETDATE()) -1, 0) AND DateRange.CalendarDate < DATEADD(wk, DATEDIFF(wk, 0, GETDATE()), 0)
	THEN 1
	ELSE 0
	END PREVIOUS_WEEK_IND
		,CASE
	WHEN DateRange.CalendarDate >=  DATEADD(wk, DATEDIFF(wk, 0, GETDATE()), 0) AND DateRange.CalendarDate < DATEADD(wk, DATEDIFF(wk, 0, GETDATE()) + 2, 0)
	THEN 1
	ELSE 0
	END CURRENT_2_WEEK_IND
	,CASE
	WHEN DateRange.CalendarDate >=  DATEADD(wk, DATEDIFF(wk, 0, GETDATE()) -2, 0) AND DateRange.CalendarDate < DATEADD(wk, DATEDIFF(wk, 0, GETDATE()), 0)
	THEN 1
	ELSE 0
	END PREVIOUS_2_WEEK_IND
	,CASE
	WHEN YEAR(DateRange.CalendarDate) = YEAR(GETDATE())
	THEN 1
	ELSE 0
	END CURRENT_YEAR_IND
	,CASE
	WHEN YEAR(DateRange.CalendarDate) = YEAR(GETDATE()) -1
	THEN 1
	ELSE 0
	END PREVIOUS_YEAR_IND
	,CASE
    WHEN DateRange.CalendarDate >= DATEFROMPARTS(YEAR(GETDATE()), 1, 1) -- Date is on or after Jan 1 of the current year
		AND DateRange.CalendarDate <= GETDATE()                      -- Date is on or before the current date
	THEN 1
	ELSE 0
    END AS YTD_IND
	,CASE
	WHEN DateRange.CalendarDate >= DATEADD(day, 1, EOMONTH(GETDATE(), -2)) -- First day of previous month
		AND DateRange.CalendarDate <= EOMONTH(GETDATE(), -1)             -- Last day of previous month
	THEN 1
	ELSE 0
    END AS PREVIOUS_MONTH_IND
	,CASE
	WHEN DateRange.CalendarDate >= DATEADD(month, DATEDIFF(month, 0, GETDATE()), 0) -- First day of the current month
		AND DateRange.CalendarDate < DATEADD(month, DATEDIFF(month, 0, GETDATE()) + 1, 0) -- First day of the NEXT month (exclusive end)
	THEN 1
	ELSE 0
    END AS CURRENT_MONTH_IND
	,CASE
	WHEN MONTH(DateRange.CalendarDate) = MONTH(GETDATE())        -- Month matches current month
		AND YEAR(DateRange.CalendarDate) = YEAR(GETDATE()) - 1  -- Year is the previous year
	THEN 1
	ELSE 0
	END AS CURRENT_MONTH_PREVIOUS_YEAR_IND
	,SYSDATETIME() UPDATE_DATETIME
	,SYSDATETIME() INSERT_DATETIME
FROM DateRange
ORDER BY DateRange.CalendarDate ASC
OPTION (MAXRECURSION 0); -- Use MAXRECURSION 0 for potentially large date ranges


----Prep Metric.Dim_Date_Tbl for Insert by turning off Identity Column
SET IDENTITY_INSERT metric.DIM_DATE_TBL ON;

----Merge Temporary table into Mettric.Dim_Date_tbl
----This will update existing columns or Insert new records that are in the temporary table
----Any records NOT in the temporary table will be deleted
MERGE INTO metric.DIM_DATE_TBL AS Target
USING #DATE_AND_DATE_IND_TBL AS Source
ON Target.DIM_DATE_ID = Source.DIM_DATE_ID
WHEN MATCHED
THEN UPDATE SET
		Target.FULL_DATE = Source.FULL_DATE
		,target.CURRENT_WEEK_IND = Source.CURRENT_WEEK_IND
		,Target.PREVIOUS_WEEK_IND = Source.PREVIOUS_WEEK_IND
		,Target.CURRENT_2_WEEK_IND = Source.CURRENT_2_WEEK_IND
		,Target.PREVIOUS_2_WEEK_IND = Source.PREVIOUS_2_WEEK_IND
		,Target.CURRENT_YEAR_IND = Source.CURRENT_YEAR_IND
		,Target.PREVIOUS_YEAR_IND = Source.PREVIOUS_YEAR_IND
		,Target.YTD_IND = Source.YTD_IND
		,Target.PREVIOUS_MONTH_IND = Source.PREVIOUS_MONTH_IND
		,Target.CURRENT_MONTH_IND = Source.CURRENT_MONTH_IND
		,Target.CURRENT_MONTH_PREVIOUS_YEAR_IND = Source.CURRENT_MONTH_PREVIOUS_YEAR_IND
		,Target.UPDATE_DATETIME = Source.UPDATE_DATETIME
WHEN NOT MATCHED BY TARGET THEN
	INSERT (DIM_DATE_ID, FULL_DATE, CURRENT_WEEK_IND, PREVIOUS_WEEK_IND, CURRENT_2_WEEK_IND, PREVIOUS_2_WEEK_IND, CURRENT_YEAR_IND, PREVIOUS_YEAR_IND, YTD_IND, PREVIOUS_MONTH_IND,CURRENT_MONTH_IND,CURRENT_MONTH_PREVIOUS_YEAR_IND,  UPDATE_DATETIME, INSERT_DATETIME)
	VALUES (Source.DIM_DATE_ID, Source.FULL_DATE, Source.CURRENT_WEEK_IND, Source.PREVIOUS_WEEK_IND, Source.CURRENT_2_WEEK_IND, Source.PREVIOUS_2_WEEK_IND,Source.CURRENT_YEAR_IND, Source.PREVIOUS_YEAR_IND, Source.YTD_IND,Source.PREVIOUS_MONTH_IND,Source.CURRENT_MONTH_IND,Source.CURRENT_MONTH_PREVIOUS_YEAR_IND, Source.UPDATE_DATETIME, Source.INSERT_DATETIME)
WHEN NOT MATCHED BY SOURCE THEN
	DELETE;

----Set Metric.Dim_date_tbl Identity Column back on
SET IDENTITY_INSERT metric.DIM_DATE_TBL OFF;

----Remove Temporary Table
DROP TABLE #DATE_AND_DATE_IND_TBL;

SELECT *
FROM metric.DIM_DATE_TBL

```

## Governance

- **Last Extracted**: 2026-05-12T20:14:33.860Z
