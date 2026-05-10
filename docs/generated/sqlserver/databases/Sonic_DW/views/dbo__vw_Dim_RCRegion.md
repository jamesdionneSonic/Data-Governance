---
name: vw_Dim_RCRegion
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
CREATE VIEW dbo.vw_Dim_RCRegion
AS
SELECT        r.RegionKey AS RCRegionKey, r.Region, r.LineOfBusiness, MAX(rc.AssociateKey) AS RCAssociateKey, MAX(rc.AsoFirstName) AS RCFirstName, MAX(rc.AsoLastName) AS RCLastName, MAX(rc.AsoWorkEmailAddress) 
                         AS RCWorkEmailAddress
FROM            dbo.RegionAssociate AS a RIGHT OUTER JOIN
                         dbo.DimRegion AS r ON a.RegionKey = r.RegionKey LEFT OUTER JOIN
                             (SELECT        AssociateK
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
