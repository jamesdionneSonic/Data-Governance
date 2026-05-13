---
name: vw_FactFIRE_A_Dealership
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - factFIRE_A
  - vw_dailydoc_dates
  - vw_Dim_date
  - vw_Dim_Entity
dependency_count: 4
column_count: 10
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.factFIRE_A** (U )
- **dbo.vw_dailydoc_dates** (V )
- **dbo.vw_Dim_date** (V )
- **dbo.vw_Dim_Entity** (V )

## Columns

| Name                     | Type     | Nullable | Description |
| ------------------------ | -------- | -------- | ----------- |
| `FullDate`               | datetime | ✓        |             |
| `EntDFIDRegion`          | varchar  | ✓        |             |
| `EntDealerLvl1`          | varchar  | ✓        |             |
| `Stockno`                | varchar  | ✓        |             |
| `DealNo`                 | varchar  | ✓        |             |
| `fiwipstatuscode`        | char     | ✓        |             |
| `FIAccountType`          | char     | ✓        |             |
| `FIGLProductCategoryKey` | int      | ✓        |             |
| `Amount`                 | float    | ✓        |             |
| `DealCount`              | float    |          |             |

## Definition

```sql
CREATE VIEW [dbo].[vw_FactFIRE_A_Dealership]
AS
SELECT
a.FullDate,
c.EntDFIDRegion,
c.EntDealerLvl1,
b.Stockno,
b.DealNo,
b.fiwipstatuscode,
b.FIAccountType,
b.FIGLProductCategoryKey,
b.Amount,
b.DealCount
FROM
dbo.vw_Dim_date AS a
INNER JOIN
dbo.factFIRE_A AS b ON  a.DateKey = b.AccountingDateKey
INNER JOIN
dbo.vw_Dim_Entity AS c ON b.EntityKey = c.EntityKey
WHERE b.AccountingDateKey BETWEEN
(SELECT FirstDate FROM dbo.vw_dailydoc_dates)
AND
(SELECT LastDate FROM dbo.vw_dailydoc_dates)
```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
