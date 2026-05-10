---
name: vw_Dim_EntityMAR
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






/* Exclude undesired Stevens Creek BMW entities*/ --Two stores from Toyoto - Toyota of Paris and Toyota of Mt. Pleasant - needed to be non rfj so we made a managed stores column which will be the new filter for the rfj selector in MSTR
--marketing team wanted a filter for what they manage and dont manage instead of the RFJ filter. 
CREATE VIEW [dbo].[vw_Dim_EntityMAR]
AS

SELECT        e.EntityKey, e.EntCora_Account_ID, e.EntADPCompanyID, e.EntAccountingPrefix, e.EntEntityType, 
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
