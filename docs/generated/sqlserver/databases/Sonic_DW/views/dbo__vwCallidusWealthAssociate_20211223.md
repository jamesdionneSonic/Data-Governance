---
name: vwCallidusWealthAssociate_20211223
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

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Definition

```sql





CREATE view [dbo].[vwCallidusWealthAssociate_20211223] as 

SELECT distinct e.EntBrand
              ,e.EntStoreBrand
              ,e.EntDealerLvl1
              ,COALESCE(gm.GMName,oldsup.AsoSupervisorName, a.AsoSupervisorName) as AsoSupervisorName
              ,a.AsoLastName + ', ' +a.AsoFirstName + case when a.AsoMiddleName = 'UNKNOWN' THEN '' else ' ' + a.AsoMiddleName end AssociateName
              ,a.AsoLocation
              ,a.AsoEmployeeNumber
              ,conver
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
