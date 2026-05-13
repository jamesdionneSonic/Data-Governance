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
depends_on:
  - Dim_AccountMgmt
  - Dim_AccountPS
  - vw_Doc_AccountGroupingPS
dependency_count: 3
column_count: 8
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_AccountMgmt** (U )
- **dbo.Dim_AccountPS** (U )
- **dbo.vw_Doc_AccountGroupingPS** (V )

## Columns

| Name                     | Type    | Nullable | Description |
| ------------------------ | ------- | -------- | ----------- |
| `PSAccountNumber`        | varchar |          |             |
| `PSDepartmentKey`        | int     |          |             |
| `OneStreamAccountNumber` | varchar | ✓        |             |
| `PSAccountDesc`          | varchar | ✓        |             |
| `AccountMgmtKey`         | int     | ✓        |             |
| `GroupElementSort`       | int     | ✓        |             |
| `PSAccountID`            | varchar | ✓        |             |
| `DebitCredit`            | varchar | ✓        |             |

## Definition

```sql
CREATE VIEW dbo.vw_Dim_AccountPS
AS
SELECT        a.PSAccountNumber, a.PSDepartmentKey, a.OneStreamAccountNumber, a.PSAccountDesc, am.AccountMgmtKey, ag.GroupElementSort, a.PSAccountNumber + '-' + CAST(a.PSDepartmentKey AS varchar(2)) AS PSAccountID,
                         a.DebitCredit
FROM            dbo.Dim_AccountPS AS a LEFT OUTER JOIN
                         dbo.Dim_AccountMgmt AS am ON a.OneStreamAccountNumber = am.Level8 LEFT OUTER JOIN
                         dbo.vw_Doc_AccountGroupingPS AS ag ON a.PSAccountNumber + '-' + CAST(a.PSDepartmentKey AS varchar(2)) = ag.AccountID

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
