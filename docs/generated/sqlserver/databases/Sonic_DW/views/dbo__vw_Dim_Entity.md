---
name: vw_Dim_Entity
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

/* Exclude undesired Stevens Creek BMW entities*/
CREATE VIEW [dbo].[vw_Dim_Entity]
AS
SELECT        e.EntityKey, e.EntCora_Account_ID, (CASE WHEN e.EntADPCompanyID = 139 AND e.EntAccountingPrefix IN (2, 3) THEN 134 ELSE e.EntADPCompanyID END) AS EntADPCompanyID, e.EntAccountingPrefix, e.EntEntityType, 
                         e.EntFDMName, e.EntRegion, e.EntAcquiredDate, e.EntAddressLine1, e.EntAddressMailingLine1, e.EntAddressCity, e.EntAddressState, e.EntAddressZipCode, e.EntMainPhoneN
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
