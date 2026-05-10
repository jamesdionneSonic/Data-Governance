---
name: vw_DimLeadSubSource
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
CREATE VIEW dbo.vw_DimLeadSubSource
AS
SELECT        ss.LeadSubSourceKey, CASE WHEN ss.LeadSubSourceName = 'Unknown' THEN 'No Sub-Source' ELSE ss.LeadSubSourceName END AS LeadSubSourceName, ss.eLeadSubSourceID, ss.eLeadChildCompanyID, 
                         ss.ETLExecution_ID, ss.Meta_ComputerName, ss.Meta_LoadDate, ss.Meta_Naturalkey, ISNULL(m.MaxLeadSubSourceKey, - 1) AS MaxLeadSubSourceKey
FROM            dbo.DimLeadSubSource AS ss LEFT OUTER JOIN
                             (SELECT 
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
