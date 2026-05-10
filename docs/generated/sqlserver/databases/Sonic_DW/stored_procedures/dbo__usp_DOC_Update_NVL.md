---
name: usp_DOC_Update_NVL
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




CREATE PROCEDURE [dbo].[usp_DOC_Update_NVL]
@EntityID INT,
@NewUnitsIncCM varchar(50),
@NewUnitsPreSoldCM varchar(50),
@NewUnitsIncNM varchar(50),
@NewSalesVolumeNM varchar(50),
@UserLogin varchar(50)



As

DECLARE @DDTempUnits table(MetricID INT, MetricNum varchar(50))
DECLARE @DocID INT = (SELECT DocID FROM [dbo].[Doc_Record] WITH (NOLOCK) WHERE EntityKey = @EntityID AND DocDateKey = (SELECT CONVERT(varchar(10),getdate(),112)))


--Insert Amounts into Temp Table
INSER
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
