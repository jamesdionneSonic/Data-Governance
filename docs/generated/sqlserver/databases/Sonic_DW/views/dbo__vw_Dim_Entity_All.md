---
name: vw_Dim_Entity_All
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
CREATE VIEW dbo.vw_Dim_Entity_All
AS
SELECT        e.EntityKey, e.EntCora_Account_ID, e.EntADPCompanyID, e.EntAccountingPrefix, e.EntEntityType, e.EntFDMName, e.EntRegion, e.EntAcquiredDate, e.EntAddressLine1, e.EntAddressMailingLine1, e.EntAddressCity,
                         e.EntAddressState, e.EntAddressZipCode, e.EntMainPhoneNumber, e.EntLegalStructure, e.EntOwnershipPct, e.EntFranchiseCount, e.EntServiceBayQty, e.EntLiftQty, e.EntSquareFootage, e.EntNumberOfProperties,
                         e.EntLeasePropertyQty, e.EntLuxuryFlag, e.EntBrandOrigin, e.EntBrandGroup, e.EntBrand, e.EntDFIDRegion, e.EntDFODRegion, e.EntUVDRegion, e.EntDealerLvl1, e.EntDealerLvl2, e.EntMetroArea, e.EntSubRegion,
                         e.EntBrand3rdTier, e.MetaRowIsCurrent, e.MetaNaturalKey, e.ETLExecution_ID, e.EntEssCode, e.EntActive, e.EntHFMDealershipName, e.EntStoreBrand, e.EntLatitude, e.EntLongitude, e.EntDefaultDlrshpLvl1,
                         e.EntDefaultDlrshpLvl2, CASE WHEN e.EntityKey IN (162, 163, 182, 185) THEN 1 ELSE 3 END AS GMGroup, e.EntCOAType, e.EntHasBodyShopFlag, e.EntFORCEReportFlag, e.EntFUELReportFlag, e.EntSPEEDReportFlag,
                         e.EntSIMSReportFlag, e.EntSCORESReportFlag, e.EntFUELIIReportFlag, e.EntPlaybookReportFlag, e.EntName, e.EntDealerLvl0, e.EntDOCReportFlag, e.EntDefaultDlrshpLvl0, e.EntRCRegion, e.EntLineOfBusiness,
                         e.EntRetailTradeCenter_Region, 1 AS RTM_ID, e.entOSOEActive, e.entOSOEGoLiveDate, CAST(e.EntADPCompanyID AS varchar(5)) + CAST(e.EntAccountingPrefix AS varchar(5)) AS EntCoraAccount_Prefix,
                         dbo.vw_Dim_Region.RVPAssociateKey, rc.RCAssociateKey, e.EntRegionalTechnologyManagerID, e.EntBTOpsReportFlag, DATEDIFF(m, e.EntAcquiredDate, GETDATE()) AS MonthsSinceAcquired,
                         CASE WHEN EntRCRegion = 'RFJ' THEN 1 ELSE 0 END AS EntRFJFlag, COALESCE (rolle.EntityKey, e.EntityKey) AS RollupEntityKey
FROM            dbo.Dim_Entity AS e LEFT OUTER JOIN
                             (SELECT        EntityKey, EntDealerLvl1
                               FROM            dbo.Dim_Entity
                               WHERE        (EntDefaultDlrshpLvl1 = 1) AND (EntEntityType = 'Dealership')) AS rolle ON e.EntDealerLvl1 = rolle.EntDealerLvl1 LEFT OUTER JOIN
                         dbo.vw_Dim_RCRegion AS rc ON e.EntLineOfBusiness = rc.LineOfBusiness AND e.EntRegion = rc.Region LEFT OUTER JOIN
                         dbo.vw_Dim_Region ON e.EntRegion = dbo.vw_Dim_Region.Region AND e.EntLineOfBusiness = dbo.vw_Dim_Region.LineOfBusiness
WHERE        (e.EntActive = 'Active') AND (e.EntEntityType = 'Dealership') OR
                         (e.EntActive = 'Active') AND (e.EntDealerLvl1 = 'Sonic Shared Services') OR
                         (e.EntActive = 'Active') AND (e.EntEntityType = 'TitleTracking')

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
