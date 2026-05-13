---
name: vw_START_Union_09072017
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


CREATE VIEW [dbo].[vw_START_Union]
AS
SELECT        EntityKey, FiscalMonthKey, AccountMgmtKey, DepartmentKey, SECRollupKey, ScenarioKey, Amount, StatCount, UnionTableID, DisplayAmount
FROM            (SELECT        FAC.EntityKey, FAC.FiscalMonthKey, FAC.AccountMgmtKey, DA.DepartmentKey, FAC.SECRollupKey, FAC.ScenarioKey, FAC.Amount, FAC.StatCount, FAC.UnionTableID, FAC.DisplayAmount
                          FROM            dbo.vw_Fact_AccountingSummary AS FAC INNER JOIN
                                                    dbo.vw_Dim_Account AS DA ON FAC.AccountKey = DA.AccountKey
                          UNION ALL
                          SELECT        EntityKey, FiscalMonthKey, AccountMgmtKey, DepartmentKey, SECRollupKey, ScenarioKey, Amount, StatCount, UnionTableID, DisplayAmount
                          FROM            dbo.vw_Fact_HFM
                          WHERE        (ScenarioKey <> 1)) AS U


```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
