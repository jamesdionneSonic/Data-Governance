---
name: vw_dailydoc_totsonic
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




CREATE view [dbo].[vw_dailydoc_totsonic] as
select
(cast((cast(GETDATE () as date))as datetime))as FireDate,
(cast((cast(A.reportdate as date))as datetime)) as DocDate,
(cast((cast(A.reportmonth as date))as datetime)) as DocMonth,
(case when (cast((cast(GETDATE () as date))as datetime)) = (cast((cast(A.reportdate as date))as datetime))then 1 else 0 end) as ConditionalDate,
B.EntDFIDRegion,
A.EssCode,
B.EntDealerLvl1,
A.NetFI_DOC,
A.NetFIUnits_DOC
from [cor-sql-02].bi_workdb.dbo.vw_dailydoc_totsonic A
inner join [cor-bisql-02\bisql02].SONIC_DW.dbo.vw_Dim_Entity_Esscode B
on A.EssCode = B.EntEssCode
where reportdate = (select MAX(reportdate) from [cor-sql-02].bi_workdb.dbo.vw_dailydoc_totsonic)




```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
