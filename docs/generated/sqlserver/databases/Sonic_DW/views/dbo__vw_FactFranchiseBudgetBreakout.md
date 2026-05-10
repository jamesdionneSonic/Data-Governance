---
name: vw_FactFranchiseBudgetBreakout
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
CREATE VIEW dbo.vw_FactFranchiseBudgetBreakout
AS
SELECT        FranchiseBudgetBreakoutID, EntityKey, FiscalMonthKey, TotalGrossActual, NewGrossActual, UsedGrossActual, ServiceGrossActual, TotalAdCredits, 
                         NewGrossActual / NULLIF (NewGrossActual + UsedGrossActual + ServiceGrossActual, 0) AS NewGrossPercent, UsedGrossActual / NULLIF (NewGrossActual + UsedGrossActual + ServiceGrossActual, 0) AS UsedGrossPercent, 
                         ServiceGrossActual / NULLIF (Ne
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
