---
name: vw_Dim_Accounting_Entity
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
column_count: 45
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
| `EntCora_Account_ID`     | int      | ✓        |             |
| `EntADPCompanyID`        | varchar  | ✓        |             |
| `EntAccountingPrefix`    | char     | ✓        |             |
| `EntEntityType`          | varchar  | ✓        |             |
| `EntFDMName`             | varchar  | ✓        |             |
| `EntRegion`              | varchar  | ✓        |             |
| `EntAcquiredDate`        | datetime | ✓        |             |
| `EntAddressLine1`        | varchar  | ✓        |             |
| `EntAddressMailingLine1` | varchar  | ✓        |             |
| `EntAddressCity`         | varchar  | ✓        |             |
| `EntAddressState`        | varchar  | ✓        |             |
| `EntAddressZipCode`      | varchar  | ✓        |             |
| `EntMainPhoneNumber`     | varchar  | ✓        |             |
| `EntLegalStructure`      | varchar  | ✓        |             |
| `EntOwnershipPct`        | int      | ✓        |             |
| `EntFranchiseCount`      | int      | ✓        |             |
| `EntServiceBayQty`       | int      | ✓        |             |
| `EntLiftQty`             | int      | ✓        |             |
| `EntSquareFootage`       | int      | ✓        |             |
| `EntNumberOfProperties`  | int      | ✓        |             |
| `EntLeasePropertyQty`    | int      | ✓        |             |
| `EntLuxuryFlag`          | varchar  | ✓        |             |
| `EntBrandOrigin`         | varchar  | ✓        |             |
| `EntBrandGroup`          | varchar  | ✓        |             |
| `EntBrand`               | varchar  | ✓        |             |
| `EntDFIDRegion`          | varchar  | ✓        |             |
| `EntDFODRegion`          | varchar  | ✓        |             |
| `EntUVDRegion`           | varchar  | ✓        |             |
| `EntDealerLvl1`          | varchar  | ✓        |             |
| `EntDealerLvl2`          | varchar  | ✓        |             |
| `EntMetroArea`           | varchar  | ✓        |             |
| `EntSubRegion`           | varchar  | ✓        |             |
| `EntBrand3rdTier`        | varchar  | ✓        |             |
| `MetaRowIsCurrent`       | varchar  | ✓        |             |
| `MetaNaturalKey`         | varchar  | ✓        |             |
| `ETLExecution_ID`        | int      | ✓        |             |
| `EntEssCode`             | varchar  | ✓        |             |
| `EntActive`              | varchar  | ✓        |             |
| `EntHFMDealershipName`   | varchar  | ✓        |             |
| `EntStoreBrand`          | varchar  | ✓        |             |
| `EntLatitude`            | float    | ✓        |             |
| `EntLongitude`           | float    | ✓        |             |
| `EntDefaultDlrshpLvl1`   | varchar  | ✓        |             |
| `EntDefaultDlrshpLvl2`   | varchar  | ✓        |             |

## Definition

```sql

CREATE VIEW [dbo].[vw_Dim_Accounting_Entity]
AS
SELECT     EntityKey, EntCora_Account_ID, EntADPCompanyID, EntAccountingPrefix,  EntEntityType,
                       EntFDMName, EntRegion, EntAcquiredDate, EntAddressLine1, EntAddressMailingLine1, EntAddressCity, EntAddressState,
                      EntAddressZipCode, EntMainPhoneNumber,  EntLegalStructure,
                       EntOwnershipPct, EntFranchiseCount,
                       EntServiceBayQty, EntLiftQty, EntSquareFootage, EntNumberOfProperties,
                      EntLeasePropertyQty, EntLuxuryFlag, EntBrandOrigin, EntBrandGroup, EntBrand,  EntDFIDRegion, EntDFODRegion, EntUVDRegion,
                      EntDealerLvl1, EntDealerLvl2, EntMetroArea, EntSubRegion, EntBrand3rdTier,  MetaRowIsCurrent,  MetaNaturalKey,
                      ETLExecution_ID, EntEssCode, EntActive,  EntHFMDealershipName, EntStoreBrand, EntLatitude, EntLongitude, EntDefaultDlrshpLvl1,
                      EntDefaultDlrshpLvl2
FROM         dbo.Dim_Entity


```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
