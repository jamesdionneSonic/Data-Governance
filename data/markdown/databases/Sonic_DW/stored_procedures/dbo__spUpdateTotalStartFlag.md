---
name: spUpdateTotalStartFlag
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - StartTotalMORMetrics
dependency_count: 1
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

## Definition

```sql





CREATE PROC [dbo].[spUpdateTotalStartFlag]

AS
/*********************************************************************************
Author: Sudip Karki
Description: Updates Start Other data sources LoadProcessed Flag

Change Log:  1. Created on 10.23.2018


*********************************************************************************/

BEGIN

-- Tag the processed records

UPDATE SRC
SET SRC.[Load_Processed] = 1
	FROM [Sonic_DW].[dbo].[Fact_ASI] AS SRC
	INNER JOIN [Sonic_DW].[dbo].[StartMORSource]  AS SS
		ON SS.SourceTable = 'Fact_ASI'
	INNER JOIN StartTotalMORMetrics AS TGT
		ON SRC.[ASIKey] = TGT.SourceMetricsKey
		AND SS.StartMORSourceId = TGT.StartMetricsKey
	WHERE SRC.Load_Processed = 0


UPDATE SRC
SET SRC.[Load_Processed] = 1
	FROM [Sonic_DW].[dbo].[Fact_GridPenentration] AS SRC
	INNER JOIN [Sonic_DW].[dbo].[StartMORSource]  AS SS
		ON SS.SourceTable = 'Fact_GridPenentration'
	INNER JOIN StartTotalMORMetrics AS TGT
		ON SRC.[GridPenentrationKey] = TGT.SourceMetricsKey
		AND SS.StartMORSourceId = TGT.StartMetricsKey
	WHERE SRC.Load_Processed = 0


UPDATE SRC
SET SRC.[Load_Processed] = 1
	FROM [Sonic_DW].[dbo].[Fact_HRTurnOver] AS SRC
	INNER JOIN [Sonic_DW].[dbo].[StartMORSource]  AS SS
		ON SS.SourceTable = 'Fact_HRTurnOver'
	INNER JOIN StartTotalMORMetrics AS TGT
		ON SRC.[TO_Key] = TGT.SourceMetricsKey
		AND SS.StartMORSourceId = TGT.StartMetricsKey
	WHERE SRC.Load_Processed = 0



UPDATE SRC
SET SRC.[Load_Processed] = 1
	FROM [Sonic_DW].[dbo].[Fact_HROverTime] AS SRC
	INNER JOIN [Sonic_DW].[dbo].[StartMORSource]  AS SS
		ON SS.SourceTable = 'Fact_HROverTime'
	INNER JOIN StartTotalMORMetrics AS TGT
		ON SRC.[OT_Key] = TGT.SourceMetricsKey
		AND SS.StartMORSourceId = TGT.StartMetricsKey
	WHERE SRC.Load_Processed = 0


UPDATE SRC
SET SRC.[Load_Processed] = 1
	FROM [Sonic_DW].[dbo].[Fact_StopSaleUsed] AS SRC
	INNER JOIN [Sonic_DW].[dbo].[StartMORSource]  AS SS
		ON SS.SourceTable = 'Fact_StopSaleUsed'
	INNER JOIN StartTotalMORMetrics AS TGT
		ON SRC.[StopSaleUsedKey] = TGT.SourceMetricsKey
		AND SS.StartMORSourceId = TGT.StartMetricsKey
	WHERE SRC.Load_Processed = 0


UPDATE SRC
SET SRC.[Load_Processed] = 1
	FROM [Sonic_DW].[dbo].[Fact_TradeAppraisal] AS SRC
	INNER JOIN [Sonic_DW].[dbo].[StartMORSource]  AS SS
		ON SS.SourceTable = 'Fact_TradeAppraisal'
	INNER JOIN StartTotalMORMetrics AS TGT
		ON SRC.[TradeAppraisalKey] = TGT.SourceMetricsKey
		AND SS.StartMORSourceId = TGT.StartMetricsKey
	WHERE SRC.Load_Processed = 0


UPDATE SRC
SET SRC.[Load_Processed] = 1
	FROM [Sonic_DW].[dbo].[Fact_TrafficManagement] AS SRC
	INNER JOIN [Sonic_DW].[dbo].[StartMORSource]  AS SS
		ON SS.SourceTable = 'Fact_TrafficManagement'
	INNER JOIN StartTotalMORMetrics AS TGT
		ON SRC.[TrafficManagementKey] = TGT.SourceMetricsKey
		AND SS.StartMORSourceId = TGT.StartMetricsKey
	WHERE SRC.Load_Processed = 0


UPDATE SRC
SET SRC.[Load_Processed] = 1
	FROM [Sonic_DW].[dbo].[Fact_TrafficManagementATIM] AS SRC
	INNER JOIN [Sonic_DW].[dbo].[StartMORSource]  AS SS
		ON SS.SourceTable = 'Fact_TrafficManagementATIM'
	INNER JOIN StartTotalMORMetrics AS TGT
		ON SRC.[TrafficManagementATIMKey] = TGT.SourceMetricsKey
		AND SS.StartMORSourceId = TGT.StartMetricsKey
	WHERE SRC.Load_Processed = 0


UPDATE SRC
SET SRC.[Load_Processed] = 1
	FROM [Sonic_DW].[dbo].[Fact_CustomerSatisfactionIndex] AS SRC
	INNER JOIN [Sonic_DW].[dbo].[StartMORSource]  AS SS
		ON SS.SourceTable = 'Fact_CustomerSatisfactionIndex'
	INNER JOIN StartTotalMORMetrics AS TGT
		ON SRC.[CustomerSatisfactionIndexKey] = TGT.SourceMetricsKey
		AND SS.StartMORSourceId = TGT.StartMetricsKey
	WHERE SRC.Load_Processed = 0


UPDATE SRC
SET SRC.[Load_Processed] = 1
	FROM [Sonic_DW].[dbo].[Fact_StopSale] AS SRC
	INNER JOIN [Sonic_DW].[dbo].[StartMORSource]  AS SS
		ON SS.SourceTable = 'Fact_StopSale'
	INNER JOIN StartTotalMORMetrics AS TGT
		ON SRC.[StopSaleKey] = TGT.SourceMetricsKey
		AND SS.StartMORSourceId = TGT.StartMetricsKey
	WHERE SRC.Load_Processed = 0


UPDATE SRC
SET SRC.[Load_Processed] = 1
	FROM [Sonic_DW].[dbo].[Fact_FixedOps] AS SRC
	INNER JOIN [Sonic_DW].[dbo].[StartMORSource]  AS SS
		ON SS.SourceTable = 'Fact_FixedOps'
	INNER JOIN StartTotalMORMetrics AS TGT
		ON SRC.[FixedOpsKey] = TGT.SourceMetricsKey
		AND SS.StartMORSourceId = TGT.StartMetricsKey
	WHERE SRC.Load_Processed = 0


UPDATE SRC
SET SRC.[Load_Processed] = 1
	FROM [Sonic_DW].[dbo].[Fact_TemplateData] AS SRC
	INNER JOIN [Sonic_DW].[dbo].[StartMORSource]  AS SS
		ON SS.SourceTable = 'Fact_TemplateData'
	INNER JOIN StartTotalMORMetrics AS TGT
		ON SRC.[TemplateDataKey] = TGT.SourceMetricsKey
		AND SS.StartMORSourceId = TGT.StartMetricsKey
	WHERE SRC.Load_Processed = 0

END





```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
