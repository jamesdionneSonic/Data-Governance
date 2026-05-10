---
name: vw_Dim_Account_08102017
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
CREATE VIEW dbo.vw_Dim_Account
AS
SELECT        a.AccountKey, a.AccCoraAcctId, a.AccCompanyId, a.AccDeptId, a.AccAccountNumber, a.AccAccountDesc, a.AccAccountType, a.AccAccountTypeDesc, a.AccAccountSubType, a.AccAccountSubTypeDesc, a.AccAccountUpdateDate, 
                         a.AccControlType, a.AccControlTypeDesc, a.AccControl2Type, a.AccControl2TypeDesc, a.AccIncomeBalanceGroup, a.AccIncomeBalanceGroupDesc, a.AccIncomeBalanceSubGroup, a.AccIncomeBalanceSubGroupDesc, 
                 
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
