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
depends_on:
  - Fact_FranchiseBudgetBreakout
dependency_count: 1
column_count: 12
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Fact_FranchiseBudgetBreakout** (U )

## Columns

| Name                        | Type  | Nullable | Description |
| --------------------------- | ----- | -------- | ----------- |
| `FranchiseBudgetBreakoutID` | int   |          |             |
| `EntityKey`                 | int   |          |             |
| `FiscalMonthKey`            | int   |          |             |
| `TotalGrossActual`          | money | ✓        |             |
| `NewGrossActual`            | money | ✓        |             |
| `UsedGrossActual`           | money | ✓        |             |
| `ServiceGrossActual`        | money | ✓        |             |
| `TotalAdCredits`            | money | ✓        |             |
| `NewGrossPercent`           | money | ✓        |             |
| `UsedGrossPercent`          | money | ✓        |             |
| `ServiceGrossPercent`       | money | ✓        |             |
| `TotalNetSpend`             | money | ✓        |             |

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

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
