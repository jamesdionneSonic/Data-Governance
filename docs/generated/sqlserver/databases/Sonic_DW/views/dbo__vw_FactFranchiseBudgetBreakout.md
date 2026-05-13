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
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
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
                         ServiceGrossActual / NULLIF (NewGrossActual + UsedGrossActual + ServiceGrossActual, 0) AS ServiceGrossPercent, TotalGrossActual + TotalAdCredits AS TotalNetSpend
FROM            dbo.Fact_FranchiseBudgetBreakout

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
