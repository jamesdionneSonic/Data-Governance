---
name: MarketPerformanceIndicators
database: Sonic_DW
type: view
schema: darpts
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T20:14:33.860Z
---

## Overview

1- **Type**: View

- **Schema**: darpts

## Definition

```sql
CREATE VIEW darpts.MarketPerformanceIndicators
AS
WITH RankedData AS (
    SELECT
        IndicatorId,
        MarketId,
        Month,
        Year,
        (CAST(Year AS VARCHAR(4)) + RIGHT('00' + CAST(Month AS VARCHAR(2)), 2)) AS FiscalMonthKey,
        Value,
        TypeId,
        CreatedBy,
        CreatedOn,
        ModifiedBy,
        ModifiedOn,
        ROW_NUMBER()
            OVER (PARTITION BY MarketId ORDER BY (CAST(Year AS VARCHAR(4)) + RIGHT('00' + CAST(Month AS VARCHAR(2)), 2)) DESC) AS RowNum
    FROM
         [L2-RTSIMSSQL-04 ,12011].[CBS].[dbo].[MarketPerformanceIndicators]
)
SELECT
    IndicatorId,
    MarketId,
    Month + 1 AS Month,
    Year,
    CAST(FiscalMonthKey AS INT) AS FiscalMonthKey,
    Value,
    TypeId,
    CreatedBy,
    CreatedOn,
    ModifiedBy,
    ModifiedOn,
    CASE WHEN RowNum = 1 THEN 'Y' ELSE 'N' END AS IsMostRecent
FROM
    RankedData;


```

## Governance

- **Last Extracted**: 2026-05-12T20:14:33.860Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
