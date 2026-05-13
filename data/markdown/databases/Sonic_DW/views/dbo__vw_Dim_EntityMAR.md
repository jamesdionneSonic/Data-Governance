---
name: vw_Dim_EntityMAR
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
  - vw_Dim_RCRegion
  - vw_Dim_Region
dependency_count: 3
column_count: 73
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

2- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_Entity** (U )
- **dbo.vw_Dim_RCRegion** (V )
- **dbo.vw_Dim_Region** (V )

## Columns

| Name                             | Type     | Nullable | Description |
| -------------------------------- | -------- | -------- | ----------- |
| `EntityKey`                      | int      |          |             |
| `EntCora_Account_ID`             | int      | ✓        |             |
| `EntADPCompanyID`                | varchar  | ✓        |             |
| `EntAccountingPrefix`            | char     | ✓        |             |
| `EntEntityType`                  | varchar  | ✓        |             |
| `EntFDMName`                     | varchar  | ✓        |             |
| `EntRegion`                      | varchar  | ✓        |             |
| `EntAcquiredDate`                | datetime | ✓        |             |
| `EntAddressLine1`                | varchar  | ✓        |             |
| `EntAddressMailingLine1`         | varchar  | ✓        |             |
| `EntAddressCity`                 | varchar  | ✓        |             |
| `EntAddressState`                | varchar  | ✓        |             |
| `EntAddressZipCode`              | varchar  | ✓        |             |
| `EntMainPhoneNumber`             | varchar  | ✓        |             |
| `EntLegalStructure`              | varchar  | ✓        |             |
| `EntOwnershipPct`                | int      | ✓        |             |
| `EntFranchiseCount`              | int      | ✓        |             |
| `EntServiceBayQty`               | int      | ✓        |             |
| `EntLiftQty`                     | int      | ✓        |             |
| `EntSquareFootage`               | int      | ✓        |             |
| `EntNumberOfProperties`          | int      | ✓        |             |
| `EntLeasePropertyQty`            | int      | ✓        |             |
| `EntLuxuryFlag`                  | varchar  | ✓        |             |
| `EntBrandOrigin`                 | varchar  | ✓        |             |
| `EntBrandGroup`                  | varchar  | ✓        |             |
| `EntBrand`                       | varchar  | ✓        |             |
| `EntDFIDRegion`                  | varchar  | ✓        |             |
| `EntDFODRegion`                  | varchar  | ✓        |             |
| `EntUVDRegion`                   | varchar  | ✓        |             |
| `EntDealerLvl1`                  | varchar  | ✓        |             |
| `EntDealerLvl2`                  | varchar  | ✓        |             |
| `EntMetroArea`                   | varchar  | ✓        |             |
| `EntSubRegion`                   | varchar  | ✓        |             |
| `EntBrand3rdTier`                | varchar  | ✓        |             |
| `MetaRowIsCurrent`               | varchar  | ✓        |             |
| `MetaNaturalKey`                 | varchar  | ✓        |             |
| `ETLExecution_ID`                | int      | ✓        |             |
| `EntEssCode`                     | varchar  | ✓        |             |
| `EntActive`                      | varchar  | ✓        |             |
| `EntHFMDealershipName`           | varchar  | ✓        |             |
| `EntStoreBrand`                  | varchar  | ✓        |             |
| `EntLatitude`                    | float    | ✓        |             |
| `EntLongitude`                   | float    | ✓        |             |
| `EntDefaultDlrshpLvl1`           | varchar  | ✓        |             |
| `EntDefaultDlrshpLvl2`           | varchar  | ✓        |             |
| `GMGroup`                        | int      |          |             |
| `EntCOAType`                     | varchar  | ✓        |             |
| `EntHasBodyShopFlag`             | varchar  | ✓        |             |
| `EntFORCEReportFlag`             | varchar  | ✓        |             |
| `EntFUELReportFlag`              | varchar  | ✓        |             |
| `EntSPEEDReportFlag`             | varchar  | ✓        |             |
| `EntSIMSReportFlag`              | varchar  | ✓        |             |
| `EntSCORESReportFlag`            | varchar  | ✓        |             |
| `EntFUELIIReportFlag`            | varchar  | ✓        |             |
| `EntPlaybookReportFlag`          | varchar  | ✓        |             |
| `EntName`                        | varchar  | ✓        |             |
| `EntDealerLvl0`                  | varchar  | ✓        |             |
| `EntDOCReportFlag`               | varchar  | ✓        |             |
| `EntDefaultDlrshpLvl0`           | varchar  | ✓        |             |
| `EntRCRegion`                    | varchar  | ✓        |             |
| `EntLineOfBusiness`              | varchar  | ✓        |             |
| `EntRetailTradeCenter_Region`    | varchar  | ✓        |             |
| `EntRegionalTechnologyManagerID` | int      | ✓        |             |
| `EntBTOpsReportFlag`             | varchar  | ✓        |             |
| `EntDMSServerName`               | varchar  | ✓        |             |
| `EntCoraAccount_Prefix`          | varchar  | ✓        |             |
| `entOSOEActive`                  | tinyint  | ✓        |             |
| `entOSOEGoLiveDate`              | date     | ✓        |             |
| `DealershipMask`                 | varchar  | ✓        |             |
| `RVPAssociateKey`                | int      | ✓        |             |
| `RCAssociateKey`                 | int      | ✓        |             |
| `EntRFJFlag`                     | int      |          |             |
| `managedstores`                  | int      |          |             |

