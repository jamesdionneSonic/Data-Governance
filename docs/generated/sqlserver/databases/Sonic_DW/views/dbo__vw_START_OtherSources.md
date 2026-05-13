---
name: vw_START_OtherSources
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
CREATE VIEW dbo.vw_START_OtherSources
AS
SELECT        s.EntityKey, s.FiscalMonthKey, s.AccountMgmtKey, s.DepartmentKey, MAX(- 1) AS SECRollUpKey, s.ScenarioKey, SUM(COALESCE (s.Amount, 0.0000)) AS Amount, SUM(COALESCE (s.StatCount, 0)) AS StatCount,
                         CAST(s.ScenarioKey AS varchar(2)) + '.' + CAST(MAX(s.StartMORMetricsKey) AS varchar(50)) AS UnionTableID, SUM(COALESCE (s.Amount, 0.0000)) AS DisplayAmount, - 1 AS HFMBrandKey
FROM            dbo.StartTotalMORMetrics AS s INNER JOIN
                         dbo.Dim_AccountMgmt AS a ON s.AccountMgmtKey = a.AccountMgmtKey
GROUP BY s.EntityKey, s.FiscalMonthKey, s.AccountMgmtKey, s.DepartmentKey, s.ScenarioKey

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
