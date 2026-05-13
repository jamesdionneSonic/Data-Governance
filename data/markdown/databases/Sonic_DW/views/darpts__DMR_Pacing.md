---
name: DMR_Pacing
database: Sonic_DW
type: view
schema: darpts
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
dependency_count: 3
column_count: 0
extracted_at: 2026-05-12T20:14:33.860Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: darpts

## Dependencies

This view depends on:

- **darpts.DMR_Inventory** (V )
- **darpts.vw_DMR_Sales** (V )
- **dbo.Dim_Date** (U )

## Definition

```sql

CREATE view darpts.DMR_pacing as

SELECT curr_store_id
		,entitykey
		,ROUND(SUM(avg_day_sales_30 * DOW_Left * 0.4), 0) + ROUND(SUM(avg_day_sales_14 * DOW_Left * 0.6), 0) pace
		,ROUND(SUM(avg_day_NearlyNewSales_30 * DOW_Left * 0.4), 0) + ROUND(SUM(avg_day_NearlyNewSales_14 * DOW_Left * 0.6), 0) NearlyNewSalespace
		,ROUND(SUM(avg_day_OutletSales_30 * DOW_Left * 0.4), 0)	+ ROUND(SUM(avg_day_OutletSales_14 * DOW_Left * 0.6), 0) OutletSalespace
		,ROUND(SUM(avg_day_CCarSales_30 * DOW_Left * 0.4), 0) + ROUND(SUM(avg_day_CCarSales_14 * DOW_Left * 0.6), 0) CCarSalespace
		,ROUND(SUM(avg_day_trades_30 * DOW_Left * 0.4), 0) + ROUND(SUM(avg_day_trades_14 * DOW_Left * 0.6), 0) TradesPace
		,ROUND(SUM(avg_day_sp_30 * DOW_Left * 0.4), 0) + ROUND(SUM(avg_day_sp_14 * DOW_Left * 0.6), 0) StreetPurchPace
FROM (SELECT b.curr_store_id
			,b.EntityKey
				,b.DayOfWeek
				,ROUND(COALESCE(AVG(COALESCE(Sales,0) * 1.0), 0), 1) AS avg_day_sales_30
				,ROUND(COALESCE(AVG(CASE WHEN date >= CAST(DATEADD(dd, -15, GETDATE()) AS DATE) THEN COALESCE(Sales,0) * 1.0
						ELSE NULL END), 0), 1) AS avg_day_sales_14
				,COALESCE(d.DOW_left, 0) AS DOW_Left
				,ROUND(COALESCE(AVG(COALESCE(NearlyNewSales,0) * 1.0), 0), 1) AS avg_day_NearlyNewSales_30
				,ROUND(COALESCE(AVG(CASE WHEN date >= CAST(DATEADD(dd, -15, GETDATE()) AS DATE) THEN COALESCE(NearlyNewSales,0) * 1.0
						ELSE NULL END), 0), 1) AS avg_day_NearlyNewSales_14
				,ROUND(COALESCE(AVG(COALESCE(OutletSales,0) * 1.0), 0), 1) AS avg_day_OutletSales_30
				,ROUND(COALESCE(AVG(CASE WHEN date >= cast(dateadd(dd, -15, getdate()) AS DATE) THEN COALESCE(OutletSales,0) * 1.0
						ELSE NULL END), 0), 1) AS avg_day_OutletSales_14
				,ROUND(COALESCE(AVG(COALESCE(CCarSales,0) * 1.0), 0), 1) AS avg_day_CCarSales_30
				,ROUND(COALESCE(AVG(CASE WHEN date >= CAST(DATEADD(dd, -15, GETDATE()) AS DATE) THEN COALESCE(CCarSales,0) * 1.0
						ELSE NULL END), 0), 1) AS avg_day_CCarSales_14
				,ROUND(COALESCE(AVG(COALESCE(trades,0) * 1.0), 0), 1) AS avg_day_trades_30
				,ROUND(COALESCE(AVG(CASE WHEN date >= CAST(DATEADD(dd, -15, GETDATE()) AS DATE) THEN COALESCE(trades,0) * 1.0
						ELSE NULL END), 0), 1) AS avg_day_trades_14
				,ROUND(COALESCE(AVG(COALESCE(stpurch,0) * 1.0), 0), 1) AS avg_day_sp_30
				,ROUND(COALESCE(AVG(CASE WHEN date >= CAST(DATEADD(dd, -15, GETDATE()) AS DATE) THEN COALESCE(StPurch,0) * 1.0
						ELSE NULL END), 0), 1) AS avg_day_sp_14
		FROM (SELECT DISTINCT curr_store_id
						,EntityKey
						,dayname as dayofweek
						,fulldate as date
						,monthnumberofyear as month
						,daynumberofmonth as day
				FROM darpts.vw_DMR_Sales WITH (NOLOCK)
				CROSS JOIN dim_date WITH (NOLOCK)
				WHERE Sold_Date >= cast(DATEADD(dd, -31, GETDATE()) AS DATE)
				AND fulldate >= cast(DATEADD(dd, -31, GETDATE()) as date) AND fulldate <=  cast(GETDATE() as date)
				) b
		LEFT JOIN (SELECT curr_store_id
						,EntityKey
						,sold_date
						,COUNT(vin) AS Sales
						,SUM(CASE WHEN business_model_type_nm = 'Nearly New' THEN 1 ELSE 0 END) AS NearlyNewSales
						,SUM(CASE WHEN business_model_type_nm = 'Outlet' THEN 1 ELSE 0 END) AS OutletSales
						,SUM(CASE WHEN business_model_type_nm = 'C-Car' THEN 1 ELSE 0 END) AS CCarSales
						,SUM(trade_taken) as trades
				FROM darpts.vw_DMR_Sales WITH (NOLOCK)
				WHERE sold_date >= CAST(DATEADD(dd, -31, GETDATE()) AS DATE)
				GROUP BY curr_store_id ,entitykey, sold_date
				) s	ON  s.curr_store_id = b.curr_store_id AND b.DATE = s.Sold_Date
		LEFT JOIN (SELECT curr_store_id
						,Purchase_Date
						,SUM(street_purch_flag) AS StPurch
				FROM darpts.DMR_Inventory WITH (NOLOCK)
				WHERE Purchase_Date >= CAST(DATEADD(dd, -31, GETDATE()) AS DATE)
				GROUP BY curr_store_id ,Purchase_Date
				) sp	ON  sp.curr_store_id = b.curr_store_id AND b.DATE = sp.Purchase_Date
		--Store Holidays
		LEFT JOIN (SELECT DayName
						,SUM(CASE WHEN DayNumberOfMonth = 4 AND MonthNumberOfYear = 7 THEN 0
								  WHEN DayName = 'Thursday' AND MonthNumberOfYear = 11 AND SSWeekNumberOfMonth = 4 THEN 0
								  WHEN DayNumberOfMonth = 25 AND MonthNumberOfYear = 12 THEN 0
									ELSE 1
							 END) AS DOW_Left
				FROM dim_date WITH (NOLOCK)
				WHERE FullDate > GETDATE() - 1 AND FiscalMonthKey = YEAR(GETDATE() - 1) * 100 + MONTH(GETDATE() - 1)
				GROUP BY DayName
				) d	ON b.DayOfWeek = d.DayName
		GROUP BY b.curr_store_id , b.EntityKey, b.DayOfWeek ,COALESCE(d.DOW_left, 0)
		) t
WHERE curr_store_id IS NOT NULL
GROUP BY curr_store_id, EntityKey;

```

## Governance

- **Last Extracted**: 2026-05-12T20:14:33.860Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
