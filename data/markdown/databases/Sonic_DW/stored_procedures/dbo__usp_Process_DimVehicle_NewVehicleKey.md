---
name: usp_Process_DimVehicle_NewVehicleKey
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - DimCustomer
  - DimVehicle
  - DimVehicleMake
  - DimVehicleModel
  - DimVehicleTrim
  - DimVin
  - FactOpportunity
dependency_count: 7
parameter_count: 0
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.DimCustomer** (U )
- **dbo.DimVehicle** (U )
- **dbo.DimVehicleMake** (U )
- **dbo.DimVehicleModel** (U )
- **dbo.DimVehicleTrim** (U )
- **dbo.DimVin** (U )
- **dbo.FactOpportunity** (U )

## Definition

```sql


CREATE   PROCEDURE [dbo].[usp_Process_DimVehicle_NewVehicleKey]

AS

BEGIN

DROP TABLE IF EXISTS #MissingVINS ;

DROP TABLE IF EXISTS #MissingVINS_Final;


select FCT.FactOpportunityKey
, VIN.Vin
, VIN.IsActiveVin
, VIN.IsValidVIN
, LTRIM(RTRIM(vchl.szVIN)) as OppVIN
, CAST(CASE WHEN vchl.szVIN NOT LIKE '%[^A-Za-z0-9]%' AND LEN(LTRIM(RTRIM(vchl.szVIN))) = 17 THEN 1 ELSE 0 END as BIT) as OppIsValidVIN
, VIN.eLeadVehID
, vchl.szVIN
, vchl.lMakeID
, vchl.szMake
, vchl.lModelID
, vchl.szModel
, vchl.szTrim
, vchl.nliClassID
, vchl.szModelClass
, vchl.dtModelYear
, vchl.[lMileage]
, vchl.dtMileage
, vchl.lMilesPerWeek
, vchl.lFirstMileage
, vchl.dtFirstMileage
, vchl.szSeries
, vchl.szInteriorColor
, vchl.szExteriorColor
, vchl.[lStockMakeID]
, vchl.lStockModelID
, vchl.lStockTrimID
, vchl.bMakeModelChanged
, vchl.lVehicleOwnerID as vchl_VehicleOwnerID
, vchl.lPersonID as vchl_PersonID
, vchl.lCompanyID as vchl_CompanyID
, vchl.szStockNumber
, vchl.curVehicleValue
, vchl.dtVehicleValue
, vchl.dtExpectedPositiveEquity
, vchl.dtExpectedPositiveEquitySet
, vchl.curPayoffvo
, vchl.dtPayoffSetvo
, vchl.curBookValue
, vchl.dtBookValueSet
, vchl.curEquity
, vchl.dtEquitySet
, vchl.bActivevo
, vchl.dtInService
, vchl.szOriginalSalespersonName
, vchl.szOriginalSalespersonLegacyID
, vchl.lOriginalSalespersonUserID
, vchl.dtEntry_VO
, vchl.dtLastEdit_VO
, vchl.lTradeInID
, vchl.lDealID as vchl_DealID
, vchl.curValueti
, vchl.bActiveti
, vchl.curPayoffti
, vchl.dtPayoffSetti
, vchl.lLicenseRegStateID
, vchl.szLicensePlateNumber
, vchl.szLicensePlateRegNumber
, vchl.szLenderName
, vchl.szLenderPhone
, vchl.szLenderAccountNumber
, vchl.lEnteredByUserIDti
, vchl.nliTitleStatus
, vchl.szTitleStatus
, vchl.curTradeAllowance
, vchl.bTradeOwnLease
, vchl.bPrimaryTrade
, vchl.szTradeComment
, vchl.bPrimary
, vchl.szValuationSource
, vchl.lAppraisedByUserID
, vchl.szTradeMake
, vchl.szTradeModel
, vchl.nliFuelTypeID
, vchl.szFuelType
, vchl.nliVehicleInteriorTypeID
, vchl.szVehicleInteriorType
, vchl.szTitleState
, vchl.curAskingPrice
, vchl.lAppraisalID
, vchl.dtAppraisal
, vchl.curValuea
, vchl.szAppraiser
, vchl.lEnteredByUserIDa
, vchl.nliAppraisalNoteID
, vchl.szAppraisalNote
, vchl.szComment
, vchl.bActivea
, vchl.bFinal
, vchl.bViewed
, vchl.szChangeReason
, vchl.dtAppraisalEntry
, vchl.dtAppraisalLastEdit
, opp.lCompanyID
, opp.lDealID
, opp.lPersonID
, opp.lSourceID
, opp.szUpType
, opp.szUpSource
, opp.szSourceDetails
, opp.nliColorID
, opp.szStatus
, opp.nliInactiveReason
, opp.szInactiveReason
, opp.dtClosed
, opp.lDealSubStatusID
, opp.szDealSubStatus
, opp.cNumberOfVehiclesSought
, opp.cNumberOfVehicleTradeIns
, opp.bNewProspect
, opp.dtProspectIn
, opp.lCurTaskID
, opp.bBeBack
, opp.dtBeBack
, opp.dtEntry
, opp.dtLastEdit
, opp.lPurchaseDetailsID
, opp.lVehicleID
, opp.lVehicleOwnerID
, opp.szLegacyDealID
, opp.dtSold
, opp.bDelivered
, opp.curPurchasePrice
, opp.curDealerProfit
, opp.curFrontGross
, opp.curBackGross
, opp.curReserve
, opp.curTotalGross
, opp.curResidual
, opp.bLeasePurchase
, opp.curDownPayment
, opp.dFinanceRate
, opp.curFinanceAmount
, opp.cTermMonths
, opp.dtFirstPayment
, opp.dtLastPayment
, opp.curMonthlyPayment
, opp.curFinalPayment
, opp.lPurchaseMileage
, opp.lEstimatedMiles
, opp.szBankName
, opp.szNewUsed
, opp.cPaymentDueDate
, opp.lAllowedLeaseMiles
, opp.curLifePremium
, opp.curAHPremium
, opp.bApproved
, opp.nliDataSourceID
, opp.szDataSource
, opp.szLegacySalespersonName
, opp.dtPost
, opp.nliDeliveryType
, opp.szDeliveryType
, opp.dtAcquired
, opp.curActualCashValue
, opp.curReconditioning
, opp.curCostpd
, opp.lDealCommentsID
, opp.lCompetitorID
, opp.szCompetitor
, opp.lSubSourceID
, opp.szSubSource
, opp.lChildCompanyID
INTO #MissingVINS
from dbo.FactOpportunity as FCT with (nolock)
inner join ETL_Staging.stage.dwFullOpportunity as opp with (nolock)
on fct.Meta_NaturalKey = CAST(opp.lDealID as varchar)
inner join ETL_Staging.stage.dwFullVehicle as vchl with (nolock)
on opp.lVehicleID = vchl.lVehicleID
--and vchl.szVIN NOT LIKE '%[^A-Za-z0-9]%'
and szMake iS NOT NULL
and szModel IS NOT NULL
left join dbo.DimVIN as VIN with (nolock)
on ltrim(rtrim(vchl.szVIN)) = VIN.VIN
left join dbo.DimVehicle as DVV with (nolock)
on VIN.VehicleKey = DVV.VehicleKey
WHERE LTRIM(RTRIM(vchl.szVIN)) <> ''
AND vchl.szVIN is not null ;


WITH MissingVINS_Final as (
SELECT ROW_NUMBER() OVER(PARTITION BY OppVIN ORDER BY OppVIN) as RowNum
, *
FROM #MissingVINS
)
SELECT *
INTO #MissingVINS_Final
FROM MissingVINS_Final
WHERE RowNum = 1;

CREATE NONCLUSTERED INDEX [ncli_MissingVINS_Final_VIN] ON #MissingVINS_Final (OppVIN ASC) ;
CREATE NONCLUSTERED INDEX [ncli_MissingVINS_Final_FactOpportunityKey] ON #MissingVINS_Final (FactOpportunityKey ASC) ;


--SELECT DISTINCT smMake
--FROM #Miss

INSERT INTO dbo.DimVIN (Vin
, IsActiveVIN
, IsValidVIN
, DmsVehid
, WebvVehid
, EPVehid
, SimsVehId
, SimsEPVehId
, VehicleMartId
, eLeadVehid
, ETLExecution_ID
, Meta_ComputerName
--, Meta_RowEffectiveDate
--, Meta_RowExpiredDate
, Meta_Src_Sys_ID
, Meta_SourceSystemName
, Meta_UserID
)
SELECT DISTINCT OppVIN as VIN
,1 as IsActiveVin
, OppIsValidVIN as IsValidVIN
, -1 as DmsVehid
, -1 as WebvVehId
, -1 as EPVehId
, -1 as SimsVehId
, -1 as SimsEPVehId
, -1 as VehicleMartId
, 2 as eLeadVehId
, -2 as ETLExecution_ID
, HOST_NAME() as Meta_ComputerName
--, GETDATE() at TIME ZONE 'Eastern Standard Time' as Meta_RowEffectiveDate
--, '9999-12-31 23:59:59.9999999' as Meta_RowExpiredDate
, 2 as Meta_Src_sys_ID
, 'eLead' as Meta_SourceSystemName
, SUSER_SNAME() as Meta_UserID
FROM #MissingVINS_Final as SRC
WHERE OppVin IS NOT NULL
AND NOT EXISTS (
SELECT 1
FROM dbo.DimVIN as DV with (nolock)
WHERE SRC.OppVIN = DV.Vin
) ;

INSERT INTO dbo.DimVehicleMake (StandardMakeDescription
, MakeDescription
, SourceMakeCode
, Meta_ComputerName
, Meta_LoadDate
, Meta_RowLastChangeDate
, Meta_UserID
)
SELECT DISTINCT szMake as StandardMakeDescription
, szMake as MakeDescription
, szMake as SOurceCodeMake
, HOST_NAME() as Meta_ComputerName
, GETDATE() AT TIME ZONE 'Eastern Standard Time' as Meta_LoadDate
, GETDATE() AT TIME ZONE 'Eastern Standard Time' as Meta_RowLastChangeDate
, SUSER_SNAME() as Meta_UserID
FROM #MissingVINS_Final as SRC
WHERE NOT EXISTS (
SELECT 1
FROM dbo.DimVehicleMake as TGT
WHERE SRC.szMake = TGT.StandardMakeDescription
AND SRC.szMake = TGT.SourceMakeCode
);

INSERT INTO dbo.DimVehicleModel (ModelDescription
, ModelCategory
, ModelSubCategory
, SourceMakeCode
, SourceModelCode
, Meta_ComputerName
, Meta_LoadDate
, Meta_RowLastChangeDate
, Meta_UserID
)
SELECT DISTINCT LTRIM(RTRIM(szModel)) as ModelDescription
, 'Needs Mapping' as ModelCategory
, 'Needs Mapping' as ModelSubCategory
, LTRIM(RTRIM(szMake)) as SourceMakeCode
, LTRIM(RTRIM(szModel)) as SourceModelCode
, HOST_NAME() as Meta_ComputerName
, GETDATE() AT TIME ZONE 'Eastern Standard Time' as Meta_LoadDate
, GETDATE() AT TIME ZONE 'Eastern Standard Time' as Meta_RowLastChangeDate
, SUSER_SNAME() as Meta_UserID
FROM #MissingVINS_Final as SRC
WHERE NOT EXISTS (
SELECT 1
FROM dbo.DimVehicleModel as TGT
WHERE LTRIM(RTRIM(szModel)) = TGT.ModelDescription
AND LTRIM(RTRIM(szMake))  = TGT.SourceMakeCode
AND LTRIM(RTRIM(szModel)) = TGT.SourceModelCode
) ;

INSERT INTO dbo.DimVehicleTrim (TrimDescription
, StandardTrimDescription
, SourceTrimCode
, SourceSystemId
, Meta_ComputerName
, Meta_LoadDate
, Meta_RowLastChangeDate
, Meta_UserID
)
SELECT DISTINCT LTRIM(RTRIM(szTrim)) as TrimDescription
, LTRIM(RTRIM(szTrim)) as StandardTrimDescription
, LTRIM(RTRIM(szTrim)) as SourceTrimCode
, 2 as SourceSystemId
, HOST_NAME() as Meta_ComputerName
, GETDATE() AT TIME ZONE 'Eastern Standard Time' as Meta_LoadDate
, GETDATE() AT TIME ZONE 'Eastern Standard Time' as Meta_RowLastChangeDate
, SUSER_SNAME() as Meta_UserID
FROM #MissingVINS_Final as SRC
WHERE NOT EXISTS (
SELECT 1
FROM dbo.DimVehicleTrim as TGT
WHERE LTRIM(RTRIM(szTrim)) = TGT.TrimDescription
AND LTRIM(RTRIM(szTrim)) = TGT.StandardTrimDescription
AND LTRIM(RTRIM(szTrim)) = TGT.SourceTrimCode
) ;

INSERT INTO dbo.DimVehicle (VehicleKey
, VehicleBodyStyleId
, VehicleCabId
, VehicleCategoryId
, VehicleChassisId
, VehicleCylinderId
, VehicleDMVCategoryId
, VehicleDriveTypeId
, VehicleEngineId
, VehicleExteriorColorId
, VehicleFuelTypeId
, VehicleInteriorColorId
, VehicleMakeId
, VehicleModelId
, VehicleModelNumberId
, VehicleRestraintsId
, VehicleSeriesID
, VehicleTransmissionId
, VehicleTrimId
, ETLExecution_ID
, Meta_ComputerName
, Meta_Src_Sys_ID
, Meta_SourceSystemWeight
, Meta_SourceSystemName
, Meta_Src_Sys_ID_Current
, Meta_SourceSystemNameCurrent
, Meta_SourceSystemWeightCurrent
, Meta_UserID
)
SELECT DISTINCT VIN.VehicleKey
, -1 as VehicleBodyStyleId
, -1 as VehicleCabId
, -1 as VehicleCategoryId
, -1 as VehicleChassisId
, -1 as VehicleCylinderId
, -1 as VehicleDMVCategoryId
, -1 as VehicleDriveTypeId
, -1 as VehicleEngineId
, -1 as VehicleExteriorColorId
, -1 as VehicleFuelTypeId
, -1 as VehicleInteriorColorId
, ISNULL(Make.VehicleMakeId,-1) as VehicleMakeId
, ISNULL(Model.VehicleModelId,-1) as VehicleModelId
, -1 as VehicleModelNumberId
, -1 as VehicleRestraintsId
, -1 as VehicleSeriesID
, -1 as VehicleTransmissionId
, ISNULL(Trim.VehicleTrimId,-1) as VehicleTrimId
, -2 as ETL_ExecutionID
, HOST_NAME() as  Meta_ComputerName
, 2 as Meta_Src_Sys_ID
, -1 as Meta_SourceSystemWeight
, 'elead' Meta_SourceSystemName
, 2 as Meta_Src_Sys_ID_Current
, 'elead' Meta_SourceSystemNameCurrent
, -1 as Meta_SourceSystemWeightCurrent
, SUSER_SNAME() Meta_UserID
FROM #MissingVINS_Final as SRC
INNER JOIN dbo.DimVIN as VIN
ON LTRIM(RTRIM(SRC.szVIN)) = VIN.Vin
LEFT JOIN (SELECT VehicleMakeId
, StandardMakeDescription
, SourceMakeCode
, Meta_RowLastChangeDate
, RANK() OVER(PARTITION BY StandardMakeDescription, SourceMakeCode ORDER BY Meta_RowLastChangeDate DESC, VehicleMakeID DESC) as Ranking
FROM dbo.DimVehicleMake
) as Make
ON LTRIM(RTRIM(szMake)) = Make.StandardMakeDescription
AND LTRIM(RTRIM(szMake)) = Make.SourceMakeCode
AND Make.Ranking = 1
LEFT JOIN (SELECT VehicleModelId
, ModelDescription
, SourceMakeCode
, SourceModelCode
, RANK() OVER(PARTITION BY ModelDescription, SourceMakeCode,SourceModelCode ORDER BY Meta_RowLastChangeDate DESC, VehicleModelId DESC) as Ranking
FROM dbo.DimVehicleModel
 ) as Model
ON LTRIM(RTRIM(szModel)) =  Model.ModelDescription
AND LTRIM(RTRIM(szModel)) = Model.SourceModelCode
AND LTRIM(RTRIM(szMake)) = Model.SourceMakeCode
AND Model.Ranking = 1
LEFT JOIN (SELECT VehicleTrimId
, TrimDescription
, StandardTrimDescription
, SourceTrimCode
, RANK() OVER(PARTITION BY TrimDescription, StandardTrimDescription, SourceTrimCode ORDER BY Meta_RowLastChangeDate DESC, VehicleTrimID DESC) as Ranking
FROM dbo.DimVehicleTrim ) as Trim
on LTRIM(RTRIM(szTrim)) = Trim.TrimDescription
AND LTRIM(RTRIM(szTrim))= Trim.StandardTrimDescription
AND LTRIM(RTRIM(szTrim)) = Trim.SourceTrimCode
AND Trim.Ranking = 1
WHERE NOT EXISTS (
SELECT 1
FROM dbo.DimVehicle as TGT
WHERE VIN.VehicleKey = TGT.VehicleKey
);

DROP TABLE IF EXISTS #MissingVehicleKeys;

DROP TABLE IF EXISTS #MissingVehicleKeys_Final;

select FCT.FactOpportunityKey
, VIN.Vin
, VIN.IsActiveVin
, VIN.IsValidVIN
, LTRIM(RTRIM(vchl.szVIN)) as OppVIN
, CAST(CASE WHEN vchl.szVIN NOT LIKE '%[^A-Za-z0-9]%' AND LEN(LTRIM(RTRIM(vchl.szVIN))) = 17 THEN 1 ELSE 0 END as BIT) as OppIsValidVIN
, VIN.eLeadVehID
, vchl.szVIN
, vchl.lMakeID
, vchl.szMake
, vchl.lModelID
, vchl.szModel
, vchl.szTrim
, vchl.nliClassID
, vchl.szModelClass
, vchl.dtModelYear
, vchl.[lMileage]
, vchl.dtMileage
, vchl.lMilesPerWeek
, vchl.lFirstMileage
, vchl.dtFirstMileage
, vchl.szSeries
, vchl.szInteriorColor
, vchl.szExteriorColor
, vchl.[lStockMakeID]
, vchl.lStockModelID
, vchl.lStockTrimID
, vchl.bMakeModelChanged
, vchl.lVehicleOwnerID as vchl_VehicleOwnerID
, vchl.lPersonID as vchl_PersonID
, vchl.lCompanyID as vchl_CompanyID
, vchl.szStockNumber
, vchl.curVehicleValue
, vchl.dtVehicleValue
, vchl.dtExpectedPositiveEquity
, vchl.dtExpectedPositiveEquitySet
, vchl.curPayoffvo
, vchl.dtPayoffSetvo
, vchl.curBookValue
, vchl.dtBookValueSet
, vchl.curEquity
, vchl.dtEquitySet
, vchl.bActivevo
, vchl.dtInService
, vchl.szOriginalSalespersonName
, vchl.szOriginalSalespersonLegacyID
, vchl.lOriginalSalespersonUserID
, vchl.dtEntry_VO
, vchl.dtLastEdit_VO
, vchl.lTradeInID
, vchl.lDealID as vchl_DealID
, vchl.curValueti
, vchl.bActiveti
, vchl.curPayoffti
, vchl.dtPayoffSetti
, vchl.lLicenseRegStateID
, vchl.szLicensePlateNumber
, vchl.szLicensePlateRegNumber
, vchl.szLenderName
, vchl.szLenderPhone
, vchl.szLenderAccountNumber
, vchl.lEnteredByUserIDti
, vchl.nliTitleStatus
, vchl.szTitleStatus
, vchl.curTradeAllowance
, vchl.bTradeOwnLease
, vchl.bPrimaryTrade
, vchl.szTradeComment
, vchl.bPrimary
, vchl.szValuationSource
, vchl.lAppraisedByUserID
, vchl.szTradeMake
, vchl.szTradeModel
, vchl.nliFuelTypeID
, vchl.szFuelType
, vchl.nliVehicleInteriorTypeID
, vchl.szVehicleInteriorType
, vchl.szTitleState
, vchl.curAskingPrice
, vchl.lAppraisalID
, vchl.dtAppraisal
, vchl.curValuea
, vchl.szAppraiser
, vchl.lEnteredByUserIDa
, vchl.nliAppraisalNoteID
, vchl.szAppraisalNote
, vchl.szComment
, vchl.bActivea
, vchl.bFinal
, vchl.bViewed
, vchl.szChangeReason
, vchl.dtAppraisalEntry
, vchl.dtAppraisalLastEdit
, opp.lCompanyID
, opp.lDealID
, opp.lPersonID
, opp.lSourceID
, opp.szUpType
, opp.szUpSource
, opp.szSourceDetails
, opp.nliColorID
, opp.szStatus
, opp.nliInactiveReason
, opp.szInactiveReason
, opp.dtClosed
, opp.lDealSubStatusID
, opp.szDealSubStatus
, opp.cNumberOfVehiclesSought
, opp.cNumberOfVehicleTradeIns
, opp.bNewProspect
, opp.dtProspectIn
, opp.lCurTaskID
, opp.bBeBack
, opp.dtBeBack
, opp.dtEntry
, opp.dtLastEdit
, opp.lPurchaseDetailsID
, opp.lVehicleID
, opp.lVehicleOwnerID
, opp.szLegacyDealID
, opp.dtSold
, opp.bDelivered
, opp.curPurchasePrice
, opp.curDealerProfit
, opp.curFrontGross
, opp.curBackGross
, opp.curReserve
, opp.curTotalGross
, opp.curResidual
, opp.bLeasePurchase
, opp.curDownPayment
, opp.dFinanceRate
, opp.curFinanceAmount
, opp.cTermMonths
, opp.dtFirstPayment
, opp.dtLastPayment
, opp.curMonthlyPayment
, opp.curFinalPayment
, opp.lPurchaseMileage
, opp.lEstimatedMiles
, opp.szBankName
, opp.szNewUsed
, opp.cPaymentDueDate
, opp.lAllowedLeaseMiles
, opp.curLifePremium
, opp.curAHPremium
, opp.bApproved
, opp.nliDataSourceID
, opp.szDataSource
, opp.szLegacySalespersonName
, opp.dtPost
, opp.nliDeliveryType
, opp.szDeliveryType
, opp.dtAcquired
, opp.curActualCashValue
, opp.curReconditioning
, opp.curCostpd
, opp.lDealCommentsID
, opp.lCompetitorID
, opp.szCompetitor
, opp.lSubSourceID
, opp.szSubSource
, opp.lChildCompanyID
INTO #MissingVehicleKeys
--SELECT *
from dbo.FactOpportunity as FCT with (nolock)
inner join ETL_Staging.stage.dwFullOpportunity as opp with (nolock)
on fct.Meta_NaturalKey = CAST(opp.lDealID as varchar)
inner join ETL_Staging.stage.dwFullVehicle as vchl with (nolock)
on opp.lVehicleID = vchl.lVehicleID
--and vchl.szVIN NOT LIKE '%[^A-Za-z0-9]%'
and szMake iS NOT NULL
and szModel IS NOT NULL
left join dbo.DimVIN as VIN with (nolock)
on ltrim(rtrim(vchl.szVIN)) = VIN.VIN
AND VIN.VehicleKey <> -1
--left join dbo.DimVehicle as DVV with (nolock)
--on VIN.VehicleKey = DVV.VehicleKey
--AND DVV.VehicleKey <> -1
WHERE LTRIM(RTRIM(vchl.szVIN)) <> ''
AND vchl.szVIN is not null ;
--AND FCT.VehicleKey = -1 ;

WITH MissingVehicleKeys_Final as (
SELECT *
,ROW_NUMBER() OVER (PARTITION BY FactOpportunityKey ORDER BY FactOpportunityKey) as RowNum
 FROM #MissingVehicleKeys
 )
 SELECT *
 INTO #MissingVehicleKeys_Final
 FROM MissingVehicleKeys_Final
 WHERE RowNum = 1;

 CREATE NONCLUSTERED INDEX [ncli_MissingVehicleKesy_Final_FactOpportunityKey] ON #MissingVehicleKeys_Final (FactOpportunityKey ASC);

DECLARE @RwCnt BIGINT = 0;


SELECT @RwCnt = COUNT(1) FROM dbo.DimCustomer;

WHILE @RwCnt > 0

BEGIN

UPDATE TOP (200000) FCT SET
NewVehicleKey = DV.VehicleKey
FROM dbo.FactOpportunity as FCT
INNER JOIN #MissingVehicleKeys_Final as SRC
ON FCT.FactOpportunityKey = SRC.FactOpportunityKey
INNER JOIN dbo.DimVIN as DV
ON SRC.OppVIN = DV.Vin
WHERE FCT.NewVehicleKey <> DV.VehicleKey

SELECT @RwCnt = @@ROWCOUNT;

END ;


END

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
