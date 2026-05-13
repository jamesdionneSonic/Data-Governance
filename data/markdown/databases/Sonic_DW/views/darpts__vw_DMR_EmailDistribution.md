---
name: vw_DMR_EmailDistribution
database: Sonic_DW
type: view
schema: darpts
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
dependency_count: 1
column_count: 0
extracted_at: 2026-05-12T20:14:33.860Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: darpts

## Dependencies

This view depends on:

- **dbo.DMR_Distemail** (U )

## Definition

```sql


/* Name: [darpts].[vw_dmr_EmailDistribution]
 * Created by: Viji Krishnan
 * Purpose: Email at Entitykey level for email bursting.
 *
 * Change Control:
 * Date			Developer Name		Comment
 * 20251114		Viji Krishnan		View was created.

 *
 */
CREATE    VIEW [darpts].[vw_DMR_EmailDistribution]
AS
SELECT
	ent.EntityKey
	, ent.EntSIMSStoreID
	,ent.entdealerlvl1
	,  distemail.Email

FROM Sonic_DW.dbo.vw_Dim_EntityEP ent
left join dbo.DMR_Distemail distemail
on ent.entitykey=distemail.entitykey
WHERE 1=1
	AND ent.EntActive = 'Active'
	AND ent.EntDefaultDlrshpLvl1 = '1'
	AND ent.EntRegion NOT IN ('Hibernated', 'RFJ')

```

## Governance

- **Last Extracted**: 2026-05-12T20:14:33.860Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
