---
name: usp_FacebookBMWBrand
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
Create Date: June 27, 2021
Create Desc: This procedure gets a list of BMW Brand Customers 

Updated By  :  Keerthi K
Updated On  :  [29/04/2022]    
Description :  Getting 3 new columns(PhoneNumber, ZipCode, City) With the existing columns
*/
CREATE  
	

 PROCEDURE [dbo].[usp_FacebookBMWBrand] @BMWRange INT
AS
BEGIN
	DECLARE @BMWStartDate DATE
		,@BMWEndDate DATE
		,@AudienceType VARCHAR(500);

	SET @AudienceType = 'FBAudienceBMWBrand'
	SET @BMWStartDat
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
