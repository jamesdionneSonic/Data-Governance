---
name: vw_DimStandardLeadSource
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
CREATE VIEW dbo.vw_DimStandardLeadSource
AS
SELECT        sls.StandardLeadSourceID, sls.StandardLeadSourceName, sls.CreatedOn, sls.CreatedBy, sls.ModifiedOn, sls.ModifiedBy, sls.LeadSourceTierID, 
                         (CASE WHEN ls.leadsourcetiername = 'Vehicle Acquisition' THEN 'Appraisal' ELSE 'Sales' END) AS ApptType, ls.LeadSourceTierName, sls.LeadSourceTierEPID, sls.UpTypeTierID
FROM            dbo.DimStandardLeadSource AS sls INNER JOIN
                         dbo.DimLeadSourceTi
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
