---
name: usp_Process_Dim_Vehicle_VehicleKey
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - Dim_Vehicle
  - FactOpportunity
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

- **dbo.Dim_Vehicle** (U )
- **dbo.FactOpportunity** (U )

## Definition

```sql






CREATE   PROCEDURE [dbo].[usp_Process_Dim_Vehicle_VehicleKey]

AS


BEGIN

DROP TABLE IF EXISTS #MissingVINS;

DROP TABLE IF EXISTS #MissingVINS_Final;


SELECT DV.VehicleKey
, DV.vehVIN
, vchl.lVehicleID as vchl_lVehicleID
, CAST(CASE WHEN vchl.szVIN NOT LIKE '%[^A-Za-z0-9]%' AND LEN(LTRIM(RTRIM(vchl.szVIN))) = 17 THEN 1 ELSE 0 END as BIT) as IsValidVIN
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
--, vchl.DeltaHash
--, vchl.SysStartTime
--, vchl.SysEndTime
--, vchl.FortellisTradeInGUID
--, vchl.HistoricalPurge
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
--, opp.DeltaHash
--, opp.SysStartTime
--, opp.SysEndTime
--, opp.szComments
--, opp.FortellisDealGUID
--, opp.HistoricalPurge
--, opp.dtSubStatusChange
, fct.FactOpportunityKey
--, fct.*
--SELECT *
INTO #MissingVINS
from dbo.FactOpportunity as fct with (nolock)
inner join ETL_Staging.stage.dwFullOpportunity as opp with (nolock)
on fct.Meta_NaturalKey = CAST(opp.lDealID as varchar)
and fct.VehicleKey = -1
inner join ETL_Staging.stage.dwFullVehicle as vchl with (nolock)
on opp.lVehicleID = vchl.lVehicleID
--and vchl.szVIN NOT LIKE '%[^A-Za-z0-9]%'
and szMake iS NOT NULL
and szModel IS NOT NULL
LEFT JOIN dbo.Dim_Vehicle as DV with (nolock)
on vchl.szVIN = DV.vehVIN
WHERE DV.VehicleKey is null
AND LTRIM(RTRIM(vchl.szVIN)) <> ''
AND vchl.szVIN is not null ;

WITH MissingVINS_Final as (
SELECT ROW_NUMBER() OVER(PARTITION BY szVIN ORDER BY szVIN) as RowNum
, *
FROM #MissingVINS
)
SELECT *
INTO #MissingVINS_Final
FROM MissingVINS_Final
WHERE RowNum = 1;

CREATE NONCLUSTERED INDEX [ncli_MissingVINS_Final_VIN] ON #MissingVINS_Final (szVIN ASC);

CREATE NONCLUSTERED INDEX [ncli_MissingVINS_Final_FactOpportunityKey] ON #MissingVINS_Final (FactOpportunityKey ASC);


--LX 4dr Sedan

INSERT INTO dbo.Dim_Vehicle (VehVIN
, VehNewUsed
, VehCategory
, VehDMVCategory
, vehMakeCode
, VehMakeDesc
, VehModelCode
, VehModelDesc
, VehModelYear
, VehSeriesCode
, VehSeriesDesc
, VehInteriorColorCode
, VehInteriorColorDesc
, VehExteriorColorCode
, VehExteriorColorDesc
, VehTransmissionDesc
, VehNumberOfCylinders
, VehNumberOfDoors
, VehCurrentMileage
, VehLastSoldDate
, IsValidVin
, ETLExecution_ID
, Meta_Src_Sys_ID
, [User_ID]
, Meta_ComputerName
, Meta_SourceSystemName
, Meta_LoadDate
, Meta_RowEffectiveDate
, Meta_RowIsCurrent
, Meta_RowLastChangedDate
, Meta_AuditKey
, Meta_NaturalKey
)
SELECT LTRIM(RTRIM(szVIN)) as VehVIN
, CASE WHEN LTRIM(RTRIM(szNewUsed)) = 'U' THEN 'USED'
	   WHEN LTRIM(RTRIM(szNewUsed)) = 'N' THEN 'NEW'
	   ELSE NULL END as VehNewUsed
, CAST(NULL as varchar(1)) as VehCategory
, CAST(NULL as varchar(1)) as VehDMVCategory
, LEFT(szMake,4) as VehMakeCode
, CAST(szMake as varchar(50)) as VehMakeDesc
, LEFT(szModel,4) as VehModelCode
, CAST(szModel as varchar(50)) as VehModelDesc
, YEAR(dtModelYear) as VehModelYear
, LEFT(LTRIM(RTRIM(szTrim)),15) as VehSeriesCode
, LEFT(LTRIM(RTRIM(szTrim)),50) as VehSeriesDesc
, CAST(NULL as varchar(6)) as VehInteriorColorCode
, CAST(NULL as varchar(50)) as VehInteriorColorDesc
, CAST(NULL as varchar(6)) as VehExteriorColoerCode
, CAST(NULL as varchar(50)) as VehExteriorColorDesc
, CAST(NULL as varchar(50)) as VehTransmissionDesc
, CAST(NULL as varchar(4)) as VehNumberOfCylinders
, CASE WHEN LTRIM(RTRIM(szTrim)) like '%dr%' THEN  SUBSTRING(szTrim,CHARINDEX('dr',szTrim) - 1,1) ELSE NULL END as VehNumberOfDoors
, lMileage as VehCurrentMileage
, CONVERT(varchar,CAST(dtSold as DATE),112) as VehLastSoldDate
, IsValidVIN
, -1 as ETLExecution_ID
, 2 as Meta_Src_Sys_ID
, SUSER_SNAME() as [User_ID]
, HOST_NAME() as Meta_ComputerName
, 'eLead' as Meta_SourceSystemName
, GETDATE() AT TIME ZONE 'Eastern Standard Time' as Meta_LoadDate
, GETDATE() AT TIME ZONE 'Eastern Standard Time' as Meta_RowEffectiveDate
, 'Y' AS Meta_RowIsCurrent
, GETDATE() AT TIME ZONE 'Eastern Standard Time' as Meta_RowLastChangeDate
, - 1 as Meta_AuditKey
, LTRIM(RTRIM(szVIN)) as Meta_NaturalKey
FROM #MissingVINS_Final as SRC
WHERE NOT EXISTS (
SELECT 1
FROM dbo.Dim_Vehicle as DVV
WHERE SRC.szVIN = LTRIM(RTRIM(DVV.vehVIN))
);

DECLARE @FirstCnt as BIGINT = 0;

SELECT @FirstCnt = COUNT(1) from dbo.Dim_Vehicle WITH (NOLOCK);


WHILE @FirstCnt > 0
BEGIN

UPDATE TOP (100000) FCT SET
VehicleKey = DIM.VehicleKey
FROM dbo.FactOpportunity as FCT
INNER JOIN #MissingVINS_Final as STG
ON FCT.FactOpportunityKey = STG.FactOpportunityKey
INNER JOIN dbo.Dim_Vehicle AS DIM WITH (NOLOCK)
ON LTRIM(RTRIM(STG.szVIN)) = LTRIM(RTRIM(DIM.VehVIN))
WHERE FCT.VehicleKey = -1
AND FCT.VehicleKey <> DIM.VehicleKey;

SELECT @FirstCnt = @@ROWCOUNT;

END

DECLARE @SecondCnt as BIGINT = 0;

SELECT @SecondCnt = COUNT(1) FROM dbo.Dim_Vehicle WITH (NOLOCK);

WHILE @SecondCnt > 0

BEGIN

UPDATE TOP (10000) FCT SET
VehicleKey = Fix.VehicleKey
FROM dbo.FactOpportunity as FCT
INNER JOIN (
SELECT FCT.FactOpportunityKey, vchl.*, DVV.VehicleKey
FROM dbo.FactOpportunity as FCT with (nolock)
INNER JOIN ETL_Staging.stage.dwFullOpportunity as opp with (nolock)
on FCT.meta_naturalKey = CAST(opp.lDealID as varchar)
and opp.lVehicleID IS NOT NULL
INNER JOIN ETL_Staging.stage.dwFullVehicle as vchl WITH (NOLOCK)
on opp.lVehicleID = vchl.lVehicleID
INNER JOIN dbo.Dim_Vehicle as DVV
on vchl.szVIN = DVV.vehVIN
WHERE FCT.VehicleKey = -1
) as Fix
ON FCT.FactOpportunityKey = Fix.FactOpportunityKey
AND FCT.VehicleKey <> Fix.VehicleKey;

SELECT @SecondCnt = @@ROWCOUNT;

END

END;




```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
