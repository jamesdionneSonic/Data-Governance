---
name: vw_dailydoc_date_range
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

CREATE view [dbo].[vw_dailydoc_date_range] as
select 
(CONVERT(DATETIME,((CONVERT(nvarchar(4),(select max(a.DocDate)), 112))
+(SUBSTRING(CONVERT(nvarchar(6),(select max(a.DocDate)), 112),5,2))
+('01'))))AS FullFirstDate,
(CONVERT(DATETIME,((CONVERT(nvarchar(4),(select max(a.DocDate)), 112))
+(SUBSTRING(CONVERT(nvarchar(6),(select max(a.DocDate)), 112),5,2))
+(CONVERT(VARCHAR,(DATEPART(dd,CONVERT(date,(DATEADD(s,-1,DATEADD(mm, 
DATEDIFF(m,0,(select max(a.DocDate)))+1,0)))))))))))AS Full
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
