---
name: usp_FacebookEndOfFinanceTermBMW
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

/*

Author: Sumit Tandon
Create Date: May 9, 2019
Create Desc: This procedure gets a list of Customers 

Sample Call : 
    EXEC [Sonic_DW].[dbo].[usp_FacebookEndOfFinanceBMWTerm] 6, 3
Sample params:
    FBAudienceEndofFinance1months - @EOFMonth = 1, EOFRange = 1

Alter By			Alter Date	   Alter Notes
---------------	----------	   ---------------------
Jay				2020-09-22	   Altered SP to list customers based on the EOF Month and Start range that is passed in the @EOFMonth and @EOFRa
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
