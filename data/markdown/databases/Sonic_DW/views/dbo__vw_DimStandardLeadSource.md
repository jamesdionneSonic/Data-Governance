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
depends_on:
  - DimLeadSourceTier
  - DimStandardLeadSource
dependency_count: 2
column_count: 11
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.DimLeadSourceTier** (U )
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
| `LeadSourceTierID`       | int      | ✓        |             |
| `ApptType`               | varchar  |          |             |
| `LeadSourceTierName`     | varchar  | ✓        |             |
| `LeadSourceTierEPID`     | int      | ✓        |             |
| `UpTypeTierID`           | int      | ✓        |             |

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

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
