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
extracted_at: 2026-05-09T12:34:14.349Z
---

## Overview

1- **Type**: View
- **Schema**: dbo

## Definition

```sql
CREATE VIEW dbo.vw_Corporate_Union
AS
SELECT        U.EntityKey, U.FiscalMonthKey, U.AccountMgmtKey, CASE WHEN CorpDepartmentKey IN (358, 359, 369) THEN 130 ELSE CorpDepartmentKey END AS DepartmentKey, U.SECRollupKey, U.ScenarioKey, U.Amount, U.StatCount, 
                         U.UnionTableID, U.DisplayAmount, U.Override, CASE WHEN ScenarioKey = 7 THEN (CASE WHEN AccountType = 'EXPENSE' THEN DisplayAmount * - 1 ELSE DisplayAmount END) ELSE 0.0000 END AS DisplayAmountBudget, 
             
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
