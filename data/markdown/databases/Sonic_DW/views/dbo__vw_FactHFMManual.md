---
name: vw_FactHFMManual
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - Dim_Entity
  - Dim_Month
dependency_count: 2
column_count: 17
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_Entity** (U )
- **dbo.Dim_Month** (U )

## Columns

| Name                    | Type     | Nullable | Description |
| ----------------------- | -------- | -------- | ----------- |
| `Fact_HMF_Key`          | bigint   | ✓        |             |
| `DateKey`               | int      | ✓        |             |
| `HFMBrandKey`           | int      |          |             |
| `ScenarioKey`           | int      |          |             |
| `EntityKey`             | int      |          |             |
| `DepartmentKey`         | int      |          |             |
| `AccountMgmtKey`        | int      |          |             |
| `Amount`                | int      |          |             |
| `StatCount`             | int      |          |             |
| `Meta_SourceSystemName` | varchar  |          |             |
| `Meta_RowEffectiveDate` | datetime |          |             |
| `Meta_RowIsCurrent`     | varchar  |          |             |
| `ETLExecution_ID`       | int      |          |             |
| `User_ID`               | varchar  |          |             |
| `Meta_ComputerName`     | varchar  |          |             |
| `Meta_LoadDate`         | int      | ✓        |             |
| `SECRollupKey`          | int      |          |             |

## Definition

```sql
CREATE VIEW dbo.vw_FactHFMManual
AS
SELECT       ROW_NUMBER() OVER (ORDER BY EntityKey) AS Fact_HMF_Key, StartDateKey AS DateKey, -1 AS HFMBrandKey, 7 AS ScenarioKey, EntityKey, 4 AS DepartmentKey, 335 AS AccountMgmtKey, 0 AS Amount, 0 AS StatCount, '0Budget' AS Meta_SourceSystemName, GetDate() AS Meta_RowEffectiveDate
,'Y' AS Meta_RowIsCurrent, 1 AS ETLExecution_ID, 'Ustrastvc' AS User_ID, 'Manual' as Meta_ComputerName, NULL as Meta_LoadDate, -1 AS SECRollupKey
FROM            dbo.Dim_Entity AS e
CROSS JOIN dbo.Dim_Month AS m
WHERE        (e.EntActive = 'Active') AND (e.EntCOAType = 'Dealership') AND (m.FiscalYear = Year(GetDate()))

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
