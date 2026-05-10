---
name: vw_NewDealDataWMSRP
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
--DDC MSRP & FIRE Deal Data
create view vw_NewDealDataWMSRP as
with DDCData as
(
SELECT t.datetime_loaded,
t.stockno,
t.msrp,
t.price
FROM
(SELECT ROW_NUMBER() OVER (PARTITION BY stockno ORDER BY datetime_loaded desc) AS RowNo,
datetime_loaded,
stockno,
msrp,
price
FROM [cor-sql-02].[BI_WorkDB].[dbo].[DDC_Inventory_4x]	
where cast(msrp as float) <>0
and cast(price as float) <>0
and datetime_loaded > '1/1/12'
and TYPE = 2 --new
)t
WHERE t.RowNo=1 
--and cast(msrp as float) <>
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
