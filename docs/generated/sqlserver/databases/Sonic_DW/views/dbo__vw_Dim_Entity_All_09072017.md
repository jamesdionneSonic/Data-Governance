---
name: vw_Dim_Entity_All_09072017
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

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Definition

```sql


CREATE VIEW [dbo].[vw_Dim_Entity_All]
AS
SELECT        EntityKey, EntCora_Account_ID, EntADPCompanyID, EntAccountingPrefix, EntEntityType, EntFDMName, EntRegion, EntAcquiredDate, EntAddressLine1, EntAddressMailingLine1, EntAddressCity, EntAddressState,
                         EntAddressZipCode, EntMainPhoneNumber, EntLegalStructure, EntOwnershipPct, EntFranchiseCount, EntServiceBayQty, EntLiftQty, EntSquareFootage, EntNumberOfProperties, EntLeasePropertyQty, EntLuxuryFlag,
                         EntBrandOrigin, EntBrandGroup, EntBrand, EntDFIDRegion, EntDFODRegion, EntUVDRegion, EntDealerLvl1, EntDealerLvl2, EntMetroArea, EntSubRegion, EntBrand3rdTier, MetaRowIsCurrent, MetaNaturalKey, ETLExecution_ID,
                         EntEssCode, EntActive, EntHFMDealershipName, EntStoreBrand, EntLatitude, EntLongitude, EntDefaultDlrshpLvl1, EntDefaultDlrshpLvl2, CASE WHEN EntityKey IN (162, 163, 182, 185) THEN 1 ELSE 3 END AS GMGroup,
                         EntCOAType, EntHasBodyShopFlag, EntFORCEReportFlag, EntFUELReportFlag, EntSPEEDReportFlag, EntSIMSReportFlag, EntSCORESReportFlag, EntFUELIIReportFlag, EntPlaybookReportFlag, EntName, EntDealerLvl0,
                         EntDOCReportFlag, EntDefaultDlrshpLvl0, EntRCRegion, EntLineOfBusiness, EntRetailTradeCenter_Region, 1 AS RTM_ID, entOSOEActive, entOSOEGoLiveDate
FROM            dbo.Dim_Entity


```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
