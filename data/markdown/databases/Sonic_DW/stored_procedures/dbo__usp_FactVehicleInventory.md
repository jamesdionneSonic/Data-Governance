---
name: usp_FactVehicleInventory
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - DimEntityRelationship
  - DimEntityRelationshipType
  - DimVin
  - FactVehicleInventory
  - SynWrkDimVehicleInventory
dependency_count: 5
parameter_count: 2
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.DimEntityRelationship** (U )
- **dbo.DimEntityRelationshipType** (U )
- **dbo.DimVin** (U )
- **dbo.FactVehicleInventory** (U )
- **dbo.SynWrkDimVehicleInventory** (SN)

## Parameters

| Name               | Type | Output | Default |
| ------------------ | ---- | ------ | ------- |
| `@InsertedRowCnts` | int  | Yes    | No      |
| `@UpdatedRowCnts`  | int  | Yes    | No      |

## Definition

```sql


/* ************************************************************************************ */
/* Author: Jo Carter	Date: 2018-01-17	Change: Creation							*/
/* ************************************************************************************ */

CREATE PROCEDURE [dbo].[usp_FactVehicleInventory]
(
	@InsertedRowCnts INT OUTPUT,
	@UpdatedRowCnts INT OUTPUT
)
AS
SET NOCOUNT ON;

/* variables */
CREATE TABLE #MergeDVIRowCounts (
	MergeAction VARCHAR(20)
	, [VehicleKey] [bigint] NOT NULL
	, VIN VARCHAR(20)
	, [AccountingCostAmount] [numeric](19, 4) NULL
	, [CertifiedFlag] BIT NOT NULL
	, [DeliveredFlag] [bit] NOT NULL
	, [EntityKey] INT NOT NULL
	, [InventoryAccount] [varchar](8) NULL
	, [InventoryCompany] [int] NULL
	, [InventoryStatusCode] [char](3) NOT NULL
	, [InvoiceTotalListAmount] [numeric](19, 4) NOT NULL
	, [LocationID] [int] NOT NULL
	, [NewVehicleFlag] [varchar](4) NOT NULL
	, [CurrentOdometerReading] [int] NULL
	, [StockDate] [datetime2](4) NULL
	, [StockNumber] [varchar](20) NULL
	, [TotalListAmount] [numeric](19, 4) NULL
	, [ETLExecution_ID] [int] NOT NULL
	, [Meta_ComputerName] [varchar](50) NOT NULL
	, [Meta_RowLastChangeDate] DATETIME2(7)
	, [Meta_SourceSystemName] VARCHAR(40)
	, [Meta_Src_Sys_ID] INT
	, [Meta_UserID] VARCHAR(50)
);
/* ************************************************************************************ */
/* Update EntityKey ******************************************************************* */
/* ************************************************************************************ */

UPDATE	[inv]
SET		[inv].[EntityKey] = [de].[EntityKey]
FROM	[ETL_Staging].[wrk].[DimVehicle_Inventory] AS [inv]
		INNER JOIN [DimEntityRelationship] AS [de]
			ON [inv].[EntityID] = [de].[AttributeField]
		INNER JOIN [DimEntityRelationshipType] AS [typ]
			ON [typ].[RelationshipTypeGuid] = [de].[RelationshipTypeGuid]
WHERE	[typ].[RelationshipType] = 'WebVLocationId'
		AND IsActive = 1




/* ************************************************************************************ */
/* process WebV Echo Park records ***************************************************** */
/* ************************************************************************************ */
MERGE	[dbo].[FactVehicleInventory] AS [tgt]
USING	(
		SELECT	[dvi].[VehicleKey]
				, [dvi].[Vin]
				, [dvi].[AccountingCostAmount]
				, [dvi].[CertifiedFlag]
				, [dvi].[DeliveredFlag]
				, [dvi].[EntityKey]
				, [dvi].[InventoryAccount]
				, [dvi].[InventoryCompany]
				, [dvi].[InventoryStatusCode]
				, [dvi].[InvoiceTotalListAmount]
				, [dvi].[LocationID]
				, [dvi].[NewVehicleFlag]
				, [dvi].[CurrentOdometerReading]
				, [dvi].[StockDate]
				, [dvi].[StockNumber]
				, [dvi].[TotalListAmount]
				, [dvi].[ETLExecution_ID]
				, [dvi].[Meta_ComputerName]
				, [dvi].[Meta_RowLastChangeDate]
				, [dvi].[Meta_SourceSystemName]
				, [dvi].[Meta_Src_Sys_ID]
				, [dvi].[Meta_UserID]
		FROM	(
				SELECT	[dv].[VehicleKey]
						, [dv].[Vin]
						, [dvi].[AccountingCostAmount]
						, [dvi].[CertifiedFlag]
						, [dvi].[DeliveredFlag]
						, [dvi].[EntityKey]
						, [dvi].[InventoryAccount]
						, [dvi].[InventoryCompany]
						, [dvi].[InventoryStatusCode]
						, [dvi].[InvoiceTotalListAmount]
						, [dvi].[LocationID]
						, [dvi].[NewVehicleFlag]
						, [dvi].[CurrentOdometerReading]
						, [dvi].[StockDate]
						, [dvi].[StockNumber]
						, [dvi].[TotalListAmount]
						, [dvi].[ETLExecution_ID]
						, [dvi].[Meta_ComputerName]
						, [dvi].[Meta_RowLastChangeDate]
						, [dvi].[Meta_SourceSystemName]
						, [dvi].[Meta_Src_Sys_ID]
						, [dvi].[Meta_UserID]
						/* record can be in both sources - use last change date to get last one */
						, ROW_NUMBER()
							OVER (PARTITION BY [dvi].[Vin]
								ORDER BY [dvi].[StockDate] desc,[dvi].[Meta_RowLastChangeDate] DESC) AS seq
				FROM	[SynWrkDimVehicleInventory] AS [dvi]
						inner JOIN [dbo].[DimVin] AS [dv]
							ON [dvi].[VIN] = [dv].[VIN]
				) AS dvi
		WHERE	seq = 1
		) AS [src]
			ON [tgt].[VehicleKey] = [src].[VehicleKey]
			AND [tgt].[Meta_RowIsCurrent] ='Y'


/* only update when a monitored value has changed */
/* old records can be updated -- the stock date check prevents old record changes from updating current info */
WHEN MATCHED --AND [tgt].[StockDate] <= [src].[StockDate]
		AND (
		[tgt].[AccountingCostAmount]				<> [src].[AccountingCostAmount]
		OR [tgt].[CertifiedFlag]					<> ISNULL([src].[CertifiedFlag],'')
		OR [tgt].[DeliveredFlag]					<> ISNULL([src].[DeliveredFlag],0)
		OR [tgt].[EntityKey]						!= [src].[EntityKey]
		OR ISNULL([tgt].[InventoryAccount],'')		<> ISNULL([src].[InventoryAccount],'')
		OR [tgt].[InventoryCompany]					<> [src].[InventoryCompany]
		OR [tgt].[InventoryStatusCode]				<> [src].[InventoryStatusCode]
		OR [tgt].[InvoiceTotalListAmount]			<> [src].[InvoiceTotalListAmount]
		OR [tgt].[LocationID]						<> ISNULL([src].[LocationID],-1)
		OR [tgt].[NewVehicleFlag]					<> ISNULL([src].[NewVehicleFlag],'')
		OR [tgt].[OdometerReading]					<> [src].[CurrentOdometerReading]
		OR ISNULL([tgt].[StockDate],'')				<> ISNULL([src].[StockDate],'')
		OR ISNULL([tgt].[StockNumber],'')			<> ISNULL([src].[StockNumber],'')
		OR [tgt].[TotalListAmount]					<> [src].[TotalListAmount]

		OR ([tgt].[InventoryCompany] IS NULL AND			[src].[InventoryCompany] IS NOT NULL)
		OR ([tgt].[InventoryCompany] IS NOT NULL AND		[src].[InventoryCompany] IS NULL)
		OR ([tgt].[AccountingCostAmount] is NULL AND		[src].[AccountingCostAmount] is not NULL)
		OR ([tgt].[AccountingCostAmount] is NOT NULL AND	[src].[AccountingCostAmount] is NULL)
		OR ([tgt].[InvoiceTotalListAmount] IS NOT NULL AND	[src].[InvoiceTotalListAmount] IS NULL )
		OR ([tgt].[OdometerReading] IS NULL AND				[src].[CurrentOdometerReading] IS NOT NULL)
		OR ([tgt].[OdometerReading] IS NOT NULL AND			[src].[CurrentOdometerReading] IS NULL)
		OR ([tgt].[TotalListAmount] IS NULL AND				[src].[TotalListAmount] IS NOT NULL)
		OR ([tgt].[TotalListAmount] IS NOT NULL AND			[src].[TotalListAmount] IS NULL)
	)
  THEN UPDATE SET
	[tgt].[Meta_RowIsCurrent]		= 'N'
	, [tgt].[Meta_RowExpiredDate]	= [src].[Meta_RowLastChangeDate]

/* add new records */
WHEN NOT MATCHED THEN INSERT (
	[VehicleKey]
	, [AccountingCostAmount]
	, [CertifiedFlag]
	, [DeliveredFlag]
	, [EntityKey]
	, [InventoryAccount]
	, [InventoryCompany]
	, [InventoryStatusCode]
	, [InvoiceTotalListAmount]
	, [LocationID]
	, [NewVehicleFlag]
	, [OdometerReading]
	, [StockDate]
	, [StockNumber]
	, [TotalListAmount]
	, [ETLExecution_ID]
	, [Meta_ComputerName]
	, [Meta_LoadDate]
	, [Meta_RowIsCurrent]
	, [Meta_RowEffectiveDate]
	, [Meta_RowExpiredDate]
	, [Meta_SourceSystemName]
	, [Meta_Src_Sys_ID]
	, [Meta_UserID]
	)
	VALUES (
		[src].[VehicleKey]
		, [src].[AccountingCostAmount]
		, [src].[CertifiedFlag]
		, [src].[DeliveredFlag]
		, [src].[EntityKey]
		, [src].[InventoryAccount]
		, [src].[InventoryCompany]
		, [src].[InventoryStatusCode]
		, [src].[InvoiceTotalListAmount]
		, [src].[LocationID]
		, [src].[NewVehicleFlag]
		, [src].[CurrentOdometerReading]
		, [src].[StockDate]
		, [src].[StockNumber]
		, [src].[TotalListAmount]
		, [src].[ETLExecution_ID]
		, [src].[Meta_ComputerName]
		, SYSDATETIME() -- Meta_LoadDate]
		, 'Y' --- [src].[Meta_RowIsCurrent]
		, [src].[Meta_RowLastChangeDate] -- Meta_RowEffectiveDate
		, '2999-12-31' -- [Meta_RowExpiredDate]
		, [src].[Meta_SourceSystemName]
		, [src].[Meta_Src_Sys_ID]
		, [src].[Meta_UserID]
	)
OUTPUT $ACTION, [src].* INTO #MergeDVIRowCounts;

/* capture merge counts */
SELECT	@InsertedRowCnts = [INSERT]
		,@UpdatedRowCnts = [UPDATE]
FROM	(SELECT MergeAction, 1 ROWS  FROM #MergeDVIRowCounts) AS p
PIVOT	(COUNT(rows) FOR p.MergeAction IN ([INSERT], [UPDATE])) AS pvt;


/* insert records that were end dated above */
INSERT INTO [dbo].[FactVehicleInventory] (
	[VehicleKey]
	, [AccountingCostAmount]
	, [CertifiedFlag]
	, [DeliveredFlag]
	, [EntityKey]
	, [InventoryAccount]
	, [InventoryCompany]
	, [InventoryStatusCode]
	, [InvoiceTotalListAmount]
	, [LocationID]
	, [NewVehicleFlag]
	, [OdometerReading]
	, [StockDate]
	, [StockNumber]
	, [TotalListAmount]
	, [ETLExecution_ID]
	, [Meta_ComputerName]
	, [Meta_LoadDate]
	, [Meta_RowIsCurrent]
	, [Meta_RowEffectiveDate]
	, [Meta_RowExpiredDate]
	, [Meta_SourceSystemName]
	, [Meta_Src_Sys_ID]
	, [Meta_UserID]
	)
SELECT	[src].[VehicleKey]
		, [src].[AccountingCostAmount]
		, [src].[CertifiedFlag]
		, [src].[DeliveredFlag]
		, [src].[EntityKey]
		, [src].[InventoryAccount]
		, [src].[InventoryCompany]
		, [src].[InventoryStatusCode]
		, [src].[InvoiceTotalListAmount]
		, [src].[LocationID]
		, [src].[NewVehicleFlag]
		, [src].[CurrentOdometerReading]
		, [src].[StockDate]
		, [src].[StockNumber]
		, [src].[TotalListAmount]
		, [src].[ETLExecution_ID]
		, [src].[Meta_ComputerName]
		, SYSDATETIME() -- Meta_LoadDate]
		, 'Y' --- [src].[Meta_RowIsCurrent]
		, [src].[Meta_RowLastChangeDate] -- Meta_RowEffectiveDate
		, '2999-12-31' -- [Meta_RowExpiredDate]
		, [src].[Meta_SourceSystemName]
		, [src].[Meta_Src_Sys_ID]
		, [src].[Meta_UserID]
FROM	#MergeDVIRowCounts as src
WHERE	MergeAction = 'UPDATE';

DROP TABLE #MergeDVIRowCounts;


```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
