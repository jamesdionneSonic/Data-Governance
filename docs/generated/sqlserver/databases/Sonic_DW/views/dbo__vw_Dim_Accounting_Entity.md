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
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

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

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
