---
name: vw_Fact_HFM
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
  - Dim_Date
  - Dim_Entity
  - Fact_HFM
dependency_count: 4
column_count: 15
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_AccountMgmt** (U )
- **dbo.Dim_Date** (U )
- **dbo.Dim_Entity** (U )
- **dbo.Fact_HFM** (U )

## Columns

| Name                    | Type    | Nullable | Description |
| ----------------------- | ------- | -------- | ----------- |
| `Fact_HFM_Key`          | int     |          |             |
| `DateKey`               | int     | ✓        |             |
| `HFMBrandKey`           | int     | ✓        |             |
| `ScenarioKey`           | int     | ✓        |             |
| `EntityKey`             | int     | ✓        |             |
| `DepartmentKey`         | int     | ✓        |             |
| `AccountMgmtKey`        | int     | ✓        |             |
| `Amount`                | money   | ✓        |             |
| `StatCount`             | money   | ✓        |             |
| `Meta_SourceSystemName` | varchar | ✓        |             |
| `FiscalMonthKey`        | int     | ✓        |             |
| `UnionTableID`          | varchar | ✓        |             |
| `SECRollupKey`          | int     | ✓        |             |
| `DisplayAmount`         | money   | ✓        |             |
| `CorpDepartmentKey`     | int     | ✓        |             |

## Definition

```sql



CREATE VIEW [dbo].[vw_Fact_HFM]
AS
SELECT        dbo.Fact_HFM.Fact_HFM_Key, dbo.Fact_HFM.DateKey, dbo.Fact_HFM.HFMBrandKey, dbo.Fact_HFM.ScenarioKey, dbo.Fact_HFM.EntityKey, dbo.Fact_HFM.DepartmentKey, dbo.Fact_HFM.AccountMgmtKey,
                         dbo.Fact_HFM.Amount, dbo.Fact_HFM.StatCount, dbo.Fact_HFM.Meta_SourceSystemName, dbo.Dim_Date.FiscalMonthKey, CAST(dbo.Fact_HFM.ScenarioKey AS varchar(2))
                         + '.' + CAST(dbo.Fact_HFM.Fact_HFM_Key AS varchar(50)) AS UnionTableID, dbo.Fact_HFM.SECRollupKey, dbo.Dim_AccountMgmt.HFM_Sign * dbo.Fact_HFM.Amount AS DisplayAmount,
                         (CASE WHEN e.EntDealerLvl1 IN ('Sonic Real Estate', 'EchoPark Real Estate') THEN 146 WHEN e.EntDealerLvl1 = 'Divisional' AND
                         DepartmentKey = 18 THEN 21 WHEN e.entdealerlvl1 = 'EchoPark Corporate' THEN 21 WHEN e.entdealerlvl1 = 'Sonic University' THEN 147 ELSE DepartmentKey END) AS CorpDepartmentKey
FROM            dbo.Fact_HFM INNER JOIN
                         dbo.Dim_Date ON dbo.Fact_HFM.DateKey = dbo.Dim_Date.DateKey INNER JOIN
                         dbo.Dim_AccountMgmt ON dbo.Fact_HFM.AccountMgmtKey = dbo.Dim_AccountMgmt.AccountMgmtKey INNER JOIN
                         dbo.Dim_Entity AS e ON dbo.Fact_HFM.EntityKey = e.EntityKey

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
