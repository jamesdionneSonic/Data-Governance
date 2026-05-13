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
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
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
                             (SELECT        AssociateKey, AsoFirstName, AsoLastName, AsoWorkEmailAddress
                               FROM            dbo.DimAssociate AS DimAssociate_1
                               WHERE        (AsoJobCode = 'CRCONT')) AS rc ON a.AssociateKey = rc.AssociateKey
GROUP BY r.RegionKey, r.Region, r.LineOfBusiness

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
