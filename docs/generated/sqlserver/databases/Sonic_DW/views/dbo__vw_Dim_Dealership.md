---
name: vw_Dim_Dealership
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
/***********************************************************************
* - Created by Jonathan Henin
* - Updated 07/16/2012
* - Used by MicroStrategy
*
*
************************************************************************/
CREATE VIEW dbo.vw_Dim_Dealership
AS
SELECT        TOP (100) PERCENT e.EntDealerLvl1, e.EntDealerLvl2, e.EntStoreBrand, e.EntDFODRegion, e.EntDFIDRegion, e.EntRegion, e.EntAddressState, e.EntEssCode, e.EntActive, e.EntBrandGroup AS EntStoreBrandGroup,
                         e.EntAccountingPrefix, e.EntCora_Account_ID, (CASE WHEN e.EntADPCompanyID = 139 AND e.EntAccountingPrefix IN (2, 3) THEN 134 ELSE e.EntADPCompanyID END) AS EntADPCompanyID, e.EntDefaultDlrshpLvl1,
                         e.EntSubRegion, e.EntLineOfBusiness, MAX(d2.EntityKey) AS DealershipLvl2EntityKey, MAX(d1.EntityKey) AS DealershipLvl1EntityKey, e.EntStoreBrand + ' Store ' + RIGHT(e.EntEssCode, 2) AS DealershipMask, e.EntLatitude,
                         e.EntLongitude, d3.DivisionGroup
FROM            dbo.Dim_Entity AS e LEFT OUTER JOIN
                             (SELECT        EntityKey, EntDealerLvl2
                               FROM            dbo.Dim_Entity
                               WHERE        (EntDefaultDlrshpLvl2 = 1)) AS d2 ON e.EntDealerLvl2 = d2.EntDealerLvl2 LEFT OUTER JOIN
                             (SELECT        EntityKey, EntDealerLvl1
                               FROM            dbo.Dim_Entity AS Dim_Entity_1
                               WHERE        (EntDefaultDlrshpLvl1 = 1)) AS d1 ON e.EntDealerLvl1 = d1.EntDealerLvl1 LEFT OUTER JOIN
                             (SELECT        r.EntityKey, CAST(r.AttributeField AS varchar(50)) AS DivisionGroup
                               FROM            dbo.DimEntityRelationship AS r INNER JOIN
                                                         dbo.DimEntityRelationshipType AS t ON r.RelationshipTypeGuid = t.RelationshipTypeGuid
                               WHERE        (t.RelationshipType = 'BrandDivisions') AND (r.IsActive = 1)) AS d3 ON d3.EntityKey = d1.EntityKey
WHERE        (e.EntDefaultDlrshpLvl1 = '1') AND (e.EntLineOfBusiness = 'Sonic') AND (e.EntEntityType = 'Dealership') OR
                         (e.EntDefaultDlrshpLvl1 = '1') AND (e.EntEntityType = 'Dealership') AND (e.EntDealerLvl1 LIKE '%tactical%')
GROUP BY e.EntDealerLvl1, e.EntStoreBrand, e.EntDFODRegion, e.EntDFIDRegion, e.EntRegion, e.EntAddressState, e.EntEssCode, e.EntActive, e.EntBrandGroup, e.EntAccountingPrefix, e.EntCora_Account_ID, e.EntADPCompanyID,
                         e.EntDealerLvl2, e.EntDefaultDlrshpLvl1, e.EntSubRegion, e.EntLineOfBusiness, e.EntityKey, e.EntLatitude, e.EntLongitude, d3.DivisionGroup
HAVING        (e.EntActive = 'Active')
ORDER BY e.EntDealerLvl1

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
