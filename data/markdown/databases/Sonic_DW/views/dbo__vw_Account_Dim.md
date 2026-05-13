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
depends_on:
  - Dim_Account
dependency_count: 1
column_count: 48
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_Account** (U )

## Columns

| Name                           | Type     | Nullable | Description |
| ------------------------------ | -------- | -------- | ----------- |
| `AccountKey`                   | int      |          |             |
| `AccCoraAcctId`                | int      |          |             |
| `AccCompanyId`                 | int      | ✓        |             |
| `AccDeptId`                    | varchar  | ✓        |             |
| `AccAccountNumber`             | varchar  | ✓        |             |
| `AccAccountDesc`               | varchar  | ✓        |             |
| `AccAccountType`               | char     | ✓        |             |
| `AccAccountTypeDesc`           | varchar  | ✓        |             |
| `AccAccountSubType`            | char     | ✓        |             |
| `AccAccountSubTypeDesc`        | varchar  | ✓        |             |
| `AccAccountUpdateDate`         | datetime | ✓        |             |
| `AccControlType`               | int      | ✓        |             |
| `AccControlTypeDesc`           | varchar  | ✓        |             |
| `AccControl2Type`              | int      | ✓        |             |
| `AccControl2TypeDesc`          | varchar  | ✓        |             |
| `AccIncomeBalanceGroup`        | varchar  | ✓        |             |
| `AccIncomeBalanceGroupDesc`    | varchar  | ✓        |             |
| `AccIncomeBalanceSubGroup`     | varchar  | ✓        |             |
| `AccIncomeBalanceSubGroupDesc` | varchar  | ✓        |             |
| `AccProductionType`            | int      | ✓        |             |
| `AccProductionTypeDesc`        | varchar  | ✓        |             |
| `AccReportGroup`               | varchar  | ✓        |             |
| `AccReportGroupDesc`           | varchar  | ✓        |             |
| `AccUNAGroup`                  | varchar  | ✓        |             |
| `AccUNAGroupDesc`              | varchar  | ✓        |             |
| `AccEntityType`                | varchar  | ✓        |             |
| `AccCOAType`                   | varchar  | ✓        |             |
| `AccActiveFlag`                | bit      | ✓        |             |
| `AccPrefix`                    | varchar  | ✓        |             |
| `AccAccount`                   | varchar  | ✓        |             |
| `AccDepartmentLookup`          | varchar  | ✓        |             |
| `AccDepartment`                | varchar  | ✓        |             |
| `AccDepartmentName`            | varchar  | ✓        |             |
| `AccAccountCategory`           | varchar  | ✓        |             |
| `AccExcludeFlag`               | bit      | ✓        |             |
| `AccHFMAccount`                | varchar  | ✓        |             |
| `AccHFMDepartment`             | varchar  | ✓        |             |
| `ETLExecution_ID`              | int      | ✓        |             |
| `MetaSrc_Sys_ID`               | int      | ✓        |             |
| `MetaSourceSystemName`         | varchar  | ✓        |             |
| `MetaRowEffectiveDate`         | datetime | ✓        |             |
| `MetaRowExpiredDate`           | datetime | ✓        |             |
| `MetaRowIsCurrent`             | char     | ✓        |             |
| `MetaRowLastChangedDate`       | datetime | ✓        |             |
| `MetaAuditKey`                 | int      | ✓        |             |
| `MetaNaturalKey`               | varchar  | ✓        |             |
| `MetaNaturalKeyU`              | nvarchar | ✓        |             |
| `MetaChecksum`                 | int      | ✓        |             |

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

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
