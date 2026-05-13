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
CREATE view [dbo].[vw_dailydoc_end_date] as
SELECT
(CONVERT(INT,((CONVERT(VARCHAR,(DATEPART(yyyy,CONVERT(DATE,(select max(a.DocDate)))))))
+ (CONVERT(VARCHAR,(DATEPART(mm,CONVERT(DATE,(select max(a.DocDate)))))))
+ ((CONVERT(VARCHAR,(DATEPART(dd,CONVERT(date,(DATEADD(s,-1,DATEADD(mm,
DATEDIFF(m,0,(select max(DocDate)from dbo.vw_dailydoc_totsonic))+1,0)))))))))))) AS DateKey,
(CONVERT(INT,((CONVERT(VARCHAR,(DATEPART(yyyy,CONVERT(DATE,(select max(a.DocDate)))))))
+ (CONVERT(VARCHAR,(DATEPART(mm,CONVERT(DATE,(select max(a.DocDate)))))))
+ ((CONVERT(VARCHAR,(DATEPART(dd,CONVERT(date,(DATEADD(s,-1,DATEADD(mm,
DATEDIFF(m,0,(select max(DocDate)from dbo.vw_dailydoc_totsonic))+1,0)))))))))))) AS LastDate,
(CONVERT(datetime,(CONVERT(VARCHAR,(DATEPART(yyyy,CONVERT(DATE,(select max(a.DocDate)))))))
+ (CONVERT(VARCHAR,(DATEPART(mm,CONVERT(DATE,(select max(a.DocDate)))))))
+ (SELECT (CONVERT(VARCHAR,(DATEPART(dd,CONVERT(date,(DATEADD(s,-1,DATEADD(mm,
DATEDIFF(m,0,(select max(a.DocDate)))+1,0)))))))))))AS FullLastDate
from dbo.vw_dailydoc_totsonic as a

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
