---
name: vw_Dim_Accounting_Entity_2016_07_11
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
CREATE VIEW dbo.vw_Dim_Accounting_Entity
AS
SELECT     EntityKey, EntCora_Account_ID, EntADPCompanyID, EntAccountingPrefix, EntHFMEntityID, EntFranchiseID, EntEntityType, EntBACCode,
                      EntRVP_RCRegionCode, EntFDMName, EntRegion, EntAcquiredDate, EntAddressLine1, EntAddressMailingLine1, EntAddressCity, EntAddressState,
                      EntAddressZipCode, EntMainPhoneNumber, EntDealerCode, EntRegionSubLevel, EntConsolidated, EntDealershipSize, EntLegalStructure,
                      EntLegalParent, EntOwnershipPct, EntFranchiseCount, EntLegalName, EntSameStoreFlg, EntDisposedFlg, EntContinuingOpsFlg, EntStateTaxID,
                      EntIncorporationNumber, EntFedTaxID, EntDMVNumber, EntFilingNumbers, EntServiceBayQty, EntLiftQty, EntSquareFootage, EntNumberOfProperties,
                      EntLeasePropertyQty, EntLuxuryFlag, EntBrandOrigin, EntBrandGroup, EntBrand, EntBodyShopFlag, EntDFIDRegion, EntDFODRegion, EntUVDRegion,
                      EntDealerLvl1, EntDealerLvl2, EntMetroArea, EntSubRegion, EntBrand3rdTier, MetaSrc_Sys_ID, MetaSourceSystemName, MetaRowEffectiveDate,
                      MetaRowExpiredDate, MetaRowIsCurrent, MetaRowlastChangeDate, MetaAuditKey, MetaAuditScore, MetaNaturalKey, MetaChecksum,
                      ETLExecution_ID, EntEssCode, EntActive, HasBodyShop, EntHFMDealershipName, EntStoreBrand, EntLatitude, EntLongitude, EntDefaultDlrshpLvl1,
                      EntDefaultDlrshpLvl2
FROM         dbo.Dim_Entity

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
