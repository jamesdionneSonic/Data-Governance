---
name: update_floorplan_funding_MSTR
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
CREATE PROC [dbo].[update_floorplan_funding_MSTR]



@vin VARCHAR(30),
@new_amount MONEY,
@date DATE,
@stockno varchar(30)



AS
BEGIN



UPDATE Sonic_DW.dbo.Syndicate_Floorplan_Funding
SET
SSC_Manual_Amount = @new_amount
WHERE FND_Bank_SentDate = @date
AND (vin = @vin OR StockNo = @stockno) --Raj remove "and vin = @vin" and replace with "AND (vin = @vin OR StockNo = @stockno)"     -- 12/20/2021 ASM

END;
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
