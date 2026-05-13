---
name: vw_FIRE_DealData_Used_10262017
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - dim_DealType
dependency_count: 1
column_count: 27
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.dim_DealType** (U )

## Columns

| Name                      | Type    | Nullable | Description |
| ------------------------- | ------- | -------- | ----------- |
| `StockNo`                 | varchar | ✓        |             |
| `EntADPCompanyID`         | varchar | ✓        |             |
| `EntRegion`               | varchar | ✓        |             |
| `EntLineOfBusiness`       | varchar | ✓        |             |
| `EntAccountingPrefix`     | char    | ✓        |             |
| `EntDealerLvl1`           | varchar | ✓        |             |
| `dealno`                  | varchar | ✓        |             |
| `DealTypeCode`            | varchar |          |             |
| `StatCount`               | numeric | ✓        |             |
| `IsRetail`                | varchar | ✓        |             |
| `DealStatus`              | char    | ✓        |             |
| `FIAccountClassification` | varchar | ✓        |             |
| `AccountingDateKey`       | int     | ✓        |             |
| `ContractDateKey`         | int     | ✓        |             |
| `FrontSaleAmount`         | numeric | ✓        |             |
| `FrontSaleAmount_Acctg`   | float   | ✓        |             |
| `FrontCostAmount`         | float   | ✓        |             |
| `FrontGross`              | float   | ✓        |             |
| `PackDoc`                 | float   | ✓        |             |
| `FrontPUR`                | float   | ✓        |             |
| `BackGross`               | float   | ✓        |             |
| `BackPUR`                 | float   | ✓        |             |
| `BackCostAmount`          | float   | ✓        |             |
| `ReconCostAmount`         | float   | ✓        |             |
| `EntCora_Account_ID`      | int     | ✓        |             |
| `frontweowesgrosssales`   | numeric | ✓        |             |
| `totaltradesover`         | numeric | ✓        |             |

## Definition

