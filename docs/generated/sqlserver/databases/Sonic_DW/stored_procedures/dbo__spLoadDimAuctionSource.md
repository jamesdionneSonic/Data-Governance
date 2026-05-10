---
name: spLoadDimAuctionSource
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
05/12/2020:  Derrick Davis - Create stored proc for type 2 insert/update
01/29/2021:  Chaitra - updated stored proc for populating the Fact_DataAudit table
03/15/2021:  Chaitra - removed the AssociateKey check in the update logic                     
*******************************************************************************************/

CREATE    PROC [dbo].[spLoadDimAuctionSource]
(
 @u
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
