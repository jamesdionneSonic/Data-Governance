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
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

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

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
