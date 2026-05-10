---
name: vw_TMDOCProjectionsAdvertising
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

CREATE VIEW [dbo].[vw_TMDOCProjectionsAdvertising]
AS
WITH doc_proj AS (
    SELECT DISTINCT
        [a15].[DealershipLvl1EntityKey] AS [EntityKey],
        [pa12].[FiscalMonthKey],
        CONVERT(INT, [pa12].[GrossAdSpend]) AS [GrossAdSpend],
        CONVERT(INT, [pa12].[Credits] + [pa12].[GrossAdSpend]) AS [NetAdSpend]
    FROM (
        SELECT
            [a12].[EntDealerLvl1] AS [EntDealerLvl1],
            [a11].[DOCMonthKey] AS [FiscalMonthKey],
            SUM(CASE 
      
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
