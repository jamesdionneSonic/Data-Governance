---
name: DailySnapshot_transport_purchases
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


CREATE PROCEDURE [dbo].[DailySnapshot_transport_purchases]

AS

SET NOCOUNT ON

/* =========================================================================================
Author: Brittany Rogers
Create date: 5/2/2025
Description: take a daily snapshot of the transportation_purchases table

========================================================================================= */

BEGIN

TRUNCATE TABLE dbo.Historical_transport_purchases;

INSERT INTO dbo.Historical_transp
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
