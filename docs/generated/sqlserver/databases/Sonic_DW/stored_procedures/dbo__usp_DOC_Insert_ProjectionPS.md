---
name: usp_DOC_Insert_ProjectionPS
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


CREATE PROCEDURE [dbo].[usp_DOC_Insert_ProjectionPS]
@EntityID INT,
@UserLogin varchar(50),
@LoadDate INT
As

DECLARE @DocDateOld INT = (SELECT MAX(DocDateKey) FROM [dbo].[Doc_Record] WHERE EntityKey = @EntityID and DocDateKey <= @LoadDate)
DECLARE @DocIDOld INT = (SELECT MAX(DocID) FROM [dbo].[Doc_Record] WHERE EntityKey = @EntityID AND DocDateKey = @DocDateOld)
DECLARE @DocIDNew INT
DECLARE @RolloverDate INT = (SELECT DocRolloverDate FROM [dbo].[Dim_Date] WHERE DateKey = @LoadDate
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
