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
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
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
                         dbo.DimLeadSourceTier AS ls ON sls.LeadSourceTierID = ls.LeadSourceTierID

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
