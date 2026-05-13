---
name: vw_START_Union
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - vw_Dim_Account
  - vw_Dim_Entity_All
  - vw_Fact_AccountingSummary
  - vw_Fact_HFM
  - vw_START_OtherSources
dependency_count: 5
column_count: 17
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.vw_Dim_Account** (V )
- **dbo.vw_Dim_Entity_All** (V )
- **dbo.vw_Fact_AccountingSummary** (V )
- **dbo.vw_Fact_HFM** (V )
- **dbo.vw_START_OtherSources** (V )

## Columns

| Name                     | Type    | Nullable | Description |
| ------------------------ | ------- | -------- | ----------- |
| `EntityKey`              | int     | ✓        |             |
| `FiscalMonthKey`         | int     | ✓        |             |
| `AccountMgmtKey`         | int     | ✓        |             |
| `DepartmentKey`          | int     | ✓        |             |
| `SECRollupKey`           | int     | ✓        |             |
| `ScenarioKey`            | int     | ✓        |             |
| `Amount`                 | decimal | ✓        |             |
| `StatCount`              | decimal | ✓        |             |
| `UnionTableID`           | varchar | ✓        |             |
| `DisplayAmount`          | decimal | ✓        |             |
| `HFMBrandKey`            | int     | ✓        |             |
| `DisplayAmountBudget`    | decimal | ✓        |             |
| `DisplayAmountBudget_v3` | decimal | ✓        |             |
| `StatCountBudget_v3`     | decimal | ✓        |             |
| `StatCountBudget`        | decimal | ✓        |             |
| `DisplayAmountActual`    | decimal | ✓        |             |
| `StatCountActual`        | decimal | ✓        |             |

## Definition

```sql

CREATE VIEW [dbo].[vw_START_Union]
AS
SELECT        U.EntityKey, U.FiscalMonthKey, U.AccountMgmtKey, U.DepartmentKey, U.SECRollupKey, U.ScenarioKey, U.Amount, U.StatCount, U.UnionTableID, U.DisplayAmount, U.HFMBrandKey,
                         CASE WHEN ScenarioKey = 7 THEN DisplayAmount ELSE 0.0000 END AS DisplayAmountBudget,
                         CASE WHEN ScenarioKey = 45 THEN DisplayAmount ELSE 0.0000 END AS DisplayAmountBudget_v3,
                         CASE WHEN ScenarioKey = 45 THEN StatCount ELSE 0 END AS StatCountBudget_v3,
                         CASE WHEN ScenarioKey = 7 THEN StatCount ELSE 0 END AS StatCountBudget,
                         CASE WHEN ScenarioKey IN (8, 31, 33)
                         THEN DisplayAmount ELSE 0.0000 END AS DisplayAmountActual,

                         CASE WHEN ScenarioKey IN (8, 31, 33) THEN StatCount ELSE 0 END AS StatCountActual
FROM            (SELECT        FAC.EntityKey, FAC.FiscalMonthKey, FAC.AccountMgmtKey, DA.DepartmentKey, FAC.SECRollupKey, FAC.ScenarioKey, FAC.Amount, FAC.StatCount, FAC.UnionTableID, FAC.DisplayAmount, FAC.HFMBrandKey
                          FROM            dbo.vw_Fact_AccountingSummary AS FAC INNER JOIN
                                                    dbo.vw_Dim_Account AS DA ON FAC.AccountKey = DA.AccountKey
                          UNION ALL
                          SELECT        CASE WHEN EntityKey = 60 THEN 666 WHEN EntityKey = 59 THEN 665 ELSE EntityKey END EntityKey, FiscalMonthKey, AccountMgmtKey, DepartmentKey, SECRollupKey, ScenarioKey, Amount, StatCount, UnionTableID, DisplayAmount, HFMBrandKey
                          FROM            dbo.vw_Fact_HFM
                          UNION ALL
                          SELECT        EntityKey, FiscalMonthKey, AccountMgmtKey, DepartmentKey, SECRollUpKey, ScenarioKey, Amount, StatCount, UnionTableID, DisplayAmount, HFMBrandKey
                          FROM            dbo.vw_START_OtherSources) AS U INNER JOIN
                         dbo.vw_Dim_Entity_All AS e ON U.EntityKey = e.EntityKey

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
