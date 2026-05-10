---
name: usp_UpdateOpsReviewItem
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

CREATE Procedure [dbo].[usp_UpdateOpsReviewItem]
--exec  usp_UpdateOpsReviewItem 24,  '89,91,86', 4, 'Doug.Morgan', 'Doug.Morgan', 1, 'Fix the Wifi', 'The GMs are screaming about it', '2014-12-11 09:45:48.077'

@OpsReviewItemID int,
--@EntityKey varchar(100),
@StatusID int,
@UserName varchar(30),
@Owner varchar(30),
@IsBusinessImpacting int,
@ActionItems varchar(2000),
@Comments varchar(2000),
@DateTimeCreated datetime

as

Declare @dealer varchar(20)
Declare @BeginPlace int
D
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
