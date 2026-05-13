---
name: vw_Corporate_Union
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - Dim_SECRollup
  - Fact_CorporateUnionOverride
  - vw_Dim_Account
  - vw_Dim_Entity_Corporate
  - vw_Fact_AccountingSummary
  - vw_Fact_HFMBudget
dependency_count: 6
column_count: 15
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_SECRollup** (U )
- **dbo.Fact_CorporateUnionOverride** (U )
- **dbo.vw_Dim_Account** (V )
- **dbo.vw_Dim_Entity_Corporate** (V )
- **dbo.vw_Fact_AccountingSummary** (V )
- **dbo.vw_Fact_HFMBudget** (V )

## Columns

| Name                  | Type    | Nullable | Description |
| --------------------- | ------- | -------- | ----------- |
| `EntityKey`           | int     | ✓        |             |
| `FiscalMonthKey`      | int     | ✓        |             |
| `AccountMgmtKey`      | int     | ✓        |             |
| `DepartmentKey`       | int     | ✓        |             |
| `SECRollupKey`        | int     | ✓        |             |
| `ScenarioKey`         | int     | ✓        |             |
| `Amount`              | money   | ✓        |             |
| `StatCount`           | money   | ✓        |             |
| `UnionTableID`        | varchar | ✓        |             |
| `DisplayAmount`       | money   | ✓        |             |
| `Override`            | int     |          |             |
| `DisplayAmountBudget` | numeric | ✓        |             |
| `StatCountBudget`     | numeric | ✓        |             |
| `DisplayAmountActual` | money   | ✓        |             |
| `StatCountActual`     | money   | ✓        |             |

## Definition

```sql
CREATE VIEW dbo.vw_Corporate_Union
AS
SELECT        U.EntityKey, U.FiscalMonthKey, U.AccountMgmtKey, CASE WHEN CorpDepartmentKey IN (358, 359, 369) THEN 130 ELSE CorpDepartmentKey END AS DepartmentKey, U.SECRollupKey, U.ScenarioKey, U.Amount, U.StatCount,
                         U.UnionTableID, U.DisplayAmount, U.Override, CASE WHEN ScenarioKey = 7 THEN (CASE WHEN AccountType = 'EXPENSE' THEN DisplayAmount * - 1 ELSE DisplayAmount END) ELSE 0.0000 END AS DisplayAmountBudget,
                         CASE WHEN ScenarioKey = 7 THEN StatCount ELSE 0.0000 END AS StatCountBudget, CASE WHEN ScenarioKey IN (8, 31, 33) THEN (CASE WHEN AccountType = 'EXPENSE' THEN DisplayAmount * - 1 ELSE DisplayAmount END)
                         ELSE 0 END AS DisplayAmountActual, CASE WHEN ScenarioKey IN (8, 31, 33) THEN StatCount ELSE 0 END AS StatCountActual
FROM            (SELECT        FAC.EntityKey, FAC.FiscalMonthKey, FAC.AccountMgmtKey, DA.DepartmentKey AS CorpDepartmentKey, FAC.SECRollupKey, FAC.ScenarioKey, FAC.Amount, FAC.StatCount, FAC.UnionTableID,
                                                    FAC.CorporateDisplayAmount AS DisplayAmount, 0 AS Override
                          FROM            dbo.vw_Fact_AccountingSummary AS FAC INNER JOIN
                                                    dbo.vw_Dim_Account AS DA ON FAC.AccountKey = DA.AccountKey
                          UNION ALL
                          SELECT        EntityKey, FiscalMonthKey, AccountMgmtKey, CorpDepartmentKey, SECRollupKey, ScenarioKey, Amount, StatCount, UnionTableID, BudgetAmountCorp AS DisplayAmount, 0 AS Override
                          FROM            dbo.vw_Fact_HFMBudget
                          WHERE        (ScenarioKey <> 1)
                          UNION ALL
                          SELECT        EntityKey, FiscalMonthKey, AccountMgmtKey, CorpDepartmentKey, SECRollupKey, ScenarioKey, Amount, StatCount, CAST(31 AS varchar(2)) + '.' + CAST(CorporateUnionOverrideKey AS varchar(50))
                                                   + '.X' AS UnionTableID, Amount AS DisplayAmount, 1 AS Override
                          FROM            dbo.Fact_CorporateUnionOverride) AS U INNER JOIN
                         dbo.vw_Dim_Entity_Corporate AS e ON U.EntityKey = e.EntityKey LEFT OUTER JOIN
                         dbo.Dim_SECRollup ON U.SECRollupKey = dbo.Dim_SECRollup.SECRollupKey

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
