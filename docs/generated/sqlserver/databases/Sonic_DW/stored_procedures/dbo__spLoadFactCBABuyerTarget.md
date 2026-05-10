---
name: spLoadFactCBABuyerTarget
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

/******************** CHANGE LOG **********************************************************
06/10/2020:  Derrick Davis - Create stored proc
01/29/2021:  Chaitra - updated stored proc for populating the Fact_DataAudit table
03/15/2021:  Chaitra - removed the AssociateKey checks in the Update logic
*******************************************************************************************/

CREATE   PROC [dbo].[spLoadFactCBABuyerTarget]
(
 @insertedRowCnts  INT OUTPUT,     --added on 01/
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
