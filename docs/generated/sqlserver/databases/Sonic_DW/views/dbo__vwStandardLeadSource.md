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
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
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
FROM            dbo.DimStandardLeadSource AS d INNER JOIN
                         dbo.DimLeadSourceTier AS t ON d.LeadSourceTierID = t.LeadSourceTierID LEFT OUTER JOIN
                         dbo.DimLeadUpTypeTier AS upt ON d.UpTypeTierID = upt.LeadUpTypeTierID LEFT OUTER JOIN
                         dbo.DimLeadSourceTier AS ept ON d.LeadSourceTierEPID = ept.LeadSourceTierID LEFT OUTER JOIN
                         dbo.DimLeadSourceTier AS pst ON d.LeadSourceTierPSID = pst.LeadSourceTierID

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
