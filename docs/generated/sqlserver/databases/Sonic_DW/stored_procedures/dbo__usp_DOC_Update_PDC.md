---
name: usp_DOC_Update_PDC
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






CREATE PROCEDURE [dbo].[usp_DOC_Update_PDC]
@EntityID INT,
@NewPack varchar(50),
@UsedPack varchar(50),
@DeliveryPackNew varchar(50),
@DeliveryPackUsed varchar(50),
@TotalFactoryBonus varchar(50),
@PermaPlatePack varchar(50),
@UserLogin varchar(50)



As

DECLARE @DDTempAmount table(MetricID INT, MetricNum varchar(50))
DECLARE @DocID INT = (SELECT DocID FROM [dbo].[Doc_Record] WITH (NOLOCK) WHERE EntityKey = @EntityID AND DocDateKey = (SELECT CONVERT(varchar(10),getdat
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
