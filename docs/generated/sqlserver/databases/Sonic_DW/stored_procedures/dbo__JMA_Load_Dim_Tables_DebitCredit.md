---
name: JMA_Load_Dim_Tables_DebitCredit
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

create PROCEDURE [dbo].[JMA_Load_Dim_Tables_DebitCredit]
    @ETLExecution_ID VARCHAR(40) 
AS
BEGIN
--DECLARE @ETLEXECUTION_ID AS VARCHAR(50) = 'Manual_Test_Load_1111';
    DECLARE @JsonData NVARCHAR(MAX) 
    DECLARE @SQL NVARCHAR(MAX)
    DECLARE @TableName NVARCHAR(100)
    DECLARE @Dim_ColCode NVARCHAR(50)
    DECLARE @Dim_ColDescription NVARCHAR(100)
	DECLARE @Dim_ColGroup NVARCHAR(100)
    DECLARE @ColCode NVARCHAR(50)
    DECLARE @ColDescription NVARCHAR(100)
    DECLARE @C
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
