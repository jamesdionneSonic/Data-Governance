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
depends_on:
  - Dim_Entity
dependency_count: 1
column_count: 93
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

2- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_Entity** (U )

## Columns

| Name                              | Type      | Nullable | Description |
| --------------------------------- | --------- | -------- | ----------- |
| `EntityKey`                       | int       |          |             |
| `EntDealerLvl0`                   | varchar   | ✓        |             |
| `EntDealerLvl1`                   | varchar   | ✓        |             |
| `EntDealerLvl2`                   | varchar   | ✓        |             |
| `EntDefaultDlrshpLvl0`            | varchar   | ✓        |             |
| `EntDefaultDlrshpLvl1`            | varchar   | ✓        |             |
| `EntDefaultDlrshpLvl2`            | varchar   | ✓        |             |
| `EntEntityType`                   | varchar   | ✓        |             |
| `EntCOAType`                      | varchar   | ✓        |             |
| `EntCora_Account_ID`              | int       | ✓        |             |
| `EntADPCompanyID`                 | varchar   | ✓        |             |
| `EntAccountingPrefix`             | char      | ✓        |             |
| `EntRegion`                       | varchar   | ✓        |             |
| `EntAcquiredDate`                 | datetime  | ✓        |             |
| `EntAddressLine1`                 | varchar   | ✓        |             |
| `EntAddressMailingLine1`          | varchar   | ✓        |             |
| `EntAddressCity`                  | varchar   | ✓        |             |
| `EntAddressState`                 | varchar   | ✓        |             |
| `EntAddressCounty`                | varchar   | ✓        |             |
| `EntAddressZipCode`               | varchar   | ✓        |             |
| `EntMainPhoneNumber`              | varchar   | ✓        |             |
| `EntLegalStructure`               | varchar   | ✓        |             |
| `EntOwnershipPct`                 | int       | ✓        |             |
| `EntFranchiseCount`               | int       | ✓        |             |
| `EntBrand`                        | varchar   | ✓        |             |
| `EntBrandGroup`                   | varchar   | ✓        |             |
| `EntStoreBrandGroup`              | varchar   | ✓        |             |
| `EntStoreBrand`                   | varchar   | ✓        |             |
| `EntDFIDRegion`                   | varchar   | ✓        |             |
| `EntUVDRegion`                    | varchar   | ✓        |             |
| `EntDFODRegion`                   | varchar   | ✓        |             |
| `EntMetroArea`                    | varchar   | ✓        |             |
| `EntSubRegion`                    | varchar   | ✓        |             |
| `EntBrand3rdTier`                 | varchar   | ✓        |             |
| `EntEssCode`                      | varchar   | ✓        |             |
| `EntHasBodyShop`                  | varchar   | ✓        |             |
| `EntLatitude`                     | float     | ✓        |             |
| `EntLongitude`                    | float     | ✓        |             |
| `EntRCRegion`                     | varchar   | ✓        |             |
| `EntActive`                       | varchar   | ✓        |             |
| `CurrentPrefixFlag`               | varchar   | ✓        |             |
| `EntFireFlag`                     | varchar   | ✓        |             |
| `EntHasBodyShopFlag`              | varchar   | ✓        |             |
| `EntFORCEReportFlag`              | varchar   | ✓        |             |
| `EntFUELReportFlag`               | varchar   | ✓        |             |
| `EntSIMSReportFlag`               | varchar   | ✓        |             |
| `EntSPEEDReportFlag`              | varchar   | ✓        |             |
| `EntSCORESReportFlag`             | varchar   | ✓        |             |
| `EntFUELIIReportFlag`             | varchar   | ✓        |             |
| `EntPlaybookReportFlag`           | varchar   | ✓        |             |
| `EntLineOfBusiness`               | varchar   | ✓        |             |
| `EntSoldStatus`                   | varchar   | ✓        |             |
| `EntSoldDate`                     | datetime2 | ✓        |             |
| `EntFacilityBranchType`           | varchar   | ✓        |             |
| `EntHFMActive`                    | varchar   | ✓        |             |
| `EntFDMActive`                    | varchar   | ✓        |             |
| `EntADPActive`                    | varchar   | ✓        |             |
| `entOSOEActive`                   | tinyint   | ✓        |             |
| `entOSOEGoLiveDate`               | date      | ✓        |             |
| `EntDOCReportFlag`                | varchar   | ✓        |             |
| `EntSIMSStoreID`                  | int       | ✓        |             |
| `EntBrandLvl0`                    | varchar   | ✓        |             |
| `EntRetailTradeCenter_Region`     | varchar   | ✓        |             |
| `EntRegionalTechnologyManagerID`  | int       | ✓        |             |
| `EntBTOpsReportFlag`              | varchar   | ✓        |             |
| `EntDMSServerName`                | varchar   | ✓        |             |
| `EntScoresLiveFlag`               | bit       | ✓        |             |
| `EntScoresDefault`                | bit       | ✓        |             |
| `EntScoresGoLiveDate`             | date      | ✓        |             |
| `EntEleadID`                      | int       | ✓        |             |
| `EntEleadDefault`                 | bit       | ✓        |             |
| `EntAutoTraderID`                 | varchar   | ✓        |             |
| `EntCarsID`                       | int       | ✓        |             |
| `EntDealerComID`                  | varchar   | ✓        |             |
| `EntEasyCareID`                   | varchar   | ✓        |             |
| `EntRouteOneID`                   | varchar   | ✓        |             |
| `EntWebVID`                       | int       | ✓        |             |
| `EntTimeZone`                     | varchar   | ✓        |             |
| `EntWebVID_EchoPark`              | int       | ✓        |             |
| `EntUtcOffSetST`                  | int       | ✓        |             |
| `EntGpaActive`                    | bit       | ✓        |             |
| `EntEleadGoLiveDate`              | date      | ✓        |             |
| `EntEleadNewID`                   | int       | ✓        |             |
| `EntGpaId`                        | int       | ✓        |             |
| `EntCBAActive`                    | bit       | ✓        |             |
| `EntSIMSRegion`                   | varchar   | ✓        |             |
| `EntClass`                        | varchar   | ✓        |             |
| `EntHFMDealershipName`            | varchar   | ✓        |             |
| `EntSCORES_Company_Dealership_ID` | varchar   | ✓        |             |
| `MetaNaturalKey`                  | varchar   | ✓        |             |
| `MetaRowIsCurrent`                | varchar   | ✓        |             |
| `MonthsSinceAcquired`             | int       | ✓        |             |
| `EntRFJFlag`                      | int       |          |             |

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

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
