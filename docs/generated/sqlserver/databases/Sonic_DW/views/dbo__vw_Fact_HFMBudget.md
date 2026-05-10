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
extracted_at: 2026-05-09T12:34:14.349Z
---

## Overview

2- **Type**: View
- **Schema**: dbo

## Definition

```sql

CREATE VIEW [dbo].[vw_Fact_HFMBudget]
AS
SELECT H.Fact_HFM_Key, H.DateKey, H.HFMBrandKey, CASE WHEN H.EntityKey = 60 THEN 666 WHEN H.EntityKey = 59 THEN 665 ELSE H.EntityKey END AS EntityKey, H.DepartmentKey, H.AccountMgmtKey, H.Amount, am.Budget_Sign * H.Amount AS BudgetAmountStore, sec.Budget_Sign * H.Amount AS BudgetAmountCorp, 
             H.StatCount, H.Meta_Src_Sys_ID, H.ScenarioKey, H.SECRollupKey, dbo.Dim_Date.FiscalMonthKey, CAST(H.ScenarioKey AS varchar(2)) + '.' + CAST(H.Fact_HF
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
