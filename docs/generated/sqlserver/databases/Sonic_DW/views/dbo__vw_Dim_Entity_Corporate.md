---
name: vw_Dim_Entity_Corporate
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

1- **Type**: View

- **Schema**: dbo

## Definition

```sql
/* Exclude undesired Stevens Creek BMW entities
AND (EntEntityType IN ('Divisional', 'Corporate'))*/
CREATE VIEW dbo.vw_Dim_Entity_Corporate
AS
SELECT        EntityKey, EntCora_Account_ID, EntADPCompanyID, EntAccountingPrefix, EntEntityType, EntFDMName, EntRegion, EntAcquiredDate, EntAddressLine1, EntAddressMailingLine1, EntAddressCity, EntAddressState,
                         EntAddressZipCode, EntMainPhoneNumber, EntLegalStructure, EntOwnershipPct, EntFranchiseCount, EntServiceBayQty, EntLiftQty, EntSquareFootage, EntNumberOfProperties, EntLeasePropertyQty, EntLuxuryFlag,
                         EntBrandOrigin, EntBrandGroup, EntBrand, EntDFIDRegion, EntDFODRegion, EntUVDRegion, EntDealerLvl1, EntDealerLvl2, EntMetroArea, EntSubRegion, EntBrand3rdTier, MetaRowIsCurrent, MetaNaturalKey, ETLExecution_ID,
                         EntEssCode, EntActive, EntHFMDealershipName, EntStoreBrand, EntLatitude, EntLongitude, EntDefaultDlrshpLvl1, EntDefaultDlrshpLvl2, CASE WHEN EntityKey IN (162, 163, 182, 185) THEN 1 ELSE 3 END AS GMGroup,
                         EntCOAType, EntHasBodyShopFlag, EntFORCEReportFlag, EntFUELReportFlag, EntSPEEDReportFlag, EntSIMSReportFlag, EntSCORESReportFlag, EntFUELIIReportFlag, EntPlaybookReportFlag, EntName, EntDealerLvl0,
                         EntDOCReportFlag, EntDefaultDlrshpLvl0, EntRCRegion, EntLineOfBusiness, EntRetailTradeCenter_Region, EntRegionalTechnologyManagerID, EntBTOpsReportFlag, EntDMSServerName, entOSOEActive, entOSOEGoLiveDate,
                         CAST(EntADPCompanyID AS varchar(5)) + CAST(EntAccountingPrefix AS varchar(5)) AS EntCoraAccount_Prefix
FROM            dbo.Dim_Entity
WHERE        (EntActive = 'Active') AND (EntEssCode IN
                             (SELECT DISTINCT Entity AS entesscode
                               FROM            dbo.stg_OneStream AS sos))

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
