---
name: vw_Fact_HFMManual
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - Dim_AccountMgmt
  - Dim_Entity
  - Dim_Month
dependency_count: 3
column_count: 18
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_AccountMgmt** (U )
- **dbo.Dim_Entity** (U )
- **dbo.Dim_Month** (U )

## Columns

| Name                    | Type     | Nullable | Description |
| ----------------------- | -------- | -------- | ----------- |
| `Fact_HFM_Key`          | bigint   | ✓        |             |
| `DateKey`               | int      | ✓        |             |
| `HFMBrandKey`           | int      |          |             |
| `ScenarioKey`           | int      |          |             |
| `EntityKey`             | int      |          |             |
| `DepartmentKey`         | int      |          |             |
| `AccountMgmtKey`        | int      |          |             |
| `Amount`                | int      |          |             |
| `StatCount`             | int      |          |             |
| `Meta_Src_Sys_ID`       | int      |          |             |
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
CREATE VIEW dbo.vw_Fact_HFMManual
AS
SELECT        ROW_NUMBER() OVER (ORDER BY EntityKey) AS Fact_HFM_Key, StartDateKey AS DateKey, - 1 AS HFMBrandKey, 7 AS ScenarioKey, EntityKey, 4 AS DepartmentKey, AccountMgmtKey, 0 AS Amount, 0 AS StatCount,
0 AS Meta_Src_Sys_ID, '0Budget' AS Meta_SourceSystemName, GetDate() AS Meta_RowEffectiveDate, 'Y' AS Meta_RowIsCurrent, 1 AS ETLExecution_ID, 'Ustrastvc' AS User_ID, 'Manual' AS Meta_ComputerName, NULL
AS Meta_LoadDate, - 1 AS SECRollupKey
FROM            dbo.Dim_Entity AS e CROSS JOIN
                         dbo.Dim_Month AS m CROSS JOIN
(SELECT AccountMgmtKey FROM Dim_AccountMgmt WHERE Level8 IN ('4000', '4332')) AS a
WHERE        (e.EntActive = 'Active') AND (e.EntCOAType = 'Dealership') AND (m.FiscalYear = Year(GetDate()))

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