## Definition

```sql






/* Exclude undesired Stevens Creek BMW entities*/ --Two stores from Toyoto - Toyota of Paris and Toyota of Mt. Pleasant - needed to be non rfj so we made a managed stores column which will be the new filter for the rfj selector in MSTR
--marketing team wanted a filter for what they manage and dont manage instead of the RFJ filter.
CREATE VIEW [dbo].[vw_Dim_EntityMAR]
AS

SELECT        e.EntityKey, e.EntCora_Account_ID, e.EntADPCompanyID, e.EntAccountingPrefix, e.EntEntityType, e.EntFDMName, e.EntRegion, e.EntAcquiredDate, e.EntAddressLine1, e.EntAddressMailingLine1, e.EntAddressCity,
                         e.EntAddressState, e.EntAddressZipCode, e.EntMainPhoneNumber, e.EntLegalStructure, e.EntOwnershipPct, e.EntFranchiseCount, e.EntServiceBayQty, e.EntLiftQty, e.EntSquareFootage, e.EntNumberOfProperties,
                         e.EntLeasePropertyQty, e.EntLuxuryFlag, e.EntBrandOrigin, e.EntBrandGroup, e.EntBrand, e.EntDFIDRegion, e.EntDFODRegion, e.EntUVDRegion, e.EntDealerLvl1, e.EntDealerLvl2, e.EntMetroArea, e.EntSubRegion,
                         e.EntBrand3rdTier, e.MetaRowIsCurrent, e.MetaNaturalKey, e.ETLExecution_ID, e.EntEssCode, e.EntActive, e.EntHFMDealershipName, e.EntStoreBrand, e.EntLatitude, e.EntLongitude, e.EntDefaultDlrshpLvl1,
                         e.EntDefaultDlrshpLvl2, CASE WHEN EntityKey IN (162, 163, 182, 185) THEN 1 ELSE 3 END AS GMGroup, e.EntCOAType, e.EntHasBodyShopFlag, e.EntFORCEReportFlag, e.EntFUELReportFlag, e.EntSPEEDReportFlag,
                         e.EntSIMSReportFlag, e.EntSCORESReportFlag, e.EntFUELIIReportFlag, e.EntPlaybookReportFlag, e.EntName, e.EntDealerLvl0, e.EntDOCReportFlag, e.EntDefaultDlrshpLvl0, e.EntRCRegion, e.EntLineOfBusiness,
                         e.EntRetailTradeCenter_Region, e.EntRegionalTechnologyManagerID, e.EntBTOpsReportFlag, e.EntDMSServerName, CAST(e.EntADPCompanyID AS varchar(5)) + CAST(e.EntAccountingPrefix AS varchar(5))
                         AS EntCoraAccount_Prefix, e.entOSOEActive, e.entOSOEGoLiveDate, e.EntStoreBrand + ' Store ' + RIGHT(e.EntEssCode, 2) AS DealershipMask, dbo.vw_Dim_Region.RVPAssociateKey, rc.RCAssociateKey,
                         CASE WHEN EntRCRegion = 'RFJ' THEN 1 ELSE 0 END AS EntRFJFlag, case when entitykey in(356, 358, 609, 612, 592, 123, 124, 598, 610,611,613,646,647, 599, 600,601,602,603) then 1 else 0 end as managedstores
FROM            dbo.Dim_Entity AS e LEFT OUTER JOIN
                         dbo.vw_Dim_RCRegion AS rc ON e.EntLineOfBusiness = rc.LineOfBusiness AND e.EntRegion = rc.Region LEFT OUTER JOIN
                         dbo.vw_Dim_Region ON e.EntRegion = dbo.vw_Dim_Region.Region AND e.EntLineOfBusiness = dbo.vw_Dim_Region.LineOfBusiness
WHERE        (e.EntLineOfBusiness = 'Sonic') AND (e.EntActive = 'Active') AND (e.EntEntityType = 'Dealership') AND (e.EntRegion NOT IN ('Strategic') AND EntADPCompanyID <> 470)



```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
