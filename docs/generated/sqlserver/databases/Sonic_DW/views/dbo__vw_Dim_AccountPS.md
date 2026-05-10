---
name: vw_Dim_AccountPS
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
CREATE VIEW dbo.vw_Dim_AccountPS
AS
SELECT        a.PSAccountNumber, a.PSDepartmentKey, a.OneStreamAccountNumber, a.PSAccountDesc, am.AccountMgmtKey, ag.GroupElementSort, a.PSAccountNumber + '-' + CAST(a.PSDepartmentKey AS varchar(2)) AS PSAccountID, 
                         a.DebitCredit
FROM            dbo.Dim_AccountPS AS a LEFT OUTER JOIN
                         dbo.Dim_AccountMgmt AS am ON a.OneStreamAccountNumber = am.Level8 LEFT OUTER JOIN
                         dbo.vw_Doc_Accou
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
