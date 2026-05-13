---
name: vw_Fact_HFMBudget
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
  - Dim_Date
  - Dim_Entity
  - Dim_SECRollup
  - Fact_HFM
  - vw_Fact_HFMManual
dependency_count: 6
column_count: 19
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

2- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_AccountMgmt** (U )
- **dbo.Dim_Date** (U )
- **dbo.Dim_Entity** (U )
- **dbo.Dim_SECRollup** (U )
- **dbo.Fact_HFM** (U )
- **dbo.vw_Fact_HFMManual** (V )

## Columns

| Name                | Type    | Nullable | Description |
| ------------------- | ------- | -------- | ----------- |
| `Fact_HFM_Key`      | bigint  | ✓        |             |
| `DateKey`           | int     | ✓        |             |
| `HFMBrandKey`       | int     | ✓        |             |
| `EntityKey`         | int     | ✓        |             |
| `DepartmentKey`     | int     | ✓        |             |
| `AccountMgmtKey`    | int     | ✓        |             |
| `Amount`            | money   | ✓        |             |
| `BudgetAmountStore` | money   | ✓        |             |
| `BudgetAmountCorp`  | money   | ✓        |             |
| `StatCount`         | money   | ✓        |             |
| `Meta_Src_Sys_ID`   | int     | ✓        |             |
| `ScenarioKey`       | int     | ✓        |             |
| `SECRollupKey`      | int     | ✓        |             |
| `FiscalMonthKey`    | int     | ✓        |             |
| `UnionTableID`      | varchar | ✓        |             |
| `CorpDepartmentKey` | int     | ✓        |             |
| `EntEssCode`        | varchar | ✓        |             |
| `Level8`            | varchar | ✓        |             |
| `Backup`            | int     | ✓        |             |

## Definition

```sql

CREATE VIEW [dbo].[vw_Fact_HFMBudget]
AS
SELECT H.Fact_HFM_Key, H.DateKey, H.HFMBrandKey, CASE WHEN H.EntityKey = 60 THEN 666 WHEN H.EntityKey = 59 THEN 665 ELSE H.EntityKey END AS EntityKey, H.DepartmentKey, H.AccountMgmtKey, H.Amount, am.Budget_Sign * H.Amount AS BudgetAmountStore, sec.Budget_Sign * H.Amount AS BudgetAmountCorp,
             H.StatCount, H.Meta_Src_Sys_ID, H.ScenarioKey, H.SECRollupKey, dbo.Dim_Date.FiscalMonthKey, CAST(H.ScenarioKey AS varchar(2)) + '.' + CAST(H.Fact_HFM_Key AS varchar(50)) AS UnionTableID, H.DepartmentKey AS CorpDepartmentKey, e.EntEssCode, am.Level8,
             (CASE WHEN e.EntDealerLvl1 IN ('Sonic Real Estate', 'EchoPark Real Estate') THEN 146 WHEN e.EntDealerLvl1 = 'Divisional' AND
             DepartmentKey = 18 THEN 21 WHEN e.entdealerlvl1 = 'EchoPark Corporate' THEN 21 WHEN e.entdealerlvl1 = 'Sonic University' THEN 147 ELSE DepartmentKey END) AS [Backup]
FROM   (SELECT Fact_HFM_Key, DateKey, HFMBrandKey, ScenarioKey, EntityKey, DepartmentKey, AccountMgmtKey, Amount, StatCount, Meta_Src_Sys_ID, Meta_SourceSystemName, Meta_RowEffectiveDate, Meta_RowIsCurrent, ETLExecution_ID, User_ID, Meta_ComputerName,
                           Meta_LoadDate, SECRollupKey
             FROM    dbo.Fact_HFM
             UNION
             SELECT Fact_HFM_Key, DateKey, HFMBrandKey, ScenarioKey, EntityKey, DepartmentKey, AccountMgmtKey, Amount, StatCount, Meta_Src_Sys_ID, Meta_SourceSystemName, Meta_RowEffectiveDate, Meta_RowIsCurrent, ETLExecution_ID, User_ID, Meta_ComputerName,
                          Meta_LoadDate, SECRollupKey
             FROM   dbo.vw_Fact_HFMManual) AS H LEFT OUTER JOIN
             dbo.Dim_AccountMgmt AS am ON H.AccountMgmtKey = am.AccountMgmtKey INNER JOIN
             dbo.Dim_Date ON H.DateKey = dbo.Dim_Date.DateKey INNER JOIN
             dbo.Dim_Entity AS e ON H.EntityKey = e.EntityKey LEFT OUTER JOIN
             dbo.Dim_SECRollup AS sec ON H.SECRollupKey = sec.SECRollupKey
WHERE (H.ScenarioKey = 7)

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