```sql












---- ===============================================================
---- Author: Raj
---- Create date: 02/12/2012
---- Description: Inserts FIRE Deal info into SIMS
---- Updated: 12/26/2012 by Lindsay DePree
---- Updated: 12/28/2012 by Lindsay DePree
---- Updated: 11/14/2014 By Raj - added EntLineOfBusiness column to get the EchoPark data
---- Updated: 11/14/2016 BY Raj - added e.EntCora_Account_ID by RAJ 11/2/2016 EchoPark
----------------------------------------------------------------Updated to incremental process 07/14/2017 RAJ--------------------------------
---- =================================================================


CREATE  VIEW [dbo].[vw_FIRE_DealData_Used_10262017]
AS


WITH    FFGU
          AS ( SELECT   f.StockNo
                       ,e.EntADPCompanyID
					   ,e.EntLineOfBusiness
                       ,e.EntAccountingPrefix
                       ,e.EntDealerLvl1
                       ,f.dealno
                       ,d.DealTypeCode
                       ,f.IsRetail
                       ,f.fiwipstatuscode
                       ,a.FIAccountClassification
                       ,f.AccountingDateKey
                       ,f.ContractDateKey


               FROM     [Sonic_DW].[dbo].[factFIRE] (NOLOCK) f
                        JOIN [Sonic_DW].[dbo].dim_FIGLAccounts a ON f.FIGLProductKey = a.FIGLProductKey
                        JOIN [Sonic_DW].[dbo].dim_entity e ON e.EntityKey = f.EntityKey
                        JOIN [Sonic_DW].[dbo].dim_DealType d ON f.DealTypeKey = d.DealTypeKey
               WHERE    AccountingDateKey >=  CAST(REPLACE(convert(varchar(10),dateadd(mm,-1,dateadd(dd,(DATEPART(dd,getdate())-1) * -1,getdate())),120),'-','') AS INT)
						----  AccountingDateKey >= '20110101'  ---commented by Raj 07/14/2017
                        AND ( ( IsRetail = 'IsRetail'
                                AND FIAccountType = 'S'
                                AND statcount = 1
                              )
                              OR ( IsRetail = 'NonRetail'
                                   AND a.FIAccountClassification <> 'Intercompany'
                                   AND FIAccountType = 'S'
                                   AND statcount = 1
                                 )
                              OR ( IsRetail = 'NonRetail'
                                   AND a.FIAccountClassification = 'Intercompany' --added 8/6/12
                                 )
                            )
                        AND a.FIGLProductCategoryKey = 15
                        AND case when f.fiwipstatuscode = 'F'
                                          then a.FIAccountClassification
                                          when f.fiwipstatuscode <> 'F' and d.DealTypeCode = 'Lease'
                                          then 'New'
                                          when f.fiwipstatuscode <> 'F' and d.DealTypeCode = 'Demo'
                                          then 'New'
                                          when f.fiwipstatuscode <> 'F' and d.DealTypeCode = 'Fleet'
                                          then 'New'
                                          when f.fiwipstatuscode <> 'F' and d.DealTypeCode = 'Wholesale'
                                          then 'Used'
                                          when f.fiwipstatuscode <> 'F' and d.DealTypeCode = 'Rental'
                                          then 'Used'
                                          when f.fiwipstatuscode <> 'F' and d.DealTypeCode = 'Misc'
                                          then 'Unknown'
                                          else d.DealTypeCode end <> 'New' --added 12/26/12 to filter used units


               GROUP BY StockNo
                       ,e.EntADPCompanyID
					   ,e.EntLineOfBusiness
                       ,EntAccountingPrefix
                       ,e.EntDealerLvl1
                       ,dealno
                       ,d.DealTypeCode
                       ,IsRetail
                       ,fiwipstatuscode
                       ,FIAccountClassification
                       ,f.AccountingDateKey
                       ,f.ContractDateKey


             )
,cte_FIREDeals
AS(
    SELECT  f.StockNo
           ,e.EntADPCompanyID
		   ,e.EntRegion
           ,e.EntLineOfBusiness
           ,FFGU.EntAccountingPrefix
           ,FFGU.EntDealerLvl1
           ,f.dealno
           ,d.DealTypeCode
           ,SUM(Case when f.IsRetail = 'IsRetail'
                          AND FIGLProductCategory = 'FrontGross'
                          AND FIAccountType = 'S'
                          then f.statcount
                     when f.IsRetail = 'NonRetail'
                          AND a.FIAccountClassification <> 'Intercompany'
                          AND FIGLProductCategory = 'FrontGross'
                          AND FIAccountType = 'S'
                          then f.statcount
                     when f.IsRetail = 'NonRetail'
                          AND a.FIAccountClassification = 'Intercompany'
                          AND FIGLProductCategory = 'FrontGross'
                          AND FIAccountType = 'C'
                          AND Amount > 0
                          then 1
                      when f.IsRetail = 'NonRetail'
                          AND a.FIAccountClassification = 'Intercompany'
                          AND FIGLProductCategory = 'FrontGross'
                          AND FIAccountType = 'C'
                          AND Amount < 0
                          then -1
                                else 0 end) as StatCount   --NEW 7-19-2012!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

           ,f.IsRetail --NEW
           ,f.fiwipstatuscode as DealStatus
           ,case when f.fiwipstatuscode = 'F'
                        then a.FIAccountClassification
                        when f.fiwipstatuscode <> 'F' and d.DealTypeCode = 'Lease'
                        then 'New'
                        when f.fiwipstatuscode <> 'F' and d.DealTypeCode = 'Demo'
                        then 'New'
                        when f.fiwipstatuscode <> 'F' and d.DealTypeCode = 'Fleet'
                        then 'New'
                        when f.fiwipstatuscode <> 'F' and d.DealTypeCode = 'Wholesale'
                        then 'Used'
                        when f.fiwipstatuscode <> 'F' and d.DealTypeCode = 'Rental'
                        then 'Used'
                        when f.fiwipstatuscode <> 'F' and d.DealTypeCode = 'Misc'
                        then 'Unknown'
                        else d.DealTypeCode end
                        as FIAccountClassification --NEW 12-26-12 LD  uses dealype for booked and fiaccountclassification for finalized.
           ,f.AccountingDateKey
           ,f.ContractDateKey

		  ,SUM(ISNULL(f.cashprice,0)) AS FrontSaleAmount --REPLACES "FrontSaleAmount below and uses cashprice from vehiclesalescurrent as new amount

		   ---------additional column added - Raj 06/30/2017--------------
		   ,SUM(CASE WHEN FIAccountType = 'S'
                          AND FIGLProductCategoryKey = 15 THEN Amount
                     ELSE 0
                END) AS FrontSaleAmount_Acctg


           ,SUM(CASE WHEN FIAccountType = 'C'
                          AND FIGLProductCategoryKey = 15 THEN Amount
                     ELSE 0
                END) AS FrontCostAmount

           ,SUM(CASE WHEN f.IsRetail = 'IsRetail'
                          AND FIAccountType = 'S'
                          AND FIGLProductCategoryKey = 15 THEN Amount
                     WHEN f.IsRetail = 'NonRetail'
                          AND FIAccount IN ( '6387', '6397' ) THEN Amount
                     WHEN f.IsRetail = 'NonRetail'
                          AND a.FIAccountClassification = 'Wholesale'
                          AND FIAccountType = 'S' THEN Amount
                     ELSE 0
                END)

            - SUM(CASE WHEN f.IsRetail = 'IsRetail'
                            AND FIAccountType = 'C'
                            AND FIGLProductCategoryKey = 15 THEN Amount
                       WHEN f.IsRetail = 'NonRetail'
                            AND a.FIAccountClassification = 'Wholesale'
                            AND FIAccountType = 'C' THEN Amount
                       ELSE 0
                  END) AS FrontGross
           ,SUM(CASE WHEN FIAccountType = 'D'
                          AND FIGLProductCategoryKey = 15
                          AND FIAccountCategory IN ( 'Pack', 'Doc Fees' )
                     THEN ( Amount * -1 )
                     ELSE 0
                END) AS PackDoc
           ,SUM(CASE WHEN FIAccountType = 'S'
                          AND FIGLProductCategoryKey = 15 THEN Amount
                     ELSE 0
                END)
            - SUM(CASE WHEN FIAccountType = 'C'
                            AND FIGLProductCategoryKey = 15 THEN Amount
                       ELSE 0
                  END)
            + SUM(CASE WHEN FIAccountType = 'D'
                            AND FIGLProductCategoryKey = 15
                            AND FIAccountCategory IN ( 'Pack', 'Doc Fees' )
                       THEN ( Amount * -1 )
                       ELSE 0
                  END) AS FrontPUR
           ,SUM(CASE WHEN FIAccountType = 'S'
                          AND FIGLProductCategoryKey <> 15 THEN Amount
                     ELSE 0
                END)
            - SUM(CASE WHEN FIAccountType = 'C'
                            AND FIGLProductCategoryKey <> 15 THEN Amount
                       ELSE 0
                  END) AS BackGross
           ,SUM(CASE WHEN FIAccountType = 'S'
                          AND FIGLProductCategoryKey <> 15 THEN Amount
                     ELSE 0
                END)
            - SUM(CASE WHEN FIAccountType = 'C'
                            AND FIGLProductCategoryKey <> 15 THEN Amount
                       ELSE 0
                  END) AS BackPUR
           ,SUM(CASE WHEN FIAccountType = 'C'
                          AND FIGLProductCategoryKey <> 15 THEN Amount
                     ELSE 0
                END) AS BackCostAmount
           ,SUM(CASE WHEN ( FIAccountType = 'C'
                            AND SUBSTRING(CONVERT(VARCHAR(4), FIAccount), 4, 1) IN (
                            '1', '3', '5', '7', '9' )
                            AND FIAccount BETWEEN '6301' AND '6347'
                          ) THEN Amount
                     ELSE 0
                END) AS ReconCostAmount
					,e.EntCora_Account_ID -- added by RAJ 11/2/2016 EchoPark

			, SUM(ISNULL(f.frontweowesgrosssales,0)) as frontweowesgrosssales --changed to SUM, and replaced frontweowes with frontweowesgrosssales -LD 8/1/17
			, SUM(ISNULL(f.totaltradesover,0)) as totaltradesover  --changed to SUM -LD 8/1/17

    FROM    [Sonic_DW].[dbo].[factFIRE] (NOLOCK) f
            JOIN [Sonic_DW].[dbo].dim_FIGLAccounts a ON f.FIGLProductKey = a.FIGLProductKey
            JOIN [Sonic_DW].[dbo].dim_entity e ON e.EntityKey = f.EntityKey
            JOIN dim_DealType d ON f.DealTypeKey = d.DealTypeKey
            JOIN FFGU ON FFGU.StockNo = f.StockNo
                         AND FFGU.EntADPCompanyID = e.EntADPCompanyID
                         AND FFGU.dealno = f.dealno
                         AND FFGU.DealTypeCode = d.DealTypeCode
                         AND FFGU.IsRetail = f.IsRetail
                         AND FFGU.fiwipstatuscode = f.fiwipstatuscode
                         AND FFGU.FIAccountClassification = a.FIAccountClassification
                         AND FFGU.AccountingDateKey = f.AccountingDateKey
                         AND FFGU.ContractDateKey = f.ContractDateKey
     WHERE    f.AccountingDateKey >=  CAST(REPLACE(convert(varchar(10),dateadd(mm,-1,dateadd(dd,(DATEPART(dd,getdate())-1) * -1,getdate())),120),'-','') AS INT)
			  -- --f.AccountingDateKey >= '20110101'---commented by Raj 07/14/2017



    GROUP BY f.StockNo
           ,e.EntADPCompanyID
		   ,e.EntRegion
           ,e.EntLineOfBusiness
           ,FFGU.EntAccountingPrefix
           ,FFGU.EntDealerLvl1
           ,f.dealno
           ,d.DealTypeCode
           ,f.IsRetail
           ,f.fiwipstatuscode
           ,a.FIAccountClassification
           ,f.AccountingDateKey
           ,f.ContractDateKey
           ,e.EntCora_Account_ID-- added by RAJ 11/2/2016 EchoPark

)
SELECT *
	FROM cte_FireDeals
WHERE
--(Isnull(FrontCostAmount, 0) <> 0) OR (Isnull(ISNUMERIC(FrontSaleAmount),0) <> 0)
-- OR ( Isnull(FrontGross,0) <> 0) --replaced by filter below (since FrontSaleAmount come from VSC now instead of accounting) 8/6/12
--(Isnull(FrontCostAmount, 0) <> 0) OR ( Isnull(FrontGross,0) <> 0) OR ( Isnull(BackGross,0) <> 0) OR (Isnull(ISNUMERIC(BackCostAmount),0) <> 0) --added 8/6/12
((Isnull(FrontCostAmount, 0) <> 0)
      OR ( Isnull(FrontGross,0) <> 0)
      OR ( Isnull(BackGross,0) <> 0)
      OR (Isnull(BackCostAmount,0) <> 0)) --added 8/6/12, edited 8/6/12 to remove ISNUMERIC


;

















```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
