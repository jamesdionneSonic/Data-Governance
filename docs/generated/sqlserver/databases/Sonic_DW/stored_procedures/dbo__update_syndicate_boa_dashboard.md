---
name: update_syndicate_boa_dashboard
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
 
 
CREATE PROC [dbo].[update_syndicate_boa_dashboard] (@funding int, @payoff int, @userid VARCHAR(30))
AS
 
IF EXISTS (SELECT * FROM Syndicate_BoA_Dashboard WHERE DashboardDate = CONVERT(date,GETDATE()))
 
UPDATE Syndicate_BoA_Dashboard
SET Funding = @funding, Payoff = @payoff, userID2 = @userid
WHERE DashboardDate = CONVERT(date,GETDATE())
 
ELSE
 
INSERT INTO Syndicate_BoA_Dashboard (DashboardDate, Payoff, Funding, Meta_LoadDate,userID)
VALUES 
(CONVERT(date,GETDATE()), @payoff, @funding,GETD
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
