---
name: vw_Transport_30days_Logic
database: Sonic_DW
type: view
schema: darpts
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T20:14:33.860Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: darpts

## Definition

```sql

CREATE VIEW darpts.vw_Transport_30days_Logic
         AS
         WITH map AS (
SELECT Receiving_Dealer, destination_name
    FROM (
        SELECT
            p.Receiving_Dealer,
            c.destination_name,
            ROW_NUMBER() OVER (PARTITION BY p.Receiving_Dealer ORDER BY COUNT(*) DESC) AS rn
        FROM [D1-DASQL-01,11010].DA_Group.src.Purchase_Log_EP p WITH (NOLOCK)
        JOIN [D1-DASQL-01,11010].DA_Group.[dbo].[vw_Transport_Log_Combined] c WITH (NOLOCK) ON p.VIN = c.vin
        WHERE p.entry >= DATEADD(DAY, -30, GETDATE())
        GROUP BY p.Receiving_Dealer, c.destination_name
    ) a
    WHERE rn = 1
      )
SELECT
    p.VIN,
    CAST(p.Entry AS DATE) AS entry,
    COALESCE(m1.destination_name, m2.destination_name) AS Receiving_Dealer,
    p.YR,
    p.Make,
    p.Model,
    COALESCE(m.Price_Paid, p.Trans_Cost) AS trans,
    m.vendor AS trans_co,
    p.Buyer,
    p.Auction_Vehicle_Location,
    CASE
        WHEN p.entry >= CONVERT(DATE, DATEADD(WEEK, DATEDIFF(WEEK, 0, GETDATE()), -1)) THEN 1
        ELSE 0
    END AS WTD,
    CASE
        WHEN COALESCE(m.Price_Paid, p.Trans_Cost) <= 125 THEN 'Yes'
        ELSE 'No'
    END AS LE_125,
    DATEADD(WEEK, DATEDIFF(WEEK, -1, p.ENTRY), -1) AS week
FROM [D1-DASQL-01,11010].DA_Group.src.Purchase_Log_EP p WITH (NOLOCK)
LEFT JOIN map m1 ON m1.Receiving_Dealer = p.Receiving_Dealer
LEFT JOIN map m2 ON m2.Receiving_Dealer = p.Purchasing_Dealer
LEFT JOIN [D1-DASQL-01,11010].DA_Group.dbo.vw_lkpstoreregiondma lkp WITH (NOLOCK) ON p.store_id = lkp.store_id
LEFT JOIN [D1-DASQL-01,11010].DA_Group.[dbo].[vw_Transport_Log_Combined] m WITH (NOLOCK)
    ON p.VIN = m.vin
    AND ABS(DATEDIFF(DAY, p.entry, m.load_log_at)) BETWEEN 0 AND 10
    AND m.load_log_at >= DATEADD(DAY, -40, GETDATE())
WHERE p.entry >= DATEADD(DAY, -30, GETDATE())
AND lkp.entbrand = 'ECHOPARK';





```

## Governance

- **Last Extracted**: 2026-05-12T20:14:33.860Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
