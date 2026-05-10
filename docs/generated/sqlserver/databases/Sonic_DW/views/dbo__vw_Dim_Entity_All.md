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
extracted_at: 2026-05-09T12:34:14.349Z
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
             
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
