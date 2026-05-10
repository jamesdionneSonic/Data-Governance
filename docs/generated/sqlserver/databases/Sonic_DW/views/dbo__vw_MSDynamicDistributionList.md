---
name: vw_MSDynamicDistributionList
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

2- **Type**: View
- **Schema**: dbo

## Definition

```sql
CREATE VIEW dbo.vw_MSDynamicDistributionList
AS
SELECT DISTINCT 
                         A.LOGIN AS MicroStrategyLogin, B.ADDRESS AS EmailAddress, D.EntityKey, REPLACE(REPLACE(F.MSTRMetadataDeviceGUID, CHAR(10), ''), CHAR(13), '') AS MSTRMetadataDeviceGUID, REPLACE(F.Personalization, '#0', 
                         E.EntDealerLvl1) AS Personalization, A.MSTRUSER_ID AS MSTRMetaDataUserID, F.GroupingID, SUM(1) AS MSDynamicDistributionListRowCount, E.EntDealerLvl1
FROM            (SELECT     
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
