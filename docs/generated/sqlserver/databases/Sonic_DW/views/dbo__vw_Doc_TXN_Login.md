---
name: vw_Doc_TXN_Login
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
CREATE VIEW dbo.vw_Doc_TXN_Login
AS
SELECT dbo.Doc_TXN_Login.LoginKey, dbo.Doc_TXN_Login.MicroStrategyLogin, dbo.Doc_TXN_Login.EntityKey, dbo.Doc_TXN_Login.ReviewerFlag, dbo.Doc_TXN_Login.ControllerFlag, dbo.Dim_Entity.EntDealerLvl2, dbo.Dim_Entity.EntDealerLvl1, dbo.Dim_Entity.EntLineOfBusiness,
             dbo.Dim_Entity.EntRegion, dbo.Dim_Entity.EntSubRegion
FROM   dbo.Doc_TXN_Login INNER JOIN
             dbo.Dim_Entity ON dbo.Doc_TXN_Login.EntityKey = dbo.Dim_Entity.EntityKey
WHERE (dbo.Dim_Entity.EntActive = 'Active') AND (dbo.Dim_Entity.EntDefaultDlrshpLvl1 = '1')

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
