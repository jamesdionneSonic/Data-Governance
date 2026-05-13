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
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

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

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
