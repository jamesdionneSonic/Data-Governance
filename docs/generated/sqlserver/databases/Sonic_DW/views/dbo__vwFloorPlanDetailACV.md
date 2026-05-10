---
name: vwFloorPlanDetailACV
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



CREATE view [dbo].[vwFloorPlanDetailACV] as 

/********************************************************************************************/
/* Author: Lindsay DePree		Date: 2020-05-21		Comments: Intial Creation			*/
/* Modified: Rajamani Bandi		Date: 2020-06-01		Comments: Updates 					*/
/********************************************************************************************/


/* Inventory Schedule Data with ACV Logic */
select	AccountingDate
		, CDK_Box
		, EntADPCompany
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
