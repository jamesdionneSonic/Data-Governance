---
name: vw_Dim_Dealership_All
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
CREATE VIEW dbo.vw_Dim_Dealership_All
AS
SELECT        TOP (100) PERCENT e.EntDealerLvl1, e.EntDealerLvl2, e.EntStoreBrand, e.EntDFODRegion, e.EntDFIDRegion, e.EntRegion, e.EntAddressState, e.EntEssCode, e.EntActive, e.EntBrandGroup AS EntStoreBrandGroup, 
                         e.EntAccountingPrefix, e.EntCora_Account_ID, e.EntADPCompanyID, e.EntDefaultDlrshpLvl1, e.EntSubRegion, e.EntLineOfBusiness, MAX(d2.EntityKey) AS DealershipLvl2EntityKey, MAX(d1.EntityKey) 
                        
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
