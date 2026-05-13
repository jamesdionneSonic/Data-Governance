---
name: spLoadFactVehiclePurchase
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - FactVehiclePurchase
  - RemoveCharSpecialSymbolValue
dependency_count: 2
parameter_count: 2
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.FactVehiclePurchase** (U )
- **dbo.RemoveCharSpecialSymbolValue** (FN)

## Parameters

| Name               | Type | Output | Default |
| ------------------ | ---- | ------ | ------- |
| `@insertedRowCnts` | int  | Yes    | No      |
| `@updatedRowCnts`  | int  | Yes    | No      |

## Definition

```sql

/******************** CHANGE LOG ***************************************************************************
06/01/2020:  Derrick Davis - Create stored proc for MERGE insert/update
01/29/2021:  Chaitra - updated stored proc for populating the Fact_DataAudit table
03/15/2021:  Chaitra - updated stored proc for implementation of new logic for reference from DimAssociate
06/21/2021:  Shweta -  Added 'n.a' in Case statement for CRGrade
10/07/2021:  Chaitra - Used function [dbo].[RemoveCharSpecialSymbolValue] for the Colum CRGRADE
02/14/2023:  Derrick - Replaced MetaRowIsCurrent = 'Y' with EntActive = 'Active' in Dim_Entity JOINS for Purchasing and Receiving Dealer logic
************************************************************************************************************/

CREATE   PROC [dbo].[spLoadFactVehiclePurchase]
(
 @insertedRowCnts  INT OUTPUT,  --added on 01/29/2021
 @updatedRowCnts   INT OUTPUT   --added on 01/29/2021
)
AS

 BEGIN
         DECLARE @rowcounts TABLE(MergeAction VARCHAR(20)); --added on 01/29/2021
         DECLARE @insertedCount INT, @updatedCount INT;     --added on 01/29/2021


WITH Users_CTE AS ---AssociateKeys for the Users from UserProfile table  --added on 03/15/2021
(
SELECT DISTINCT ISNULL(aso.AssociateKey,-1) AS AssociateKey,
       up.EmployeeId,
       up.UserName,
       up.[UserId],
       up.Email,
       up.FirstName,
       up.LastName
FROM [SonicApplicationSupport].dbo.userprofile up
     LEFT JOIN [SonicApplicationSupport].dbo.assignedrole ar ON ar.userid = up.userid
     LEFT JOIN [SonicApplicationSupport].dbo.userrole ur ON ar.roleguid = ur.roleguid
     LEFT JOIN [SonicApplicationSupport].dbo.[application] app ON ar.targetinstance = app.applicationguid
     LEFT JOIN sonic_DW.dbo.dimassociate(NOLOCK) aso ON aso.AsoEmployeeNumber = up.EmployeeId AND aso.Meta_RowIsCurrent = 'Y'
     WHERE up.IsActive =1
)

MERGE dbo.FactVehiclePurchase TGT
USING
(
SELECT	 ISNULL(v.VehicleKey,-1) AS VehicleKey
		,ISNULL(bk.AssociateKey,-1) AS BuyerKey
		,ISNULL(lob.LineOfBusinessKey,-1) AS LineOfBusinessKey
		,ISNULL(vsk.AuctionSourceKey,-1) AS AuctionSourceKey
		,ISNULL(dpm.PurchaseMethodKey,-1) AS PurchaseMethodKey
		,ISNULL(pdk.EntityKey,-1) AS PurchasingDealerKey
		,ISNULL(dtc.TransportCompanyKey,-1) AS TransportationCompanyKey
		,ISNULL(rdk.EntityKey,-1) AS ReceivingDealerKey
		,ISNULL(mkk.MarketKey,-1) AS MarketKey
		,ISNULL(pdtk.DateKey,19000101) AS PurchaseDateKey
		,stg.PurchaseCount
		,ISNULL(stg.AuctionFee,0.0) AS AuctionFee
		,ISNULL(stg.BuyFee,0.0) AS BuyFee
		,ISNULL(stg.Cost,0.0) AS Cost
		,ISNULL(stg.CPOCost,0.0) AS CPOCost
		,ISNULL(stg.TransportCost,0.0) AS TransportCost
		,ISNULL(stg.PSIFee,0.0) AS PSIFee
		,ISNULL(stg.MHFees,0.0) AS MHFees
		,ISNULL(stg.EstimatedReconCost,0.0) AS EstimatedReconCost
		,ISNULL(stg.TotalCost,0.0) AS TotalCost
		,ISNULL(stg.RetailPrice,0.0) AS RetailPrice
		,ISNULL(stg.ProjectedProfit,0.0) AS ProjectedProfit
		,ISNULL(stg.TransportAssistAmount,0.0) AS TransportAssistAmount
		,stg.AddSonicShieldFlag
		,ISNULL(stg.SonicShieldCost,0.0) AS SonicShieldCost
		,ISNULL(stg.MSRP,0.0) AS MSRP
		,ISNULL(stg.AvgMMR,0.0) AS AverageMMR
		,ISNULL(stg.BackOfBook,0.0) AS BackOfBook
		,ISNULL(stg.MMR_ACV,0.0) AS MMRACV
		,ISNULL(stg.DMVRegistrationFee,0.0) AS DMVRegistrationFee
		,ISNULL(stg.NADAValue,0.0) AS NADAValue
		,dbo.RemoveCharSpecialSymbolValue(CASE WHEN stg.CRGrade IN ('NA','N/A','','-','n.a') THEN '0.0'
				WHEN LEFT(stg.CRGrade,1)  = '.' THEN LTRIM(RTRIM(RIGHT(stg.CRGrade, LEN(stg.CRGrade) - 1)))
				WHEN RIGHT(stg.CRGrade,1)  = '.' THEN LTRIM(RTRIM(Substring(stg.CRGrade,0, LEN(stg.CRGrade) - 0)))
				ELSE ISNULL(LTRIM(RTRIM(REPLACE(REPLACE(REPLACE(stg.CRGrade,'..','.'),'`',''),'O','0'))),'0.0')
			END) AS CRGrade --updated on 2021-10-07
		,stg.IsFullDeal
		,stg.IsAuctionClosed
		,stg.IsProcessed
		,CASE WHEN stg.IsLiveOrFixed = 'Live' THEN 1 ELSE 0 END AS IsLive
		,stg.IsBillOfSaleSent
		,stg.IsDeleted
		,stg.IsConfirmed
		,ISNULL(stg.ProcessingStatusKey,-1) AS ProcessingStatusKey
		,ISNULL(pk.AssociateKey,-1) AS ProcessedByAssociateKey
		,ISNULL(ck.AssociateKey,-1) AS CreatedByAssociateKey
		,ISNULL(mk.AssociateKey,-1) AS ModifiedByAssociateKey
		,ISNULL(codtk.DateKey,19000101) AS CreatedOnDateKey
		,ISNULL(modtk.DateKey,19000101) AS ModifiedOnDateKey
		,ISNULL(cfdtk.DateKey,19000101) AS ConfirmedDateKey
		,stg.ETLExecution_ID
		,stg.Meta_RowLastChangedDate
		,stg.Meta_LoadDate
		,stg.Meta_NaturalKey
		,stg.Meta_Src_Sys_ID
		,stg.User_ID
		,stg.Meta_ComputerName
