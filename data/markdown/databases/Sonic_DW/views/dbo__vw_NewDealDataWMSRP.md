---
name: vw_NewDealDataWMSRP
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on: []
dependency_count: 0
column_count: 24
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Columns

| Name                      | Type    | Nullable | Description |
| ------------------------- | ------- | -------- | ----------- |
| `StockNo`                 | varchar | ✓        |             |
| `EntADPCompanyID`         | varchar | ✓        |             |
| `EntAccountingPrefix`     | char    | ✓        |             |
| `EntHFMDealershipName`    | varchar | ✓        |             |
| `dealno`                  | varchar | ✓        |             |
| `DealTypeCode`            | varchar |          |             |
| `StatCount`               | numeric | ✓        |             |
| `IsRetail`                | varchar | ✓        |             |
| `DealStatus`              | char    | ✓        |             |
| `FIAccountClassification` | varchar | ✓        |             |
| `AccountingDateKey`       | int     | ✓        |             |
| `ContractDateKey`         | int     | ✓        |             |
| `vscCashPrice`            | numeric | ✓        |             |
| `accFrontSaleAmount`      | float   | ✓        |             |
| `accFrontCostAmount`      | float   | ✓        |             |
| `accFrontGross`           | float   | ✓        |             |
| `accPackDoc`              | float   | ✓        |             |
| `accFrontPUR`             | float   | ✓        |             |
| `accBackGross`            | float   | ✓        |             |
| `accBackPUR`              | float   | ✓        |             |
| `accBackCostAmount`       | float   | ✓        |             |
| `accReconCostAmount`      | float   | ✓        |             |
| `msrp`                    | varchar | ✓        |             |
| `TruePrice`               | varchar | ✓        |             |

## Definition

```sql
--DDC MSRP & FIRE Deal Data
create view vw_NewDealDataWMSRP as
with DDCData as
(
SELECT t.datetime_loaded,
t.stockno,
t.msrp,
t.price
FROM
(SELECT ROW_NUMBER() OVER (PARTITION BY stockno ORDER BY datetime_loaded desc) AS RowNo,
datetime_loaded,
stockno,
msrp,
price
FROM [cor-sql-02].[BI_WorkDB].[dbo].[DDC_Inventory_4x]
where cast(msrp as float) <>0
and cast(price as float) <>0
and datetime_loaded > '1/1/12'
and TYPE = 2 --new
)t
WHERE t.RowNo=1
--and cast(msrp as float) <>0
--and cast(price as float) <>0
--and datetime_loaded > '1/31/13'
--and t.TYPE = 'new'
--order by datetime_loaded,stockno
)


SELECT f.[StockNo]
      ,[EntADPCompanyID]
      ,[EntAccountingPrefix]
      ,[EntHFMDealershipName]
      ,f.[dealno]
      ,[DealTypeCode]
      ,[StatCount]
      ,[IsRetail]
      ,[DealStatus]
      ,[FIAccountClassification]
      ,[AccountingDateKey]
      ,[ContractDateKey]
      ,[vscCashPrice]
      ,[accFrontSaleAmount]
      ,[accFrontCostAmount]
      ,[accFrontGross]
      ,[accPackDoc]
      ,[accFrontPUR]
      ,[accBackGross]
      ,[accBackPUR]
      ,[accBackCostAmount]
      ,[accReconCostAmount]
--      ,v.stickerprice
	  ,ddc.msrp
	  ,ddc.price TruePrice
  FROM [Sonic_DW].[dbo].[vw_FIRE_DealData_ahmer] f
--  inner join [cor-sql-02].dms.dbo.inventoryvehicle v
--  on v.stockno = f.StockNo and f.entcora_account_id = v.cora_acct_id
left join  DDCData	ddc
on ddc.StockNo= f.StockNo

  where AccountingDateKey between 20120101 and 20130131

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
