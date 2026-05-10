---
name: usp_DOC_Insert_ProjectionBKP10FEB2015
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




CREATE PROCEDURE [dbo].[usp_DOC_Insert_Projection]
@EntityID INT,
@UserLogin varchar(50)


As

DECLARE @DocIDOld INT = (SELECT MAX(DocID) FROM [dbo].[Doc_Record] WHERE EntityKey = @EntityID)
DECLARE @DocIDNew INT
DECLARE @RolloverDate INT = (SELECT DocRolloverDate FROM [dbo].[Dim_Date] WHERE DateKey = (SELECT CONVERT(char(8),getdate(),112)))
DECLARE @BudgetDate INT = (SELECT MonthStartDateKey FROM [dbo].[vw_Dim_date] WHERE DateKey = @RolloverDate)
DECLARE @DocDateOld INT = (SE
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
