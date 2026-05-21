---
name: vw_FIRE_DealData_ahmer
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

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Definition

```sql





-- ===============================================================
-- Author: CDE
-- Create date: 06/22/2012
-- Description:   Inserts FIRE Deal info into SIMS
-- Updated: 06/22/2012 by Doug Morgan, Lindsay DePree for IsRetail
-- Updated: 06/15/2012 by Doug Morgan for Front Sale Amount
-- Updated: 07/19/2012 for Stat Counts
-- Updated: 08/06/2012 for changes made by L DePree
-- =================================================================


CREATE VIEW [dbo].[vw_FIRE_DealData_ahmer]
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
                       ,e.EntCora_Account_ID
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
                        --AND DealTypeCode IN ( 'Used', 'Wholesale','Unknown' )
						and FIAccountClassification = 'New'

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
                       ,e.EntCora_Account_ID
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
           ,f.cashprice AS vscCashPrice --REPLACES "FrontSaleAmount below and uses cashprice from vehiclesalescurrent as new amount
           ,SUM(CASE WHEN FIAccountType = 'S'
                          AND FIGLProductCategoryKey = 15 THEN Amount
                     ELSE 0
                END) AS accFrontSaleAmount
           ,SUM(CASE WHEN FIAccountType = 'C'
                          AND FIGLProductCategoryKey = 15 THEN Amount
                     ELSE 0
                END) AS accFrontCostAmount
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
                  END) AS accFrontGross
           ,SUM(CASE WHEN FIAccountType = 'D'
                          AND FIGLProductCategoryKey = 15
                          AND FIAccountCategory IN ( 'Pack', 'Doc Fees' )
                     THEN ( Amount * -1 )
                     ELSE 0
                END) AS accPackDoc
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
                  END) AS accFrontPUR
           ,SUM(CASE WHEN FIAccountType = 'S'
                          AND FIGLProductCategoryKey <> 15 THEN Amount
                     ELSE 0
                END)
            - SUM(CASE WHEN FIAccountType = 'C'
                            AND FIGLProductCategoryKey <> 15 THEN Amount
                       ELSE 0
                  END) AS accBackGross
           ,SUM(CASE WHEN FIAccountType = 'S'
                          AND FIGLProductCategoryKey <> 15 THEN Amount
                     ELSE 0
                END)
            - SUM(CASE WHEN FIAccountType = 'C'
                            AND FIGLProductCategoryKey <> 15 THEN Amount
                       ELSE 0
                  END) AS accBackPUR
           ,SUM(CASE WHEN FIAccountType = 'C'
                          AND FIGLProductCategoryKey <> 15 THEN Amount
                     ELSE 0
                END) AS accBackCostAmount
           ,SUM(CASE WHEN ( FIAccountType = 'C'
                            AND SUBSTRING(CONVERT(VARCHAR(4), FIAccount), 4, 1) IN (
                            '1', '3', '5', '7', '9' )
                            AND FIAccount BETWEEN '6301' AND '6347'
                          ) THEN Amount
                     ELSE 0
                END) AS accReconCostAmount
                ,e.EntCora_Account_ID

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
             --AND d.DealTypeCode IN ('Used','Wholesale','Unknown')
             and  a.FIAccountClassification = 'New'


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
			, e.EntCora_Account_ID
			)
SELECT *
FROM cte_FireDeals


WHERE
--(Isnull(FrontCostAmount, 0) <> 0) OR (Isnull(ISNUMERIC(FrontSaleAmount),0) <> 0)
-- OR ( Isnull(FrontGross,0) <> 0) --replaced by filter below (since FrontSaleAmount come from VSC now instead of accounting) 8/6/12

--(Isnull(FrontCostAmount, 0) <> 0) OR ( Isnull(FrontGross,0) <> 0) OR ( Isnull(BackGross,0) <> 0) OR (Isnull(ISNUMERIC(BackCostAmount),0) <> 0) --added 8/6/12
((Isnull(accFrontCostAmount, 0) <> 0)
      OR ( Isnull(accFrontGross,0) <> 0)
      OR ( Isnull(accBackGross,0) <> 0)
      OR (Isnull(accBackCostAmount,0) <> 0)) --added 8/6/12, edited 8/6/12 to remove ISNUMERIC


;






```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
