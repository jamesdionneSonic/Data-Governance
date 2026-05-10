---
name: uspScoresDIMFocusCustomerNotification
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

CREATE procedure [dbo].[uspScoresDIMFocusCustomerNotification]
(
@Profile1 VARCHAR(250),
@ToLine1 VARCHAR(1000),
@LoadDate DateTime,
@ETLExecutionId Int
)
as
/*r
Author 	: Amrendra Kumar
Date 	: 01-08-2016
Remarks	: This process sends alert about the last updated/Inserted RowCount For DIM_Focus_Customer Table
*/

IF (
SELECT COUNT(*)
FROM SSIS.Audit.Fact_DataAudit 
WHERE ETLExecution_id=@ETLExecutionId
		) > 0
BEGIN
	DECLARE @Profile NVARCHAR(MAX) = 'Sonic ETL Mail Profile'
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
