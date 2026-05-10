---
name: usp_FacebookPurchaseAnniversary
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
extracted_at: 2026-05-09T12:34:14.349Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Definition

```sql



  
  
  
CREATE    PROCEDURE [dbo].[usp_FacebookPurchaseAnniversary] --@LastLoadDate DATETIME  
AS  
     BEGIN    
 --Declare @LastLoadDate Datetime = '04/1/2019'    
  
         SELECT ff.entitykey,  
                e.EntDealerLvl1,    
--,ff.dealno     
                cast(cast(accountingdatekey as varchar) as smalldatetime) AS TransactionDate,  
                ff.DMSCustomerKey AS CustomerID,  
                c.DMSCstNameFirst,  
                COALESCE(DMSCstNameLas
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
