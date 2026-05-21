---
name: vw_Dim_Entity_Active
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
---

## Overview

2- **Type**: View

- **Schema**: dbo

## Definition

```sql
/*AND (NOT (EntADPCompanyID IN ('581', '582', '583', '584', '585', '586', '587', '588', '589', '590', '591', '592', '593', '594', '595',
                         '596', '597', '598', '599', '581', '582', '583', '584', '585', '586', '587', '588', '589', '590', '591', '592', '593', '594', '595', '596', '597', '598', '599')))*/
CREATE VIEW dbo.vw_Dim_Entity_Active
AS
SELECT        EntityKey, EntDealerLvl0, EntDealerLvl1, EntDealerLvl2, EntDefaultDlrshpLvl0, EntDefaultDlrshpLvl1, EntDefaultDlrshpLvl2, EntEntityType, EntCOAType, EntCora_Account_ID, EntADPCompanyID, EntAccountingPrefix,
                         EntRegion, EntAcquiredDate, EntAddressLine1, EntAddressMailingLine1, EntAddressCity, EntAddressState, EntAddressCounty, EntAddressZipCode, EntMainPhoneNumber, EntLegalStructure, EntOwnershipPct,
                         EntFranchiseCount, EntBrand, EntBrandGroup, EntStoreBrandGroup, EntStoreBrand, EntDFIDRegion, EntUVDRegion, EntDFODRegion, EntMetroArea, EntSubRegion, EntBrand3rdTier, EntEssCode, EntHasBodyShop, EntLatitude,
                         EntLongitude, EntRCRegion, EntActive, CurrentPrefixFlag, EntFireFlag, EntHasBodyShopFlag, EntFORCEReportFlag, EntFUELReportFlag, EntSIMSReportFlag, EntSPEEDReportFlag, EntSCORESReportFlag, EntFUELIIReportFlag,
                         EntPlaybookReportFlag, EntLineOfBusiness, EntSoldStatus, EntSoldDate, EntFacilityBranchType, EntHFMActive, EntFDMActive, EntADPActive, entOSOEActive, entOSOEGoLiveDate, EntDOCReportFlag, EntSIMSStoreID,
                         EntBrandLvl0, EntRetailTradeCenter_Region, EntRegionalTechnologyManagerID, EntBTOpsReportFlag, EntDMSServerName, EntScoresLiveFlag, EntScoresDefault, EntScoresGoLiveDate, EntEleadID, EntEleadDefault,
                         EntAutoTraderID, EntCarsID, EntDealerComID, EntEasyCareID, EntRouteOneID, EntWebVID, EntTimeZone, EntWebVID_EchoPark, EntUtcOffSetST, EntGpaActive, EntEleadGoLiveDate, EntEleadNewID, EntGpaId, EntCBAActive,
                         EntSIMSRegion, EntClass, EntHFMDealershipName, EntSCORES_Company_Dealership_ID, MetaNaturalKey, MetaRowIsCurrent, DATEDIFF(m, EntAcquiredDate, GETDATE()) AS MonthsSinceAcquired,
                         CASE WHEN EntRCRegion = 'RFJ' THEN 1 ELSE 0 END AS EntRFJFlag
FROM            dbo.Dim_Entity
WHERE        (EntActive = 'Active') AND (EntCOAType NOT IN ('University', 'Aviation', 'Divisional', 'BT Service'))

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