FROM [ETL_Staging].[stage].[FactVehiclePurchaseStaging] stg
	LEFT JOIN Sonic_DW.dbo.DimVin v
	ON LTRIM(RTRIM(stg.Vin)) = LTRIM(RTRIM(v.Vin))
	LEFT JOIN Users_CTE bk ON REPLACE(stg.BuyerName,' ','.') = bk.UserName --updated on 03/15/2021
	LEFT JOIN Users_CTE ck ON REPLACE(stg.CreatedBy,' ','.') = ck.UserName --updated on 03/15/2021
	LEFT JOIN Users_CTE mk ON REPLACE(stg.ModifiedBy,' ','.') = mk.UserName --updated on 03/15/2021
	LEFT JOIN Users_CTE pk ON REPLACE(stg.ProcessedBy,' ','.') = pk.UserName --updated on 03/15/2021
	LEFT JOIN Sonic_DW.dbo.Dim_Entity pdk
		ON stg.PurchasingDealer = pdk.EntityKey
		AND pdk.EntActive = 'Active'
		--AND pdk.MetaRowIsCurrent = 'Y'
	LEFT JOIN Sonic_DW.dbo.Dim_Entity rdk
		ON stg.ReceivingDealer = rdk.EntityKey
		AND rdk.EntActive = 'Active'
		--AND rdk.MetaRowIsCurrent = 'Y'
	LEFT JOIN Sonic_DW.dbo.DimAuctionSource vsk
		ON stg.VehicleSource = vsk.Meta_Naturalkey
		AND vsk.Meta_RowIsCurrent = 'Y'
	LEFT JOIN Sonic_DW.dbo.DimPurchaseMethod dpm
		ON stg.PurchaseMethod = dpm.Meta_Naturalkey
		AND dpm.Meta_RowIsCurrent = 'Y'
	LEFT JOIN Sonic_DW.dbo.DimTransportCompany dtc
		ON stg.TransportationCompany = dtc.Meta_Naturalkey
		AND dtc.Meta_RowIsCurrent = 'Y'
	LEFT JOIN Sonic_DW.dbo.DimLineOfBusiness lob
		ON UPPER(stg.LineOfBusiness) = lob.Meta_Naturalkey
	LEFT JOIN	(
					SELECT m.MarketKey, m.MarketName, m.Meta_NaturalKey, mkm.EntityKey, mkm.MarketId
					FROM Sonic_DW.dbo.DimMarket m
					JOIN ETL_Staging.stage.CBAMarketKeyMapping mkm
					ON m.Meta_NaturalKey = mkm.MarketId
					WHERE m.Meta_RowIsCurrent = 'Y'  --added on 03/09/2021
				) mkk
		ON pdk.EntityKey = mkk.EntityKey
	LEFT JOIN [Sonic_DW].[dbo].[Dim_Date] pdtk
		ON stg.PurchaseDateKey = pdtk.DateKey
	LEFT JOIN [Sonic_DW].[dbo].[Dim_Date] codtk
		ON stg.CreatedOnDateKey = codtk.DateKey
	LEFT JOIN [Sonic_DW].[dbo].[Dim_Date] modtk
		ON stg.ModifiedOnDateKey = modtk.DateKey
	LEFT JOIN [Sonic_DW].[dbo].[Dim_Date] cfdtk
		ON stg.ConfirmedDateKey = cfdtk.DateKey
) SRC
	ON LTRIM(RTRIM(TGT.Meta_NaturalKey)) = LTRIM(RTRIM(SRC.Meta_NaturalKey))

	WHEN NOT MATCHED THEN
	INSERT
