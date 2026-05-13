---
name: vw_Dim_PricingGrid
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
/***********************************************************************
* - Created by Jonathan Henin
* - Updated 07/16/2012
* - Used by MicroStrategy
*
*
************************************************************************/
CREATE VIEW dbo.vw_Dim_PricingGrid
AS
SELECT        TOP (100) PERCENT a.PricingGridKey, a.PgrGridName, a.PgrBeginHours, a.PgrEndHours, a.PgrCentIncrement, ROUND(a.PgrEndHours, 1) AS EndHours, a.PgrGridDollarsActual, a.PgrGridDescription, a.PgrIsActive, a.User_ID,
                         a.Meta_RowLastChangedDate, a.PgrHostItemID, a.PgrGridDollarsTest, FLOOR(a.PgrEndHours) AS PgrEndHours_Integer, ROUND(a.PgrEndHours, 1) - FLOOR(ROUND(a.PgrEndHours, 1)) AS PgrEndHours_Decimal,
                         ISNULL(c.EntityKey, - 1) AS EntityKey, a.PgrHdrcora_acct_id
FROM            dbo.Dim_Entity AS c RIGHT OUTER JOIN
                         dbo.Dim_PricingGrid AS a LEFT OUTER JOIN
                         dbo.xrfCoraCompanyPrefix AS CCP ON a.PgrHdrcora_acct_id = CCP.cora_acct_id ON c.EntCora_Account_ID = CCP.related_acctg_cora_acct_id AND c.EntADPCompanyID = CONVERT(varchar(3), CCP.Companyid) AND
                         c.EntAccountingPrefix = CCP.Prefix
WHERE        (a.PgrIsActive = 1) OR
                         (a.PricingGridKey = - 1)
ORDER BY a.PricingGridKey

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
