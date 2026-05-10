---
name: Update_Syndicate_Floorplan_BoA_Response
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
CREATE PROC [dbo].[Update_Syndicate_Floorplan_BoA_Response] (@responsekey INT, @stockno VARCHAR(20), @vin VARCHAR(30), @to_dealership INT, @from_dealership INT, @from_dealership_line VARCHAR(20), @to_dealership_line VARCHAR(20), @skip_response INT, @user VARCHAR(30), @make VARCHAR(30), @model VARCHAR(30))
AS
	UPDATE s
	SET s.StockNumber = @stockno
	   ,s.vin = @vin
	   ,s.make = @make
	   ,s.model = @model
	   ,s.Dealer_CIN = ISNULL(sfa1.CIN, s.Dealer_CIN)
	   ,s.From_Dealership = ISNULL
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
