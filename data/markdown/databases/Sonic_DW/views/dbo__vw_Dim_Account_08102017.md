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
depends_on:
  - Dim_Account
  - Dim_DepartmentRoll
  - Dim_Entity
dependency_count: 3
column_count: 39
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_Account** (U )
- **dbo.Dim_DepartmentRoll** (U )
- **dbo.Dim_Entity** (U )

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
| `DepartmentKey`                | int      | ✓        |             |
| `EntityKey`                    | int      |          |             |

## Definition

```sql
CREATE VIEW dbo.vw_Dim_Account
AS
SELECT        a.AccountKey, a.AccCoraAcctId, a.AccCompanyId, a.AccDeptId, a.AccAccountNumber, a.AccAccountDesc, a.AccAccountType, a.AccAccountTypeDesc, a.AccAccountSubType, a.AccAccountSubTypeDesc, a.AccAccountUpdateDate,
                         a.AccControlType, a.AccControlTypeDesc, a.AccControl2Type, a.AccControl2TypeDesc, a.AccIncomeBalanceGroup, a.AccIncomeBalanceGroupDesc, a.AccIncomeBalanceSubGroup, a.AccIncomeBalanceSubGroupDesc,
                         a.AccProductionType, a.AccProductionTypeDesc, a.AccReportGroup, a.AccReportGroupDesc, a.AccUNAGroup, a.AccUNAGroupDesc, a.AccEntityType, a.AccCOAType, a.AccActiveFlag, a.AccPrefix,
                         CASE WHEN AccAccount = 'Unknown' THEN '-1' ELSE AccAccount END AS AccAccount, a.AccDepartmentLookup, a.AccDepartment, a.AccDepartmentName, a.AccAccountCategory, a.AccExcludeFlag,
                         CASE WHEN AccHFMAccount = 'Unknown' THEN '-1' ELSE AccHFMAccount END AS AccHFMAccount, a.AccHFMDepartment, d.DepartmentKey, ISNULL(e.EntityKey, - 1) AS EntityKey
FROM            dbo.Dim_Account AS a LEFT OUTER JOIN
                         dbo.Dim_DepartmentRoll AS d ON a.AccHFMDepartment = d.DepartmentName LEFT OUTER JOIN
                         dbo.Dim_Entity AS e ON a.AccCoraAcctId = e.EntCora_Account_ID AND CAST(a.AccCompanyId AS varchar(3)) = e.EntADPCompanyID AND a.AccPrefix = e.EntAccountingPrefix

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
