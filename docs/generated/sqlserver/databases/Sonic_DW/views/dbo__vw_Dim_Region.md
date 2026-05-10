---
name: vw_Dim_Region
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
CREATE VIEW dbo.vw_Dim_Region
AS
SELECT        r.RegionKey, r.Region, r.LineOfBusiness, MAX(rvp.AssociateKey) AS RVPAssociateKey, MAX(rvp.AsoFirstName) AS RVPFirstName, MAX(rvp.AsoLastName) AS RVPLastName, MAX(rvp.AsoWorkEmailAddress) 
                         AS RVPWorkEmailAddress
FROM            dbo.RegionAssociate AS a RIGHT OUTER JOIN
                         dbo.DimRegion AS r ON a.RegionKey = r.RegionKey LEFT OUTER JOIN
                             (SELECT        AssociateKey, AsoFi
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
