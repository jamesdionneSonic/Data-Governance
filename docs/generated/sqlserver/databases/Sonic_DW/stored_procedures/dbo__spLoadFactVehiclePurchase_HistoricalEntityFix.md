---
name: spLoadFactVehiclePurchase_HistoricalEntityFix
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

/******************** CHANGE LOG ***************************************************************************
02/14/2023:  Derrick Davis - Create stored proc for MERGE insert/update for historical EntityKey fixes
************************************************************************************************************/

CREATE PROC [dbo].[spLoadFactVehiclePurchase_HistoricalEntityFix]
(
 @insertedRowCnts  INT OUTPUT,  --added on 01/29/2021
 @updatedRowCnts   INT OUTPUT   --added on 01/29/2021
)
AS

 BEGIN
         DECLARE @rowcounts TABLE(MergeAction VARCHAR(20)); --added on 01/29/2021
         DECLARE @insertedCount INT, @updatedCount INT;     --added on 01/29/2021


MERGE dbo.FactVehiclePurchase TGT
USING
(
SELECT * FROM
(
SELECT	 ISNULL(pdk.EntityKey,-1) AS PurchasingDealerKey
		,ISNULL(rdk.EntityKey,-1) AS ReceivingDealerKey
		,ISNULL(mkk.MarketKey,-1) AS MarketKey
		--,stg.ETLExecution_ID
		,stg.Meta_RowLastChangedDate
		,stg.Meta_LoadDate
		,stg.Meta_NaturalKey
		--,stg.Meta_Src_Sys_ID
		--,stg.User_ID
		--,stg.Meta_ComputerName
		,ROW_NUMBER() OVER(PARTITION BY stg.Meta_NaturalKey ORDER BY ISNULL(pdk.EntityKey,-1) DESC,ISNULL(rdk.EntityKey,-1) DESC, ISNULL(mkk.MarketKey,-1) DESC) AS rn
FROM [ETL_Staging].[stage].[FactVehiclePurchaseStaging_HISTEntityKeyFix] stg
	LEFT JOIN Sonic_DW.dbo.Dim_Entity pdk
		ON stg.PurchasingDealer = pdk.EntityKey
		--AND pdk.MetaRowIsCurrent = 'Y'
	LEFT JOIN Sonic_DW.dbo.Dim_Entity rdk
		ON stg.ReceivingDealer = rdk.EntityKey
		--AND rdk.MetaRowIsCurrent = 'Y'
	LEFT JOIN	(
					SELECT m.MarketKey, m.MarketName, m.Meta_NaturalKey, mkm.EntityKey, mkm.MarketId
					FROM Sonic_DW.dbo.DimMarket m
					JOIN ETL_Staging.stage.CBAMarketKeyMapping mkm
					ON m.Meta_NaturalKey = mkm.MarketId
					WHERE m.Meta_RowIsCurrent = 'Y'  --added on 03/09/2021
				) mkk
		ON pdk.EntityKey = mkk.EntityKey
	) a
	WHERE rn = 1 --stg.Meta_NaturalKey LIKE '19%300'
) SRC
	ON LTRIM(RTRIM(TGT.Meta_NaturalKey)) = LTRIM(RTRIM(SRC.Meta_NaturalKey))


WHEN MATCHED AND
	(
		TGT.PurchasingDealerKey <> SRC.PurchasingDealerKey
	OR TGT.ReceivingDealerKey <> SRC.ReceivingDealerKey
	OR TGT.MarketKey <> SRC.MarketKey
	)
THEN UPDATE SET
	 TGT.PurchasingDealerKey = CASE WHEN SRC.PurchasingDealerKey = -1 AND TGT.PurchasingDealerKey <> -1 THEN TGT.PurchasingDealerKey ELSE SRC.PurchasingDealerKey END
	,TGT.ReceivingDealerKey = CASE WHEN SRC.ReceivingDealerKey = -1 AND TGT.ReceivingDealerKey <> -1 THEN TGT.ReceivingDealerKey ELSE SRC.ReceivingDealerKey END
	,TGT.MarketKey = CASE WHEN SRC.MarketKey = -1 AND TGT.MarketKey <> -1 THEN TGT.MarketKey ELSE SRC.MarketKey END
    ,TGT.[Meta_RowLastChangedDate] = GETDATE()
    OUTPUT $ACTION                                     --added on 01/29/2021
    INTO @rowcounts;


		SELECT @insertedCount = [INSERT]
			,@updatedCount = [UPDATE]
		FROM (
			SELECT MergeAction
				,1 ROWS FROM @rowcounts
			) AS p
		PIVOT(COUNT(rows) FOR p.MergeAction IN (
					[INSERT]
					,[UPDATE]
					)) AS pvt

         SELECT @insertedRowCnts = isnull(@insertedcount, 0) ,
                @updatedRowCnts = isnull(@updatedCount, 0)
END
;

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
