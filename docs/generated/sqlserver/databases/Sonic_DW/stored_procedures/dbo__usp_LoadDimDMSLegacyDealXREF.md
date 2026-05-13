---
name: usp_LoadDimDMSLegacyDealXREF
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

/************************************************************	 exec [dbo].[usp_LoadDimDMSLegacyDealXREF]

 Created:  DMD on 8/3/2019

 CHANGE LOG:
 9/25/2019:	DMD - Added a DISTINCT in source query for MERGE and added Meta_NaturalKey in JOIN for dupes

*************************************************************/
CREATE PROCEDURE [dbo].[usp_LoadDimDMSLegacyDealXREF]
AS

SET NOCOUNT ON;

BEGIN

MERGE dbo.DimDMSLegacyDealXREF AS tgt
	USING	(
				SELECT DISTINCT
						 opp.FactOpportunityKey
						,ddx.lCompanyID
						,ddx.EntityKey
						,ddx.lDealID
						,ddx.DMSLegacyDealID
						,ddx.Status
						,ddx.EntryDateKey
						,ddx.LastEditDateKey
						,ddx.SoldDateKey
						,ddx.PurchasePriceAmount
						,ddx.DealerProfitAmount
						,ddx.FrontGrossAmount
						,ddx.BackGrossAmount
						,ddx.ReserveAmount
						,ddx.TotalGrossAmount
						,ddx.ResidualAmount
						,ddx.ActiveFlag
						,ddx.Meta_NaturalKey
						,ddx.Meta_ComputerName
						--,ddx.Meta_LoadDate
						--,ddx.Meta_RowLastChangeDate
						,ddx.User_ID
						,ddx.ETLExecution_ID
						,ddx.Meta_SourceSystemName
						,ddx.Meta_SrcSysID
				FROM ETL_Staging.load.DimDMSDealXREF ddx
				INNER JOIN Sonic_DW.dbo.FactOpportunity opp
					ON CONVERT(VARCHAR(100),ddx.lDealID) = ISNULL(LTRIM(RTRIM(opp.Meta_OriginalDealID)),'-1')
					AND ddx.EntityKey = opp.EntityKey
			) AS src
				ON tgt.FactOpportunityKey = src.FactOpportunityKey
				AND LTRIM(RTRIM(tgt.OpportunityDealID)) = CONVERT(VARCHAR(100),src.lDealID)
				AND LTRIM(RTRIM(tgt.DMSLegacyDealID)) = LTRIM(RTRIM(src.DMSLegacyDealID))
				AND LTRIM(RTRIM(tgt.Meta_NaturalKey)) = LTRIM(RTRIM(src.Meta_NaturalKey))

WHEN NOT MATCHED THEN INSERT
	(
		 FactOpportunityKey
		,EntityKey
		,OpportunityDealID
		,DMSLegacyDealID
		,[Status]
		,EntryDateKey
		,LastEditDateKey
		,SoldDateKey
		,PurchasePriceAmount
		,DealerProfitAmount
		,FrontGrossAmount
		,BackGrossAmount
		,ReserveAmount
		,TotalGrossAmount
		,ResidualAmount
		,ActiveFlag
		,Meta_NaturalKey
		,Meta_ComputerName
		,Meta_LoadDate
		,Meta_RowLastChangeDate
		,User_ID
		,ETLExecution_ID
		,Meta_SourceSystemName
		,Meta_SrcSysID
		,[Meta_LastDMLAction]
	)
	VALUES
	(
		 src.FactOpportunityKey
		,src.EntityKey
		,src.lDealID
		,src.DMSLegacyDealID
		,src.[Status]
		,src.EntryDateKey
		,src.LastEditDateKey
		,src.SoldDateKey
		,src.PurchasePriceAmount
		,src.DealerProfitAmount
		,src.FrontGrossAmount
		,src.BackGrossAmount
		,src.ReserveAmount
		,src.TotalGrossAmount
		,src.ResidualAmount
		,src.ActiveFlag
		,src.Meta_NaturalKey
		,src.Meta_ComputerName
		,GETDATE()
		,GETDATE()
		,src.User_ID
		,src.ETLExecution_ID
		,src.Meta_SourceSystemName
		,src.Meta_SrcSysID
		,'I'
	)

WHEN MATCHED
	AND		(ISNULL(tgt.Status,'') <> ISNULL(src.Status,'')
			OR ISNULL(tgt.LastEditDateKey,0) <> ISNULL(src.LastEditDateKey,0)
			OR ISNULL(tgt.SoldDateKey,0) <> ISNULL(src.SoldDateKey,0)
			OR ISNULL(tgt.PurchasePriceAmount,0) <> ISNULL(src.PurchasePriceAmount,0)
			OR ISNULL(tgt.DealerProfitAmount,0) <> ISNULL(src.DealerProfitAmount,0)
			OR ISNULL(tgt.FrontGrossAmount,0) <> ISNULL(src.FrontGrossAmount,0)
			OR ISNULL(tgt.BackGrossAmount,0) <> ISNULL(src.BackGrossAmount,0)
			OR ISNULL(tgt.TotalGrossAmount,0) <> ISNULL(src.TotalGrossAmount,0)
			OR ISNULL(tgt.ReserveAmount,0) <> ISNULL(src.ReserveAmount,0)
			OR ISNULL(tgt.ResidualAmount,0) <> ISNULL(src.ResidualAmount,0)
			OR ISNULL(tgt.ActiveFlag,1) <> ISNULL(src.ActiveFlag,1)
			)
THEN UPDATE SET
		 tgt.Status = src.Status
		,tgt.LastEditDateKey = src.LastEditDateKey
		,tgt.SoldDateKey = src.SoldDateKey
		,tgt.PurchasePriceAmount = src.PurchasePriceAmount
		,tgt.DealerProfitAmount = src.DealerProfitAmount
		,tgt.FrontGrossAmount = src.FrontGrossAmount
		,tgt.BackGrossAmount = src.BackGrossAmount
		,tgt.TotalGrossAmount = src.TotalGrossAmount
		,tgt.ReserveAmount = src.ReserveAmount
		,tgt.ResidualAmount = src.ResidualAmount
		,tgt.ActiveFlag = src.ActiveFlag
		,tgt.Meta_RowLastChangeDate = GETDATE()
		,tgt.Meta_LastDMLAction = 'U'
;END
```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
