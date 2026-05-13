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

| Name                  | Type    | Nullable | Description |
| --------------------- | ------- | -------- | ----------- |
| `RegionKey`           | bigint  |          |             |
| `Region`              | varchar | ✓        |             |
| `LineOfBusiness`      | varchar | ✓        |             |
| `RVPAssociateKey`     | int     | ✓        |             |
| `RVPFirstName`        | varchar | ✓        |             |
| `RVPLastName`         | varchar | ✓        |             |
| `RVPWorkEmailAddress` | varchar | ✓        |             |

## Definition

```sql
CREATE VIEW dbo.vw_Dim_Region
AS
SELECT        r.RegionKey, r.Region, r.LineOfBusiness, MAX(rvp.AssociateKey) AS RVPAssociateKey, MAX(rvp.AsoFirstName) AS RVPFirstName, MAX(rvp.AsoLastName) AS RVPLastName, MAX(rvp.AsoWorkEmailAddress)
                         AS RVPWorkEmailAddress
FROM            dbo.RegionAssociate AS a RIGHT OUTER JOIN
                         dbo.DimRegion AS r ON a.RegionKey = r.RegionKey LEFT OUTER JOIN
                             (SELECT        AssociateKey, AsoFirstName, AsoLastName, AsoWorkEmailAddress
                               FROM            dbo.DimAssociate
                               WHERE        (AsoJobCode = 'CRVP')) AS rvp ON a.AssociateKey = rvp.AssociateKey
GROUP BY r.RegionKey, r.Region, r.LineOfBusiness

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