(
       [VehicleKey]
      ,[BuyerKey]
      ,[LineOfBusinessKey]
      ,[AuctionSourceKey]
      ,[PurchaseMethodKey]
      ,[PurchasingDealerKey]
      ,[TransportationCompanyKey]
      ,[ReceivingDealerKey]
      ,[MarketKey]
      ,[PurchaseDateKey]
      ,[PurchaseCount]
      ,[AuctionFee]
      ,[BuyFee]
      ,[Cost]
      ,[CPOCost]
      ,[TransportCost]
      ,[PSIFee]
      ,[MHFee]
      ,[EstimatedReconCost]
      ,[TotalCost]
      ,[RetailPrice]
      ,[ProjectedProfit]
      ,[TransportAssistAmount]
      ,[AddSonicShieldFlag]
      ,[SonicShieldCost]
      ,[MSRP]
      ,[AverageMMR]
      ,[BackOfBook]
      ,[MMRACV]
      ,[DMVRegistrationFee]
      ,[NADAValue]
      ,[CRGrade]
      ,[IsFullDeal]
      ,[IsAuctionClosed]
      ,[IsProcessed]
      ,[IsLive]
      ,[IsBillOfSaleSent]
      ,[IsDeleted]
      ,[IsConfirmed]
      ,[ProcessingStatusKey]
      ,[ProcessedByAssociateKey]
      ,[CreatedByAssociateKey]
      ,[ModifiedByAssociateKey]
      ,[CreatedOnDateKey]
      ,[ModifiedOnDateKey]
      ,[ConfirmedDateKey]
      ,[ETLExecution_ID]
      ,[Meta_Naturalkey]
      ,[Meta_RowLastChangedDate]
      ,[Meta_ComputerName]
      ,[Meta_Src_System_ID]
      ,[Meta_LoadDate]
)
VALUES
(
       SRC.[VehicleKey]
      ,SRC.[BuyerKey]
      ,SRC.[LineOfBusinessKey]
      ,SRC.[AuctionSourceKey]
      ,SRC.[PurchaseMethodKey]
      ,SRC.[PurchasingDealerKey]
      ,SRC.[TransportationCompanyKey]
      ,SRC.[ReceivingDealerKey]
      ,SRC.[MarketKey]
      ,SRC.[PurchaseDateKey]
      ,SRC.[PurchaseCount]
      ,SRC.[AuctionFee]
      ,SRC.[BuyFee]
      ,SRC.[Cost]
      ,SRC.[CPOCost]
      ,SRC.[TransportCost]
      ,SRC.[PSIFee]
      ,SRC.[MHFees]
      ,SRC.[EstimatedReconCost]
      ,SRC.[TotalCost]
      ,SRC.[RetailPrice]
      ,SRC.[ProjectedProfit]
      ,SRC.[TransportAssistAmount]
      ,SRC.[AddSonicShieldFlag]
      ,SRC.[SonicShieldCost]
      ,SRC.[MSRP]
      ,SRC.[AverageMMR]
      ,SRC.[BackOfBook]
      ,SRC.[MMRACV]
      ,SRC.[DMVRegistrationFee]
      ,SRC.[NADAValue]
      ,SRC.[CRGrade]
      ,SRC.[IsFullDeal]
      ,SRC.[IsAuctionClosed]
      ,SRC.[IsProcessed]
      ,SRC.[IsLive]
      ,SRC.[IsBillOfSaleSent]
      ,SRC.[IsDeleted]
      ,SRC.[IsConfirmed]
      ,SRC.[ProcessingStatusKey]
      ,SRC.[ProcessedByAssociateKey]
      ,SRC.[CreatedByAssociateKey]
      ,SRC.[ModifiedByAssociateKey]
      ,SRC.[CreatedOnDateKey]
      ,SRC.[ModifiedOnDateKey]
      ,SRC.[ConfirmedDateKey]
      ,SRC.[ETLExecution_ID]
      ,SRC.[Meta_Naturalkey]
      ,GETDATE()
      ,SRC.[Meta_ComputerName]
      ,SRC.Meta_Src_Sys_ID
      ,GETDATE()
)

