---
name: Update_SyndicateFPAccounts
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
		WH
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
