---
name: vwStandardLeadSource
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
CREATE VIEW dbo.vwStandardLeadSource
AS
SELECT        d.StandardLeadSourceID, d.StandardLeadSourceName, d.CreatedOn, d.CreatedBy, d.ModifiedOn, d.ModifiedBy, t.LeadSourceTierName, CASE WHEN ept.LeadSourceTierName IS NULL 
                         THEN 'Unassigned' ELSE ept.LeadSourceTierName END AS EPLeadSourceTierName, upt.LeadUpTypeTierName, CASE WHEN pst.LeadSourceTierName IS NULL 
                         THEN 'Unassigned' ELSE pst.LeadSourceTierName END AS PSLeadSourceTierName
FROM    
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
