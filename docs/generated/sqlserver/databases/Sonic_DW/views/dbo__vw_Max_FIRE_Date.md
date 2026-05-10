---
name: vw_Max_FIRE_Date
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

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Definition

```sql

CREATE VIEW [dbo].[vw_Ma]
AS
SELECT     
a.FullDate,
c.EntDFIDRegion,
c.EntDealerLvl1,
b.Stockno,
b.DealNo,
b.fiwipstatuscode,
b.Amount,
b.DealCount
FROM         
dbo.vw_Dim_date AS a 
INNER JOIN
dbo.factFIRE_A AS b ON  a.DateKey = b.AccountingDateKey
INNER JOIN
dbo.vw_Dim_Entity AS c ON b.EntityKey = c.EntityKey
WHERE b.AccountingDateKey BETWEEN ((CONVERT(INT, (DATEPART(yyyy, DATEADD(mm,1,(GETDATE ()))) 
* 10000 + DATEPART(mm, (GETDATE ())) *100 +1)))) AND (CONVERT(INT,((CON
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
