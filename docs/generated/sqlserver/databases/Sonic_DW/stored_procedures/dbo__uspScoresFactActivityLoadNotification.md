---
name: uspScoresFactActivityLoadNotification
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

CREATE Procedure [dbo].[uspScoresFactActivityLoadNotification]
(
@LoadDate DateTime,
@ETLExecutionId Int
)
as
/*r
Author 	: Amrendra Kumar
Date 	: 17-03-2016
Remarks	: This process sends alert about the last updated/Inserted RowCount For FactActivity Table
*/

IF (
SELECT COUNT(*)
FROM SSIS.Audit.Fact_DataAudit 
WHERE ETLExecution_id=@ETLExecutionId
		) > 0
BEGIN
	DECLARE @Profile NVARCHAR(MAX) = 'Sonic ETL Mail Profile' --@Profile 
		,@ToLine NVARCHAR(MAX) ='amrendra.kumar@
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
