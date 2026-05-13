---
name: vw_Fact_DMR_Commissions
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
/* Name: darpts.vw_Fact_DMR_Commissions
* Created by: Hermann Brandi
* Purpose: Fact at the Entity key level to extract values for metrics.
*
* Change Control:
* Date			Developer Name		Comment
* 20251015		Hermann Brandi		View was created.
* 20251015		Viji Krishnan		Optimizations to remove the table from query.
* 20251027		Hermann Brandi		Adjusted Silver_Tier value to 30,000.
*
*/
CREATE   VIEW darpts.vw_Fact_DMR_Commissions
AS
SELECT
	vdee.EntityKey
	, vdee.EntSIMSStoreID
	, 3500 as eg_guarantee
	, 30000 as silver_tier
	, 55000 as gold_tier
	, .15 as gold_percent
	, .17 as green_percent
FROM Sonic_DW.dbo.vw_Dim_EntityEP vdee
WHERE 1=1
	AND vdee.EntActive = 'Active'
	AND vdee.EntDefaultDlrshpLvl1 = '1'
	AND vdee.EntRegion NOT IN ('Hibernated', 'RFJ');
```

## Governance

- **Last Extracted**: 2026-05-12T20:14:33.860Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
