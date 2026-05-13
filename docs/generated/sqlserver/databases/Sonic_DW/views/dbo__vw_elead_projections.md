---
name: vw_elead_projections
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
CREATE VIEW dbo.vw_elead_projections
AS
SELECT        dbo.Dim_Entity.EntRegion, dbo.Dim_Entity.EntLineOfBusiness, dbo.Dim_Entity.EntDealerLvl1, dbo.Dim_Entity.EntBrand, dbo.Fact_elead_projections.EntityKey, dbo.Fact_elead_projections.NewUsed,
                         dbo.Fact_elead_projections.FiscalMonthKey, dbo.Fact_elead_projections.Tracking, dbo.Fact_elead_projections.LeadCountTY, dbo.Fact_elead_projections.EleadsDMSSold, dbo.Fact_elead_projections.SysStartTime,
                         dbo.Fact_elead_projections.SysEndTime
FROM            dbo.Fact_elead_projections INNER JOIN
                         dbo.Dim_Entity ON dbo.Fact_elead_projections.EntityKey = dbo.Dim_Entity.EntityKey

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
