---
name: Update_Syndicate_Floorplan_BoA_Response
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - Syndicate_FPAccounts
dependency_count: 1
parameter_count: 11
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.Syndicate_FPAccounts** (U )

## Parameters

| Name                    | Type    | Output | Default |
| ----------------------- | ------- | ------ | ------- |
| `@responsekey`          | int     | No     | No      |
| `@stockno`              | varchar | No     | No      |
| `@vin`                  | varchar | No     | No      |
| `@to_dealership`        | int     | No     | No      |
| `@from_dealership`      | int     | No     | No      |
| `@from_dealership_line` | varchar | No     | No      |
| `@to_dealership_line`   | varchar | No     | No      |
| `@skip_response`        | int     | No     | No      |
| `@user`                 | varchar | No     | No      |
| `@make`                 | varchar | No     | No      |
| `@model`                | varchar | No     | No      |

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
	   ,s.From_Dealership = ISNULL(sfa1.EntDealerLvl1, s.From_Dealership)
	   ,s.From_Dealership_Line = sfa1.StockType
	   ,s.AccountID = sfa1.Account
	   ,s.Transfer_to_CIN = sfa2.CIN
	   ,s.To_Dealership = sfa2.EntDealerLvl1
	   ,s.To_Dealership_Line = sfa2.StockType
	   ,s.Transfer_to_Account = sfa2.Account
	   ,s.Meta_UserID = @user
	   ,s.Meta_LastUpdateDate = GETDATE()
	   ,s.Skip_Response = @skip_response
	   ,to_entitykey = ISNULL(sfa2.entitykey, s.to_entitykey)
	   ,from_entitykey = ISNULL(sfa1.entitykey, s.from_entitykey)
	FROM Sonic_DW.dbo.Syndicate_Floorplan_BoA_Response s
	LEFT JOIN dbo.Syndicate_FPAccounts sfa1
		ON CONVERT(INT, sfa1.entitykey) = @from_dealership
		AND sfa1.StockType = @from_dealership_line
	LEFT JOIN dbo.Syndicate_FPAccounts sfa2
		ON CONVERT(INT, sfa2.entitykey) = @to_dealership
		AND sfa2.StockType = @to_dealership_line
	WHERE s.ResponseKey = @responsekey
```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
