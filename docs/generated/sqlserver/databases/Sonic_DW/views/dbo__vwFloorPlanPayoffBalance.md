---
name: vwFloorPlanPayoffBalance
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


create view [dbo].[vwFloorPlanPayoffBalance] as 



/********************************************************************************************/
/* Author: Lindsay DePree		Date: 2020-05-21		Comments: Intial Creation			*/
/* Modified:					Date:					Comments:							*/
/********************************************************************************************/

SELECT	a.accaccount as Account, 
        a.AccAccountNumber as AccountNumber,
		MIN(dd.FullDate) AS AgeDate,
		MAX(e.en
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
