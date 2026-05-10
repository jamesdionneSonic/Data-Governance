---
name: vw_Dim_UserLocations
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

CREATE VIEW [dbo].[vw_Dim_UserLocations]
AS
SELECT        CONVERT(varchar(12), u.EmployeeID) + '.' + CONVERT(varchar(3), u.EntityKey) AS UserLocationKey, u.EmployeeID, u.ADName, u.ADEmail, u.EntityKey, u.AsoFirstName, u.AsoLastName, u.AsoecJobtitle, u.AsoJobCode, 
                         u.MSTRMetadataUserID, e.EntDealerLvl1, u.AssociateKey, COALESCE (u.UE_isDefault, 1) AS UE_isDefault, u.UE_DOCPermission, u.UE_TitleTrackingPermission, u.UE_isController, u.UE_isGM, e.EntLineOfBusiness
FRO
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
