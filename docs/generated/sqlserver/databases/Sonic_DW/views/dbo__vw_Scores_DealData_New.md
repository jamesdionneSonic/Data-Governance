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
extracted_at: 2026-05-09T12:34:14.349Z
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
      
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
