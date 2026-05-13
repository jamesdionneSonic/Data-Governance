---
name: usp_Date_Variable_SameMonthLastYear_Recreate
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
dependency_count: 0
parameter_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Definition

```sql
-- ===============================================================================================================
-- Author:		NCARPENDER
-- Create date: 20141128
-- Description:	genereates a dataset that shows which days in the same month for last year are included to make the same day (from the var ops perspective) of the given date. This
--					table is derived primarily to support Microstrategy reports.
-- ===============================================================================================================
CREATE PROCEDURE dbo.usp_Date_Variable_SameMonthLastYear_Recreate
AS
BEGIN

	-- SET NOCOUNT ON added to prevent extra result sets from interfering with SELECT statements.
	SET NOCOUNT ON;

	-- Clean out the existing data to repopulate. This removes logging for load reasons and accounts for changes to the varops data in dim_Date.
	TRUNCATE TABLE dbo.Date_Variable_SameMonthLastYear;

	With prebase as (
							/*select base data including a last month calculation to account for date anomolies (leap year, first of the year, etc)*/
						select
							  DateKey				as DateKey
							, MonthNumberOfYear		as MonthNumber
							, CalendarYear			as CalendarYear
							, VariableOpsDayMTD		as VariableOpsDayMTD
							, VOpsDaysMonth			as TotalVarOpsDaysInMonth
						from dbo.Dim_Date
						where VOpsDaysMonth is not null /* only include dates where we have determined the VarOpsDays*/
					)
	, base as (
					/*perform functions & logic here simply to improve readability.*/
				select
					  DateKey			as DateKey
					, CalendarYear		as CalendarYear
					, VariableOpsDayMTD	as VariableOpsDayMTD
					, MonthNumber		as LastYear_Month
					, CalendarYear - 1	as LastYear

					, Case	when VariableOpsDayMTD = TotalVarOpsDaysInMonth then 1
							else 0
					  end				as LastDay

						  /*RowNumber function results will later be used to only include the first day of a var ops instance of prior months until we pass that day in the curr month.
							I.e. saturday and sundays typically have the same ops day. Only include sunday once we start looking at monday.*/
					, Row_Number() over ( partition by CalendarYear, MonthNumber, VariableOpsDayMTD order by DateKey ) as VarOpsDayIterationNumber
				from prebase
			)
	, Variable_SameLastMonth AS (
									/*find all dates in the prev month with a varops day number less than or equal to the current date.*/
									select
											  b.DateKey	as DateKey
											, d.DateKey	as DateKeyVMTDLM
									from base b
										left outer join base d
											on b.LastYear = d.CalendarYear
											 and b.LastYear_Month = d.LastYear_Month

												/*if the date selected is the last varops day of the month, include the entire set of days from last month.*/
											 and case	when b.LastDay = 1
															then 31 /*max number of days in month. This should force the entire month.*/
														else b.VariableOpsDayMTD
												 end >= d.VariableOpsDayMTD

												/*If we have multiple instances of the VarOpsDay only include the first instance. business decision.*/
											and case	when b.VariableOpsDayMTD = d.VariableOpsDayMTD then 1
														else d.VarOpsDayIterationNumber
												end = d.VarOpsDayIterationNumber
								)
	/* insert the data into the final table */
	INSERT INTO dbo.Date_Variable_SameMonthLastYear
	(DateKey,DateKeyVMTDLM)
	SELECT DISTINCT DateKey,DateKeyVMTDLM
	FROM Variable_SameLastMonth
	ORDER BY DateKey, DateKeyVMTDLM;


END

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
