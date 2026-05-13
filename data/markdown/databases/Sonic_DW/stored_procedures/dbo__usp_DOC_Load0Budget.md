---
name: usp_DOC_Load0Budget
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - Doc_Budget
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

- **dbo.Doc_Budget** (U )

## Parameters

| Name                 | Type | Output | Default |
| -------------------- | ---- | ------ | ------- |
| `@EntityKey`         | int  | No     | No      |
| `@MonthStartDateKey` | int  | No     | No      |

## Definition

```sql
-- =============================================
-- Author:		Henin, Jonathan
-- Create date: 12/07/2020
-- Description:	Load a 0 Budget for a new store, from Start Date Key through the end of the year.
-- =============================================
CREATE PROCEDURE [dbo].[usp_DOC_Load0Budget]
@EntityKey INT,
@MonthStartDateKey INT = NULL

AS
-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
SET NOCOUNT ON;

BEGIN TRY
	BEGIN

	IF (@MonthStartDateKey IS NULL)
	BEGIN
		SET @MonthStartDateKey = CONVERT(CHAR(8),DATEADD(DAY,1,EOMONTH(GetDate(),-1)),112)
	END

	IF (@EntityKey = -1)
		BEGIN

		INSERT INTO [dbo].[Doc_Budget]
           ([EntityKey]
           ,[DateKey]
           ,[GroupElementSort]
           ,[GroupElement]
           ,[GroupSubElement]
           ,[Amount]
           ,[StatCount]
           ,[MetricTypeKey])
		 SELECT e.EntityKey,
		  m.StartDateKey,
		  GroupElementSort,
		  GroupElement,
		  GroupSubElement,
		  0 AS Amount,
		  0 AS StatCount,
		  3 AS MetricTypeKey
		  FROM [Sonic_DW].[dbo].[Dim_DOCMetrics]
		  CROSS JOIN
		   (SELECT DISTINCT StartDateKey
		 FROM [Sonic_DW].[dbo].[Dim_Month]
		 WHERE StartDateKey >= @MonthStartDateKey
		 AND EndDateKey <= CONVERT(CHAR(8),DATEADD(yy, DATEDIFF(yy, 0, GETDATE()) + 1, -1), 112)) AS m
		 CROSS JOIN
		   (SELECT DISTINCT DealershipLvl1EntityKey AS EntityKey FROM [Sonic_DW].[dbo].[vw_Dim_Dealership_All]) AS e
		END

	ELSE
		BEGIN

		INSERT INTO [dbo].[Doc_Budget]
			   ([EntityKey]
			   ,[DateKey]
			   ,[GroupElementSort]
			   ,[GroupElement]
			   ,[GroupSubElement]
			   ,[Amount]
			   ,[StatCount]
			   ,[MetricTypeKey])
		 SELECT @EntityKey,
		  m.StartDateKey,
		  GroupElementSort,
		  GroupElement,
		  GroupSubElement,
		  0 AS Amount,
		  0 AS StatCount,
		  3 AS MetricTypeKey
		  FROM [Sonic_DW].[dbo].[Dim_DOCMetrics]
		  CROSS JOIN
		   (SELECT DISTINCT StartDateKey
		 FROM [Sonic_DW].[dbo].[Dim_Month]
		 WHERE StartDateKey >= @MonthStartDateKey
		 AND EndDateKey <= CONVERT(CHAR(8),DATEADD(yy, DATEDIFF(yy, 0, GETDATE()) + 1, -1), 112)) AS m
		 END

	END
END TRY

BEGIN CATCH
    SELECT ERROR_NUMBER() AS ErrorNumber, ERROR_MESSAGE() AS ErrorMessage
    RETURN -1
END CATCH


```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
