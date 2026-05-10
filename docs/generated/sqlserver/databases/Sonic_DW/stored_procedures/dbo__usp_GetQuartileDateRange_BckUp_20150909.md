---
name: usp_GetQuartileDateRange_BckUp_20150909
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
extracted_at: 2026-05-09T12:34:14.349Z
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

select DATEADD(mm, DATEDIFF(m, 0, st) , 0) st,DATEADD(mm, DATEDIFF
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
