---
name: vw_FIRE_DealData
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
column_count: 21
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
| `FrontSaleAmount`         | numeric | ✓        |             |
| `FrontCostAmount`         | float   | ✓        |             |
| `FrontGross`              | float   | ✓        |             |
| `PackDoc`                 | float   | ✓        |             |
| `FrontPUR`                | float   | ✓        |             |
| `BackGross`               | float   | ✓        |             |
| `BackPUR`                 | float   | ✓        |             |
| `BackCostAmount`          | float   | ✓        |             |
| `ReconCostAmount`         | float   | ✓        |             |

## Definition

```sql

-- ===============================================================
-- Author: Doug Morgan, Lindsay DePree
-- Create date: 06/22/2012
-- Description:   Inserts FIRE Deal info into SIMS
-- Updated: 06/22/2012 by Doug Morgan, Lindsay DePree for IsRetail
-- Updated: 06/15/2012 by Doug Morgan for Front Sale Amount
-- Updated: 07/19/2012 for Stat Counts
-- Updated: 08/06/2012 for changes made by L DePree
-- =================================================================


CREATE VIEW [dbo].[vw_FIRE_DealData]
AS

WITH    FFGU
          AS ( SELECT   StockNo
                       ,e.EntADPCompanyID
                       ,EntAccountingPrefix
                       ,EntHFMDealershipName
                       ,dealno
                       ,d.DealTypeCode
                       ,IsRetail
                       ,fiwipstatuscode
                       ,FIAccountClassification
                       ,f.AccountingDateKey
                       ,f.ContractDateKey
               FROM     [Sonic_DW].[dbo].[factFIRE] (NOLOCK) f
                        JOIN [Sonic_DW].[dbo].dim_FIGLAccounts a ON f.FIGLProductKey = a.FIGLProductKey
                        JOIN [Sonic_DW].[dbo].dim_entity e ON e.EntityKey = f.EntityKey
                        JOIN dim_DealType d ON f.DealTypeKey = d.DealTypeKey
               WHERE
                         AccountingDateKey >= '20110101'
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
                        AND FIGLProductCategoryKey = 15
                        AND DealTypeCode IN ( 'Used', 'Wholesale','Unknown' )


               GROUP BY StockNo
                       ,e.EntADPCompanyID
                       ,EntAccountingPrefix
                                 ,EntHFMDealershipName
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
           ,FFGU.EntAccountingPrefix
           ,FFGU.EntHFMDealershipName
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
           ,a.FIAccountClassification --NEW
           ,f.AccountingDateKey
           ,f.ContractDateKey
           ,f.cashprice AS FrontSaleAmount --REPLACES "FrontSaleAmount below and uses cashprice from vehiclesalescurrent as new amount
           --,SUM(CASE WHEN FIAccountType = 'S'
           --               AND FIGLProductCategoryKey = 15 THEN Amount
           --          ELSE 0
           --     END) AS FrontSaleAmount
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
    WHERE  f.AccountingDateKey >= '20110101'
             AND d.DealTypeCode IN ('Used','Wholesale','Unknown')


    GROUP BY f.StockNo
           ,e.EntADPCompanyID
           ,FFGU.EntAccountingPrefix
           ,FFGU.EntHFMDealershipName
           ,f.dealno
           ,d.DealTypeCode
           ,f.IsRetail
           ,f.fiwipstatuscode
           ,a.FIAccountClassification
           ,f.AccountingDateKey
           ,f.ContractDateKey
           ,f.cashprice
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
