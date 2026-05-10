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
extracted_at: 2026-05-09T12:34:14.349Z
---

## Overview

1- **Type**: View
- **Schema**: dbo

## Definition

```sql

CREATE VIEW [dbo].[vw_START_Union]
AS
SELECT        U.EntityKey, U.FiscalMonthKey, U.AccountMgmtKey, U.DepartmentKey, U.SECRollupKey, U.ScenarioKey, U.Amount, U.StatCount, U.UnionTableID, U.DisplayAmount, U.HFMBrandKey,
                         CASE WHEN ScenarioKey = 7 THEN DisplayAmount ELSE 0.0000 END AS DisplayAmountBudget,
                         CASE WHEN ScenarioKey = 45 THEN DisplayAmount ELSE 0.0000 END AS DisplayAmountBudget_v3,
                         CASE WHEN ScenarioKey = 
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
