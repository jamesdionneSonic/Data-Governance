---
name: usp_GetQuartileDateRange_BckUp_20150909
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
dependency_count: 0
parameter_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Definition

```sql
CREATE PROCEDURE [dbo].[usp_GetQuartileDateRange] (
 @st DATETIME
 ,@en DATETIME
 )

/*
========================
Author : Amrendra Kumar
Date : 22 Jul 2015
Remarks : To get the MTD extraction date range for the Quartile report ETL
========================
*/
AS

select st,en,mnt,yr from
(
select min(st) st,en,month(DATEADD(mm, DATEDIFF(m, 0, st) , 0)) mnt,year(DATEADD(mm, DATEDIFF(m, 0, st) , 0)) yr
from
(

select DATEADD(mm, DATEDIFF(m, 0, st) , 0) st,DATEADD(mm, DATEDIFF(m, 0, st) , 0)+14 as en
from
(
  select  min(FullDate) st,max(FullDate) en from dim_date
  where FullDate between @st and @en
  group by month(FullDate),year(FullDate)

)OK1
union  all
select DATEADD(mm, DATEDIFF(m, 0, st) , 0) st,en
from
(
  select  min(FullDate) st,max(FullDate) en from dim_date
  where FullDate between @st and @en
  group by month(FullDate),year(FullDate)

)OK
)OK1
group by en,month(DATEADD(mm, DATEDIFF(m, 0, st) , 0)) ,year(DATEADD(mm, DATEDIFF(m, 0, st) , 0))
)OK2
where en>=@st and en <=@en

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
