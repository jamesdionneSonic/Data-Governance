---
name: DailySnapshot_transport_purchases
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - Transport_Purchases
  - Historical_transport_purchases
dependency_count: 2
parameter_count: 0
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **darpts.Transport_Purchases** (V )
- **dbo.Historical_transport_purchases** (U )

## Definition

```sql


CREATE PROCEDURE [dbo].[DailySnapshot_transport_purchases]

AS

SET NOCOUNT ON

/* =========================================================================================
Author: Brittany Rogers
Create date: 5/2/2025
Description: take a daily snapshot of the transportation_purchases table

========================================================================================= */

BEGIN

TRUNCATE TABLE dbo.Historical_transport_purchases;

INSERT INTO dbo.Historical_transport_purchases (
        SnapshotDate,
        Remove,
        VIN,
        Entry,
        Receiving_Market,
        Trans_Loc,
        CBS_Location,
        Store,
        Trans_Status,
        CBS_Status,
        Status_Rollup,
        Stock_No,
        Year,
        Make,
        Model,
        Trim,
        DT,
        Age,
        Days_In_Recon,
        Rec_Mkt_2,
        Purch_Dealer,
        Buyer,
        Source,
        Auction,
        Seller,
        Purchase_Date,
        Run_Date,
        origintype
    )
    SELECT
        CAST(GETDATE() AS DATE) AS SnapshotDate,
        Remove,
        VIN,
        Entry,
        Receiving_Market,
        Trans_Loc,
        CBS_Location,
        Store,
        Trans_Status,
        CBS_Status,
        Status_Rollup,
        Stock_No,
        Year,
        Make,
        Model,
        Trim,
        DT,
        Age,
        Days_In_Recon,
        Rec_Mkt_2,
        Purch_Dealer,
        Buyer,
        Source,
        Auction,
        Seller,
        Purchase_Date,
        Run_Date,
        origintype
    FROM darpts.Transport_Purchases;

SET NOCOUNT OFF
END


```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
