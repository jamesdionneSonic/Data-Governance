---
name: Transport_Cycle_Time
database: Sonic_DW
type: view
schema: darpts
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
dependency_count: 4
column_count: 0
extracted_at: 2026-05-12T20:14:33.860Z
---

## Overview

1- **Type**: View

- **Schema**: darpts

## Dependencies

This view depends on:

- **darpts.Market** (V )
- **darpts.MarketPerformanceIndicators** (V )
- **dbo.Dim_Date** (U )
- **dbo.vw_Dim_DealershipEP** (V )

## Definition

```sql
CREATE VIEW darpts.Transport_Cycle_Time
AS
SELECT        a.Inv_Sales, a.MarketId, a.Market, a.Market2, a.EntityKey, a.Store_Name, a.Stock_Type, a.Vehicle_ID, a.VIN, a.Stock_No, a.Year, a.Make, a.Model_Orig, a.Model, a.Trim, a.Vehicle_Class, a.Miles, a.Age, a.Days_on_Lot,
                         a.Days_In_Recon, a.Days_In_Transit, a.CT_Range, a.Purchase_Date, a.Entry_Date, a.Landed_Date, a.Trans_Load_Date, a.Trans_Pickup_Date, a.Trans_ETA_Date, a.Buyer, a.Auction_Location, a.Source, a.Seller,
                         a.Auction_Type, a.Live_Fixed, a.Vendor, a.Origin, a.Origin_City, a.Origin_State, a.Origin_Zip, a.Origin_St_City, a.Destination, a.Price_Paid, a.Acctg_Trans_Cost, a.Trans_Diff, a.Bad_Carfax, a.Status, a.Status_Name,
                         a.Rollup_Code, a.Status_Rollup, a.Rental_Flag, a.Last_30_Days, a.Run_Date, a.business_model_type_nm, a.Acctg_Trans_First, a.Acctg_Trans_Total, a.UniqueLocation, a.Local_Delivery_Flag, a.WTD_Flag, a.PurchaseDateKey,
                          a.PurchaseDateFiscalMonthKey, mpi.Value AS KPIMetric, (CASE WHEN Price_paid < mpi.value THEN 1 WHEN Price_paid < (mpi.value * 1.1) THEN 2 ELSE 3 END) AS KPIBucket
FROM            (SELECT        tct.Inv_Sales, m.MarketId, tct.Market, tct.Market2, e.DealershipLvl1EntityKey AS EntityKey, tct.Store_Name, tct.Stock_Type, tct.Vehicle_ID, tct.VIN, tct.Stock_No, tct.Year, tct.Make, tct.Model_Orig, tct.Model, tct.Trim,
                                                    tct.Vehicle_Class, tct.Miles, tct.Age, tct.Days_on_Lot, tct.Days_In_Recon, tct.Days_In_Transit, tct.CT_Range, tct.Purchase_Date, tct.Entry_Date, tct.Landed_Date, tct.Trans_Load_Date, tct.Trans_Pickup_Date,
                                                    tct.Trans_ETA_Date, tct.Buyer, tct.Auction_Location, tct.Source, tct.Seller, tct.Auction_Type, tct.Live_Fixed, tct.Vendor, UPPER(tct.Origin) AS Origin, UPPER(tct.Origin_City) AS Origin_City, tct.Origin_State,
                                                    tct.Origin_Zip, UPPER(tct.Origin_St_City) AS Origin_St_City, UPPER(tct.Destination) AS Destination, tct.Price_Paid, tct.Acctg_Trans_Cost, tct.Trans_Diff, tct.Bad_Carfax, tct.Status, tct.Status_Name, tct.Rollup_Code,
                                                    tct.Status_Rollup, tct.Rental_Flag, tct.Last_30_Days, tct.Run_Date, tct.business_model_type_nm, tct.Acctg_Trans_First, tct.Acctg_Trans_Total, UPPER(tct.Origin_City + '-' + tct.Origin_State + '-' + tct.Destination)
                                                    AS UniqueLocation, CASE WHEN (price_paid <= 125) THEN 'YES' ELSE 'NO' END AS Local_Delivery_Flag, CASE WHEN tct.Entry_Date BETWEEN DATEADD(DAY, - 7 - (DATEPART(WEEKDAY, GETDATE())
                                                    + @@DATEFIRST - 2) % 7, CAST(GETDATE() AS date)) AND DATEADD(DAY, - 1 - (DATEPART(WEEKDAY, GETDATE()) + @@DATEFIRST - 2) % 7, CAST(GETDATE() AS date)) THEN 1 ELSE 0 END AS WTD_Flag,
                                                    d.DateKey AS PurchaseDateKey, d.FiscalMonthKey AS PurchaseDateFiscalMonthKey
                          FROM            dbo.Dim_Date AS d RIGHT OUTER JOIN
                                                    [D1-DASQL-01,11010].DA_Group.rpt.Transport_Cycle_Time AS tct INNER JOIN
                                                    darpts.Market AS m ON tct.Market = m.MarketName ON d.FullDate = tct.Purchase_Date LEFT OUTER JOIN
                                                    dbo.vw_Dim_DealershipEP AS e ON tct.Store_Name = e.EntDealerLvl1) AS a LEFT OUTER JOIN
                         darpts.MarketPerformanceIndicators AS mpi ON mpi.MarketId = a.MarketId AND mpi.FiscalMonthKey = a.PurchaseDateFiscalMonthKey

```

## Governance

- **Last Extracted**: 2026-05-12T20:14:33.860Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
