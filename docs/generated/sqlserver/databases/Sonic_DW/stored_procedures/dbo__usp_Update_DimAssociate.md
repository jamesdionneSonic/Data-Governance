---
name: usp_Update_DimAssociate
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


CREATE PROCEDURE [dbo].[usp_Update_DimAssociate] (
       @ETLExecutionID INT
       ,@insertCount INT OUTPUT
       ,@updateCount INT OUTPUT
       ,@rowCount INT OUTPUT
       )
AS


DECLARE @missingKeys as table(associateKey int not null);
DECLARE @today datetime = getdate();
DECLARE @sourceFile varchar(250) = (select top 1 Meta_SourceFileName
								from ETL_Staging.extract.EmployeeData_HR);

/* Identify records in DimAssociate but not in source file */
insert into @missi
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
