---
name: vw_Fact_HFMBudget_08102017
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - Fact_HFM
dependency_count: 1
column_count: 9
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Fact_HFM** (U )

## Columns

| Name              | Type  | Nullable | Description |
| ----------------- | ----- | -------- | ----------- |
| `Fact_HFM_Key`    | int   |          |             |
| `DateKey`         | int   | ✓        |             |
| `HFMBrandKey`     | int   | ✓        |             |
| `EntityKey`       | int   | ✓        |             |
| `DepartmentKey`   | int   | ✓        |             |
| `AccountMgmtKey`  | int   | ✓        |             |
| `Amount`          | money | ✓        |             |
| `StatCount`       | money | ✓        |             |
| `Meta_Src_Sys_ID` | int   | ✓        |             |

## Definition

```sql
CREATE VIEW dbo.vw_Fact_HFMBudget
AS
SELECT        Fact_HFM_Key, DateKey, HFMBrandKey, EntityKey, DepartmentKey, AccountMgmtKey, Amount, StatCount, Meta_Src_Sys_ID
FROM            dbo.Fact_HFM
WHERE        (ScenarioKey = 7)

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
