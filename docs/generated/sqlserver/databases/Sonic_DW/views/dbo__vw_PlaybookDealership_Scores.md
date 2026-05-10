---
name: vw_PlaybookDealership_Scores
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




CREATE VIEW [dbo].[vw_PlaybookDealership_Scores]
AS
select
pa99.[EntRegion]  Region,
pa99.[EntHFMDealershipName]  Dealership,
sum(pa99.WJXBFS1)Score,
sum(pa99.WJXBFS2)Max_Score,
sum(pa99.WJXBFS4)Score_Pct

from
(
select	a16.[EntRegion]  EntRegion,
	a16.[EntDealerLvl1]  EntHFMDealershipName,
	a14.[PbeEntityID]  EntityKey,
	(coalesce(a16.[EntHFMDealershipName], '') + ' - ' + coalesce(a16.[EntBrand], ''))  CustCol_1,
	a14.[PbePlaybookID]  PlaybookID,
	a112.[PlaybookName]  Pl
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
