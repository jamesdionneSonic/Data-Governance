---
name: vw_Scores_DealData_New
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
-- Author: Doug Morgan, Lindsay DePree
-- Create date: 02/12/2012
-- Description: Inserts FIRE Deal info into SCORES
-- Updated: 12/26/2012 by Lindsay DePree
-- Updated CDE 08/27/2013 add CustomerKey
-- =================================================================


CREATE VIEW [dbo].[vw_Scores_DealData_New]
AS

WITH    FFGU
          AS ( SELECT   f.StockNo
                       ,e.EntADPCompanyID
                       ,e.EntAccountingPrefix
                       ,e.EntHFMDealershipName
                       ,f.dealno
                       ,d.DealTypeCode
                       ,f.IsRetail
                       ,f.fiwipstatuscode
                       ,a.FIAccountClassification
                       ,f.AccountingDateKey
                       ,f.ContractDateKey
					   ,f.CustomerKey  --Added CDE 08/27/2013
               FROM     [Sonic_DW].[dbo].[factFIRE] (NOLOCK) AS f
                        JOIN [Sonic_DW].[dbo].dim_FIGLAccounts a ON f.FIGLProductKey = a.FIGLProductKey
                        JOIN [Sonic_DW].[dbo].dim_entity e ON e.EntityKey = f.EntityKey
                        JOIN [Sonic_DW].[dbo].dim_DealType d ON f.DealTypeKey = d.DealTypeKey
               WHERE    AccountingDateKey >= '20100101'
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
                        AND CASE WHEN f.fiwipstatuscode = 'F'
                                 THEN a.FIAccountClassification
                                 WHEN f.fiwipstatuscode <> 'F'
                                      AND d.DealTypeCode = 'Lease' THEN 'New'
                                 WHEN f.fiwipstatuscode <> 'F'
                                      AND d.DealTypeCode = 'Demo' THEN 'New'
                                 WHEN f.fiwipstatuscode <> 'F'
                                      AND d.DealTypeCode = 'Fleet' THEN 'New'
                                 WHEN f.fiwipstatuscode <> 'F'
                                      AND d.DealTypeCode = 'Wholesale'
                                 THEN 'Used'
                                 WHEN f.fiwipstatuscode <> 'F'
                                      AND d.DealTypeCode = 'Rental'
                                 THEN 'Used'
                                 WHEN f.fiwipstatuscode <> 'F'
                                      AND d.DealTypeCode = 'Misc'
                                 THEN 'Unknown'
                                 ELSE d.DealTypeCode
                            END = 'New' --added 12/26/12 to filter only new units
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
					   ,f.CustomerKey
             ),
        cte_FIREDeals
          AS ( SELECT   f.StockNo
                       ,e.EntADPCompanyID
                       ,FFGU.EntAccountingPrefix
                       ,FFGU.EntHFMDealershipName
                       ,f.dealno
                       ,d.DealTypeCode
					   ,f.CustomerKey
                       ,SUM(CASE WHEN f.IsRetail = 'IsRetail'
                                      AND FIGLProductCategory = 'FrontGross'
                                      AND FIAccountType = 'S' THEN f.statcount
                                 WHEN f.IsRetail = 'NonRetail'
                                      AND a.FIAccountClassification <> 'Intercompany'
                                      AND FIGLProductCategory = 'FrontGross'
                                      AND FIAccountType = 'S' THEN f.statcount
                                 WHEN f.IsRetail = 'NonRetail'
                                      AND a.FIAccountClassification = 'Intercompany'
                                      AND FIGLProductCategory = 'FrontGross'
                                      AND FIAccountType = 'C'
                                      AND Amount > 0 THEN 1
                                 WHEN f.IsRetail = 'NonRetail'
                                      AND a.FIAccountClassification = 'Intercompany'
                                      AND FIGLProductCategory = 'FrontGross'
                                      AND FIAccountType = 'C'
                                      AND Amount < 0 THEN -1
                                 ELSE 0
                            END) AS StatCount   --NEW 7-19-2012!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                       ,f.IsRetail --NEW
                       ,f.fiwipstatuscode AS DealStatus
                       ,CASE WHEN f.fiwipstatuscode = 'F'
                             THEN a.FIAccountClassification
                             WHEN f.fiwipstatuscode <> 'F'
                                  AND d.DealTypeCode = 'Lease' THEN 'New'
                             WHEN f.fiwipstatuscode <> 'F'
                                  AND d.DealTypeCode = 'Demo' THEN 'New'
                             WHEN f.fiwipstatuscode <> 'F'
                                  AND d.DealTypeCode = 'Fleet' THEN 'New'
                             WHEN f.fiwipstatuscode <> 'F'
                                  AND d.DealTypeCode = 'Wholesale' THEN 'Used'
                             WHEN f.fiwipstatuscode <> 'F'
                                  AND d.DealTypeCode = 'Rental' THEN 'Used'
                             WHEN f.fiwipstatuscode <> 'F'
                                  AND d.DealTypeCode = 'Misc' THEN 'Unknown'
                             ELSE d.DealTypeCode
                        END AS FIAccountClassification --NEW 12-26-12 LD  uses dealype for booked and fiaccountclassification for finalized.
                       ,f.AccountingDateKey
                       ,f.ContractDateKey
                       ,f.cashprice AS FrontSaleAmount --REPLACES "FrontSaleAmount below and uses cashprice from vehiclesalescurrent as new amount
           --,SUM(CASE WHEN FIAccountType = 'S'
           --               AND FIGLProductCategoryKey = 15 THEN Amount
           --          ELSE 0
           --     END) AS FrontSaleAmount
                       ,SUM(CASE WHEN FIAccountType = 'C'
                                      AND FIGLProductCategoryKey = 15
                                 THEN Amount
                                 ELSE 0
                            END) AS FrontCostAmount
                       ,SUM(CASE WHEN f.IsRetail = 'IsRetail'
                                      AND FIAccountType = 'S'
                                      AND FIGLProductCategoryKey = 15
                                 THEN Amount
                                 WHEN f.IsRetail = 'NonRetail'
                                      AND FIAccount IN ( '6387', '6397' )
                                 THEN Amount
                                 WHEN f.IsRetail = 'NonRetail'
                                      AND a.FIAccountClassification = 'Wholesale'
                                      AND FIAccountType = 'S' THEN Amount
                                 ELSE 0
                            END)
                        - SUM(CASE WHEN f.IsRetail = 'IsRetail'
                                        AND FIAccountType = 'C'
                                        AND FIGLProductCategoryKey = 15
                                   THEN Amount
                                   WHEN f.IsRetail = 'NonRetail'
                                        AND a.FIAccountClassification = 'Wholesale'
                                        AND FIAccountType = 'C' THEN Amount
                                   ELSE 0
                              END) AS FrontGross
                       ,SUM(CASE WHEN FIAccountType = 'D'
                                      AND FIGLProductCategoryKey = 15
                                      AND FIAccountCategory IN ( 'Pack',
                                                              'Doc Fees' )
                                 THEN ( Amount * -1 )
                                 ELSE 0
                            END) AS PackDoc
                       ,SUM(CASE WHEN FIAccountType = 'S'
                                      AND FIGLProductCategoryKey = 15
                                 THEN Amount
                                 ELSE 0
                            END)
                        - SUM(CASE WHEN FIAccountType = 'C'
                                        AND FIGLProductCategoryKey = 15
                                   THEN Amount
                                   ELSE 0
                              END)
                        + SUM(CASE WHEN FIAccountType = 'D'
                                        AND FIGLProductCategoryKey = 15
                                        AND FIAccountCategory IN ( 'Pack',
                                                              'Doc Fees' )
                                   THEN ( Amount * -1 )
                                   ELSE 0
                              END) AS FrontPUR
                       ,SUM(CASE WHEN FIAccountType = 'S'
                                      AND FIGLProductCategoryKey <> 15
                                 THEN Amount
                                 ELSE 0
                            END)
                        - SUM(CASE WHEN FIAccountType = 'C'
                                        AND FIGLProductCategoryKey <> 15
                                   THEN Amount
                                   ELSE 0
                              END) AS BackGross
                       ,SUM(CASE WHEN FIAccountType = 'S'
                                      AND FIGLProductCategoryKey <> 15
                                 THEN Amount
                                 ELSE 0
                            END)
                        - SUM(CASE WHEN FIAccountType = 'C'
                                        AND FIGLProductCategoryKey <> 15
                                   THEN Amount
                                   ELSE 0
                              END) AS BackPUR
                       ,SUM(CASE WHEN FIAccountType = 'C'
                                      AND FIGLProductCategoryKey <> 15
                                 THEN Amount
                                 ELSE 0
                            END) AS BackCostAmount
                       ,SUM(CASE WHEN ( FIAccountType = 'C'
                                        AND SUBSTRING(CONVERT(VARCHAR(4), FIAccount),
                                                      4, 1) IN ( '1', '3', '5',
                                                              '7', '9' )
                                        AND FIAccount BETWEEN '6301' AND '6347'
                                      ) THEN Amount
                                 ELSE 0
                            END) AS ReconCostAmount
               FROM     [Sonic_DW].[dbo].[factFIRE] (NOLOCK) f
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
               WHERE    f.AccountingDateKey >= '20100101'
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
					   ,f.CustomerKey
             )
    SELECT  *
    FROM    cte_FireDeals
    WHERE   ( ( ISNULL(FrontCostAmount, 0) <> 0 )
              OR ( ISNULL(FrontGross, 0) <> 0 )
              OR ( ISNULL(BackGross, 0) <> 0 )
              OR ( ISNULL(BackCostAmount, 0) <> 0 )
            ) --added 8/6/12, edited 8/6/12 to remove ISNUMERIC
--(Isnull(FrontCostAmount, 0) <> 0) OR (Isnull(ISNUMERIC(FrontSaleAmount),0) <> 0)
-- OR ( Isnull(FrontGross,0) <> 0) --replaced by filter below (since FrontSaleAmount come from VSC now instead of accounting) 8/6/12
--(Isnull(FrontCostAmount, 0) <> 0) OR ( Isnull(FrontGross,0) <> 0) OR ( Isnull(BackGross,0) <> 0) OR (Isnull(ISNUMERIC(BackCostAmount),0) <> 0) --added 8/6/12
;


```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
