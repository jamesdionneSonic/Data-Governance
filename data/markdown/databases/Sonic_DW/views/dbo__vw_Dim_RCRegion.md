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
depends_on:
  - DimAssociate
  - DimRegion
  - RegionAssociate
dependency_count: 3
column_count: 7
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.DimAssociate** (U )
- **dbo.DimRegion** (U )
- **dbo.RegionAssociate** (U )

## Columns

| Name                 | Type    | Nullable | Description |
| -------------------- | ------- | -------- | ----------- |
| `RCRegionKey`        | bigint  |          |             |
| `Region`             | varchar | ✓        |             |
| `LineOfBusiness`     | varchar | ✓        |             |
| `RCAssociateKey`     | int     | ✓        |             |
| `RCFirstName`        | varchar | ✓        |             |
| `RCLastName`         | varchar | ✓        |             |
| `RCWorkEmailAddress` | varchar | ✓        |             |

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

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
