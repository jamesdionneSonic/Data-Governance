---
name: usp_FacebookMercedesAutobahn
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
Created Date: August 05, 2021
Desc: This procedure gets a list of MercedesAutobahn store

Updated By  :  Keerthi K
Updated On  :  [29/04/2022]    
Description :  Getting 3 new columns(PhoneNumber, ZipCode, City) With the existing columns
*/
CREATE  	  	 PROCEDURE [dbo].[usp_FacebookMercedesAutobahn] @MARange INT
AS
BEGIN
	DECLARE @MAStartDate DATE
		,@MAEndDate DATE
		,@AudienceType VARCHAR(500);

	SET @AudienceType = 'FBAudienceMercedesAutobahn'
	SET @MAS
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
