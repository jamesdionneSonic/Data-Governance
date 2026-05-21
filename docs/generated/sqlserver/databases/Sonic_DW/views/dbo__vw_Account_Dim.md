---
name: vw_Account_Dim
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
CREATE VIEW dbo.vw_Account_Dim
AS
SELECT     AccountKey, AccCoraAcctId, AccCompanyId, AccDeptId, AccAccountNumber, AccAccountDesc, AccAccountType, AccAccountTypeDesc,
                      AccAccountSubType, AccAccountSubTypeDesc, AccAccountUpdateDate, AccControlType, AccControlTypeDesc, AccControl2Type, AccControl2TypeDesc,
                      AccIncomeBalanceGroup, AccIncomeBalanceGroupDesc, AccIncomeBalanceSubGroup, AccIncomeBalanceSubGroupDesc, AccProductionType,
                      AccProductionTypeDesc, AccReportGroup, AccReportGroupDesc, AccUNAGroup, AccUNAGroupDesc, AccEntityType, AccCOAType, AccActiveFlag,
                      AccPrefix, AccAccount, AccDepartmentLookup, AccDepartment, AccDepartmentName, AccAccountCategory, AccExcludeFlag, AccHFMAccount,
                      AccHFMDepartment, ETLExecution_ID, MetaSrc_Sys_ID, MetaSourceSystemName, MetaRowEffectiveDate, MetaRowExpiredDate, MetaRowIsCurrent,
                      MetaRowLastChangedDate, MetaAuditKey, MetaNaturalKey, MetaNaturalKeyU, MetaChecksum
FROM         dbo.Dim_Account

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
