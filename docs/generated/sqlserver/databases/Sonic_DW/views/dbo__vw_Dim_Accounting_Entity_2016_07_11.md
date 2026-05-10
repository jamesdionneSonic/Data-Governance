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
extracted_at: 2026-05-09T12:34:14.349Z
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
  
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
