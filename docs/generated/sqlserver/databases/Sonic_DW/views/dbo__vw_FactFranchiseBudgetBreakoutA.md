---
name: vw_FactFranchiseBudgetBreakoutA
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

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Definition

```sql


CREATE VIEW [dbo].[vw_FactFranchiseBudgetBreakoutA]
AS
SELECT        FranchiseBudgetBreakoutID, EntityKey, FiscalMonthKey, TotalGrossActual, NewGrossActual, UsedGrossActual, ServiceGrossActual, TotalAdCredits, NewGrossActual / (NewGrossActual + UsedGrossActual + ServiceGrossActual) 
                         AS NewGrossPercent, UsedGrossActual / (NewGrossActual + UsedGrossActual + ServiceGrossActual) AS UsedGrossPercent, ServiceGrossActual / (NewGrossActual + UsedGrossActual + ServiceGross
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
