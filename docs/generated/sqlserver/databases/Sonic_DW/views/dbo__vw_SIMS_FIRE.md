---
name: vw_SIMS_FIRE
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







--
-- =============================================
-- Author: Derrick Exum
-- Create date: 05/29/2012
-- Description:	Inserts FIRE Deal info into SIMS
-- Updated: 06/15/2012 by Doug Morgan
-- Updated: 06/15/2012 by Doug Morgan for Front Sale Amount
-- =============================================


CREATE VIEW [dbo].[vw_SIMS_FIRE]
AS

WITH FFGU as
(
select
      f.StockNo
     ,f.AccountingDateKey
     ,f.ContractDateKey
     ,e.EntADPCompanyID
     ,EntAccountingPrefix
     ,EntHFMDealershipName
     ,DealTypeCode
     ,fiwipstatuscode as DealStatus
     ,f.statcount  --new
     ,f.dealno   --new
  FROM [Sonic_DW].[dbo].[factFIRE] (nolock) f
      JOIN dim_DealType d
      ON f.DealTypeKey = d.DealTypeKey
      JOIN dim_entity e
    ON e.EntityKey = f.EntityKey
      JOIN Sonic_DW.dbo.dim_FIGLAccounts a
      ON f.FIGLProductKey = a.FIGLProductKey

  WHERE
      f.AccountingDateKey >= 20110101
      AND DealTypeCode = 'Used'  --new
      AND statcount = 1
      AND FIGLProductCategoryKey = 15
      AND FIAccountType = 'S' --new-- we found stat counts of 1 on other account types that were pulling a deal more than once
       -- AND StockNo in ('P9A452725', '9TX36080', 'S9TU96750'  )

  GROUP BY
    f.StockNo
   ,e.EntADPCompanyID
   ,EntAccountingPrefix
   ,EntHFMDealershipName
   ,f.AccountingDateKey
   ,f.ContractDateKey
   ,DealTypeCode
   ,fiwipstatuscode
   ,f.statcount  --new
   ,f.dealno  ) --new




  select
      f.StockNo
     ,f.dealno
     ,f.AccountingDateKey
     ,f.ContractDateKey
     ,e.EntADPCompanyID
     ,FFGU.EntAccountingPrefix
     ,FFGU.EntHFMDealershipName
     ,d.DealTypeCode
     ,fiwipstatuscode as DealStatus
     ,SUM( case when (FIAccountType = 'C' and substring(convert(varchar(4),FIAccount),4,1) in ('1','3','5','7','9') and FIAccount between '6301' and '6347') then Amount else 0 end) as ReconCostAmount
     ,SUM( case when FIAccountType = 'S' and FIGLProductCategoryKey = 15 then Amount else 0 end) - SUM( case when FIAccountType = 'C' and FIGLProductCategoryKey = 15 then Amount else 0 end) as FrontGross
     ,SUM( case when FIAccountType = 'S' and FIGLProductCategoryKey = 15 then Amount else 0 end) - SUM( case when FIAccountType = 'C' and FIGLProductCategoryKey = 15 then Amount else 0 end) + SUM( case when FIAccountType = 'D' and FIGLProductCategoryKey = 15 and FIAccountCategory in ('Pack','Doc Fees') then (Amount * -1) else 0 end) as FrontPUR
     ,SUM( case when FIAccountType = 'S' and FIGLProductCategoryKey <> 15 then Amount else 0 end) - SUM( case when FIAccountType = 'C' and FIGLProductCategoryKey <> 15 then Amount else 0 end) as BackGross
     ,SUM( case when FIAccountType = 'S' and FIGLProductCategoryKey <> 15 then Amount else 0 end)- SUM( case when FIAccountType = 'C' and FIGLProductCategoryKey <> 15 then Amount else 0 end) as BackPUR
     ,SUM( case when FIAccountType = 'D' and FIGLProductCategoryKey = 15 and FIAccountCategory in ('Pack','Doc Fees') then (Amount * -1) else 0 end) as PackDoc
     ,SUM( case when FIAccountType = 'C' and FIGLProductCategoryKey = 15 then Amount else 0 end)as FrontCostAmount
     ,SUM( case when FIAccountType = 'C' and FIGLProductCategoryKey <> 15 then Amount else 0 end) as BackCostAmount
     ,SUM( case when FIAccountType = 'S' and FIGLProductCategoryKey = 15 then Amount else 0 end) AS FrontSaleAmount --Added 06/15/2012
     ,FFGU.statcount
  FROM [Sonic_DW].[dbo].[factFIRE] (nolock) f
      JOIN dim_DealType d
      ON f.DealTypeKey = d.DealTypeKey
      JOIN dim_entity e
    ON e.EntityKey = f.EntityKey
      JOIN Sonic_DW.dbo.dim_FIGLAccounts a
      ON f.FIGLProductKey = a.FIGLProductKey
      JOIN FFGU on FFGU.AccountingDateKey = f.AccountingDateKey
      and FFGU.ContractDateKey = f.ContractDateKey
      and FFGU.EntADPCompanyID = e.EntADPCompanyID
      and FFGU.DealStatus = f.fiwipstatuscode
      and FFGU.StockNo = f.StockNo
      and FFGU.dealno = f.dealno
  WHERE
      f.AccountingDateKey >= 20110101
      AND d.DealTypeCode = 'Used'


  GROUP BY

      f.StockNo
     ,f.dealno
     ,f.AccountingDateKey
     ,f.ContractDateKey
     ,e.EntADPCompanyID
     ,FFGU.EntAccountingPrefix
     ,FFGU.EntHFMDealershipName
     ,d.DealTypeCode
     ,fiwipstatuscode
     ,FFGU.dealno
     ,FFGU.statcount
;







```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
