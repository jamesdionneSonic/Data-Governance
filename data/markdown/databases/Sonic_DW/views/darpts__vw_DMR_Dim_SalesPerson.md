---
name: vw_DMR_Dim_SalesPerson
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
/* Name: darpts.vw_DRM_Dim_SalesPerson
* Created by: Hermann Brandi
* Purpose: Trash dimension for Sales Person using the column(s) from fact tables.
* It is set as trash dimension because there is no data architecture work.
* Change Control:
* Date			Developer Name		Comment
* 20251008		Hermann Brandi		View was created.
*
*/
CREATE   VIEW darpts.vw_DMR_Dim_SalesPerson
AS
SELECT
	DISTINCT ds.Sales_Person
FROM  Sonic_DW.darpts.vw_DMR_Sales ds
UNION
SELECT
	DISTINCT ExperienceGuideName AS Sales_Person
FROM Sonic_DW.dbo.vw_EP_NPS_DMR_90;
```

## Governance

- **Last Extracted**: 2026-05-12T20:14:33.860Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
