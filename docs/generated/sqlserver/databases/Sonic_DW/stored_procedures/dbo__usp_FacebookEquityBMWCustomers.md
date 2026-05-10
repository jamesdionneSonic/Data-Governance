---
name: usp_FacebookEquityBMWCustomers
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
Author: JayCharan
Updated Date: June 27, 2021
Desc: This procedure gets a list of Equity Brand Customers with Logic for Honda and Non Honda brands

2021/07/21  -	 Added logic for Toyota brand (EOEMonth = 48, EOERange = 35)

2021/08/28  -    Added logic to included Jaguar, Land Rover and Porsche under 18 months payment


Updated By  :  Keerthi K
Updated On  :  [29/04/2022]    
Description :  Getting 3 new columns(PhoneNumber, ZipCode, City) With the existing columns
*/
CREATE  
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
