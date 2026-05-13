---
name: vw_DMR_CustomDateFrames
database: Sonic_DW
type: view
schema: darpts
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T20:14:33.860Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: darpts

## Definition

```sql
/* Name: dbo.vw_DMR_CustomDateFrames
* Created by: Hermann Brandi
* Change Control:
* Date			Developer Name		Comment
* 20250818		Hermann Brandi		Added label "2M Ago" to filter only for two months ago inside the documents.
*
*/
CREATE   VIEW darpts.vw_DMR_CustomDateFrames
AS
SELECT		 [DateKey], '2M Ago' AS DATE_RANGE
FROM		 [Sonic_DW].[dbo].[vw_Dim_date]
WHERE		 FullDate >= DATEADD(month, DATEDIFF(month, 0, GETDATE()) - 2, 0) AND FullDate <= DATEADD(day, -1, DATEADD(month, DATEDIFF(month, 0, GETDATE()) - 1, 0))
UNION
SELECT		 [DateKey], 'LM' AS DATE_RANGE
FROM		 [Sonic_DW].[dbo].[vw_Dim_date]
WHERE		 FullDate >= DATEADD(month, -1, DATEADD(month, DATEDIFF(month, 0, GETDATE()), 0)) AND FullDate < DATEADD(month, DATEDIFF(month, 0, GETDATE()), 0)
UNION
SELECT       [DateKey], 'MTD' AS DATE_RANGE
FROM         [Sonic_DW].[dbo].[vw_Dim_date]
WHERE        Year([FullDate]) = YEAR(GETDATE() -1) AND MONTH([FullDate]) = MONTH(GETDATE() -1) AND FullDate <= CAST(GETDATE() - 1 AS Date)
UNION
SELECT       [DateKey], 'YTD' AS DATE_RANGE
FROM         [Sonic_DW].[dbo].[vw_Dim_date]
WHERE        Year([FullDate]) = YEAR(GETDATE() - 1) AND FullDate <= CAST(GETDATE() - 1 AS Date)
UNION
SELECT       [DateKey], 'L7D' AS DATE_RANGE
FROM         [Sonic_DW].[dbo].[vw_Dim_date]
WHERE        [FullDate] >= DATEADD(day, - 8, GETDATE()) AND [FullDate] <= GETDATE() -1
UNION
SELECT       [DateKey], 'Custom' AS DATE_RANGE
FROM         [Sonic_DW].[dbo].[vw_Dim_date]
WHERE        DateKey > 20190000 AND Year([FullDate]) <= YEAR(GETDATE() - 1);
```

## Governance

- **Last Extracted**: 2026-05-12T20:14:33.860Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
