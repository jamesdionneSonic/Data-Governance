---
name: Update_SyndicateFPAccounts
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - Dim_Entity
  - Syndicate_FPAccounts
dependency_count: 2
parameter_count: 6
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.Dim_Entity** (U )
- **dbo.Syndicate_FPAccounts** (U )

## Parameters

| Name              | Type    | Output | Default |
| ----------------- | ------- | ------ | ------- |
| `@EntityKey`      | varchar | No     | No      |
| `@StockType`      | varchar | No     | No      |
| `@CIN`            | varchar | No     | No      |
| `@DLOC`           | varchar | No     | No      |
| `@Account`        | varchar | No     | No      |
| `@BofADealerName` | varchar | No     | No      |

## Definition

```sql


CREATE PROC [dbo].[Update_SyndicateFPAccounts] (@EntityKey varchar(50), @StockType VARCHAR(50),@CIN varchar(50), @DLOC varchar(50), @Account varchar(50),@BofADealerName VARCHAR(100))
AS


	IF EXISTS (SELECT
				*
			FROM dbo.Syndicate_FPAccounts sf
			WHERE EntityKey = @EntityKey
			AND sf.[StockType] = @StockType)

		UPDATE dbo.Syndicate_FPAccounts
		SET CIN = @CIN
		   ,DLOC = @DLOC
		   ,Account = @Account
		   ,BofADealerName = @BofADealerName --Raj add 12/20/2021 ASM
		WHERE EntityKey = @EntityKey
		AND [StockType] = @StockType

	ELSE

		INSERT INTO Sonic_DW.dbo.syndicate_FPAccounts (EntityKey, EntADPCompanyID, EntDealerLvl1, EntDealerLvl0, EntEssCode, EntBrand, [Syndicate Group], [StockType], [FP Lender], [Group], BofADealerName, BoAlevel_default, State, CIN, DLOC, Account, [PROD Type], FinType)
SELECT de.[EntityKey], de.[EntADPCompanyID],de.[EntDealerLvl1], de.[EntDealerLvl0],de.[EntEssCode],de.[EntBrand],'SYN' AS [Syndicate Group],@StockType AS [Stock Type],'SYN' AS [FP Lender],@StockType+' Syndicate' AS [Group],@BofADealerName AS BofADealerName, 1 AS BoAlevel_default,de.[EntAddressState] AS [State],@CIN AS CIN, @DLOC AS DLOC, @Account AS Account, @StockType AS [PROD Type],'FP-' + @StockType AS FinType FROM [Dim_Entity] de
WHERE de.[EntityKey] IN (@entitykey)



```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
