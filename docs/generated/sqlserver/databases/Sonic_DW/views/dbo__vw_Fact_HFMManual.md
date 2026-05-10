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
extracted_at: 2026-05-09T12:34:14.349Z
---

## Overview

1- **Type**: View
- **Schema**: dbo

## Definition

```sql
CREATE VIEW dbo.vw_Fact_HFMManual
AS
SELECT        ROW_NUMBER() OVER (ORDER BY EntityKey) AS Fact_HFM_Key, StartDateKey AS DateKey, - 1 AS HFMBrandKey, 7 AS ScenarioKey, EntityKey, 4 AS DepartmentKey, AccountMgmtKey, 0 AS Amount, 0 AS StatCount, 
0 AS Meta_Src_Sys_ID, '0Budget' AS Meta_SourceSystemName, GetDate() AS Meta_RowEffectiveDate, 'Y' AS Meta_RowIsCurrent, 1 AS ETLExecution_ID, 'Ustrastvc' AS User_ID, 'Manual' AS Meta_ComputerName, NULL 
AS Meta_LoadDate, - 1 AS SECRollupKey
FROM   
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
