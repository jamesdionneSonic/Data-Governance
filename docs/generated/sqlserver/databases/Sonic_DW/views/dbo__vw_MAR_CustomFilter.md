---
name: vw_MAR_CustomFilter
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

1- **Type**: View
- **Schema**: dbo

## Definition

```sql

CREATE VIEW [dbo].[vw_MAR_CustomFilter]
AS
SELECT		 [DateKey], 'LM' AS DATE_RANGE
FROM		 [Sonic_DW].[dbo].[vw_Dim_date]
WHERE		 FullDate >= DATEADD(month, -1, DATEADD(month, DATEDIFF(month, 0, GETDATE()), 0)) AND FullDate < DATEADD(month, DATEDIFF(month, 0, GETDATE()), 0)
UNION
SELECT       [DateKey], 'MTD' AS DATE_RANGE
FROM         [Sonic_DW].[dbo].[vw_Dim_date]
WHERE        Year([FullDate]) = YEAR(GETDATE() -1) AND MONTH([FullDate]) = MONTH(GETDATE() -1) AND FullDate <= CAST(GETDATE() 
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
