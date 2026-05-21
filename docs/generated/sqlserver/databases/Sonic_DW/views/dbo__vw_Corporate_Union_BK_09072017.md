---
name: vw_Corporate_Union_BK_09072017
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

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Definition

```sql

CREATE VIEW [dbo].[vw_Corporate_Union]
AS
SELECT        U.EntityKey, U.FiscalMonthKey, U.AccountMgmtKey, (CASE WHEN e.EntDealerLvl1 IN ('Sonic Real Estate', 'EchoPark Real Estate') THEN 146 WHEN e.EntDealerLvl1 = 'Divisional' AND
                         DepartmentKey = 18 THEN 147 ELSE DepartmentKey END) AS DepartmentKey, U.SECRollupKey, U.ScenarioKey, U.Amount, U.StatCount, U.UnionTableID, U.DisplayAmount
FROM            (SELECT        FAC.EntityKey, FAC.FiscalMonthKey, FAC.AccountMgmtKey, DA.DepartmentKey, FAC.SECRollupKey, FAC.ScenarioKey, FAC.Amount, FAC.StatCount, FAC.UnionTableID, FAC.DisplayAmount
                          FROM            dbo.vw_Fact_AccountingSummary AS FAC INNER JOIN
                                                    dbo.vw_Dim_Account AS DA ON FAC.AccountKey = DA.AccountKey
                          UNION ALL
                          SELECT        EntityKey, FiscalMonthKey, AccountMgmtKey, DepartmentKey, SECRollupKey, ScenarioKey, Amount, StatCount, UnionTableID, DisplayAmount
                          FROM            dbo.vw_Fact_HFM
                          WHERE        (ScenarioKey <> 1)) AS U INNER JOIN
                         dbo.vw_Dim_Entity_Corporate AS e ON U.EntityKey = e.EntityKey

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
