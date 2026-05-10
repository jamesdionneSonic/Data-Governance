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
extracted_at: 2026-05-09T12:34:14.349Z
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
                       
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