WHEN MATCHED AND
	(
	   TGT.VehicleKey <> SRC.VehicleKey
	--OR TGT.BuyerKey <> SRC.BuyerKey --Commented On 2021-03-15
	OR TGT.LineOfBusinessKey <> SRC.LineOfBusinessKey
	OR TGT.AuctionSourceKey <> SRC.AuctionSourceKey
	OR TGT.PurchaseMethodKey <> SRC.PurchaseMethodKey
	OR TGT.PurchasingDealerKey <> SRC.PurchasingDealerKey
	OR TGT.TransportationCompanyKey <> SRC.TransportationCompanyKey
	OR TGT.ReceivingDealerKey <> SRC.ReceivingDealerKey
	OR TGT.MarketKey <> SRC.MarketKey
	OR TGT.PurchaseDateKey <> SRC.PurchaseDateKey
	OR TGT.PurchaseCount <> SRC.PurchaseCount
	OR TGT.AuctionFee <> SRC.AuctionFee
	OR TGT.BuyFee <> SRC.BuyFee
	OR TGT.Cost <> SRC.Cost
	OR TGT.CPOCost <> SRC.CPOCost
	OR TGT.TransportCost <> SRC.TransportCost
	OR TGT.PSIFee <> SRC.PSIFee
	OR TGT.MHFee <> SRC.MHFees
	OR TGT.EstimatedReconCost <> SRC.EstimatedReconCost
	OR TGT.TotalCost <> SRC.TotalCost
	OR TGT.RetailPrice <> SRC.RetailPrice
	OR TGT.ProjectedProfit <> SRC.ProjectedProfit
	OR TGT.TransportAssistAmount <> SRC.TransportAssistAmount
	OR TGT.AddSonicShieldFlag <> SRC.AddSonicShieldFlag
	OR TGT.SonicShieldCost <> SRC.SonicShieldCost
	OR TGT.MSRP <> SRC.MSRP
	OR TGT.AverageMMR <> SRC.AverageMMR
	OR TGT.BackOfBook <> SRC.BackOfBook
	OR TGT.MMRACV <> SRC.MMRACV
	OR TGT.DMVRegistrationFee <> SRC.DMVRegistrationFee
	OR TGT.NADAValue <> SRC.NADAValue
	OR TGT.CRGrade <> SRC.CRGrade
    OR TGT.[IsFullDeal]  <> SRC.[IsFullDeal]
    OR TGT.[IsAuctionClosed]  <> SRC.[IsAuctionClosed]
    OR TGT.[IsProcessed]  <> SRC.[IsProcessed]
    OR TGT.[IsLive]  <> SRC.[IsLive]
    OR TGT.[IsBillOfSaleSent]  <> SRC.[IsBillOfSaleSent]
    OR TGT.[IsDeleted]  <> SRC.[IsDeleted]
    OR TGT.[IsConfirmed]  <> SRC.[IsConfirmed]
    OR TGT.[ProcessingStatusKey]  <> SRC.[ProcessingStatusKey]
    --OR TGT.[ProcessedByAssociateKey]  <> SRC.[ProcessedByAssociateKey]--Commented On 2021-03-15
    --OR TGT.[CreatedByAssociateKey]  <> SRC.[CreatedByAssociateKey]--Commented On 2021-03-15
    --OR TGT.[ModifiedByAssociateKey]  <> SRC.[ModifiedByAssociateKey]--Commented On 2021-03-15
    OR TGT.[CreatedOnDateKey]  <> SRC.[CreatedOnDateKey]
    OR TGT.[ModifiedOnDateKey]  <> SRC.[ModifiedOnDateKey]
    OR TGT.[ConfirmedDateKey]  <> SRC.[ConfirmedDateKey]
	)
