---
name: usp_AddDOCDates
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - Dim_Date
dependency_count: 1
parameter_count: 2
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.Dim_Date** (U )

## Parameters

| Name            | Type | Output | Default |
| --------------- | ---- | ------ | ------- |
| `@FinalDocDate` | int  | No     | No      |
| `@StartDocDate` | int  | No     | No      |

## Definition

```sql

-- Fill in the last doc date of the prior month for FinalDocDate, and the first doc date of the new month for StartDocDate
-- For example FinalDocDate = 20240305, StartDocDate = 20240307
-- For the most part FinalDocDate is 3rd business day and FirstDocDate is 5th business day

CREATE PROCEDURE [dbo].[usp_AddDOCDates]
@FinalDocDate INT,
@StartDocDate INT
As

SET NOCOUNT ON

BEGIN TRY

DECLARE @NextMonthStartDate date = DateAdd(d, 1, EOMONTH(CONVERT(CHAR(10), @StartDocDate, 120)))

----- Update Final DOC Date -----
UPDATE [dbo].[Dim_Date]
   SET [DocRolloverFlag] = 2
 WHERE DateKey = @FinalDocDate


 ---- Update Day Before Final DOC Date
 UPDATE [dbo].[Dim_Date]
   SET [DocRolloverFlag] = 4
 WHERE DateKey IN (SELECT DateKey
  FROM [Sonic_DW].[dbo].[Dim_Date]
  WHERE DayNumberOfWeek_Sun_Start BETWEEN 2 and 6 and
  datekey < @FinalDocDate
  AND datekey >= CONVERT(CHAR(8),DATEADD(DAY,1,EOMONTH(CONVERT(CHAR(10), @FinalDocDate, 120),-1)),112))



 ---- Update Off Day DOC Date
 UPDATE [dbo].[Dim_Date]
   SET [DocRolloverFlag] = 3
 WHERE DateKey > @FinalDocDate AND DateKey < @StartDocDate



 ---- Update First DOC Date
 UPDATE [dbo].[Dim_Date]
   SET [DocRolloverFlag] = 1
      ,[DocRolloverDate] = @StartDocDate
 WHERE DateKey = @StartDocDate



 ---- Update Days Inbetween DOC Dates
 UPDATE [dbo].[Dim_Date]
   SET [DocRolloverFlag] = 0
      ,[DocRolloverDate] = @StartDocDate
 WHERE DateKey > @StartDocDate
  and DateKey <= (SELECT TOP (1) DateKey FROM (SELECT TOP (4) DateKey FROM Dim_Date WHERE FullDate >= @NextMonthStartDate and DayNumberOfWeek_Sun_Start BETWEEN 2 and 6
					and IsCompanyHoliday = 'N' ORDER BY DateKey) as a ORDER BY DateKey DESC)


END TRY


BEGIN CATCH
    SELECT ERROR_NUMBER() AS ErrorNumber, ERROR_MESSAGE() AS ErrorMessage
    RETURN -1
END CATCH


SET NOCOUNT OFF

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
