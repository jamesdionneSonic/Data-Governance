---
name: RemoveCharSpecialSymbolValue
database: Sonic_DW
type: function
schema: dbo
owner: Data Team
tags:
  - function
  - auto-extracted
extracted_at: 2026-05-09T12:34:14.349Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: user_function
- **Schema**: dbo

## Definition

```sql

CREATE FUNCTION [dbo].[RemoveCharSpecialSymbolValue](@str VARCHAR(500))  
RETURNS VARCHAR(500)  
BEGIN  
DECLARE @startingIndex int  
SET @startingIndex=0  
WHILE 1=1  
BEGIN  
SET @startingIndex= patindex('%[^0-9.]%',@str)  
IF @startingIndex <> 0  
BEGIN  
SET @str = replace(@str,substring( @str,@startingIndex,1),'') 
SET @Str = (SELECT CASE WHEN @str IN ('','.') THEN '0.0' ELSE @str END)
END  
ELSE IF DATALENGTH(@Str)=0 --added on 2022-01-17
BEGIN
SET @Str= '0.0'
END
ELSE B
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
