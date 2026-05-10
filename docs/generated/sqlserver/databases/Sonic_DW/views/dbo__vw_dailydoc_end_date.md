---
name: vw_dailydoc_end_date
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
CREATE view [dbo].[vw_dailydoc_end_date] as
SELECT
(CONVERT(INT,((CONVERT(VARCHAR,(DATEPART(yyyy,CONVERT(DATE,(select max(a.DocDate)))))))
+ (CONVERT(VARCHAR,(DATEPART(mm,CONVERT(DATE,(select max(a.DocDate)))))))
+ ((CONVERT(VARCHAR,(DATEPART(dd,CONVERT(date,(DATEADD(s,-1,DATEADD(mm, 
DATEDIFF(m,0,(select max(DocDate)from dbo.vw_dailydoc_totsonic))+1,0)))))))))))) AS DateKey,
(CONVERT(INT,((CONVERT(VARCHAR,(DATEPART(yyyy,CONVERT(DATE,(select max(a.DocDate)))))))
+ (CONVERT(VARCHAR,(DATEPA
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
