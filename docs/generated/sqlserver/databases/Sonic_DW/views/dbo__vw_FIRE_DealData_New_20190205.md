---
name: vw_FIRE_DealData_New_20190205
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
-- Description: Inserts FIRE Deal info into SIMS
-- Updated: 12/26/2012 by Lindsay DePree
--------------------------------------------------------------Updated to incremental process 07/14/2017 RAJ--------------------------------
-- =================================================================


CREATE VIEW [dbo].[vw_FIRE_DealData_New_20190205]
AS

WITH    FFGU
          AS ( SELECT   f.StockNo
                       ,e.EntADPCompanyID
					   ,e.EntAccountingPrefix
                       ,e.EntDealerLvl1
                       ,f.dealno
                       ,d.DealTypeCode
                       ,f.IsRetail
                       ,f.fiwipstatuscode
                       ,a.FIAccountClassification
                       ,f.AccountingDateKey
                       ,f.ContractDateKey
					   ,e.EntDealerLvl0  ----- Raj 10/03/2017 It looks like FIRE is combining to one storeID stores like Century BMW/MINI that should actually be split into two separate stores

               FROM     [Sonic_DW].[dbo].[factFIRE] (NOLOCK) f
                        JOIN [Sonic_DW].[dbo].dim_FIGLAccounts a ON f.FIGLProductKey = a.FIGLProductKey
                        JOIN [Sonic_DW].[dbo].dim_entity e ON e.EntityKey = f.EntityKey
                        JOIN [Sonic_DW].[dbo].dim_DealType d ON f.DealTypeKey = d.DealTypeKey
               WHERE   AccountingDateKey >= CAST(REPLACE(convert(varchar(10),dateadd(mm,-1,dateadd(dd,(DATEPART(dd,getdate())-1) * -1,getdate())),120),'-','') AS INT)
						-- AccountingDateKey >= '20170501'  ---commented by Raj 07/14/2017

                        AND
						( ( IsRetail = 'IsRetail'
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
                       ,e.EntDealerLvl1
                       ,dealno
                       ,d.DealTypeCode
                       ,IsRetail
                       ,fiwipstatuscode
                       ,FIAccountClassification
                       ,f.AccountingDateKey
                       ,f.ContractDateKey
					   ,e.EntDealerLvl0  --- added raj 10/03/2017


             ),
        cte_FIREDeals
          AS ( SELECT   f.StockNo
                       ,e.EntADPCompanyID
					   ,e.EntRegion
                       ,FFGU.EntAccountingPrefix
                       ,FFGU.EntDealerLvl1
					   ,FFGU.EntDealerLvl0 --- added raj 10/03/2017
                       ,f.dealno
                       ,d.DealTypeCode
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
                            END) AS StatCount   --NEW 7-19-2012
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
					   ,SUM(ISNULL(f.cashprice,0)) AS FrontSaleAmount --REPLACES "FrontSaleAmount below and uses cashprice from vehiclesalescurrent as new amount

---------additional column added - Raj 06/30/2017--------------
           ,SUM(CASE WHEN FIAccountType = 'S'
                          AND FIGLProductCategoryKey = 15 THEN Amount
                     ELSE 0
                END) AS FrontSaleAmount_Acctg

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
						---new factory bonus breakout--------------- Raj/Lindsay 10/02/2017---FactoryBonus
						,SUM(CASE WHEN FIAccountType = 'D'
                                      AND FIGLProductCategoryKey = 15
                                      AND FIAccountCategory IN ( 'Factory $')
                                 THEN ( Amount * -1 )
                                 ELSE 0
                            END) AS FactoryBonus
						,SUM(CASE WHEN FIAccountType = 'D'
                                      AND FIGLProductCategoryKey = 15
                                      AND FIAccountCategory IN ( 'Other' )
                                 THEN ( Amount * -1 )
                                 ELSE 0
                            END) AS OtherCostAdj
						---new "all in" front gross column including vehicle front gross, pack, doc, and factory$.----------- Raj/Lindsay 10/02/2017-- FrontGross_PackDocFactory
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
                                   THEN ( Amount * -1 )
                                   ELSE 0
                              END) AS FrontGross_PackDocFactory
				        ----------------------------------------------------------------
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

						,SUM(ISNULL(f.frontweowesgrosssales,0)) as frontweowesgrosssales   --added SUM -LD 7/31/17 --changed from frontweowes to frontweowesgrosssales -LD 8/1/17
						,SUM(ISNULL(f.totaltradesover,0)) as totaltradesover --added SUM -LD 7/31/17

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
               WHERE    f.AccountingDateKey >= CAST(REPLACE(convert(varchar(10),dateadd(mm,-1,dateadd(dd,(DATEPART(dd,getdate())-1) * -1,getdate())),120),'-','') AS INT)
			  -- f.AccountingDateKey >= '20170501'---commented by Raj 07/14/2017

               GROUP BY f.StockNo
                       ,e.EntADPCompanyID
					   ,e.EntRegion
                       ,FFGU.EntAccountingPrefix
                       ,FFGU.EntDealerLvl1
					   ,FFGU.EntDealerLvl0--- added raj 10/03/2017
                       ,f.dealno
                       ,d.DealTypeCode
                       ,f.IsRetail
                       ,f.fiwipstatuscode
                       ,a.FIAccountClassification
                       ,f.AccountingDateKey
                       ,f.ContractDateKey




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
