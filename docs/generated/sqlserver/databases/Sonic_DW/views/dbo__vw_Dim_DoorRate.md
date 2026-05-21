---
name: vw_Dim_DoorRate
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

CREATE VIEW [dbo].[vw_Dim_DoorRate]
AS
WITH cte AS
(SELECT        ROW_NUMBER() OVER (PARTITION BY a.PgrGridName, a.PgrHdrcora_acct_id ORDER BY  ROUND(a.PgrEndHours, 1)) AS rn, a.PgrGridName, ROUND(a.PgrEndHours, 1) AS EndHours, CONVERT(numeric(10, 2), a.PgrGridDollarsActual) AS HourRate, a.PgrHdrcora_acct_id, c.EntDealerLvl1,
                         CASE WHEN c.EntBrandGroup = 'Luxury Imports' THEN CONVERT(numeric(10, 2), 1.00 * a.PgrGridDollarsActual) WHEN c.EntBrandGroup = 'Domestic' THEN CONVERT(numeric(10, 2), 0.95 * a.PgrGridDollarsActual)
                         WHEN c.EntBrandGroup = 'Non-Luxury Imports' THEN CONVERT(numeric(10, 2), 0.90 * a.PgrGridDollarsActual) END AS TargetHourRate
FROM            dbo.Dim_PricingGrid AS a INNER JOIN
                             (SELECT        PgrGridName, PgrHdrcora_acct_id, MAX(Meta_RowLastChangedDate) AS LastChange
                               FROM            dbo.Dim_PricingGrid
                               GROUP BY PgrGridName, PgrHdrcora_acct_id) AS D ON a.PgrGridName = D.PgrGridName AND a.PgrHdrcora_acct_id = D.PgrHdrcora_acct_id AND a.Meta_RowLastChangedDate = D.LastChange INNER JOIN
                         dbo.xrfCoraCompanyPrefix AS CCP ON a.PgrHdrcora_acct_id = CCP.cora_acct_id INNER JOIN
                         dbo.Dim_Entity AS c ON CCP.Prefix = c.EntAccountingPrefix AND CCP.related_acctg_cora_acct_id = c.EntCora_Account_ID AND c.EntADPCompanyID = CONVERT(varchar(3), CCP.Companyid)
WHERE        (a.PgrIsActive = 1)
GROUP BY a.PgrGridName, ROUND(a.PgrEndHours, 1), CONVERT(numeric(10, 2), a.PgrGridDollarsActual), a.PgrHdrcora_acct_id, c.EntDealerLvl1, c.EntBrandGroup, a.PgrGridDollarsActual
HAVING        (NOT (CONVERT(numeric(10, 2), a.PgrGridDollarsActual) IS NULL)) AND ((ROUND(a.PgrEndHours, 1) = 1) OR (ROUND(a.PgrEndHours, 1) = 10000)))
SELECT [PgrGridName]
      ,[EndHours]
      ,[HourRate]
      ,[PgrHdrcora_acct_id]
      ,[EntDealerLvl1]
      ,[TargetHourRate]
FROM cte
WHERE rn = 1

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
