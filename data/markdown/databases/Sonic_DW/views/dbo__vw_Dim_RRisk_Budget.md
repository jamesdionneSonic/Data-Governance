---
name: vw_Dim_RRisk_Budget
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - Dim_RRisk_ForecastAccounts
  - vw_Dim_Account
dependency_count: 2
column_count: 14
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_RRisk_ForecastAccounts** (U )
- **dbo.vw_Dim_Account** (V )

## Columns

| Name                  | Type     | Nullable | Description |
| --------------------- | -------- | -------- | ----------- |
| `store_name`          | nvarchar | ✓        |             |
| `account_number_dms`  | varchar  | ✓        |             |
| `AccountNum`          | varchar  | ✓        |             |
| `account_description` | nvarchar | ✓        |             |
| `account_type`        | nvarchar | ✓        |             |
| `category`            | nvarchar | ✓        |             |
| `sub_category`        | nvarchar | ✓        |             |
| `brand_name`          | nvarchar | ✓        |             |
| `department`          | nvarchar | ✓        |             |
| `EntityKey`           | int      | ✓        |             |
| `AccountMgmtKey`      | int      | ✓        |             |
| `AccHFMAccount`       | varchar  | ✓        |             |
| `DepartmentKey`       | int      |          |             |
| `RankByAccHFMAccount` | bigint   | ✓        |             |

## Definition

```sql


CREATE VIEW [dbo].[vw_Dim_RRisk_Budget]
AS
SELECT * FROM
(SELECT *, ROW_NUMBER() OVER (
        PARTITION BY AccHFMAccount, DepartmentKey, EntityKey
        ORDER BY EntityKey ASC
    ) AS RankByAccHFMAccount
FROM
(SELECT        dbo.Dim_RRisk_ForecastAccounts.store_name, dbo.Dim_RRisk_ForecastAccounts.account_number_dms, dbo.Dim_RRisk_ForecastAccounts.AccountNum, dbo.Dim_RRisk_ForecastAccounts.account_description,
                         dbo.Dim_RRisk_ForecastAccounts.account_type, dbo.Dim_RRisk_ForecastAccounts.category, dbo.Dim_RRisk_ForecastAccounts.sub_category, dbo.Dim_RRisk_ForecastAccounts.brand_name,
                         dbo.Dim_RRisk_ForecastAccounts.department, dbo.Dim_RRisk_ForecastAccounts.EntityKey, dbo.vw_Dim_Account.AccountMgmtKey, dbo.vw_Dim_Account.AccHFMAccount,
                         CASE WHEN Department = 'NEW' THEN 2 WHEN Department = 'USED' THEN 4 WHEN Department = 'SERVICE' THEN 6 WHEN Department = 'COLLISION' THEN 5 WHEN Department = 'PARTS' THEN 7 ELSE 2 END AS DepartmentKey
FROM            dbo.vw_Dim_Account RIGHT OUTER JOIN
                         dbo.Dim_RRisk_ForecastAccounts ON dbo.vw_Dim_Account.EntityKey = dbo.Dim_RRisk_ForecastAccounts.EntityKey AND dbo.vw_Dim_Account.AccAccountNumber = dbo.Dim_RRisk_ForecastAccounts.account_number_dms) A1
 ) AS R
 WHERE RankByAccHFMAccount = 1

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
