---
name: vw_FixedOpsAvgRunRate
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - DM_FixedOpsAvgRR
dependency_count: 1
column_count: 2
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.DM_FixedOpsAvgRR** (U )

## Columns

| Name            | Type    | Nullable | Description |
| --------------- | ------- | -------- | ----------- |
| `EntDealerLvl1` | varchar | ✓        |             |
| `AvgRunRate`    | numeric | ✓        |             |

## Definition

```sql
CREATE VIEW dbo.vw_FixedOpsAvgRunRate
AS
SELECT        EntDealerLvl1, SUM(FixedOpsGross) / SUM(FixedOpsDaysMonth) AS AvgRunRate
FROM            dbo.DM_FixedOpsAvgRR
GROUP BY EntDealerLvl1

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
