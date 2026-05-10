---
name: vw_Dim_Account_old
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
SELECT     AccountKey, AccCoraAcctId, AccCompanyId, AccDeptId, AccAccountNumber, AccAccountDesc, AccAccountType, AccAccountTypeDesc, 
                      AccAccountSubType, AccAccountSubTypeDesc, AccAccountUpdateDate, AccControlType, AccControlTypeDesc, AccControl2Type, AccControl2TypeDesc, 
                      AccIncomeBalanceGroup, AccIncomeBalanceGroupDesc, AccIncomeBalanceSubGroup, AccIncomeBalanceSubGroupDesc, AccProductionType, 
                  
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
