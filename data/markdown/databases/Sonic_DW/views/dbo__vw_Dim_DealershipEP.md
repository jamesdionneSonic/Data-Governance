---
name: vw_Dim_DealershipEP
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - Dim_Entity
dependency_count: 1
column_count: 23
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_Entity** (U )

## Columns

| Name                      | Type    | Nullable | Description |
| ------------------------- | ------- | -------- | ----------- |
| `EntDealerLvl1`           | varchar | ✓        |             |
| `EntDealerLvl2`           | varchar | ✓        |             |
| `EntStoreBrand`           | varchar | ✓        |             |
| `EntDFODRegion`           | varchar | ✓        |             |
| `EntDFIDRegion`           | varchar | ✓        |             |
| `EntRegion`               | varchar | ✓        |             |
| `EntAddressState`         | varchar | ✓        |             |
| `EntEssCode`              | varchar | ✓        |             |
| `EntActive`               | varchar | ✓        |             |
| `EntStoreBrandGroup`      | varchar | ✓        |             |
| `EntAccountingPrefix`     | char    | ✓        |             |
| `EntCora_Account_ID`      | int     | ✓        |             |
| `EntADPCompanyID`         | varchar | ✓        |             |
| `EntDefaultDlrshpLvl1`    | varchar | ✓        |             |
| `EntSubRegion`            | varchar | ✓        |             |
| `EntLineOfBusiness`       | varchar | ✓        |             |
| `DealershipLvl2EntityKey` | int     | ✓        |             |
| `DealershipLvl1EntityKey` | int     | ✓        |             |
| `EntAddressCity`          | varchar | ✓        |             |
| `EntMetroArea`            | varchar | ✓        |             |
| `EntDOCReportFlag`        | varchar | ✓        |             |
| `EntClass`                | varchar | ✓        |             |
| `EntEleadID`              | int     | ✓        |             |

## Definition

```sql
/***********************************************************************
* - Created by Jonathan Henin
* - Updated 07/16/2012
* - Used by MicroStrategy
*
*
************************************************************************/
CREATE VIEW dbo.vw_Dim_DealershipEP
AS
SELECT        TOP (100) PERCENT e.EntDealerLvl1, e.EntDealerLvl2, e.EntStoreBrand, e.EntDFODRegion, e.EntDFIDRegion, e.EntRegion, e.EntAddressState, e.EntEssCode, e.EntActive, e.EntBrandGroup AS EntStoreBrandGroup,
                         e.EntAccountingPrefix, e.EntCora_Account_ID, e.EntADPCompanyID, e.EntDefaultDlrshpLvl1, e.EntSubRegion, e.EntLineOfBusiness, MAX(d2.EntityKey) AS DealershipLvl2EntityKey, MAX(d1.EntityKey)
                         AS DealershipLvl1EntityKey, e.EntAddressCity, e.EntMetroArea, e.EntDOCReportFlag, e.EntClass, e.EntEleadID
FROM            dbo.Dim_Entity AS e LEFT OUTER JOIN
                             (SELECT        EntityKey, EntDealerLvl2
                               FROM            dbo.Dim_Entity
                               WHERE        (EntDefaultDlrshpLvl2 = 1)) AS d2 ON e.EntDealerLvl2 = d2.EntDealerLvl2 LEFT OUTER JOIN
                             (SELECT        EntityKey, EntDealerLvl1
                               FROM            dbo.Dim_Entity AS Dim_Entity_1
                               WHERE        (EntDefaultDlrshpLvl1 = 1)) AS d1 ON e.EntDealerLvl1 = d1.EntDealerLvl1
WHERE        (e.EntDefaultDlrshpLvl1 = '1') AND (e.EntLineOfBusiness = 'EchoPark') AND (e.EntEntityType = 'Dealership')
GROUP BY e.EntDealerLvl1, e.EntStoreBrand, e.EntDFODRegion, e.EntDFIDRegion, e.EntRegion, e.EntAddressState, e.EntEssCode, e.EntActive, e.EntBrandGroup, e.EntAccountingPrefix, e.EntCora_Account_ID, e.EntADPCompanyID,
                         e.EntDealerLvl2, e.EntDefaultDlrshpLvl1, e.EntSubRegion, e.EntLineOfBusiness, e.EntityKey, e.EntAddressCity, e.EntMetroArea, e.EntDOCReportFlag, e.EntClass, e.EntEleadID
HAVING        (e.EntActive = 'Active')

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