THEN UPDATE SET
	 TGT.VehicleKey = SRC.VehicleKey
	,TGT.BuyerKey = SRC.BuyerKey
	,TGT.LineOfBusinessKey = SRC.LineOfBusinessKey
	,TGT.AuctionSourceKey = SRC.AuctionSourceKey
	,TGT.PurchaseMethodKey = SRC.PurchaseMethodKey
	,TGT.PurchasingDealerKey = SRC.PurchasingDealerKey
	,TGT.TransportationCompanyKey = SRC.TransportationCompanyKey
	,TGT.ReceivingDealerKey = SRC.ReceivingDealerKey
	,TGT.MarketKey = SRC.MarketKey
	,TGT.PurchaseDateKey = SRC.PurchaseDateKey
	,TGT.PurchaseCount = SRC.PurchaseCount
	,TGT.AuctionFee = SRC.AuctionFee
	,TGT.BuyFee = SRC.BuyFee
	,TGT.Cost = SRC.Cost
	,TGT.CPOCost = SRC.CPOCost
	,TGT.TransportCost = SRC.TransportCost
	,TGT.PSIFee = SRC.PSIFee
	,TGT.MHFee = SRC.MHFees
	,TGT.EstimatedReconCost = SRC.EstimatedReconCost
	,TGT.TotalCost = SRC.TotalCost
	,TGT.RetailPrice = SRC.RetailPrice
	,TGT.ProjectedProfit = SRC.ProjectedProfit
	,TGT.TransportAssistAmount = SRC.TransportAssistAmount
	,TGT.AddSonicShieldFlag = SRC.AddSonicShieldFlag
	,TGT.SonicShieldCost = SRC.SonicShieldCost
	,TGT.MSRP = SRC.MSRP
	,TGT.AverageMMR = SRC.AverageMMR
	,TGT.BackOfBook = SRC.BackOfBook
	,TGT.MMRACV = SRC.MMRACV
	,TGT.DMVRegistrationFee = SRC.DMVRegistrationFee
	,TGT.NADAValue = SRC.NADAValue
	,TGT.CRGrade = SRC.CRGrade
    ,TGT.[IsFullDeal]  = SRC.[IsFullDeal]
    ,TGT.[IsAuctionClosed]  = SRC.[IsAuctionClosed]
    ,TGT.[IsProcessed]  = SRC.[IsProcessed]
    ,TGT.[IsLive]  = SRC.[IsLive]
    ,TGT.[IsBillOfSaleSent]  = SRC.[IsBillOfSaleSent]
    ,TGT.[IsDeleted]  = SRC.[IsDeleted]
    ,TGT.[IsConfirmed]  = SRC.[IsConfirmed]
    ,TGT.[ProcessingStatusKey]  = SRC.[ProcessingStatusKey]
    ,TGT.[ProcessedByAssociateKey]  = SRC.[ProcessedByAssociateKey]
    ,TGT.[CreatedByAssociateKey]  = SRC.[CreatedByAssociateKey]
    ,TGT.[ModifiedByAssociateKey]  = SRC.[ModifiedByAssociateKey]
    ,TGT.[CreatedOnDateKey]  = SRC.[CreatedOnDateKey]
    ,TGT.[ModifiedOnDateKey]  = SRC.[ModifiedOnDateKey]
    ,TGT.[ConfirmedDateKey]  = SRC.[ConfirmedDateKey]
    ,TGT.ETLExecution_ID=SRC.ETLExecution_ID
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

- **Last Extracted**: 2026-05-13T11:28:24.843Z
