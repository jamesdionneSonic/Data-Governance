---
name: spLoadTotalSTARTMORMetrics
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - StartTotalMORMetrics
  - vw_TotalStart
dependency_count: 2
parameter_count: 0
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.StartTotalMORMetrics** (U )
- **dbo.vw_TotalStart** (V )

## Definition

```sql




CREATE PROC [dbo].[spLoadTotalSTARTMORMetrics]
AS

/*********************************************************************************
Author: Sudip Karki
Description: Merges Start Other data sources to StartTotalMORMetrics table

Change Log:  1. Created on 10.23.2018


*********************************************************************************/

BEGIN
DECLARE @Summary TABLE ( [Action] VARCHAR(20));
--DECLARE @Inserts INT, @Updates INT;


MERGE StartTotalMORMetrics TGT
	USING vw_TotalStart SRC
	ON TGT.StartMetricsKey = SRC.StartMetricsKey
	AND TGT.SourceMetricsKey = SRC.SourceMetricsKey

WHEN MATCHED AND
	(ISNULL(SRC.StatCount,0) !=  ISNULL(TGT.StatCount,0)
	 OR ISNULL(SRC.Amount,0) != ISNULL(TGT.Amount,0))
THEN UPDATE SET
			TGT.StatCount		=  SRC.StatCount
		   ,TGT.Amount			=  SRC.Amount
		   ,TGT.Meta_lastDMLAction = 'U'
		   ,TGT.Meta_LastUpdateDate = GETDATE()

WHEN NOT MATCHED THEN INSERT
	 ( [StartMetricsKey]
      ,[SourceMetricsKey]
      ,[EntityKey]
      ,[FiscalDateKey]
      ,[FiscalMonthKey]
      ,[AccountMgmtKey]
      ,[DepartmentKey]
      ,[ScenarioKey]
      ,[Amount]
      ,[StatCount]
      ,[Meta_LoadDate]
      ,[UserID]
      ,[Meta_ComputerName]
      ,[Meta_LastUpdateDate]
      ,[Meta_LastDMLAction]

	  )


VALUES
	(
	   SRC.[StartMetricsKey]
      ,SRC.[SourceMetricsKey]
      ,SRC.[EntityKey]
      ,SRC.[FiscalDateKey]
      ,SRC.[FiscalMonthKey]
      ,SRC.[AccountMgmtKey]
      ,SRC.[DepartmentKey]
      ,SRC.[ScenarioKey]
      ,SRC.[Amount]
      ,SRC.[StatCount]
      ,GETDATE()
      ,USER_ID()
      ,HOST_NAME()
      ,GETDATE()
      ,'I'

	)
OUTPUT $action INTO @Summary;

INSERT INTO [ETL_Staging].[Stage].[START_MergeLog]
([Action],[RecordCount])
	SELECT
		[Action]
	   ,COUNT(*) RecordCount
	FROM @Summary
	GROUP BY [Action]

;


END







```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
