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
depends_on:
  - DimLeadSourceTier
  - DimLeadUpTypeTier
  - DimStandardLeadSource
dependency_count: 3
column_count: 10
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

2- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.DimLeadSourceTier** (U )
- **dbo.DimLeadUpTypeTier** (U )
- **dbo.DimStandardLeadSource** (U )

## Columns

| Name                     | Type     | Nullable | Description |
| ------------------------ | -------- | -------- | ----------- |
| `StandardLeadSourceID`   | int      |          |             |
| `StandardLeadSourceName` | varchar  | ✓        |             |
| `CreatedOn`              | datetime |          |             |
| `CreatedBy`              | varchar  |          |             |
| `ModifiedOn`             | datetime | ✓        |             |
| `ModifiedBy`             | varchar  | ✓        |             |
| `LeadSourceTierName`     | varchar  | ✓        |             |
| `EPLeadSourceTierName`   | varchar  | ✓        |             |
| `LeadUpTypeTierName`     | varchar  | ✓        |             |
| `PSLeadSourceTierName`   | varchar  | ✓        |             |

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

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
