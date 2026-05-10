---
name: usp_DOC_Update_Projection_RVP
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




CREATE PROCEDURE [dbo].[usp_DOC_Update_Projection_RVP]
@RVPID INT,
@NewUnits varchar(50),
@NewPVR varchar(50),
@UsedUnits varchar(50),
@UsedPVR varchar(50),
@FixedGross varchar(50),
@FIPVR varchar(50),
@TotalGross varchar(50),
@Profit varchar(50),
@UserLogin varchar(50)


As

DECLARE @DDTempUnits table(MetricID INT, MetricNum varchar(50))
DECLARE @DDTempAmount table(MetricID INT, MetricNum varchar(50))
DECLARE @RVPDocID INT = (SELECT RVPDocID FROM [dbo].[Doc_RVPRecord] W
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
