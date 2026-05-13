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
depends_on:
  - Dim_Entity
  - Doc_TXN_Login
dependency_count: 2
column_count: 10
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_Entity** (U )
- **dbo.Doc_TXN_Login** (U )

## Columns

| Name                 | Type     | Nullable | Description |
| -------------------- | -------- | -------- | ----------- |
| `LoginKey`           | int      |          |             |
| `MicroStrategyLogin` | nvarchar |          |             |
| `EntityKey`          | int      | ✓        |             |
| `ReviewerFlag`       | int      |          |             |
| `ControllerFlag`     | int      |          |             |
| `EntDealerLvl2`      | varchar  | ✓        |             |
| `EntDealerLvl1`      | varchar  | ✓        |             |
| `EntLineOfBusiness`  | varchar  | ✓        |             |
| `EntRegion`          | varchar  | ✓        |             |
| `EntSubRegion`       | varchar  | ✓        |             |

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

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
