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
depends_on:
  - Dim_Entity
dependency_count: 1
column_count: 73
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_Entity** (U )

## Columns

| Name                     | Type     | Nullable | Description |
| ------------------------ | -------- | -------- | ----------- |
| `EntityKey`              | int      |          |             |
| `EntCora_Account_ID`     | int      |          |             |
| `EntADPCompanyID`        | varchar  | ✓        |             |
| `EntAccountingPrefix`    | char     | ✓        |             |
| `EntHFMEntityID`         | varchar  | ✓        |             |
| `EntFranchiseID`         | char     | ✓        |             |
| `EntEntityType`          | varchar  | ✓        |             |
| `EntBACCode`             | varchar  | ✓        |             |
| `EntRVP_RCRegionCode`    | varchar  | ✓        |             |
| `EntFDMName`             | varchar  | ✓        |             |
| `EntRegion`              | varchar  | ✓        |             |
| `EntAcquiredDate`        | datetime | ✓        |             |
| `EntAddressLine1`        | varchar  | ✓        |             |
| `EntAddressMailingLine1` | varchar  | ✓        |             |
| `EntAddressCity`         | varchar  | ✓        |             |
| `EntAddressState`        | varchar  | ✓        |             |
| `EntAddressZipCode`      | varchar  | ✓        |             |
| `EntMainPhoneNumber`     | varchar  | ✓        |             |
| `EntDealerCode`          | varchar  | ✓        |             |
| `EntRegionSubLevel`      | varchar  | ✓        |             |
| `EntConsolidated`        | varchar  | ✓        |             |
| `EntDealershipSize`      | varchar  | ✓        |             |
| `EntLegalStructure`      | varchar  | ✓        |             |
| `EntLegalParent`         | varchar  | ✓        |             |
| `EntOwnershipPct`        | int      | ✓        |             |
| `EntFranchiseCount`      | int      | ✓        |             |
| `EntLegalName`           | varchar  | ✓        |             |
| `EntSameStoreFlg`        | varchar  | ✓        |             |
| `EntDisposedFlg`         | varchar  | ✓        |             |
| `EntContinuingOpsFlg`    | varchar  | ✓        |             |
| `EntStateTaxID`          | varchar  | ✓        |             |
| `EntIncorporationNumber` | varchar  | ✓        |             |
| `EntFedTaxID`            | varchar  | ✓        |             |
| `EntDMVNumber`           | varchar  | ✓        |             |
| `EntFilingNumbers`       | varchar  | ✓        |             |
| `EntServiceBayQty`       | int      | ✓        |             |
| `EntLiftQty`             | int      | ✓        |             |
| `EntSquareFootage`       | int      | ✓        |             |
| `EntNumberOfProperties`  | int      | ✓        |             |
| `EntLeasePropertyQty`    | int      | ✓        |             |
| `EntLuxuryFlag`          | varchar  | ✓        |             |
| `EntBrandOrigin`         | varchar  | ✓        |             |
| `EntBrandGroup`          | varchar  | ✓        |             |
| `EntBrand`               | varchar  | ✓        |             |
| `EntBodyShopFlag`        | varchar  | ✓        |             |
| `EntDFIDRegion`          | varchar  | ✓        |             |
| `EntDFODRegion`          | varchar  | ✓        |             |
| `EntUVDRegion`           | varchar  | ✓        |             |
| `EntDealerLvl1`          | varchar  | ✓        |             |
| `EntDealerLvl2`          | varchar  | ✓        |             |
| `EntMetroArea`           | varchar  | ✓        |             |
| `EntSubRegion`           | varchar  | ✓        |             |
| `EntBrand3rdTier`        | varchar  | ✓        |             |
| `MetaSrc_Sys_ID`         | int      | ✓        |             |
| `MetaSourceSystemName`   | varchar  | ✓        |             |
| `MetaRowEffectiveDate`   | datetime | ✓        |             |
| `MetaRowExpiredDate`     | datetime | ✓        |             |
| `MetaRowIsCurrent`       | varchar  | ✓        |             |
| `MetaRowlastChangeDate`  | datetime | ✓        |             |
| `MetaAuditKey`           | int      | ✓        |             |
| `MetaAuditScore`         | int      | ✓        |             |
| `MetaNaturalKey`         | varchar  | ✓        |             |
| `MetaChecksum`           | int      | ✓        |             |
| `ETLExecution_ID`        | int      | ✓        |             |
| `EntEssCode`             | varchar  | ✓        |             |
| `EntActive`              | varchar  | ✓        |             |
| `HasBodyShop`            | varchar  | ✓        |             |
| `EntHFMDealershipName`   | varchar  | ✓        |             |
| `EntStoreBrand`          | varchar  | ✓        |             |
| `EntLatitude`            | float    | ✓        |             |
| `EntLongitude`           | float    | ✓        |             |
| `EntDefaultDlrshpLvl1`   | varchar  | ✓        |             |
| `EntDefaultDlrshpLvl2`   | varchar  | ✓        |             |

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

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
