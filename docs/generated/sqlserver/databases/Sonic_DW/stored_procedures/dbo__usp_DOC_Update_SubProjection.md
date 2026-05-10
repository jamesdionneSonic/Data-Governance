---
name: usp_DOC_Update_SubProjection
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





CREATE PROCEDURE [dbo].[usp_DOC_Update_SubProjection]
@EntityID INT,
@NewUnits varchar(50),
@NewPVR varchar(50),
@NFB varchar(50),
@NFBPVR varchar(50),
@UserLogin varchar(50)



As

DECLARE @DDTempUnits table(MetricID INT, MetricNum varchar(50))
DECLARE @DDTempAmount table(MetricID INT, MetricNum varchar(50))
DECLARE @DocID INT = (SELECT DocID FROM [dbo].[Doc_Record] WITH (NOLOCK) WHERE EntityKey = (SELECT EntityKey FROM dbo.Dim_Entity WHERE 
		(EntDealerLvl2 =	(SELECT  
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
