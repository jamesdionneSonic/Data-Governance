---
name: vw_Dim_User
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
CREATE VIEW dbo.vw_Dim_User
AS
SELECT        u.EmployeeID, u.ADName, u.ADEmail, u.EntityKey, u.AsoFirstName, u.AsoLastName, u.AsoecJobtitle, u.AsoJobCode, u.MSTRMetadataUserID, dbo.Dim_Entity.EntDealerLvl1, u.AssociateKey
FROM            (SELECT        a0.EmployeeID, a0.ADName, a0.ADEmail, COALESCE (a3.EntityKey, a1.EntityKey, - 1) AS EntityKey, a1.AsoFirstName, a1.AsoLastName, a1.AsoecJobtitle, a1.AsoJobCode, a2_1.MSTRMetadataUserID, 
                                                    a1.A
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
