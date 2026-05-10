---
name: vw_eleads_goals_view
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








/*------------------------------------------------------
Step 1: Source data from eLead and DOC budgets for:
     CM - Current Month
  LM - Last Month
  LY - Last Year

Note- the elead data % for leads/sales use a rolling two month history to compare to current month budget.
------------------------------------------------------*/

CREATE view [dbo].[vw_eleads_goals_view] as

--------------Current Month Metrics--------------
with HistoryCM as (
select entitykey 
 , 
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
