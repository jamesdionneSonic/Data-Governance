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
extracted_at: 2026-05-09T12:34:14.349Z
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
     ,EntAcco
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
