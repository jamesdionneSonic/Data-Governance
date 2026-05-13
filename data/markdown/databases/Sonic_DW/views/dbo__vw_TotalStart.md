---
name: vw_TotalStart
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
column_count: 11
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Columns

| Name               | Type    | Nullable | Description |
| ------------------ | ------- | -------- | ----------- |
| `StartMetricsKey`  | int     | ✓        |             |
| `SourceMetricsKey` | bigint  |          |             |
| `EntityKey`        | int     |          |             |
| `FiscalDateKey`    | int     | ✓        |             |
| `FiscalMonthKey`   | int     | ✓        |             |
| `AccountMgmtKey`   | int     | ✓        |             |
| `DepartmentKey`    | int     | ✓        |             |
| `ScenarioKey`      | int     | ✓        |             |
| `StatCount`        | decimal | ✓        |             |
| `Amount`           | decimal | ✓        |             |
| `Load_Processed`   | int     | ✓        |             |

## Definition

```sql







CREATE View [dbo].[vw_TotalStart] AS

/*********************************************************************************
Author: Sudip Karki
Description: Preps Start Other data sources to be loaded to StartTotalMORMetrics

Change Log:  1. Created on 10.23.2018


*********************************************************************************/

WITH TotalStart
AS
(SELECT
		SS.[StartMORSourceId] AS StartMetricsKey
		,[ASIKey] AS SourceMetricsKey
	   ,[EntityKey]
	   ,CAST(CAST([FiscalMonthKey] AS VARCHAR) + '01' AS INT) AS FiscalDateKey
	   ,FiscalMonthKey
	   ,[AccountMgmtKey]
	   ,[DepartmentKey]
	   ,[ScenarioKey]
	   ,[StatCount]
	   ,[Amount]
	   ,[Load_Processed]
	FROM [Sonic_DW].[dbo].[Fact_ASI] AS FA
	INNER JOIN [Sonic_DW].[dbo].[StartMORSource]  AS SS
	ON SS.SourceTable = 'Fact_ASI'
	WHERE Load_Processed = 0


	UNION

	SELECT
		SS.[StartMORSourceId] AS StartMetricsKey
		,[GridPenentrationKey] AS SourceMetricsKey
	   ,[EntityKey]
	   ,CAST(CAST([FiscalMonthKey] AS VARCHAR) + '01' AS INT) AS FiscalDateKey
	   ,FiscalMonthKey
	   ,[AccountMgmtKey]
	   ,[DepartmentKey]
	   ,[ScenarioKey]
	   ,[StatCount]
	   ,[Amount]
	   ,[Load_Processed]
	FROM [Sonic_DW].[dbo].[Fact_GridPenentration] AS FG
	INNER JOIN [Sonic_DW].[dbo].[StartMORSource]  AS SS
	ON SS.SourceTable = 'Fact_GridPenentration'
	WHERE Load_Processed = 0

	UNION

	SELECT
		SS.[StartMORSourceId] AS StartMetricsKey
		,[TO_Key] AS SourceMetricsKey
	   ,[EntityKey]
	   ,CAST(CAST([FiscalMonthKey] AS VARCHAR) + '01' AS INT) AS FiscalDateKey
	   ,FiscalMonthKey
	   ,[AccountMgmtKey]
	   ,[DepartmentKey]
	   ,[ScenarioKey]
	   ,[StatCount]
	   ,[Amount]
	   ,[Load_Processed]
	FROM [Sonic_DW].[dbo].[Fact_HRTurnOver] AS FHT
	INNER JOIN [Sonic_DW].[dbo].[StartMORSource]  AS SS
	ON SS.SourceTable = 'Fact_HRTurnOver'
	WHERE Load_Processed = 0

	UNION

	SELECT
		SS.[StartMORSourceId] AS StartMetricsKey
		,[OT_Key] AS SourceMetricsKey
	   ,[EntityKey]
	   ,CAST(CAST([FiscalMonthKey] AS VARCHAR) + '01' AS INT) AS FiscalDateKey
	   ,FiscalMonthKey
	   ,[AccountMgmtKey]
	   ,[DepartmentKey]
	   ,[ScenarioKey]
	   ,[StatCount]
	   ,[Amount]
	   ,[Load_Processed]
	FROM [Sonic_DW].[dbo].[Fact_HROverTime] AS FOT
	INNER JOIN [Sonic_DW].[dbo].[StartMORSource]  AS SS
	ON SS.SourceTable = 'Fact_HROverTime'
	WHERE Load_Processed = 0

	UNION

	SELECT
	    SS.[StartMORSourceId] AS StartMetricsKey
	   ,[StopSaleUsedKey] AS SourceMetricsKey
	   ,[EntityKey]
	   ,DateKey AS FiscalDateKey
	   ,FiscalMonthKey
	   ,[AccountMgmtKey]
	   ,[DepartmentKey]
	   ,[ScenarioKey]
	   ,[StatCount]
	   ,[Amount]
	   ,[Load_Processed]
	FROM [Sonic_DW].[dbo].[Fact_StopSaleUsed] AS FSSU
	INNER JOIN [Sonic_DW].[dbo].[StartMORSource]  AS SS
	ON SS.SourceTable = 'Fact_StopSaleUsed'
	WHERE Load_Processed = 0

	UNION

	SELECT
	    SS.[StartMORSourceId] AS StartMetricsKey
	   ,[TradeAppraisalKey] AS SourceMetricsKey
	   ,[EntityKey]
	   ,DateKey AS FiscalDateKey
	   ,FiscalMonthKey
	   ,[AccountMgmtKey]
	   ,[DepartmentKey]
	   ,[ScenarioKey]
	   ,[StatCount]
	   ,[Amount]
	   ,[Load_Processed]
	FROM [Sonic_DW].[dbo].[Fact_TradeAppraisal] AS FTU
	INNER JOIN [Sonic_DW].[dbo].[StartMORSource]  AS SS
	ON SS.SourceTable = 'Fact_TradeAppraisal'
	WHERE Load_Processed = 0

	UNION

	SELECT
	    SS.[StartMORSourceId] AS StartMetricsKey
	   ,[TrafficManagementKey] AS SourceMetricsKey
	   ,[EntityKey]
	   ,DateKey AS FiscalDateKey
	   ,FiscalMonthKey
	   ,[AccountMgmtKey]
	   ,[DepartmentKey]
	   ,[ScenarioKey]
	   ,[StatCount]
	   ,[Amount]
	   ,[Load_Processed]
	FROM [Sonic_DW].[dbo].[Fact_TrafficManagement] AS FTM
	INNER JOIN [Sonic_DW].[dbo].[StartMORSource]  AS SS
	ON SS.SourceTable = 'Fact_TrafficManagement'
	WHERE FTM.DateKey > cast(replace(cast( eomonth(cast (cast(FTM.DateKey as varchar)as date)) as varchar ),'-','') as int) -5
	AND Load_Processed = 0

	UNION

	SELECT
	    SS.[StartMORSourceId] AS StartMetricsKey
	   ,[TrafficManagementATIMKey] AS SourceMetricsKey
	   ,[EntityKey]
	   ,DateKey AS FiscalDateKey
	   ,FiscalMonthKey
	   ,[AccountMgmtKey]
	   ,[DepartmentKey]
	   ,[ScenarioKey]
	   ,[StatCount]
	   ,[Amount]
	   ,[Load_Processed]
	 FROM [Sonic_DW].[dbo].[Fact_TrafficManagementATIM] AS FTIM
	INNER JOIN [Sonic_DW].[dbo].[StartMORSource]  AS SS
	ON SS.SourceTable = 'Fact_TrafficManagementATIM'
	WHERE Load_Processed = 0

	UNION

	SELECT
	    SS.[StartMORSourceId] AS StartMetricsKey
	   ,[CustomerSatisfactionIndexKey] AS SourceMetricsKey
	   ,[EntityKey]
	   ,CAST(CAST([FiscalMonthKey] AS VARCHAR) + '01' AS INT) AS FiscalDateKey
	   ,FiscalMonthKey
	   ,[AccountMgmtKey]
	   ,[DepartmentKey]
	   ,[ScenarioKey]
	   ,[StatCount]
	   ,[Amount]
	   ,[Load_Processed]
	FROM [Sonic_DW].[dbo].[Fact_CustomerSatisfactionIndex] AS FCI
	INNER JOIN [Sonic_DW].[dbo].[StartMORSource]  AS SS
	ON SS.SourceTable = 'Fact_CustomerSatisfactionIndex'
	WHERE Load_Processed = 0

	UNION

	SELECT
		SS.[StartMORSourceId] AS StartMetricsKey
	   ,[StopSaleKey] AS SourceMetricsKey
	   ,[EntityKey]
	   ,CAST(CAST([FiscalMonthKey] AS VARCHAR) + '01' AS INT) AS FiscalDateKey
	   ,FiscalMonthKey
	   ,[AccountMgmtKey]
	   ,[DepartmentKey]
	   ,[ScenarioKey]
	   ,[StatCount]
	   ,[Amount]
	   ,[Load_Processed]
	FROM [Sonic_DW].[dbo].[Fact_StopSale] AS FSS
	INNER JOIN [Sonic_DW].[dbo].[StartMORSource]  AS SS
	ON SS.SourceTable = 'Fact_StopSale'
	WHERE Load_Processed = 0

	UNION

	SELECT
	   SS.[StartMORSourceId] AS StartMetricsKey
	   ,[FixedOpsKey] AS SourceMetricsKey
	   ,[EntityKey]
	   ,CAST(CAST([FiscalMonthKey] AS VARCHAR) + '01' AS INT) AS FiscalDateKey
	   ,FiscalMonthKey
	   ,[AccountMgmtKey]
	   ,[DepartmentKey]
	   ,[ScenarioKey]
	   ,[StatCount]
	   ,[Amount]
       ,[Load_Processed]
	FROM [Sonic_DW].[dbo].[Fact_FixedOps] AS FOP
	INNER JOIN [Sonic_DW].[dbo].[StartMORSource]  AS SS
	ON SS.SourceTable = 'Fact_FixedOps'
	WHERE Load_Processed = 0

	UNION

	SELECT
	   SS.[StartMORSourceId] AS StartMetricsKey
	   ,[TemplateDataKey] AS SourceMetricsKey
	   ,[EntityKey]
	   ,CAST(CAST([FiscalMonthKey] AS VARCHAR) + '01' AS INT) AS FiscalDateKey
	   ,FiscalMonthKey
	   ,[AccountMgmtKey]
	   ,[DepartmentKey]
	   ,[ScenarioKey]
	   ,[StatCount]
	   ,[Amount]
       ,[Load_Processed]
	FROM [Sonic_DW].[dbo].[Fact_TemplateData] AS FTD
	INNER JOIN [Sonic_DW].[dbo].[StartMORSource]  AS SS
	ON SS.SourceTable = 'Fact_TemplateData'
	WHERE Load_Processed = 0

	)
SELECT
	*
FROM TotalStart










```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
