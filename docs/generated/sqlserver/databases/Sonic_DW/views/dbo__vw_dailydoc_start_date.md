---
name: vw_dailydoc_start_date
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
CREATE view [dbo].[vw_dailydoc_start_date] as
SELECT
(CONVERT(INT,((CONVERT(VARCHAR,(DATEPART(yyyy,CONVERT(DATE,(select max(a.DocDate)))))))
+ (CONVERT(VARCHAR,(DATEPART(mm,CONVERT(DATE,(select max(a.DocDate)))))))
+ ('01')))) AS DateKey,
(CONVERT(INT,((CONVERT(VARCHAR,(DATEPART(yyyy,CONVERT(DATE,(select max(a.DocDate)))))))
+ (CONVERT(VARCHAR,(DATEPART(mm,CONVERT(DATE,(select max(a.DocDate)))))))
+ ('01')))) AS FirstDate,
(CONVERT(DATETIME,((CONVERT(VARCHAR,(DATEPART(yyyy,CONVERT(DATE,(select max(a.DocDate)))))))
+ (CONVERT(VARCHAR,(DATEPART(mm,CONVERT(DATE,(select max(a.DocDate)))))))
+ ('01')))) AS FullFirstDate
from dbo.vw_dailydoc_totsonic as a

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
