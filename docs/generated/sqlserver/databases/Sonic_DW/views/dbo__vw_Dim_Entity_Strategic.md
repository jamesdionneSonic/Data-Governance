---
name: vw_Dim_Entity_Strategic
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




CREATE VIEW [dbo].[vw_Dim_Entity_Strategic]
AS
SELECT e.EntityKey, e.EntCora_Account_ID, e.EntADPCompanyID, e.EntAccountingPrefix, e.EntEntityType, e.EntFDMName, e.EntRegion, e.EntAcquiredDate, e.EntAddressLine1, e.EntAddressMailingLine1, e.EntAddressCity, e.EntAddressState,
                  e.EntAddressZipCode, e.EntMainPhoneNumber, e.EntLegalStructure, e.EntOwnershipPct, e.EntFranchiseCount, e.EntServiceBayQty, e.EntLiftQty, e.EntSquareFootage, e.EntNumberOfProperties, e.EntLeasePropertyQty,
                  e.EntLuxuryFlag, e.EntBrandOrigin, e.EntBrandGroup, e.EntBrand, e.EntDFIDRegion, e.EntDFODRegion, e.EntUVDRegion, e.EntDealerLvl1, e.EntDealerLvl2, e.EntMetroArea, e.EntSubRegion, e.EntBrand3rdTier, e.MetaRowIsCurrent,
                  e.MetaNaturalKey, e.ETLExecution_ID, e.EntEssCode, e.EntActive, e.EntHFMDealershipName, e.EntStoreBrand, e.EntLatitude, e.EntLongitude, e.EntDefaultDlrshpLvl1, e.EntDefaultDlrshpLvl2, CASE WHEN EntityKey IN (162, 163, 182, 185)
                  THEN 1 ELSE 3 END AS GMGroup, e.EntCOAType, e.EntHasBodyShopFlag, e.EntFORCEReportFlag, e.EntFUELReportFlag, e.EntSPEEDReportFlag, e.EntSIMSReportFlag, e.EntSCORESReportFlag, e.EntFUELIIReportFlag,
                  e.EntPlaybookReportFlag, e.EntName, e.EntDealerLvl0, e.EntDOCReportFlag, e.EntDefaultDlrshpLvl0, e.EntRCRegion, e.EntLineOfBusiness, e.EntRetailTradeCenter_Region, e.EntRegionalTechnologyManagerID, e.EntBTOpsReportFlag,
                  e.EntDMSServerName, CAST(e.EntADPCompanyID AS varchar(5)) + CAST(e.EntAccountingPrefix AS varchar(5)) AS EntCoraAccount_Prefix, e.entOSOEActive, e.entOSOEGoLiveDate, e.EntStoreBrand + ' Store ' + RIGHT(e.EntEssCode, 2)
                  AS DealershipMask, dbo.vw_Dim_Region.RVPAssociateKey, rc.RCAssociateKey
FROM     dbo.Dim_Entity AS e LEFT OUTER JOIN
                  dbo.vw_Dim_RCRegion AS rc ON e.EntLineOfBusiness = rc.LineOfBusiness AND e.EntRegion = rc.Region LEFT OUTER JOIN
                  dbo.vw_Dim_Region ON e.EntRegion = dbo.vw_Dim_Region.Region AND e.EntLineOfBusiness = dbo.vw_Dim_Region.LineOfBusiness
WHERE  (e.EntLineOfBusiness = 'Strategic') AND (e.EntActive = 'Active') AND (e.EntEntityType = 'Dealership')

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
